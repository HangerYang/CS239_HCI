### \# Core assignment: Evaluation \[+10\] Group

**Phase**: Evaluation

**Due date**: Friday, March 14 at 11:59pm PT

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

#### Conducting user evaluation \[+5\]

Your goal is to assess the usability of your system.

1.  **\[+5\] Evaluate your system with at least 10 participants. Write and submit 0.5-1p of notes for each participant.**

We've placed our evaluations for each participant in an additional
titled evaluations within our github.

2.  \[+1\] DEPTH: Evaluate with 5 more participants. Feel free to make changes to your system between the first and second round of evaluation. If you do make changes, summarize the changes you made and why.

#### After your evaluation \[+4\]

1.  **\[+4\] Analyze your data and write up your key findings. The findings should be about 0.5-1p for each motivating question and any other interesting findings.**

-   **For any qualitative data where you cannot easily remember the details of the results, a thematic analysis is required. When you conduct a thematic analysis, include your codebook.**

-   **For any quantitative data, submit a script for analysis + your data. Recommendation: Create a notebook for your analysis. Someone should be able to run your notebook to reproduce your results.**

Motivating Questions:\
Here are a few things we want to learn through evaluations:

1.  How well can the model hold a conversation with the user/ How easy is it for the user to start practicing?

2.  Does our program motivate users more to continue learning their language?

####  

#### How well can the model hold a conversation with the user/ How easy is it for the user to start practicing?

1.  Our language model can hold conversations with most users, but it still struggles for longer conversations

    a.  When conversations are longer than 5-10 responses, they become
        > kind of repetitive and it's hard to drive the conversation to
        > a new topic

    b.  Users become distracted and try to break the system through
        > disruptive prompts because they are bored of the repetitive AI
        > responses

    c.  Users also noted that the AI responses were somewhat long,
        > stating that they didn't feel 'natural' or entirely like a
        > casual conversation.

2.  Beginners feel more difficulty with our system due to longer responses that sometimes come with the model

    a.  The dictionary does not support direct translation of longer sentences, and so beginners feel more frustration when trying to piece together longer responses from the model due to their lack of knowledge

    b.  Dictionary responses also were sometimes too technical, for example when a user tried to put in "chicken," it gave a species name

3.  Many people struggled with navigating the scenario practice, and they requested more information on how to best use the feature

    a.  For scenario roleplay, some of our users mentioned wanting more description or context to help them along with the conversation. One example cited is that in the restaurant scenario, the user felt like having a picture of a menu or description of the restaurant itself would give them a better idea of what they can order, rather than asking the AI about recommendations/what they can order.

4.  When users try to come back to a different session, it feels like talking to a new "person" since the LLM does not retain much memory, and thus it affects the rapport with the LLM.

5.  The UI was easy to navigate and it was clear what the conversation practice was trying to achieve

Does our program motivate users more to continue learning their
language?

1.  We noticed that the fluency of the users affected the experience

    a.  Beginners felt the tool was less helpful

2.  Most of the points taken off was due to the quality of the conversational practice

    a.  All users felt that the conversations felt "textbooky," where either the conversational pace was too winded, or the bot was unable to adapt to changes in conversational topics

    b.  We note that providing a better conversational experience may help motivate users more to continue learning, but for now the conversational still falls short in that regard

3.  The dictionary feature was one of the most popular features, providing easy access to learning vocabulary provided a positive learning experience for users

    a.  Users appreciated that they could immediately look up words they don't know, and so the conversational practice was smoother when there are gaps in knowledge

4.  Users also appreciated the lesson feature of our system, though they mention several ways to improve this

    a.  Some users wanted more immediate feedback whenever they made mistakes in spelling or grammar. They felt like this reactive feedback would keep those suggestions more fresh in their minds and help them improve as they practiced, rather than needing to wait for the end of the conversation and going to the lessons page to review everything at once.

    b.  Other users also noted that having lessons or suggestions focused on audio/speaking would also be of use. As of right now, our audio features are implemented by transcribing sound to text. Having AI be able to judge speaking performance directly was something users wanted to help improve their speaking proficiency, especially in aspects like pronunciation.

#### Group Reflection \[+1\]

1.  **What is one thing that went well in your evaluation?**

> Some things that went well during our evaluation were the usage of the
> suggestions and dictionary features. Many of our users liked their
> inclusion. Other aspects that went well were the AI's handling of
> misspellings or incorrect grammar: even when users intentionally
> misspelled words or spoke/inputted text in languages different from
> the one being set, the AI was still able to respond with its set
> language.

2.  **What is one thing that you wish you could have done differently?**

> We believe the chatting experience could be improved by focusing more
> on the conversational aspect. One common critique is that AI responses
> can be too long-winded at times, making the conversation feel
> unnatural. Another suggestion is to enhance the chat suggestion box,
> giving users more freedom to express their thoughts, such as providing
> an input box where users can type their ideas, with the suggestion box
> offering feedback and natural ways to phrase their thoughts. However,
> several challenges remain: beginners often struggle with long
> sentences, conversations can feel stiff due to the AI repeating the
> same phrases, and users frequently don't know what to do in many
> scenarios. To address these issues, improvements could include
> creating more engaging scenarios, offering structured lessons,
> allowing users to click suggestions for quick responses, adding
> language support like Japanese to Romaji or Chinese to Pinyin
> conversion, enabling audio autoplay for smoother listening practice,
> and letting users click the sound button multiple times without
> interruption.

3.  **How, if at all, did your participants represent the personas you intended to design for?**

> Our participants came from multiple different backgrounds, and we made
> sure to include both heritage and non heritage speakers to fully
> encapsulate the personas we set.

4.  **How do you think this impacted your results?**

> We had more input on Chinese heritage and non heritage speakers, and
> thus our results may be skewed towards learning Chinese. While we
> tried to extrapolate out critique that could be applied towards other
> languages, it could be the case that learners of different languages
> will have different needs, and thus respond to our system differently.
> We could benefit from receiving feedback from a wider range of
> participants if we wanted to survey and support multiple languages.

5.  **Based on the above, what does this say about the potential applicability of your system?**

> We feel that our system has potential in being used as a practice tool
> for prospective language learners, giving them opportunities to use
> what they learned in a welcoming and convenient setting. We don't
> anticipate for the tool to completely replace other methods of
> learning such as textbooks, classes, or other language learning apps,
> feeling it can excel more as a supplemental practice application to
> help guide and let people practice more easily.

6.  **What new questions do you have based on your evaluation?**

> How do we create better and more natural conversations for the users?
> Does this involve general techniques like shortening the response
> length, or more specific techniques, such as matching the response
> towards a user's individual preferences?

**Did you use a generative AI tool for this assignment? If so, which tool(s) and how?**

No generative AI was used in this assignment.

**How much time did you spend on this assignment as a group? Individually?**

Evaluations took approximately 30 to 1 hour each, while writing up the
corresponding notes took approximately 15 minutes each. Finishing the
write-up for the core assignment took 1 hour.
