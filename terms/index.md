---
slug: /
sidebar_label: 'Overview'
title: 'P Foundation Terms and Policies'
description: 'The agreements, service terms, and policies that govern P Foundation services and websites.'
---

# P Foundation Terms and Policies

This page lists the agreements, service terms, and policies that apply to P Foundation services and websites. Use the menu to move between documents.

## Service Agreements

Our services are provided under our standard Master Services Agreement. Each service adds its own Service Appendix and any service level agreement. These terms apply to a customer only once that customer and P Foundation sign a Service Order, which records the customer's details, the services ordered, and any agreed variations. A signed Service Order is governed by the version of these terms in force on the date it is signed. To discuss a service, please [contact us](https://p.foundation/contact).

| Document                                               | Applies to                | Summary                                                                                                                                           |
| ------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Master Services Agreement](./msa.md)                  | All P Foundation services | General terms for every service: structure, data protection, confidentiality, liability, term and termination, and what a Service Order contains. |
| [Appendix 1: OpenCache Service Terms](./opencache.md)  | OpenCache                 | Service-specific terms for OpenCache: delivery path, capacity, neutrality, content handling, data handling, and transition.                       |
| [Annex A: OpenCache Service Level Agreement](./sla.md) | OpenCache                 | Availability commitments, incident response, maintenance, remedies, reporting, and escalation for OpenCache.                                      |

## Privacy and Data Protection

| Document                            | Applies to                               | Summary                                                                                               |
| ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Privacy Policy](./privacy.md)      | Our websites, apps, programs, and donors | How we collect, use, store, and share personal information, and the rights you have over it.          |
| [Subprocessors](./subprocessors.md) | All services                             | The third-party providers that process personal information on our behalf, with purpose and location. |

## Changes and Verification

Each document shows the date it was last updated, with a **Changelog** link to its full edit history on GitHub.

Every published version of these documents is signed with [Sigstore](https://www.sigstore.dev) and released on GitHub as a [signed terms release](https://github.com/pfoundation/p.foundation/releases?q=terms-). Each release contains the documents, their SHA-256 checksums, and a signature bundle recorded in Sigstore's public transparency log. The signature is made by our publishing workflow on the master branch, without a private key that could be lost or copied. To confirm that a copy you hold matches what we published, download the release files and run:

```sh
cosign verify-blob SHA256SUMS \
  --bundle SHA256SUMS.sigstore.json \
  --certificate-identity https://github.com/pfoundation/p.foundation/.github/workflows/sign-terms.yml@refs/heads/master \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
sha256sum -c SHA256SUMS
```

## Contact Us

For questions about these documents, please contact us:

- **Email:** privacy@p.foundation
- **Postal Mail:** P Foundation  
  700 12th St NW, Ste 700, Washington, DC 20005, United States
