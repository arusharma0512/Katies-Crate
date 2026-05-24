<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# Katie’s Crate (Primrose Schools)

Katie’s Crate is a classroom workflow and material planning platform designed for early education teachers and curriculum teams.

Built specifically around the workflow structure used in early childhood classrooms, the platform helps educators organize weekly lesson materials, generate printable classroom checklists, reduce repetitive prep work, and streamline curriculum planning.

---

## Features

- Dynamic classroom filtering
  - Preschool / Pre-K
  - Infants
  - Toddlers
  - EP1
  - EP2
  - Pathways

- Unit, week, day, and date planning
- Lesson-based material organization
- Automatic checklist generation
- Printable classroom checklists
- Export to PDF
- Ignore/remove duplicate materials
- Teacher-friendly responsive dashboard
- Clean minimal UI optimized for classroom workflows

---

## Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- Vite

### Libraries & Tools
- Lucide React
- jsPDF
- html2canvas

---

## Project Goals

Katie’s Crate was designed to reduce manual classroom preparation time by centralizing lesson material planning into a single streamlined workflow.

The platform focuses heavily on:
- usability
- minimal repetitive input
- fast classroom prep
- printable organization
- clean educator-focused UX

---

## Core Workflow

1. Select classroom type
2. Choose curriculum unit, week, day, and date
3. Paste lesson materials from curriculum platform
4. Automatically generate grouped classroom checklist
5. Print or export as PDF for classroom prep

---

## Product Design Focus

This project emphasizes:
- workflow automation
- UX/UI design
- real-world educational tooling
- productivity optimization
- component-driven frontend architecture

---

## Future Improvements

- Cloud sync & authentication
- Saved classroom templates
- Shared teacher collaboration
- Inventory tracking system
- AI-assisted material parsing
- Calendar integrations
- Drag-and-drop planning
- Admin dashboards

---

## Inspiration

This project was inspired by real classroom preparation workflows used in early education environments and designed to simplify weekly material organization for teachers.

---

## Status

Active development 
>>>>>>> 253216e1e9ba2fb9f6bc11d8d4aa7cef645aa9ce
