---
title: Involuntary Termination or Suspension (OpenIX-Initiated)
sidebar_label: Involuntary
description: The conditions under which OpenIX may suspend or terminate services, including policy violations, non-payment, and regulatory requirements.
---

OpenIX reserves the right to suspend or terminate a participant’s service for cause. This is usually a last resort, after attempting to resolve issues, except in severe cases. Causes for OpenIX-initiated termination or temporary suspension include:

## Policy Violations

If a participant consistently or egregiously violates the OpenIX policies (technical, AUP, etc.), OpenIX may disconnect that participant. Examples include: repeated leaking of routes or flooding traffic after warnings, engaging in malicious activities through the IX, refusing to comply with technical requirements leading to instability, or sharing their port with unauthorized parties.

OpenIX will typically provide warnings and an opportunity to correct the behavior. For example, if a participant’s router is misbehaving, we will notify them to fix it; only if they do not take action or the issue is severe and ongoing would we proceed to termination. In urgent cases (like a security incident), OpenIX might **suspend** the port immediately (to stop the harm) and then notify the participant.

Suspension could lead to termination if the issue is not resolved promptly or if trust is broken.

## Non-Payment

Failure to pay service fees as outlined in the Billing section is a common cause for service termination.

OpenIX will attempt to collect overdue payments and will send multiple notices. If a participant remains delinquent beyond the grace period, OpenIX may first suspend the service (which is a reversible step if payment is made), typically by turning down the port or disabling BGP sessions.

If after suspension the payment issue is still not resolved, OpenIX may terminate the connection and consider the contract in default. At that point, rejoining would require settling the old account and possibly providing assurances (like advance payment for a period). In cases of non-payment, termination is regrettable but necessary to maintain fairness (all participants are expected to pay for the services they use).

## Regulatory or Legal Order

OpenIX may be compelled to terminate or suspend a participant’s connection if ordered by a competent authority. For instance, if the government or a court issues an order that a certain ASN or company must be disconnected (perhaps due to illegal activity or sanctions on that entity), OpenIX will comply with such order. We will inform the participant (unless legally prohibited) of the situation.

In such cases, OpenIX is not liable for consequences of the termination, as it’s by law. Similarly, if a participant loses their telecom license or legal right to operate (for example, a local ISP’s license is revoked by the regulator), OpenIX would likely be required to disconnect that ISP. We would coordinate with the participant and regulator in such scenario to manage a proper shutdown.

## Network Integrity Threats

If a participant’s continued connection poses a serious threat to the stability or security of the exchange or other participants, OpenIX can terminate the connection.

For example, if a participant’s equipment is compromised and being used to attack others and they are unresponsive or unable to fix it, we cannot allow that to persist. Or if a participant is found engaging in deception (such as spoofing others’ IPs or MACs) that undermines trust, we will remove them. The integrity of the IX as a whole is paramount.

## Ceasing Operation of the IX or Location

In an unlikely event that OpenIX decides to shut down the Beirut exchange or a particular location (due to business reasons or major force majeure issues), all participant connections at that location would be terminated.

OpenIX would provide as much advance notice as possible (likely months ahead) to allow participants to make alternative arrangements.

If a shutdown happens, OpenIX will cease billing from that point and handle any contract dissolution as per terms (possibly without penalty since it’s initiated by us for our reasons). Again, this is not expected under normal conditions, as OpenIX’s intention is to continuously grow the IX, not shut it.

## Procedure for OpenIX-Initiated Termination

When OpenIX determines a termination is necessary, we will formally notify the participant’s authorized contacts in writing (email or letter) stating the reason and the effective date of termination.

In cases of serious abuse or security incidents, the termination might be immediate or already in effect when we notify (for instance, “we have terminated your port effective now due to X incident”).

In cases like non-payment, we’ll give a final notice with a short deadline (e.g., “pay within 5 business days or we will terminate on \[date]”). OpenIX will document the reasons for termination internally (and if needed, share with authorities if it was due to illegal actions).

Upon termination, OpenIX will close out the account: disabling ports, removing routing configs, and updating our records that the ASN is no longer connected.

If the participant was listed on our website or member list, we will update that as well. The participant must also immediately stop sending any traffic to the exchange – physically unplugging or disabling their connection. If they reconnect without authorization (which would be hard if physically disconnected), that would be considered trespass on the network.

## Post-Termination Financials and Legal

If termination was due to breach (policy or non-payment), and there are remaining contractual months, OpenIX may pursue the owed fees for the remainder of the term as damages, depending on contract terms.

We prefer not to go the legal route and would rather settle amicably, but participants should be aware that a breach does not simply erase obligations – in fact, many contracts stipulate that if OpenIX terminates for cause, the participant is liable for all remaining fees under the contract term immediately.

Conversely, if OpenIX terminated services without cause (not likely except for a shutdown scenario or very lenient approach), and the participant had prepaid, we’d refund unused fees. Each case will follow the contract in place.

## Reinstatement

If a participant was terminated but later seeks reinstatement (for example, they were cut off for non-payment but now want back in and are ready to pay), OpenIX will evaluate on a case-by-case basis.

Typically, the participant would need to cure whatever cause led to termination (pay all past dues, demonstrate compliance improvements, etc.). A reinstatement might be treated as a new connection with new setup fees and possibly a deposit requirement if trust was previously broken.

OpenIX is open to second chances if the issues are resolved, but reserves the right to refuse service to entities that have severely violated trust or legal requirements in the past.
