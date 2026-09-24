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
  const links = [];

  // 1. Check for Universal Editor container wrapper
  const container = block.querySelector('[data-aue-prop="navigationItems"]');

  if (container) {
    const itemElements = container.children.length > 0
      ? Array.from(container.children)
      : [container];

    itemElements.forEach((item) => {
      const labelEl = item.querySelector('[data-aue-prop="label"]') || item;
      const linkEl = item.querySelector('[data-aue-prop="link"]');

      const text = labelEl.textContent.trim() || labelEl.dataset.value || '';
      const href = linkEl?.textContent.trim() || linkEl?.dataset.value || slugify(text);

      if (text) {
        links.push({ text, href });
      }
    });

    if (links.length > 0) return links;
  }

  // 2. Direct Query Fallback (flat multi-fields)
  let labels = getFieldValues(block, 'label');
  let hrefs = getFieldValues(block, 'link');

  if (!labels.length) labels = getFieldValues(block, 'navigationLabel');
  if (!hrefs.length) hrefs = getFieldValues(block, 'navigationLink');

  if (labels.length || hrefs.length) {
    const maxLength = Math.max(labels.length, hrefs.length);

    for (let i = 0; i < maxLength; i += 1) {
      const text = labels[i] || hrefs[i] || `Link ${i + 1}`;
      const href = hrefs[i] || slugify(text);

      links.push({ text, href });
    }

    return links;
  }

  // 3. Fallback for plain-text entries
  const plainText = container?.textContent || '';

  if (plainText) {
    return plainText
      .split(/\r?\n|,|;/)
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({ text, href: slugify(text) }));
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
