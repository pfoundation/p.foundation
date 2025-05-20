---
id: performance
title: Performance
sidebar_position: 2
description: Low-latency, wire-speed switching fabric characteristics and zero packet loss commitment for the exchange under normal conditions.
---

As an Ethernet switching fabric contained within a single metro area, the latency added by OpenIX is extremely low (typically < 0.1 milliseconds across the fabric).

OpenIX’s internal network is essentially wire-speed, and we strive for **zero packet loss** within the exchange under normal operating conditions. The only time packet loss might occur within the IX is if a participant’s port is oversubscribed (sending more traffic than its capacity, causing its own packets to drop), or in a fault scenario (like a broadcast storm which we actively police).

The design goal is a non-blocking architecture, so participants can exchange traffic with each other up to their port limits without induced loss or jitter by the exchange.
