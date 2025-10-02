const API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://backend-1rmn.onrender.com";

addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const form = document.querySelector("#editForm");
  const titleEl = document.querySelector("#title");
  const artistEl = document.querySelector("#artist");
  const releasedEl = document.querySelector("#released");
  const popularityEl = document.querySelector("#popularity");
  const genreEl = document.querySelector("#genre");
  const msgEl = document.querySelector("#msg");
  const errEl = document.querySelector("#error");

  if (!id) {
    errEl.textContent = "Missing song id.";
    return;
  }

  // Load current values
  try {
    const res = await fetch(`${API_BASE}/api/songs/${id}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const song = await res.json();

    titleEl.value = song.title ?? "";
    artistEl.value = song.artist ?? "";
    popularityEl.value = song.popularity ?? "";
    // releaseDate -> yyyy-mm-dd for <input type="date">
    releasedEl.value = song.releaseDate ? new Date(song.releaseDate).toISOString().slice(0, 10) : "";
    genreEl.value = Array.isArray(song.genre) ? song.genre.join(", ") : "";
  } catch (err) {
    console.error(err);
    errEl.textContent = "Could not load song for editing.";
    return;
  }

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
      const res = await fetch(`${API_BASE}/api/songs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      msgEl.style.color = "green";
      msgEl.textContent = "Song updated!";
    } catch (err) {
      console.error(err);
      errEl.textContent = "Failed to update song.";
    }
  });
});
