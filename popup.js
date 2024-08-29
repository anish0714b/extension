/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

function buttons_getButtons() {
    if (isShorts()) {
        let elements = isMobile()
            ? querySelectorAll(extConfig.selectors.buttons.shorts.mobile)
            : querySelectorAll(extConfig.selectors.buttons.shorts.desktop);

        for (let element of elements) {
            if (isInViewport(element)) {
                return element;
            }
        }
    }

    if (isMobile()) {
        return document.querySelector(extConfig.selectors.buttons.regular.mobile);
    }
    return querySelector(extConfig.selectors.menuContainer)?.offsetParent === null
        ? querySelector(extConfig.selectors.buttons.regular.desktopMenu)
        : querySelector(extConfig.selectors.buttons.regular.desktopNoMenu);
}

function buttons_getLikeButton() {
    return buttons_getButtons().children[0].tagName ===
        "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
        ? querySelector(extConfig.selectors.buttons.likeButton.segmented) ??
            querySelector(
                extConfig.selectors.buttons.likeButton.segmentedGetButtons,
                buttons_getButtons(),
            )
        : querySelector(
            extConfig.selectors.buttons.likeButton.notSegmented,
            buttons_getButtons(),
        );
}

function buttons_getDislikeButton() {
    return buttons_getButtons().children[0].tagName ===
        "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
        ? querySelector(extConfig.selectors.buttons.dislikeButton.segmented) ??
            querySelector(
                extConfig.selectors.buttons.dislikeButton.segmentedGetButtons,
                buttons_getButtons(),
            )
        : isShorts()
            ? querySelector("#dislike-button", buttons_getButtons())
            : querySelector(
                extConfig.selectors.buttons.dislikeButton.notSegmented,
                buttons_getButtons(),
            );
}

function isElementVisible(element) {
    return element.offsetParent !== null;
}

function buttons_clickLikeButton() {
    const likeButton = buttons_getLikeButton();
    if (likeButton && isElementVisible(likeButton)) {
        likeButton.click();
    }
}

function buttons_clickDislikeButton() {
    const dislikeButton = buttons_getDislikeButton();
    if (dislikeButton && isElementVisible(dislikeButton)) {
        dislikeButton.click();
    }
}

function buttons_getLikeTextContainer() {
    return querySelector(extConfig.selectors.likeTextContainer, buttons_getLikeButton());
}

function createDislikeTextContainer() {
    const textNodeClone = (
        buttons_getLikeButton().querySelector(".yt-spec-button-shape-next__button-text-content") ||
        buttons_getLikeButton().querySelector("button > div[class*='cbox']") ||
        (buttons_getLikeButton().querySelector('div > span[role="text"]') ||
        document.querySelector('button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]')).parentNode
    ).cloneNode(true);

    const insertPreChild = buttons_getDislikeButton().querySelector("button");
    insertPreChild.insertBefore(textNodeClone, null);
    buttons_getDislikeButton().querySelector("button").classList.remove("yt-spec-button-shape-next--icon-button");
    buttons_getDislikeButton().querySelector("button").classList.add("yt-spec-button-shape-next--icon-leading");

    if (textNodeClone.querySelector("span[role='text']") === null) {
        const span = document.createElement("span");
        span.setAttribute("role", "text");
        textNodeClone.innerHTML = "";
        textNodeClone.appendChild(span);
    }
    textNodeClone.innerText = "";
    return textNodeClone;
}

function buttons_getDislikeTextContainer() {
    let result;
    for (const selector of extConfig.selectors.dislikeTextContainer) {
        result = buttons_getDislikeButton().querySelector(selector);
        if (result !== null) {
            break;
        }
    }
    if (result == null) {
        result = createDislikeTextContainer();
    }
    return result;
}

function checkForSignInButton() {
    return !!document.querySelector("a[href^='https://accounts.google.com/ServiceLogin']");
}

