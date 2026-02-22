export const skel = () => {
  const blurDivs = document.querySelectorAll('.blur-load');

  blurDivs.forEach(div => {
    const img = div.querySelector("img");
    const video = div.querySelector("video");

    function loaded() {
      div.classList.add('loaded');
    }

    if (img) {
      if (img.complete && img.naturalHeight !== 0) {
        loaded();
      } else {
        img.addEventListener('load', loaded);
        img.addEventListener('error', loaded);
      }
    }

    if (video) {
      // readyState >= 3 means enough data to play
      if (video.readyState >= 3) {
        loaded();
      } else {
        video.addEventListener('loadeddata', loaded);
        video.addEventListener('canplaythrough', loaded);
        video.addEventListener('error', loaded);
      }
    }
  });
};