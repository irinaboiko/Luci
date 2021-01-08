export default function scrollTarget(scrollTarget) {
  const duration = 500;
  const easing = 'linear';
  const $target = $(scrollTarget);

  if ($target.length) {
    $('html, body').animate({
      scrollTop: $(scrollTarget).offset().top,
    }, duration, easing);
  }
}
