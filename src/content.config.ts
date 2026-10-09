import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every file in src/content/*.json is one collection holding one entry, so each
// file gets its own schema. A wrong or missing field fails the build with the
// file and field name.

// Text may wrap a phrase in *asterisks* to render it emphasised (italic / serif accent).
const text = z.string();
const lines = z.array(text).min(1); // headline broken into display lines
const seo = z.object({ title: text, description: text });

const schemas = {
  site: z.object({
    name: text,
    shortName: text,
    email: text,
    phone: z.object({ display: text, href: text }),
    offices: z.array(text).min(1),
    nav: z.array(z.object({ href: text, label: text })),
    navCta: text,
    contactLabel: text,
    skipLabel: text,
    menuLabel: text,
    footer: z.object({
      brandLines: z.array(text).min(1),
      exploreTitle: text,
      reachTitle: text,
      officesTitle: text,
      note: text,
    }),
  }),

  home: z.object({ seo }),

  hero: z.object({
    eyebrow: text,
    title: lines,
    sub: text,
    primaryCta: text,
    secondaryCta: text,
    trust: z.array(z.object({ title: text, text })).length(3),
    capTable: z.object({
      label: text,
      company: text,
      ariaLabel: text,
      tabBefore: text,
      tabAfter: text,
      holders: z
        .array(z.object({ name: text, before: z.number().min(0).max(100), after: z.number().min(0).max(100) }))
        .length(3),
      ownershipHeading: text,
      shareholderHeading: text,
      valuationLabel: text,
      valuationBefore: text,
      valuationAfter: text,
      capitalLabel: text,
      capitalPrefix: text,
      capitalSuffix: text,
      capitalRaised: z.number(),
      chip: text,
    }),
  }),

  paths: z.object({
    eyebrow: text,
    title: lines,
    lede: text,
    items: z.array(z.object({ title: text, text, tag: text, href: text })),
  }),

  services: z.object({
    eyebrow: text,
    title: lines,
    lede: text,
    includedLabel: text,
    bestForLabel: text,
    engagementLabel: text,
    outcomeLabel: text,
    trackerLabel: text,
    trackerAriaLabel: text,
    ctaPrefix: text,
    statusLabels: z.object({ done: text, active: text, queued: text }),
    items: z.array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: text,
        short: text,
        text,
        includes: z.array(text).min(1),
        bestFor: text,
        model: text,
        outcome: text,
        tracker: z.object({
          title: text,
          sub: text,
          steps: z.array(z.object({ name: text, status: z.enum(['done', 'active', 'queued']) })).min(1),
        }),
      }),
    ),
  }),

  process: z.object({
    eyebrow: text,
    title: lines,
    lede: text,
    stepLabel: text,
    outcomeLabel: text,
    steps: z.array(z.object({ title: text, text, outcome: text })),
  }),

  industries: z.object({
    eyebrow: text,
    title: lines,
    lede: text,
    coreLabel: text,
    tablistLabel: text,
    items: z.array(
      z.object({ id: z.string().regex(/^[a-z0-9-]+$/), name: text, line: text, items: z.array(text).min(1) }),
    ),
  }),

  clarity: z.object({
    messageA: text,
    messageB: text,
    fragments: z.array(z.object({ text, big: z.boolean().optional(), file: z.boolean().optional() })),
    tree: z.object({
      title: text,
      company: text,
      holders: z.array(z.object({ label: text, value: text })).length(3),
    }),
  }),

  lifecycle: z.object({
    eyebrow: text,
    title: lines,
    stages: z.array(text).min(2),
  }),

  why: z.object({
    eyebrow: text,
    title: lines,
    items: z.array(z.object({ title: text, text })),
  }),

  faq: z.object({
    eyebrow: text,
    title: lines,
    items: z.array(z.object({ question: text, answer: text })),
  }),

  cta: z.object({
    eyebrow: text,
    title: lines,
    ask: text,
    lede: text,
    button: text,
    phoneLabel: text,
    officesLabel: text,
    onboardingLabel: text,
    onboarding: text,
  }),

  about: z.object({
    seo,
    ctaEyebrow: text,
    eyebrow: text,
    title: lines,
    lede: text,
    story: z.object({
      eyebrow: text,
      big: text,
      paragraphA: text,
      missionLabel: text,
      missionText: text,
    }),
    model: z.object({
      eyebrow: text,
      title: lines,
      steps: z.array(z.object({ title: text, text })),
    }),
    agnostic: z.object({
      eyebrow: text,
      title: text,
      lede: text,
      verticals: z.array(text),
    }),
    values: z.object({
      eyebrow: text,
      items: z.array(z.object({ title: text, text })).length(3),
    }),
    reasons: z.object({ title: text, items: z.array(text) }),
  }),

  contact: z.object({
    seo,
    eyebrow: text,
    title: lines,
    lede: text,
    emailLabel: text,
    phoneLabel: text,
    officesLabel: text,
    form: z.object({
      heading: text,
      nameLabel: text,
      companyLabel: text,
      emailLabel: text,
      topicsLegend: text,
      topics: z.array(text),
      messageLabel: text,
      submit: text,
      note: text,
      missingMessage: text,
      sentMessage: text,
      subjectPrefix: text,
    }),
  }),
};

export const collections = Object.fromEntries(
  Object.entries(schemas).map(([name, schema]) => [
    name,
    defineCollection({ loader: glob({ pattern: `${name}.json`, base: './src/content' }), schema }),
  ]),
) as { [K in keyof typeof schemas]: ReturnType<typeof defineCollection<any>> };
