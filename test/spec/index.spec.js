import '../../src/index';
import customMatchers from '../helper/matcher';

describe('Player', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('should a Web Component wrapping HTMLVideoElement', () => {
    const player = document.createElement('video-player');
    document.body.appendChild(player);
    expect(player instanceof HTMLElement).toBe(true);
    expect(player.elem instanceof HTMLVideoElement).toBe(true);
    document.body.removeChild(player);
  });
});

