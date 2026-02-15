---
layout: post
title: "I guess I kinda get why people hate AI"
categories: ["ai", "programming"]
---

# Outline

- Introduction - "I'm sitting in a hotel in Hawaii, about to start a new job, and wondering if it's going to be my last"
    - Previously that's because I always wondered if a startup would have an exit
    - Now wonder if AI is going to take over
- Background: I get that technology is scary
    - Briefly mention luddites
    - Briefly mention the ATM machine thing
    - Link https://qz.com/1681832/the-history-of-the-future-of-work to
      show more examples (maybe some joke about how naturally I should like
      AI, because I'm so lazy I outsourced my intro paragraph or some crap)
- Paragraph about liking/using AI
    - Mention that it's helped personal productivity
    - Mention using it as a nice filter to summarize info on vacation
    - Some kind of "at its best AI promises to usher in a superintelligence utopia"
- Some kind of "change is scary but often for the better!" paragraph
    - Mention that I even used to argue with people around the "humans need not apply" video on Reddit
- Then a "so why am I starting to get pessimistic?"
- Title that answers the question: "Everybody in charge of AI is telling me to be a pessimist"
   - Microsoft's AI CEO is telling me it's going to take my job (https://www.businessinsider.com/microsoft-ai-ceo-mustafa-suleyman-white-collar-tasks-automation-prediction-2026-2)
   - Sam Altman has said AI will wipe out job categories: (https://www.yahoo.com/news/articles/sam-altman-says-openai-poised-130000116.html)
   - Matt Shumer compares the current moment of AI to the early-January-2020 rise of COVID, indirectly comparing AI to a pandemic that killed millions (https://x.com/mattshumer_/status/2021256989876109403)
    - It's not just leaders
        - Influencers talk about the permanent underclass
        - Influencers demo AI by going "AI did this benchmark/coding challenege/whatever, we're so cooked chat"
    - Acknowledge that some AI messaging is more optimistic
        - Anthropic "worst time to be a problem" ad (https://www.youtube.com/watch?v=FDNkDBNR7AM) - mention the use of "ALL CAPS" by MF DOOM
    - The overall marketing picture is still extremely bleak
- New section title: "It's not entirely about the hype"
    - Personal anecdote about TA friend having to report several students for academic dishonesty
    - Parents sent me a fake video about Elon Musk making a smarthouse, had to explain it was AI, they were embarrassed and it was awkward
    - Kind of disturbing AI cat soap operas appear on social media feeds (https://www.theguardian.com/culture/2025/aug/18/ai-has-created-a-new-breed-of-cat-video-addictive-disturbing-and-nauseatingly-quick-soap-operas)
    - `cURL` removed bug bounties (https://news.ycombinator.com/item?id=46701733)
    - RAM price apocalypse
    - AI is helpful for the average person, but it's also causing a lot of real problems, and the only solutions to the problems are irritating
        - Having to prove you're a human in social media spaces gets rid of anonymity
        - Having to prevent cheating requires annoying, hand-written tests, which are very different from researched essays
        - Curating a social media feed is worse when there's a slop firehouse pointed at it ("at least, in the past, somebody had to get an Elsa costume and a Spiderman suit to create such low-quality content")
        - AI has vastly reduced the friction to create *mediocre to bad* work much more quickly than it has enabled us to create *great* work
    - Acknowledge that other technologies have done the same (machine loom textiles may not be nice as hand-weaved ones)
- New section title: "So I guess I get it"
    - AI is a useful tool with huge potential
    - The vibes around it are currently very bad
    - Nobody seems to actually care, but the vibes matter!
    - It's getting increasingly hard to be optimistic
        - Even if AI fulfills all its potential, what if only a few people control it, and it's never democratized?
        - What if it automates all the fulfilling, fun parts of life, and leaves humans to clean toilets?
        - What if it never takes that next step, and remains mediocre forever?
    - I'll try to be optimistic anyway


As part of this, I also am going to:
    - Write the article
    - Send the above outline to Gemini, say "write an article following this outline"
    - Then tell Gemini "Okay. Now, let's pretend you wrote that outline, but as you actually wrote the piece, things may have changed.
      So you no longer need to perfectly follow it---as you write, let your muse guide you, so to speak.
      Go off-script if it feels appropriate, stay on-script when it does not.
      Like a sculpture carving a marble statue, find the form within."
    - Send Gemini my actual article, ask it to compare.

# Draft

I'm sitting on a lānai in a hotel in Waikiki beach, writing this article, and wondering if the job I am starting nine days from now will be my last.

This is a unique situation for me in a few ways---I've never been to Hawaii before, I think the five minutes it's taken me to come up with that opening sentence is the somehow the most time I've ever spent on a hotel balcony, and this is the first time I've actually followed through on the "I should delay my start date to take a vacation" idea I've had every time I've switched jobs.
There's one difference, however, that looms larger in my mind.
It's not the "wondering if the new job will be my last" thing.
I've worked exclusively in startups, and while the primary reason I've done so has been because I enjoy the agency and impact you can have at early-stage companies, I'd be lying if the idea of cashing in cheap ISOs into early retirement wasn't a factor in each job offer I accepted.
The difference here is *why* I'm wondering that.
Previously, it was wondering if I would *need* a job after this one.

Now, it's wondering if I'll be able to *acquire* a job after this one, or if AI is going to completely take over my profession and ruin my career.

<!--more-->

## Not the first time

I'm not the first human to have anxiety about technological development.
Change is scary, and technology changes a lot of stuff.
In my opinion, these changes are mostly for the better---but that's not an opinion everybody shares.

The classical cultural example is the Luddites, a social movement that failed so utterly that its name because a common metaphor for stubborn morons who are terrified of technological innovation that helps everybody.
Deservedly so, to be clear---while it's true that textile experts did suffer from the advent of mechanical weaving, their loss was far outweighed by the gains the rest of the human race received from being able to afford more than two shirts over the average lifespan.

The other example that comes to mind is the (possibly apocryphal) stories around the rollout of ATM machines, where many supposedly predicted that the number of bankers in the US would collapse now that you could withdraw $20 in singles to leave tips without talking to a person.
The exact opposite happened, of course.
Being able to easily interact with banks, without waiting in a line that's too long for the dum-dum you get at the end to be a real consolation, made people use banks *more*.
And suddenly tellers became loan managers, and account advisors, and the machine that was supposed to destroy banking employment wound up supercharging it.

I could go on, but [somebody else already has](https://qz.com/1681832/the-history-of-the-future-of-work), so there's not much point in it.
Technology changes things, and sometimes it hurts people in the short-term, but every invention from fire to mRNA vaccines has wound up generally increasing human welfare.
I've long taken the view that this trend will continue.
I remember arguing with people who would link GCP Gray's ["Humans need not apply"](https://www.youtube.com/watch?v=7Pq-S557XQU) video (which has apparently been retitled "humans are becoming horses") about how wrong they were about AI.
In that era, nearly a decade before "Attention is all you need" would be published and usher in the LLM age, I was *so* confident that any developments in AI would be for the better.

I am now a little less confident than I was.

## Not a hater

I don't hate AI.
Earlier today I was asking Gemini to find me a nearby bar that would optimize for price, tastiness of drinks, and "not making me feel horribly lonely as a solo traveler on Valentine's day."
Gemini did encourage me to join a speed dating night at a nearby hotel, which I choose to think of as it displaying extreme confidence in my charisma as opposed to hallucinating my prompt as "give me the motivation to do a gainer off the fourth floor room I'm in onto the valet parking area," but it has been helpful for me on this vacation.
It's also been helpful doing various tasks on [the weird little Haskell framework](https://www.github.com/AnthonySuper/noided-web) I'm working on, and at my former place of employment, and I plan on using it at my newest place of employment.

If I'm to believe the boosters, like Sam Altman or Neil Breen, AI could be humanity's last invention, a machine we can hand the keys to and let it solve literally all of our problems.
And to some extent, that does kind of appeal.
It would be great if I could type "how can I be happy" in a prompt console somewhere and get back a step-by-step process to achieve enlightenment.
And we could also cure cancer, or whatever.
Sounds nice, right?

So why is this blog post titled "I guess I kinda get why people hate AI" as opposed to "AI haters are stupid and wrong?"

# The people in charge of AI keep telling me to hate it

Before I get into concerns I've found on my own, let me get the most blatantly obvious and infuriating reason that people might hate AI out of the way: *the people inventing it are telling me I should hate it*.
I've never seen this with any technological development, ever, in my life.
Henry Ford did not market the Model T as "a machine that will eventually cause environmental destruction, social isolation via car dependency, and health issues from pollution."
The guy who invented penicillin didn't say "one day this will lead to MRSA."

But Microsoft's AI CEO is saying [AI is going to take everybody's job](https://www.businessinsider.com/microsoft-ai-ceo-mustafa-suleyman-white-collar-tasks-automation-prediction-2026-2).
And Sam Altman is saying that AI will [wipe out *entire categories* of jobs](https://www.yahoo.com/news/articles/sam-altman-says-openai-poised-130000116.html).
ANd Matt Shumer is saying that AI is currently like [Covid in January 2020](https://x.com/mattshumer_/status/2021256989876109403)---as in, "kind of under the radar, but about to kill millions of people".

I legitimately feel like I am going insane when I hear AI technologists talk about the technology.
They're supposed to market it.
But they're instead saying that it is going to leave me a poor, jobless wretch, a member of the "permanent underclass," as the meme on Twitter goes.
Half the videos and blog posts I see about new models boil down to somebody running it through a benchmark, then saying "chat we're cooked, might as well end it all now."
This isn't just a strange way of marketing a product, it is a completely psychotic one.

That's not the only way people are talking about it, of course.
I liked Anthropic's [superbowl ad for Claude](https://www.youtube.com/watch?v=FDNkDBNR7AM), and not just because it used "ALL CAPS" by MF DOOM as the backing track.
The idea of AI as an exterminator of human problems is much more appealing than AI as the exterminator of, you know, the career of me and everybody else on Earth.
But, somehow, "AI is good and will help you" is a less common marketing tactic than "AI will ruin you life" among *people in charge of AI companies*.

It's completely fucking baffling to me.
I can't understand it, unless all those AI marketing materials are really meant for the ultra-wealthy, and not for me.
"Fund this and you can become a permanent overclass and have millions of enslaved serfs bowing to your machine-god" is, I suppose, an appealing tactic to some kinds of people.
Or maybe the real message is "you should panic because if you don't invest all your money in letting me buy more RAM right now you'll be a peasant like everybody else" is the real pitch.
I don't know.
I'm not rich enough to be in that target demographic.

# AI right now has a few huge downsides

I have a friend who is a new TA at a university in California.
They've had to report *several students*, every semester, for basically pasting their assignments into ChatGPT.

They didn't find this out via careful analysis, or use of any of the dubious AI detector tools.
The students literally left in the "would you like me to also do (related thing)?" that every AI puts at the end of their responses.
Total laziness, but laziness that these students presumably got away with in high school.
To my friend, their primary experience with AI is seeing students rob themselves of the opportunity to learn, so they can...
I dunno, hit the vape and watch Clavicular get framemogged, or whatever the hell Gen Z does.

In my own personal experience, my dad enthusiastically sent me a video about Elon's new "smart house" initiative.
I realized, right away, that the video was AI generated, but I assumed it was a summary of something.

Nope!

Every component of it was made up.
It was a top-to-bottom scam.
I researched this for like ten minutes, just to be sure, before gently telling my dad that it was fake.
He handled it well, apologized, and was clearly embarrassed.
But why should he be?
The video had graphics, good narration, music---and all of it was slop bullshit!

Then---and this is petty---I've also been subjected to "slop" myself, in the form of bizarre [cat soap opera](https://www.theguardian.com/culture/2025/aug/18/ai-has-created-a-new-breed-of-cat-video-addictive-disturbing-and-nauseatingly-quick-soap-operas) videos that appeared in my tiktok feed.
Besides being unpleasant to look at, these shorts have weird racial undertones that are deeply, deeply strange and unsettling to me.
And even though I do the entire "long press and select 'show less'" thing tiktok provides, they still sneak in, and they frankly irritate to an irrational degree.

Then I hear about `cURL` having to [stop their bug bounty program](https://news.ycombinator.com/item?id=46701733) because of so many AI submissions that hallucinate fake bugs.
Or I look at RAM prices, which have gone completely nuclear, largely because AI companies are buying so much of it.

I get that every technology has friction as its adopted.
I'm sure the first machine-made textiles were of vastly lower quality than anything you could get from even the worst hand-weaver.
AI, however, currently occupies a zone where it's sometimes very helpful for doing high quality work, but *always* helpful for doing bullshit slop.
People could always write false press releases about smart houses, but it required them to actually *write* it.
People could always buy an Elsa costume and a Spiderman suit and make weirdly sexual slop videos, but at least they had to go to party city and buy a Sony camcorder and an SD card.
People could always hire a cheating service to write essays for them, but at least *somebody* would write the essay.
AI has lowered the barrier to entry for all of these things to the point where they're effectively free.
Garbage, but free to produce.
And that does make some people's primary interaction with the technology profoundly negative.

That's not to say that there *aren't* solutions.
Websites could use government IDs to verify that people are human, so spambots can stay out.
After selecting the "please stop showing me videos of anthropomorphic orange tabby cats being cuckolded by black-furred anthropomorphic cats" button on TikTok it eventually wised up and stopped showing me similar content.
Eventually somebody else is going to open up a RAM plant when you can get such stupidly high margins on sticks of DDR5.

But all of these solutions are *irritating*, difficult, and, frankly, a lot of work.
Technology is supposed to save you from working.
For many, AI isn't doing that.
It's doing the opposite.

# So I guess I get it.

To be clear, I think AI will be ultimately extremely helpful.
I still am using it on my projects.
I am going to use it at my next job.
I, *personally*, don't hate AI.

But I can't deny that the vibes right now are *awful*.

Not just bad, *awful*.
It's not just the "chat we're cooked you're the permanent underclass" stuff influencers say.
It's not just the "everybody is fucked" hyperbole CEOs sprout.
It's the actual, day-to-day experience with the technology.
I'm a programmer---AI actually helps me a *lot*.
But for normal people, their interactions are profoundly more negative, and none of the people behind this technology seem to care.

And I can't help but wonder... what if the vibes get worse?

What if I actually lose my job?
What if I'm begging for change in six months, a new member of the permanent underclass?
What if AI actually automates all the fulfilling, interesting parts of life, and humans comparative advantage winds up being exclusively in scrubbing toilets and similar manual tasks?

Or, what if AI continues to lower the barrier to entry for annoying, low-quality things---and *never* gets to the point where it's truly great?
What if dead internet theory becomes true, and we all drown in an avalanche of slop?

AI ushering in a cyberpunk dystopia would at least be interesting.
But right now I'm worried it's just going to result in things becoming kind of generally worse, effectively rolling back a lot of innovations of the internet and social media and such by making such things totally unusable.

## Not a doomer

To be clear: I still think that this won't happen.
I think AI is in a weird spot, but it will eventually get out of it.
It will become a tool that helps us, and makes our lives better.
It already does that for me now---and, in the future, all the rough edges may get sanded off, and most people will think of AI as a helpful and fun-to-use tool.

Right now, though, the vibes are pointing in the opposite direction.

I just wish the people who are creating AI would realize that and course-correct.
