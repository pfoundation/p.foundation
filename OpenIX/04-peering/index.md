---
id: peering
title: Peering Policy
description: The policies governing traffic exchange, BGP sessions, and multilateral and bilateral peering arrangements at OpenIX.
---

import DocCardList from '@theme/DocCardList';

OpenIX’s core purpose is to facilitate peering among networks. Peering is the mutual exchange of routing information and traffic between participants’ networks. OpenIX itself does not involve itself in participants’ business arrangements (most peering at OpenIX is settlement-free, but any commercial terms between networks are outside the scope of OpenIX).

To ensure an effective peering environment, the following policies apply:

## BGP Sessions

All traffic exchange between participants across the IX is predicated on BGP. Participants must establish BGP sessions with each other (bilaterally or via the route servers) to exchange routes. OpenIX does not provide any transit or default routing – if there is no BGP route learned for a destination, traffic will not be exchanged.

Participants are expected to only send traffic to destinations (prefixes) they have learned via BGP from that peer at the exchange. In other words, no static routes or proxy routing across the IX: the exchange is strictly for BGP-learned peering routes.

## Multilateral Peering

OpenIX offers route server service to simplify peering for participants. By peering with the route servers, a network can exchange routes with many other route-server-connected participants through a single (or dual for redundancy) BGP session, rather than maintaining individual sessions with each peer. Use of the route servers is optional but encouraged, especially for new or smaller participants to quickly gain reachability with others.

Participants can still establish direct bilateral BGP sessions with any other participant if they choose (for example, if they prefer not to use the route server for certain peers or in general). OpenIX’s route servers implement prefix filtering (using IRR and RPKI data to allow only valid, registered routes) and do not propagate routes learned from one participant to another if those routes are filtered or if the participant is not authorized to advertise them.

The route servers also support community controls – participants can tag routes with BGP communities to control which peers receive them (e.g., to opt-out of peering with specific ASNs or to limit route distribution). These community conventions are documentted under the Route Servers section.

## Bilateral Peering

Participants are free to negotiate bilateral peering sessions with each other outside of the route server. OpenIX can provide assistance (such as listing all participant NOC contacts and PeeringDB info) but does not mandate any network to peer with any other – peering agreements are at the discretion of the participants.

If a participant has a selective peering policy (e.g., only peers with certain types of networks or requires a certain traffic ratio), it is that participant’s responsibility to communicate and enforce it.

OpenIX itself will not enforce any bilateral peering requirements, aside from the expectation that participants should actively use the exchange for traffic exchange rather than remain idle.

<DocCardList />
