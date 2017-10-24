export default class SkinPlugin extends HTMLElement {
  constructor() {
    // console.log('==> SkinPlugin.constructor');
    super();
    this.parent = null;
  }

  connectedCallback() {
    // console.log('==> SkinPlugin.connectedCallback');
    const parent = this.parent = this.parentNode;
    const container = parent.parentNode;
    if (container) {
      this.initSkin(container);
      parent.registerPlugin('skin', this);
    }
  }

  disconnectedCallback() {
    // console.log('==> SkinPlugin.disconnectedCallback');
    const parent = this.parent;
    this.deinitSkin();
    parent.unregisterPlugin('skin', this);
    this.parent = null;
  }

  initSkin(/* container */) {
    // console.log('==> SkinPlugin.initSkin');
    // To be implemented in sub class
  }

  deinitSkin() {
    // console.log('==> SkinPlugin.deinitSkin');
    // To be implemented in sub class
  }
}
