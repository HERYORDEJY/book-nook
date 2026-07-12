# 📚 The Book Nook

A React Native (Expo) app for a small independent bookstore. Customers can browse and
search the store's inventory, view rich book details, manage a shopping cart, and check
out — all backed by an in-repo mock API with realistic latency and failure simulation.

Built for the Bumpa Mobile Engineer assessment, the app is structured to demonstrate the
five graded areas end-to-end: **component lifecycle, state management, animation, testing,
and performance optimization.**

---

## Showcase

<div align="center">
  <img src="./assets/showcase/Nook screen.png" width="250" alt="Home Screen" />
  <img src="./assets/showcase/Book details screen.png" width="250" alt="Book Details" />
  <img src="./assets/showcase/Cart screen.png" width="250" alt="Cart Screen" />
</div>

<div align="center">
  <img src="./assets/showcase/Checkout screen.png" width="250" alt="Checkout Screen" />
  <img src="./assets/showcase/Checkout (filled) screen.png" width="250" alt="Checkout Filled" />
  <img src="./assets/showcase/Checkout (success) screen.png" width="250" alt="Checkout Success" />
</div>

---

## Features

- **Browse & search** — a paginated, virtualized grid of 1,100+ books with 300 ms
  debounced search across title and author, pull-to-refresh, and a scroll-to-top shortcut.
- **Book details** — cover, price, author, rating, description, and reviews, fetched on
  mount with explicit **loading → error (with retry) → success** states.
- **Shopping cart** — add/remove items, adjust quantities (clamped to `1…stock`), and a
  live total that updates as the cart changes. Cart count is mirrored on the tab bar badge.
- **Fly-to-cart animation** — the book cover animates along a curve into the cart icon,
  which then pulses. Respects the OS "reduce motion" setting.
- **Checkout** — a validated payment form (name, email, card, expiry, CVV) that submits a
  mock order, clears the cart on success, and surfaces errors without losing the cart.
- **Bookmarks** — a secondary Zustand store for saving books, shown alongside the cart flow.

---

## Getting Started

