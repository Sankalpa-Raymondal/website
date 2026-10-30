// Shows the list of entries on the Blogs, Books and Movies index pages.
// The list (entries.json) and the entry pages are made by build.js: run `npm run build`.
//
// Usage: <div class="entry-list"></div> on the section's index.html

async function displayEntryList(container) {
    container.innerHTML = "<p>Loading…</p>";
    let entries = [];
    try {
        const res = await fetch("entries.json", { cache: "no-cache" });
        if (res.ok) entries = await res.json();
    } catch (e) {
        console.error(e);
    }

    container.innerHTML = "";
    for (const entry of entries) {
        const item = document.createElement("article");
        item.className = "entry-item";
        item.innerHTML = `
            <h3><a></a></h3>
            <p class="entry-meta"></p>
            <p class="entry-subtitle"></p>
            <p class="entry-excerpt"></p>
            <a class="read-more-link">Read more &rarr;</a>`;
        item.querySelectorAll("a").forEach((a) => a.href = entry.page);
        item.querySelector("h3 a").textContent = entry.title;
        item.querySelector(".entry-meta").textContent = entry.meta;
        item.querySelector(".entry-subtitle").textContent = entry.subtitle;
        item.querySelector(".entry-excerpt").textContent = entry.excerpt;
        item.querySelectorAll("p:empty").forEach((p) => p.remove());
        container.appendChild(item);
    }
    if (!container.children.length) container.innerHTML = "<p>Nothing here yet. Coming soon.</p>";
}

document.querySelectorAll(".entry-list").forEach(displayEntryList);
