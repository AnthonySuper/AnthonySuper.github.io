---
title: "A Brief History of my Failed Attempt at Making a Video Game"
layout: post
categories: ["dungeon_landlord", "gamedev", "programming", "personal"]
---

On the internet, it isn't particularly hard to find technology postmortems.
Some of them are from large, venture-funded companies which eventually keeled over and died after the investors ran out of confidence and the bank account ran out of money.
Others are from open-source initiatives that failed to find a footing and drifted off into darkness until their creator decided to turn the lights off for good.
And others are much more personal, the story of a small, not-well-funded team that couldn't quite get up to snuff.
The term originates in medicine, where it describes a detailed account of all the things that eventually lead to the death of a patient.
Such reports aren't written unless there's a need to.
There's no knowledge to be gained from an obese man in his late seventies succumbing to heart disease, or a trauma patient simply dying after succumbing to injuries no human can survive.
If the cause of death is obvious, a postmortem report is frivolous.
All of my previous failures, I believe, fell under this particular category.
I've never felt a need to write a postmortem for them because it was obvious, even to me, why they did not succeed.

I graduated college with a Bachelor's in Computer Science in December of 2017, after studying for five semesters plus two summer classes.
Instead of going the typical route and trying to find a job immediately, I decided that I would embark on a project of my own, take another stab at entrepreneurship, and try to pursue a dream I remember having as a child.
I was going to make a video game, and a good one at that, and I was going to sell it on steam and turn its moderate success into a fledgling indie studio.
Unfortunately, however, I find myself in the morgue, staring down at my game's corpse and trying to decide if it's worth the time and effort to investigate exactly how it died.

In this case I'm not quite sure if I'm even writing a postmortem, or if it's a sort of obituary.
I'll admit openly that I am partially writing this for emotional closure and not purely as an objective report so that I may discover why and how this project died.
Still, I do think there is some value to be gained in organizing my thoughts on the matter.
So, without further ado, let us examine my failed attempt at game development, so we can try to pinpoint exactly where things went wrong.

<!--more-->

## Prologue: Deciding to make a Game

### The Background

When I first picked up a copy of *C for Dummies* from my local library at the age of fourteen, I wanted to make a video game.
After trying to hack together an indie terminal game for around a month and a half (I believe the premise involved being some sort of dragon-slayer in space), I realized that game development was really hard, and that I didn't actually have any ability to produce anything good.
To my surprise, however, the entire programming thing was really fun anyway, and I would continue to do it as a hobby.
I even founded a club for it at my high school&mdash;most of the members of which are currently actively pursuing a Computer Science degree.

I then proceeded to not almost entirely avoid game development for six years.

I thought about it, of course.
Certain games would spark inspiration in me and I'd open up a little text file and write out a list of ideas, before deciding that it wasn't particularly worth it.
I did go to the first meeting of the Game Development Club at my college before realizing that I didn't really have time to squeeze a major project between classes and my *other* major project, ImageHex (the death of which is a blog post for another time).
I didn't go to any others.

