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

### RFC1997 Passthru

[RFC 1997](https://www.rfc-editor.org/rfc/rfc1997) defines several well-known BGP communities, including `NO_EXPORT` (`65535:65281`) and `NO_ADVERTISE` (`65535:65282`), which carry global significance. Under [RFC 7947](https://www.rfc-editor.org/rfc/rfc7947), it is a matter of local policy whether a route server interprets these communities or passes them through unchanged.

OpenIX route servers pass these well-known communities through rather than acting on them. This follows the consensus reached in 2017 (`draft-hilliard-grow-no-export-via-rs`), which recommended that route servers leave the well-known communities intact for the receiving peer to interpret. In practice, a community such as `NO_EXPORT` is delivered to your peers exactly as you tagged it, and the route server does not strip it or honour it on your behalf.

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

### Prefix Validation

OpenIX route servers validate every prefix received from a participant before re-announcing it to other peers. Validation is based on RPKI Route Origin Validation and the presence of matching IRR objects. Prefixes are checked in sequence, and any prefix that fails a check is tagged with a large community (visible in the looking glass) and rejected:

1. **Prefix length**: prefixes that are too specific or too general are filtered (minimum /24 for IPv4 and /48 for IPv6 by default).
2. **Bogon filtering**: martian prefixes, bogon prefixes, and bogon ASNs are rejected.
3. **AS path sanity**: prefixes with an empty AS path, or with more than 64 ASNs in the path, are rejected.
4. **First AS check**: the announcing peer's AS must match the first AS in the prefix's AS path.
5. **Next-hop validation**: prevents next-hop hijacking, with exceptions that allow participants with multiple connections to advertise their other routers.
6. **Transit-free ASN filtering**: prefixes whose AS path contains a known transit-free (tier-1) network's ASN are rejected, as these typically indicate a route leak.
7. **IRRDB origin validation**: the origin AS must appear in the set of ASNs derived from the member's AS-SET, and the prefix itself must be covered by that AS-SET.
8. **RPKI validation**: routes that are RPKI valid are accepted, RPKI invalid routes are dropped, and routes with an unknown RPKI status fall back to IRRDB filtering.

In addition to per-prefix validation, OpenIX enforces per-participant max-prefix limits to guard against route leaks and prevent route flooding.

#### Rejection Communities

When the route servers reject a prefix, they tag it with a BGP large community recording the reason. These communities are visible in the looking glass and take the form `4969:1101:x`, where `4969` is the OpenIX route server ASN and `1101` identifies the rejection-reason set:

| Large Community | Rejection reason                       |
| --------------- | -------------------------------------- |
| `4969:1101:1`   | Prefix length too long (too specific)  |
| `4969:1101:2`   | Prefix length too short (too general)  |
| `4969:1101:3`   | Bogon prefix                           |
| `4969:1101:4`   | Bogon ASN in path                      |
| `4969:1101:5`   | AS path too long                       |
| `4969:1101:6`   | AS path too short                      |
| `4969:1101:7`   | First AS in path is not the peer AS    |
| `4969:1101:8`   | Next hop is not the peer IP            |
| `4969:1101:9`   | Prefix filtered by IRRDB               |
| `4969:1101:10`  | Origin AS filtered by IRRDB            |
| `4969:1101:11`  | Prefix not originated by its origin AS |
| `4969:1101:12`  | RPKI unknown                           |
| `4969:1101:13`  | RPKI invalid                           |
| `4969:1101:14`  | Transit-free ASN in path               |
| `4969:1101:15`  | Too many communities on the route      |

These communities are informational and are applied by the route servers; participants do not set them. Refer to the OpenIX looking glass to see why a specific prefix was rejected.

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

#### Corrupt or Malformed AS-Path

Members using Cisco, Brocade, Huawei, Arista, or Quagga devices may fail to establish a route server session and see log notifications referencing an "invalid corrupt AS path" or "Malformed AS-path".

This happens because OpenIX route servers are transparent and do not insert their own ASN (4969) into the AS_PATH, as noted under [How Route Servers Work](#how-route-servers-work). By default these platforms enforce that the first ASN in a received path matches the configured peer ASN. Because the route server's ASN is absent from the path, the affected device treats the update as malformed and tears down or refuses the session.

**Suggested fix:** disable first-AS enforcement on the BGP session toward the route servers.

| Vendor                            | Command                   |
| --------------------------------- | ------------------------- |
| Cisco / Quagga / Brocade / Arista | `no bgp enforce-first-as` |
| Huawei                            | `undo check-first-as`     |

If you encounter any other vendor-specific issues when connecting to OpenIX route servers, please contact the NOC with details about your router model and software version, and we will assist with configuration or document any known compatibility issues.
