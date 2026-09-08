import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LogDashboard from '../components/LogDashBoard/Log-DashBoard';
import React from 'react';
import Hero, { Why } from '../components/Hero/Hero';
import '../css/custom.css';


export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout 
      title={`Hello from ${siteConfig.title}`}
      description="Next-Gen MongoDB ORM/ODM for TypeScript & JavaScript"
    > 
      {/* <HomepageHeader /> */}
      <main className="h-full w-full py-10 text-textDark bg-brand-canvas dark:bg-brand-canvas">
        <div className="hero-container mx-auto mb-16 max-w-5xl px-0">
          <Hero />
        </div>
        <Why />
        <LogDashboard />
      </main>
    </Layout>
  );
}
