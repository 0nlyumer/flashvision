# UI/UX Pro Max Design Intelligence Enforcement

Whenever designing, styling, building, reviewing, or modifying any interface, page, or component in FlashVision ERP:

1. **Mandatory UI/UX Pro Max Consultation:**
   - Always activate and apply the `ui-ux-pro-max` skill (located in `.agents/skills/ui-ux-pro-max/` and global customizations).
   - Use the design intelligence search tool (`python .agents/skills/ui-ux-pro-max/scripts/search.py --domain <domain>` or `--design-system`) to select verified color palettes, typography, layout rules, and component interactions.

2. **Visual Excellence & Anti-Pattern Prevention:**
   - **Never use generic or flat AI designs:** No plain gray-on-white boxes, generic default borders, or unpolished tables.
   - **No emojis as UI icons:** Use professional SVGs / Material Symbols.
   - **Interactive states:** Every interactive element must have `cursor-pointer`, visible active/focus rings, and smooth micro-transitions (150ms-250ms).
   - **Color & Contrast:** Follow WCAG 2.1 AA standards (minimum 4.5:1 contrast for normal text, 3:1 for large text and UI components).
   - **Layout & Overflow:** Elements must auto-adjust and never clip outside the viewport or get hidden under navigation/sidebars.

3. **Pre-Delivery Verification Checklist:**
   - [ ] No emoji icons used for UI controls.
   - [ ] Accessible color contrast in both Light and Dark modes.
   - [ ] Visible focus and active states for keyboard and mouse navigation.
   - [ ] Fluid responsive handling across mobile (375px), tablet (768px), laptop (1024px), and desktop (1440px+).
   - [ ] Micro-interactions feel snappy and intuitive.
