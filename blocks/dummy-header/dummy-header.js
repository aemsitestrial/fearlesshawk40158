export default function decorate(block) {
  const [logoDiv, navDiv] = [...block.children];

  // Format Logo Block
  if (logoDiv) {
    logoDiv.className = 'dummy-header-logo';
    const link = logoDiv.querySelector('a');
    const img = logoDiv.querySelector('img');

    if (link && img) {
      link.innerHTML = '';
      link.appendChild(img);
    }
  }

  // Format Navigation Links
  if (navDiv) {
    navDiv.className = 'dummy-header-nav';
  }
}
