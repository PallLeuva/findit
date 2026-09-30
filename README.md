# FindIt

**GitHub source export.** Start with [GITHUB-SETUP.md](GITHUB-SETUP.md) to upload this project to your own account. The complete photo-saving app uses server-side storage and authentication; GitHub Pages alone cannot run this version.

A visual memory for your belongings. Photograph a shelf, drawer, desk, or packed box, save its location, review the detected items, then search to see where an item was last photographed.

## Working features

- Photo upload with in-browser resizing, JPEG conversion, and metadata stripping.
- Real COCO-SSD object detection in the browser, loaded only when a photo is scanned.
- Review, rename, remove, and add item labels. Draw or tap to mark objects the model missed.
- Search saved labels, notes, and locations. Common synonyms support searches such as “mug”/“cup” and “charger”/“cable”.
- Object highlights, location filters, editable location details, and photo deletion.
- Durable account-scoped metadata in Cloudflare D1; private image bytes in R2. Every image and record endpoint checks ownership.
- Responsive layouts, keyboard-accessible dialogs and controls, and recoverable save errors.
- An illustrative sample with six manually labeled objects. It is clearly distinguished from actual detector results and user data.

## Technology

React 19, TypeScript, Vinext/Vite, Tailwind CSS, Radix/Shadcn components, TensorFlow.js, COCO-SSD, Cloudflare Workers, D1, and R2. The code uses the Sites starter. No paid AI API key is required.

The object detector and its weights are hosted with the application so inference does not require a third-party inference API. The model is approximately 18 MB and downloads on the first scan. The image is processed on the device for detection, then its resized copy is uploaded to the application's own storage **only when Save is selected**.

## Local development

Requires Node.js 22.13+ and pnpm.

```sh
pnpm install
pnpm dev
```

For a local database after the first build:

```sh
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careful_titanium_man.sql
```

Apply the migration once per local database. The published Site applies migrations through its hosting workflow. Local sign-in support is provided by the starter; production identity comes from the hosting platform. Never expose the Worker directly without the platform's authenticated-header boundary.

```sh
pnpm exec tsc --noEmit
node scripts/test-findit.mjs
pnpm build
```

## Limits to explain in a demo

This is a working prototype, not a live tracker. Photos reflect when and where the user captured an item, not its current position. Re-photograph or update locations after moving belongings.

COCO-SSD recognizes a fixed set of common object categories. Small, overlapping, uncommon, or partly hidden items may be missed or mislabeled. A charger is not a dedicated model class. Custom labels and manually marked regions cover these cases. Model confidence is not a guarantee of correctness. Sample labels are manual, not claimed AI output.

Search uses saved words, aliases, and location text. It is not CLIP-style semantic image retrieval and does not infer arbitrary visual attributes unless they are included in the label.

Limits: JPG/PNG/WebP input, 20 MB input, resized to 1600px maximum dimension, 5 MB saved JPEG, 60 labels/photo, 200 photos/account. No background tracking, household sharing, or offline database is implemented.

## Validation

- TypeScript checks and production build.
- Search tests for aliases, natural phrasing, location filters, unmatched items, and sample highlight bounds.
- Real CPU inference on the sample returned cup, scissors, book, and remote.
- Local Worker integration checks cover uploads, reads, updates, deletes, account isolation, anonymous rejection, and cross-origin rejection.
- Browser visual and WebMCP runtime checks were unavailable in the authoring environment; these should be verified on the published app before a hackathon submission.

## Attribution and hackathon preparation

COCO-SSD and TensorFlow.js: https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd and https://github.com/tensorflow/tfjs . Model files: https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json . Model source uses Apache-2.0 licensing. Icons are from Lucide; UI primitives use the bundled Radix/Shadcn components. The sample desk photo was AI-generated for this project.

This prototype was created with AI coding assistance and a framework starter. Review the event's AI/tooling rules and disclose assistance accurately. Inspect the code and understand the detection, search, and ownership checks before presenting. The private Sites source repository is not a public GitHub submission repository; publish reviewed source separately when preparing your submission.
