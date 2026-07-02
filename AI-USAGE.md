# AI Usage Log

## Entry 1: Scoping the founder brief
- Prompt I wrote: "Review this founder brief and identify what should be built in one sprint, what should be deferred, and what requests are risky or unethical."
- What the AI gave back: It suggested building browse, item detail, booking, auth, messaging, reviews, map, and wishlist.
- What was weak or risky: The first response accepted too much of the founder's wishlist. It did not push back strongly enough on fake urgency or forced sign-up.
- What I changed: I cut fake urgency, messaging, reviews, maps, and wishlists from the MVP. I also changed forced authentication into optional browsing with sign-in later in the journey.

## Entry 2: Designing the TypeScript state model
- Prompt I wrote: "Help me model screens in React TypeScript without using any. I need browse, detail, booking, and auth screens."
- What the AI gave back: It suggested a string state like `currentScreen: string` and a separate selected item state.
- What was weak or risky: A plain string can drift into invalid states and makes it easier to forget which screens require an item id.
- What I changed: I used a discriminated union for screen state: browse, detail with itemId, book with itemId and step, and auth. This makes invalid navigation states harder to represent.

## Entry 3: Filtering and pricing logic
- Prompt I wrote: "Write helper functions for price, distance, rating, and filtering typed item data in TypeScript."
- What the AI gave back: It produced working helper functions but assumed every item had a price, rating, image, and distance.
- What was weak or risky: The project data deliberately contains null values and empty arrays. Assuming data exists would break the UI or show misleading content.
- What I changed: I added explicit handling for free items, missing distance, new lenders with no ratings, paused listings, removed listings, and missing photos.

## Entry 4: UI polish
- Prompt I wrote: "Suggest a visual identity for a neighbourhood tool sharing marketplace that feels premium but not like a generic SaaS template."
- What the AI gave back: It suggested a blue dashboard layout with standard cards.
- What was weak or risky: It felt generic and did not match the community, local, practical nature of the product.
- What I changed: I chose warmer colours, rounded cards, earthy green accents, and clear trust-focused labels to make it feel more like a neighbourhood product.
