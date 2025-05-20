---
id: aup
title: Acceptable Use Policy
description: Rules and prohibited activities for participants to ensure the integrity, security, and fair use of the OpenIX platform.
---

All participants and their traffic flowing through OpenIX must adhere to this Acceptable Use Policy. The AUP is designed to maintain the integrity, security, and fairness of the exchange for everyone. Violation of the AUP can result in immediate action, including suspension of the offending port or termination of the participant’s connection (see Termination section). By connecting to OpenIX, participants agree **not** to engage in any of the following prohibited activities:

## No Abuse of the Exchange Fabric

Participants shall not flood the exchange with excessive broadcast, unknown-unicast, or multicast traffic beyond normal operational needs (e.g., only ARP/ND and occasional multicast for routing protocols if any are acceptable). Intentional transmission of continuous high-volume broadcast or multicast traffic, or any form of traffic flooding that could disrupt exchange operations or consume unnecessary switch capacity, is prohibited.

## No Malicious Traffic or Attacks

The exchange must not be used to conduct denial-of-service attacks, intrusion attempts, or any malicious cyber activities targeting other participants or external networks. Participants must ensure that their connected equipment is not launching attacks (for instance, not part of a botnet using the IX to scan or attack others). If a participant becomes aware that their network is sourcing an attack (e.g., a compromised server spewing traffic), they are expected to take immediate action to stop it. OpenIX may proactively filter or disconnect a port if it is observed participating in an ongoing attack to protect the community. Additionally, obviously malicious traffic such as constant port scans or exploitation attempts directed at others via the IX is forbidden.

## No Eavesdropping or Snooping

Participants should only send and receive traffic intended for their own networks or those of their peering agreements. Interception of other participants’ traffic (e.g., via ARP spoofing, MAC flooding, or other man-in-the-middle techniques) is strictly prohibited. The exchange fabric is a shared medium, but OpenIX implements isolation such that participants should only see traffic addressed to them. Any attempt to circumvent these protections to capture or inspect another network’s traffic is a severe violation and likely illegal.

## No Third-Party Transit

As noted in the Peering Policy, participants may not use the exchange to carry traffic for third parties that are not themselves connected and in mutual agreement. Each participant’s port is for exchanging traffic between that participant’s network (and its customers) and other connected networks. It is not to be resold or used as a general transit link between two other networks. For example, if Network A is connected, they cannot offer to carry traffic across the IX for Network C that is not present at OpenIX. Similarly, a participant should not extend connectivity from the IX port to another external entity (e.g., by physically patching in another ISP or customer to their port) without authorization from OpenIX. All traffic on the exchange should originate from or be destined to the participant’s own network and its direct customers or peers.

## No Unauthorized Sharing or Reselling of Ports

A participant’s port is meant for that participant’s sole use (and their internal network or customer routes as per normal BGP). Participants are not allowed to share their port with other organizations or entities that are not officially registered with OpenIX as part of their organization. For example, two ISPs cannot split the cost of one port and each use it for their own ASN without notifying OpenIX — each distinct network ASN connecting should have its own agreement with OpenIX (or a formal reseller arrangement if one is acting as a reseller for remote peering, which would be explicitly authorized by OpenIX). If a participant is found to be informally reselling or allowing an unauthorized party to piggyback on their connection, OpenIX will consider this a breach of policy.

## Adherence to Technical Rules

All technical standards outlined in the previous section must be followed as part of acceptable use. This includes not sending disallowed Layer-2 protocols (no STP, CDP, etc.), using only the assigned MAC and IP addresses, and not exceeding reasonable usage of ARP/ND. Participants should also ensure no DHCP or other unauthorized services are active on the exchange interface. Violating technical requirements (even accidentally) is considered non-compliance with the AUP. OpenIX will typically alert the participant if, for example, an STP BPDU is detected from their port, but repeated incidents can lead to port shutdown.

## Routing Integrity

Participants must only advertise routes which they are authorized to announce (their own prefixes or those of their downstream customers with permission). Advertisement of prefixes not owned or assigned (prefix hijacking), or a broader prefix that encompasses someone else’s more specific (to hijack traffic), is strictly forbidden. Additionally, participants should not propagate routing information learned from one peer to another (no re-advertisement of peers’ prefixes to other peers, especially via the route server – the route server is configured to prevent this by default). In essence, each BGP session on the exchange should be bilateral (or multilateral via RS) and not be used to carry transit routes between other parties. Participants found propagating routes improperly will be disconnected until the issue is fixed.

## Collaboration and Issue Resolution

If a participant is notified by OpenIX or by another participant’s NOC of an issue (such as a route leak, a malfunctioning interface causing flaps, a security incident, etc.), they are expected to respond and address the issue promptly. Unresponsiveness to repeated operational issues is a violation of the cooperative spirit expected on the exchange. While this is more of a community etiquette, gross negligence in maintaining one’s connection (for example, leaving a misconfigured router online that repeatedly destabilizes the peering fabric) will be treated as a breach of acceptable use.

## Prohibited Content and Activities

OpenIX does not monitor or filter the content of traffic, as it’s just a exchange medium, but if OpenIX is officially informed by authorities that a participant’s connection is being used for illegal activities (e.g., distributing illegal content, participating in cybercrime, etc.), OpenIX will take appropriate action as required by law. Participants should ensure that their use of the exchange does not knowingly facilitate criminal activities. Additionally, any use of the exchange that could bring OpenIX into disrepute or legal jeopardy (such as using OpenIX connectivity to bypass lawful intercept or censorship in an unlawful manner) is not allowed. Participants are expected to abide by Lebanese laws concerning content and connectivity.

## Traffic Monitoring and Privacy

OpenIX monitors aggregate traffic levels and may inspect traffic patterns or packet headers as needed for troubleshooting and ensuring compliance with these policies (for example, checking for disallowed protocols or identifying a traffic flood source). However, OpenIX does not inspect packet payloads or snoop into the content of communications between participants. Any monitoring is done in accordance with privacy laws and purely for operational integrity. Participants should be aware that if they violate technical rules (like sending BPDUs), those frames may be captured for analysis. All participants are responsible for the privacy and security of their own traffic – end-to-end encryption of sensitive data is recommended as always on any shared network.

In summary, the Acceptable Use Policy can be boiled down to: **use the IX for its intended purpose (peering), be considerate and security-conscious, and do not do anything that harms others or the facility.** OpenIX will enforce these rules to maintain a healthy environment for all connected networks.
