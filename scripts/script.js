// ---- API base (local when on localhost/127.0.0.1, Render otherwise) ----
const API_BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://backend-1rmn.onrender.com";

addEventListener("DOMContentLoaded", async () => {
  const listEl = document.querySelector("#list_of_songs");
  const errEl = document.querySelector("#error");

  try {
    const res = await fetch(`${API_BASE}/api/songs`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const songs = await res.json();

    if (!Array.isArray(songs) || songs.length === 0) {
      listEl.innerHTML = `<li>No songs yet.</li>`;
      return;
    }

    const html = songs
      .map((song) => {
        const id = song._id;
        const safeTitle = escapeHtml(song.title ?? "");
        const safeArtist = escapeHtml(song.artist ?? "");
        return `<li>${safeTitle} – ${safeArtist} —
          <a href="details.html?id=${id}">Details</a> —
          <a href="edit.html?id=${id}">Edit</a></li>`;
      })
      .join("");
    listEl.innerHTML = html;
  } catch (err) {
    console.error(err);
    errEl.textContent = "Could not load songs.";
  }
});

// Tiny helper to avoid accidental HTML injection in titles/artists
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
