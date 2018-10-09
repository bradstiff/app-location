# app-location
Declarative locations for Single Page Apps. Avoids repetition with Routes and Links, and reduces boilerplate with parsing and casting parameters from URLs.
<p align="center">
  <a href="https://www.npmjs.com/package/app-location"><img src="https://img.shields.io/npm/v/app-location.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/app-location"><img src="https://img.shields.io/npm/dm/app-location.svg?style=flat-square"></a>
</p>

## Install

`npm install app-location --save`

## Usage

A `Location` is an endpoint that your app supports.  It specifies a path, and can optionally specify path and query string parameter schemas. 

A `Location` keeps your code DRY as the `Location` is defined in one place and used throughout your code to generate URLs for Routes and Links,
and to parse parameters from the browser's current location. 

The API is router-agnostic and framework-agnostic. 

`app-location` supports two primary use cases:

### Generate a URL

To generate a URL, call the Location's toUrl function and provide a literal object of values. The values will be mapped to path and query string parameters and inserted into the resulting URL.

### Parse parameters from a URL

To parse the parameters from a URL, call the Location's parseLocationParameters function. The parameter values will be parsed from window.location (or a location object you provide). The values
are validated according to the path and query string parameter schemas, cast to the appropriate data types, and returned as a literal object.

```javascript
import * as Yup from 'yup';
import Location from 'app-location';

const ArticleListLocation = new Location('/articles', null, {
    isPublished: Yup.boolean().default(true),
    categoryID: wholeNbr.nullable(),
});
const ArticleLocation = new Location('/articles/:id', { id: Yup.number().integer().positive().required() });

//Returns `articles?categoryID=1`
const url = ArticleListLocation.toUrl(null, {categoryID: 1}); 

//Returns { categoryID: 1, isPublished: true}
//Parameters with defaults are coalesced into the returned object.
//Will use window.location if a location object is not provided.
const params = ArticleListLocation.parseLocationParameters({pathname: 'articles', search:'categoryID=1'}))
```

## API

**`Location.ctor(path: string, pathParamDefs: ?schema, queryStringParamDefs: ?schema): Location`**

Defines a `Location`. pathParamDefs and queryStringParamDefs are optional and specified as Yup schemas.

**`Location.toUrl(params: ?object): string`**

Builds a URL with param values plugged in.

**`Location.path: string`**

Returns the path property.

**`Location.parseLocationParams(location: object = window.location) : object`**

Returns a literal object containing the parameters parsed from the `location`. Each parameter is validated and cast to the data type indicated in the schema. If validation fails, returns null."# app-location" 
