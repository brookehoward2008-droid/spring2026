# Sherwood: A Playbill

Coursework + portfolio piece for **Ken Ludwig&rsquo;s *Sherwood: The Adventures of Robin Hood***,
an Everett KIDSTAGE TeenSelect Production, May 21 to June 12, 2026 at Second Stage Theatre,
Everett, WA.

Two pages:

- `index.html` &middot; the semantic HTML playbill (the assignment deliverable).
  Self-contained styling, print-friendly, uses proper `<header>`, `<article>`, `<address>`,
  `<time>`, `<dl>`, `<cite>` and friends.
- `immersive.html` &middot; a parallax forest scene with a torch-cursor overlay and
  ambient Celtic score, featuring the same show information. For fun.

## Run it locally

Open `index.html` in a browser. For the immersive page, serve the folder so the
audio loads cleanly:

```bash
# Python 3
python -m http.server 8000
# or, Node
npx serve .
```

Then visit http://localhost:8000

## Project structure

```
sherwood-playbill/
  index.html          semantic playbill (assignment)
  immersive.html      parallax + torch-cursor scene
  css/style.css       theme for the immersive page
  js/torch.js         canvas torch cursor
  js/audio.js         ambient audio via Howler
  js/scene.js         gate, parallax, hotspots
  assets/
    audio/celtic-impulse.mp3
    img/              (drop Firefly PNG exports here to replace SVG placeholders)
```

## Credits

- Show: *Sherwood: The Adventures of Robin Hood* by Ken Ludwig. Presented by arrangement
  with [Concord Theatricals](https://www.concordtheatricals.com) on behalf of Samuel
  French, Inc. Originally developed and produced at The Old Globe.
- Music: *Celtic Impulse* by Kevin MacLeod (incompetech.com), CC BY 3.0.
- Typography: Google Fonts &middot; *UnifrakturMaguntia*, *IM Fell English*, *IM Fell English SC*.
- Code and scaffolding: Brooke.
