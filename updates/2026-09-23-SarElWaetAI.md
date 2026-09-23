---
title: "It's About Time: Lebanon's Most-Watched Political Show Goes AI"
description: When Sar El Waet decided to bring AI into Lebanon's most-watched political talk show, the ideas and the first working tools already existed, dreamed up and built by Rudy Hachache from inside the show's own team. Our job was to listen, help, and make it hold up on live television. Here is how it came together, with a close look at how the show now fact-checks its guests while they are still on air, and at the models, reel factory, on-air graphics, and audience votes behind it.
slug: SarElWaetAI
authors: jud
hide_table_of_contents: false
date: 2026-09-23T17:00:00Z
---

# It's About Time: Lebanon's Most-Watched Political Show Goes AI

A guest on live television says a number. While the show is still on air, a producer can see whether it holds up, sources attached. At the break, a full-screen graphic can show viewers which questions each guest answered and which they dodged. Before the night is over, the sharpest moments are cut, captioned, and waiting for someone on the team to approve them.

This is Thursday night at Sar El Waet (صار الوقت), Marcel Ghanem's political talk show on MTV Lebanon and the most-watched political program in the country. The name means "it's about time." This summer, the people who make the show decided it was time for AI.

When they came to us, we were excited. Then we got careful. A political talk show is no place to experiment on an audience: every name on screen, every number, and every clip carries a credibility the show has spent years earning. So we made one decision up front, and it shaped everything that followed. The producers would lead. We would follow.

<!--truncate-->

## The Idea Came From Inside the Show

None of this was our idea. It was Rudy Hachache's.

Rudy, from inside the show's own team, started in July by making animated explainer reels with AI image and video tools. Then he pitched the station's leadership a 22-slide deck on what AI could do for the show before air, on air, and after air. The deck even had a live poll: the room scanned a QR code and voted from their phones. That little demo is now the show's on-air audience vote.

Slides weren't enough for him. In late August, on a single desktop PC, Rudy built the real thing: transcription, a reel factory, an archive search, an episode prep station, and a review station where the team approves or kills every clip. From one three-hour episode, his factory cut 22 clips, and each one was transcribed again and checked before anyone saw it.

His archive search shows how well he knows the show: it understands Arabic, English, and Arabizi, and Lebanese pronunciation rather than textbook spelling. Type "mitl heik" and it jumps to the exact second someone said it.

What impressed us most, though, wasn't the code. It was the rules. Rudy and the team had learned, one late night at a time, what a Sar El Waet clip must be: a complete idea, never just the money quote. Hard cuts on the exact word. No more than two lines of caption. The speaker on screen from the very first frame. And nothing, ever, goes out without a person approving it. When a viewer challenged a figure in one of their reels, a new rule followed: no number goes on screen on the strength of a single outlet's paraphrase.

## We Waited

We build tools for newsrooms for a living, from [OpenNRCS](/opennrcs) to [AI dubbing](/dubbing). We could have shown up with a product of our own. We didn't. We waited until the producers had built the thing they wanted to use, the way they wanted to use it, and had run it on real episodes. Only then did we know what we were really being asked to improve.

That restraint turned out to be the most important decision of the project. When a cloud version of the review queue was tried early on, the team rolled it back: they wanted decisions made at the show's own machine, and that was that. The stations Rudy designed are still the backbone of the dashboard. The producers decided that the buttons speak English while every word the team and the models produce stays Arabic, that on-air graphics match the studio's existing Vizrt designs exactly, and that a producer approves every graphic before the vMix operator can put it on air.

Their editorial rules were not replaced by our best practices. They were turned into code, from the prompts that pick clips to the builder that refuses a cut too short to hold a full idea.

Even requests work their way. Producers write in whatever language they think in, Arabic, English, or Arabizi, and the first reply is always one question, in their language: is this a fix, or something new? More than forty requests have come in since mid-September, and nearly all of them have shipped.

## Our Part: Make It Hold Up on Live TV

Rudy's first version ran on one PC and worked only while that PC stayed switched on. Our job was to help it survive show night: one platform the whole team can open from the studio, the control room, or a phone, with nothing Rudy designed lost along the way.

