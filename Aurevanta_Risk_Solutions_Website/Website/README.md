# Shieldora Risk Solutions – Commercial Property Insurance Broker Website

> **Tagline:** Protecting Your Property. Securing Your Future.  
> **Brand Name:** Shieldora Risk Solutions  
> **Specialty:** Commercial Property & Casualty Insurance Brokerage, Commercial Real Estate (CRE), Industrial Assets & Claims Advocacy.

---

## 🏢 Project Overview
**Shieldora Risk Solutions** is a responsive, multi-page corporate website template built for a premier commercial property insurance brokerage. It equips property owners, corporate asset managers, and enterprise CFOs with tools to audit commercial property risks, compare competing multi-carrier quotes, manage ongoing claims with progress tracking, and access certified policy documentation via a secure client portal.

---

## 📂 Project Location & Structure
**Local Workspace Path:** `c:\Users\Jeevitha\Downloads\Website`

```
c:\Users\Jeevitha\Downloads\Website\
├── index.html                  # Page 1: General Commercial Services Landing
├── home-2.html                 # Page 2: Niche Commercial Real Estate (CRE) & Industrial Landing
├── about.html                  # Page 3: About Us, Mission, History Timeline & Senior Leadership
├── services.html               # Page 4: Full Grid of 9 Commercial Insurance Services
├── service-details.html        # Page 5: Showcase - Commercial Property Insurance Deep-Dive & FAQ
├── blog.html                   # Page 6: Risk Insights Blog with Search & Category Filters
├── blog-details.html           # Page 7: Single Article Briefing with Table of Contents & Social Share
├── contact.html                # Page 8: Contact Page with Interactive Form, 24/7 Hotline & Map
├── pricing.html                # Page 9: Coverage Packages, Comparison Matrix & Add-ons
├── login.html                  # Page 10: Client Portal Login with 1-Click Demo Buttons
├── register.html               # Page 11: Corporate Account Registration with Strength Meter
├── dashboard-client.html       # Page 12: Client Portal Dashboard (Overview, Policies, Quotes, Claims, Docs)
├── dashboard-admin.html        # Page 13: Broker Admin Portal (Analytics, Quotes, Claims, CMS)
├── 404.html                    # Page 14: Custom 404 Error Page with Search
├── maintenance.html            # Page 15: Scheduled Maintenance & Coming Soon with Live Countdown
├── assets/
│   ├── css/
│   │   └── style.css           # Custom design system, typography, animations, RTL support
│   ├── js/
│   │   ├── main.js             # Theme toggle, RTL toggle, sticky nav, global quote modal, toasts, FAQs
│   │   ├── forms.js            # Contact submission, demo login/registration auth engine
│   │   ├── blog.js             # Live blog search, category filters, pagination
│   │   ├── dashboard-client.js # Client portal tabs, Chart.js graphs, quote comparison, doc preview
│   │   └── dashboard-admin.js  # Admin metrics, line/doughnut charts, quote/claim status management
│   ├── images/
│   │   └── logo.svg            # Custom SVG logo combining shield & skyscraper architecture
│   └── data/
│       └── sample-data.json    # Structured mock data for future backend integration
└── README.md                   # This project guide
```

---

## 🚀 How to Launch the Website Locally

You can launch and view this website using any standard web browser without compiling or installing heavy build tools:

### Option 1: Direct Browser Launch (Easiest)
1. Open Windows File Explorer and navigate to:
   `c:\Users\Jeevitha\Downloads\Website`
2. Double-click `index.html` to open it in your preferred browser (Chrome, Edge, Firefox, Brave).
3. All internal links, styling, modals, and demo authentication are fully functional directly off the filesystem!

### Option 2: Local HTTP Server (Python / Node.js)
If you prefer running a local development server:

#### Using Python (Built-in on Windows):
```powershell
cd c:\Users\Jeevitha\Downloads\Website
python -m http.server 8000
```
Then visit: `http://localhost:8000`

#### Using Node.js `npx serve`:
```powershell
cd c:\Users\Jeevitha\Downloads\Website
npx serve .
```

---

## 🌟 Key Features & Functionality

### 1. Dual Homepage Designs
- **Home Page 1 (`index.html`):** Broad commercial property and liability insurance landing featuring full-width hero, instant quote calculator widget, $4.8B+ trust counters, 6 core service cards, multi-carrier partner badges, and testimonials.
- **Home Page 2 (`home-2.html`):** High-value Commercial Real Estate (CRE) & industrial niche landing tailored to office towers, logistics warehouses, retail plazas, manufacturing plants, and multi-family communities. Includes an interactive COPE risk assessment matrix and case studies.

