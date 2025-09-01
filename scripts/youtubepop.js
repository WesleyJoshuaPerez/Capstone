document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".youtube-btn"); // use class
  const modal = document.getElementById("youtubeModal");
  const closeBtn = document.getElementById("closeYoutube");
  const iframe = document.getElementById("youtubeIframe");

  if (!openBtn || !modal || !closeBtn || !iframe) {
    console.error("YouTube popup elements not found in DOM.");
    return;
  }

  // function to normalize YouTube links
  function getEmbedUrl(rawUrl) {
    try {
      const url = new URL(rawUrl);

      // Handle watch links
      if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
      }

      // Handle short links
      if (url.hostname === "youtu.be") {
        return `https://www.youtube.com/embed${url.pathname}`;
      }

      // Already embed or direct ID
      return rawUrl;
    } catch {
      // if someone just passed a video ID
      return `https://www.youtube.com/embed/${rawUrl}`;
    }
  }

  openBtn.addEventListener("click", () => {
    const videoUrl = openBtn.getAttribute("data-video"); // use data-video
    const embedUrl = getEmbedUrl(videoUrl);
    iframe.src = `${embedUrl}?autoplay=1`;
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    iframe.src = "";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      iframe.src = "";
    }
  });
});
