# Sofiyan Shaikh — Portfolio

My personal portfolio site. I am a B.Tech Computer Science (AI & ML) Hons. student
specializing in Generative AI with IBM, and this is where I keep what I have actually
built.

**Live site:** <https://sofiyan-shaikh.vercel.app>

## What's in it

One long scroll. A WebGL "cosmos" of particles sits behind the page: you start
in front of a dust portal with a mint star at its centre, fly through it, watch
the star turn while the words that describe how I work drift past, meet the
three projects one by one, and end in a starfield with my email.

Everything visible lives in fixed layers driven by scroll progress
(`src/components/experience`); the page itself is mostly spacers that give each
act its length (`src/app/page.tsx`).

## Built with

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Particles | Three.js + React Three Fiber, custom GLSL point shaders (`src/shaders`) |
| Motion | GSAP ScrollTrigger, Lenis smooth scroll |
| Type | Manrope, Instrument Serif |
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

## Deploying

The site is a standard Next.js app and deploys to Vercel with no configuration:

The site is deployed on Vercel and redeploys automatically on every push to
`main`. Vercel detects its own production URL, so Open Graph link previews work
without configuration. If you add a custom domain, set `NEXT_PUBLIC_SITE_URL`
to it in the project's environment variables (see `.env.example`).

## Project layout

```
src/
├── app/                  # App Router entry, layout, global styles, OG image
├── components/
│   ├── experience/       # Cosmos canvas, loader, nav, hero, constellation,
│   │                     # project stage, contact, cursor, scroll script
│   └── providers/        # Smooth scroll provider
├── data/
│   ├── projects.ts       # The three project cards
│   └── constellation.ts  # Words and tool logos that orbit the star
├── lib/                  # GSAP registration, scroll state, Lenis helper
└── shaders/              # GLSL for the particle points
```

## Contact

- Email: sofiyandev56@gmail.com
- LinkedIn: <https://www.linkedin.com/in/sofiyan-shaikh-838328404/>
- GitHub: <https://github.com/sofiyandev56-spec>
