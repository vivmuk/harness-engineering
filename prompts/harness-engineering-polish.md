# Harness Engineering landing-page brief (for Fable 5 one-shot regen)

This is the polish brief handed to Fable 5 (`claude-fable-5`) on Venice. The operator
has already locked the design read at the system level (Riso paper palette,
ink-on-paper inverse of the prior dark Riso project). This brief hands Fable 5
the verb-level tasks, the landing-page copy + interactive mockup, so we have
a self-consistent Fable-5 vision of the polished landing we can diff against
the operator-handwritten `app/page.tsx`.

## Fence this prompt when running through `veniceChat` / `run_benchmarks.py`-style callers

```
Generate a single self-contained HTML file for the polished landing page of
"Harness Engineering", a generator site that produces AI agent harnesses
(any domain) via the Venice API.

## Register & tone

- Brand register. The audience is design-fluent developers, AI product
  teams, and AI-curious journalists. The page must read like an artifact:
  not SaaS-marketing, not AI-tutorial. Closer to a printed design journal
  than a Notion export.
- Tone: confident, technical, plain-spoken. No em-dashes, no exclamation
  marks, no emoji, no exclamation-of-the-hero. Hero is a calm one-liner
  plus a defining italic accent word.
- Voice: short sentences, no headings stacked inside headings, no
  "section:Topic" duplication.

## Palette (locked)

- Body bg:      #F4F0E8   (warm bone paper)
- Paper-2:      #ECDFC8   (raised paper tint, used in section bands)
- Ink:          #1A1A1F   (text on paper)
- Ink-2:        #6E6E78   (muted text)
- Rule:         rgba(26,26,31,0.12)   (1px borders, dividers)
- Violet:       #6d5dfc   (CTA, brand action; the existing accent kept)
- Magenta:      #FF2E93   (the italic accent word, single accent only)
- Cobalt:       #0066FF
- Acid:         #F5FF40   (rare, only on darker scenes)

## Typography

- Sharp grotesque only. NO serif (no Fraunces, no Tiempos, no Recoleta).
- Display + body: Geist (or Geist Display fallback). Mono: Geist Mono.
- Single family across the page. Don't pair with extra fonts.

## Anti-slop rules (these are real, not stylistic)

- NO cream-on-cream monoculture lift (paper is the base, raised
  surfaces are paper-2 only).
- NO glassmorphism. NO backdrop-filter blur anywhere.
- NO tri-color gradient text. The italic accent word is solid magenta.
- NO glow halos. No decorative floating keyframes. No `animate-pulse-*`.
- NO rounded-full pill chips. Eyebrows at most one per section, and
  rendered as plain uppercase mono caps, not as pills.
- NO multiple emojis as section icons. Use single-character mono numerics
  ("01", "02", "03", "04") or `lucide-react` line icons.
- The card hover state is `bg-paper-2 hover:border-accent/40`, NOT
  shadows, NOT scale-on-hover.

## Page structure

1. **Hero section.** Eyebrow above headline ("Design agent harnesses for
   any domain"). Headline = "*Turn your ideas into [italic-accent on
   magenta]reusable AI systems[/italic-accent].*" Subhead = one tight
   paragraph (≤ 240 chars) explaining that a harness is a structured
   environment, not a prompt. Two CTAs: primary violet `Generate a
   Harness Recipe` and ghost `Learn what a harness is`. Hero is on
   `bg-paper-2` with a 1px `border-rule` and a 24px radius.

2. **Trust strip.** On `bg-paper-2`, mono caps label `Built on ideas
   from`, then a row of 4–6 sibling-products in `text-ink-2`. No logos, no images, just text.

3. **Three-column feature grid.** Three FeatureCards in a row.
   Topics: Universal · Cost-controlled · Self-improving. Each card
   has a small violet inline icon block (use `lucide-react` line icon
   or a 1-element SVG), an h3, and a 1-paragraph description. Card has
   `border-rule bg-paper` → on hover transitions to
   `border-accent/40 bg-paper-2`.

4. **Cultural harness theme band.** Three ThemeCards in a row showing
   Indian / Unified / Egyptian framings. Each card holds its own
   announcement: a label uppercase mono ("INDIAN", "UNIFIED", "EGYPTIAN"), an h3 in ink, a description, and an image at the
   top. Image fills 4:3 aspect with no overlay gradient, flat.

5. **Final CTA.** Loose violet `bg-paper-2 border-accent` block with
   an h2 ("Ready to engineer your harness?"), a one-paragraph
   subhead, and a single primary violet button.

## What NOT to include

- Sign-in / login chrome.
- Pricing tiers.
- Testimonials or social proof quotes.
- Footer footer: footer is a single row with project name + colophon
  + "Powered by Venice AI" link. Keep it tight, on `border-rule`
  dividers.

## Output

- Single self-contained HTML file.
- Inline all CSS in a single `<style>` block in `<head>`.
- Use Geist via Google Fonts link.
- Do NOT use any external CSS or JS files.
- Begin with `<!DOCTYPE html>`, end with `</html>`.
- No comments, no diagnostics, no toggle of any kind. Ship it.
```
