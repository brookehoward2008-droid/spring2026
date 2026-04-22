# Sherwood — Immersive Photographic Playbill

An immersive web playbill for *Ken Ludwig's Sherwood: The Adventures of Robin Hood*, produced by Everett KIDSTAGE TeenSelect.

**Live:** <https://brookehoward2008-droid.github.io/sherwood-html/>

## What it is

The page opens on a dark splash. Click **Enter the Greenwood** and the screen fades to reveal a photographic forest — a real photograph of woods with dappled light, drifting slowly in Ken-Burns fashion with gentle god-ray light shafts and a film-grain overlay. Birdsong fades in. Celtic music is one click away. The playbill itself — a parchment-styled program with the show info, dates, ticket prices, venue, and a welcome note — floats into view as you scroll deeper.

## Required assets (drop in, page comes alive)

The HTML references three files that ship with the repo. Without them you'll see a dark fallback — the page still functions, just less immersive.

### 1. `assets/forest.jpg` — the backdrop photograph

Pick a forest photo with a **dirt path receding into the distance** and **shafts of light** for that Sherwood feel.

**Free sources:**
- **Unsplash** (Unsplash License — free for any use): <https://unsplash.com/s/photos/forest-path>
  - Recommended searches: *"forest path"*, *"sunbeam forest"*, *"woodland trail"*
- **Pexels** (free for any use): <https://www.pexels.com/search/forest%20path/>

Download a horizontal photo (2400×1600 or bigger), save as `assets/forest.jpg`.

### 2. `music/birds.mp3` — forest ambience / birdsong

**Free sources:**
- **Pixabay** (no attribution required): <https://pixabay.com/sound-effects/search/forest%20ambience/>
- **Freesound** (CC licensed): <https://freesound.org/search/?q=forest+ambience+birds>

Get a 2–5 minute loop, save as `music/birds.mp3`.

### 3. `music/theme.mp3` — Celtic music

**Kevin MacLeod** (CC BY 4.0 — credit already in the footer):
- "Celtic Impulse" — <https://incompetech.com/music/royalty-free/index.html?keywords=celtic+impulse>
- "Meadowlark" — <https://incompetech.com/music/royalty-free/index.html?keywords=meadowlark>
- "Peritune - Celtic 3" search
- Browse all Celtic: <https://incompetech.com/music/royalty-free/collections.html>

Download an MP3, rename to `theme.mp3`, drop in `music/`.

## Folder structure

```
.
├── index.html
├── README.md
├── assets/
│   └── forest.jpg
└── music/
    ├── theme.mp3      (Celtic)
    └── birds.mp3      (birdsong/ambience)
```

## Deploying updates

Drop the files into your GitHub repo (`brookehoward2008-droid/sherwood-html`) via the web UI or `git push`. GitHub Pages redeploys in ~1 minute.

## Credits

- **Play:** *Ken Ludwig's Sherwood: The Adventures of Robin Hood*, presented by arrangement with Concord Theatricals on behalf of Samuel French, Inc.
- **Celtic music:** Kevin MacLeod, incompetech.com (CC BY 4.0)
- **Forest ambience & birdsong:** Pixabay (Pixabay Content License)
- **Forest photograph:** Unsplash (Unsplash License)
- **Typography:** Cinzel, Cinzel Decorative, Cormorant Garamond, MedievalSharp (Google Fonts)
