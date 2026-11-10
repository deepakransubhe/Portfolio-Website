# Portfolio Clone (allanleone.com replica)

A pure replica of the interactive animations, shaders, glassmorphic HUD dock, and presentation architecture of **allanleone.com** — completely decoupled from any personal confidential data so you can easily put your own content.

## Features Replicated

1. **Procedural WebGL / Three.js Shaders**:
   - Animated voronoi noise, dynamic accent glows, interactive lighting, and vignette effects.
2. **Interactive Glass Dock (`PageDock`)**:
   - Morphing bottom navigation dock (`load` → `clear` → `shape` → `drop` → `live`).
   - Backdrop filter blur, specular border effects, and active state indicators.
3. **Showcase Carousel (`WorkView`)**:
   - Fullscreen presentation with accent gradients, smooth GSAP transitions.
   - Keyboard arrows (`←` / `→`), touch swipe gesture support, and dot controls.
4. **Interactive Career Timeline (`AboutView` / Experience)**:
   - Dynamic flip year typography.
   - Interactive timeline ruler with major/minor tick marks and progress playhead (`xp-lit` / `xp-head-mark`).
5. **Contact Board (`ContactView`)**:
   - Multi-slab glass cards with corner handle accents.
   - Full working Dark / Light theme toggle.
   - Social links and direct email / resume actions.
6. **Smooth Scrolling**:
   - Integrated Lenis smooth scroll engine.

---

## Quick Start

### 1. Run Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 2. Build for Production
```bash
npm run build
```

## GitHub Pages

Push to the `main` branch to build and deploy the site with GitHub Actions. For the public `Portfolio-Website` repository, the published site will be available at:

`https://deepakransubhe.github.io/Portfolio-Website/`

---

## How to Customize Your Content

All content is cleanly organized in **one single file**:
📂 [`src/data/content.js`](./src/data/content.js)

- **`person`**: Your name, role, email, and location.
- **`caseStudies`**: Your projects (title, description, tags, accent colors, preview images).
- **`timeline`**: Your career milestones, companies, roles, and highlights.
- **`socials`**: Your LinkedIn, GitHub, X (Twitter), and Dribbble links.
- **`background`**: Your languages and certifications.

---

## Project Structure

```
portfolio-clone/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── casestudy/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── content.js          <-- ALL YOUR CONTENT GOES HERE
    ├── styles/
    │   ├── global.css
    │   └── app.css
    └── components/
        ├── BootLoader.jsx       (Intro spinner & sequence)
        ├── HudFrame.jsx         (Top header brand link)
        ├── PageDock.jsx         (Morphing bottom navigation dock)
        ├── ShaderBackdrop.jsx   (Three.js GLSL voronoi shader canvas)
        ├── WorkView.jsx         (Case study carousel)
        ├── AboutView.jsx        (Timeline ruler & experience)
        └── ContactView.jsx      (Contact board & theme switch)
```
