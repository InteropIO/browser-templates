import * as i from 'react';
import i__default, { createContext, memo, useState, useEffect, forwardRef, useCallback, useContext, useMemo, useLayoutEffect, useRef, useImperativeHandle } from 'react';
import * as p$1 from 'react-dom';
import p__default from 'react-dom';

const GLUE42_EVENT_NAME = "Glue42";
const MODALS_UI_FACTORY_READY = "modalsUIFactoryReady";
const REQUEST_MODALS_UI_FACTORY_READY = "requestModalsUIFactoryReady";

class EventController {
    events = {
        [REQUEST_MODALS_UI_FACTORY_READY]: { name: REQUEST_MODALS_UI_FACTORY_READY, handle: this.handleModalsUIFactoryReadyRequest.bind(this) },
    };
    wireCustomEventListener = () => {
        window.addEventListener(GLUE42_EVENT_NAME, this.handleMessage.bind(this));
    };
    notifyStarted() {
        this.send(MODALS_UI_FACTORY_READY);
    }
    handleMessage(event) {
        const data = event.detail;
        if (!data?.glue42) {
            return;
        }
        const eventName = data.glue42.event;
        const foundHandler = this.events[eventName];
        if (!foundHandler) {
            return;
        }
        foundHandler.handle(data.glue42.message);
    }
    handleModalsUIFactoryReadyRequest() {
        this.send(MODALS_UI_FACTORY_READY);
    }
    send(eventName, message) {
        const payload = { glue42: { event: eventName, message } };
        const event = new CustomEvent(GLUE42_EVENT_NAME, { detail: payload });
        window.dispatchEvent(event);
    }
}

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok$1 = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err$1 = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise$1 = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault$1 = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException$1 = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map$1 = function (f, r) {
    return r.ok === true ? ok$1(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2$1 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok$1(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError$1 = function (f, r) {
    return r.ok === true ? r : err$1(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen$1 = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

function __rest$1(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual$1(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual$1(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual$1(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray$1 = function (json) { return Array.isArray(json); };
var isJsonObject$1 = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray$1(json);
};
var typeString$1 = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot$1 = function (expected, got) {
    return "expected " + expected + ", got " + typeString$1(got);
};
var printPath$1 = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt$1 = function (newAt, _a) {
    var at = _a.at, rest = __rest$1(_a, ["at"]);
    return (__assign$1({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder$1 = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError$1(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise$1(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException$1(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map$1(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen$1(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok$1(json)
                : err$1({ message: expectedGot$1('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual$1(json, value)
                ? ok$1(value)
                : err$1({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err$1({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else if (isJsonObject$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError$1(function (err$$1) { return prependAt$1("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2$1(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok$1([]));
            }
            else if (isJsonArray$1(json)) {
                return ok$1(json);
            }
            else {
                return err$1({ message: expectedGot$1('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray$1(json)) {
                if (json.length !== decoders.length) {
                    return err$1({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err$1(prependAt$1("[" + i + "]", nth.error));
                    }
                }
                return ok$1(result);
            }
            else {
                return err$1({ message: expectedGot$1("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$1(Object.assign, acc, decoder.decode(json)); }, ok$1({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok$1(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok$1(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject$1(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err$1(prependAt$1("." + key, r.error));
                        }
                    }
                }
                return ok$1(obj);
            }
            else {
                return err$1({ message: expectedGot$1('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok$1(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err$1({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok$1(withDefault$1(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray$1(jsonAtPath)) {
                    return err$1({
                        at: printPath$1(paths.slice(0, i + 1)),
                        message: expectedGot$1('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError$1(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath$1(paths), message: 'path does not exist' }
                    : prependAt$1(printPath$1(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok$1(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err$1({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string$1 = Decoder$1.string;
/** See `Decoder.number` */
Decoder$1.number;
/** See `Decoder.boolean` */
var boolean$1 = Decoder$1.boolean;
/** See `Decoder.anyJson` */
var anyJson$1 = Decoder$1.anyJson;
/** See `Decoder.unknownJson` */
Decoder$1.unknownJson;
/** See `Decoder.constant` */
var constant$1 = Decoder$1.constant;
/** See `Decoder.object` */
var object$1 = Decoder$1.object;
/** See `Decoder.array` */
var array$1 = Decoder$1.array;
/** See `Decoder.tuple` */
Decoder$1.tuple;
/** See `Decoder.dict` */
Decoder$1.dict;
/** See `Decoder.optional` */
var optional$1 = Decoder$1.optional;
/** See `Decoder.oneOf` */
var oneOf$1 = Decoder$1.oneOf;
/** See `Decoder.union` */
Decoder$1.union;
/** See `Decoder.intersection` */
Decoder$1.intersection;
/** See `Decoder.withDefault` */
Decoder$1.withDefault;
/** See `Decoder.valueAt` */
Decoder$1.valueAt;
/** See `Decoder.succeed` */
Decoder$1.succeed;
/** See `Decoder.fail` */
Decoder$1.fail;
/** See `Decoder.lazy` */
Decoder$1.lazy;

const connectBrowserAppProps = ["name", "title", "version", "customProperties", "icon", "caption", "type"];
const fdc3v2AppProps = ["appId", "name", "type", "details", "version", "title", "tooltip", "lang", "description", "categories", "icons", "screenshots", "contactEmail", "moreInfo", "publisher", "customConfig", "hostManifests", "interop", "localizedVersions"];

/**
 * Wraps values in an `Ok` type.
 *
 * Example: `ok(5) // => {ok: true, result: 5}`
 */
var ok = function (result) { return ({ ok: true, result: result }); };
/**
 * Wraps errors in an `Err` type.
 *
 * Example: `err('on fire') // => {ok: false, error: 'on fire'}`
 */
var err = function (error) { return ({ ok: false, error: error }); };
/**
 * Create a `Promise` that either resolves with the result of `Ok` or rejects
 * with the error of `Err`.
 */
var asPromise = function (r) {
    return r.ok === true ? Promise.resolve(r.result) : Promise.reject(r.error);
};
/**
 * Unwraps a `Result` and returns either the result of an `Ok`, or
 * `defaultValue`.
 *
 * Example:
 * ```
 * Result.withDefault(5, number().run(json))
 * ```
 *
 * It would be nice if `Decoder` had an instance method that mirrored this
 * function. Such a method would look something like this:
 * ```
 * class Decoder<A> {
 *   runWithDefault = (defaultValue: A, json: any): A =>
 *     Result.withDefault(defaultValue, this.run(json));
 * }
 *
 * number().runWithDefault(5, json)
 * ```
 * Unfortunately, the type of `defaultValue: A` on the method causes issues
 * with type inference on  the `object` decoder in some situations. While these
 * inference issues can be solved by providing the optional type argument for
 * `object`s, the extra trouble and confusion doesn't seem worth it.
 */
var withDefault = function (defaultValue, r) {
    return r.ok === true ? r.result : defaultValue;
};
/**
 * Return the successful result, or throw an error.
 */
var withException = function (r) {
    if (r.ok === true) {
        return r.result;
    }
    else {
        throw r.error;
    }
};
/**
 * Apply `f` to the result of an `Ok`, or pass the error through.
 */
var map = function (f, r) {
    return r.ok === true ? ok(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok(f(ar.result, br.result));
};
/**
 * Apply `f` to the error of an `Err`, or pass the success through.
 */
var mapError = function (f, r) {
    return r.ok === true ? r : err(f(r.error));
};
/**
 * Chain together a sequence of computations that may fail, similar to a
 * `Promise`. If the first computation fails then the error will propagate
 * through. If it succeeds, then `f` will be applied to the value, returning a
 * new `Result`.
 */
var andThen = function (f, r) {
    return r.ok === true ? f(r.result) : r;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a === null && b === null) {
        return true;
    }
    if (typeof (a) !== typeof (b)) {
        return false;
    }
    if (typeof (a) === 'object') {
        // Array
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!isEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        // Hash table
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            if (!b.hasOwnProperty(keys[i])) {
                return false;
            }
            if (!isEqual(a[keys[i]], b[keys[i]])) {
                return false;
            }
        }
        return true;
    }
}
/*
 * Helpers
 */
var isJsonArray = function (json) { return Array.isArray(json); };
var isJsonObject = function (json) {
    return typeof json === 'object' && json !== null && !isJsonArray(json);
};
var typeString = function (json) {
    switch (typeof json) {
        case 'string':
            return 'a string';
        case 'number':
            return 'a number';
        case 'boolean':
            return 'a boolean';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (json instanceof Array) {
                return 'an array';
            }
            else if (json === null) {
                return 'null';
            }
            else {
                return 'an object';
            }
        default:
            return JSON.stringify(json);
    }
};
var expectedGot = function (expected, got) {
    return "expected " + expected + ", got " + typeString(got);
};
var printPath = function (paths) {
    return paths.map(function (path) { return (typeof path === 'string' ? "." + path : "[" + path + "]"); }).join('');
};
var prependAt = function (newAt, _a) {
    var at = _a.at, rest = __rest(_a, ["at"]);
    return (__assign({ at: newAt + (at || '') }, rest));
};
/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
var Decoder = /** @class */ (function () {
    /**
     * The Decoder class constructor is kept private to separate the internal
     * `decode` function from the external `run` function. The distinction
     * between the two functions is that `decode` returns a
     * `Partial<DecoderError>` on failure, which contains an unfinished error
     * report. When `run` is called on a decoder, the relevant series of `decode`
     * calls is made, and then on failure the resulting `Partial<DecoderError>`
     * is turned into a `DecoderError` by filling in the missing information.
     *
     * While hiding the constructor may seem restrictive, leveraging the
     * provided decoder combinators and helper functions such as
     * `andThen` and `map` should be enough to build specialized decoders as
     * needed.
     */
    function Decoder(decode) {
        var _this = this;
        this.decode = decode;
        /**
         * Run the decoder and return a `Result` with either the decoded value or a
         * `DecoderError` containing the json input, the location of the error, and
         * the error message.
         *
         * Examples:
         * ```
         * number().run(12)
         * // => {ok: true, result: 12}
         *
         * string().run(9001)
         * // =>
         * // {
         * //   ok: false,
         * //   error: {
         * //     kind: 'DecoderError',
         * //     input: 9001,
         * //     at: 'input',
         * //     message: 'expected a string, got 9001'
         * //   }
         * // }
         * ```
         */
        this.run = function (json) {
            return mapError(function (error) { return ({
                kind: 'DecoderError',
                input: json,
                at: 'input' + (error.at || ''),
                message: error.message || ''
            }); }, _this.decode(json));
        };
        /**
         * Run the decoder as a `Promise`.
         */
        this.runPromise = function (json) { return asPromise(_this.run(json)); };
        /**
         * Run the decoder and return the value on success, or throw an exception
         * with a formatted error string.
         */
        this.runWithException = function (json) { return withException(_this.run(json)); };
        /**
         * Construct a new decoder that applies a transformation to the decoded
         * result. If the decoder succeeds then `f` will be applied to the value. If
         * it fails the error will propagated through.
         *
         * Example:
         * ```
         * number().map(x => x * 5).run(10)
         * // => {ok: true, result: 50}
         * ```
         */
        this.map = function (f) {
            return new Decoder(function (json) { return map(f, _this.decode(json)); });
        };
        /**
         * Chain together a sequence of decoders. The first decoder will run, and
         * then the function will determine what decoder to run second. If the result
         * of the first decoder succeeds then `f` will be applied to the decoded
         * value. If it fails the error will propagate through.
         *
         * This is a very powerful method -- it can act as both the `map` and `where`
         * methods, can improve error messages for edge cases, and can be used to
         * make a decoder for custom types.
         *
         * Example of adding an error message:
         * ```
         * const versionDecoder = valueAt(['version'], number());
         * const infoDecoder3 = object({a: boolean()});
         *
         * const decoder = versionDecoder.andThen(version => {
         *   switch (version) {
         *     case 3:
         *       return infoDecoder3;
         *     default:
         *       return fail(`Unable to decode info, version ${version} is not supported.`);
         *   }
         * });
         *
         * decoder.run({version: 3, a: true})
         * // => {ok: true, result: {a: true}}
         *
         * decoder.run({version: 5, x: 'abc'})
         * // =>
         * // {
         * //   ok: false,
         * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
         * // }
         * ```
         *
         * Example of decoding a custom type:
         * ```
         * // nominal type for arrays with a length of at least one
         * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
         *
         * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
         *   array(values).andThen(arr =>
         *     arr.length > 0
         *       ? succeed(createNonEmptyArray(arr))
         *       : fail(`expected a non-empty array, got an empty array`)
         *   );
         * ```
         */
        this.andThen = function (f) {
            return new Decoder(function (json) {
                return andThen(function (value) { return f(value).decode(json); }, _this.decode(json));
            });
        };
        /**
         * Add constraints to a decoder _without_ changing the resulting type. The
         * `test` argument is a predicate function which returns true for valid
         * inputs. When `test` fails on an input, the decoder fails with the given
         * `errorMessage`.
         *
         * ```
         * const chars = (length: number): Decoder<string> =>
         *   string().where(
         *     (s: string) => s.length === length,
         *     `expected a string of length ${length}`
         *   );
         *
         * chars(5).run('12345')
         * // => {ok: true, result: '12345'}
         *
         * chars(2).run('HELLO')
         * // => {ok: false, error: {... message: 'expected a string of length 2'}}
         *
         * chars(12).run(true)
         * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
         * ```
         */
        this.where = function (test, errorMessage) {
            return _this.andThen(function (value) { return (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)); });
        };
    }
    /**
     * Decoder primitive that validates strings, and fails on all other input.
     */
    Decoder.string = function () {
        return new Decoder(function (json) {
            return typeof json === 'string'
                ? ok(json)
                : err({ message: expectedGot('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok(json)
                : err({ message: expectedGot('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok(json)
                : err({ message: expectedGot('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual(json, value)
                ? ok(value)
                : err({ message: "expected " + JSON.stringify(value) + ", got " + JSON.stringify(json) });
        });
    };
    Decoder.object = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonObject(json) && decoders) {
                var obj = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        var r = decoders[key].decode(json[key]);
                        if (r.ok === true) {
                            // tslint:disable-next-line:strict-type-predicates
                            if (r.result !== undefined) {
                                obj[key] = r.result;
                            }
                        }
                        else if (json[key] === undefined) {
                            return err({ message: "the key '" + key + "' is required but was not present" });
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else if (isJsonObject(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    Decoder.array = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonArray(json) && decoder) {
                var decodeValue_1 = function (v, i) {
                    return mapError(function (err$$1) { return prependAt("[" + i + "]", err$$1); }, decoder.decode(v));
                };
                return json.reduce(function (acc, v, i) {
                    return map2(function (arr, result) { return arr.concat([result]); }, acc, decodeValue_1(v, i));
                }, ok([]));
            }
            else if (isJsonArray(json)) {
                return ok(json);
            }
            else {
                return err({ message: expectedGot('an array', json) });
            }
        });
    };
    Decoder.tuple = function (decoders) {
        return new Decoder(function (json) {
            if (isJsonArray(json)) {
                if (json.length !== decoders.length) {
                    return err({
                        message: "expected a tuple of length " + decoders.length + ", got one of length " + json.length
                    });
                }
                var result = [];
                for (var i = 0; i < decoders.length; i++) {
                    var nth = decoders[i].decode(json[i]);
                    if (nth.ok) {
                        result[i] = nth.result;
                    }
                    else {
                        return err(prependAt("[" + i + "]", nth.error));
                    }
                }
                return ok(result);
            }
            else {
                return err({ message: expectedGot("a tuple of length " + decoders.length, json) });
            }
        });
    };
    Decoder.union = function (ad, bd) {
        var decoders = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            decoders[_i - 2] = arguments[_i];
        }
        return Decoder.oneOf.apply(Decoder, [ad, bd].concat(decoders));
    };
    Decoder.intersection = function (ad, bd) {
        var ds = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ds[_i - 2] = arguments[_i];
        }
        return new Decoder(function (json) {
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2(Object.assign, acc, decoder.decode(json)); }, ok({}));
        });
    };
    /**
     * Escape hatch to bypass validation. Always succeeds and types the result as
     * `any`. Useful for defining decoders incrementally, particularly for
     * complex objects.
     *
     * Example:
     * ```
     * interface User {
     *   name: string;
     *   complexUserData: ComplexType;
     * }
     *
     * const userDecoder: Decoder<User> = object({
     *   name: string(),
     *   complexUserData: anyJson()
     * });
     * ```
     */
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok(json); });
    };
    /**
     * Decoder for json objects where the keys are unknown strings, but the values
     * should all be of the same type.
     *
     * Example:
     * ```
     * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
     * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
     * ```
     */
    Decoder.dict = function (decoder) {
        return new Decoder(function (json) {
            if (isJsonObject(json)) {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var r = decoder.decode(json[key]);
                        if (r.ok === true) {
                            obj[key] = r.result;
                        }
                        else {
                            return err(prependAt("." + key, r.error));
                        }
                    }
                }
                return ok(obj);
            }
            else {
                return err({ message: expectedGot('an object', json) });
            }
        });
    };
    /**
     * Decoder for values that may be `undefined`. This is primarily helpful for
     * decoding interfaces with optional fields.
     *
     * Example:
     * ```
     * interface User {
     *   id: number;
     *   isOwner?: boolean;
     * }
     *
     * const decoder: Decoder<User> = object({
     *   id: number(),
     *   isOwner: optional(boolean())
     * });
     * ```
     */
    Decoder.optional = function (decoder) {
        return new Decoder(function (json) { return (json === undefined || json === null ? ok(undefined) : decoder.decode(json)); });
    };
    /**
     * Decoder that attempts to run each decoder in `decoders` and either succeeds
     * with the first successful decoder, or fails after all decoders have failed.
     *
     * Note that `oneOf` expects the decoders to all have the same return type,
     * while `union` creates a decoder for the union type of all the input
     * decoders.
     *
     * Examples:
     * ```
     * oneOf(string(), number().map(String))
     * oneOf(constant('start'), constant('stop'), succeed('unknown'))
     * ```
     */
    Decoder.oneOf = function () {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            var errors = [];
            for (var i = 0; i < decoders.length; i++) {
                var r = decoders[i].decode(json);
                if (r.ok === true) {
                    return r;
                }
                else {
                    errors[i] = r.error;
                }
            }
            var errorsList = errors
                .map(function (error) { return "at error" + (error.at || '') + ": " + error.message; })
                .join('", "');
            return err({
                message: "expected a value matching one of the decoders, got the errors [\"" + errorsList + "\"]"
            });
        });
    };
    /**
     * Decoder that always succeeds with either the decoded value, or a fallback
     * default value.
     */
    Decoder.withDefault = function (defaultValue, decoder) {
        return new Decoder(function (json) {
            return ok(withDefault(defaultValue, decoder.decode(json)));
        });
    };
    /**
     * Decoder that pulls a specific field out of a json structure, instead of
     * decoding and returning the full structure. The `paths` array describes the
     * object keys and array indices to traverse, so that values can be pulled out
     * of a nested structure.
     *
     * Example:
     * ```
     * const decoder = valueAt(['a', 'b', 0], string());
     *
     * decoder.run({a: {b: ['surprise!']}})
     * // => {ok: true, result: 'surprise!'}
     *
     * decoder.run({a: {x: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
     * ```
     *
     * Note that the `decoder` is ran on the value found at the last key in the
     * path, even if the last key is not found. This allows the `optional`
     * decoder to succeed when appropriate.
     * ```
     * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
     *
     * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
     * // => {ok: true, result: 'surprise!'}
     *
     * optionalDecoder.run({a: {b: 'cats'}})
     * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
     *
     * optionalDecoder.run({a: {b: {z: 1}}})
     * // => {ok: true, result: undefined}
     * ```
     */
    Decoder.valueAt = function (paths, decoder) {
        return new Decoder(function (json) {
            var jsonAtPath = json;
            for (var i = 0; i < paths.length; i++) {
                if (jsonAtPath === undefined) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: 'path does not exist'
                    });
                }
                else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an object', jsonAtPath)
                    });
                }
                else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
                    return err({
                        at: printPath(paths.slice(0, i + 1)),
                        message: expectedGot('an array', jsonAtPath)
                    });
                }
                else {
                    jsonAtPath = jsonAtPath[paths[i]];
                }
            }
            return mapError(function (error) {
                return jsonAtPath === undefined
                    ? { at: printPath(paths), message: 'path does not exist' }
                    : prependAt(printPath(paths), error);
            }, decoder.decode(jsonAtPath));
        });
    };
    /**
     * Decoder that ignores the input json and always succeeds with `fixedValue`.
     */
    Decoder.succeed = function (fixedValue) {
        return new Decoder(function (json) { return ok(fixedValue); });
    };
    /**
     * Decoder that ignores the input json and always fails with `errorMessage`.
     */
    Decoder.fail = function (errorMessage) {
        return new Decoder(function (json) { return err({ message: errorMessage }); });
    };
    /**
     * Decoder that allows for validating recursive data structures. Unlike with
     * functions, decoders assigned to variables can't reference themselves
     * before they are fully defined. We can avoid prematurely referencing the
     * decoder by wrapping it in a function that won't be called until use, at
     * which point the decoder has been defined.
     *
     * Example:
     * ```
     * interface Comment {
     *   msg: string;
     *   replies: Comment[];
     * }
     *
     * const decoder: Decoder<Comment> = object({
     *   msg: string(),
     *   replies: lazy(() => array(decoder))
     * });
     * ```
     */
    Decoder.lazy = function (mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    };
    return Decoder;
}());

/* tslint:disable:variable-name */
/** See `Decoder.string` */
var string = Decoder.string;
/** See `Decoder.number` */
var number = Decoder.number;
/** See `Decoder.boolean` */
var boolean = Decoder.boolean;
/** See `Decoder.anyJson` */
var anyJson = Decoder.anyJson;
/** See `Decoder.unknownJson` */
Decoder.unknownJson;
/** See `Decoder.constant` */
var constant = Decoder.constant;
/** See `Decoder.object` */
var object = Decoder.object;
/** See `Decoder.array` */
var array = Decoder.array;
/** See `Decoder.tuple` */
Decoder.tuple;
/** See `Decoder.dict` */
var dict = Decoder.dict;
/** See `Decoder.optional` */
var optional = Decoder.optional;
/** See `Decoder.oneOf` */
var oneOf = Decoder.oneOf;
/** See `Decoder.union` */
Decoder.union;
/** See `Decoder.intersection` */
Decoder.intersection;
/** See `Decoder.withDefault` */
Decoder.withDefault;
/** See `Decoder.valueAt` */
Decoder.valueAt;
/** See `Decoder.succeed` */
Decoder.succeed;
/** See `Decoder.fail` */
Decoder.fail;
/** See `Decoder.lazy` */
Decoder.lazy;

const nonEmptyStringDecoder$1 = string().where((s) => s.length > 0, "Expected a non-empty string");
const nonNegativeNumberDecoder$1 = number().where((num) => num >= 0, "Expected a non-negative number");

const intentDefinitionDecoder = object({
    name: nonEmptyStringDecoder$1,
    displayName: optional(string()),
    contexts: optional(array(string())),
    customConfig: optional(object())
});
const v2TypeDecoder = oneOf(constant("web"), constant("native"), constant("citrix"), constant("onlineNative"), constant("other"));
const v2DetailsDecoder = object({
    url: nonEmptyStringDecoder$1
});
const v2IconDecoder = object({
    src: nonEmptyStringDecoder$1,
    size: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1)
});
const v2ScreenshotDecoder = object({
    src: nonEmptyStringDecoder$1,
    size: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1),
    label: optional(nonEmptyStringDecoder$1)
});
const v2ListensForIntentDecoder = object({
    contexts: array(nonEmptyStringDecoder$1),
    displayName: optional(nonEmptyStringDecoder$1),
    resultType: optional(nonEmptyStringDecoder$1),
    customConfig: optional(anyJson())
});
const v2IntentsDecoder = object({
    listensFor: optional(dict(v2ListensForIntentDecoder)),
    raises: optional(dict(array(nonEmptyStringDecoder$1)))
});
const v2UserChannelDecoder = object({
    broadcasts: optional(array(nonEmptyStringDecoder$1)),
    listensFor: optional(array(nonEmptyStringDecoder$1))
});
const v2AppChannelDecoder = object({
    name: nonEmptyStringDecoder$1,
    description: optional(nonEmptyStringDecoder$1),
    broadcasts: optional(array(nonEmptyStringDecoder$1)),
    listensFor: optional(array(nonEmptyStringDecoder$1))
});
const v2InteropDecoder = object({
    intents: optional(v2IntentsDecoder),
    userChannels: optional(v2UserChannelDecoder),
    appChannels: optional(array(v2AppChannelDecoder))
});
const glue42ApplicationDetailsDecoder = object({
    url: optional(nonEmptyStringDecoder$1),
    top: optional(number()),
    left: optional(number()),
    width: optional(nonNegativeNumberDecoder$1),
    height: optional(nonNegativeNumberDecoder$1)
});
const glue42HostManifestsBrowserDecoder = object({
    name: optional(nonEmptyStringDecoder$1),
    type: optional(nonEmptyStringDecoder$1.where((s) => s === "window", "Expected a value of window")),
    title: optional(nonEmptyStringDecoder$1),
    version: optional(nonEmptyStringDecoder$1),
    customProperties: optional(anyJson()),
    icon: optional(string()),
    caption: optional(string()),
    details: optional(glue42ApplicationDetailsDecoder),
    intents: optional(array(intentDefinitionDecoder)),
    hidden: optional(boolean())
});
const v1DefinitionDecoder = object({
    name: nonEmptyStringDecoder$1,
    appId: nonEmptyStringDecoder$1,
    title: optional(nonEmptyStringDecoder$1),
    version: optional(nonEmptyStringDecoder$1),
    manifest: nonEmptyStringDecoder$1,
    manifestType: nonEmptyStringDecoder$1,
    tooltip: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    images: optional(array(object({ url: optional(nonEmptyStringDecoder$1) }))),
    icons: optional(array(object({ icon: optional(nonEmptyStringDecoder$1) }))),
    customConfig: anyJson(),
    intents: optional(array(intentDefinitionDecoder))
});
const v2LocalizedDefinitionDecoder = object({
    appId: optional(nonEmptyStringDecoder$1),
    name: optional(nonEmptyStringDecoder$1),
    details: optional(v2DetailsDecoder),
    version: optional(nonEmptyStringDecoder$1),
    title: optional(nonEmptyStringDecoder$1),
    tooltip: optional(nonEmptyStringDecoder$1),
    lang: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    categories: optional(array(nonEmptyStringDecoder$1)),
    icons: optional(array(v2IconDecoder)),
    screenshots: optional(array(v2ScreenshotDecoder)),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    moreInfo: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    customConfig: optional(array(anyJson())),
    hostManifests: optional(anyJson()),
    interop: optional(v2InteropDecoder)
});
const v2DefinitionDecoder = object({
    appId: nonEmptyStringDecoder$1,
    name: nonEmptyStringDecoder$1,
    type: v2TypeDecoder,
    details: v2DetailsDecoder,
    version: optional(nonEmptyStringDecoder$1),
    title: optional(nonEmptyStringDecoder$1),
    tooltip: optional(nonEmptyStringDecoder$1),
    lang: optional(nonEmptyStringDecoder$1),
    description: optional(nonEmptyStringDecoder$1),
    categories: optional(array(nonEmptyStringDecoder$1)),
    icons: optional(array(v2IconDecoder)),
    screenshots: optional(array(v2ScreenshotDecoder)),
    contactEmail: optional(nonEmptyStringDecoder$1),
    supportEmail: optional(nonEmptyStringDecoder$1),
    moreInfo: optional(nonEmptyStringDecoder$1),
    publisher: optional(nonEmptyStringDecoder$1),
    customConfig: optional(array(anyJson())),
    hostManifests: optional(anyJson()),
    interop: optional(v2InteropDecoder),
    localizedVersions: optional(dict(v2LocalizedDefinitionDecoder))
});
const allDefinitionsDecoder = oneOf(v1DefinitionDecoder, v2DefinitionDecoder);

const parseDecoderErrorToStringMessage = (error) => {
    return `${error.kind} at ${error.at}: ${JSON.stringify(error.input)}. Reason - ${error.message}`;
};

class FDC3Service {
    fdc3ToDesktopDefinitionType = {
        web: "window",
        native: "exe",
        citrix: "citrix",
        onlineNative: "clickonce",
        other: "window"
    };
    toApi() {
        return {
            isFdc3Definition: this.isFdc3Definition.bind(this),
            parseToBrowserBaseAppData: this.parseToBrowserBaseAppData.bind(this),
            parseToDesktopAppConfig: this.parseToDesktopAppConfig.bind(this)
        };
    }
    isFdc3Definition(definition) {
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            return { isFdc3: false, reason: parseDecoderErrorToStringMessage(decodeRes.error) };
        }
        if (definition.appId && definition.details) {
            return { isFdc3: true, version: "2.0" };
        }
        if (definition.manifest) {
            return { isFdc3: true, version: "1.2" };
        }
        return { isFdc3: false, reason: "The passed definition is not FDC3" };
    }
    parseToBrowserBaseAppData(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        const userProperties = this.getUserPropertiesFromDefinition(definition, version);
        const createOptions = { url: this.getUrl(definition, version) };
        const baseApplicationData = {
            name: definition.appId,
            type: "window",
            createOptions,
            userProperties: {
                ...userProperties,
                intents: version === "1.2"
                    ? userProperties.intents
                    : this.getIntentsFromV2AppDefinition(definition),
                details: createOptions
            },
            title: definition.title,
            version: definition.version,
            icon: this.getIconFromDefinition(definition, version),
            caption: definition.description,
            fdc3: version === "2.0" ? { ...definition, definitionVersion: "2.0" } : undefined,
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return baseApplicationData;
        }
        const ioDefinitionDecodeRes = glue42HostManifestsBrowserDecoder.run(ioConnectDefinition);
        if (!ioDefinitionDecodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(ioDefinitionDecodeRes.error)}`);
        }
        if (!Object.keys(ioDefinitionDecodeRes.result).length) {
            return baseApplicationData;
        }
        return this.mergeBaseAppDataWithGlueManifest(baseApplicationData, ioDefinitionDecodeRes.result);
    }
    parseToDesktopAppConfig(definition) {
        const { isFdc3, version } = this.isFdc3Definition(definition);
        if (!isFdc3) {
            throw new Error("The passed definition is not FDC3");
        }
        const decodeRes = allDefinitionsDecoder.run(definition);
        if (!decodeRes.ok) {
            throw new Error(`Invalid FDC3 ${version} definition. Error: ${parseDecoderErrorToStringMessage(decodeRes.error)}`);
        }
        if (version === "1.2") {
            const fdc3v1Definition = definition;
            return {
                name: fdc3v1Definition.appId,
                type: "window",
                details: {
                    url: this.getUrl(definition, version)
                },
                version: fdc3v1Definition.version,
                title: fdc3v1Definition.title,
                tooltip: fdc3v1Definition.tooltip,
                caption: fdc3v1Definition.description,
                icon: fdc3v1Definition.icons?.[0].icon,
                intents: fdc3v1Definition.intents,
                customProperties: {
                    manifestType: fdc3v1Definition.manifestType,
                    images: fdc3v1Definition.images,
                    contactEmail: fdc3v1Definition.contactEmail,
                    supportEmail: fdc3v1Definition.supportEmail,
                    publisher: fdc3v1Definition.publisher,
                    icons: fdc3v1Definition.icons,
                    customConfig: fdc3v1Definition.customConfig
                }
            };
        }
        const fdc3v2Definition = definition;
        const desktopDefinition = {
            name: fdc3v2Definition.appId,
            type: this.fdc3ToDesktopDefinitionType[fdc3v2Definition.type],
            details: fdc3v2Definition.details,
            version: fdc3v2Definition.version,
            title: fdc3v2Definition.title,
            tooltip: fdc3v2Definition.tooltip,
            caption: fdc3v2Definition.description,
            icon: this.getIconFromDefinition(fdc3v2Definition, "2.0"),
            intents: this.getIntentsFromV2AppDefinition(fdc3v2Definition),
            fdc3: { ...fdc3v2Definition, definitionVersion: "2.0" }
        };
        const ioConnectDefinition = definition.hostManifests?.ioConnect || definition.hostManifests?.["Glue42"];
        if (!ioConnectDefinition) {
            return desktopDefinition;
        }
        if (typeof ioConnectDefinition !== "object" || Array.isArray(ioConnectDefinition)) {
            throw new Error(`Invalid '${definition.hostManifests.ioConnect ? "hostManifests.ioConnect" : "hostManifests['Glue42']"}' key`);
        }
        return this.mergeDesktopConfigWithGlueManifest(desktopDefinition, ioConnectDefinition);
    }
    getUserPropertiesFromDefinition(definition, version) {
        if (version === "1.2") {
            return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key)));
        }
        return Object.fromEntries(Object.entries(definition).filter(([key]) => !connectBrowserAppProps.includes(key) && !fdc3v2AppProps.includes(key)));
    }
    getUrl(definition, version) {
        let url;
        if (version === "1.2") {
            const parsedManifest = JSON.parse(definition.manifest);
            url = parsedManifest.details?.url || parsedManifest.url;
        }
        else {
            url = definition.details?.url;
        }
        if (!url || typeof url !== "string") {
            throw new Error(`Invalid FDC3 ${version} definition. Provide valid 'url' under '${version === "1.2" ? "manifest" : "details"}' key`);
        }
        return url;
    }
    getIntentsFromV2AppDefinition(definition) {
        const fdc3Intents = definition.interop?.intents?.listensFor;
        if (!fdc3Intents) {
            return;
        }
        const intents = Object.entries(fdc3Intents).map((fdc3Intent) => {
            const [intentName, intentData] = fdc3Intent;
            return {
                name: intentName,
                ...intentData
            };
        });
        return intents;
    }
    getIconFromDefinition(definition, version) {
        if (version === "1.2") {
            return definition.icons?.find((iconDef) => iconDef.icon)?.icon || undefined;
        }
        return definition.icons?.find((iconDef) => iconDef.src)?.src || undefined;
    }
    mergeBaseAppDataWithGlueManifest(baseAppData, hostManifestDefinition) {
        let baseApplicationDefinition = baseAppData;
        if (hostManifestDefinition.customProperties) {
            baseApplicationDefinition.userProperties = { ...baseAppData.userProperties, ...hostManifestDefinition.customProperties };
        }
        if (hostManifestDefinition.details) {
            const details = { ...baseAppData.createOptions, ...hostManifestDefinition.details };
            baseApplicationDefinition.createOptions = details;
            baseApplicationDefinition.userProperties.details = details;
        }
        if (Array.isArray(hostManifestDefinition.intents)) {
            baseApplicationDefinition.userProperties.intents = (baseApplicationDefinition.userProperties.intents || []).concat(hostManifestDefinition.intents);
        }
        baseApplicationDefinition = { ...baseApplicationDefinition, ...hostManifestDefinition };
        delete baseApplicationDefinition.details;
        delete baseApplicationDefinition.intents;
        return baseApplicationDefinition;
    }
    mergeDesktopConfigWithGlueManifest(config, desktopDefinition) {
        const appConfig = Object.assign({}, config, desktopDefinition, { details: { ...config.details, ...desktopDefinition.details } });
        if (Array.isArray(desktopDefinition.intents)) {
            appConfig.intents = (config.intents || []).concat(desktopDefinition.intents);
        }
        return appConfig;
    }
}

const decoders$1 = {
    common: {
        nonEmptyStringDecoder: nonEmptyStringDecoder$1,
        nonNegativeNumberDecoder: nonNegativeNumberDecoder$1
    },
    fdc3: {
        allDefinitionsDecoder,
        v1DefinitionDecoder,
        v2DefinitionDecoder
    }
};

var INTENTS_ERRORS;
(function (INTENTS_ERRORS) {
    INTENTS_ERRORS["USER_CANCELLED"] = "User Closed Intents Resolver UI without choosing a handler";
    INTENTS_ERRORS["CALLER_NOT_DEFINED"] = "Caller Id is not defined";
    INTENTS_ERRORS["TIMEOUT_HIT"] = "Timeout hit";
    INTENTS_ERRORS["INTENT_NOT_FOUND"] = "Cannot find Intent";
    INTENTS_ERRORS["HANDLER_NOT_FOUND"] = "Cannot find Intent Handler";
    INTENTS_ERRORS["TARGET_INSTANCE_UNAVAILABLE"] = "Cannot start Target Instance";
    INTENTS_ERRORS["INTENT_DELIVERY_FAILED"] = "Target Instance did not add a listener";
    INTENTS_ERRORS["RESOLVER_UNAVAILABLE"] = "Intents Resolver UI unavailable";
    INTENTS_ERRORS["RESOLVER_TIMEOUT"] = "User did not choose a handler";
    INTENTS_ERRORS["INVALID_RESOLVER_RESPONSE"] = "Intents Resolver UI returned invalid response";
    INTENTS_ERRORS["INTENT_HANDLER_REJECTION"] = "Intent Handler function processing the raised intent threw an error or rejected the promise it returned";
})(INTENTS_ERRORS || (INTENTS_ERRORS = {}));

let IoC$1 = class IoC {
    _fdc3;
    _decoders = decoders$1;
    _errors = {
        intents: INTENTS_ERRORS
    };
    get fdc3() {
        if (!this._fdc3) {
            this._fdc3 = new FDC3Service().toApi();
        }
        return this._fdc3;
    }
    get decoders() {
        return this._decoders;
    }
    get errors() {
        return this._errors;
    }
};

const ioc = new IoC$1();
ioc.fdc3;
const decoders = ioc.decoders;
ioc.errors;

const nonEmptyStringDecoder = decoders.common.nonEmptyStringDecoder;
const nonNegativeNumberDecoder = decoders.common.nonNegativeNumberDecoder;
const functionCheck = (input, propDescription) => {
    const providedType = typeof input;
    return providedType === "function" ?
        anyJson$1() :
        fail(`The provided argument as ${propDescription} should be of type function, provided: ${typeof providedType}`);
};
const dialogsTemplateConfigDecoder = object$1({
    name: nonEmptyStringDecoder,
    Dialog: anyJson$1().andThen((result) => functionCheck(result, "Dialog")),
    validate: anyJson$1().andThen((result) => functionCheck(result, "validate"))
});
const configDecoder = object$1({
    rootElement: anyJson$1(),
    alerts: optional$1(object$1({
        enabled: boolean$1()
    })),
    dialogs: optional$1(object$1({
        enabled: boolean$1(),
        templates: optional$1(array$1(dialogsTemplateConfigDecoder))
    })),
});
const alertsInteropSettingsDecoder = object$1({
    method: nonEmptyStringDecoder,
    arguments: optional$1(anyJson$1()),
    target: optional$1(oneOf$1(constant$1("best"), constant$1("all"), nonEmptyStringDecoder))
});
const alertsOpenConfigDecoder = object$1({
    variant: oneOf$1(constant$1("default"), constant$1("success"), constant$1("critical"), constant$1("info"), constant$1("warning")),
    text: nonEmptyStringDecoder,
    showCloseButton: optional$1(boolean$1()),
    clickInterop: optional$1(alertsInteropSettingsDecoder),
    onCloseInterop: optional$1(alertsInteropSettingsDecoder),
    actions: optional$1(array$1(object$1({
        id: nonEmptyStringDecoder,
        title: nonEmptyStringDecoder,
        clickInterop: alertsInteropSettingsDecoder
    }))),
    data: optional$1(anyJson$1()),
    onClose: anyJson$1().andThen((result) => functionCheck(result, "onClose")),
    onClick: anyJson$1().andThen((result) => functionCheck(result, "onClick"))
});
const alertsCloseConfigDecoder = object$1({
    id: nonEmptyStringDecoder
});
const dialogsSizeDecoder = object$1({
    width: nonNegativeNumberDecoder,
    height: nonNegativeNumberDecoder
});
const dialogsOnCompletionDecoder = anyJson$1().andThen((result) => functionCheck(result, "onCompletion"));
const dialogsOpenConfigDecoder = object$1({
    templateName: nonEmptyStringDecoder,
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: anyJson$1()
});
const dialogsCloseConfigDecoder = object$1({
    id: nonEmptyStringDecoder
});
const dialogsActionButton = object$1({
    autofocus: optional$1(boolean$1()),
    id: nonEmptyStringDecoder,
    text: nonEmptyStringDecoder,
    variant: oneOf$1(constant$1("default"), constant$1("primary"), constant$1("critical"), constant$1("outline"), constant$1("link"))
});
const dialogsInputValidation = object$1({
    disabledButtonIds: array$1(nonEmptyStringDecoder),
    errorMessage: nonEmptyStringDecoder,
    regexPattern: nonEmptyStringDecoder
});
const noInputsConfirmationDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    heading: string$1(),
    text: string$1(),
    title: optional$1(string$1())
});
const noInputsConfirmationDialogDecoder = object$1({
    templateName: constant$1("noInputsConfirmationDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: noInputsConfirmationDialogVariablesDecoder
});
const singleCheckboxDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    checkbox: object$1({
        id: nonEmptyStringDecoder,
        initialValue: optional$1(boolean$1()),
        label: optional$1(string$1())
    }),
    heading: string$1(),
    text: string$1(),
    title: optional$1(string$1())
});
const singleCheckboxDialogDecoder = object$1({
    templateName: constant$1("singleCheckboxDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: singleCheckboxDialogVariablesDecoder
});
const singleTextInputDialogVariablesDecoder = object$1({
    actionButtons: array$1(dialogsActionButton),
    heading: string$1(),
    input: object$1({
        id: nonEmptyStringDecoder,
        initialValue: optional$1(string$1()),
        label: optional$1(string$1()),
        placeholder: optional$1(string$1()),
        validation: optional$1(dialogsInputValidation)
    }),
    title: optional$1(string$1())
});
const singleTextInputDialogDecoder = object$1({
    templateName: constant$1("singleTextInputDialog"),
    onCompletion: dialogsOnCompletionDecoder,
    size: optional$1(dialogsSizeDecoder),
    variables: singleTextInputDialogVariablesDecoder
});

/* @ts-self-types="./index.d.ts" */
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let nanoid = (size = 21) => {
  let id = '';
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id
};

class AlertsController {
    config;
    glueController;
    messagePort;
    logger;
    openedAlerts = [];
    constructor(config, glueController, messagePort) {
        this.config = config;
        this.glueController = glueController;
        this.messagePort = messagePort;
        this.logger = glueController.getLogger(`modals-ui.alerts.controller-${glueController.clientId}`);
        messagePort.subscribe((event) => {
            const alert = this.getAlertById(event.data.id);
            if (!alert) {
                this.logger.warn(`Can not close alert with ID ${event.data.id} because it is not open.`);
                return;
            }
            if (event.data.interopAction) {
                alert.config.onClick({ interopAction: event.data.interopAction });
            }
            if (event.data.shouldCloseAlert) {
                alert.config.onClose();
            }
        });
    }
    exposeAPI() {
        return {
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
    }
    open(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute open command because alerts are not enabled.");
        }
        this.logger.trace(`open command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = alertsOpenConfigDecoder.runWithException(config);
        const id = nanoid(10);
        const { onClick, onClose, ...messageConfig } = validatedConfig;
        const message = {
            id,
            config: messageConfig
        };
        this.openedAlerts.forEach((alert) => alert.config.onClose());
        this.messagePort.postMessage(message);
        this.openedAlerts.push({ id, config: validatedConfig });
        return { id };
    }
    close(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute close command because alerts are not enabled.");
        }
        this.logger.trace(`close command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = alertsCloseConfigDecoder.runWithException(config);
        const alert = this.getAlertById(validatedConfig.id);
        if (!alert) {
            this.logger.warn(`There is no open alert with ID ${validatedConfig.id}.`);
            return;
        }
        const lastAlert = this.openedAlerts[this.openedAlerts.length - 1];
        if (alert === lastAlert) {
            this.messagePort.postMessage(null);
        }
        this.openedAlerts = this.openedAlerts.filter((alert) => alert.id !== validatedConfig.id);
    }
    getAlertById(id) {
        return this.openedAlerts.find((alert) => alert.id === id);
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=i__default,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$1.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

var propTypes = {exports: {}};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = ReactPropTypesSecret_1;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  propTypes.exports = factoryWithThrowingShims();
}

var propTypesExports = propTypes.exports;

const extractErrorMsg = (error) => {
    const errorMessage = error.message ? JSON.stringify(error.message) : JSON.stringify(error);
    const stringError = typeof error === "string" ? error : errorMessage;
    return stringError;
};

const useIOConnectInit = (settings, onInitError) => {
    const [io, setIOConnect] = useState(null);
    useEffect(() => {
        const initialize = async () => {
            try {
                if (settings.browser && settings.browserPlatform) {
                    throw new Error("Cannot initialize, because the settings are over-specified: defined are both browser and browserPlatform. Please set one or the other");
                }
                const isDesktop = (typeof window.glue42gd !== "undefined") || (typeof window.iodesktop !== "undefined");
                if (isDesktop) {
                    const factory = settings.desktop?.factory || settings.browser?.factory || settings.browserPlatform?.factory || window.Glue;
                    const config = settings.desktop?.config || settings.browser?.config || settings.browserPlatform?.config;
                    const factoryResult = await factory(config);
                    setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
                    return;
                }
                const config = settings.browser?.config || settings.browserPlatform?.config;
                const factory = settings.browser?.factory || settings.browserPlatform?.factory || window.IOBrowser || window.IOBrowserPlatform;
                const factoryResult = await factory(config);
                setIOConnect(factoryResult.io || factoryResult.glue || factoryResult);
            }
            catch (error) {
                console.error(error);
                onInitError?.(error instanceof Error ? error : new Error(extractErrorMsg(error)));
            }
        };
        initialize();
    }, []);
    return io;
};

const IOConnectContext = createContext(null);
const IOConnectProvider = memo(({ children, fallback = null, settings = {}, onInitError }) => {
    const glue = useIOConnectInit(settings, onInitError);
    return glue ? (i__default.createElement(IOConnectContext.Provider, { value: glue }, children)) : (i__default.createElement(i__default.Fragment, null, fallback));
});
IOConnectProvider.propTypes = {
    children: propTypesExports.node,
    settings: propTypesExports.object,
    fallback: propTypesExports.node,
};
IOConnectProvider.displayName = 'IOConnectProvider';

function y(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var w,b={exports:{}};
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/w=b,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}w.exports?(t.default=t,w.exports=t):window.classNames=t;}();var k=y(b.exports);function C({className:t,size:n="16",variant:i="workspace",...o}){const r=k("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const N=forwardRef((({className:t,variant:n="default",icon:i="workspace",size:o="16",iconSize:a="16",onClick:s,disabled:l,children:c,...u},d)=>{const f=k("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),m=useCallback((e=>{if(!l)return s?s(e):void 0;e.preventDefault();}),[s,l]);return jsxRuntimeExports.jsx("button",{className:f,type:"button",ref:d,"aria-label":"button",onClick:m,disabled:l,...u,children:c??(i&&jsxRuntimeExports.jsx(C,{variant:i,size:a}))})}));N.displayName="ButtonIcon";const x={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function S({className:n,variant:i="default",size:o="normal",text:r,close:a=false,closeButtonOnClick:s,append:l,...c}){const u=k("io-alert",`io-alert-${i}`,"large"===o&&"io-alert-lg",n),d=x[i];return jsxRuntimeExports.jsxs("div",{"data-testid":"io-alert",className:u,...c,children:[d&&jsxRuntimeExports.jsx(C,{"data-testid":"io-alert-icon",variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{"data-testid":"io-alert-text",className:"io-text-smaller",children:r}),"large"===o&&l,a&&jsxRuntimeExports.jsx(N,{"data-testid":"io-alert-close-button",className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function D({className:t,variant:n="default",children:i,...o}){const r=k("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function E({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=k("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function I({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...l}){const c=k("io-block",n);return jsxRuntimeExports.jsxs("div",{className:c,...l,children:[i&&jsxRuntimeExports.jsx(E,{tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const A=forwardRef((({className:n,variant:i="default",size:o="normal",icon:a,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},h)=>{const p=k("io-btn",("primary"===i||"critical"===i||"outline"===i||"link"===i)&&[`io-btn-${i}`],"large"===o&&"io-btn-lg",n),g=useCallback((e=>{if(!d)return u?u(e):void 0;e.preventDefault();}),[u,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:h,type:"button","aria-label":"button",onClick:g,disabled:d,tabIndex:0,...m,children:[a&&!l&&jsxRuntimeExports.jsx(C,{variant:a,size:s}),f??c,a&&l&&jsxRuntimeExports.jsx(C,{variant:a,size:s})]})}));A.displayName="Button";const M=createContext({});const T=forwardRef((({size:t="32",...n},i)=>{const{handleOpen:o,disabled:a}=useContext(M),l=useCallback((()=>{o&&o();}),[o]);return jsxRuntimeExports.jsx(N,{ref:i,size:t,onClick:l,disabled:a,...n})}));function P({className:t,...n}){const{handleOpen:i}=useContext(M),o=k("io-dropdown-content",t),a=useCallback((e=>{e.stopPropagation(),i&&i();}),[i]);return jsxRuntimeExports.jsx("div",{className:o,role:"button",onClick:a,...n})}T.displayName="DropdownButtonIcon";const _=createContext({}),O=forwardRef(((n,i)=>{const{className:o,prepend:r,append:a,isSelected:l,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,...h}=n,{variant:p="default",selected:g,checkIcon:v,handleItemClick:y}=useContext(_),w=l??g?.some((e=>e.children===f)),b="default"!==p&&!!v,N=b||r,x=k("io-list-item",N&&"io-list-item-left",a&&"io-list-item-right","default"!==p&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:x,ref:i,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...h,children:[N&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(C,{variant:v.variant,title:w?v.tooltip:void 0}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})}));O.displayName="ListItem";const F=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));F.displayName="ListItemTitle";const L=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));L.displayName="ListItemSection";const B=forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));B.displayName="ListItemHeader";const R=forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})}));R.displayName="ListItemWithSubItems";const j=forwardRef(((t,n)=>{const{className:i,variant:o="default",checkIcon:a,children:s,...u}=t,[d,f]=useState([]),m=k("io-list","default"!==o&&"io-list-selectable",i),h=useMemo((()=>{if(a)return "object"==typeof a?a:{variant:a}}),[a]),p=useCallback(((e,t)=>{if("default"===o)return;const n=d.some((e=>e.children?.toString()===t.children?.toString()));"single"===o?f([t]):(()=>{const e=n?d.filter((e=>e.children!==t.children)):[...d,t];f(e);})();}),[d,o]),g=useMemo((()=>({variant:o,selected:d,checkIcon:h,handleItemClick:p})),[o,d,h,p]);return jsxRuntimeExports.jsx(_.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...u,children:s})})}));j.displayName="List";const H=j;function z(e,t){useEffect((()=>{const n=n=>{e.current&&!e.current.contains(n.target)&&t();};return document.addEventListener("mousedown",n),()=>{document.removeEventListener("mousedown",n);}}),[e,t]);}function $({className:t,variant:n="outline",align:i="down",disabled:o,children:a,...s}){const[u,f]=useState(false),m=useRef(null),h=k("io-dropdown",u&&"io-dropdown-open","default"!==n&&[`io-dropdown-${n}`],t),p=useCallback((()=>{f(!u);}),[u]);z(m,useCallback((()=>{f(false);}),[]));const g=useMemo((()=>({isOpen:u,handleOpen:p,variant:n,align:i,disabled:o})),[u,p,n,i,o]);return jsxRuntimeExports.jsx(M.Provider,{value:g,children:jsxRuntimeExports.jsx("div",{className:h,ref:m,...s,children:a})})}function V({className:t,variant:n="default",align:i="left",children:o,...r}){const a=k("io-btn-group","sticky"===n&&"io-btn-group-sticky","append"===n&&"io-btn-group-append","fullwidth"===n&&"io-btn-group-fullwidth","right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,...r,children:o})}function Y({className:t,draggable:n=false,children:i,...o}){const r=k("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--spacing-8)"},...o,children:i})}function U({className:t,children:n,...i}){const o=k("io-dialog-header",t);return jsxRuntimeExports.jsx(Y,{"data-testid":"io-dialog-header",className:o,...i,children:n})}function W({className:t,children:n,...i}){const o=k("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:o,...i,children:n})}function J({className:t,children:n,...i}){const o=k("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function q({className:t,...n}){const i=k("io-dialog-footer",t);return jsxRuntimeExports.jsx(J,{"data-testid":"io-dialog-footer",className:i,...n})}function K({className:n,variant:i="default",title:o="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s=(()=>console.log("closeFn not provided")),children:l,...c}){const u=useRef(null),m=k("io-dialog","centered"===i&&"io-dialog-center",n);return useLayoutEffect((()=>{const e=u?.current;e&&(r?e.showModal():e.close());}),[r,u]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:m,ref:u,"data-modal":true,onClose:()=>{r&&s();},onClick:e=>{"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(U,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:o}),jsxRuntimeExports.jsx(V,{children:jsxRuntimeExports.jsx(N,{"data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function G(){return "undefined"!=typeof window}function Q(e){return ee(e)?(e.nodeName||"").toLowerCase():"#document"}function X(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function Z(e){var t;return null==(t=(ee(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ee(e){return !!G()&&(e instanceof Node||e instanceof X(e).Node)}function te(e){return !!G()&&(e instanceof Element||e instanceof X(e).Element)}function ne(e){return !!G()&&(e instanceof HTMLElement||e instanceof X(e).HTMLElement)}function ie(e){return !(!G()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof X(e).ShadowRoot)}function oe(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=ue(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!["inline","contents"].includes(o)}function re(e){return ["table","td","th"].includes(Q(e))}function ae(e){return [":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function se(e){const t=le(),n=te(e)?ue(e):e;return "none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((e=>(n.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(n.contain||"").includes(e)))}function le(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function ce(e){return ["html","body","#document"].includes(Q(e))}function ue(e){return X(e).getComputedStyle(e)}function de(e){return te(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function fe(e){if("html"===Q(e))return e;const t=e.assignedSlot||e.parentNode||ie(e)&&e.host||Z(e);return ie(t)?t.host:t}function me(e){const t=fe(e);return ce(t)?e.ownerDocument?e.ownerDocument.body:e.body:ne(t)&&oe(t)?t:me(t)}function he(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=me(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=X(o);if(r){const e=function(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}(a);return t.concat(a,a.visualViewport||[],oe(o)?o:[],e&&n?he(e):[])}return t.concat(o,he(o,[],n))}function pe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function ge(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&ie(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function ve(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function ye(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map((e=>{let{brand:t,version:n}=e;return t+"/"+n})).join(" "):navigator.userAgent}function we(e){return !(0!==e.mozInputSource||!e.isTrusted)||(Ce()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function be(e){return !ye().includes("jsdom/")&&(!Ce()&&0===e.width&&0===e.height||Ce()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function ke(){return /apple/i.test(navigator.vendor)}function Ce(){const e=/android/i;return e.test(ve())||e.test(ye())}function Ne(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function xe(e){return (null==e?void 0:e.ownerDocument)||document}function Se(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function De(e){return "composedPath"in e?e.composedPath()[0]:e.target}H.Item=O,H.ItemTitle=F,H.ItemSection=L,H.ItemHeader=B,H.ItemWithSubItems=R,$.Button=function({icon:t="chevron-down",...n}){const{handleOpen:i,disabled:o}=useContext(M),a=useCallback((e=>{e.stopPropagation(),i&&i();}),[i]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:a,disabled:o,...n})},$.ButtonIcon=T,$.Content=P,$.List=H,$.Item=O,$.ItemTitle=F,$.ItemSection=L,V.Button=A,V.ButtonIcon=N,V.Dropdown=$,Y.Title=E,Y.ButtonGroup=V,Y.Button=A,Y.ButtonIcon=N,Y.Dropdown=$,U.Title=E,U.ButtonGroup=V,U.Button=A,U.ButtonIcon=N,U.Dropdown=$,W.Content=function({className:t,children:n,...i}){const o=k("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},J.ButtonGroup=V,J.Button=A,J.ButtonIcon=N,J.Dropdown=$,q.ButtonGroup=V,q.Button=A,q.ButtonIcon=N,q.Dropdown=$,K.Header=U,K.Body=W,K.Footer=q;const Ee="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Ie(e){return ne(e)&&e.matches(Ee)}function Ae(e){e.preventDefault(),e.stopPropagation();}function Me(e){return !!e&&("combobox"===e.getAttribute("role")&&Ie(e))}const Te=Math.min,Pe=Math.max,_e=Math.round,Oe=Math.floor,Fe=e=>({x:e,y:e}),Le={left:"right",right:"left",bottom:"top",top:"bottom"},Be={start:"end",end:"start"};function Re(e,t,n){return Pe(e,Te(t,n))}function je(e,t){return "function"==typeof e?e(t):e}function He(e){return e.split("-")[0]}function ze(e){return e.split("-")[1]}function $e(e){return "x"===e?"y":"x"}function Ve(e){return "y"===e?"height":"width"}function Ye(e){return ["top","bottom"].includes(He(e))?"y":"x"}function Ue(e){return $e(Ye(e))}function We(e){return e.replace(/start|end/g,(e=>Be[e]))}function Je(e){return e.replace(/left|right|bottom|top/g,(e=>Le[e]))}function qe(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var Ke=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),Ge="undefined"==typeof Element,Qe=Ge?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Xe=!Ge&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},Ze=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},et=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!Ze(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,l):o.push({scopeParent:a,candidates:l});}else {Qe.call(a,Ke)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var c=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!Ze(c,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},tt=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},nt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!tt(e)?0:e.tabIndex},it=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},ot=function(e){return "INPUT"===e.tagName},rt=function(e){return function(e){return ot(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Xe(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},at=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},st=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=Qe.call(e,"details>summary:first-of-type")?e.parentElement:e;if(Qe.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return at(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=Xe(e);if(a&&!a.shadowRoot&&true===i(a))return at(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&Xe(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=Xe(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},lt=function(e,t){return !(t.disabled||Ze(t)||function(e){return ot(e)&&"hidden"===e.type}(t)||st(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return "SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!Qe.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},ct=function(e,t){return !(rt(t)||nt(t)<0||!lt(e,t))},ut=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},dt=function e(t){var n=[],i=[];return t.forEach((function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=nt(e);return n<0&&t&&!tt(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:l});})),i.sort(it).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},ft=function(e,t){var n;return n=(t=t||{}).getShadowRoot?et([e],t.includeContainer,{filter:ct.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:ut}):function(e,t,n){if(Ze(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(Ke));return t&&Qe.call(e,Ke)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,ct.bind(null,t)),dt(n)},mt=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==Qe.call(e,Ke)&&ct(t,e)};function ht(e,t,n){let{reference:i,floating:o}=e;const r=Ye(t),a=Ue(t),s=Ve(a),l=He(t),c="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let m;switch(l){case "top":m={x:u,y:i.y-o.height};break;case "bottom":m={x:u,y:i.y+i.height};break;case "right":m={x:i.x+i.width,y:d};break;case "left":m={x:i.x-o.width,y:d};break;default:m={x:i.x,y:i.y};}switch(ze(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function pt(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=je(t,e),h=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),p=s[f?"floating"===d?"reference":"floating":d],g=qe(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=qe(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+h.top)/w.y,bottom:(b.bottom-g.bottom+h.bottom)/w.y,left:(g.left-b.left+h.left)/w.x,right:(b.right-g.right+h.right)/w.x}}function gt(e){const t=ue(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=ne(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=_e(n)!==r||_e(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function vt(e){return te(e)?e:e.contextElement}function yt(e){const t=vt(e);if(!ne(t))return Fe(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=gt(t);let a=(r?_e(n.width):n.width)/i,s=(r?_e(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const wt=Fe(0);function bt(e){const t=X(e);return le()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:wt}function kt(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=vt(e);let a=Fe(1);t&&(i?te(i)&&(a=yt(i)):a=yt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==X(e))&&t}(r,n,i)?bt(r):Fe(0);let l=(o.left+s.x)/a.x,c=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=X(r),t=i&&te(i)?X(i):i;let n=e,o=n.frameElement;for(;o&&i&&t!==n;){const e=yt(o),t=o.getBoundingClientRect(),i=ue(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=X(o),o=n.frameElement;}}return qe({width:u,height:d,x:l,y:c})}const Ct=[":popover-open",":modal"];function Nt(e){return Ct.some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function xt(e){return kt(Z(e)).left+de(e).scrollLeft}function St(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=X(e),i=Z(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,l=0;if(o){r=o.width,a=o.height;const e=le();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,l=o.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)i=function(e){const t=Z(e),n=de(e),i=e.ownerDocument.body,o=Pe(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=Pe(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+xt(e);const s=-n.scrollTop;return "rtl"===ue(i).direction&&(a+=Pe(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(Z(e));else if(te(t))i=function(e,t){const n=kt(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=ne(e)?yt(e):Fe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=bt(e);i={...t,x:t.x-n.x,y:t.y-n.y};}return qe(i)}function Dt(e,t){const n=fe(e);return !(n===t||!te(n)||ce(n))&&("fixed"===ue(n).position||Dt(n,t))}function Et(e,t,n){const i=ne(t),o=Z(t),r="fixed"===n,a=kt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=Fe(0);if(i||!i&&!r)if(("body"!==Q(t)||oe(o))&&(s=de(t)),i){const e=kt(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else o&&(l.x=xt(o));return {x:a.left+s.scrollLeft-l.x,y:a.top+s.scrollTop-l.y,width:a.width,height:a.height}}function It(e){return "static"===ue(e).position}function At(e,t){return ne(e)&&"fixed"!==ue(e).position?t?t(e):e.offsetParent:null}function Mt(e,t){const n=X(e);if(Nt(e))return n;if(!ne(e)){let t=fe(e);for(;t&&!ce(t);){if(te(t)&&!It(t))return t;t=fe(t);}return n}let i=At(e,t);for(;i&&re(i)&&It(i);)i=At(i,t);return i&&ce(i)&&It(i)&&!se(i)?n:i||function(e){let t=fe(e);for(;ne(t)&&!ce(t);){if(se(t))return t;if(ae(t))return null;t=fe(t);}return null}(e)||n}const Tt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=Z(i),s=!!t&&Nt(t.floating);if(i===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Fe(1);const u=Fe(0),d=ne(i);if((d||!d&&!r)&&(("body"!==Q(i)||oe(a))&&(l=de(i)),ne(i))){const e=kt(i);c=yt(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x,y:n.y*c.y-l.scrollTop*c.y+u.y}},getDocumentElement:Z,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?Nt(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=he(e,[],false).filter((e=>te(e)&&"body"!==Q(e))),o=null;const r="fixed"===ue(e).position;let a=r?fe(e):e;for(;te(a)&&!ce(a);){const t=ue(a),n=se(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||oe(a)&&!n&&Dt(e,a))?i=i.filter((e=>e!==a)):o=t,a=fe(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce(((e,n)=>{const i=St(t,n,o);return e.top=Pe(i.top,e.top),e.right=Te(i.right,e.right),e.bottom=Te(i.bottom,e.bottom),e.left=Pe(i.left,e.left),e}),St(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Mt,getElementRects:async function(e){const t=this.getOffsetParent||Mt,n=this.getDimensions,i=await n(e.floating);return {reference:Et(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=gt(e);return {width:t,height:n}},getScale:yt,isElement:te,isRTL:function(e){return "rtl"===ue(e).direction}};function Pt(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=i,c=vt(e),u=o||r?[...c?he(c):[],...he(t)]:[];u.forEach((e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);}));const d=c&&s?function(e,t){let n,i=null;const o=Z(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const{left:c,top:u,width:d,height:f}=e.getBoundingClientRect();if(s||t(),!d||!f)return;const m={rootMargin:-Oe(u)+"px "+-Oe(o.clientWidth-(c+d))+"px "+-Oe(o.clientHeight-(u+f))+"px "+-Oe(c)+"px",threshold:Pe(0,Te(1,l))||1};let h=true;function p(e){const t=e[0].intersectionRatio;if(t!==l){if(!h)return a();t?a(false,t):n=setTimeout((()=>{a(false,1e-7);}),1e3);}h=false;}try{i=new IntersectionObserver(p,{...m,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(p,m);}i.observe(e);}(true),r}(c,n):null;let f,m=-1,h=null;a&&(h=new ResizeObserver((e=>{let[i]=e;i&&i.target===c&&h&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame((()=>{var e;null==(e=h)||e.observe(t);}))),n();})),c&&!l&&h.observe(c),h.observe(t));let p=l?kt(e):null;return l&&function t(){const i=kt(e);!p||i.x===p.x&&i.y===p.y&&i.width===p.width&&i.height===p.height||n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach((e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);})),null==d||d(),null==(e=h)||e.disconnect(),h=null,l&&cancelAnimationFrame(f);}}const _t=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=He(n),s=ze(n),l="y"===Ye(n),c=["left","top"].includes(a)?-1:1,u=r&&l?-1:1,d=je(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"==typeof h&&(m="end"===s?-1*h:h),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+l.x,y:r+l.y,data:{...l,placement:a}}}}},Ot=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=je(e,t),c={x:n,y:i},u=await pt(t,l),d=Ye(He(o)),f=$e(d);let m=c[f],h=c[d];if(r){const e="y"===f?"bottom":"right";m=Re(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";h=Re(h+u["y"===d?"top":"left"],h,h-u[e]);}const p=s.fn({...t,[f]:m,[d]:h});return {...p,data:{x:p.x-n,y:p.y-i}}}}},Ft=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:p=true,...g}=je(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=He(o),y=He(s)===s,w=await(null==l.isRTL?void 0:l.isRTL(c.floating)),b=f||(y||!p?[Je(s)]:function(e){const t=Je(e);return [We(e),t,We(t)]}(s));f||"none"===h||b.push(...function(e,t,n,i){const o=ze(e);let r=function(e,t,n){const i=["left","right"],o=["right","left"],r=["top","bottom"],a=["bottom","top"];switch(e){case "top":case "bottom":return n?t?o:i:t?i:o;case "left":case "right":return t?r:a;default:return []}}(He(e),"start"===n,i);return o&&(r=r.map((e=>e+"-"+o)),t&&(r=r.concat(r.map(We)))),r}(s,p,h,w));const k=[s,...b],C=await pt(t,g),N=[];let x=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&N.push(C[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=ze(e),o=Ue(e),r=Ve(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=Je(a)),[a,Je(a)]}(o,a,w);N.push(C[e[0]],C[e[1]]);}if(x=[...x,{placement:o,overflows:N}],!N.every((e=>e<=0))){var S,D;const e=((null==(S=r.flip)?void 0:S.index)||0)+1,t=k[e];if(t)return {data:{index:e,overflows:x},reset:{placement:t}};let n=null==(D=x.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:D.placement;if(!n)switch(m){case "bestFit":{var E;const e=null==(E=x.map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:E[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},Lt=(e,t,n)=>{const i=new Map,o={platform:Tt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=ht(c,i,l),f=i,m={},h=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:y,reset:w}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&h<=50&&(h++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):w.rects),({x:u,y:d}=ht(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:m}})(e,t,{...o,platform:r})};var Bt="undefined"!=typeof document?useLayoutEffect:useEffect;function Rt(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!=i--;)if(!Rt(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!=i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!=i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!Rt(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function jt(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function Ht(e,t){const n=jt(e);return Math.round(t*n)/n}function zt(e){const t=i.useRef(e);return Bt((()=>{t.current=e;})),t}const $t=(e,t)=>({...Ot(e),options:[e,t]}),Vt=(e,t)=>({...Ft(e),options:[e,t]});function Yt(e){return i.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}),e)}const Ut={...i},Wt=Ut.useInsertionEffect||(e=>e());function Jt(e){const t=i.useRef((()=>{}));return Wt((()=>{t.current=e;})),i.useCallback((function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)}),[])}const qt="ArrowUp",Kt="ArrowDown",Gt="ArrowLeft",Qt="ArrowRight";function Xt(e,t,n){return Math.floor(e/t)!==n}function Zt(e,t){return t<0||t>=e.current.length}function en(e,t){return nn(e,{disabledIndices:t})}function tn(e,t){return nn(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function nn(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&an(a,s,o));return s}function on(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function rn(e,t){return t.flatMap(((t,n)=>e.includes(t)?[n]:[]))}function an(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var sn="undefined"!=typeof document?useLayoutEffect:useEffect;function ln(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const cn=i.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function un(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=i.useState((()=>new Map)),s=i.useCallback((e=>{a((t=>new Map(t).set(e,null)));}),[]),l=i.useCallback((e=>{a((t=>{const n=new Map(t);return n.delete(e),n}));}),[]);return sn((()=>{const e=new Map(r);Array.from(e.keys()).sort(ln).forEach(((t,n)=>{e.set(t,n);})),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);}),[r]),i.createElement(cn.Provider,{value:i.useMemo((()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:o})),[s,l,r,n,o])},t)}function dn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=i.useContext(cn),[l,c]=i.useState(null),u=i.useRef(null),d=i.useCallback((e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const i=void 0!==t;s.current[l]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}}),[l,a,s,t]);return sn((()=>{const e=u.current;if(e)return n(e),()=>{o(e);}}),[n,o]),sn((()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);}),[r]),i.useMemo((()=>({ref:d,index:null==l?-1:l})),[l,d])}function fn(){return fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},fn.apply(this,arguments)}let mn=false,hn=0;const pn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+hn++;const gn=Ut.useId||function(){const[e,t]=i.useState((()=>mn?pn():void 0));return sn((()=>{null==e&&t(pn());}),[]),i.useEffect((()=>{mn=true;}),[]),e};function wn(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach((e=>e(n)));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter((e=>e!==n)))||[]);}}}const bn=i.createContext(null),kn=i.createContext(null),Cn=()=>{var e;return (null==(e=i.useContext(bn))?void 0:e.id)||null},Nn=()=>i.useContext(kn);function xn(e){const{children:t,id:n}=e,o=Cn();return i.createElement(bn.Provider,{value:i.useMemo((()=>({id:n,parentId:o})),[n,o])},t)}function Sn(e){const{children:t}=e,n=i.useRef([]),o=i.useCallback((e=>{n.current=[...n.current,e];}),[]),r=i.useCallback((e=>{n.current=n.current.filter((t=>t!==e));}),[]),a=i.useState((()=>wn()))[0];return i.createElement(kn.Provider,{value:i.useMemo((()=>({nodesRef:n,addNode:o,removeNode:r,events:a})),[o,r,a])},t)}function Dn(e){return "data-floating-ui-"+e}function En(e){const t=useRef(e);return sn((()=>{t.current=e;})),t}const In=Dn("safe-polygon");function An(e,t,n){return n&&!Ne(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Mn=0;function Tn(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(Mn);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():Mn=requestAnimationFrame(r);}function Pn(e,t){let n=e.filter((e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)})),i=n;for(;i.length;)i=e.filter((e=>{var t;return null==(t=i)?void 0:t.some((t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)}))})),n=n.concat(i);return n}let _n=new WeakMap,On=new WeakSet,Fn={},Ln=0;const Bn=e=>e&&(e.host||Bn(e.parentNode)),Rn=(e,t)=>t.map((t=>{if(e.contains(t))return t;const n=Bn(t);return e.contains(n)?n:null})).filter((e=>null!=e));function jn(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=xe(e[0]).body;return function(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=Rn(t,e),s=new Set,l=new Set(a),c=[];Fn[o]||(Fn[o]=new WeakMap);const u=Fn[o];return a.forEach((function e(t){t&&!s.has(t)&&(s.add(t),t.parentNode&&e(t.parentNode));})),function e(t){t&&!l.has(t)&&[].forEach.call(t.children,(t=>{if("script"!==Q(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(_n.get(t)||0)+1,a=(u.get(t)||0)+1;_n.set(t,i),u.set(t,a),c.push(t),1===i&&n&&On.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}}));}(t),s.clear(),Ln++,()=>{c.forEach((e=>{const t=(_n.get(e)||0)-1,n=(u.get(e)||0)-1;_n.set(e,t),u.set(e,n),t||(!On.has(e)&&r&&e.removeAttribute(r),On.delete(e)),n||e.removeAttribute(o);})),Ln--,Ln||(_n=new WeakMap,_n=new WeakMap,On=new WeakSet,Fn={});}}(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const Hn=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function zn(e,t){const n=ft(e,Hn());"prev"===t&&n.reverse();const i=n.indexOf(pe(xe(e)));return n.slice(i+1)[0]}function $n(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!ge(n,i)}const Vn={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function Yn(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const Un=i.forwardRef((function(e,t){const[n,o]=i.useState();sn((()=>(ke()&&o("button"),document.addEventListener("keydown",Yn),()=>{document.removeEventListener("keydown",Yn);})),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Dn("focus-guard")]:"",style:Vn};return i.createElement("span",fn({},e,r))})),Wn=i.createContext(null),Jn="data-floating-ui-focusable";function qn(e){return e?e.hasAttribute(Jn)?e:e.querySelector("["+Jn+"]")||e:null}const Kn=20;let Gn=[];function Qn(e){Gn=Gn.filter((e=>e.isConnected));let t=e;if(t&&"body"!==Q(t)){if(!mt(t,Hn())){const e=ft(t,Hn())[0];e&&(t=e);}Gn.push(t),Gn.length>Kn&&(Gn=Gn.slice(-20));}}function Xn(){return Gn.slice().reverse().find((e=>e.isConnected))}const Zn=i.forwardRef((function(e,t){return i.createElement("button",fn({},e,{type:"button",ref:t,tabIndex:-1,style:Vn}))}));function ei(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:h,nodeId:p,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:k}}=t,C="number"==typeof s&&s<0,N=Me(b)&&C,x="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,S=En(r),D=En(s),E=En(l),I=Nn(),A=i.useContext(Wn),M=i.useRef(null),T=i.useRef(null),P=i.useRef(false),_=i.useRef(false),O=i.useRef(-1),F=null!=A,L=qn(k),B=Jt((function(e){return void 0===e&&(e=L),e?ft(e,Hn()):[]})),R=Jt((e=>{const t=B(e);return S.current.map((e=>b&&"reference"===e?b:L&&"floating"===e?L:t)).filter(Boolean).flat()}));function j(e){return !o&&d&&u?i.createElement(Zn,{ref:"start"===e?M:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}i.useEffect((()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){ge(L,pe(xe(L)))&&0===B().length&&!N&&Ae(e);const t=R(),n=De(e);"reference"===S.current[0]&&n===b&&(Ae(e),e.shiftKey?Tn(t[t.length-1]):Tn(t[1])),"floating"===S.current[1]&&n===L&&e.shiftKey&&(Ae(e),Tn(t[0]));}}const t=xe(L);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}}),[o,b,L,u,S,N,B,R]),i.useEffect((()=>{if(!o&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=De(e),n=B().indexOf(t);-1!==n&&(O.current=n);}}),[o,k,B]),i.useEffect((()=>{if(!o&&f)return k&&ne(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){_.current=true,setTimeout((()=>{_.current=false;}));}function t(e){const t=e.relatedTarget;queueMicrotask((()=>{const n=!(ge(b,t)||ge(k,t)||ge(t,k)||ge(null==A?void 0:A.portalNode,t)||null!=t&&t.hasAttribute(Dn("focus-guard"))||I&&(Pn(I.nodesRef.current,p).find((e=>{var n,i;return ge(null==(n=e.context)?void 0:n.elements.floating,t)||ge(null==(i=e.context)?void 0:i.elements.domReference,t)}))||function(e,t){var n;let i=[],o=null==(n=e.find((e=>e.id===t)))?void 0:n.parentId;for(;o;){const t=e.find((e=>e.id===o));o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(I.nodesRef.current,p).find((e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t}))));if(c&&n&&pe(xe(L))===xe(L).body){ne(L)&&L.focus();const e=O.current,t=B(),n=t[e]||t[t.length-1]||L;ne(n)&&n.focus();}!N&&u||!t||!n||_.current||t===Xn()||(P.current=true,g(false,e,"focus-out"));}));}}),[o,b,k,L,u,p,I,A,g,f,c,B,N]),i.useEffect((()=>{var e;if(o)return;const t=Array.from((null==A||null==(e=A.portalNode)?void 0:e.querySelectorAll("["+Dn("portal")+"]"))||[]);if(k){const e=[k,...t,M.current,T.current,S.current.includes("reference")||N?b:null].filter((e=>null!=e)),n=u||N?jn(e,x,!x):jn(e);return ()=>{n();}}}),[o,b,k,u,S,A,N,x]),sn((()=>{if(o||!ne(L))return;const e=pe(xe(L));queueMicrotask((()=>{const t=R(L),n=D.current,i=("number"==typeof n?t[n]:n.current)||L,o=ge(L,e);C||o||!m||Tn(i,{preventScroll:i===L});}));}),[o,m,L,C,R,D]),sn((()=>{if(o||!L)return;let e=false;const t=xe(L),n=pe(t);let i=y.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&h.domReference.current&&Qn(h.domReference.current),"hover"===o&&"mouseleave"===r.type&&(P.current=true),"outside-press"===o&&(a?(P.current=false,e=true):P.current=!(we(r)||be(r)));}Qn(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,Vn),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=pe(t),o=ge(k,n)||I&&Pn(I.nodesRef.current,p).some((e=>{var t;return ge(null==(t=e.context)?void 0:t.elements.floating,n)}));(o||i&&["click","mousedown"].includes(i.type))&&h.domReference.current&&Qn(h.domReference.current);const s="boolean"==typeof E.current?Xn()||a:E.current.current||a;queueMicrotask((()=>{E.current&&!P.current&&ne(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();}));}}),[o,k,L,E,y,h,v,I,p,F,b]),i.useEffect((()=>{queueMicrotask((()=>{P.current=false;}));}),[o]),sn((()=>{if(!o&&A)return A.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:h}),()=>{A.setFocusManagerState(null);}}),[o,A,u,m,g,h,f]),sn((()=>{if(o)return;if(!L)return;if("function"!=typeof MutationObserver)return;if(C)return;const e=()=>{const e=L.getAttribute("tabindex"),t=B(),n=pe(xe(k)),i=t.indexOf(n);-1!==i&&(O.current=i),S.current.includes("floating")||n!==h.domReference.current&&0===t.length?"0"!==e&&L.setAttribute("tabindex","0"):"-1"!==e&&L.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(L,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}}),[o,k,L,h,S,B,C]);const H=!o&&x&&(!u||!N)&&(F||u);return i.createElement(i.Fragment,null,H&&i.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.beforeInsideRef,onFocus:e=>{if(u){const e=R();Tn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(P.current=false,$n(e,A.portalNode)){const e=zn(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=A.beforeOutsideRef.current)||t.focus();}}}),!N&&j("start"),n,j("end"),H&&i.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.afterInsideRef,onFocus:e=>{if(u)Tn(R()[0]);else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(f&&(P.current=true),$n(e,A.portalNode)){const e=zn(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=A.afterOutsideRef.current)||t.focus();}}}))}function ti(e){return ne(e.target)&&"BUTTON"===e.target.tagName}function ni(e){return Ie(e)}const ii={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},oi={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},ri=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function ai(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=gn(),a=i.useRef({}),[s]=i.useState((()=>wn())),l=null!=Cn();const[c,u]=i.useState(o.reference),d=Jt(((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:l}),null==n||n(e,t,i);})),f=i.useMemo((()=>({setPositionReference:u})),[]),m=i.useMemo((()=>({reference:c||o.reference||null,floating:o.floating||null,domReference:o.reference})),[c,o.reference,o.floating]);return i.useMemo((()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f})),[t,d,m,s,r,f])}function si(e){ void 0===e&&(e={});const{nodeId:t}=e,n=ai({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=i.useState(null),[l,c]=i.useState(null),u=(null==r?void 0:r.domReference)||a,d=i.useRef(null),f=Nn();sn((()=>{u&&(d.current=u);}),[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=i.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,h]=i.useState(o);Rt(m,o)||h(o);const[g,v]=i.useState(null),[y,w]=i.useState(null),b=i.useCallback((e=>{e!==x.current&&(x.current=e,v(e));}),[]),k=i.useCallback((e=>{e!==S.current&&(S.current=e,w(e));}),[]),C=a||g,N=s||y,x=i.useRef(null),S=i.useRef(null),D=i.useRef(d),E=null!=c,I=zt(c),A=zt(r),M=zt(u),T=i.useCallback((()=>{if(!x.current||!S.current)return;const e={placement:t,strategy:n,middleware:m};A.current&&(e.platform=A.current),Lt(x.current,S.current,e).then((e=>{const t={...e,isPositioned:false!==M.current};P.current&&!Rt(D.current,t)&&(D.current=t,p$1.flushSync((()=>{f(t);})));}));}),[m,t,n,A,M]);Bt((()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f((e=>({...e,isPositioned:false}))));}),[u]);const P=i.useRef(false);Bt((()=>(P.current=true,()=>{P.current=false;})),[]),Bt((()=>{if(C&&(x.current=C),N&&(S.current=N),C&&N){if(I.current)return I.current(C,N,T);T();}}),[C,N,T,I,E]);const _=i.useMemo((()=>({reference:x,floating:S,setReference:b,setFloating:k})),[b,k]),O=i.useMemo((()=>({reference:C,floating:N})),[C,N]),F=i.useMemo((()=>{const e={position:n,left:0,top:0};if(!O.floating)return e;const t=Ht(O.floating,d.x),i=Ht(O.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+i+"px)",...jt(O.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}}),[n,l,O.floating,d.x,d.y]);return i.useMemo((()=>({...d,update:T,refs:_,elements:O,floatingStyles:F})),[d,T,_,O,F])}({...e,elements:{...r,...l&&{reference:l}}}),h=i.useCallback((e=>{const t=te(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);}),[m.refs]),g=i.useCallback((e=>{(te(e)||null===e)&&(d.current=e,s(e)),(te(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!te(e))&&m.refs.setReference(e);}),[m.refs]),v=i.useMemo((()=>({...m.refs,setReference:g,setPositionReference:h,domReference:d})),[m.refs,g,h]),y=i.useMemo((()=>({...m.elements,domReference:u})),[m.elements,u]),w=i.useMemo((()=>({...m,...o,refs:v,elements:y,nodeId:t})),[m,v,y,t,o]);return sn((()=>{o.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find((e=>e.id===t));e&&(e.context=w);})),i.useMemo((()=>({...m,context:w,refs:v,elements:y})),[m,v,y,w])}const li="active",ci="selected";function ui(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[li]:t,[ci]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[Jn]:""},...r,...t.map((t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i})).concat(e).reduce(((e,t)=>t?(Object.entries(t).forEach((t=>{let[n,r]=t;var a;o&&[li,ci].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map((e=>e(...o))).find((e=>void 0!==e))})):e[n]=r);})),e):e),{})}}let di=false;function fi(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function mi(e,t){return fi(t,e===qt||e===Kt,e===Gt||e===Qt)}function hi(e,t,n){return fi(t,e===Kt,n?e===Gt:e===Qt)||"Enter"===e||" "===e||""===e}function pi(e,t,n){return fi(t,n?e===Qt:e===Gt,e===qt)}function gi(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=(()=>{}),enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:h=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:k=1,scrollItemIntoView:C=true,virtualItemRef:N,itemSizes:x,dense:S=false}=t;const D=En(qn(r.floating)),E=Cn(),I=Nn(),A=Jt(l),M=Me(r.domReference),T=i.useRef(g),P=i.useRef(null!=u?u:-1),_=i.useRef(null),O=i.useRef(true),F=i.useRef(A),L=i.useRef(!!r.floating),B=i.useRef(n),R=i.useRef(false),j=i.useRef(false),H=En(w),z=En(n),$=En(C),V=En(u),[Y,U]=i.useState(),[W,J]=i.useState(),q=Jt((function(e,t,n){function i(e){p?(U(e.id),null==I||I.events.emit("virtualfocus",e),N&&(N.current=e)):Tn(e,{preventScroll:true,sync:!(!ve().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!ke())&&(di||R.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame((()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=$.current;a&&G&&(n||!O.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));}));}));sn((()=>{document.createElement("div").focus({get preventScroll(){return di=true,false}});}),[]),sn((()=>{c&&(n&&r.floating?T.current&&null!=u&&(j.current=true,P.current=u,A(u)):L.current&&(P.current=-1,F.current(null)));}),[c,n,r.floating,u,A]),sn((()=>{if(c&&n&&r.floating)if(null==s){if(R.current=false,null!=V.current)return;if(L.current&&(P.current=-1,q(a,P)),(!B.current||!L.current)&&T.current&&(null!=_.current||true===T.current&&null==_.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else P.current=null==_.current||hi(_.current,b,h)||m?en(a,H.current):tn(a,H.current),_.current=null,A(P.current);};t();}}else Zt(a,s)||(P.current=s,q(a,P,j.current),j.current=false);}),[c,n,r.floating,s,V,m,a,b,h,A,q,H]),sn((()=>{var e;if(!c||r.floating||!I||p||!L.current)return;const t=I.nodesRef.current,n=null==(e=t.find((e=>e.id===E)))||null==(e=e.context)?void 0:e.elements.floating,i=pe(xe(r.floating)),o=t.some((e=>e.context&&ge(e.context.elements.floating,i)));n&&!o&&O.current&&n.focus({preventScroll:true});}),[c,r.floating,I,E,p]),sn((()=>{if(c&&I&&p&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){J(e.id),N&&(N.current=e);}}),[c,I,p,E,N]),sn((()=>{F.current=A,L.current=!!r.floating;})),sn((()=>{n||(_.current=null);}),[n]),sn((()=>{B.current=n;}),[n]);const K=null!=s,G=i.useMemo((()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&A(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;O.current&&"touch"!==t&&(P.current=-1,q(a,P),A(null),p||Tn(D.current,{preventScroll:true}));}}}}),[n,D,q,v,a,A,p]),Q=Jt((e=>{if(O.current=false,R.current=true,229===e.which)return;if(!z.current&&e.currentTarget===D.current)return;if(m&&pi(e.key,b,h))return Ae(e),o(false,e.nativeEvent,"list-navigation"),void(ne(r.domReference)&&(p?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=P.current,i=en(a,w),s=tn(a,w);if(M||("Home"===e.key&&(Ae(e),P.current=i,A(P.current)),"End"===e.key&&(Ae(e),P.current=s,A(P.current))),k>1){const t=x||Array.from({length:a.current.length},(()=>({width:1,height:1}))),n=function(e,t,n){const i=[];let o=0;return e.forEach(((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(o=0);!l;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every((e=>null==i[e]))?(e.forEach((e=>{i[e]=r;})),l=true):o++;}})),[...i]}(t,k,S),o=n.findIndex((e=>null!=e&&!an(a.current,e,w))),r=n.reduce(((e,t,n)=>null==t||an(a.current,t,w)?e:n),-1),l=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===qt){if(d&&Ae(n),-1===u)f=c;else if(f=nn(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}Zt(e,f)&&(f=u);}if(n.key===Kt&&(d&&Ae(n),-1===u?f=l:(f=nn(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>c&&(f=nn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Zt(e,f)&&(f=u)),"both"===i){const t=Oe(u/a);n.key===(r?Gt:Qt)&&(d&&Ae(n),u%a!=a-1?(f=nn(e,{startingIndex:u,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s})),Xt(f,a,t)&&(f=u)),n.key===(r?Qt:Gt)&&(d&&Ae(n),u%a!=0?(f=nn(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),Xt(f,a,t)&&(f=u));const i=Oe(c/a)===t;Zt(e,f)&&(f=o&&i?n.key===(r?Qt:Gt)?c:nn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map((e=>null!=e?a.current[e]:null))},{event:e,orientation:b,loop:f,rtl:h,cols:k,disabledIndices:rn([...w||a.current.map(((e,t)=>an(a.current,t)?t:void 0)),void 0],n),minIndex:o,maxIndex:r,prevIndex:on(P.current>s?i:P.current,t,n,k,e.key===Kt?"bl":e.key===(h?Gt:Qt)?"tr":"tl"),stopEvent:true})];if(null!=l&&(P.current=l,A(P.current)),"both"===b)return}if(mi(e.key,b)){if(Ae(e),n&&!p&&pe(e.currentTarget.ownerDocument)===e.currentTarget)return P.current=hi(e.key,b,h)?i:s,void A(P.current);hi(e.key,b,h)?P.current=f?t>=s?d&&t!==a.current.length?-1:i:nn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,nn(a,{startingIndex:t,disabledIndices:w})):P.current=f?t<=i?d&&-1!==t?a.current.length:s:nn(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(i,nn(a,{startingIndex:t,decrement:true,disabledIndices:w})),Zt(a,P.current)?A(null):A(P.current);}})),X=i.useMemo((()=>p&&n&&K&&{"aria-activedescendant":W||Y}),[p,n,K,W,Y]),Z=i.useMemo((()=>({"aria-orientation":"both"===b?void 0:b,...!Me(r.domReference)&&X,onKeyDown:Q,onPointerMove(){O.current=true;}})),[X,Q,r.domReference,b]),ee=i.useMemo((()=>{function e(e){"auto"===g&&we(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){O.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return fi(t,n?e===Gt:e===Qt,e===Kt)}(e.key,b,h),l=pi(e.key,b,h),c=mi(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==I?void 0:I.nodesRef.current.find((e=>null==e.parentId)),n=I&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),Pn(e,o).forEach((e=>{t(e.id,r+1);}));}(t,0),e.find((e=>e.id===n))}(I.nodesRef.current,t.id):null;if(r&&n&&N){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=l&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find((e=>(null==e?void 0:e.id)===Y)):null;o&&(Ae(e),o.dispatchEvent(t),J(void 0));}var v;if((c||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ae(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(_.current=m&&c?null:e.key),m?s&&(Ae(e),n?(P.current=en(a,H.current),A(P.current)):o(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(P.current=u),Ae(e),!n&&y?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&A(P.current)));},onFocus(){n&&!p&&A(null);},onPointerDown:function(e){T.current=g,"auto"===g&&be(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}}),[Y,X,Q,H,g,a,m,A,o,n,y,b,h,u,I,p,N]);return i.useMemo((()=>c?{reference:ee,floating:Z,item:G}:{}),[c,ee,Z,G])}const vi=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function yi(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=i!=c>=i&&n<=(l-r)*(i-s)/(c-s)+r&&(o=!o);}return o}function wi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:h}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=De(e),b="mouseleave"===e.type,k=ge(d.floating,w),C=ge(d.domReference,w),N=d.domReference.getBoundingClientRect(),x=d.floating.getBoundingClientRect(),S=u.split("-")[0],D=n>x.right-x.width/2,E=c>x.bottom-x.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,N),A=x.width>N.width,M=x.height>N.height,T=(A?N:x).left,P=(A?N:x).right,_=(M?N:x).top,O=(M?N:x).bottom;if(k&&(r=true,!b))return;if(C&&(r=false),C&&!b)return void(r=true);if(b&&te(e.relatedTarget)&&ge(d.floating,e.relatedTarget))return;if(h&&Pn(h.nodesRef.current,m).some((e=>{let{context:t}=e;return null==t?void 0:t.open})))return;if("top"===S&&c>=N.bottom-1||"bottom"===S&&c<=N.top+1||"left"===S&&n>=N.right-1||"right"===S&&n<=N.left+1)return p();let F=[];switch(S){case "top":F=[[T,N.top+1],[T,x.bottom-1],[P,x.bottom-1],[P,N.top+1]];break;case "bottom":F=[[T,x.top+1],[T,N.bottom-1],[P,N.bottom-1],[P,x.top+1]];break;case "left":F=[[x.right-1,O],[x.right-1,_],[N.left+1,_],[N.left+1,O]];break;case "right":F=[[N.right-1,O],[N.right-1,_],[x.left+1,_],[x.left+1,O]];}if(!yi([g,v],F)){if(r&&!I)return p();if(!b&&i){const t=function(e,t){const n=performance.now(),i=n-l;if(null===a||null===s||0===i)return a=e,s=t,l=n,null;const o=e-a,r=t-s,c=Math.sqrt(o*o+r*r);return a=e,s=t,l=n,c/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}yi([g,v],function(e){let[n,i]=e;switch(S){case "top":return [[A?n+t/2:D?n+4*t:n-4*t,i+t+1],[A?n-t/2:D?n+4*t:n-4*t,i+t+1],...[[x.left,D||A?x.bottom-t:x.top],[x.right,D?A?x.bottom-t:x.top:x.bottom-t]]];case "bottom":return [[A?n+t/2:D?n+4*t:n-4*t,i-t],[A?n-t/2:D?n+4*t:n-4*t,i-t],...[[x.left,D||A?x.top+t:x.bottom],[x.right,D?A?x.top+t:x.bottom:x.top+t]]];case "left":{const e=[n+t+1,M?i+t/2:E?i+4*t:i-4*t],o=[n+t+1,M?i-t/2:E?i+4*t:i-4*t];return [...[[E||M?x.right-t:x.left,x.top],[E?M?x.right-t:x.left:x.right-t,x.bottom]],e,o]}case "right":return [[n-t,M?i+t/2:E?i+4*t:i-4*t],[n-t,M?i-t/2:E?i+4*t:i-4*t],...[[E||M?x.left+t:x.right,x.top],[E?M?x.left+t:x.right:x.left+t,x.bottom]]]}}([n,c]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return c.__options={blockPointerEvents:n},c}const bi=createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),ki=forwardRef((({className:t,disabled:n,children:i,...o},r)=>{const a=useContext(bi),l=dn(),c=Nn(),u=l.index===a.activeIndex,d=k("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:Yt([l.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,...o,...a.getItemProps({onClick(e){o.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){o.onFocus?.(e),a.setHasFocusInside(true);}}),children:i})}));ki.displayName="DropdownMenuItem";const Ci=forwardRef((({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:m,children:h,...p},g)=>{const[v,y]=useState(false),[w,b]=useState(false),[C,N]=useState(null),x=useRef([]),S=useRef([]),D=useContext(bi),E=Nn(),I=function(e){const t=gn(),n=Nn(),i=Cn();return sn((()=>{const e={id:t,parentId:i};return null==n||n.addNode(e),()=>{null==n||n.removeNode(e);}}),[n,t,i]),t}(),M=Cn(),T=dn(),P=null!=M,{floatingStyles:_,refs:O,context:F}=si({nodeId:I,open:v,onOpenChange:y,placement:P?"right-start":"bottom-start",middleware:[(L={mainAxis:P?0:4,alignmentAxis:P?-4:0},{..._t(L),options:[L,B]}),Vt(),$t()],whileElementsMounted:Pt});var L,B;const R=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,h=Nn(),p=Cn(),g=En(u),v=En(c),y=En(n),w=i.useRef(),b=i.useRef(-1),k=i.useRef(),C=i.useRef(-1),N=i.useRef(true),x=i.useRef(false),S=i.useRef((()=>{})),D=i.useRef(false),E=i.useCallback((()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t}),[r]);i.useEffect((()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(C.current),N.current=true,D.current=false);}}),[l,a]),i.useEffect((()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&o(false,e,"hover");}const t=xe(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}}),[s.floating,n,o,l,g,E]);const I=i.useCallback((function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=An(v.current,"close",w.current);i&&!k.current?(clearTimeout(b.current),b.current=window.setTimeout((()=>o(false,e,n)),i)):t&&(clearTimeout(b.current),o(false,e,n));}),[v,o]),A=Jt((()=>{S.current(),k.current=void 0;})),M=Jt((()=>{if(x.current){const e=xe(s.floating).body;e.style.pointerEvents="",e.removeAttribute(In),x.current=false;}})),T=Jt((()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type)));i.useEffect((()=>{if(l&&te(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(b.current),N.current=false,d&&!Ne(w.current)||f>0&&!An(v.current,"open"))return;const t=An(v.current,"open",w.current);t?b.current=window.setTimeout((()=>{y.current||o(true,e,"hover");}),t):n||o(true,e,"hover");}function i(e){if(T())return;S.current();const t=xe(s.floating);if(clearTimeout(C.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),k.current=g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e,true,"safe-polygon");}});const i=k.current;return t.addEventListener("mousemove",i),void(S.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==w.current||!ge(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e);}})(e));}}),[s,l,e,d,f,m,I,A,M,o,n,y,h,v,g,r,T]),sn((()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){x.current=true;const e=s.floating;if(te(s.domReference)&&e){var t;const n=xe(s.floating).body;n.setAttribute(In,"");const i=s.domReference,o=null==h||null==(t=h.nodesRef.current.find((e=>e.id===p)))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}}),[l,n,p,s,h,g,E]),sn((()=>{n||(w.current=void 0,D.current=false,A(),M());}),[n,A,M]),i.useEffect((()=>()=>{A(),clearTimeout(b.current),clearTimeout(C.current),M();}),[l,s.domReference,A,M]);const P=i.useMemo((()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){N.current||y.current||o(true,t,"hover");}d&&!Ne(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(C.current),"touch"===w.current?i():(D.current=true,C.current=window.setTimeout(i,f)));}}}),[d,o,n,y,f]),_=i.useMemo((()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}})),[I,T]);return i.useMemo((()=>l?{reference:P,floating:_}:{}),[l,P,_])}(F,{enabled:P,delay:{open:75},handleClose:wi({blockPointerEvents:true})}),j=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=i.useRef(),h=i.useRef(false),p=i.useMemo((()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(Ne(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:Ne(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||ti(e)||(" "!==e.key||ni(a)||(e.preventDefault(),h.current=true),"Enter"===e.key&&o(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||ti(e)||ni(a)||" "===e.key&&h.current&&(h.current=false,o(!n||!c,e.nativeEvent,"click"));}})),[r,a,l,u,d,o,n,f,c]);return i.useMemo((()=>s?{reference:p}:{}),[s,p])}(F,{event:"mousedown",toggle:!P,ignoreMouse:P}),H=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=vi.get(s))?n:s,c=gn(),u=null!=Cn(),d=i.useMemo((()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":o?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}}),[l,r,u,o,c,s]),f=i.useMemo((()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}}),[l,r,c,s]),m=i.useCallback((e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}}),[r,s]);return i.useMemo((()=>a?{reference:d,floating:f,item:m}:{}),[a,d,f,m])}(F,{role:"menu"}),z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:h,capture:p}=t,g=Nn(),v=Jt("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=i.useRef(false),b=i.useRef(false),{escapeKey:k,outsidePress:C}=ri(h),{escapeKey:N,outsidePress:x}=ri(p),S=i.useRef(false),D=Jt((e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(S.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?Pn(g.nodesRef.current,i):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);})),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");})),E=Jt((e=>{var t;const n=()=>{var t;D(e),null==(t=De(e))||t.removeEventListener("keydown",n);};null==(t=De(e))||t.addEventListener("keydown",n);})),I=Jt((e=>{var t;const n=w.current;w.current=false;const i=b.current;if(b.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=De(e),l="["+Dn("inert")+"]",c=xe(r.floating).querySelectorAll(l);let d=te(s)?s:null;for(;d&&!ce(d);){const e=fe(d);if(ce(e)||!te(e))break;d=e;}if(c.length&&te(s)&&!s.matches("html,body")&&!ge(s,r.floating)&&Array.from(c).every((e=>!ge(d,e))))return;if(ne(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===ue(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&Pn(g.nodesRef.current,f).some((t=>{var n;return Se(e,null==(n=t.context)?void 0:n.elements.floating)}));if(Se(e,r.floating)||Se(e,r.domReference)||m)return;const h=g?Pn(g.nodesRef.current,f):[];if(h.length>0){let e=true;if(h.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);})),!e)return}o(false,e,"outside-press");})),A=Jt((e=>{var t;const n=()=>{var t;I(e),null==(t=De(e))||t.removeEventListener(u,n);};null==(t=De(e))||t.addEventListener(u,n);}));i.useEffect((()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=C;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),S.current=true;}function c(){e=window.setTimeout((()=>{S.current=false;}),le()?5:0);}const d=xe(r.floating);l&&(d.addEventListener("keydown",N?E:D,N),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,x?A:I,x);let f=[];return m&&(te(r.domReference)&&(f=he(r.domReference)),te(r.floating)&&(f=f.concat(he(r.floating))),!te(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(he(r.reference.contextElement)))),f=f.filter((e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)})),f.forEach((e=>{e.addEventListener("scroll",t,{passive:true});})),()=>{l&&(d.removeEventListener("keydown",N?E:D,N),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,x?A:I,x),f.forEach((e=>{e.removeEventListener("scroll",t);})),window.clearTimeout(e);}}),[a,r,l,y,u,n,o,m,s,k,C,D,N,E,I,x,A]),i.useEffect((()=>{w.current=false;}),[y,u]);const M=i.useMemo((()=>({onKeyDown:D,[ii[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}})),[D,o,d,f]),T=i.useMemo((()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[oi[u]]:()=>{w.current=true;}})),[D,u]);return i.useMemo((()=>s?{reference:M,floating:T}:{}),[s,M,T])}(F,{bubbles:true}),$=gi(F,{listRef:x,activeIndex:C,nested:P,onNavigate:N}),{getReferenceProps:V,getFloatingProps:Y,getItemProps:U}=function(e){ void 0===e&&(e=[]);const t=e.map((e=>null==e?void 0:e.reference)),n=e.map((e=>null==e?void 0:e.floating)),o=e.map((e=>null==e?void 0:e.item)),r=i.useCallback((t=>ui(t,e,"reference")),t),a=i.useCallback((t=>ui(t,e,"floating")),n),s=i.useCallback((t=>ui(t,e,"item")),o);return i.useMemo((()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s})),[r,a,s])}([R,j,H,z,$]);useEffect((()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}}),[E,I,M]),useEffect((()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});}),[E,v,I,M]);const W={activeIndex:C,setActiveIndex:N,getItemProps:U,setHasFocusInside:b,isOpen:v,setIsOpen:y},J=useMemo((()=>W),[C,N,U,b,v]),q=k("io-dropdown-menu-button",P&&"io-dropdown-menu-item",v&&!P&&"active",n),K=Yt([O.setReference,T.ref,g]),G=D.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(xn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:q,ref:K,variant:P?"link":o,tabIndex:P?G:void 0,role:P?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":P?"":void 0,"data-focus-inside":w?"":void 0,text:f,icon:P?"chevron-right":r,iconSize:"10",iconRight:!!P||a,disabled:m,...V(D.getItemProps({onFocus(e){p.onFocus?.(e),b(false),D.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx(bi.Provider,{value:J,children:jsxRuntimeExports.jsx(un,{elementsRef:x,labelsRef:S,children:v&&jsxRuntimeExports.jsx(ei,{context:F,modal:false,initialFocus:P?-1:0,returnFocus:!P,children:jsxRuntimeExports.jsx("div",{ref:O.setFloating,className:"io-dropdown-menu",style:_,...Y(),children:h})})})})]})}));function Ni({className:t,...n}){const i=k("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}Ci.displayName="DropdownMenu";const xi=forwardRef((({...t},n)=>null===Cn()?jsxRuntimeExports.jsx(Sn,{children:jsxRuntimeExports.jsx(Ci,{ref:n,...t})}):jsxRuntimeExports.jsx(Ci,{ref:n,...t})));function Di({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const l=k("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Ei({className:t,children:n,...i}){const o=k("io-panel-header",t);return jsxRuntimeExports.jsx(Y,{className:o,...i,children:n})}xi.displayName="DropdownMenu",xi.Item=ki,xi.Separator=Ni,Ei.Title=E,Ei.ButtonGroup=V,Ei.Button=A,Ei.ButtonIcon=N,Ei.Dropdown=$;const Ii=forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})}));function Ai({className:t,...n}){const i=k("io-panel-footer",t);return jsxRuntimeExports.jsx(J,{className:i,...n})}function Mi({className:t,children:n,...i}){const o=k("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pi({className:t,variant:n="active",value:i=0,...o}){const r=k("io-progress",n,t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${i<0?0:i>100?100:i}%`}})})}function _i({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}Ii.displayName="PanelBody",Ai.ButtonGroup=V,Ai.Button=A,Ai.ButtonIcon=N,Ai.Dropdown=$,Mi.Header=Ei,Mi.Body=Ii,Mi.Footer=Ai;const Oi=forwardRef((({id:n="input",className:i,type:o="text",name:a="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:h,readOnly:p,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=k("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",h&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i),N=useCallback((e=>{h?e.preventDefault():u&&u(e);}),[u,h]),x=useCallback((e=>{h?e.preventDefault():f&&f(e);}),[f,h]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(C,{variant:c,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:o,name:a,tabIndex:0,placeholder:m??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),disabled:h,readOnly:p,...y}),d&&jsxRuntimeExports.jsx(C,{variant:d,onClick:e=>x(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,children:[jsxRuntimeExports.jsx(C,{variant:"close"}),g]})]})}));Oi.displayName="Input";const Fi=forwardRef((({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=k("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:l,disabled:c,readOnly:u,rows:s,...d})]})}));Fi.displayName="Textarea";const Li=forwardRef((({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Li.displayName="Checkbox";const Bi=forwardRef((({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Bi.displayName="Radio";const Ri=forwardRef((({id:n="toggle",className:i,name:o="toggle",align:r="left",label:a="Toggle",checked:s,disabled:l,...c},u)=>{const d=k("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:d,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,checked:s,disabled:l,...c}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})}));function Vi(e,t=500){const[n,i]=useState(e);return useEffect((()=>{const n=setTimeout((()=>{i(e);}),t);return ()=>clearTimeout(n)}),[e,t]),n}Ri.displayName="Toggle";const Ji=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function qi(){return useMemo((()=>"object"==typeof window&&Ji()),[])}createContext({theme:"dark"});const Xi="___platform_prefs___",eo="_launchpad_pinnedPosition",to="_launchpad_allowDocking",no="_launchpad_minimizeToTray",io="_launchpad_autoCloseStartingAppsAndWorkspaces",oo="_launchpad_showTutorialOnStartup",ro="_layouts_restoreLastSaved",ao="_layouts_saveCurrentOnExit",so="_layouts_showUnsavedChangesPrompt",lo="_layouts_showDeletePrompt",co="_downloads_askForEachDownload",uo="_widget_enableForExternalApps",mo=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),ho={SUCCESS:"success",WARNING:"warning"},po={success:5e3,warning:1e4};var go=function(e){return {ok:true,result:e}},vo=function(e){return {ok:false,error:e}},yo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:go(e(t.result,n.result))},wo=function(e,t){return  true===t.ok?t:vo(e(t.error))},bo=function(){return bo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},bo.apply(this,arguments)};function ko(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!ko(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!ko(e[i[n]],t[i[n]]))return  false}return  true}}var Co=function(e){return Array.isArray(e)},No=function(e){return "object"==typeof e&&null!==e&&!Co(e)},xo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},So=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},Do=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return bo({at:e+(n||"")},i)},Eo=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return wo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?go(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?go(e):vo({message:xo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?go(e):vo({message:xo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?go(e):vo({message:xo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return ko(e,t)?go(t):vo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(No(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?vo({message:"the key '"+i+"' is required but was not present"}):vo(Do("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return go(n)}return No(e)?go(e):vo({message:xo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Co(e)&&t){return e.reduce((function(e,n,i){return yo((function(e,t){return e.concat([t])}),e,function(e,n){return wo((function(e){return Do("["+n+"]",e)}),t.decode(e))}(n,i))}),go([]))}return Co(e)?go(e):vo({message:xo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Co(e)){if(e.length!==t.length)return vo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return vo(Do("["+i+"]",o.error));n[i]=o.result;}return go(n)}return vo({message:xo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return yo(Object.assign,t,n.decode(e))}),go({}))}))},e.anyJson=function(){return new e((function(e){return go(e)}))},e.unknownJson=function(){return new e((function(e){return go(e)}))},e.dict=function(t){return new e((function(e){if(No(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return vo(Do("."+i,o.error));n[i]=o.result;}return go(n)}return vo({message:xo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?go(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return vo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return go(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return vo({at:So(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!No(i))return vo({at:So(t.slice(0,o+1)),message:xo("an object",i)});if("number"==typeof t[o]&&!Co(i))return vo({at:So(t.slice(0,o+1)),message:xo("an array",i)});i=i[t[o]];}return wo((function(e){return void 0===i?{at:So(t),message:"path does not exist"}:Do(So(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return go(t)}))},e.fail=function(t){return new e((function(e){return vo({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Io=Eo.string;Eo.number;var Ao=Eo.boolean,Mo=Eo.anyJson;Eo.unknownJson;var To=Eo.constant,Po=Eo.object,_o=Eo.array;Eo.tuple,Eo.dict;var Oo=Eo.optional,Fo=Eo.oneOf;Eo.union,Eo.intersection,Eo.withDefault,Eo.valueAt,Eo.succeed,Eo.fail,Eo.lazy;const Lo=["name","title","version","customProperties","icon","caption","type"],Bo=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var Ro=function(e){return {ok:true,result:e}},jo=function(e){return {ok:false,error:e}},Ho=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Ro(e(t.result,n.result))},zo=function(e,t){return  true===t.ok?t:jo(e(t.error))},$o=function(){return $o=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},$o.apply(this,arguments)};function Vo(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Vo(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!Vo(e[i[n]],t[i[n]]))return  false}return  true}}var Yo=function(e){return Array.isArray(e)},Uo=function(e){return "object"==typeof e&&null!==e&&!Yo(e)},Wo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Jo=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},qo=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return $o({at:e+(n||"")},i)},Ko=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return zo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?Ro(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?Ro(e):jo({message:Wo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?Ro(e):jo({message:Wo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?Ro(e):jo({message:Wo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return Vo(e,t)?Ro(t):jo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(Uo(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?jo({message:"the key '"+i+"' is required but was not present"}):jo(qo("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return Ro(n)}return Uo(e)?Ro(e):jo({message:Wo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Yo(e)&&t){return e.reduce((function(e,n,i){return Ho((function(e,t){return e.concat([t])}),e,function(e,n){return zo((function(e){return qo("["+n+"]",e)}),t.decode(e))}(n,i))}),Ro([]))}return Yo(e)?Ro(e):jo({message:Wo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Yo(e)){if(e.length!==t.length)return jo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return jo(qo("["+i+"]",o.error));n[i]=o.result;}return Ro(n)}return jo({message:Wo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return Ho(Object.assign,t,n.decode(e))}),Ro({}))}))},e.anyJson=function(){return new e((function(e){return Ro(e)}))},e.unknownJson=function(){return new e((function(e){return Ro(e)}))},e.dict=function(t){return new e((function(e){if(Uo(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return jo(qo("."+i,o.error));n[i]=o.result;}return Ro(n)}return jo({message:Wo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?Ro(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return jo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return Ro(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return jo({at:Jo(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!Uo(i))return jo({at:Jo(t.slice(0,o+1)),message:Wo("an object",i)});if("number"==typeof t[o]&&!Yo(i))return jo({at:Jo(t.slice(0,o+1)),message:Wo("an array",i)});i=i[t[o]];}return zo((function(e){return void 0===i?{at:Jo(t),message:"path does not exist"}:qo(Jo(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return Ro(t)}))},e.fail=function(t){return new e((function(e){return jo({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Go=Ko.string,Qo=Ko.number,Xo=Ko.boolean,Zo=Ko.anyJson;Ko.unknownJson;var er=Ko.constant,tr=Ko.object,nr=Ko.array;Ko.tuple;var ir=Ko.dict,or=Ko.optional,rr=Ko.oneOf;Ko.union,Ko.intersection,Ko.withDefault,Ko.valueAt,Ko.succeed,Ko.fail,Ko.lazy;const ar=Go().where((e=>e.length>0),"Expected a non-empty string"),sr=Qo().where((e=>e>=0),"Expected a non-negative number"),lr=tr({name:ar,displayName:or(Go()),contexts:or(nr(Go())),customConfig:or(tr())}),cr=rr(er("web"),er("native"),er("citrix"),er("onlineNative"),er("other")),ur=tr({url:ar}),dr=tr({src:ar,size:or(ar),type:or(ar)}),fr=tr({src:ar,size:or(ar),type:or(ar),label:or(ar)}),mr=tr({contexts:nr(ar),displayName:or(ar),resultType:or(ar),customConfig:or(Zo())}),hr=tr({listensFor:or(ir(mr)),raises:or(ir(nr(ar)))}),pr=tr({broadcasts:or(nr(ar)),listensFor:or(nr(ar))}),gr=tr({name:ar,description:or(ar),broadcasts:or(nr(ar)),listensFor:or(nr(ar))}),vr=tr({intents:or(hr),userChannels:or(pr),appChannels:or(nr(gr))}),yr=tr({url:or(ar),top:or(Qo()),left:or(Qo()),width:or(sr),height:or(sr)}),wr=tr({name:or(ar),type:or(ar.where((e=>"window"===e),"Expected a value of window")),title:or(ar),version:or(ar),customProperties:or(Zo()),icon:or(Go()),caption:or(Go()),details:or(yr),intents:or(nr(lr)),hidden:or(Xo())}),br=tr({name:ar,appId:ar,title:or(ar),version:or(ar),manifest:ar,manifestType:ar,tooltip:or(ar),description:or(ar),contactEmail:or(ar),supportEmail:or(ar),publisher:or(ar),images:or(nr(tr({url:or(ar)}))),icons:or(nr(tr({icon:or(ar)}))),customConfig:Zo(),intents:or(nr(lr))}),kr=tr({appId:or(ar),name:or(ar),details:or(ur),version:or(ar),title:or(ar),tooltip:or(ar),lang:or(ar),description:or(ar),categories:or(nr(ar)),icons:or(nr(dr)),screenshots:or(nr(fr)),contactEmail:or(ar),supportEmail:or(ar),moreInfo:or(ar),publisher:or(ar),customConfig:or(nr(Zo())),hostManifests:or(Zo()),interop:or(vr)}),Cr=tr({appId:ar,name:ar,type:cr,details:ur,version:or(ar),title:or(ar),tooltip:or(ar),lang:or(ar),description:or(ar),categories:or(nr(ar)),icons:or(nr(dr)),screenshots:or(nr(fr)),contactEmail:or(ar),supportEmail:or(ar),moreInfo:or(ar),publisher:or(ar),customConfig:or(nr(Zo())),hostManifests:or(Zo()),interop:or(vr),localizedVersions:or(ir(kr))}),Nr=rr(br,Cr),xr=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class Sr{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=Nr.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:xr(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Nr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(i.error)}`);const o=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...o,intents:"1.2"===n?o.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=wr.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Nr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(i.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const o=e,r={name:o.appId,type:this.fdc3ToDesktopDefinitionType[o.type],details:o.details,version:o.version,title:o.title,tooltip:o.tooltip,caption:o.description,icon:this.getIconFromDefinition(o,"2.0"),intents:this.getIntentsFromV2AppDefinition(o),fdc3:{...o,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)))):Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)&&!Bo.includes(e))))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map((e=>{const[t,n]=e;return {name:t,...n}}))}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find((e=>e.icon))?.icon||void 0:e.icons?.find((e=>e.src))?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const i={...e.createOptions,...t.details};n.createOptions=i,n.userProperties.details=i;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Dr={common:{nonEmptyStringDecoder:ar,nonNegativeNumberDecoder:sr},fdc3:{allDefinitionsDecoder:Nr,v1DefinitionDecoder:br,v2DefinitionDecoder:Cr}};var Er;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Er||(Er={}));const Ir=new class{_fdc3;_decoders=Dr;_errors={intents:Er};get fdc3(){return this._fdc3||(this._fdc3=(new Sr).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Ir.fdc3;const Ar=Ir.decoders;Ir.errors;const Mr=Ar.common.nonEmptyStringDecoder,Tr=Fo(To("add"),To("align-bottom"),To("align-bottom-solid"),To("align-left"),To("align-left-bottom"),To("align-left-bottom-solid"),To("align-left-solid"),To("align-left-top"),To("align-left-top-solid"),To("align-right"),To("align-right-bottom"),To("align-right-bottom-solid"),To("align-right-solid"),To("align-right-top"),To("align-right-top-solid"),To("align-top"),To("align-top-solid"),To("always-on-top"),To("always-on-top-on"),To("application"),To("arrow-down-long"),To("arrow-down-to-bracket"),To("arrow-left-long"),To("arrow-right-from-bracket"),To("arrow-right-long"),To("arrow-right"),To("arrow-up"),To("arrow-up-long"),To("ban"),To("bell"),To("bell-solid"),To("bookmark"),To("bullseye-pointer"),To("certificate"),To("check"),To("check-light"),To("check-solid"),To("chevron-down"),To("chevron-left"),To("chevron-right"),To("chevron-up"),To("circle-info"),To("circle-xmark"),To("circle-xmark-full"),To("clock"),To("clock-rotate-left"),To("clone"),To("close"),To("cog"),To("cog-solid"),To("collapse"),To("copy"),To("download"),To("delete-left"),To("dev-tools"),To("ellipsis"),To("ellipsis-vertical"),To("expand"),To("envelope"),To("envelope-open"),To("exclamation-mark"),To("expand"),To("feedback"),To("filter"),To("floppy"),To("floppy-disk-pen"),To("folder"),To("folder-open"),To("globe"),To("group"),To("hidden"),To("home"),To("house"),To("info"),To("keyboard"),To("layout"),To("link"),To("list-ul"),To("lock"),To("logo"),To("minimize"),To("minimize-down"),To("paper-plane-top"),To("paperclip"),To("pause"),To("pen-line"),To("pen-to-square"),To("pin"),To("play"),To("pop-in"),To("pop-in-widget"),To("pop-out"),To("power-off"),To("publish"),To("refresh"),To("resize"),To("restore"),To("rotate-right"),To("search"),To("search-filled"),To("sliders"),To("snooze"),To("spinner"),To("square"),To("square-arrow-down"),To("square-arrow-up"),To("star"),To("star-full"),To("sticky-off"),To("sticky-off-hover"),To("sticky-on"),To("sticky-on-hover"),To("subscribe"),To("system-close"),To("system-maximize"),To("system-minimize"),To("thumbs-down"),To("thumbs-up"),To("trash"),To("trash-can"),To("triangle-exclamation"),To("unlock"),To("unpin"),To("up-to-line"),To("user"),To("user-gear"),To("visible"),To("workspace")),Pr=Po({id:Mr,title:Mr,description:Oo(Io()),icon:Oo(Tr),iconSrc:Oo(Mr),contextMenuActions:Oo(_o(Mo())),type:Mr}),_r=Fo(To("Left"),To("Right")),Or=Fo(To("daily"),To("weekly")),Fr=Fo(To("Sunday"),To("Monday"),To("Tuesday"),To("Wednesday"),To("Thursday"),To("Friday"),To("Saturday")),Lr=Po({customPrefs:Oo(Mo()),_launchpad_collapsedSections:Oo(_o(Mr)),_launchpad_favorites:Oo(_o(Pr)),_launchpad_isLayoutsPanelOpen:Oo(Ao()),_launchpad_isCollapsed:Oo(Ao()),_launchpad_isPinned:Oo(Ao()),_launchpad_pinnedPosition:Oo(_r),_launchpad_allowDocking:Oo(Ao()),_launchpad_minimizeToTray:Oo(Ao()),_launchpad_autoCloseStartingAppsAndWorkspaces:Oo(Ao()),_launchpad_showTutorialOnStartup:Oo(Ao()),_layouts_restoreLastSaved:Oo(Ao()),_layouts_saveCurrentOnExit:Oo(Ao()),_layouts_showUnsavedChangesPrompt:Oo(Ao()),_layouts_showDeletePrompt:Oo(Ao()),_downloads_askForEachDownload:Oo(Ao()),_downloads_location:Oo(Io()),_system_scheduleRestart:Oo(Ao()),_system_scheduleRestartTime:Oo(Mr),_system_scheduleRestartFrequency:Oo(Or),_system_scheduleRestartDay:Oo(Fr),_system_scheduleShutdown:Oo(Ao()),_system_scheduleShutdownTime:Oo(Mr),_system_scheduleShutdownFrequency:Oo(Or),_system_scheduleShutdownDay:Oo(Fr),_widget_enableForExternalApps:Oo(Ao())}),Br=async e=>{const{io:t,variant:n,text:i,error:o}=e,r=mo(o);try{if(n===ho.WARNING&&t.logger.warn(r?`${i} ${r}`:i),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:i,variant:n,ttl:po[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},Rr=createContext(void 0);function zr({prefKey:e}){const t=useContext(IOConnectContext),n=useContext(Rr),i=n?.prefs?.[e],o=n?.isInitialSetupCompleted??false,[a,c]=useState(!o),[f,m]=useState(),h=useRef(0);useEffect((()=>{o&&0===h.current&&c(false);}),[o]);const p=useCallback((async n=>{if(!t)return;const i=++h.current;c(true),m(void 0);const o=async n=>{n&&await Br({io:t,variant:ho.WARNING,text:`Failed to update prefKey "${e}".`,error:n}),i===h.current&&(c(false),n&&m({message:mo(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(Xi))[e]);}catch(e){return o(e)}else r=n;try{const n=Lr.runWithException({[e]:r});await t.contexts.update(Xi,n);}catch(e){return o(e)}await o();}),[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:f,isLoading:a,update:p,value:i}}function $r(e,t,n){return Math.min(Math.max(e,n),t)}class Vr extends Error{constructor(e){super(`Failed to parse color: "${e}"`);}}var Yr=Vr;function Ur(e){if("string"!=typeof e)throw new Yr(e);if("transparent"===e.trim().toLowerCase())return [0,0,0,0];let t=e.trim();t=Zr.test(e)?function(e){const t=e.toLowerCase().trim(),n=Jr[function(e){let t=5381,n=e.length;for(;n;)t=33*t^e.charCodeAt(--n);return (t>>>0)%2341}(t)];if(!n)throw new Yr(e);return `#${n}`}(e):e;const n=Kr.exec(t);if(n){const e=Array.from(n).slice(1);return [...e.slice(0,3).map((e=>parseInt(qr(e,2),16))),parseInt(qr(e[3]||"f",2),16)/255]}const i=Gr.exec(t);if(i){const e=Array.from(i).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,16))),parseInt(e[3]||"ff",16)/255]}const o=Qr.exec(t);if(o){const e=Array.from(o).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,10))),parseFloat(e[3]||"1")]}const r=Xr.exec(t);if(r){const[t,n,i,o]=Array.from(r).slice(1).map(parseFloat);if($r(0,100,n)!==n)throw new Yr(e);if($r(0,100,i)!==i)throw new Yr(e);return [...ta(t,n,i),Number.isNaN(o)?1:o]}throw new Yr(e)}const Wr=e=>parseInt(e.replace(/_/g,""),36),Jr="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce(((e,t)=>{const n=Wr(t.substring(0,3)),i=Wr(t.substring(3)).toString(16);let o="";for(let e=0;e<6-i.length;e++)o+="0";return e[n]=`${o}${i}`,e}),{});const qr=(e,t)=>Array.from(Array(t)).map((()=>e)).join(""),Kr=new RegExp(`^#${qr("([a-f0-9])",3)}([a-f0-9])?$`,"i"),Gr=new RegExp(`^#${qr("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),Qr=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${qr(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),Xr=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,Zr=/^[a-z]+$/i,ea=e=>Math.round(255*e),ta=(e,t,n)=>{let i=n/100;if(0===t)return [i,i,i].map(ea);const o=(e%360+360)%360/60,r=(1-Math.abs(2*i-1))*(t/100),a=r*(1-Math.abs(o%2-1));let s=0,l=0,c=0;o>=0&&o<1?(s=r,l=a):o>=1&&o<2?(s=a,l=r):o>=2&&o<3?(l=r,c=a):o>=3&&o<4?(l=a,c=r):o>=4&&o<5?(s=a,c=r):o>=5&&o<6&&(s=r,c=a);const u=i-r/2;return [s+u,l+u,c+u].map(ea)};function na(e){return function(e){if("transparent"===e)return 0;function t(e){const t=e/255;return t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}const[n,i,o]=Ur(e);return .2126*t(n)+.7152*t(i)+.0722*t(o)}(e)>.179}function ia({className:t,channel:n,...i}){const o=k("io-channel-badge",t);return jsxRuntimeExports.jsx("div",{className:o,style:{color:(r=n.color,na(r)?"#000":"#fff"),backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-badge-label",children:n.label})});var r;}function oa(){return jsxRuntimeExports.jsx(C,{variant:"check"})}function ra({channel:i,handleChannelRestricted:o,restricted:r}){return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},disabled:r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},disabled:r?.read})})]})}const aa=createContext({});function sa({channel:t,isSelected:n,onChannelSelect:i,onChannelRestrict:o,...a}){const{variant:l,selectedChannels:c,restrictedChannels:u}=useContext(aa),d=n||t.isSelected||c?.includes(t),f=u?.find((e=>e.name===t.name)),m=useCallback((()=>i?.({...t,isSelected:!d})),[t,i,d]),h=useCallback((e=>{o&&o(e);}),[o]);return jsxRuntimeExports.jsx(O,{prepend:jsxRuntimeExports.jsx(ia,{channel:t}),append:"single"===l||"multi"===l?d&&jsxRuntimeExports.jsx(oa,{}):jsxRuntimeExports.jsx(ra,{channel:t,handleChannelRestricted:h,restricted:f}),isSelected:d,onClick:m,...a,children:t.name},t.name)}const la=forwardRef((({className:n,variant:i="single",variantToggle:o=false,channels:r=[],restrictedChannels:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:u,...d},f)=>{const m=k("io-list-channels","directionalSingle"===i&&"io-bi-direction",n),h=r.filter((e=>e.isSelected)),p=useMemo((()=>({variant:i,selectedChannels:h,restrictedChannels:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:u})),[i,h,a,s,l,u]);let g="Select Channel";return "multi"===i?g="Select Channels":"directionalSingle"===i&&(g="Select Directional Channel"),jsxRuntimeExports.jsx(aa.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(H,{variant:"single",...d,children:[jsxRuntimeExports.jsx(H.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Ri,{label:"Directional",align:"right",onChange:e=>s&&s(e.target.checked),checked:"directionalSingle"===i}),children:g}),r?.map((t=>jsxRuntimeExports.jsx(sa,{channel:t,onChannelSelect:l,onChannelRestrict:u},t.name)))]})})})}));la.displayName="ChannelSelector";createContext({config:{message:""},theme:"dark",setResult:()=>{}});function ka({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=Ua();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(Y,{children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{})]}),jsxRuntimeExports.jsx(i,{})]})}const Na=createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),xa=()=>useContext(Na);function Sa({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-header-search",n),s=useRef(null),{searchQuery:l,setSearch:c,itemsCount:u}=xa();return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:s,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${u} results`})]})}function Da({className:n,...i}){const{SettingsButton:o,MoreButton:r}=Ua();return jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}function Ea({icon:t="cog",...n}){const{showSettings:i}=xa();return jsxRuntimeExports.jsx(N,{icon:t,variant:"circle",size:"32",onClick:i,...n})}function Ia({icon:n="ellipsis",...i}){const{items:o,clearItems:r}=xa(),a=0===o.length;return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsx($.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:jsxRuntimeExports.jsx($.Item,{disabled:a,onClick:e=>(e=>{a?e.stopPropagation():r();})(e),children:"Clear All"})})})]})}function Aa(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${c}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${c}`}function Ma(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),l=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?Aa(n,"Today",false,true):s?Aa(n,"Yesterday",false,true):l?Aa(n,false,false,true):Aa(n):a?"Today":s?"Yesterday":l?Aa(n,false,true,true):Aa(n,false,true)}function Ta({className:t,...n}){const i=k("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=Ua(),{items:s,searchQuery:l,setCount:d,sortItems:f}=xa(),m=f(s),h=Vi(l),p=useMemo((()=>m.filter((e=>e.displayInfo.filename.toLowerCase().includes(h.toLowerCase())||e.displayInfo.url.toLowerCase().includes(h.toLowerCase())))),[m,h]),g=useMemo((()=>p.map((e=>({...e,displayInfo:{...e.displayInfo,startTime:Ma(e.displayInfo.startTime,{showTime:false})}})))),[p]),v=useMemo((()=>Object.values(g.reduce(((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e)),{}))),[g]);return useEffect((()=>{d(p.length);}),[p,d]),jsxRuntimeExports.jsx("div",{className:i,...n,children:v&&0!==v.length?v.map((t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map((t=>jsxRuntimeExports.jsx(a,{item:t},t.id)))},t[0].id??""))):jsxRuntimeExports.jsx(o,{})})}function Pa({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=k("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(C,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function _a({className:n,title:i,children:o,...r}){const a=k("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function Oa({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=Ua(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:h,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=k("io-dm-item",o.displayInfo.state&&[c],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:h,timeRemaining:p}),jsxRuntimeExports.jsx(l,{itemID:o.id,state:c})]})}function Fa({bytesReceived:t=0,bytesTotal:n=0,...i}){const o=useCallback((()=>t&&n?Math.round(t/n*100):0),[t,n]);return jsxRuntimeExports.jsx(Pi,{value:o(),...i})}function La({className:n,itemID:i,filename:o,state:a,cancel:s,remove:l,...c}){const u=k("io-dm-item-header",n),{cancelItem:d,removeItem:f}=xa(),m=useCallback((e=>{s?s(e):d(e);}),[s,d]),h=useCallback((e=>{l?l(e):f(e);}),[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(E,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",onClick:()=>{"progressing"===a||"paused"===a?m(i):h(i);}})]})}function Ba({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=k("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(m=i,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Fa,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(l)??0}`})]});var f,m;}const Ra={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function ja({className:n,variant:i,text:o}){const r=k("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(C,{variant:Ra[i],className:"icon-severity"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function Ha({className:i,itemID:o,state:a,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=k("io-dm-item-footer",i),{pauseResumeItem:f,showItemInFolder:m,cancelItem:h}=xa(),p=useCallback((e=>{s?s(e):f(e);}),[s,f]),g=useCallback((e=>{l?l(e):m(e);}),[l,m]),v=useCallback((e=>{c?c(e):h(e);}),[c,h]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs(V,{align:"right",children:[jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx(V.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(ja,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:jsxRuntimeExports.jsx(ja,{variant:"warning",text:"Cancelled"})});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(ja,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function za({className:n,title:i="Settings",...o}){const r=k("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=xa();return jsxRuntimeExports.jsxs(Mi,{className:r,...o,children:[jsxRuntimeExports.jsxs(Mi.Header,{children:[jsxRuntimeExports.jsx(Mi.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Mi.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Mi.Body,{children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map(((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx($.Item,{onClick:()=>{l(t);},children:t},t)))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const $a={Header:ka,ItemSearch:Sa,HeaderButtons:Da,SettingsButton:Ea,MoreButton:Ia,Body:Ta,DownloadListEmpty:Pa,ItemGroup:_a,Item:Oa,ItemProgress:Fa,ItemHeader:La,ItemBody:Ba,ItemFooter:Ha,Settings:za},Va=createContext($a),Ya=memo((({children:t,components:n})=>{const i=useMemo((()=>({...$a,...n})),[n]);return jsxRuntimeExports.jsx(Va.Provider,{value:i,children:t})}));Ya.displayName="ComponentsStore";const Ua=()=>useContext(Va);function qa(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout((function(){o.forEach((function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}}));}),0),function(){var i=n[e];i&&(i=i.reduce((function(e,n,i){return n===t&&e.length===i||e.push(n),e}),[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach((function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}})),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}qa.default=qa;y(qa);const Qa=createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),Xa=()=>useContext(Qa);function Za({...n}){const{config:i,close:o}=Xa(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(Y,{draggable:true,...n,children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(Y.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(Y.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function es({className:n,handleSubmit:i,...o}){const r=k("io-panel-body",n),{config:a,submitFeedback:s}=Xa(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:h,MailListField:p}=ys(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function ts({...n}){const{FooterButtons:i}=ys(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=Xa();return jsxRuntimeExports.jsx(J,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(I,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Di,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(I,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function ns({className:t,...n}){const{CloseButton:i}=ys(),{close:o}=Xa();return jsxRuntimeExports.jsx(V,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function is({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=ys(),{close:s,submitCompleted:l}=Xa();return l?jsxRuntimeExports.jsx(V,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(V,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function os({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function rs({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function as({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function ss({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...a,children:r}):null}function ls({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(I,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(Fi,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function cs({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Xa(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Fi,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function us({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Xa(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Fi,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function ds({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=k("io-block-list-gap",n),{config:f}=Xa(),m=l??f.attachments,h=c??f.selectedCategories,p=useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(I,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(I,{className:d,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Li,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id)))})}):null}function fs({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=Xa(),m=l??f,h=c??d.selectedCategories,p=useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Ri,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t)))})}):null}function ms({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=k("io-block-list-gap",n),{config:h,showMailingList:p,setShowMailingList:g}=Xa();if(!r)return null;const v=a??h.createJiraTicket,y=l??h.sendEmail;return jsxRuntimeExports.jsxs(I,{className:m,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(Ri,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Ri,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function hs({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=Xa(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Oi,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const ps={Header:Za,Body:es,Footer:ts,HeaderButtons:ns,FooterButtons:is,SubmitButton:os,CancelButton:rs,CloseButton:as,IntroField:ss,DescriptionField:ls,TechInfoField:cs,EnvInfoField:us,FileAttachmentsField:ds,CategoryAttachmentsField:fs,SettingsField:ms,MailListField:hs},gs=createContext(ps),vs=memo((({children:t,components:n})=>{const i=useMemo((()=>({...ps,...n})),[n]);return jsxRuntimeExports.jsx(gs.Provider,{value:i,children:t})}));function ys(e){return {...useContext(gs),...e}}vs.displayName="ComponentsStore";function ks({className:n,title:i="General",...o}){const r=k("io-notifications-settings-panel-general",n),{AllowNotifications:a,ShowNotificationBadge:s,CloseNotificationOnClick:l,PanelAutoHide:c,HideToastsAfter:u}=ul(),d=qi();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[d&&jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),d&&jsxRuntimeExports.jsx(l,{}),d&&jsxRuntimeExports.jsx(c,{}),d&&jsxRuntimeExports.jsx(u,{})]})})}function Ns(e){const t=useContext(IOConnectContext),n=t?.appManager,i=qi(),[o,a]=useState([]),[d,f]=useState(0),m="Platform",h=useCallback(((e="asc")=>{if(null===i)return [];const t=[...o].sort(((t,n)=>{const i=(t.title??t.name).toLowerCase(),o=(n.title??n.name).toLowerCase();return "asc"===e?i.localeCompare(o):o.localeCompare(i)}));if(!i){const e=t.findIndex((e=>e.name===m));if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t}),[o,i]),p=useMemo((()=>h("asc")),[h]),g=useMemo((()=>h("desc")),[h]);useEffect((()=>{if(null===i||i)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};a((t=>t.some((t=>t.name===e.name))?t:[...t,e]));}),[i]),useEffect((()=>{if(!n)return;const e=n.onAppAdded((e=>{a((t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]));})),t=n.onAppRemoved((e=>{a((t=>t.filter((t=>t.name!==e.name))));})),i=n.onAppChanged((e=>{a((t=>{const n=t.find((t=>t.name===e.name));return [...t.filter((t=>t.name!==e.name)),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]}));}));return ()=>{e(),t(),i();}}),[n]);return {apps:useMemo((()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const s=o.map((e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}}));return f(a),s}),[e,o]),allowedApps:d,sortedAppsAsc:p,sortedAppsDesc:g,sortAppsAlphabetically:h}}const Ds="newest",Es="oldest",Is="severity",As=["None","Low","Medium","High","Critical"],Ms={key:Ds,descending:true};const Fs=createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),Ls=()=>useContext(Fs);function Bs({label:t="Allow notifications",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=useCallback((e=>{a({enabledNotifications:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.enabledNotifications??false,...i}):null}function Rs({label:t="Show notification badge",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi()&&!o.enabledNotifications,l=useCallback((e=>{a({showNotificationBadge:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.showNotificationBadge??false,disabled:s,...i})}function js({label:t="Close notification on click",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=s&&!o.enabledNotifications,c=useCallback((e=>{a({closeNotificationOnClick:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.closeNotificationOnClick??false,disabled:l,...i}):null}function Hs({label:t="Auto hide panel",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=useCallback((e=>{a({autoHidePanel:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.autoHidePanel??false,...i}):null}function zs({label:t="Panel always on top",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=useCallback((e=>{a({alwaysOnTop:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:s,checked:o.alwaysOnTop??false,...i})}const $s=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",Vs=e=>{const t=Math.floor(e/60),n=e%60,i=$s(t,"minute"),o=$s(n,"second");return i+(i&&o?" ":"")+o};function Ys({className:n,title:i="Hide toasts after",items:o=[15,30,45,60],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Ls(),u=qi(),d=u&&!l.enabledNotifications,f=useCallback(((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});}),[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:Vs((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:Vs(t)},t)))})})]})]}):null}function Us({className:n,title:i="Highlight new for",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,l=["30 seconds","1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:l[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Ws({className:n,title:i="Mark as read after",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,l=["1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:l[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Js({className:n,title:i="Stacking",...o}){const r=k("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=ul();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function qs({label:t="Allow toast stacking",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=s&&!o.enabledNotifications,c=useCallback((e=>{a({toastStacking:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.toastStacking??false,disabled:l,...i}):null}const Ks=e=>e.replace(/(^|-)\w/g,(e=>e.toUpperCase().replace("-"," ")));function Gs({className:n,title:i="Group by",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=c&&!s.enabledNotifications,d=useCallback((e=>{e||(e="severity"),s.stackBy!==e&&l({stackBy:e.toLowerCase()});}),[s.stackBy,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{text:s.stackBy?Ks(s.stackBy):"Severity"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Severity","Application"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{d(t);},children:t},t)))})})]})]})}function Qs({className:n,title:i="Placement",...o}){const r=k("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=ul();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function Xs({className:n,title:i="Panel position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=useCallback((e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.panel?Ks(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Right","Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Zs({className:n,title:i="Toasts position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=useCallback((e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.toasts?Ks(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function el({className:t,title:n="Snooze",...i}){const o=k("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=ul(),{settings:a}=Ls();return qi()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(I,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function tl({className:n,title:i="Default duration",items:o=[60,120,180,300],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Ls(),u=qi(),d=u&&!l.enabledNotifications,f=useCallback(((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});}),[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:Vs((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:Vs(t)},t)))})})]})]}):null}function nl({className:n,title:i,...o}){const r=k("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=ul(),{sortAppsAlphabetically:u}=Ns(),d=qi(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map((n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name)))]})})}function il({label:t="All apps",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),l=qi()&&!o.enabledNotifications,c=useCallback((e=>{s({subscribe:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:c,checked:(a.sourceFilter?.allowed?.includes("*")&&0===a.sourceFilter?.blocked?.length)??false,disabled:l,...i})}function ol({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=Ls(),u=qi()&&!s.enabledNotifications,d=useCallback(((e,t)=>{const n={...l.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach((e=>{e.name!==t.name&&n.allowed?.push(e.name);}))),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter((e=>e!==t.name))):(n.allowed=n.allowed?.filter((e=>e!==t.name)),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);}),[a,l.sourceFilter,c]);return jsxRuntimeExports.jsx(Ri,{id:i.name,label:t,align:n,onChange:e=>d(e.target.checked,i),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(i.name)||l.sourceFilter?.allowed?.includes(i.name))??false,disabled:u,...o})}function rl({label:t="Mute all",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),l=qi(),c=l&&(!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*")),u=useCallback((e=>{s({mute:e.target.checked});}),[s]);return l?jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:u,checked:a.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...i}):null}function al({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=Ls(),u=qi(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(i.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(i.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=useCallback(((e,t)=>{const n={...l.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach((e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);}))),e?n.muted?.push(t.name):n.muted=n.muted?.filter((e=>e!==t.name)),c(n);}),[a,l.sourceFilter,c]);return !u||i.hidden?null:jsxRuntimeExports.jsx(Ri,{id:i.name,label:t,align:n,onChange:e=>f(e.target.checked,i),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(i.name))??false,disabled:d??false,...o})}const sl={Body:n=>{const{General:i,Placement:o,Stacking:r,Snooze:a,Subscriptions:s}=ul();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:ks,AllowNotifications:Bs,ShowNotificationBadge:Rs,CloseNotificationOnClick:js,PanelAutoHide:Hs,PanelAlwaysOnTop:zs,HideToastsAfter:Ys,MarkAsNew:Us,MarkAsRead:Ws,Stacking:Js,ToastStacking:qs,ToastStackBy:Gs,Placement:Qs,PlacementPanel:Xs,PlacementToasts:Zs,Snooze:el,SnoozeDuration:tl,Subscriptions:nl,SubscribeAll:il,SubscribeApp:ol,SubscribeMuteAll:rl,SubscribeMuteApp:al},ll=createContext(sl),cl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...sl,...n})),[n]);return jsxRuntimeExports.jsx(ll.Provider,{value:i,children:t})}));cl.displayName="NotificationsSettingsPanelComponentsStoreProvider";const ul=()=>useContext(ll);const hl=createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),pl=()=>useContext(hl);function gl({title:n,onClose:i,onOpenSettings:o,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=ec(),{isBulkActionsSupported:m,notificationsCount:h}=Ls(),{isBulkActionsVisible:p}=pl(),g=qi();return jsxRuntimeExports.jsxs(Ei,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Ei.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:o}),jsxRuntimeExports.jsx(c,{onClick:i})]})]}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${p&&h>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(f,{})]})}function vl({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=Ls();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const yl=e=>[...e].sort(((e,t)=>(t.timestamp||0)-(e.timestamp||0))),wl=e=>[...e].sort(((e,t)=>(e.timestamp||0)-(t.timestamp||0))),bl=(e,t)=>{const n=As[0];return [...e].sort(((e,i)=>{const o=As.indexOf(e.severity||n),r=As.indexOf(i.severity||n);return (t?-1:1)*(o-r)}))},kl={[Ds]:yl,[Es]:wl,[Is]:bl};function Cl({...t}){const[n,i]=useState([]),{NotificationsList:o,Notification:r}=ec(),{notifications:a,setCount:s,notificationsCount:f}=Ls(),{sortNotificationsBy:m,viewNotificationsBy:h,searchQuery:p}=pl(),g=useRef(null),v=Vi(p),y=useMemo((()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter((e=>"Active"===e.state||"Stale"===e.state));case "read":return e.filter((e=>"Acknowledged"===e.state||"Seen"===e.state));case "snoozed":return e.filter((e=>"Snoozed"===e.state))}})(a,h);return e.filter((e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase())))}),[v,a,h]);return useEffect((()=>{switch(m){case "newest":i(yl(y));break;case "oldest":i(wl(y));break;case "severity":i(bl(y,true));break;default:i(y);}s(y.length);}),[y,m,s]),useEffect((()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});}),[v,f,m,h]),jsxRuntimeExports.jsx(Ii,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function Nl({...t}){const{FooterButtons:n}=ec();return jsxRuntimeExports.jsx(Ai,{...t,children:jsxRuntimeExports.jsx(n,{})})}function xl({className:n,...i}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=ec(),{notifications:a}=Ls(),[s,c]=useState(false);return useEffect((()=>{a.filter((e=>"Stale"===e.state||"Acknowledged"===e.state)).length>0?c(true):c(false);}),[a]),jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function Sl({text:t="Clear All",...n}){const{clearAll:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Dl({text:t="Clear Old",...n}){const{clearAllOld:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function El({className:n,notification:i,...o}){const r=k("io-notification-header",n),{HeaderCount:a,HeaderBadge:s,HeaderTitle:l,HeaderTimestamp:c,HeaderButtonSnooze:u,HeaderButtonClose:d}=Yl();return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsx(d,{notification:i})]})]})}function Il({notification:t,...n}){const{settings:i,notificationStacks:o}=Ls(),{isPanelVisible:r}=pl(),{toastStacking:a,stackBy:s}=i,l="application"===s?"source":s??"source";let c;if(a){const e=o.find((e=>e.key===t[l]));c=e?.items.length??0;}return a&&!r&&c&&c>1?jsxRuntimeExports.jsx(D,{...n,children:c<10?c:"9+"}):null}function Al({className:n,notification:i,...o}){if(!i?.severity||"None"===i.severity)return null;const r=k("io-notification-header-badge",n);return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(C,{variant:((e="None")=>{switch(e.toLowerCase()){case "low":case "medium":case "none":default:return "circle-info";case "high":return "triangle-exclamation";case "critical":return "ban"}})(i.severity),size:"12"}),i.severity]})}function Ml({className:n,state:i,severity:o="None",icon:r,...a}){const s=k("io-notification-header-icon",n),{isPanelVisible:l}=pl();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:l&&"Acknowledged"!==i&&"New"})]})}function Tl({className:t,notification:{appTitle:n},...i}){const o=k("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pl({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=k("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:Ma(n??0)??"Just Now"})}function _l({notification:{id:t,state:n},...i}){const{settings:o,snooze:a}=Ls(),s=useCallback((e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);}),[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i}):null}function Ol({notification:{id:t,updateState:n},...i}){const o=qi(),{onClose:a}=Ls(),{isPanelVisible:s}=pl(),l=useCallback((e=>{e.stopPropagation(),!o||s?a(t):n("Acknowledged").catch(console.error);}),[o,t,a,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",size:"24",tabIndex:-1,onClick:l,...i})}function Fl({className:n,notification:i,...o}){const a=k("io-notification-body",n),s=qi(),{BodyIcon:l,BodyTitle:c,BodyDescription:u}=Yl(),{id:d,icon:f,title:m,body:h,onClick:p,updateState:g}=i,{settings:v,onClose:y}=Ls(),{isPanelVisible:w}=pl(),b=useCallback((async()=>{if(!p)return;if(!s)return void y(d);const e=!v?.toastStacking&&null,t=w?v?.closeNotificationOnClick??true:e;null!==t?await p({close:t}).catch(console.error):(await p({close:false}).catch(console.error),await g("Acknowledged").catch(console.error));}),[s,d,w,p,y,g,v?.closeNotificationOnClick,v?.toastStacking]);return jsxRuntimeExports.jsxs("div",{className:a,role:"button",tabIndex:0,onKeyDown:async e=>{(e=>"Enter"===e.key||" "===e.key)(e)&&await b();},onClick:b,...o,children:[jsxRuntimeExports.jsx(l,{icon:f}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(c,{text:m}),jsxRuntimeExports.jsx(u,{text:h})]})]})}function Ll({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=k("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function Bl({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function Rl({className:t,text:n,...i}){const o=k("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function jl({className:n,notification:i}){const o=k("io-notification-footer",n),{FooterButton:r}=Yl(),a=useMemo((()=>function(e){const t=[],n={};if(!e)return;e.forEach((e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach(((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find((e=>e.displayId===t)));})),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);}));const i=e=>{e.forEach((e=>{e.children&&0===e.children.length?delete e.children:e.children&&i(e.children);}));};return i(t),t}(i.actions)),[i.actions]),s=(t,n)=>t.children?jsxRuntimeExports.jsx(xi,{text:t.title,children:t.children.map(s)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(xi.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t,notificationId:i.id})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,children:jsxRuntimeExports.jsx(V,{align:"right",children:a?.map(((n,o)=>n.children?jsxRuntimeExports.jsxs(V,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default",notificationId:i.id}),jsxRuntimeExports.jsx(xi,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(s)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link",notificationId:i.id},`${n.title}-${o}`)))})})}function Hl({notificationAction:t,...n}){const i=useCallback((e=>{e.stopPropagation(),t.onClick({close:true});}),[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:i,...n})}const zl={Header:El,HeaderCount:Il,HeaderBadge:Al,HeaderIcon:Ml,HeaderTitle:Tl,HeaderTimestamp:Pl,HeaderButtonSnooze:_l,HeaderButtonClose:Ol,Body:Fl,BodyIcon:Ll,BodyTitle:Bl,BodyDescription:Rl,Footer:jl,FooterButton:Hl},$l=createContext(zl),Vl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...zl,...n})),[n]);return jsxRuntimeExports.jsx($l.Provider,{value:i,children:t})}));function Yl(e){return {...useContext($l),...e}}function Ul({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=Yl(),{severity:l}=i,c=k("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function Wl({components:t,notification:n,...i}){return jsxRuntimeExports.jsx(Vl,{components:t,children:jsxRuntimeExports.jsx(Ul,{notification:n,...i})})}function Jl({className:n,notifications:i,...o}){const[a,s]=useState(false),c=i.length>=3?"large":"normal",u=2===i.length?"small":c,d=i[0].severity,f=k("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=useCallback((()=>{s(true);}),[]),h=useCallback((e=>{e.stopPropagation(),i.forEach((e=>{e.close();}));}),[i]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>h(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear All"})})}),i.map((t=>jsxRuntimeExports.jsx(Wl,{notification:t},t.id)))]})}function ql({...t}){const{notificationStacks:i}=Ls();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:i.map((n=>jsxRuntimeExports.jsx(Jl,{notifications:n.items,...t},n.key)))})}Vl.displayName="ComponentsStoreProvider";const Kl=({notification:n,Notification:i,...o})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=Ls(),{isPanelVisible:c,isBulkActionsVisible:u}=pl(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,h=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:k("io-notification-list-bulk-action-item",{selected:h}),children:[jsxRuntimeExports.jsx(Li,{checked:h,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n,...o})]}):jsxRuntimeExports.jsx(i,{notification:n,...o})};function Gl({className:n,Notification:i,notifications:o=[],noNotificationText:r="No notifications to display",...a}){const s=k("io-notification-list",n),{settings:l}=Ls(),{isPanelVisible:c}=pl(),{toastStacking:u}=l,d=u&&!c,f=o.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(ql,{}),!d&&(f?o.map((t=>jsxRuntimeExports.jsx(Kl,{notification:t,Notification:i,...a},t.id))):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r}))]})}const Ql={Header:gl,HeaderCaptionTitle:vl,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:i=0}=Ls();return 0===i?null:jsxRuntimeExports.jsx(D,{variant:t,...n,children:i>99?"99+":i})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){return qi()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,...o}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const{hidePanel:a}=Ls(),s=qi();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):s&&a();},...r})},HeaderActions:function({className:n,...i}){const o=k("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=ec();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i}){const{sortNotificationsBy:o,setSortBy:a}=pl(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Ls(),[t,n]=useState(Ms),{key:i,descending:o}=t,a=useMemo((()=>kl[i](e,o)),[e,i,o]),s=useCallback((e=>{n((t=>({key:e,descending:t.key!==e?Ms.descending:!t.descending})));}),[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:o})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Severity"].map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:o===t.toLowerCase(),onClick:()=>{a(t.toLowerCase()),s(t.toLowerCase());},children:t},t)))})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=Ls(),{viewNotificationsBy:r,setViewBy:a}=pl(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:s.map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t)))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i,notificationsCount:o}=Ls();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i,notificationsCount:o}=Ls(),{showBulkActions:r}=pl();return i?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===o,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=k("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=ec(),{isBulkActionsSupported:f}=Ls();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o,notificationsCount:r}=Ls();return n?jsxRuntimeExports.jsx(Li,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o,notificationsCount:r}=Ls();return i?jsxRuntimeExports.jsxs($,{variant:"light",...n,children:[jsxRuntimeExports.jsx($.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(P,{children:jsxRuntimeExports.jsxs($.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx($.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t)))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Ls(),d=useCallback((()=>{c(l,"Seen");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Ls(),d=useCallback((()=>{c(l,"Active");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=Ls(),f=useCallback((()=>{c(l,u.snooze?.duration??0);}),[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=Ls(),d=useCallback((()=>{c(l);}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o,notificationsCount:r}=Ls(),{hideBulkActions:a}=pl();return o?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...i}):null},HeaderSearch:function({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-panel-header-search",n),{notificationsCount:s}=Ls(),{searchQuery:l,setSearch:c}=pl(),u=useRef(null);return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:u,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${s} results`})]})},Body:Cl,Footer:Nl,FooterButtons:xl,FooterButtonClearAll:Sl,FooterButtonClearAllOld:Dl,Notification:Wl,NotificationsList:Gl},Xl=createContext(Ql),Zl=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Ql,...n})),[n]);return jsxRuntimeExports.jsx(Xl.Provider,{value:i,children:t})}));function ec(e){return {...useContext(Xl),...e}}Zl.displayName="ComponentsStoreProvider";const ic={Body:function({className:t,notifications:n,maxToasts:i=1,...o}){const r=k("io-toasts-body",t),{NotificationsList:a,Notification:s}=ac(),[c,d]=useState([]);return useEffect((()=>{const e=i<0?n.length:i,t=n.filter((e=>"Active"===e.state)).slice(0,e);for(const e of t)e.onShow();d(t);}),[n,i]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:c,noNotificationText:""})})},Notification:Wl,NotificationsList:Gl},oc=createContext(ic),rc=memo((({children:t,components:n})=>{const i=useMemo((()=>({...ic,...n})),[n]);return jsxRuntimeExports.jsx(oc.Provider,{value:i,children:t})}));function ac(e){return {...useContext(oc),...e}}rc.displayName="ComponentsStoreProvider";const uc=n=>{const{General:i,Layouts:o,Downloads:r,System:a}=Nu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},dc=({className:n,title:i="General",...o})=>{const{Theme:r,PinnedPosition:a,MinimizeToTray:s,ShowTutorialOnStartup:l}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})},fc=(e="dark")=>{switch(e){case "dark":return "Dark";case "light":return "Light";default:return e}},mc=({className:n,title:i="Theme",...o})=>{const{currentTheme:a,selectTheme:c}=(()=>{const e=useContext(IOConnectContext),[t,n]=useState(null),i=useCallback((t=>e?.themes?.select(t)),[e]);return useEffect((()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}}),[e]),{currentTheme:t,selectTheme:i}})(),d=(()=>{const e=useContext(IOConnectContext),[t,n]=useState([]);return useEffect((()=>{e&&e.themes?.list().then(n).catch(console.warn);}),[e]),t})();return jsxRuntimeExports.jsxs("div",{className:k("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:fc(a?.name)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map((({name:t})=>jsxRuntimeExports.jsx($.Item,{onClick:()=>c(t),children:fc(t)},t)))})})]})]})},hc=({prefKey:n,options:i,disabled:o,...r})=>{const{isLoading:a,value:s="Select option",update:l}=zr({prefKey:n});return jsxRuntimeExports.jsxs($,{variant:"light",disabled:a||o,...r,children:[jsxRuntimeExports.jsx($.Button,{children:s}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:i.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t)))})})]})},pc=({className:n,label:i="Pinned position",...o})=>jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",n),...o,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(hc,{className:n,prefKey:eo,options:["Left","Right"],...o})]})}),gc=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=zr({prefKey:t});return jsxRuntimeExports.jsx(Ri,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},vc=({align:t="right",label:n="Allow docking",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:to,...i}),yc=({align:t="right",label:n="Minimize to tray",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:no,...i}),wc=({align:t="right",label:n="Auto-close on starting apps and workspaces",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:io,disabled:true,...i}),bc=({align:t="right",label:n="Show tutorial on startup",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:oo,...i}),kc=({className:n,title:i="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:r,LayoutsShowDeletePrompt:a,LayoutsShowUnsavedChangesPrompt:s}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(a,{})]})},Cc=({align:t="right",label:n="Restore last saved on startup",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:ro,...i}),Nc=({align:t="right",label:n="Save current on exit",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:ao,...i}),xc=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:so,...i}),Sc=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:lo,...i}),Dc=({className:t,title:n="Downloads",...i})=>{const{DownloadsLocation:o}=Nu();return jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Ec=({align:t="right",label:n="Ask where to save each file before downloading",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:co,...i}),Ic=({className:n,label:i="Location",...o})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=xa();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),...o,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Ac=({className:n,title:i="System",...o})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Mc=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Tc={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Pc={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},_c=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},Oc=function(e){return  true===e?1:0};function Fc(e,t){var n;return function(){var i=this,o=arguments;clearTimeout(n),n=setTimeout((function(){return e.apply(i,o)}),t);}}var Lc=function(e){return e instanceof Array?e:[e]};function Bc(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function Rc(e,t,n){var i=window.document.createElement(e);return t=t||"",n=n||"",i.className=t,void 0!==n&&(i.textContent=n),i}function jc(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function Hc(e,t){return t(e)?e:e.parentNode?Hc(e.parentNode,t):void 0}function zc(e,t){var n=Rc("div","numInputWrapper"),i=Rc("input","numInput "+e),o=Rc("span","arrowUp"),r=Rc("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==t)for(var a in t)i.setAttribute(a,t[a]);return n.appendChild(i),n.appendChild(o),n.appendChild(r),n}function $c(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var Vc=function(){},Yc=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},Uc={D:Vc,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*Oc(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var i=parseInt(t),o=new Date(e.getFullYear(),0,2+7*(i-1),0,0,0,0);return o.setDate(o.getDate()-o.getDay()+n.firstDayOfWeek),o},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:Vc,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:Vc,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},Wc={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},Jc={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[Jc.w(e,t,n)]},F:function(e,t,n){return Yc(Jc.n(e,t,n)-1,false,t)},G:function(e,t,n){return _c(Jc.h(e,t,n))},H:function(e){return _c(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[Oc(e.getHours()>11)]},M:function(e,t){return Yc(e.getMonth(),true,t)},S:function(e){return _c(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return _c(e.getFullYear(),4)},d:function(e){return _c(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return _c(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return _c(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},qc=function(e){var t=e.config,n=void 0===t?Tc:t,i=e.l10n,o=void 0===i?Pc:i,r=e.isMobile,a=void 0!==r&&r;return function(e,t,i){var r=i||o;return void 0===n.formatDate||a?t.split("").map((function(t,i,o){return Jc[t]&&"\\"!==o[i-1]?Jc[t](e,r,n):"\\"!==t?t:""})).join(""):n.formatDate(e,t,r)}},Kc=function(e){var t=e.config,n=void 0===t?Tc:t,i=e.l10n,o=void 0===i?Pc:i;return function(e,t,i,r){if(0===e||e){var a,s=r||o,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||Tc).dateFormat,u=String(e).trim();if("today"===u)a=new Date,i=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,h=0,p="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(Wc[g]&&!y){p+=Wc[g];var w=new RegExp(p).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:Uc[g],val:w[++h]});}else v||(p+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach((function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a})),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===i&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function Gc(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var Qc=function(e,t,n){return e>Math.min(t,n)&&e<Math.max(t,n)},Xc=function(e,t,n){return 3600*e+60*t+n},Zc=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]},eu={DAY:864e5};function tu(e){var t=e.defaultHour,n=e.defaultMinute,i=e.defaultSeconds;if(void 0!==e.minDate){var o=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<o&&(t=o),t===o&&n<r&&(n=r),t===o&&n===r&&i<a&&(i=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(i=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var i=function(t){t&&Object.keys(t).forEach((function(n){return e[n]=t[n]}));},o=0,r=t;o<r.length;o++){i(r[o]);}return e});var nu=function(){return nu=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},nu.apply(this,arguments)},iu=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i},ou=300;function ru(e,t){var n={config:nu(nu({},Tc),su.defaultConfig),l10n:Pc};function i(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function o(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}}));}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||Gc(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),i=tu(n.config);t.setHours(i.hours,i.minutes,i.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,i=$c(e),o=i;void 0!==n.amPM&&i===n.amPM&&(n.amPM.textContent=n.l10n.amPM[Oc(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(o.getAttribute("min")),a=parseFloat(o.getAttribute("max")),s=parseFloat(o.getAttribute("step")),l=parseInt(o.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==o.value&&2===o.value.length){var d=o===n.hourElement,f=o===n.minuteElement;u<r?(u=a+u+Oc(!d)+(Oc(d)&&Oc(!n.amPM)),f&&p(void 0,-1,n.hourElement)):u>a&&(u=o===n.hourElement?u-a-Oc(!n.amPM):r,f&&p(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[Oc(n.amPM.textContent===n.l10n.amPM[0])]),o.value=_c(u);}}(e);var o=n._input.value;s(),Z(),n._input.value!==o&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,i=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,o=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=i,t=n.amPM.textContent,i=e%12+12*Oc(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===Gc(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===Gc(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=Xc(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=Xc(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=Xc(i,o,r);if(d>u&&d<l){var f=Zc(l);i=f[0],o=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(i=Math.min(i,m.getHours()))===m.getHours()&&(o=Math.min(o,m.getMinutes())),o===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var h=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(i=Math.max(i,h.getHours()))===h.getHours()&&o<h.getMinutes()&&(o=h.getMinutes()),o===h.getMinutes()&&(r=Math.max(r,h.getSeconds()));}}c(i,o,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,i){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,i||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=_c(n.config.time_24hr?e:(12+e)%12+12*Oc(e%12==0)),n.minuteElement.value=_c(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[Oc(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=_c(i)));}function u(e){var t=$c(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&M(n);}function d(e,t,i,o){return t instanceof Array?t.forEach((function(t){return d(e,t,i,o)})):e instanceof Array?e.forEach((function(e){return d(e,t,i,o)})):(e.addEventListener(t,i,o),void n._handlers.push({remove:function(){return e.removeEventListener(t,i,o)}}))}function f(){q("onChange");}function m(e,t){var i=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),o=n.currentYear,r=n.currentMonth;try{void 0!==i&&(n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth());}catch(e){e.message="Invalid date supplied: "+i,n.config.errorHandler(e);}t&&n.currentYear!==o&&(q("onYearChange"),C()),!t||n.currentYear===o&&n.currentMonth===r||q("onMonthChange"),n.redraw();}function h(e){var t=$c(e);~t.className.indexOf("arrow")&&p(e,t.classList.contains("arrowUp")?1:-1);}function p(e,t,n){var i=e&&$c(e),o=n||i&&i.parentNode&&i.parentNode.firstChild,r=K("increment");r.delta=t,o&&o.dispatchEvent(r);}function g(e,t,i,o){var r=T(t,true),a=Rc("span",e,t.getDate().toString());return a.dateObj=t,a.$i=o,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===Gc(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Bc(a,"startRange",n.selectedDates[0]&&0===Gc(t,n.selectedDates[0],true)),Bc(a,"endRange",n.selectedDates[1]&&0===Gc(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(Gc(e,n.selectedDates[0])>=0&&Gc(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&o%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),q("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,i=e>0?n.config.showMonths:-1,o=t;o!=i;o+=e)for(var r=n.daysContainer.children[o],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function w(e,t){var o=i(),r=P(o||document.body),a=void 0!==e?e:r?o:void 0!==n.selectedDateElem&&P(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&P(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var i=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,o=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=i-n.currentMonth;a!=o;a+=r)for(var s=n.daysContainer.children[a],l=i-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var i=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,o=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=o+1-i,d=0;u<=o;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-i&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=Rc("div","dayContainer");return m.appendChild(a),m}function k(){if(void 0!==n.daysContainer){jc(n.daysContainer),n.weekNumbers&&jc(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),e.appendChild(b(i.getFullYear(),i.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function C(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var i=Rc("option","flatpickr-monthDropdown-month");i.value=new Date(n.currentYear,t).getMonth().toString(),i.textContent=Yc(t,n.config.shorthandCurrentMonth,n.l10n),i.tabIndex=-1,n.currentMonth===t&&(i.selected=true),n.monthsDropdownContainer.appendChild(i);}}}function N(){var e,t=Rc("div","flatpickr-month"),i=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=Rc("span","cur-month"):(n.monthsDropdownContainer=Rc("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",(function(e){var t=$c(e),i=parseInt(t.value,10);n.changeMonth(i-n.currentMonth),q("onMonthChange");})),C(),e=n.monthsDropdownContainer);var o=zc("cur-year",{tabindex:"-1"}),r=o.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=Rc("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(o),i.appendChild(a),t.appendChild(i),{container:t,yearElement:r,monthElement:e}}function x(){jc(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=N();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function S(){n.weekdayContainer?jc(n.weekdayContainer):n.weekdayContainer=Rc("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=Rc("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=iu(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=iu(t.splice(e,t.length),t.splice(0,e)));for(var i=n.config.showMonths;i--;)n.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var i=t?e:e-n.currentMonth;i<0&&true===n._hidePrevMonthArrow||i>0&&true===n._hideNextMonthArrow||(n.currentMonth+=i,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,q("onYearChange"),C()),k(),q("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function A(e){if(n.isOpen&&!n.config.inline){var t=$c(e),i=I(t),o=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!i&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some((function(e){return e.contains(t)}));o&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function M(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,i=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),i&&(n.redraw(),q("onYearChange"),C());}}function T(e,t){var i;void 0===t&&(t=true);var o=n.parseDate(e,void 0,t);if(n.config.minDate&&o&&Gc(o,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&o&&Gc(o,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===o)return  false;for(var r=!!n.config.enable,a=null!==(i=n.config.enable)&&void 0!==i?i:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(o))return r;if(l instanceof Date&&void 0!==o&&l.getTime()===o.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===o.getTime()?r:!r}if("object"==typeof l&&void 0!==o&&l.from&&l.to&&o.getTime()>=l.from.getTime()&&o.getTime()<=l.to.getTime())return r}return !r}function P(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function _(e){var t=e.target===n._input,i=n._input.value.trimEnd()!==X();!t||!i||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function O(t){var o=$c(t),r=n.config.wrap?e.contains(o):o===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,o===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),o.blur();n.open();}else if(I(o)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(o);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),$()):V(t);break;case 27:t.preventDefault(),$();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=i();if(void 0!==n.daysContainer&&(false===l||f&&P(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var h=40===t.keyCode?1:-1;n.daysContainer&&void 0!==o.$i||o===n.input||o===n.altInput?t.ctrlKey?(t.stopPropagation(),M(n.currentYear-h),w(y(1),0)):d||w(void 0,7*h):o===n.currentYearElement?M(n.currentYear-h):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var p=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter((function(e){return e})),g=p.indexOf(o);if(-1!==g){var v=p[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(o)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&o===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(o))&&q("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var i=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),o=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(i,n.selectedDates[0].getTime()),a=Math.max(i,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=eu.DAY)T(new Date(u),true)||(s=s||u>r&&u<a,u<o&&(!l||u>l)?l=u:u>o&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach((function(t){var r=t.dateObj.getTime(),a=l>0&&r<l||c>0&&r>c;if(a)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(e){t.classList.remove(e);}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(e){t.classList.remove(e);})),void 0!==e&&(e.classList.add(i<=n.selectedDates[0].getTime()?"startRange":"endRange"),o<i&&r===o?t.classList.add("startRange"):o>i&&r===o&&t.classList.add("endRange"),r>=l&&(0===c||r<=c)&&Qc(r,o,i)&&t.classList.add("inRange")));}));}}function L(){!n.isOpen||n.config.static||n.config.inline||H();}function B(e){return function(t){var i=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),o=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==i&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter((function(e){return T(e)})),n.selectedDates.length||"min"!==e||l(i),Z()),n.daysContainer&&(z(),void 0!==i?n.currentYearElement[e]=i.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!o&&void 0!==i&&o.getFullYear()===i.getFullYear());}}function R(){return n.config.wrap?e.querySelector("[data-input]"):e}function j(){"object"!=typeof n.config.locale&&void 0===su.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=nu(nu({},su.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?su.l10ns[n.config.locale]:void 0),Wc.D="("+n.l10n.weekdays.shorthand.join("|")+")",Wc.l="("+n.l10n.weekdays.longhand.join("|")+")",Wc.M="("+n.l10n.months.shorthand.join("|")+")",Wc.F="("+n.l10n.months.longhand.join("|")+")",Wc.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===nu(nu({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===su.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=qc(n),n.parseDate=Kc({config:n.config,l10n:n.l10n});}function H(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){q("onPreCalendarPosition");var t=e||n._positionElement,i=Array.prototype.reduce.call(n.calendarContainer.children,(function(e,t){return e+t.offsetHeight}),0),o=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<i&&l.top>i,d=window.pageYOffset+l.top+(u?-i-2:t.offsetHeight+2);if(Bc(n.calendarContainer,"arrowTop",!u),Bc(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,h=false;"center"===s?(f-=(o-l.width)/2,m=true):"right"===s&&(f-=o-l.width,h=true),Bc(n.calendarContainer,"arrowLeft",!m&&!h),Bc(n.calendarContainer,"arrowCenter",m),Bc(n.calendarContainer,"arrowRight",h);var p=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+o>window.document.body.offsetWidth,v=p+o>window.document.body.offsetWidth;if(Bc(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-o/2),k=y.cssRules.length,C="{left:"+l.left+"px;right:auto;}";Bc(n.calendarContainer,"rightMost",false),Bc(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+C,k),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=p+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function z(){n.config.noCalendar||n.isMobile||(C(),Q(),k());}function $(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=Hc($c(e),(function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")}));if(void 0!==t){var i=t,o=n.latestSelectedDateObj=new Date(i.dateObj.getTime()),r=(o.getMonth()<n.currentMonth||o.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=i,"single"===n.config.mode)n.selectedDates=[o];else if("multiple"===n.config.mode){var a=G(o);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(o);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=o,n.selectedDates.push(o),0!==Gc(o,n.selectedDates[0],true)&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()})));if(s(),r){var l=n.currentYear!==o.getFullYear();n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth(),l&&(q("onYearChange"),C()),q("onMonthChange");}if(Q(),k(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(i),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&$();}f();}}n.parseDate=Kc({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=H,n.changeMonth=E,n.changeYear=M,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var i=tu(n.config);c(i.hours,i.minutes,i.seconds);}n.redraw(),e&&q("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));q("onClose");},n.onMouseOver=F,n._createElement=Rc,n.createDay=g,n.destroy=function(){ void 0!==n.config&&q("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(e){try{delete n[e];}catch(e){}}));},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var i=$c(e);i&&i.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void q("onOpen")}if(n._input.disabled||n.config.inline)return;var o=n.isOpen;n.isOpen=true,o||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),q("onOpen"),H(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout((function(){return n.hourElement.select()}),50));},n.redraw=z,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var i in Object.assign(n.config,e),e) void 0!==Y[i]&&Y[i].forEach((function(e){return e()}));else n.config[e]=t,void 0!==Y[e]?Y[e].forEach((function(e){return e()})):Mc.indexOf(e)>-1&&(n.config[e]=Lc(t));n.redraw(),Z(true);},n.setDate=function(e,t,i){ void 0===t&&(t=false);void 0===i&&(i=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);U(e,i),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&q("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var Y={locale:[j,D],showMonths:[x,r,S],minDate:[m],maxDate:[m],positionElement:[J],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function U(e,t){var i=[];if(e instanceof Array)i=e.map((function(e){return n.parseDate(e,t)}));else if(e instanceof Date||"number"==typeof e)i=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":i=[n.parseDate(e,t)];break;case "multiple":i=e.split(n.config.conjunction).map((function(e){return n.parseDate(e,t)}));break;case "range":i=e.split(n.l10n.rangeSeparator).map((function(e){return n.parseDate(e,t)}));}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?i:i.filter((function(e){return e instanceof Date&&T(e,false)})),"range"===n.config.mode&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()}));}function W(e){return e.slice().map((function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e})).filter((function(e){return e}))}function J(){n._positionElement=n.config.positionElement||n._input;}function q(e,t){if(void 0!==n.config){var i=n.config[e];if(void 0!==i&&i.length>0)for(var o=0;i[o]&&o<i.length;o++)i[o](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(K("change")),n.input.dispatchEvent(K("input")));}}function K(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var i=n.selectedDates[t];if(i instanceof Date&&0===Gc(i,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach((function(e,t){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=Yc(i.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=i.getMonth().toString(),e.value=i.getFullYear().toString();})),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map((function(e){return n.formatDate(e,t)})).filter((function(e,t,i){return "range"!==n.config.mode||n.config.enableTime||i.indexOf(e)===t})).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&q("onValueUpdate");}function ee(e){var t=$c(e),i=n.prevMonthNav.contains(t),o=n.nextMonthNav.contains(t);i||o?E(i?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=nu(nu({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=W(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=W(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=su.defaultConfig.dateFormat||Tc.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=su.defaultConfig.altFormat||Tc.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:B("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:B("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<i.length;d++)n.config[i[d]]=true===n.config[i[d]]||"true"===n.config[i[d]];Mc.filter((function(e){return void 0!==n.config[e]})).forEach((function(e){n.config[e]=Lc(n.config[e]||[]).map(o);})),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Mc.indexOf(m)>-1?n.config[m]=Lc(f[m]).map(o).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=R().className+" "+n.config.altInputClass);q("onParseConfig");}(),j(),function(){if(n.input=R(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=Rc(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");J();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&U(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=Rc("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=Rc("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=Rc("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=Rc("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,x(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Bc(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Bc(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=Rc("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=Rc("div","flatpickr-weekwrapper");e.appendChild(Rc("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=Rc("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),i=t.weekWrapper,o=t.weekNumbers;n.innerContainer.appendChild(i),n.weekNumbers=o,n.weekWrapper=i;}n.rContainer=Rc("div","flatpickr-rContainer"),n.rContainer.appendChild(S()),n.daysContainer||(n.daysContainer=Rc("div","flatpickr-days"),n.daysContainer.tabIndex=-1),k(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=tu(n.config);n.timeContainer=Rc("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=Rc("span","flatpickr-time-separator",":"),i=zc("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=i.getElementsByTagName("input")[0];var o=zc("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=o.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(i),n.timeContainer.appendChild(t),n.timeContainer.appendChild(o),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=zc("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(Rc("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=Rc("span","flatpickr-am-pm",n.l10n.amPM[Oc((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Bc(n.calendarContainer,"rangeMode","range"===n.config.mode),Bc(n.calendarContainer,"animate",true===n.config.animate),Bc(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=Rc("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach((function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),(function(t){return d(t,"click",n[e])}));}));if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=Rc("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",(function(e){n.setDate($c(e).value,false,n.mobileFormatStr),q("onChange"),q("onClose");}));}();var e=Fc(L,50);n._debouncedChange=Fc(f,ou),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",(function(e){"range"===n.config.mode&&F($c(e));}));d(n._input,"keydown",O),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",O);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",A):d(window.document,"mousedown",A);d(window.document,"focus",A,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return $c(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",h),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",(function(){return n.secondElement&&n.secondElement.select()})),void 0!==n.amPM&&d(n.amPM,"click",(function(e){a(e);}));}n.config.allowInput&&d(n._input,"blur",_);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&i&&H(),q("onReady");}(),n}function au(e,t){for(var n=Array.prototype.slice.call(e).filter((function(e){return e instanceof HTMLElement})),i=[],o=0;o<n.length;o++){var r=n[o];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=ru(r,t||{}),i.push(r._flatpickr);}catch(e){console.error(e);}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return au(this,e)},HTMLElement.prototype.flatpickr=function(e){return au([this],e)});var su=function(e,t){return "string"==typeof e?au(window.document.querySelectorAll(e),t):e instanceof Node?au([e],t):au(e,t)};su.defaultConfig={},su.l10ns={en:nu({},Pc),default:nu({},Pc)},su.localize=function(e){su.l10ns.default=nu(nu({},su.l10ns.default),e);},su.setDefaults=function(e){su.defaultConfig=nu(nu({},su.defaultConfig),e);},su.parseDate=Kc({}),su.formatDate=qc({}),su.compareDates=Gc,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return au(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=su);const lu=["onCreate","onDestroy"],cu=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],uu=t=>{const n=useMemo((()=>({...t})),[t]),{defaultValue:i,options:o={},value:a,children:s,render:l}=n,f=useMemo((()=>((e,t)=>(cu.forEach((n=>{const i=t[n],o=e[n];if(i){o&&!Array.isArray(o)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(i)?i:[i];0===e[n].length?e[n]=t:e[n].push(...t);}})),cu.forEach((e=>{delete t[e];})),lu.forEach((e=>{delete t[e];})),e))(o,n)),[o,n]),m=useRef(null),p=useRef(void 0);useImperativeHandle(t.ref,(()=>({get flatpickr(){return p.current}})),[]),useEffect((()=>{var e;if(f.onClose=f.onClose||(()=>{var e;null!=(e=m.current)&&e.blur&&m.current.blur();}),p.current=((null==(n=su)?void 0:n.default)||su)(m.current,f),p.current&&void 0!==a&&p.current.setDate(a,false),t.onCreate&&t.onCreate(p.current),p.current){const t=Object.getOwnPropertyNames(f);for(let n=t.length-1;n>=0;n--){const i=t[n];let o=f[i];(null==o?void 0:o.toString())!==(null==(e=p.current.config[i])?void 0:e.toString())&&(cu.includes(i)&&!Array.isArray(o)&&(o=[o]),p.current.set(i,o));} void 0!==a&&a!==p.current.input.value&&p.current.setDate(a,false);}var n;return ()=>{t.onDestroy&&t.onDestroy(p.current),p.current&&p.current.destroy(),p.current=void 0;}}),[f,o,n,a,t]);const g=useCallback((e=>{m.current=e;}),[]);if(l)return l({...n,defaultValue:i,value:a},g);const v=useCallback((e=>{var n,i;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach((()=>[new Date(e.target.value)]),(null==a?void 0:a.toString())||""):"function"==typeof t.onChange&&(null==(i=null==t?void 0:t.onChange)||i.call(t,[new Date(e.target.value)],(null==a?void 0:a.toString())||"",p.current)));}),[t,a]);return o.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:g,children:s}):jsxRuntimeExports.jsx("input",{onChange:v,...n,value:null==a?void 0:a.toString(),defaultValue:i,ref:g})},du="T42.GD.Execute",fu=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],mu=(e,t)=>e in t;function hu({time:e,frequency:t,day:n}){const i=new Date(`01/01/2000 ${e}`),o=i.getMinutes(),r=i.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!mu(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${o} ${r} * * ${a}`}function pu(e){const t=useContext(IOConnectContext),{value:n,update:i}=zr({prefKey:gu(e)}),{value:o,update:a}=zr({prefKey:gu(e,"Time")}),{value:l,update:c}=zr({prefKey:gu(e,"Frequency")}),{value:d,update:f}=zr({prefKey:gu(e,"Day")}),m=useCallback((async()=>{try{await t.interop.invoke(du,{command:`cancel-${e}`});}catch(e){console.error(e);}}),[t,e]),h=useCallback((async()=>{try{const n=hu({time:o??"12:00 AM",frequency:l??"daily",day:"weekly"===l?d:"*"});await t.interop.invoke(du,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}}),[t,e,o,l,d]);useEffect((()=>{t&&n&&h();}),[t,n,h]);return {enabled:n??false,time:o??"12:00 AM",frequency:l??"daily",day:d??"Monday",setEnabled:async e=>{e||await m();try{await i(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await a(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await f(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,fu.includes(t))try{await f(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function gu(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function vu({className:n,variant:i,...o}){const r=k("io-block-list-gap",i,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=pu(i);return jsxRuntimeExports.jsxs(I,{className:r,...o,children:[jsxRuntimeExports.jsx(Ri,{label:`Schedule ${i}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(C,{variant:"clock"}),jsxRuntimeExports.jsx(uu,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(xi,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(xi,{text:c,icon:"chevron-down",iconRight:true,children:fu.map((t=>jsxRuntimeExports.jsx(xi.Item,{onClick:()=>m(t),children:t},t)))})]})]})}function yu({className:t,...n}){return jsxRuntimeExports.jsx(vu,{...n,className:t,variant:"restart"})}function wu({className:t,...n}){return jsxRuntimeExports.jsx(vu,{...n,className:t,variant:"shutdown"})}const bu={Body:uc,General:dc,Theme:mc,PinnedPosition:pc,AllowDocking:vc,MinimizeToTray:yc,AutoClose:wc,ShowTutorialOnStartup:bc,Layouts:kc,LayoutsRestoreLastSaved:Cc,LayoutsSaveCurrentOnExit:Nc,LayoutsShowUnsavedChangesPrompt:xc,LayoutsShowDeletePrompt:Sc,Downloads:Dc,DownloadsAskForEachDownload:Ec,DownloadsLocation:Ic,System:Ac,SystemRestartSection:yu,SystemShutdownSection:wu},ku=createContext(bu),Cu=memo((({children:t,components:n})=>{const i=useMemo((()=>({...bu,...n})),[n]);return jsxRuntimeExports.jsx(ku.Provider,{value:i,children:t})}));Cu.displayName="PreferencesPanelComponentsStoreProvider";const Nu=()=>useContext(ku);const Eu=n=>{const{General:i,Layouts:o,Widget:r}=Fu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})},Iu=({className:t,title:n="General",...i})=>{const{Theme:o}=Fu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Au=({className:n,title:i="Layouts",...o})=>{const{LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Fu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},Mu=({className:t,title:n="Widget",...i})=>{const{WidgetEnableForExternalApps:o}=Fu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Tu=({align:t="right",label:n="Enable for external apps",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:uo,...i}),Pu={Body:Eu,General:Iu,Theme:mc,Layouts:Au,LayoutsShowUnsavedChangesPrompt:xc,LayoutsShowDeletePrompt:Sc,Widget:Mu,WidgetEnableForExternalApps:Tu},_u=createContext(Pu),Ou=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Pu,...n})),[n]);return jsxRuntimeExports.jsx(_u.Provider,{value:i,children:t})}));Ou.displayName="PreferencesPanelComponentsStoreProvider";const Fu=()=>useContext(_u);const Ru=({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:i,isButtonDisabled:o,onButtonClick:r})=>jsxRuntimeExports.jsx(V,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map(((t,a)=>{const{id:s,text:l,variant:c}=t,u=i(s);return jsxRuntimeExports.jsx(A,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:o(s),onClick:()=>r(t),variant:c,children:l},s)}))}),ju=({actionButtons:n,children:i,onCompletion:o,size:r,title:a=(Ji()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]})=>{const{actionButtonElementsRefs:u,autofocusButtonId:m,hasAutofocusButtonLostInitialFocus:h}=(e=>{const t=useRef([]),n=useMemo((()=>e.find((e=>e.autofocus))?.id??null),[e]),i=useRef(n),[o,r]=useState(!i.current);return useLayoutEffect((()=>{if(o)return;if(n!==i.current)return void r(true);const e=t.current.find((e=>e?.id===n));if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}}),[n,o]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:o}})(n),p=()=>{o({isClosed:true});},g={...r};return jsxRuntimeExports.jsxs(K,{className:"io-dialog-template",closeFn:p,isOpen:true,onCancel:e=>{e.preventDefault(),p();},onKeyDown:e=>{!(e=>"Enter"===e.key||" "===e.key)(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||o({isEnterPressed:true});},style:g,title:a,children:[jsxRuntimeExports.jsx(K.Body,{children:i}),jsxRuntimeExports.jsx(K.Footer,{children:jsxRuntimeExports.jsx(Ru,{actionButtonElementsRefs:u,actionButtons:n,isAutofocusButton:e=>m===e&&!h,isButtonDisabled:e=>s.some((t=>t.disabledButtonIds.some((t=>t===e)))),onButtonClick:({id:e,text:t})=>{o({responseButtonClicked:{id:e,text:t}});}})})]})},Hu=({children:t})=>jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t});var zu=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,text:s,title:l}=o;return jsxRuntimeExports.jsx(ju,{actionButtons:r,onCompletion:n,size:i,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Hu,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:a,checkbox:s,heading:c,text:u,title:d}=o,[f,m]=useState(s.initialValue),h=useCallback((()=>m((e=>!e))),[]),p=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(ju,{actionButtons:a,onCompletion:e=>n({...e,inputs:p}),size:i,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Hu,{children:c}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(Li,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:h})]})},SingleTextInputDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,input:s,title:c}=o,[u,m]=useState(s.initialValue??""),h=useRef(null),p=(g=u,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:u}];return useLayoutEffect((()=>{h.current?.select();}),[]),jsxRuntimeExports.jsxs(ju,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:i,title:c,validationErrors:p?[p]:[],children:[jsxRuntimeExports.jsx(Hu,{children:a}),jsxRuntimeExports.jsx(Oi,{"data-testid":`io-dialog-input-${s.id}`,ref:h,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:p?.message,id:s.id,label:s.label,name:s.id,onChange:e=>m(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}});const $u=({name:n,value:i})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:i})]}),Vu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("div",{className:k("io-profile-section-body",n),children:[o&&jsxRuntimeExports.jsx(E,{className:"io-profile-section-title",text:o}),i.map((({name:t,value:n})=>jsxRuntimeExports.jsx($u,{name:t,value:n},t)))]}),Yu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",n),children:[jsxRuntimeExports.jsx(Vu,{items:i,title:o}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),Uu=({title:t="License",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),Wu=({title:t="Version",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),Ju=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),qu=({className:n})=>{const i=Ji()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:k("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:i}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[i,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},Ku=({avatarInitials:n=(Ji()?"CD":"CB"),className:i,items:o,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",i),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(Vu,{className:"mt-12",items:o,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),Gu={LicenseSection:Uu,ProductsInfoSection:Wu,PluginsSection:Ju,Trademark:qu,UserSection:Ku},Qu=createContext(Gu),Xu=memo((({children:t,components:n})=>{const i=useMemo((()=>({...Gu,...n})),[n]);return jsxRuntimeExports.jsx(Qu.Provider,{value:i,children:t})}));Xu.displayName="ProfilePanelComponentsStoreProvider";

const DEFAULT_DIALOG_TEMPLATES = [
    {
        name: "noInputsConfirmationDialog",
        Dialog: zu.NoInputsConfirmationDialog,
        validate: noInputsConfirmationDialogDecoder.runWithException
    },
    {
        name: "singleCheckboxDialog",
        Dialog: zu.SingleCheckboxDialog,
        validate: singleCheckboxDialogDecoder.runWithException
    },
    {
        name: "singleTextInputDialog",
        Dialog: zu.SingleTextInputDialog,
        validate: singleTextInputDialogDecoder.runWithException
    }
];

class DialogsController {
    config;
    glueController;
    messagePort;
    templates;
    logger;
    openedDialog = null;
    constructor(config, glueController, messagePort, templates) {
        this.config = config;
        this.glueController = glueController;
        this.messagePort = messagePort;
        this.templates = templates;
        this.logger = glueController.getLogger(`modals-ui.dialogs.controller-${glueController.clientId}`);
        messagePort.subscribe((event) => {
            if (this.openedDialog?.id !== event.data.id) {
                this.logger.warn(`Can not complete dialog with ID ${event.data.id} because it is not open.`);
                return;
            }
            this.openedDialog.config.onCompletion({ response: event.data.response });
        });
    }
    exposeAPI() {
        return {
            open: this.open.bind(this),
            close: this.close.bind(this)
        };
    }
    open(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute open command because dialogs are not enabled.");
        }
        this.logger.trace(`open command was invoked with config: ${JSON.stringify(config)}.`);
        const { templateName } = dialogsOpenConfigDecoder.runWithException(config);
        const template = this.templates.find((template) => template.name === templateName);
        if (!template) {
            throw new Error(`There is no template for the provided name ${templateName}.`);
        }
        const validatedConfig = template.validate(config);
        const id = nanoid(10);
        const { onCompletion, ...messageConfig } = validatedConfig;
        const message = {
            id,
            config: messageConfig
        };
        this.messagePort.postMessage(message);
        this.openedDialog = { id, config: validatedConfig };
        return { id };
    }
    close(config) {
        if (!this.config?.enabled) {
            throw new Error("Unable to execute close command because dialogs are not enabled.");
        }
        this.logger.trace(`close command was invoked with config: ${JSON.stringify(config)}.`);
        const validatedConfig = dialogsCloseConfigDecoder.runWithException(config);
        if (this.openedDialog?.id !== validatedConfig.id) {
            this.logger.warn(`There is no open dialog with ID ${validatedConfig.id}.`);
            return;
        }
        this.messagePort.postMessage(null);
        this.openedDialog = null;
    }
}

var createRoot;

var m = p__default;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

const Actions = ({ actions, onActionClick }) => {
    return (i__default.createElement(V, { "data-testid": "io-alert-action-buttons-group" }, actions.map((action) => (i__default.createElement(A, { "data-testid": `io-alert-action-button-${action.id}`, key: action.id, onClick: (event) => onActionClick(event, action) }, action.title)))));
};

const DefaultAlert = ({ data, onClick }) => {
    const handleClick = () => {
        const interopAction = data.config.clickInterop
            ? { name: "io-alert-click", settings: data.config.clickInterop }
            : undefined;
        onClick({ interopAction, shouldCloseAlert: true });
    };
    const handleCloseButtonClick = (event) => {
        event.stopPropagation();
        const interopAction = data.config.onCloseInterop
            ? { name: "io-alert-close", settings: data.config.onCloseInterop }
            : undefined;
        onClick({ interopAction, shouldCloseAlert: true });
    };
    const actions = !!data.config.actions?.length && (i__default.createElement(Actions, { actions: data.config.actions, onActionClick: (event, action) => {
            event.stopPropagation();
            const interopAction = {
                name: action.title,
                settings: action.clickInterop,
            };
            onClick({ interopAction, shouldCloseAlert: true });
        } }));
    return (i__default.createElement(S, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
};

const Alerts = ({ Alert = DefaultAlert, messagePort }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            setData(data);
        });
        return unsubscribe;
    }, [messagePort]);
    return data ? (i__default.createElement(Alert, { data: data, onClick: ({ interopAction, shouldCloseAlert }) => {
            messagePort.postMessage({
                id: data.id,
                interopAction,
                shouldCloseAlert,
            });
        } })) : null;
};

const Dialogs = ({ messagePort, templates }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            if (data === null) {
                return setData(null);
            }
            const { templateName } = data.config;
            const template = templates.find((template) => template.name === templateName);
            if (!template) {
                return console.warn(`There is no template for the provided name ${templateName}.`);
            }
            setData({ ...data, Dialog: template.Dialog });
        });
        return unsubscribe;
    }, [messagePort, templates]);
    return data ? (i__default.createElement(data.Dialog, { onCompletion: (response) => messagePort.postMessage({ id: data.id, response }), size: data.config.size, variables: data.config.variables })) : null;
};

class DOMController {
    rootElement;
    alertsMessagePort;
    dialogsMessagePort;
    dialogTemplates;
    alertsComponents;
    alertsContainerId = "io-alerts-container";
    dialogsContainerId = "io-dialogs-container";
    constructor(rootElement, alertsMessagePort, dialogsMessagePort, dialogTemplates, alertsComponents) {
        this.rootElement = rootElement;
        this.alertsMessagePort = alertsMessagePort;
        this.dialogsMessagePort = dialogsMessagePort;
        this.dialogTemplates = dialogTemplates;
        this.alertsComponents = alertsComponents;
    }
    appendAlerts() {
        this.appendToDOM(this.alertsContainerId, i__default.createElement(Alerts, { messagePort: this.alertsMessagePort, Alert: this.alertsComponents?.Alert }));
    }
    appendDialogs() {
        this.appendToDOM(this.dialogsContainerId, i__default.createElement(Dialogs, { messagePort: this.dialogsMessagePort, templates: this.dialogTemplates }));
    }
    appendToDOM(containerId, reactNode) {
        const domNode = document.createElement("div");
        domNode.id = containerId;
        const reactRoot = createRoot(domNode);
        reactRoot.render(reactNode);
        this.rootElement.appendChild(domNode);
    }
}

class GlueController {
    io;
    _clientId;
    constructor(io) {
        this.io = io;
        this._clientId = io.interop.instance.instance;
    }
    get clientId() {
        return this._clientId;
    }
    getLogger(name) {
        return this.io.logger.subLogger(name);
    }
}

function createRegistry(options) {
    if (options && options.errorHandling
        && typeof options.errorHandling !== "function"
        && options.errorHandling !== "log"
        && options.errorHandling !== "silent"
        && options.errorHandling !== "throw") {
        throw new Error("Invalid options passed to createRegistry. Prop errorHandling should be [\"log\" | \"silent\" | \"throw\" | (err) => void], but " + typeof options.errorHandling + " was passed");
    }
    var _userErrorHandler = options && typeof options.errorHandling === "function" && options.errorHandling;
    var callbacks = {};
    function add(key, callback, replayArgumentsArr) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            callbacksForKey = [];
            callbacks[key] = callbacksForKey;
        }
        callbacksForKey.push(callback);
        if (replayArgumentsArr) {
            setTimeout(function () {
                replayArgumentsArr.forEach(function (replayArgument) {
                    var _a;
                    if ((_a = callbacks[key]) === null || _a === void 0 ? void 0 : _a.includes(callback)) {
                        try {
                            if (Array.isArray(replayArgument)) {
                                callback.apply(undefined, replayArgument);
                            }
                            else {
                                callback.apply(undefined, [replayArgument]);
                            }
                        }
                        catch (err) {
                            _handleError(err, key);
                        }
                    }
                });
            }, 0);
        }
        return function () {
            var allForKey = callbacks[key];
            if (!allForKey) {
                return;
            }
            allForKey = allForKey.reduce(function (acc, element, index) {
                if (!(element === callback && acc.length === index)) {
                    acc.push(element);
                }
                return acc;
            }, []);
            if (allForKey.length === 0) {
                delete callbacks[key];
            }
            else {
                callbacks[key] = allForKey;
            }
        };
    }
    function execute(key) {
        var argumentsArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argumentsArr[_i - 1] = arguments[_i];
        }
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey || callbacksForKey.length === 0) {
            return [];
        }
        var results = [];
        callbacksForKey.forEach(function (callback) {
            try {
                var result = callback.apply(undefined, argumentsArr);
                results.push(result);
            }
            catch (err) {
                results.push(undefined);
                _handleError(err, key);
            }
        });
        return results;
    }
    function _handleError(exceptionArtifact, key) {
        var errParam = exceptionArtifact instanceof Error ? exceptionArtifact : new Error(exceptionArtifact);
        if (_userErrorHandler) {
            _userErrorHandler(errParam);
            return;
        }
        var msg = "[ERROR] callback-registry: User callback for key \"" + key + "\" failed: " + errParam.stack;
        if (options) {
            switch (options.errorHandling) {
                case "log":
                    return console.error(msg);
                case "silent":
                    return;
                case "throw":
                    throw new Error(msg);
            }
        }
        console.error(msg);
    }
    function clear() {
        callbacks = {};
    }
    function clearKey(key) {
        var callbacksForKey = callbacks[key];
        if (!callbacksForKey) {
            return;
        }
        delete callbacks[key];
    }
    return {
        add: add,
        execute: execute,
        clear: clear,
        clearKey: clearKey
    };
}
createRegistry.default = createRegistry;
var lib = createRegistry;


var CallbackRegistryFactory = /*@__PURE__*/getDefaultExportFromCjs(lib);

class ModalsUiMessageChannel {
    registry = CallbackRegistryFactory();
    channel = new MessageChannel();
    port1MessageRegistryKey = "port1-message-registry-key";
    port2MessageRegistryKey = "port2-message-registry-key";
    _port1 = this.generatePort(this.channel.port1, this.port1MessageRegistryKey);
    _port2 = this.generatePort(this.channel.port2, this.port2MessageRegistryKey);
    constructor() {
        this.channel.port1.onmessage = (event) => {
            this.registry.execute(this.port1MessageRegistryKey, event);
        };
        this.channel.port2.onmessage = (event) => {
            this.registry.execute(this.port2MessageRegistryKey, event);
        };
    }
    get componentPort() {
        return this._port1;
    }
    get controllerPort() {
        return this._port2;
    }
    generatePort(port, registryKey) {
        const postMessage = (message) => {
            return port.postMessage(message);
        };
        const subscribe = (callback) => {
            return this.registry.add(registryKey, callback);
        };
        return {
            postMessage,
            subscribe
        };
    }
}

class IoC {
    io;
    config;
    _alertsController;
    _dialogsController;
    _domController;
    _glueController;
    _alertsMessageChannel;
    _dialogsMessageChannel;
    _dialogTemplates;
    constructor(io, config) {
        this.io = io;
        this.config = config;
        this._dialogTemplates = [
            ...(config.dialogs?.templates ?? []),
            ...DEFAULT_DIALOG_TEMPLATES
        ];
    }
    get dialogTemplates() {
        return this._dialogTemplates;
    }
    get domController() {
        if (!this._domController) {
            this._domController = new DOMController(this.config.rootElement, this.alertsMessageChannel.componentPort, this.dialogsMessageChannel.componentPort, this.dialogTemplates, this.config.alerts?.components);
        }
        return this._domController;
    }
    get glueController() {
        if (!this._glueController) {
            this._glueController = new GlueController(this.io);
        }
        return this._glueController;
    }
    get alertsController() {
        if (!this._alertsController) {
            this._alertsController = new AlertsController(this.config.alerts, this.glueController, this.alertsMessageChannel.controllerPort);
        }
        return this._alertsController;
    }
    get dialogsController() {
        if (!this._dialogsController) {
            this._dialogsController = new DialogsController(this.config.dialogs, this.glueController, this.dialogsMessageChannel.controllerPort, this.dialogTemplates);
        }
        return this._dialogsController;
    }
    get alertsMessageChannel() {
        if (!this._alertsMessageChannel) {
            this._alertsMessageChannel = new ModalsUiMessageChannel();
        }
        return this._alertsMessageChannel;
    }
    get dialogsMessageChannel() {
        if (!this._dialogsMessageChannel) {
            this._dialogsMessageChannel = new ModalsUiMessageChannel();
        }
        return this._dialogsMessageChannel;
    }
}

const IOBrowserModalsUIFactory = async (io, config) => {
    const validatedConfig = configDecoder.runWithException(config);
    if (!(validatedConfig.rootElement instanceof HTMLDivElement)) {
        throw new Error("'rootElement' must be an instance of HTMLDivElement");
    }
    const ioc = new IoC(io, validatedConfig);
    const logger = ioc.glueController.getLogger(`modals-ui.factory-${ioc.glueController.clientId}`);
    if (validatedConfig.alerts?.enabled) {
        logger.trace("Alerts will be appended to the DOM");
        ioc.domController.appendAlerts();
    }
    if (validatedConfig.dialogs?.enabled) {
        logger.trace("Dialogs will be appended to the DOM");
        ioc.domController.appendDialogs();
    }
    return {
        alerts: ioc.alertsController.exposeAPI(),
        dialogs: ioc.dialogsController.exposeAPI()
    };
};

const eventController = new EventController();
eventController.wireCustomEventListener();
eventController.notifyStarted();
if (typeof window !== "undefined") {
    window.IOBrowserModalsUI = IOBrowserModalsUIFactory;
}

export { IOBrowserModalsUIFactory as default };
//# sourceMappingURL=io-browser-modals-ui-react.es.js.map
