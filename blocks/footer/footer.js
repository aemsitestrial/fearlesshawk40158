import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Renders corporate information card blocks (No links)
 * @param {Element} container The footer content wrapper
 */
function renderInfoBlocks(container) {
  let infoWrapper = container.querySelector('.footer-info-grid');
  if (!infoWrapper) {
    infoWrapper = document.createElement('div');
    infoWrapper.className = 'footer-info-grid';
    container.append(infoWrapper);
  }

  infoWrapper.innerHTML = `
    <div class="info-card">
      <h4>Global Headquarters</h4>
      <p>100 Innovation Way, Suite 400<br>Tech Corridor, CA 94016<br>United States</p>
      <p>Phone: +1 (800) 555-0199<br>Email: contact@enterprise.com</p>
    </div>

    <div class="info-card">
      <h4>Company Overview</h4>
      <p>Pioneering sustainable technology solutions across global markets. Operating in over 50 countries with a dedicated workforce driving digital transformation.</p>
    </div>

    <div class="info-card">
      <h4>Compliance & Governance</h4>
      <p>ISO 27001 Certified • SOC 2 Type II Compliant • GDPR & CCPA Aligned. All operations adhere to global enterprise standards.</p>
    </div>
  `;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
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

  const contentWrapper = block.querySelector('.footer-content') || block;
  renderInfoBlocks(contentWrapper);

  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '140px';
    img.style.height = 'auto';
  }
}