The one thing that got me close was *Undertale*.
Despite being a bit infamous on the internet for an overly-enthusiastic fanbase, the game was legitimately phenomenal from a story perspective, and remains one of the few pieces of media to actually make me cry.
*Undertale* inspired me to try gamedev again, and to actually watch a few Unity tutorials and such.
Sadly, I quickly realized that I wouldn't be able to actually make the game I had in mind by myself, and gave up quickly.
One slightly awkwardly-worded blog post later (which I won't link in order to save myself the embarrassment, although it remains up on the site) I put my gamedev dreams to rest again and focused back on college.

### The Decision

During the Summer of 2017 I had an internship.
I enjoyed what the people I worked with, and I enjoyed what I did, and I enjoyed getting the experience.
What I didn't necessarily enjoy was the *feeling* of it.
I've wanted to be an entrepreneur since I was six years old.
I had a little play-desk where I'd pretend to take calls from "Anthony Bob Zarlengo," the fictional "partner" in the make-believe company I pretended to help run, who I creatively named by prepending my own first name to the name of my mother's (at the time) boss.
Working at the bottom of a large, multi-tiered organization chart wasn't exactly my idea of fun.
I didn't get to pick projects or have much influence on the product.
Of course, I was an intern, and nobody lets the intern decide on features, but I still craved something I had a bit more influence on.

As graduation loomed I started thinking of unorthodox things to do after I completed college.
I was graduating rather early, after all, the by-product of trying to finish school as quickly as possible in order to use the minimal amount of my parents' money on tuition (and as a personal challenge to myself).
I'd tried a more traditional startup as a side-project and failed utterly, and didn't really want to repeat the experience.
There was, however, something else I could try.

I had an idea in my head for a narrative-focused game.
I didn't think it would be too hard to make, I had a few compelling character concepts, and I had the promise of my parents that I could live at home without paying rent as long as I was actively working on something.
It seemed like an opportunity that was too good to squander.
Even better, I found an [excellent musician](soundcloud.com/agdgost), who was (if anything) more hyped about my idea than I was.
So, a few weeks before graduation, I made the decision: after I graduated, I was going to make this game, which I tentatively called *Space Junk.*

## Space Junk

Space Junk was a top-down stealth-RPG in which the player was an amnesia-stricken human who found themselves in the middle of a galactic-scale war.
The player started off stranded with a small crew deep within enemy territory, and quickly learned that the alien's weapons had no effect on them (the reason for this was initially that the weapons were "magical" and your character was immune, although some friends suggested that I use a more sci-fi sounding term like "Energy X" or something similar).
They were similarly unaffected by most scanning systems, and could slip undetected into heavily guarded areas if they were clever.
They were *not*, however, similarly free from consequence if they were punched in the face or otherwise physically attacked.
The premise from there was simple: the player would infiltrate an enemy area, sneak around, and try to cause enough fear to make an area descend into chaos, which would allow them to accomplish some other objective and win the level.
They'd have to do this without ever actually getting in a direct, hand-to-hand fight.

Space Junk had a plotline focused on both a small group of characters who followed the player around, and the larger dynamic of the greater war.
The player would learn how their companions were affected by the conflicted, their reasons for joining the military, and their own personal struggles.
At the same time, they would start to uncover more and more information about the true objectives of their enemies, culminating in a climactic sequence that was (in my mind) both thrilling and narratively satisfying.
I'm keeping the idea in my back pocket, so to speak, so I won't spoil it, but most I showed it to agreed that it was a neat concept.
Personally, I still like the idea.

From a more gameplay perspective I thought that *Space Junk* would be interesting.
The basic concept was to try and act like the monster in a horror movie, and to perform a bit of a trick where you kept your actually-quite-fragile nature hidden.
I've always been a big fan of stealth games like *Deus Ex*, and the *Hitman*-esque idea of hiding in plain sight had a lot of appeal to me. 
There was a lot of potential for fun gameplay interactions, creative level design, and other such niceties.
I even had some ideas of how to make it a good game to speedrun.

Everything seemed to be looking up, and I went into the game with surprising confidence.

### The Technical

I decided to use the Unity engine to make *Space Junk*, and quickly set to work making a few game "snacks" to familiarize myself with the engine.
I also decided that I would stream my development efforts on twitch.tv.
After successfully making pong, breakout, and a very basic walk-and-and-talk-to-people game, I found myself sketching out the first few levels.

This was, I think, my first mistake.
Three simple games was *not* nearly enough to learn the engine.
I should have stayed small, and made at least ten other snack-sized games.
Making a moderately-sized one with a team might have been an even better idea.

I worked on the game for around two and a half months, and during that time I grew increasingly frustrated with Unity.
It wasn't that Unity was a bad engine, it was that it was a 3D engine with a 2D layer added on later.
Things that should have worked didn't work out properly, like animations triggering events if played in a timeline (a bug which had been open for a few years, and only fixed on the most recent alpha when I started developing).
The editor had a few problems with random crashing.
A few features commonly referenced in tutorials on the website were either deprecated or removed entirely.
Worse, it seemed like the best place to find help was on Youtube, and I sort of loathe video tutorials as a concept in general.
I learn much better reading instead of watching.

The real problem, though, was my lack of experience.
My apparently simple concept didn't have a simple execution.
Properly writing an AI for enemies that were "afraid" was a lot harder than I thought, as simply running away from the player didn't make much sense.
They needed to realistically try to find cover or backup for the game to be at all realistic.

Worse, I didn't have an artist.
This didn't seem to be a big deal to me at first, but I quickly realized that art was going to be at least a third of the work for the game.
I had a fairly simple story to tell, but I needed multiple types of enemies, and ideally multiple types of animation.
I probably also needed scripted cutscenes, which was a nightmare unto itself.
So, naturally, I went to look for artists. 
I found one who seemed excited about the project, and even drew some concept art, before disappearing completely for multiple months.
I eventually send him an email to let him know that I had dropped him from the project, and he was quite apologetic about things.
The experience wasn't his fault&mdash;the fact that he signed on at all was a bit of a miracle considered that I had little prior experience and couldn't pay him upfront&mdash;but it was still a source of stress and frustration.

My other major problem was trying to shoehorn in my own ideas into the Unity framework.
WHen I didn't like how something was done in the editor, I tried to do it in code.
I wrote a super-gross reflection-based XML serialization library in an attempt to make save games, which took a full week, and only barely worked.
I didn't like the actor model Unity used and attempted to implement a [pluggable AI](https://unity3d.com/learn/tutorials/topics/navigation/finite-state-ai-delegate-pattern), which I modified to use coroutines in order to make the code easier.
Unfortunately, coroutines aren't easily serialized, and I wound up re-writing basically all of my AI code to use explicit state machines instead, which was less-than-ideal for a variety of reasons.
I didn't have as much experience with C# as I did other languages like C++ or Java, which was a big problem.

As time went on, I quickly started to realize that I had bitten off way, *way* more than I could chew.
I knew that getting into the project on some level, but I figured I needed to stay ambitious if I wanted the final product to be any good.
Unfortunately, it became clear that the opposite was true.
There were too many moving parts, too much complexity to think about, and not enough experience on my end to go around.
Dissatisfied and somewhat depressed, I went back to the drawing board, trying to figure out a better project to make.
I knew one thing: I didn't want to make it in Unity.
If anything I wanted to try and make the game from scratch, so I could have more control, but also so I could possibly learn more about gamedev in general.

## Dungeon Landlord

### The Concept

*Dungeon Landlord* was, essentially, the games *Cookie Clicker*, *Nethack*, and *XCOM* (the remake) thrown into a blender.
The basic idea was that the player had won the legal rights to the largest dungeon in the land after beating a lich in poker (after the poor lich lost quad aces to the player's straight flush).
They then decided that the best thing to do was to convert the Thousand Floors of Endless Torment into a nice mixed-use land area.
The game worked in two halves.
During one half of the game you built various buildings on the floors of the dungeon that were no longer monster infested, in order to earn money and grow your business.
On the other half, you used that money to hire mercenaries to clear out the still-monster-infested floors of the dungeon, so that you could use them to build more buildings. 

*Dungeon Landlord* was a much simpler game than my original idea.
I figured that the concept could theoretically work on mobile as well as on desktop.
Like most "idle games," the game would play itself even if you weren't playing it.
The hotels you built would still get guests, your burger stands would still sell burgers, and you would still make money even while the game was going on.

At the same time, however, I imagined a game with a surprising amount of complexity.
If I designed a combat system well, I reasoned, I'd be able to create a fairly deep game.
What units would you send into battle?
How would you spend your money?
Against what sort of enemies was it a better idea to send *many* weaker units, as opposed to *fewer* powerful ones?

I had some further ambitions still.
I reasoned that, when it came down to it, many RPG systems could be implemented entirely in data.
That is, there was no need to write `class Fireball : public Attack` over and over.
Instead, I could use a very simple sum type (or `std::variant`) for the different kinds of attacks, and then read in the parameters *purely via data*.
If that was the case, adding mods could potentially be trivial.
The user would specify the parameters for their custom units, and the game would run them.

I still think that this idea *might* work.
The way I implemented it, however, was horrifically boring.
There wasn't any variety in combat at all.
Now, I never got around to actually *finishing* my combat system (for reasons that I will make clear later), but even the most basic beta builds felt really unfun.
They required a much higher level of polish to feel at all satisfying.

### Yet More Issues

*Dungeon Landlord* fell into different problems with similar roots.
The first issue was my lack of experience in gamedev.
I knew that was a major reason that *Space Junk* never really got off the ground, so I decided to take a substantially different approach to this new project.
By keeping everything as low-level as possible, by writing most things from *scratch*, I'd gain a much better understanding of the programming concepts that went into modern games.
On this front, actually, I consider the effort successful.
I understand Entity Component Systems, code organization, and other related concepts *much* better than when I started.
I think the experience has made me a much better programmer.

The issue is that, as one learns, they make mistakes.
They fumble.
And I spent far, far too much time picking myself off the ground&mdash;or, in this case, refactoring.
If I had taken an ECS off-the-shelf, I wouldn't have had to constantly try to improve the speed of mine.
Now, I probably would've used that ECS improperly due to not getting a real feel for the concepts, but development could have been much faster.

My issues didn't just go to code, however.
They ran a bit deeper than that.
See, I'm good at ideas.
More than that, I'm good at laying down the basic foundations of a project.
I think that I can see, from the top level, a lot of the basic things that can be put into place.

But these skills are, quite frankly, useless without being good at the tiny things.
The big picture *does* need to be in place, sure, but creating a good software experience is really about the little things.
Games with hard to navigate menus or janky graphics or ugly user interfaces aren't fun to play, even if the core concept is good, or they run at very high speeds.
On my previous project, I didn't really handle any of the smaller-scale user experience aspects of it, because I had a partner who would do that stuff for me.
When he left to pursue other opportunities, I tried to learn how to polish, and while I improved, I didn't ever quite get there.

The result was that Dungeon Landlord was rough and bumpy when it should have been smooth.
The user interface had clashing colors.
There weren't enough sound effects when you clicked buttons or did attacks.
The way the save system worked was terrible.
I released my first demo with no way to turn down the ear-splittingly-loud music.
It was full of issues, and it was all my fault.

These were issues that I could have fixed.
Hell, issues I still *could* fix.
But there was another monster, looming its ugly head.

### Burnout

I'm hesitant to write this section at all, because I feel kind of ridiculous complaining about it.
Realistically, I was given free room and board to pursue my dreams.
That's something that almost *nobody* gets.
When I consider the magnitude of the opportunity, and of my parent's generosity, I am still filled with gratitude and even a little guilt.
As I type these words, I feel a little ridiculous.
Why the hell am I complaining about the emotional turmoil of getting a chance almost nobody ever gets?
Shouldn't I focus entirely on the gratitude, and stop whining?

Well, kind of.
But I think it's important to discuss the very real issues that can come from working on a project like this.
And, to be honest, I'm still trying to separate the emotional goop that's inside my head.

The first problems came from frustration.
I could tell that I was behind.
*Dungeon Landlord* was supposed to be a fairly simple, quick project.
Meanwhile, months were going by, and I wasn't progressing at anywhere near the rate I wanted to.
Hell, it sometimes felt like I was backsliding, slowing down.
Part of it was due to technical debt, I suppose, but for some reason my mind amplified every individual flaw.

After the frustration came the fear.
I *knew* the project wasn't that good.
I could tell by playing it.
What if I could never make it better?
What if I was going to release something that was really, really bad?

Then, honestly, came despair.
I had a price point of roughly $2.50 for *Dungeon Landlord*.
It was a very simple game, and I couldn't justify charging more.
How many copies would I have to sell for it to be worth it?
I'd spent months on it, months I could have spent collecting a salary.

And then, of course, that line of thought lead into other emotions.
Here I was.
A *sellout*.
I was thinking about money when the entire point of doing this was to be an entrepreneur, a businessman.
It wasn't supposed to be about the money.
Yet, as I saw my other friends get progressively higher-paying internships and such, I couldn't help but feel like I was falling behind.
I simultaneously held the positions that I was a horrible fraud for only caring about the cash, and a hilarious idealist who would pay the proper price for his naivety when he never got a job due to the giant gap in his resume.

The thing about burnout is that it drains you.
I might have been able to get along fine, even with all these emotions inside my head, but they took a lot of energy to deal with.
As a result, I didn't really have anything left over.
*Dungeon Landlord* took all the emotional energy I could possibly muster.
When other sources of stress in my life popped up, I couldn't handle them properly.
And that started to take a toll on my mental well-being.

My family noticed.
My friends noticed.
Worse, *I* noticed, and I could only kick myself for it.

### Help

Around this time I started seeing a therapist.
He noticed I was stressed.
Hell, he seemed downright concerned about it.
I told him much of what I wrote in the preceding section, but in greater detail.
I also told him about the more personal stressors that aren't related enough to the purpose of this post to mention.

I recommend therapy to everybody, I think.
I've gone a few times in my life and never regretted any of it.
This case was no different.
His guidance helped me realized that I was being a bit irrational about the whole thing.
If the purpose of the project was to try something, and to have fun, and it was instead slowly killing me due to stress, then that was a contradiction.
What's even better is that he made *sure* that was the case.
He didn't tell me to drop it immediately.
Hell, he kind of did the opposite, encouraging me to keep going until I was certain I didn't actually want to anymore.

And, after I thought about it...

I realized I *didn't*.

## The Aftermath

And so, I write this blog post, with my adventure in gamedev (for now) completed.
I start working regularly at a place I used to contract with in January.
I'm pleased to report that I'm working on a small team, and able to make a variety of design decisions on my own.
Sure, it's not *my* business, but it is the kind of business that I wanted to work at.

In spite of it all, I think this experiment was surprisingly worth it.
I learned a lot of lessons about programming, of course, but more than that, I learned a lot of lessons about *life*.
Lessons that I maybe should have learned earlier, sure, but lessons just the same.

I don't regret trying to make *Space Junk* or *Dungeon Landlord*.
Who knows, maybe I'll revisit the concepts in a few years, when I'm a bit older, a bit wiser, and in need of a side-project.
Maybe this blog post will be passed around as a joke after those games actually release.
Or, maybe, not enough people will play them to care about tracking this down.

The freeing thing is that I'm  fine with either outcome.
I don't feel nearly as stressed.
I don't feel like a failure.
I tried something, I worked at it, and I ultimately didn't have anything to release.
But, as dumb as it sounds, I still feel a bit of pride in myself.
I took a shot, and missed.
I regret missing, but I know I would've regretted not taking the shot even more.