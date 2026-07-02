import { useMemo, useState } from "react";
import { ITEMS } from "./data/items.ts";
import type { BookingDraft, Category, Item } from "./data/types.ts";

type Screen =
  | { name: "browse" }
  | { name: "detail"; itemId: string }
  | { name: "book"; itemId: string; step: 1 | 2 | 3 }
  | { name: "auth" };

type PriceFilter = "all" | "free" | "paid";
type DistanceFilter = "all" | "near" | "medium";

const categoryLabels: Record<Category, string> = {
  "power-tools": "Power tools",
  "hand-tools": "Hand tools",
  garden: "Garden",
  kitchen: "Kitchen",
  outdoor: "Outdoor",
  party: "Party",
  other: "Other",
};

const visibleItems = ITEMS.filter((item) => item.status !== "removed");

function formatPrice(item: Item): string {
  if (!item.price || item.price.amountCents === 0) return "Free";
  return `R${item.price.amountCents / 100}/${item.price.period}`;
}

function formatDistance(distanceKm: number | null): string {
  return distanceKm === null ? "Distance hidden" : `📍 ${distanceKm.toFixed(1)} km away`;
}

function formatRating(item: Item): string {
  if (item.owner.rating === null) return "⭐ New lender";
  return `⭐ ${item.owner.rating.toFixed(1)} · ${item.owner.ratingCount} reviews`;
}
  function getToolEmoji(category: Category): string {
  const icons: Record<Category, string> = {
    "power-tools": "🛠️",
    "hand-tools": "🔧",
    garden: "🌿",
    kitchen: "🍳",
    outdoor: "🪜",
    party: "🎉",
    other: "📦",
  };

  return icons[category];
}


function matchesDistance(item: Item, distance: DistanceFilter): boolean {
  if (distance === "all") return true;
  if (item.distanceKm === null) return false;
  if (distance === "near") return item.distanceKm <= 3;
  return item.distanceKm <= 8;
}

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "browse" });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [distance, setDistance] = useState<DistanceFilter>("all");
  const [booking, setBooking] = useState<BookingDraft>({
    itemId: "",
    range: { startISO: "", endISO: "" },
    agreedToTerms: false,
  });

  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return visibleItems.filter((item) => {
      const matchesText =
        item.title.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        categoryLabels[item.category].toLowerCase().includes(cleanQuery);

      const matchesCategory = category === "all" || item.category === category;

      const matchesPrice =
        price === "all" ||
        (price === "free" && (!item.price || item.price.amountCents === 0)) ||
        (price === "paid" && item.price !== null && item.price.amountCents > 0);

      return matchesText && matchesCategory && matchesPrice && matchesDistance(item, distance);
    });
  }, [category, distance, price, query]);

  const selectedItem =
    screen.name === "detail" || screen.name === "book"
      ? visibleItems.find((item) => item.id === screen.itemId)
      : undefined;

  function startBooking(item: Item): void {
    setBooking({
      itemId: item.id,
      range: { startISO: "", endISO: "" },
      agreedToTerms: false,
    });
    setScreen({ name: "book", itemId: item.id, step: 1 });
  }

  return (
    <main className="app-shell">
      <style>{styles}</style>

      <nav className="topbar" aria-label="Primary navigation">
        <button className="brand" onClick={() => setScreen({ name: "browse" })}>
          BorrowMate
        </button>

        <div className="nav-actions">
          <button className="ghost-button" onClick={() => setScreen({ name: "browse" })}>
            Browse
          </button>
          <button className="ghost-button" onClick={() => setScreen({ name: "browse" })}>
            How it works
          </button>
          <button className="dark-button" onClick={() => setScreen({ name: "auth" })}>
            Sign in
          </button>
        </div>
      </nav>

      {screen.name === "browse" && (
        <>
          <BrowseScreen
            query={query}
            category={category}
            price={price}
            distance={distance}
            items={filteredItems}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
            onPriceChange={setPrice}
            onDistanceChange={setDistance}
            onOpenItem={(itemId) => setScreen({ name: "detail", itemId })}
          />
          <Footer />
        </>
      )}

      {screen.name === "detail" && selectedItem && (
        <DetailScreen
          item={selectedItem}
          onBack={() => setScreen({ name: "browse" })}
          onBook={() => startBooking(selectedItem)}
        />
      )}

      {screen.name === "book" && selectedItem && (
        <BookingScreen
          item={selectedItem}
          step={screen.step}
          booking={booking}
          onBack={() => setScreen({ name: "detail", itemId: selectedItem.id })}
          onBookingChange={setBooking}
          onStepChange={(step) => setScreen({ name: "book", itemId: selectedItem.id, step })}
        />
      )}

      {screen.name === "auth" && <AuthScreen onBack={() => setScreen({ name: "browse" })} />}
    </main>
  );
}

