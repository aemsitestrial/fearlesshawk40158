import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
    const footerMeta = getMetadata('dummy-footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/dummy-footer';
    const fragment = await loadFragment(footerPath);

    block.textContent = '';
    const footer = document.createElement('div');
    footer.className = 'dummy-footer-content';

    while (fragment.firstElementChild) {
      footer.append(fragment.firstElementChild);
    }
    block.append(footer);
  } else if (!block.querySelector('.dummy-footer-content')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dummy-footer-content';
    while (block.firstChild) {
      wrapper.append(block.firstChild);
    }
    block.append(wrapper);
  }

  // Ensure image size stays small and compact
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '100px';
    img.style.height = 'auto';
  }
}
