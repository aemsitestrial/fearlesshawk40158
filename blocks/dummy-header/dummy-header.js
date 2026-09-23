export default async function decorate(block) {
  // Extract columns based on the 3-column definition mapping
  const [logoCol, navCol] = [...block.children];

  // 1. Process Logo/Brand Column
  if (logoCol) {
    logoCol.classList.add('dummy-header-brand');
    const logoImg = logoCol.querySelector('img');
    const logoLink = logoCol.querySelector('a');

    // Wrap logo image in an anchor link if a link text/URL was provided
    if (logoImg && logoLink && logoLink.href) {
      const linkWrapper = document.createElement('a');
      linkWrapper.href = logoLink.href;
      linkWrapper.ariaLabel = logoImg.alt || 'Home';
      logoImg.parentNode.insertBefore(linkWrapper, logoImg);
      linkWrapper.appendChild(logoImg);
      logoLink.remove();
    }
  }

  // 2. Process Navigation Column
  if (navCol) {
    navCol.classList.add('dummy-header-nav');
    const ul = navCol.querySelector('ul');
    if (ul) {
      ul.classList.add('dummy-header-menu');
      ul.querySelectorAll('li').forEach((li) => {
        li.classList.add('dummy-header-menu-item');
      });
    }
  }
}