interface BrowseScreenProps {
  query: string;
  category: Category | "all";
  price: PriceFilter;
  distance: DistanceFilter;
  items: Item[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: Category | "all") => void;
  onPriceChange: (value: PriceFilter) => void;
  onDistanceChange: (value: DistanceFilter) => void;
  onOpenItem: (itemId: string) => void;
}

function BrowseScreen({
  query,
  category,
  price,
  distance,
  items,
  onQueryChange,
  onCategoryChange,
  onPriceChange,
  onDistanceChange,
  onOpenItem,
}: BrowseScreenProps) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Neighbourhood equipment sharing</p>
          <h1>Borrow smarter. Own less. Save more.</h1>
          <p className="hero-copy">
            BorrowMate helps neighbours rent tools, equipment and everyday items safely from trusted people nearby.
          </p>

          <div className="hero-buttons">
            <a href="#browse" className="primary-link">
              Browse equipment
            </a>
            <button className="light-button">Learn how it works</button>
          </div>

          <div className="hero-stats" aria-label="Product highlights">
            <span>3,000+ items ready</span>
            <span>500+ active members</span>
            <span>15 local categories</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <strong>🔒 Trusted community</strong>
          <p>Lender profiles help borrowers make safer decisions.</p>
        </div>
        <div>
          <strong>⚡ Fast booking</strong>
          <p>Request equipment in less than a minute.</p>
        </div>
        <div>
          <strong>🌱 Less waste</strong>
          <p>Borrow instead of buying items you rarely use.</p>
        </div>
      </section>

      <section id="browse" className="filters-panel" aria-label="Search and filters">
        <label>
          Search
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search drill, ladder, kitchen..."
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => onCategoryChange(event.target.value as Category | "all")}>
            <option value="all">All categories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price
          <select value={price} onChange={(event) => onPriceChange(event.target.value as PriceFilter)}>
            <option value="all">Free and paid</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>
        </label>

        <label>
          Distance
          <select value={distance} onChange={(event) => onDistanceChange(event.target.value as DistanceFilter)}>
            <option value="all">Any distance</option>
            <option value="near">Within 3 km</option>
            <option value="medium">Within 8 km</option>
          </select>
        </label>
      </section>

      <section className="popular-section">
        <p className="eyebrow">Popular categories</p>
        <div className="category-grid">
          <div>🛠️ Power tools</div>
          <div>🌿 Garden</div>
          <div>🍳 Kitchen</div>
          <div>🎉 Party</div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Browse</p>
          <h2>Available around your neighbourhood</h2>
        </div>
        <p>{items.length} result{items.length === 1 ? "" : "s"}</p>
      </section>

      <section className="card-grid" aria-label="Item listings">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onOpen={() => onOpenItem(item.id)} />
        ))}
      </section>
    </>
  );
}

function ItemCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <article className="item-card">
      <div className="image-card">
        <span className="tool-emoji">{getToolEmoji(item.category)}</span>
        {item.status === "paused" && <strong className="status-pill">Paused</strong>}
      </div>

      <div className="card-body">
        <div>
          <p className="category-pill">{categoryLabels[item.category]}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>

        <div className="meta-row">
          <span>💰 {formatPrice(item)}</span>
          <span>{formatDistance(item.distanceKm)}</span>
        </div>

        <button className="full-button" onClick={onOpen}>
          View details
        </button>
      </div>
    </article>
  );
}

function DetailScreen({ item, onBack, onBook }: { item: Item; onBack: () => void; onBook: () => void }) {
  const canBook = item.status === "available";

  return (
    <section className="detail-layout">
      <button className="link-button" onClick={onBack}>
        ← Back to browse
      </button>

      <div className="detail-grid">
        <div className="detail-image">
          <span className="tool-emoji large">getToolEmoji(item.category)</span> 
        </div>

        <div className="detail-card">
          <p className="category-pill">{categoryLabels[item.category]}</p>
          <h1>{item.title}</h1>
          <p>{item.description}</p>

          <div className="detail-facts">
            <span>💰 {formatPrice(item)}</span>
            <span>{formatDistance(item.distanceKm)}</span>
            <span>{formatRating(item)}</span>
          </div>

          <div className="owner-card">
            <strong>Owner: {item.owner.displayName}</strong>
            <span>Member since {new Date(item.owner.joinedISO).getFullYear()}</span>
          </div>

          {!canBook && <p className="warning">This listing is paused, so booking is disabled.</p>}

          <button className="primary-button" disabled={!canBook} onClick={onBook}>
            {canBook ? "Book now" : "Unavailable"}
          </button>
        </div>
      </div>
    </section>
  );
}

