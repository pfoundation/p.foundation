---
title: 'OpenIX Beirut Is Now MANRS Compliant'
description: OpenIX Beirut has joined the MANRS IXP Programme, the global standard for routing security at Internet Exchange Points, with all five of its actions in place. Lebanon's exchange filters every route it carries against RPKI and IRR data, and commits to helping its members do the same on their own networks.
slug: OpenIXBeirutMANRS
authors: jud
image: https://assets.p.foundation/assets/ae3aeefb-9e06-4ef3-810c-dff4048b7527
hide_table_of_contents: false
date: 2026-09-15T17:00:00Z
---

# OpenIX Beirut Is Now MANRS Compliant

[OpenIX Beirut](/OpenIX/beirut) is now a participant in the [MANRS IXP Programme](https://manrs.org/participant/019eccd4-bc10-786e-abfa-a13830c4f843), with all five of its actions implemented. MANRS, the Mutually Agreed Norms for Routing Security, is the global initiative that sets out what a responsible network or exchange must do to keep the internet's routing system honest, and its IXP Programme is the version of that standard written for Internet Exchange Points. From today, Lebanon's exchange is held to it, alongside the exchanges that carry much of the world's traffic.

The internet has no central authority that decides which network may announce which addresses. Every router takes the routes its neighbours give it largely on trust, and that trust is what route hijacks, route leaks, and address spoofing exploit. A single misconfigured announcement can pull a bank's traffic across a border, take a country's news sites offline, or blackhole a hospital's connectivity, and the network that caused it often never notices. As MANRS puts it, these incidents are global in scale, with one operator's routing problems cascading to impact others. The fix is not one clever device but a set of practices everyone agrees to keep, and an exchange, where dozens of networks meet on one fabric, is where those practices matter most.

<!--truncate-->

## Why It Matters for Lebanon

OpenIX Beirut was built to keep Lebanon's traffic at home. Sixteen months after launch, [45 networks](/OpenIX/beirut/networks) trade traffic across it, and a large share of what the country's users do each day now stays within local reach. That success raises the stakes. When most of a country's traffic meets at one exchange, a bad route announced there travels further and faster than it ever could through a dozen separate transit paths. The exchange has to be the place where a mistake stops, not the place it spreads from.

Routing security also has a particular weight in a country whose international links are scarce and fragile. A hijack that drags Lebanese traffic through the wrong continent costs latency, costs the foreign currency that pays for international transit, and, when it lands on the wrong network, can expose that traffic to interception. Filtering at the exchange is how we make sure the shortest path is also a trustworthy one.

## What the Programme Asks of an Exchange

MANRS began as [four actions for network operators](https://manrs.org/wp-content/uploads/2018/04/MANRS-IXP-factsheet_FINAL-online.pdf): filtering, anti-spoofing, coordination, and global validation. Exchanges sit in a different place in the routing system, so the community wrote a related but separate set of five actions for IXPs, built on the idea that an exchange can turn its members into a safe neighbourhood. OpenIX Beirut's [MANRS listing](https://manrs.org/participant/019eccd4-bc10-786e-abfa-a13830c4f843) records all five as implemented:

1. **Filtering of route announcements.** The exchange's route servers validate what they receive and drop announcements that are not legitimately the peer's to make.
2. **Assistance to members.** The exchange helps its members keep accurate routing information in the IRR and RPKI, and helps them implement the MANRS network operator actions on their own networks.
3. **Protection of the peering platform.** The fabric itself is kept safe from misconfiguration and abuse at the link layer.
4. **Global operational communication and coordination.** Members and outside operators can reach the right people, and there is a process for handling incidents and disputes.
5. **Monitoring and debugging tools for members.** Networks can see what the exchange is doing with their routes and why.

Here is what each of them looks like at OpenIX Beirut.

## Every Route, Checked Before It Moves

Our [route servers](/OpenIX/peering/routeServer) validate every prefix a participant announces before it reaches any other peer. The sequence is deliberate and strict. Prefixes that are too specific or too general are dropped, as are bogons and announcements carrying a bogon ASN. The first AS in the path must be the peer's own, the next hop must be the peer's own address, and any path that carries a transit-free network's ASN is rejected as a likely leak. Then the checks that MANRS is really about: the origin AS and the prefix must both be covered by the member's registered IRR AS-SET, and every route is checked against RPKI. **RPKI-valid routes are accepted, RPKI-invalid routes are dropped**, and routes with no RPKI record fall back to IRR filtering. Per-participant prefix limits sit on top of all of it, so no single network can flood the exchange with routes, by accident or otherwise. Repeated leaks or bogon announcements are a violation of our [peering policy](/OpenIX/peering/security), not a nuisance we tolerate.

None of this is new to OpenIX. These filters have been in place since the exchange came up, because we would not run a route server any other way. What MANRS adds is an external, public commitment: anyone, member or not, can look up OpenIX Beirut and know what standard it holds itself to.

## A Fabric That Protects Itself

Route servers are only part of the story. An exchange is also a shared Layer 2 network, and the mistakes that cause the most outages at exchanges are often not routing mistakes at all. OpenIX runs a default-deny policy on the fabric. Every port is [locked to a single MAC address](/OpenIX/technicalStandards), so a device that should not be on the exchange cannot speak on it. Storm control caps broadcast and multicast floods before they touch other members. Control-plane access lists drop the protocols that have no business on a peering LAN, from spanning tree to rogue router advertisements to DHCP, and anything not explicitly permitted is filtered. All of it is written down in our published [network security measures](/OpenIX/security/network), and our NOC watches the fabric for anomalies around the clock.

## Reachable, and Accountable

Routing security is a team sport, and most of the work happens between people rather than between routers. OpenIX Beirut publishes its operational contacts and its full list of connected networks, is listed on [PeeringDB](https://www.peeringdb.com/ix/4727), and publishes its member list in the standard IX-F format so that tools across the industry can see who peers here. When something does go wrong, members have a published [etiquette](/OpenIX/peering/etiquette) and a [disputes process](/OpenIX/peering/disputes) to fall back on, and the exchange follows an SLA-backed [incident response procedure](/OpenIX/sla/incidentResponse) to coordinate with the affected members and with the wider operator community. An operator on the other side of the world who sees a bad route from a Beirut network knows exactly who to call.

## See What the Exchange Sees

When a route server rejects a prefix, it does not do so silently. Each rejected route is tagged with a large community that records exactly why it was dropped, and members can read those reasons in the looking glass inside the [P Foundation Console](/updates/OpenIXBeirutOneYearLater), the same place a member already sees its traffic and its peers. The [BGP community controls](/OpenIX/peering/routeServer) on the route servers are fully documented, so a member can steer and debug its own policy without a ticket, and the exchange's [traffic statistics](/OpenIX/beirut/traffic) are public. More is on the way to the console: route visibility, BGP session management, and IXP Watch route-health monitoring.

## The Part We Ask of You

Action 2 is the one no exchange can complete alone. Our route servers filter what crosses them, but bilateral sessions between members do not pass through our filters, and a member's own customers and transit are outside our reach entirely. Routing security is only as strong as the network at the far end of every link.

So this is a commitment and an invitation. The commitment is ours: our engineers will help any member register and maintain its IRR objects and RPKI ROAs, and will work hands-on with any member that wants to implement the four MANRS network operator actions, filtering, anti-spoofing, coordination, and global validation. The invitation is to take that step and join the [MANRS Network Operator Programme](https://manrs.org) yourself. The actions are the ones our own [peering security policy](/OpenIX/peering/security) already expects of you: filter the routes you accept and announce, prevent traffic with spoofed source addresses from leaving your network, keep your contact details current in PeeringDB, and publish RPKI ROAs and IRR objects for the prefixes you originate, so that every exchange and transit provider on the internet can validate your routes the way ours already does. Reach us at [support@openix.ong](mailto:support@openix.ong). We would rather spend an afternoon helping a member publish its first ROA than spend a night cleaning up a hijack.

The point of OpenIX was never just to move traffic. It was to give Lebanon an internet it could rely on, and reliability includes trust in where every packet is going. Today that trust has a standard behind it, and a public commitment to keep it.
