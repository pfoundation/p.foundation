---
sidebar_label: 'OpenCache SLA'
title: 'OpenCache Service Level Agreement'
description: 'Annex A to the OpenCache Service Terms: availability commitments, incident response, maintenance, remedies and reporting for OpenCache.'
---

# OpenCache Service Level Agreement

**Last Updated:** November 9, 2026 · [Changelog](https://github.com/pfoundation/p.foundation/commits/master/terms/sla.md)

Annex A to [Appendix 1 (OpenCache Service Terms)](./opencache.md) of the P Foundation [Master Services Agreement](./msa.md) (the "Agreement"). It applies to each OpenCache Service Order. Capitalized terms not defined here have the meanings given in the Agreement and Appendix 1.

This SLA commits P Foundation to 99.99% monthly availability for OpenCache globally and 99.9% in each Footprint country, 24x7 incident response, and defined maintenance and reporting practices, for Customer traffic up to the Committed Capacity. Outside the Footprint, Provider delivers only through Delivery Partners whose service levels match or exceed these (Section 10). OpenCache is supplied free of charge unless a Service Order states otherwise, and remedies are operational and contractual rather than financial (Section 7).

## 1. Definitions and Measurement

**1.1 Eligible Request.** An HTTPS request for a Customer hostname that reaches a PoP in the Footprint or a Delivery Partner in a Delivery Partner Location, while Customer's traffic is within the Committed Capacity. Requests rejected because they fail Customer's signed URL or other access controls are not Eligible Requests.

**1.2 Failed Request.** An Eligible Request for which the Service, for reasons within Provider's control, (a) returns an HTTP 5xx status, or (b) fails to complete the TCP, QUIC or TLS handshake, or to return the first byte of the response, within 10 seconds. A request that fails because the Origin returns an error, times out or is unreachable is not a Failed Request.

**1.3 Measurement Interval.** Each consecutive 5-minute period in a calendar month, measured in UTC.

**1.4 Unavailable Interval.** A Measurement Interval is an Unavailable Interval:

1. for a Footprint country, if Failed Requests exceed 5% of Eligible Requests in that country, or if at least 50% of Provider's synthetic probes from inside that country fail to resolve a Customer hostname or to retrieve a Customer test object from the Service; and
2. globally, if Failed Requests exceed 5% of all Eligible Requests, or if at least 50% of Provider's synthetic probes across all monitored locations fail in the same way.

**1.5 Monthly Availability.** Calculated for each Footprint country ("Country Availability") and for the Service as a whole, including Delivery Partner Locations ("Global Availability"), as:

**Availability = (T - U - E) / (T - E) × 100%**

where T is the total Measurement Intervals in the month, U the Unavailable Intervals for that scope, and E the intervals excluded under Section 6.

**1.6 Steering is not downtime.** Requests that the Service's health steering moves from one PoP to another PoP, and that are then served successfully, are not Failed Requests. The SLA measures whether End Users in a Footprint country are served, not whether each individual PoP is up.

**1.7 Data sources.** Provider measures service levels from its PoP request logs and from synthetic probes it runs every 60 seconds from inside each Footprint country and from representative locations served by Delivery Partners, together with Delivery Partner reporting. Customer may submit its own quality-of-experience or multi-CDN switching data within 15 days after the monthly report. The Parties will reconcile any difference in good faith, and where they cannot, Customer's data showing errors attributable to the Service will be considered alongside Provider's.

## 2. Service Levels

Provider commits to the following service levels each calendar month, for traffic within the Committed Capacity. Features on Provider's rolling-release channel are covered once they reach the stable release.

| Service level                      | Commitment                                                                                                                                     | How measured                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Global availability                | At least 99.99% Global Availability per month (about 4 minutes of Unavailable Intervals per month)                                             | Section 1.5                                              |
| Country availability               | At least 99.9% Country Availability in each Footprint country (about 43 minutes of Unavailable Intervals per month)                            | Section 1.5                                              |
| Request success rate               | At least 99.95% of Eligible Requests per month served without a Failed Request, per Footprint country                                          | PoP request logs                                         |
| Health steering                    | A PoP failing health checks is removed from serving within 60 seconds                                                                          | Control-plane telemetry (health scored every 15 seconds) |
| Purge completion                   | 95% of purge requests complete on all PoPs within 60 seconds; 100% within 5 minutes                                                            | Purge API timestamps                                     |
| Prefill and Purge API availability | At least 99.9% per month                                                                                                                       | Synthetic API checks                                     |
| Configuration propagation          | Console and API changes live on all PoPs within 10 minutes                                                                                     | Control-plane telemetry                                  |
| TLS certificates                   | Provider-managed certificates renewed at least 14 days before expiry; no Customer hostname served with an expired Provider-managed certificate | Certificate monitoring                                   |
| Console and reporting availability | At least 99.5% per month                                                                                                                       | Synthetic checks                                         |

## 3. Performance Objectives

Provider will report on the following objectives every month but does not commit to them, because they depend on Customer's content mix, cache headers and steering choices. Cache offload objectives apply by Content Class: each target applies to the traffic of Customer hostnames in the Content Classes it names, and other Content Classes have no offload objective unless the Service Order sets one.

| Objective                                                  | Target                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Cache offload, Video on demand and Premium video classes   | At least 90% of requests for cacheable objects served from cache, counted from the third request for each object |
| Cache offload, Live video and Live sports & events classes | At least 80% of requests for cacheable objects served from cache, counted from the third request for each object |
| Time to first byte on a cache hit, inside Host Networks    | Median of 15 ms or less                                                                                          |
| Time to first byte on a cache hit, global                  | Median of 55 ms or less, across all delivery locations including Delivery Partner Locations                      |

If an objective is missed for two consecutive months, the Parties will review the cause together and agree any configuration or capacity changes within 15 business days.

## 4. Support and Incident Management

**4.1 Channels.** Customer may raise incidents through the 24x7 operations email and phone line in the Service Order, the Console, or a shared chat channel where the Service Order provides one. Severity 1 and 2 incidents must be raised by phone, or in the shared chat channel with an @-mention of the on-call engineer. Business hours are 08:00 to 20:00 UTC, Monday to Friday.

**4.2 Severity and response.** Response time runs from the moment Customer reports the incident, or Provider detects it, whichever is earlier.

| Severity   | Definition                                                                                                                                                   | Response         | Status updates   | Restoration target                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------------- | --------------------------------------------------------- |
| 1 Critical | Service unavailable in a Footprint country; Failed Requests above 5% in a country; or a security incident affecting Customer Data                            | 15 minutes, 24x7 | Every 30 minutes | 2 hours, or traffic steered to fallback within 30 minutes |
| 2 High     | Material degradation: Failed Requests between 1% and 5%; a PoP carrying over 20% of Customer traffic down without successful steering; Purge API unavailable | 30 minutes, 24x7 | Every 2 hours    | 8 hours                                                   |
| 3 Medium   | Limited impact with a workaround; reporting delays; a non-critical feature not working                                                                       | 4 business hours | Daily            | 5 business days                                           |
| 4 Low      | Questions, documentation, feature requests                                                                                                                   | 1 business day   | As agreed        | As agreed                                                 |

**4.3 Proactive notice.** Provider will notify Customer of any Severity 1 or 2 incident its monitoring detects within 15 minutes of detection, whether or not Customer has reported it.

**4.4 Fallback advice.** Where Provider cannot restore a Severity 1 incident within 30 minutes, it will advise Customer to steer the affected traffic to Customer's fallback path, and will tell Customer when traffic can safely return.

**4.5 Root cause analysis.** Provider will deliver a written root cause analysis for every Severity 1 incident within 5 business days, and for a Severity 2 incident within 10 business days on request. Each analysis states the timeline, cause, impact on Customer traffic and corrective actions with dates.

## 5. Maintenance and Change Management

**5.1 Scheduled maintenance.** Provider performs scheduled maintenance in one monthly window, between 02:00 and 06:00 Asia/Beirut time on a date notified at least 5 business days in advance by email and, where provided, in the shared chat channel. The notice states the PoPs affected, the work and the expected impact.

**5.2 Drain before work.** Before maintenance, Provider will drain each affected PoP through health steering, moving its traffic to other PoPs. Where no other PoP in the country can carry the traffic, the notice will state this, allowing Customer to steer to its fallback.

**5.3 Weekly releases.** Provider's regular software releases, currently weekly, are applied as rolling, zero-downtime configuration reloads. They are not maintenance, and any Failed Requests they cause count toward the service levels.

**5.4 Emergency maintenance.** Provider may perform emergency maintenance to fix a security vulnerability or prevent an imminent failure. It will give as much notice as possible and explain the reason afterward.

**5.5 Limits.** Up to 4 hours per month of scheduled maintenance and 2 hours per month of emergency maintenance are excluded from availability. Maintenance beyond those limits counts as Unavailable Intervals.

**5.6 Change freeze.** At Customer's request, Provider will avoid non-emergency changes during agreed freeze periods around major events, such as premieres, live broadcasts and Ramadan, for up to 21 days per calendar quarter.

## 6. Exclusions

The following are excluded from the service level calculations, to the extent they cause Failed Requests or Unavailable Intervals:

1. failures, slowness or misconfiguration of the Origin or Customer's fallback CDNs;
2. Customer configuration errors, Customer-supplied certificates that expire, and purges or prefills Customer initiates;
3. traffic above the Committed Capacity, outside the agreed ramp plan, or from a major event not notified under Section 4.5 of Appendix 1;
4. suspension under Section 12.3 of the Agreement or Section 9.2 of Appendix 1, unless the suspension was itself caused by Provider;
5. maintenance within the limits in Section 5.5;
6. force majeure events under Section 13 of the Agreement;
7. failures of a Host Network's power, space, uplink or routing at an Embedded PoP, provided the Service steered the affected traffic to another PoP within the health steering service level;
8. problems in End User devices, home networks or access networks outside the Footprint;
9. denial-of-service attacks against the Footprint, to the extent they exceed the mitigation capacity Provider reasonably maintains, provided Provider follows its mitigation procedures;
10. features Customer chooses to use from Provider's rolling-release channel before they reach the stable release.

## 7. Remedies and Chronic Failure

**7.1 No service credits.** No financial service credits apply, except as stated in Section 10.5 or in a Service Order. The remedies below apply instead.

**7.2 Service level failure.** If Provider misses any service level in Section 2 in a month, Provider will, at no charge:

1. deliver a root cause analysis and a written corrective action plan within 10 business days of the monthly report;
2. review the plan with Customer's technical lead and adopt Customer's reasonable comments;
3. implement the plan and report progress to Customer at least weekly until it is complete.

**7.3 Chronic failure.** A chronic failure occurs if, in any Footprint country:

1. Country Availability is below 99.9% in two consecutive months, or in any three months within a rolling six-month period;
2. Country Availability is below 99.0% in any single month; or
3. two or more Severity 1 incidents in a calendar quarter are not restored within 4 hours.

**7.4 Customer's rights on chronic failure.** On a chronic failure, Customer may, by notice within 60 days, do one or more of the following without liability: (a) terminate the OpenCache Service Order, or the part of it for the affected country, with immediate effect; (b) reduce or stop traffic in the affected country without the notice periods in the Agreement or Appendix 1; (c) require a review meeting between the Parties' executives at escalation level 4 within 10 business days.

**7.5 Exclusive remedies.** The remedies in this Section are Customer's exclusive remedies for failure to meet a service level. They do not limit Customer's rights for breach of other obligations, including Sections 6 and 7 of the Agreement, or for gross negligence or willful misconduct.

**7.6 Claims.** Customer will raise any service level failure not shown in Provider's monthly report within 30 days after receiving that report.

## 8. Reporting and Service Reviews

**8.1 Real-time.** The Console shows Customer's traffic, offload, errors and PoP health in near real time. Provider will expose a per-PoP and per-country health status endpoint that Customer's multi-CDN switching can consume.

**8.2 Monthly report.** By the 5th business day of each month, Provider will send a service report covering, per Footprint country:

- Global Availability, Country Availability and request success rate against the commitments;
- purge, configuration and steering performance;
- traffic served, peak egress and cache offload, by country and PoP;
- incidents, with severity, duration and links to root cause analyses;
- maintenance performed and planned;
- capacity headroom against Customer's forecast and the Committed Capacity.

**8.3 Quarterly review.** The Parties will meet each quarter to review service performance, capacity plans, Footprint expansion and any changes to Customer's traffic.

**8.4 SLA review.** The Parties will review the targets in this SLA every 6 months. Changes take effect only when agreed in writing by both Parties.

## 9. Escalation Matrix

Either Party may escalate to the next level when the trigger is met or when an issue is not progressing.

| Level | Trigger                                                               | P Foundation                                                              | Customer                                     |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| 1     | All incidents                                                         | 24x7 operations and on-call engineer, through the channels in Section 4.1 | Customer's on-call or operations contact     |
| 2     | Severity 1 not restored in 1 hour; Severity 2 not restored in 4 hours | Engineering lead                                                          | Customer's technical lead                    |
| 3     | Severity 1 not restored in 2 hours; repeated Severity 2 incidents     | Commercial and escalation contact                                         | Customer's commercial and escalation contact |
| 4     | Chronic failure; disputes under Section 15.2 of the Agreement         | Executive Director or President                                           | Customer's executive sponsor                 |

Names and contact details for each level are set in the Service Order.

## 10. Delivery Partner Locations and DNS

**10.1 Scope.** Country Availability measures delivery from the Footprint. Global Availability also covers traffic that Delivery Partners serve in Delivery Partner Locations.

**10.2 Delivery Partner standard.** Provider will use only Delivery Partners whose service levels match or exceed those in this SLA, including at least 99.99% monthly availability. The Delivery Partners in use at any time are listed in the register under Section 3.4 of the Agreement.

**10.3 Provider's commitments for Delivery Partner traffic.** Whichever Delivery Partner it uses, Provider will:

1. monitor Delivery Partner delivery of Customer hostnames with synthetic probes from representative locations;
2. handle Delivery Partner incidents under Section 4, with the same severities, response times and updates, and escalate them to the Delivery Partner;
3. where the Delivery Partner fails to serve Customer traffic in a location for more than 15 minutes, steer the affected requests to Customer's fallback hostname, or advise Customer to steer them;
4. report Delivery Partner traffic, availability and incidents separately in the monthly report under Section 8.2.

**10.4 Falling below the standard.** If a Delivery Partner's service levels fall below the standard in Section 10.2, Provider will notify Customer within 10 business days of becoming aware and replace that Delivery Partner within 90 days. Until then, Customer may exclude Delivery Partners under Section 3.4 of Appendix 1, without liability.

**10.5 Credits.** Where Customer pays Fees for Delivery Partner delivery under a Service Order, Provider will pass through to Customer, pro rata, any service credits it receives from the Delivery Partner for failures affecting Customer traffic. Otherwise, credits Provider receives relate to its own account.

**10.6 DNS.** DNS resolution is part of OpenCache, whichever DNS Provider Provider uses. A failure to resolve Customer hostnames counts toward Unavailable Intervals under Section 1.4 and is not excluded as a Third-Party Provider failure. Provider will keep DNS records for Customer hostnames at a time-to-live of no more than 60 seconds, allowing steering changes to take effect quickly.
