# Tech Writing Reference

Guidelines for writing compelling technical content for developer audiences.

## Audience Understanding

WebDeploy readers are typically:
- Software developers and engineers
- IT professionals and system administrators
- CTOs and technical decision-makers
- Open source enthusiasts

They value:
- Technical accuracy over marketing fluff
- Practical information they can use
- Honest assessments of trade-offs
- Respect for their time and intelligence

## Content Principles

### Be Accurate
- Verify technical claims before publishing
- Use correct terminology
- Include version numbers when relevant
- Link to official documentation

### Be Specific
**Vague**: "Our solution is fast"
**Specific**: "Deployment time reduced from 15 minutes to under 2 minutes"

### Be Honest
- Acknowledge limitations
- Discuss trade-offs openly
- Avoid superlatives without evidence
- Don't oversell

### Be Useful
- Provide actionable information
- Include examples and code snippets
- Link to relevant resources
- Answer the "so what?" question

## Article Types

### Product Announcements
Structure:
1. Lead with the news (what's new)
2. Explain the benefit (why it matters)
3. Detail the features (how it works)
4. Provide next steps (what to do)

Tone: Enthusiastic but not hyperbolic

### Technical Deep-Dives
Structure:
1. Problem statement (what challenge we're addressing)
2. Context (why this matters now)
3. Solution explanation (how we approached it)
4. Implementation details (technical specifics)
5. Results/learnings (what we discovered)

Tone: Educational, thorough, peer-to-peer

### Industry Commentary
Structure:
1. The news/trend (what's happening)
2. Analysis (what it means)
3. WebDeploy perspective (our take)
4. Implications (what to expect)

Tone: Informed, opinionated but fair

### Tutorials/How-Tos
Structure:
1. Goal statement (what you'll accomplish)
2. Prerequisites (what you need)
3. Step-by-step instructions
4. Verification/testing
5. Troubleshooting common issues

Tone: Clear, patient, supportive

## Writing Techniques

### Headlines
- Be specific: "How We Reduced Docker Build Times by 80%"
- Include keywords: "Linux Migration Guide for Enterprise Teams"
- Create curiosity: "Why We Chose NixOS Over Traditional Package Managers"

### Opening Paragraphs
Hook readers immediately:
- Start with the most important point
- Address a pain point they recognize
- Ask a question they're wondering about
- State a surprising fact or finding

### Technical Explanations
Layer complexity:
1. High-level overview first
2. Then dive into details
3. Use analogies for complex concepts
4. Include diagrams/visuals when helpful

### Code Examples
```bash
# Good: Explains what the command does
# Deploy the application to staging environment
kubectl apply -f deployment.yaml -n staging
```

```bash
# Bad: No context
kubectl apply -f deployment.yaml -n staging
```

### Transitions
Guide readers through the content:
- "Now that we've covered X, let's look at Y"
- "This brings us to an important question..."
- "With that foundation, we can explore..."

## SEO Considerations

### Keywords
- Include relevant technical terms naturally
- Use terms your audience searches for
- Include variations (e.g., "Kubernetes", "K8s")

### Meta Descriptions
- 150-160 characters
- Include primary keyword
- Describe the value to the reader
- Include a subtle call-to-action

### Headers
- Use H2 for main sections
- Use H3 for subsections
- Include keywords in headers naturally

### Internal Links
- Link to relevant WebDeploy pages
- Link to related news posts
- Use descriptive anchor text

## Formatting Best Practices

### Paragraphs
- Keep paragraphs short (3-4 sentences max)
- One idea per paragraph
- Use white space generously

### Lists
Use bullet points for:
- Features and benefits
- Steps that can be done in any order
- Related but independent items

Use numbered lists for:
- Sequential steps
- Ranked items
- Procedures that must follow order

### Emphasis
- **Bold** for key terms and important points
- *Italics* for technical terms on first use
- `Code formatting` for commands, file names, code

### Tables
Use tables for:
- Comparisons
- Feature matrices
- Data summaries

## Common Mistakes

### Jargon Overload
**Bad**: "Leverage our cloud-native, microservices-based, container-orchestrated solution"
**Good**: "Run your applications reliably with Kubernetes"

### Passive Voice Abuse
**Bad**: "The feature was implemented by the team"
**Good**: "Our team implemented the feature"

### Buried Lede
**Bad**: Long intro before getting to the news
**Good**: "Today we're launching X. Here's why it matters..."

### Feature Dumping
**Bad**: Long list of features without context
**Good**: Each feature tied to a user benefit

### Assumptions
**Bad**: Assuming readers know your internal terminology
**Good**: Briefly explain or link to definitions

## Review Checklist

Before publishing:
- [ ] Headline is compelling and accurate
- [ ] Opening paragraph hooks the reader
- [ ] Technical accuracy verified
- [ ] Jargon explained or avoided
- [ ] Code examples tested and correct
- [ ] Links working and relevant
- [ ] SEO meta tags complete
- [ ] Formatting consistent
- [ ] Proofread for errors
- [ ] Mobile-friendly (not too wide tables/code)
