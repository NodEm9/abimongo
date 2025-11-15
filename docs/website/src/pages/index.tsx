import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '../components/HomepageFeatures';
import Heading from '@theme/Heading';
import LogDashboard from '../components/LogDashBoard/Log-DashBoard';
import Snippet from '../components/LogDashBoard/snippetAnimated';
import React from 'react';
import Hero, { Why } from '../components/Hero/Hero';
import styles from './index.module.css';
// import '../output.css';


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroAndSnippet}>
          <div className={styles.heroContent}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <div className={styles.buttons}>
              <Link
                className={styles.buttonHero}
                to="/tutorials/core_tutotrials/core-tutorials">
                <span>
                  Go To Tutorials 📖
                </span>
                <span>What's New?</span>
              </Link>
            </div>
          </div>
          <div>
            <Snippet />
          </div>
        </div>
      </div>
    </header>
  );
}

// export default function Home(): ReactNode {
//   const { siteConfig } = useDocusaurusContext();
//   return (
//     <Layout
//       // wrapperClassName='dark'
//     title={`Hello from ${siteConfig.title}`}
//     description="Next-Gen MongoDB ORM/ODM for TypeScript & JavaScript"
//     >
//       {/* <HomepageHeader /> */}
//       <main className="mt-60 mb-80 py-80 h-screen bg-[var(--brand-canvas)] text-[var(--brand-text)]">
//       <Hero />
//       <Why />
//         {/* <HomepageFeatures /> */}
//         <div className="my-80">
//           <LogDashboard />
//         </div>
//       </main>
//     </Layout>
//   );
// }


export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Next-Gen MongoDB ORM/ODM for TypeScript & JavaScript"
    >
      {/* Page wrapper uses brand canvas and follows dark mode via data-theme */}
      <main className="bg-[var(--brand-canvas)] dark:bg-[#0A1320] text-[var(--brand-text)]">
        <Hero />
        <Why />
        <div className={styles.logDashboard}>
          <LogDashboard />
        </div>
      </main>
    </Layout>
  );
}
