# Shohagh Portfolio

Personal portfolio of Md. Shahedur Rahman (Shohagh). Built with Next.js (static export), deployed free on GitHub Pages by GitHub Actions.

## Put it online (new repository)
1. On GitHub click **New repository**. Choose a name (for example `portfolio-v3`) and set it to **Public**.
2. Click **uploading an existing file** and drag in EVERYTHING from this folder, including the hidden `.github` folder. Click **Commit changes**.
3. Open **Settings → Pages**. Under **Source** choose **GitHub Actions**.
4. Open the **Actions** tab and wait for the green tick (about 2 minutes).
5. Your site is live at `https://<your-username>.github.io/<repository-name>/`.
   If you name the repository exactly `<your-username>.github.io`, the site is at `https://<your-username>.github.io/` instead.

The build adapts to either case automatically, so no settings need changing.

### If the hidden `.github` folder did not upload
Click **Add file → Create new file**, type `.github/workflows/deploy.yml` as the name, paste the content of that file from this project, and commit.

## Edit the content
- Text for experience, services, skills and education: `app/data.js`
- Page layout and the intro text: `app/page.js`
- Colors (LUNA palette) and design: `app/globals.css`
- Navigation: `components/Nav.js` (set `SMART` to `false` if you want the bar to scroll away with the page)
- Background animations: `components/NetworkBackground.js` and `components/HeroWaves.js` (speed settings at the top of each file)
- Photo and resumes: `public/` (keep the file names, or change them in `app/page.js`)

## Run locally (optional)
```
npm install
npm run dev
```
Then open http://localhost:3000

## Contact form
The form needs no server. It opens WhatsApp or the visitor's email app with the message already written. To receive messages directly on the site later, connect a form service or a small backend.
