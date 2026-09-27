# Next.js Full-Stack Application

## AI Development & Architecture Specification

> This document is the primary architectural and development guideline for this project.
>
> Every developer and AI coding agent must read and understand this document before creating, modifying, refactoring, or deleting code.

---

# 1. Project Overview

This project is a modern, scalable, full-stack web application built with Next.js.

The application may contain:

- Public website
- Dashboard
- Authentication
- User management
- Admin panel
- API
- Server Actions
- Database
- Business logic
- Forms
- Data tables
- File uploads
- Payments
- Notifications
- Search
- Filtering
- Analytics
- Other project-specific functionality

The exact business requirements will be defined separately.

This document defines the **technical architecture, coding standards, UI standards, performance standards, and AI development rules**.

---

# 2. Primary Goals

The application must prioritize:

- Clean architecture
- Scalability
- Maintainability
- Type safety
- Security
- Performance
- Accessibility
- Mobile-first design
- Responsive UI
- Reusable components
- Feature-based organization
- SEO
- Good developer experience
- Good AI coding-agent experience

---

# 3. Core Architecture Principles

## 3.1 Feature-Based Architecture

Organize functionality around features/domains.

Example:

```text
features/
├── auth/
├── users/
├── products/
├── orders/
├── payments/
├── notifications/
└── dashboard/
```

Each feature should contain its own implementation when appropriate.

Example:

```text
features/
└── products/
    ├── components/
    ├── actions/
    ├── services/
    ├── schemas/
    ├── hooks/
    ├── types/
    ├── constants/
    └── index.ts
```

---

# 4. Technology Stack

## Frontend

Default:

```text
Next.js
React
TypeScript
Tailwind CSS
```

Additional UI libraries may be introduced when necessary.

---

## Backend

Backend functionality will be implemented inside the Next.js application.

Possible approaches:

```text
Next.js Route Handlers
```

and/or:

```text
Next.js Server Actions
```

Use the approach that best fits the functionality.

---

## Database

The project may use either:

```text
PostgreSQL
```

or:

```text
MongoDB
```

The selected database will be defined by the project requirements.

---

## ORM

Prisma may be used as the ORM.

Important:

```text
Prisma is an ORM.
Prisma is not a database.
```

Possible architectures:

```text
PostgreSQL
    ↓
Prisma
    ↓
Application
```

or:

```text
MongoDB
    ↓
Prisma
    ↓
Application
```

---

# 5. Recommended Project Structure

The default project structure should be:

```text
/
├── app/
│   ├── (marketing)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── shared/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── dashboard/
│   └── ...
│
├── actions/
│   └── ...
│
├── hooks/
│   └── ...
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── validation/
│   ├── utils/
│   ├── constants/
│   ├── cache/
│   └── ...
│
├── types/
│   └── ...
│
├── config/
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   ├── icons/
│   └── ...
│
├── middleware.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

The structure may evolve as the project grows.

Do not create unnecessary directories.

---

# 6. App Router

The application must use the Next.js App Router.

The `app/` directory is responsible primarily for:

- Routes
- Pages
- Layouts
- Route handlers
- Loading states
- Error states
- Not-found states
- Metadata

Example:

```text
app/
├── page.tsx
├── layout.tsx
│
├── products/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── [id]/
│       └── page.tsx
│
└── api/
    └── products/
        └── route.ts
```

Avoid putting large business logic directly inside page files.

---

# 7. Feature Architecture

Each major functionality should have a dedicated feature.

Example:

```text
features/
└── products/
    ├── components/
    │   ├── ProductCard.tsx
    │   ├── ProductForm.tsx
    │   ├── ProductList.tsx
    │   ├── ProductTable.tsx
    │   ├── ProductFilters.tsx
    │   ├── ProductDetails.tsx
    │   └── ProductDeleteDialog.tsx
    │
    ├── actions/
    │   ├── create-product.ts
    │   ├── update-product.ts
    │   └── delete-product.ts
    │
    ├── services/
    │   └── product.service.ts
    │
    ├── schemas/
    │   └── product.schema.ts
    │
    ├── hooks/
    │   └── use-products.ts
    │
    ├── types/
    │   └── product.types.ts
    │
    ├── constants/
    │   └── product.constants.ts
    │
    └── index.ts
