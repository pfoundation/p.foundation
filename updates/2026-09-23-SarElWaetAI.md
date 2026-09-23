---
title: "It's About Time: Lebanon's Most-Watched Political Show Goes AI"
description: When Sar El Waet decided to bring AI into Lebanon's most-watched political talk show, the ideas and the first working tools already existed, dreamed up and built by Rudy Hachache from inside the show's own team. Our job was to listen, help, and make it hold up on live television. Here is how it came together, and a look inside the machine, from the models and the live reel factory to on-air graphics and thousands of audience votes.
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

## A Cast of Models

There is no single "AI" behind the show. There is a cast, and every model has one job:

- **The ears: Google Gemini 3.5 Transcribe.** It turns every episode into text with a timestamp on every word and a label on every speaker, and it handles Lebanese Arabic better than anything Rudy tried before it. In his tests it got through 25 minutes of audio in about 44 seconds. Its live sibling, **Gemini 3.5 Transcribe Live**, listens to the broadcast as it happens. The direct line to Google only ever carries audio.
- **The writer: Anthropic Claude Opus 5.** Everything that has to sound like the show goes through it: Marcel's questions, the intro, the contradictions in a guest's record, the text on every on-air card, and the AI desk's verdicts.
- **The quick hands: Google Gemini 3.7 Flash.** The fast calls, over and over through the night: which moments deserve a reel, which frame makes the best cover, where the speaker is standing so a vertical crop can follow them, who said which line, and the English and French subtitles.
- **The researcher:** a web-connected model with live web search and fetch tools and the show's own archive at hand, for dossiers, receipts, and fact-checks. When a verdict needs a second opinion, **xAI Grok 4.6**, from a different family of model entirely, checks the same claim from scratch.
- **The closer: Google Gemini 3.1 Pro.** After the show, one call reads the whole broadcast and names every speaker turn.
- **The librarian: Cloudflare AI Search.** It indexes the archive for meaning, not just words, and its MCP endpoint hands the archive agent its tools.

Every language model is reached through OpenRouter, so swapping one for a better one is a one-line change, not a rewrite.

## Inside Show Night

### Before Air: The Dossier Every Guest Dreads

Prep builds a file on every guest: verbatim quotes from their past appearances on the show, each playable at the exact second, what they have told the media over the years, and where they contradict themselves, then versus now. A receipts ledger reads every episode the guest has been on, pulls out each promise, and checks it against what actually happened. Marcel's questions are drafted in his own voice, learned from 489 archived episodes of his real intros and questions, and every question points to the quotes and sourced facts it rests on. It all lands in one shared briefing file that prints to PDF or exports to Word.

### Listening Live

The broadcast audio streams into Gemini Live, and the transcript scrolls across the producers' screens as the guests speak. Waiting for the model to decide when a sentence has ended is too slow for live television, so the system listens for the breath: after twelve seconds of speech it cuts at the next short pause, and never lets a turn run past forty-five. The live model does not know who is speaking, so a producer does: one key press per speaker change, 1 to 9, and every new line is tagged until the next press. At the break, Gemini 3.7 Flash fills in whatever was missed, and a producer's tag always wins over the model's guess.

### Fact-Checking While the Guest Is Still Talking

As the transcript grows, checkable claims are pulled out in batches: numbers, events, quotes, history, and laws, anything a viewer could look up. Each claim gets its own durable workflow that searches the web, reads the sources, and searches the show's own archive for what was said on this program before. The verdict comes back with a confidence score, a correction when one is needed, and the outlet, link, and date of every source, each ranked against the station's own credibility list. A producer can also check any line on demand, or type a claim in by hand. The same pass also catches **moments**: a promise, a position, a number a guest just stated about themselves. One click turns any of them into an on-screen card.

### Graphics That Belong in the Studio

The on-air graphics are a web page, running inside vMix as a transparent 1920 by 1080 browser source, but you would never know it. The guest lower thirds were rebuilt from the studio's own Vizrt scenes, matching their geometry, colors, and animation timing, and the show's logo bug, red sweep and all, is drawn by the same page, with every other graphic measured to stay clear of it. There are 51 designs, from fact-check verdicts and big numbers to then-and-now contradictions and full-screen charts, each one a single file.

Every card is written to fit. Claude condenses it to the show's word budgets, fourteen words and a nine-word second line for a lower third, and keeps the original a click away. A producer approves each card on the control page, the vMix operator sees only the approved deck and presses Air, and Marcel follows along on an iPad showing what is in preview and what is on air. A suite of 68 automated checks renders the real graphics with the real fonts at broadcast resolution, so a line that would overflow is caught in testing, not on television.

### Thousands of Votes in a Few Minutes

When a poll goes on screen, a QR code sends the audience to the show's own voting site, and thousands of phones hit it within minutes. That service runs on its own, completely separate from the dashboard, with no access to anything but votes. A Cloudflare Turnstile check keeps bots out without a puzzle. Each vote drops onto a queue, and every second a batch of up to a hundred is written to ClickHouse in one insert, acknowledged only once it is safely stored. Counting is first-vote-wins per device, so a double tap, a retry, or a slow connection never inflates a total, and the bars on screen trail the real count by only a few seconds.

