# Bubba Irwin Tattoo — bubbairwintattoo.com

Official website for professional tattoo artist **Bubba Irwin**. A fast, dependency-free static site with a dark, high-end tattoo studio aesthetic.

## Sections

- **Hero** — bold brand introduction with "Book a Consultation" and "View the Work" calls-to-action
- **Gallery** — responsive portfolio grid with style filters (Black & Grey, Color, Traditional, Fine Line) and a keyboard-navigable lightbox
- **In Motion** — three of Bubba's Instagram reels embedded via Instagram's official embed player (edit the reel URLs in the `#reels` section of `index.html` to rotate in new posts)
- **Bio** — Bubba's background, experience, and artistic philosophy
- **Affiliations** — linked cards for [Glasshouse Tattoo](https://www.glasshousetattoostudio.com/) and [Old Town Ink](https://oldtownink.com)
- **Contact / Booking** — consultation request form (name, email, phone, tattoo idea, preferred placement, reference-image upload) delivered to **Bubba@bubbairwintattoo.com**
- **Sticky navigation** with scroll-spy highlighting and a mobile menu; footer with social links and copyright

## Project structure

```
index.html          Main single-page site
thanks.html         Post-submission confirmation page
css/styles.css      All styling (dark theme, responsive)
js/main.js          Nav, gallery filters, lightbox, scroll reveal, form validation
assets/gallery/     Gallery images (currently placeholders — see below)
render.yaml         Render Blueprint (static site + custom domains)
```

## ⚠️ Replace the placeholder gallery images

The images in `assets/gallery/` are **styled placeholders**, not Bubba's actual work — Instagram photos can't be redistributed automatically. To finish the gallery:

1. Export high-quality photos of Bubba's tattoos (e.g. the originals behind [@bubbaitattoos](https://www.instagram.com/bubbaitattoos)).
2. Save them into `assets/gallery/` (portrait orientation, ~800×1000 or larger, JPG recommended).
3. Update the `<img src="…">` paths and `alt` text in the gallery section of `index.html`. The grid, filters, and lightbox will work with any images automatically.
4. Adjust each `<figure data-style="…">` value (`black-grey`, `color`, `traditional`, `fine-line`) so filtering matches the piece.

## Booking form setup (one-time)

The form posts to [FormSubmit](https://formsubmit.co) — a free, serverless form backend that emails submissions (including image attachments) to **Bubba@bubbairwintattoo.com**.

**Activation:** the first time the form is submitted on the live site, FormSubmit sends a one-time confirmation email to Bubba@bubbairwintattoo.com. Click the confirmation link once, and all future submissions are delivered automatically. No account or API key needed.

Optional hardening: after activation, FormSubmit provides a random alias for the email address; you can swap it into the form's `action` attribute in `index.html` to keep the address out of the page source.

If you'd rather use another backend (Formspree, Netlify Forms, Basin…), only the `<form action="…">` attribute and hidden fields in `index.html` need to change.

## Deployment on Render

The site is plain HTML/CSS/JS with no build step, deployed as a **Render Static Site**. The included `render.yaml` Blueprint configures everything.

1. In the [Render dashboard](https://dashboard.render.com), click **New → Blueprint** and connect this GitHub repository (or **New → Static Site** and point it at the repo — set *Build Command* empty and *Publish Directory* to `.`).
2. Render deploys automatically on every push to the connected branch.
3. **Custom domain:** `render.yaml` declares `bubbairwintattoo.com` and `www.bubbairwintattoo.com`. In the service's **Settings → Custom Domains**, Render shows the DNS records to add at your registrar (an `A`/`ALIAS` record for the apex and a `CNAME` for `www`). TLS certificates are issued automatically once DNS propagates.

**Local preview:**

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Customization notes

- **Bio copy** lives in the `#bio` section of `index.html` — review and adjust the wording, years of experience, and stats so they're accurate to Bubba's current career.
- **Colors/fonts** are defined as CSS variables at the top of `css/styles.css` (`--fire`, `--ember`, and `--volt` are the fiery orange / electric yellow accents; swap them to re-theme the whole site). Headline font is Anton, distressed accents use Permanent Marker.
- **Bio photo:** the framed placeholder in the `#bio` section is reserved for a candid black-and-white photo of Bubba at work — drop an `<img>` into `.bio__portrait-frame` when one is available.
- **Social links** are in the footer of `index.html`.
