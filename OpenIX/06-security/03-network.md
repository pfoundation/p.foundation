---
title: Network Security Measures (OpenIX side)
sidebar_label: Network Security Measures
description: Network security implementations including MAC filtering, storm control, and access control lists that protect the exchange platform.
---

OpenIX implements several layers of network security on the exchange:

## MAC Filtering

As mentioned under technical standards, each port is locked to a specific MAC address. This prevents unknown devices from sending traffic on the exchange even if somehow plugged in. It also stops potential MAC flooding attacks because the switch will not learn beyond the one MAC per port.

## Storm Control

The exchange switches have broadcast and multicast storm control enabled. This means if a port suddenly starts flooding broadcast traffic above a certain threshold, the switch will suppress it to protect other ports. This helps mitigate issues like accidental broadcast storms from misconfigurations.

## Access Control Lists (ACLs)

OpenIX applies ACLs on the fabric to drop known illegitimate traffic types (e.g., STP BPDUs, LACP packets, IPv6 Router Advertisements that are rogue, etc.). We also filter DHCP server responses on the peering VLAN (to prevent any rogue DHCP). Essentially, any traffic that is not explicitly allowed (as defined in the technical policy) is filtered by default. This reduces the attack surface and chances of operational errors spreading.

## Route Server Security

The route servers themselves have stringent controls. They do not forward traffic, and they implement filters to ensure one participant cannot impersonate another at the BGP level. They also have prefix limits per peer and deny lists for bogon prefixes.

The route servers are configured to **never** forward a next-hop that isn’t the originator (meaning they preserve the original BGP next hop of the route, which ensures that traffic from one participant to another goes directly, not through the route server). This way, even if compromised (which is highly unlikely with our security), a route server couldn’t man-in-the-middle traffic – it’s simply not in the forwarding path.

Additionally, the route servers are secured with MD5 passwords on BGP sessions if the participant requests (optional but available), and they run on hardened systems (limited access, regularly patched software, etc.).

## Monitoring and Anomaly Detection

OpenIX NOC monitors for unusual patterns, such as traffic spikes that might indicate a DDoS attack passing through the exchange, or a sudden drop in route server session count that might indicate a problem. We also look for health indicators such as CPU spikes on switches (which could indicate a L2 loop or broadcast storm).

If an anomaly is detected, staff investigate immediately. In case of something like a DDoS attack where one participant is the target and others could be collaterally affected, OpenIX may implement filters or blackholing for the target prefix upon request to mitigate impact (if the participant supports it, e.g., by advertising a BGP blackhole route with a special community to the route server, which OpenIX can then enforce by filtering that traffic).

OpenIX’s policy is to protect the exchange as a whole; if necessary, we will temporarily isolate a participant that is overwhelming the fabric, while informing them, to preserve overall stability.
