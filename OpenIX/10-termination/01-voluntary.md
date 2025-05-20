---
title: Voluntary Termination (Participant-Initiated)
sidebar_label: Voluntary
description: The notice period, disconnect process, and administrative procedures when participants choose to terminate their OpenIX service.
---

## Notice Period

Participants wishing to terminate their service should provide written notice to OpenIX in accordance with their contract. Generally, a **30-day notice** is required for cancellation.

Some contracts (especially if on annual terms) may stipulate that termination can only be effective at the end of the current term. OpenIX will work with the participant to schedule a termination date that aligns with contractual obligations and operational considerations.

## Disconnect Process

Once a termination date is agreed, OpenIX and the participant will coordinate the disconnect. On the termination date (or as scheduled), OpenIX will disable the participant’s port(s) on the exchange and remove any BGP sessions (route server or bilateral if we host any). The participant should concurrently shut down their BGP sessions and interface from their side to ensure a clean break in traffic.

If the participant had any special services (private VLANs, etc.), those will also be de-provisioned. The participant is responsible for cancelling any cross-connects or transport circuits on their end (for example, if they had an NTS circuit from MoT, they should inform MoT to cease it to avoid ongoing charges on that end; OpenIX can provide confirmation that the IX side is disconnected if needed).

If the participant had equipment in the facility solely for connecting to OpenIX, they should arrange removal of that equipment as per data center rules. Any OpenIX-assigned IP addresses must be cleared from the participant’s configurations; the addresses will be reclaimed by OpenIX.

## Financial Settlement

The participant will be responsible for service fees up to the effective termination date. If they had paid beyond that (e.g., prepaid for a full month or year), refund eligibility will depend on the contract terms.

Typically, monthly fees are not pro-rated for early termination unless notice was given before the billing cycle started. However, if a participant pre-paid for a longer term, OpenIX may refund the unused portion if the contract allows (minus any applicable early termination charges).

Any outstanding invoices must be settled; OpenIX will issue a final invoice if needed (for example, covering the last service period or any incidental charges). Conversely, if a credit is due to the participant, OpenIX will process that refund promptly.

## Exit Survey / Feedback

As a voluntary step, OpenIX might request feedback from departing participants to understand their reasons and improve our services. This is not mandatory, but we appreciate any insights (e.g., are they leaving because they merged with another network that already has a port, or because they ceased operations, etc.). It helps us adapt and possibly reclaim resources for future participants.

## Possibility of Reconnection

A participant that has voluntarily disconnected can rejoin the exchange in the future by going through the standard sign-up process again.

There may be a reactivation fee or a new setup fee if the previous connection was fully removed. OpenIX does not penalize participants for leaving and coming back later, aside from requiring any past debts to be cleared. We value the relationship and would welcome back networks as long as they meet the criteria at that time.
