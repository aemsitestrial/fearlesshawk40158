import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // 1. Check if direct Universal Editor authored content exists
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
    // 2. Fallback to fragment loading if not authored directly
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    const fragment = await loadFragment(footerPath);

    block.textContent = '';
    const footer = document.createElement('div');
    footer.className = 'footer-content';

    while (fragment.firstElementChild) {
      footer.append(fragment.firstElementChild);
    }
    block.append(footer);
  } else if (!block.querySelector('.footer-content')) {
    // Combine 'else' and 'if' into 'else if' to satisfy 'no-lonely-if'
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-content';
    while (block.firstChild) {
      wrapper.append(block.firstChild);
    }
    block.append(wrapper);
  }

  // Handle Accordion JS variation
  if (block.classList.contains('accordion')) {
    const headings = block.querySelectorAll('h3, h4');
    headings.forEach((heading) => {
      heading.addEventListener('click', () => {
        heading.parentElement.classList.toggle('is-expanded');
      });
    });
  }
}
