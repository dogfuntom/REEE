import { getUserIdentAsync, makeHistoryPostAsync } from '../common/user.mjs'

/* global browser */

browser.tabs.create({ url: '../recommendationsPage/index.html' })

window.document.getElementById('testButton3').onclick = async () => {
  const objResults = await browser.history.search({
    text: 'https://www.youtube.com/watch?v=',
    startTime: 0,
    maxResults: 1000000
  })

  console.log(objResults)
  window.document.getElementById('testPre3').innerHTML = JSON.stringify(objResults, null, 2)
}

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

window.document.getElementById('testButton4').onclick = async () => {
  /*     const userIdent = await getUserIdentAsync();

      const objResults = await browser.history.search({
          'text': 'https://www.youtube.com/watch?v=',
          'startTime': 0,
          'maxResults': 1000000
      });
      const userHistory = convertHistorySearchResultsToReeeFormat(objResults);

      const data = { userIdent, userHistory }; */

  const data = await makeHistoryPostAsync()
  console.log(data)
  window.document.getElementById('testPre4').innerHTML = JSON.stringify(data, null, 2)
}

window.document.getElementById('testButton5').onclick = async () => {
  const data = await makeHistoryPostAsync()
  console.log(data)

  // let message = JSON.stringify(data);

  /** @type {HTMLParagraphElement} */
  const testP5 = window.document.getElementById('testP5')
  testP5.textContent = 'sending...'

  // let request = new XMLHttpRequest();
  /*     request.onload = () => { testP5.textContent = 'success' };
      request.onabort = () => { testP5.textContent = 'abort' };
      request.onerror = () => { testP5.textContent = 'error' };
      request.ontimeout = () => { testP5.textContent = 'timeout' };

      request.open("POST", "http://161.35.7.92/video_recommendation/users", true);
      request.send(message); */

  /** @type {Response} */
  const response = await window.fetch('http://161.35.7.92/video_recommendation/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  }).catch(error => testP5.textContent = error)

  if (response) {
    if (response.ok) testP5.textContent = JSON.stringify(await response.json())
    else testP5.textContent = 'failed: ' + response.status
  }
}

window.document.getElementById('testButton6').onclick = async () => {
  /** @type {HTMLParagraphElement} */
  const testPre6 = window.document.getElementById('testPre6')
  testPre6.textContent = 'fetching...'

  const userIdent = await getUserIdentAsync()
  const url = 'http://161.35.7.92/video_recommendation/users/' + userIdent

  /** @type {Response} */
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(error => testPre6.textContent = error)

  if (response) {
    if (response.ok) testPre6.textContent = JSON.stringify(await response.json(), null, 2)
    else testPre6.textContent = 'failed: ' + response.status
  }
}

// async function fetchRecommendationAsync() {
//     const userIdent = await getUserIdentAsync();
//     const url = "http://161.35.7.92/video_recommendation/users/" + userIdent;

//     /** @type {Response} */
//     const response = await fetch(url, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     if (response) {
//         if (response.ok) return await response.json();
//         else throw response.status;
//     }
//     else {
//         throw new Error('There were not response.');
//     }
// }

/** @type {HTMLButtonElement} */
const tb7 = window.document.getElementById('testButton7')
tb7.onclick = async () => {
  tb7.disabled = true

  // const recs = await fetchRecommendationAsync().catch(error => {
  //     if (typeof error === "number")
  //         console.error('Failed with response code: ' + error);
  //     else
  //         console.error(error);
  // });

  // console.log(recs);
  await browser.tabs.create({ url: '../recommendationsPage/index.html' })

  tb7.disabled = false
}

/* window.document.getElementById('legacyButton').onclick = () => {
    chrome.tabs.create({
        'url': '../content/index.html'
    });
}; */
