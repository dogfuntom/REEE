// From here: https://stackoverflow.com/a/23854032/776442
/** @returns {string} */
function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}

/** @returns {Promise} */
export default async function getUserIdentAsync() {
    if (!browser.storage) throw Error('Permission for using storage is needed.');

    const items = await browser.storage.sync.get('userIdent').catch(console.error);
    if (items && items.userIdent) {
        return items.userIdent;
    } else {
        const userIdent = getRandomToken();
        await browser.storage.sync.set({userIdent: userIdent});
        return userIdent;
    }
}