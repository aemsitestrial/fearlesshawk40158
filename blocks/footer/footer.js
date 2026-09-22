import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
    const footerMeta = getMetadata('footer');
    // Normalize path to fetch /footer or /footer.plain.html correctly
    let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    if (footerPath.endsWith('.html')) {
      footerPath = footerPath.slice(0, -5);
    }

    const fragment = await loadFragment(footerPath);

    block.textContent = '';
    const footer = document.createElement('div');
    footer.className = 'footer-content';

    while (fragment && fragment.firstElementChild) {
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

  // Constrain logo dimensions
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '100px';
    img.style.height = 'auto';
  }
}
