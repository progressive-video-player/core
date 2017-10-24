# progressive-video-player core
A custom element that wraps HTMLVideoElement API

## Usage
### Initialization
```js
import {Player} from './player-core';
import HlsPlugin from './video-plugin-hls';
import DefaultSkinPlugin from './skin-plugin-default';
import DefaultAdPlugin from './ad-plugin-default';

const customElements = window.customElements;
customElements.define('my-video', Player);
customElements.define('hls-plugin', HlsPlugin);
customElements.define('skin-plugin', DefaultSkinPlugin);
customElements.define('ad-plugin', DefaultAdPlugin);
```

### Define elements
```html
<my-video src="https://my-video.com/xxx.m3u8">
  <hls-plugin></hls-plugin>
  <skin-plugin default-language="ja"></skin-plugin>
  <ad-plugin href="https://my-ad.com/vast" ad-break-type="pre-roll"></ad-plugin>
</my-video>
```

### Property access / event handling
```js
// As my-video does not inherit from HTMLVideoElement,
// any property access (other than `src`) should be done through `elem` property
const video = document.querySelector('my-video');
console.log(`${video.elem.currentTime} / ${video.elem.duration}`);
video.elem.addEventListener('canplay', handler, false);
```

## API

### Supported Attributes
| Name       | Value                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| src        | URL of the video (video file itself or a manifest file)                              |

### Children
A child must be either of the following elements (`source` and `track` elements will be ignored.)
* Custom video plugins that inherit from `VideoPlugin`
* Custom skin plugins that inherit from `SkinPlugin`
* Custom ad plugins that inherit from `AdPlugin`

## Usage (for custom plugin development)
### Define a custom skin plugin
```js
import {SkinPlugin} from './player-core';

export default class MySkinPlugin extends SkinPlugin {
  initSkin(container) {
    // Start drawing player controller
  }

  deinitSkin() {
    // Stop drawing player controller
  }
}
```
### Define a custom video plugin
```js
import {VideoPlugin} from './player-core';

export default class MyVideoPlugin extends VideoPlugin {
  loadVideo(/* videoElement, url */) {
    // Load video
  }

  unloadVideo() {
    // Unload video
  }
}
```
