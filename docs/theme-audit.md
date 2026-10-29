# TECHNOVA STUDIO // THEME & INTRO AUDIT (PHASE 0)

**Date:** October 29, 2026  
**Branch:** `theme-update`  
**Engineer:** Senior Fullstack & Design Systems Engineer  

---

## 1. System Audit & Inventory

### A. Team Portal Themes
- **Current Locations**:
  - `lib/portal-theme.tsx`: defines `PortalTheme = 'dark-tech' | 'minimal-clean' | 'bold-gradient'`, persists to `technova_portal_theme`.
  - `components/team/DashboardShell.tsx`: theme switcher rendering 3 buttons (`TECH`, `CLEAN`, `BOLD`), plus mobile cycle button.
  - `app/globals.css`: token blocks for `[data-portal-theme="dark-tech"]`, `[data-portal-theme="minimal-clean"]`, `[data-portal-theme="bold-gradient"]`.
- **Target Changes**:
  - Keep `dark-tech` (exact current look).
  - Add `pro-dark` (ChatGPT/Claude/Gemini style charcoal `#171717` to `#212121`, off-white text, calm accent, subtle 1px borders, sans-serif typography, no glow/neon).
  - Add `pro-light` (Clean light mode, white/light warm-gray surfaces, calm accent, crisp neutral styling).
  - Remove `minimal-clean` and `bold-gradient` from the portal.
  - Safe migration for legacy localStorage values (`minimal` -> `pro-light`, `gradient` -> `pro-dark`, unknown -> `dark-tech`).

### B. Welcome / Intro Animation (`BootSequence.tsx`)
- **Current Location**: `components/entry/BootSequence.tsx`
- **Issue**: Intro is currently hardcoded with red hues (`border-red-500/50`, `shadow-[0_0_50px_rgba(220,38,38,0.25)]`, `bg-red-500`, `via-red-200 to-red-500`), whereas the main site default is Dark Tech green (`#00ff66` / `#00f0ff`).
- **Target Changes**:
  - Drive all intro colors from Dark Tech (green) tokens: OLED black background, neon green cybernetic eyes, cyan/green telemetry accents.
  - Remove all hardcoded red values.
  - Ensure the intro always renders Dark Tech green regardless of visitor's saved theme, then smoothly cross-fades into their active theme without flash or layout jump.
  - Retain timing, session storage (`sessionStorage.getItem('technova_booted')`), and `prefers-reduced-motion` compliance.

### C. Public Site Themes
- **Current Locations**:
  - `lib/theme.tsx`: defines `ThemeType = 'dark-tech' | 'minimal-clean' | 'bold-gradient' | 'neo-brutalism'`.
  - `components/theme/RadialThemeDial.tsx`: 4 quadrants with Neo-Brutalism at 270 degrees.
  - `components/theme/ThemeSelectorFallback.tsx`: compact and segmented buttons.
  - `components/navigation/CommandPalette.tsx`: `/theme brutalist` command.
  - `components/background/ThemeBackground.tsx`: Theme 4 with geometric sticker shapes and wobble animations.
  - `app/globals.css`: `[data-theme="neo-brutalism"]` and `@keyframes brutal-wobble-*`.
- **Target Changes**:
  - Replace `neo-brutalism` with `dark-pro`.
  - Remove all neo-brutalism styles, hard shadows, sticker shapes, and wobble keyframes.
  - Implement `dark-pro` design tokens (soft charcoal, subtle borders, off-white text, calm accent, sans-serif, clean UI).
  - Implement calm, low-opacity background for `dark-pro` in `ThemeBackground.tsx`.
  - Update Radial Dial to "Dark Pro" (watch segment, color swatch, keyboard navigation, aria labels).
  - Update Fallback Switcher & Command Palette (`/theme pro`).
  - Migration: legacy `"brutalist"` / `"neo-brutalism"` localStorage values safely map to CMS default or Dark Tech.

### D. Public CMS Theme Integration
- **Current Locations**:
  - `lib/cms-types.ts`: `ThemeType` union.
  - `components/team/cms/sections/ThemeDefaultEditor.tsx`: lists 4 themes.
  - `components/team/cms/modals/LivePreviewDrawer.tsx`: lists preview themes.
- **Target Changes**:
  - Update `ThemeType` in `lib/cms-types.ts` to include `'dark-pro'` and remove `'neo-brutalism'`.
  - Update `ThemeDefaultEditor.tsx` card to "DARK PROFESSIONAL" with charcoal palette swatch.
  - Update `LivePreviewDrawer.tsx` preview pill to "Dark Pro".
  - Code-level read fallback: if saved CMS default is `"neo-brutalism"` or `"brutalist"`, read as `'dark-tech'` safely without altering DB documents destructively.

---

## 2. Protected Features Checklist
All 9 protected features verified safe from visual-only theme updates:
1. Team Portal entry button in Navbar
2. Become an Architect submission modal
3. Robotic AI Agent launcher & chat interface
4. Direct WhatsApp/Call/Email channels
5. Schedule a Call integration
6. Book a Project modal
7. Live Website Showcase iframe
8. Command Palette system (Cmd+K)
9. Track Sprint client tracker modal