function createLikeDislikeRatioBar(likes, dislikes) {
    if (!isShorts() && !isMobile()) {
        const colorLikeStyle = extConfig.coloredBar ? `; background-color: ${getColorFromTheme(true)}` : "";
        const colorDislikeStyle = extConfig.coloredBar ? `; background-color: ${getColorFromTheme(false)}` : "";
        const widthPx = parseFloat(window.getComputedStyle(getLikeButton()).width) +
            parseFloat(window.getComputedStyle(getDislikeButton()).width) + 8;
        const widthPercent = likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

        let actions = isNewDesign() && getButtons().id === "top-level-buttons-computed"
            ? getButtons()
            : document.getElementById("menu-container");

        actions.insertAdjacentHTML(
            "beforeend",
            `
                <div class="ryd-tooltip ryd-tooltip-${isNewDesign() ? "new" : "old"}-design" style="width: ${widthPx}px">
                    <div class="ryd-tooltip-bar-container">
                        <div id="ryd-bar-container" style="width: 100%; height: 2px;${colorDislikeStyle}">
                            <div id="ryd-bar" style="width: ${widthPercent}%; height: 100%${colorLikeStyle}"></div>
                        </div>
                    </div>
                    <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" role="tooltip" tabindex="-1">
                        ${likes.toLocaleString()} / ${dislikes.toLocaleString()} - ${widthPercent.toFixed(1)}%
                    </tp-yt-paper-tooltip>
                </div>
            `,
        );
    }
}

function removeLikeDislikeRatioBar() {
    const rateBar = document.getElementById("ryd-bar-container");
    if (rateBar) {
        rateBar.parentNode.removeChild(rateBar);
    }
}

if (!isShorts()) {
    const likes = 1200; 
    const dislikes = 300; 
    createLikeDislikeRatioBar(likes, dislikes);
} else {
    removeLikeDislikeRatioBar();
}

function cLog(message) {
    console.log(`[CustomLog]: ${message}`);
}

cLog("Initialization complete");

})();


const LIKED_STATE = "LIKED_STATE";
const DISLIKED_STATE = "DISLIKED_STATE";
const NEUTRAL_STATE = "NEUTRAL_STATE";

let state_extConfig = {
  disableVoteSubmission: false,
  disableLogging: false,
  coloredThumbs: false,
  coloredBar: false,
  colorTheme: "classic",
  numberDisplayFormat: "compactShort",
  showTooltipPercentage: false,
  tooltipPercentageMode: "dash_like",
  numberDisplayReformatLikes: false,
  selectors: {
    dislikeTextContainer: [],
    likeTextContainer: [],
    buttons: {
      shorts: {
        mobile: [],
        desktop: [],
      },
      regular: {
        mobile: [],
        desktopMenu: [],
        desktopNoMenu: [],
      },
      likeButton: {
        segmented: [],
        segmentedGetButtons: [],
        notSegmented: [],
      },
      dislikeButton: {
        segmented: [],
        segmentedGetButtons: [],
        notSegmented: [],
      },
    },
    menuContainer: [],
    roundedDesign: [],
  },
};

let storedData = {
  likes: 0,
  dislikes: 0,
  previousState: NEUTRAL_STATE,
};

function state_isMobile() {
  return location.hostname == "m.youtube.com";
}

function state_isShorts() {
  return location.pathname.startsWith("/shorts");
}

function state_isNewDesign() {
  return document.getElementById("comment-teaser") !== null;
}

function state_isRoundedDesign() {
  return querySelector(state_extConfig.selectors.roundedDesign) !== null;
}


let shortsObserver = null;

if (state_isShorts() && !shortsObserver) {
  utils_cLog("Initializing shorts mutation observer");
  shortsObserver = createObserver(
    {
      attributes: true,
    },
    (mutationList) => {
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
          mutation.target.id === "button"
        ) {
          if (mutation.target.getAttribute("aria-pressed") === "true") {
            mutation.target.style.color =
              mutation.target.parentElement.parentElement.id === "like-button"
                ? utils_getColorFromTheme(true)
                : utils_getColorFromTheme(false);
          } else {
            mutation.target.style.color = "unset";
          }
          return;
        }
        utils_cLog("Unexpected mutation observer event: " + mutation.target + mutation.type);
      });
    },
  );
}

function state_isLikesDisabled() {
  if (state_isMobile()) {
    return /^\D*$/.test(getButtons().children[0].querySelector(".button-renderer-text").innerText);
  }
  return /^\D*$/.test(getLikeTextContainer().innerText);
}

function isVideoLiked() {
  if (state_isMobile()) {
    return getLikeButton().querySelector("button").getAttribute("aria-label") === "true";
  }
  return (
    getLikeButton().classList.contains("style-default-active") ||
    getLikeButton().querySelector("button")?.getAttribute("aria-pressed") === "true"
  );
}

