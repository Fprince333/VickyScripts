// ==VickiScript==
// @name Control video on a web page
// @id heyvicki.media-controls
// @utterance Ask $invocation to pause/resume/mute
// @utterance Ask $invocation to lower/increase volume
// @utterance Ask $invocation to rewind/forward
// @icon /res/icons/script_web.png
// @permission <all_urls>
// @description Finds the video element on the focused page and interacts with it.
// ==/VickiScript==

const COMMANDS = {
  stop: (ele) => ele.invoke('pause'),
  pause: (ele) => ele.invoke('pause'),
  resume: (ele) => ele.invoke('play'),
  mute: (ele) => ele.setAttr('muted', true),
  unmute: (ele) => ele.setAttr('muted', false),
  rewind: (ele) => ele.getAttr('currentTime').then(time => ele.setAttr('currentTime', time - 61)),
  forward: (ele) => ele.getAttr('currentTime').then(time => ele.setAttr('currentTime', time + 61)),
  'maximize volume': (ele) => ele.setAttr('volume', 1),
  'set volume to zero': (ele) => ele.setAttr('volume', 0),
  'set volume to one': (ele) => ele.setAttr('volume', 0.1),
  'set volume to two': (ele) => ele.setAttr('volume', 0.2),
  'set volume to three': (ele) => ele.setAttr('volume', 0.3),
  'set volume to four': (ele) => ele.setAttr('volume', 0.4),
  'set volume to five': (ele) => ele.setAttr('volume', 0.5),
  'set volume to six': (ele) => ele.setAttr('volume', 0.6),
  'set volume to seven': (ele) => ele.setAttr('volume', 0.7),
  'set volume to eight': (ele) => ele.setAttr('volume', 0.8),
  'set volume to nine': (ele) => ele.setAttr('volume', 0.9),
  'set volume to ten': (ele) => ele.setAttr('volume', 1),
};

const SUPPORTED_COMMANDS = new Set([
  "stop", "pause", "resume", "skip", "mute", "unmute", "rewind", "forward",
  "maximize volume",
  "set volume to zero",
  "set volume to one",
  "set volume to two",
  "set volume to three",
  "set volume to four",
  "set volume to five",
  "set volume to six",
  "set volume to seven",
  "set volume to eight",
  "set volume to nine",
  "set volume to ten",
  "set volume to eleven",
]);

function utteranceToCommand(utterance) {
  return utterance
    .replace("the", "")
    .replace("video", "")
    .replace("song", "")
    .replace("movie", "")
    .trim();
}

$vs.listen(async (req, res) => {
  const cmd = utteranceToCommand(req.utterance);
  if (!SUPPORTED_COMMANDS.has(cmd)) {
    return;
  }

  const tab = await $vs.utils.browser.getFocusedTab();
  if (!tab) {
    return;
  }

  if (tab.url.indexOf("http") !== 0) {
    return;
  }

  const code = `(${takeAction})("${cmd}")`;
  const error = (await browser.tabs.executeScript(tab.id, { code }))[0];
  if (error) {
    return;
  }

  return res.send();
});

function takeAction(action) {
  const ele = document.querySelector("video");
  if (!ele) {
    return "no-video";
  }

  console.log('taking action on: ', ele);

  switch (action) {
    case "stop":
    case "pause":
      ele.pause();
      break;

    case "resume":
      ele.play();
      break;

    case "skip":
      const skip = document.querySelector('[aria-label="Next Episode"]');
      skip.click();
      break;

    case "mute":
      ele.muted = true;
      break;

    case "unmute":
      ele.muted = false;
      break;

    case "rewind":
      ele.currentTime = ele.currentTime - 61;
      break;

    case "forward":
      ele.currentTime = ele.currentTime + 61;
      break;

    case "set volume to zero":
      ele.volume = 0;
      break;

    case "set volume to 1":
      ele.volume = 0.1;
      break;

    case "set volume to two":
      ele.volume = 0.2;
      break;

    case "set volume to three":
      ele.volume = 0.3;
      break;

    case "set volume to four":
      ele.volume = 0.4;
      break;

    case "set volume to five":
      ele.volume = 0.5;
      break;

    case "set volume to six":
      ele.volume = 0.6;
      break;

    case "set volume to seven":
      ele.volume = 0.7;
      break;

    case "set volume to eight":
      ele.volume = 0.8;
      break;

    case "set volume to nine":
      ele.volume = 0.9;
      break;

    case "set volume to ten":
    case "set volume to eleven":
    case "maximize volume":
      ele.volume = 1;
      break;
  }
}
