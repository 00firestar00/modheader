function getHeaders() {
    return JSON.parse(localStorage.getItem("headers"));
}

function setHeaders(headers) {
    localStorage.setItem("headers", JSON.stringify(headers));
}

function modifyHeaders(details) {
    let headers = getHeaders();
    headers.map(function (x) {
        delete x.active;
        return x
    });
    if (headers.length > 0) {
        chrome.browserAction.setBadgeText({text: headers.length.toString()});
    }
    details.requestHeaders = details.requestHeaders.concat(headers);
    console.log(details.requestHeaders);
    return {requestHeaders: details.requestHeaders};
}

function syncHeaders() {
    chrome.storage.sync.get({
        "headers": [],
    }, function (items) {
        let h = items.headers.filter(h => h.active);
        setHeaders(h);
        if (h.length > 0) {
            chrome.browserAction.setBadgeText({text: h.length.toString()});
        }
        console.log("Restore2");
        console.log(items);
    });
}

document.addEventListener('DOMContentLoaded', syncHeaders);

chrome.webRequest.onBeforeSendHeaders.addListener(
    modifyHeaders,
    {urls: ["<all_urls>"]},
    ['requestHeaders', 'blocking']
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        syncHeaders();
        console.log("syncing headers from main")
    }
);
