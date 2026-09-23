function getField(block, name, fallback = '') {
  const field = block.querySelector(`[data-aue-prop="${name}"]`);

  if (field) return field.textContent.trim() || field.dataset.value || fallback;

  return block.dataset[name] || fallback;
}

function getBoolean(block, name, fallback = false) {
  const value = getField(block, name, String(fallback)).toLowerCase();

  return value === 'true' || value === 'yes' || value === '1';
}

function getFieldValues(block, name) {
  return [...block.querySelectorAll(`[data-aue-prop="${name}"]`)]

    .map((field) => field.textContent.trim() || field.dataset.value || '')

    .filter(Boolean);
}

function slugify(value) {
  return `/${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function getNavigationLinks(block) {
  // Query multi-field labels and links from Universal Editor DOM output

  let labels = getFieldValues(block, 'label');

  let links = getFieldValues(block, 'link');

  // Fallbacks for legacy/alternative field names

  if (!labels.length) labels = getFieldValues(block, 'navigationLabel');

  if (!links.length) links = getFieldValues(block, 'navigationLink');

  // Match labels and links into structured objects

  if (labels.length || links.length) {
    const maxLength = Math.max(labels.length, links.length);

    const result = [];

    for (let i = 0; i < maxLength; i += 1) {
      const text = labels[i] || links[i] || `Link ${i + 1}`;

      const href = links[i] || slugify(text);

      result.push({ text, href });
    }

    return result;
  }

  // Fallback for plain-text string entries

  const plainText = block.querySelector('[data-aue-prop="navigationItems"]')?.textContent || '';

  if (plainText) {
    return plainText

      .split(/\r?\n|,|;/)

      .map((text) => text.trim())

      .filter(Boolean)

      .map((text) => ({ href: slugify(text), text }));
  }

  return [];
}

function createLink(href, text, className = '') {
  const link = document.createElement('a');

  link.href = href;

  link.textContent = text;

  if (className) link.className = className;

  return link;
}

export default function decorate(block) {
  const variant = getField(block, 'headerVariant', 'standard').toLowerCase();

  const brandName = getField(block, 'brandName', 'Brand');

  const brandLink = getField(block, 'brandLink', '/');

  const brandLogo = getField(block, 'brandLogo');

  const ctaText = getField(block, 'ctaText');

  const ctaLink = getField(block, 'ctaLink');

  const showSearch = getBoolean(block, 'showSearch', true);

  const navigationLinks = getNavigationLinks(block);

  if (variant !== 'standard') block.classList.add(variant);

  block.textContent = '';

  const nav = document.createElement('nav');

  nav.className = 'dummy-header-nav';

  nav.setAttribute('aria-label', 'Primary navigation');

  nav.setAttribute('aria-expanded', 'false');

  // 1. Render Brand Section

  const brandSection = document.createElement('div');

  brandSection.className = 'dummy-header-brand';

  const brand = createLink(brandLink, brandName, 'dummy-header-brand-link');

  if (brandLogo) {
    const logo = document.createElement('img');

    logo.src = brandLogo;

    logo.alt = brandName;

    brand.replaceChildren(logo, document.createTextNode(brandName));
  }

  brandSection.append(brand);

  // 2. Render Navigation Items

  const sections = document.createElement('div');

  sections.className = 'dummy-header-sections';

  sections.id = 'dummy-header-sections';

  const navigation = document.createElement('ul');

  navigationLinks.forEach(({ href, text }) => {
    const item = document.createElement('li');

    item.append(createLink(href, text));

    navigation.append(item);
  });

  sections.append(navigation);

  // 3. Render Tools / Actions

  const tools = document.createElement('div');

  tools.className = 'dummy-header-tools';

  const menuButton = document.createElement('button');

  menuButton.type = 'button';

  menuButton.className = 'dummy-header-menu-button';

  menuButton.setAttribute('aria-controls', 'dummy-header-sections');

  menuButton.setAttribute('aria-expanded', 'false');

  menuButton.setAttribute('aria-label', 'Open navigation');

  menuButton.innerHTML = '<span></span><span></span><span></span>';

  tools.append(menuButton);

  if (showSearch) {
    const search = createLink('/search', 'Search', 'dummy-header-search');

    search.setAttribute('aria-label', 'Search');

    tools.append(search);
  }

  if (ctaText && ctaLink) tools.append(createLink(ctaLink, ctaText, 'dummy-header-cta'));

  nav.append(brandSection, sections, tools);

  // 4. Accessibility & Mobile Menu Events

  const setMenuState = (expanded) => {
    nav.setAttribute('aria-expanded', String(expanded));

    menuButton.setAttribute('aria-expanded', String(expanded));

    menuButton.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');

    document.body.style.overflow = expanded ? 'hidden' : '';
  };

  menuButton.addEventListener('click', () => setMenuState(nav.getAttribute('aria-expanded') !== 'true'));

  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuState(false);

      menuButton.focus();
    }
  });

  block.append(nav);
}
