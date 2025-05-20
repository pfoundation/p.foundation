---
id: technicalStandards
title: Technical Standards and Infrastructure Requirements
sidebar_label: Technical Standards
description: The technical specifications, connection requirements, and protocol standards for connecting to the OpenIX exchange.
---

OpenIX operates a high-performance Ethernet switching fabric to which all participants connect. To ensure reliability and interoperability, the following technical standards and requirements apply to all connections:

## Physical Connection Medium

**Only single-mode fiber** is accepted for all connections to OpenIX. This applies to both intra-facility cross-connects and any external circuit connections.

Copper-based Ethernet (e.g., RJ45 Cat6/Cat5 cables) is **not permitted** for any port speed, including 1 Gbps. Participants must use single-mode optical fiber with the appropriate transceivers for their port (e.g., 1G SX/LX fiber transceiver, 10G SFP+ LR, 100G LR4/CSR4, etc. as supported by the exchange).

This requirement ensures signal integrity, supports longer distances, and maintains the professional standard of the platform.

## Port Speeds and Interface Types

OpenIX offers ports at standard speeds such as 1, 10, 25, 40 and 100 Gbps (higher speeds like 400 Gbps may be offered in the future as technology and demand progress).

All port types use optical interfaces (single-mode fiber as noted). Participants should specify the desired port capacity when applying, and OpenIX will provision the connection on the switching fabric accordingly. If a participant requires multiple ports aggregated for higher throughput or redundancy, Link Aggregation (LAG) can be arranged, subject to OpenIX’s technical approval. LAG groups must still conform to the one MAC address rule (see below) across the bundle.

## MAC Address and Device Requirements

Each participant port (or LAG bundle) is restricted to a single unique MAC address visible on the exchange fabric. Participants should connect a single routing device to each port (or port bundle) and not bridge multiple devices or networks behind one port. OpenIX enforces Layer2 MAC filtering to block frames from unauthorized MAC addresses.

If a participant needs to connect multiple routers or networks, they must obtain additional ports or coordinate with OpenIX for an approved configuration. This policy prevents loops and ensures accountability for traffic sources on the exchange.

## Allowed Protocols (Layer-2 and Layer-3)

The exchange fabric is an Ethernet switching environment carrying primarily IP traffic. Only the following EtherTypes and protocols are allowed across the OpenIX switch:

- **0x0800 – IPv4** (Internet Protocol v4 traffic)
- **0x86DD – IPv6** (Internet Protocol v6 traffic)
- **0x0806 – ARP** (Address Resolution Protocol for IPv4) and IPv6 Neighbor Discovery messages (ICMPv6 types for ND).

No other Layer-2 protocols or non-IP traffic shall be forwarded. In particular, **Link-local or control protocols** such as Spanning Tree Protocol (STP), Rapid STP, Cisco Discovery Protocol (CDP), Link Aggregation Control Protocol (LACP), LLDP, etc., are **not allowed** on the peering fabric and should be disabled on the participant’s interface towards OpenIX.

OpenIX will filter or drop common disallowed Ethernet frames (e.g., BPDU frames, LACP, etc.) to protect the platform. Similarly, **Proxy ARP** or any attempt to act as an ARP proxy on the exchange is forbidden – participants should only respond to ARP for their own IPs.

## MTU (Maximum Transmission Unit)

OpenIX supports a standard MTU of 1500 bytes for Ethernet frames by default. The exchange also **supports jumbo frames**, up to an MTU of 9000 bytes, to facilitate efficient transfer of large packets if participants mutually agree to use jumbo frames. Participants must ensure their interface MTU is configured appropriately.

All devices should handle at least 1500-byte frames; using jumbo frames is optional but recommended for better efficiency and must be consistently configured by any two peers that want to exchange jumbo traffic. The route servers (if used) are typically configured for jumbo frames as well.

## IP Addressing on the Exchange

OpenIX will assign each participant an IPv4 address and an IPv6 address from the exchange’s peering LAN subnets for use on their interface. These addresses are used for BGP peering between participants. Participants must configure only the IPs assigned to them on the exchange interface.

The exchange LAN IPs should **not** be advertised to the global internet or outside of the IXP. They are intended solely for exchange-related communication (e.g., BGP sessions, ARP/ND, and limited operations like ping for monitoring). If a participant uses the route servers, they will peer with them using these IPs.

Participants should use router-loopback IPs only on their side for their iBGP, etc., but **not** on the exchange link.

## Route Servers

OpenIX provides one or more route servers as a service to facilitate multilateral peering (see Peering Policy section for details). From a technical standpoint, route server sessions are done via BGP. Participants who choose to peer with the route servers must configure BGP sessions (one to each route server, typically two for redundancy) using the provided IPs and ASN of the route server.

The route servers will **not** forward traffic; they only exchange routes. Participants should ensure they implement proper BGP import/export policies even when using route servers (e.g., honoring BGP communities for route control, if supported, and implementing max prefix limits to protect against route leaks).

OpenIX’s route servers enforce filtering (using IRR data and route validation) and limit the prefixes a participant can announce by default to ensure stability. Technical details for route server usage (such as the ASN, IPs, and supported BGP community controls) are provided in the OpenIX technical guide or upon request.

## Traffic Limits and Quality

OpenIX does not impose artificial traffic rate limits on ports (aside from the physical port speed). Participants are expected to manage their own capacity; if a port is frequently congested, the participant should consider upgrading to a higher speed or adding ports via LAG.

The exchange fabric is designed for non-blocking performance at line rate on all ports. Packet forwarding is at Layer 2, and OpenIX monitors for excessive broadcasts or unknown unicast flooding. Broadcast traffic should be limited to essential ARP/ND only.

Unknown destination traffic will be broadcast/flooded by the switch as per normal Ethernet behavior, but OpenIX employs controls (MAC filtering and storm control) to minimize any such traffic.

Participants must not flood the exchange with continuous high-rate broadcasts/multicasts as it can degrade performance for others (this would be a violation of the AUP).

## Clock and Synchronization

If participants use protocols like NTP over the exchange or run services that rely on timing, note that the exchange does not provide any synchronization services – it only passes traffic.

Participants should ensure their equipment’s clocks are synchronized via their own methods (GPS, internet NTP, etc.) if needed. There is no impact on exchange operations; this is just a note that OpenIX is a Layer-2 facility and does not handle any timing protocols such as PTP (IEEE 1588) on the peering LAN.

## Equipment Standards

Participant equipment connected to OpenIX should be of carrier-grade quality to maintain overall reliability. It should support IPv4 and IPv6 routing in hardware or adequate software performance.

The interface should be configured as an access/untagged port on the OpenIX VLAN (OpenIX will handle VLAN tagging on its side if needed; by default, all participants connect to a common untagged VLAN for public peering).

Participants must disable any DHCP server or other endpoint services on the exchange interface to avoid interfering with others. Only routers or layer3 devices should be connected (no end-hosts or general-purpose servers should be directly connected to the exchange port, except if acting as routers or route servers under participant’s ASN).

---

OpenIX engineering staff will work with each participant during the connection setup (installation) to ensure these technical requirements are met. Testing may be done (for example, verifying the correct MAC is seen, BGP sessions come up, no prohibited protocols are detected).

OpenIX reserves the right to delay or refuse a connection if the participant’s equipment or configuration does not conform to these standards, in order to protect the exchange and existing participants.

Once connected, ongoing compliance with these technical rules is mandatory; violations (even if unintentional, like a misconfiguration enabling STP) will lead to intervention by OpenIX (which may include temporarily disabling the port until the issue is resolved).
