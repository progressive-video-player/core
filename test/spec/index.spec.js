import '../../src/index';
import customMatchers from '../helper/matcher';

describe('Player', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    const player = document.createElement('progressive-video-player');
    document.body.appendChild(player);
  });

  afterEach(() => {
    const player = document.querySelector('progressive-video-player');
    document.body.removeChild(player);
  });

  it('should be a Web Component wrapping HTMLVideoElement', () => {
    const player = document.querySelector('progressive-video-player');
    expect(player instanceof HTMLElement).toBe(true);
    expect(player.elem instanceof HTMLVideoElement).toBe(true);
  });
});
