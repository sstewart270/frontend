const API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://backend-1rmn.onrender.com";

addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#addForm");
  const titleEl = document.querySelector("#title");
  const artistEl = document.querySelector("#artist");
  const releasedEl = document.querySelector("#released");
  const popularityEl = document.querySelector("#popularity");
  const genreEl = document.querySelector("#genre");
  const msgEl = document.querySelector("#msg");
  const errEl = document.querySelector("#error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";
    errEl.textContent = "";

    const body = {
      title: titleEl.value.trim(),
      artist: artistEl.value.trim(),
      popularity: Number(popularityEl.value),
      releaseDate: releasedEl.value ? new Date(releasedEl.value).toISOString() : null,
      genre: genreEl.value.trim() ? genreEl.value.split(",").map((g) => g.trim()).filter(Boolean) : [],
    };

    try {
      const res = await fetch(`${API_BASE}/api/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const created = await res.json();
      msgEl.style.color = "green";
      msgEl.textContent = `Added song with ID ${created._id ?? "(unknown)"}`;
      form.reset();
    } catch (err) {
      console.error(err);
      errEl.textContent = "Failed to add song.";
    }
  });
});
