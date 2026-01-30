# Personal Portfolio

This is my personal portfolio project, built to showcase my work, experiments, and ideas as a front‑end developer. The goal of this project is to be fast, visually engaging, and easy to maintain, while experimenting with modern web technologies.

## Tech Stack

* **Astro** – Static site generator
* **Vue.js** – UI components and interactivity
* **SCSS** – Styling
* **Lucide** – Icon library
* **Notion API** – Content management
* **Three.js** – 3D graphics and animations

## Project Structure

```text
/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, styles, and other assets
│   ├── components/  # Reusable UI components (Astro & Vue)
│   ├── layouts/     # Page layouts
│   ├── pages/       # Application pages
│   ├── styles/      # Global SCSS files
│   └── utils/       # Helpers and utilities
├── package.json
└── astro.config.mjs
```

## Getting Started

Clone the repository and install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

The site will be available at:

```
http://localhost:4321
```

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm install`       | Install project dependencies         |
| `npm run dev`       | Start local development server       |
| `npm run build`     | Build the site for production        |
| `npm run preview`   | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands               |

## Deployment

This project can be deployed on any static hosting platform (Vercel, Netlify, GitHub Pages, etc.). The production build is generated in the `dist/` folder.

## Notes

* This is a personal and evolving project.
* Some features and visuals may be experimental.
* Content managed via Notion may require environment variables for the API.

## Resources

* [Astro Documentation](https://docs.astro.build)
* [Vue.js Documentation](https://vuejs.org/)
* [Three.js Documentation](https://threejs.org/)
* [Notion API Documentation](https://developers.notion.com/)
