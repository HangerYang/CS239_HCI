### \# Core assignment: Pilot + Evaluation Prep \[+4.5\] Group {#core-assignment-pilot-evaluation-prep-4.5-group}

**Phase**: Evaluation

**Due date**: Friday, March 7 at 11:59pm PT

**The goal** of this stage of the project is to evaluate your
high-fidelity prototype with potential users.

**Course learning objectives** this assignment facilitates: (1) Create
an interactive system grounded in user research, iterative prototyping,
and evaluation; (2) Explore and express complex problems, design
choices; and (3) Reflect on what you know, don't know, and how to learn
what you don't know.

**Grading**: This is a group assignment. All members of the group are
expected to participate fully. Each group will receive one grade. /
Every member will receive the same number of points.

**What to submit**: Add a .MD file in your Github repo with the
responses to the following questions. **Submit the github repo link to
BruinLearn. Only one person needs to submit for the group.**

#### Pilot \[+1\]

1.  **\[+0.5\] Present the pilot user with a brief statement of the scenario and task. Ask the pilot user to complete the task. Note: You might feel (very) nervous that something will break. That is OK. It\'s ok for the pilot user to break things as they test out your system. Be prepared to restart/recover your system when things break. Note what happened step by step. Include 0.5-1p of notes on one pilot user. Additionally, summarize in a few sentences: What happened? Why? What changes do you need to make to your system before the next pilot?**

Pilot user: Yuxin Liu
Yuxin is also majoring in computer science. With her consent, we recorded her actions and included her name in this assignment while ensuring her privacy. During the pilot session, she tested key features, including signing up for an account, selecting a language, starting a conversation, interacting with the AI agent, saving conversations, exploring different scenarios, and reviewing past lessons on the profile page.
Yuxin started from the landing page, signed up for an account, then was directed back to the main page to choose the language she wanted to practice, she chose Japanese. She then proceeded to the conversation page and started chatting with our AI agent. During the chat, everything went very well. Chatting with the robot based on the provided suggestions is helpful, especially when the user is a beginner. However, she found some AI-generated suggestions unnatural and difficult to understand at times, as the AI did not recognize her proficiency level. Over time she felt she became more reliant on the provided suggestions while practicing, she started to only rely on the generated suggestions and not really talking to the AI independently. She suggested we add a button to hide the suggestions. As for our AI talk agent, she gave the feedback that the agent was very friendly, and the playing audio function is awesome. But voice input was non-functional due to incomplete implementation. 
Then she went to the scenario roleplay page to practice. She gave the feedback that the practicing scenario session is well designed since the generated topics and conversations are focused on the given scenario and can provide some useful information as well as tips for the user. 
Saving the conversation and displaying the past conversations did not work well and crashed down for once since all the past conversations are saved locally, so it was hard to load. This function does not work well. We also need to change the function and provide the lesson summary for the users in the profile page to help them review the lessons. 
Besides that, we also received positive feedback for the UI design because it is very neat and straight forward, and the robot typing effect makes her feel it is a real conversation with the robot and feeling less stressed. 
Overall, the pilot session highlighted both strengths and areas for improvement, helping refine the platform for a better user experience.


2.  **\[+0.5\] Involve another pilot user outside of the course. Include 0.5-1p of notes on this second pilot user. Summarize in a few sentences: What happened? Why? What changes do you need to make to your system before the next pilot?**

Pilot user: Zoie You
After the first pilot user session, we changed the functionality of saving and displaying the past conversation, now the user can review their past conversations in the user profile, ideally, we will also add the lesson and critique session to the page for the user to review more information. 
Next, we conducted a pilot user session with Zoie. With her consent, we recorded her actions and included her name in this assignment while ensuring her privacy. Unlike the first session, we did not assign her specific tasks. Instead, we observed her natural interaction with the website to identify any user experience issues.
She first start by using the system as a guest, and then also went straight up to the conversation page and start to chatting with the robot, she chose the English to practice and then she tried to save the conversation but that function is only limited for the logged in user, so she went back to the sign up page and created an account. Then she provided the feedback that we need to add more language options for users to choose. She then went to the scenario conversation page and started an order food conversation. She also tried saving the conversation function but when she went back to the profile page, the other users’ conversations were also there. We need to fix this bug. After that she also tried creating a new scenario topic and starting the conversation, everything went very well and our robot agents are friendly and can really provide helpful suggestions. 
Overall, she felt that the website was well-organized and easy to use, but suggested adding
more functions and details in the website such as allowing the user to change the languages via the navigation bar, for the scenario, we can make it more interactive to add more fun to the pages. 
Before our next pilot user session and demo day, we need to finish the voice input function and add the dictionary function to the conversation page, as well fix the minor issues on the website and add the lesson and critique page. These improvements will make our website more user-friendly and fully functional for language learners.


