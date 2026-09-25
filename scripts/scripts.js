import {
  loadFooter,
  decorateTemplateAndTheme,
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  decorateBlock,
  loadBlock,
} from './aem.js';
import decorateMain from './decorate-main.js';

export { default as decorateMain } from './decorate-main.js';

/**
 * Moves all the attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter(
        (attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-'),
      ),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(doc) {
  doc.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');
    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(
        `${window.hlx.codeBasePath}/blocks/modal/modal.js`
      );
      openModal(origin.href);
    }
  });
}

/**
 * Loads the header block into the top-level <header> container.
 * Moves an authored header block from <main> if available, or constructs one automatically.
 * @param {Element} header The target <header> container element
 */
async function loadHeaderBlock(header) {
  if (!header) return null;

  const main = document.querySelector('main');
  let headerBlock = main ? main.querySelector('.header') : null;

  if (headerBlock) {
    header.replaceChildren(headerBlock);
  } else {
    headerBlock = buildBlock('header', '');
    header.append(headerBlock);
  }

  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    doc.body.dataset.breadcrumbs = true;
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');

  // Load the Header as a decorated block into <header>
  await loadHeaderBlock(doc.querySelector('header'));

  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadUniversalEditorSupport() {
  const params = new URLSearchParams(window.location.search);
  const isUniversalEditor = document.documentElement.classList.contains('adobe-ue-edit')
    || params.get('wcmmode') === 'edit'
    || params.get('wcmmode') === 'preview'
    || window.location.pathname.includes('/editor.html');
  if (isUniversalEditor) {
    // eslint-disable-next-line import/no-cycle
    await import('./editor-support.js');
  }
}

async function loadPage() {
  await loadEager(document);
  await loadUniversalEditorSupport();
  await loadLazy(document);
  loadDelayed();
}

loadPage();
