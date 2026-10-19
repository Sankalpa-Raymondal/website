// Interactive skill board: click a skill chip to highlight the jobs/projects that use it.
(function () {
    const chips = document.querySelectorAll(".chip[data-skill]");
    const cards = document.querySelectorAll("details[data-skills]");
    const results = document.querySelector(".skill-results");
    let active = null;

    const cardsFor = (skill) =>
        [...cards].filter((c) => c.dataset.skills.split(" ").includes(skill));

    // Show a usage count on each chip
    chips.forEach((chip) => {
        const n = cardsFor(chip.dataset.skill).length;
        const badge = document.createElement("span");
        badge.className = "chip-count";
        badge.textContent = n;
        chip.appendChild(badge);
        if (n === 0) chip.classList.add("chip-empty");
    });

    function clear() {
        active = null;
        document.body.classList.remove("skill-filtering");
        chips.forEach((c) => c.classList.remove("active"));
        cards.forEach((c) => c.classList.remove("skill-match"));
        results.innerHTML = "";
    }

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const skill = chip.dataset.skill;
            if (active === skill) return clear();
            clear();
            active = skill;
            chip.classList.add("active");

            const matches = cardsFor(skill);
            const name = chip.firstChild.textContent.trim();
            if (matches.length === 0) {
                results.innerHTML = `<p><b>${name}</b>: picked up outside the projects listed here.</p>`;
                return;
            }

            document.body.classList.add("skill-filtering");
            matches.forEach((c) => {
                c.classList.add("skill-match");
                c.open = true;
            });

            const links = matches
                .map((c) => `<a href="#${c.id}">${c.querySelector("h3").textContent}</a>`)
                .join("");
            results.innerHTML =
                `<p><b>${name}</b>: used in ${matches.length} place${matches.length > 1 ? "s" : ""}` +
                ` <button class="link-btn" type="button">clear</button></p><div class="result-links">${links}</div>`;
            results.querySelector(".link-btn").addEventListener("click", clear);
        });
    });
})();

// Open a dropdown card when a link points at it
document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    const target = link && document.querySelector(link.getAttribute("href"));
    if (target && target.tagName === "DETAILS") target.open = true;
});
