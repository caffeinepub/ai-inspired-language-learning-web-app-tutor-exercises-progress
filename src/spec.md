# Specification

## Summary
**Goal:** Build a single-page language-learning web app with Internet Identity sign-in, vocabulary management, practice exercises with deterministic “Tutor” feedback, and a progress dashboard, using a cohesive non-blue/purple theme.

**Planned changes:**
- Create SPA navigation and screens: Home/Dashboard, Practice, Vocabulary, Settings with responsive layouts and clear empty states.
- Add Internet Identity authentication with signed-in/signed-out UI states, user identifier display, and sign-out that clears cached UI data.
- Implement a single Motoko backend actor with per-user persisted models for language settings, vocabulary (with stats), and practice history; expose methods to get/update settings and CRUD vocabulary.
- Build Vocabulary feature: add/edit/delete entries (word/phrase, translation, optional notes, tags) plus searchable list and tag filtering.
- Build Practice flow: session-based, one question at a time, at least two exercise types (translation and fill-in-the-blank), immediate feedback, and backend updates to per-item stats.
- Add AI-inspired Tutor panel with deterministic heuristics (normalization, typo tolerance, difference hinting) and no external AI/LLM calls.
- Add Dashboard metrics derived from persisted data: today’s answered count, accuracy %, and items due for review; include empty state guidance.
- Apply a coherent visual theme across the app using Tailwind utilities and shadcn components by composition (no edits to immutable UI source files), avoiding blue/purple as primary.
- Add and render generated static assets (logo + hero illustration) from `frontend/public/assets/generated` on the landing/dashboard/sign-in experience.

**User-visible outcome:** Users can sign in with Internet Identity, set learning languages, manage vocabulary, practice with two exercise types and Tutor feedback, and view basic progress metrics; the app is responsive, themed, and includes a logo and hero illustration.
