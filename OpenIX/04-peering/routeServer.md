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

| Route Server      | IPv4             | IPv6                     |
| ----------------- | ---------------- | ------------------------ |
| OpenIX Beirut RS1 | `23.181.208.251` | `2620:98:e00e:9::4969:1` |
| OpenIX Beirut RS3 | `23.181.208.253` | `2620:98:e00e:9::4969:3` |

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

### How Route Servers Work

Route servers facilitate multilateral peering by acting as a central point for route distribution. When you peer with a route server:

1. **No Traffic Forwarding**: Route servers only exchange routing information (BGP routes). They do not forward any data traffic. All traffic flows directly between participants' routers.

2. **Next-Hop Preservation**: The original BGP next-hop is preserved in route announcements. This ensures traffic flows directly between peers, not through the route server.

3. **Transparent AS Path**: The route server's ASN (4969) is not added to the AS_PATH, maintaining transparency in routing.

### Route Filtering

OpenIX route servers implement multiple layers of filtering to ensure routing security:

- **IRR-based Filtering**: Routes are validated against Internet Routing Registry (IRR) databases
- **RPKI Validation**: Route Origin Validation (ROV) using RPKI to prevent hijacking
- **Prefix Length Limits**: Enforced minimum and maximum prefix lengths (typically /24 for IPv4, /48 for IPv6)
- **Bogon Filtering**: Automatic rejection of bogon prefixes and invalid routes
- **Max-Prefix Limits**: Per-participant prefix limits to prevent route flooding

### Session Configuration

To establish a BGP session with OpenIX route servers:

1. Configure BGP sessions to both RS1 and RS3 IPv4 and IPv6 addresses
2. Use MD5 authentication (contact NOC for the shared secret)
3. Announce only prefixes registered in your IRR AS-SET
4. Set appropriate max-prefix limits on your side
5. Apply route server communities as needed for traffic engineering

### Monitoring and Support

Participants can monitor their route server sessions through:

- BGP session status and statistics on their own routers
- Direct contact with OpenIX NOC for troubleshooting

For questions about route server configuration or to report issues, contact the OpenIX Network Operations Center (NOC).

### Known Vendor Issues

While OpenIX route servers are designed to work with all major router vendors and BGP implementations, participants should be aware of the following considerations:

- **BGP Session Configuration**: Ensure your router supports BGP communities (both standard and large communities) for full policy control functionality
- **MD5 Authentication**: Some older router firmware versions may have limitations with MD5 authentication on BGP sessions
- **Route Refresh Capability**: Modern route refresh capability (RFC 2918) is recommended for optimal route server interaction
- **Maximum Prefix Limits**: Configure appropriate max-prefix limits on your router to prevent session flapping

If you encounter any vendor-specific issues when connecting to OpenIX route servers, please contact the NOC with details about your router model and software version so we can assist with configuration or document any known compatibility issues.
