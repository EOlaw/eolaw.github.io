# InsightSerenity Website Repositioning Implementation

## Files Being Modified

Planned safe implementation files:

- `index.html`
- `services.html`
- `about.html`
- `consultation.html`
- `contact.html`
- `work.html`
- `blog.html`
- `blog-post.html`
- `case-study.html`
- `assets/data/case-studies.json`
- `assets/js/main.js`
- `README.md` only if time allows and the public site changes are complete

## Components Being Reused

- Existing navbar and mobile navigation pattern.
- Existing hero/page-hero layouts.
- Existing service cards and service-detail alternating sections.
- Existing card, badge, skill-tag, check-list, CTA banner, footer, FAQ, and reveal animation classes.
- Existing JSON-driven Work and Case Study rendering.
- Existing contact/booking form markup and mailto behavior.

## Copy Being Changed

- AI-only phrases change to broader technology consulting language.
- "AI consultation" changes to "Discovery Consultation" or "Book a Consultation" except where the context is specifically AI & Automation.
- "I/my consultancy/work with me" language changes to "InsightSerenity/we/our" where appropriate.
- Founder copy changes to "Founder & Technical Lead."
- Unsupported statistics and testimonials are removed or softened.
- Service titles change to the seven-service architecture.

## Routes Affected

- `/index.html`
- `/services.html`
- `/about.html`
- `/consultation.html`
- `/contact.html`
- `/work.html`
- `/case-study.html?slug=...`
- `/blog.html`
- `/blog-post.html?slug=...`

Routes preserved:

- `/books.html`
- `/library.html`
- `/scripture/`
- `/scripture/read.html`
- Standalone app demo folders
- `/privacy.html`
- `/terms.html`

## SEO Updates

Safe first-pass updates:

- Homepage title/description broadened from autonomous AI to technology consulting.
- Services page title/description broadened to data, AI, software, automation, cloud, BI, and strategy.
- About, Work, Blog, Consultation, and Contact meta descriptions updated.

Deferred SEO:

- Canonical tags
- OpenGraph/Twitter metadata
- Structured data
- `robots.txt`
- `sitemap.xml`

## Service Migrations

Existing AI services are migrated as follows:

- AI Strategy Consultation -> Technology Strategy & Consulting / Discovery Consultation
- Autonomous AI Agents -> Artificial Intelligence & Automation
- AI Pipelines & Automation -> AI & Automation plus Data Engineering
- AI System Architecture -> Cloud & IT Systems plus AI & Automation
- Custom AI Development -> Data Science & ML plus AI & Automation
- AI-Powered Applications -> Software & Systems Development

New service architecture:

- Data Science & Machine Learning
- Artificial Intelligence & Automation
- Data Engineering
- Business Intelligence & Analytics
- Software & Systems Development
- Cloud & IT Systems
- Technology Strategy & Consulting

## Content Being Relocated

- Word of God homepage feature: remove from primary homepage flow while keeping route/nav/floating action access.
- Personal builds: keep on Work page but label as Internal R&D / Lab Projects.
- Books/Library: keep under Explore and footer navigation where already present.

## Content Being Removed

Planned deletions or public removals:

- Homepage unverified stats block.
- Homepage unverified testimonials section.
- Work page standalone testimonial block.
- Unsupported "real results" language where the case-study evidence is not in the repo.

Justification: The audit found no repository evidence for these claims. Removing or softening them prevents fabricated credibility.

## Claims Requiring Business-Owner Verification

- Specific client names, roles, testimonials, and company names.
- Specific outcome percentages and dollar amounts.
- Project timelines and delivery durations.
- Client counts and satisfaction percentages.
- Certification details and issue dates.
- Published book ratings/reviews.

## Testing Plan

Because no package.json or build pipeline exists:

- Validate JSON syntax for `assets/data/case-studies.json` and `assets/data/blog-posts.json`.
- Run a local static server.
- Open primary routes in browser/manual inspection where possible.
- Check console for broken JS on home, services, work, case-study, blog, consultation, and contact.
- Verify primary CTAs point to `/consultation.html`.
- Verify JSON-backed Work and Case Study pages still render.
- Run link scans with `rg` for obsolete "autonomous AI consultancy" and "Book AI Consultation" references.

## Completed Implementation Notes

Implemented changes:

- Created `docs/WEBSITE_BUSINESS_AUDIT.md`.
- Repositioned homepage hero, service overview, process, FAQ, CTA, and footer language.
- Removed homepage testimonials and large homepage Word of God promo block while preserving `/scripture/` and nav/FAB access.
- Rebuilt `services.html` around the seven service lines using existing page hero, jump pills, `service-detail`, card, CTA, and footer structures.
- Updated consultation and contact form options to the broader service architecture.
- Reframed About around InsightSerenity, Founder & Technical Lead, and verified education/capability language instead of unsupported counts.
- Converted Work case-study data into capability briefs with no client names, testimonials, dollar outcomes, percentages, or unverifiable delivery claims.
- Relabeled Work personal builds as internal R&D / lab projects.
- Broadened Blog page-level positioning while preserving AI-specific technical articles.
- Updated repeated footer copy and service links across top-level HTML pages.

Verification completed:

- JSON parse passed for `assets/data/case-studies.json` and `assets/data/blog-posts.json`.
- Local static server returned HTTP 200 for `/index.html`, `/services.html`, `/about.html`, `/consultation.html`, `/contact.html`, `/work.html`, `/case-study.html?slug=analytics-modernization-brief`, `/blog.html`, `/blog-post.html?slug=rag-systems-production-2026`, `/books.html`, `/library.html`, `/scripture/`, `/privacy.html`, and `/terms.html`.
- Basic tag sanity check found no mismatched `<select>` or `<form>` counts on the primary HTML files.
- Focused `rg` scan found no remaining public references to the old autonomous-AI-only positioning phrases such as "Autonomous AI Systems Consultancy", "Book AI Consultation", "AI Services", or the removed unverified testimonial names.

Limitations:

- No package.json, lint script, type-check script, test script, or production build pipeline exists in this static site repo.
- Playwright is not installed, so automated screenshot/console inspection was not run.
- Book/library ratings and reviews remain available but still require owner verification if represented as real customer reviews.

## Implementation Sequence

1. Add audit and implementation docs.
2. Update homepage positioning and remove unsupported proof.
3. Update services architecture using existing layouts.
4. Update consultation/contact forms and CTA language.
5. Update About page proof/positioning.
6. Update Work/case-study credibility presentation and JSON content.
7. Update Blog page-level positioning.
8. Validate JSON and manually inspect routes.
