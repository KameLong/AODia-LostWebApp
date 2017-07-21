/**
 * Create a new Window for the app
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('www/index.html', {
    bounds: {
      width: 1000,
      height: 600,
      left: 50,
      top: 50
    }
  });
});
