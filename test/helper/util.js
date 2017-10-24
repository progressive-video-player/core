function waitForSec(sec) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('==> waitForSec resolved');
      resolve();
    }, sec * 1000);
  });
}

export default {
  waitForSec
};
