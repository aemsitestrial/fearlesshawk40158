import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Ignore the empty wrapper created by the automatic footer loader.
  const hasAuthoredContent = block.textContent.trim() || block.querySelector('a, img, picture');

  if (!hasAuthoredContent) {
    const footerMeta = getMetadata('footer');
    let footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : '/footer';

    if (footerPath.endsWith('.html')) {
      footerPath = footerPath.slice(0, -5);
    }

    // Attempt standard fragment load
    let fragment = await loadFragment(footerPath);

    // Fallback retry if fragment is empty inside Universal Editor canvas
    if ((!fragment || !fragment.firstElementChild) && window.location.origin) {
      const fullUrl = `${window.location.origin}${footerPath}.plain.html`;
      try {
        const resp = await fetch(fullUrl);
        if (resp.ok) {
          const html = await resp.text();
          const dp = new DOMParser();
          const doc = dp.parseFromString(html, 'text/html');
          fragment = doc.body;
        }
      } catch (e) {
        // Fallback silent handle
      }
    }

    block.textContent = '';
    const footer = document.createElement('div');
    footer.className = 'footer-content';

    if (fragment && fragment.firstElementChild) {
      while (fragment.firstElementChild) {
        footer.append(fragment.firstElementChild);
      }
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

  // Constrain logo sizing
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '100px';
    img.style.height = 'auto';
  }
}
