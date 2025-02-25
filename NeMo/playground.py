import os
import json
from transformers import AutoTokenizer, pipeline
import torch
from pdb import set_trace as breakpoint

model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="/home/hyang/CS239/.cache")
llm = pipeline(
    "text-generation",
    model=model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)

DEFAULT_SCENARIOS = {
    "restaurant": {"desc": "You are in a restaurant ordering food.", "role": "a waiter"},
    "job_interview": {"desc": "You are in a job interview for a software engineering position.", "role": "an interviewer"},
    "travel": {"desc": "You are at an airport checking in for a flight.", "role": "a check-in agent"}
}


PROFILE_DIR = "user_profiles"
os.makedirs(PROFILE_DIR, exist_ok=True)


def load_user_profile(username):
    profile_path = os.path.join(PROFILE_DIR, f"{username}.json")
    if os.path.exists(profile_path):
        with open(profile_path, "r") as file:
            user_profile = json.load(file)
    else:
        user_profile = {"username": username, "scenario": None, "chat_history": []}

    if "ai_role" not in user_profile:
        user_profile["ai_role"] = None

    return user_profile



def save_user_profile(user_profile):
    profile_path = os.path.join(PROFILE_DIR, f"{user_profile['username']}.json")
    with open(profile_path, "w") as file:
        json.dump(user_profile, file, indent=4)


def format_prompt(user_profile, user_input):
    scenario_description = user_profile["scenario"]
    chat_history = user_profile["chat_history"]

    prompt = f"[Scenario]: {scenario_description}\n\n"
    for entry in chat_history[-5:]:
        prompt += f"### Human: {entry['user']}\n### Assistant: {entry['ai']}\n"
    
    prompt += f"### Human: {user_input}\n### Assistant:"
    return prompt


def infer_ai_role(scenario_description):
    prompt = f"Based on the following scenario, what role should the AI play?\n\nScenario: {scenario_description}\n\nAI Role:"
    
    response = llm(
        prompt,
        do_sample=False, 
        max_new_tokens=10,
    )[0]['generated_text'].split("AI Role:")[-1].strip()

    return response if response else "assistant" 

def talk_agent(username):
    user_profile = load_user_profile(username)

    # Select or set a scenario
    if not user_profile["scenario"]:
        print("Choose a scenario:")
        for key in DEFAULT_SCENARIOS:
            print(f"- {key}: {DEFAULT_SCENARIOS[key]['desc']}")
        scenario_key = input("Enter scenario name (or type 'custom' to create your own): ").strip().lower()

        if scenario_key in DEFAULT_SCENARIOS:
            user_profile["scenario"] = DEFAULT_SCENARIOS[scenario_key]["desc"]
        else:
            user_profile["scenario"] = input("Describe your custom scenario: ")

        user_profile["ai_role"] = infer_ai_role(user_profile["scenario"])
        save_user_profile(user_profile)
        # print(f"Scenario set: {user_profile['scenario']}")
        # print(f"AI will play: {user_profile['ai_role']}")

    else:  # Existing user, infer role if missing
        if not user_profile.get("ai_role"):
            user_profile["ai_role"] = infer_ai_role(user_profile["scenario"])
            save_user_profile(user_profile)

    formatted_prompt = f"[Scenario]: {user_profile['scenario']}\n\n"
    formatted_prompt += f"### Assistant ({user_profile['ai_role']}):"

    response = llm(
        formatted_prompt,
        do_sample=True,
        top_k=50,
        top_p=0.7,
        num_return_sequences=1,
        repetition_penalty=1.1,
        max_new_tokens=100,
    )[0]['generated_text'].split("### Assistant:")[-1].strip()

    # print(f"AI ({user_profile['ai_role']}): {response}")

    user_profile["chat_history"].append({"user": "AI INITIATED", "ai": response})
    save_user_profile(user_profile)

    print("\nChat started! Type 'return' to pause.\n")

    while True:
        user_input = input("You: ")
        
        if user_input.lower() == "return":
            print("Chat paused. You can resume later.")
            save_user_profile(user_profile)
            break

        formatted_prompt = f"[Scenario]: {user_profile['scenario']}\n\n"
        formatted_prompt += f"### Assistant ({user_profile['ai_role']}): (Start the conversation in character.)"

        response = llm(
            formatted_prompt,
            do_sample=True,
            top_k=50,
            top_p=0.7,
            num_return_sequences=1,
            repetition_penalty=1.1,
            max_new_tokens=100,
        )[0]['generated_text'].split("### Assistant:")[-1].strip()
        # breakpoint()
        print(f"{user_profile['ai_role']}: {response}")

        user_profile["chat_history"].append({"user": user_input, "ai": response})
        save_user_profile(user_profile)




def main():
    username = input("Enter your username: ").strip()
    talk_agent(username)


if __name__ == "__main__":
    main()
