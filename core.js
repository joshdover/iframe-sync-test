(function() {
  const appFrame = document.getElementById('app_frame');
  const coreDiv = document.getElementById('core');
  let currentAppRootPath = "/";

  const pageLog = (str) => {
    const p = document.createElement('p');
    p.innerText = str;
    coreDiv.appendChild(p);
  }

  function setupLocationSync() {
    const appWindow = appFrame.contentWindow;
    const syncHistory = (state) => {
      const frameLocation = appWindow.location;
      const frameUrl = `${frameLocation.pathname}${frameLocation.hash.length ? `#${frameLocation.hash}` : ''}`
      // "/" would be replaced with whatever the app's root route is
      const nextUrl = frameUrl.endsWith("app.html")
        ? currentAppRootPath
        : `${currentAppRootPath}${frameUrl}`;
      window.history.replaceState(state, appWindow.title, nextUrl);
    };

    // Monkey-patch window.history.pushState to emit a `pushstate` event.
    const originalPushState = appWindow.history.pushState.bind(
      appWindow.history
    );
    appWindow.history.pushState = (...args) => {
      originalPushState(...args);
      const ev = new Event("pushstate");
      ev.state = args[0];
      appWindow.dispatchEvent(ev);
    };

    appWindow.addEventListener('popstate', (ev) => {
      pageLog(`iframe window.location: ${appWindow.location}`);
      syncHistory(ev.state);
    });

    appWindow.addEventListener("pushstate", ev => {
      pageLog(
        `iframe window.location: ${appWindow.location}`
      );
      syncHistory(ev.state);
    });
  }

  function loadApp(appSlug) {
    currentAppRootPath = `/${appSlug}`;
    window.history.pushState({}, appSlug, currentAppRootPath);
    // In a real context, this would also mount the app inside the iframe.
    appFrame.src = "/app.html";
  }

  function startApp() {
    appFrame.contentWindow.startApp();
  }


  document.getElementById('openApp').onclick = () => {
    loadApp("myApp");
  }
  document.getElementById('restart').onclick = () => {
    window.history.replaceState({}, 'Core', '/');
    window.location.reload();
  }

  appFrame.addEventListener("load", () => {
    setupLocationSync();
    startApp();
  });
  
  // setupLocationSync();
  // appFrame.contentWindow.document
  // startApp();
})();
