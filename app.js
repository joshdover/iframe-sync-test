window.startApp = function() {
  const div = document.getElementById("my_app");
  const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

  async function pushStates() {
    await delay();
    window.history.pushState({}, 'Page 2', '/page2');
    div.innerText = "Page 2";
    await delay();
    window.history.pushState({}, 'Page 3', '/page3');
    div.innerText = "Page 3";
    await delay();
    window.history.pushState({}, 'Page 4', '/page4');
    div.innerText = "Page 4";
    await delay();
    window.history.go(-2);
    div.innerText = "Page 2";
    await delay();
    window.history.back();
    div.innerText = "";
  }

  pushStates();
}