It has been a genuine collaboration. Rudy never stopped building, and more than a hundred of the roughly six hundred changes to the codebase are his, including the groundwork for moving it to Cloudflare, the promises ledger, the on-air graphics, and the AI desk. Our share was mostly what viewers never see: one codebase instead of three, long jobs that survive a dropped connection, accounts and permissions for every producer, the public voting service, a dashboard that works on a phone, and the episode archive streamed from our [Hosted Media Services](/hms). Both sides built with AI coding agents, just as Rudy had since his very first reel.

## Fact-Checking Live Television

On a political talk show, the most dangerous moment is a confident number. A guest says it, the conversation moves on, and by the time anyone could check it, the whole country has heard it as fact. Catching that moment was the idea at the center of everything.

### It Started as a Slide

Rudy's pitch deck called it the Live Fact-Box, and it laid out the design in four steps: live transcription listens to the debate, checkable numbers and facts are flagged the moment they are said, an agent verifies them against trusted sources and the show's own archive, and an operator approves before anything reaches the screen. His example was the electricity file: a guest downplays what the state has spent on power, and a card comes back with decades of treasury transfers to the electricity company, sourced to the World Bank. What runs on show night today is that slide, built out step by step. The design is Rudy's; much of the live machinery behind it was our share of the work.

### From a Sentence to a Claim

The transcript does not wait for guests to finish. Because the live transcription cuts at breaths, new lines land throughout, even in the middle of a long monologue. Once about two hundred characters of new speech have built up and half a minute has passed since the last look, the extractor reads them, with the dozen lines before for context. A producer can also force a pass on the spot.

Its instructions are strict. Only checkable facts count: numbers, dates, named events, who said what, laws and procedures, and history. Opinions, predictions, rhetorical questions, jokes, and lines like "the situation is difficult" are ignored. It picks at most five claims per pass and ranks them: numbers, statistics, and accusations first, events and dates next, small details last. It also sees every claim already caught tonight, so the same fact said twice, even in different words, is checked once.

Every claim is stored twice: exactly as it was heard, and rewritten to stand on its own, with pronouns resolved and "last year" turned into a real date relative to the broadcast. The same pass also catches **moments**, a promise, a position, or a number a guest states about themselves, with no verdict attached, ready to become an on-screen card.

### An Investigator for Every Claim

Each claim then gets its own investigator: a durable workflow run with web search, page fetching, and three tools into the show's archive, one that searches by meaning, one for exact names and phrases, and one that reads a whole episode transcript. It searches the web first, two to four searches at most, and stops as soon as two independent sources agree. When a guest says "I said it right here last year," the verdict can point to the episode and the second.

The rules are blunt: no link and no number that did not come out of a tool. Every source must carry its publication date, month and year at the very least. If a search result does not show one, the investigator opens the page to find it, and a verdict that comes back without dates is sent back once to fill them in. Guessing a date is forbidden.

Live television does not wait for a stuck process, and neither does the system. Each attempt gets four minutes before it is retried, a sweep relaunches any check that dies mid-flight, and a claim that cannot be settled ends as "unverified" instead of spinning forever.

### Sources Have Ranks

Not every outlet is equal, and the station decided which ones count. Its leadership drew up a list of fifty outlets, each with its owner and a credibility score from one to five, and that list is written into every research prompt the system sends. Prefer the top two tiers. Never rest a number on a low-tier outlet alone: confirm it from a top-tier outlet or an official document, or say plainly that it is unconfirmed. Official documents, the Official Gazette, Banque du Liban circulars, ministry websites, and the original video, outrank any media. Twenty-eight of the fifty outlets have no website at all, so sources are matched by name as well as by address. Everywhere in the dashboard, each source carries a colored chip for its tier, so a producer can see at a glance what a verdict stands on.

### Six Verdicts and a Line to Whisper

Every claim lands on one of six verdicts: **true**, where the core fact and figure hold within about five percent; **mostly true**; **needs context**, literally true but misleading on its own, like a cherry-picked period or the wrong baseline; **misleading**; **false**; and **unverified**, which the investigator has to say out loud rather than guess.

With the verdict come a confidence score, two to five sentences of explanation, the exact correct wording whenever a claim is false, misleading, or missing context, up to six sources, and any archive moments. And one more thing, written for the pressure of a live control room: a summary of no more than 160 characters, short enough, in the words of its own instructions, for a producer to whisper to the presenter.

On the producer's screen, each claim is a card beside the transcript. Brief mode shows the verdict and the claim; detailed mode adds the explanation and the sources. Tapping the time rewinds the player to just before the words were said.

