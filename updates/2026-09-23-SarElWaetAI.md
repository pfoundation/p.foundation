---
title: "It's About Time: When Sar El Waet Decided to Bring AI On Air"
description: When the team behind Lebanon's most-watched political talk show decided to integrate AI, the ideas and the first working tools were already theirs, brainstormed and brought to life by Rudy Hachache. Our role was to listen, help, and make that implementation hold up on show night. This is how it came together, what the team now uses before, during, and after every episode, and the technology underneath.
slug: SarElWaetAI
authors: jud
hide_table_of_contents: false
date: 2026-09-23T17:00:00Z
---

# It's About Time: When Sar El Waet Decided to Bring AI On Air

Every Thursday night, Lebanon watches Sar El Waet (صار الوقت), Marcel Ghanem's political talk show on MTV Lebanon and the most-watched political program in the country. The name means "it's about time." This summer, the people who make the show decided it was time for AI.

When they came to us, our first reaction was excitement. Our second was caution. A political talk show is not a place to experiment on an audience. Every name on screen, every number, and every clip that leaves the building carries the show's credibility, and in Lebanon that credibility is hard-won. So we made one decision early, and it shaped everything that followed: the producers would lead, and we would follow.

<!--truncate-->

## It Started With Rudy

None of this began with us. The ideas, and the first working versions of almost everything described here, came from Rudy Hachache, from inside the show's own team.

In July, Rudy started producing animated explainer reels for the show with AI image and video tools. Then he put together a pitch for the station's leadership: a twenty-two slide deck, in English and in Lebanese Arabic, on how AI could strengthen the show before air, on air, and after air. The deck had a live poll built in. The people in the room scanned a QR code and voted from their phones, a small demo that would later grow into the show's on-air audience pulse.

Rudy did not stop at slides. In late August, he started building the real thing on a single desktop PC: a transcription pipeline, a reel factory, an archive search, an episode prep station, and a review station where the team approved or rejected every clip. Within days, five of the deck's ideas were working: guest dossiers, question packs with an intro writer, archive search, hands-free clips, and the audience pulse. From one three-hour episode, the reel factory produced 22 clips, each checked by transcribing the finished file again before anyone saw it.

The archive search alone shows how much of the show's reality went into it. Lebanese viewers and producers type Arabic, English, and Arabizi, the Latin-letter Arabic of phone keyboards, and speakers on air pronounce words the Lebanese way, not the way a textbook spells them. Rudy's search folds all of that together, so a producer can type "mitl heik" and land on the exact second the phrase was said.

What struck us most, though, was not the code. It was the rules. By the time we looked closely, Rudy and the team had already written down, from experience, what a Sar El Waet clip must be:

1. **A complete idea.** A clip opens and closes inside the cut and covers the whole thought, never just the money quote.
2. **Cut on the word.** Hard cuts on exact words, no dissolves, and no stray syllables from the sentence before.
3. **Two lines, at most.** Captions never stack more than two lines on screen.
4. **The speaker is visible.** Whoever is talking is on screen from the first frame.
5. **One clock.** Timestamps come from transcribing the video itself, never a separate audio master, because the two clocks drift apart over a three-hour broadcast.
6. **Verified before delivery.** Every finished reel is transcribed again and checked before it reaches the team.
7. **A person decides.** Nothing goes on air or online without a human approving it.

Some of these came from long nights. The standard subtitle renderer scrambled right-to-left Arabic when captions carried colored keywords, so captions are drawn in a browser and composited as images. A figure challenged by a commenter led to a standing rule that no number goes on screen on the strength of a single outlet's paraphrase. None of this was theory. It was the show's editorial judgment, earned one correction at a time.

## Letting the Producers Build What They Wanted

We could have arrived with a product. Tools for newsrooms are much of what we build, from [OpenNRCS](/opennrcs) to [AI dubbing](/dubbing). Instead, we waited. Before engaging, we wanted the producers to have built the thing they expected to use, the way they expected to operate it, and to have run it on real episodes. Only then would we know what we were actually being asked to improve.

