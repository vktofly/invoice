# Invoice App UI/UX Design System

This document outlines the comprehensive design system for our invoice application, focusing on creating an intuitive, accessible, and professional experience optimized for financial workflows.

## 1. Design Philosophy

### Customer-Centric Principles
- **Clarity First**: Clear visual hierarchy and readable typography, especially for financial data
- **Efficiency**: Streamlined workflows with minimal clicks for common tasks
- **Consistency**: Predictable patterns across the application
- **Accessibility**: WCAG 2.1 AA compliance with enhanced focus on financial data readability
- **Trust**: Professional appearance that builds confidence in financial transactions
- **Speed**: Fast interactions with immediate feedback for all user actions

### Modern UI Enhancements

To create a contemporary and engaging user experience while maintaining professionalism and clarity, we are adopting a hybrid UI approach. This combines subtle, modern effects with our core design principles.

#### A. Glassmorphism-Lite

- **Principle**: Use frosted-glass effects sparingly on transient or layered surfaces to provide depth and context without distracting from the main content.
- **Application**:
  - **Sidebar**: The main navigation sidebar uses a `backdrop-blur-xl` effect with a semi-transparent background (`bg-white/20` in light mode, `dark:bg-gray-800/20` in dark mode) to create a subtle separation from the content behind it.
  - **Modals & Popovers**: These elements should also adopt a similar blurred background to maintain focus on the modal's content while hinting at the underlying page context.
- **Key Properties**:
  - `backdrop-blur-xl`
  - `background-opacity` between 10-25%
  - A subtle border (`border-white/10` or `dark:border-gray-700/50`) to define edges.

#### B. 2.5D Interactive Effects

- **Principle**: Add a sense of depth and tactility to interactive elements on hover and focus states. This provides satisfying feedback to user actions.
- **Application**:
  - **Dashboard Cards**: All dashboard cards should lift and gain a more prominent shadow on hover to indicate they are interactive.
  - **Primary Buttons**: Buttons can have a subtle lift or change in shadow to provide feedback.
- **Key Properties**:
  - `transition-all duration-300 ease-in-out`
  - `hover:shadow-lg`
  - `hover:-translate-y-1`

This hybrid approach ensures the application feels modern and responsive while prioritizing the clarity and accessibility required for a financial tool.

## 2. Color System

### Primary Colors
| Role | Usage | Light Mode | Dark Mode |
|------|-------|------------|-----------|
| Primary | Main brand color, primary buttons | `#2563eb` | `#3b82f6` |
| Primary Hover | Interactive states | `#1d4ed8` | `#2563eb` |
| Primary Text | On primary color | `#ffffff` | `#ffffff` |

### Invoice Status Colors
| Status | Light Mode | Dark Mode | Usage |
|--------|------------|-----------|-------|
| Paid | `#10b981` | `#34d399` | Completed payments |
| Pending | `#f59e0b` | `#fbbf24` | Awaiting payment |
| Overdue | `#ef4444` | `#f87171` | Past due invoices |
| Draft | `#6b7280` | `#9ca3af` | Unsent invoices |
| Cancelled | `#64748b` | `#94a3b8` | Cancelled invoices |

### Semantic Colors
| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Success | `#10b981` | `#34d399` |
| Warning | `#f59e0b` | `#fbbf24` |
| Error | `#ef4444` | `#f87171` |
| Info | `#3b82f6` | `#60a5fa` |

### Neutral Colors
| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Background | `#ffffff` | `#0f172a` |
| Surface | `#f8fafc` | `#1e293b` |
| Surface Elevated | `#ffffff` | `#334155` |
| Border | `#e2e8f0` | `#334155` |
| Border Subtle | `#f1f5f9` | `#1e293b` |
| Text Primary | `#0f172a` | `#f1f5f9` |
| Text Secondary | `#64748b` | `#94a3b8` |
| Text Muted | `#94a3b8` | `#64748b` |

