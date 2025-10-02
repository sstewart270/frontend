const API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://backend-1rmn.onrender.com";

addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const titleEl = document.querySelector("#title");
  const detailsEl = document.querySelector("#details");
  const errEl = document.querySelector("#error");

  if (!id) {
    errEl.textContent = "Missing song id.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/songs/${id}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const song = await res.json();

    titleEl.textContent = song.title ?? "(untitled)";

    const release =
      song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : "-";
    const popularity = song.popularity ?? "-";
    const genres = Array.isArray(song.genre) ? song.genre.join(", ") : "-";

    detailsEl.innerHTML = `
      <h3>Artist – ${escapeHtml(song.artist ?? "-")}</h3>
      <p>Popularity – ${escapeHtml(popularity)}</p>
      <p>Release Date – ${escapeHtml(release)}</p>
      <p>Genre(s) – ${escapeHtml(genres)}</p>
    `;
  } catch (err) {
    console.error(err);
    errEl.textContent = "Could not load song details.";
  }
});

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
