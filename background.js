chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('WebClient/instructor.html', {
    'outerBounds': {
      'width': 1366,
      'height': 700
    }
  });
});