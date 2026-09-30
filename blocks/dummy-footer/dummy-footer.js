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

  const navLinksContainer = document.createElement('div');
  navLinksContainer.classList.add('dummy-footer-links');

  const divider = document.createElement('div');
  divider.classList.add('dummy-footer-divider');

  const bottomRow = document.createElement('div');
  bottomRow.classList.add('dummy-footer-bottom-row');

  const copyrightEl = document.createElement('div');
  copyrightEl.classList.add('dummy-footer-copyright');

  const legalLinksContainer = document.createElement('div');
  legalLinksContainer.classList.add('dummy-footer-legal-links');

  // Track if search box has already been created
  let searchBoxCreated = false;

  rows.forEach((row) => {
    const textContent = row.textContent.trim().toLowerCase();
    const cols = [...row.children];

    // 1. Hero Title & Search Box
    if (row.querySelector('h1, h2, h3') || textContent.includes('build the future')) {
      const heading = row.querySelector('h1, h2, h3, p') || row;
      const title = document.createElement('h2');
      title.classList.add('dummy-footer-title');
      title.textContent = heading.textContent.trim();
      heroSection.appendChild(title);

      if (!searchBoxCreated) {
        const searchBox = document.createElement('div');
        searchBox.classList.add('dummy-footer-search');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ask TCS...';
        input.setAttribute('aria-label', 'Ask TCS');

        const micIcon = document.createElement('span');
        micIcon.classList.add('search-mic-icon');
        micIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        `;

        searchBox.appendChild(input);
        searchBox.appendChild(micIcon);
        heroSection.appendChild(searchBox);
        searchBoxCreated = true;
      }
    } else if (row.querySelector('img')) {
      // 2. Logos / Brand Images
      const imgs = row.querySelectorAll('img');
      imgs.forEach((img) => {
        brandContainer.appendChild(img.cloneNode(true));
      });
    } else if (textContent.includes('copyright') || textContent.includes('all rights reserved')) {
      // 3. Copyright & Legal Links
      if (cols[0] && cols[0].textContent.trim()) {
        copyrightEl.textContent = cols[0].textContent.trim();
      } else {
        copyrightEl.textContent = row.textContent.trim();
      }

      const legalAnchors = row.querySelectorAll('a');
      legalAnchors.forEach((a) => {
        legalLinksContainer.appendChild(a.cloneNode(true));
      });
    } else if (row.querySelector('a')) {
      // 4. Primary Navigation Links
      const anchors = row.querySelectorAll('a');
      anchors.forEach((a) => {
        navLinksContainer.appendChild(a.cloneNode(true));
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
