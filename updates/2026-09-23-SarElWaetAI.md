---
title: "It's About Time: Lebanon's Most-Watched Political Show Goes AI"
description: When Sar El Waet decided to bring AI into Lebanon's most-watched political talk show, the ideas and the first working tools already existed, dreamed up and built by Rudy Hachache from inside the show's own team. Our job was to listen, help, and make it hold up on live television. Here is how it came together.
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

It has been a genuine collaboration. Rudy never stopped building, and more than a hundred of the roughly six hundred changes to the codebase are his, including the groundwork for moving it to Cloudflare, the promises ledger, the on-air graphics, and the AI desk. Our share was mostly what viewers never see: one codebase instead of three, long jobs that survive a dropped connection, accounts and permissions for every producer, a public voting service built for a national audience voting at once, a dashboard that works on a phone, and the episode archive streamed from our [Hosted Media Services](/hms). Both sides built with AI coding agents, just as Rudy had since his very first reel.

## What Show Night Looks Like Now

**Before air**, prep builds a dossier on every guest: verbatim quotes from their past appearances on the show, each playable at the exact second, what they have told the media over the years, and where they contradict themselves, then versus now. A receipts ledger answers the question every guest dreads: what did you promise on this show, and did it happen? Marcel's questions are drafted in his own voice, learned from 489 archived episodes, and every question points to the quotes and sourced facts behind it.

**On air**, a live transcript follows the conversation, and claims are checked against the web and the show's own archive while the show is still running. What a guest just promised or declared can become an on-screen card in a few clicks, trimmed to the show's word limits. At home, viewers vote from their phones through a QR code, and the results appear on screen live. At the break, the AI desk turns the last segment into graphics: who answered, who deflected, the tone of each guest, and who held the floor the longest.

**After air**, the sharpest moments come back as clips, cut on the word, captioned in Arabic with the key words in the show's red, and ready in vertical or wide formats, with English and French subtitles when needed. Any producer can pull a moment from tonight or from years of archive, fix a caption, pick a thumbnail, and export. And the archive answers questions in plain language: ask it something, and it plays you the sentence.

## Under the Hood

One stack, no exceptions: Bun and TypeScript, a Hono API, and a Next.js dashboard on Cloudflare (Workers, D1, R2, Workflows, Containers, Stream, and AI Search). Each model has one job, and any of them can be swapped by changing a single setting:

- **Listening:** Google Gemini 3.5 Transcribe for episodes, with word-level timestamps and speaker diarization, and Gemini 3.5 Transcribe Live on air.
- **Writing:** Anthropic Claude Opus 5, for Marcel's questions, the intros, the on-air cards, and the AI desk.
- **Quick calls:** Google Gemini 3.7 Flash, for picking clips and cover frames, keeping the speaker in a vertical crop, naming speakers, and translating subtitles.
- **Research and fact-checking:** a web-connected model through OpenRouter, with xAI Grok 4.6 on call for a second opinion.

Rudy's original version ran on Python, a local Whisper model, and one graphics card, and his explainers were made with Higgsfield's image and video models and Claude Code.

## The Rules That Don't Bend

However smart the models get, three rules stay fixed. **A person approves everything** before it airs or goes online. **Every source is ranked and cited** against a list of fifty outlets drawn up by the station's own leadership, and a claim that rests on a weak source alone is not cleared for air. And **no one's name is ever guessed**: the models suggest, a person confirms.

The models draft, search, and suggest. The team decides.

## Why It Matters

P Foundation exists to support an open internet and free journalism. Lebanese newsrooms do outsized work with small teams, and AI can give them the reach of a much bigger one, but only if the journalists stay in charge.

The best thing we did on this project was wait. We let the people who make the show decide what they needed, build it themselves, and prove it on real episodes, and only then did we help it grow. That is how we think AI should enter a newsroom, and it is how we plan to keep working.

Thank you, Rudy Hachache: the ideas, the first version, and the rules are yours. And thank you to the whole Sar El Waet team for trusting us with your show. If your newsroom wants to bring in AI on its own terms, [talk to us through MediaGuard](/apply?program=mediaguard).