#### Before conducting an evaluation \[+3\]

**1. \[+0.5\] Articulate1-2 questions motivating the evaluation. In
other words, what are the 1-2 things you want to prioritize learning
through the evaluation?**

Here are a few things we want to learn through evaluations:

1.  How well can the model hold a conversation with the user/ How easy is it for the user to start practicing?

2.  Does our program motivate users more to continue learning their language?

**2. \[+0.5\] What metrics will you use to answer the above research
questions? Why are these metrics appropriate? What are the benefits and
drawbacks of using these metrics?**

- **Requirements: You are required to conduct a mixed-methods study where you collect qualitative and quantitative data. In your response to this question, describe what kind of data (e.g., open-ended survey, interview, time, clicks, etc.) will be useful for answering your motivating questions.**

Quantitatively, we plan to collect data similar to our surveys, with
checkboxes of scales ranging from 1-5 on different measures, such as how
helpful the user thinks our program is/how likely the user will continue
using the app for language learning. Using this method, we feel that it
will give us an easily analyzable metric of how our well our system
works (instead of discerning a user's overall opinions from their
descriptive feedback), though it also means we likely won't be getting
precise feedback on what areas we can most improve on.

Qualitatively, we also plan to be observing the users when they utilize
our systems, in a sort of think-aloud study, letting us know their
thought process as they use it and giving us direct feedback on certain
parts whenever they encounter it, especially on their thoughts towards
conversing with the system. We also plan to conduct an end-of-session
interview for overall thoughts for areas of improvement. Qualitative
data might make it difficult for us to determine when we've 'succeeded'
in reaching our overall design goals, and give us guidance on future
steps to work on.

Overall, our quantitative and qualitative metrics here should give us a
good balance of simple-to-understand measures for our success while
providing specific information for what we can most improve on.

**3. \[+1\] Specify a plan for recruiting participants.**

- **How will you contact participants (e.g., mailing lists, in-person, etc)?**

- **What are your inclusion/exclusion criteria for participants?**

- **Will you include participants you interviewed for user research? Why or why not?**

- **Where will you perform the evaluation?**

- **What data will you collect from participants? How will you inform them of this and obtain informed consent?**

Our current plan for recruiting participants is to reach out to
interviewees and surveyees from before, asking if they would be willing
to conduct a short evaluation study on our current toolkit. Considering
that we already have information for and utilized the thoughts of
surveyees and interviewees' on language learning for our system
development, it would be a good idea to get their feedback to determine
whether we've addressed the issues that we concluded about language
learning. Should we need more participants, we also plan to reach out
through mailing lists/language clubs on the UCLA campus.

Inclusion criteria includes people who have had experience learning a
second language or people who are interested in learning a second
language and have some experience with the language. Exclusion criteria
will include those who are learning languages that our system does not
support yet.

Evaluations will be performed similar to the form of a one-on-one
interview, with an observer who is taking notes and may guide the user
on the system's tools if needed. Users will go through the various
features (conversation practice, scenario roleplay, language review,
etc.), voicing their thoughts in a think-aloud study (which the observer
will take notes on). Afterwards, we will conduct a short survey,
consisting of both quantitative check-the-box questions and an option
for short-answer discussion, with questions focused on their opinions on
the system's conversation abilities, helpfulness for language learning,
and option to discuss what they particularly liked and and what they
felt could be improved upon.

When contacting the participants, we will make clear the type of data we
will be collecting, which includes a brief description of their language
learning history (what they learned, how they learned, their
proficiency, and when they started/stopped) and their articulated
thoughts in the think-aloud study and their responses in the
after-session portion. During the study, we will also inform them of the
options of audio, visual, or no recording during the usage and
after-study sessions, abiding by their preference.

