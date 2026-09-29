# MASTER E-COMMERCE SPECIFICATION & AGENT PROMPT
### Production-Ready, Full-Stack Next.js E-Commerce Application Generator

> **HOW TO USE THIS MASTER PROMPT:**
> When starting any new e-commerce project with an AI coding assistant (or initializing a new codebase), paste this entire prompt and simply provide:
> 1. **Store Niche / Product Type** (e.g., Streetwear Clothing, Luxury Watches, Sneaker Vault, Skincare & Cosmetics, Artisanal Coffee, Minimalist Furniture).
> 2. **Design Language & Aesthetic** (e.g., Bold Dark Streetwear with Monospace Accents, Scandinavian Clean Neutral, High-End Luxury Gold & Serif, Vibrant Cyberpunk Neon).
> 3. **Store Name & Currency** (e.g., "NEON", "₹" / "$").

---

```markdown
# TASK: BUILD A COMPLETE, PRODUCTION-READY FULL-STACK E-COMMERCE APPLICATION

You are an expert Principal Full-Stack Engineer and UI/UX Designer.
Build a complete, fully functional, production-ready full-stack e-commerce web application based on the following project profile:

- **Store Name**: [INSERT_STORE_NAME_HERE]
- **Niche / Product Type**: [INSERT_STORE_NICHE_HERE]
- **Design Aesthetic**: [INSERT_DESIGN_THEME_HERE]
- **Currency**: [INSERT_CURRENCY_SYMBOL_HERE]

---

## 1. TECH STACK & ARCHITECTURE

- **Framework**: Next.js (App Router, Server Components + selective `"use client"`, Server Actions / API Routes).
- **Language**: TypeScript (strict type safety, zero `any`).
- **Styling**: Tailwind CSS (mobile-first, responsive, custom typography, micro-interactions, clean neutral palette tailored to the specified aesthetic).
- **Database**: MongoDB with Mongoose (with connection pooling, cached connections, and lean queries).
- **Icons**: `lucide-react`.
- **Media Uploads**: Local / Cloudinary integration with unified URL & file upload input (`ImageUploadInput`).

---

## 2. CORE FEATURES & PAGES SPECIFICATION

### 2.1 Navigation & Global Layout
- **Announcement Bar**: Dynamic ticker/banner at the top (customizable from Admin).
- **Header**:
  - Sticky glassmorphism / clean header with Brand Logo.
  - Desktop Navigation: `HOME`, `SHOP`, `COLLECTIONS`, `ABOUT US`, `CONTACT`.
  - Action Icons: Live search modal trigger, Wishlist, User account/profile, Cart icon with live quantity badge.
  - Mobile Menu Drawer: Slide-over mobile drawer with quick navigation links, social handles, and user state.
- **Footer**: Multi-column footer with brand mission, quick shop categories, customer service links, policy links, newsletter signup, and copyright.

---

### 2.2 Homepage (`/`)
- **Hero Carousel Banner**:
  - Auto-playing slide carousel with manual touch-swipe controls, slide indicators, and responsive height (optimized for both desktop and mobile screens).
  - Background image or color, high-impact typography, sub-tagline, and CTA button.
- **Trust / Value Proposition Strip**:
  - 3–4 value props (e.g. Free Shipping, Authentic Quality Guarantee, Easy 7-Day Returns, 24/7 Support).
  - Mobile-optimized to fit compactly in a single horizontal row or tight grid.
- **Shop By Category Slider / Scroll**:
  - Mobile-friendly touch slider / horizontal swipe showing 2–3 cards at once with smooth slide transitions.
  - Controlled from Admin (enable/disable, limit items, choose categories).
- **Dynamic Category Spotlight & Showcase Sections**:
  - Unlimited category-specific spotlight blocks (e.g., "Featured Hoodies", "Trending Cargo Pants").
  - Configurable from Admin: Title, Subtitle, Category Slug, Item Limit, or explicitly selected Product IDs.
- **Multi-Category Tabbed Showcase**:
  - Instant category tabs (e.g. All, Jackets, Tees, Accessories) switching the product grid without full page reload.
- **Trending Now / Featured Drops Grid**:
  - Grid of trending products with hover image swap, badge (Trending, New, Sale), and quick Add-to-Cart.

---

### 2.3 Shop Page (`/shop`) vs. Collections Page (`/collections`)
**Strict Separation of Shop and Collections:**
- **Collections Page (`/collections`)**:
  - Dedicated visual showcase of all store categories / collections.
  - High-res image cards, item counts, description summaries, and direct links to `/shop?category=[slug]`.
- **Shop Page (`/shop`)**:
  - **In-Shop Search Bar**: Live search input inside the shop for instant filtering without leaving the page.
  - **Mobile-Friendly Category Chips**: Horizontal touch-scrollable category chips with active styling and count badges.
  - **Mobile "Filter & Sort" Bottom Sheet**:
    - Tap "Filter & Sort" on mobile to open a slide-up drawer.
    - Category selector, Price Range selector (Under ₹999, ₹1,000–₹1,999, ₹2,000+, etc.), and Sort Order selector (Newest, Price Low to High, Price High to Low, Most Popular).
    - Clear All and Apply buttons.
  - **Desktop Filter Bar**: Category chips, Price Range dropdown, Sort dropdown, active filter pill tags with `✕` dismiss, and `Clear all`.
  - **Pagination**: 12 products per page with URL search params (`?page=2&category=...&sort=...&minPrice=...`), preserving all active filters and sort orders.

---

### 2.4 Product Details Page (`/products/[slug]`)
- Multi-image gallery with high-res zoom preview and thumbnail selector.
- Product Title, Monospace SKU, Category badge, Condition rating (if thrift/vintage/refurbished), and Stock status.
- Pricing with strikethrough original price (strictly bug-free: never show ₹0 when originalPrice is 0 or absent).
- Size Selector (S, M, L, XL, etc.) with active selection indicator and stock warning.
- Quantity counter, "Add to Cart" button with animated feedback, and instant "Buy Now" direct checkout trigger.
- Accordion / Tabs: Description, Fabric & Specifications, Size Guide, Shipping & Returns.
- Related / Recommended Products carousel.

---

### 2.5 Cart & Checkout
- **Cart Drawer & Page (`/cart`)**:
  - Line items with product thumbnail, title, selected size, unit price, quantity stepper, and remove button.
  - Free Shipping Progress Bar (e.g., "Add ₹300 more to unlock FREE SHIPPING").
  - Subtotal, Shipping fee calculation, and Checkout CTA.
- **Checkout Page (`/checkout`)**:
  - Express guest or registered checkout.
  - Contact details (Name, Phone, Email) and Shipping Address with city/postal validation.
  - Payment method selection: Cash on Delivery (COD) or Online Payment / Card.
  - Order summary breakdown and instant order placement.

---

### 2.6 Order Confirmation, Tracking & Cash Memo (`/orders/[id]`, `/track-order`)
- **Order Success & Tracking**:
  - Visual status progress stepper: `Pending` → `Processing` → `Shipped` → `Delivered`.
  - Delivery details, customer contact, and line items.
- **Order Cash Memo / Invoice Printing System**:
  - Reusable printable component (`OrderInvoiceMemo`) accessible by both the customer (`/orders/[id]`) and admin (`/admin/orders`).
  - Professional invoice layout: Store branding, Address, Contact, Memo # (`MEMO-XXXX`), Order Date, Payment Status badge, Bill-To & Ship-To details, Itemized Table (SL, Description, Size, Qty, Rate, Total), Subtotal, Shipping, Grand Total, Return Terms, Barcode aesthetic, and Authorized Signature.
  - Styled with `@media print` so clicking "Print Memo" prints or saves a clean A4 PDF hiding site navigation and action buttons.

---

### 2.7 Contact Us Page (`/contact`) & Support Desk
- **Public Contact Form**:
  - Fields: Customer Name, Email Address, Order ID (optional), and Message.
  - Real API integration (`POST /api/contact`) saving submissions to the `ContactMessage` MongoDB collection.
  - Form validation, loading spinner, and success confirmation screen.
- **Admin Inquiries Desk (`/admin/messages`)**:
  - Status filter tabs: `All`, `Unread`, `Read`, `Replied` with real-time counter badges.
  - Search inquiries by name, email, order ID, or message text.
  - Side reading panel to review message content.
  - 1-click **"Reply via Email"** (`mailto:`) button.
  - Status updater (Unread/Read/Replied), delete action, and table pagination.

---

### 2.8 About Us Page (`/about`) & Admin CMS
- **Public Page (`/about`)**:
  - Dynamically rendered from MongoDB (`/api/about`) with full static fallback.
  - Header Tagline/Badge, Main Title, Subtitle.
  - Cover Banner Image (16:9 responsive).
  - Dynamic Core Pillars / Values cards (Number, Title, Description).
  - Brand Story & Vision narrative block.
- **Admin About Editor (`/admin/about`)**:
  - Full WYSIWYG/form editor to customize all About page fields.
  - Live upload / URL input for cover banner image.
  - Dynamic Pillar repeater: Add new pillars (`+ Add Pillar`), edit titles/descriptions, and remove pillars.
  - Instant Save with success toast and link to view the live page.

---

### 2.9 Comprehensive Admin Panel (`/admin/*`)
- **Protected Layout & Sidebar**:
  - Admin authentication verification with redirect to `/admin/login`.
  - Sticky desktop sidebar and mobile slide-over drawer with links:
    - `Dashboard` (`/admin`)
    - `Products` (`/admin/products`)
    - `Categories` (`/admin/categories`)
    - `Orders` (`/admin/orders`)
    - `Messages` (`/admin/messages`)
    - `Banners & Hero` (`/admin/banners`)
    - `About Us` (`/admin/about`)
    - `Store Settings` (`/admin/settings`)
- **Admin Products (`/admin/products`)**:
  - Search and Category filter.
  - Add / Edit product modal with `ImageUploadInput`, sizes, prices, stock, and trending flag.
  - Paginated table with 10, 20, 50 rows per page selector.
- **Admin Categories (`/admin/categories`)**:
  - Create, edit, and delete categories with custom image and slug.
- **Admin Orders (`/admin/orders`)**:
  - Status filters (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Search by order number, customer name, or email.
  - Order details panel with status dropdown, line items, and **"Print Cash Memo / Invoice"** button.
  - Paginated table (10, 20, 50 orders per page).
- **Admin Banners / Homepage Builder (`/admin/banners`)**:
  - Live control of announcement bar text.
  - Multi-slide hero manager (Add/edit slides, background image/color, text colors, CTA link).
  - Value props manager.
  - Shop By Category section toggle & category chooser.
  - Unlimited Featured Category spotlight sections builder.
- **Admin Store Settings (`/admin/settings`)**:
  - Store name, tagline, currency, free shipping minimum threshold, contact email, phone, address, and Cloudinary keys.

---

## 3. CRITICAL IMPLEMENTATION RULES & BUG PREVENTIONS

1. **Controlled vs. Uncontrolled Input Rule**:
   - In any image or text input component (e.g. `ImageUploadInput`), ALWAYS ensure `value={value || ""}` so it NEVER transitions from `undefined` to a defined value.
2. **Zero Price Display Rule**:
   - For original/strikethrough prices, ALWAYS check:
     `typeof p.originalPrice === "number" && p.originalPrice > p.price`
     NEVER write `p.originalPrice && ...` because `0` evaluates to falsy but renders literal `0` in JSX.
3. **Async searchParams Rule (Next.js 15+)**:
   - In page server components, `searchParams` and `params` are Promises. ALWAYS write:
     `const { category, page } = await searchParams;`
4. **Pagination Preservation Rule**:
   - When generating pagination links (`buildPageLink`), ALWAYS preserve all active query parameters (`category`, `sort`, `search`, `minPrice`, `maxPrice`).
5. **Mobile-First Touch Friendliness**:
   - Ensure all category bars, filter tabs, and action pills scroll horizontally with `no-scrollbar` and have comfortable minimum tap targets (40px+).

---

## 4. EXECUTION INSTRUCTIONS

When starting the project:
1. Scaffold the required folder structure (`app/`, `features/`, `components/`, `lib/`).
2. Setup MongoDB models (`Product`, `Category`, `Order`, `Banner`, `Setting`, `ContactMessage`, `About`).
3. Seed rich, realistic demo data tailored to the specified store niche.
4. Implement all public frontend routes and the full admin suite as described above.
5. Run `npm run build` and ensure zero TypeScript or build errors.
```
