/* eslint-disable @typescript-eslint/no-require-imports */
import type { JSX, ReactNode } from 'react';
import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  // allow optional key when spread into JSX (React may add it at runtime)
  key?: React.Key;
};


const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('../../../static/img/abimongo_logo_main.svg').default,
    description: (
      <>
        Abimongo is a MongoDB ODM for TypeScript and JavaScript. It is designed to be easy to use, flexible, and powerful.
        With Abimongo, you can define schemas, models, and relationships between collections, as well as perform CRUD operations and complex queries with ease.
      </>
    )
  },
  {
    title: 'Focus on What Matters',
    Svg: require('../../../static/img/focus-glass-6.svg').default,
    description: (
      <>
        With Abimongo you can focus on your business logic and let the library handle
        the details of working with MongoDB. Abimongo provides a simple and
        intuitive API for working with MongoDB documents, so you can spend less
        time writing boilerplate code and more time building your application.
      </>
    ),
  },
  {
    title: 'Built for Performance',
    Svg: require('../../../static/img/web-performance.svg').default,
    description: (
      <>
        Abimongo is built for performance and scalability. It is designed to
        handle large amounts of data and high levels of concurrency, so you can
        be confident that your application will perform well under load. Abimongo
        is also designed to be extensible, so you can easily add new features and
        functionality as your application grows.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Why Choose Abimongo?</h2>
        </div>
        <div className="row">
          {FeatureList.map(({ title, Svg, description }) => (
            <Feature key={title} {...{ title, Svg, description }} />
          ))}
        </div>
      </div>
    </section>
  );
}
