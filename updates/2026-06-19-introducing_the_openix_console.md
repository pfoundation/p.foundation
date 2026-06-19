---
title: 'OpenIX Console: Understand Every Bit That Crosses Your Port'
description: One login where an OpenIX member sees its own traffic, the peers it exchanges with, and the caches keeping it local, the visibility a network usually only gets by building its own analytics stack.
slug: IntroducingOpenIXConsole
authors: jud
image: https://assets.p.foundation/assets/e045524e-e0ee-40db-8564-c2da4032556b
hide_table_of_contents: false
date: 2026-06-19T17:00:00Z
---

import Figure from '@site/src/components/Figure/Figure';

# OpenIX Console: Understand Every Bit That Crosses Your Port

A little over a year after we [announced OpenIX Beirut](/updates/IntroducingOpenIXBeirut), and with the exchange fully operational since **October 2025**, OpenIX has reached its first milestone: **39 networks** are now connected and trading traffic locally instead of hairpinning through another continent. The exchange has gone from a launch announcement to a working piece of Lebanon's internet, carrying a large share of the country's traffic within local reach.

Reaching that milestone surfaced the next need. An exchange has always lived at the edges of a few disconnected systems: a cable in a rack, a spreadsheet of allocated addresses, a separate analytics login, and an email thread with the NOC for every change. Today we are closing that gap. We are introducing the **OpenIX Console**, a single home where every member network sees its connection, watches its traffic, and runs the exchange the way it actually uses it.

<!--truncate-->

## A Member's Home at the Exchange

The console builds on the foundation that IXP Manager has offered for years, the kind of member portal an exchange like ours runs on, and takes it further toward one goal: visibility. Where a traditional portal tells a member what it is connected to, the OpenIX Console shows a member what is actually happening on its connection, in language a network operator reads at a glance rather than in raw configuration.

Everything a member needs sits behind one login: the shape of its connection, a live picture of its traffic and who it exchanges it with, and the caches keeping that traffic local. No second tool, no support ticket for a number that should already be on the screen.

## Your Connection, At a Glance

Every member opens to its own connection laid out clearly: the network's identity and peering policy up top, and below it each port with its speed, location, and addressing. The detail that used to live in a spreadsheet now lives on a page that updates with the exchange.

The routine changes a member used to email about are now a click. Updating a peering policy or a port's hardware address is a request a member raises directly from the console, and the exchange's operations team reviews and applies it. The member always sees where each request stands.

<Figure
  src="https://assets.p.foundation/assets/2953aa37-3ec5-4c12-b37a-cdcbc515fefa"
  alt="The OpenIX Console's realtime insights view, showing a member's live traffic across the exchange"
>
  <strong>Realtime insights.</strong> A member's traffic across the exchange, updating live as it flows, with each service breaking out by the load it carries.
</Figure>

## Understand Every Bit That Crosses Your Port

Insights is where the console earns its name. For the first time, a member sees its own traffic at the exchange the way the exchange sees the aggregate, drawn straight from the flow data and presented as a story rather than a dump:

- **Throughput over time**, inbound and outbound, with the peak and 95th-percentile numbers operators actually plan capacity around.
- **Who you exchange traffic with**, a ranked view of peers by volume, so a member can see at a glance where its traffic goes and spot the networks worth peering with more directly.
- **A live view of the exchange**, traffic flowing across the port in real time, refreshed as it happens, with the exchange's own services breaking out as they carry load.

This is the visibility a network usually only gets by standing up its own analytics stack. At OpenIX it comes with the port.

<Figure
  src="https://assets.p.foundation/assets/f9d3485a-1071-4ef3-bacd-393d660fbd69"
  alt="The OpenIX Console's peer traffic view, ranking the networks a member exchanges with by volume"
>
  <strong>Peer traffic.</strong> The networks a member exchanges the most with,
  ranked by volume.
</Figure>

## Community Caches, Free of Charge

The console also shows a member exactly how much of its traffic the exchange is keeping local through the caches it runs on its own network: OpenCache, Microsoft, Valve, Ookla Speedtest, and others. These are served to members **free of charge** as a community effort, and the console makes their value visible, cache by cache, in the same traffic picture.

We are also working to bring **Premium Caches** alongside the community ones. It is on the way, and we will share the full details when it launches.

## Your Data Stays Yours

A member's traffic is some of the most sensitive data it has, and the console treats it that way. Each network sees only its own connection and its own traffic, never another member's, and the exchange never becomes a place where one network can study another. The console is built around that boundary from the ground up. Visibility into your network is for you alone.

That pairs with the other half of how OpenIX works. Every change a member makes is a request the exchange reviews and applies, which keeps OpenIX the single, neutral authority over what is actually configured, with the same terms and the same surface for every member.

## What's Coming

The console is the member's growing home at the exchange, and it is only getting richer. Already on the way: **Premium Caches**, **BGP session** management, **private interconnect** ordering, and operator tooling, including a **looking glass**, **IXP Watch** route-health monitoring, and **route** visibility, to bring a member's entire view of the exchange into one place.

If your network peers at [OpenIX](/OpenIX), the console is live for you today. If you are not yet connected, [talk to us](/contact) about joining the exchange.
