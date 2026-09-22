import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Check if content exists directly in the DOM (e.g. while editing /footer in Universal Editor)
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
    // 1. Fetch the published global fragment for all other pages
    const footerMeta = getMetadata('footer');
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
    // 2. Wrap authored content on the /footer page
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-content';
    while (block.firstChild) {
      wrapper.append(block.firstChild);
    }
    block.append(wrapper);
  }

  // Constrain logo image sizing
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '100px';
    img.style.height = 'auto';
  }
}
