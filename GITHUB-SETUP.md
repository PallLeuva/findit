# Publish FindIt

FindIt is now a static React/Vite app. It saves photos and labels in the visitor's browser using IndexedDB. There is no server or paid service to configure.

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Deploy FindIt to GitHub Pages** and run the workflow on `main` if it has not started automatically.
4. Wait for both the build and deploy jobs to finish. Open the website URL shown by the deployment or Pages settings.

Future changes pushed to `main` redeploy automatically. No API keys or repository secrets are required.

For another static host, run `pnpm install --frozen-lockfile` and `pnpm build`, then publish `dist/`. The built assets use relative URLs.

Saved data belongs to one browser profile and website origin. It is not synchronized between devices or copied from the older hosted prototype. Clearing site data or using a private window can remove it. Keep original photos separately.
