export default class VideoPlugin extends HTMLElement {
  constructor() {
    // console.log('==> VideoPlugin.constructor');
    super();
    this.parent = null;
  }

  connectedCallback() {
    // console.log('==> VideoPlugin.connectedCallback');
    const parent = this.parent = this.parentNode;
    parent.registerPlugin('video', this);
  }

  disconnectedCallback() {
    // console.log('==> VideoPlugin.disconnectedCallback');
    this.parent.unregisterPlugin('video', this);
    this.parent = null;
  }

  loadVideo(/* videoElement, url */) {
    // console.log('==> VideoPlugin.loadVideo');
    // To be implemented in sub class
  }

  unloadVideo() {
    // console.log('==> VideoPlugin.unloadVideo');
    // To be implemented in sub class
  }
}
