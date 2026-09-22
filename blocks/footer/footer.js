import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Check if we are inside the standalone /footer page or fetching it as a fragment
  const isFragment = block.children.length === 0 || !block.querySelector('img, p, div');

  if (isFragment) {
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
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-content';
    while (block.firstChild) {
      wrapper.append(block.firstChild);
    }
    block.append(wrapper);
  }

  // Constrain authored images
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '140px';
    img.style.height = 'auto';
  }

  // Accordion Logic
  if (block.classList.contains('accordion')) {
    const headers = block.querySelectorAll('h3, h4');
    headers.forEach((header) => {
      header.classList.add('accordion-header');
      header.addEventListener('click', () => {
        header.classList.toggle('is-expanded');
      });
    });
  }
}
