---
title: "Feature Suggestion: Website Issues"
layout: post
categories: ["tech", "programing", "internet"]
---

Recently I've been thinking about ways to allow users to give feedback on [ImageHex](https://www.imagehex.com).
ImageHex isn't fully launched and lacks users at the moment, of course, but I think that the ability to provide feedback is going to be crucial.
I'm the sole developer of the website at the moment, and it's going to be difficult (if not impossible) for me to track down any bugs it's likely to have.
This is especially true as I lack any kind of android device to test it on, meaning that there's almost definitely a lot of minor (or major) visual glitches for android users.
I'm working on rectifying that situation, but even when I do some things are bound to slip through the cracks.
If companies that make millions of dollars a year can't keep bugs out of their software, it's highly unlikely that a college kid with no money will succeed where they have failed.

<!--more-->

Beyond bug reporting, however, I'd like to allow users to suggest features.
User feedback is an extremely valuable thing, and it would be great to give them a way to provide it directly.
More than that, a dedicated place to post feature requests will enable users to discuss those features, allowing them to refine their ideas before I even start implementing.
I think that getting users involved in the development process like this could be extremely useful.
Of course, actually implementing everything will be up to me, but they should be able to direct my effort if they so desire.

Now, as a developer, I know we already have things like this.
They're called Bug Trackers, and every major project has them.
Hell, most minor projects have them, especially since those hosted on GitHub or Gitlab come with them built-in.

Unfortunately, most of those bug trackers are, uh, less than user-friendly.
BugZilla is very powerful, but not extremely easy to use.
Most of its alternatives are the same.

The issue trackers provided by GitHub and Gitlab, however, are extremely well-designed and easy to use.
They certainly lack the power of most dedicated issue trackers, but that's a worthwhile tradeoff for the user experience they provide.
So the obvious option is that I should just make a repository for issues on Github, like [Valve Does](https://github.com/ValveSoftware/Dota-2/issues), and be done with it, right?

Well, not quite. 
You see, Github issues require a login.
That means that, if somebody makes an account on ImageHex and finds a bug, they need to make a *second* account on a different website to report it.
That's really annoying, and not a good user experience at all.

## Dreaming of Solutions

So, how could those websites fix this problem?
Well, first they'd have to ask if they want to.
I have no idea if this is something a lot of other site-runners want, or if I'm just some sort of idiot who likes stupid features.
If this is a problem for other people, however, I have some suggestions of how to fix it.

First off, allowing users to post issues anonymously is almost definitely an absolutely terrible idea.
There should be some kind of authentication.
Ideally, this authentication would be scoped to a specific website, so you could report issues on ImageHex with your ImageHex account, and issues with VirtualPizz.biz with your VirtualPizz.biz account.

The obvious way to do this is to use something like Oauth or OpenID.
The client websites would set themselves up as identity providers, and the issue tracker would hook into that.
It would see who is providing the identity, then only allow the user to make issues for that specific site.
Some other authentication scheme could be used as well.

From there, it can basically work exactly the same as current issue pages.
Keep things user friendly, let them add tags and severity levels, and allow other users to comment.
All of that works already, it just needs to be expanded into a context where it's more useful for people that own websites as opposed to Open Source projects.

### Time Constraint

Of course, I don't really have time to wait for somebody to build this for me.
I could try to build such a system myself, but that would be a bit of a waste, sine I really only want to provide an ability like this for ImageHex.

Unfortunately, at the present moment, I don't think it's even worth it for me to build in an issues system into ImageHex itself.
I'm still working on the frontend for Commissions, and that's far more important right now.

Thankfully, I wrote this blog post.
So when I do have time, I can come back, read this again, and start implementing something like this.


...So maybe not an extremely useful blog post. Oh well.
