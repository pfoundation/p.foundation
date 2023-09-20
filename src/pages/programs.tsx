import React from "react";
import Layout from "@theme/Layout";

import Program, { ProgramMetadata } from "../components/programs/Programs";

import BuildingGQLAPIForK8sResDescription from "./assets/programs/_building-gql-api-for-k8s-res.md";
import DevTeamCollaborationGitBestPracticesDescription from "./assets/programs/_dev-team-collaboration-git-best-practices.md";
import GraphQLInGoDescription from "./assets/programs/_graphql-in-go.md";

const programs: ProgramMetadata[] = [
  {
    title: "Building GraphQL API for Kubernetes resources",
    description: <BuildingGQLAPIForK8sResDescription />,
    beneficiaries: [
      {
        name: "Cloud Native Warsaw",
        location: "Warsaw, Poland",
        date: new Date(2019, 8, 10),
      },
      {
        name: "SAP Kubernetes Summit",
        location: "St. Leon-Rot, Germany",
        date: new Date(2019, 6, 17),
      },
      {
        name: "San Diego Cloud Native Computing Meetup",
        location: "San Diego, USA",
        date: new Date(2019, 10, 26),
      },
    ],
    recordingURL: "https://www.youtube.com/watch?v=u_hRoDvKC6Q",
    slidesURL:
      "https://docs.google.com/presentation/d/1tcm6lH5Z8-El5A-kyHttIm_jJ92WPyPZ5ZQempA6vJQ/edit",
  },
  {
    title: "Development team collaboration: Git best practices",
    description: <DevTeamCollaborationGitBestPracticesDescription />,
    beneficiaries: [
      {
        name: "SAP Labs Hack Your Career",
        location: "Gliwice, Poland",
        date: new Date(2019, 2, 26),
      },
    ],
    slidesURL:
      "https://docs.google.com/presentation/d/12Izhj479oZ7ilDsAgljwBBHXt4_cPsX120QZtf1hIA4/edit",
  },
  {
    title: "GraphQL in Go",
    description: <GraphQLInGoDescription />,
    beneficiaries: [
      {
        name: "Gophers Silesia",
        location: "Katowice, Poland",
        date: new Date(2018, 4, 10),
      },
    ],
    recordingURL: "https://www.youtube.com/watch?v=NjFXLbJvZmQ",
    slidesURL:
      "https://docs.google.com/presentation/d/1v6H21vHMd_rAZ9qjXcags2dMR2OYR-kQkarNVJZxbOs/edit",
    repoURL: "https://github.com/pkosiec/golang-graphql-samples",
  },
];

const title = "Programs";
const description = "Current active programs";

export default function Programs(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main className="container container--fluid margin-vert--lg">
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="row">
          {programs.map((programData) => (
            <Program key={programData.title} {...programData} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
