import ElementClass from './player';

const name = 'video-player';

if (customElements.get(name)) {
  console.log(`Custom element "${name}" already defined`);
} else {
  window.customElements.define(name, ElementClass);
}
