# Commercial Property Insurance Broker Website
**Brand:** Aurevanta Risk Solutions  
**Tech Stack:** HTML5, CSS3, Bootstrap 5.3, Bootstrap Icons, Vanilla JavaScript

---

## 📁 Project Directory Structure

```text
commercial-property-insurance/
│
├── index.html                   # Working Home Page (landing page & quote calculator)
├── README.md                    # Project documentation, structure guide & roadmap
│
└── assets/                      # Static assets folder
    ├── css/
    │   └── style.css            # Custom CSS styles, design tokens & responsive overrides
    │
    ├── js/
    │   └── main.js              # Custom JavaScript for interactivity, calculator & UI
    │
    └── images/                  # Graphics and brand assets
        ├── logo.svg             # Commercial property broker vector brand logo
        ├── hero-bg.jpg          # Full-width commercial real estate hero background photo
        ├── why-choose-us.jpg    # Boardroom advisory meeting photo for Why Choose Us
        ├── business-protection.jpg # Illuminated commercial tower for Business Protection section
        └── hero-illustration.svg # Vector graphic badge / skyline illustration
```

---

## 📄 File-by-File Breakdown & Purpose

| File / Folder | Role & Explanation |
| :--- | :--- |
| **`index.html`** | **The Main Home Page.** Semantic HTML5 document with 8 core visual sections: Hero banner, Statistics strip, 6 Services cards, Why Choose Us (2-column), Business Protection (Dark Navy), Interactive Calculator, Demo Testimonials, FAQ accordion, CTA banner, and Footer. |
| **`assets/css/style.css`** | **Custom Stylesheet.** Corporate identity variables: Deep Navy (`#101D35`), Royal Blue (`#244C82`), Warm Gold (`#D6AD60`), Soft Blue-Grey (`#F2F5FA`), and White (`#FFFFFF`). Modern card hover lifts, button styles, responsive spacing. |
| **`assets/js/main.js`** | **Frontend Logic & Interactivity.** Controls dynamic client-side features without needing a backend: sticky header transition on scroll, interactive real-time quote premium calculation based on selected property type and value, form submission feedback, smooth scroll back-to-top button, and dynamic copyright year. |
| **`assets/images/hero-bg.jpg`** | **Hero Background Image.** High-resolution panoramic photograph of modern commercial high-rise towers. |
| **`assets/images/why-choose-us.jpg`** | **Why Choose Us Photo.** High-resolution photograph of corporate risk advisors in a high-rise boardroom. |
| **`assets/images/business-protection.jpg`** | **Business Protection Photo.** High-resolution evening photograph of an illuminated commercial enterprise tower. |
| **`assets/images/logo.svg`** | **Vector Brand Logo.** Scalable corporate SVG logo featuring the gold & navy shield with building silhouette. |
| **`README.md`** | **Developer Documentation.** Project guide for team members, detailing file organization, features, and the upcoming page roadmap. |

---

## 🚀 How to Run and Preview the Website

You do **not** need a backend or database to view this project:

### Option 1: Direct Browser Opening (Easiest)
1. Open the project folder: `c:\Users\Jeevitha\Downloads\commercial-property-insurance`
2. Double-click **`index.html`** or right-click `index.html` &rarr; **Open with** &rarr; **Google Chrome** / **Microsoft Edge** / **Firefox**.

### Option 2: VS Code Live Server (Recommended for Live Office Development)
1. Open the folder in **VS Code**.
2. Install the **Live Server** extension (by *Ritwick Dey*).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The page will open automatically at `http://127.0.0.1:5500/index.html` with instant live-reload on file edits.

### Option 3: Python Built-In Local Server
In PowerShell / Command Prompt inside this folder, run:
```powershell
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

---

## 🗺️ Roadmap for Future Pages

When you are ready to expand the website, here is where each upcoming page will reside:

1. **`about.html`** — Company history, leadership brokers, mission, carrier network.
2. **`services.html`** — Complete catalog of commercial coverage lines.
3. **`service-details.html`** — Deep-dive into specific policies (e.g. Business Interruption, Flood/CAT, High-Bay Warehousing).
4. **`pricing.html`** — Pricing tiers, deductible options, underwriting factors.
5. **`blog.html`** & **`blog-details.html`** — Commercial real estate risk management articles and news.
6. **`contact.html`** — Office locations, inquiry form, Google Maps embed, claims hotline.
7. **`login.html`** & **`register.html`** — Client & broker portal authentication screens.
8. **`dashboard-client.html`** — Client portal showing active policies, certificates of insurance (COIs), and open claims.
9. **`dashboard-admin.html`** — Broker / admin portal managing quote tenders, policies, and leads.
10. **`404.html`** — Branded error page for broken links.
11. **`maintenance.html`** — Maintenance / Coming Soon notice with contact information.

---

## 💡 Best Practices Used in this Project
- **Semantic HTML5:** Using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` for SEO and accessibility.
- **Bootstrap 5.3 CDN:** Zero npm build configuration needed to get started; loads quickly from reliable CDNs.
- **Responsive-First:** Fully responsive layout tested for mobile smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **Performance:** Lightweight SVGs for crystal-sharp logos and graphics on high-DPI retina screens without bulky external image dependencies.
