# Website changes

A record of the changes Claude made to this site in October 2026, newest first, with how things work now.

## How to add a blog, book or movie entry

1. Copy the `_template.md` in that section's entries folder (`blogs/blog_entries/`, `books/book_entries/` or `movies/movie_entries/`) and rename it, e.g. `20261030.md` or `20261030-dune.md`. Use only letters, numbers, `-` and `_`. Files starting with `_` are ignored.
2. Write the entry. The template has a hidden cheat sheet for images, videos, audio and links.
3. Run `npm run build` (or `npm run watch` while writing, to rebuild on every save).
4. Commit and push the `.md` file, any images, the generated `.html` page and the section's `index.html`.

On a new computer, run `npm install` once first.

Don't edit the generated entry pages (e.g. `blogs/20261020.html`) or anything between the `<!-- entries:start -->` and `<!-- entries:end -->` markers in a section's `index.html`. The build overwrites them.

---

## 30 October 2026: entry lists built into the page (commit `f106cc3`)

**Why:** the Blogs, Books and Movies pages showed "Loading…" while they fetched the list of entries.

- `build.js` now writes the list of entries straight into each section's `index.html`, between `<!-- entries:start -->` and `<!-- entries:end -->`. The page is complete as soon as it opens.
- Removed `entries.js` and the three `entries.json` files, which are no longer needed.
- Deleted entries are cleaned up automatically: removing a `.md` file and rebuilding removes its page and its line in the list.

## 30 October 2026: Funny noise tile (commit `e3077be`)

- Added a "Funny noise" box to the Fun page (`fun/index.html`). Pressing it plays `fun/vine-boom.mp3`.
- If that file is ever missing, the page plays a boom generated in the browser instead.
- Small CSS addition in `style.css` so the button looks like the other Fun tiles.

## 30 October 2026: Markdown entries converted to HTML by a build script (commit `e3077be`)

**Why:** replace the old approach, where every visit asked GitHub for the list of files and converted Markdown in the browser.

- New `build.js`, run with `npm run build`. It turns each `.md` entry into a finished page next to the section's `index.html`, e.g. `blogs/blog_entries/20261020.md` → `blogs/20261020.html`.
- `npm run watch` rebuilds whenever an entry is saved, which works well with VS Code's Live Server.
- Added `package.json` with the Markdown converter (`marked`). `node_modules/` is ignored by git.
- Old links like `blogs/entry.html?p=20261020` now redirect to `blogs/20261020.html`, so links already shared still work.
- Templates now mention the `npm run build` step.

## 24 October 2026: media guide in the templates (pushed in your commit `1420fb7`)

- Added a hidden "media cheat sheet" to the end of all three `_template.md` files: images (normal, set width, with caption, from another website, GIFs), clickable YouTube thumbnails, embedded YouTube videos, `.mp4` video, `.mp3` audio and links.
- Each section has its own image folder: `blogs/images_blog/`, `books/images_book/`, `movies/images_movie/`. Image paths in entries start from the section folder, e.g. `images_blog/photo.jpg`.
- `style.css`: embedded videos fit the page width at 16:9, audio players are centred, and image captions are small and grey.

## 23 October 2026: entries visible in Live Server before pushing (pushed in your commit `1420fb7`)

- When the site ran on your computer, the entry list still came from GitHub, so unpushed entries didn't appear. `entries.js` was changed to read the local folder instead. (Replaced by the build script on 30 October.)

## 21 October 2026: new blog post not showing on the live site (commit `9dd73ef`)

- The Blogs page remembered its list of posts for as long as the browser tab was open, so new posts stayed hidden. The saved list now expired after 5 minutes. (Replaced by the build script on 30 October.)
- Added the new post to the backup list used when GitHub stops answering. (Also replaced on 30 October.)

## 20 October 2026: static Home page and first blog push (commit `316cb26`)

- **Business card:** removed the hover tilt and lift. The "View portfolio" and "Download CV" buttons no longer lift on hover, but still change colour.
- **Section tiles (Blogs, Books, Movies, Fun):** replaced the flip cards with plain boxes. The title is at the top and the description at the bottom, both always visible, with no emojis. The whole box is a link, and the border turns red on hover.
- Coming back to Home from a section still scrolls to that section's tile, which gets a red border instead of a flash animation.
- Fixed the image paths in the Durga Puja post (`../images_blog/…` → `images_blog/…`) and pushed the post with its images.
