import {Player, SkinPlugin, VideoPlugin} from '../../src/index';
import customMatchers from '../helper/matcher';

window.customElements.define('my-player', Player);
window.customElements.define('my-skin', class MySkin extends SkinPlugin {
  initSkin(/* container */) {
    // console.log(`==> MySkin.initSkin() container: ${container}`);
  }
  deinitSkin() {
    // console.log(`==> MySkin.deinitSkin()`);
  }
});
function createVideoPlugin(params) {
  return class MyVideo extends VideoPlugin {
    constructor() {
      super();
      this.loaded = false;
    }
    loadVideo(/* videoElement, url */) {
      // console.log(`==> MyVideo.loadVideo() elem: ${videoElement}, url: ${url}`);
      if (!this.loaded && params.canLoad) {
        this.loaded = true;
        // console.log('\treturn true');
        return true;
      }
      // console.log('\treturn false');
      return false;
    }
    unloadVideo() {
      // console.log(`==> MyVideo.unloadVideo()`);
      if (this.loaded) {
        this.loaded = false;
      }
    }
  };
}

window.customElements.define('my-video', createVideoPlugin({canLoad: true}));
window.customElements.define('my-video-2', createVideoPlugin({canLoad: false}));

describe('Player', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('should initialize/deinitialize skin (JS)', () => {
    const player = document.createElement('my-player');
    const skin = document.createElement('my-skin');
    player.appendChild(skin);
    expect(player.plugins.skin.size).toBe(0);
    document.body.appendChild(player);
    expect(player.plugins.skin.size).toBe(1);
    player.removeChild(skin);
    expect(player.plugins.skin.size).toBe(0);
    document.body.removeChild(player);
    expect(player.plugins.skin.size).toBe(0);
  });

  it('should initialize/deinitialize skin (HTML)', () => {
    const htmlTextPlayer = '<my-player></my-player>';
    const htmlTextSkin = '<my-skin></my-skin>';
    document.body.innerHTML = htmlTextPlayer;
    const player = document.querySelector('my-player');
    expect(player.plugins.skin.size).toBe(0);
    player.innerHTML = htmlTextSkin;
    expect(player.plugins.skin.size).toBe(1);
    player.innerHTML = '';
    expect(player.plugins.skin.size).toBe(0);
    document.body.innerHTML = '';
    expect(player.plugins.skin.size).toBe(0);
  });

  it('should initialize/deinitialize skin 2 (JS)', () => {
    const player = document.createElement('my-player');
    const skin = document.createElement('my-skin');
    player.appendChild(skin);
    expect(player.plugins.skin.size).toBe(0);
    document.body.appendChild(player);
    expect(player.plugins.skin.size).toBe(1);
    document.body.removeChild(player);
    expect(player.plugins.skin.size).toBe(0);
  });

  it('should initialize/deinitialize skin 2 (HTML)', () => {
    const htmlTextPlayer = '<my-player></my-player>';
    const htmlTextSkin = '<my-skin></my-skin>';
    document.body.innerHTML = htmlTextPlayer;
    const player = document.querySelector('my-player');
    expect(player.plugins.skin.size).toBe(0);
    player.innerHTML = htmlTextSkin;
    expect(player.plugins.skin.size).toBe(1);
    document.body.innerHTML = '';
    expect(player.plugins.skin.size).toBe(0);
  });

  it('should initialize/deinitialize video (JS)', () => {
    const player = document.createElement('my-player');
    const video = document.createElement('my-video');
    player.appendChild(video);
    expect(player.plugins.video.size).toBe(0);
    document.body.appendChild(player);
    expect(player.plugins.video.size).toBe(1);
    player.removeChild(video);
    expect(player.plugins.video.size).toBe(0);
    document.body.removeChild(player);
    expect(player.plugins.video.size).toBe(0);
  });

  it('should initialize/deinitialize video (HTML)', () => {
    const htmlTextPlayer = '<my-player></my-player>';
    const htmlTextVideo = '<my-video></my-video>';
    document.body.innerHTML = htmlTextPlayer;
    const player = document.querySelector('my-player');
    expect(player.plugins.video.size).toBe(0);
    player.innerHTML = htmlTextVideo;
    expect(player.plugins.video.size).toBe(1);
    player.innerHTML = '';
    expect(player.plugins.video.size).toBe(0);
    document.body.innerHTML = '';
    expect(player.plugins.video.size).toBe(0);
  });

  it('should load/unload video (JS)', () => {
    const player = document.createElement('my-player');
    const video = document.createElement('my-video');
    player.appendChild(video);
    document.body.appendChild(player);
    expect(video.loaded).toBe(false);
    player.setAttribute('src', 'http://xxx.com');
    expect(video.loaded).toBe(true);
    player.setAttribute('src', '');
    expect(video.loaded).toBe(false);
    player.removeChild(video);
    document.body.removeChild(player);
  });

  it('should load/unload video (HTML)', () => {
    const url = 'http://xxx.com';
    const htmlTextPlayer = `<my-player src="${url}"><my-video></my-video></my-player>`;
    document.body.innerHTML = htmlTextPlayer;
    const player = document.querySelector('my-player');
    expect(player.getAttribute('src')).toBe(url);
    const video = document.querySelector('my-video');
    expect(video.loaded).toBe(true);
    document.body.innerHTML = '';
    expect(video.loaded).toBe(false);
  });

  it('should load/unload video 2 (JS)', () => {
    const player = document.createElement('my-player');
    const video = document.createElement('my-video');
    const video2 = document.createElement('my-video-2');
    player.appendChild(video2);
    player.appendChild(video);
    document.body.appendChild(player);
    expect(video.loaded).toBe(false);
    expect(video2.loaded).toBe(false);
    player.setAttribute('src', 'http://xxx.com');
    expect(video.loaded).toBe(true);
    expect(video2.loaded).toBe(false);
    player.setAttribute('src', '');
    expect(video.loaded).toBe(false);
    expect(video2.loaded).toBe(false);
    player.removeChild(video);
    document.body.removeChild(player);
  });

  it('should load/unload video 2 (HTML)', () => {
    const url = 'http://xxx.com';
    const htmlTextPlayer = `
    <my-player src="${url}">
      <my-video></my-video>
      <my-video-2></my-video-2>
    </my-player>`;
    document.body.innerHTML = htmlTextPlayer;
    const player = document.querySelector('my-player');
    expect(player.getAttribute('src')).toBe(url);
    const video = document.querySelector('my-video');
    const video2 = document.querySelector('my-video-2');
    expect(video.loaded).toBe(true);
    expect(video2.loaded).toBe(false);
    document.body.innerHTML = '';
    expect(video.loaded).toBe(false);
    expect(video2.loaded).toBe(false);
  });
});
