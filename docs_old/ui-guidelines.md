# UI/UX Style Guide (Glassmorphism Edition)

This document outlines the "glass UI" design system for the invoice application. The goal is to create a modern, elegant, and cohesive user experience using transparency, blur, and a blue-toned color palette.

## 1. Core Aesthetic: Glassmorphism

The UI is built on the principle of "glassmorphism," which uses layered elements with background blur and transparency to create a sense of depth.

- **Background:** A subtle, non-distracting background is essential for the glass effect to be noticeable. We will use a soft gradient.
- **Blur:** The `backdrop-blur` utility is key. A value of `backdrop-blur-lg` will be standard for glass components.
- **Transparency:** Backgrounds will use an opacity between `10%` and `40%` (e.g., `bg-white/40`).
- **Borders:** A subtle, semi-transparent border (`border border-white/20`) is used to define the edges of glass components.

## 2. Color Palette

The palette is centered around a vibrant blue, with supporting neutrals.

Role          │ Usage / Description                                              │ Tailwind ... │ Hex... │
  ├───────────────┼──────────────────────────────────────────────────────────────────┼──────────────┼────────┤
  │ **Primary**   │ The main color for buttons, links, and active states. A deep,... │ `bg-indig... │ `#4... │
  │ **Primary ... │ A slightly darker shade for interactive feedback on primary e... │ `bg-indig... │ `#4... │
  │ **Glass BG**  │ The semi-transparent background for navigation and cards, cre... │ `bg-white... │ `#f... │
  │ **Surface**   │ The solid background for modals or dropdowns where clarity is... │ `bg-white`   │ `#f... │
  │ **Text Pri... │ For all major headings and primary text, ensuring high readab... │ `text-gra... │ `#1... │
  │ **Text Sec... │ For labels, descriptions, and less important text.               │ `text-gra... │ `#4... │
  │ **Border**    │ Subtle borders for cards and inputs to define edges without b... │ `border-g... │ `#e... │
  │ **Success**   │ For success messages, "paid" status, and positive feedback.      │ `bg-green... │ `#2... │
  │ **Warning**   │ For warnings, "pending" status, or actions that require atten... │ `bg-amber... │ `#f... │
  │ **Danger**    │ For error messages, "overdue" status, and destructive actions... │ `bg-red-600` │ `#d... │


### Dark Mode Color Palette

For dark mode, the palette shifts to deeper, more subdued tones, maintaining readability and a sleek appearance.

| Role              | Usage                               | Tailwind Class                | Hex Code    |
| ----------------- | ----------------------------------- | ----------------------------- | ----------- |
| **Primary Dark**  | Buttons, links, active states       | `bg-blue-700`                 | `#1d4ed8`   |
| **Primary Hover Dark** | Hover state for primary buttons     | `bg-blue-800`                 | `#1e40af`   |
| **Glass BG Dark** | Navbar, Sidebar, Card backgrounds   | `bg-gray-800/40 backdrop-blur-lg`| `#1f2937`   |
| **Text Primary Dark**| Headings, primary text              | `text-gray-100`               | `#f3f4f6`   |
| **Text Secondary Dark**| Subheadings, labels, secondary text | `text-gray-400`               | `#9ca3af`   |
| **Success Dark**  | Success messages, paid status       | `bg-green-700`                | `#047857`   |
| **Error Dark**    | Error messages, overdue status      | `bg-red-700`                  | `#b91c1c`   |

## 3. Component Library

### Navigation (Navbar & Sidebar)

- **Appearance:** Semi-transparent white background with a heavy backdrop blur.
- **Classes:** `bg-white/40 backdrop-blur-lg border-b border-white/20`
- **Active Item (Sidebar):** A solid, less transparent background to indicate the active state (`bg-white/60`).

### Cards

- **Appearance:** The standard "glass" effect.
- **Classes:** `bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg`
- **Padding:** `1.5rem` (`p-6`).

### Buttons

- **Primary Button:** Solid `blue-500` background, white text.
- **Secondary Button:** A "glass" button with a slightly more opaque background (`bg-white/50`).

## 4. Typography

The typography remains the same to ensure readability against the potentially complex background.

| Element         | Font Size         | Font Weight | Tailwind Class        |
| --------------- | ----------------- | ----------- | --------------------- |
| **Heading 1**   | `2.25rem` (36px)  | `bold`      | `text-4xl font-bold`  |
| **Heading 2**   | `1.875rem` (30px) | `bold`      | `text-3xl font-bold`  |
| **Body**        | `1rem` (16px)     | `normal`    | `text-base`           |

This guide will be the foundation for implementing the new glass UI, ensuring a stunning and consistent user experience.