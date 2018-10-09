import warning from 'warning';
import { object as Schema } from 'yup';

import { generatePath, generateQueryString, validateParams } from './generateUtils';
import { parsePath, parseQueryString } from './parseUtils';
import isEmptyObject from './isEmptyObject';

export default class Location {
    constructor(path, pathParamDefs = {}, queryStringParamDefs = {}) {
        this._path = path;

        //todo: warn about collisions between route params and qs params
        this._pathParamDefs = pathParamDefs || {};
        this._queryStringParamDefs = queryStringParamDefs || {};

        const paramDefs = {
            ...queryStringParamDefs,
            ...pathParamDefs,
        };

        this._paramSchema = !isEmptyObject(paramDefs)
            ? Schema().shape(paramDefs)
            : null;
    }

    get path() {
        return this._path;
    }

    toUrl(params) {
        if (!this._paramSchema) {
            return this.path;
        }

        if (!validateParams(this._paramSchema, params)) {
            //params don't satisfy schema
            return null;
        }

        const path = generatePath(this.path, params);
        const queryString = generateQueryString(this._queryStringParamDefs, params);

        return queryString
            ? `${path}?${queryString}`
            : path;
    }

    parseLocationParams(location = (window && window.location)) {
        warning(location, 'location must be explicitly provided when window object is not available.');
        warning(location.pathname != undefined && location.search != undefined, 'location object must include pathname and search properties.');
        warning(location.pathname, 'location.pathname is required.');

        try {
            if (!this._paramSchema) {
                return {};
            }
            const rawParams = {
                ...parsePath(location.pathname, this.path),
                ...parseQueryString(location.search),
            };
            return this._paramSchema.validateSync(rawParams);
        } catch (err) {
            const { name, errors } = err;
            if (name === 'ValidationError') {
                warning(false, `Location.parseLocationParams: ${errors[0]}`);
            } else {
                throw err;
            }
            return null;
        }
    }
}
