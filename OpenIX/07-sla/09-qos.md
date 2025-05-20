---
id: qos
title: Quality of Service
sidebar_position: 9
description: OpenIX's neutral traffic treatment policy and options for participants with special performance requirements for dedicated service paths.
---

OpenIX does not prioritize or shape any participant’s traffic over another’s – the exchange treats all traffic equally (neutral, best-effort forwarding). We do not offer differentiated QoS levels on the public peering fabric; all ports and VLANs share the same priority. However, because the platform is high capacity and typically lightly utilized relative to its maximum, congestion is avoided.

If any special performance needs arise (such as a participant requiring a dedicated low-latency path or a certain traffic class isolation), OpenIX can discuss a custom solution (potentially via a private interconnect service). But generally, the default service is sufficient for the vast majority of use cases with excellent performance.
