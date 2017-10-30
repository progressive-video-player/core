(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

class Player extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    // console.log('==> Player.constructor');
    super();
    this.parent = null;
    this.elem = document.createElement('video');
    this.plugins = {
      video: new Set(),
      skin: new Set(),
      ad: new Set()
    };
    // For plugins of which only one can be active
    this.activePlugins = {
      video: null
    };
  }

  connectedCallback() {
    // console.log('==> Player.connectedCallback');
    this.parent = this.parentNode;
  }

  disconnectedCallback() {
    // console.log('==> Player.disconnectedCallback');
    this.parent = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(`Attribute change: ${name} - from "${oldValue}" to "${newValue}"`);
    if (oldValue === newValue) {
      return;
    }
    if (name === 'src') {
      if (!this.parent || !this.hasChildNodes()) {
        return;
      }
      const activeVideo = this.activePlugins.video;
      if (activeVideo) {
        activeVideo.unloadVideo();
        this.activePlugins.video = null;
      }
      if (!newValue) {
        return;
      }
      const children = this.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (typeof child.loadVideo !== 'function') {
          continue;
        }
        if (child.loadVideo(this.elem, newValue)) {
          this.activePlugins.video = child;
          break;
        }
      }
    } else if (name === 'controls') {
      // Ignore
    } else {
      this.elem.setAttribute(name, newValue);
    }
  }

  addEventListener(...params) {
    this.elem.addEventListener(...params);
  }

  removeEventListener(...params) {
    this.elem.removeEventListener(...params);
  }

  registerPlugin(type, plugin) {
    // console.log(`==> Player.registerPlugin() type: ${type}, plugin: ${plugin}`);
    const set = this.plugins[type];
    if (!set) {
      return;
    }
    set.add(plugin);
    if (type !== 'video' || this.activePlugins.video) {
      return;
    }
    const srcAttr = this.getAttribute('src');
    if (!srcAttr || !plugin.loadVideo(this.elem, srcAttr)) {
      return;
    }
    this.activePlugins.video = plugin;
  }

  unregisterPlugin(type, plugin) {
    // console.log(`==> Player.unregisterPlugin() type: ${type}, plugin: ${plugin}`);
    const set = this.plugins[type];
    if (!set) {
      return;
    }
    if (this.activePlugins.video === plugin) {
      plugin.unloadVideo();
    }
    set.delete(plugin);
  }
}

if (!customElements) {
  throw new Error('Custom Elements not supported');
}

const name = 'progressive-video-player';

if (customElements.get(name)) {
  console.log(`Custom element "${name}" already defined`);
} else {
  customElements.define(name, Player);
}

})));
