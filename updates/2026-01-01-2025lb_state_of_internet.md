---
title: 2025 State of the Internet in Lebanon
description: A snapshot of Lebanon’s Internet in 2025, covering traffic growth, service and device trends, and shifting ISP market share.
slug: 2025lb_state_of_internet
authors: jud
image: https://assets.p.foundation/assets/a80aff34-af99-4e6d-8bd4-c38f98f29196/default.jpg
hide_table_of_contents: false
date: 2026-01-01T17:00:00Z
---

# 2025 State of the Internet in Lebanon

As we enter a new year, it’s a good moment to look back at 2025 and see how Lebanon’s Internet evolved—from traffic growth and device shifts to routing, security, and ISP market share.

Understanding how a country’s local networks change over time helps explain performance and resilience, and highlights where local interconnection can make a real difference.

That’s also the spirit behind OpenIX Beirut and P Foundation’s pledge to make connectivity more local so more traffic can stay local when it makes sense.

<!--truncate-->

## Quick 2025 facts [^1]

- **Internet traffic grew by 36%.**
- Top Internet services (in order): **Google, Facebook, Instagram, TikTok, WhatsApp, YouTube, Apple Services, Microsoft, Snapchat, Outlook**.
- Messaging apps (ranked): **WhatsApp** leads, followed by **QQ**, then **Telegram, Viber, Signal, WeChat, imo, Facebook Messenger**.
- Mobile OS share shifted:
  - **iOS rose to 37%** (from 27%)
  - **Android fell to 63%** (from 73%)
- **Google maintained ~97%** share in search.
- **IPv6 adoption decreased** from **0.96%** to **0.77%**.
- **Latency remains high** for most services at around **51 ms**.
- **Desktop traffic increased** from **39%** to **45%**.
- Routing security (RPKI):
  - **0.25% decrease** in RPKI-valid IPv4 address space in Lebanon
  - **0.51% increase** in RPKI-valid IPv4 routes in Lebanon

## ISP and network market share: what changed

Lebanon’s ISP landscape saw noticeable shifts between 2024 and 2025. **OGERO** (AS42003), the dominant state telecom provider, declined slightly from **17.96% to 16.75%**, pointing to increased competition and/or service constraints.

The largest gain came from **MIC1 (Alfa)** (AS57513), which grew from **6.23% to 7.61%**, consistent with stronger mobile Internet usage and/or improved service reach. By contrast, **TH Global Vision** (AS59989) dropped sharply from **6.48% to 4.77%**, losing nearly **26%** of its prior share.

Beyond TH Global Vision’s decline, several established players lost ground. **ENERGY Bridge** (AS56902) slipped from **3.41% to 3.04%**, **SODETEL** (AS31126) from **1.45% to 1.22%**, and **WaveNet** (AS31037) from **1.36% to 1.08%**. More dramatically, **GSL Networks** (AS137409) fell from **0.43% to 0.11%** (a ~74% drop), and **EagleNet** (AS60372) decreased from **0.63% to 0.46%**.

Mobile operators diverged: **Alfa** grew strongly, while **Touch** (AS38999) rose more modestly from **5.90% to 6.36%**. The entry of SpaceX **Starlink** (AS14593) at **0.035%** is also notable, introducing LEO satellite Internet into the Lebanese market—potentially pressuring traditional ISPs, particularly in underserved or rural areas.

Several smaller providers posted strong growth. **My ISP** (AS34447) grew from **1.19% to 2.04%**, and **Ferrari Networks** (AS39402) increased from **1.60% to 2.16%**. **ZINA** (AS206519) expanded from **0.30% to 0.51%** (+68%), while **Smart Networks** (AS34458) rose from **1.09% to 1.37%**. Among micro-ISPs, **Smart City** (AS204429) more than doubled (**0.08% to 0.20%**), **Coinnet (Matrix)** (AS214728) nearly quadrupled (**0.02% to 0.07%**), and **CONNEXIONS SAL** (AS205423) increased from **0.004% to 0.018%**. **AOUN Networks** (AS13044) stood out with growth from **0.07% to 0.33%**, suggesting aggressive expansion and/or acquisition activity.

Overall, the market appears to be gradually fragmenting. The **top 5 providers** accounted for roughly **44% of traffic** (down from 45% in 2024), and the **top 10** accounted for about **62%** (down from 63%). Meanwhile, stable performers such as **TerraNet** (AS39010) (**9.75% → 9.95%**) and **IDM** (AS9051) (**9.74% → 9.90%**) maintained their positions, suggesting strong retention despite broad turbulence.

