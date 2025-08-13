Below is a detailed plan outlining every change and new file required. This plan is organized by project areas (global setup, API endpoints, UI components, dashboards, and integrations) and lists the files to create or modify, along with error handling and best practices.

---

## Global Setup & Configuration

- **next.config.ts**  
  - Verify that environment variables (for mock payment API keys, JWT_SECRET, etc.) are available.  
  - Enable any required Next.js configurations (e.g. image domains if needed).

- **TailwindCSS Setup**  
  - If not present, create or update **tailwind.config.js** to include all content paths (e.g. `src/app/**/*.{ts,tsx}`) and set dark mode to class.  
  - In **src/app/globals.css**, add global styles that support dark mode toggling (transition effects, dark backgrounds, and text colors).

- **Environment Variables**  
  - Create an **.env.local** file (not committed) to store:  
    - STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY  
    - PAYPAL_CLIENT_ID, PAYPAL_SECRET  
    - JWT_SECRET, DB_CONNECTION_STRING  
  - Ensure all API endpoints and middleware reference these securely.

---

## UI Components & Global Layout

- **src/app/layout.tsx**  
  - Update the global layout to include a Header and Footer.  
  - Integrate a role-based layout: render a sidebar for admin/vendor dashboards and a simple header for all users.  
  - Include a global provider for authentication and dark mode (using a context or hook).

- **src/components/Header.tsx**  
  - Create a responsive header with navigation links for Home, Dashboard (based on role), Cart, etc.  
  - Integrate a text-based notifications dropdown (using **src/components/Notifications.tsx**) and a dark mode toggle (using **src/components/DarkModeToggle.tsx**).  
  - Use only typography and spacing (no external icons).

- **src/components/Footer.tsx**  
  - Create a simple, modern footer with navigation links and copyright.

- **src/components/DarkModeToggle.tsx**  
  - Build a toggle component that switches the dark mode class on the document root.  
  - Use Tailwind utility classes for smooth transitions and clear text labels.

- **src/components/Sidebar.tsx**  
  - Create a sidebar that displays different menu items based on user role (Admin: Users, Vendors, Orders, Categories, Moderation; Vendor: Dashboard, Products, Orders, Analytics, Store Info).  
  - Keep the layout modern and simple using spacing and typography.

- **src/components/Notifications.tsx**  
  - Develop a notifications component that polls (or uses simple simulated WebSocket logic) for new orders/messages.  
  - Handle error scenarios by displaying a text-based error message if fetching notifications fails.

- **src/hooks/useAuth.ts**  
  - Create a custom hook to manage authentication state.  
  - Implement login, logout, token persistence (via localStorage), and error handling.

- **src/lib/api.ts**  
  - Build a centralized API request helper (using the Fetch API) to standardize error handling and JSON parsing.  
  - Ensure all API calls manage timeout and network errors gracefully.

---

## API Endpoints (Using Next.js App Router)

All endpoints include try-catch blocks and return proper HTTP status codes with helpful error messages.

- **Auth Endpoints**  
  - **src/app/api/auth/register/route.ts**:  
    - POST: Validate request (role: vendor/customer); simulate DB insertion; generate a JWT on success.  
  - **src/app/api/auth/login/route.ts**:  
    - POST: Verify credentials, generate a JWT, and include error messaging for invalid logins.

- **Product Management**  
  - **src/app/api/products/route.ts**:  
    - GET: List products (with query parameters for pagination and filters).  
    - POST: For vendors to add products (validate user role from JWT).  
    - Include PUT and DELETE methods for updating and deleting products.

- **Order Management**  
  - **src/app/api/orders/route.ts**:  
    - GET: Return orders filtered by user role (admin, vendor, customer).  
    - POST: Create new order with error handling (simulate payment processing errors).  
    - PUT: Update order status with role-based access control.

- **Vendor Management**  
  - **src/app/api/vendors/route.ts**:  
    - GET: List vendors and allow searching by name.  
    - POST / PUT: For vendor profile creation or updates.

- **Wishlist & Recently Viewed**  
  - **src/app/api/wishlist/route.ts** and **src/app/api/recently-viewed/route.ts**:  
    - Provide GET, POST, (and DELETE where applicable) endpoints for managing customer wishlist and recently viewed products.

- **Payment Processing (Mock)**  
  - **src/app/api/payment/route.ts**:  
    - POST: Accept a payment gateway parameter ("stripe", "paypal", "mobile money") and simulate payment processing.  
    - Return mock success or error responses with clear messages.

- **Admin Endpoints**  
  - **src/app/api/admin/users/route.ts**:  
    - GET: List all users; PUT/DELETE: Update and remove users.  
  - **src/app/api/admin/vendors/route.ts**:  
    - GET: List pending vendor registrations; PUT: Approve/reject vendors.

