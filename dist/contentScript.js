/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./contentScript.js ***!
  \**************************/
// Add event listener for element click
document.addEventListener('click', (event) => {
    const element = event.target;
    const boundingBox = element.getBoundingClientRect();
  
    // Prepare the element information
    const elementInfo = {
      title: '',
      boundingBox: JSON.stringify({
        top: boundingBox.top,
        left: boundingBox.left,
        width: boundingBox.width,
        height: boundingBox.height,
      }),
      location: JSON.stringify({
        x: boundingBox.left + boundingBox.width / 2,
        y: boundingBox.top + boundingBox.height / 2,
      }),
      selectors: {
        css: getCssSelector(element),
        xpath: getXpath(element),
        // Add other relevant selectors (e.g., ID, class, etc.)
      },
      type: element.tagName,
      // Add other relevant information
    };
  
    // Send the element information to the extension
    chrome.runtime.sendMessage({ action: 'elementClicked', element: elementInfo });
  });
  
  // Get the CSS selector of an element
  function getCssSelector(element) {
    if (!(element instanceof Element)) return;
    const path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += `#${element.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = element;
        let siblingIndex = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) siblingIndex++;
        }
        if (siblingIndex !== 1) selector += `:nth-of-type(${siblingIndex})`;
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
  }
  
  // Get the XPath of an element
  function getXpath(element) {
    if (!(element instanceof Element)) return;
    const xpath = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += `[@id='${element.id}']`;
        xpath.unshift(selector);
        break;
      } else {
        let sibling = element;
        let siblingIndex = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) siblingIndex++;
        }
        if (siblingIndex !== 1) selector += `[${siblingIndex}]`;
      }
      xpath.unshift(selector);
      element = element.parentNode;
    }
    return `//${xpath.join('/')}`;
  }
  
/******/ })()
;
//# sourceMappingURL=contentScript.js.map