### Data Table Colors
| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Table Header | `#f8fafc` | `#1e293b` |
| Table Border | `#e2e8f0` | `#334155` |
| Row Hover | `#f1f5f9` | `#334155` |
| Row Selected | `#dbeafe` | `#1e40af` |

## 3. Typography

### Font Family
- **Primary Font**: 'Inter', -apple-system, system-ui, sans-serif
- **Mono Font**: 'Roboto Mono', 'SF Mono', monospace (for financial amounts and codes)

### Type Scale
| Element | Mobile | Desktop | Weight | Line Height | Usage |
|---------|--------|---------|--------|-------------|-------|
| H1 | 2rem | 2.5rem | 700 | 1.2 | Page titles |
| H2 | 1.75rem | 2rem | 700 | 1.25 | Section headers |
| H3 | 1.5rem | 1.75rem | 600 | 1.3 | Subsection headers |
| H4 | 1.25rem | 1.5rem | 600 | 1.4 | Card titles |
| Body | 1rem | 1rem | 400 | 1.5 | Regular text |
| Body Large | 1.125rem | 1.125rem | 400 | 1.5 | Important descriptions |
| Small | 0.875rem | 0.875rem | 400 | 1.5 | Labels, captions |
| Button | 1rem | 1rem | 500 | 1.5 | Button text |
| Financial | 1rem | 1rem | 500 | 1.5 | Money amounts |

### Financial Typography
```css
.financial-amount {
  font-family: 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  text-align: right;
}

.currency-symbol {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  margin-right: 2px;
}
```

## 4. Spacing System

### Base Unit: 4px
| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Small gaps, tight spacing |
| sm | 8px | Between related elements |
| md | 16px | Between sections |
| lg | 24px | Major sections |
| xl | 32px | Large separations |
| 2xl | 48px | Page sections |
| 3xl | 64px | Major page divisions |

## 5. Layout Architecture

### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────┐
│ [Header Bar - 64px height]                 │
├─────────────┬───────────────────────────────┤
│ Sidebar     │ Main Content Area             │
│ 280px       │ max-width: 1440px             │
│ fixed       │ padding: 24px                 │
│             │                               │
└─────────────┴───────────────────────────────┘
```

### Mobile Layout (<768px)
```
┌─────────────────────────────────────────────┐
│ [Header Bar with Menu Toggle - 64px]       │
├─────────────────────────────────────────────┤
│ Main Content Area                           │
│ full-width                                  │
│ padding: 16px                               │
│                                             │
│                        [FAB - Quick Add] ●  │
└─────────────────────────────────────────────┘
```

## 6. Component Library

### Navigation

#### Sidebar

##### Sidebar Navigation Link

- **Font Family**: Primary Sans-Serif Font (`font-sans`)
- **Default State**:
  - `color`: `var(--color-text-secondary)`
  - `font-weight`: `400` (normal)
- **Hover State**:
  - `background`: `rgba(0, 0, 0, 0.05)` (light) / `rgba(255, 255, 255, 0.05)` (dark)
  - `color`: `var(--color-text-primary)`
- **Active State**:
  - `background`: `var(--color-primary)`
  - `color`: `var(--color-primary-text)`
  - `font-weight`: `600` (semibold)
  - `box-shadow`: `0 2px 8px rgba(37, 99, 235, 0.2)`

```css
.sidebar {
  width: 280px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: 24px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: var(--color-text-secondary);
  transition: all 150ms ease;
}

