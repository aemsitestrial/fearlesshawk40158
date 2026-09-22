import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Generates default navigation columns if none exist in authoring
 */
function renderFallbackLinks(container) {
  const linksWrapper = document.createElement('div');
  linksWrapper.className = 'footer-nav-columns';
  linksWrapper.innerHTML = `
    <div class="nav-col">
      <h4>Company</h4>
      <ul>
        <li><a href="/about-us">About Us</a></li>
        <li><a href="/careers">Careers</a></li>
        <li><a href="/news">Newsroom</a></li>
        <li><a href="/leadership">Leadership</a></li>
      </ul>
    </div>
    <div class="nav-col">
      <h4>Services</h4>
      <ul>
        <li><a href="/cloud">Cloud Solutions</a></li>
        <li><a href="/ai">AI & Analytics</a></li>
        <li><a href="/cybersecurity">Cybersecurity</a></li>
        <li><a href="/consulting">Consulting</a></li>
      </ul>
    </div>
    <div class="nav-col">
      <h4>Resources</h4>
      <ul>
        <li><a href="/blogs">Insights & Blogs</a></li>
        <li><a href="/case-studies">Case Studies</a></li>
        <li><a href="/documentation">Documentation</a></li>
        <li><a href="/help">Support Center</a></li>
      </ul>
    </div>
  `;
  container.append(linksWrapper);
}

export default async function decorate(block) {
  const hasAuthoredContent = block.children.length > 0 && block.querySelector('img, p, div');

  if (!hasAuthoredContent) {
    // Load central fragment for all other pages
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
    // Authored page setup
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-content';

    while (block.firstChild) {
      wrapper.append(block.firstChild);
    }

    // Insert fallback links if navigation links are missing
    if (!wrapper.querySelector('ul, a')) {
      renderFallbackLinks(wrapper);
    }

    block.append(wrapper);
  }

  // Ensure images are constrained
  const img = block.querySelector('img');
  if (img) {
    img.style.maxWidth = '140px';
    img.style.height = 'auto';
  }

  // Accordion Interaction
  if (block.classList.contains('accordion')) {
    const headers = block.querySelectorAll('h4, h3');
    headers.forEach((header) => {
      header.classList.add('accordion-header');
      header.addEventListener('click', () => {
        header.classList.toggle('is-expanded');
        const list = header.nextElementSibling;
        if (list) {
          list.style.display = list.style.display === 'none' ? 'block' : 'none';
        }
      });
    });
  }
}
