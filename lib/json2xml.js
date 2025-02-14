/**
 * Converts JSON object to XML string.
 *
 *
 * Copyright(c) 2011 Etienne Lachance <et@etiennelachance.com>
 * MIT Licensed
 */


/*
 *
 *  Modifications (Marcus Vinicius <marcusvi200@gmail.com>):
 *  Added support for typescript
 */

/*
 * Modifications (Ivo Georgiev <ivo@linvo.org>):
 *  Escape XML entities to avoid breaking the XML if any string in the JSON contains a special char
 *  Ignore special objects - objects that inherit other objects (in practice, when working with a third-party library, most of those are circular structures)
 */

/*
 *  Modifications (Alan Clarke <hi@alz.so>):
 *  added unit tests, ability to add xml node attributes, xml header option and simplified syntax
 *  removed root node, this is already covered by the module's default functionality
 */

var util = require('util');

var settings = {
    attributes_key: false,
    header: false
};

module.exports = function xml(json, opts, field) {
    'use strict';

    if (opts) {
        Object.keys(settings).forEach(function (k) {
            if (opts[k] === undefined) {
                opts[k] = settings[k];
            }
        });
    } else {
        opts = settings;
    }

    var result = opts.header ? '<?xml version="1.0" encoding="UTF-8"?>' : '';
    opts.header = false;

    if (json instanceof Array) { //Array
        json.forEach(function (node) {
            if (field) {
                result += util.format('<%s>%s</%s>', field, xml(node, opts), field);
            } else {
                result += xml(node, opts);
            }
        });
    } else if (typeof json === 'object') {
        Object.keys(json).forEach(function (key) {
            if (key !== opts.attributes_key) {
                var node = json[key],
                    attributes = '';

                if (node === undefined || node === null) {
                    node = '';
                }

                if (opts.attributes_key && json[opts.attributes_key]) {
                    Object.keys(json[opts.attributes_key]).forEach(function (k) {
                        attributes += util.format(' %s="%s"', k, json[opts.attributes_key][k]);
                    });
                }
                var inner = xml(node, opts, key);

                if (inner) {
                    if (!!node.length && typeof node !== 'string' && attributes === '') {
                        result += xml(node, opts, key);
                    } else {
                        result += util.format("<%s%s>%s</%s>", key, attributes, xml(node, opts, key), key);
                    }
                } else {
                    result += util.format("<%s%s/>", key, attributes);
                }
            }
        });
    } else {
        if (json.toString().match(/^<\!\[CDATA\[.*]]>$/)) {
            return json.toString();
        }
        return json.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    return result;
};
