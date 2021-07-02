import getUserIdentAsync from '../common/user.mjs';

window.document.getElementById('testButton3').onclick = async () => {
    const objResults = await browser.history.search({
        'text': 'https://www.youtube.com/watch?v=',
        'startTime': 0,
        'maxResults': 1000000
    });

    console.log(objResults);
    window.document.getElementById('testPre3').innerHTML = JSON.stringify(objResults, null, 2);
};

/* Reminder: browser history search returns this:
[
    {
      "id": "cayDH6GUEtbD (id of the history entry, not the video)",
      "url": "https://www.youtube.com/watch?v=OTJhuDRAG8s",
      "title": "The title of the page (not video) - YouTube",
      "lastVisitTime": 1622725346443 (date if what format?),
      "visitCount": 1
    }
]
 */

/**
 * @param {Array} objResults
 * @returns {Array}
 */
function convertHistorySearchResultsToReeeFormat(objResults) {
    var objVideos = [];

    for (var objResult of objResults) {
        if (objResult.url.indexOf('https://www.youtube.com/watch?v=') !== 0) {
            continue;

        } else if ((objResult.title === undefined) || (objResult.title === null)) {
            continue;

        }

        if (objResult.title.indexOf(' - YouTube') === objResult.title.length - 10) {
            objResult.title = objResult.title.slice(0, -10)
        }

        objVideos.push({
            'strIdent': objResult.url.substr(32, 11),
            'intTimestamp': objResult.lastVisitTime,
            'strTitle': objResult.title,
            'intCount': objResult.visitCount
        });
    }

    return objVideos;
}

/** @returns {Object} */
async function makeHistoryPostAsync() {
    const userIdent = await getUserIdentAsync();

    const objResults = await browser.history.search({
        'text': 'https://www.youtube.com/watch?v=',
        'startTime': 0,
        'maxResults': 1000000
    });
    const userHistory = convertHistorySearchResultsToReeeFormat(objResults);

    return { userIdent, userHistory };
}

window.document.getElementById('testButton4').onclick = async () => {
/*     const userIdent = await getUserIdentAsync();

    const objResults = await browser.history.search({
        'text': 'https://www.youtube.com/watch?v=',
        'startTime': 0,
        'maxResults': 1000000
    });
    const userHistory = convertHistorySearchResultsToReeeFormat(objResults);

    const data = { userIdent, userHistory }; */

    const data = await makeHistoryPostAsync();
    console.log(data);
    window.document.getElementById('testPre4').innerHTML = JSON.stringify(data, null, 2);
};

window.document.getElementById('testButton5').onclick = async () => {
    const data = await makeHistoryPostAsync();
    console.log(data);

    // let message = JSON.stringify(data);

    /** @type {HTMLParagraphElement} */
    const testP5 = window.document.getElementById('testP5');
    testP5.textContent = 'sending...';

    // let request = new XMLHttpRequest();
/*     request.onload = () => { testP5.textContent = 'success' };
    request.onabort = () => { testP5.textContent = 'abort' };
    request.onerror = () => { testP5.textContent = 'error' };
    request.ontimeout = () => { testP5.textContent = 'timeout' };

    request.open("POST", "http://161.35.7.92/video_recommendation/users", true);
    request.send(message); */

    /** @type {Response} */
    const response = await fetch("http://161.35.7.92/video_recommendation/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    }).catch(error => testP5.textContent = error);

    if (response) {
        if (response.ok) testP5.textContent = JSON.stringify(await response.json());
        else testP5.textContent = 'failed: ' + response.status;
    }
};

window.document.getElementById('testButton6').onclick = async () => {
    /** @type {HTMLParagraphElement} */
    const testPre6 = window.document.getElementById('testPre6');
    testPre6.textContent = 'fetching...';

    const userIdent = await getUserIdentAsync();
    const url = "http://161.35.7.92/video_recommendation/users/" + userIdent;

    /** @type {Response} */
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => testPre6.textContent = error);

    if (response) {
        if (response.ok) testPre6.textContent = JSON.stringify(await response.json(), null, 2);
        else testPre6.textContent = 'failed: ' + response.status;
    }
};

/* window.document.getElementById('legacyButton').onclick = () => {
    chrome.tabs.create({
        'url': '../content/index.html'
    });
}; */