```

---

# 8. Component Responsibility

Every component should have one clear responsibility.

Avoid:

```text
ProductPage.tsx
```

containing:

- Database queries
- API calls
- Validation
- Business logic
- Form logic
- Table logic
- Modal logic
- Filtering
- Pagination
- UI rendering

Instead:

```text
ProductPage
├── ProductHeader
├── ProductFilters
├── ProductList
├── ProductCard
├── ProductPagination
└── ProductActions
```

---

# 9. Shared Components

Shared components belong inside:

```text
components/
```

Example:

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dialog.tsx
│   ├── Card.tsx
│   ├── Table.tsx
│   ├── Badge.tsx
│   └── Skeleton.tsx
│
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
├── navigation/
│   ├── Navbar.tsx
│   └── Breadcrumb.tsx
│
├── shared/
│   ├── EmptyState.tsx
│   ├── ConfirmDialog.tsx
│   └── Pagination.tsx
│
└── feedback/
    ├── LoadingState.tsx
    ├── ErrorState.tsx
    └── SuccessMessage.tsx
```

Do not move feature-specific components here unnecessarily.

For example:

```text
ProductCard
```

should normally remain:

```text
features/products/components/ProductCard.tsx
```

---

# 10. UI Component Rules

Generic UI components must remain business-logic independent.

Example:

```tsx
<Button />
```

is acceptable.

A generic UI component should not contain:

```text
Product business logic
Order business logic
User business logic
Database logic
API calls
```

---

# 11. Mobile-First Design

Mobile-first design is mandatory.

Design progression:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
   ↓
Large Desktop
```

Do not design desktop first and simply shrink the interface.

The mobile experience must be considered first.

---

## Responsive Requirements

Every page should work properly on:

```text
320px+
375px+
390px+
430px+
768px+
1024px+
1280px+
1440px+
```

Do not hardcode layouts for only one screen size.

---

# 12. Mobile UX

Mobile interfaces should prioritize:

- Touch-friendly controls
- Readable text
- Appropriate spacing
- Easy navigation
- Appropriate button sizes
- Responsive forms
- Responsive tables
- Horizontal scrolling only when appropriate
- Mobile navigation
- Bottom sheets/drawers when appropriate
- Avoiding unnecessary horizontal overflow

Buttons and interactive controls must be comfortably tappable.

---

# 13. Responsive Tables

Large data tables must not blindly overflow the entire page.

Depending on the use case, use:

```text
Horizontal scrolling
```

or:

```text
Responsive card layout
```

or:

```text
Priority-based column hiding
```

The best approach should be selected based on the data.

---

# 14. Loading States

Every data-driven interface must handle loading states.

Use:

```text
Skeleton Loading
```

when the final layout is predictable.

Example:

```text
ProductList
├── ProductCardSkeleton
├── ProductCardSkeleton
├── ProductCardSkeleton
└── ProductCardSkeleton
```

Avoid showing a completely blank screen while data loads.

---

# 15. Skeleton System

Reusable skeleton components should exist.

Example:

```text
components/ui/
└── Skeleton.tsx
```

Feature-specific skeletons:

```text
features/products/components/
├── ProductCard.tsx
├── ProductCardSkeleton.tsx
└── ProductListSkeleton.tsx
```

Skeleton layouts should resemble the final UI.

Avoid generic full-screen loaders when a contextual skeleton can be used.

---

# 16. Next.js Loading UI

Use:

```text
loading.tsx
```

for route-level loading states where appropriate.

Example:

```text
app/dashboard/
├── page.tsx
└── loading.tsx
```

The loading UI should provide useful visual feedback immediately.

---

# 17. Suspense

Use React/Next.js Suspense boundaries when they improve progressive rendering.

Example:

```text
Page
├── Header
├── Suspense
│   └── DataSection
└── Footer
```

Do not wrap everything in unnecessary Suspense boundaries.

---

# 18. Streaming

Use Next.js streaming capabilities when useful for pages containing slow or independent data sources.

Prioritize:

```text
Critical UI
    ↓
Secondary content
    ↓
