import ElementClass from './player';

if (!customElements) {
  throw new Error('Custom Elements not supported');
}

const name = 'progressive-video-player';

if (customElements.get(name)) {
  console.log(`Custom element "${name}" already defined`);
} else {
  customElements.define(name, ElementClass);
}