Growth among fiber-oriented providers (e.g., **Ferrari Networks**) and the steady rise of **VISP** (AS35197) (**2.59% → 2.98%**) are consistent with continued fiber deployment where feasible.

Finally, the presence of **200+ ASNs**, including many micro-ISPs below **0.1% share**, reflects Lebanon’s highly fragmented telecom environment—shaped by infrastructure limitations, the electricity crisis, and regulatory complexity. The trend also suggests Lebanese consumers are increasingly willing to switch providers for better service, with mobile—and potentially satellite—emerging as viable alternatives to traditional fixed-line access.

---

## Top 30 networks in Lebanon

| Rank | ISP / ASN                            | 2024 Share | 2025 Share | Change (pp) |
| ---: | ------------------------------------ | ---------: | ---------: | ----------: |
|    1 | OGERO TELECOM (AS42003)              |     17.96% |     16.75% |       -1.20 |
|    2 | TERRANET (AS39010)                   |      9.75% |      9.95% |       +0.20 |
|    3 | IDM (AS9051)                         |      9.74% |      9.90% |       +0.16 |
|    4 | ALFA (AS57513)                       |      6.23% |      7.61% |       +1.39 |
|    5 | TOUCH (AS38999)                      |      5.90% |      6.36% |       +0.46 |
|    6 | TH GLOBAL VISION (AS59989)           |      6.48% |      4.77% |       -1.71 |
|    7 | MASCO (AS43824)                      |      4.59% |      4.77% |       +0.18 |
|    8 | ENERGY BRIDGE (AS56902)              |      3.41% |      3.04% |       -0.37 |
|    9 | VISP (AS35197)                       |      2.59% |      2.98% |       +0.39 |
|   10 | NETPRO (AS48206)                     |      2.54% |      2.28% |       -0.27 |
|   11 | FERRARINETWORKS(AS39402)             |      1.60% |      2.16% |       +0.56 |
|   12 | MY ISP (AS34447)                     |      1.19% |      2.04% |       +0.85 |
|   13 | FARAHNET (AS43019)                   |      1.63% |      1.73% |       +0.10 |
|   14 | CBEY (AS206406)                      |      1.28% |      1.42% |       +0.14 |
|   15 | SMARTNETS (AS34458)                  |      1.09% |      1.37% |       +0.28 |
|   16 | CONNECT (AS48847)                    |      1.37% |      1.37% |       +0.00 |
|   17 | SODETEL(AS31126)                     |      1.45% |      1.22% |       -0.23 |
|   18 | WAVENET (AS31037)                    |      1.36% |      1.08% |       -0.28 |
|   19 | NET360 (AS42183)                     |      1.12% |      0.97% |       -0.15 |
|   20 | MNETS (AS41956)                      |      1.06% |      0.89% |       -0.17 |
|   21 | CYBERIA (AS24634)                    |      0.82% |      0.86% |       +0.03 |
|   22 | BBP (AS42334)                        |      0.74% |      0.78% |       +0.05 |
|   23 | FIBERSKYNET (AS49020)                |      0.73% |      0.75% |       +0.02 |
|   24 | TOPNETLB(AS42828)                    |      0.78% |      0.75% |       -0.03 |
|   25 | BITAR NET (AS50500)                  |      0.79% |      0.71% |       -0.08 |
|   26 | FIBER NETWORKS (AS202987)            |      0.61% |      0.66% |       +0.06 |
|   27 | ICONNECT (AS15511)                   |      0.69% |      0.65% |       -0.04 |
|   28 | PROS (AS57256)                       |      0.53% |      0.62% |       +0.09 |
|   29 | BSMART (AS25471)                     |      0.56% |      0.53% |       -0.04 |
|   30 | REMINI TELECOM - VIP GROUP (AS51104) |      0.48% |      0.52% |       +0.03 |

_Change (pp) = 2025 share minus 2024 share (percentage points). Values rounded to 2 decimals._

## OpenIX Beirut

**OpenIX Beirut** is built to strengthen Lebanon’s Internet by making local interconnection simpler, faster, and more accessible—so networks can exchange traffic locally instead of sending it abroad when it doesn’t need to.

OpenIX Beirut is now **open for business**. We welcome Lebanese networks, mobile operators, content and cloud platforms, enterprises, and CDNs to join and peer locally. [Click here to learn more and get started](https://p.foundation/OpenIX/beirut).

---

[^1]: Data is based on traffic observed on our network, supplemented by publicly available Cloudflare data. For additional context, see [Cloudflare Radar — Year in Review (Lebanon)](https://radar.cloudflare.com/year-in-review/2025/lb?previousYear=true). Cover image credit: Piotr Chrobot (Unsplash); edited using Google Nano Banana.
