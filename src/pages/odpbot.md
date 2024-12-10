---
title: Open Data Platform Crawler - ODPBot
description: Understanding and managing our experimental web crawler.
---

# Open Data Platform Crawler

We have recently begun constructing our own dataset to develop models tailored to the regions in which we operate. To achieve this, we utilize a variety of data sources, including publicly available information from the internet gathered via a web crawler.

As part of our commitment to building safe and reliable systems and advancing the field of responsible AI development, we are sharing the principles that guide our data collection efforts, along with instructions on how to opt out of our crawling activities:

### Principles of Data Collection

#### Transparency

Our data collection processes are designed to be transparent. Our web crawler is identified by the User Agent Token `ODPBot`.

#### Non-intrusiveness

We strive to ensure our crawling activities are neither intrusive nor disruptive. This involves thoughtful planning to minimize the frequency of requests to the same domain and adherence to `Crawl-delay` directives where applicable.

#### Respect for "Do Not Crawl" Signals

We honor industry-standard directives in robots.txt, including disallow rules specified for our crawler.

#### Adherence to Anti-Circumvention Technologies

Our crawler respects anti-circumvention measures, such as CAPTCHAs. We will not attempt to bypass these protections on any website.

### Technical Guidance

Opting out requires modifying your `robots.txt` file as shown above. Other methods, such as blocking the IP addresses used by `ODPBot`, may not consistently or effectively ensure opt-out, as these methods can prevent our crawler from reading your `robots.txt` file.

#### Limiting Crawling Activity

To reduce the frequency of crawling by our web crawler, you can use the non-standard `Crawl-delay` directive in your `robots.txt` file. Here’s an example:

```plaintext
User-agent: ODPBot
Crawl-delay: 1
```

#### Blocking the Crawler

To completely block our crawler from accessing your website, add the following directive to the `robots.txt` file in the top-level directory of your site. This should be repeated for each subdomain you wish to exclude:

```plaintext
User-agent: ODPBot
Disallow: /
```

### Contact Information

If you have further questions or suspect our crawler is malfunctioning, please contact us at [opendatabot@p.foundation](mailto:opendatabot@p.foundation). For faster resolution, please use an email address associated with the domain in question, as this helps us verify your request.