**Prerequisites:** Node 18+ and the [Expo](https://docs.expo.dev/) toolchain. No native
setup or backend is required — the API is mocked in-repo.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start
```

Then press `i` for the iOS simulator, `a` for an Android emulator, or scan the QR code with
**Expo Go**. Shortcut scripts are also available:

```bash
npm run ios      # open in iOS simulator
npm run android  # open in Android emulator
```

### Tests & quality checks

```bash
npm test          # run the Jest suite once
npm run test:watch
npm run type-check # tsc --noEmit (strict mode)
npm run lint       # eslint
```

---

## Technical Decisions & Trade-offs

### State management — Zustand (over Context / Redux)

The cart updates frequently (quantity, total, badge count), so **granular subscriptions**
matter. React Context re-renders _every_ consumer on any change — inefficient for a cart.
Zustand exposes selector-based subscriptions, so only the components that read a given slice
re-render:

```ts
// Only re-renders when the derived total changes.
const totalPrice = useCartTotalPrice();
```

This directly serves the "efficient updates to the UI as the cart changes" criterion.
Compared to Redux Toolkit, Zustand avoids provider nesting and slice boilerplate for what is
essentially one state domain, and a store is a plain hook that's trivial to unit-test. The
trade-off — Redux's DevTools/middleware ecosystem — isn't justified at this scale; RTK would
become attractive once the app grows more shared, cross-team state.

Cart logic lives in `cartStore.ts` with **derived values as selectors** (`selectors.ts`)
rather than stored state, so totals and counts can never drift out of sync with items.
`useShallow` guards list selectors against reference-identity re-renders.

### Data fetching — hand-written `useEffect`, not a data library

Fetching is deliberately implemented with **raw `useEffect` + `AbortController`** rather than
delegating to a data-fetching library. The assessment grades lifecycle understanding
specifically, so the code shows it directly: dependency arrays, cleanup on unmount and on
re-run, and cancellation to avoid setting state on an unmounted component or racing a stale
request when the `id`/search changes:

```ts
useEffect(() => {
    const controller = new AbortController();
    loadDetails(controller.signal); // resolves loading → success/error
    return () => controller.abort(); // cancels in-flight request on unmount/re-run
}, [loadDetails]);
```

The mock API honors the `AbortSignal` (rejecting with a `CANCELLED` error that the screen
ignores), so cancellation is real, not cosmetic.

### Animation — Reanimated (over the Animated API)

The fly-to-cart effect uses **Reanimated worklets**, which run on the UI thread, so the
animation stays at 60 fps even when the JS thread is busy. It measures the cover and cart
positions with `measureInWindow`, interpolates translate/scale/opacity along the flight path
via `withTiming`, and calls back into JS with `runOnJS` on completion to commit the add and
trigger the badge's spring pulse. `AccessibilityInfo.isReduceMotionEnabled()` short-circuits
the animation and adds the item instantly for users who prefer reduced motion.

### Mock API — in-repo, behind a service interface

`services/mock/api` provides a `BaseApiService` with simulated latency (400–900 ms),
a configurable failure rate, and `AbortSignal` support, plus a `BookApiService` implementing
`getBooks`, `getBook`, and `checkout`. Benefits:

- **Zero reviewer setup** — no server to run.
- **Deterministic error demos** — a `setFailureRate()` flag surfaces the loading/error/retry
  UI on demand (and pins failures on/off in tests). A ~40% rate is enabled by default so the
  error states are visible during a normal run.
- **Swappable** — screens depend on the service interface, so a real backend is a
  single-file change.

Prices are formatted at the display edge with `Intl.NumberFormat` (`amount-helpers.ts`),
defaulting to Naira (₦) — keeping money formatting out of business logic.

### Lists — FlashList

The catalogue uses Shopify's `FlashList` for recycling-based virtualization, which
outperforms `FlatList` on large datasets. See Performance below.

---

## Architecture

Feature-first structure: everything for a feature (screens, components, store, hooks) lives
together, which scales better than grouping by file type as features grow.

```
book-nook/
├── App.tsx                    # SafeAreaProvider → NavigationContainer → RootNavigator
├── src/
│   ├── navigation/            # RootNavigator (stack) + TabNavigator + typed routes
│   ├── features/
│   │   ├── books/             # Home, BookDetails, list + price components, bookmark store
│   │   ├── cart/              # Cart screen, CartItem, CartBadge, store + selectors
│   │   └── checkout/          # Checkout screen (form, validation, mock payment)
│   ├── services/mock/         # BaseApiService, BookApiService, books.json (1,100+ books)
│   ├── components/            # Shared UI: buttons, text, inputs, skeletons, nav bar, svgs
│   ├── styles/                # Color, font, and spacing tokens
│   ├── utils/                 # Currency + number formatting helpers
│   ├── types/                 # Book, Review, CartItem, paginated response types
│   └── test-utils/            # Test factories (makeBook, makeReview)
└── jest.config.js / jest-setup.ts
```

**Server state vs. client state** are kept separate: remote book data flows through the mock
API service and lives in per-screen fetch state, while the cart and bookmarks are client
state in Zustand stores. Navigation is a native stack (`Tab`, `BookDetails`, `Checkout`)
wrapping a bottom-tab navigator (`Home`, `Cart`).

### Data model

```ts
interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl: { thumbnail: string; full: string };
    description: string;
    rating: number;
    reviews: Review[];
    stock: number;
}
interface CartItem {
    book: Book;
    quantity: number;
}
interface Paginated<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
}
```

---

## Performance Optimizations

- **Server-side pagination** — `getBooks({ page, limit })` returns one page at a time;
  the list appends pages via `onEndReached` (0.5 threshold) with a footer spinner, so the
  app never renders the full 1,100-book dataset at once.
- **FlashList virtualization** — recycles row views instead of mounting all of them.
- **Memoized render path** — `renderItem`, `keyExtractor`, and handlers are wrapped in
  `useCallback` so stable references don't force list re-renders.
- **Selector-scoped state** — Zustand selectors (with `useShallow`) mean the cart badge and
  totals re-render independently of the rest of the tree.
- **Debounced search** — 300 ms debounce avoids firing a request per keystroke.
- **Image caching** — `expo-image` provides memory + disk caching; the list uses lightweight
  thumbnails while details use the full-resolution cover.
- **Request cancellation** — in-flight fetches are aborted on unmount/re-run, preventing
  wasted work and stale-state updates.

---

## Testing

Jest (`jest-expo` preset) with React Native Testing Library, querying by accessible text and
following an Arrange–Act–Assert structure — asserting behavior, not implementation. Run with
`npm test`. Coverage includes all of the required areas plus extras:

| Area (required)               | What's tested                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Book price component**      | Formatted currency output, zero/invalid amounts                                                                             |
| **Cart add/remove component** | `CartItem` stepper increments/decrements, floor at qty 1, remove                                                            |
| **API requests**              | `getBooks` pagination & search, `getBook` success/`NOT_FOUND`, forced network failures                                      |
| **Checkout component**        | Empty-form validation, successful order (checkout called, cart cleared, confirm + back nav), failed checkout preserves cart |

Extras: `cartStore` pure logic (no duplicates, stock clamping, `setQuantity` bounds),
cart selectors (item count, dynamic total), the bookmark store, the `BookDetails` screen's
loading/error/retry lifecycle, currency/number helpers, and shared UI components. Test data
comes from seeded factories (`test-utils/factories.ts`) for deterministic fixtures.

---

## What I'd Do With More Time

- **Cart persistence** with `zustand/middleware` + AsyncStorage/MMKV so the cart survives a
  restart — real commerce UX.
- **Real payments** — integrate Paystack (fitting for a Nigerian commerce product like Bumpa).
- **CI** — a GitHub Actions workflow running lint, type-check, and tests on every PR.
- **End-to-end tests** with Maestro or Detox for the full browse → add → checkout flow.
- **Error tracking** (Sentry) and skeleton-based loading everywhere for a more polished feel.
- **Dark mode** using the existing theme tokens.
