/**
 * Decorates the rich text block
 * @param {Element} block The rich text block element
 */
export default function decorate(block) {
  const contentWrapper = block.firstElementChild ? block.firstElementChild.firstElementChild : null;

  if (contentWrapper) {
    // Transfer authored content directly to the block container
    const content = Array.from(contentWrapper.childNodes);
    block.replaceChildren(...content);
  }

  // Optional: Style buttons or links created within rich text
  block.querySelectorAll('a').forEach((a) => {
    // If link is styled as a button in authoring, ensure correct classes
    const up = a.parentElement;
    if (up.tagName === 'P' && up.children.length === 1 && up.textContent.trim() === a.textContent.trim()) {
      if (a.querySelector('strong')) {
        a.classList.add('button', 'primary');
      } else if (a.querySelector('em')) {
        a.classList.add('button', 'secondary');
      }
    }
  });
}
