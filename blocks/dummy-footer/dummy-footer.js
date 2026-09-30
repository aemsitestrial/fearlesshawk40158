/**
 * Decorates the dummy-footer block.
 * @param {Element} block The dummy-footer block element
 */
export default async function decorate(block) {
  // Extract all child rows/items rendered by Franklin
  const rows = [...block.children];

  // Create containers for structured sections
  const heroSection = document.createElement('div');
  heroSection.classList.add('dummy-footer-hero');

  const mainSection = document.createElement('div');
  mainSection.classList.add('dummy-footer-main');

  const topRow = document.createElement('div');
  topRow.classList.add('dummy-footer-top-row');

  const brandContainer = document.createElement('div');
  brandContainer.classList.add('dummy-footer-brand');

  const navLinksList = document.createElement('ul');
  navLinksList.classList.add('dummy-footer-links');

  const divider = document.createElement('div');
  divider.classList.add('dummy-footer-divider');

  const bottomRow = document.createElement('div');
  bottomRow.classList.add('dummy-footer-bottom-row');

  const copyrightEl = document.createElement('div');
  copyrightEl.classList.add('dummy-footer-copyright');

  const legalLinksList = document.createElement('ul');
  legalLinksList.classList.add('dummy-footer-legal-links');

  // Process authored rows
  rows.forEach((row) => {
    const firstCol = row.children[0];
    const secondCol = row.children[1];

    // 1. Hero / Search Row
    if (row.querySelector('h1, h2, h3') || row.classList.contains('dummy-footer-hero')) {
      const heading = row.querySelector('h1, h2, h3, p');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent;
        heroSection.appendChild(h2);
      }

      // Search Box Construction
      const searchBox = document.createElement('div');
      searchBox.classList.add('dummy-footer-search');

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = secondCol ? secondCol.textContent.trim() : 'Ask TCS...';
      input.setAttribute('aria-label', 'Search');

      const micIcon = document.createElement('div');
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
    } else if (row.querySelector('img')) {
      // 2. Brand Logo Row
      const img = row.querySelector('img');
      brandContainer.appendChild(img.cloneNode(true));
    } else if (row.querySelector('a') && !row.classList.contains('legal')) {
      // 3. Navigation Links Row
      const link = row.querySelector('a');
      const li = document.createElement('li');
      li.appendChild(link.cloneNode(true));
      navLinksList.appendChild(li);
    } else if (secondCol || row.textContent.toLowerCase().includes('copyright')) {
      // 4. Copyright & Legal Links Row
      if (firstCol && firstCol.textContent.trim()) {
        copyrightEl.textContent = firstCol.textContent.trim();
      }
      const legalLinks = row.querySelectorAll('a');
      legalLinks.forEach((link) => {
        const li = document.createElement('li');
        li.appendChild(link.cloneNode(true));
        legalLinksList.appendChild(li);
      });
    }
  });

  // Assemble Top Row (Brand + Main Nav Links)
  topRow.appendChild(brandContainer);
  topRow.appendChild(navLinksList);

  // Assemble Bottom Row (Copyright + Legal Links)
  bottomRow.appendChild(copyrightEl);
  bottomRow.appendChild(legalLinksList);

  // Assemble Main Section
  mainSection.appendChild(topRow);
  mainSection.appendChild(divider);
  mainSection.appendChild(bottomRow);

  // Clear original authored content and replace with structured markup
  block.textContent = '';
  block.appendChild(heroSection);
  block.appendChild(mainSection);
}