function isVideoDisliked() {
  if (state_isMobile()) {
    return getDislikeButton().querySelector("button").getAttribute("aria-label") === "true";
  }
  return (
    getDislikeButton().classList.contains("style-default-active") ||
    getDislikeButton().querySelector("button")?.getAttribute("aria-pressed") === "true"
  );
}

function getState(storedData) {
  if (isVideoLiked()) {
    return { current: LIKED_STATE, previous: storedData.previousState };
  }
  if (isVideoDisliked()) {
    return { current: DISLIKED_STATE, previous: storedData.previousState };
  }
  return { current: NEUTRAL_STATE, previous: storedData.previousState };
}


function setLikes(likesCount) {
  cLog(`SET likes ${likesCount}`);
  getLikeTextContainer().innerText = likesCount;
}

function setDislikes(dislikesCount) {
  cLog(`SET dislikes ${dislikesCount}`);
  getDislikeTextContainer()?.removeAttribute("is-empty");
  if (!state_isLikesDisabled()) {
    if (state_isMobile()) {
      getButtons().children[1].querySelector(".button-renderer-text").innerText = dislikesCount;
      return;
    }
    getDislikeTextContainer().innerText = dislikesCount;
  } else {
    cLog("likes count disabled by creator");
    if (state_isMobile()) {
      getButtons().children[1].querySelector(".button-renderer-text").innerText = localize("TextLikesDisabled");
      return;
    }
    getDislikeTextContainer().innerText = localize("TextLikesDisabled");
  }
}

function getLikeCountFromButton() {
  try {
    if (state_isShorts()) {
      return false;
    }

    let likeButton =
      getLikeButton().querySelector("yt-formatted-string#text") ?? getLikeButton().querySelector("button");

    let likesStr = likeButton.getAttribute("aria-label").replace(/\D/g, "");
    return likesStr.length > 0 ? parseInt(likesStr) : false;
  } catch {
    return false;
  }
}

function processResponse(response, storedData) {
  const formattedDislike = numberFormat(response.dislikes);
  setDislikes(formattedDislike);
  if (state_extConfig.numberDisplayReformatLikes === true) {
    const nativeLikes = getLikeCountFromButton();
    if (nativeLikes !== false) {
      setLikes(numberFormat(nativeLikes));
    }
  }
  storedData.dislikes = parseInt(response.dislikes);
  storedData.likes = getLikeCountFromButton() || parseInt(response.likes);
  createRateBar(storedData.likes, storedData.dislikes);
  if (state_extConfig.coloredThumbs === true) {
    if (state_isShorts()) {
      let shortLikeButton = getLikeButton().querySelector("tp-yt-paper-button#button");
      let shortDislikeButton = getDislikeButton().querySelector("tp-yt-paper-button#button");
      if (shortLikeButton.getAttribute("aria-pressed") === "true") {
        shortLikeButton.style.color = getColorFromTheme(true);
      }
      if (shortDislikeButton.getAttribute("aria-pressed") === "true") {
        shortDislikeButton.style.color = getColorFromTheme(false);
      }
      shortsObserver.observe(shortLikeButton);
      shortsObserver.observe(shortDislikeButton);
    } else {
      getLikeButton().style.color = getColorFromTheme(true);
      getDislikeButton().style.color = getColorFromTheme(false);
    }
  }
}
function displayError(error) {
  getDislikeTextContainer().innerText = localize("textTempUnavailable");
}

