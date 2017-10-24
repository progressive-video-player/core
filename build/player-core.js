(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.PVP = {})));
}(this, (function (exports) { 'use strict';

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
    const parent = this.parent = this.parentNode;
    parent.appendChild(this.elem);
  }

  disconnectedCallback() {
    // console.log('==> Player.disconnectedCallback');
    const parent = this.parent;
    if (parent.contains(this.elem)) {
      parent.removeChild(this.elem);
    }
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

class SkinPlugin extends HTMLElement {
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

class VideoPlugin extends HTMLElement {
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

exports.Player = Player;
exports.SkinPlugin = SkinPlugin;
exports.VideoPlugin = VideoPlugin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
