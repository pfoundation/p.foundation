---
title: Owning the Stack
description: P Foundation built its own sovereign infrastructure to cut costs, boost performance, and protect data, helping independent media and communities.
slug: OwningTheStack
authors: jud
#image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
date: 2025-08-07T21:00:00Z
---

# Owning the Stack

_I think this might be my fourth draft about ONS (Open Notification Service). The first was for the initial announcement, the second for the milestone of sending 1 billion notifications, and now this one. Neither of the earlier drafts made it to the website for one reason or another, so I hope this version covers everything and more._

Before founding P Foundation, I was an early cloud adopter, going back to Google App Engine in 2008-9, and I continued to use the cloud for most projects. But when I started P Foundation in 2021, we made a deliberate, day-one decision to build and operate our own infrastructure end-to-end: from the network layer to the hardware, and eventually run our own data centers.

<!--truncate-->

## Control, Privacy, and Scale

From the outset we kept our use of public cloud minimal and intentional. As a nonprofit, we couldn’t justify locking ourselves into high recurring costs or vendor dependencies for core workloads. We chose to own and run what matters, and avoid deep reliance on the public cloud. When DHH and 37signals publicly detailed their own decision to step back from the cloud in October 2022 (see [“Why we’re leaving the cloud”](https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0)), it simply validated a path we were already on.

By owning our infrastructure, we have real cost control. We know exactly what we spend on hardware, power, and bandwidth, no surprise line items, no “forensic accounting” to decode a monthly bill. One‑time investments in servers and networking gear translate into predictable Opex, and the savings go straight back into the mission. In short: owning keeps us in charge of our budget.

### Data Sovereignty

Cost wasn’t the only driver. Data sovereignty and operational independence were, and are, central. We support independent media worldwide and often handle sensitive information. Parking that data in hyperscale clouds can subject it to external jurisdictions and policies outside our control. Running on hardware we choose, in locations we choose, gives us clarity over where assets live and who can access them.

This approach aligns with a broader reassessment of where critical data resides. Regulations and privacy norms are pushing more organizations to keep key systems on infrastructure they control. Our answer is “sovereign infrastructure”: our Points of Presence (PoPs) and core systems run on hardware we physically own and administer. Today we operate three principal PoPs that house core databases, application servers, and media repositories. That gives us precise geolocation awareness, access control, and a security posture that’s hard to match in a generic public‑cloud setup.

### Better Performance for Less

An added benefit of running our own infrastructure is the performance improvement. We anticipated cost and control advantages, but our applications also became faster and more responsive after migrating to our own hardware. This confirmed that on-prem can be not only economically prudent but also technically superior for stable, heavy workloads.

We optimized our infrastructure for the specific needs of our Media Guard platform and other services. By using bare-metal servers with high-performance CPUs, ample RAM, and fast NVMe storage, we eliminated the overhead and noisy neighbors common in public cloud instances. Applications now have full use of the hardware, and we can fine-tune the environment in ways not possible in a generic cloud setup. The result is lower latency in database queries, faster page loads, and higher capacity for concurrent users. Our users, journalists, researchers, and citizens accessing our partners’ media sites, enjoy a snappier, more reliable experience.

Reliability has also improved. By distributing infrastructure across multiple PoPs, we have built redundancy and fault tolerance into our network. If one pop encounters an issue, others can take over, something harder to achieve in a single cloud region. Additionally, direct peering with local ISPs and internet exchanges allows us to route around problems and avoid congestion.

### Strategic Cloud Use

Building on the performance and reliability gains from our own infrastructure, we also examined which elements could still benefit from selective cloud use.

