import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { AboutMe } from "../components/homepage/AboutMe";
import {
  SocialLinkData,
  SocialLinks,
} from "../components/homepage/SocialLinks";
import { Hero } from "../components/homepage/Hero";

import avatar from "./assets/index/avatar.jpg";
import AboutMeDesc from "./assets/index/_about-me.md";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <Hero />
      <main>
        <div className="container padding-vert">
          <AboutMe avatar={avatar} descriptionComponent={<AboutMeDesc />} />
        </div>
      </main>
    </Layout>
  );
}
