---
sidebar_label: 'OpenCache Service Terms'
title: 'OpenCache Service Terms'
description: 'Appendix 1 to the P Foundation Master Services Agreement: the service-specific terms for OpenCache.'
---

# Appendix 1: OpenCache Service Terms

**Last Updated:** October 21, 2026 (version 0.3)

This Appendix sets the terms for OpenCache and forms part of the [Master Services Agreement](/terms/msa) for every Service Order that names it. The [OpenCache Service Level Agreement](/terms/sla) is Annex A to this Appendix. Capitalized terms not defined here have the meanings in the Agreement.

## 1. Definitions

- **"Committed Capacity"** means the peak egress and monthly volume, per Footprint country, that Provider commits to carry for Customer in the Footprint, as stated in the Service Order and updated under Section 4.3.
- **"Delivery Partner"** means a third-party content delivery network that Provider uses to deliver Customer Content to End Users outside the Footprint.
- **"Delivery Partner Location"** means any location where End User requests are served by a Delivery Partner rather than by a PoP.
- **"DNS Provider"** means the third-party authoritative DNS service that Provider uses to resolve OpenCache hostnames and steer End User requests.
- **"Embedded PoP"** means a PoP that Provider deploys and operates inside a Host Network.
- **"Exchange PoP"** means a PoP located at an internet exchange.
- **"Footprint"** means the countries and PoPs operated by Provider through which OpenCache is delivered at a given time, as shown in the Console.
- **"Host Network"** means an internet service provider or other network that hosts an Embedded PoP or connects to an Exchange PoP.
- **"Origin"** means the servers, storage or third-party CDN designated by Customer from which OpenCache retrieves Customer Content on a cache miss.
- **"PoP"** means an OpenCache point of presence operated by Provider, whether an Exchange PoP or an Embedded PoP.

## 2. Service Description

**2.1 What OpenCache does.** OpenCache caches Customer Content and serves it to End Users whose requests Customer directs to it. Provider operates OpenCache end to end, including the Console, the Prefill and Purge API, signed URL validation, TLS termination, HTTP/1.1, HTTP/2 and HTTP/3 delivery, and delivery reporting.

**2.2 Delivery path.** The DNS Provider resolves each End User request for a Customer hostname according to the End User's network and the health of each delivery point:

1. End Users inside a Host Network with an Embedded PoP are served by that PoP.
2. On a miss at an Embedded PoP, or for End Users of networks connected to an internet exchange, the request is served by the Exchange PoP over local peering.
3. On a further miss, OpenCache retrieves the content from the Origin.
4. End Users outside the Footprint are served by a Delivery Partner, unless Customer has excluded Delivery Partners under Section 3.4.

**2.3 Health steering.** Each PoP reports a health score to Provider's control plane at least every 15 seconds. Traffic is steered away from a degraded, saturated or drained PoP to the next healthy delivery point.

**2.4 Customer steering.** Customer decides which End User requests are directed to OpenCache, including through DNS, multi-CDN switching or its applications. Customer may increase, reduce or stop traffic to OpenCache at any time without liability.

## 3. Third-Party Providers

**3.1 Current providers.** The Delivery Partners, DNS Provider and other subprocessors that Provider uses for OpenCache are listed at [p.foundation/terms/subprocessors](/terms/subprocessors). Provider may change them under Sections 3.4 to 3.6 of the Agreement by updating that page, without amending this Appendix. Delivery Partners must meet the standard in Section 10.2 of Annex A.

**3.2 Delivery Partners.** For Delivery Partner Locations, Provider configures the Delivery Partner under Provider's own account, using Customer's OpenCache configuration, so that Customer needs no separate agreement with it. To serve HTTPS requests, the Delivery Partner holds TLS certificates for the Customer hostnames it serves. The Delivery Partner's own operational, content and abuse policies apply to the traffic it carries.

**3.3 Delivery Partner allowance.** Provider bears the cost of Delivery Partner delivery. The Service Order may set a monthly Delivery Partner allowance. If Customer's Delivery Partner traffic exceeds that allowance for two consecutive months, Provider may, after \[15\] days' notice, steer the excess to Customer's Origin or fallback CDN.

**3.4 Excluding Delivery Partners.** Customer may elect in the Service Order, or later on \[15\] days' notice, not to use Delivery Partners. Requests from outside the Footprint are then resolved to the fallback hostname Customer designates.

**3.5 DNS Provider.** The DNS Provider is part of the delivery path for all OpenCache traffic. Provider remains fully responsible for DNS resolution and steering under Annex A, whichever DNS Provider it uses.

**3.6 Changes of provider.** When Provider replaces a Delivery Partner or the DNS Provider, it will migrate Customer's configuration and certificates itself and coordinate the cut-over with Customer to avoid interruption.

## 4. Onboarding, Capacity and Traffic Growth

**4.1 Configuration.** Customer configures its hostnames, Origins, failover, cache rules, signed URLs and purge credentials through the Console. Provider issues and renews TLS certificates for Customer hostnames automatically through ACME, unless Customer supplies its own. Customer is responsible for the accuracy of its configuration.

**4.2 Forecasts.** Customer will give Provider a written traffic forecast for each Footprint country, showing expected peak egress (Gbps) and monthly volume (TB) for the next \[3\] months. Customer will update it by the \[5th\] business day of each month, and at least \[14\] days before any planned increase above the Committed Capacity.

