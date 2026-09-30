function getCells(row) {
  let cells = [...row.children];
  while (cells.length === 1 && cells[0].children.length > 1) {
    cells = [...cells[0].children];
  }
  return cells;
}

function getCellValue(cell) {
  return cell?.querySelector('a')?.getAttribute('href') || cell?.textContent?.trim() || '';
}

function createLink(label, href) {
  if (!label) return null;
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href || '#';
  return link;
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-sai-wrapper';

  const heroContainer = document.createElement('div');
  heroContainer.className = 'footer-sai-hero';
  const mainRowContainer = document.createElement('div');
  mainRowContainer.className = 'footer-sai-main-row';
  const logosContainer = document.createElement('div');
  logosContainer.className = 'footer-sai-logos';
  const navContainer = document.createElement('nav');
  navContainer.className = 'footer-sai-nav';
  navContainer.setAttribute('aria-label', 'Footer');
  const legalRowContainer = document.createElement('div');
  legalRowContainer.className = 'footer-sai-legal-row';
  const legalLinksContainer = document.createElement('nav');
  legalLinksContainer.className = 'footer-sai-legal-links';
  legalLinksContainer.setAttribute('aria-label', 'Legal');

  let copyrightTextElement = null;

  [...block.children].forEach((row) => {
    const cells = getCells(row);
    const values = cells.map(getCellValue);

    if (row.classList.contains('footer-sai-hero')) {
      const heading = document.createElement('h2');
      heading.textContent = values[0] || '';
      if (heading.textContent) heroContainer.appendChild(heading);

      if (values[1]?.toLowerCase() === 'true') {
        const form = document.createElement('form');
        form.className = 'search-container';
        form.action = values[4] || '#';
        const input = document.createElement('input');
        input.type = 'search';
        input.name = 'q';
        input.placeholder = values[3] || 'Search';
        input.setAttribute('aria-label', input.placeholder);
        const microphone = document.createElement('span');
        microphone.className = 'mic-icon';
        microphone.setAttribute('aria-hidden', 'true');
        form.append(input, microphone);
        heroContainer.appendChild(form);
      }
    } else if (row.classList.contains('footer-sai-tcs-logo') || row.classList.contains('footer-sai-tata-logo')) {
      const [imageCell] = cells;
      const [, logoAlt, logoHref] = values;
      const imageSource = getCellValue(imageCell);
      const image = imageCell?.querySelector('img')?.cloneNode(true)
        || (imageSource ? document.createElement('img') : null);
      if (image) {
        if (!image.getAttribute('src')) image.src = imageSource;
        image.alt = logoAlt || image.alt || '';
        if (logoHref) {
          const link = document.createElement('a');
          link.href = logoHref;
          link.appendChild(image);
          logosContainer.appendChild(link);
        } else {
          logosContainer.appendChild(image);
        }
      }
    } else if (row.classList.contains('footer-sai-nav-item')) {
      const link = createLink(values[0], values[1]);
      if (link) navContainer.appendChild(link);
    } else if (row.classList.contains('footer-sai-legal-item')) {
      const [copyright] = values;
      if (copyright?.toLowerCase().includes('copyright')) {
        copyrightTextElement = document.createElement('div');
        copyrightTextElement.className = 'footer-sai-copyright';
        copyrightTextElement.textContent = copyright;
      }
      const link = createLink(values[1], values[2]);
      if (link) legalLinksContainer.appendChild(link);
    }
  });

  mainRowContainer.append(logosContainer, navContainer);
  if (copyrightTextElement) legalRowContainer.appendChild(copyrightTextElement);
  legalRowContainer.appendChild(legalLinksContainer);
  wrapper.append(heroContainer, mainRowContainer, document.createElement('hr'), legalRowContainer);
  block.replaceChildren(wrapper);
}
