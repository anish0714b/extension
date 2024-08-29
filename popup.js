/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;

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
    if (querySelector(extConfig.selectors.menuContainer)?.offsetParent === null) {
        return querySelector(extConfig.selectors.buttons.regular.desktopMenu);
    } else {
        return querySelector(extConfig.selectors.buttons.regular.desktopNoMenu);
    }
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

function buttons_getLikeTextContainer() {
    return querySelector(extConfig.selectors.likeTextContainer, buttons_getLikeButton());
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
            ? querySelector(["#dislike-button"], buttons_getButtons())
            : querySelector(
                extConfig.selectors.buttons.dislikeButton.notSegmented,
                buttons_getButtons(),
            );
}
function buttons_getShareButton() {
    return querySelector(extConfig.selectors.buttons.shareButton, buttons_getButtons());
}
function buttons_getSubscribeButton() {
    return querySelector(extConfig.selectors.buttons.subscribeButton, buttons_getButtons());
}
function buttons_getCommentSection() {
    return querySelector(extConfig.selectors.commentSection);
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
function buttons_clickShareButton() {
    const shareButton = buttons_getShareButton();
    if (shareButton && isElementVisible(shareButton)) {
        shareButton.click();
    }
}
function buttons_clickSubscribeButton() {
    const subscribeButton = buttons_getSubscribeButton();
    if (subscribeButton && isElementVisible(subscribeButton)) {
        subscribeButton.click();
    }
}
function scrollToCommentSection() {
    const commentSection = buttons_getCommentSection();
    if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
function getLikeCount() {
    const likeTextContainer = buttons_getLikeTextContainer();
    return likeTextContainer ? likeTextContainer.innerText : null;
}
function getDislikeCount() {
    const dislikeTextContainer = querySelector(extConfig.selectors.dislikeTextContainer, buttons_getDislikeButton());
    return dislikeTextContainer ? dislikeTextContainer.innerText : null;
}
function getShareCount() {
    const shareTextContainer = querySelector(extConfig.selectors.shareTextContainer, buttons_getShareButton());
    return shareTextContainer ? shareTextContainer.innerText : null;
}
function createDislikeTextContainer() {
  const textNodeClone = (
    buttons_getLikeButton().querySelector(
      ".yt-spec-button-shape-next__button-text-content",
    ) ||
    buttons_getLikeButton().querySelector("button > div[class*='cbox']") ||
    (
      buttons_getLikeButton().querySelector('div > span[role="text"]') ||
      document.querySelector(
        'button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]',
      )
    ).parentNode
  ).cloneNode(true);
  const insertPreChild = buttons_getDislikeButton().querySelector("button");
  insertPreChild.insertBefore(textNodeClone, null);
  buttons_getDislikeButton()
    .querySelector("button")
    .classList.remove("yt-spec-button-shape-next--icon-button");
  buttons_getDislikeButton()
    .querySelector("button")
    .classList.add("yt-spec-button-shape-next--icon-leading");
  if (textNodeClone.querySelector("span[role='text']") === null) {
    const span = document.createElement("span");
    span.setAttribute("role", "text");
    while (textNodeClone.firstChild) {
      textNodeClone.removeChild(textNodeClone.firstChild);
    }
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
  if (
    document.querySelector(
      "a[href^='https://accounts.google.com/ServiceLogin']",
    )
  ) {
    return true;
  } else {
    return false;
  }
}

})();
