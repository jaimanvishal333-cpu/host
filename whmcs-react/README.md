## WHMCS Client Panel (React + Vite + TypeScript)

This is a client-only React app that integrates directly with the official WHMCS API (no custom backend). It provides:

- Authentication: Login (`ValidateLogin`), Register (`AddClient`), Forgot Password (via `SendEmail`), OTP simulation
- Dashboard: Profile (`GetClientsDetails`), Services (`GetClientsProducts`), Invoices (`GetInvoices`), Tickets (`GetSupportTickets`, `OpenTicket`), Domains (`GetClientsDomains`)
- Hosting Plans: `GetProducts`, order with `AddOrder`
- Payments: Redirect to WHMCS invoice URL (optionally use `CreateInvoice`) and status via `GetInvoices`
- Profile Management: `UpdateClient`
- Responsive UI with TailwindCSS, React Router, and toast notifications

### Setup

1. Copy `.env.example` to `.env` and set values:

```
VITE_WHMCS_API_URL=https://your-whmcs.example.com/includes/api.php
VITE_WHMCS_API_IDENTIFIER=your_api_identifier
VITE_WHMCS_API_SECRET=your_api_secret
VITE_WHMCS_CLIENT_AREA_BASE=https://your-whmcs.example.com
```

2. Ensure your WHMCS allows CORS for your dev origin. In production, serve from the same domain or configure CORS appropriately.

3. Install and run:

```
npm install
npm run dev
```

4. Build for production:

```
npm run build
```

### Notes

- All requests are sent from the browser using `identifier` and `secret`, which is acceptable for this exercise but risky for production. Consider OAuth or a server intermediary in real deployments.
- Configure email templates in WHMCS for forgot password/OTP if needed and update the template name in `src/pages/ForgotPassword.tsx`.
- Adjust currency for pricing display in `src/pages/Products.tsx` according to your WHMCS configuration.