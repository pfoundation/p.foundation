---
title: Participant Responsibilities
description: Security responsibilities for participants, including keeping equipment updated, using strong authentication, and preventing security threats.
---

While OpenIX does its part, participants must also take steps to secure their interactions with the exchange:

- Ensure your devices (routers, switches connecting to OpenIX) are kept updated with security patches, especially for any known vulnerabilities that could be exploited (like a rogue packet causing crashes).
- Use strong authentication for any remote management of your equipment. You should assume the exchange (like any network) could be scanned or targeted, so secure your router’s login, use encryption (SSH instead of Telnet, etc.), and if possible, limit management access to your router through your own network (and not via the peering interface).
- Filter your BGP sessions – do not accept every route blindly from every peer. Use prefix filters or at least max-prefix to avoid being a victim of someone’s leak. Similarly, set up alarms on your side for route changes or traffic surges that seem abnormal. Security in an IXP context partly means being a good internet citizen: do not leak routes, do not spoof IP addresses (implement anti-spoofing measures on edges, though at an IXP typically we trust that each network is handling its own customers).
- Coordinate on security incidents: if you detect that you are under attack (say a volumetric DDoS), please inform OpenIX NOC, especially if the traffic is flowing through the exchange, so we can assist or at least be aware in case it impacts others. If you need to blackhole your own prefix to mitigate an attack, coordinate with OpenIX or use the BGP communities provided for blackholing (if supported by the route server and in the policy). OpenIX may facilitate blackholing (dropping traffic to a certain /32 or /128 at the exchange) to help mitigate large DDoS attacks – this is a service many IXPs provide, and OpenIX plans to support it as needed.
- Do not propagate security threats: e.g., if you are aware that a certain host in your network is infected and attacking others, remove it from the exchange until resolved. Also, do not send out any traffic that is obviously harmful (like malware distribution) knowingly.
