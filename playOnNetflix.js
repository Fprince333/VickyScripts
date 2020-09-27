// ==VickiScript==
// @name Play on Netflix
// @id heyvicki.play-on-netflix
// @description Play on Netflix
// @utterance Ask $invocation to play The Office
// @permission native
// ==/VickiScript==

$vs.listen([/^play(\s+.*)?$/], async (req, res, match) => {
  let target = match[1];
  if (!target) return;

  if (target) {
    const url = "https://www.netflix.com/browse";
    const tabs = await browser.tabs.query({ currentWindow: true});
    for (let tab of tabs) {
      if (tab.url.includes('netflix')){
        await browser.tabs.remove(tab.id)
      }
    }
    const tab = await browser.tabs.create({ url });
    await browser.tabs.executeScript(tab.id, { code: `window.location.href = "https://www.netflix.com/search?q=${target}";` });
    waitForNewTabUrl(tab.id, `"https://www.netflix.com/search?q=${target}"`, 10000);
  }
  res.send();

});

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  });
}

async function untilDefinedOrTimeout(pollRateMs, timeoutMs, asyncPredicate) {
  const expirationTime = Date.now() + timeoutMs;
  while (expirationTime > Date.now()) {
    await delay(pollRateMs);

    const value = await asyncPredicate();
    if (value !== undefined) {
      return value;
    }
  }
}

async function waitForNewTabUrl(tabId, oldUrl, timeout) {
  const pollRateMs = 100;
  return untilDefinedOrTimeout(pollRateMs, timeout, async () => {
    const tab = await browser.tabs.get(tabId);
    if (tab.url !== oldUrl) {
      await browser.tabs.executeScript(tab.id, { code: `if (document.getElementById("title-card-0-0")) {
        document.getElementById("title-card-0-0").firstElementChild.firstElementChild.click();
        document.getElementsByClassName("color-primary")[0].click();
      };` });
    }
  });
}