.sidebar-item.active {
  background: var(--color-primary);
  color: white;
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}
```

#### Header Bar
```css
.header {
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
```

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-secondary:hover {
  background: var(--color-surface);
  border-color: var(--color-primary);
}
```

#### Floating Action Button (Mobile)
```css
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 200ms ease;
}
```

### Cards

#### Standard Card
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

#### Metric Card
```css
.metric-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: 'Roboto Mono', monospace;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
```

### Data Tables

#### Table Structure
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-header {
  background: var(--color-table-header);
  border-bottom: 1px solid var(--color-table-border);
}

.table-header th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-row {
  border-bottom: 1px solid var(--color-table-border);
  transition: background-color 150ms ease;
}

.table-row:hover {
  background: var(--color-row-hover);
}

.table-cell {
  padding: 16px;
  color: var(--color-text-primary);
}

.table-cell.financial {
  font-family: 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
```

#### Responsive Table
```css
@media (max-width: 768px) {
  .table-responsive {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .table-hide-mobile {
    display: none;
  }
}
```

### Forms

#### Input Fields
```css
.form-input {
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 150ms ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### Money Input
```css
.money-input {
  text-align: right;
  font-family: 'Roboto Mono', monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.money-input-wrapper {
  position: relative;
}

.currency-prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-weight: 400;
}
```

#### Form Labels
```css
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-label.required::after {
  content: " *";
  color: var(--color-error);
}
```

### Status Badges

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-paid {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.status-pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-overdue {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-draft {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}
```

### PDF Preview Pane

```css
.pdf-preview-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  height: calc(100vh - 120px);
}

.pdf-preview {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  overflow-y: auto;
}

.pdf-actions {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1024px) {
  .pdf-preview-container {
    grid-template-columns: 1fr;
  }
  
  .pdf-actions {
    position: fixed;
    bottom: 24px;
    right: 24px;
    flex-direction: row;
  }
}
```

## 7. Motion & Interaction

### Transitions
- **Default**: 150ms ease-out
- **Hover**: 200ms ease
- **Active**: 100ms ease-in
- **Page Transitions**: 300ms ease-in-out

### Micro-interactions
```css
.interactive-element {
  transition: all 150ms ease-out;
}

.interactive-element:hover {
  transform: translateY(-1px);
}

.interactive-element:active {
  transform: translateY(0);
  transition-duration: 100ms;
}

.button-press {
  transform: scale(0.98);
}
```

### Loading States
```css
.skeleton {
  background: linear-gradient(90deg, 
    var(--color-border) 25%, 
    var(--color-surface) 50%, 
    var(--color-border) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 8. Accessibility

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18pt+ or 14pt bold)
- Enhanced contrast for financial data (minimum 7:1)

### Keyboard Navigation
```css
.focusable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```html
<!-- Example: Invoice status with screen reader text -->
<span class="status-badge status-paid">
  Paid
  <span class="sr-only">Invoice has been paid in full</span>
</span>
```

## 9. Responsive Guidelines

### Breakpoints
- **xs**: 475px (Small mobile)
- **sm**: 640px (Mobile)
- **md**: 768px (Tablet)
- **lg**: 1024px (Laptop)
- **xl**: 1280px (Desktop)
- **2xl**: 1536px (Large Desktop)

### Mobile-First Approach
```css
/* Mobile first */
.container {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1440px;
    margin: 0 auto;
  }
}
```

## 10. Dark Mode

### Implementation
```css
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-text-primary: #0f172a;
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-surface: #1e293b;
  --color-text-primary: #f1f5f9;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 150ms ease;
}
```

## 11. Performance Guidelines

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for non-critical images
- Provide proper aspect ratios to prevent layout shifts

### Loading Performance
- Implement skeleton screens for data loading
- Use progressive enhancement
- Minimize layout shifts (CLS < 0.1)

## 12. Invoice-Specific Patterns

### Invoice Form Layout
```css
.invoice-form {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.invoice-details {
  display: grid;
  gap: 24px;
}

.line-items-table {
  margin: 24px 0;
}

.invoice-totals {
  background: var(--color-surface-elevated);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
```

### Quick Actions
```css
.quick-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.quick-action-card {
  flex: 1;
  padding: 20px;
  text-align: center;
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}

.quick-action-card:hover {
  border-color: var(--color-primary);
  background: rgba(37, 99, 235, 0.05);
}
```

## 13. Best Practices

### Do's
- Use consistent spacing and alignment
- Maintain clear visual hierarchy
- Optimize for performance and accessibility
- Test across devices and screen sizes
- Implement proper error states and loading indicators
- Use semantic HTML elements
- Provide clear feedback for user actions

### Don'ts
- Don't use pure black text (#000000)
- Avoid low contrast text combinations
- Don't rely solely on color for information
- Avoid excessive animations that distract from work
- Don't ignore keyboard navigation
- Avoid breaking responsive layouts
- Don't sacrifice accessibility for aesthetics

This enhanced design system provides a solid foundation for building a modern, professional, and user-friendly invoice application that meets the needs of business users while maintaining high standards of accessibility and performance.

---

## 14. World-Class Experience Enhancements

The following roadmap items layer on top of the core design system to deliver a best-in-class user experience. Treat them as modular epics you can implement incrementally.

| # | Epic | Key Features |
|---|------|--------------|
| 1 | Personalised, Insight-Driven Dashboard | • Drag-to-reorder metric/cards (persist order)  <br>• Smart insight chips (e.g., "5 invoices overdue soon – Send reminders?")  <br>• Date-range toggles with count-up animation |
| 2 | Global Command Menu (⌘ K / Ctrl K) | • Fuzzy search across actions, clients, invoices  <br>• Arrow → to open sub-actions  <br>• 2.5D hover states |
| 3 | Assisted Invoice Creation Flow | • Stepper with auto-save  <br>• Inline client quick-add  <br>• Real-time totals & micro-animations  <br>• "Smart Line Item" parser |
| 4 | Data-Table Power Features | • Density toggle  <br>• Column picker  <br>• Sticky bulk-action bar with total amount  <br>• Shimmer skeleton rows |
| 5 | Contextual Empty States | • Illustration + CTA when no data  <br>• Sample-data toggle for first-time users |
| 6 | Toast & Undo Pattern | • Non-blocking toasts (bottom-right / top mobile)  <br>• Single-tap "Undo" for destructive ops |
| 7 | Delightful Micro-Interactions | • Sub-0.2 s Lottie success loops  <br>• Soft haptic/sound feedback on mobile |
| 8 | Advanced Accessibility & Theming | • Light / Dark / High-Contrast themes  <br>• Dyslexia-friendly font toggle  <br>• Enhanced focus outlines |
| 9 | Performance Optimisations | • Virtualised lists (react-window)  <br>• Service-worker offline cache  <br>• Route prefetch on hover |
|10 | Mobile-First Enhancements | • Contextual FABs  <br>• Bottom-sheet modals & swipe gestures |
|11 | Trust & Compliance Touches | • Subtle security badge footer  <br>• Per-entity audit log  <br>• Live status pill with pulse animation |
|12 | Gamified Progressive Onboarding | • 3-step checklist with progress ring  <br>• Confetti burst <600 ms on completion |

> **Prioritisation Tip:** Focus on Epics 1-3 first for maximum perceived value, then iterate based on user feedback and performance budgets (<100 ms event-to-paint on key interactions).

### Additional Feature Epics (Not Yet Covered)

| # | Epic | Key Features |
|---|------|--------------|
| 13 | Real-Time Collaboration | • Presence cursors & avatars <br>• Threaded line-item comments <br>• Live conflict resolution indicators |
| 14 | Smart Data Entry 2.0 | • Frequent-item autocomplete <br>• Mobile OCR “Scan Receipt” to line items <br>• Inline currency/tax chips with real-time calc |
| 15 | Timeline & Audit Trail | • Immutable event log per invoice <br>• Filter by type/status <br>• Export/share as PDF |
| 16 | Live Chat & Support Widget | • Contextual “?” floating button <br>• Blurred chat panel <br>• Bot suggestions before human hand-off |
| 17 | Adaptive Edge-to-Edge Mobile Layout | • Collapsible header on scroll <br>• Bottom-sheet quick actions & swipe gestures <br>• Maintains 60 FPS performance budget |