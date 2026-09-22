import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Check if authored content exists in the current block DOM
  const authoredImg = block.querySelector('img, picture');
  const authoredText = block.querySelector('p, div, span, a');
  const hasAuthoredContent = Boolean(
    authoredImg || (authoredText && authoredText.textContent.trim()),
  );

  if (hasAuthoredContent) {
    // 1. Render ONLY the authored logo and copyright text
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-content';

    if (authoredImg) {
      const logoWrapper = authoredImg.closest('picture') || authoredImg;
      wrapper.append(logoWrapper);
    }

    if (authoredText) {
      const textWrapper = authoredText.closest('p') || authoredText;
      if (textWrapper !== authoredImg) {
        wrapper.append(textWrapper);
      }
    }

    block.textContent = '';
    block.append(wrapper);
  } else {
    // 2. Fetch the central published /footer fragment for all other pages
    const footerMeta = getMetadata('footer');
    let footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : '/footer';

    if (footerPath.endsWith('.html')) {
      footerPath = footerPath.slice(0, -5);
    }

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
  }

  // Constrain logo sizing cleanly
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '100px';
    img.style.height = 'auto';
  }
}
