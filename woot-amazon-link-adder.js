// ==UserScript==
// @name         WALA: Woot-Amazon Link Adder
// @namespace    https://github.com/stevenorum/greasemonkey-scripts
// @version      2025-08-14
// @description  Add links to the Amazon listings for products on Woot.
// @author       stevenorum
// @match        https://*.woot.com/offers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woot.com
// @grant        none
// ==/UserScript==

function getReviewContainer() {
    const w_reviews = "div.ui-product-detail-rr-container";
    const wo_reviews = "div.ui-product-detail-rr-container-no-active";
    if (document.querySelector(w_reviews)) {
        return document.querySelector(w_reviews);
    }
    if (document.querySelector(wo_reviews)) {
        return document.querySelector(wo_reviews);
    }
    return undefined;
}

function getLinkList() {
    const list_id = "wala_link_list";
    if (document.getElementById(list_id)) {
        return document.getElementById(list_id);
    }
    const review_container = getReviewContainer();
    const link_list = document.createElement("ul");
    link_list.setAttribute("id", list_id);
    review_container.appendChild(link_list);
    return link_list;
}

function addLinksForOffer(offerItem, includeBlurb) {
    const asin = offerItem.Asin;
    const link_id = `amazon_${asin}_thistab`;
    const product_url = `https://smile.amazon.com/dp/${asin}`;
    const price = offerItem.FormattedSalePrice;
    const desc = offerItem.Key;

    if (document.getElementById(link_id) == null) {
        const link_list = getLinkList();
        const link_wrapper = document.createElement("li");
        const link1 = document.createElement("a");
        link1.setAttribute("class", "ui-rr-review-label");
        link1.setAttribute("id", link_id);
        link1.href = product_url;
        link1.text = ` [${asin}]`;
        link_wrapper.appendChild(link1);
        if (includeBlurb) {
            link_wrapper.appendChild(document.createTextNode(` (${desc} @ ${price}) `));
        }
        link_list.appendChild(link_wrapper);
        console.log(`Link for ${asin} added.`);
    }
}

console.log("WALA: loading...");
function check(changes, observer) {
    if(document.querySelector('.ui-rr-review-label')) {
            if (offerItems) {
        for (let i = 0; i < offerItems.length; i++) {
            addLinksForOffer(offerItems[i], offerItems.length>1);
        }
    }
    }
}
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