**4. \[+1\] Write out a step-by-step protocol for conducting each user
evaluation. Getting on the same page is important for more easily
conducting studies and analyzing data across participants. Your protocol
should include: (1) a script of what you will say to each participant;
(2) what behaviors/responses you expect from participants and how that
may change the flow of the study, if at all; and (3) how you will
transition between phases of the study (e.g., from a task to an
interview).**

Our step by step protocol is listed below, written as a script.
Evaluation sessions will be performed either in person or through Zoom,
with at least one interviewer (who will act as an observer and
notetaker) and the interviewee. While we don't really expect any
behaviors or responses to change the major flow of the study, we are
looking to acknowledge certain behaviors that can lead to unintended
responses or outcomes of our system (listed in the user session)

**Informed Consent and Introduction**:

Hi there. Thanks for taking the time to participate in our user
evaluation portion of our project! Before we begin we want to let you
know that we will be taking notes on your thoughts and feedback as part
of our evaluation procedure. With your permission, we would also like to
have an audio or visual recording of this session for research purposes.
You have the option to refuse or stop recordings at any time, and these
notes and recordings will not be distributed outside of this project.
You are also free at any time and for any reason to stop this session.

Our evaluations session will consist of two parts: a hands-on session
where you will be using our language learning system and conveying your
thoughts as you use it, and an after-use session where you will fill out
a short survey and answer a few questions based on your user experience.
We expect the user session to take around 15 minutes and the after-use
session to take around 10-15 minutes.

With the description of our session out of the way, do we have your
consent to continue the evaluation?

**Transition to User Session:**

Right now, we'll be moving on to the user session part! To quickly
summarize, our system is a foreign-language chatbot that will help
facilitate language learning through conversations. There are various
features, including standard conversation, scenario roleplay for
situations like ordering at a restaurant or travel, and speech-to-text
transcription and text-to-audio features. We'd like for you to say aloud
any feedback you have while using our system. If you have any questions
or issues, you can also let us know, and we will be happy to assist.

**User Session:**

Notes: In this portion, the main goal will be to observe the user work
through the system while taking notes. Observer should not try to
directly guide the user unless directly asked or if the user is
struggling for a while. We might also expect some of the following
behaviors:

Users speaking/typing a language other than the one being learned: Since
this might confuse the machine, we might want to acknowledge language
detection as something to be worked on and encourage the user to
continue speaking/typing in the learning language.

Going off topic in scenario roleplay: We initially planned for the LLM
to encourage going back on-topic if the user goes off-topic, which
seemed to work in the in-class pilot session. If it doesn't work
however, we'll gently acknowledge this and encourage the user to go back
on topic.

Trouble with audio transcription: There will likely be issues with audio
transcription, since being able to parse punctuation is something we
found LLMs have difficulty with. If they use the audio transcription, we
may want to bring this up and note to them the ability to edit their
transcribed text in the text box.

General confusion/assistance needed: If at some point there seems to be
a prolonged period of time where the user is confused, we could ask the
user how things are going/if there are any other features they would
like to see, to help move things along.

**Transition to Feedback Session**:

Next, we'll move on to the second half of our evaluation session: the
feedback portion. Here, we'll ask you a few questions on your experience
that you had with our system:

1.  On a scale of 1 to 5, with 1 being lowest and 5 being highest, how would you rate your conversation and roleplay experiences, in terms of things like naturalness and quality?

2.  On a scale of 1 to 5 (1 = lowest, 5 = highest), how helpful do you think this tool would be for your own language learning journey?

3.  For the previous two questions, is there anything you would like to elaborate on?

4.  Do you wish to provide any other sort of feedback, both in terms of what went well and what should be improved on? Please elaborate if yes.

5.  Any other questions? 

**Conclusion:**

And this concludes our evaluation session. Thank you for your time! Your
responses are a great help to us in further developing our project!

#### For fun \[+0.5\] {#for-fun-0.5}

1.  **\[+0.5\] Name your system!**

We've decided to name our system Chatty McChatFace.

2.  **\[+0.5\] DEPTH: Design a logo for your system. Include a PNG in
    > your repo. Add it to the README.**

We've added the logo for our system as a png file. It's also here!

![Logo](/logo.png)

**Did you use a generative AI tool for this assignment? If so, which
tool(s) and how?**

No generative AI tools were used for this assignment

**How much time did you spend on this assignment**

**- as a group?**

**- individually?**

We met for 4 hours on Friday as a group to work on the assignment, and
individually worked on the project application between 10 - 20 hours
throughout the week.