Slow/non-critical content
```

The user should see useful content as quickly as possible.

---

# 19. Loading / Success / Empty / Error

Every data-driven feature should consider four states:

```text
Loading
Success
Empty
Error
```

Example:

```text
ProductList
├── Loading
├── Products Found
├── No Products
└── Error
```

Never assume that data will always exist.

---

# 20. Error Handling

Use:

```text
error.tsx
```

where appropriate.

Also provide feature-level error handling.

Errors should be:

- Understandable
- Safe
- Actionable when possible

Never expose:

```text
Database credentials
Stack traces
Internal server details
Sensitive information
```

to end users.

---

# 21. Empty States

Every list/table should have a meaningful empty state.

Example:

```text
No products found.

Create your first product to get started.
```

Where appropriate, include an action:

```text
[Create Product]
```

---

# 22. Server Components

Use Server Components by default.

Only use Client Components when required.

Client Components are appropriate for:

- useState
- useEffect
- Browser APIs
- Interactive UI
- Event handlers
- Client-only libraries

Avoid:

```text
"use client"
```

at the top of entire pages unless necessary.

---

# 23. Client JavaScript Optimization

Minimize unnecessary client-side JavaScript.

Prefer:

```text
Server Component
```

over:

```text
Client Component
```

when possible.

Do not move server functionality to the browser without a clear reason.

---

# 24. Dynamic Imports

Use dynamic imports when they meaningfully reduce initial JavaScript.

Potential candidates:

- Large editors
- Charts
- Maps
- Heavy third-party libraries
- Rarely used dialogs
- Complex client-only components

Do not dynamically import everything unnecessarily.

---

# 25. Image Optimization

Use Next.js image optimization.

Prefer:

```tsx
<Image />
```

over raw:

```html
<img />
```

when applicable.

Images should:

- Have appropriate dimensions
- Use appropriate formats
- Avoid unnecessarily huge files
- Use responsive sizing
- Use lazy loading where appropriate

Hero/above-the-fold images should be treated appropriately for fast rendering.

---

# 26. Font Optimization

Use Next.js font optimization where possible.

Avoid loading unnecessary fonts.

Limit the number of font families and weights.

---

# 27. Performance Rules

Every feature should consider:

```text
Rendering performance
Network requests
Database queries
JavaScript bundle size
Image size
Font loading
Caching
Revalidation
Server response time
```

---

# 28. Data Fetching

Prefer server-side data fetching when appropriate.

Avoid unnecessary:

```text
Browser → API → Server → Database
```

when the page can directly access server-side data.

Use the simplest secure data-fetching approach.

---

# 29. Database Query Optimization

Avoid unnecessary database queries.

Bad:

```text
Query users
Query each user's orders
Query each order's products
```

when the data can be fetched efficiently.

Use appropriate:

- Relations
- Select
- Include
- Aggregation
- Pagination
- Indexes
- Transactions

based on the database and ORM.

---

# 30. Database Pagination

Large datasets must not be loaded entirely into memory.

Use pagination for:

- Users
- Products
- Orders
- Transactions
- Logs
- Notifications
- Other large collections

Possible approaches:

```text
Offset pagination
```

or:

```text
Cursor pagination
```

Select the appropriate approach based on the use case.

---

# 31. Database Indexing

Frequently queried fields should be considered for indexing.

Examples:

```text
email
slug
userId
createdAt
status
foreign keys
search-related fields
```

Do not add indexes blindly.

Indexes should support actual query patterns.

---

# 32. Caching

Use caching where appropriate.

Potential caching strategies include:

```text
Next.js caching
Revalidation
Request memoization
Database caching
Application-level caching
```

Do not cache sensitive or highly dynamic data incorrectly.

---

# 33. Revalidation

Use appropriate revalidation strategies for content that does not need real-time updates.

Example categories:

```text
Static
Revalidated
Dynamic
Real-time
```

Choose intentionally.

---

# 34. Search Optimization

Search interfaces should consider:

- Debouncing
- Pagination
- Server-side search for large datasets
- Proper indexes
- URL query parameters when appropriate
- Loading feedback
- Empty results
- Error states

Do not send a database request on every keystroke without a reason.

---

# 35. Forms

Forms should provide:

- Client-side validation
- Server-side validation
- Loading state
- Error state
- Success feedback
- Disabled state during submission
- Accessible labels
- Proper keyboard navigation

Never rely only on client-side validation.

---

# 36. Optimistic UI

Use optimistic UI when appropriate.

Good candidates:

```text
Like
Favorite
Toggle
Simple status update
Small non-critical mutation
```

Do not use optimistic updates where rollback or data consistency is complicated unless properly implemented.

---

# 37. API Architecture

Recommended flow:

```text
Route Handler
      ↓