That patience mattered more than any technical choice we made later. Early on, a cloud version of the review queue was built and then rolled back, because the team wanted decisions made at the show's own machine. The stations Rudy designed, review, archive, and prep, are still the backbone of the dashboard. When the dashboard was later redesigned, the producers decided that its buttons and menus would speak English while everything the team and the models produce stays in Arabic, that on-screen graphics would match the studio's existing Vizrt scenes exactly, and that a producer approves every graphic while the vMix operator only takes it to air.

The editorial rules above were not replaced with best practices of our own. They were turned into code, so the software enforces what the producers decided. The complete-idea rule and a nine-second floor sit in the prompts and the validators, and the builder refuses any cut or finished file under that floor. The human gate sits in front of anything that airs or publishes.

The way requests reach the code follows the same principle. Producers file what they need directly, in the language they think in, Arabic, English, or Arabizi. The first reply is always one question, in the same language: is this a problem with something that exists, or something new the system should do? A fix is reproduced, fixed, covered by a test, and explained back in plain words: what was broken, what changed, and how to check it. A new feature gets a short design in plain language and waits for a yes before any code is written. More than forty requests have been tracked since mid-September, and all but a handful have shipped, from a transcript line clipped on a tablet screen to guest lower thirds that had to match the studio's own graphics exactly.

## Our Part: Help, Harden, Hand Back

Our job was to help that implementation hold up on show night. Rudy's first version ran as three separate stations on one PC, reachable by the rest of the team through a tunnel with a new address every run, and only while that PC stayed switched on. We helped bring it together into one platform the whole team can reach from the studio, the control room, or a phone, while keeping everything Rudy had designed.

The work was shared from the start, and it still is. Rudy kept building in the same codebase throughout. More than a hundred of its roughly six hundred changes are his own, including the groundwork for running it on Cloudflare, the ledger that checks guests' past promises, the redesigned on-air graphics, the AI desk, and, most recently, a counter for how many times any word has been said on air. Both sides worked with AI coding agents, as Rudy had from his first reel.

What we contributed was mostly the part nobody sees on screen:

- **One codebase.** The three Python stations and the pitch demos became a single TypeScript codebase: one API, one dashboard, one pipeline.
- **Work that survives.** The live transcription session recovers on its own, and fact-checks, prep research, and reel builds run as durable workflows, with every model call a persisted step, so a dropped connection or a restart never loses a producer's work.
- **Accounts and accountability.** Every producer has an account, every page has its own read and write permissions, every request is validated, and every action in the activity log is tied to the account that made it.
- **A vote the country can join.** The audience poll became an isolated public service, protected against automated voting and built to take a national audience's votes during a live broadcast.
- **The rest of the plumbing.** A full dashboard rebuild that works on phones, a clip export studio, a library of on-air graphic designs, a shared catalogue of the people who appear on the show, a test suite that must pass before every deploy, and the episode archive served through our [Hosted Media Services](/hms).

## One Week of Sar El Waet, With AI

### Before Air

Prep keeps one versioned plan per episode, so several producers can work on it at once without overwriting each other. It suggests this week's topics from sources no older than two weeks, proposes guests, and builds a dossier on each one. The dossier reads the guest's past appearances on the show and pulls verbatim quotes with the exact second they were said, gathers what the guest has told the media over the years, and sets then against now. The receipts ledger checks what a guest promised on the show against what actually happened.

Marcel's questions are drafted in his own style, learned from the opening monologues and the questions of 489 archived episodes, and every question names the quotes, records, or sourced facts it rests on. The intro draft lists the facts it relies on and its reading time. Producers pull all of it into a shared briefing file that prints to PDF or exports to Word, and any line anchored to an archive moment can be cut into a clip from there.

### On Air

During the broadcast, a live transcript follows the conversation. Claims are extracted and checked against the web and against the show's own archive, each verdict with its sources. Moments worth a graphic, a promise a guest just made, a position, a number, surface for the producer, who can turn them into on-screen cards that the writing model condenses to the show's word budgets. The audience votes from their phones through a QR code on screen, with results drawn live over the broadcast.

At the break, the AI desk reads the segment and drafts full-screen graphics: which questions each guest answered and which they deflected, the tone of each guest, their strongest lines, and who held the floor for how long. A producer reviews and can edit every value before any of it reaches the operator.

