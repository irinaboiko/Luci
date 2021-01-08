/**
 * Returns `true` if an element is within the window's viewport.
 *
 * @param {HTMLElement} el
 */
export default function isElementInViewport(el) {
  if (!el) return false;

  const rect = el.getBoundingClientRect();

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight);
}
