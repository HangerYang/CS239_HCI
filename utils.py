import re
import emoji
import os
import json
from pdb import set_trace as breakpoint
from gtts import gTTS
from prompts import PROFILE_DIR, DEFAULT_SCENARIOS, SOUND_RESPONSE_DIR

def clean_text(text):
    text = re.sub(r'\*.*?\*', '', text)
    text = emoji.replace_emoji(text, replace='')
    text = ' '.join(text.split())
    return text

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


def infer_ai_role(scenario_description, llm): # returns suggestions
    prompt = f"Based on the following scenario, what role should the AI play?\n\nScenario: {scenario_description}\n\nAI Role:"
    print(prompt)
    response = llm(
        prompt,
        do_sample=False, 
        max_new_tokens=10,
    )[0]['generated_text'].split("AI Role:")[-1].strip()
    #print("AI ROLE RESPONSE")
    #print(response)
    return response if response else "assistant" 

def talk_agent(username, llm, language="en"):
    user_profile = load_user_profile(username)

    # Select or set a scenario
    if not user_profile["scenario"]:
        print("Choose a scenario:")
        for key in DEFAULT_SCENARIOS:
            print(f"- {key}: {DEFAULT_SCENARIOS[key]['desc']}")
        scenario_key = input("Enter scenario name (or type 'custom' to create your own): ").strip().lower()

        if scenario_key in DEFAULT_SCENARIOS:
            user_profile["scenario"] = DEFAULT_SCENARIOS[scenario_key]["desc"]
            user_profile["ai_role"] = DEFAULT_SCENARIOS[scenario_key]["role"] #Set up role
        else:
            user_profile["scenario"] = input("Describe your custom scenario: ")
            user_profile["ai_role"] = infer_ai_role(user_profile["scenario"], llm)
        save_user_profile(user_profile)
        # print(f"Scenario set: {user_profile['scenario']}")
        # print(f"AI will play: {user_profile['ai_role']}")

    else:  # Existing user, infer role if missing
        print("EXISTING USER")
        if not user_profile.get("ai_role"):
            print("CREATING AI ROLE")
            user_profile["ai_role"] = infer_ai_role(user_profile["scenario"], llm)
            save_user_profile(user_profile)

    formatted_prompt = f"""
    <s>[INST] <<SYS>>
    You are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}
    Start the conversation with you roleplaying as the assistant role. You must be friendly to the user.
    Your answer must NOT contain any text other than the response. Do NOT copy the prompt into your response.
    <</SYS>>
    [/INST]"""
    #The above formatting doesn't really do anything...
    print("\nChat started! Type 'return' to pause.\n")
    origin_response = llm(
        formatted_prompt,
        do_sample=True,
        top_k=50,
        top_p=0.7,
        num_return_sequences=1,
        repetition_penalty=1.1,
        max_new_tokens=100,
    )[0]['generated_text']
    num = 0
    response = origin_response.split('[/INST]')[-1].strip() #Generate Response
    voiced_response = clean_text(response)
    return_voice = gTTS(text=voiced_response, lang=language, slow=False)
    return_voice.save(f"new_response-{num}.mp3")
    print(f"CHATTY:{response}")
    #print(f"{user_profile['ai_role']}: {response}")
    # print(f"AI ({user_profile['ai_role']}): {response}")
    formatted_history = "You: " + response + '\n'
    user_profile["chat_history"].append({"user": "AI INITIATED", "ai": response})
    save_user_profile(user_profile) #Save Response
    while True:
        user_input = input("You: ")
        
        if user_input.lower() == "return":
            print("Chat paused. You can resume later.")
            save_user_profile(user_profile)
            break
        if user_input.lower() == "suggest line":
            formatted_prompt = f"""
            <s>[INST] <<SYS>>
            You are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}
            The chat history is as followed: {formatted_history}
            The user is in an ongoing conversation and needs help continuing it naturally.
            Given the last ai response, generate three possible ways the user could reply next.
            Each response should be a complete sentence that the user might actually say** in the conversation.
            Do NOT provide conversation suggestions—only full user replies. Format the responses as a numbered list, with each on a separate line. Post your response here:"
            <</SYS>>
            [/INST]"""
            # formatted_prompt = f"[Scenario]: {user_profile['scenario']}\n\n"
            # formatted_prompt += f"### Assistant ({user_profile['ai_role']})\n"
            # formatted_prompt += f"Give three suggestions to how the user can respond to the following line for the above scenario: {response}\n"
            # formatted_prompt += "Provide your suggestions in the form of a numbered list with each entry in a separate line. Do NOT include any other text."
            # formatted_prompt += "Post your response here:"

        else:
            formatted_history += "User: " + user_input + '\n'
            formatted_prompt = f"""
            <s>[INST] <<SYS>>
            You are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}
            Continue the conversation with you roleplaying as the assistant role. Only provide your own response. You must be friendly to the user.
            The chat history is as followed: {formatted_history}
            <</SYS>>
            [/INST]"""
        response = llm(
            formatted_prompt,
            do_sample=True,
            top_k=50,
            top_p=0.7,
            num_return_sequences=1,
            repetition_penalty=1.1,
            max_new_tokens=100,
            )[0]['generated_text'].split('[/INST]')[-1].strip()
        # breakpoint()
        if response == "":
            print("Whoops! CHATTY is being lazy here. Can you repeat your response?")
            voiced_response = "Whoops! CHATTY is being lazy here. Can you repeat your response?"
        elif user_input.lower() == "suggest line":
            print(f"Suggested Lines:\n{response}")
        else:
            print(f"CHATTY:{response}")
            voiced_response = clean_text(response)
            user_profile["chat_history"].append({"user": user_input, "ai": response})
            save_user_profile(user_profile)
            formatted_history += "You: " + response + '\n'
        return_voice = gTTS(text=voiced_response, lang=language, slow=False)
        return_voice.save(f"{SOUND_RESPONSE_DIR}/new_response-{num}.mp3")
        num += 1