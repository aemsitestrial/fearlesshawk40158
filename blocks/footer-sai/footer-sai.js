export default function decorate(block) {
  // Container wrappers
  const heroContainer = document.createElement('div');
  heroContainer.classList.add('footer-sai-hero');

  const mainRowContainer = document.createElement('div');
  mainRowContainer.classList.add('footer-sai-main-row');

  const logosContainer = document.createElement('div');
  logosContainer.classList.add('footer-sai-logos');

  const navContainer = document.createElement('div');
  navContainer.classList.add('footer-sai-nav');

  const legalRowContainer = document.createElement('div');
  legalRowContainer.classList.add('footer-sai-legal-row');

  const legalLinksContainer = document.createElement('div');
  legalLinksContainer.classList.add('footer-sai-legal-links');

  let copyrightTextElement = null;

  // Process block children based on model structure
  [...block.children].forEach((row) => {
    // Identify item type using dataset or child structure passed by AEM Universal Editor / Franklin
    const firstColText = row.children[0]?.textContent?.trim() || '';

    // 1. Hero Block
    if (row.querySelector('h1, h2, h3, h4, input') || row.classList.contains('footer-sai-hero')) {
      heroContainer.appendChild(row);
    } else if (row.querySelector('img') || row.classList.contains('footer-sai-tcs-logo') || row.classList.contains('footer-sai-tata-logo')) {
      logosContainer.appendChild(row);
    } else if (row.querySelector('a') && !row.classList.contains('footer-sai-legal-item')) {
      navContainer.appendChild(row);
    } else {
      const copyright = row.querySelector('[data-name="copyrightText"]')?.textContent || firstColText;
      if (copyright && copyright.toLowerCase().includes('copyright')) {
        const cp = document.createElement('div');
        cp.classList.add('footer-sai-copyright');
        cp.textContent = copyright;
        copyrightTextElement = cp;
      }
      legalLinksContainer.appendChild(row);
    }
  });

  // Assemble Main Row
  mainRowContainer.appendChild(logosContainer);
  mainRowContainer.appendChild(navContainer);

  // Assemble Legal Row
  if (copyrightTextElement) {
    legalRowContainer.appendChild(copyrightTextElement);
  }
  legalRowContainer.appendChild(legalLinksContainer);

  // Clear original content and attach structured elements
  block.textContent = '';
  block.appendChild(heroContainer);
  block.appendChild(mainRowContainer);
  block.appendChild(document.createElement('hr'));
  block.appendChild(legalRowContainer);
}