### Second Opinions and Hand Checks

Any verdict can be checked again from scratch by xAI Grok 4.6, a model from an entirely different family, and the card shows which engine reached it. Producers are not limited to what the extractor catches, either. They can select a few words in any transcript line to check just those, or type a claim straight in, and it goes through the same investigation, marked with the name of whoever asked.

### From Verdict to Screen

When a verdict holds up, one click sends it to the graphics: a draft card with the claim as it was said, the verdict badge, the correction or summary, and a source line with the outlet and the month. A claim that is still being checked cannot be sent. Colors follow the verdict: green for true, white and silver for the shades in between, crimson and red for misleading and false. The producer can still change the verdict before approving the card, and only then does it reach the operator's deck. Nothing a model concludes goes on air on its own.

### Checking Before the Show, Too

The same discipline runs through prep. The receipts ledger reads every episode a guest has appeared on, pulls out each promise and prediction, and checks them online in batches of eight: delivered, partly delivered, not delivered, or unclear. Topic questions are built on facts gathered and sourced up front, and every question names what it rests on. A dossier line without a citation or an archive second never appears, and the intro lists the facts it leans on, each with its source's tier. It all goes back to the rule from Rudy's early reels: find the direct quote or the primary document, or keep the number off the screen.

The machine does the legwork while the show is still on. The call is always a producer's.

## A Cast of Models

There is no single "AI" behind the show. There is a cast, and every model has one job:

- **The ears: Google Gemini 3.5 Transcribe.** It turns every episode into text with a timestamp on every word and a label on every speaker, and it handles Lebanese Arabic better than anything Rudy tried before it. In his tests it got through 25 minutes of audio in about 44 seconds. Its live sibling, **Gemini 3.5 Transcribe Live**, listens to the broadcast as it happens. The direct line to Google only ever carries audio.
- **The writer: Anthropic Claude Opus 5.** Everything that has to sound like the show goes through it: Marcel's questions, the intro, the contradictions in a guest's record, the text on every on-air card, and the AI desk's verdicts.
- **The quick hands: Google Gemini 3.7 Flash.** The fast calls, over and over through the night: which moments deserve a reel, which frame makes the best cover, where the speaker is standing so a vertical crop can follow them, who said which line, and the English and French subtitles.
- **The fact-checker:** a web-connected model with live web search and fetch tools and the show's own archive at hand, for live fact-checks, receipts, and dossiers. When a verdict needs a second opinion, **xAI Grok 4.6**, from a different family of model entirely, checks the same claim from scratch.
- **The closer: Google Gemini 3.1 Pro.** After the show, one call reads the whole broadcast and names every speaker turn.
- **The librarian: Cloudflare AI Search.** It indexes the archive for meaning, not just words, and its MCP endpoint hands the archive agent its tools.

Every language model is reached through OpenRouter, so swapping one for a better one is a one-line change, not a rewrite.

## More From Show Night

### Before Air: The Dossier Every Guest Dreads

Prep builds a file on every guest: verbatim quotes from their past appearances on the show, each playable at the exact second, what they have told the media over the years, and where they contradict themselves, then versus now. Marcel's questions are drafted in his own voice, learned from 489 archived episodes of his real intros and questions. It all lands in one shared briefing file that prints to PDF or exports to Word.

### Listening Live

The broadcast audio streams into Gemini Live. Waiting for the model to decide when a sentence has ended is too slow for live television, so the system listens for the breath: after twelve seconds of speech it cuts at the next short pause, and never lets a turn run past forty-five. The live model does not know who is speaking, so a producer does, with one key press, 1 to 9, at every change of speaker. Later, Gemini 3.7 Flash fills in whatever was missed, and a producer's tag always wins over the model's guess.

### Graphics That Belong in the Studio

The on-air graphics are a web page running inside vMix as a transparent browser source, but you would never know it. The guest lower thirds were rebuilt from the studio's own Vizrt scenes, down to their geometry, colors, and animation timing, and the show's logo bug, red sweep and all, is drawn by the same page. There are 51 designs, from fact-check verdicts to then-and-now contradictions and full-screen charts. Claude condenses every card to the show's word budgets, a producer approves it, the vMix operator sees only the approved deck and presses Air, and Marcel follows along on an iPad showing what is in preview and what is on air. A suite of 68 automated checks renders the real graphics with the real fonts at broadcast resolution, so a line that would overflow is caught in testing, not on television.

