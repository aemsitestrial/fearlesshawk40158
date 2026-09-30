export default function decorate(block) {
  block.classList.add('dummyfooter');

  // Universal Editor renders EACH field as a row inside the block
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Flatten row children to get each individual field container
  const fields = rows.map((row) => row.firstElementChild || row);

  // Helper functions to safely extract data from field containers
  const extractText = (el) => el?.querySelector('p, div, a')?.textContent?.trim() || el?.textContent?.trim() || '';
  const extractHref = (el) => el?.querySelector('a')?.getAttribute('href') || extractText(el) || '#';

  const renderImg = (container, alt) => {
    if (!container) return '';
    const imgOrPicture = container.querySelector('picture, img');
    if (imgOrPicture) return imgOrPicture.outerHTML;
    const url = extractText(container);
    if (!url) return '';
    if (url.includes('<img')) return url;
    return `<img src="${url}" alt="${alt}" />`;
  };

  const renderLink = (textContainer, ctaContainer) => {
    const text = extractText(textContainer);
    if (!text) return '';
    const href = extractHref(ctaContainer);
    return `<a href="${href}">${text}</a>`;
  };

  // Map individual fields according to schema order (27 fields total)
  const leftLogo = renderImg(fields[0], 'Left Logo');
  const rightLogo = renderImg(fields[1], 'Right Logo');

  // Primary Nav Links (Fields 2-17)
  const primaryNavLinks = [
    renderLink(fields[2], fields[3]), // Home
    renderLink(fields[4], fields[5]), // About TCS
    renderLink(fields[6], fields[7]), // Investors
    renderLink(fields[8], fields[9]), // Careers
    renderLink(fields[10], fields[11]), // Case Studies
    renderLink(fields[12], fields[13]), // Industries
    renderLink(fields[14], fields[15]), // Media
    renderLink(fields[16], fields[17]), // Contacts
  ].join('');

  // Copyright Text (Field 18)
  const copyrightText = extractText(fields[18]);

  // Policy Nav Links (Fields 19-26)
  const policyNavLinks = [
    renderLink(fields[19], fields[20]), // Privacy Notice
    renderLink(fields[21], fields[22]), // Cookie Policy
    renderLink(fields[23], fields[24]), // Disclaimer
    renderLink(fields[25], fields[26]), // Security Policy
  ].join('');

  // Re-render block with parsed structure
  block.innerHTML = `
    <div class="dummyfooter-content footer-container">
      <div class="footer-top-row">
        <div class="footer-logos">
          ${leftLogo ? `<div class="logo-item">${leftLogo}</div>` : ''}
          ${rightLogo ? `<div class="logo-item">${rightLogo}</div>` : ''}
        </div>
        <nav class="footer-primary-nav">
          ${primaryNavLinks}
        </nav>
      </div>
      <hr class="footer-divider" />
      <div class="footer-bottom-row">
        <div class="footer-copyright">
          ${copyrightText}
        </div>
        <nav class="footer-policy-nav">
          ${policyNavLinks}
        </nav>
      </div>
    </div>
  `;
}
