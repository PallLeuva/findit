# FindIt

A visual memory for your belongings. Photograph a shelf, drawer, desk, or packed box, save its location, review the detected items, then search to see where an item was last photographed.

**This version runs entirely in your browser and can be hosted on GitHub Pages. No backend, account, database service, API key, or paid hosting is required.**

## Features

- Add JPG, PNG, or WebP photos, resize them in the browser, and strip metadata.
- Detect common objects on your device with TensorFlow.js and COCO-SSD.
- Review, rename, remove, or add labels; mark items directly on the photo.
- Search labels, notes, and locations with common synonyms such as mug/cup and charger/cable.
- Highlight matching items, filter by location, edit details, and delete photos.
- Save photo bytes and labels together in IndexedDB, so they remain after refreshing or reopening the same browser.
- Try an illustrative sample with six clearly identified, manually labeled objects.

## Where your photos are saved

Your photos stay in this browser's storage on this device. They are not uploaded to GitHub or an application server. Automatic detection also runs on the device; the first scan downloads the bundled model (about 18 MB).

There is no account or cross-device sync. A different browser, browser profile, device, or website address has a separate library. Clearing site data, private browsing, storage eviction, or removing a browser profile can remove saved photos. Keep your original photos elsewhere. Data from the earlier server-hosted prototype is not automatically transferred.

## Run locally

Use Node.js 24 and pnpm 11.25.0:

```sh
npm install --global pnpm@11.25.0
pnpm install
pnpm dev
```

```sh
pnpm test
pnpm build
pnpm preview
```

The static build is in `dist/`. Use an HTTP server rather than opening the HTML file directly. Relative asset URLs support a GitHub Pages project path such as `/findit/` as well as a custom domain.

## Publish on GitHub Pages

In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow builds and deploys on pushes to `main`; it can also be run manually from **Actions → Deploy FindIt to GitHub Pages**. No repository secrets are needed. See [GITHUB-SETUP.md](GITHUB-SETUP.md).

## How it works

- `index.html` and `app/main.tsx`: static Vite/React entry point.
- `app/findit.tsx`: photo library, search, and editing interface.
- `lib/browser-storage.ts`: transactional IndexedDB storage and temporary display URLs.
- `lib/detection.ts`: image processing and on-device COCO-SSD detection.
- `lib/findit.ts`: labels, sample data, and search matching.
- `public/models/coco/`: locally served model weights and Apache-2.0 license.
- `.github/workflows/pages.yml`: test, build, and Pages deployment.

The earlier Sites/Cloudflare starter files are retained in the source for reference. The Vite entry point and TypeScript configuration do not include them; the published build has no server routes, sign-in flow, or Cloudflare bindings.

## Prototype limits

FindIt remembers the last saved photo and location; it does not track live locations. COCO-SSD recognizes a fixed set of common categories and can miss small, overlapping, or uncommon objects. Review labels and add your own when needed. Search uses saved names, aliases, notes, and locations rather than arbitrary visual similarity.

Limits: 20 MB input, resizing to a maximum dimension of 1600 px, 5 MB saved JPEG, 60 labels per photo, and 200 photos per browser library. The browser's available storage may impose a lower limit. The app reports failed saves instead of claiming success.

## Validation and attribution

Tests cover search matching and IndexedDB create/read/update/delete behavior, image persistence, validation, and rollback of aborted writes. The production build includes TypeScript checking.

COCO-SSD and TensorFlow.js are from [TensorFlow](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd). UI components use Radix/Shadcn and Lucide icons. The sample desk image was AI-generated and manually labeled. This project was developed with AI coding assistance and a framework starter; disclose assistance accurately when submitting to a hackathon.