async function setState(storedData) {
  storedData.previousState = isVideoDisliked() ? DISLIKED_STATE : isVideoLiked() ? LIKED_STATE : NEUTRAL_STATE;
  let statsSet = false;
  cLog("Video is loaded. Adding buttons...");

  let videoId = getVideoId(window.location.href);
  let likeCount = getLikeCountFromButton() || null;

  let response = await fetch(`${apiUrl}/votes?videoId=${videoId}&likeCount=${likeCount || ""}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) displayError(response.error);
      return response;
    })
    .then((response) => response.json())
    .catch(displayError);
  cLog("response from api:");
  cLog(JSON.stringify(response));
  if (response !== undefined && !("traceId" in response) && !statsSet) {
    processResponse(response, storedData);
  }
}

async function initializeSelectors() {
  console.log("initializing selectors");
  let result = await fetch(`${apiUrl}/configs/selectors`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {});
  state_extConfig.selectors = result ?? state_extConfig.selectors;
  console.log(result);
}

function initializeDisableVoteSubmission() {
  getBrowser().storage.sync.get(["disableVoteSubmission"], (res) => {
    if (res.disableVoteSubmission === undefined) {
      getBrowser().storage.sync.set({ disableVoteSubmission: false });
    } else {
      state_extConfig.disableVoteSubmission = res.disableVoteSubmission;
    }
  });
}

function initializeDisableLogging() {
  getBrowser().storage.sync.get(["disableLogging"], (res) => {
    if (res.disableLogging === undefined) {
      getBrowser().storage.sync.set({ disableLogging: true });
    } else {
      state_extConfig.disableLogging = res.disableLogging;
    }
  });
}

function initializeColoredThumbs() {
  getBrowser().storage.sync.get(["coloredThumbs"], (res) => {
    if (res.coloredThumbs === undefined) {
      getBrowser().storage.sync.set({ coloredThumbs: false });
    } else {
      state_extConfig.coloredThumbs = res.coloredThumbs;
    }
  });
}

function initializeColoredBar() {
  getBrowser().storage.sync.get(["coloredBar"], (res) => {
    if (res.coloredBar === undefined) {
      getBrowser().storage.sync.set({ coloredBar: false });
    } else {
      state_extConfig.coloredBar = res.coloredBar;
    }
  });
}

function initializeColorTheme() {
  getBrowser().storage.sync.get(["colorTheme"], (res) => {
    if (res.colorTheme === undefined) {
      getBrowser().storage.sync.set({ colorTheme: false });
    } else {
      state_extConfig.colorTheme = res.colorTheme;
    }
  });
}

function initializeNumberDisplayFormat() {
  getBrowser().storage.sync.get(["numberDisplayFormat"], (res) => {
    if (res.numberDisplayFormat === undefined) {
      getBrowser().storage.sync.set({ numberDisplayFormat: "compactShort" });
    } else {
      state_extConfig.numberDisplayFormat = res.numberDisplayFormat;
    }
  });
}

function initializeTooltipPercentage() {
  getBrowser().storage.sync.get(["showTooltipPercentage"], (res) => {
    if (res.showTooltipPercentage === undefined) {
      getBrowser().storage.sync.set({ showTooltipPercentage: false });
    } else {
      state_extConfig.showTooltipPercentage = res.showTooltipPercentage;
    }
  });
}




function initializeTooltipPercentageMode() {
  getBrowser().storage.sync.get(["tooltipPercentageMode"], (res) => {
    if (res.tooltipPercentageMode === undefined) {
      getBrowser().storage.sync.set({ tooltipPercentageMode: "dash_like" });
    } else {
      state_extConfig.tooltipPercentageMode = res.tooltipPercentageMode;
    }
  });
}

function initializeNumberDisplayReformatLikes() {
  getBrowser().storage.sync.get(["numberDisplayReformatLikes"], (res) => {
    if (res.numberDisplayReformatLikes === undefined) {
      getBrowser().storage.sync.set({ numberDisplayReformatLikes: false });
    } else {
      state_extConfig.numberDisplayReformatLikes = res.numberDisplayReformatLikes;
    }
  });
}

function utils_numberFormat(numberState) {
  return getNumberFormatter(extConfig.numberDisplayFormat).format(numberState);
}

function getNumberFormatter(optionSelect) {
  let userLocales;
  if (document.documentElement.lang) {
    userLocales = document.documentElement.lang;
  } else if (navigator.language) {
    userLocales = navigator.language;
  } else {
    try {
      userLocales = new URL(
        Array.from(document.querySelectorAll("head > link[rel='search']"))
          ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
          ?.getAttribute("href"),
      )?.searchParams?.get("locale");
    } catch {
      utils_cLog("Cannot find browser locale. Use en as default for number formatting.");
      userLocales = "en";
    }
  }

  let formatterNotation;
  let formatterCompactDisplay;
  switch (optionSelect) {
    case "compactLong":
      formatterNotation = "compact";
      formatterCompactDisplay = "long";
      break;
    case "standard":
      formatterNotation = "standard";
      formatterCompactDisplay = "short";
      break;
    case "compactShort":
    default:
      formatterNotation = "compact";
      formatterCompactDisplay = "short";
  }

  const formatter = Intl.NumberFormat(userLocales, {
    notation: formatterNotation,
    compactDisplay: formatterCompactDisplay,
  });
  return formatter;
}



function utils_localize(localeString) {
  return chrome.i18n.getMessage(localeString);
}

function utils_getBrowser() {
  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
    return chrome;
  } else if (typeof browser !== "undefined" && typeof browser.runtime !== "undefined") {
    return browser;
  } else {
    console.log("browser is not supported");
    return false;
  }
}

function utils_getVideoId(url) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return (document.querySelector("meta[itemprop='videoId']") || document.querySelector("meta[itemprop='identifier']"))
      .content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
}

function utils_isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}

function isVideoLoaded() {
  const videoId = utils_getVideoId(window.location.href);
  return (
    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}



function utils_cLog(message, writer) {
  if (!state_extConfig.disableLogging) {
    message = `[return youtube dislike]: ${message}`;
    if (writer) {
      writer(message);
    } else {
      console.log(message);
    }
  }
}

function utils_getColorFromTheme(voteIsLike) {
  let colorString;
  switch (state_extConfig.colorTheme) {
    case "accessible":
      if (voteIsLike === true) {
        colorString = "dodgerblue";
      } else {
        colorString = "gold";
      }
      break;
    case "neon":
      if (voteIsLike === true) {
        colorString = "aqua";
      } else {
        colorString = "magenta";
      }
      break;
    case "classic":
    default:
      if (voteIsLike === true) {
        colorString = "lime";
      } else {
        colorString = "red";
      }
  }
  return colorString;
}

function utils_querySelector(selectors, element) {
  let result;
  for (const selector of selectors) {
    result = (element ?? document).querySelector(selector);
    if (result !== null) {
      return result;
    }
  }
}

function utils_querySelectorAll(selectors) {
  let result;
  for (const selector of selectors) {
    result = document.querySelectorAll(selector);
    if (result.length !== 0) {
      return result;
    }
  }
  return result;
}



function createObserver(options, callback) {
  const observerWrapper = new Object();
  observerWrapper.options = options;
  observerWrapper.observer = new MutationObserver(callback);
  observerWrapper.observe = function (element) {
    this.observer.observe(element, this.options);
  };
  observerWrapper.disconnect = function () {
    this.observer.disconnect();
  };
  return observerWrapper;
}

function localizeHtmlPage() {
  var objects = document.getElementsByTagName("html");
  for (var j = 0; j < objects.length; j++) {
    var obj = objects[j];

    var valStrH = obj.innerHTML.toString();
    var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : "";
    });

    if (valNewH != valStrH) {
      obj.innerHTML = valNewH;
    }
  }
}

localizeHtmlPage();
createLink(config.links.website, "link_website");
createLink(config.links.github, "link_github");
createLink(config.links.discord, "link_discord");
createLink(config.links.faq, "link_faq");
createLink(config.links.donate, "link_donate");
createLink(config.links.help, "link_help");
createLink(config.links.changelog, "link_changelog");

function createLink(url, id) {
  document.getElementById(id).addEventListener("click", () => {
    chrome.tabs.create({ url: url });
  });
}

document
  .getElementById("disable_vote_submission")
  .addEventListener("click", (ev) => {
    chrome.storage.sync.set({ disableVoteSubmission: ev.target.checked });
  });

document.getElementById("disable_logging").addEventListener("click", (ev) => {
  chrome.storage.sync.set({ disableLogging:ev.target.checked })
});

document.getElementById("colored_thumbs").addEventListener("click", (ev) => {
  chrome.storage.sync.set({ coloredThumbs: ev.target.checked });
});

document.getElementById("colored_bar").addEventListener("click", (ev) => {
  chrome.storage.sync.set({ coloredBar: ev.target.checked });
});

document.getElementById("color_theme").addEventListener("click", (ev) => {
  chrome.storage.sync.set({ colorTheme: ev.target.value });
});

document.getElementById("number_format").addEventListener("change", (ev) => {
  chrome.storage.sync.set({ numberDisplayFormat: ev.target.value });
});
