---
id: routeServer
title: Route Servers
sidebar_position: 5
description: Technical information about OpenIX Route Servers, including ASN, IP addresses, and BGP community controls for policy management.
---

OpenIX provides route server infrastructure to simplify multilateral peering. By establishing BGP sessions with the route servers, participants can exchange routes with multiple peers through a single connection rather than maintaining individual bilateral sessions.

## Route Server ASN

OpenIX Route Servers operate under **ASN 4969**.

## Route Servers

### OpenIX Beirut

- **OpenIX Beirut RS1**

  - IPv4: `23.181.208.251`
  - IPv6: `2620:98:e00e:9::4969:1`

- **OpenIX Beirut RS3**
  - IPv4: `23.181.208.253`
  - IPv6: `2620:98:e00e:9::4969:3`

Participants should establish BGP sessions with both route servers for redundancy.

## Policy Control

OpenIX Route Servers support policy control through BGP Standard Communities and BGP Large Communities. Members may tag their routes to control route announcements via the route servers.

### Route Announcement Control

| Action                                          | Standard Community | Large Community  |
| ----------------------------------------------- | ------------------ | ---------------- |
| Block announcement of a route to a certain peer | `0:peer-as`        | `4969:0:peer-as` |
| Announcement of a route to a certain peer       | `4969:peer-as`     | `4969:1:peer-as` |
| Block announcement of a route to all peers      | `0:4969`           | `4969:0:0`       |
| Announcement of a route to all peers            | `4969:4969`        | `4969:1:4969`    |

### AS-Prepending to All Peers

| Community type | Prepend ASN one time | Prepend ASN two times | Prepend ASN three times |
| -------------- | -------------------- | --------------------- | ----------------------- |
| Standard       | `4969:65501`         | `4969:65502`          | `4969:65503`            |
| Large          | `4969:65501:1`       | `4969:65502:2`        | `4969:65503:3`          |

### AS-Prepending to Selective Peers

| Community type | Prepend ASN one time | Prepend ASN two times | Prepend ASN three times |
| -------------- | -------------------- | --------------------- | ----------------------- |
| Standard       | `65501:$peer`        | `65502:$peer`         | `65503:$peer`           |
| Large          | `4969:65501:$peer`   | `4969:65502:$peer`    | `4969:65503:$peer`      |

Where `$peer` represents the ASN of the target peer.

## Route Server Opt-Out

If a participant does not wish to peer with specific other networks via the route server, they can use the BGP community controls documented above to instruct the route server accordingly. Alternatively, they may choose not to use the route server at all and only establish direct sessions with selected peers. Using the exchange does not force any participant to peer with everyone; it simply provides the opportunity.

All participants must respect that others may have restrictive policies and are not obligated to accept a peering session. Conversely, participants with restrictive policies should handle their filtering on their side (or via route server communities) and not pressure OpenIX to remove any particular participant from the exchange.

OpenIX is open to all qualified networks and will not bar participants just because some networks don't wish to peer with them (except in cases of policy violation or legal issues as described elsewhere).

## Additional Information

For more detailed information about route server best practices and operations, please refer to the [LINX Route Servers documentation](https://community.linx.net/exchange-docs-oo8vcsp0/post/linx-route-servers-information-xCXmq6SqZUpC80k), which provides comprehensive guidance that is broadly applicable to Internet Exchange route server operations.