**4.3 Committed Capacity.** Provider will maintain enough capacity in the Footprint to serve Customer's traffic up to the Committed Capacity. Provider will confirm or decline a requested increase within \[10\] business days; once confirmed in writing (email is enough), the new figure becomes the Committed Capacity.

**4.4 Ramp plan.** Customer will increase traffic above the Committed Capacity in steps agreed with Provider, and not by more than \[25\]% of peak per week unless agreed otherwise. Traffic above the Committed Capacity is served on a best-efforts basis and is outside the Annex A service levels.

**4.5 Major events.** Customer will give at least \[10\] business days' notice of any live event, premiere or release it expects to generate more than \[1.5\] times its normal peak. The Parties will agree a prefill and capacity plan for the event.

## 5. Responsibilities

**5.1 Provider will:**

1. operate, monitor and maintain OpenCache, every PoP and the configuration of each Delivery Partner and the DNS Provider, 24 hours a day, 7 days a week;
2. keep health steering in operation so that traffic moves away from a degraded or saturated delivery point;
3. manage its relationships with Host Networks, internet exchanges and Third-Party Providers, so that Customer needs no separate agreement with them;
4. provide delivery reporting in the Console, including traffic, cache offload and errors per country and delivery point, with Delivery Partner traffic shown separately.

**5.2 Customer will:**

1. maintain an Origin able to serve all cache misses, and a fallback delivery path for End Users if OpenCache is unavailable;
2. set cache-control headers and cache rules suitable for its content;
3. give the forecasts and notices described in Section 4;
4. tell Provider promptly of any delivery problem it observes, including through its quality-of-experience monitoring.

## 6. Neutrality and Footprint Changes

**6.1 Equal terms.** Provider offers OpenCache to all content providers on equal terms. Provider will not prioritize, deprioritize, alter or selectively degrade Customer Content relative to other content in the Footprint, except as allowed by Section 12.3 of the Agreement.

**6.2 Host Networks.** Host Networks provide space, power and connectivity only. They gain no access to Customer configuration, certificates or traffic policies, and TLS for Footprint traffic terminates only on Provider-operated hardware.

**6.3 Footprint changes.** Provider may add PoPs and countries to the Footprint at any time. Provider will give at least \[30\] days' notice before permanently removing a PoP that carried more than \[10\]% of Customer's Footprint traffic in the preceding month, except where the removal is caused by a Host Network or a force majeure event.

## 7. Content, Rights and Takedown

**7.1 Territorial and access controls.** Customer is responsible for enforcing its licensing territories, entitlements and DRM. OpenCache, including Delivery Partners, enforces the signed URL, token and other access controls Customer configures. Provider does not handle Customer's DRM keys, and encrypted media is delivered without being decrypted.

**7.2 Passive caching.** Provider acts only as a passive intermediary. It does not select, edit, monitor or originate Customer Content, and has no obligation to review it.

**7.3 Takedown.** Customer can remove content from the Footprint and Delivery Partners at any time through the Purge API. If Provider receives a takedown notice, court order or lawful government demand concerning Customer Content, it will forward it to Customer promptly where legally allowed. Where Provider or a Delivery Partner is legally required to act before Customer can, it may block access to the specific content concerned, and Provider will tell Customer immediately.

## 8. Data Handling

**8.1 Request logs.** OpenCache records request logs that contain End User IP addresses and request details. Provider keeps request logs containing Personal Data for no longer than \[30\] days, after which they are deleted or irreversibly aggregated.

**8.2 Third-Party Providers.** Delivery Partners process request data for the traffic they serve, and the DNS Provider processes DNS queries, each as Provider's subprocessor under Section 6.4 of the Agreement, in the regions where their infrastructure operates. They are listed in the register under Section 3.4 of the Agreement.

**8.3 Security.** TLS private keys for Footprint traffic are stored and used only on Provider-operated hardware. Configuration, telemetry and logs travel encrypted between PoPs and the control plane. Provider applies critical security patches to PoP software within \[14\] days.

## 9. Fees, Suspension, Termination and Transition

**9.1 Fees.** OpenCache is supplied free of charge unless the Service Order states otherwise. Section 5.6 of the Agreement applies to any proposed Fee.

**9.2 Suspension.** In addition to Section 12.3 of the Agreement, Provider may rate-limit Customer traffic that materially exceeds the Committed Capacity without the notice required by Section 4, to the extent needed to protect the Footprint or a Host Network.

**9.3 Termination for convenience.** Customer may terminate an OpenCache Service Order on \[30\] days' notice, and may stop directing traffic to OpenCache at any time. Provider may terminate on \[180\] days' notice.

**9.4 Transition.** On any termination other than for Customer's breach, Provider will continue OpenCache on these terms for up to \[90\] days, as Customer requests, so Customer can migrate traffic. Provider will purge Customer Content from the Footprint and Delivery Partners, and remove Customer's DNS records and certificates, within \[7\] days after the Service ends. This Section survives termination.

## 10. Service Levels and Service Order Details

**10.1 Service levels.** Provider's service levels, support and remedies for OpenCache are set out in Annex A, the [OpenCache Service Level Agreement](/terms/sla).

**10.2 Service Order details.** Each OpenCache Service Order states:

- Customer services and hostnames covered;
- content types;
- Footprint countries in scope;
- Committed Capacity per country;
- whether Delivery Partners are used, any monthly Delivery Partner allowance, and the fallback hostname;
- Origin and fallback CDNs;
- features enabled;
- escalation contacts for Annex A.