Validation
      ↓
Authorization
      ↓
Service
      ↓
Database
```

Example:

```text
app/api/products/route.ts
        ↓
features/products/schemas/
        ↓
features/products/services/
        ↓
lib/db/
        ↓
Database
```

---

# 38. Route Handlers

Use Route Handlers when an HTTP API is required.

Example:

```text
app/api/products/route.ts
app/api/products/[id]/route.ts
```

Route handlers should remain thin.

Do not put complex business logic directly inside `route.ts`.

---

# 39. Server Actions

Server Actions can be used for mutations where appropriate.

Example:

```text
features/products/actions/
├── create-product.ts
├── update-product.ts
└── delete-product.ts
```

A Server Action should:

1. Validate input.
2. Authenticate user.
3. Authorize user.
4. Execute business logic.
5. Perform database operation.
6. Return a predictable result.

---

# 40. Service Layer

Business logic that is reusable or complex should live in services.

Example:

```text
features/orders/services/order.service.ts
```

Possible functions:

```text
createOrder()
cancelOrder()
calculateOrderTotal()
validateOrder()
processOrder()
```

Services should not contain UI code.

---

# 41. Validation

Use Zod or another appropriate validation system.

Example:

```text
features/users/schemas/user.schema.ts
```

Validation must occur on the server for trusted operations.

Never trust browser-provided:

```text
role
price
permissions
userId
ownership
discount
```

without server-side verification.

---

# 42. Authentication

Authentication should be isolated.

Example:

```text
lib/auth/
├── config.ts
├── session.ts
└── permissions.ts
```

The exact authentication library will be selected per project.

---

# 43. Authorization

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
What are you allowed to do?
```

Authorization must be enforced server-side.

Frontend checks are only for UX.

They are not security boundaries.

---

# 44. Database Layer

Centralize database access.

Recommended:

```text
lib/db/
└── prisma.ts
```

Avoid creating random database clients in multiple files.

---

# 45. Prisma

When Prisma is selected:

```text
prisma/
└── schema.prisma
```

The schema must remain the primary definition of Prisma models.

Avoid manually duplicating database structures unnecessarily.

---

# 46. MongoDB

When MongoDB is selected:

```text
MongoDB
    ↓
Prisma
    ↓
Service Layer
    ↓
Application
```

Database-specific behavior should be isolated as much as practical.

---

# 47. TypeScript

TypeScript is mandatory.

Avoid unnecessary:

```ts
any;
```

Prefer:

```text
Type inference
Type aliases
Interfaces
Generics
Zod inferred types
Prisma generated types
```

---

# 48. Types

Global/shared types:

```text
types/
```

Feature-specific types:

```text
features/products/types/
```

Avoid duplicate type definitions.

Where possible, derive types from the source of truth.

---

# 49. Hooks

Global reusable hooks:

```text
hooks/
```

Feature-specific hooks:

```text
features/products/hooks/
```

Example:

```text
hooks/
├── useDebounce.ts
├── useMediaQuery.ts
└── useCurrentUser.ts
```

---

# 50. Utilities

Global utilities:

```text
lib/utils/
```

Feature-specific utilities:

```text
features/products/utils/
```

Do not put business-specific utilities into global folders.

---

# 51. Constants

Global constants:

```text
lib/constants/
```

Feature-specific:

```text
features/products/constants/
```

Avoid magic strings and magic numbers scattered throughout the project.

---

# 52. Naming Convention

## Components

Use:

```text
PascalCase
```

Example:

```text
ProductCard.tsx
UserProfile.tsx
OrderTable.tsx
```

---

## Functions

Use:

```text
camelCase
```

Example:

```text
createProduct()
getUser()
calculateTotal()
```

---

## Service Files

Use:

```text
product.service.ts
order.service.ts
user.service.ts
```

---

## Schema Files

Use:

```text
product.schema.ts
user.schema.ts
```

---

## Type Files

Use:

```text
product.types.ts
user.types.ts
```

---

# 53. Environment Variables

Use:

```text
.env
.env.example
```

Never commit secrets.

