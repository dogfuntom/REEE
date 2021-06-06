import getUserIdentAsync from '../common/user.mjs';

async function fetchRecommendationAsync() {
    const userIdent = await getUserIdentAsync();
    const url = "http://161.35.7.92/video_recommendation/users/" + userIdent;

    /** @type {Response} */
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response) {
        if (response.ok) return await response.json();
        else throw response.status;
    }
    else {
        throw new Error('There were not response.');
    }
}

// Get the recommendations.
const recs = await fetchRecommendationAsync().catch(error => {
    if (typeof error === "number")
        console.error('Failed with response code: ' + error);
    else
        console.error(error);
});

console.log(recs);

/** @type {HTMLElement} */
const section = window.document.getElementById('section');

// Show debug-helping output.
/** @type {HTMLPreElement} */
var pre = window.document.createElement('pre');
pre.innerHTML = JSON.stringify(recs, null, 2);
section.appendChild(pre);

/**
 * @param {string[]} strIdents
 * @returns {string[]} */
function filterValidStrIdents(strIdents) {
    const re = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;
    return strIdents.filter(strIdent => re.test(strIdent));
}

// NOTE: Firefox (maybe Chrome too) extensions are not allowed to download and execute code.
// ("extensions with 'unsafe-eval', 'unsafe-inline', remote script, blob, or remote sources in their CSP are not allowed for extensions listed on addons.mozilla.org due to major security issues.")
// Thus, we can't use the main official way to inline YT videos.
// But there's an additional official way, so let's try it instead.

/** @type {string[]} */
const strIdents = filterValidStrIdents(recs.video_strIndents);
strIdents.forEach(strIdent => {
    /** @type {HTMLIFrameElement} */
    const iframeForYT = window.document.createElement('iframe');
    iframeForYT.id = 'player';
    iframeForYT.type = 'text/html';
    iframeForYT.width = 640;
    iframeForYT.height = 390;
    iframeForYT.src = `http://www.youtube.com/embed/${strIdent}?color=white&rel=0`;

    section.appendChild(iframeForYT);
});
