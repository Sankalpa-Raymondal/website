// Markdown entries engine, shared by Blogs, Books and Movies.
// To add an entry: drop a Markdown file into that section's entries folder, push, done.
//
// Name files so they sort newest-last, e.g. 20261020.md or 20261020-iliad.md
// (newest shows first). Files starting with "_" (like _template.md) are ignored.
//
// Entry format (all optional except the text):
//   # Title
//   *Date / author / rating line*
//   ## Subtitle
//   Body text...            <- put <!--more--> anywhere to choose where the excerpt ends
//
// List page:  <div class="entry-list" data-repo-path="books/book_entries" data-folder="book_entries"></div>
// Entry page: <article class="entry-post" data-folder="book_entries" data-section="Books"></article>
//             (opened as entry.html?p=<file name without .md>)

const REPO_CONTENTS = "https://api.github.com/repos/Sankalpa-Raymondal/website/contents/";
const EXCERPT_LENGTH = 280;

async function listEntryFiles(repoPath, fallback) {
    // Cache the file list briefly to stay under GitHub's 60 requests/hour limit,
    // but not so long that newly pushed entries stay hidden
    const cacheKey = `entries:${repoPath}`;
    const CACHE_MS = 5 * 60 * 1000;
    try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey));
        if (cached && Date.now() - cached.time < CACHE_MS) return cached.files;
    } catch (e) { /* storage unavailable or old format */ }

    try {
        const res = await fetch(`${REPO_CONTENTS}${repoPath}?ref=main`);
        if (res.status === 404) return []; // folder not pushed yet
        if (!res.ok) throw new Error(res.status);
        const files = (await res.json())
            .filter((f) => f.type === "file" && f.name.endsWith(".md") && !f.name.startsWith("_"))
            .map((f) => f.name);
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), files })); } catch (e) {}
        return files;
    } catch (e) {
        // GitHub unreachable (rate limit, offline): use the page's fallback list
        console.warn("Falling back to built-in entry list:", e);
        return fallback;
    }
}

// Split a Markdown entry into its parts
function parseEntry(markdown) {
    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    const take = (re) => {
        while (lines.length && lines[0].trim() === "") lines.shift();
        const m = lines.length && lines[0].match(re);
        if (m) lines.shift();
        return m ? m[1].trim() : "";
    };
    const title = take(/^#\s+(.*)/);
    const meta = take(/^\*([^*].*)\*\s*$/);
    const subtitle = take(/^##\s+(.*)/);
    const body = lines.join("\n").trim();
    return { title, meta, subtitle, body };
}

function makeExcerpt(body) {
    const moreAt = body.indexOf("<!--more-->");
    let text = moreAt !== -1 ? body.slice(0, moreAt) : body;
    // Strip Markdown syntax down to plain text
    text = text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*_>`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    if (moreAt === -1 && text.length > EXCERPT_LENGTH) {
        text = text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, "") + "…";
    }
    return text;
}

async function fetchEntry(folder, file) {
    const res = await fetch(`${folder}/${file}`);
    if (!res.ok) throw new Error(`Could not load ${file}`);
    return parseEntry(await res.text());
}

// ---------- List page ----------
async function displayEntryList(container) {
    const { repoPath, folder } = container.dataset;
    const fallback = (container.dataset.fallback || "").split(",").filter(Boolean);
    container.innerHTML = "<p>Loading…</p>";

    const files = (await listEntryFiles(repoPath, fallback)).sort().reverse(); // newest first
    const entries = await Promise.all(files.map(async (file) => {
        try {
            return { file, ...(await fetchEntry(folder, file)) };
        } catch (e) {
            console.error(e);
            return null;
        }
    }));

    container.innerHTML = "";
    for (const entry of entries.filter(Boolean)) {
        const href = `entry.html?p=${encodeURIComponent(entry.file.replace(/\.md$/, ""))}`;
        const item = document.createElement("article");
        item.className = "entry-item";
        item.innerHTML = `
            <h3><a href="${href}"></a></h3>
            <p class="entry-meta"></p>
            <p class="entry-subtitle"></p>
            <p class="entry-excerpt"></p>
            <a class="read-more-link" href="${href}">Read more &rarr;</a>`;
        item.querySelector("h3 a").textContent = entry.title || entry.file;
        item.querySelector(".entry-meta").textContent = entry.meta;
        item.querySelector(".entry-subtitle").textContent = entry.subtitle;
        item.querySelector(".entry-excerpt").textContent = makeExcerpt(entry.body);
        item.querySelectorAll("p:empty").forEach((p) => p.remove());
        container.appendChild(item);
    }
    if (!container.children.length) container.innerHTML = "<p>Nothing here yet. Coming soon.</p>";
}

// ---------- Single entry page ----------
async function displayEntry(container) {
    const { folder, section } = container.dataset;
    const slug = new URLSearchParams(location.search).get("p");
    const notFound = '<p>Not found. <a href="index.html">Go back</a></p>';
    if (!slug || !/^[\w-]+$/.test(slug)) {
        container.innerHTML = notFound;
        return;
    }
    try {
        const entry = await fetchEntry(folder, `${slug}.md`);
        document.title = `${entry.title || slug} | Sankalpa Raymondal's ${section}`;
        marked.setOptions({ breaks: true }); // a single newline starts a new line
        container.innerHTML = `
            <h1 class="entry-title"></h1>
            <p class="entry-meta"></p>
            <h2 class="entry-subtitle"></h2>
            <div class="entry-body">${marked.parse(entry.body.replace("<!--more-->", ""))}</div>`;
        container.querySelector(".entry-title").textContent = entry.title || slug;
        container.querySelector(".entry-meta").textContent = entry.meta;
        container.querySelector(".entry-subtitle").textContent = entry.subtitle;
        container.querySelectorAll(".entry-meta:empty, .entry-subtitle:empty").forEach((el) => el.remove());
    } catch (e) {
        console.error(e);
        container.innerHTML = notFound;
    }
}

document.querySelectorAll(".entry-list").forEach(displayEntryList);
document.querySelectorAll(".entry-post").forEach(displayEntry);
