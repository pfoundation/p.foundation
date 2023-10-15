import React from 'react';
import Footer from '@theme-original/Footer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Newsletter } from '../../components/newsletter/Newsletter';
import {
  defaultSocialLinkData,
  SocialLinks,
} from '../../components/homepage/SocialLinks';
export default function FooterWrapper(props) {
  const { siteConfig } = useDocusaurusContext();

  return (
    <>
      <Newsletter data={siteConfig.customFields.newsletter} />
      {/* <SocialLinks data={defaultSocialLinkData} /> */}
      <Footer {...props} />
    </>
  );
}
