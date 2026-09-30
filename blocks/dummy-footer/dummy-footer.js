/**
 * Decorates the dummy-footer block.
 * @param {Element} block The dummy-footer block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const heroSection = document.createElement('div');
  heroSection.classList.add('dummy-footer-hero');

  const mainSection = document.createElement('div');
  mainSection.classList.add('dummy-footer-main');

  const topRow = document.createElement('div');
  topRow.classList.add('dummy-footer-top-row');

  const brandContainer = document.createElement('div');
  brandContainer.classList.add('dummy-footer-brand');

  const navLinksContainer = document.createElement('nav');
  navLinksContainer.classList.add('dummy-footer-links');

  const divider = document.createElement('div');
  divider.classList.add('dummy-footer-divider');

  const bottomRow = document.createElement('div');
  bottomRow.classList.add('dummy-footer-bottom-row');

  const copyrightEl = document.createElement('div');
  copyrightEl.classList.add('dummy-footer-copyright');

  const legalLinksContainer = document.createElement('nav');
  legalLinksContainer.classList.add('dummy-footer-legal-links');

  rows.forEach((row) => {
    const cols = [...row.children];

    // Hero / Search Row
    if (row.querySelector('h1, h2, h3') || row.innerText.toLowerCase().includes('future')) {
      const heading = row.querySelector('h1, h2, h3, p');
      if (heading) {
        const title = document.createElement('h2');
        title.classList.add('dummy-footer-title');
        title.textContent = heading.textContent;
        heroSection.appendChild(title);
      }

      const searchBox = document.createElement('div');
      searchBox.classList.add('dummy-footer-search');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = cols[1] ? cols[1].textContent.trim() : 'Ask TCS...';
      input.setAttribute('aria-label', 'Search');

      const micIcon = document.createElement('span');
      micIcon.classList.add('search-mic-icon');
      micIcon.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="#FFFFFF"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="#FFFFFF"/>
        </svg>
      `;

      searchBox.appendChild(input);
      searchBox.appendChild(micIcon);
      heroSection.appendChild(searchBox);
    } else if (row.querySelector('picture, img')) {
      // Collects all brand/logo images uploaded (left logo, right logo, etc.)
      const pictures = row.querySelectorAll('picture, img');
      pictures.forEach((pic) => {
        const logoWrapper = document.createElement('div');
        logoWrapper.classList.add('logo-item');
        logoWrapper.appendChild(pic.cloneNode(true));
        brandContainer.appendChild(logoWrapper);
      });
    } else if (row.querySelector('a') && !row.innerText.toLowerCase().includes('copyright')) {
      // Main navigation links
      const anchors = row.querySelectorAll('a');
      anchors.forEach((a) => {
        navLinksContainer.appendChild(a.cloneNode(true));
      });
    } else if (cols.length >= 2 || row.innerText.toLowerCase().includes('copyright')) {
      // Bottom copyright text & legal links
      if (cols[0] && cols[0].textContent.trim()) {
        copyrightEl.textContent = cols[0].textContent.trim();
      }
      const legalAnchors = row.querySelectorAll('a');
      legalAnchors.forEach((a) => {
        legalLinksContainer.appendChild(a.cloneNode(true));
      });
    }
  });

  topRow.appendChild(brandContainer);
  topRow.appendChild(navLinksContainer);

  bottomRow.appendChild(copyrightEl);
  bottomRow.appendChild(legalLinksContainer);

  mainSection.appendChild(topRow);
  mainSection.appendChild(divider);
  mainSection.appendChild(bottomRow);

  block.textContent = '';
  block.appendChild(heroSection);
  block.appendChild(mainSection);
}
