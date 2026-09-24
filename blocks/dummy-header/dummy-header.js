function getField(block, name, fallback = '') {
  const field = block.querySelector(`[data-aue-prop="${name}"]`);

  if (field) return field.textContent.trim() || field.dataset.value || fallback;

  return block.dataset[name] || fallback;
}

function getBoolean(block, name, fallback = false) {
  const value = getField(block, name, String(fallback)).toLowerCase();

  return value === 'true' || value === 'yes' || value === '1';
}

function slugify(value) {
  return `/${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function getNavigationLinks(block) {
  const links = [];

  // 1. Check for standard AEM Edge Delivery block table rows (div > div structure)
  const rows = [...block.children];

  rows.forEach((row) => {
    const cols = [...row.children];

    if (cols.length >= 2) {
      const labelText = cols[0].textContent.trim();
      const linkText = cols[1].textContent.trim() || cols[1].querySelector('a')?.getAttribute('href') || slugify(labelText);

      if (labelText) {
        links.push({ text: labelText, href: linkText });
      }
    }
  });

  if (links.length > 0) return links;

  // 2. Query data-aue-prop attributes (Universal Editor)
  const labelNodes = [...block.querySelectorAll('[data-aue-prop="label"], [data-aue-prop="navigationLabel"]')];
  const linkNodes = [...block.querySelectorAll('[data-aue-prop="link"], [data-aue-prop="navigationLink"]')];

  const labels = labelNodes.map((node) => node.textContent.trim() || node.dataset.value || '').filter(Boolean);
  const hrefs = linkNodes.map((node) => node.textContent.trim() || node.dataset.value || '').filter(Boolean);

  if (labels.length || hrefs.length) {
    const count = Math.max(labels.length, hrefs.length);

    for (let i = 0; i < count; i += 1) {
      const text = labels[i] || hrefs[i] || `Link ${i + 1}`;
      const href = hrefs[i] || slugify(text);

      links.push({ text, href });
    }

    return links;
  }

  // 3. Fallback for plain-text string entries inside container wrapper
  const containerText = block.querySelector('[data-aue-prop="navigationItems"]')?.textContent || '';

  if (containerText) {
    return containerText
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
  // Extract all values BEFORE wiping block content
  const variant = getField(block, 'headerVariant', 'standard').toLowerCase();
  const brandName = getField(block, 'brandName', 'Brand');
  const brandLink = getField(block, 'brandLink', '/');
  const brandLogo = getField(block, 'brandLogo');
  const ctaText = getField(block, 'ctaText');
  const ctaLink = getField(block, 'ctaLink');
  const showSearch = getBoolean(block, 'showSearch', true);

  // Parse links from original DOM before resetting
  const navigationLinks = getNavigationLinks(block);

  if (variant !== 'standard') block.classList.add(variant);

  // Clear original authored content
  block.textContent = '';

  const nav = document.createElement('nav');

  nav.className = 'dummy-header-nav';
  nav.setAttribute('aria-label', 'Primary navigation');

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

  if (showSearch) {
    const search = createLink('/search', 'Search', 'dummy-header-search');

    search.setAttribute('aria-label', 'Search');
    tools.append(search);
  }

  if (ctaText && ctaLink) {
    tools.append(createLink(ctaLink, ctaText, 'dummy-header-cta'));
  }

  nav.append(brandSection, sections, tools);

  block.append(nav);
}
