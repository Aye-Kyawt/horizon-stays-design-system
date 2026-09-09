# cardContainer — naming suggestions

`CLAUDE.md`: *"Prop names match the Figma property names exactly. If we need a new
property name suggestion due to naming conflict with other tools and dependencies,
report all the naming suggestions under `docs/`."*

This is that report for `.cardContainer` and its subcomponents.

## Figma property names, kept exactly

| Component | Figma property | Prop in code |
|---|---|---|
| `.cardContainer` | `Status` | `status` |
| `cardLayout` | `Orientation` | `orientation` |
| `cardLayout` | `hasSlot` | `hasSlot` |
| `.cardImage` | `Status` | `status` |
| `.cardImage` | `ratio` | `ratio` |
| `.cardImage` | `overlayAction` | `overlayAction` |
| `.cardText` | `metadata` | `metadata` |
| `.cardText` | `review` | `review` |
| `.cardText` | `price` | `price` |

Only the leading capital on the two `Status` / `Orientation` variant properties was
changed, to the lowercase that every other property in the file already uses. The
variant *values* (`default`, `hovered`, `horizontal`, `vertical`, `3:2`, `1:1`) are
verbatim.

## One conflict, and the name proposed for it

`.cardText` has a **boolean** Figma property called `price`, which shows or hides the
price line. The price *text itself* is not a Figma property — the layers carry fixed
sample content — so a content prop had to be named by this repo, and `price` was
already taken.

- **Proposed:** `priceAmount` for the value ("121 EUR"), `pricePeriod` for the
  qualifier ("per night").
- **Alternative, if design prefers:** rename the Figma boolean to `showPrice` (and
  `showReview`, `showMetadata` for consistency), which frees `price` for the content
  and reads better on all three. That is a design-file change, so it is a suggestion,
  not something done here.

## Content props named by this repo, not by Figma

These have no Figma property behind them at all. If design adds text properties to
`.cardText`, these should be renamed to match:

`title`, `location`, `rating`, `reviewCount`, `priceAmount`, `pricePeriod`.

## Folder and file names

Figma prefixes the private subcomponents with a dot: `.cardContainer`, `.cardImage`,
`.cardText`. The dot is dropped in the filesystem — a leading dot means "hidden" to
most tooling and would keep the folders out of globs and diffs. Folders follow the
camelCase rule in `CLAUDE.md`:

`src/components/cardContainer/`, `cardLayout/`, `cardImage/`, `cardText/`.

The dot is preserved where it is harmless and useful for tracing back to the design:
the `data-name` attribute on each root element.