### 2. Light Mode & Dark Mode with Persistence
- Click the Moon/Sun icon in the header or top bar on any page.
- Automatically respects system preferences and persists the selection in `localStorage` (`shieldora_theme`).
- Automatically re-themes all Chart.js instances in the dashboards upon toggle!

### 3. Universal RTL (Right-to-Left) & LTR Layout Engine
- Click the **RTL** pill in the top announcement bar, header, or mobile navigation drawer across **all 15 pages**.
- Toggles the root element dynamically: `<html lang="ar" dir="rtl">` vs `<html lang="en" dir="ltr">`.
- Synchronized across page navigation via an immediate `<head>` initialization script and `localStorage` (`shieldora_dir`), preventing any layout flicker or shifts.
- Full logical property mirroring: automatically flips icon margins (`mr-*` &rarr; `margin-left`), form input padding, dropdown menus, mobile navigation drawers, and timeline stems.
- Directional icons (`fa-arrow-right`, `fa-chevron-right`, `fa-arrow-left`, etc.) rotate or flip horizontally via `scaleX(-1)`.
- Naturally LTR content (phone numbers like `1-800-555-RISK`, email addresses, policy numbers, and brand logos) is isolated with `direction: ltr; unicode-bidi: isolate;` to prevent text reversal.
- Mobile and desktop dashboard sidebars open and close properly in both LTR and RTL orientations.

### 4. Interactive Client Portal (`dashboard-client.html`)
- **1-Click Demo Login (`login.html`):** Click "Demo Client Login" to auto-fill credentials and immediately enter the portal.
- **Overview Tab:** Summary metrics, Chart.js portfolio allocation doughnut, monthly premium vs claims recovery bar chart, and recent activity logs.
- **My Policies:** Interactive schedule of covered properties (Midtown Tower, Oakridge Logistics Hub, Memorial Galleria) with policy limits, status badges, and sample document viewers.
- **Compare Quotes:** Interactive side-by-side carrier comparison (Chubb vs Travelers vs AIG) with a toggle to highlight differences and an instant "Bind Policy" action.
- **Claims Management:** Interactive multi-step timeline (FNOL &rarr; Triage &rarr; Adjuster Review &rarr; Proof &rarr; Funds Disbursed) plus a working "File a New Claim" modal.
- **Policy Documents:** Certified ACORD 25 Certificate of Insurance (COI) and binder previewer with sample modal display and simulated PDF download.

### 5. Broker Administrative Dashboard (`dashboard-admin.html`)
- **1-Click Admin Access (`login.html`):** Click "Demo Broker Admin" to log in as Managing Principal Marcus Sterling.
- **Analytics:** Line chart tracking quote volume vs bound policies, and doughnut chart of claims adjudication by peril.
- **Quotes Management:** Live search, filter, and dropdown status updater (New, Under Review, Quote Sent, Bound).
- **Claims Adjudication:** Assign adjusters and approve settlements with real-time toast feedback.
- **Inbound Inquiries Desk:** Dynamically displays messages submitted via the Contact Us page, with a "View & Reply" action.
- **CMS Management:** Draft article publisher simulation.

### 6. Interactive Risk Insights Blog (`blog.html` & `blog-details.html`)
- Search bar with instant real-time keyword filtering.
- Category pills (All, Property Insurance, Risk Management, Claims, Business Protection, Industry Insights).
- "Load More" pagination state.
- Single article reading experience with sticky table of contents, callouts, author bio, and social share links.

### 7. Global Quote Request Modal
- Accessible across all public pages via "Get a Free Quote" or "Request Quote" buttons.
- Records quote requests to browser `localStorage` for continuity into the administrative portal.

---

## 🎨 Color Palette & Design System
- **Midnight Navy:** `#0A192F` / `#060D17` (Deep corporate foundation)
- **Amber Gold:** `#D97706` / `#F59E0B` (Prestige and security accent)
- **Steel / Slate:** `#64748B` / `#334155` / `#F8FAFC`
- **Typography:** Plus Jakarta Sans & Inter
- **Icons:** Font Awesome 6 Pro-grade icons

---

## 🛡️ Demonstrative Notice
This website is a front-end brokerage interface designed for professional demonstration. All pricing tables and quote benchmarks are clearly disclaimed as illustrative estimates and do not represent binding insurance policies.