While we have intentionally avoided relying on the cloud for most workloads, we recognized there were areas where it made sense to use it. For certain functions, particularly long-term storage and archival, the cloud’s scale and cost-efficiency are hard to beat. Building our own global cold storage system would have been impractical given the large volume of archives and backups we manage, most of which are rarely accessed. Instead of investing in massive storage arrays, we use cost-effective cloud services such as [Amazon S3](https://aws.amazon.com/s3/) for bulk storage and [AWS Glacier](https://aws.amazon.com/glacier/) for deep archives.

This approach gives us the best of both worlds. We keep live, mission-critical systems under our control, while leveraging the cloud’s economies of scale for rarely accessed data. S3 provides affordable storage, and Glacier offers ultra-low-cost archival. The cost per terabyte is so low that it outcompetes running our own tape libraries or spinning disks, especially when factoring in maintenance and power.

We encrypt any sensitive data stored in the cloud with our own keys, addressing sovereignty concerns. For now, this mix of ownership and selective renting gives us maximum value: we control high-impact workloads and rent low-cost storage. As our needs grow, we will periodically revisit these decisions.

### Cloudflare Love

While Cloudflare is a third-party provider, its role in our ecosystem complements rather than contradicts our sovereign approach. We regard it as a strategic ally whose services enhance rather than diminish our autonomy, operating as a neutral, globally distributed network layer under our configuration and control.

By leveraging their infrastructure without ceding ownership of our core systems, we extend our reach and resilience while preserving the independence central to our philosophy. From their innovative [Project Galileo](https://www.cloudflare.com/galileo/), which offers free protection to at-risk organizations, to robust load balancing and DDoS mitigation tools, Cloudflare’s services are deeply integrated into our stack. Their global network ensures fast, secure content delivery worldwide, and their fair, reasonable pricing keeps these advantages within reach for a nonprofit like ours.

In many ways, Cloudflare complements our sovereign infrastructure by adding another layer of resilience and reach.

We also recognize that there are moments when demand exceeds our own capacity. During major events such as presidential elections or sudden breaking news with massive audience spikes, we temporarily rely on external content delivery networks to help handle the load. This approach ensures that users continue to enjoy a seamless experience even when traffic surges unexpectedly. By combining our own infrastructure with these external resources only when necessary, we strike a balance between sovereignty, cost-effectiveness, and readiness for high-impact moments.

### Media Guard

One of the biggest beneficiaries of our infrastructure is our Media Guard program, which provides technical infrastructure to independent media outlets worldwide. This includes satellite news downlinking, backhaul support, digital streaming, and content distribution. In essence, we serve as the backend backbone that helps keep news sites and streams online, even in challenging environments.

Many of our partners previously hosted their content on cloud or shared hosting platforms. As we integrate them into Media Guard, we transition them to our infrastructure, lowering latency, improving performance, and eliminating surprise bandwidth bills. Serving content from local PoPs instead of distant cloud regions improves user experience and reliability.

Owning the platform also lets us tailor support and protection. We can apply custom caching rules, DDoS protection, and high-availability setups to match each partner’s needs. In crisis situations, having control over the servers allows rapid response, rerouting traffic, provisioning extra capacity, or shielding at-risk sites. For partners facing cyberattacks or censorship, this can be life-saving.

Migrating partners from cloud setups to our PoPs is not simple, but our team provides hands-on support to ensure smooth transitions. This consolidation allows us to onboard more organizations without proportionally increasing costs, which is vital for our nonprofit model.

### Reinvesting

The savings from avoiding high cloud costs have allowed us to expand and innovate. We have been able to invest in new regions, such as launching the [OpenIX Beirut](/messages/IntroducingOpenIXBeirut) to localize internet infrastructure in Lebanon. We are also exploring new PoPs in other areas to improve local media connectivity.

We invested in our own GPU cluster, enabling us to run AI workloads in-house instead of paying for expensive cloud GPUs. This has allowed us to develop AI tools for our partner newsrooms, such as automatic video transcription, AI-based content moderation, and intelligent alert systems. These tools require significant compute power, which we can now provide ourselves.

Owning our infrastructure has also fostered a culture of optimization and experimentation. Our engineers understand the full stack, which sparks creative solutions. We can adopt new technologies at our own pace, without waiting for cloud vendor support.

### Oh, 1 Billion Notifications Monthly

Back to where I began. When we started offering ONS to our partners, we knew how critical it was to deliver notifications quickly and reliably. We also wanted a solution we could deploy rapidly, and the cloud offered a quicker path to getting started without heavy upfront infrastructure work. Initially, we used [Apache Pulsar](https://pulsar.apache.org/) through [StreamNative](https://streamnative.io/), but as with other cloud services, costs grew quickly. Pulsar’s complexity also made it challenging to run in our fully independent, multi-region setup.

That changed when we discovered [NATS](https://nats.io/), which we now run across all our regions. NATS has been transformative: lightweight, incredibly fast, and designed with simplicity and scalability in mind. Its built-in features for clustering, persistence, and streaming allow us to operate a truly distributed messaging system that matches our independent, multi-PoP architecture perfectly. NATS handles millions of messages per second with ease, giving us confidence that critical alerts will always get through.

With NATS, we are delivering **1 billion** mobile notifications every month, a milestone that not only encapsulates the technical and strategic journey described from the outset, but also affirms the transformative impact of building and maintaining our sovereign infrastructure, from urgent evacuation orders and life-saving blood bank requests to traffic updates and breaking news alerts. The Open Notification Service has become a vital lifeline for the communities we serve and for our partners, enabling real-time communication that can improve safety, inform citizens, and even save lives. Whether it’s warning people in conflict zones, helping coordinate emergency responses, or simply keeping the public informed, ONS is proving how infrastructure choices directly impact human well-being.