Live traffic still had a lesson for us. One Thursday, the logs showed a single phone voting 71 times. The iPhone's built-in code scanner opens pages in a mode that forgets cookies, so every rescan looked like a new phone. Within two days a per-network cap was in place, enforced by a small Durable Object for every poll and network, and the voting page learned to insist on a fresh bot check for every single vote.

The poll can even show where the guests stand: each guest's photo pops onto the answer they picked, right on the results bars.

### The AI Desk: Who Answered, Who Dodged, Who Interrupted

At the break, a producer picks the stretch of the show and tonight's guests, and the AI desk reads it. For every guest it drafts which questions they answered, half answered, or deflected, the quote that proves it, their tone on a five-point scale, a contradiction from the same night, and their strongest line. If enough of the transcript is tagged, it adds a fourth card on the floor itself: how long each guest spoke, their longest uninterrupted run, and how often they cut in on someone else. Marcel is never counted. The layout follows the table: one guest gets a solo card, two go head to head, a panel gets a grid. A producer can change every word and every number before any of it goes near the operator.

### A Reel Factory That Never Sleeps

While the show is on, the reel factory wakes up every three minutes and reads the last fifteen. Gemini 3.7 Flash, thinking at its highest setting, looks for moments that hold a complete idea, at least nine seconds, ideally fifteen or more. Each pick becomes a job in a durable workflow:

1. Find the moment in the live recording, and cut it in a media container running ffmpeg and a headless browser.
2. Transcribe the cut itself, for word-perfect timing on its own clock.
3. Lay out the captions, two lines at most with the key words in the show's red, and render them in the browser as transparent images, because burning Arabic subtitles directly scrambles right-to-left text.
4. Burn captions, the show's lockup, and the episode line in a single encoding pass.
5. Show a vision model eight frames from inside the cut and let it pick the one where the speaker looks straight into the camera for the cover.
6. Transcribe the finished file one more time and check it before anyone sees it.

The reel then waits on the review board for a person to approve it, reject it, or leave a note. With one click it can be rebuilt as a wide 16:9 version, or reframed so the vertical crop follows whoever is speaking: the vision model looks at a frame every two seconds, the crop tracks the speaker, and a wide studio shot fills any stretch where nobody is on screen. Captions can be corrected line by line and burned again, with English and French versions a click away. Producers can switch the automatic suggestions off for the night, and after the show every clip cuts from the saved recording instead of the live one.

### After the Credits

Once the episode is published, the team runs a cleaner pass. It re-transcribes the full broadcast from our [Hosted Media Services](/hms) in ten-minute chunks, then makes a single Gemini 3.1 Pro call that names every turn using the producers' live tags, and the episode joins the searchable archive with confirmed names.

That archive is the show's memory. Ask it a question in plain language and an agent searches it and plays you the sentence. Search it word by word, in Arabic, English, or Arabizi. Count how many times a word, a name, or a theme was said on air, year by year, with no model involved at all. Let the hunt pair a story from this week's news with a moment from years ago, or cut any moment in the export studio: set In and Out, fix captions, mark a word in red, pick a thumbnail and one of three suggested headlines, and export.

## The Plumbing

Everything runs on one stack, Bun and TypeScript throughout, with a Hono API and a Next.js dashboard on Cloudflare: Workers for the app, D1 for the data, R2 for the media, Workflows for anything that takes more than a few seconds, Containers for ffmpeg and the headless browser, Durable Objects and Queues for the votes, Stream for the live recording, and AI Search for the archive, with ClickHouse counting the votes and our [Hosted Media Services](/hms) serving the episodes. Every model call is a saved step, so a dropped connection resumes where it left off instead of starting over, and a test suite of more than two hundred files has to pass before anything ships.

Rudy's original version ran on Python, a local Whisper model, and one graphics card, and his explainers were made with Higgsfield's image and video models and Claude Code.

## The Rules That Don't Bend

However smart the models get, three rules stay fixed. **A person approves everything** before it airs or goes online. **Every source is ranked and cited** against a list of fifty outlets drawn up by the station's own leadership, and a claim that rests on a weak source alone is not cleared for air. And **no one's name is ever guessed**: the models suggest, a person confirms.

The models draft, search, and suggest. The team decides.

## Why It Matters

P Foundation exists to support an open internet and free journalism. Lebanese newsrooms do outsized work with small teams, and AI can give them the reach of a much bigger one, but only if the journalists stay in charge.

The best thing we did on this project was wait. We let the people who make the show decide what they needed, build it themselves, and prove it on real episodes, and only then did we help it grow. That is how we think AI should enter a newsroom, and it is how we plan to keep working.

Thank you, Rudy Hachache: the ideas, the first version, and the rules are yours. And thank you to the whole Sar El Waet team for trusting us with your show. If your newsroom wants to bring in AI on its own terms, [talk to us through MediaGuard](/apply?program=mediaguard).
