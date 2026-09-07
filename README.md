# Sofiyan Shaikh — Portfolio

My personal portfolio site. I am a B.Tech Computer Science (AI & ML) Hons. student
specializing in Generative AI with IBM, and this is where I keep what I have actually
built.

**Live site:** _not deployed yet_

## What's in it

A single-page site with a hero built around a custom 3D model, an about section, the
four areas I study and build in, an expandable list of my projects, and a contact
form that hands off to your mail client.

## Built with

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| 3D | Three.js, React Three Fiber, Drei |
| Motion | Framer Motion, GSAP, Lenis smooth scroll |
| Styling | Tailwind CSS 4 |

## Running it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run lint    # eslint
npm run build   # production build
```

## Project layout

```
src/
├── app/                  # App Router entry, layout and global styles
├── components/
│   ├── 3d/               # Three.js scene
│   ├── sections/         # Hero, About, Services, Projects, Contact
│   └── providers/        # Smooth scroll provider
└── data/
    └── projects.ts       # Project content, kept out of the components
```

## Contact

- Email: sofiyandev56@gmail.com
- LinkedIn: <https://www.linkedin.com/in/sofiyan-shaikh-838328404/>
- GitHub: <https://github.com/sofiyandev56-spec>
