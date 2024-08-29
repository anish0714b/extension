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
      //YouTube Shorts can have multiple like/dislike buttons when scrolling through videos
      //However, only one of them should be visible (no matter how you zoom)
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