Example:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

Only variables intended for browser exposure should use:

```text
NEXT_PUBLIC_
```

---

# 54. Security

The application must:

- Validate all external input
- Protect private routes
- Enforce authorization server-side
- Protect secrets
- Avoid leaking internal errors
- Secure authentication/session handling
- Validate file uploads
- Restrict access to private resources
- Avoid unsafe query construction
- Prevent unauthorized resource access

---

# 55. Accessibility

Accessibility should be considered by default.

Use:

- Semantic HTML
- Proper headings
- Labels
- Keyboard navigation
- Focus states
- Accessible buttons
- Accessible dialogs
- Appropriate ARIA only when necessary
- Sufficient contrast
- Meaningful alt text

Do not use `<div>` as a button when a real `<button>` is appropriate.

---

# 56. SEO

Public-facing pages should implement appropriate:

- Title
- Description
- Open Graph metadata
- Twitter/X metadata where applicable
- Canonical URLs
- Structured data where appropriate
- Sitemap
- Robots configuration

SEO should use Next.js-supported mechanisms.

---

# 57. Core Web Vitals

The application should be optimized for:

```text
LCP
INP
CLS
```

Consider:

- Fast server responses
- Optimized images
- Minimal client JavaScript
- Stable layouts
- Proper font loading
- Lazy loading
- Efficient rendering

---

# 58. Layout Stability

Avoid unexpected layout shifts.

Reserve space for:

- Images
- Videos
- Ads
- Async content
- Dynamic components

Skeleton layouts should closely match the final content dimensions.

---

# 59. Progressive Rendering

When possible:

```text
Render important content first
        ↓
Render secondary content
        ↓
Render non-critical content
```

Do not block the entire page unnecessarily because one secondary section is slow.

---

# 60. Error Boundaries

Use error boundaries for appropriate routes and feature areas.

Examples:

```text
app/
└── dashboard/
    ├── error.tsx
    └── page.tsx
```

Errors should provide recovery options where possible.

---

# 61. Not Found Pages

Use:

```text
not-found.tsx
```

for appropriate routes.

404 pages should be useful and provide navigation back to relevant areas.

---

# 62. File Uploads

File uploads must consider:

- File type validation
- File size validation
- Authentication
- Authorization
- Storage strategy
- Filename safety
- Error handling
- Progress feedback
- Image optimization when applicable

Never trust the file extension alone.

---

# 63. Notifications

Notifications should have clear states:

```text
Success
Error
Warning
Info
```

Do not overuse toast notifications.

Important errors should remain visible until the user understands them when appropriate.

---

# 64. Dependency Rules

Before installing a dependency:

1. Check existing dependencies.
2. Check whether native browser functionality is sufficient.
3. Check whether Next.js provides the functionality.
4. Check whether an existing internal utility can solve it.
5. Install a dependency only when it provides meaningful value.

Do not add libraries simply because they are popular.

---

# 65. Avoid Overengineering

Do not create unnecessary abstractions.

Avoid creating:

```text
Factory
Manager
Adapter
Repository
Provider
Handler
Wrapper
```

unless they provide actual architectural value.

Prefer simple, clear code.

---

# 66. Avoid Giant Files

Avoid:

```text
1000+ line page.tsx
1000+ line component.tsx
1500+ line service.ts
```

When a file contains multiple responsibilities, split it.

---

# 67. Git Commit Convention

Use meaningful commits.

Examples:

```text
feat: add product management
feat: add user authentication
fix: resolve product validation issue
fix: fix mobile navigation
refactor: simplify order service
perf: optimize product queries
style: improve dashboard layout
docs: update project documentation
chore: update dependencies
```

---

# 68. Do Not Commit

Never commit:

```text
.env
node_modules/
.next/
```

or secrets, private keys, credentials, or generated sensitive files.

---

# 69. AI Coding Agent Instructions

This section is mandatory.

Before writing code, the AI must:

```text
1. Read this README.
2. Inspect the existing project structure.
3. Inspect related existing functionality.
4. Identify reusable components.
5. Identify existing utilities.
6. Identify existing patterns.
7. Understand database models.
8. Understand authentication.
9. Understand authorization.
10. Plan the implementation.
11. Implement only the required changes.
12. Validate the implementation.
13. Check for regressions.
```

