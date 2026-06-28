# SEAPEDIA Frontend

SEAPEDIA is a multi-role seafood marketplace frontend connecting Buyers, Sellers, Drivers, and Admins.

| Role | Description |
|------|-------------|
| **Guest** | Browse products, stores, and reviews without login |
| **Buyer** | Manage wallet, addresses, cart, checkout, orders |
| **Seller** | Manage store, products, process orders |
| **Driver** | Find and complete delivery jobs, track earnings |
| **Admin** | Monitor system, manage discounts, simulate time, handle refunds |

The frontend connects to the SEAPEDIA backend API (separate repository).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript 5.3 (strict mode) |
| Build | Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router 6 |
| Server State | TanStack React Query 5 |
| Client State | Zustand 4 |
| Forms | React Hook Form + Zod |
| HTTP | Fetch API (shared client at `src/api/client.ts`) |

## Requirements

- Node.js 18+
- npm
- Running SEAPEDIA backend API

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server starts at **http://localhost:5173**.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Backend API base URL |

- **Local development:** leave as `/api`. Vite proxies `/api` requests to the backend (configured in `vite.config.ts`).
- **Production:** set to the deployed backend URL, e.g. `https://api.example.com/api`.
- **Important:** Vite embeds env variables at **build time**. You must rebuild after changing `VITE_API_BASE_URL`.

## API Configuration

The shared API client reads `VITE_API_BASE_URL` from `import.meta.env`. If not set, it falls back to `/api`.

In local development `vite.config.ts` proxies `/api` → `http://localhost:3000`. No env change needed.

In production set `VITE_API_BASE_URL` to the backend URL and configure the backend's `FRONTEND_URL` CORS setting to match the frontend origin.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | TypeScript check + production build (`tsc -b && vite build`) |
| `npm run preview` | Preview the production build locally |

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static host:

- Vercel / Netlify / Cloudflare Pages
- Nginx / Apache / S3 + CloudFront

**SPA fallback:** configure the server to serve `index.html` for all routes (otherwise direct URL access or page refresh returns 404).

## Local Development With Backend

1. Start the backend API server (expected at `http://localhost:3000`).
2. Run `npm run dev` from this repo.
3. Keep `VITE_API_BASE_URL=/api` (or leave the `.env` default).

The Vite proxy forwards all `/api` requests to the backend.

## Demo Flow

### Guest

1. Open the landing page (`/`).
2. Browse products (`/products`) — search by name, sort by price.
3. Click a product to view detail (`/products/:id`).
4. Visit a store page (`/stores/:id`).
5. Read and submit application reviews (`/reviews`).

### Buyer

1. Register or login — add or select the **Buyer** role.
2. Top up wallet (`/buyer/wallet`).
3. Add a shipping address (`/buyer/addresses`).
4. Browse products and add to cart.
5. Review cart (`/buyer/cart`) — update quantities or remove items.
6. Proceed to checkout — select address, delivery method, apply voucher/promo.
7. View orders (`/buyer/orders`) and order detail with status timeline.
8. View spending report (`/buyer/reports/spending`).

### Seller

1. Register or login — add or select the **Seller** role.
2. Create a store (`/seller/store`).
3. Create products with image upload (`/seller/products/new`).
4. View and manage products (`/seller/products`).
5. Process incoming orders (`/seller/orders`).
6. View income report (`/seller/reports/income`).

### Driver

1. Register or login — add or select the **Driver** role.
2. View available delivery jobs (`/driver/jobs`).
3. Take a job (becomes active).
4. Complete the delivery (`/driver/active`).
5. View earnings and history (`/driver/earnings`).

### Admin

1. Log in with a seeded Admin account (admin role cannot be registered — only seeded).
2. Monitor users, stores, products, orders, delivery jobs, discounts (`/dashboard/admin`).
3. Simulate next day (`/admin/system-time`).
4. Verify overdue orders and process refunds (`/admin/overdue-orders`).

## Useful Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing page | Public |
| `/products` | Product list | Public |
| `/products/:id` | Product detail | Public |
| `/stores/:id` | Store detail | Public |
| `/reviews` | Application reviews | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/role-selection` | Choose active role | Authenticated |
| `/profile` | User profile | Authenticated |
| `/buyer/wallet` | Wallet & top-up | Buyer |
| `/buyer/addresses` | Shipping addresses | Buyer |
| `/buyer/cart` | Shopping cart | Buyer |
| `/buyer/checkout` | Checkout | Buyer |
| `/buyer/orders` | Order history | Buyer |
| `/buyer/orders/:id` | Order detail | Buyer |
| `/buyer/reports/spending` | Spending report | Buyer |
| `/seller/store` | Manage store | Seller |
| `/seller/products` | My products | Seller |
| `/seller/products/new` | Create product | Seller |
| `/seller/products/:id/edit` | Edit product | Seller |
| `/seller/orders` | Incoming orders | Seller |
| `/seller/orders/:id` | Order detail | Seller |
| `/seller/reports/income` | Income report | Seller |
| `/driver/jobs` | Available jobs | Driver |
| `/driver/active` | Active job | Driver |
| `/driver/earnings` | Earnings & history | Driver |
| `/dashboard/admin` | Admin summary | Admin |
| `/admin/users` | User management | Admin |
| `/admin/stores` | Store management | Admin |
| `/admin/products` | Product management | Admin |
| `/admin/orders` | Order management | Admin |
| `/admin/orders/:id` | Order detail | Admin |
| `/admin/delivery-jobs` | Delivery jobs | Admin |
| `/admin/discounts` | Vouchers & promos | Admin |
| `/admin/overdue-orders` | Overdue refunds | Admin |
| `/admin/system-time` | Time simulation | Admin |

## Backend / API Docs

The backend is maintained in a separate repository. When the backend is running locally:

- **Swagger UI:** http://localhost:3000/api/docs
- **API base URL:** http://localhost:3000/api

Refer to `API_CONTRACT.md` in this repo for endpoint details, request/response shapes, and business rules.

## Troubleshooting

| Issue | Check |
|-------|-------|
| API requests fail in local dev | Backend is running? Vite proxy target matches backend port? `VITE_API_BASE_URL` is `/api`? |
| API requests fail in production | `VITE_API_BASE_URL` is set correctly? Backend `FRONTEND_URL` CORS matches frontend origin? Rebuilt after env change? |
| Page refresh returns 404 | Server not configured for SPA fallback — serve `index.html` for all routes. |
| Product images not loading | Backend Supabase storage configured? Check backend env (SUPABASE_URL, keys, bucket). |
| Build errors | `npm run build` passes with 0 errors on latest commit. Run `npm ci` to ensure clean dependencies. |
