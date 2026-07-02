# CAPSTONE — The Founder Simulation
## Frontend Build Sprint — TypeScript + React

You are not doing an exercise. You are being hired.

Read this whole brief once before you touch any code. The way you respond to
this brief is most of what is being marked. Building the screens is the easy
part. Deciding **what to build, what to refuse, and why** is the assessment.

---

## The situation

A founder, **Thabo**, has an idea and some money. He has hired you as the sole
frontend engineer to build the first version of his product. He is not
technical. He is enthusiastic, a little disorganised, and he changes his mind.
He has given you the rambling brief below, exactly as founders really do.

You have this brief, a starter repo, and a deadline. You will not get to ask him
clarifying questions in real time (he is "travelling"). You must make the calls
yourself and be ready to defend them.

---

## Thabo's brief (in his own words)

> Hey! So excited you're on board. Ok so the product is called **PddleThabo   ... actually let's just call it the product for now, naming later.**
>
> It's like a marketplace but also kind of a social thing. So people in a
> neighbourhood can lend and borrow tools and equipment from each other. Like if
> I need a drill for one afternoon I shouldn't have to buy a whole drill right??
> So you find a drill near you, you book it, you go get it. Community vibes.
>
> Things I DEFINITELY want:
> - A home screen that shows items near me. Make it feel ALIVE, like there's lots
>   happening. Even if we don't have many users yet, make it look busy so people
>   trust it.
> - You should be able to search and filter (by distance, by category, by whether
>   it's free or paid).
> - Each item has a detail page with photos, the owner, and a big BOOK NOW button.
> - A booking flow. Pick your dates, confirm, done.
> - Some kind of login. Actually make people sign up BEFORE they can see anything,
>   that way we capture emails. Force it. Growth hack lol.
> - I saw an app that had a countdown timer like "3 people are looking at this
>   item right now!!" — I LOVE that, put that on every item, it creates urgency.
> - A messaging thing so borrower and owner can chat. Maybe. If you have time.
> - It has to look INSANE. Like premium. Better than Airbnb. This is the thing
>   people will judge us on.
> - Oh and it should work offline. And be real-time. And I want ratings and
>   reviews. And a map. And a wishlist. And referral codes. And dark mode.
>
> Budget-wise you've got the sprint. I trust you. Make me proud. Ship something
> that makes investors go WOW.
>
> — Thabo

---

## What we are actually assessing

Thabo asked for about three months of work, some of it a bad idea, in one
sprint. **A senior engineer's first job is to protect the founder from himself.**

You will be marked on FOUR things, weighted:

| Area | Weight | What it means |
|------|--------|---------------|
| **Product judgment** | 30% | What you chose to build, what you cut, and how well you justified it. Scoping. Saying no to bad ideas. |
| **Frontend craft** | 30% | The actual build: TypeScript quality, React architecture, state, correctness, accessibility, responsiveness. |
| **Design & creativity** | 25% | A distinctive, intentional visual identity. Not a template. Real taste. |
| **Communication & thinking** | 15% | Your Decision Log, your written Founder Response, and your Loom. Can you explain WHY. |

Notice: **writing code is 30%.** More than half the marks are for thinking.

---

## Your deliverables (all required)

### 1. The build
A working Vite + React + TypeScript app. Strict mode stays on. No `any`.
It must run with `npm install && npm run dev` from a clean clone.

**Minimum bar (must all work):**
- A home/browse screen listing items, with **working** search + at least two
  **working** filters.
- An item detail screen.
- A booking flow of at least two steps that ends in a clear confirmation.
- An auth screen (see the "traps" section before you build this — read it).
- Fully responsive (usable on a phone) and keyboard-navigable.

You do **not** need a backend. Mock the data. But your data layer must be typed
and structured as if a real API were coming (this is deliberately testing
whether you can design types for data you don't control yet).

**It must be deployed and live.** A founder cannot show investors a project that
only runs on your laptop. Deploy the app to a public URL (Vercel, Netlify,
GitHub Pages, Cloudflare Pages — your choice, all have free tiers) and put the
live link in your README. The deployed build must be the same thing as your
repo, and it must actually work — if the live site is broken or blank, that is
the version we judge, not your local one. Test the live URL in a fresh browser
before you submit.

### 2. FOUNDER-RESPONSE.md
A short, professional reply to Thabo. This is where you **push back**. For each
thing you cut, deferred, or refused, say so and say why, in language a
non-technical founder understands. For each thing you kept, say why it earned
its place in the sprint. Be honest, be kind, be firm. This document is worth a
lot.

### 3. DECISION-LOG.md
The heart of the assessment, and how we know how you think. Every meaningful
decision gets an entry:
```
## Decision: [what you decided]
- Context: [the situation / constraint]
- Options I considered: [at least two real alternatives]
- What I chose and why: [the reasoning]
- What I gave up: [the tradeoff — every choice has one]
```
Minimum 8 entries. They must be real. "I chose Tailwind because it's fast" is
not a decision log entry. "I chose X over Y because the founder will pivot the
data model and X isolates that change to one file" is.

### 4. AI-USAGE.md  (read this carefully)
**You are allowed to use AI. You are expected to use AI. But you must use it like
a senior engineer, not a copy-paste machine — and you must prove you did.**

For at least **three** substantial moments where you used AI, log:
- The actual prompt you wrote.
- What the AI gave back (summary or snippet).
- **What was wrong, weak, or risky about its answer** — and what you changed.

At least one entry must be a time the AI was **confidently wrong** and you caught
it. If you cannot find a single thing your AI got wrong across the whole project,
you were not reading its output critically enough, and that itself is the finding
— say so and explain how you verified.

We are not testing whether you can avoid AI. We are testing whether you can
**out-think** it. A candidate who ran everything through AI and shipped whatever
it said will score badly here even if the app works, because the whole point of
hiring an engineer over a prompt is judgment.

### 5. The Loom (see PRESENTATION-GUIDE.md)
A recorded walkthrough. Details and what to focus on are in the separate guide.

---

## The traps (this section is part of the test — do not ignore it)

Thabo, like all founders, asked for some things that are bad ideas. Some are
unethical, some are impossible in the time, some are just wrong. **Part of your
score is whether you spot them and how you handle them.** We will not tell you
which is which. But here is your instruction:

> Do not blindly implement everything in the brief. Do not blindly prompt an AI
> to implement everything in the brief. Where a request is a bad idea, you may
> refuse it, reshape it into something honest that serves the same goal, or
> defer it — but you must name it in FOUNDER-RESPONSE.md and explain your call.

Building a requested-but-harmful feature cleanly and correctly will score
**lower** than refusing it with a good reason. Correct code in service of a bad
decision is a bad decision.

A senior engineer who quietly builds a manipulative dark pattern because "the
client asked for it" is not who we are trying to hire.

---

## Hard rules

- TypeScript strict. No `any`, no `as any`, no `@ts-ignore` to dodge a real type.
- Runs from a clean clone with `npm install && npm run dev`. Test it yourself in
  a fresh folder before submitting. If it doesn't run, it isn't done.
- **Deployed to a live public URL, with the link in your README.** Test the live
  site in a fresh browser before submitting. If the deployed version is broken,
  that is what we mark.
- Do not change the TypeScript strictness settings in tsconfig.
- Commit as you go. One giant commit at the end reads as "built the night before"
  and we will notice. Your commit history is part of the story you're telling.
- Public GitHub repo.

## What "excellent" looks like (so you can aim)

- Scoped ruthlessly. Shipped 3–4 things that are genuinely done and good, not 10
  things that are half-built.
- Refused or reshaped at least one of Thabo's bad ideas, and explained it so well
  he'd thank you.
- A visual identity with a real point of view — someone could recognise it.
- A Decision Log that reads like a thoughtful engineer talking, not a checklist.
- An AI-Usage log that proves you argued with the machine and won.
- Every claim in the Loom backed by something real on screen.

## What fails

- Implemented the whole brief literally, including the dark patterns, "because
  the client asked."
- Beautiful screens that don't work, or work but aren't typed.
- A Decision Log full of generic justifications that could apply to any project.
- An AI-Usage log that says "I asked AI to build X and it worked great" with no
  critique.
- Doesn't run from a clean clone, or has no working live deployment.

---

Build like Thabo's money and reputation are real. Because on the job, they will be.
Good luck.

— Melsoft Academy
