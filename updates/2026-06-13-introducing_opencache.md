---
title: Introducing OpenCache
description: As OpenIX Beirut reaches its first milestone (37 networks representing roughly 73% of Lebanon's traffic), we introduce OpenCache, an open caching network that serves content from inside local networks, for every content provider rather than only the hyperscalers.
slug: IntroducingOpenCache
authors: jud
#image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
date: 2026-06-13T17:00:00Z
---

# Introducing OpenCache

A little over a year after we [announced OpenIX Beirut](/updates/IntroducingOpenIXBeirut), the exchange has reached its first major milestone: **37 networks** are now connected, including **25 of Lebanon's [top 30](/updates/2025lb_state_of_internet)**. Together they represent roughly **73% of the country's internet traffic**. At launch we set ourselves the ambitious goal of bringing over 70% of Lebanon's traffic within local reach. It took a bit longer than we hoped, but the threshold has been crossed. The two largest networks still missing are **Ogero** and **IDM**, which together carry more than a quarter of Lebanon's traffic. We continue to actively pursue both, because the resilience this exchange exists to provide is not complete until they are at the table.

Getting here also taught us where the next gap is. An exchange localizes _interconnection_: networks meet locally and trade traffic directly. It does not, by itself, localize _content_. Today we are introducing **OpenCache**: an open caching network, built and operated by P Foundation, that serves content from inside the local network, for every content provider, not just the platforms big enough to build their own.

<!--truncate-->

## The Gap an Exchange Can't Close

Lebanon's traffic historically hairpinned through Europe (typically Marseille or Paris) even when both ends of a connection sat in Beirut. OpenIX fixed the interconnection half of that problem: networks now meet locally and trade traffic directly. But content still has to be served from somewhere, and for most providers that "somewhere" remained an origin or a CDN PoP on another continent.

Working at the exchange made the asymmetry impossible to miss. The large platforms solved content localization for themselves years ago with embedded cache programs: the Googles and Netflixes of the world ship their own appliances into ISPs and exchanges, and their traffic stays local. The moment OpenIX went live, they could plug in and benefit. Everyone else, from broadcasters and news organizations to software publishers and public institutions, has no practical way to do the same unless they build and operate their own CDN. As a result, the providers whose content often matters most to the community kept serving it from abroad, and their traffic kept leaving the country.

> OpenIX localized the connections. OpenCache localizes the content.

## How It Works

OpenCache is a fleet of cache nodes, placed at exchanges and inside ISP networks, all behind a single control plane that P Foundation operates. Nodes terminate TLS, speak HTTP/1.1, HTTP/2, and HTTP/3, serve from cache, and fetch from upstream (either IX or the provider's origin) on a miss, with always-on protections like request collapsing and stale-serving, ensuring origins never face a stampede. Each node is network-aware: a listen-only BGP session with its host network tells it exactly which prefixes are local to it, and health-driven steering shifts traffic away from a draining or saturated node before users notice. A node inside an ISP serves that ISP's subscribers and offloads its transit; a node at an exchange serves every network that peers there.

The governance is as deliberate as the engineering. The data plane is designed to spread; the control plane does not spread with it. **P Foundation always operates and maintains the control plane and the traffic policies, wherever the nodes sit.** Hosting grants no control: cache rules and delivery policies are enforced identically across the fleet, TLS terminates inside the node, and a host network cannot reprioritize, alter, or selectively degrade the content its node serves. Neutrality is enforced by architecture, in the same way OpenIX offers the same terms to every participant.

We are also releasing the edge side of the project as open source at [github.com/pfoundation/opencache](https://github.com/pfoundation/opencache), allowing any ISP hosting a node, and any provider serving through one, to see exactly what runs at the edge.

## Three Months of Real Traffic

OpenCache is not launching as a promise. For the past three months we have been testing it with multiple content providers on production traffic, and the results show why local caching matters: cache effectiveness (the share of requests served straight from the local cache, without ever leaving the network) averaged **80-85% for live content** and **97% for on-demand content**. For on-demand, that means only about three requests in a hundred ever travel to the origin. Users get local latency, host ISPs shed transit they were paying for, and origins carry a fraction of their former load.

## Get Involved

OpenCache is live today at [OpenIX Beirut](/OpenIX/beirut); any network peering at the exchange already reaches it over local peering, with no transit in the path. From here, the way in depends on who you are:

- **Content providers**: [crate an account](/apply/opencache) and start serving instantly. You keep your origin and full authority over your content, and there is no requirement to operate your own CDN; that is precisely the gap OpenCache exists to fill. Where OpenCache does not yet have a footprint, partner CDNs keep your audience covered globally.
- **Developers**: the OpenCache edge is open source. You are welcome to explore the code, open issues, and contribute at [github.com/pfoundation/opencache](https://github.com/pfoundation/opencache).
- **Exchanges and communities**: [talk to us](/contact) about bringing OpenCache to your region.
