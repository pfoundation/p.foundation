---
id: etiquette
title: Etiquette
sidebar_position: 2
description: Industry best practices and expected behaviors for OpenIX participants.
---

All participants should follow industry best practices for peering. This includes:

- Keeping contact information current so that other networks can reach out to request peering or address issues.
- Responding to peering requests in a reasonable timeframe, even if the answer is a polite refusal (especially for networks with selective policies).
- Advertising only their own routes or those of their customers (no route leaks of prefixes that are not authorized).
- Accepting and honoring BGP prefix length constraints (for example, if the exchange has a maximum prefix length filter, e.g., no more specific than /24 for IPv4, /48 for IPv6 on the route servers, participants should abide by those when advertising).
- Setting BGP **max-prefix** limits on all peering sessions to protect against accidental route flooding. OpenIX may recommend specific max-prefix values (for example, slightly above the current total routes on the exchange) and will by default apply max-prefix limits on route server sessions for each participant to prevent full-table leaks.
- Not pointing default routes or using the IX as a transit hub. Participants should not use a peer as a “default” route to reach the entire internet; each peering relation should be used only for the routes explicitly exchanged. Using the IX to transit traffic to third-party networks (that are not also participants and in mutual agreement) is against policy. In practice, this means if Network A is peering with Network B at OpenIX, A should only send traffic to B for prefixes B (or B’s customers) have announced at OpenIX. A should not forward traffic from B to some other non-connected network C via the exchange. Similarly, using the exchange to carry traffic between two of your own sites (as a backhaul) is not permitted unless explicitly arranged as a private service with OpenIX (see Private Interconnects under Services). The public peering VLAN is intended for inter-network traffic exchange, not as a transport network for other purposes.
