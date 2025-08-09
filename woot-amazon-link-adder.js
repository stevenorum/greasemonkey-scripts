// ==UserScript==
// @name         WALA: Woot-Amazon Link Adder
// @namespace    https://github.com/stevenorum/greasemonkey-scripts
// @version      2025-08-09
// @description  Add links to the Amazon listings for products on Woot.
// @author       stevenorum
// @match        https://*.woot.com/offers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woot.com
// @grant        none
// ==/UserScript==

function getAsin() {
    if (offerItems) {
        const asin = offerItems[0].Asin;
        if (asin) {
           console.log(`ASIN = ${asin}`);
            return asin;
        }
    }
    return undefined;
}

function addProductLinks(asin) {
    // Yes, I know smile.amazon.com was shut down years ago. I'm just still annoyed that it was and only use smile... URLs in case anyone is watching the metrics.
    const product_url = `https://smile.amazon.com/dp/${asin}`;
    if (document.querySelector('a.ui-rr-review-label')) {
        addProductLinksWithReviews(product_url);
    } else {
        addProductLinksWithoutReviews(product_url);
    }
    console.log("Amazon links added.");
}

function addLinksToBit(parent, product_url) {
    const link1 = document.createElement("a");
    link1.setAttribute("class", "ui-rr-review-label");
    link1.href = product_url;
    link1.text = " [Amazon]";
    parent.appendChild(link1);

    const link2 = link1.cloneNode(true);
    link2.text = " [new tab]";
    link2.target = "_blank";
    parent.appendChild(link2);

}

function addProductLinksWithoutReviews(product_url) {
    const reviews_link = document.querySelector('span.ui-rr-review-label');
    // Shorten the original text
    reviews_link.innerHTML = "0 ratings";
    addLinksToBit(reviews_link.parentElement, product_url);
}

function addProductLinksWithReviews(product_url) {
    const reviews_link = document.querySelector('a.ui-rr-review-label');
    // Shorten the original link text slightly
    reviews_link.text = reviews_link.text.replace(" Amazon", "");
    addLinksToBit(reviews_link.parentElement, product_url);

}

console.log("WALA: loading...");
function check(changes, observer) {
    if(document.querySelector('.ui-rr-review-label')) {
        const asin = getAsin();
        if (!asin) {
            return;
        }
        observer.disconnect();
        addProductLinks(asin);
    }
}
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
