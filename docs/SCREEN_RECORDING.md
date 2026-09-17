# Screen-recording workflow

This runbook produces a concise application video without relying on seeded fake results or manually rebuilding quiz states between takes.

## Before recording

1. From the repository root, run `npm ci` once and then `npm run dev`.
2. Open `http://localhost:3000/?demo=1` in a clean browser window.
3. Set the browser to roughly 1440 × 900, hide bookmarks and unrelated tabs, and keep zoom at 100%.
4. Close notifications, disable do-not-disturb exceptions, and confirm no personal browser data is visible.
5. Rehearse the flow once. The presentation toolbar is visible only when `?demo=1` is present.

## Recommended 40–50 second take

| Time | Screen action | Suggested narration |
| --- | --- | --- |
| 0–4s | Hold on the landing hero and animated spoonful. | “I don’t just eat ice cream—I read what makes a spoonful work.” |
| 4–9s | Click **Build mine** and select one or two first-bite flavours. | “Find Ya Flava starts with the taste someone actually wants.” |
| 9–16s | Choose pieces, size and quantity. Pause briefly on the live spoon. | “Then it captures the bite—pieces, scale and how packed you want it.” |
| 16–22s | Choose a ribbon and softness, then continue. | “Ribbons and serving texture stay separate, because they change the experience differently.” |
| 22–29s | Finish the quiz and show the evidence cards on the result. | “The matcher recommends only from documented Dr. Bombay descriptions and says what it cannot verify.” |
| 29–35s | Show **View on Dr. Bombay**, **Save my flavour request**, and **Download ‘My Flava’ card**. | “The result is source-linked, locally saveable and ready to share.” |
| 35–41s | Use the toolbar’s **Load unmet chocolate / brownie** preset. | “When the catalogue cannot satisfy the request, it says so instead of inventing a product.” |
| 41–47s | Open **Team demo** and show the local-versus-fictional labels. | “The dashboard separates device-only activity from clearly labelled fictional demo data.” |
| 47–50s | Return to the result or landing headline. | “Taste, spot the trend, report back to Snoop—I already built the receipt.” |

## One-click demo states

The presentation toolbar contains four controls:

- **Reset quiz** returns to a clean landing page.
- **Load blueberry / cinnamon / crunch** shows the strongest documented matching path.
- **Load unmet chocolate / brownie** shows the honest partial-match path and Cutting-Chai Kulfi concept.
- **Open team demo** opens the local analytics prototype.

These presets run the same deterministic matcher as the quiz. They do not hard-code the displayed product result.

## Recording checklist

- Record at 1080p or higher, 30 fps, with the cursor visible.
- Keep the first spoken hook under two seconds.
- Do not linger on the presentation toolbar; it is a production aid, not part of the consumer experience.
- Avoid showing DevTools, localhost console output, GitHub credentials or unrelated tabs.
- Capture one clean master take, then one silent backup take for B-roll.
- Export a 9:16 crop for TikTok/Reels/Shorts and a 16:9 master for the application or portfolio.
- Burn in captions and verify that the app disclaimer remains legible.

Raw captures belong in `recordings/`, which is intentionally ignored by Git.
