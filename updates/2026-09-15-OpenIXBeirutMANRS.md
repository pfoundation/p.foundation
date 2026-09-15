---
title: 'OpenIX Beirut Is Now MANRS Compliant'
description: OpenIX Beirut has joined the MANRS IXP Programme, the global standard for routing security at Internet Exchange Points. Lebanon's exchange now filters every route it carries against RPKI and IRR data, and commits to helping its members do the same on their own networks.
slug: OpenIXBeirutMANRS
authors: jud
image: https://assets.p.foundation/assets/ae3aeefb-9e06-4ef3-810c-dff4048b7527
hide_table_of_contents: false
date: 2026-09-15T17:00:00Z
---

# OpenIX Beirut Is Now MANRS Compliant

[OpenIX Beirut](/OpenIX/beirut) is now a participant in the [MANRS IXP Programme](https://manrs.org/participant/019eccd4-bc10-786e-abfa-a13830c4f843). MANRS, the Mutually Agreed Norms for Routing Security, is the global initiative that sets out what a responsible network or exchange must do to keep the internet's routing system honest, and its IXP Programme is the version of that standard written for Internet Exchange Points. From today, Lebanon's exchange is held to it, alongside the exchanges that carry much of the world's traffic.

The internet has no central authority that decides which network may announce which addresses. Every router takes the routes its neighbours give it largely on trust, and that trust is what route hijacks and leaks exploit. A single misconfigured announcement can pull a bank's traffic across a border, take a country's news sites offline, or blackhole a hospital's connectivity, and the network that caused it often never notices. MANRS exists because the fix is not one clever device but a set of practices everyone agrees to keep. For an exchange, where dozens of networks meet on one fabric, those practices matter more than anywhere else.

<!--truncate-->

## Why It Matters for Lebanon

OpenIX Beirut was built to keep Lebanon's traffic at home. A year and a half in, [39 networks](/OpenIX/beirut/networks) trade traffic across it, and a large share of what the country's users do each day now stays within local reach. That success raises the stakes. When most of a country's traffic meets at one exchange, a bad route announced there travels further and faster than it ever could through a dozen separate transit paths. The exchange has to be the place where a mistake stops, not the place it spreads from.

Routing security also has a particular weight in a country whose international links are scarce and fragile. A hijack that drags Lebanese traffic through the wrong continent costs latency, costs the foreign currency that pays for international transit, and, when it lands on the wrong network, can expose that traffic to interception. Filtering at the exchange is how we make sure the shortest path is also a trustworthy one.

## What the Programme Asks of an Exchange

The [MANRS IXP Programme](https://manrs.org/wp-content/uploads/2018/04/MANRS-IXP-factsheet_FINAL-online.pdf) defines five actions. The first two are mandatory for every participant, and an exchange must implement at least three in total:

1. **Prevent propagation of incorrect routing information.** The exchange's route servers must validate what they receive and drop announcements that are not legitimately the peer's to make.
2. **Promote MANRS to the IXP membership.** The exchange uses its position at the centre of a community to move its members towards the same norms.
3. **Protect the peering platform.** The fabric itself is kept safe from misconfiguration and abuse at the link layer.
4. **Facilitate global operational communication and coordination.** Members and outside operators can reach the right people when something goes wrong.
5. **Provide monitoring and debugging tools to members.** Networks can see what the exchange is doing with their routes and why.

Here is how OpenIX Beirut meets them.

## Every Route, Checked Before It Moves

Our [route servers](/OpenIX/peering/routeServer) validate every prefix a participant announces before it reaches any other peer. The sequence is deliberate and strict. Prefixes that are too specific or too general are dropped, as are bogons and announcements carrying a bogon ASN. The first AS in the path must be the peer's own, the next hop must be the peer's own address, and any path that carries a transit-free network's ASN is rejected as a likely leak. Then the checks that MANRS is really about: the origin AS and the prefix must both be covered by the member's registered IRR AS-SET, and every route is checked against RPKI. **RPKI-valid routes are accepted, RPKI-invalid routes are dropped**, and routes with no RPKI record fall back to IRR filtering. Per-participant prefix limits sit on top of all of it, so no single network can flood the exchange with routes, by accident or otherwise.

None of this is new to OpenIX. These filters have been in place since the exchange came up, because we would not run a route server any other way. What MANRS adds is an external, public commitment: anyone, member or not, can look up OpenIX Beirut and know what standard it holds itself to.

## A Fabric That Protects Itself

Route servers are only part of the story. An exchange is also a shared Layer 2 network, and the mistakes that cause the most outages at exchanges are often not routing mistakes at all. Every OpenIX port is [locked to a single MAC address](/OpenIX/technicalStandards), so a device that should not be on the fabric cannot speak on it. Storm control caps broadcast and multicast floods before they touch other members. Access control lists drop the protocols that have no business on a peering LAN, from spanning tree to rogue router advertisements to DHCP, and anything not explicitly permitted is filtered by default. Members see the full set of these [network security measures](/OpenIX/security/network) in our policy, and our NOC watches the fabric for anomalies around the clock.

## Transparency, For Members and Beyond

When a route server rejects a prefix, it does not do so silently. Each rejected route is tagged with a large community that records exactly why it was dropped, and members can read those reasons in the OpenIX looking glass and act on them. More of that visibility is on its way to the [P Foundation Console](/updates/OpenIXBeirutOneYearLater): route visibility, BGP session management, and IXP Watch route-health monitoring, all in the same place a member already sees its traffic and its peers.

We also keep the exchange itself easy to reach and easy to reason about. OpenIX Beirut is listed on [PeeringDB](https://www.peeringdb.com/ix/4727), publishes its member list in the standard IX-F format, and maintains 24x7 [NOC and support contacts](/OpenIX/beirut) that any operator, anywhere, can use to raise a routing issue with us or with one of our members.

## The Part We Ask of You

Action 2 of the programme is the one no exchange can complete alone. Our route servers filter what crosses them, but bilateral sessions between members do not pass through our filters, and a member's own customers and transit are outside our reach entirely. Routing security is only as strong as the network at the far end of every link.

So this is an invitation. If your network peers at OpenIX Beirut, we ask you to take the same step and join the [MANRS Network Operator Programme](https://manrs.org). The actions are the ones our own [peering security policy](/OpenIX/peering/security) already expects of you: filter the routes you accept and announce, prevent traffic with spoofed source addresses from leaving your network, keep your contact details current in PeeringDB, and publish RPKI ROAs and IRR objects for the prefixes you originate, so that every exchange and transit provider on the internet can validate your routes the way ours already does. Networks that need a hand with any of it can reach our engineers at [support@openix.ong](mailto:support@openix.ong). We would rather spend an afternoon helping a member publish its first ROA than spend a night cleaning up a hijack.

The point of OpenIX was never just to move traffic. It was to give Lebanon an internet it could rely on, and reliability includes trust in where every packet is going. Today that trust has a standard behind it, and a public commitment to keep it.
