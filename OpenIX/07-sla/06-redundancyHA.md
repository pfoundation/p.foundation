---
id: redundancy
title: Redundancy and High Availability
sidebar_position: 6
description: OpenIX achieves high availability through redundant route servers, switching platforms, and power systems that minimize single points of failure.
---

Key elements of the exchange are redundant. For example, there are typically two route server instances – if one fails, the other can continue to serve the community (participants should ideally peer with both for redundancy).

The switching platform may have redundancy either in the form of a modular chassis with dual supervisors or two parallel switches splitting the load with rapid failover. Additionally, power feeds to OpenIX equipment are redundant A/B feeds backed by UPS and generators in the facility.

These measures mean that single points of failure are minimized. Participants are encouraged also to consider redundancy on their side (for instance, connecting with two ports in LAG to separate switches if OpenIX offers that, or maintaining a backup transit path).
