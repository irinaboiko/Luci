import fitVids from 'fitvids';

export default function fitVideos(selector) {
  const $iframe = $(`${selector} iframe`);
  let hasVideo = 0;

  if ($iframe.length) {
    $iframe.each((i, el) => {
      const players = '/www.youtube.com|player.vimeo.com/';
      if (el.src.search(players) !== -1) {
        hasVideo++;
      }
    });
  }

  if (hasVideo) {
    fitVids(selector);
  }
}
