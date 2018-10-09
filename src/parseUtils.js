import pathToRegexp from 'path-to-regexp';
import qs from 'querystringify';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path) {
    if (cache[path]) return cache[path];

    const keys = [];
    const regexp = pathToRegexp(path, keys);
    const result = { regexp, keys };

    if (cacheCount < cacheLimit) {
        cache[path] = result;
        cacheCount++;
    }

    return result;
}

export function parsePath(pathname, path) {
    const { regexp, keys } = compilePath(path);
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;

    return keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
    }, {});
}

export function parseQueryString(queryString) {
    const queryStringParams = qs.parse(queryString);
    for (const key in queryStringParams) {
        if (queryStringParams[key] === 'null') {
            queryStringParams[key] = null;
        } else if (queryStringParams[key] === 'undefined') {
            queryStringParams[key] = undefined;
        }
    }
    return queryStringParams;
}