### After Air

Clip suggestions come from the live transcript and the archive. Each is cut, captioned in Arabic with keywords in the show's red, verified by transcribing it again, and delivered for review in vertical and wide formats, with an option for the frame to follow the speaker, and with English and French subtitles. The export studio lets any producer cut a moment from tonight's episode or from years of archive, edit captions line by line, and pick a thumbnail and a headline. The archive itself answers questions in plain language, finds any phrase word by word, and plays the exact sentence.

## The Technology Underneath

Everything runs on one stack: Bun and TypeScript throughout, a Hono API, and a Next.js dashboard, all served from Cloudflare, with the hours-long live transcription session on a dedicated host. Two principles run through the design. First, each model does one job: Gemini listens, and other models read, research, and write. Second, models are a setting, not a rewrite. Language models are reached through OpenRouter, so any of them can be swapped by changing one value.

| Job                                                                          | What does it                                                                                                                                               |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Episode transcription                                                        | Google Gemini 3.5 Transcribe, with word-level timestamps and speaker diarization                                                                           |
| Live transcription                                                           | Gemini 3.5 Transcribe Live, streamed over a WebSocket                                                                                                      |
| Research and fact-checking                                                   | A web-connected research model through OpenRouter, with web search and fetch tools and the show's archive as tools, and xAI Grok 4.6 for a second opinion  |
| Writing: questions, intros, on-air cards, AI desk                            | Anthropic Claude Opus 5                                                                                                                                    |
| Clip picks, cover frames, speaker-following crops, speaker naming, subtitles | Google Gemini 3.7 Flash                                                                                                                                    |
| Post-show speaker naming                                                     | Google Gemini 3.1 Pro                                                                                                                                      |
| Semantic archive search                                                      | Cloudflare AI Search, with its MCP endpoint as the archive agent's tools                                                                                   |
| Platform                                                                     | Cloudflare Workers, D1, R2, Workflows, Containers running ffmpeg and Playwright, Durable Objects, Queues, Stream, and Turnstile, with ClickHouse for votes |
| Episode archive                                                              | P Foundation [Hosted Media Services](/hms): signed streams, captions, and storyboards                                                                      |
| Studio                                                                       | vMix browser sources, with graphics matched to the studio's Vizrt scenes                                                                                   |

Rudy's first version ran on Python, local Whisper transcription on the PC's graphics card before a switch to Gemini, ffmpeg, Playwright, and Vercel for the pitch demos. His animated explainers use Higgsfield's image and video models, including Seedance, Kling, GPT Image, and Nano Banana, with ElevenLabs and HeyGen for voice and avatar work, and Claude Code to orchestrate the whole pipeline.

## Rules That Do Not Bend

The technology is the easy part to describe. What makes it safe to use on a political show is a short list of rules that no setting can switch off:

- **A human gate before anything airs or publishes.** Nothing goes out on its own.
- **Sources are ranked and cited.** Every web source carries a credibility tier from a list of fifty outlets drawn up by the station's own leadership, along with its outlet, link, and date. A claim that rests only on a low-tier outlet is not cleared for air until a high-tier outlet or an official document confirms it.
- **Speaker names are never guessed.** The models suggest; a person confirms every name, from a shared catalogue of the people who appear on the show.
- **Timestamps come from the video itself,** and every clip is verified by transcribing it again.

These rules keep the journalism where it belongs, with the journalists. The models draft, search, and suggest. The team decides.

## Why It Matters to Us

P Foundation exists to support an open internet and free journalism. Lebanese newsrooms do demanding work with small teams, and AI can give a small team the reach of a much larger one, but only if the people who make the journalism stay in charge of it.

The most useful thing we did on this project was to wait. We let the people who make the show decide what they needed, build it themselves, and run it on real episodes, and only then did we help it grow into something that holds up on show night. We think that is the right way for AI to enter a newsroom, and it is how we intend to keep working.

Our thanks go to Rudy Hachache, whose ideas and first implementations are the foundation of everything described here, and to the whole Sar El Waet team for trusting us with their show. If your newsroom is exploring AI and wants to do it on its own terms, we would like to hear from you through [MediaGuard](/apply?program=mediaguard).
