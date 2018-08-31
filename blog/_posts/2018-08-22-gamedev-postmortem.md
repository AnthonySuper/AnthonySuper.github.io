---
title: "A Brief History of my Failed Attempt at Making a Video Game"
layout: post
categories: ["dungeon_landlord", "gamedev", "programming", "personal"]
---

# test

On the internet, it isn't particularly hard to find technology postmortems.
Some of them are from large, venture-funded companies which eventually keeled over and died after the investors ran out of confidence and the bank account ran out of money.
Others are from open-source initiatives that failed to find a footing and drifted off into darkness until their creator decided to turn the lights off for good.
And others are much more personal, the story of a small, not-well-funded team that couldn't quite get up to snuff.
The term originates in medicine, where it describes a detailed account of all the things that eventually lead to the death of a patient.
Such reports aren't written unless there's a need to.
There's no knowledge to be gained from an obese man in his late seventies succumbing to heart disease, or a truama patient simply dying after succumbing to injuries no human can survive.
If the cause of death is obvious, a postmortem report is frivolous.
All of my previous failures, I believe, fell under this particular category.
I've never felt a need to write a postmortem for them because it was obvious, even to me, why they did not succeed.

I graduated college with a Bachelor's in Computer Science in December of 2017, after studying for five semesters plus two summer classes.
Instead of going the typical route and trying to find a job immediately, I decided that I would embark on a project of my own, take another stab at entreprenuership, and try to pursue a dream I remember having as a child.
I was going to make a video game, and a good one at that, and I was going to sell it on steam and turn its moderate success into a fledgling indie studio.
Unfortuantely, however, I find myself in the morgue, staring down at my game's corpse and trying to decide if it's worth the time and effort to investigate exactly how it died.

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
Despite being a bit infamous on the internet for an overly-enthusiastic fanbase, the game was legitimately phenominal from a story perspective, and remains one of the few pieces of media to actually make me cry.
*Undertale* inspired me to try gamedev again, and to actually watch a few Unity tutorials and such.
Sadly, I quickly realized that I wouldn't be able to actually make the game I had in mind by myself, and gave up quickly.
One slightly awkwardly-worded blog post later (which I won't link in order to save myself the embarrasment, although it remains up on the site) I put my gamedev dreams to rest again and focused back on college.

### The Decision

During the Summer of 2017 I had an internship.
I enjoyed what the people I worked with, and I enjoyed what I did, and I enjoyed getting the experience.
What I didn't neccisarily enjoy was the *feeling* of it.
I've wanted to be an entreprenuer since I was six years old.
I had a little play-desk where I'd pretend to take calls from "Anthony Bob Zarlengo," the fictional "partner" in the make-believe company I pretended to help run, who I creatively named by prepending my own first name to the name of my mother's (at the time) boss.
Working at the bottom of a large, multi-tiered organization chart wasn't exactly my idea of fun.
I didn't get to pick projects or have much influence on the product.
Of course, I was an intern, and nobody lets the intern decide on features, but I still craved something I had a bit more influence on.

As graduation loomed I started thinking of unorthodox things to do after I completed college.
I was graduating rather early, after all, the by-product of trying to finish school as quickly as possible in order to use the minimal amount of my parents' money (and as a personal challenge to myself).
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
I should have stayed small, and made at least five other snack-sized games.
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
I didn't like the actor model Unity used and attempted to implement a [pluggable AI](LINK HERE), which I modified to use coroutines in order to make the code easier.
Unfortuantely, coroutines aren't easily serialized, and I wound up re-writing basically all of my AI code to use explicit state machines instead, which was less-than-ideal for a variety of reasons.
I didn't have as much experience with C# as I did other languages like C++ or Java, which was a big problem. 

As time went on, I quickly started to realize that I had bitten off way, *way* more than I could chew.
I knew that getting into the project on some level, but I figured I needed to stay ambitious if I wanted the final product to be any good.
Unfortunately, it became clear that there was no way that I could actually make a version of my concept that was any good.
Disasisfied and somewhat depressed, I went back to the drawing board, trying to figure out a better project to make.
I knew one thing: I didn't want to make it in Unity.
If anything I wanted to try and make the game from scratch, so I could have more control, but also so I could possibly learn more about gamedev in general.

## Dungeon Landlord

### The Concept

*Dungeon Landlord* was, essentially, the games *Cookie Clicker*, *Nethack*, and *XCOM* (the remake) thrown into a blender.
The basic idea was that the player had won the legal rights to the largest dungeon in the land after beating a lich in poker (after the poor lich lost quad aces to the player's Royal Flush).
They then decided that the best thing to do was to conver the Hundred Floors of Torment into a nice mixed-use land area.
The game worked in two halves.
During one half of the game you built various buildings on the floors of the dungeon that were no longer monster infested, in order to earn money and grow your business.
On the other half, you used that money to hire mercenaries to clear out the still-monster-infested floors of the dungeon, in order to eventually clear them of monsters so you could build more buildings.

*Dungeon Landlord* was a much simpler game