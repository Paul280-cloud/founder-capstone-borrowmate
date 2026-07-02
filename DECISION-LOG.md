# Decision Log

## Decision: Build one core borrowing loop instead of the full marketplace
- Context: The brief included browse, booking, login, messaging, maps, reviews, referral codes, dark mode, offline mode, and real-time features.
- Options I considered: Build a shallow version of everything, or build a smaller product with the core user journey completed well.
- What I chose and why: I built browse, item detail, and booking. This proves the central product value without pretending a one-sprint build can support every feature.
- What I gave up: I deferred secondary features such as messaging, wishlists, maps, and referral codes.

## Decision: Allow browsing before authentication
- Context: Thabo requested forced sign-up before users can see anything.
- Options I considered: Implement a hard login wall, or let users browse first and ask for sign-in when they take action.
- What I chose and why: I allowed browsing first. A new user should see value before being asked for personal information.
- What I gave up: The product captures fewer emails at the very top of the funnel.

## Decision: Refuse fake urgency counters
- Context: Thabo asked for messages like "3 people are looking at this item right now".
- Options I considered: Add fake urgency text, show real popularity only if data exists, or remove urgency entirely.
- What I chose and why: I removed fake urgency. False activity is a dark pattern and harms trust in a community marketplace.
- What I gave up: The UI has less pressure-based conversion.

## Decision: Hide removed listings but show paused listings
- Context: The mock data includes available, paused, and removed items.
- Options I considered: Show every item, hide unavailable items, or distinguish paused from removed.
- What I chose and why: Removed listings are hidden from browse, while paused listings can still be viewed but cannot be booked. This respects the data state.
- What I gave up: The item count is smaller, but it is more honest.

## Decision: Use typed mock data directly instead of building a fake API layer
- Context: The project has no backend, but the data is typed as if an API will arrive later.
- Options I considered: Build fake async fetching everywhere, or import typed mock data and keep transformation logic close to the UI.
- What I chose and why: I used the typed data directly for this sprint. It keeps the MVP simple while preserving type safety.
- What I gave up: The app does not simulate loading states deeply.

## Decision: Use a simple screen state instead of React Router
- Context: The minimum project needs browse, detail, booking, and auth views.
- Options I considered: Install and configure React Router, or use a typed screen union in local state.
- What I chose and why: I used a typed screen union because it is enough for a one-sprint prototype and avoids adding routing complexity.
- What I gave up: URLs do not represent individual item pages yet.

## Decision: Keep booking to two steps
- Context: The brief asks for a booking flow.
- Options I considered: Build a full checkout style flow, or a shorter booking request flow.
- What I chose and why: I built date selection and confirmation. It proves the user journey without adding payment, availability rules, or messaging.
- What I gave up: The booking flow does not handle payment, owner calendars, or cancellation.

## Decision: Use strong fallback states for incomplete listing data
- Context: Some items have no photos, no price, no rating, or no known distance.
- Options I considered: Assume all data exists, or design for missing data.
- What I chose and why: I added fallback labels like "No photo yet", "Free", "New lender", and "Distance hidden". This prevents awkward blank spaces and runtime assumptions.
- What I gave up: The UI has more conditional rendering code.

## Decision: Prioritize responsive layout early
- Context: The product is neighbourhood based, so users are likely to browse on phones.
- Options I considered: Build desktop first and fix mobile later, or design responsive grids from the beginning.
- What I chose and why: I used responsive grid rules early so the product remains usable on smaller screens.
- What I gave up: Some desktop flourishes were kept simpler to maintain mobile quality.
