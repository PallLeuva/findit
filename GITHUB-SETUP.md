# Put FindIt in your GitHub account

This is the source for the FindIt prototype. No GitHub repository has been created by this export. You can use any GitHub account; it does not need to match your ChatGPT account.

## Upload through GitHub

1. Sign in to the GitHub account you want to use.
2. Create a new repository named `findit` at https://github.com/new. Choose public if your hackathon requires a public source repository.
3. Extract this ZIP on your computer.
4. On the new repository page, choose **uploading an existing file**.
5. Upload the files and folders **inside** the extracted `findit` folder, rather than the ZIP itself. Include hidden configuration files such as `.openai/hosting.json`, `.gitignore`, and `.npmrc`. If your file picker hides them or the web upload encounters a file-count limit, use GitHub Desktop or the command-line option below.
6. Commit the files. Your repository URL will be `https://github.com/YOUR-USERNAME/findit`.

## Upload with Git

Create an empty repository on GitHub first, then run these commands from the extracted project folder. Replace YOUR-USERNAME with your actual GitHub username. Authenticate to your own account through Git Credential Manager or GitHub Desktop; never paste a token into this README or commit one.

```sh
git init
git add .
git commit -m "Initial FindIt prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/findit.git
git push -u origin main
```

## Run it locally

Install Node.js 22.13 or later and pnpm 11.25.0, then:

```sh
pnpm install
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careful_titanium_man.sql
pnpm dev
```

The portable development server uses port 5173. Open the URL it prints. The starter provides local sign-in at `/signin-with-chatgpt?return_to=/`; this is a development-only simulation, not a production account system. Apply the local migration once per database, not every time you start the app.

```sh
pnpm typecheck
pnpm test
```

## Publishing from the repository

**GitHub stores the source. It does not automatically provide the backend this app needs.** This project is not a static GitHub Pages site and is not configured for a one-click Vercel deployment.

The current architecture targets Cloudflare Workers, with D1 for labels/locations and R2 for photo files. The published prototype also relies on the ChatGPT Sites authentication boundary.

To deploy independently from GitHub, the receiving hosting setup must:

1. Provision D1 and R2 and set the `DB` and `BUCKET` bindings to the resources in your account.
2. Apply the SQL migrations under `drizzle/` to the target database.
3. Supply a real authenticated user identity to every private data request. Replace or securely adapt `identity()` in `lib/storage.ts` and the sign-in UI for the chosen authentication provider. Outside ChatGPT Sites, **do not trust browser-supplied `oai-authenticated-user-id` headers**; they are trustworthy only behind the platform that strips and injects them.
4. Build with `pnpm build`, deploy the generated Worker and client assets, and test uploads, account isolation, editing, deletion, and model asset loading on that host.

The exported `.openai/hosting.json` deliberately omits the original private Site's project identity. It declares only the logical storage bindings. No existing users or uploaded photos are included.

If you want free static hosting on GitHub Pages instead, the app needs a separate browser-storage version (for example IndexedDB), with photos saved only on that browser/device. That adaptation is not included in this source export.

## Hackathon notes

- Source and sample image were produced with AI assistance; disclose it according to the event rules.
- Explain the difference between actual detector output and manually added labels.
- The demo photo is AI-generated and manually labeled.
- Review the code and test the final deployed URL before recording your demo.
