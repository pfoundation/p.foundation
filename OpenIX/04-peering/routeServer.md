---
id: routeServerOptOut
title: Route Server Opt-Out
sidebar_position: 5
description: Peering relationships through the route server, including methods to opt-out of peering with specific networks.
---

If a participant does not wish to peer with specific other networks via the route server, they can use BGP community controls to instruct the route server accordingly (as mentioned above). Alternatively, they may choose not to use the route server at all and only establish direct sessions with selected peers. Using the exchange does not force any participant to peer with everyone; it simply provides the opportunity.

All participants must respect that others may have restrictive policies and are not obligated to accept a peering session. Conversely, participants with restrictive policies should handle their filtering on their side (or via route server communities) and not pressure OpenIX to remove any particular participant from the exchange.

OpenIX is open to all qualified networks and will not bar participants just because some networks don’t wish to peer with them (except in cases of policy violation or legal issues as described elsewhere).