---

# 70. AI Must Reuse Existing Code

Before creating:

```text
Component
Hook
Utility
Service
Schema
Type
API
```

the AI must check whether an existing implementation can be reused.

Do not duplicate functionality.

---

# 71. AI Must Not Modify Unrelated Code

When implementing a feature:

```text
Only modify files necessary for the feature.
```

Do not refactor unrelated parts of the application unless explicitly requested or required for correctness.

---

# 72. AI Must Follow Existing Patterns

If the project already has:

```text
Button pattern
Form pattern
Table pattern
Modal pattern
API pattern
Service pattern
Validation pattern
Authentication pattern
Database pattern
```

new code must follow the existing pattern.

Do not introduce a second competing pattern without a strong reason.

---

# 73. AI Feature Development Workflow

Every new feature should follow:

```text
Requirement
    ↓
Understand
    ↓
Inspect existing code
    ↓
Identify architecture
    ↓
Plan
    ↓
Implement
    ↓
Validate
    ↓
Test
    ↓
Review
```

---

# 74. AI Must Think About UX

Before finishing a feature, check:

```text
Desktop
Mobile
Loading
Empty
Error
Success
Accessibility
Performance
```

A feature is not complete simply because the happy path works.

---

# 75. AI Must Think About Performance

Before completing a feature, ask:

```text
Can this be a Server Component?
Can client JavaScript be reduced?
Can this query be optimized?
Can this data be cached?
Can this image be optimized?
Can this component be lazy loaded?
Are unnecessary requests being made?
Is pagination required?
Is debouncing required?
```

---

# 76. AI Must Think About Security

Before completing a feature, check:

```text
Authentication
Authorization
Input validation
Sensitive data
Resource ownership
File upload security
API security
Database access
```

---

# 77. AI Must Think About Mobile

Before completing a UI feature, verify:

```text
Mobile width
Tablet width
Desktop width
Touch interaction
Overflow
Typography
Spacing
Navigation
Forms
Tables
Dialogs
```

---

# 78. Definition of Done

A feature is complete only when:

### Functionality

- Feature works correctly.
- Main use cases work.
- Edge cases are considered.

### UI

- Responsive.
- Mobile-first.
- Accessible.
- Consistent with existing design system.

### States

- Loading state.
- Skeleton state where appropriate.
- Empty state.
- Error state.
- Success state.

### Backend

- Input validation.
- Authentication.
- Authorization.
- Correct business logic.
- Correct database operations.

### Performance

- No unnecessary API calls.
- No unnecessary client JavaScript.
- Efficient queries.
- Proper pagination.
- Optimized images.
- Appropriate caching.

### Code Quality

- Type-safe.
- Reusable.
- Maintainable.
- No unnecessary dependencies.
- No duplicated logic.
- No unrelated changes.

---

# 79. Project-Specific Requirements

The following section will be filled according to the individual project.

## Project Name

```text
[PROJECT NAME]
```

## Project Description

```text
[PROJECT DESCRIPTION]
```

## Target Users

```text
[TARGET USERS]
```

## Main Features

```text
[FEATURE 1]

[FEATURE 2]

[FEATURE 3]

[FEATURE 4]
```

## Database

```text
PostgreSQL / MongoDB
```

## ORM

```text
Prisma
```

## Authentication

```text
[AUTHENTICATION SYSTEM]
```

## Payment

```text
[PAYMENT SYSTEM]
```

## Storage

```text
[STORAGE SYSTEM]
```

## External Services

```text
[EXTERNAL SERVICES]
```

---

# 80. Final Architectural Rule

The architecture must remain:

```text
                    Next.js
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend                  Backend
          │                         │
      Components              API / Actions
          │                         │
      Features                  Services
          │                         │
      UI / Hooks              Validation
                                    │
                              Authorization
                                    │
                               Database
                                    │
                          PostgreSQL / MongoDB
                                    │
                                  Prisma
```

The overall goal is:

```text
Clean
+
Scalable
+
Maintainable
+
Secure
+
Type-safe
+
Mobile-first
+
Responsive
+
Accessible
+
SEO-friendly
+
Performance-optimized
+
AI-friendly
```

This README is the default architectural contract for the project.

Any project-specific requirement must be implemented within these principles unless there is a documented technical reason to deviate.
