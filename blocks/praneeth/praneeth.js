export default function decorate(block) {
  block.classList.add('praneeth');

  const rows = [...block.children];
  if (rows.length === 0) return;

  const extractText = (el) => (
    el?.querySelector('p, div, a')?.textContent?.trim() || el?.textContent?.trim() || ''
  );

  const extractTitleText = (el) => {
    if (!el) return '';
    const text = el.querySelector('p, h1, h2, h3, h4, div')?.innerHTML || el.innerHTML;
    return text.replace(/<\/?p[^>]*>/g, '').trim();
  };

  const extractCleanLinks = (el) => {
    if (!el) return '';
    const links = [...el.querySelectorAll('a')];
    if (links.length === 0) return el.innerHTML;

    return links.map((link) => {
      const href = link.getAttribute('href') || '#';
      const text = link.textContent.trim();
      return `<a href="${href}">${text}</a>`;
    }).join('');
  };

  // Default Inline SVG Logos fallback if no images are uploaded by the author
  const defaultLogosSvg = `
    <svg height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- TCS Logo -->
      <text x="0" y="22" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold" letter-spacing="1">tcs</text>
      <text x="42" y="14" fill="#ffffff" font-family="Arial, sans-serif" font-size="8" font-weight="bold" letter-spacing="0.5">TATA</text>
      <text x="42" y="21" fill="#ffffff" font-family="Arial, sans-serif" font-size="6" letter-spacing="0.2">CONSULTANCY</text>
      <text x="42" y="27" fill="#ffffff" font-family="Arial, sans-serif" font-size="6" letter-spacing="0.2">SERVICES</text>
    </svg>
    <svg height="28" viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- TATA Logo -->
      <path d="M10 4 H40 V8 H27 V24 H23 V8 H10 Z" fill="#ffffff"/>
      <text x="8" y="27" fill="#ffffff" font-family="Arial, sans-serif" font-size="7" font-weight="bold" letter-spacing="2">TATA</text>
    </svg>
  `;

  // Map authored fields based on model sequence
  const headingText = extractTitleText(rows[0]?.firstElementChild || rows[0]);
  const placeholderText = extractText(rows[1]?.firstElementChild || rows[1]) || 'Ask TCS...';

  // Extract images or use the fallback SVG logos
  const authoredLogos = rows[2]?.firstElementChild?.innerHTML || rows[2]?.innerHTML || '';
  const logosHtml = authoredLogos.trim() !== '' ? authoredLogos : defaultLogosSvg;

  const primaryNavHtml = extractCleanLinks(rows[3]?.firstElementChild || rows[3]);
  const copyrightText = extractText(rows[4]?.firstElementChild || rows[4])
    || 'COPYRIGHT © 2026 TATA CONSULTANCY SERVICES. ALL RIGHTS RESERVED.';
  const policyNavHtml = extractCleanLinks(rows[5]?.firstElementChild || rows[5]);

  // Tag authoring rows so Universal Editor keeps DOM state without showing duplicates
  rows.forEach((row) => row.classList.add('ue-raw-row'));

  const micIconSvg = `
    <svg class="search-mic-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  `;

  // Remove stale preview container if re-decorating
  const existingContainer = block.querySelector('.praneeth-container');
  if (existingContainer) existingContainer.remove();

  // Construct UI Layout
  const container = document.createElement('div');
  container.className = 'praneeth-container';
  container.innerHTML = `
    <div class="praneeth-hero-section">
      ${headingText ? `<h2 class="praneeth-heading">${headingText}</h2>` : ''}
      <div class="praneeth-search-wrapper">
        <input type="text" class="praneeth-search-input" placeholder="${placeholderText}" aria-label="${placeholderText}" />
        <button type="button" class="praneeth-mic-btn" aria-label="Voice Search">
          ${micIconSvg}
        </button>
      </div>
    </div>

    <div class="praneeth-nav-section">
      <div class="praneeth-top-row">
        <div class="praneeth-logos">
          ${logosHtml}
        </div>
        <nav class="praneeth-primary-nav" aria-label="Primary Footer Navigation">
          ${primaryNavHtml}
        </nav>
      </div>

      <hr class="praneeth-divider" />

      <div class="praneeth-bottom-row">
        <p class="praneeth-copyright">${copyrightText}</p>
        <nav class="praneeth-policy-nav" aria-label="Policy Navigation">
          ${policyNavHtml}
        </nav>
      </div>
    </div>
  `;

  block.prepend(container);
}
