import * as o from 'react';
import o__default, { createContext, memo, useState, useEffect, forwardRef, useCallback, useContext, useMemo, useRef, useImperativeHandle, useLayoutEffect, useId } from 'react';
import * as v from 'react-dom';
import v__default from 'react-dom';

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
const regexDecoder = anyJson().andThen((value) => {
    return value instanceof RegExp ? anyJson() : fail(`expected a regex, got a ${typeof value}`);
});

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
    name: optional(nonEmptyStringDecoder$1),
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
        nonNegativeNumberDecoder: nonNegativeNumberDecoder$1,
        regexDecoder
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
var f=o__default,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
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
    return glue ? (o__default.createElement(IOConnectContext.Provider, { value: glue }, children)) : (o__default.createElement(o__default.Fragment, null, fallback));
});
IOConnectProvider.propTypes = {
    children: propTypesExports.node,
    settings: propTypesExports.object,
    fallback: propTypesExports.node,
};
IOConnectProvider.displayName = 'IOConnectProvider';

function b(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var C,k={exports:{}};
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/C=k,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var i=arguments[t];i&&(e=o(e,n(i)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var i="";for(var r in n)e.call(n,r)&&n[r]&&(i=o(i,r));return i}function o(e,t){return t?e?e+" "+t:e+t:e}C.exports?(t.default=t,C.exports=t):window.classNames=t;}();var x=b(k.exports);function S({className:t,size:n="16",variant:o="workspace",...i}){const r=x("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,"aria-label":`icon-${o}`,role:"presentation",...i,children:jsxRuntimeExports.jsx("i",{className:`icon-${o}`})})}const N=forwardRef(({className:t,variant:n="default",icon:o="workspace",size:i="16",tooltip:r,iconSize:s="16",onClick:l,disabled:c,children:u,...d},f)=>{const m=x("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${i}`],t),p=useCallback(e=>{if(!c)return l?l(e):void 0;e.preventDefault();},[l,c]);return jsxRuntimeExports.jsx("button",{className:m,type:"button",ref:f,"aria-label":"icon button","aria-disabled":c,title:r,onClick:p,disabled:c,...d,children:u??(o&&jsxRuntimeExports.jsx(S,{variant:o,size:s}))})});N.displayName="ButtonIcon";const D={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function E({className:n,variant:o="default",size:i="normal",text:r,close:a=false,closeButtonOnClick:s,append:l,...c}){const u=x("io-alert",`io-alert-${o}`,"large"===i&&"io-alert-lg",n),d=D[o];return jsxRuntimeExports.jsxs("div",{"data-testid":"io-alert",className:u,role:"alert","aria-label":"alert",...c,children:[d&&jsxRuntimeExports.jsx(S,{"data-testid":"io-alert-icon",variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{"data-testid":"io-alert-text",className:"io-text-smaller",children:r}),"large"===i&&l,a&&jsxRuntimeExports.jsx(N,{"data-testid":"io-alert-close-button",className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function I({className:t,variant:n="default",children:o,...i}){const r=x("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:o})}function M({className:t,tag:n="h2",size:o="normal",text:i="Title",...r}){const a=n,s=x("small"===o&&"io-title-semibold","normal"===o&&"io-title","large"===o&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:i})}function P({className:n,title:o,titleSize:i="normal",tag:r,hint:a,children:s,...l}){const c=x("io-block",n),u=o?"block-title":void 0;return jsxRuntimeExports.jsxs("section",{className:c,"aria-label":o?void 0:"Block","aria-labelledby":u,...l,children:[o&&jsxRuntimeExports.jsx(M,{id:u,tag:r,text:o,size:i}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const T=e=>"Enter"===e.key||" "===e.key,A=forwardRef(({className:n,variant:o="default",size:i="normal",icon:r,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},p)=>{const h=x("io-btn",("primary"===o||"critical"===o||"outline"===o||"link"===o)&&[`io-btn-${o}`],"large"===i&&"io-btn-lg",n),g=useCallback(e=>{if(!d)return u?u(e):void 0;e.preventDefault();},[u,d]),v=useCallback(e=>{d||T(e)&&(e.preventDefault(),g(e));},[g,d]);return jsxRuntimeExports.jsxs("button",{className:h,ref:p,type:"button","aria-disabled":d,onClick:g,onKeyDown:v,disabled:d,tabIndex:0,...m,children:[r&&!l&&jsxRuntimeExports.jsx(S,{variant:r,size:s}),f??c,r&&l&&jsxRuntimeExports.jsx(S,{variant:r,size:s})]})});A.displayName="Button";const O=createContext({}),L=forwardRef(({icon:t="chevron-down",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=useContext(O),d=useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),m=useCallback(e=>{o?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:f,onKeyDown:m,disabled:c,ref:d,...i})});L.displayName="DropdownButton";const F=forwardRef(({size:t="32",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=useContext(O),d=useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),m=useCallback(e=>{o?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(N,{size:t,onClick:f,onKeyDown:m,disabled:c,ref:d,...i})});function B({className:t,...n}){const o=x("io-dropdown-content",t);return jsxRuntimeExports.jsx("div",{className:o,...n})}F.displayName="DropdownButtonIcon";const R=createContext({}),_=forwardRef((n,o)=>{const{className:i,prepend:r,append:a,isSelected:s,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,...p}=n,{variant:h="default",selected:g,checkIcon:v,handleItemClick:y}=useContext(R),w=s??g?.some(e=>e.children===f),b="default"!==h&&!!v,C=b||r,k=x("io-list-item",C&&"io-list-item-left",a&&"io-list-item-right","default"!==h&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",i);return jsxRuntimeExports.jsxs("li",{className:k,ref:o,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...p,children:[C&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(S,{variant:v.variant,title:w?v.tooltip:void 0,"data-testid":"list-item-check-icon"}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,"data-testid":"list-item-title",children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})});_.displayName="ListItem";const H=forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,"data-testid":"list-item-title",children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});H.displayName="ListItemTitle";const $=forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});$.displayName="ListItemSection";const j=forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});j.displayName="ListItemHeader";const z=forwardRef(({className:t,children:n,...o},i)=>{const r=x("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:i,...o,children:n})});z.displayName="ListItemWithSubItems";const V=forwardRef((t,n)=>{const{className:o,variant:i="default",checkIcon:r,children:s,...l}=t,[d,f]=useState([]),m=x("io-list","default"!==i&&"io-list-selectable",o),p=useMemo(()=>{if(r)return "object"==typeof r?r:{variant:r}},[r]),h=useCallback((e,t)=>{if("default"===i)return;const n=d.some(e=>e.children?.toString()===t.children?.toString());"single"===i?f([t]):(()=>{const e=n?d.filter(e=>e.children!==t.children):[...d,t];f(e);})();},[d,i]),g=useMemo(()=>({variant:i,selected:d,checkIcon:p,handleItemClick:h}),[i,d,p,h]);return jsxRuntimeExports.jsx(R.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...l,children:s})})});V.displayName="List";const W=V;W.Item=_,W.ItemTitle=H,W.ItemSection=$,W.ItemHeader=j,W.ItemWithSubItems=z;const Y=forwardRef((t,n)=>jsxRuntimeExports.jsx(W,{...t,ref:n}));Y.displayName="DropdownList";const U=forwardRef((t,n)=>{const{handleClose:o}=useContext(O),{onClick:i,onKeyDown:r,...s}=t,c=useRef(null),u=useCallback(e=>{c.current=e,"function"==typeof n?n(e):n&&(n.current=e);},[n]);return jsxRuntimeExports.jsx(_,{...s,ref:u,onClick:e=>{i?.(e),o?.();},onKeyDown:e=>{if(r?.(e),e.defaultPrevented||!T(e))return;e.preventDefault(),e.stopPropagation();const t=("function"==typeof n?null:n?.current)||c.current;t?.click();}})});U.displayName="DropdownItem";const K=forwardRef((t,n)=>jsxRuntimeExports.jsx(H,{...t,ref:n}));K.displayName="DropdownItemTitle";const J=forwardRef((t,n)=>jsxRuntimeExports.jsx($,{...t,ref:n}));function q({className:t,...n}){const o=x("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:o,...n})}J.displayName="DropdownItemSection";const G=forwardRef((t,n)=>jsxRuntimeExports.jsx(q,{...t}));G.displayName="DropdownSeparator";function Q(e,t,n){const o=useCallback(n=>{const o=t.some(e=>n.key===e);o&&(n.preventDefault(),e());},[e,t]);useEffect(()=>{const e=n?.current||document;return e.addEventListener("keydown",o),()=>{e.removeEventListener("keydown",o);}},[o,n]);}const X=forwardRef(({className:t,variant:n="outline",align:o="down",disabled:i,isOpen:r,onOpenChange:s,children:l,...p},h)=>{const g=useRef(null),v=useRef(null);useImperativeHandle(h,()=>v.current,[]);const{isOpen:y,handleOpen:w,handleClose:b}=((e,t)=>{const[n,o]=useState(false),i=void 0!==e,r=i?e:n,s=useCallback(e=>{i||o(e),t?.(e);},[i,t]),l=useCallback(()=>s(true),[s]),u=useCallback(()=>s(false),[s]);return {isOpen:r,setOpen:s,handleOpen:l,handleClose:u}})(r,s);((e,t,n=true)=>{useEffect(()=>{if(!n)return;const o=n=>{const o=n.target;o&&e.current&&!e.current.contains(o)&&(n.composedPath&&n.composedPath().some(t=>t===e.current||e.current&&t.nodeType===Node.ELEMENT_NODE&&e.current.contains(t))||t());},i=requestAnimationFrame(()=>{document.addEventListener("mousedown",o,true);});return ()=>{cancelAnimationFrame(i),document.removeEventListener("mousedown",o,true);}},[e,t,n]);})(v,b,y),Q(()=>{y&&b();},["Escape"],v),Q(()=>{y||i||g.current!==document.activeElement||w();},["ArrowDown","ArrowUp"],v);const C=useMemo(()=>({variant:n,align:o,disabled:i,isOpen:y,handleOpen:w,handleClose:b,handleToggle:y?b:w,setTriggerRef:e=>g.current=e}),[n,o,i,y,w,b]),k=x("io-dropdown",y&&"io-dropdown-open","default"!==n&&`io-dropdown-${n}`,t);return jsxRuntimeExports.jsx(O.Provider,{value:C,children:jsxRuntimeExports.jsx("div",{className:k,ref:v,...p,children:l})})});function Z({className:t,variant:n="default",align:o="left",children:i,...r}){const a=x("io-btn-group","default"!==n&&`io-btn-group-${n}`,"right"===o&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,"data-testid":"button-group",...r,children:i})}function ee({className:t,draggable:n=false,children:o,...i}){const r=x("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,...i,children:o})}function te({className:t,children:n,...o}){const i=x("io-dialog-header",t);return jsxRuntimeExports.jsx(ee,{"data-testid":"io-dialog-header",className:i,...o,children:n})}function ne({className:t,children:n,...o}){const i=x("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:i,...o,children:n})}function oe({className:t,children:n,...o}){const i=x("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:i,...o,children:n})}function ie({className:t,...n}){const o=x("io-dialog-footer",t);return jsxRuntimeExports.jsx(oe,{"data-testid":"io-dialog-footer",className:o,...n})}function re({className:n,variant:o="default",title:i="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s,children:l,...c}){const u=useRef(null),f=x("io-dialog","centered"===o&&"io-dialog-center",n);return useLayoutEffect(()=>{const e=u?.current;e&&(r?e.showModal():"function"==typeof e.close&&e.close());},[r]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:f,ref:u,"data-modal":true,onClose:()=>{r&&s&&s();},onClick:e=>{r&&s&&"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;r&&s&&" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(te,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:i}),jsxRuntimeExports.jsx(Z,{children:jsxRuntimeExports.jsx(N,{className:"non-draggable","data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function ae(){return "undefined"!=typeof window}function se(e){return ue(e)?(e.nodeName||"").toLowerCase():"#document"}function le(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function ce(e){var t;return null==(t=(ue(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ue(e){return !!ae()&&(e instanceof Node||e instanceof le(e).Node)}function de(e){return !!ae()&&(e instanceof Element||e instanceof le(e).Element)}function fe(e){return !!ae()&&(e instanceof HTMLElement||e instanceof le(e).HTMLElement)}function me(e){return !(!ae()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof le(e).ShadowRoot)}X.Button=L,X.ButtonIcon=F,X.Content=B,X.List=Y,X.Item=U,X.ItemTitle=K,X.ItemSection=J,X.Separator=G,Z.Button=A,Z.ButtonIcon=N,Z.Dropdown=X,ee.Title=M,ee.ButtonGroup=Z,ee.Button=A,ee.ButtonIcon=N,ee.Dropdown=X,te.Title=M,te.ButtonGroup=Z,te.Button=A,te.ButtonIcon=N,te.Dropdown=X,ne.Content=function({className:t,children:n,...o}){const i=x("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})},oe.ButtonGroup=Z,oe.Button=A,oe.ButtonIcon=N,oe.Dropdown=X,ie.ButtonGroup=Z,ie.Button=A,ie.ButtonIcon=N,ie.Dropdown=X,re.Header=te,re.Body=ne,re.Footer=ie;const pe=new Set(["inline","contents"]);function he(e){const{overflow:t,overflowX:n,overflowY:o,display:i}=Ee(e);return /auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!pe.has(i)}const ge=new Set(["table","td","th"]);function ve(e){return ge.has(se(e))}const ye=[":popover-open",":modal"];function we(e){return ye.some(t=>{try{return e.matches(t)}catch(e){return  false}})}const be=["transform","translate","scale","rotate","perspective"],Ce=["transform","translate","scale","rotate","perspective","filter"],ke=["paint","layout","strict","content"];function xe(e){const t=Se(),n=de(e)?Ee(e):e;return be.some(e=>!!n[e]&&"none"!==n[e])||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||Ce.some(e=>(n.willChange||"").includes(e))||ke.some(e=>(n.contain||"").includes(e))}function Se(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}const Ne=new Set(["html","body","#document"]);function De(e){return Ne.has(se(e))}function Ee(e){return le(e).getComputedStyle(e)}function Ie(e){return de(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Me(e){if("html"===se(e))return e;const t=e.assignedSlot||e.parentNode||me(e)&&e.host||ce(e);return me(t)?t.host:t}function Pe(e){const t=Me(e);return De(t)?e.ownerDocument?e.ownerDocument.body:e.body:fe(t)&&he(t)?t:Pe(t)}function Te(e,t,n){var o;void 0===t&&(t=[]),void 0===n&&(n=true);const i=Pe(e),r=i===(null==(o=e.ownerDocument)?void 0:o.body),a=le(i);if(r){const e=Ae(a);return t.concat(a,a.visualViewport||[],he(i)?i:[],e&&n?Te(e):[])}return t.concat(i,Te(i,[],n))}function Ae(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Oe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function Le(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&me(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function Fe(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function Be(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(e=>{let{brand:t,version:n}=e;return t+"/"+n}).join(" "):navigator.userAgent}function Re(e){return !(0!==e.mozInputSource||!e.isTrusted)||($e()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function _e(e){return !Be().includes("jsdom/")&&(!$e()&&0===e.width&&0===e.height||$e()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function He(){return /apple/i.test(navigator.vendor)}function $e(){const e=/android/i;return e.test(Fe())||e.test(Be())}function je(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function ze(e){return (null==e?void 0:e.ownerDocument)||document}function Ve(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function We(e){return "composedPath"in e?e.composedPath()[0]:e.target}function Ye(e){return fe(e)&&e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])")}function Ue(e){e.preventDefault(),e.stopPropagation();}function Ke(e){return !!e&&("combobox"===e.getAttribute("role")&&Ye(e))}const Je=Math.min,qe=Math.max,Ge=Math.round,Qe=Math.floor,Xe=e=>({x:e,y:e}),Ze={left:"right",right:"left",bottom:"top",top:"bottom"},et={start:"end",end:"start"};function tt(e,t,n){return qe(e,Je(t,n))}function nt(e,t){return "function"==typeof e?e(t):e}function ot(e){return e.split("-")[0]}function it(e){return e.split("-")[1]}function rt(e){return "x"===e?"y":"x"}function at(e){return "y"===e?"height":"width"}const st=new Set(["top","bottom"]);function lt(e){return st.has(ot(e))?"y":"x"}function ct(e){return rt(lt(e))}function ut(e){return e.replace(/start|end/g,e=>et[e])}const dt=["left","right"],ft=["right","left"],mt=["top","bottom"],pt=["bottom","top"];function ht(e,t,n,o){const i=it(e);let r=function(e,t,n){switch(e){case "top":case "bottom":return n?t?ft:dt:t?dt:ft;case "left":case "right":return t?mt:pt;default:return []}}(ot(e),"start"===n,o);return i&&(r=r.map(e=>e+"-"+i),t&&(r=r.concat(r.map(ut)))),r}function gt(e){return e.replace(/left|right|bottom|top/g,e=>Ze[e])}function vt(e){const{x:t,y:n,width:o,height:i}=e;return {width:o,height:i,top:n,left:t,right:t+o,bottom:n+i,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var yt=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),wt="undefined"==typeof Element,bt=wt?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Ct=!wt&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},kt=function e(t,n){var o;void 0===n&&(n=true);var i=null==t||null===(o=t.getAttribute)||void 0===o?void 0:o.call(t,"inert");return ""===i||"true"===i||n&&t&&e(t.parentNode)},xt=function e(t,n,o){for(var i=[],r=Array.from(t);r.length;){var a=r.shift();if(!kt(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,o);o.flatten?i.push.apply(i,l):i.push({scopeParent:a,candidates:l});}else {bt.call(a,yt)&&o.filter(a)&&(n||!t.includes(a))&&i.push(a);var c=a.shadowRoot||"function"==typeof o.getShadowRoot&&o.getShadowRoot(a),u=!kt(c,false)&&(!o.shadowRootFilter||o.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,o);o.flatten?i.push.apply(i,d):i.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return i},St=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},Nt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!St(e)?0:e.tabIndex},Dt=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},Et=function(e){return "INPUT"===e.tagName},It=function(e){return function(e){return Et(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Ct(e),o=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=o(window.CSS.escape(e.name));else try{t=o(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var i=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !i||i===e}(e)},Mt=function(e){var t=e.getBoundingClientRect(),n=t.width,o=t.height;return 0===n&&0===o},Pt=function(e,t){var n=t.displayCheck,o=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var i=bt.call(e,"details>summary:first-of-type")?e.parentElement:e;if(bt.call(i,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return Mt(e)}else {if("function"==typeof o){for(var r=e;e;){var a=e.parentElement,s=Ct(e);if(a&&!a.shadowRoot&&true===o(a))return Mt(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,o,i,r=e&&Ct(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(o=n.ownerDocument)&&void 0!==o&&o.contains(a)||null!=e&&null!==(i=e.ownerDocument)&&void 0!==i&&i.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=Ct(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},Tt=function(e,t){return !(t.disabled||kt(t)||function(e){return Et(e)&&"hidden"===e.type}(t)||Pt(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some(function(e){return "SUMMARY"===e.tagName})}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var o=t.children.item(n);if("LEGEND"===o.tagName)return !!bt.call(t,"fieldset[disabled] *")||!o.contains(e)}return  true}t=t.parentElement;}return  false}(t))},At=function(e,t){return !(It(t)||Nt(t)<0||!Tt(e,t))},Ot=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},Lt=function e(t){var n=[],o=[];return t.forEach(function(t,i){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=Nt(e);return n<0&&t&&!St(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):o.push({documentOrder:i,tabIndex:s,item:t,isScope:r,content:l});}),o.sort(Dt).reduce(function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e},[]).concat(n)},Ft=function(e,t){var n;return n=(t=t||{}).getShadowRoot?xt([e],t.includeContainer,{filter:At.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:Ot}):function(e,t,n){if(kt(e))return [];var o=Array.prototype.slice.apply(e.querySelectorAll(yt));return t&&bt.call(e,yt)&&o.unshift(e),o.filter(n)}(e,t.includeContainer,At.bind(null,t)),Lt(n)};function Bt(e,t,n){let{reference:o,floating:i}=e;const r=lt(t),a=ct(t),s=at(a),l=ot(t),c="y"===r,u=o.x+o.width/2-i.width/2,d=o.y+o.height/2-i.height/2,f=o[s]/2-i[s]/2;let m;switch(l){case "top":m={x:u,y:o.y-i.height};break;case "bottom":m={x:u,y:o.y+o.height};break;case "right":m={x:o.x+o.width,y:d};break;case "left":m={x:o.x-i.width,y:d};break;default:m={x:o.x,y:o.y};}switch(it(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function Rt(e,t){var n;void 0===t&&(t={});const{x:o,y:i,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=nt(t,e),p=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),h=s[f?"floating"===d?"reference":"floating":d],g=vt(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(h)))||n?h:h.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:o,y:i,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=vt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+p.top)/w.y,bottom:(b.bottom-g.bottom+p.bottom)/w.y,left:(g.left-b.left+p.left)/w.x,right:(b.right-g.right+p.right)/w.x}}const _t=new Set(["left","top"]);function Ht(e){const t=Ee(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const i=fe(e),r=i?e.offsetWidth:n,a=i?e.offsetHeight:o,s=Ge(n)!==r||Ge(o)!==a;return s&&(n=r,o=a),{width:n,height:o,$:s}}function $t(e){return de(e)?e:e.contextElement}function jt(e){const t=$t(e);if(!fe(t))return Xe(1);const n=t.getBoundingClientRect(),{width:o,height:i,$:r}=Ht(t);let a=(r?Ge(n.width):n.width)/o,s=(r?Ge(n.height):n.height)/i;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const zt=Xe(0);function Vt(e){const t=le(e);return Se()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:zt}function Wt(e,t,n,o){ void 0===t&&(t=false),void 0===n&&(n=false);const i=e.getBoundingClientRect(),r=$t(e);let a=Xe(1);t&&(o?de(o)&&(a=jt(o)):a=jt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==le(e))&&t}(r,n,o)?Vt(r):Xe(0);let l=(i.left+s.x)/a.x,c=(i.top+s.y)/a.y,u=i.width/a.x,d=i.height/a.y;if(r){const e=le(r),t=o&&de(o)?le(o):o;let n=e,i=Ae(n);for(;i&&o&&t!==n;){const e=jt(i),t=i.getBoundingClientRect(),o=Ee(i),r=t.left+(i.clientLeft+parseFloat(o.paddingLeft))*e.x,a=t.top+(i.clientTop+parseFloat(o.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=le(i),i=Ae(n);}}return vt({width:u,height:d,x:l,y:c})}function Yt(e,t){const n=Ie(e).scrollLeft;return t?t.left+n:Wt(ce(e)).left+n}function Ut(e,t,n){ void 0===n&&(n=false);const o=e.getBoundingClientRect();return {x:o.left+t.scrollLeft-(n?0:Yt(e,o)),y:o.top+t.scrollTop}}const Kt=new Set(["absolute","fixed"]);function Jt(e,t,n){let o;if("viewport"===t)o=function(e,t){const n=le(e),o=ce(e),i=n.visualViewport;let r=o.clientWidth,a=o.clientHeight,s=0,l=0;if(i){r=i.width,a=i.height;const e=Se();(!e||e&&"fixed"===t)&&(s=i.offsetLeft,l=i.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)o=function(e){const t=ce(e),n=Ie(e),o=e.ownerDocument.body,i=qe(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=qe(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let a=-n.scrollLeft+Yt(e);const s=-n.scrollTop;return "rtl"===Ee(o).direction&&(a+=qe(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:a,y:s}}(ce(e));else if(de(t))o=function(e,t){const n=Wt(e,true,"fixed"===t),o=n.top+e.clientTop,i=n.left+e.clientLeft,r=fe(e)?jt(e):Xe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:i*r.x,y:o*r.y}}(t,n);else {const n=Vt(e);o={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height};}return vt(o)}function qt(e,t){const n=Me(e);return !(n===t||!de(n)||De(n))&&("fixed"===Ee(n).position||qt(n,t))}function Gt(e,t,n){const o=fe(t),i=ce(t),r="fixed"===n,a=Wt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=Xe(0);function c(){l.x=Yt(i);}if(o||!o&&!r)if(("body"!==se(t)||he(i))&&(s=Ie(t)),o){const e=Wt(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else i&&c();r&&!o&&i&&c();const u=!i||o||r?Xe(0):Ut(i,s);return {x:a.left+s.scrollLeft-l.x-u.x,y:a.top+s.scrollTop-l.y-u.y,width:a.width,height:a.height}}function Qt(e){return "static"===Ee(e).position}function Xt(e,t){if(!fe(e)||"fixed"===Ee(e).position)return null;if(t)return t(e);let n=e.offsetParent;return ce(e)===n&&(n=n.ownerDocument.body),n}function Zt(e,t){const n=le(e);if(we(e))return n;if(!fe(e)){let t=Me(e);for(;t&&!De(t);){if(de(t)&&!Qt(t))return t;t=Me(t);}return n}let o=Xt(e,t);for(;o&&ve(o)&&Qt(o);)o=Xt(o,t);return o&&De(o)&&Qt(o)&&!xe(o)?n:o||function(e){let t=Me(e);for(;fe(t)&&!De(t);){if(xe(t))return t;if(we(t))return null;t=Me(t);}return null}(e)||n}const en={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:o,strategy:i}=e;const r="fixed"===i,a=ce(o),s=!!t&&we(t.floating);if(o===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Xe(1);const u=Xe(0),d=fe(o);if((d||!d&&!r)&&(("body"!==se(o)||he(a))&&(l=Ie(o)),fe(o))){const e=Wt(o);c=jt(o),u.x=e.x+o.clientLeft,u.y=e.y+o.clientTop;}const f=!a||d||r?Xe(0):Ut(a,l,true);return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x+f.x,y:n.y*c.y-l.scrollTop*c.y+u.y+f.y}},getDocumentElement:ce,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:o,strategy:i}=e;const r=[..."clippingAncestors"===n?we(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let o=Te(e,[],false).filter(e=>de(e)&&"body"!==se(e)),i=null;const r="fixed"===Ee(e).position;let a=r?Me(e):e;for(;de(a)&&!De(a);){const t=Ee(a),n=xe(a);n||"fixed"!==t.position||(i=null),(r?!n&&!i:!n&&"static"===t.position&&i&&Kt.has(i.position)||he(a)&&!n&&qt(e,a))?o=o.filter(e=>e!==a):i=t,a=Me(a);}return t.set(e,o),o}(t,this._c):[].concat(n),o],a=r[0],s=r.reduce((e,n)=>{const o=Jt(t,n,i);return e.top=qe(o.top,e.top),e.right=Je(o.right,e.right),e.bottom=Je(o.bottom,e.bottom),e.left=qe(o.left,e.left),e},Jt(t,a,i));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Zt,getElementRects:async function(e){const t=this.getOffsetParent||Zt,n=this.getDimensions,o=await n(e.floating);return {reference:Gt(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=Ht(e);return {width:t,height:n}},getScale:jt,isElement:de,isRTL:function(e){return "rtl"===Ee(e).direction}};function tn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function nn(e,t,n,o){ void 0===o&&(o={});const{ancestorScroll:i=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=o,c=$t(e),u=i||r?[...c?Te(c):[],...Te(t)]:[];u.forEach(e=>{i&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);});const d=c&&s?function(e,t){let n,o=null;const i=ce(e);function r(){var e;clearTimeout(n),null==(e=o)||e.disconnect(),o=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const c=e.getBoundingClientRect(),{left:u,top:d,width:f,height:m}=c;if(s||t(),!f||!m)return;const p={rootMargin:-Qe(d)+"px "+-Qe(i.clientWidth-(u+f))+"px "+-Qe(i.clientHeight-(d+m))+"px "+-Qe(u)+"px",threshold:qe(0,Je(1,l))||1};let h=true;function g(t){const o=t[0].intersectionRatio;if(o!==l){if(!h)return a();o?a(false,o):n=setTimeout(()=>{a(false,1e-7);},1e3);}1!==o||tn(c,e.getBoundingClientRect())||a(),h=false;}try{o=new IntersectionObserver(g,{...p,root:i.ownerDocument});}catch(e){o=new IntersectionObserver(g,p);}o.observe(e);}(true),r}(c,n):null;let f,m=-1,p=null;a&&(p=new ResizeObserver(e=>{let[o]=e;o&&o.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var e;null==(e=p)||e.observe(t);})),n();}),c&&!l&&p.observe(c),p.observe(t));let h=l?Wt(e):null;return l&&function t(){const o=Wt(e);h&&!tn(h,o)&&n();h=o,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);}),null==d||d(),null==(e=p)||e.disconnect(),p=null,l&&cancelAnimationFrame(f);}}const on=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,o;const{x:i,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:o,elements:i}=e,r=await(null==o.isRTL?void 0:o.isRTL(i.floating)),a=ot(n),s=it(n),l="y"===lt(n),c=_t.has(a)?-1:1,u=r&&l?-1:1,d=nt(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:p}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&"number"==typeof p&&(m="end"===s?-1*p:p),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(o=s.arrow)&&o.alignmentOffset?{}:{x:i+l.x,y:r+l.y,data:{...l,placement:a}}}}},rn=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:i}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=nt(e,t),c={x:n,y:o},u=await Rt(t,l),d=lt(ot(i)),f=rt(d);let m=c[f],p=c[d];if(r){const e="y"===f?"bottom":"right";m=tt(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";p=tt(p+u["y"===d?"top":"left"],p,p-u[e]);}const h=s.fn({...t,[f]:m,[d]:p});return {...h,data:{x:h.x-n,y:h.y-o,enabled:{[f]:r,[d]:a}}}}}},an=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:i,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:h=true,...g}=nt(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=ot(i),y=lt(s),w=ot(s)===s,b=await(null==l.isRTL?void 0:l.isRTL(c.floating)),C=f||(w||!h?[gt(s)]:function(e){const t=gt(e);return [ut(e),t,ut(t)]}(s)),k="none"!==p;!f&&k&&C.push(...ht(s,h,p,b));const x=[s,...C],S=await Rt(t,g),N=[];let D=(null==(o=r.flip)?void 0:o.overflows)||[];if(u&&N.push(S[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const o=it(e),i=ct(e),r=at(i);let a="x"===i?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=gt(a)),[a,gt(a)]}(i,a,b);N.push(S[e[0]],S[e[1]]);}if(D=[...D,{placement:i,overflows:N}],!N.every(e=>e<=0)){var E,I;const e=((null==(E=r.flip)?void 0:E.index)||0)+1,t=x[e];if(t){if(!("alignment"===d&&y!==lt(t))||D.every(e=>lt(e.placement)!==y||e.overflows[0]>0))return {data:{index:e,overflows:D},reset:{placement:t}}}let n=null==(I=D.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:I.placement;if(!n)switch(m){case "bestFit":{var M;const e=null==(M=D.filter(e=>{if(k){const t=lt(e.placement);return t===y||"y"===t}return  true}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:M[0];e&&(n=e);break}case "initialPlacement":n=s;}if(i!==n)return {reset:{placement:n}}}return {}}}},sn=(e,t,n)=>{const o=new Map,i={platform:en,...n},r={...i.platform,_c:o};return (async(e,t,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=Bt(c,o,l),f=o,m={},p=0;for(let n=0;n<s.length;n++){const{name:r,fn:h}=s[n],{x:g,y:v,data:y,reset:w}=await h({x:u,y:d,initialPlacement:o,placement:f,strategy:i,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&p<=50&&(p++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:i}):w.rects),({x:u,y:d}=Bt(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:i,middlewareData:m}})(e,t,{...i,platform:r})};var ln="undefined"!=typeof document?useLayoutEffect:function(){};function cn(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,o,i;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(o=n;0!==o--;)if(!cn(e[o],t[o]))return  false;return  true}if(i=Object.keys(e),n=i.length,n!==Object.keys(t).length)return  false;for(o=n;0!==o--;)if(!{}.hasOwnProperty.call(t,i[o]))return  false;for(o=n;0!==o--;){const n=i[o];if(("_owner"!==n||!e.$$typeof)&&!cn(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function un(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function dn(e,t){const n=un(e);return Math.round(t*n)/n}function fn(e){const t=o.useRef(e);return ln(()=>{t.current=e;}),t}const mn=(e,t)=>({...rn(e),options:[e,t]}),pn=(e,t)=>({...an(e),options:[e,t]});function hn(e){return o.useMemo(()=>e.every(e=>null==e)?null:t=>{e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);});},e)}const gn={...o},vn=gn.useInsertionEffect||(e=>e());function yn(e){const t=o.useRef(()=>{});return vn(()=>{t.current=e;}),o.useCallback(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return null==t.current?void 0:t.current(...n)},[])}const wn="ArrowUp",bn="ArrowDown",Cn="ArrowLeft",kn="ArrowRight";function xn(e,t,n){return Math.floor(e/t)!==n}function Sn(e,t){return t<0||t>=e.current.length}function Nn(e,t){return En(e,{disabledIndices:t})}function Dn(e,t){return En(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function En(e,t){let{startingIndex:n=-1,decrement:o=false,disabledIndices:i,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=o?-r:r;}while(s>=0&&s<=a.length-1&&Pn(a,s,i));return s}function In(e,t,n,o,i){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(i){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*o:r;case "br":return n.lastIndexOf(e)}}function Mn(e,t){return t.flatMap((t,n)=>e.includes(t)?[n]:[])}function Pn(e,t,n){if(n)return n.includes(t);const o=e[t];return null==o||o.hasAttribute("disabled")||"true"===o.getAttribute("aria-disabled")}var Tn="undefined"!=typeof document?useLayoutEffect:useEffect;function An(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const On=o.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function Ln(e){const{children:t,elementsRef:n,labelsRef:i}=e,[r,a]=o.useState(()=>new Map),s=o.useCallback(e=>{a(t=>new Map(t).set(e,null));},[]),l=o.useCallback(e=>{a(t=>{const n=new Map(t);return n.delete(e),n});},[]);return Tn(()=>{const e=new Map(r);Array.from(e.keys()).sort(An).forEach((t,n)=>{e.set(t,n);}),function(e,t){if(e.size!==t.size)return  false;for(const[n,o]of e.entries())if(o!==t.get(n))return  false;return  true}(r,e)||a(e);},[r]),o.createElement(On.Provider,{value:o.useMemo(()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:i}),[s,l,r,n,i])},t)}function Fn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:i,map:r,elementsRef:a,labelsRef:s}=o.useContext(On),[l,c]=o.useState(null),u=o.useRef(null),d=o.useCallback(e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const o=void 0!==t;s.current[l]=o?t:null!=(n=null==e?void 0:e.textContent)?n:null;}},[l,a,s,t]);return Tn(()=>{const e=u.current;if(e)return n(e),()=>{i(e);}},[n,i]),Tn(()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);},[r]),o.useMemo(()=>({ref:d,index:null==l?-1:l}),[l,d])}function Bn(){return Bn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e},Bn.apply(this,arguments)}let Rn=false,_n=0;const Hn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+_n++;const $n=gn.useId||function(){const[e,t]=o.useState(()=>Rn?Hn():void 0);return Tn(()=>{null==e&&t(Hn());},[]),o.useEffect(()=>{Rn=true;},[]),e};function Vn(){const e=new Map;return {emit(t,n){var o;null==(o=e.get(t))||o.forEach(e=>e(n));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var o;e.set(t,(null==(o=e.get(t))?void 0:o.filter(e=>e!==n))||[]);}}}const Wn=o.createContext(null),Yn=o.createContext(null),Un=()=>{var e;return (null==(e=o.useContext(Wn))?void 0:e.id)||null},Kn=()=>o.useContext(Yn);function Jn(e){const{children:t,id:n}=e,i=Un();return o.createElement(Wn.Provider,{value:o.useMemo(()=>({id:n,parentId:i}),[n,i])},t)}function qn(e){const{children:t}=e,n=o.useRef([]),i=o.useCallback(e=>{n.current=[...n.current,e];},[]),r=o.useCallback(e=>{n.current=n.current.filter(t=>t!==e);},[]),a=o.useState(()=>Vn())[0];return o.createElement(Yn.Provider,{value:o.useMemo(()=>({nodesRef:n,addNode:i,removeNode:r,events:a}),[i,r,a])},t)}function Gn(e){return "data-floating-ui-"+e}function Qn(e){const t=useRef(e);return Tn(()=>{t.current=e;}),t}const Xn=Gn("safe-polygon");function Zn(e,t,n){return n&&!je(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let eo=0;function to(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:o=true,sync:i=false}=t;o&&cancelAnimationFrame(eo);const r=()=>null==e?void 0:e.focus({preventScroll:n});i?r():eo=requestAnimationFrame(r);}function no(e,t){let n=e.filter(e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)}),o=n;for(;o.length;)o=e.filter(e=>{var t;return null==(t=o)?void 0:t.some(t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)})}),n=n.concat(o);return n}let oo=new WeakMap,io=new WeakSet,ro={},ao=0;const so=e=>e&&(e.host||so(e.parentNode));function lo(e,t,n,o){const i="data-floating-ui-inert",r=o?"inert":n?"aria-hidden":null,a=((e,t)=>t.map(t=>{if(e.contains(t))return t;const n=so(t);return e.contains(n)?n:null}).filter(e=>null!=e))(t,e),s=new Set,l=new Set(a),c=[];ro[i]||(ro[i]=new WeakMap);const u=ro[i];return a.forEach(function e(t){if(!t||s.has(t))return;s.add(t),t.parentNode&&e(t.parentNode);}),function e(t){if(!t||l.has(t))return;[].forEach.call(t.children,t=>{if("script"!==se(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,o=(oo.get(t)||0)+1,a=(u.get(t)||0)+1;oo.set(t,o),u.set(t,a),c.push(t),1===o&&n&&io.add(t),1===a&&t.setAttribute(i,""),!n&&r&&t.setAttribute(r,"true");}});}(t),s.clear(),ao++,()=>{c.forEach(e=>{const t=(oo.get(e)||0)-1,n=(u.get(e)||0)-1;oo.set(e,t),u.set(e,n),t||(!io.has(e)&&r&&e.removeAttribute(r),io.delete(e)),n||e.removeAttribute(i);}),ao--,ao||(oo=new WeakMap,oo=new WeakMap,io=new WeakSet,ro={});}}function co(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const o=ze(e[0]).body;return lo(e.concat(Array.from(o.querySelectorAll("[aria-live]"))),o,t,n)}const uo=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function fo(e,t){const n=Ft(e,uo());"prev"===t&&n.reverse();const o=n.indexOf(Oe(ze(e)));return n.slice(o+1)[0]}function mo(e,t){const n=t||e.currentTarget,o=e.relatedTarget;return !o||!Le(n,o)}const po={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function ho(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const go=o.forwardRef(function(e,t){const[n,i]=o.useState();Tn(()=>(He()&&i("button"),document.addEventListener("keydown",ho),()=>{document.removeEventListener("keydown",ho);}),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Gn("focus-guard")]:"",style:po};return o.createElement("span",Bn({},e,r))}),vo=o.createContext(null),yo="data-floating-ui-focusable";function wo(e){return e?e.hasAttribute(yo)?e:e.querySelector("["+yo+"]")||e:null}let bo=[];function Co(e){bo=bo.filter(e=>e.isConnected);let t=e;if(t&&"body"!==se(t)){if(!function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==bt.call(e,yt)&&At(t,e)}(t,uo())){const e=Ft(t,uo())[0];e&&(t=e);}bo.push(t),bo.length>20&&(bo=bo.slice(-20));}}function ko(){return bo.slice().reverse().find(e=>e.isConnected)}const xo=o.forwardRef(function(e,t){return o.createElement("button",Bn({},e,{type:"button",ref:t,tabIndex:-1,style:po}))});function So(e){const{context:t,children:n,disabled:i=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:p,nodeId:h,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:C}}=t,k="number"==typeof s&&s<0,x=Ke(b)&&k,S="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,N=Qn(r),D=Qn(s),E=Qn(l),I=Kn(),M=o.useContext(vo),P=o.useRef(null),T=o.useRef(null),A=o.useRef(false),O=o.useRef(false),L=o.useRef(-1),F=null!=M,B=wo(C),R=yn(function(e){return void 0===e&&(e=B),e?Ft(e,uo()):[]}),_=yn(e=>{const t=R(e);return N.current.map(e=>b&&"reference"===e?b:B&&"floating"===e?B:t).filter(Boolean).flat()});function H(e){return !i&&d&&u?o.createElement(xo,{ref:"start"===e?P:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}o.useEffect(()=>{if(i)return;if(!u)return;function e(e){if("Tab"===e.key){Le(B,Oe(ze(B)))&&0===R().length&&!x&&Ue(e);const t=_(),n=We(e);"reference"===N.current[0]&&n===b&&(Ue(e),e.shiftKey?to(t[t.length-1]):to(t[1])),"floating"===N.current[1]&&n===B&&e.shiftKey&&(Ue(e),to(t[0]));}}const t=ze(B);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}},[i,b,B,u,N,x,R,_]),o.useEffect(()=>{if(!i&&C)return C.addEventListener("focusin",e),()=>{C.removeEventListener("focusin",e);};function e(e){const t=We(e),n=R().indexOf(t);-1!==n&&(L.current=n);}},[i,C,R]),o.useEffect(()=>{if(!i&&f)return C&&fe(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),C.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),C.removeEventListener("focusout",t);}):void 0;function e(){O.current=true,setTimeout(()=>{O.current=false;});}function t(e){const t=e.relatedTarget;queueMicrotask(()=>{const n=!(Le(b,t)||Le(C,t)||Le(t,C)||Le(null==M?void 0:M.portalNode,t)||null!=t&&t.hasAttribute(Gn("focus-guard"))||I&&(no(I.nodesRef.current,h).find(e=>{var n,o;return Le(null==(n=e.context)?void 0:n.elements.floating,t)||Le(null==(o=e.context)?void 0:o.elements.domReference,t)})||function(e,t){var n;let o=[],i=null==(n=e.find(e=>e.id===t))?void 0:n.parentId;for(;i;){const t=e.find(e=>e.id===i);i=null==t?void 0:t.parentId,t&&(o=o.concat(t));}return o}(I.nodesRef.current,h).find(e=>{var n,o;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(o=e.context)?void 0:o.elements.domReference)===t})));if(c&&n&&Oe(ze(B))===ze(B).body){fe(B)&&B.focus();const e=L.current,t=R(),n=t[e]||t[t.length-1]||B;fe(n)&&n.focus();}!x&&u||!t||!n||O.current||t===ko()||(A.current=true,g(false,e,"focus-out"));});}},[i,b,C,B,u,h,I,M,g,f,c,R,x]),o.useEffect(()=>{var e;if(i)return;const t=Array.from((null==M||null==(e=M.portalNode)?void 0:e.querySelectorAll("["+Gn("portal")+"]"))||[]);if(C){const e=[C,...t,P.current,T.current,N.current.includes("reference")||x?b:null].filter(e=>null!=e),n=u||x?co(e,S,!S):co(e);return ()=>{n();}}},[i,b,C,u,N,M,x,S]),Tn(()=>{if(i||!fe(B))return;const e=Oe(ze(B));queueMicrotask(()=>{const t=_(B),n=D.current,o=("number"==typeof n?t[n]:n.current)||B,i=Le(B,e);k||i||!m||to(o,{preventScroll:o===B});});},[i,m,B,k,_,D]),Tn(()=>{if(i||!B)return;let e=false;const t=ze(B),n=Oe(t);let o=y.current.openEvent;function r(t){let{open:n,reason:i,event:r,nested:a}=t;n&&(o=r),"escape-key"===i&&p.domReference.current&&Co(p.domReference.current),"hover"===i&&"mouseleave"===r.type&&(A.current=true),"outside-press"===i&&(a?(A.current=false,e=true):A.current=!(Re(r)||_e(r)));}Co(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,po),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=Oe(t),i=Le(C,n)||I&&no(I.nodesRef.current,h).some(e=>{var t;return Le(null==(t=e.context)?void 0:t.elements.floating,n)});(i||o&&["click","mousedown"].includes(o.type))&&p.domReference.current&&Co(p.domReference.current);const s="boolean"==typeof E.current?ko()||a:E.current.current||a;queueMicrotask(()=>{E.current&&!A.current&&fe(s)&&(s===n||n===t.body||i)&&s.focus({preventScroll:e}),a.remove();});}},[i,C,B,E,y,p,v,I,h,F,b]),o.useEffect(()=>{queueMicrotask(()=>{A.current=false;});},[i]),Tn(()=>{if(!i&&M)return M.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:p}),()=>{M.setFocusManagerState(null);}},[i,M,u,m,g,p,f]),Tn(()=>{if(i)return;if(!B)return;if("function"!=typeof MutationObserver)return;if(k)return;const e=()=>{const e=B.getAttribute("tabindex"),t=R(),n=Oe(ze(C)),o=t.indexOf(n);-1!==o&&(L.current=o),N.current.includes("floating")||n!==p.domReference.current&&0===t.length?"0"!==e&&B.setAttribute("tabindex","0"):"-1"!==e&&B.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(B,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}},[i,C,B,p,N,R,k]);const $=!i&&S&&(!u||!x)&&(F||u);return o.createElement(o.Fragment,null,$&&o.createElement(go,{"data-type":"inside",ref:null==M?void 0:M.beforeInsideRef,onFocus:e=>{if(u){const e=_();to("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(A.current=false,mo(e,M.portalNode)){const e=fo(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=M.beforeOutsideRef.current)||t.focus();}}}),!x&&H("start"),n,H("end"),$&&o.createElement(go,{"data-type":"inside",ref:null==M?void 0:M.afterInsideRef,onFocus:e=>{if(u)to(_()[0]);else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(f&&(A.current=true),mo(e,M.portalNode)){const e=fo(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=M.afterOutsideRef.current)||t.focus();}}}))}function No(e){return fe(e.target)&&"BUTTON"===e.target.tagName}function Do(e){return Ye(e)}const Eo={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},Io={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},Mo=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function Po(e){const{open:t=false,onOpenChange:n,elements:i}=e,r=$n(),a=o.useRef({}),[s]=o.useState(()=>Vn()),l=null!=Un();const[c,u]=o.useState(i.reference),d=yn((e,t,o)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:o,nested:l}),null==n||n(e,t,o);}),f=o.useMemo(()=>({setPositionReference:u}),[]),m=o.useMemo(()=>({reference:c||i.reference||null,floating:i.floating||null,domReference:i.reference}),[c,i.reference,i.floating]);return o.useMemo(()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f}),[t,d,m,s,r,f])}function To(e){ void 0===e&&(e={});const{nodeId:t}=e,n=Po({...e,elements:{reference:null,floating:null,...e.elements}}),i=e.rootContext||n,r=i.elements,[a,s]=o.useState(null),[l,c]=o.useState(null),u=(null==r?void 0:r.domReference)||a,d=o.useRef(null),f=Kn();Tn(()=>{u&&(d.current=u);},[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:i=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=o.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,p]=o.useState(i);cn(m,i)||p(i);const[h,g]=o.useState(null),[y,w]=o.useState(null),b=o.useCallback(e=>{e!==S.current&&(S.current=e,g(e));},[]),C=o.useCallback(e=>{e!==N.current&&(N.current=e,w(e));},[]),k=a||h,x=s||y,S=o.useRef(null),N=o.useRef(null),D=o.useRef(d),E=null!=c,I=fn(c),M=fn(r),P=fn(u),T=o.useCallback(()=>{if(!S.current||!N.current)return;const e={placement:t,strategy:n,middleware:m};M.current&&(e.platform=M.current),sn(S.current,N.current,e).then(e=>{const t={...e,isPositioned:false!==P.current};A.current&&!cn(D.current,t)&&(D.current=t,v.flushSync(()=>{f(t);}));});},[m,t,n,M,P]);ln(()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f(e=>({...e,isPositioned:false})));},[u]);const A=o.useRef(false);ln(()=>(A.current=true,()=>{A.current=false;}),[]),ln(()=>{if(k&&(S.current=k),x&&(N.current=x),k&&x){if(I.current)return I.current(k,x,T);T();}},[k,x,T,I,E]);const O=o.useMemo(()=>({reference:S,floating:N,setReference:b,setFloating:C}),[b,C]),L=o.useMemo(()=>({reference:k,floating:x}),[k,x]),F=o.useMemo(()=>{const e={position:n,left:0,top:0};if(!L.floating)return e;const t=dn(L.floating,d.x),o=dn(L.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+o+"px)",...un(L.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:o}},[n,l,L.floating,d.x,d.y]);return o.useMemo(()=>({...d,update:T,refs:O,elements:L,floatingStyles:F}),[d,T,O,L,F])}({...e,elements:{...r,...l&&{reference:l}}}),p=o.useCallback(e=>{const t=de(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);},[m.refs]),h=o.useCallback(e=>{(de(e)||null===e)&&(d.current=e,s(e)),(de(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!de(e))&&m.refs.setReference(e);},[m.refs]),g=o.useMemo(()=>({...m.refs,setReference:h,setPositionReference:p,domReference:d}),[m.refs,h,p]),y=o.useMemo(()=>({...m.elements,domReference:u}),[m.elements,u]),w=o.useMemo(()=>({...m,...i,refs:g,elements:y,nodeId:t}),[m,g,y,t,i]);return Tn(()=>{i.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find(e=>e.id===t);e&&(e.context=w);}),o.useMemo(()=>({...m,context:w,refs:g,elements:y}),[m,g,y,w])}const Ao="active",Oo="selected";function Lo(e,t,n){const o=new Map,i="item"===n;let r=e;if(i&&e){const{[Ao]:t,[Oo]:n,...o}=e;r=o;}return {..."floating"===n&&{tabIndex:-1,[yo]:""},...r,...t.map(t=>{const o=t?t[n]:null;return "function"==typeof o?e?o(e):null:o}).concat(e).reduce((e,t)=>t?(Object.entries(t).forEach(t=>{let[n,r]=t;var a;i&&[Ao,Oo].includes(n)||(0===n.indexOf("on")?(o.has(n)||o.set(n,[]),"function"==typeof r&&(null==(a=o.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,i=new Array(t),r=0;r<t;r++)i[r]=arguments[r];return null==(e=o.get(n))?void 0:e.map(e=>e(...i)).find(e=>void 0!==e)})):e[n]=r);}),e):e,{})}}let Fo=false;function Bo(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function Ro(e,t){return Bo(t,e===wn||e===bn,e===Cn||e===kn)}function _o(e,t,n){return Bo(t,e===bn,n?e===Cn:e===kn)||"Enter"===e||" "===e||""===e}function Ho(e,t,n){return Bo(t,n?e===kn:e===Cn,e===wn)}function $o(e,t){const{open:n,onOpenChange:i,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=()=>{},enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:p=false,virtual:h=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:C=1,scrollItemIntoView:k=true,virtualItemRef:x,itemSizes:S,dense:N=false}=t;const D=Qn(wo(r.floating)),E=Un(),I=Kn(),M=yn(l),P=Ke(r.domReference),T=o.useRef(g),A=o.useRef(null!=u?u:-1),O=o.useRef(null),L=o.useRef(true),F=o.useRef(M),B=o.useRef(!!r.floating),R=o.useRef(n),_=o.useRef(false),H=o.useRef(false),$=Qn(w),j=Qn(n),z=Qn(k),V=Qn(u),[W,Y]=o.useState(),[U,K]=o.useState(),J=yn(function(e,t,n){function o(e){h?(Y(e.id),null==I||I.events.emit("virtualfocus",e),x&&(x.current=e)):to(e,{preventScroll:true,sync:!(!Fe().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!He())&&(Fo||_.current)});} void 0===n&&(n=false);const i=e.current[t.current];i&&o(i),requestAnimationFrame(()=>{const r=e.current[t.current]||i;if(!r)return;i||o(r);const a=z.current;a&&G&&(n||!L.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));});});Tn(()=>{document.createElement("div").focus({get preventScroll(){return Fo=true,false}});},[]),Tn(()=>{c&&(n&&r.floating?T.current&&null!=u&&(H.current=true,A.current=u,M(u)):B.current&&(A.current=-1,F.current(null)));},[c,n,r.floating,u,M]),Tn(()=>{if(c&&n&&r.floating)if(null==s){if(_.current=false,null!=V.current)return;if(B.current&&(A.current=-1,J(a,A)),(!R.current||!B.current)&&T.current&&(null!=O.current||true===T.current&&null==O.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else A.current=null==O.current||_o(O.current,b,p)||m?Nn(a,$.current):Dn(a,$.current),O.current=null,M(A.current);};t();}}else Sn(a,s)||(A.current=s,J(a,A,H.current),H.current=false);},[c,n,r.floating,s,V,m,a,b,p,M,J,$]),Tn(()=>{var e;if(!c||r.floating||!I||h||!B.current)return;const t=I.nodesRef.current,n=null==(e=t.find(e=>e.id===E))||null==(e=e.context)?void 0:e.elements.floating,o=Oe(ze(r.floating)),i=t.some(e=>e.context&&Le(e.context.elements.floating,o));n&&!i&&L.current&&n.focus({preventScroll:true});},[c,r.floating,I,E,h]),Tn(()=>{if(c&&I&&h&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){K(e.id),x&&(x.current=e);}},[c,I,h,E,x]),Tn(()=>{F.current=M,B.current=!!r.floating;}),Tn(()=>{n||(O.current=null);},[n]),Tn(()=>{R.current=n;},[n]);const q=null!=s,G=o.useMemo(()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&M(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;L.current&&"touch"!==t&&(A.current=-1,J(a,A),M(null),h||to(D.current,{preventScroll:true}));}}}},[n,D,J,v,a,M,h]),Q=yn(e=>{if(L.current=false,_.current=true,229===e.which)return;if(!j.current&&e.currentTarget===D.current)return;if(m&&Ho(e.key,b,p))return Ue(e),i(false,e.nativeEvent,"list-navigation"),void(fe(r.domReference)&&(h?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=A.current,o=Nn(a,w),s=Dn(a,w);if(P||("Home"===e.key&&(Ue(e),A.current=o,M(A.current)),"End"===e.key&&(Ue(e),A.current=s,M(A.current))),C>1){const t=S||Array.from({length:a.current.length},()=>({width:1,height:1})),n=function(e,t,n){const o=[];let i=0;return e.forEach((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(i=0);!l;){const e=[];for(let n=0;n<a;n++)for(let o=0;o<s;o++)e.push(i+n+o*t);i%t+a<=t&&e.every(e=>null==o[e])?(e.forEach(e=>{o[e]=r;}),l=true):i++;}}),[...o]}(t,C,N),i=n.findIndex(e=>null!=e&&!Pn(a.current,e,w)),r=n.reduce((e,t,n)=>null==t||Pn(a.current,t,w)?e:n,-1),l=n[function(e,t){let{event:n,orientation:o,loop:i,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===wn){if(d&&Ue(n),-1===u)f=c;else if(f=En(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),i&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}Sn(e,f)&&(f=u);}if(n.key===bn&&(d&&Ue(n),-1===u?f=l:(f=En(e,{startingIndex:u,amount:a,disabledIndices:s}),i&&u+a>c&&(f=En(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Sn(e,f)&&(f=u)),"both"===o){const t=Qe(u/a);n.key===(r?Cn:kn)&&(d&&Ue(n),u%a!==a-1?(f=En(e,{startingIndex:u,disabledIndices:s}),i&&xn(f,a,t)&&(f=En(e,{startingIndex:u-u%a-1,disabledIndices:s}))):i&&(f=En(e,{startingIndex:u-u%a-1,disabledIndices:s})),xn(f,a,t)&&(f=u)),n.key===(r?kn:Cn)&&(d&&Ue(n),u%a!==0?(f=En(e,{startingIndex:u,decrement:true,disabledIndices:s}),i&&xn(f,a,t)&&(f=En(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):i&&(f=En(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),xn(f,a,t)&&(f=u));const o=Qe(c/a)===t;Sn(e,f)&&(f=i&&o?n.key===(r?kn:Cn)?c:En(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map(e=>null!=e?a.current[e]:null)},{event:e,orientation:b,loop:f,rtl:p,cols:C,disabledIndices:Mn([...w||a.current.map((e,t)=>Pn(a.current,t)?t:void 0),void 0],n),minIndex:i,maxIndex:r,prevIndex:In(A.current>s?o:A.current,t,n,C,e.key===bn?"bl":e.key===(p?Cn:kn)?"tr":"tl"),stopEvent:true})];if(null!=l&&(A.current=l,M(A.current)),"both"===b)return}if(Ro(e.key,b)){if(Ue(e),n&&!h&&Oe(e.currentTarget.ownerDocument)===e.currentTarget)return A.current=_o(e.key,b,p)?o:s,void M(A.current);_o(e.key,b,p)?A.current=f?t>=s?d&&t!==a.current.length?-1:o:En(a,{startingIndex:t,disabledIndices:w}):Math.min(s,En(a,{startingIndex:t,disabledIndices:w})):A.current=f?t<=o?d&&-1!==t?a.current.length:s:En(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(o,En(a,{startingIndex:t,decrement:true,disabledIndices:w})),Sn(a,A.current)?M(null):M(A.current);}}),X=o.useMemo(()=>h&&n&&q&&{"aria-activedescendant":U||W},[h,n,q,U,W]),Z=o.useMemo(()=>({"aria-orientation":"both"===b?void 0:b,...!Ke(r.domReference)&&X,onKeyDown:Q,onPointerMove(){L.current=true;}}),[X,Q,r.domReference,b]),ee=o.useMemo(()=>{function e(e){"auto"===g&&Re(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){L.current=false;const t=e.key.startsWith("Arrow"),o=["Home","End"].includes(e.key),r=t||o,s=function(e,t,n){return Bo(t,n?e===Cn:e===kn,e===bn)}(e.key,b,p),l=Ho(e.key,b,p),c=Ro(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(h&&n){const t=null==I?void 0:I.nodesRef.current.find(e=>null==e.parentId),n=I&&t?function(e,t){let n,o=-1;return function t(i,r){r>o&&(n=i,o=r),no(e,i).forEach(e=>{t(e.id,r+1);});}(t,0),e.find(e=>e.id===n)}(I.nodesRef.current,t.id):null;if(r&&n&&x){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const o=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,i=l&&!o?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find(e=>(null==e?void 0:e.id)===W):null;i&&(Ue(e),i.dispatchEvent(t),K(void 0));}var v;if((c||o)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ue(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(O.current=m&&c?null:e.key),m?s&&(Ue(e),n?(A.current=Nn(a,$.current),M(A.current)):i(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(A.current=u),Ue(e),!n&&y?i(true,e.nativeEvent,"list-navigation"):Q(e),n&&M(A.current)));},onFocus(){n&&!h&&M(null);},onPointerDown:function(e){T.current=g,"auto"===g&&_e(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}},[W,X,Q,$,g,a,m,M,i,n,y,b,p,u,I,h,x]);return o.useMemo(()=>c?{reference:ee,floating:Z,item:G}:{},[c,ee,Z,G])}const jo=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function zo(e,t){const[n,o]=e;let i=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=o!=c>=o&&n<=(l-r)*(o-s)/(c-s)+r&&(i=!i);}return i}function Vo(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:o=true}=e;let i,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:p}=e;return function(e){function h(){clearTimeout(i),f();}if(clearTimeout(i),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=We(e),b="mouseleave"===e.type,C=Le(d.floating,w),k=Le(d.domReference,w),x=d.domReference.getBoundingClientRect(),S=d.floating.getBoundingClientRect(),N=u.split("-")[0],D=n>S.right-S.width/2,E=c>S.bottom-S.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,x),M=S.width>x.width,P=S.height>x.height,T=(M?x:S).left,A=(M?x:S).right,O=(P?x:S).top,L=(P?x:S).bottom;if(C&&(r=true,!b))return;if(k&&(r=false),k&&!b)return void(r=true);if(b&&de(e.relatedTarget)&&Le(d.floating,e.relatedTarget))return;if(p&&no(p.nodesRef.current,m).some(e=>{let{context:t}=e;return null==t?void 0:t.open}))return;if("top"===N&&c>=x.bottom-1||"bottom"===N&&c<=x.top+1||"left"===N&&n>=x.right-1||"right"===N&&n<=x.left+1)return h();let F=[];switch(N){case "top":F=[[T,x.top+1],[T,S.bottom-1],[A,S.bottom-1],[A,x.top+1]];break;case "bottom":F=[[T,S.top+1],[T,x.bottom-1],[A,x.bottom-1],[A,S.top+1]];break;case "left":F=[[S.right-1,L],[S.right-1,O],[x.left+1,O],[x.left+1,L]];break;case "right":F=[[x.right-1,L],[x.right-1,O],[S.left+1,O],[S.left+1,L]];}if(!zo([g,v],F)){if(r&&!I)return h();if(!b&&o){const t=function(e,t){const n=performance.now(),o=n-l;if(null===a||null===s||0===o)return a=e,s=t,l=n,null;const i=e-a,r=t-s,c=Math.sqrt(i*i+r*r);return a=e,s=t,l=n,c/o}(e.clientX,e.clientY);if(null!==t&&t<.1)return h()}zo([g,v],function(e){let[n,o]=e;switch(N){case "top":return [[M?n+t/2:D?n+4*t:n-4*t,o+t+1],[M?n-t/2:D?n+4*t:n-4*t,o+t+1],...[[S.left,D||M?S.bottom-t:S.top],[S.right,D?M?S.bottom-t:S.top:S.bottom-t]]];case "bottom":return [[M?n+t/2:D?n+4*t:n-4*t,o-t],[M?n-t/2:D?n+4*t:n-4*t,o-t],...[[S.left,D||M?S.top+t:S.bottom],[S.right,D?M?S.top+t:S.bottom:S.top+t]]];case "left":{const e=[n+t+1,P?o+t/2:E?o+4*t:o-4*t],i=[n+t+1,P?o-t/2:E?o+4*t:o-4*t];return [...[[E||P?S.right-t:S.left,S.top],[E?P?S.right-t:S.left:S.right-t,S.bottom]],e,i]}case "right":return [[n-t,P?o+t/2:E?o+4*t:o-4*t],[n-t,P?o-t/2:E?o+4*t:o-4*t],...[[E||P?S.left+t:S.right,S.top],[E?P?S.left+t:S.right:S.left+t,S.bottom]]]}}([n,c]))?!r&&o&&(i=window.setTimeout(h,40)):h();}}};return c.__options={blockPointerEvents:n},c}const Wo=createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),Yo=forwardRef(({className:t,disabled:n,children:o,...i},r)=>{const a=useContext(Wo),s=Fn(),c=Kn(),u=s.index===a.activeIndex,d=x("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:hn([s.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,"aria-disabled":n,...i,...a.getItemProps({onClick(e){if(n)return e.preventDefault(),void e.stopPropagation();i.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){n||(i.onFocus?.(e),a.setHasFocusInside(true));}}),children:o})});Yo.displayName="DropdownMenuItem";const Uo=forwardRef(({className:n,variant:i="default",icon:r,iconRight:a,text:s="",disabled:m,children:p,...h},g)=>{const[v,y]=useState(false),[w,b]=useState(false),[C,k]=useState(null),S=useRef([]),N=useRef([]),D=useContext(Wo),E=Kn(),I=function(){const e=$n(),t=Kn(),n=Un();return Tn(()=>{const o={id:e,parentId:n};return null==t||t.addNode(o),()=>{null==t||t.removeNode(o);}},[t,e,n]),e}(),M=Un(),P=Fn(),T=null!=M,{floatingStyles:O,refs:L,context:F}=To({nodeId:I,open:v,onOpenChange:y,placement:T?"right-start":"bottom-start",middleware:[(B={mainAxis:T?0:4,alignmentAxis:T?-4:0},{...on(B),options:[B,R]}),pn(),mn()],whileElementsMounted:nn});var B,R;const _=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,p=Kn(),h=Un(),g=Qn(u),v=Qn(c),y=Qn(n),w=o.useRef(),b=o.useRef(-1),C=o.useRef(),k=o.useRef(-1),x=o.useRef(true),S=o.useRef(false),N=o.useRef(()=>{}),D=o.useRef(false),E=o.useCallback(()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[r]);o.useEffect(()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(k.current),x.current=true,D.current=false);}},[l,a]),o.useEffect(()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&i(false,e,"hover");}const t=ze(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}},[s.floating,n,i,l,g,E]);const I=o.useCallback(function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const o=Zn(v.current,"close",w.current);o&&!C.current?(clearTimeout(b.current),b.current=window.setTimeout(()=>i(false,e,n),o)):t&&(clearTimeout(b.current),i(false,e,n));},[v,i]),M=yn(()=>{N.current(),C.current=void 0;}),P=yn(()=>{if(S.current){const e=ze(s.floating).body;e.style.pointerEvents="",e.removeAttribute(Xn),S.current=false;}}),T=yn(()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type));o.useEffect(()=>{if(l&&de(s.domReference)){var e;const i=s.domReference;return n&&i.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&i.addEventListener("mousemove",t,{once:true}),i.addEventListener("mouseenter",t),i.addEventListener("mouseleave",o),()=>{var e;n&&i.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&i.removeEventListener("mousemove",t),i.removeEventListener("mouseenter",t),i.removeEventListener("mouseleave",o);}}function t(e){if(clearTimeout(b.current),x.current=false,d&&!je(w.current)||f>0&&!Zn(v.current,"open"))return;const t=Zn(v.current,"open",w.current);t?b.current=window.setTimeout(()=>{y.current||i(true,e,"hover");},t):n||i(true,e,"hover");}function o(e){if(T())return;N.current();const t=ze(s.floating);if(clearTimeout(k.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),C.current=g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){P(),M(),T()||I(e,true,"safe-polygon");}});const o=C.current;return t.addEventListener("mousemove",o),void(N.current=()=>{t.removeEventListener("mousemove",o);})}("touch"!==w.current||!Le(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){P(),M(),T()||I(e);}})(e));}},[s,l,e,d,f,m,I,M,P,i,n,y,p,v,g,r,T]),Tn(()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){S.current=true;const e=s.floating;if(de(s.domReference)&&e){var t;const n=ze(s.floating).body;n.setAttribute(Xn,"");const o=s.domReference,i=null==p||null==(t=p.nodesRef.current.find(e=>e.id===h))||null==(t=t.context)?void 0:t.elements.floating;return i&&(i.style.pointerEvents=""),n.style.pointerEvents="none",o.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",o.style.pointerEvents="",e.style.pointerEvents="";}}}},[l,n,h,s,p,g,E]),Tn(()=>{n||(w.current=void 0,D.current=false,M(),P());},[n,M,P]),o.useEffect(()=>()=>{M(),clearTimeout(b.current),clearTimeout(k.current),P();},[l,s.domReference,M,P]);const A=o.useMemo(()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function o(){x.current||y.current||i(true,t,"hover");}d&&!je(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(k.current),"touch"===w.current?o():(D.current=true,k.current=window.setTimeout(o,f)));}}},[d,i,n,y,f]),O=o.useMemo(()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}}),[I,T]);return o.useMemo(()=>l?{reference:A,floating:O}:{},[l,A,O])}(F,{enabled:T,delay:{open:75},handleClose:Vo({blockPointerEvents:true})}),H=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=o.useRef(),p=o.useRef(false),h=o.useMemo(()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),i(true,e.nativeEvent,"click")):i(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?i(true,e.nativeEvent,"click"):i(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||No(e)||(" "!==e.key||Do(a)||(e.preventDefault(),p.current=true),"Enter"===e.key&&i(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||No(e)||Do(a)||" "===e.key&&p.current&&(p.current=false,i(!n||!c,e.nativeEvent,"click"));}}),[r,a,l,u,d,i,n,f,c]);return o.useMemo(()=>s?{reference:h}:{},[s,h])}(F,{event:"mousedown",toggle:!T,ignoreMouse:T}),$=function(e,t){var n;void 0===t&&(t={});const{open:i,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=jo.get(s))?n:s,c=$n(),u=null!=Un(),d=o.useMemo(()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:i?r:void 0}:{"aria-expanded":i?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":i?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}},[l,r,u,i,c,s]),f=o.useMemo(()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}},[l,r,c,s]),m=o.useCallback(e=>{let{active:t,selected:n}=e;const o={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...o,"aria-selected":t&&n};case "combobox":return {...o,...t&&{"aria-selected":true}}}return {}},[r,s]);return o.useMemo(()=>a?{reference:d,floating:f,item:m}:{},[a,d,f,m])}(F,{role:"menu"}),j=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:p,capture:h}=t,g=Kn(),v=yn("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=o.useRef(false),b=o.useRef(false),{escapeKey:C,outsidePress:k}=Mo(p),{escapeKey:x,outsidePress:S}=Mo(h),N=o.useRef(false),D=yn(e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(N.current)return;const o=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?no(g.nodesRef.current,o):[];if(!C&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);}),!e)return}i(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");}),E=yn(e=>{var t;const n=()=>{var t;D(e),null==(t=We(e))||t.removeEventListener("keydown",n);};null==(t=We(e))||t.addEventListener("keydown",n);}),I=yn(e=>{var t;const n=w.current;w.current=false;const o=b.current;if(b.current=false,"click"===u&&o)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=We(e),l="["+Gn("inert")+"]",c=ze(r.floating).querySelectorAll(l);let d=de(s)?s:null;for(;d&&!De(d);){const e=Me(d);if(De(e)||!de(e))break;d=e;}if(c.length&&de(s)&&!s.matches("html,body")&&!Le(s,r.floating)&&Array.from(c).every(e=>!Le(d,e)))return;if(fe(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let o=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===Ee(s).direction&&(o=e.offsetX<=s.offsetWidth-s.clientWidth),o||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&no(g.nodesRef.current,f).some(t=>{var n;return Ve(e,null==(n=t.context)?void 0:n.elements.floating)});if(Ve(e,r.floating)||Ve(e,r.domReference)||m)return;const p=g?no(g.nodesRef.current,f):[];if(p.length>0){let e=true;if(p.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);}),!e)return}i(false,e,"outside-press");}),M=yn(e=>{var t;const n=()=>{var t;I(e),null==(t=We(e))||t.removeEventListener(u,n);};null==(t=We(e))||t.addEventListener(u,n);});o.useEffect(()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=C,a.current.__outsidePressBubbles=k;let e=-1;function t(e){i(false,e,"ancestor-scroll");}function o(){window.clearTimeout(e),N.current=true;}function c(){e=window.setTimeout(()=>{N.current=false;},Se()?5:0);}const d=ze(r.floating);l&&(d.addEventListener("keydown",x?E:D,x),d.addEventListener("compositionstart",o),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,S?M:I,S);let f=[];return m&&(de(r.domReference)&&(f=Te(r.domReference)),de(r.floating)&&(f=f.concat(Te(r.floating))),!de(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(Te(r.reference.contextElement)))),f=f.filter(e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)}),f.forEach(e=>{e.addEventListener("scroll",t,{passive:true});}),()=>{l&&(d.removeEventListener("keydown",x?E:D,x),d.removeEventListener("compositionstart",o),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,S?M:I,S),f.forEach(e=>{e.removeEventListener("scroll",t);}),window.clearTimeout(e);}},[a,r,l,y,u,n,i,m,s,C,k,D,x,E,I,S,M]),o.useEffect(()=>{w.current=false;},[y,u]);const P=o.useMemo(()=>({onKeyDown:D,[Eo[f]]:e=>{d&&i(false,e.nativeEvent,"reference-press");}}),[D,i,d,f]),T=o.useMemo(()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[Io[u]]:()=>{w.current=true;}}),[D,u]);return o.useMemo(()=>s?{reference:P,floating:T}:{},[s,P,T])}(F,{bubbles:true}),z=$o(F,{listRef:S,activeIndex:C,nested:T,onNavigate:k}),{getReferenceProps:V,getFloatingProps:W,getItemProps:Y}=function(e){ void 0===e&&(e=[]);const t=e.map(e=>null==e?void 0:e.reference),n=e.map(e=>null==e?void 0:e.floating),i=e.map(e=>null==e?void 0:e.item),r=o.useCallback(t=>Lo(t,e,"reference"),t),a=o.useCallback(t=>Lo(t,e,"floating"),n),s=o.useCallback(t=>Lo(t,e,"item"),i);return o.useMemo(()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s}),[r,a,s])}([_,H,$,j,z]);useEffect(()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}},[E,I,M]),useEffect(()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});},[E,v,I,M]);const U={activeIndex:C,setActiveIndex:k,getItemProps:Y,setHasFocusInside:b,isOpen:v,setIsOpen:y},K=useMemo(()=>U,[C,k,Y,b,v]),J=x("io-dropdown-menu-button",T&&"io-dropdown-menu-item",v&&!T&&"active",n),q=hn([L.setReference,P.ref,g]),G=D.activeIndex===P.index?0:-1;return jsxRuntimeExports.jsxs(Jn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:J,ref:q,variant:T?"link":i,tabIndex:T?G:void 0,role:T?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":T?"":void 0,"data-focus-inside":w?"":void 0,text:s,icon:T?"chevron-right":r,iconSize:"10",iconRight:!!T||a,disabled:m,...V(D.getItemProps({onFocus(e){h.onFocus?.(e),b(false),D.setHasFocusInside(true);},...h}))}),jsxRuntimeExports.jsx(Wo.Provider,{value:K,children:jsxRuntimeExports.jsx(Ln,{elementsRef:S,labelsRef:N,children:v&&jsxRuntimeExports.jsx(So,{context:F,modal:false,initialFocus:T?-1:0,returnFocus:!T,children:jsxRuntimeExports.jsx("div",{ref:L.setFloating,className:"io-dropdown-menu",style:O,...W(),children:p})})})})]})});Uo.displayName="DropdownMenu";const Ko=forwardRef(({...t},n)=>null===Un()?jsxRuntimeExports.jsx(qn,{children:jsxRuntimeExports.jsx(Uo,{ref:n,...t})}):jsxRuntimeExports.jsx(Uo,{ref:n,...t}));function qo({className:n,size:o="large",variant:i="default",align:r="up",text:a,...s}){const l=x("io-loader",{[`io-loader-${i}`]:"default"!==i},"normal"===o&&"io-loader-md","small"===o&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,role:"status","aria-live":"polite",...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Go({className:t,children:n,...o}){const i=x("io-panel-header",t);return jsxRuntimeExports.jsx(ee,{className:i,...o,children:n})}Ko.displayName="DropdownMenu",Ko.Item=Yo,Ko.Separator=q,Go.Title=M,Go.ButtonGroup=Z,Go.Button=A,Go.ButtonIcon=N,Go.Dropdown=X;const Qo=forwardRef(({className:t,children:n,...o},i)=>{const r=x("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:i,"data-testid":"panel-body",...o,children:n})});function Xo({className:t,...n}){const o=x("io-panel-footer",t);return jsxRuntimeExports.jsx(oe,{className:o,...n})}function Zo({className:t,children:n,...o}){const i=x("io-panel",t);return jsxRuntimeExports.jsx("div",{className:i,"data-testid":"panel",...o,children:n})}function ei({className:t,variant:n="default",children:o,...i}){const r=x("io-pill","default"!==n&&[`io-pill-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,role:"status",...i,children:o})}function ti({className:t,variant:n="active",value:o=0,...i}){const r=x("io-progress",n,t);let a;return a=o<0?0:o>100?100:o,jsxRuntimeExports.jsx("div",{className:r,role:"progressbar","aria-valuenow":a,"aria-valuemin":0,"aria-valuemax":100,...i,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${a}%`}})})}
/*!
 * OverlayScrollbars
 * Version: 2.12.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */Qo.displayName="PanelBody",Xo.ButtonGroup=Z,Xo.Button=A,Xo.ButtonIcon=N,Xo.Dropdown=X,Zo.Header=Go,Zo.Body=Qo,Zo.Footer=Xo,ei.Icon=S;const ni=(e,t)=>{const{o:n,i:o,u:i}=e;let r,a=n;const s=(e,t)=>{const n=a,s=e,l=t||(o?!o(n,s):n!==s);return (l||i)&&(a=s,r=n),[a,l,r]};return [t?e=>s(t(a,r),e):s,e=>[a,!!e,r]]},oi="undefined"!=typeof window&&"undefined"!=typeof HTMLElement&&!!window.document?window:{},ii=Math.max,ri=Math.min,ai=Math.round,si=Math.abs,li=Math.sign,ci=oi.cancelAnimationFrame,ui=oi.requestAnimationFrame,di=oi.setTimeout,fi=oi.clearTimeout,mi=e=>void 0!==oi[e]?oi[e]:void 0,pi=mi("MutationObserver"),hi=mi("IntersectionObserver"),gi=mi("ResizeObserver"),vi=mi("ScrollTimeline"),yi=e=>void 0===e,wi=e=>null===e,bi=e=>"number"==typeof e,Ci=e=>"string"==typeof e,ki=e=>"boolean"==typeof e,xi=e=>"function"==typeof e,Si=e=>Array.isArray(e),Ni=e=>"object"==typeof e&&!Si(e)&&!wi(e),Di=e=>{const t=!!e&&e.length,n=bi(t)&&t>-1&&t%1==0;return !!(Si(e)||!xi(e)&&n)&&(!(t>0&&Ni(e))||t-1 in e)},Ei=e=>!!e&&e.constructor===Object,Ii=e=>e instanceof HTMLElement,Mi=e=>e instanceof Element;function Pi(e,t){if(Di(e))for(let n=0;n<e.length&&false!==t(e[n],n,e);n++);else e&&Pi(Object.keys(e),n=>t(e[n],n,e));return e}const Ti=(e,t)=>e.indexOf(t)>=0,Ai=(e,t)=>e.concat(t),Oi=(e,t,n)=>(!Ci(t)&&Di(t)?Array.prototype.push.apply(e,t):e.push(t),e),Li=e=>Array.from(e||[]),Fi=e=>Si(e)?e:!Ci(e)&&Di(e)?Li(e):[e],Bi=e=>!!e&&!e.length,Ri=e=>Li(new Set(e)),_i=(e,t,n)=>{Pi(e,e=>!e||e.apply(void 0,t||[])),n||(e.length=0);},Hi="paddingTop",$i="paddingRight",ji="paddingLeft",zi="paddingBottom",Vi="marginLeft",Wi="marginRight",Yi="marginBottom",Ui="overflowX",Ki="overflowY",Ji="width",qi="height",Gi="visible",Qi="hidden",Xi="scroll",Zi=(e,t,n,o)=>{if(e&&t){let o=true;return Pi(n,n=>{e[n]!==t[n]&&(o=false);}),o}return  false},er=(e,t)=>Zi(e,t,["w","h"]),tr=(e,t)=>Zi(e,t,["x","y"]),nr=(e,t)=>Zi(e,t,["t","r","b","l"]),or=(e,...t)=>e.bind(0,...t),ir=e=>{let t;const n=e?di:ui,o=e?fi:ci;return [i=>{o(t),t=n(()=>i(),xi(e)?e():e);},()=>o(t)]},rr=e=>{const t=xi(e)?e():e;if(bi(t)){const e=t?di:ui,n=t?fi:ci;return o=>{const i=e(()=>o(),t);return ()=>{n(i);}}}return t&&t._},ar=(e,t)=>{const{p:n,v:o,S:i,m:r}=t||{};let a,s,l,c;const u=function(t){s&&s(),a&&a(),c=s=a=l=void 0,e.apply(this,t);},d=e=>r&&l?r(l,e):e,f=()=>{s&&l&&u(d(l)||l);},m=function(){const e=Li(arguments),t=rr(n);if(t){const n=rr(o),r=d(e)||e,m=u.bind(0,r);s&&s(),i&&!c?(m(),c=true,s=t(()=>c=void 0)):(s=t(m),n&&!a&&(a=n(f))),l=r;}else u(e);};return m.O=f,m},sr=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),lr=e=>e?Object.keys(e):[],cr=(e,t,n,o,i,r,a)=>{const s=[t,n,o,i,r,a];return "object"==typeof e&&!wi(e)||xi(e)||(e={}),Pi(s,t=>{Pi(t,(n,o)=>{const i=t[o];if(e===i)return  true;const r=Si(i);if(i&&Ei(i)){const t=e[o];let n=t;r&&!Si(t)?n=[]:r||Ei(t)||(n={}),e[o]=cr(n,i);}else e[o]=r?i.slice():i;});}),e},ur=(e,t)=>Pi(cr({},e),(e,t,n)=>{ void 0===e?delete n[t]:e&&Ei(e)&&(n[t]=ur(e));}),dr=e=>!lr(e).length,fr=()=>{},mr=(e,t,n)=>ii(e,ri(t,n)),pr=e=>Ri((Si(e)?e:(e||"").split(" ")).filter(e=>e)),hr=(e,t)=>e&&e.getAttribute(t),gr=(e,t)=>e&&e.hasAttribute(t),vr=(e,t,n)=>{Pi(pr(t),t=>{e&&e.setAttribute(t,String(n||""));});},yr=(e,t)=>{Pi(pr(t),t=>e&&e.removeAttribute(t));},wr=(e,t)=>{const n=pr(hr(e,t)),o=or(vr,e,t),i=(e,t)=>{const o=new Set(n);return Pi(pr(e),e=>{o[t](e);}),Li(o).join(" ")};return {C:e=>o(i(e,"delete")),$:e=>o(i(e,"add")),H:e=>{const t=pr(e);return t.reduce((e,t)=>e&&n.includes(t),t.length>0)}}},br=(e,t,n)=>(wr(e,t).C(n),or(Cr,e,t,n)),Cr=(e,t,n)=>(wr(e,t).$(n),or(br,e,t,n)),kr=(e,t,n,o)=>(o?Cr:br)(e,t,n),xr=(e,t,n)=>wr(e,t).H(n),Sr=e=>wr(e,"class"),Nr=(e,t)=>{Sr(e).C(t);},Dr=(e,t)=>(Sr(e).$(t),or(Nr,e,t)),Er=(e,t)=>{const n=t?Mi(t)&&t:document;return n?Li(n.querySelectorAll(e)):[]},Ir=(e,t)=>Mi(e)&&e.matches(t),Mr=e=>Ir(e,"body"),Pr=e=>e?Li(e.childNodes):[],Tr=e=>e&&e.parentElement,Ar=(e,t)=>Mi(e)&&e.closest(t),Or=e=>document.activeElement,Lr=(e,t,n)=>{const o=Ar(e,t),i=e&&((e,t)=>{const n=t?Mi(t)&&t:document;return n&&n.querySelector(e)})(n,o),r=Ar(i,t)===o;return !(!o||!i)&&(o===e||i===e||r&&Ar(Ar(e,n),t)!==o)},Fr=e=>{Pi(Fi(e),e=>{const t=Tr(e);e&&t&&t.removeChild(e);});},Br=(e,t)=>or(Fr,e&&t&&Pi(Fi(t),t=>{t&&e.appendChild(t);}));let Rr;const _r=e=>{const t=document.createElement("div");return vr(t,"class",e),t},Hr=e=>{const t=_r(),n=Rr,o=e.trim();return t.innerHTML=n?n.createHTML(o):o,Pi(Pr(t),e=>Fr(e))},$r=(e,t)=>e.getPropertyValue(t)||e[t]||"",jr=e=>{const t=e||0;return isFinite(t)?t:0},zr=e=>jr(parseFloat(e||"")),Vr=e=>Math.round(1e4*e)/1e4,Wr=e=>`${Vr(jr(e))}px`;function Yr(e,t){e&&t&&Pi(t,(t,n)=>{try{const o=e.style,i=wi(t)||ki(t)?"":bi(t)?Wr(t):t;0===n.indexOf("--")?o.setProperty(n,i):o[n]=i;}catch(e){}});}function Ur(e,t,n){const o=Ci(t);let i=o?"":{};if(e){const r=oi.getComputedStyle(e,n)||e.style;i=o?$r(r,t):Li(t).reduce((e,t)=>(e[t]=$r(r,t),e),i);}return i}const Kr=(e,t,n)=>{const o=t?`${t}-`:"",i=n?`-${n}`:"",r=`${o}top${i}`,a=`${o}right${i}`,s=`${o}bottom${i}`,l=`${o}left${i}`,c=Ur(e,[r,a,s,l]);return {t:zr(c[r]),r:zr(c[a]),b:zr(c[s]),l:zr(c[l])}},Jr=(e,t)=>"translate"+(Ni(e)?`(${e.x},${e.y})`:`${t?"X":"Y"}(${e})`),qr={w:0,h:0},Gr=(e,t)=>t?{w:t[`${e}Width`],h:t[`${e}Height`]}:qr,Qr=e=>Gr("inner",e||oi),Xr=or(Gr,"offset"),Zr=or(Gr,"client"),ea=or(Gr,"scroll"),ta=e=>{const t=parseFloat(Ur(e,Ji))||0,n=parseFloat(Ur(e,qi))||0;return {w:t-ai(t),h:n-ai(n)}},na=e=>e.getBoundingClientRect(),oa=e=>!(!e||!e[qi]&&!e[Ji]),ia=(e,t)=>{const n=oa(e);return !oa(t)&&n},ra=(e,t,n,o)=>{Pi(pr(t),t=>{e&&e.removeEventListener(t,n,o);});},aa=(e,t,n,o)=>{var i;const r=null==(i=o&&o.T)||i,a=o&&o.I||false,s=o&&o.A||false,l={passive:r,capture:a};return or(_i,pr(t).map(t=>{const o=s?i=>{ra(e,t,o,a),n&&n(i);}:n;return e&&e.addEventListener(t,o,l),or(ra,e,t,o,a)}))},sa=e=>e.stopPropagation(),la=e=>e.preventDefault(),ca=e=>sa(e)||la(e),ua=(e,t)=>{const{x:n,y:o}=bi(t)?{x:t,y:t}:t||{};bi(n)&&(e.scrollLeft=n),bi(o)&&(e.scrollTop=o);},da=e=>({x:e.scrollLeft,y:e.scrollTop}),fa=(e,t)=>{const{D:n,M:o}=e,{w:i,h:r}=t,a=(e,t,n)=>{let o=li(e)*n,i=li(t)*n;if(o===i){const n=si(e),r=si(t);i=n>r?0:i,o=n<r?0:o;}return o=o===i?0:o,[o+0,i+0]},[s,l]=a(n.x,o.x,i),[c,u]=a(n.y,o.y,r);return {D:{x:s,y:c},M:{x:l,y:u}}},ma=({D:e,M:t})=>{const n=(e,t)=>0===e&&e<=t;return {x:n(e.x,t.x),y:n(e.y,t.y)}},pa=({D:e,M:t},n)=>{const o=(e,t,n)=>mr(0,1,(e-n)/(e-t)||0);return {x:o(e.x,t.x,n.x),y:o(e.y,t.y,n.y)}},ha=e=>{e&&e.focus&&e.focus({preventScroll:true});},ga=(e,t)=>{Pi(Fi(t),e);},va=e=>{const t=new Map,n=(e,n)=>{if(e){const o=t.get(e);ga(e=>{o&&o[e?"delete":"clear"](e);},n);}else t.forEach(e=>{e.clear();}),t.clear();},o=(e,i)=>{if(Ci(e)){const o=t.get(e)||new Set;return t.set(e,o),ga(e=>{xi(e)&&o.add(e);},i),or(n,e,i)}ki(i)&&i&&n();const r=lr(e),a=[];return Pi(r,t=>{const n=e[t];n&&Oi(a,o(t,n));}),or(_i,a)};return o(e||{}),[o,n,(e,n)=>{Pi(Li(t.get(e)),e=>{n&&!Bi(n)?e.apply(0,n):e();});}]},ya={},wa={},ba=(e,t,n)=>lr(e).map(o=>{const{static:i,instance:r}=e[o],[a,s,l]=n||[],c=n?r:i;if(c){const e=n?c(a,s,t):c(t);return (l||wa)[o]=e}}),Ca=e=>wa[e],ka="data-overlayscrollbars",xa="os-environment",Sa=`${xa}-scrollbar-hidden`,Na=`${ka}-initialize`,Da="noClipping",Ea=`${ka}-body`,Ia=ka,Ma=`${ka}-viewport`,Pa=Ui,Ta=Ki,Aa="measuring",Oa="scrollbarHidden",La=`${ka}-padding`,Fa=`${ka}-content`,Ba="os-size-observer",Ra=`${Ba}-appear`,_a=`${Ba}-listener`,Ha="os-scrollbar",$a=`${Ha}-rtl`,ja=`${Ha}-horizontal`,za=`${Ha}-vertical`,Va=`${Ha}-track`,Wa=`${Ha}-handle`,Ya=`${Ha}-visible`,Ua=`${Ha}-cornerless`,Ka=`${Ha}-interaction`,Ja=`${Ha}-unusable`,qa=`${Ha}-auto-hide`,Ga=`${qa}-hidden`,Qa=`${Ha}-wheel`,Xa=`${Va}-interactive`,Za=`${Wa}-interactive`,es=e=>0===e.indexOf(Gi),ts=(e,t)=>{if("auto"===e)return t?Xi:Qi;const n=e||Qi;return [Qi,Xi,Gi].includes(n)?n:Qi},ns=(e,t)=>{const{overflowX:n,overflowY:o}=Ur(e,[Ui,Ki]);return {x:ts(n,t.x),y:ts(o,t.y)}},os="__osScrollbarsHidingPlugin",is=e=>JSON.stringify(e,(e,t)=>{if(xi(t))throw 0;return t}),rs=(e,t)=>e?`${t}`.split(".").reduce((e,t)=>e&&sr(e,t)?e[t]:void 0,e):void 0,as={paddingAbsolute:false,showNativeOverlaidScrollbars:false,update:{elementEvents:[["img","load"]],debounce:[0,33],attributes:null,ignoreMutation:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:false,dragScroll:true,clickScroll:false,pointers:["mouse","touch","pen"]}},ss=(e,t)=>{const n={};return Pi(Ai(lr(t),lr(e)),o=>{const i=e[o],r=t[o];if(Ni(i)&&Ni(r))cr(n[o]={},ss(i,r)),dr(n[o])&&delete n[o];else if(sr(t,o)&&r!==i){let e=true;if(Si(i)||Si(r))try{is(i)===is(r)&&(e=!1);}catch(e){}e&&(n[o]=r);}}),n},ls=(e,t,n)=>o=>[rs(e,o),n||void 0!==rs(t,o)];let cs;let us;const ds=()=>{const e=(e,t,n)=>{Br(document.body,e),Br(document.body,e);const o=Zr(e),i=Xr(e),r=ta(t);return n&&Fr(e),{x:i.h-o.h+r.h,y:i.w-o.w+r.w}},t=Hr(`<div class="${xa}"><div></div><style>${`.${xa}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${xa} div{width:200%;height:200%;margin:10px 0}.${Sa}{scrollbar-width:none!important}.${Sa}::-webkit-scrollbar,.${Sa}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`}</style></div>`)[0],n=t.firstChild,o=t.lastChild,i=cs;i&&(o.nonce=i);const[r,,a]=va(),[s,l]=ni({o:e(t,n),i:tr},or(e,t,n,true)),[c]=l(),u=(e=>{let t=false;const n=Dr(e,Sa);try{t="none"===Ur(e,"scrollbar-width")||"none"===Ur(e,"display","::-webkit-scrollbar");}catch(e){}return n(),t})(t),d={x:0===c.x,y:0===c.y},f={elements:{host:null,padding:!u,viewport:e=>u&&Mr(e)&&e,content:false},scrollbars:{slot:true},cancel:{nativeScrollbarsOverlaid:false,body:null}},m=cr({},as),p=or(cr,{},m),h=or(cr,{},f),g={P:c,k:d,U:u,J:!!vi,G:or(r,"r"),K:h,Z:e=>cr(f,e)&&h(),tt:p,nt:e=>cr(m,e)&&p(),ot:cr({},f),st:cr({},m)};if(yr(t,"style"),Fr(t),aa(oi,"resize",()=>{a("r",[]);}),xi(oi.matchMedia)&&!u&&(!d.x||!d.y)){const e=t=>{const n=oi.matchMedia(`(resolution: ${oi.devicePixelRatio}dppx)`);aa(n,"change",()=>{t(),e(t);},{A:true});};e(()=>{const[e,t]=s();cr(g.P,e),a("r",[t]);});}return g},fs=()=>(us||(us=ds()),us),ms=(e,t,n,o)=>{let i=false;const{et:r,ct:a,rt:s,it:l,lt:c,ut:u}=o||{},d=ar(()=>i&&n(true),{p:33,v:99}),[f,m]=((e,t,n)=>{let o=false;const i=!!n&&new WeakMap,r=r=>{if(i&&n){const a=n.map(t=>{const[n,o]=t||[];return [o&&n?(r||Er)(n,e):[],o]});Pi(a,n=>Pi(n[0],r=>{const a=n[1],s=i.get(r)||[];if(e.contains(r)&&a){const e=aa(r,a,n=>{o?(e(),i.delete(r)):t(n);});i.set(r,Oi(s,e));}else _i(s),i.delete(r);}));}};return r(),[()=>{o=true;},r]})(e,d,s),p=a||[],h=Ai(r||[],p),g=(i,r)=>{if(!Bi(r)){const a=c||fr,s=u||fr,d=[],f=[];let h=false,g=false;if(Pi(r,n=>{const{attributeName:i,target:r,type:c,oldValue:u,addedNodes:m,removedNodes:v}=n,y="attributes"===c,w="childList"===c,b=e===r,C=y&&i,k=C&&hr(r,i||""),x=Ci(k)?k:null,S=C&&u!==x,N=Ti(p,i)&&S;if(t&&(w||!b)){const t=y&&S,c=t&&l&&Ir(r,l),f=(c?!a(r,i,u,x):!y||t)&&!s(n,!!c,e,o);Pi(m,e=>Oi(d,e)),Pi(v,e=>Oi(d,e)),g=g||f;}!t&&b&&S&&!a(r,i,u,x)&&(Oi(f,i),h=h||N);}),m(e=>Ri(d).reduce((t,n)=>(Oi(t,Er(e,n)),Ir(n,e)?Oi(t,n):t),[])),t)return !i&&g&&n(false),[false];if(!Bi(f)||h){const e=[Ri(f),h];return i||n.apply(0,e),e}}},v=new pi(or(g,false));return [()=>(v.observe(e,{attributes:true,attributeOldValue:true,attributeFilter:h,subtree:t,childList:t,characterData:t}),i=true,()=>{i&&(f(),v.disconnect(),i=false);}),()=>{if(i)return d.O(),g(true,v.takeRecords())}]};let ps=null;const hs=(e,t,n)=>{const{ft:o}=n||{},i=Ca("__osSizeObserverPlugin"),[r]=ni({o:false,u:true});return ()=>{const n=[],a=Hr(`<div class="${Ba}"><div class="${_a}"></div></div>`)[0],s=a.firstChild,l=e=>{let n=false,o=false;if(Si(e)&&!Bi(e)){const t=e[0],[i,,a]=r(t.contentRect),s=oa(i);o=ia(i,a),n=!o&&!s;}else o=true===e;n||t({_t:true,ft:o});};if(gi){if(!ki(ps)){const t=new gi(fr);t.observe(e,{get box(){ps=true;}}),ps=ps||false,t.disconnect();}const t=ar(l,{p:0,v:0}),o=e=>t(e),i=new gi(o);if(i.observe(ps?e:s),Oi(n,[()=>{i.disconnect();},!ps&&Br(e,a)]),ps){const t=new gi(o);t.observe(e,{box:"border-box"}),Oi(n,()=>t.disconnect());}}else {if(!i)return fr;{const[t,r]=i(s,l,o);Oi(n,Ai([Dr(a,Ra),aa(a,"animationstart",t),Br(e,a)],r));}}return or(_i,n)}},gs=(e,t)=>{let n;const o=_r("os-trinsic-observer"),[i]=ni({o:false}),r=(e,n)=>{if(e){const o=i((e=>0===e.h||e.isIntersecting||e.intersectionRatio>0)(e)),[,r]=o;return r&&!n&&t(o)&&[o]}},a=(e,t)=>r(t.pop(),e);return [()=>{const t=[];if(hi)n=new hi(or(a,false),{root:e}),n.observe(o),Oi(t,()=>{n.disconnect();});else {const e=()=>{const e=Xr(o);r(e);};Oi(t,hs(o,e)()),e();}return or(_i,Oi(t,Br(e,o)))},()=>n&&a(true,n.takeRecords())]},vs=(e,t,n,o)=>{let i,r,a,s,l,c;const u=`[${Ia}]`,d=`[${Ma}]`,f=["id","class","style","open","wrap","cols","rows"],{dt:m,vt:p,L:h,gt:g,ht:v,V:y,bt:w,wt:b,yt:C,St:k}=e,x=e=>"rtl"===Ur(e,"direction"),S={Ot:false,B:x(m)},N=fs(),D=Ca(os),[E]=ni({i:er,o:{w:0,h:0}},()=>{const o=D&&D.R(e,t,S,N,n).Y,i=!(w&&y)&&xr(p,Ia,Da),r=!y&&b("arrange"),a=r&&da(g),s=a&&k(),l=C(Aa,i),c=r&&o&&o(),u=ea(h),d=ta(h);return c&&c(),ua(g,a),s&&s(),i&&l(),{w:u.w+d.w,h:u.h+d.h}}),I=ar(o,{p:()=>i,v:()=>r,m(e,t){const[n]=e,[o]=t;return [Ai(lr(n),lr(o)).reduce((e,t)=>(e[t]=n[t]||o[t],e),{})]}}),M=e=>{const t=x(m);cr(e,{Ct:c!==t}),cr(S,{B:t}),c=t;},P=(e,t)=>{const[n,i]=e,r={$t:i};return cr(S,{Ot:n}),t||o(r),r},T=({_t:e,ft:t})=>{const n=!(e&&!t)&&N.U?I:o,i={_t:e||t,ft:t};M(i),n(i);},A=(e,t)=>{const[,n]=E(),i={xt:n};M(i);return n&&!t&&(e?o:I)(i),i},O=(e,t,n)=>{const o={Ht:t};return M(o),t&&!n&&I(o),o},[L,F]=v?gs(p,P):[],B=!y&&hs(p,T,{ft:true}),[R,_]=ms(p,false,O,{ct:f,et:f}),H=y&&gi&&new gi(e=>{const t=e[e.length-1].contentRect;T({_t:true,ft:ia(t,l)}),l=t;}),$=ar(()=>{const[,e]=E();o({xt:e,_t:w});},{p:222,S:true});return [()=>{H&&H.observe(p);const e=B&&B(),t=L&&L(),n=R(),o=N.G(e=>{e?I({Et:e}):$();});return ()=>{H&&H.disconnect(),e&&e(),t&&t(),s&&s(),n(),o();}},({zt:e,Tt:t,It:n})=>{const o={},[l]=e("update.ignoreMutation"),[c,m]=e("update.attributes"),[p,g]=e("update.elementEvents"),[w,b]=e("update.debounce"),C=t||n;if(g||m){a&&a(),s&&s();const[e,t]=ms(v||h,true,A,{et:Ai(f,c||[]),rt:p,it:u,ut:(e,t)=>{const{target:n,attributeName:o}=e;return !(t||!o||y)&&Lr(n,u,d)||!!Ar(n,`.${Ha}`)||!!(e=>xi(l)&&l(e))(e)}});s=e(),a=t;}if(b)if(I.O(),Si(w)){const e=w[0],t=w[1];i=bi(e)&&e,r=bi(t)&&t;}else bi(w)?(i=w,r=false):(i=false,r=false);if(C){const e=_(),t=F&&F(),n=a&&a();e&&cr(o,O(e[0],e[1],C)),t&&cr(o,P(t[0],C)),n&&cr(o,A(n[0],C));}return M(o),o},S]},ys=(e,t)=>xi(t)?t.apply(0,e):t,ws=(e,t,n,o)=>{const i=yi(o)?n:o;return ys(e,i)||t.apply(0,e)},bs=(e,t,n,o)=>{const i=yi(o)?n:o,r=ys(e,i);return !!r&&(Ii(r)?r:t.apply(0,e))},Cs=(e,t,n,o)=>{const i="--os-viewport-percent",r="--os-scroll-percent",a="--os-scroll-direction",{K:s}=fs(),{scrollbars:l}=s(),{slot:c}=l,{dt:u,vt:d,L:f,At:m,gt:p,bt:h,V:g}=t,{scrollbars:v}=m?{}:e,{slot:y}=v||{},w=[],b=[],C=[],k=bs([u,d,f],()=>g&&h?u:d,c,y),x=e=>{if(vi){let t=null,o=[];const i=new vi({source:p,axis:e}),r=()=>{t&&t.cancel(),t=null;},a=a=>{const{Dt:s}=n,l=ma(s)[e],c="x"===e,u=[Jr(0,c),Jr(`calc(100cq${c?"w":"h"} + -100%)`,c)],d=l?u:u.reverse();return o[0]===d[0]&&o[1]===d[1]||(r(),o=d,t=a.Mt.animate({clear:["left"],transform:d},{timeline:i})),r};return {kt:a}}},S={x:x("x"),y:x("y")},N=(e,t,n)=>{const o=n?Dr:Nr;Pi(e,e=>{o(e.Lt,t);});},D=(e,t)=>{Pi(e,e=>{const[n,o]=t(e);Yr(n,o);});},E=(e,t,n)=>{const o=ki(n),i=!o||!n;(!o||n)&&N(b,e,t),i&&N(C,e,t);},I=e=>{const t=e?"x":"y",n=_r(`${Ha} ${e?ja:za}`),i=_r(Va),r=_r(Wa),a={Lt:n,Ut:i,Mt:r},s=S[t];return Oi(e?b:C,a),Oi(w,[Br(n,i),Br(i,r),or(Fr,n),s&&s.kt(a),o(a,E,e)]),a},M=or(I,true),P=or(I,false);return M(),P(),[{Pt:()=>{const e=(()=>{const{Rt:e,Vt:t}=n,o=(e,t)=>mr(0,1,e/(e+t)||0);return {x:o(t.x,e.x),y:o(t.y,e.y)}})(),t=e=>t=>[t.Lt,{[i]:Vr(e)+""}];D(b,t(e.x)),D(C,t(e.y));},Nt:()=>{if(!vi){const{Dt:e}=n,t=pa(e,da(p)),o=e=>t=>[t.Lt,{[r]:Vr(e)+""}];D(b,o(t.x)),D(C,o(t.y));}},qt:()=>{const{Dt:e}=n,t=ma(e),o=e=>t=>[t.Lt,{[a]:e?"0":"1"}];D(b,o(t.x)),D(C,o(t.y)),vi&&(b.forEach(S.x.kt),C.forEach(S.y.kt));},Bt:()=>{if(g&&!h){const{Rt:e,Dt:t}=n,o=ma(t),i=pa(t,da(p)),r=t=>{const{Lt:n}=t,r=Tr(n)===f&&n,a=(e,t,n)=>{const o=t*e;return Wr(n?o:-o)};return [r,r&&{transform:Jr({x:a(i.x,e.x,o.x),y:a(i.y,e.y,o.y)})}]};D(b,r),D(C,r);}},Ft:E,jt:{Xt:b,Yt:M,Wt:or(D,b)},Jt:{Xt:C,Yt:P,Wt:or(D,C)}},()=>(Br(k,b[0].Lt),Br(k,C[0].Lt),or(_i,w))]},ks=(e,t,n,o)=>(i,r,a)=>{const{vt:s,L:l,V:c,gt:u,Gt:d,St:f}=t,{Lt:m,Ut:p,Mt:h}=i,[g,v]=ir(333),[y,w]=ir(444),b=e=>{xi(u.scrollBy)&&u.scrollBy({behavior:"smooth",left:e.x,top:e.y});};let C=true;return or(_i,[aa(h,"pointermove pointerleave",o),aa(m,"pointerenter",()=>{r(Ka,true);}),aa(m,"pointerleave pointercancel",()=>{r(Ka,false);}),!c&&aa(m,"mousedown",()=>{const e=Or();(gr(e,Ma)||gr(e,Ia)||e===document.body)&&di(or(ha,l),25);}),aa(m,"wheel",e=>{const{deltaX:t,deltaY:n,deltaMode:o}=e;C&&0===o&&Tr(m)===s&&b({x:t,y:n}),C=false,r(Qa,true),g(()=>{C=true,r(Qa);}),la(e);},{T:false,I:true}),aa(m,"pointerdown",()=>{const e=aa(d,"click",e=>{t(),ca(e);},{A:true,I:true,T:false}),t=aa(d,"pointerup pointercancel",()=>{t(),setTimeout(e,150);},{I:true,T:true});},{I:true,T:true}),(()=>{const t="pointerup pointercancel lostpointercapture",o="client"+(a?"X":"Y"),i=a?Ji:qi,r=a?"left":"top",s=a?"w":"h",l=a?"x":"y",c=(e,t)=>o=>{const{Rt:i}=n,r=Xr(p)[s]-Xr(h)[s],a=t*o/r*i[l];ua(u,{[l]:e+a});},m=[];return aa(p,"pointerdown",n=>{const a=Ar(n.target,`.${Wa}`)===h,g=a?h:p,v=e.scrollbars,C=v[a?"dragScroll":"clickScroll"],{button:k,isPrimary:x,pointerType:S}=n,{pointers:N}=v;if(0===k&&x&&C&&(N||[]).includes(S)){_i(m),w();const e=!a&&(n.shiftKey||"instant"===C),v=or(na,h),k=or(na,p),x=(e,t)=>(e||v())[r]-(t||k())[r],S=ai(na(u)[i])/Xr(u)[s]||1,N=c(da(u)[l],1/S),D=n[o],E=v(),I=k(),M=E[i],P=x(E,I)+M/2,T=D-I[r],A=a?0:T-P,O=e=>{_i(B),g.releasePointerCapture(e.pointerId);},L=a||e,F=f(),B=[aa(d,t,O),aa(d,"selectstart",e=>la(e),{T:false}),aa(p,t,O),L&&aa(p,"pointermove",e=>N(A+(e[o]-D))),L&&(()=>{const e=da(u);F();const t=da(u),n={x:t.x-e.x,y:t.y-e.y};(si(n.x)>3||si(n.y)>3)&&(f(),ua(u,e),b(n),y(F));})];if(g.setPointerCapture(n.pointerId),e)N(A);else if(!a){const e=Ca("__osClickScrollPlugin");if(e){const t=e(N,A,M,e=>{e?F():Oi(B,F);});Oi(B,t),Oi(m,or(t,true));}}}})})(),v,w])},xs=e=>{const t=fs(),{K:n,U:o}=t,{elements:i}=n(),{padding:r,viewport:a,content:s}=i,l=Ii(e),c=l?{}:e,{elements:u}=c,{padding:d,viewport:f,content:m}=u||{},p=l?e:c.target,h=Mr(p),g=p.ownerDocument,v=g.documentElement,y=()=>g.defaultView||oi,w=or(ws,[p]),b=or(bs,[p]),C=or(_r,""),k=or(w,C,a),x=or(b,C,s),S=k(f),N=S===p,D=N&&h,E=!N&&x(m),I=!N&&S===E,M=D?v:S,P=D?M:p,T=!N&&b(C,r,d),A=!I&&E,O=[A,M,T,P].map(e=>Ii(e)&&!Tr(e)&&e),L=e=>e&&Ti(O,e),F=!L(M)&&(e=>{const t=Xr(e),n=ea(e),o=Ur(e,Ui),i=Ur(e,Ki);return n.w-t.w>0&&!es(o)||n.h-t.h>0&&!es(i)})(M)?M:p,B=D?v:M,R={dt:p,vt:P,L:M,rn:T,ht:A,gt:B,Kt:D?g:M,ln:h?v:F,Gt:g,bt:h,At:l,V:N,an:y,wt:e=>xr(M,Ma,e),yt:(e,t)=>kr(M,Ma,e,t),St:()=>kr(B,Ma,"scrolling",true)},{dt:_,vt:H,rn:$,L:j,ht:z}=R,V=[()=>{yr(H,[Ia,Na]),yr(_,Na),h&&yr(v,[Na,Ia]);}];let W=Pr([z,j,$,H,_].find(e=>e&&!L(e)));const Y=D?_:z||j,U=or(_i,V);return [R,()=>{const e=y(),t=Or(),n=e=>{Br(Tr(e),Pr(e)),Fr(e);},i=e=>aa(e,"focusin focusout focus blur",ca,{I:true,T:false}),r="tabindex",a=hr(j,r),s=i(t);return vr(H,Ia,N?"":"host"),vr($,La,""),vr(j,Ma,""),vr(z,Fa,""),N||(vr(j,r,a||"-1"),h&&vr(v,Ea,"")),Br(Y,W),Br(H,$),Br($||H,!N&&j),Br(j,z),Oi(V,[s,()=>{const e=Or(),t=L(j),o=t&&e===j?_:e,s=i(o);yr($,La),yr(z,Fa),yr(j,Ma),h&&yr(v,Ea),a?vr(j,r,a):yr(j,r),L(z)&&n(z),t&&n(j),L($)&&n($),ha(o),s();}]),o&&!N&&(Cr(j,Ma,Oa),Oi(V,or(yr,j,Ma))),ha(!N&&h&&t===_&&e.top===e?j:t),s(),W=0,U},U]},Ss=({ht:e})=>({Qt:t,un:n,It:o})=>{const{$t:i}=t||{},{Ot:r}=n;e&&(i||o)&&Yr(e,{[qi]:r&&"100%"});},Ns=({vt:e,rn:t,L:n,V:o},i)=>{const[r,a]=ni({i:nr,o:Kr()},or(Kr,e,"padding",""));return ({zt:e,Qt:s,un:l,It:c})=>{let[u,d]=a(c);const{U:f}=fs(),{_t:m,xt:p,Ct:h}=s||{},{B:g}=l,[v,y]=e("paddingAbsolute");(m||d||(c||p))&&([u,d]=r(c));const w=!o&&(y||h||d);if(w){const e=!v||!t&&!f,o=u.r+u.l,r=u.t+u.b,a={[Wi]:e&&!g?-o:0,[Yi]:e?-r:0,[Vi]:e&&g?-o:0,top:e?-u.t:0,right:e?g?-u.r:"auto":0,left:e?g?"auto":-u.l:0,[Ji]:e&&`calc(100% + ${o}px)`},s={[Hi]:e?u.t:0,[$i]:e?u.r:0,[zi]:e?u.b:0,[ji]:e?u.l:0};Yr(t||n,a),Yr(n,s),cr(i,{rn:u,fn:!e,F:t?s:cr({},a,s)});}return {_n:w}}},Ds=(e,t)=>{const n=fs(),{vt:o,rn:i,L:r,V:a,Kt:s,gt:l,bt:c,yt:u,an:d}=e,{U:f}=n,m=c&&a,p=or(ii,0),h={display:()=>false,direction:e=>"ltr"!==e,flexDirection:e=>e.endsWith("-reverse"),writingMode:e=>"horizontal-tb"!==e},g=lr(h),v={i:er,o:{w:0,h:0}},y={i:tr,o:{}},w=e=>{u(Aa,!m&&e);},b=e=>{const t=g.some(t=>{const n=e[t];return n&&h[t](n)});if(!t)return {D:{x:0,y:0},M:{x:1,y:1}};w(true);const n=da(l),o=u("noContent",true),i=aa(s,Xi,e=>{const t=da(l);e.isTrusted&&t.x===n.x&&t.y===n.y&&sa(e);},{I:true,A:true});ua(l,{x:0,y:0}),o();const r=da(l),a=ea(l);ua(l,{x:a.w,y:a.h});const c=da(l);ua(l,{x:c.x-r.x<1&&-a.w,y:c.y-r.y<1&&-a.h});const d=da(l);return ua(l,n),ui(()=>i()),{D:r,M:d}},C=(e,t)=>{const n=oi.devicePixelRatio%1!=0?1:0,o={w:p(e.w-t.w),h:p(e.h-t.h)};return {w:o.w>n?o.w:0,h:o.h>n?o.h:0}},k=(e,t)=>{const n=(e,t,n,o)=>{const i=e===Gi?Qi:(e=>e.replace(`${Gi}-`,""))(e),r=es(e),a=es(n);if(!t&&!o)return Qi;if(r&&a)return Gi;if(r){return t&&o?i:t?Gi:Qi}return t?i:a&&o?Gi:Qi};return {x:n(t.x,e.x,t.y,e.y),y:n(t.y,e.y,t.x,e.x)}},x=e=>{const t=e=>[Gi,Qi,Xi].map(t=>_(ts(t),e)),n=t(true).concat(t()).join(" ");u(n),u(lr(e).map(t=>_(e[t],"x"===t)).join(" "),true);},[S,N]=ni(v,or(ta,r)),[D,E]=ni(v,or(ea,r)),[I,M]=ni(v),[P]=ni(y),[T,A]=ni(v),[O]=ni(y),[L]=ni({i:(e,t)=>Zi(e,t,g),o:{}},()=>(e=>!!e&&(e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length))(e))(r)?Ur(r,g):{}),[F,B]=ni({i:(e,t)=>tr(e.D,t.D)&&tr(e.M,t.M),o:{D:{x:0,y:0},M:{x:0,y:0}}}),R=Ca(os),_=(e,t)=>`${t?Pa:Ta}${(e=>{const t=String(e||"");return t?t[0].toUpperCase()+t.slice(1):""})(e)}`;return ({zt:a,Qt:s,un:l,It:c},{_n:h})=>{const{_t:g,Ht:v,xt:y,Ct:_,ft:H,Et:$}=s||{},j=R&&R.R(e,t,l,n,a),{X:z,Y:V,W:W}=j||{},[Y,U]=((e,t)=>{const{k:n}=t,[o,i]=e("showNativeOverlaidScrollbars");return [o&&n.x&&n.y,i]})(a,n),[K,J]=a("overflow"),q=es(K.x),G=es(K.y),Q=g||h||y||_||$||U;let X=N(c),Z=E(c),ee=M(c),te=A(c);if(U&&f&&u(Oa,!Y),Q){xr(o,Ia,Da)&&w(true);const e=V&&V(),[t]=X=S(c),[n]=Z=D(c),i=Zr(r),a=m&&Qr(d()),s={w:p(n.w+t.w),h:p(n.h+t.h)},l={w:p((a?a.w:i.w+p(i.w-n.w))+t.w),h:p((a?a.h:i.h+p(i.h-n.h))+t.h)};e&&e(),te=T(l),ee=I(C(s,l),c);}const[ne,oe]=te,[ie,re]=ee,[ae,se]=Z,[le,ce]=X,[ue,de]=P({x:ie.w>0,y:ie.h>0}),fe=q&&G&&(ue.x||ue.y)||q&&ue.x&&!ue.y||G&&ue.y&&!ue.x,me=h||_||$||ce||se||oe||re||J||U||Q||v&&m,[pe,he]=L(c),ge=_||H||he||de||c,[ve,ye]=ge?F(b(pe),c):B();let we=k(ue,K);w(false),me&&(x(we),we=ns(r,ue),W&&z&&(z(we,ae,le),Yr(r,W(we))));const[be,Ce]=O(we);return kr(o,Ia,Da,fe),kr(i,La,Da,fe),cr(t,{cn:be,Vt:{x:ne.w,y:ne.h},Rt:{x:ie.w,y:ie.h},j:ue,Dt:fa(ve,ie)}),{sn:Ce,tn:oe,nn:re,en:ye||re}}},Es=e=>{const[t,n,o]=xs(e),i={rn:{t:0,r:0,b:0,l:0},fn:false,F:{[Wi]:0,[Yi]:0,[Vi]:0,[Hi]:0,[$i]:0,[zi]:0,[ji]:0},Vt:{x:0,y:0},Rt:{x:0,y:0},cn:{x:Qi,y:Qi},j:{x:false,y:false},Dt:{D:{x:0,y:0},M:{x:0,y:0}}},{dt:r,gt:a,V:s,St:l}=t,{U:c,k:u}=fs(),d=!c&&(u.x||u.y),f=[Ss(t),Ns(t,i),Ds(t,i)];return [n,e=>{const t={},n=d&&da(a),o=n&&l();return Pi(f,n=>{cr(t,n(e,t)||{});}),ua(a,n),o&&o(),s||ua(r,0),t},i,t,o]},Is=(e,t,n,o,i)=>{let r=false;const a=ls(t,{}),[s,l,c,u,d]=Es(e),[f,m,p]=vs(u,c,a,e=>{w({},e);}),[h,g,,v]=((e,t,n,o,i,r)=>{let a,s,l,c,u,d=fr,f=0;const m=["mouse","pen"],p=e=>m.includes(e.pointerType),[h,g]=ir(),[v,y]=ir(100),[w,b]=ir(100),[C,k]=ir(()=>f),[x,S]=Cs(e,i,o,ks(t,i,o,e=>p(e)&&L())),{vt:N,Kt:D,bt:E}=i,{Ft:I,Pt:M,Nt:P,qt:T,Bt:A}=x,O=(e,t)=>{if(k(),e)I(Ga);else {const e=or(I,Ga,true);f>0&&!t?C(e):e();}},L=()=>{(l?a:c)||(O(true),v(()=>{O(false);}));},F=e=>{I(qa,e,true),I(qa,e,false);},B=e=>{p(e)&&(a=l,l&&O(true));},R=[k,y,b,g,()=>d(),aa(N,"pointerover",B,{A:true}),aa(N,"pointerenter",B),aa(N,"pointerleave",e=>{p(e)&&(a=false,l&&O(false));}),aa(N,"pointermove",e=>{p(e)&&s&&L();}),aa(D,"scroll",e=>{h(()=>{P(),L();}),r(e),A();})],_=Ca(os);return [()=>or(_i,Oi(R,S())),({zt:e,It:t,Qt:i,Zt:r})=>{const{tn:a,nn:m,sn:p,en:h}=r||{},{Ct:g,ft:v}=i||{},{B:y}=n,{k:b,U:C}=fs(),{cn:k,j:x}=o,[S,N]=e("showNativeOverlaidScrollbars"),[L,B]=e("scrollbars.theme"),[R,H]=e("scrollbars.visibility"),[$,j]=e("scrollbars.autoHide"),[z,V]=e("scrollbars.autoHideSuspend"),[W]=e("scrollbars.autoHideDelay"),[Y,U]=e("scrollbars.dragScroll"),[K,J]=e("scrollbars.clickScroll"),[q,G]=e("overflow"),Q=v&&!t,X=x.x||x.y,Z=a||m||h||g||t,ee=p||H||G,te=S&&b.x&&b.y,ne=!C&&!_,oe=te||ne,ie=(e,t,n)=>{const o=e.includes(Xi)&&(R===Gi||"auto"===R&&t===Xi);return I(Ya,o,n),o};if(f=W,Q&&(z&&X?(F(false),d(),w(()=>{d=aa(D,"scroll",or(F,true),{A:true});})):F(true)),(N||ne)&&I("os-theme-none",oe),B&&(I(u),I(L,true),u=L),V&&!z&&F(true),j&&(s="move"===$,l="leave"===$,c="never"===$,O(c,true)),U&&I(Za,Y),J&&I(Xa,!!K),ee){const e=ie(q.x,k.x,true),t=ie(q.y,k.y,false);I(Ua,!(e&&t));}Z&&(P(),M(),A(),h&&T(),I(Ja,!x.x,true),I(Ja,!x.y,false),I($a,y&&!E));},{},x]})(e,t,p,c,u,i),y=e=>lr(e).some(t=>!!e[t]),w=(e,i)=>{if(n())return  false;const{dn:a,It:s,Tt:c,pn:u}=e,d=a||{},f=!!s||!r,h={zt:ls(t,d,f),dn:d,It:f};if(u)return g(h),false;const v=i||m(cr({},h,{Tt:c})),w=l(cr({},h,{un:p,Qt:v}));g(cr({},h,{Qt:v,Zt:w}));const b=y(v),C=y(w),k=b||C||!dr(d)||f;return r=true,k&&o(e,{Qt:v,Zt:w}),k};return [()=>{const{ln:e,gt:t,St:n}=u,o=da(e),i=[f(),s(),h()],r=n();return ua(t,o),r(),or(_i,i)},w,()=>({vn:p,gn:c}),{hn:u,bn:v},d]},Ms=new WeakMap,Ps=e=>Ms.get(e),Ts=(e,t,n)=>{const{tt:o}=fs(),i=Ii(e),r=i?e:e.target,a=Ps(r);if(t&&!a){let a=false;const s=[],l={},c=e=>{const t=ur(e),n=Ca("__osOptionsValidationPlugin");return n?n(t,true):t},u=cr({},o(),c(t)),[d,f,m]=va(),[p,h,g]=va(n),v=(e,t)=>{g(e,t),m(e,t);},[y,w,b,C,k]=Is(e,u,()=>a,({dn:e,It:t},{Qt:n,Zt:o})=>{const{_t:i,Ct:r,$t:a,xt:s,Ht:l,ft:c}=n,{tn:u,nn:d,sn:f,en:m}=o;v("updated",[S,{updateHints:{sizeChanged:!!i,directionChanged:!!r,heightIntrinsicChanged:!!a,overflowEdgeChanged:!!u,overflowAmountChanged:!!d,overflowStyleChanged:!!f,scrollCoordinatesChanged:!!m,contentMutation:!!s,hostMutation:!!l,appear:!!c},changedOptions:e||{},force:!!t}]);},e=>v("scroll",[S,e])),x=e=>{(e=>{Ms.delete(e);})(r),_i(s),a=true,v("destroyed",[S,e]),f(),h();},S={options(e,t){if(e){const n=t?o():{},i=ss(u,cr(n,c(e)));dr(i)||(cr(u,i),w({dn:i}));}return cr({},u)},on:p,off:(e,t)=>{e&&t&&h(e,t);},state(){const{vn:e,gn:t}=b(),{B:n}=e,{Vt:o,Rt:i,cn:r,j:s,rn:l,fn:c,Dt:u}=t;return cr({},{overflowEdge:o,overflowAmount:i,overflowStyle:r,hasOverflow:s,scrollCoordinates:{start:u.D,end:u.M},padding:l,paddingAbsolute:c,directionRTL:n,destroyed:a})},elements(){const{dt:e,vt:t,rn:n,L:o,ht:i,gt:r,Kt:a}=C.hn,{jt:s,Jt:l}=C.bn,c=e=>{const{Mt:t,Ut:n,Lt:o}=e;return {scrollbar:o,track:n,handle:t}},u=e=>{const{Xt:t,Yt:n}=e,o=c(t[0]);return cr({},o,{clone:()=>{const e=c(n());return w({pn:true}),e}})};return cr({},{target:e,host:t,padding:n||o,viewport:o,content:i||o,scrollOffsetElement:r,scrollEventElement:a,scrollbarHorizontal:u(s),scrollbarVertical:u(l)})},update:e=>w({It:e,Tt:true}),destroy:or(x,false),plugin:e=>l[lr(e)[0]]};return Oi(s,[k]),((e,t)=>{Ms.set(e,t);})(r,S),ba(ya,Ts,[S,d,l]),((e,t)=>{const{nativeScrollbarsOverlaid:n,body:o}=t||{},{k:i,U:r,K:a}=fs(),{nativeScrollbarsOverlaid:s,body:l}=a().cancel,c=null!=n?n:s,u=yi(o)?l:o,d=(i.x||i.y)&&c,f=e&&(wi(u)?!r:u);return !!d||!!f})(C.hn.bt,!i&&e.cancel)?(x(true),S):(Oi(s,y()),v("initialized",[S]),S.update(),S)}return a};Ts.plugin=e=>{const t=Si(e),n=t?e:[e],o=n.map(e=>ba(e,Ts)[0]);return (e=>{Pi(e,e=>Pi(e,(t,n)=>{ya[n]=e[n];}));})(n),t?o:o[0]},Ts.valid=e=>{const t=e&&e.elements,n=xi(t)&&t();return Ei(n)&&!!Ps(n.target)},Ts.env=()=>{const{P:e,k:t,U:n,J:o,ot:i,st:r,K:a,Z:s,tt:l,nt:c}=fs();return cr({},{scrollbarsSize:e,scrollbarsOverlaid:t,scrollbarsHiding:n,scrollTimeline:o,staticDefaultInitialization:i,staticDefaultOptions:r,getDefaultInitialization:a,setDefaultInitialization:s,getDefaultOptions:l,setDefaultOptions:c})},Ts.nonce=e=>{cs=e;},Ts.trustedTypePolicy=e=>{Rr=e;};const As=()=>{if(typeof window>"u"){const e=()=>{};return [e,e]}let e,t;const n=window,o="function"==typeof n.requestIdleCallback,i=n.requestAnimationFrame,r=n.cancelAnimationFrame,a=o?n.requestIdleCallback:i,s=o?n.cancelIdleCallback:r,l=()=>{s(e),r(t);};return [(n,r)=>{l(),e=a(o?()=>{l(),t=i(n);}:n,"object"==typeof r?r:{timeout:2233});},l]},Os=e=>{const{options:t,events:n,defer:o}=e||{},[i,r]=useMemo(As,[]),a=useRef(null),s=useRef(o),l=useRef(t),c=useRef(n);return useEffect(()=>{s.current=o;},[o]),useEffect(()=>{const{current:e}=a;l.current=t,Ts.valid(e)&&e.options(t||{},true);},[t]),useEffect(()=>{const{current:e}=a;c.current=n,Ts.valid(e)&&e.on(n||{},true);},[n]),useEffect(()=>()=>{var e;r(),null==(e=a.current)||e.destroy();},[]),useMemo(()=>[e=>{const t=a.current;if(Ts.valid(t))return;const n=s.current,o=l.current||{},r=c.current||{},u=()=>a.current=Ts(e,o,r);n?i(u,n):u();},()=>a.current],[])};forwardRef((e,t)=>{const{element:n="div",options:o,events:r,defer:a,children:s,...l}=e,c=n,u=useRef(null),p=useRef(null),[h,g]=Os({options:o,events:r,defer:a});return useEffect(()=>{const{current:e}=u,{current:t}=p;if(!e)return;return h("body"===n?{target:e,cancel:{body:null}}:{target:e,elements:{viewport:t,content:t}}),()=>{var e;return null==(e=g())?void 0:e.destroy()}},[h,n]),useImperativeHandle(t,()=>({osInstance:g,getElement:()=>u.current}),[]),o__default.createElement(c,{"data-overlayscrollbars-initialize":"",ref:u,...l},"body"===n?s:o__default.createElement("div",{"data-overlayscrollbars-contents":"",ref:p},s))});const Ls=forwardRef((t,n)=>{const{children:o,element:i="div",elementProps:r,wrapperClassName:s}=t,l=useRef(null),c=useRef(null),[u,m]=Os({options:{scrollbars:{autoHide:"leave",autoHideDelay:0}},defer:true}),p=useCallback(e=>{c.current=e,"function"==typeof n?n(e):null!==n&&(n.current=e);},[n]);return useEffect(()=>{if(c.current&&l.current)return u({target:l.current,elements:{viewport:c.current,content:c.current}}),()=>m()?.destroy()},[u,m]),jsxRuntimeExports.jsx("div",{"data-overlayscrollbars-initialize":"",ref:l,className:x("io-overlay-scrollbars-container",s),children:jsxRuntimeExports.jsx(i,{"data-overlayscrollbars-contents":"",ref:p,...r,children:o})})});function Fs({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}const Bs=forwardRef(({id:n="input",className:o,type:i="text",name:r="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:p,readOnly:h,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=x("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",p&&"io-control-disabled",h&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],o),C=useCallback(e=>{p?e.preventDefault():u&&u(e);},[u,p]),k=useCallback(e=>{p?e.preventDefault():f&&f(e);},[f,p]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(S,{variant:c,onClick:e=>C(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:i,name:r,tabIndex:0,placeholder:m??(()=>{switch(i){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),"aria-label":l,disabled:p,readOnly:h,...g?{"aria-invalid":true,"aria-describedby":`${n}-error`}:{},...y}),d&&jsxRuntimeExports.jsx(S,{variant:d,onClick:e=>k(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,id:`${n}-error`,className:"io-input-error",children:[jsxRuntimeExports.jsx(S,{variant:"close"}),g]})]})});Bs.displayName="Input";const Rs=forwardRef(({id:n="textarea",className:o,name:i="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=x("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:i,tabIndex:0,placeholder:l,"aria-label":a,disabled:c,readOnly:u,rows:s,...d})]})});Rs.displayName="Textarea";const _s=forwardRef(({id:n="checkbox",className:o,name:i="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=x("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a,"data-testid":c["data-testid"]?`${c["data-testid"]}-label`:void 0})]})});_s.displayName="Checkbox";const Hs=forwardRef(({id:n="radio",className:o,name:i="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=x("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a})]})});Hs.displayName="Radio";var $s=o__default["undefined"!=typeof document&&void 0!==document.createElement?"useLayoutEffect":"useEffect"],js=0,zs=()=>js++,Vs=0;const Ws="function"==typeof useId?useId:function(e,t){ void 0===t&&(t="🅰");var[n,o]=useState(Vs?zs:void 0);return $s(()=>{ void 0===n&&o(js++),Vs=1;},[]),e||(void 0===n?n:t+n)},Ys=forwardRef(({id:n,className:o,name:i="toggle",align:r="left",label:a,checked:s,disabled:l,onKeyDown:c,"data-testid":u="toggle",...d},f)=>{const m=Ws(),p=n||`toggle-${m}`,h=x("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsx("div",{className:h,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",htmlFor:p,tabIndex:l?-1:0,onKeyDown:c,"data-testid":`${u}-label`,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:p,className:"io-checkbox",ref:f,name:i,checked:s,disabled:l,"aria-checked":s,tabIndex:-1,"data-testid":u,...d}),jsxRuntimeExports.jsx("span",{className:"slider","data-testid":`${u}-slider`}),a]})})});function Js(e,t=500){const[n,o]=useState(e);return useEffect(()=>{const n=setTimeout(()=>{o(e);},t);return ()=>clearTimeout(n)},[e,t]),n}Ys.displayName="Toggle";const Xs=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function Zs(){return useMemo(()=>"object"==typeof window&&Xs(),[])}const el=()=>{const e=useContext(IOConnectContext),[t,n]=useState(null),o=useCallback(t=>e?.themes?.select(t),[e]);return useEffect(()=>{if(!e)return;let t=false;const o=e=>{t||n(e);};return e.themes?.onChanged(o),e.themes?.getCurrent().then(o).catch(console.warn),()=>{t=true;}},[e]),{currentTheme:t,selectTheme:o}};createContext({theme:"dark"});const rl="___platform_prefs___",dl="_launchpad_pinnedPosition",fl="_launchpad_allowDocking",ml="_launchpad_minimizeToTray",pl="_launchpad_autoCloseStartingAppsAndWorkspaces",hl="_launchpad_showTutorialOnStartup",gl="_layouts_restoreLastSaved",vl="_layouts_saveCurrentOnExit",yl="_layouts_showUnsavedChangesPrompt",wl="_layouts_showDeletePrompt",bl="_downloads_askForEachDownload",Tl=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),Al="warning",Ol={success:5e3,warning:1e4};var Ll=function(e){return {ok:true,result:e}},Fl=function(e){return {ok:false,error:e}},Bl=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Ll(e(t.result,n.result))},Rl=function(e,t){return  true===t.ok?t:Fl(e(t.error))},_l=function(){return _l=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},_l.apply(this,arguments)};function Hl(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Hl(e[n],t[n]))return  false;return  true}var o=Object.keys(e);if(o.length!==Object.keys(t).length)return  false;for(n=0;n<o.length;n++){if(!t.hasOwnProperty(o[n]))return  false;if(!Hl(e[o[n]],t[o[n]]))return  false}return  true}}var $l=function(e){return Array.isArray(e)},jl=function(e){return "object"==typeof e&&null!==e&&!$l(e)},zl=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Vl=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},Wl=function(e,t){var n=t.at,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(o=Object.getOwnPropertySymbols(e);i<o.length;i++)t.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(e,o[i])&&(n[o[i]]=e[o[i]]);}return n}(t,["at"]);return _l({at:e+(n||"")},o)},Yl=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return Rl(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?Ll(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,o){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(o)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?Ll(e):Fl({message:zl("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?Ll(e):Fl({message:zl("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?Ll(e):Fl({message:zl("a boolean",e)})})},e.constant=function(t){return new e(function(e){return Hl(e,t)?Ll(t):Fl({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(jl(e)&&t){var n={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o].decode(e[o]);if(true!==i.ok)return void 0===e[o]?Fl({message:"the key '"+o+"' is required but was not present"}):Fl(Wl("."+o,i.error));void 0!==i.result&&(n[o]=i.result);}return Ll(n)}return jl(e)?Ll(e):Fl({message:zl("an object",e)})})},e.array=function(t){return new e(function(e){if($l(e)&&t){return e.reduce(function(e,n,o){return Bl(function(e,t){return e.concat([t])},e,function(e,n){return Rl(function(e){return Wl("["+n+"]",e)},t.decode(e))}(n,o))},Ll([]))}return $l(e)?Ll(e):Fl({message:zl("an array",e)})})},e.tuple=function(t){return new e(function(e){if($l(e)){if(e.length!==t.length)return Fl({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e[o]);if(!i.ok)return Fl(Wl("["+o+"]",i.error));n[o]=i.result;}return Ll(n)}return Fl({message:zl("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return e.oneOf.apply(e,[t,n].concat(o))},e.intersection=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return new e(function(e){return [t,n].concat(o).reduce(function(t,n){return Bl(Object.assign,t,n.decode(e))},Ll({}))})},e.anyJson=function(){return new e(function(e){return Ll(e)})},e.unknownJson=function(){return new e(function(e){return Ll(e)})},e.dict=function(t){return new e(function(e){if(jl(e)){var n={};for(var o in e)if(e.hasOwnProperty(o)){var i=t.decode(e[o]);if(true!==i.ok)return Fl(Wl("."+o,i.error));n[o]=i.result;}return Ll(n)}return Fl({message:zl("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?Ll(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e);if(true===i.ok)return i;n[o]=i.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return Fl({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return Ll(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var o=e,i=0;i<t.length;i++){if(void 0===o)return Fl({at:Vl(t.slice(0,i+1)),message:"path does not exist"});if("string"==typeof t[i]&&!jl(o))return Fl({at:Vl(t.slice(0,i+1)),message:zl("an object",o)});if("number"==typeof t[i]&&!$l(o))return Fl({at:Vl(t.slice(0,i+1)),message:zl("an array",o)});o=o[t[i]];}return Rl(function(e){return void 0===o?{at:Vl(t),message:"path does not exist"}:Wl(Vl(t),e)},n.decode(o))})},e.succeed=function(t){return new e(function(e){return Ll(t)})},e.fail=function(t){return new e(function(e){return Fl({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),Ul=Yl.string;Yl.number;var Kl=Yl.boolean,Jl=Yl.anyJson;Yl.unknownJson;var ql=Yl.constant,Gl=Yl.object,Ql=Yl.array;Yl.tuple,Yl.dict;var Xl=Yl.optional,Zl=Yl.oneOf;Yl.union,Yl.intersection,Yl.withDefault,Yl.valueAt,Yl.succeed,Yl.fail,Yl.lazy;const ec=["name","title","version","customProperties","icon","caption","type"],tc=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var nc=function(e){return {ok:true,result:e}},oc=function(e){return {ok:false,error:e}},ic=function(e,t,n){return  false===t.ok?t:false===n.ok?n:nc(e(t.result,n.result))},rc=function(e,t){return  true===t.ok?t:oc(e(t.error))},ac=function(){return ac=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},ac.apply(this,arguments)};function sc(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!sc(e[n],t[n]))return  false;return  true}var o=Object.keys(e);if(o.length!==Object.keys(t).length)return  false;for(n=0;n<o.length;n++){if(!t.hasOwnProperty(o[n]))return  false;if(!sc(e[o[n]],t[o[n]]))return  false}return  true}}var lc=function(e){return Array.isArray(e)},cc=function(e){return "object"==typeof e&&null!==e&&!lc(e)},uc=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},dc=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},fc=function(e,t){var n=t.at,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(o=Object.getOwnPropertySymbols(e);i<o.length;i++)t.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(e,o[i])&&(n[o[i]]=e[o[i]]);}return n}(t,["at"]);return ac({at:e+(n||"")},o)},mc=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return rc(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?nc(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,o){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(o)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?nc(e):oc({message:uc("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?nc(e):oc({message:uc("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?nc(e):oc({message:uc("a boolean",e)})})},e.constant=function(t){return new e(function(e){return sc(e,t)?nc(t):oc({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(cc(e)&&t){var n={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o].decode(e[o]);if(true!==i.ok)return void 0===e[o]?oc({message:"the key '"+o+"' is required but was not present"}):oc(fc("."+o,i.error));void 0!==i.result&&(n[o]=i.result);}return nc(n)}return cc(e)?nc(e):oc({message:uc("an object",e)})})},e.array=function(t){return new e(function(e){if(lc(e)&&t){return e.reduce(function(e,n,o){return ic(function(e,t){return e.concat([t])},e,function(e,n){return rc(function(e){return fc("["+n+"]",e)},t.decode(e))}(n,o))},nc([]))}return lc(e)?nc(e):oc({message:uc("an array",e)})})},e.tuple=function(t){return new e(function(e){if(lc(e)){if(e.length!==t.length)return oc({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e[o]);if(!i.ok)return oc(fc("["+o+"]",i.error));n[o]=i.result;}return nc(n)}return oc({message:uc("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return e.oneOf.apply(e,[t,n].concat(o))},e.intersection=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return new e(function(e){return [t,n].concat(o).reduce(function(t,n){return ic(Object.assign,t,n.decode(e))},nc({}))})},e.anyJson=function(){return new e(function(e){return nc(e)})},e.unknownJson=function(){return new e(function(e){return nc(e)})},e.dict=function(t){return new e(function(e){if(cc(e)){var n={};for(var o in e)if(e.hasOwnProperty(o)){var i=t.decode(e[o]);if(true!==i.ok)return oc(fc("."+o,i.error));n[o]=i.result;}return nc(n)}return oc({message:uc("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?nc(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e);if(true===i.ok)return i;n[o]=i.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return oc({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return nc(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var o=e,i=0;i<t.length;i++){if(void 0===o)return oc({at:dc(t.slice(0,i+1)),message:"path does not exist"});if("string"==typeof t[i]&&!cc(o))return oc({at:dc(t.slice(0,i+1)),message:uc("an object",o)});if("number"==typeof t[i]&&!lc(o))return oc({at:dc(t.slice(0,i+1)),message:uc("an array",o)});o=o[t[i]];}return rc(function(e){return void 0===o?{at:dc(t),message:"path does not exist"}:fc(dc(t),e)},n.decode(o))})},e.succeed=function(t){return new e(function(e){return nc(t)})},e.fail=function(t){return new e(function(e){return oc({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),pc=mc.string,hc=mc.number,gc=mc.boolean,vc=mc.anyJson;mc.unknownJson;var yc=mc.constant,wc=mc.object,bc=mc.array;mc.tuple;var Cc=mc.dict,kc=mc.optional,xc=mc.oneOf;mc.union,mc.intersection,mc.withDefault,mc.valueAt,mc.succeed,mc.fail,mc.lazy;const Sc=pc().where(e=>e.length>0,"Expected a non-empty string"),Nc=hc().where(e=>e>=0,"Expected a non-negative number"),Dc=vc().andThen(e=>e instanceof RegExp?vc():fail("expected a regex, got a "+typeof e)),Ec=wc({name:Sc,displayName:kc(pc()),contexts:kc(bc(pc())),customConfig:kc(wc())}),Ic=xc(yc("web"),yc("native"),yc("citrix"),yc("onlineNative"),yc("other")),Mc=wc({url:Sc}),Pc=wc({src:Sc,size:kc(Sc),type:kc(Sc)}),Tc=wc({src:Sc,size:kc(Sc),type:kc(Sc),label:kc(Sc)}),Ac=wc({contexts:bc(Sc),displayName:kc(Sc),resultType:kc(Sc),customConfig:kc(vc())}),Oc=wc({listensFor:kc(Cc(Ac)),raises:kc(Cc(bc(Sc)))}),Lc=wc({broadcasts:kc(bc(Sc)),listensFor:kc(bc(Sc))}),Fc=wc({name:Sc,description:kc(Sc),broadcasts:kc(bc(Sc)),listensFor:kc(bc(Sc))}),Bc=wc({intents:kc(Oc),userChannels:kc(Lc),appChannels:kc(bc(Fc))}),Rc=wc({url:kc(Sc),top:kc(hc()),left:kc(hc()),width:kc(Nc),height:kc(Nc)}),_c=wc({name:kc(Sc),type:kc(Sc.where(e=>"window"===e,"Expected a value of window")),title:kc(Sc),version:kc(Sc),customProperties:kc(vc()),icon:kc(pc()),caption:kc(pc()),details:kc(Rc),intents:kc(bc(Ec)),hidden:kc(gc())}),Hc=wc({name:Sc,appId:Sc,title:kc(Sc),version:kc(Sc),manifest:Sc,manifestType:Sc,tooltip:kc(Sc),description:kc(Sc),contactEmail:kc(Sc),supportEmail:kc(Sc),publisher:kc(Sc),images:kc(bc(wc({url:kc(Sc)}))),icons:kc(bc(wc({icon:kc(Sc)}))),customConfig:vc(),intents:kc(bc(Ec))}),$c=wc({appId:kc(Sc),name:kc(Sc),details:kc(Mc),version:kc(Sc),title:kc(Sc),tooltip:kc(Sc),lang:kc(Sc),description:kc(Sc),categories:kc(bc(Sc)),icons:kc(bc(Pc)),screenshots:kc(bc(Tc)),contactEmail:kc(Sc),supportEmail:kc(Sc),moreInfo:kc(Sc),publisher:kc(Sc),customConfig:kc(bc(vc())),hostManifests:kc(vc()),interop:kc(Bc)}),jc=wc({appId:Sc,name:kc(Sc),type:Ic,details:Mc,version:kc(Sc),title:kc(Sc),tooltip:kc(Sc),lang:kc(Sc),description:kc(Sc),categories:kc(bc(Sc)),icons:kc(bc(Pc)),screenshots:kc(bc(Tc)),contactEmail:kc(Sc),supportEmail:kc(Sc),moreInfo:kc(Sc),publisher:kc(Sc),customConfig:kc(bc(vc())),hostManifests:kc(vc()),interop:kc(Bc),localizedVersions:kc(Cc($c))}),zc=xc(Hc,jc),Vc=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class Wc{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=zc.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:Vc(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const o=zc.run(e);if(!o.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(o.error)}`);const i=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...i,intents:"1.2"===n?i.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=_c.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const o=zc.run(e);if(!o.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(o.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const i=e,r={name:i.appId,type:this.fdc3ToDesktopDefinitionType[i.type],details:i.details,version:i.version,title:i.title,tooltip:i.tooltip,caption:i.description,icon:this.getIconFromDefinition(i,"2.0"),intents:this.getIntentsFromV2AppDefinition(i),fdc3:{...i,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter(([e])=>!ec.includes(e))):Object.fromEntries(Object.entries(e).filter(([e])=>!ec.includes(e)&&!tc.includes(e)))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map(e=>{const[t,n]=e;return {name:t,...n}})}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find(e=>e.icon)?.icon||void 0:e.icons?.find(e=>e.src)?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const o={...e.createOptions,...t.details};n.createOptions=o,n.userProperties.details=o;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Yc={common:{nonEmptyStringDecoder:Sc,nonNegativeNumberDecoder:Nc,regexDecoder:Dc},fdc3:{allDefinitionsDecoder:zc,v1DefinitionDecoder:Hc,v2DefinitionDecoder:jc}};var Uc;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Uc||(Uc={}));const Kc=new class{_fdc3;_decoders=Yc;_errors={intents:Uc};get fdc3(){return this._fdc3||(this._fdc3=(new Wc).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Kc.fdc3;const Jc=Kc.decoders;Kc.errors;const qc=Jc.common.nonEmptyStringDecoder,Gc=Zl(ql("add"),ql("align-bottom"),ql("align-bottom-solid"),ql("align-left"),ql("align-left-bottom"),ql("align-left-bottom-solid"),ql("align-left-solid"),ql("align-left-top"),ql("align-left-top-solid"),ql("align-right"),ql("align-right-bottom"),ql("align-right-bottom-solid"),ql("align-right-solid"),ql("align-right-top"),ql("align-right-top-solid"),ql("align-top"),ql("align-top-solid"),ql("always-on-top"),ql("always-on-top-on"),ql("application"),ql("arrow-down-long"),ql("arrow-down-to-bracket"),ql("arrow-left-long"),ql("arrow-right-from-bracket"),ql("arrow-right-long"),ql("arrow-right"),ql("arrow-up"),ql("arrow-up-long"),ql("ban"),ql("bell"),ql("bell-solid"),ql("bookmark"),ql("bullseye-pointer"),ql("certificate"),ql("check"),ql("check-light"),ql("check-solid"),ql("chevron-down"),ql("chevron-left"),ql("chevron-right"),ql("chevron-up"),ql("circle-info"),ql("circle-xmark"),ql("circle-xmark-full"),ql("clock"),ql("clock-rotate-left"),ql("clone"),ql("close"),ql("cog"),ql("cog-solid"),ql("collapse"),ql("copy"),ql("download"),ql("delete-left"),ql("dev-tools"),ql("ellipsis"),ql("ellipsis-vertical"),ql("expand"),ql("envelope"),ql("envelope-open"),ql("exclamation-mark"),ql("expand"),ql("feedback"),ql("filter"),ql("floppy"),ql("floppy-disk-pen"),ql("folder"),ql("folder-open"),ql("globe"),ql("group"),ql("hidden"),ql("home"),ql("house"),ql("info"),ql("keyboard"),ql("layout"),ql("link"),ql("list-ul"),ql("lock"),ql("logo"),ql("minimize"),ql("minimize-down"),ql("paper-plane-top"),ql("paperclip"),ql("pause"),ql("pen-line"),ql("pen-to-square"),ql("pin"),ql("play"),ql("pop-in"),ql("pop-in-widget"),ql("pop-out"),ql("power-off"),ql("publish"),ql("refresh"),ql("resize"),ql("restore"),ql("rotate-right"),ql("search"),ql("search-filled"),ql("sleep"),ql("sliders"),ql("snooze"),ql("spinner"),ql("square"),ql("square-arrow-down"),ql("square-arrow-up"),ql("star"),ql("star-full"),ql("sticky-off"),ql("sticky-off-hover"),ql("sticky-on"),ql("sticky-on-hover"),ql("subscribe"),ql("system-close"),ql("system-maximize"),ql("system-minimize"),ql("thumbs-down"),ql("thumbs-up"),ql("trash"),ql("trash-can"),ql("triangle-exclamation"),ql("unlock"),ql("unpin"),ql("up-to-line"),ql("user"),ql("user-gear"),ql("visible"),ql("workspace")),Qc=Gl({id:qc,title:qc,description:Xl(Ul()),icon:Xl(Gc),iconSrc:Xl(qc),contextMenuActions:Xl(Ql(Jl())),type:qc}),Xc=Zl(ql("Left"),ql("Right")),Zc=Zl(ql("daily"),ql("weekly")),eu=Zl(ql("Sunday"),ql("Monday"),ql("Tuesday"),ql("Wednesday"),ql("Thursday"),ql("Friday"),ql("Saturday")),tu=Gl({customPrefs:Xl(Jl()),_launchpad_collapsedSections:Xl(Ql(qc)),_launchpad_favorites:Xl(Ql(Qc)),_launchpad_isLayoutsPanelOpen:Xl(Kl()),_launchpad_isCollapsed:Xl(Kl()),_launchpad_isPinned:Xl(Kl()),_launchpad_pinnedPosition:Xl(Xc),_launchpad_allowDocking:Xl(Kl()),_launchpad_minimizeToTray:Xl(Kl()),_launchpad_autoCloseStartingAppsAndWorkspaces:Xl(Kl()),_launchpad_showTutorialOnStartup:Xl(Kl()),_layouts_restoreLastSaved:Xl(Kl()),_layouts_saveCurrentOnExit:Xl(Kl()),_layouts_showUnsavedChangesPrompt:Xl(Kl()),_layouts_showDeletePrompt:Xl(Kl()),_downloads_askForEachDownload:Xl(Kl()),_downloads_location:Xl(Ul()),_system_scheduleRestart:Xl(Kl()),_system_scheduleRestartTime:Xl(qc),_system_scheduleRestartFrequency:Xl(Zc),_system_scheduleRestartDay:Xl(eu),_system_scheduleShutdown:Xl(Kl()),_system_scheduleShutdownTime:Xl(qc),_system_scheduleShutdownFrequency:Xl(Zc),_system_scheduleShutdownDay:Xl(eu)}),nu=async e=>{const{io:t,variant:n,text:o,error:i}=e,r=Tl(i);try{if(n===Al&&t.logger.warn(r?`${o} ${r}`:o),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:o,variant:n,ttl:Ol[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},ou=createContext(void 0);function au({prefKey:e}){const t=useContext(IOConnectContext),n=useContext(ou),o=n?.prefs?.[e],i=n?.isInitialSetupCompleted??false,[r,s]=useState(!i),[u,m]=useState(),p=useRef(0);useEffect(()=>{i&&0===p.current&&s(false);},[i]);const h=useCallback(async n=>{if(!t)return;const o=++p.current;s(true),m(void 0);const i=async n=>{n&&await nu({io:t,variant:Al,text:`Failed to update prefKey "${e}".`,error:n}),o===p.current&&(s(false),n&&m({message:Tl(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(rl))[e]);}catch(e){return i(e)}else r=n;try{const n=tu.runWithException({[e]:r});await t.contexts.update(rl,n);}catch(e){return i(e)}await i();},[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:u,isLoading:r,update:h,value:o}}const su="var(--io-neutrals-0)",lu="var(--io-neutrals-900)";function cu(e){let t,n,o;if(e.startsWith("#")){let i=e.slice(1);3===i.length&&(i=i.split("").map(e=>e+e).join("")),t=parseInt(i.substring(0,2),16),n=parseInt(i.substring(2,4),16),o=parseInt(i.substring(4,6),16);}else {if(!e.startsWith("rgb")){const t=document.createElement("canvas").getContext("2d");if(!t)return lu;t.fillStyle=e;return cu(t.fillStyle)}{const i=e.match(/\d+/g)?.map(Number);if(!i||i.length<3)return lu;[t,n,o]=i;}}return (.2126*t+.7152*n+.0722*o)/255>.5?lu:su}function uu({className:t,channel:n,...o}){const i=x("io-channel-badge",t),r=useMemo(()=>cu(n.color),[n.color]);return jsxRuntimeExports.jsx("div",{className:i,style:{color:r,backgroundColor:n.color},"data-testid":`channel-selector-badge-${n.color}`,...o,children:jsxRuntimeExports.jsx("span",{className:"io-channel-selector-badge-label","data-testid":"channel-selector-label",children:n.label})})}function du(){return jsxRuntimeExports.jsx(S,{variant:"check","data-testid":"channel-selector-channel-selected"})}function fu({channel:o,handleChannelRestricted:i,lockedChannelRestriction:r}){const a=(e,t)=>n=>{n.stopPropagation(),T(n)&&(n.preventDefault(),t||i({...o,[e]:!o[e]}));};return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:o.isSelected&&jsxRuntimeExports.jsx("span",{"data-testid":"channel-selector-channel-selected",children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-publish-toggle-container",children:jsxRuntimeExports.jsx(Ys,{label:"Publish",checked:o.write,onChange:()=>{i({...o,write:!o.write});},onKeyDown:a("write",!o.isSelected||r?.write),onClick:e=>e.stopPropagation(),disabled:!o.isSelected||r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-subscribe-toggle-container",children:jsxRuntimeExports.jsx(Ys,{label:"Subscribe",checked:o.read,onChange:()=>{i({...o,read:!o.read});},onKeyDown:a("read",!o.isSelected||r?.read),disabled:!o.isSelected||r?.read})})]})}const mu=createContext({});function pu({channel:t,isSelected:n,onChannelSelect:o,onChannelRestrict:i,...r}){const{variant:s,selectedChannels:c,lockedChannelRestrictions:u}=useContext(mu),d=n||t.isSelected||c?.includes(t),f=u?.find(e=>e.name===t.name),m=useCallback(()=>o?.({...t,isSelected:!d}),[t,o,d]),p=useCallback(e=>{const n=e.target;n.closest(".io-toggle")||n.classList.contains("io-toggle")||T(e)&&(e.preventDefault(),o?.({...t,isSelected:!d}));},[t,o,d]),h=useCallback(e=>{i?.(e);},[i]);return jsxRuntimeExports.jsx(_,{prepend:jsxRuntimeExports.jsx(uu,{channel:t}),append:"single"===s||"multi"===s?d&&jsxRuntimeExports.jsx(du,{}):jsxRuntimeExports.jsx(fu,{channel:t,handleChannelRestricted:h,lockedChannelRestriction:f}),isSelected:d,onClick:m,onKeyDown:p,...r,children:t.name},t.name)}function hu({variant:t,onVariantChange:n,disabled:o=false}){const i="directionalSingle"===t||"directionalMulti"===t,r=useCallback(()=>{n?.(!i);},[i,n]),s=useCallback(e=>{e.stopPropagation();},[]),l=useCallback(e=>{e.stopPropagation(),T(e)&&(e.preventDefault(),o||r());},[o,r]);return jsxRuntimeExports.jsx(Ys,{label:"Directional",align:"right",checked:i,onChange:r,onClick:s,onKeyDown:l,disabled:o,"data-testid":`channel-selector-toggle-${t}`})}const gu=forwardRef(({className:n,variant:o="single",variantToggle:i=false,channels:r=[],lockedChannelRestrictions:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:c,...d},f)=>{const m=x("io-list-channels","io-channel-selector-panel",("directionalSingle"===o||"directionalMulti"===o)&&"io-list-channels-directional io-channel-selector-panel-directional",n),p=useMemo(()=>({variant:o,selectedChannels:r.filter(e=>e.isSelected),lockedChannelRestrictions:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:c}),[r,o,a,s,l,c]);return jsxRuntimeExports.jsx(mu.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(W,{...d,children:[jsxRuntimeExports.jsx(W.ItemTitle,{"data-testid":"channel-selector-title",append:i&&jsxRuntimeExports.jsx(hu,{variant:o,onVariantChange:s}),children:{single:"Select Channel",directionalSingle:"Select Directional Channel",multi:"Select Channels",directionalMulti:"Select Directional Channels"}[o]}),r?.map(t=>jsxRuntimeExports.jsx(pu,{channel:t,isSelected:t.isSelected,onChannelSelect:l,onChannelRestrict:c,"data-testid":`channel-selector-channel-${t.name}`},t.name))]})})})});gu.displayName="ChannelSelector";const vu=forwardRef(({className:t,title:n,ariaLabel:o,onClick:i,onKeyDown:r,children:a,disabled:s=false,...l},c)=>jsxRuntimeExports.jsx("div",{ref:c,className:x(t,{disabled:s}),title:n,role:"button",tabIndex:s?-1:0,"aria-label":o,"aria-disabled":s,onClick:e=>{!s&&i&&i(e);},onKeyDown:e=>{!s&&r&&r(e);},...l,children:a}));vu.displayName="ChannelSelectorButtonWrapper";createContext({config:{message:""},theme:"dark",setResult:()=>{}});function Au({title:n="Downloads"}){const{ItemSearch:o,HeaderButtons:i}=od();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(ee,{draggable:true,children:[jsxRuntimeExports.jsx(ee.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(i,{className:"non-draggable"})]}),jsxRuntimeExports.jsx(o,{})]})}const Lu=createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),Fu=()=>useContext(Lu);function Bu({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=x("io-header-search",n),c=useRef(null),{searchQuery:u,setSearch:f,itemsCount:m}=Fu(),p=u.length>0,h=useCallback(()=>{f(""),c.current&&c.current.focus();},[f]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Bs,{ref:c,value:u,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?h:void 0,placeholder:o,onChange:e=>f(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${m} results`})]})}function Ru({className:n,...o}){const{MoreButton:i,CloseButton:r}=od();return jsxRuntimeExports.jsxs(Z,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{})]})}function _u({icon:n="ellipsis-vertical",...o}){const{items:i,clearItems:r,showSettings:a}=Fu(),s=0===i.length;return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsx(X.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsxs(X.List,{children:[jsxRuntimeExports.jsx(X.Item,{onClick:e=>(e=>{s?e.stopPropagation():r();})(e),disabled:s,children:"Clear All"}),jsxRuntimeExports.jsx(X.Item,{onClick:a,children:"Settings"})]})})]})}const Hu={minimizeWindow:async function(e){if(e)try{const t=e.windows?.my();await(t?.minimize());}catch(e){console.error("Failed to minimize window",e);}},closeWindow:async function(e,t){if(e)try{const n=e.windows?.my();await(n?.close(t));}catch(e){console.error("Failed to close window",e);}},restartPlatform:async function(e,t=true){if(e)try{await e.appManager.restart({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to restart io.Connect Desktop",e);}},shutdownPlatform:async function(e,t=true){if(e)try{await e.appManager.exit({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to shutdown io.Connect Desktop",e);}}};function $u({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const a=useContext(IOConnectContext);return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):Hu.closeWindow(a).catch(e=>{console.error("Failed to close window:",e);});},...r})}function ju(e,t=false,n=false,o=false){const i=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:o?n?`${r} ${i}`:`${r} ${i} at ${s}:${c}`:n?`${r} ${i}, ${a}`:`${r} ${i}, ${a} at ${s}:${c}`}function zu(e,t={showTime:true}){const n=new Date(1e3*e),o=new Date,i=Math.round((o-n)/1e3),r=Math.round(i/60),a=o.toDateString()===n.toDateString(),s=new Date(o.setDate(o.getDate()-1)).toDateString()===n.toDateString(),l=o.getFullYear()===n.getFullYear();return t.showTime?i<5?"Just Now":i<60?`${i} seconds ago`:i<90?"about a minute ago":r<60?`${r} minutes ago`:a?ju(n,"Today",false,true):s?ju(n,"Yesterday",false,true):l?ju(n,false,false,true):ju(n):a?"Today":s?"Yesterday":l?ju(n,false,true,true):ju(n,false,true)}function Vu({className:t,...n}){const o=x("io-dm-body",t),{DownloadListEmpty:i,ItemGroup:r,Item:a}=od(),{items:s,searchQuery:l,setCount:c,sortItems:d}=Fu(),m=d(s),p=Js(l),h=useMemo(()=>m.filter(e=>e.displayInfo.filename.toLowerCase().includes(p.toLowerCase())||e.displayInfo.url.toLowerCase().includes(p.toLowerCase())),[m,p]),g=useMemo(()=>h.map(e=>({...e,displayInfo:{...e.displayInfo,startTime:zu(e.displayInfo.startTime,{showTime:false})}})),[h]),v=useMemo(()=>Object.values(g.reduce((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e),{})),[g]);return useEffect(()=>{c(h.length);},[h,c]),jsxRuntimeExports.jsx("div",{className:o,...n,children:v&&0!==v.length?v.map(t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map(t=>jsxRuntimeExports.jsx(a,{item:t},t.id))},t[0].id??"")):jsxRuntimeExports.jsx(i,{})})}function Wu({className:n,icon:o="download",text:i="No downloads to display.",...r}){const a=x("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(S,{variant:o}),jsxRuntimeExports.jsx("p",{children:i})]})}function Yu({className:n,title:o,children:i,...r}){const a=x("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[o&&jsxRuntimeExports.jsx("p",{children:o}),i]})}function Uu({className:o,item:i,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=od(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:p,timeRemaining:h}=i.displayInfo;if(!i)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=x("io-dm-item",i.displayInfo.state&&[c],o);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:i.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:p,timeRemaining:h}),jsxRuntimeExports.jsx(l,{itemID:i.id,state:c})]})}function Ku({bytesReceived:t=0,bytesTotal:n=0,...o}){const i=useCallback(()=>t&&n?Math.round(t/n*100):0,[t,n]);return jsxRuntimeExports.jsx(ti,{value:i(),...o})}function Ju({className:n,itemID:o,filename:i,state:r,cancel:s,remove:l,...c}){const u=x("io-dm-item-header",n),{cancelItem:d,removeItem:f}=Fu(),m=useCallback(e=>{s?s(e):d(e);},[s,d]),p=useCallback(e=>{l?l(e):f(e);},[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(M,{text:i,style:{textDecoration:"interrupted"===r||"cancelled"===r?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"12",onClick:()=>{"progressing"===r||"paused"===r?m(o):p(o);}})]})}function qu({className:n,state:o,url:i,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=x("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:i}),(m=o,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Ku,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===o?`${d(r??0)} - Done`:"cancelled"===o||"interrupted"===o?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let o="";return t>0&&(o+=`${t} hour${t>1?"s":""}, `),n>0&&(o+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===o)&&(o+=`${e} sec${1!==e?"s":""}`),`${o.trim()} left`})(l)??0}`})]});var f,m;}const Gu={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Qu({className:n,variant:o,text:i}){const r=x("io-dm-item-status",`io-dm-item-status-${o}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[o&&jsxRuntimeExports.jsx(S,{variant:Gu[o],className:"icon-severity",size:"10"}),i&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:i})]})}function Xu({className:o,itemID:i,state:r,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=x("io-dm-item-footer",o),{pauseResumeItem:f,showItemInFolder:m,cancelItem:p}=Fu(),h=useCallback(e=>{s?s(e):f(e);},[s,f]),g=useCallback(e=>{l?l(e):m(e);},[l,m]),v=useCallback(e=>{c?c(e):p(e);},[c,p]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(r){case "progressing":return jsxRuntimeExports.jsxs(Z,{align:"right",children:[jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Pause",onClick:()=>h(i)}),jsxRuntimeExports.jsx(Z.Button,{variant:"link",text:"Cancel",onClick:()=>v(i)})]});case "paused":return jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Resume",onClick:()=>h(i)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Qu,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(i)})})]});case "cancelled":return jsxRuntimeExports.jsx(Qu,{variant:"warning",text:"Cancelled"});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Qu,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Retry",onClick:()=>h(i)})})]});default:return null}})()})}function Zu({className:n,title:o="Download Settings",...i}){const r=x("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=Fu();return jsxRuntimeExports.jsxs(Zo,{className:r,...i,children:[jsxRuntimeExports.jsxs(Zo.Header,{children:[jsxRuntimeExports.jsx(Zo.Header.Title,{size:"large",text:o,tag:"h1"}),jsxRuntimeExports.jsx(Zo.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Zo.Body,{children:jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsxs(X,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(X.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{children:d.map((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(X.Item,{onClick:()=>{l(t);},children:t},t))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const ed={Header:Au,ItemSearch:Bu,HeaderButtons:Ru,MoreButton:_u,CloseButton:$u,Body:Vu,DownloadListEmpty:Wu,ItemGroup:Yu,Item:Uu,ItemProgress:Ku,ItemHeader:Ju,ItemBody:qu,ItemFooter:Xu,Settings:Zu},td=createContext(ed),nd=memo(({children:t,components:n})=>{const o=useMemo(()=>({...ed,...n}),[n]);return jsxRuntimeExports.jsx(td.Provider,{value:o,children:t})});nd.displayName="ComponentsStore";const od=()=>useContext(td);function ad(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function o(n,o){var i=n instanceof Error?n:new Error(n);if(t)t(i);else {var r='[ERROR] callback-registry: User callback for key "'+o+'" failed: '+i.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,i){var r=n[e];return r||(r=[],n[e]=r),r.push(t),i&&setTimeout(function(){i.forEach(function(i){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(i)?t.apply(void 0,i):t.apply(void 0,[i]);}catch(t){o(t,e);}});},0),function(){var o=n[e];o&&(o=o.reduce(function(e,n,o){return n===t&&e.length===o||e.push(n),e},[]),0===o.length?delete n[e]:n[e]=o);}},execute:function(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach(function(n){try{var i=n.apply(void 0,t);a.push(i);}catch(t){a.push(void 0),o(t,e);}}),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}ad.default=ad;b(ad);const cd={env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"};const fd=createContext({config:cd,onThemeChanged:()=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:()=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),md=()=>useContext(fd);function pd({...n}){const{config:o,close:i}=md(),{applicationTitle:r}=o;return jsxRuntimeExports.jsxs(ee,{draggable:true,...n,children:[jsxRuntimeExports.jsx(ee.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(ee.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(ee.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>i()})})]})}function hd({className:n,handleSubmit:o,...i}){const r=x("io-panel-body",n),{config:a,submitFeedback:s}=md(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:p,MailListField:h}=Od(),g=o??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...i,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function gd({...n}){const{FooterButtons:o}=Od(),{openUrl:i,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=md();return jsxRuntimeExports.jsx(oe,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(P,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(qo,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(P,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),i(s);},children:s})]}),jsxRuntimeExports.jsx(o,{})]})})}function vd({className:t,...n}){const{CloseButton:o}=Od(),{close:i}=md(),r=x("non-draggable",t);return jsxRuntimeExports.jsx(Z,{className:r,...n,children:jsxRuntimeExports.jsx(o,{onClick:()=>i()})})}function yd({className:n,...o}){const{SubmitButton:i,CancelButton:r,CloseButton:a}=Od(),{close:s,submitCompleted:l}=md();return l?jsxRuntimeExports.jsx(Z,{className:n,...o,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(Z,{className:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function wd({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function bd({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function Cd({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function kd({showField:t=true,className:n,title:o,hint:i,children:r,...a}){return t?jsxRuntimeExports.jsx(P,{className:n,title:o,hint:i,...a,children:r}):null}function xd({showField:t=true,className:n,title:o="Description",hint:i,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(P,{className:n,hint:i,title:"",...s,children:jsxRuntimeExports.jsx(Rs,{id:"description",name:"description",label:o,readOnly:r,disabled:a})}):null}function Sd({showField:t,className:n,title:o="Technical Information",hint:i,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=md(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Rs,{id:"errorMessage",name:"errorMessage",label:o,value:d,readOnly:a,disabled:s})}):null}function Nd({showField:t,className:n,title:o="Environment Information",hint:i,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=md(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Rs,{id:"environmentInfo",name:"environmentInfo",label:o,value:d,readOnly:a,disabled:s})}):null}function Dd({showField:t=true,className:n,title:o="Attachments",hint:i,readOnly:r=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=x("io-block-list-gap",n),{config:f}=md(),m=l??f.attachments,p=c??f.selectedCategories,h=useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(P,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(P,{className:d,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map(t=>jsxRuntimeExports.jsx(_s,{id:t.id,name:t.id,label:t.name,readOnly:r,disabled:s,defaultChecked:h(t.category)},t.id))})}):null}function Ed({showField:t=true,className:n,title:o="Attachments",hint:i,readOnly:r=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=md(),m=l??f,p=c??d.selectedCategories,h=useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(P,{className:n,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map(t=>jsxRuntimeExports.jsx(Ys,{id:t,name:t,align:"right",label:t,readOnly:r,disabled:s,defaultChecked:h(t)},t))})}):null}function Id({className:n,title:o,hint:i,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=x("io-block-list-gap",n),{config:p,showMailingList:h,setShowMailingList:g}=md();if(!r)return null;const v=a??p.createJiraTicket,y=l??p.sendEmail;return jsxRuntimeExports.jsxs(P,{className:m,hint:i,title:o,...f,children:[v&&jsxRuntimeExports.jsx(Ys,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Ys,{onChange:()=>{g(!h);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function Md({showField:t=true,className:n,title:o="Email List",hint:i="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=md(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Bs,{id:"mailingList",name:"mailingList",label:o,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const Pd={Header:pd,Body:hd,Footer:gd,HeaderButtons:vd,FooterButtons:yd,SubmitButton:wd,CancelButton:bd,CloseButton:Cd,IntroField:kd,DescriptionField:xd,TechInfoField:Sd,EnvInfoField:Nd,FileAttachmentsField:Dd,CategoryAttachmentsField:Ed,SettingsField:Id,MailListField:Md},Td=createContext(Pd),Ad=memo(({children:t,components:n})=>{const o=useMemo(()=>({...Pd,...n}),[n]);return jsxRuntimeExports.jsx(Td.Provider,{value:o,children:t})});function Od(e){return {...useContext(Td),...e}}Ad.displayName="ComponentsStore";function Bd({className:n,title:o="General",...i}){const r=x("io-notifications-settings-panel-general",n),{AllowNotifications:a,AllowNotificationToasts:s,ShowNotificationBadge:l,CloseNotificationOnClick:c,PanelAutoHide:u,HideToastsAfter:d}=bf(),f=Zs();return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[f&&jsxRuntimeExports.jsx(a,{}),f&&jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),f&&jsxRuntimeExports.jsx(u,{}),f&&jsxRuntimeExports.jsx(c,{}),f&&jsxRuntimeExports.jsx(d,{})]})})}function _d(e){const t=useContext(IOConnectContext),n=t?.appManager,o=Zs(),[i,r]=useState([]),[s,d]=useState(0),m="Platform",p=useCallback((e="asc")=>{if(null===o)return [];const t=[...i].sort((t,n)=>{const o=(t.title??t.name).toLowerCase(),i=(n.title??n.name).toLowerCase();return "asc"===e?o.localeCompare(i):i.localeCompare(o)});if(!o){const e=t.findIndex(e=>e.name===m);if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t},[i,o]),h=useMemo(()=>p("asc"),[p]),g=useMemo(()=>p("desc"),[p]);useEffect(()=>{if(null===o||o)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};r(t=>t.some(t=>t.name===e.name)?t:[...t,e]);},[o]),useEffect(()=>{if(!n)return;const e=n.onAppAdded(e=>{r(t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]);}),t=n.onAppRemoved(e=>{r(t=>t.filter(t=>t.name!==e.name));}),o=n.onAppChanged(e=>{r(t=>{const n=t.find(t=>t.name===e.name);return [...t.filter(t=>t.name!==e.name),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]});});return ()=>{e(),t(),o();}},[n]);return {apps:useMemo(()=>{if(!e?.sourceFilter||!Array.isArray(i))return i;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,o=t.includes("*"),r=n.includes("*");let a=0;const s=i.map(e=>{const n=o||t.includes(e.name),i=!r&&n;return i&&a++,{...e,allowed:i}});return d(a),s},[e,i]),allowedApps:s,sortedAppsAsc:h,sortedAppsDesc:g,sortAppsAlphabetically:p}}const Wd=createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),Yd=()=>useContext(Wd);function Ud({label:t="Allow notifications",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=useCallback(e=>{r({enabledNotifications:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.enabledNotifications??false,...o}):null}function Kd({label:t="Allow notification toasts",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=useCallback(e=>{r({enabledToasts:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.enabledToasts??false,disabled:l,...o}):null}function Jd({label:t="Show notification badge",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs()&&!i.enabledNotifications,l=useCallback(e=>{r({showNotificationBadge:e.target.checked});},[r]);return jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.showNotificationBadge??false,disabled:s,...o})}function qd({label:t="Close notification on click",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=useCallback(e=>{r({closeNotificationOnClick:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.closeNotificationOnClick??false,disabled:l,...o}):null}function Gd({label:t="Auto hide panel",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=useCallback(e=>{r({autoHidePanel:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.autoHidePanel??false,...o}):null}const Qd=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",Xd=e=>{const t=Math.floor(e/60),n=e%60,o=Qd(t,"minute"),i=Qd(n,"second");return o+(o&&i?" ":"")+i};function Zd({className:n,title:o="Hide toasts after",items:i=[15,30,45,60],...r}){const s=x("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Yd(),u=Zs(),d=u&&!l.enabledNotifications,f=useCallback((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});},[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(X.Button,{text:Xd((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{f(t);},children:Xd(t)},t))})})]})]}):null}function ef({className:n,title:o="Stacking",...i}){const r=x("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=bf();return Zs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function tf({label:t="Allow toast stacking",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=useCallback(e=>{r({toastStacking:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.toastStacking??false,disabled:l,...o}):null}const nf={application:"Application",severity:"Priority"},of=Object.fromEntries(Object.entries(nf).map(([e,t])=>[t,e]));function rf({className:n,title:o="Group by",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=c&&!s.enabledNotifications,d=useCallback((e="severity")=>{s.stackBy!==e&&l({stackBy:e.toLowerCase()});},[s.stackBy,l]);if(!c)return null;const f=Object.values(nf);return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:x("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(X.Button,{text:nf[s.stackBy??"severity"]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:f.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{const e=of[t];d(e);},children:t},t))})})]})]})}function af({className:n,title:o="Placement",...i}){const r=x("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=bf();return Zs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}const sf=e=>e.replace(/(^|-)\w/g,e=>e.toUpperCase().replace("-"," "));function lf({className:n,title:o="Panel position",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=useCallback(e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",children:[jsxRuntimeExports.jsx(X.Button,{text:s.placement?.panel?sf(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:["Right","Left"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function cf({className:n,title:o="Toasts position",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=useCallback(e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",children:[jsxRuntimeExports.jsx(X.Button,{text:s.placement?.toasts?sf(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function uf({className:t,title:n="Snooze",...o}){const i=x("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=bf(),{settings:a}=Yd();return Zs()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsx(P,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function df({className:n,title:o="Default duration",items:i=[60,120,180,300],...r}){const s=x("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Yd(),u=Zs(),d=u&&!l.enabledNotifications,f=useCallback((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});},[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:x("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(X.Button,{text:Xd((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{f(t);},children:Xd(t)},t))})})]})]}):null}function ff({className:n,title:o,...i}){const r=x("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=bf(),{sortAppsAlphabetically:u}=_d(),d=Zs(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map(n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name))]})})}function mf({label:t="All apps",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=Yd(),l=Zs()&&!i.enabledNotifications,c=useCallback(e=>{s({subscribe:e.target.checked});},[s]);return jsxRuntimeExports.jsx(Ys,{align:n,label:t,onChange:c,checked:(r.sourceFilter?.allowed?.includes("*")&&0===r.sourceFilter?.blocked?.length)??false,disabled:l,...o})}function pf({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=Yd(),u=Zs()&&!s.enabledNotifications,d=useCallback((e,t)=>{const n={...l.sourceFilter},o=n.allowed?.indexOf("*");"number"==typeof o&&o>-1&&(n.allowed?.splice(o,1),r.forEach(e=>{e.name!==t.name&&n.allowed?.push(e.name);})),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter(e=>e!==t.name)):(n.allowed=n.allowed?.filter(e=>e!==t.name),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);},[r,l.sourceFilter,c]);return jsxRuntimeExports.jsx(Ys,{id:o.name,label:t,align:n,onChange:e=>d(e.target.checked,o),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(o.name)||l.sourceFilter?.allowed?.includes(o.name))??false,disabled:u,...i})}function hf({label:t="Mute all",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=Yd(),l=Zs(),c=l&&(!i.enabledNotifications||-1===r.sourceFilter?.allowed?.indexOf("*")),u=useCallback(e=>{s({mute:e.target.checked});},[s]);return l?jsxRuntimeExports.jsx(Ys,{align:n,label:t,onChange:u,checked:r.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...o}):null}function gf({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=Yd(),u=Zs(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(o.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(o.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=useCallback((e,t)=>{const n={...l.sourceFilter},o=n?.muted?.indexOf("*");"number"==typeof o&&o>-1&&(n.muted?.splice(o,1),r.forEach(e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);})),e?n.muted?.push(t.name):n.muted=n.muted?.filter(e=>e!==t.name),c(n);},[r,l.sourceFilter,c]);return !u||o.hidden?null:jsxRuntimeExports.jsx(Ys,{id:o.name,label:t,align:n,onChange:e=>f(e.target.checked,o),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(o.name))??false,disabled:d??false,...i})}const vf={Body:n=>{const{General:o,Placement:i,Stacking:r,Snooze:a,Subscriptions:s}=bf();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:Bd,AllowNotifications:Ud,AllowNotificationToasts:Kd,ShowNotificationBadge:Jd,CloseNotificationOnClick:qd,PanelAutoHide:Gd,HideToastsAfter:Zd,Stacking:ef,ToastStacking:tf,ToastStackBy:rf,Placement:af,PlacementPanel:lf,PlacementToasts:cf,Snooze:uf,SnoozeDuration:df,Subscriptions:ff,SubscribeAll:mf,SubscribeApp:pf,SubscribeMuteAll:hf,SubscribeMuteApp:gf},yf=createContext(vf),wf=memo(({children:t,components:n})=>{const o=useMemo(()=>({...vf,...n}),[n]);return jsxRuntimeExports.jsx(yf.Provider,{value:o,children:t})});wf.displayName="NotificationsSettingsPanelComponentsStoreProvider";const bf=()=>useContext(yf);const Sf=createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),Nf=()=>useContext(Sf);function Df({title:n,onClose:o,onOpenSettings:i,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=vm(),{isBulkActionsSupported:m,notificationsCount:p}=Yd(),{isBulkActionsVisible:h}=Nf(),g=Zs();return jsxRuntimeExports.jsxs(Go,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Go.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:i}),jsxRuntimeExports.jsx(c,{onClick:o})]})]}),jsxRuntimeExports.jsx(f,{}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${h&&p>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{})]})}function Ef({text:n="Notifications",counter:o,...i}){const{notificationsCount:r}=Yd();return jsxRuntimeExports.jsx(M,{text:n,size:"large",...i,children:(o??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const If="newest",Mf="oldest",Pf="severity",Tf=["None","Low","Medium","High","Critical"],Af={key:If,descending:true},Of=e=>[...e].sort((e,t)=>(t.timestamp||0)-(e.timestamp||0)),Lf=e=>[...e].sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),Ff=(e,t)=>{const n=Tf[0];return [...e].sort((e,o)=>{const i=Tf.indexOf(e.severity||n),r=Tf.indexOf(o.severity||n);return (t?-1:1)*(i-r)})},Bf={[If]:Of,[Mf]:Lf,[Pf]:Ff},Rf={severity:"Priority",newest:"Newest",oldest:"Oldest"};function _f({...t}){const[n,o]=useState([]),{NotificationsList:i,Notification:r}=vm(),{notifications:a,setCount:s,notificationsCount:l}=Yd(),{sortNotificationsBy:m,viewNotificationsBy:p,searchQuery:h}=Nf(),g=useRef(null),v=Js(h),y=useMemo(()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter(e=>"Active"===e.state||"Stale"===e.state);case "read":return e.filter(e=>"Acknowledged"===e.state||"Seen"===e.state);case "snoozed":return e.filter(e=>"Snoozed"===e.state)}})(a,p);return e.filter(e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase()))},[v,a,p]);return useEffect(()=>{switch(m){case "newest":o(Of(y));break;case "oldest":o(Lf(y));break;case "severity":o(Ff(y,true));break;default:o(y);}s(y.length);},[y,m,s]),useEffect(()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});},[v,l,m,p]),jsxRuntimeExports.jsx(Ls,{ref:g,element:Qo,elementProps:t,children:jsxRuntimeExports.jsx(i,{notifications:n,Notification:r})})}function Hf({...t}){const{FooterButtons:n}=vm();return jsxRuntimeExports.jsx(Xo,{...t,children:jsxRuntimeExports.jsx(n,{})})}function $f({className:n,...o}){const{FooterButtonClearAll:i,FooterButtonClearAllOld:r}=vm(),{notifications:a}=Yd(),[s,l]=useState(false);return useEffect(()=>{a.filter(e=>"Stale"===e.state||"Acknowledged"===e.state).length>0?l(true):l(false);},[a]),jsxRuntimeExports.jsxs(Z,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(i,{disabled:a.length<=0})]})}function jf({text:t="Clear All",...n}){const{clearAll:o}=Yd();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{o();},...n})}function zf({text:t="Clear Old",...n}){const{clearAllOld:o}=Yd();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{o();},...n})}function Vf(e){const t=Zs(),{onClose:n,settings:o}=Yd(),{isPanelVisible:i}=Nf(),{id:r,onClick:s,updateState:l}=e,c=useCallback(async()=>{if(!s)return;if(!t){try{await s({close:!0});}catch(e){console.error(e);}return void n(r)}const e=o?.toastStacking??false;let a;a=i?o?.closeNotificationOnClick??true:!e&&null;try{null!==a?await s({close:a}):(await s({close:!1}),await l("Acknowledged"));}catch(e){console.error(e);}},[t,r,i,s,n,l,o?.closeNotificationOnClick,o?.toastStacking]),u=useCallback(async e=>{const t=e.target;t.closest("button")||t.closest("[role='button']")||t.closest("a")||t.closest(".io-dropdown-menu")||await c();},[c]);return {handleClick:c,handleWrapperClick:u}}function Wf({className:n,notification:o,onClick:i,...r}){const a=x("io-notification-header",n),{HeaderCount:s,HeaderBadge:l,HeaderTitle:c,HeaderTimestamp:u,HeaderButtonSnooze:d,HeaderButtonClose:f}=sm(),{handleWrapperClick:m}=Vf(o);return jsxRuntimeExports.jsxs("div",{className:a,onClick:async e=>{await m(e),i?.(e);},...r,children:[jsxRuntimeExports.jsx(l,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o}),jsxRuntimeExports.jsx(c,{notification:o}),jsxRuntimeExports.jsx(u,{notification:o}),jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(d,{notification:o}),jsxRuntimeExports.jsx(f,{notification:o})]})]})}function Yf({notification:t,...n}){const{settings:o,notificationStacks:i}=Yd(),{isPanelVisible:r}=Nf(),{toastStacking:a,stackBy:s}=o,l="application"===s?"source":s??"source";let c=0;if(a){const e=i.find(e=>e.key===t[l]);c=e?.items.length??0;}return r||!a||c<=1?null:jsxRuntimeExports.jsx(ei,{...n,children:c>9?"9+":c})}function Uf({className:t,notification:n,...o}){if(!n?.severity||"None"===n.severity)return null;const i=x("io-notification-header-badge",t);return jsxRuntimeExports.jsx(ei,{className:i,...o,children:n.severity})}function Kf({className:n,state:o,severity:i="None",icon:r,...a}){const s=x("io-notification-header-icon",n),{isPanelVisible:l}=Nf();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${i.toLowerCase()}`,children:l&&"Acknowledged"!==o&&"New"})]})}function Jf({className:t,notification:{appTitle:n},...o}){const i=x("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})}function qf({className:t,notification:{timestamp:n,state:o,snooze:i},...r}){const a=x("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",i&&"Snoozed"===o?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:zu(n??0)??"Just Now"})}function Gf({notification:{id:t,state:n},...o}){const{settings:i,snooze:r}=Yd(),s=useCallback(e=>{e.stopPropagation(),r&&r(t,i.snooze?.duration??0);},[t,r,i.snooze?.duration]);return r&&"Snoozed"!==n&&i.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...o}):null}function Qf({notification:{id:t,updateState:n},...o}){const i=Zs(),{onClose:r}=Yd(),{isPanelVisible:s}=Nf(),l=useCallback(e=>{e.stopPropagation(),!i||s?r(t):n("Acknowledged").catch(console.error);},[i,t,r,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",tabIndex:-1,onClick:l,...o})}function Xf({className:n,notification:o,...i}){const r=x("io-notification-body",n),{BodyIcon:a,BodyTitle:s,BodyDescription:l}=sm(),{icon:c,title:u,body:d}=o,{handleClick:f}=Vf(o);return jsxRuntimeExports.jsxs("div",{className:r,role:"button",tabIndex:0,onKeyDown:async e=>{T(e)&&await f();},onClick:f,...i,children:[jsxRuntimeExports.jsx(a,{icon:c}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(s,{text:u}),jsxRuntimeExports.jsx(l,{text:d})]})]})}function Zf({className:t,icon:n,altText:o="notification icon",...i}){if(!n)return null;const r=x("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx("img",{src:n,alt:o})})}function em({text:t,...n}){return jsxRuntimeExports.jsx(M,{text:t,...n})}function tm({className:t,text:n,...o}){const i=x("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:i,...o,children:n})}function nm({className:n,notification:o}){const i=x("io-notification-footer",n),{FooterButton:r}=sm(),{handleWrapperClick:a}=Vf(o),s=useMemo(()=>function(e){const t=[],n={};if(!e)return;e.forEach(e=>{const{displayId:o,displayPath:i}=e,r={...e,children:[]};if(i&&i.length>0){let e;i.forEach((t,o)=>{0===o?e=n[t]:e&&(e=e.children?.find(e=>e.displayId===t));}),e&&e.children?.push(r);}else o?(t.push(r),n[o]=r):t.push(r);o&&(n[o]=r);});const o=e=>{e.forEach(e=>{0===e.children?.length?delete e.children:e.children&&o(e.children);});};return o(t),t}(o.actions),[o.actions]),l=(t,n)=>t.children?jsxRuntimeExports.jsx(Ko,{text:t.title,children:t.children.map(l)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Ko.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:i,onClick:a,children:jsxRuntimeExports.jsx(Z,{align:"right",children:s?.map((n,o)=>n.children?jsxRuntimeExports.jsxs(Z,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default"}),jsxRuntimeExports.jsx(Ko,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(l)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link"},`${n.title}-${o}`))})})}function om({notificationAction:t,...n}){const o=useCallback(e=>{e.stopPropagation(),t.onClick({close:true});},[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:o,...n})}const im={Header:Wf,HeaderCount:Yf,HeaderBadge:Uf,HeaderIcon:Kf,HeaderTitle:Jf,HeaderTimestamp:qf,HeaderButtonSnooze:Gf,HeaderButtonClose:Qf,Body:Xf,BodyIcon:Zf,BodyTitle:em,BodyDescription:tm,Footer:nm,FooterButton:om},rm=createContext(im),am=memo(({children:t,components:n})=>{const o=useMemo(()=>({...im,...n}),[n]);return jsxRuntimeExports.jsx(rm.Provider,{value:o,children:t})});function sm(e){return {...useContext(rm),...e}}function lm({className:n,notification:o,...i}){const{Header:r,Body:a,Footer:s}=sm(),{severity:l}=o,c=x("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==o.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...i,children:[jsxRuntimeExports.jsx(r,{notification:o}),jsxRuntimeExports.jsx(a,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o})]})}function cm({components:t,notification:n,...o}){return jsxRuntimeExports.jsx(am,{components:t,children:jsxRuntimeExports.jsx(lm,{notification:n,...o})})}function um({className:n,notifications:o,...i}){const[r,s]=useState(false),l=o.length>=3?"large":"normal",u=2===o.length?"small":l,d=o[0].severity,f=x("io-notification-stack",r&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=useCallback(()=>{s(true);},[]),p=useCallback(e=>{e.stopPropagation(),o.forEach(e=>{e.close();});},[o]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...i,children:[r&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>p(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear Stack"})})}),o.map(t=>jsxRuntimeExports.jsx(cm,{notification:t},t.id))]})}function dm({...t}){const{notificationStacks:o}=Yd();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:o.map(n=>jsxRuntimeExports.jsx(um,{notifications:n.items,...t},n.key))})}am.displayName="ComponentsStoreProvider";const fm=({notification:n,Notification:o,...i})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=Yd(),{isPanelVisible:c,isBulkActionsVisible:u}=Nf(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,p=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:x("io-notification-list-bulk-action-item",{selected:p}),children:[jsxRuntimeExports.jsx(_s,{checked:p,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(o,{notification:n,...i})]}):jsxRuntimeExports.jsx(o,{notification:n,...i})};function mm({className:n,Notification:o,notifications:i=[],noNotificationText:r="No notifications to display",...a}){const s=x("io-notification-list",n),{settings:l}=Yd(),{isPanelVisible:c}=Nf(),{toastStacking:u}=l,d=u&&!c,f=i.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(dm,{}),!d&&(f?i.map(t=>jsxRuntimeExports.jsx(fm,{notification:t,Notification:o,...a},t.id)):jsxRuntimeExports.jsx("div",{className:"io-notification-list-no-notifications",children:r}))]})}const pm={Header:Df,HeaderCaptionTitle:Ef,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:o=0}=Yd();return 0===o?null:jsxRuntimeExports.jsx(I,{variant:t,...n,children:o>99?"99+":o})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:o="circle",...i}){return Zs()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,...i}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const{hidePanel:a}=Yd(),s=Zs();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):s&&a();},...r})},HeaderActions:function({className:n,...o}){const i=x("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=vm();return jsxRuntimeExports.jsxs("div",{className:i,...o,children:[jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...o}){const{sortNotificationsBy:i,setSortBy:r}=Nf(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Yd(),[t,n]=useState(Af),{key:o,descending:i}=t,r=useMemo(()=>Bf[o](e,i),[e,o,i]),s=useCallback(e=>{n(t=>({key:e,descending:t.key!==e?Af.descending:!t.descending}));},[]);return {onNotificationsSort:s,sortedNotifications:r}})();return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(X.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:Rf[i].toLowerCase()})]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Priority"].map(t=>{const n="Priority"===t?"severity":t.toLowerCase();return jsxRuntimeExports.jsx(X.Item,{isSelected:i===n,onClick:()=>{r(n),s(n);},children:t},t)})})})]})},HeaderActionView:function({text:n="View",...o}){const{settings:i}=Yd(),{viewNotificationsBy:r,setViewBy:a}=Nf(),s=i.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(X.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",checkIcon:"check",children:s.map(t=>jsxRuntimeExports.jsx(X.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:o,notificationsCount:i}=Yd();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:o,disabled:0===i,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:o,notificationsCount:i}=Yd(),{showBulkActions:r}=Nf();return o?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===i,...n}):null},HeaderBulkActions:function({className:n,...o}){const i=x("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=vm(),{isBulkActionsSupported:f}=Yd();return f?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:o,selectAllNotifications:i,notificationsCount:r}=Yd();return n?jsxRuntimeExports.jsx(_s,{checked:r===o.length&&r>0,onChange:e=>i("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:o,selectAllNotifications:i,notificationsCount:r}=Yd();return o?jsxRuntimeExports.jsxs(X,{variant:"light",...n,children:[jsxRuntimeExports.jsx(X.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(B,{children:jsxRuntimeExports.jsxs(X.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(X.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>i(t.toLowerCase(),true),children:t},t))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:o="circle",tooltip:i="Mark as read",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Yd(),d=useCallback(()=>{c(l,"Seen");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:o="circle",tooltip:i="Mark as unread",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Yd(),d=useCallback(()=>{c(l,"Active");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:o="circle",tooltip:i="Snooze",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=Yd(),f=useCallback(()=>{c(l,u.snooze?.duration??0);},[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:f,disabled:0===d,...r}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:o="circle",tooltip:i="Clear",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=Yd(),d=useCallback(()=>{c(l);},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...o}){const{isBulkActionsSupported:i,notificationsCount:r}=Yd(),{hideBulkActions:a}=Nf();return i?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...o}):null},HeaderSearch:function({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=x("io-panel-header-search",n),c=useRef(null),{notificationsCount:u}=Yd(),{searchQuery:f,setSearch:m}=Nf(),p=f.length>0,h=useCallback(()=>{m(""),c.current&&c.current.focus();},[m]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Bs,{ref:c,value:f,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?h:void 0,placeholder:o,onChange:e=>m(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${u} results`})]})},Body:_f,Footer:Hf,FooterButtons:$f,FooterButtonClearAll:jf,FooterButtonClearAllOld:zf,Notification:cm,NotificationsList:mm},hm=createContext(pm),gm=memo(({children:t,components:n})=>{const o=useMemo(()=>({...pm,...n}),[n]);return jsxRuntimeExports.jsx(hm.Provider,{value:o,children:t})});function vm(e){return {...useContext(hm),...e}}gm.displayName="ComponentsStoreProvider";const bm={Body:function({className:t,notifications:n,maxToasts:o=1,...i}){const r=x("io-toasts-body",t),{NotificationsList:a,Notification:s}=xm(),[l,u]=useState([]);return useEffect(()=>{const e=o<0?n.length:o,t=n.filter(e=>"Active"===e.state).slice(0,e);for(const e of t)e.onShow();u(t);},[n,o]),jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:l,noNotificationText:""})})},Notification:cm,NotificationsList:mm},Cm=createContext(bm),km=memo(({children:t,components:n})=>{const o=useMemo(()=>({...bm,...n}),[n]);return jsxRuntimeExports.jsx(Cm.Provider,{value:o,children:t})});function xm(e){return {...useContext(Cm),...e}}km.displayName="ComponentsStoreProvider";const Em=n=>{const{General:o,Layouts:i,Downloads:r,System:a}=Bp();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},Im=({title:n="General",...o})=>{const{Theme:i,PinnedPosition:r,MinimizeToTray:a,ShowTutorialOnStartup:s}=Bp();return jsxRuntimeExports.jsxs(P,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},Mm=({className:n,title:o="Theme",...i})=>{const{currentTheme:r,selectTheme:a}=el(),s=(()=>{const e=useContext(IOConnectContext),[t,n]=useState([]);return useEffect(()=>{e&&e.themes?.list().then(n).catch(console.warn);},[e]),t})();return jsxRuntimeExports.jsxs("div",{className:x("flex jc-between ai-center",n),"data-testid":"theme-container",...i,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper","data-testid":"theme-label",children:o}),jsxRuntimeExports.jsxs(X,{variant:"light","data-testid":"theme-dropdown",children:[jsxRuntimeExports.jsx(X.Button,{text:r?.displayName??"Dark","data-testid":"theme-dropdown-button"}),jsxRuntimeExports.jsx(X.Content,{"data-testid":"theme-dropdown-content",children:jsxRuntimeExports.jsx(X.List,{children:s.map(({displayName:t,name:n})=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>a(n),"data-testid":`theme-dropdown-item-${n}`,children:t},n))})})]})]})},Pm=({prefKey:n,options:o,disabled:i,...r})=>{const{isLoading:a,value:s="Select option",update:l}=au({prefKey:n});return jsxRuntimeExports.jsxs(X,{variant:"light",disabled:a||i,...r,children:[jsxRuntimeExports.jsx(X.Button,{children:s}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{children:o.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t))})})]})},Tm=({className:n,label:o="Pinned position",...i})=>jsxRuntimeExports.jsx(P,{className:x("io-block-list-gap",n),...i,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(Pm,{className:n,prefKey:dl,options:["Left","Right"],...i})]})}),Am=({prefKey:t,...n})=>{const{isLoading:o,value:i=false,update:r}=au({prefKey:t});return jsxRuntimeExports.jsx(Ys,{checked:i,disabled:o,onChange:e=>r(e.target.checked),...n})},Om=({align:t="right",label:n="Allow docking",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:fl,...o}),Lm=({align:t="right",label:n="Minimize to tray",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:ml,...o}),Fm=({align:t="right",label:n="Auto-close on starting apps and workspaces",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:pl,disabled:true,...o}),Bm=({align:t="right",label:n="Show tutorial on startup",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:hl,...o}),Rm=({title:n="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:i,LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Bp();return jsxRuntimeExports.jsxs(P,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},_m=({align:t="right",label:n="Restore last saved on startup",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:gl,...o}),Hm=({align:t="right",label:n="Save current on exit",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:vl,...o}),$m=({align:t="right",label:n="Show prompt for unsaved changes",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:yl,"data-testid":"layouts-show-unsaved-changes-prompt-toggle-button",...o}),jm=({align:t="right",label:n="Show prompt for deleting",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:wl,"data-testid":"layouts-show-delete-prompt-toggle",...o}),zm=({className:t,title:n="Downloads",...o})=>{const{DownloadsLocation:i}=Bp();return jsxRuntimeExports.jsx(P,{className:x("io-block-list-gap",t),title:n,...o,children:jsxRuntimeExports.jsx(i,{})})},Vm=({align:t="right",label:n="Ask where to save each file before downloading",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:bl,...o}),Wm=({className:n,label:o="Location",...i})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=Fu();return jsxRuntimeExports.jsxs(P,{className:x("io-preferences-download-section",n),...i,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Ym=({className:n,title:o="System",...i})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Bp();return jsxRuntimeExports.jsxs(P,{className:x("io-block-list-gap",n),title:o,...i,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Um=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Km={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Jm={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},qm=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},Gm=function(e){return  true===e?1:0};function Qm(e,t){var n;return function(){var o=this,i=arguments;clearTimeout(n),n=setTimeout(function(){return e.apply(o,i)},t);}}var Xm=function(e){return e instanceof Array?e:[e]};function Zm(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function ep(e,t,n){var o=window.document.createElement(e);return t=t||"",n=n||"",o.className=t,void 0!==n&&(o.textContent=n),o}function tp(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function np(e,t){return t(e)?e:e.parentNode?np(e.parentNode,t):void 0}function op(e,t){var n=ep("div","numInputWrapper"),o=ep("input","numInput "+e),i=ep("span","arrowUp"),r=ep("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?o.type="number":(o.type="text",o.pattern="\\d*"),void 0!==t)for(var a in t)o.setAttribute(a,t[a]);return n.appendChild(o),n.appendChild(i),n.appendChild(r),n}function ip(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var rp=function(){},ap=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},sp={D:rp,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*Gm(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var o=parseInt(t),i=new Date(e.getFullYear(),0,2+7*(o-1),0,0,0,0);return i.setDate(i.getDate()-i.getDay()+n.firstDayOfWeek),i},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:rp,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:rp,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},lp={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},cp={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[cp.w(e,t,n)]},F:function(e,t,n){return ap(cp.n(e,t,n)-1,false,t)},G:function(e,t,n){return qm(cp.h(e,t,n))},H:function(e){return qm(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[Gm(e.getHours()>11)]},M:function(e,t){return ap(e.getMonth(),true,t)},S:function(e){return qm(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return qm(e.getFullYear(),4)},d:function(e){return qm(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return qm(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return qm(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},up=function(e){var t=e.config,n=void 0===t?Km:t,o=e.l10n,i=void 0===o?Jm:o,r=e.isMobile,a=void 0!==r&&r;return function(e,t,o){var r=o||i;return void 0===n.formatDate||a?t.split("").map(function(t,o,i){return cp[t]&&"\\"!==i[o-1]?cp[t](e,r,n):"\\"!==t?t:""}).join(""):n.formatDate(e,t,r)}},dp=function(e){var t=e.config,n=void 0===t?Km:t,o=e.l10n,i=void 0===o?Jm:o;return function(e,t,o,r){if(0===e||e){var a,s=r||i,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||Km).dateFormat,u=String(e).trim();if("today"===u)a=new Date,o=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,p=0,h="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(lp[g]&&!y){h+=lp[g];var w=new RegExp(h).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:sp[g],val:w[++p]});}else v||(h+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach(function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a}),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===o&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function fp(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var mp=function(e,t,n){return 3600*e+60*t+n},pp=864e5;function hp(e){var t=e.defaultHour,n=e.defaultMinute,o=e.defaultSeconds;if(void 0!==e.minDate){var i=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<i&&(t=i),t===i&&n<r&&(n=r),t===i&&n===r&&o<a&&(o=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(o=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:o}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var o=function(t){t&&Object.keys(t).forEach(function(n){return e[n]=t[n]});},i=0,r=t;i<r.length;i++){o(r[i]);}return e});var gp=function(){return gp=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},gp.apply(this,arguments)},vp=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var o=Array(e),i=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,i++)o[i]=r[a];return o};function yp(e,t){var n={config:gp(gp({},Km),bp.defaultConfig),l10n:Jm};function o(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function i(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame(function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}});}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||fp(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),o=hp(n.config);t.setHours(o.hours,o.minutes,o.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,o=ip(e),i=o;void 0!==n.amPM&&o===n.amPM&&(n.amPM.textContent=n.l10n.amPM[Gm(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(i.getAttribute("min")),a=parseFloat(i.getAttribute("max")),s=parseFloat(i.getAttribute("step")),l=parseInt(i.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==i.value&&2===i.value.length){var d=i===n.hourElement,f=i===n.minuteElement;u<r?(u=a+u+Gm(!d)+(Gm(d)&&Gm(!n.amPM)),f&&h(void 0,-1,n.hourElement)):u>a&&(u=i===n.hourElement?u-a-Gm(!n.amPM):r,f&&h(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[Gm(n.amPM.textContent===n.l10n.amPM[0])]),i.value=qm(u);}}(e);var i=n._input.value;s(),Z(),n._input.value!==i&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,o=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,i=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=o,t=n.amPM.textContent,o=e%12+12*Gm(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===fp(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===fp(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=mp(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=mp(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=mp(o,i,r);if(d>u&&d<l){var f=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]}(l);o=f[0],i=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(o=Math.min(o,m.getHours()))===m.getHours()&&(i=Math.min(i,m.getMinutes())),i===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var p=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(o=Math.max(o,p.getHours()))===p.getHours()&&i<p.getMinutes()&&(i=p.getMinutes()),i===p.getMinutes()&&(r=Math.max(r,p.getSeconds()));}}c(o,i,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,o){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,o||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=qm(n.config.time_24hr?e:(12+e)%12+12*Gm(e%12==0)),n.minuteElement.value=qm(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[Gm(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=qm(o)));}function u(e){var t=ip(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&P(n);}function d(e,t,o,i){return t instanceof Array?t.forEach(function(t){return d(e,t,o,i)}):e instanceof Array?e.forEach(function(e){return d(e,t,o,i)}):(e.addEventListener(t,o,i),void n._handlers.push({remove:function(){return e.removeEventListener(t,o,i)}}))}function f(){J("onChange");}function m(e,t){var o=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),i=n.currentYear,r=n.currentMonth;try{void 0!==o&&(n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth());}catch(e){e.message="Invalid date supplied: "+o,n.config.errorHandler(e);}t&&n.currentYear!==i&&(J("onYearChange"),k()),!t||n.currentYear===i&&n.currentMonth===r||J("onMonthChange"),n.redraw();}function p(e){var t=ip(e);~t.className.indexOf("arrow")&&h(e,t.classList.contains("arrowUp")?1:-1);}function h(e,t,n){var o=e&&ip(e),i=n||o&&o.parentNode&&o.parentNode.firstChild,r=q("increment");r.delta=t,i&&i.dispatchEvent(r);}function g(e,t,o,i){var r=T(t,true),a=ep("span",e,t.getDate().toString());return a.dateObj=t,a.$i=i,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===fp(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Zm(a,"startRange",n.selectedDates[0]&&0===fp(t,n.selectedDates[0],true)),Zm(a,"endRange",n.selectedDates[1]&&0===fp(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(fp(e,n.selectedDates[0])>=0&&fp(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&i%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),J("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,o=e>0?n.config.showMonths:-1,i=t;i!=o;i+=e)for(var r=n.daysContainer.children[i],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function w(e,t){var i=o(),r=A(i||document.body),a=void 0!==e?e:r?i:void 0!==n.selectedDateElem&&A(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&A(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var o=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,i=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=o-n.currentMonth;a!=i;a+=r)for(var s=n.daysContainer.children[a],l=o-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var o=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,i=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=i+1-o,d=0;u<=i;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-o&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=ep("div","dayContainer");return m.appendChild(a),m}function C(){if(void 0!==n.daysContainer){tp(n.daysContainer),n.weekNumbers&&tp(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var o=new Date(n.currentYear,n.currentMonth,1);o.setMonth(n.currentMonth+t),e.appendChild(b(o.getFullYear(),o.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function k(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var o=ep("option","flatpickr-monthDropdown-month");o.value=new Date(n.currentYear,t).getMonth().toString(),o.textContent=ap(t,n.config.shorthandCurrentMonth,n.l10n),o.tabIndex=-1,n.currentMonth===t&&(o.selected=true),n.monthsDropdownContainer.appendChild(o);}}}function x(){var e,t=ep("div","flatpickr-month"),o=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=ep("span","cur-month"):(n.monthsDropdownContainer=ep("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",function(e){var t=ip(e),o=parseInt(t.value,10);n.changeMonth(o-n.currentMonth),J("onMonthChange");}),k(),e=n.monthsDropdownContainer);var i=op("cur-year",{tabindex:"-1"}),r=i.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=ep("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(i),o.appendChild(a),t.appendChild(o),{container:t,yearElement:r,monthElement:e}}function S(){tp(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=x();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function N(){n.weekdayContainer?tp(n.weekdayContainer):n.weekdayContainer=ep("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=ep("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=vp(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=vp(t.splice(e,t.length),t.splice(0,e)));for(var o=n.config.showMonths;o--;)n.weekdayContainer.children[o].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var o=t?e:e-n.currentMonth;o<0&&true===n._hidePrevMonthArrow||o>0&&true===n._hideNextMonthArrow||(n.currentMonth+=o,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,J("onYearChange"),k()),C(),J("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function M(e){if(n.isOpen&&!n.config.inline){var t=ip(e),o=I(t),i=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!o&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some(function(e){return e.contains(t)});i&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function P(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,o=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),o&&(n.redraw(),J("onYearChange"),k());}}function T(e,t){var o;void 0===t&&(t=true);var i=n.parseDate(e,void 0,t);if(n.config.minDate&&i&&fp(i,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&i&&fp(i,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===i)return  false;for(var r=!!n.config.enable,a=null!==(o=n.config.enable)&&void 0!==o?o:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(i))return r;if(l instanceof Date&&void 0!==i&&l.getTime()===i.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===i.getTime()?r:!r}if("object"==typeof l&&void 0!==i&&l.from&&l.to&&i.getTime()>=l.from.getTime()&&i.getTime()<=l.to.getTime())return r}return !r}function A(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function O(e){var t=e.target===n._input,o=n._input.value.trimEnd()!==X();!t||!o||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function L(t){var i=ip(t),r=n.config.wrap?e.contains(i):i===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,i===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),i.blur();n.open();}else if(I(i)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(i);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),z()):V(t);break;case 27:t.preventDefault(),z();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=o();if(void 0!==n.daysContainer&&(false===l||f&&A(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var p=40===t.keyCode?1:-1;n.daysContainer&&void 0!==i.$i||i===n.input||i===n.altInput?t.ctrlKey?(t.stopPropagation(),P(n.currentYear-p),w(y(1),0)):d||w(void 0,7*p):i===n.currentYearElement?P(n.currentYear-p):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var h=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter(function(e){return e}),g=h.indexOf(i);if(-1!==g){var v=h[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(i)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&i===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(i))&&J("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var o=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),i=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(o,n.selectedDates[0].getTime()),a=Math.max(o,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=pp)T(new Date(u),true)||(s=s||u>r&&u<a,u<i&&(!l||u>l)?l=u:u>i&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach(function(t){var r,a,u,d=t.dateObj.getTime(),f=l>0&&d<l||c>0&&d>c;if(f)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach(function(e){t.classList.remove(e);});s&&!f||(["startRange","inRange","endRange","notAllowed"].forEach(function(e){t.classList.remove(e);}),void 0!==e&&(e.classList.add(o<=n.selectedDates[0].getTime()?"startRange":"endRange"),i<o&&d===i?t.classList.add("startRange"):i>o&&d===i&&t.classList.add("endRange"),d>=l&&(0===c||d<=c)&&(a=i,u=o,(r=d)>Math.min(a,u)&&r<Math.max(a,u))&&t.classList.add("inRange")));});}}function B(){!n.isOpen||n.config.static||n.config.inline||$();}function R(e){return function(t){var o=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),i=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==o&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=o.getHours()>0||o.getMinutes()>0||o.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter(function(e){return T(e)}),n.selectedDates.length||"min"!==e||l(o),Z()),n.daysContainer&&(j(),void 0!==o?n.currentYearElement[e]=o.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!i&&void 0!==o&&i.getFullYear()===o.getFullYear());}}function _(){return n.config.wrap?e.querySelector("[data-input]"):e}function H(){"object"!=typeof n.config.locale&&void 0===bp.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=gp(gp({},bp.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?bp.l10ns[n.config.locale]:void 0),lp.D="("+n.l10n.weekdays.shorthand.join("|")+")",lp.l="("+n.l10n.weekdays.longhand.join("|")+")",lp.M="("+n.l10n.months.shorthand.join("|")+")",lp.F="("+n.l10n.months.longhand.join("|")+")",lp.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===gp(gp({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===bp.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=up(n),n.parseDate=dp({config:n.config,l10n:n.l10n});}function $(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){J("onPreCalendarPosition");var t=e||n._positionElement,o=Array.prototype.reduce.call(n.calendarContainer.children,function(e,t){return e+t.offsetHeight},0),i=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<o&&l.top>o,d=window.pageYOffset+l.top+(u?-o-2:t.offsetHeight+2);if(Zm(n.calendarContainer,"arrowTop",!u),Zm(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,p=false;"center"===s?(f-=(i-l.width)/2,m=true):"right"===s&&(f-=i-l.width,p=true),Zm(n.calendarContainer,"arrowLeft",!m&&!p),Zm(n.calendarContainer,"arrowCenter",m),Zm(n.calendarContainer,"arrowRight",p);var h=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+i>window.document.body.offsetWidth,v=h+i>window.document.body.offsetWidth;if(Zm(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(o=document.createElement("style"),document.head.appendChild(o),o.sheet);var o;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-i/2),C=y.cssRules.length,k="{left:"+l.left+"px;right:auto;}";Zm(n.calendarContainer,"rightMost",false),Zm(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+k,C),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=h+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function j(){n.config.noCalendar||n.isMobile||(k(),Q(),C());}function z(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=np(ip(e),function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")});if(void 0!==t){var o=t,i=n.latestSelectedDateObj=new Date(o.dateObj.getTime()),r=(i.getMonth()<n.currentMonth||i.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=o,"single"===n.config.mode)n.selectedDates=[i];else if("multiple"===n.config.mode){var a=G(i);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(i);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=i,n.selectedDates.push(i),0!==fp(i,n.selectedDates[0],true)&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()}));if(s(),r){var l=n.currentYear!==i.getFullYear();n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth(),l&&(J("onYearChange"),k()),J("onMonthChange");}if(Q(),C(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(o),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&z();}f();}}n.parseDate=dp({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=$,n.changeMonth=E,n.changeYear=P,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var o=hp(n.config);c(o.hours,o.minutes,o.seconds);}n.redraw(),e&&J("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));J("onClose");},n.onMouseOver=F,n._createElement=ep,n.createDay=g,n.destroy=function(){ void 0!==n.config&&J("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach(function(e){try{delete n[e];}catch(e){}});},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var o=ip(e);o&&o.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void J("onOpen")}if(n._input.disabled||n.config.inline)return;var i=n.isOpen;n.isOpen=true,i||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),J("onOpen"),$(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout(function(){return n.hourElement.select()},50));},n.redraw=j,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var o in Object.assign(n.config,e),e) void 0!==W[o]&&W[o].forEach(function(e){return e()});else n.config[e]=t,void 0!==W[e]?W[e].forEach(function(e){return e()}):Um.indexOf(e)>-1&&(n.config[e]=Xm(t));n.redraw(),Z(true);},n.setDate=function(e,t,o){ void 0===t&&(t=false);void 0===o&&(o=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);Y(e,o),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&J("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var W={locale:[H,D],showMonths:[S,r,N],minDate:[m],maxDate:[m],positionElement:[K],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function Y(e,t){var o=[];if(e instanceof Array)o=e.map(function(e){return n.parseDate(e,t)});else if(e instanceof Date||"number"==typeof e)o=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":o=[n.parseDate(e,t)];break;case "multiple":o=e.split(n.config.conjunction).map(function(e){return n.parseDate(e,t)});break;case "range":o=e.split(n.l10n.rangeSeparator).map(function(e){return n.parseDate(e,t)});}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?o:o.filter(function(e){return e instanceof Date&&T(e,false)}),"range"===n.config.mode&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()});}function U(e){return e.slice().map(function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e}).filter(function(e){return e})}function K(){n._positionElement=n.config.positionElement||n._input;}function J(e,t){if(void 0!==n.config){var o=n.config[e];if(void 0!==o&&o.length>0)for(var i=0;o[i]&&i<o.length;i++)o[i](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(q("change")),n.input.dispatchEvent(q("input")));}}function q(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var o=n.selectedDates[t];if(o instanceof Date&&0===fp(o,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach(function(e,t){var o=new Date(n.currentYear,n.currentMonth,1);o.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=ap(o.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=o.getMonth().toString(),e.value=o.getFullYear().toString();}),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map(function(e){return n.formatDate(e,t)}).filter(function(e,t,o){return "range"!==n.config.mode||n.config.enableTime||o.indexOf(e)===t}).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&J("onValueUpdate");}function ee(e){var t=ip(e),o=n.prevMonthNav.contains(t),i=n.nextMonthNav.contains(t);o||i?E(o?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var o=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=gp(gp({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=U(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=U(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=bp.defaultConfig.dateFormat||Km.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=bp.defaultConfig.altFormat||Km.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:R("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:R("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<o.length;d++)n.config[o[d]]=true===n.config[o[d]]||"true"===n.config[o[d]];Um.filter(function(e){return void 0!==n.config[e]}).forEach(function(e){n.config[e]=Xm(n.config[e]||[]).map(i);}),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Um.indexOf(m)>-1?n.config[m]=Xm(f[m]).map(i).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=_().className+" "+n.config.altInputClass);J("onParseConfig");}(),H(),function(){if(n.input=_(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=ep(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");K();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&Y(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=ep("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=ep("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=ep("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=ep("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,S(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Zm(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Zm(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=ep("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=ep("div","flatpickr-weekwrapper");e.appendChild(ep("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=ep("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),o=t.weekWrapper,i=t.weekNumbers;n.innerContainer.appendChild(o),n.weekNumbers=i,n.weekWrapper=o;}n.rContainer=ep("div","flatpickr-rContainer"),n.rContainer.appendChild(N()),n.daysContainer||(n.daysContainer=ep("div","flatpickr-days"),n.daysContainer.tabIndex=-1),C(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=hp(n.config);n.timeContainer=ep("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=ep("span","flatpickr-time-separator",":"),o=op("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=o.getElementsByTagName("input")[0];var i=op("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=i.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(o),n.timeContainer.appendChild(t),n.timeContainer.appendChild(i),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=op("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(ep("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=ep("span","flatpickr-am-pm",n.l10n.amPM[Gm((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Zm(n.calendarContainer,"rangeMode","range"===n.config.mode),Zm(n.calendarContainer,"animate",true===n.config.animate),Zm(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=ep("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach(function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),function(t){return d(t,"click",n[e])});});if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=ep("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",function(e){n.setDate(ip(e).value,false,n.mobileFormatStr),J("onChange"),J("onClose");});}();var e=Qm(B,50);n._debouncedChange=Qm(f,300),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",function(e){"range"===n.config.mode&&F(ip(e));});d(n._input,"keydown",L),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",L);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",M):d(window.document,"mousedown",M);d(window.document,"focus",M,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return ip(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",p),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",function(){return n.secondElement&&n.secondElement.select()}),void 0!==n.amPM&&d(n.amPM,"click",function(e){a(e);});}n.config.allowInput&&d(n._input,"blur",O);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var o=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&o&&$(),J("onReady");}(),n}function wp(e,t){for(var n=Array.prototype.slice.call(e).filter(function(e){return e instanceof HTMLElement}),o=[],i=0;i<n.length;i++){var r=n[i];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=yp(r,t||{}),o.push(r._flatpickr);}catch(e){console.error(e);}}return 1===o.length?o[0]:o}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return wp(this,e)},HTMLElement.prototype.flatpickr=function(e){return wp([this],e)});var bp=function(e,t){return "string"==typeof e?wp(window.document.querySelectorAll(e),t):e instanceof Node?wp([e],t):wp(e,t)};bp.defaultConfig={},bp.l10ns={en:gp({},Jm),default:gp({},Jm)},bp.localize=function(e){bp.l10ns.default=gp(gp({},bp.l10ns.default),e);},bp.setDefaults=function(e){bp.defaultConfig=gp(gp({},bp.defaultConfig),e);},bp.parseDate=dp({}),bp.formatDate=up({}),bp.compareDates=fp,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return wp(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=bp);const Cp=["onCreate","onDestroy"],kp=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],xp=t=>{const n=useMemo(()=>({...t}),[t]),{defaultValue:o,options:i={},value:r,children:s,render:l,onCreate:c,onDestroy:p}=n,h=useMemo(()=>((e,t)=>(kp.forEach(n=>{const o=t[n],i=e[n];if(o){i&&!Array.isArray(i)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(o)?o:[o];0===e[n].length?e[n]=t:e[n].push(...t);}}),kp.forEach(e=>{delete t[e];}),Cp.forEach(e=>{delete t[e];}),e))(i,n),[i,n]),g=useRef(null),v=useRef(void 0);useImperativeHandle(t.ref,()=>({get flatpickr(){return v.current}}),[]),useEffect(()=>((()=>{var e;h.onClose=h.onClose||(()=>{var e;null!=(e=g.current)&&e.blur&&g.current.blur();}),v.current=((null==(e=bp)?void 0:e.default)||bp)(g.current,h),null==c||c(v.current);})(),()=>{null==p||p(v.current),v.current&&v.current.destroy(),v.current=void 0;}),[h,c,p]),useEffect(()=>{var e;if(v.current){const t=Object.getOwnPropertyNames(h);for(let n=t.length-1;n>=0;n--){const o=t[n];let i=h[o];(null==i?void 0:i.toString())!==(null==(e=v.current.config[o])?void 0:e.toString())&&(kp.includes(o)&&!Array.isArray(i)&&(i=[i]),v.current.set(o,i));} void 0!==r&&r!==v.current.input.value&&v.current.setDate(r,false);}},[h,r]);const y=useCallback(e=>{g.current=e;},[]);if(l)return l({...n,defaultValue:o,value:r},y);const w=useCallback(e=>{var n,o;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach(()=>[new Date(e.target.value)],(null==r?void 0:r.toString())||""):"function"==typeof t.onChange&&(null==(o=null==t?void 0:t.onChange)||o.call(t,[new Date(e.target.value)],(null==r?void 0:r.toString())||"",v.current)));},[t,r]);return i.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:y,children:s}):jsxRuntimeExports.jsx("input",{onChange:w,...n,value:null==r?void 0:r.toString(),defaultValue:o,ref:y})},Sp="T42.GD.Execute",Np=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Dp=(e,t)=>e in t;function Ep({time:e,frequency:t,day:n}){const o=new Date(`01/01/2000 ${e}`),i=o.getMinutes(),r=o.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!Dp(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${i} ${r} * * ${a}`}function Ip(e){const t=useContext(IOConnectContext),{value:n,update:o}=au({prefKey:Mp(e)}),{value:i,update:r}=au({prefKey:Mp(e,"Time")}),{value:s,update:c}=au({prefKey:Mp(e,"Frequency")}),{value:u,update:d}=au({prefKey:Mp(e,"Day")}),m=useCallback(async()=>{try{await t.interop.invoke(Sp,{command:`cancel-${e}`});}catch(e){console.error(e);}},[t,e]),p=useCallback(async()=>{try{const n=Ep({time:i??"12:00 AM",frequency:s??"daily",day:"weekly"===s?u:"*"});await t.interop.invoke(Sp,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}},[t,e,i,s,u]);useEffect(()=>{t&&n&&p();},[t,n,p]);return {enabled:n??false,time:i??"12:00 AM",frequency:s??"daily",day:u??"Monday",setEnabled:async e=>{e||await m();try{await o(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await r(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await d(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,Np.includes(t))try{await d(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function Mp(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function Pp({className:n,variant:o,...i}){const r=x("io-block-list-gap",o,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=Ip(o);return jsxRuntimeExports.jsxs(P,{className:r,...i,children:[jsxRuntimeExports.jsx(Ys,{label:`Schedule ${o}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(S,{variant:"clock"}),jsxRuntimeExports.jsx(xp,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(Ko,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(Ko,{text:c,icon:"chevron-down",iconRight:true,children:Np.map(t=>jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>m(t),children:t},t))})]})]})}function Tp({className:t,...n}){return jsxRuntimeExports.jsx(Pp,{...n,className:t,variant:"restart"})}function Ap({className:t,...n}){return jsxRuntimeExports.jsx(Pp,{...n,className:t,variant:"shutdown"})}const Op={Body:Em,General:Im,Theme:Mm,PinnedPosition:Tm,AllowDocking:Om,MinimizeToTray:Lm,AutoClose:Fm,ShowTutorialOnStartup:Bm,Layouts:Rm,LayoutsRestoreLastSaved:_m,LayoutsSaveCurrentOnExit:Hm,LayoutsShowUnsavedChangesPrompt:$m,LayoutsShowDeletePrompt:jm,Downloads:zm,DownloadsAskForEachDownload:Vm,DownloadsLocation:Wm,System:Ym,SystemRestartSection:Tp,SystemShutdownSection:Ap},Lp=createContext(Op),Fp=memo(({children:t,components:n})=>{const o=useMemo(()=>({...Op,...n}),[n]);return jsxRuntimeExports.jsx(Lp.Provider,{value:o,children:t})});Fp.displayName="PreferencesPanelComponentsStoreProvider";const Bp=()=>useContext(Lp);const jp=n=>{const{General:o,Layouts:i}=Kp();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{})]})},zp=({title:t="General",...n})=>{const{Theme:o}=Kp();return jsxRuntimeExports.jsx(P,{title:t,"data-testid":"preferences-panel-general-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Vp=({title:t="Layouts",...n})=>{const{LayoutsShowDeletePrompt:o}=Kp();return jsxRuntimeExports.jsx(P,{title:t,"data-testid":"preferences-panel-layouts-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Wp={Body:jp,General:zp,Theme:Mm,Layouts:Vp,LayoutsShowUnsavedChangesPrompt:$m,LayoutsShowDeletePrompt:jm},Yp=createContext(Wp),Up=memo(({children:t,components:n})=>{const o=useMemo(()=>({...Wp,...n}),[n]);return jsxRuntimeExports.jsx(Yp.Provider,{value:o,children:t})});Up.displayName="PreferencesPanelComponentsStoreProvider";const Kp=()=>useContext(Yp);const Gp=({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:o,isButtonDisabled:i,onButtonClick:r})=>jsxRuntimeExports.jsx(Z,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map((t,a)=>{const{id:s,text:l,variant:c}=t,u=o(s);return jsxRuntimeExports.jsx(A,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:i(s),onClick:()=>r(t),variant:c,children:l},s)})}),Qp=({actionButtons:n,children:o,onCompletion:i,size:r,title:a=(Xs()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]})=>{const{actionButtonElementsRefs:l,autofocusButtonId:f,hasAutofocusButtonLostInitialFocus:m}=(e=>{const t=useRef([]),n=useMemo(()=>e.find(e=>e.autofocus)?.id??null,[e]),o=useRef(n),[i,r]=useState(!o.current);return useLayoutEffect(()=>{if(i)return;if(n!==o.current)return void r(true);const e=t.current.find(e=>e?.id===n);if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}},[n,i]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:i}})(n),h=()=>{i({isClosed:true});},g={...r};return jsxRuntimeExports.jsxs(re,{className:"io-dialog-template",closeFn:h,isOpen:true,onCancel:e=>{e.preventDefault(),h();},onKeyDown:e=>{!T(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||i({isEnterPressed:true});},style:g,title:a,children:[jsxRuntimeExports.jsx(re.Body,{children:o}),jsxRuntimeExports.jsx(re.Footer,{children:jsxRuntimeExports.jsx(Gp,{actionButtonElementsRefs:l,actionButtons:n,isAutofocusButton:e=>f===e&&!m,isButtonDisabled:e=>s.some(t=>t.disabledButtonIds.some(t=>t===e)),onButtonClick:({id:e,text:t})=>{i({responseButtonClicked:{id:e,text:t}});}})})]})},Xp=({children:t})=>jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t});var Zp=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,heading:a,text:s,title:l}=i;return jsxRuntimeExports.jsx(Qp,{actionButtons:r,onCompletion:n,size:o,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Xp,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,checkbox:s,heading:l,text:u,title:d}=i,[f,m]=useState(s.initialValue),p=useCallback(()=>m(e=>!e),[]),h=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(Qp,{actionButtons:r,onCompletion:e=>n({...e,inputs:h}),size:o,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Xp,{children:l}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(_s,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:p})]})},SingleTextInputDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,heading:a,input:s,title:l}=i,[u,f]=useState(s.initialValue??""),m=useRef(null),h=(g=u,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:u}];return useLayoutEffect(()=>{m.current?.select();},[]),jsxRuntimeExports.jsxs(Qp,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:o,title:l,validationErrors:h?[h]:[],children:[jsxRuntimeExports.jsx(Xp,{children:a}),jsxRuntimeExports.jsx(Bs,{"data-testid":`io-dialog-input-${s.id}`,ref:m,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:h?.message,id:s.id,label:s.label,name:s.id,onChange:e=>f(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}});const eh=({name:n,value:o})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:o})]}),th=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("div",{className:x("io-profile-section-body",n),children:[i&&jsxRuntimeExports.jsx(M,{className:"io-profile-section-title",text:i}),o.map(({name:t,value:n})=>jsxRuntimeExports.jsx(eh,{name:t,value:n},t))]}),nh=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("section",{className:x("io-profile-section",n),children:[jsxRuntimeExports.jsx(th,{items:o,title:i}),jsxRuntimeExports.jsx(q,{className:"mt-8"})]}),oh=({title:t="License",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),ih=({title:t="Version",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),rh=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),ah=({className:n})=>{const o=Xs()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:x("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:o}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[o,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},sh=({avatarInitials:n=(Xs()?"CD":"CB"),className:o,items:i,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:x("io-profile-section",o),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(th,{className:"mt-12",items:i,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(q,{className:"mt-8"})]}),lh={LicenseSection:oh,ProductsInfoSection:ih,PluginsSection:rh,Trademark:ah,UserSection:sh},ch=createContext(lh),uh=memo(({children:t,components:n})=>{const o=useMemo(()=>({...lh,...n}),[n]);return jsxRuntimeExports.jsx(ch.Provider,{value:o,children:t})});uh.displayName="ProfilePanelComponentsStoreProvider";createContext(void 0);document.querySelector("#root")??document.body;

const DEFAULT_DIALOG_TEMPLATES = [
    {
        name: "noInputsConfirmationDialog",
        Dialog: Zp.NoInputsConfirmationDialog,
        validate: noInputsConfirmationDialogDecoder.runWithException
    },
    {
        name: "singleCheckboxDialog",
        Dialog: Zp.SingleCheckboxDialog,
        validate: singleCheckboxDialogDecoder.runWithException
    },
    {
        name: "singleTextInputDialog",
        Dialog: Zp.SingleTextInputDialog,
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

var m = v__default;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

const Actions = ({ actions, onActionClick }) => {
    return (o__default.createElement(Z, { "data-testid": "io-alert-action-buttons-group" }, actions.map((action) => (o__default.createElement(A, { "data-testid": `io-alert-action-button-${action.id}`, key: action.id, onClick: (event) => onActionClick(event, action) }, action.title)))));
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
    const actions = !!data.config.actions?.length && (o__default.createElement(Actions, { actions: data.config.actions, onActionClick: (event, action) => {
            event.stopPropagation();
            const interopAction = {
                name: action.title,
                settings: action.clickInterop,
            };
            onClick({ interopAction, shouldCloseAlert: true });
        } }));
    return (o__default.createElement(E, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
};

const Alerts = ({ Alert = DefaultAlert, messagePort }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            setData(data);
        });
        return unsubscribe;
    }, [messagePort]);
    return data ? (o__default.createElement(Alert, { data: data, onClick: ({ interopAction, shouldCloseAlert }) => {
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
    return data ? (o__default.createElement(data.Dialog, { onCompletion: (response) => messagePort.postMessage({ id: data.id, response }), size: data.config.size, variables: data.config.variables })) : null;
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
        this.appendToDOM(this.alertsContainerId, o__default.createElement(Alerts, { messagePort: this.alertsMessagePort, Alert: this.alertsComponents?.Alert }));
    }
    appendDialogs() {
        this.appendToDOM(this.dialogsContainerId, o__default.createElement(Dialogs, { messagePort: this.dialogsMessagePort, templates: this.dialogTemplates }));
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
if (typeof window !== "undefined") {
    window.IOBrowserModalsUI = IOBrowserModalsUIFactory;
}
eventController.notifyStarted();

export { IOBrowserModalsUIFactory as default };
//# sourceMappingURL=io-browser-modals-ui-react.es.js.map
