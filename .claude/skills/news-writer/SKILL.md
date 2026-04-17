---
name: news-writer
description: Write bilingual (English/Italian) tech news posts for WebDeploy. Generates well-structured articles about computer science, software development, open source, and technology with proper i18n integration.
---

This skill guides creation of high-quality bilingual news posts for the WebDeploy website. Posts focus on computer science, software development, open source technologies, and tech industry news.

## Project Context

WebDeploy is an open source infrastructure company with these core values:
- **Open Source Advocacy**: FOSS technologies, Linux, developer freedom
- **Developer Experience**: Tools and workflows that empower developers
- **Privacy-First**: No tracking, user data ownership
- **Hacker Ethics**: Transparency, knowledge sharing, innovation

The website uses:
- **Framework**: SvelteKit with TypeScript
- **i18n**: Translations in `src/lib/i18n/en.ts` and `src/lib/i18n/it.ts`
- **Design**: Retro-cyberpunk aesthetic

## Writing Guidelines

### Tone & Voice

**English**:
- Professional yet approachable
- Technical accuracy without unnecessary jargon
- Developer-to-developer communication style
- Clear, concise, and actionable

**Italian**:
- Natural, fluid Italian (not machine-translated)
- Maintain technical terms where appropriate (e.g., "open source", "deployment")
- Use formal "noi" (we) for company voice
- Proper Italian grammar and idioms

### Content Focus Areas

Prioritize topics aligned with WebDeploy's mission:
- **Open Source**: Linux, FOSS projects, community contributions
- **Infrastructure**: Kubernetes, Docker, IaC, DevOps practices
- **Developer Tools**: IDEs, CLI tools, productivity enhancements
- **Privacy & Security**: Data protection, encryption, ethical tech
- **Web Technologies**: Modern frameworks, web standards, performance
- **Industry News**: Tech trends relevant to developers and businesses

### Article Structure

Each news post should include:

1. **Title**: Compelling, specific, SEO-friendly (both languages)
2. **Date**: Format as DD/MM/YYYY
3. **Description**: 1-2 sentence summary for cards/previews
4. **Introduction**: Hook the reader, establish relevance
5. **Main Content**:
   - Use clear section headings
   - Include bullet points for features/benefits
   - Add technical details where appropriate
6. **Closing**: Call-to-action or forward-looking statement

## Implementation Steps

### Step 1: Gather Information

Before writing, understand:
- What is the topic/announcement?
- Who is the target audience?
- What action should readers take?
- Are there technical details to include?

### Step 2: Write English Content First

Create the English version with:
- Clear, engaging headline
- Scannable structure with headings
- Technical accuracy
- WebDeploy brand voice

### Step 3: Write Italian Translation

Translate to Italian ensuring:
- Natural language flow (not literal translation)
- Correct grammar and punctuation
- Appropriate technical terminology
- Cultural adaptation where needed

### Step 4: Update i18n Files

Add translations to both language files following this structure:

```typescript
// In en.ts and it.ts under the news object
postSlug: {
  title: 'Post Title',
  date: 'DD/MM/YYYY',
  description: 'Brief description for preview cards.',
  intro: 'Opening paragraph...',
  sectionTitle: 'Section Heading',
  features: [
    'Feature or point 1',
    'Feature or point 2',
  ],
  // Additional sections as needed
}
```

### Step 5: Create Post Page

Create new route at `src/routes/news/[post-slug]/+page.svelte`:

```svelte
<script lang="ts">
  import { t, tObj } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
  title={t('news.postSlug.title')}
  description={t('news.postSlug.description')}
  image="/post-image.jpg"
  type="article"
  publishedTime="YYYY-MM-DD"
/>

<!-- Follow existing post template structure -->
```

### Step 6: Add to News Index

Update `src/routes/news/+page.svelte` to include the new NewsCard.

## Quality Checklist

Before finalizing:

- [ ] English content is technically accurate and well-written
- [ ] Italian content reads naturally (not machine-translated)
- [ ] Both versions convey the same information
- [ ] SEO metadata is complete (title, description, image)
- [ ] Links and CTAs are working
- [ ] Date format is correct (DD/MM/YYYY)
- [ ] Content aligns with WebDeploy brand values
- [ ] No spelling or grammar errors in either language

## Writing Tips

### For Technical Content
- Explain concepts before diving into details
- Use code examples when helpful
- Link to external resources/documentation
- Acknowledge trade-offs honestly

### For Announcements
- Lead with the most important news
- Explain user benefits clearly
- Include concrete next steps
- Thank the community when appropriate

### For Opinion/Analysis
- Support claims with evidence
- Acknowledge different perspectives
- Connect to WebDeploy's mission
- Be authentic, not promotional

## Example Topics

Good topics for WebDeploy news:
- New product/feature launches
- Open source project contributions
- Technology deep-dives (Linux, infrastructure)
- Developer workflow improvements
- Industry commentary from developer perspective
- Partnership announcements
- Community events and meetups

## Common Italian Tech Terms

Maintain consistency with these translations:
- "deployment" → "deployment" or "distribuzione"
- "open source" → "open source" (keep English)
- "developer" → "sviluppatore"
- "infrastructure" → "infrastruttura"
- "code" → "codice"
- "release" → "release" or "rilascio"
- "feature" → "funzionalità"
- "bug" → "bug" (keep English)
- "workflow" → "workflow" or "flusso di lavoro"

---

Remember: Quality bilingual content builds trust with both international and Italian audiences. Take time to craft content that sounds natural in both languages while maintaining technical accuracy and the WebDeploy brand voice.