interface BookingScreenProps {
  item: Item;
  step: 1 | 2 | 3;
  booking: BookingDraft;
  onBack: () => void;
  onBookingChange: (booking: BookingDraft) => void;
  onStepChange: (step: 1 | 2 | 3) => void;
}

function BookingScreen({ item, step, booking, onBack, onBookingChange, onStepChange }: BookingScreenProps) {
  const canContinue = booking.range.startISO !== "" && booking.range.endISO !== "";
  const canConfirm = canContinue && booking.agreedToTerms;

  return (
    <section className="booking-shell">
      <button className="link-button" onClick={onBack}>
        ← Back to item
      </button>

      <div className="booking-card">
        <p className="eyebrow">Booking flow</p>
        <h1>{item.title}</h1>

        <div className="stepper" aria-label="Booking progress">
          <span className={step >= 1 ? "active-step" : ""}>Dates</span>
          <span className={step >= 2 ? "active-step" : ""}>Confirm</span>
          <span className={step >= 3 ? "active-step" : ""}>Done</span>
        </div>

        {step === 1 && (
          <div className="form-grid">
            <label>
              Start date
              <input
                type="date"
                value={booking.range.startISO}
                onChange={(event) =>
                  onBookingChange({ ...booking, itemId: item.id, range: { ...booking.range, startISO: event.target.value } })
                }
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={booking.range.endISO}
                onChange={(event) =>
                  onBookingChange({ ...booking, itemId: item.id, range: { ...booking.range, endISO: event.target.value } })
                }
              />
            </label>

            <button className="primary-button" disabled={!canContinue} onClick={() => onStepChange(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="confirm-box">
            <p>
              You are requesting <strong>{item.title}</strong> from <strong>{item.owner.displayName}</strong>.
            </p>
            <p>
              Dates: {booking.range.startISO} to {booking.range.endISO}. Price: {formatPrice(item)}.
            </p>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={booking.agreedToTerms}
                onChange={(event) => onBookingChange({ ...booking, agreedToTerms: event.target.checked })}
              />
              I understand this is a request and the owner must confirm pickup details.
            </label>

            <button className="primary-button" disabled={!canConfirm} onClick={() => onStepChange(3)}>
              Confirm booking request
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="success-box">
            <h2>🎉 Booking Request Sent!</h2>
            <p>Your request has been sent to the lender.</p>
            <p>You will receive a confirmation once they accept.</p>
            <p><strong>Estimated response:</strong> within 2 hours.</p>

            <button className="dark-button" onClick={onBack}>
              Return to item
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function AuthScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="auth-layout">
      <button className="link-button" onClick={onBack}>
        ← Back to browse
      </button>

      <div className="auth-card">
        <p className="eyebrow">Account</p>
        <h1>Sign in when you are ready to book</h1>
        <p>
          Browsing stays open so new users can understand the value first. Account creation is introduced at booking time,
          where trust and safety matter.
        </p>

        <label>
          Email address
          <input type="email" placeholder="you@example.com" />
        </label>

        <button className="primary-button">Continue</button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <strong>BorrowMate</strong>
      <p>Built with React, TypeScript and Vite.</p>
      <span>© 2026 BorrowMate. Founder sprint MVP.</span>
    </footer>
  );
}

const styles = `
  :root {
    color: #17201b;
    background: #f8f7f2;
  }

  * { box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f8f7f2;
  }

  button, input, select { font: inherit; }
  button { cursor: pointer; transition: .25s ease; }
  button:hover:not(:disabled) { transform: translateY(-2px); }
  button:disabled { cursor: not-allowed; opacity: 0.55; }

  .app-shell { min-height: 100vh; }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem clamp(1rem, 4vw, 4rem);
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(248, 247, 242, 0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid #e3d8c9;
  }

  .brand {
    border: 0;
    background: transparent;
    font-weight: 900;
    font-size: 1.35rem;
    color: #153a2d;
  }

  .nav-actions {
    display: flex;
    gap: .75rem;
  }

  .hero-section {
    padding: clamp(4rem, 8vw, 8rem) clamp(1rem, 4vw, 4rem);
    background:
      radial-gradient(circle at 15% 20%, rgba(214, 245, 184, .45), transparent 28rem),
      radial-gradient(circle at 80% 15%, rgba(255, 139, 61, .25), transparent 24rem),
      linear-gradient(135deg, #173d2f, #07120f);
    color: #fff;
  }

  .hero-content {
    max-width: 980px;
  }

  .hero-section h1 {
    max-width: 900px;
    font-size: clamp(2.7rem, 9vw, 6.8rem);
    line-height: .9;
    margin: .5rem 0 1rem;
    letter-spacing: -0.07em;
  }

  .hero-copy {
    max-width: 720px;
    color: #d8eadf;
    font-size: 1.15rem;
    line-height: 1.7;
  }

  .hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: .8rem;
    margin-top: 2rem;
  }

  .primary-link,
  .light-button {
    text-decoration: none;
    border: 0;
    border-radius: 999px;
    padding: .95rem 1.25rem;
    font-weight: 900;
  }

  .primary-link {
    background: #ff8b3d;
    color: #1c1208;
  }

  .light-button {
    background: rgba(255,255,255,.12);
    color: white;
    border: 1px solid rgba(255,255,255,.22);
  }

  .hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    margin-top: 2rem;
  }

  .hero-stats span {
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 999px;
    padding: .7rem 1rem;
    background: rgba(255,255,255,.08);
  }

  .eyebrow {
    color: #ff8b3d;
    text-transform: uppercase;
    font-size: .78rem;
    letter-spacing: .16em;
    font-weight: 900;
  }

  .trust-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: -2.5rem clamp(1rem, 4vw, 4rem) 2rem;
    position: relative;
  }

  .trust-strip div {
    background: #fffdf7;
    border: 1px solid #e7ddcc;
    border-radius: 24px;
    padding: 1.2rem;
    box-shadow: 0 20px 60px rgba(23, 32, 27, .12);
  }

  .trust-strip p {
    color: #5f6f65;
    line-height: 1.5;
    margin-bottom: 0;
  }

  .filters-panel {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 1rem;
    padding: 1rem;
    margin: 0 clamp(1rem, 4vw, 4rem) 2rem;
    background: #fffdf7;
    border: 1px solid #e7ddcc;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(23, 32, 27, .08);
  }

  label {
    display: grid;
    gap: .45rem;
    font-weight: 800;
    color: #30443a;
  }

  input, select {
    width: 100%;
    border: 1px solid #d9cfbf;
    border-radius: 14px;
    padding: .9rem 1rem;
    background: white;
    color: #17201b;
  }

  input:focus, select:focus, button:focus-visible, a:focus-visible {
    outline: 3px solid #ffb36f;
    outline-offset: 2px;
  }

  .popular-section {
    padding: 0 clamp(1rem, 4vw, 4rem) 2rem;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .9rem;
  }

  .category-grid div {
    background: #153a2d;
    color: white;
    border-radius: 22px;
    padding: 1.1rem;
    font-weight: 900;
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    padding: 0 clamp(1rem, 4vw, 4rem) 1rem;
  }

  .section-heading h2 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.5rem);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    padding: 0 clamp(1rem, 4vw, 4rem) 4rem;
  }

  .item-card {
    background: #fffdf7;
    border: 1px solid #e7ddcc;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 14px 40px rgba(23, 32, 27, .08);
    display: grid;
    transition: .3s ease;
  }

  .item-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 70px rgba(23, 32, 27, .16);
  }

  .image-card,
  .detail-image {
    min-height: 230px;
    background: #e7ddcc;
    display: grid;
    place-items: center;
    position: relative;
    color: #5f6f65;
    font-weight: 800;
    overflow: hidden;
  }

  .image-card img,
  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: .35s ease;
  }

  .item-card:hover img {
    transform: scale(1.08);
  }

  .status-pill {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #fff;
    color: #8f3d00;
    border-radius: 999px;
    padding: .45rem .75rem;
  }

  .card-body {
    padding: 1.1rem;
    display: grid;
    gap: 1rem;
  }

  .card-body h3 {
    margin: .3rem 0;
    font-size: 1.25rem;
  }

  .card-body p {
    color: #5f6f65;
    line-height: 1.5;
  }

  .category-pill {
    display: inline-flex;
    width: fit-content;
    border-radius: 999px;
    background: #eaf8dd;
    color: #245a3c;
    padding: .4rem .7rem;
    font-size: .78rem;
    font-weight: 900;
  }

  .meta-row,
  .detail-facts {
    display: flex;
    flex-wrap: wrap;
    gap: .6rem;
  }

  .meta-row span,
  .detail-facts span {
    background: #f1eadf;
    border-radius: 999px;
    padding: .45rem .7rem;
    font-weight: 800;
    color: #31463b;
  }

  .full-button,
  .primary-button,
  .dark-button,
  .ghost-button {
    border: 0;
    border-radius: 14px;
    padding: .9rem 1rem;
    font-weight: 900;
  }

  .full-button,
  .primary-button {
    background: #ff8b3d;
    color: #1c1208;
  }

  .dark-button {
    background: #153a2d;
    color: white;
  }

  .ghost-button {
    background: #efe7db;
    color: #153a2d;
  }

  .link-button {
    border: 0;
    background: transparent;
    color: #153a2d;
    font-weight: 900;
    padding: 1rem 0;
  }

  .detail-layout,
  .booking-shell,
  .auth-layout {
    padding: 2rem clamp(1rem, 4vw, 4rem) 4rem;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: 1.5rem;
    align-items: start;
  }

  .detail-image {
    border-radius: 30px;
    min-height: 500px;
  }

  .detail-card,
  .booking-card,
  .auth-card {
    background: #fffdf7;
    border: 1px solid #e7ddcc;
    border-radius: 30px;
    padding: clamp(1.25rem, 4vw, 2rem);
    box-shadow: 0 14px 50px rgba(23, 32, 27, .08);
  }

  .detail-card h1,
  .booking-card h1,
  .auth-card h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: .95;
    margin: .75rem 0 1rem;
    letter-spacing: -0.04em;
  }

  .detail-card p,
  .auth-card p,
  .booking-card p {
    color: #5f6f65;
    line-height: 1.65;
  }

  .owner-card,
  .confirm-box,
  .success-box {
    display: grid;
    gap: .75rem;
    background: #f1eadf;
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .owner-card span {
    color: #5f6f65;
  }

  .warning {
    background: #fff0d9;
    border: 1px solid #ffc87a;
    padding: 1rem;
    border-radius: 18px;
  }

  .booking-card {
    max-width: 720px;
    margin: 0 auto;
  }

  .stepper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .5rem;
    margin: 1rem 0 1.5rem;
  }

  .stepper span {
    text-align: center;
    padding: .7rem;
    border-radius: 999px;
    background: #efe7db;
    font-weight: 900;
  }

  .stepper .active-step {
    background: #153a2d;
    color: white;
  }

  .form-grid {
    display: grid;
    gap: 1rem;
  }

  .checkbox-row {
    display: flex;
    align-items: start;
    gap: .7rem;
    font-weight: 700;
  }

  .checkbox-row input {
    width: auto;
    margin-top: .25rem;
  }

  .auth-card {
    max-width: 560px;
    margin: 0 auto;
  }

  .footer {
    text-align: center;
    padding: 3rem 1rem;
    background: #153a2d;
    color: white;
  }

  .footer p {
    color: #d8eadf;
  }

  .footer span {
    color: #b8cbbf;
  }
    .tool-emoji {
  font-size: 5rem;
}

.tool-emoji.large {
  font-size: 9rem;
}
.tool-emoji {
  font-size: 5.5rem;
  filter: drop-shadow(0 12px 24px rgba(23, 32, 27, .18));
}

.tool-emoji.large {
  font-size: 10rem;
}

.full-button:hover,
.primary-button:hover {
  background: #f97316;
}

.ghost-button:hover {
  background: #e3d8c9;
}

.dark-button:hover {
  background: #0f2d22;
}

.success-box {
  border: 1px solid #d6f5b8;
  background: linear-gradient(135deg, #f1eadf, #eaf8dd);
}

.success-box h2 {
  margin: 0;
  font-size: 2rem;
}

.item-card {
  min-height: 100%;
}

.image-card {
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 139, 61, .18), transparent 14rem),
    linear-gradient(135deg, #eaf8dd, #f1eadf);
}

.detail-image {
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 139, 61, .22), transparent 18rem),
    linear-gradient(135deg, #eaf8dd, #f1eadf);
}

.card-body h3 {
  color: #153a2d;
}

.footer strong {
  font-size: 1.4rem;
}
  @media (max-width: 900px) {
    .filters-panel,
    .detail-grid,
    .trust-strip {
      grid-template-columns: 1fr;
    }

    .card-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .category-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .detail-image {
      min-height: 320px;
    }
  }

  @media (max-width: 620px) {
    .topbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .nav-actions {
      width: 100%;
    }

    .nav-actions button {
      flex: 1;
    }

    .card-grid,
    .category-grid {
      grid-template-columns: 1fr;
    }

    .section-heading {
      align-items: start;
      flex-direction: column;
    }

    .hero-section h1 {
      letter-spacing: -0.04em;
    }
  }
`;