import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates interactive Accordion behavior for mobile screens
 */
function initAccordion(footer) {
  const headings = footer.querySelectorAll('.footer-column h4, .footer-column h3');
  headings.forEach((heading) => {
    heading.addEventListener('click', () => {
      const col = heading.closest('.footer-column');
      col.classList.toggle('is-expanded');
    });
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // Preserve fragment DOM structure & authoring instrumentation attributes
  while (fragment.firstElementChild) {
    const child = fragment.firstElementChild;
    footer.append(child);
  }

  // Identify column containers for layout variations
  const columns = footer.querySelectorAll(':scope > div > div');
  columns.forEach((col, idx) => {
    col.classList.add('footer-column', `footer-col-${idx + 1}`);
  });

  // Enable JS logic if 'accordion' variation class is applied
  if (block.classList.contains('accordion')) {
    initAccordion(footer);
  }

  block.append(footer);
}
