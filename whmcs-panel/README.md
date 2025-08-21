# WHMCS Client Panel (React)

React client-only panel that integrates directly with the WHMCS API. No custom backend required.

## Features
- Login via `ValidateLogin`, Register via `AddClient`, Forgot/OTP via `SendEmail`
- Dashboard: client details, services, invoices, domains, support tickets
- Products listing `GetProducts`, order flow `AddOrder` with domain WHOIS, invoice redirect
- Payments via invoice redirect (`CreateInvoice` or created via `AddOrder`) and status via `GetInvoices`
- Profile management via `GetClientsDetails` / `UpdateClient`
- Responsive UI with Tailwind + DaisyUI. Client-side routing

## Setup
1. Clone and install
```bash
npm install
```
2. Configure environment
Create `.env` using `.env.example` and set:
- `VITE_WHMCS_BASE_URL` (e.g. `https://billing.example.com`)
- Optional API credentials: `VITE_WHMCS_API_IDENTIFIER`, `VITE_WHMCS_API_SECRET`
- Optional `VITE_WHMCS_ACCESS_KEY`

3. Enable CORS on your WHMCS install for development, allowing the dev origin.

4. Run
```bash
npm run dev
```

## Security Notes
- This app makes requests directly from the browser to WHMCS. Only use API endpoints that are safe client-side.
- Prefer using an `accesskey` and least-privilege API roles. Avoid exposing high-privilege credentials.
- Ensure HTTPS and proper CORS restrictions.

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – typecheck and build
- `npm run preview` – preview production build

## Customization
- Theme switching via DaisyUI. Edit `Navbar.tsx` for theme options.
- Add localization or extra pages as needed.
