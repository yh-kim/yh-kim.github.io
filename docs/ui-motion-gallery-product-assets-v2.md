# UI Motion product photos, version 2

The two product photos were generated with the built-in OpenAI image generation tool on 2026-10-19. No third-party image or reference photo was used. These are synthetic studio product images, not photos of physical inventory. They contain no brand marks or legible text. This record documents origin; it does not add or interpret license terms.

| Product | Generated source | Published asset | Dimensions | WebP bytes |
| --- | --- | --- | --- | ---: |
| Archive notebook | `session-generated/exec-7f9d6b03-9cf8-4b91-8b4a-2be4b7e3f73b.png` | `p/ui-motion/assets/product-note-v2.webp` | 640 × 640 | 22,238 |
| Desk tray | `session-generated/exec-2adc914e-a9f0-41d0-b663-dc65279e7997.png` | `p/ui-motion/assets/product-tray-v2.webp` | 640 × 640 | 10,402 |

Both published images were resized from 1254 × 1254 PNG to 640 × 640 WebP using Pillow Lanczos resampling at quality 82, method 6. No pixel edits or compositing were applied. `js/ui-motion-showcase/product-assets.js` contains the same WebP bytes as base64 data URLs for self-contained exports.

## Notebook prompt

```text
Use case: product-mockup
Asset type: square e-commerce product photograph for a premium Korean stationery and desk-object shop; a real object photograph, no interface or mockup.
Scene/backdrop: seamless warm light-gray studio sweep, matte tabletop and background visually continuous.
Subject: one closed A5 archive notebook, warm cream linen cloth hard cover, fine woven fabric grain clearly visible, realistic layered ivory paper edges visible on one side, subtle bookbinding thickness and precise squared corners. Entire notebook visible, resting naturally and slightly angled in a three-quarter overhead view.
Style/medium: believable high-end physical product photography, natural optical detail, realistic proportions, restrained editorial catalog quality.
Composition/framing: square image. Notebook centered, occupying about 65 percent of image width and height with generous clean negative space on all sides; suitable for a center crop. No cut-off edges.
Lighting/mood: large diffuse softbox from upper left, soft realistic contact shadow falling to lower right; warm-neutral white balance, understated tonal contrast.
Materials/textures: tactile fine linen cover and distinct tightly layered paper edge; avoid plastic, rendering artifacts, unreal geometry.
Constraints: exactly one notebook, closed, no other props, no print, no title, no logo, no embossed symbols, no watermark, no hands, no typography or UI. Background clean and uniform. No ribbon bookmark, no pen.
```

## Tray prompt

```text
Use case: product-mockup
Asset type: square e-commerce product photograph paired with a premium cream linen notebook photo; a real object photograph, no interface or mockup.
Scene/backdrop: seamless warm light-gray studio sweep, matte tabletop and background visually continuous, same soft warm-gray tone as a minimalist notebook catalog photograph.
Subject: one empty shallow rectangular desk tray made from dark graphite/near-black bead-blasted aluminum. Finely textured matte metal, accurate thin walls and gently chamfered beveled rim, subtly recessed flat interior, clean machined rounded corners and physically plausible edge reflections. Tray resting flat on surface, seen in a three-quarter overhead angle so inside, front lip, and slight side thickness are legible.
Style/medium: believable high-end physical product photography, natural optical detail, realistic proportions, restrained editorial catalog quality.
Composition/framing: square image. Tray centered, entire object visible, occupying about 65 percent of image width and height with generous clean negative space on all sides; useful center crop. No cut-off edges.
Lighting/mood: large diffuse softbox from upper left, soft realistic contact shadow falling to lower right; warm-neutral white balance, understated tonal contrast, same lighting as a cream notebook product shot.
Materials/textures: bead-blasted aluminum, charcoal matte surface with slight authentic metal sheen only at bevels; avoid plastic, heavy gloss, rendering artifacts, unreal geometry.
Constraints: exactly one tray, empty, no other props, no print, no title, no logo, no embossed symbols, no watermark, no hands, no typography or UI. Background clean and uniform.
```
