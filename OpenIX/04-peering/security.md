---
id: security
title: Security
sidebar_position: 3
description: Routing security requirements and best practices for participants to prevent route leaks, hijacks, and other routing security issues.
---

Participants are expected to implement basic routing security measures. This includes filtering incoming routes (for example, using prefix filters or maximum prefix limits on peers, and honoring BGP community signals like NO_EXPORT or blackhole communities where used).

OpenIX’s route servers perform IRR/RPKI-based filtering, but bilateral sessions do not have the exchange’s automated filtering – so participants are responsible for safeguarding their own bilateral sessions. In case of a route leak or hijack detected, OpenIX staff may notify the offending participant and/or other participants to drop the erroneous announcements.

Repeated route leaks or advertisement of bogon/unallocated prefixes by a participant will be considered a policy violation.
