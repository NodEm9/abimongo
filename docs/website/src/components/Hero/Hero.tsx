import React from "react";
import Link from '@docusaurus/Link';
import '../../css/custom.css';
import CodeBlock from "@theme/CodeBlock";


export default function Hero() {
  return (
    <header className="">
      {/* HERO */}
      <section
        className="
        abimongo-hero
           mx-auto mt-6 max-w-5xl overflow-hidden rounded-2xl px-6 py-10 text-white shadow-card
        bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(11,30,51,.75),transparent),linear-gradient(160deg,rgba(11,30,51,.95)_0%,rgba(30,136,229,.90)_45%,rgba(0,196,180,.90)_100%)]
        "
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Abimongo</h1>
        <p className="mt-2 max-w-xl text-base/7 opacity-95 sm:text-lg">
          A MongoDB ORM/ODM for TypeScript and JavaScript—built for dynamic multi-tenancy, GraphQL,
          Redis caching, and enterprise-grade scale.
        </p>

        {/* Primary CTAs */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/tutorials/core_tutotrials/core-tutorials"
            className="link inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow-md transition bg-gradient-to-tr from-blueBrand to-tealBrand hover:-translate-y-0.5"
          >
            Go to Tutorials 📘
          </Link>
          <Link
            to="#whats-new"
            className="link inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur-sm transition hover:opacity-95"
          >
            What’s New?
          </Link>
        </div>

        {/* TypeScript Code Snippet */}
        <div className="mt-6 max-w-2xl rounded-xl border border-white/5 bg-[#10161f] p-4 shadow-card overflow-hidden">
          <CodeBlock language="ts" showLineNumbers title="models/user.ts">
            {`import { AbimongoSchema, model } from '@abimongo/core';

const userSchema = new AbimongoSchema({
  username: String,
  email: String,
  roles: [String]
}, { timestamps: true });

export const User = model('User', userSchema);`}
          </CodeBlock>
        </div>
        {/* Secondary CTA Row (npm + GitHub + Docs) */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="https://www.npmjs.com/package/@abimongo/core"
            className="link inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/15"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-tealBrand"></span>
            npm: @abimongo/core
          </Link>
          <Link
            to="https://github.com/Nodem9/abimongo"
            className="link inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/15"
          >
            <GitHubIcon className="h-4 w-4" /> Star on GitHub
          </Link>
          <Link
            to="https://Nodem9.github.io/abimongo"
            className="docs-link inline-flex items-center gap-2 rounded-lg bg-white text-[#000] px-3 py-1.5 text-sm font-semibold hover:opacity-95"
          >
            Docs
          </Link>
        </div>
      </section>
    </header>
  );
}

/** Brand “A” icon with angled gradient (blue → teal) */
function AbimongoAIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="abimongoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#00C4B4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#abimongoGrad)"
        d="M21.5 4c1.5-3 3.5-3 5 0l16 40h-8.6l-3.5-9.2H17.6L14 44H5.4L21.5 4zm-1.8 23h8.7l-4.3-11.4L19.7 27z"
      />
    </svg>
  );
}

export function Why() {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureCard title="Dynamic Multi-Tenancy" desc="Isolate data per tenant with flexible strategies and minimal config." />
      <FeatureCard title="GraphQL-Ready" desc="Generate schemas & resolvers directly from your models." />
      <FeatureCard title="RBAC + Redis" desc="Built-in roles/permissions and caching for performance." />
      <FeatureCard title="TypeScript-First" desc="Strong typing, testability, and clean DX for teams that scale." />
    </section>
  );
}

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.33c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.88-1.16-.88-1.16-.72-.5.05-.49.05-.49.79.06 1.2.82 1.2.82.71 1.21 1.87.86 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.13-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82A7.7 7.7 0 0 1 8 3.87c.68 0 1.36.09 2 .26 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.55.82 1.26.82 2.13 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-borderLight p-4 shadow-sm dark:border-[#1f2b3e] dark:bg-[#0f1a2b]">
      <h3 className="h3-title mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-textMuted dark:text-[#A9B6C7]">{desc}</p>
    </div>
  );
}