- **Middleware**  
  - **src/lib/middleware.ts**:  
    - Create JWT verification middleware to secure routes by role.  
    - Handle missing/invalid tokens and return 401 or 403 errors.

- **Database Connection**  
  - **src/lib/db.ts**:  
    - Set up a connection placeholder to PostgreSQL/MongoDB.  
    - Implement a connection retry mechanism and error logging.

---

## Dashboard & Page Implementations

### Admin Dashboard

- **src/app/admin/dashboard.tsx**  
  - Overview metrics (users, vendors, orders, sales).  
  - Use responsive chart components (e.g., **src/components/ui/chart.tsx**) to display graphs.  
  - Include error boundaries for data fetching.

- **src/app/admin/users.tsx, vendors.tsx, orders.tsx, categories.tsx, moderation.tsx**  
  - Each page features tables (using **src/components/ui/table.tsx** or card layouts) with actions (approve/reject, ban, update).  
  - Ensure mobile responsiveness and clear filtering options.

### Vendor Dashboard

- **src/app/vendor/dashboard.tsx**  
  - Display sales summary, recent orders, and revenue charts.  
- **src/app/vendor/products.tsx**  
  - Allow full CRUD for products; include form validation (using components from **src/components/ui/form.tsx**).  
- **src/app/vendor/orders.tsx**  
  - List orders with update buttons and status indicators.  
- **src/app/vendor/analytics.tsx**  
  - Show detailed analytics with graphs and trends.  
- **src/app/vendor/store.tsx**  
  - Provide a form to update store profile details (store name, description, etc.); if a banner image is needed, use an `<img>` with:  
    - src="https://placehold.co/1200x400?text=Stylish+store+banner+with+clean+layout"  
    - alt="Stylish store banner with clean layout"  
    - onerror handler to maintain layout even if the image fails to load.

### Customer-Facing Pages

- **src/app/index.tsx (Landing/Home Page)**  
  - Present featured products, top categories, and search/filter options in a clean grid layout.  
  - Focus on typography and spacing; image usage only if essential.
- **src/app/products/[slug].tsx**  
  - Dynamic product detail page using SEO–friendly slug URLs; include product images, details, reviews, and a review submission form.  
  - Use meta tags and structured data for SEO.
- **src/app/vendor/[vendorId].tsx**  
  - Vendor profile with a list of products; incorporate a clean, grid-based layout.
- **src/app/cart.tsx**  
  - Display cart items, quantity controls, and a summary section with error handling for payment failures.  
- **src/app/checkout.tsx**  
  - Provide a secure checkout form for shipping details.  
  - Include payment gateway selection (radio buttons for "stripe", "paypal", "mobile money") which calls the payment API endpoint.  
  - Manage loading states and error messages.
- **src/app/orders.tsx**  
  - Allow customers to review past orders and track current ones in a responsive list view.

---

## Additional Considerations

- **Error Handling & Best Practices**  
  - All API endpoints must include try-catch blocks and return meaningful HTTP error codes.  
  - UI forms should validate inputs on the client and server sides and display error messages using components like **src/components/ui/alert.tsx**.
- **Security and Role-Based Access**  
  - Use the middleware from **src/lib/middleware.ts** on protected endpoints.  
  - Ensure the `useAuth` hook validates and stores JWT tokens securely.
- **Responsive & Modern UI**  
  - All components must be styled with TailwindCSS for consistent spacing, typography, and responsiveness.  
  - Avoid external image services for dashboards/forms; use placeholder images only if and when absolutely necessary.
- **REST API and Mobile Integration**  
  - The API endpoints are RESTful to support future mobile app integrations.  
  - Provide proper HTTP response codes which can be tested using curl commands.
- **Mock Payment Processing**  
  - Use a simple switch-case in the payment API to simulate outcomes for different gateways.  
  - Clearly comment where real API keys/integrations replace the mock implementations later.

---

## Summary

- Added global configuration changes in next.config.ts, TailwindCSS, and .env.local for secure key management.  
- Created new components (Header, Footer, Sidebar, DarkModeToggle, Notifications) and a useAuth hook for role-based layout and authentication.  
- Developed REST API endpoints for auth, products, orders, vendors, wishlist, payment, and admin actions with proper error handling.  
- Implemented separate dashboard pages for admin (users, vendors, orders, etc.) and vendors (product CRUD, analytics, store management), plus customer-facing pages (landing, product details, cart, checkout, orders).  
- Ensured modern, responsive UI styling with TailwindCSS and SEO-friendly techniques.  
- Mock payment processing is used, with clear placeholders for API integration.  
- All changes include proper error handling, security through middleware, and role-based access control.
