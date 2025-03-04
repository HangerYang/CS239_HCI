**Core Assignment \#3**

**\[+0.5\] Update your problem statement. **

**Updated based on the feedback: **

Heritage Speakers: 

Heritage speakers are familiar with speaking and listening modalities
due to their exposure to family and friends, but often lack proficiency
in writing and reading. For example, some character-based languages (Ex:
Chinese and Japanese) involve characters that are complicated and hard
to recognize, which contributes to their lower reading and writing
proficiency compared to speaking and listening. Outside of home or their
circle of friends, they often lose practice with their heritage language
and so may forget over time. 

Non Heritage Speakers:

Non-Heritage speakers typically lack opportunities to practice or engage
with the language they are learning, and some of the resources, like
formal textbooks or Duolingo, may not be immediately useful in areas
like casual conversation. Without opportunities, consistency may
decrease due to perceptions like lack of time commitment. They may also
feel self-conscious about their proficiency in the language, which
limits them from seeking out opportunities. But if the non heritage
speakers get more opportunities to practice and receive positive
feedback, they will raise their self-consciousness and confidence and
try to seek more opportunities to practice. 

**\[+1\] Create a paper prototype. Take + upload pictures or a video of
your paper prototype.**

We took videos of both our prototype and Figma Prototype. The links are
on our google drive:

Paper Prototype:

[[https://drive.google.com/file/d/1vHJmu7qpJyMy5IiqQE_Va4USj9b-n_n1/view?usp=sharing]{.underline}](https://drive.google.com/file/d/1vHJmu7qpJyMy5IiqQE_Va4USj9b-n_n1/view?usp=sharing)

Figma Prototype: 

[[https://drive.google.com/file/d/1SU9D83gR_JTnOH9mTFqRyhh_YiDBsTOE/view?usp=drive_link]{.underline}](https://drive.google.com/file/d/1SU9D83gR_JTnOH9mTFqRyhh_YiDBsTOE/view?usp=drive_link)

** \[+0.5\] Summarize 1-3 takeaways from the feedback you received in
class. **

After feedback, we have a few takeaways we plan to implement in our
design

Takeaway 1: Since different users will have different levels of
proficiency in a given language, giving them the option to input the
level of the conversation would be useful.

Takeaway 2: We also noticed that some users may have trouble starting
the conversation. Guiding them with suggestions of conversation starters
can help ease them in.

Takeaway 3: For roleplaying scenarios, a simple chat box will work, but
could be improved upon. Including visual aids like a menu and waiter for
an 'ordering food' scenario can make the scene more immersive (and also
give important details like what you can order).

** \[+1\] Articulate your design goals as you start to implement a
high-fidelity prototype of your interactive system.**

1.  **(required) Design goal 1 - Friendly Exposure**

**- What is the goal?:**

Our goal is to create a friendly language practice companion to give
language learners more exposure to the language they are learning in a
less daunting and interactive environment. 

**- Why is it important? How evidence (from your user research or
related work) convinces you of its importance? Include any quotes,
citations, etc. that help make your point:**

From our survey, 41% of our survey respondents who would like to learn
another language commented that they lack practice partners or
consistent exposure to the language use. From our interviews, many
people expressed that it is not very fun and sometimes daunting to talk
to real people, especially when their language skills are less
sufficient. This makes us believe that to create something
non-judgmental is essential to people's language learning process. 

**- How will you design for this goal? What implementation choice will
you make?:**

- Help button to suggests how to start/continue the conversation

- Words of encouragement during the conversation 

- The Chatbot will have a better understanding of broken language, such
  that the conversation can flow naturally even when the users' grammars
  may be problematic. 

1.  **(required) Design goal 2 - Academic**

**- What is the goal?: **

In addition to our above design goal, we also want to provide language
learners additional tools and resources to review and learn language
through past exposures, expediting the language learning process.

**- Why is it important? How evidence (from your user research or
related work) convinces you of its importance? Include any quotes,
citations, etc. that help make your point:**

From our user research, various users have mentioned learning languages
through courses, textbooks, and classes, with mixed results. Several
cited the organized structure of the courses and textbooks, short-term
memorization of vocabulary with flashcards, and ability to quickly look
up and review with textbooks as positive. However, others were critical
of these resources for long-term retention or lack of 'authentic' use
from these methods. We want to integrate some of these resources into
our project to provide users the advantages while addressing its
disadvantages. We feel doing this will give us the best of both worlds
between conversational/authentic use and organized learning which will
better help users. 

**- How will you design for this goal? What implementation choice will
you make?:**

Our design is to connect conversations made with our LLM to
flashcard/textbook review. Whenever a user ends a conversation, we can
store individual chat histories into individual conversation profiles.
From there, the user can look over the conversation, highlight and look
up words to learn correct vocabulary, pronunciation, or syntax, and also
create flashcards from them. This way, we have a direct connection
between structured language learning and the more natural conversation
learning with the LLMs, which should help users in the language more
than if they use these strategies separately.

** \[+1\] Provide a plan for implementation. Create a timeline.
Suggestion: Work backwards from the March 4 pilot deadline. **

We have the following plan for our components, with prospective
timelines:

For the LLM implementation, we plan on using closed-source models. The
models we use include a speech language model for audio transcription, a
general purpose language for prompt answers, and another model that
translates text to audio (to give the chatbot audio as well as text
output). We plan to test and set up these components by Feb. 24, and by
Feb. 28, connect it with the API.

Webpage Development: API for backend model. Use Firebase for website
development and create all the interfaces by Feb 28, and test all the
features during March 1-3. 

Graphics: Icons (Draw or stuff online), finish this by Feb 23 so that we
can add all the necessary icons to the webpage. 

** What did each member contribute to this phase of the project?**

For this core assignment, the contributions are shown below:

Daniel: Sketch creation/walk through, Design discussion, project plan
discussion, app development skeleton

Hanger: Design Goal 1, Design Goal 2 Discussion, Figma Prototype,
Prototype Recording, Takeaway Section Discussion, Timeline Discussion

Hubert: Figma Prototyping, Problem Statement Discussion, Wrote Takeaway
section, Timeline/Project Plan, Design Goal 2

Kaiwen: Creating prototype, problem statement revision, timeline
discussion, and video1 facilitator. 

We also plan on having the following members contribute on the project
components: 

Website Development and Graphics: Daniel and Kaiwen

LLMs: Hanger and Hubert

**Did you use a generative AI tool? If so, which and how?**

No generative AI was used for this assignment. 

**How much time did you spend on this assignment**

**- as a group?**

Together as a group, we spent around 2 hours working on the core
assignment after the Figma design studio on Friday (and 2 hours
learning/working on the Figmas).

**- individually?**

Some of us worked on the paper prototypes used in the recording, which
took around 1 hour.
