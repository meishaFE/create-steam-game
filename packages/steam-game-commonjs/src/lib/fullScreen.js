const requestFullScreen = function(element) {
  return new Promise((resolve, reject) => {
    const requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;
    if (requestMethod) {
      requestMethod.call(element);
      resolve();
    } else if (typeof window.ActiveXObject !== 'undefined') {
      const wscript = new window.ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
        resolve();
      }
      reject();
    }
    reject();
  });
};

const exitFullscreen = function() {
  return new Promise((resolve, reject) => {
    const exitMethod =
      document.exitFullscreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (exitMethod) {
      exitMethod.call(document);
      resolve();
    } else if (typeof window.ActiveXObject !== 'undefined') {
      const wscript = new window.ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{ESC}');
        resolve();
      }
      reject();
    }
    reject();
  });
};

export { requestFullScreen, exitFullscreen };