### Thousands of Votes in a Few Minutes

When a poll goes on screen, a QR code sends the audience to the show's own voting site, and thousands of phones hit it within minutes. That service runs on its own, completely separate from the dashboard. A Cloudflare Turnstile check keeps bots out without a puzzle, each vote drops onto a queue, and every second a batch of up to a hundred is written to ClickHouse, acknowledged only once it is safely stored. Counting is first-vote-wins per device, so a double tap or a retry never inflates a total, and the bars on screen trail the real count by only a few seconds.

Live traffic still had a lesson for us. One Thursday, the logs showed a single phone voting 71 times: the iPhone's built-in code scanner opens pages in a mode that forgets cookies, so every rescan looked like a new phone. Within two days a per-network cap was in place, and every vote now needs a fresh bot check.

### The AI Desk: Who Answered, Who Dodged, Who Interrupted

At the break, the AI desk reads the last stretch of the show and drafts full-screen graphics for every guest: which questions they answered, half answered, or deflected, with the quote that proves it, their tone, and their strongest line. When enough of the transcript is tagged, it adds the floor itself: who spoke longest, the longest uninterrupted run, and who cut in on whom. Marcel is never counted. A producer can change every word and every number before any of it goes near the operator.

### A Reel Factory That Never Sleeps

While the show is on, the reel factory wakes up every three minutes and reads the last fifteen. Gemini 3.7 Flash, thinking at its highest setting, looks for moments that hold a complete idea, at least nine seconds and ideally fifteen or more. Each pick becomes a durable job:

1. Cut the moment from the live recording in a media container running ffmpeg and a headless browser.
2. Transcribe the cut itself, for word-perfect timing on its own clock.
3. Render the captions in the browser as transparent images, two lines at most with the key words in red, because burning Arabic subtitles directly scrambles right-to-left text.
4. Burn captions, the show's lockup, and the episode line in a single encoding pass.
5. Let a vision model pick, from eight frames, the one where the speaker looks straight into the camera for the cover.
6. Transcribe the finished file once more and check it before anyone sees it.

The reel then waits for a person to approve it. One click rebuilds it as a wide 16:9 version, or reframes the vertical crop to follow whoever is speaking, and English and French subtitles are a click away.

### After the Credits

Once the episode is published, the team re-transcribes the full broadcast from our [Hosted Media Services](/hms), and a single Gemini 3.1 Pro call names every speaker turn from the producers' live tags. The episode then joins the archive, the show's memory: ask it a question in plain language and it plays you the sentence, count how many times a word was said on air year by year, or cut any moment in the export studio.

## The Plumbing

Everything runs on one stack, Bun and TypeScript throughout, with a Hono API and a Next.js dashboard on Cloudflare: Workers for the app, D1 for the data, R2 for the media, Workflows for anything that takes more than a few seconds, Containers for ffmpeg and the headless browser, Durable Objects and Queues for the votes, Stream for the live recording, and AI Search for the archive, with ClickHouse counting the votes and our [Hosted Media Services](/hms) serving the episodes. Every model call is a saved step, so a dropped connection resumes where it left off, and a test suite of more than two hundred files has to pass before anything ships.

Rudy's original version ran on Python, a local Whisper model, and one graphics card, and his explainers were made with Higgsfield's image and video models and Claude Code.

## The Rules That Don't Bend

However smart the models get, three rules stay fixed. **A person approves everything** before it airs or goes online. **Every source is ranked and cited**, and a claim that rests on a weak source alone is not cleared for air. And **no one's name is ever guessed**: the models suggest, a person confirms.

The models draft, search, and suggest. The team decides.

## Why It Matters

P Foundation exists to support an open internet and free journalism. Lebanese newsrooms do outsized work with small teams, and AI can give them the reach of a much bigger one, but only if the journalists stay in charge.

The best thing we did on this project was wait. We let the people who make the show decide what they needed, build it themselves, and prove it on real episodes, and only then did we help it grow. That is how we think AI should enter a newsroom, and it is how we plan to keep working.

Thank you, Rudy Hachache: the ideas, the first version, and the rules are yours. And thank you to the whole Sar El Waet team for trusting us with your show. If your newsroom wants to bring in AI on its own terms, [talk to us through MediaGuard](/apply?program=mediaguard).
