---
id: technicalStandards
title: Technical Standards and Infrastructure Requirements
sidebar_label: Technical Standards
description: Technical specifications, connection requirements, and protocol standards for connecting to the OpenIX exchange.
---

OpenIX operates a high‑performance Ethernet switching fabric to which all participants connect. To ensure reliability and interoperability, the following technical standards and requirements apply to all connections.

## Physical Connection Medium

**Only single‑mode fiber** is accepted for all connections to OpenIX. This applies to both intra‑facility cross‑connects and any external circuits.

Copper‑based Ethernet (for example, RJ45 Cat6/Cat5 cables) is **not permitted** for any port speed, including 1 Gbps.

**Microwave, millimeter‑wave, Wi‑Fi, or any other wireless or free‑space optical links are not accepted.** All production traffic must arrive on single‑mode optical fiber using the appropriate transceivers for the chosen port speed.

This requirement protects signal integrity, supports longer distances, and maintains the professional standard of the platform.

## Port Speeds and Interface Types

OpenIX offers ports at standard speeds such as 1, 10, 25, 40, and 100 Gbps (higher speeds like 400 Gbps may be introduced as demand grows).

All port types use optical interfaces (single‑mode fiber as noted). Participants should specify the desired port capacity when applying, and OpenIX will provision the port accordingly. If a participant needs multiple ports aggregated for higher throughput or redundancy, Link Aggregation (LAG) can be arranged with OpenIX approval. LAG groups must still conform to the one‑MAC‑address rule described below.

## MAC Address and Device Requirements

Each participant port (or LAG bundle) is restricted to a single unique MAC address that is visible on the exchange fabric. Participants should connect exactly one routing device to each port (or port bundle) and must not bridge multiple devices or networks behind one port. OpenIX enforces Layer 2 MAC filtering to block frames from unauthorized addresses.

If a participant needs to connect multiple routers or networks, they must obtain additional ports or agree on an alternate configuration with OpenIX. This policy prevents loops and ensures accountability for traffic sources.

## Allowed Protocols (Layer 2 and Layer 3)

The exchange fabric is an Ethernet switching environment carrying IP traffic only. The following EtherTypes and protocols are permitted:

- **0x0800: IPv4**
- **0x86DD: IPv6**
- **0x0806: ARP** (Address Resolution Protocol for IPv4) as well as IPv6 Neighbor Discovery messages (ICMPv6 types for ND)

No other Layer 2 protocols or non‑IP traffic will be forwarded. In particular, **link‑local or control protocols** such as Spanning Tree Protocol (STP), Rapid STP, Cisco Discovery Protocol (CDP), Link Aggregation Control Protocol (LACP), LLDP, and similar traffic must be disabled on the interface toward OpenIX. The exchange will drop these frames.

Proxy ARP is also forbidden. Participants should reply to ARP or ND only for addresses assigned to them.

## MTU (Maximum Transmission Unit)

OpenIX supports the standard 1500‑byte Ethernet frame size by default and also supports jumbo frames up to 9000 bytes. Two peers may exchange jumbo frames if they explicitly agree to do so and configure their interfaces consistently. Route servers are configured for jumbo frames as well.

All devices must handle 1500‑byte frames. Using jumbo frames is optional but recommended for efficiency when all parties agree.

## IP Addressing on the Exchange

OpenIX assigns each participant an IPv4 address and an IPv6 address from the exchange peering LAN. These addresses are used for BGP sessions between participants. Only the assigned addresses may be configured on the exchange interface.

Exchange LAN addresses must **not** be advertised to the global Internet. They are intended solely for exchange‑related communication such as BGP, ARP/ND, and monitoring. Participants should advertise only their loopback or other internal addresses outside the exchange.

## Route Servers

OpenIX operates redundant route servers to make multilateral peering easier. Sessions are established with BGP. Participants who choose this option must configure one session to each route server using the provided IPs and ASN.

Route servers exchange routes only; they do not forward traffic. They enforce IRR‑based filtering, RPKI validation, and per‑participant prefix limits to keep the platform stable. Details such as ASN, IPs, and community controls are provided in the technical guide or on request.

Participants should still apply their own import and export policies, including max‑prefix limits, when peering with route servers.

## Traffic Limits and Quality

OpenIX does not rate‑limit ports other than the physical port speed. Participants are responsible for capacity planning; if a port is persistently congested, the participant should upgrade speed or add ports via LAG.

The exchange fabric is non‑blocking at line rate. OpenIX monitors for excessive broadcasts or unknown‑destination flooding and applies MAC filtering and storm control to keep these to a minimum.

Participants must not send continuous high‑rate broadcast or multicast traffic, as doing so degrades service for others and violates the AUP.

## Clock and Synchronization

OpenIX does not provide timing services. If a participant relies on NTP, PTP, or similar protocols, they must arrange this independently. The exchange forwards such traffic like any other IP packets but does not guarantee timing accuracy.

## Equipment Standards

Equipment connected to OpenIX must be carrier‑grade and capable of hardware or high‑performance software routing for IPv4 and IPv6.

Interfaces must be configured as untagged access ports on the OpenIX VLAN (OpenIX will handle any required tagging). Participants must disable DHCP servers or other endpoint services on the exchange interface. Only routers or Layer 3 devices should be attached; general‑purpose servers are not permitted unless acting as routers under the participant’s ASN.

---

OpenIX engineering staff will work with each participant during installation to verify compliance. OpenIX reserves the right to delay or refuse a connection if the equipment or configuration fails to meet these standards.

After the port is live, ongoing compliance is mandatory. Violations, even unintentional ones such as enabling STP or sending wireless back‑haul traffic, may result in the port being disabled until the issue is corrected.
