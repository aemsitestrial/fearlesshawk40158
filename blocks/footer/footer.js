import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Check if direct Universal Editor authored content exists
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
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

  // Constrain authored image element sizes dynamically
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '140px';
    img.style.height = 'auto';
  }

  // Bind interactive accordion headers for Accordion variation
  if (block.classList.contains('accordion')) {
    const headers = block.querySelectorAll('h3, h4');
    headers.forEach((header) => {
      if (!header.classList.contains('accordion-header')) {
        header.classList.add('accordion-header');
        header.addEventListener('click', () => {
          header.classList.toggle('is-expanded');
          const nextEl = header.nextElementSibling;
          if (nextEl) {
            nextEl.style.display = nextEl.style.display === 'none' ? 'block' : 'none';
          }
        });
      }
    });
  }
}
