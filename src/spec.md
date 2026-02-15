# Specification

## Summary
**Goal:** Add a deterministic Conversation Practice mode for authenticated users to practice short, turn-based text conversations using their existing vocabulary, with per-turn tutor feedback and vocab stats updates.

**Planned changes:**
- Add a new protected route at `/conversation` (behind the existing AuthGate) with a chat-style, turn-based UI including start/reset and clear “Learner vs Partner” turn indication.
- Generate conversation prompts and acceptable expected replies deterministically from the user’s saved vocabulary (and optional notes) without calling external APIs.
- Reuse existing deterministic tutor heuristics to evaluate each learner reply, display correct/incorrect feedback with hints in the current TutorPanel style/tone, and submit pass/fail via the existing practice-result flow tied to the vocabulary item used for that turn.
- Add discovery entry points: a “Conversation” link in top navigation (desktop/mobile with active state) and a new dashboard quick action linking to `/conversation`.
- Show an actionable empty state on `/conversation` when vocabulary is empty, linking users to `/vocabulary`.

**User-visible outcome:** Signed-in users can open “Conversation” to practice short, turn-based text chats generated from their vocabulary, receive immediate tutor feedback each turn, and have their vocabulary stats update automatically; users without vocabulary are directed to add words first.
