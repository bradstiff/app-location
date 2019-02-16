import pathToRegexp from 'path-to-regexp';
import qs from 'querystringify';
import warning from 'warning';

import isEmptyObject from './isEmptyObject';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path) {
    if (cache[path]) return cache[path];

    const generator = pathToRegexp.compile(path);

    if (cacheCount < cacheLimit) {
        cache[path] = generator;
        cacheCount++;
    }

    return generator;
}

export function generatePath(path = "/", params = {}) {
    return path === "/"
        ? path
        : compilePath(path)(params, { pretty: true });
}

export function generateQueryString(paramDefs, params = {}) {
    if (!paramDefs || isEmptyObject(paramDefs)) {
        return null;
    }
    if (isEmptyObject(params)) {
        return null;
    }

    const queryStringParams = Object
        .keys(params)
        .filter(key => Object.keys(paramDefs).indexOf(key) > -1)
        .reduce((acc, key) => {
            const value = params[key] === 'undefined' ? undefined
                : params[key] === 'null' ? null
                    : params[key];
            const paramDef = paramDefs[key];
            return paramDef.default() === value
                ? acc //avoid query string clutter: don't serialize values that are the same as the default
                : {
                    [key]: params[key],
                    ...acc
                }
        }, null);

    return qs.stringify(queryStringParams);
}

export function validateParams(paramSchema, params, generateWarning = false) {
    if (!paramSchema) {
        return true;
    }
    try {
        paramSchema.validateSync(params);
    } catch (err) {
        const { name, errors } = err;
        if (name === 'ValidationError') {
            if (generateWarning) warning(false, `validateParams: ${errors[0]}`);
        } else {
            throw err;
        }
        return false;
    }
    return true;
}
