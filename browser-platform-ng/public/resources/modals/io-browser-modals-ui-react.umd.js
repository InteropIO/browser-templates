(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["io-browser-modals-ui-react"] = factory(global.React, global.ReactDOM));
})(this, (function (i, m$2) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var i__namespace = /*#__PURE__*/_interopNamespaceDefault(i);
    var m__namespace = /*#__PURE__*/_interopNamespaceDefault(m$2);

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
        regex: anyJson$1()
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

    let urlAlphabet =
      'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
    let nanoid = (size = 21) => {
      let id = '';
      let i = size;
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
    var f=i,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
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
        const [io, setIOConnect] = i.useState(null);
        i.useEffect(() => {
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

    const IOConnectContext = i.createContext(null);
    const IOConnectProvider = i.memo(({ children, fallback = null, settings = {}, onInitError }) => {
        const glue = useIOConnectInit(settings, onInitError);
        return glue ? (i.createElement(IOConnectContext.Provider, { value: glue }, children)) : (i.createElement(i.Fragment, null, fallback));
    });
    IOConnectProvider.propTypes = {
        children: propTypesExports.node,
        settings: propTypesExports.object,
        fallback: propTypesExports.node,
    };
    IOConnectProvider.displayName = 'IOConnectProvider';

    function v(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var b,y={exports:{}};
    /*!
    	Copyright (c) 2018 Jed Watson.
    	Licensed under the MIT License (MIT), see
    	http://jedwatson.github.io/classnames
    */b=y,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}b.exports?(t.default=t,b.exports=t):window.classNames=t;}();var w=v(y.exports);function k({className:t,size:n="16",variant:i="workspace",...o}){const r=w("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const N=i.forwardRef((({className:t,variant:n="default",icon:i$1="workspace",size:o="16",iconSize:a="16",onClick:s,disabled:c,children:l,...u},d)=>{const f=w("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),h=i.useCallback((e=>{if(!c)return s?s(e):void 0;e.preventDefault();}),[s,c]);return jsxRuntimeExports.jsx("button",{className:f,type:"button",ref:d,"aria-label":"button",onClick:h,disabled:c,...u,children:l??(i$1&&jsxRuntimeExports.jsx(k,{variant:i$1,size:a}))})}));N.displayName="ButtonIcon";const S={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function C({className:n,variant:i="default",size:o="normal",text:r,close:a=false,closeButtonOnClick:s,append:c,...l}){const u=w("io-alert",`io-alert-${i}`,"large"===o&&"io-alert-lg",n),d=S[i];return jsxRuntimeExports.jsxs("div",{className:u,...l,children:[d&&jsxRuntimeExports.jsx(k,{variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:r}),"large"===o&&c,a&&jsxRuntimeExports.jsx(N,{className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function x({className:t,variant:n="default",children:i,...o}){const r=w("io-badge",{[`io-badge-${n}`]:"default"!==n},t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function E({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=w("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function I({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...c}){const l=w("io-block",n);return jsxRuntimeExports.jsxs("div",{className:l,...c,children:[i&&jsxRuntimeExports.jsx(E,{tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const A=i.forwardRef((({className:n,variant:i$1="default",size:o="normal",icon:a,iconSize:s="12",iconRight:c=false,text:l,onClick:u,disabled:d,children:f,...h},m)=>{const p=w("io-btn",("primary"===i$1||"critical"===i$1||"outline"===i$1||"link"===i$1)&&[`io-btn-${i$1}`],"large"===o&&"io-btn-lg",n),g=i.useCallback((e=>{if(!d)return u?u(e):void 0;e.preventDefault();}),[u,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:m,type:"button","aria-label":"button",onClick:g,disabled:d,tabIndex:0,...h,children:[a&&!c&&jsxRuntimeExports.jsx(k,{variant:a,size:s}),f??l,a&&c&&jsxRuntimeExports.jsx(k,{variant:a,size:s})]})}));A.displayName="Button";const B=i.createContext({});function T({className:t,...n}){const{handleOpen:i$1}=i.useContext(B),o=w("io-dropdown-content",t),a=i.useCallback((e=>{e.stopPropagation(),i$1&&i$1();}),[i$1]);return jsxRuntimeExports.jsx("div",{className:o,role:"button",onClick:a,...n})}const P=i.createContext({}),R=i.forwardRef(((n,i$1)=>{const{className:o,prepend:r,append:a,isSelected:c,onClick:l,description:u,disabled:d=false,children:f,tooltip:h,...m}=n,{variant:p="default",selected:g,checkIcon:v="none",handleItemClick:b}=i.useContext(P),y=c??g?.some((e=>e.children===f)),N="default"!==p&&"none"!==v,S=N||r,C=w("io-list-item",S&&"io-list-item-left",a&&"io-list-item-right","default"!==p&&y&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:C,ref:i$1,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(b?.(e,{children:f}),l?.(e));},...m,children:[S&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[N&&jsxRuntimeExports.jsx(k,{variant:v}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:h,children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})}));R.displayName="ListItem";const L=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=w("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));L.displayName="ListItemTitle";const O=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=w("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));O.displayName="ListItemSection";const F=i.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},c)=>{const l=w("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:l,ref:c,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));F.displayName="ListItemHeader";const D=i.forwardRef((({className:t,children:n,...i},o)=>{const r=w("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})}));D.displayName="ListItemWithSubItems";const M=i.forwardRef(((t,n)=>{const{className:i$1,variant:o="default",checkIcon:a="none",children:s,...u}=t,[d,f]=i.useState([]),h=w("io-list","default"!==o&&"io-list-selectable",i$1),m=i.useCallback(((e,t)=>{if("default"===o)return;const n=d.some((e=>e.children?.toString()===t.children?.toString()));"single"===o?f([t]):(()=>{const e=n?d.filter((e=>e.children!==t.children)):[...d,t];f(e);})();}),[d,o]),p=i.useMemo((()=>({variant:o,selected:d,checkIcon:a,handleItemClick:m})),[o,d,a,m]);return jsxRuntimeExports.jsx(P.Provider,{value:p,children:jsxRuntimeExports.jsx("ul",{className:h,ref:n,...u,children:s})})}));M.displayName="List";const z=M;function _(e,t){i.useEffect((()=>{const n=n=>{e.current&&!e.current.contains(n.target)&&t();};return document.addEventListener("mousedown",n),()=>{document.removeEventListener("mousedown",n);}}),[e,t]);}function H({className:t,variant:n="outline",align:i$1="down",disabled:o,children:a,...s}){const[u,f]=i.useState(false),h=i.useRef(null),m=w("io-dropdown",u&&"io-dropdown-open","default"!==n&&[`io-dropdown-${n}`],t),p=i.useCallback((()=>{f(!u);}),[u]);_(h,i.useCallback((()=>{f(false);}),[]));const g=i.useMemo((()=>({isOpen:u,handleOpen:p,variant:n,align:i$1,disabled:o})),[u,p,n,i$1,o]);return jsxRuntimeExports.jsx(B.Provider,{value:g,children:jsxRuntimeExports.jsx("div",{className:m,ref:h,...s,children:a})})}function $({className:t,variant:n="default",align:i="left",children:o,...r}){const a=w("io-btn-group","sticky"===n&&"io-btn-group-sticky","append"===n&&"io-btn-group-append","fullwidth"===n&&"io-btn-group-fullwidth","right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,...r,children:o})}function j({className:t,draggable:n=false,children:i,...o}){const r=w("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--spacing-8)"},...o,children:i})}function V({className:t,children:n,...i}){const o=w("io-dialog-header",t);return jsxRuntimeExports.jsx(j,{className:o,...i,children:n})}function U({className:t,children:n,...i}){const o=w("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function J({className:t,children:n,...i}){const o=w("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function W({className:t,...n}){const i=w("io-dialog-footer",t);return jsxRuntimeExports.jsx(J,{className:i,...n})}function q({className:n,variant:i$1="default",title:o="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s=(()=>console.log("closeFn not provided")),children:c,...l}){const u=i.useRef(null),h=w("io-dialog","centered"===i$1&&"io-dialog-center",n);return i.useLayoutEffect((()=>{const e=u?.current;e&&(r?e.showModal():e.close());}),[r,u]),jsxRuntimeExports.jsxs("dialog",{className:h,ref:u,"data-modal":true,onClose:()=>{r&&s();},onClick:e=>{"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;" "===e.key&&t&&s();},...l,children:[jsxRuntimeExports.jsxs(V,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{children:o}),jsxRuntimeExports.jsx($,{children:jsxRuntimeExports.jsx(N,{size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),c]})}function K(){return "undefined"!=typeof window}function G(e){return X(e)?(e.nodeName||"").toLowerCase():"#document"}function Y(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function Q(e){var t;return null==(t=(X(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function X(e){return !!K()&&(e instanceof Node||e instanceof Y(e).Node)}function Z(e){return !!K()&&(e instanceof Element||e instanceof Y(e).Element)}function ee(e){return !!K()&&(e instanceof HTMLElement||e instanceof Y(e).HTMLElement)}function te(e){return !(!K()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof Y(e).ShadowRoot)}function ne(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=ce(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!["inline","contents"].includes(o)}function ie(e){return ["table","td","th"].includes(G(e))}function oe(e){return [":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function re(e){const t=ae(),n=Z(e)?ce(e):e;return "none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((e=>(n.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(n.contain||"").includes(e)))}function ae(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function se(e){return ["html","body","#document"].includes(G(e))}function ce(e){return Y(e).getComputedStyle(e)}function le(e){return Z(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ue(e){if("html"===G(e))return e;const t=e.assignedSlot||e.parentNode||te(e)&&e.host||Q(e);return te(t)?t.host:t}function de(e){const t=ue(e);return se(t)?e.ownerDocument?e.ownerDocument.body:e.body:ee(t)&&ne(t)?t:de(t)}function fe(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=de(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=Y(o);if(r){const e=function(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}(a);return t.concat(a,a.visualViewport||[],ne(o)?o:[],e&&n?fe(e):[])}return t.concat(o,fe(o,[],n))}function he(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function me(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&te(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function pe(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function ge(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map((e=>{let{brand:t,version:n}=e;return t+"/"+n})).join(" "):navigator.userAgent}function ve(e){return !(0!==e.mozInputSource||!e.isTrusted)||(we()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function be(e){return !ge().includes("jsdom/")&&(!we()&&0===e.width&&0===e.height||we()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function ye(){return /apple/i.test(navigator.vendor)}function we(){const e=/android/i;return e.test(pe())||e.test(ge())}function ke(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function Ne(e){return (null==e?void 0:e.ownerDocument)||document}function Se(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function Ce(e){return "composedPath"in e?e.composedPath()[0]:e.target}z.Item=R,z.ItemTitle=L,z.ItemSection=O,z.ItemHeader=F,z.ItemWithSubItems=D,H.Button=function({icon:t="chevron-down",...n}){const{handleOpen:i$1,disabled:o}=i.useContext(B),a=i.useCallback((e=>{e.stopPropagation(),i$1&&i$1();}),[i$1]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:a,disabled:o,...n})},H.ButtonIcon=function({size:t="32",...n}){const{handleOpen:i$1,disabled:o}=i.useContext(B),a=i.useCallback((()=>{i$1&&i$1();}),[i$1]);return jsxRuntimeExports.jsx(N,{size:t,onClick:a,disabled:o,...n})},H.Content=T,H.List=z,H.Item=R,H.ItemTitle=L,H.ItemSection=O,$.Button=A,$.ButtonIcon=N,$.Dropdown=H,j.Title=E,j.ButtonGroup=$,j.Button=A,j.ButtonIcon=N,j.Dropdown=H,V.Title=E,V.ButtonGroup=$,V.Button=A,V.ButtonIcon=N,V.Dropdown=H,U.Content=function({className:t,children:n,...i}){const o=w("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},J.ButtonGroup=$,J.Button=A,J.ButtonIcon=N,J.Dropdown=H,W.ButtonGroup=$,W.Button=A,W.ButtonIcon=N,W.Dropdown=H,q.Header=V,q.Body=U,q.Footer=W;const xe="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Ee(e){return ee(e)&&e.matches(xe)}function Ie(e){e.preventDefault(),e.stopPropagation();}function Ae(e){return !!e&&("combobox"===e.getAttribute("role")&&Ee(e))}const Be=Math.min,Te=Math.max,Pe=Math.round,Re=Math.floor,Le=e=>({x:e,y:e}),Oe={left:"right",right:"left",bottom:"top",top:"bottom"},Fe={start:"end",end:"start"};function De(e,t,n){return Te(e,Be(t,n))}function Me(e,t){return "function"==typeof e?e(t):e}function ze(e){return e.split("-")[0]}function _e(e){return e.split("-")[1]}function He(e){return "x"===e?"y":"x"}function $e(e){return "y"===e?"height":"width"}function je(e){return ["top","bottom"].includes(ze(e))?"y":"x"}function Ve(e){return He(je(e))}function Ue(e){return e.replace(/start|end/g,(e=>Fe[e]))}function Je(e){return e.replace(/left|right|bottom|top/g,(e=>Oe[e]))}function We(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
    /*!
    * tabbable 6.2.0
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */var qe=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),Ke="undefined"==typeof Element,Ge=Ke?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Ye=!Ke&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},Qe=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},Xe=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!Qe(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),c=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,c):o.push({scopeParent:a,candidates:c});}else {Ge.call(a,qe)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var l=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!Qe(l,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(l&&u){var d=e(true===l?a.children:l.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},Ze=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},et=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!Ze(e)?0:e.tabIndex},tt=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},nt=function(e){return "INPUT"===e.tagName},it=function(e){return function(e){return nt(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Ye(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},ot=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},rt=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=Ge.call(e,"details>summary:first-of-type")?e.parentElement:e;if(Ge.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return ot(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=Ye(e);if(a&&!a.shadowRoot&&true===i(a))return ot(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&Ye(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var c,l,u;s=!(null===(l=a=null===(c=r=Ye(a))||void 0===c?void 0:c.host)||void 0===l||null===(u=l.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},at=function(e,t){return !(t.disabled||Qe(t)||function(e){return nt(e)&&"hidden"===e.type}(t)||rt(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return "SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!Ge.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},st=function(e,t){return !(it(t)||et(t)<0||!at(e,t))},ct=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},lt=function e(t){var n=[],i=[];return t.forEach((function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=et(e);return n<0&&t&&!Ze(e)?0:n}(a,r),c=r?e(t.candidates):a;0===s?r?n.push.apply(n,c):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:c});})),i.sort(tt).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},ut=function(e,t){var n;return n=(t=t||{}).getShadowRoot?Xe([e],t.includeContainer,{filter:st.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:ct}):function(e,t,n){if(Qe(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(qe));return t&&Ge.call(e,qe)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,st.bind(null,t)),lt(n)},dt=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==Ge.call(e,qe)&&st(t,e)};function ft(e,t,n){let{reference:i,floating:o}=e;const r=je(t),a=Ve(t),s=$e(a),c=ze(t),l="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let h;switch(c){case "top":h={x:u,y:i.y-o.height};break;case "bottom":h={x:u,y:i.y+i.height};break;case "right":h={x:i.x+i.width,y:d};break;case "left":h={x:i.x-o.width,y:d};break;default:h={x:i.x,y:i.y};}switch(_e(t)){case "start":h[a]-=f*(n&&l?-1:1);break;case "end":h[a]+=f*(n&&l?-1:1);}return h}async function ht(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:c}=e,{boundary:l="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:h=0}=Me(t,e),m=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(h),p=s[f?"floating"===d?"reference":"floating":d],g=We(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:l,rootBoundary:u,strategy:c})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,b=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),y=await(null==r.isElement?void 0:r.isElement(b))&&await(null==r.getScale?void 0:r.getScale(b))||{x:1,y:1},w=We(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:b,strategy:c}):v);return {top:(g.top-w.top+m.top)/y.y,bottom:(w.bottom-g.bottom+m.bottom)/y.y,left:(g.left-w.left+m.left)/y.x,right:(w.right-g.right+m.right)/y.x}}function mt(e){const t=ce(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=ee(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=Pe(n)!==r||Pe(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function pt(e){return Z(e)?e:e.contextElement}function gt(e){const t=pt(e);if(!ee(t))return Le(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=mt(t);let a=(r?Pe(n.width):n.width)/i,s=(r?Pe(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const vt=Le(0);function bt(e){const t=Y(e);return ae()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:vt}function yt(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=pt(e);let a=Le(1);t&&(i?Z(i)&&(a=gt(i)):a=gt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==Y(e))&&t}(r,n,i)?bt(r):Le(0);let c=(o.left+s.x)/a.x,l=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=Y(r),t=i&&Z(i)?Y(i):i;let n=e,o=n.frameElement;for(;o&&i&&t!==n;){const e=gt(o),t=o.getBoundingClientRect(),i=ce(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=r,l+=a,n=Y(o),o=n.frameElement;}}return We({width:u,height:d,x:c,y:l})}const wt=[":popover-open",":modal"];function kt(e){return wt.some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function Nt(e){return yt(Q(e)).left+le(e).scrollLeft}function St(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=Y(e),i=Q(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,c=0;if(o){r=o.width,a=o.height;const e=ae();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,c=o.offsetTop);}return {width:r,height:a,x:s,y:c}}(e,n);else if("document"===t)i=function(e){const t=Q(e),n=le(e),i=e.ownerDocument.body,o=Te(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=Te(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+Nt(e);const s=-n.scrollTop;return "rtl"===ce(i).direction&&(a+=Te(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(Q(e));else if(Z(t))i=function(e,t){const n=yt(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=ee(e)?gt(e):Le(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=bt(e);i={...t,x:t.x-n.x,y:t.y-n.y};}return We(i)}function Ct(e,t){const n=ue(e);return !(n===t||!Z(n)||se(n))&&("fixed"===ce(n).position||Ct(n,t))}function xt(e,t,n){const i=ee(t),o=Q(t),r="fixed"===n,a=yt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const c=Le(0);if(i||!i&&!r)if(("body"!==G(t)||ne(o))&&(s=le(t)),i){const e=yt(t,true,r,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop;}else o&&(c.x=Nt(o));return {x:a.left+s.scrollLeft-c.x,y:a.top+s.scrollTop-c.y,width:a.width,height:a.height}}function Et(e){return "static"===ce(e).position}function It(e,t){return ee(e)&&"fixed"!==ce(e).position?t?t(e):e.offsetParent:null}function At(e,t){const n=Y(e);if(kt(e))return n;if(!ee(e)){let t=ue(e);for(;t&&!se(t);){if(Z(t)&&!Et(t))return t;t=ue(t);}return n}let i=It(e,t);for(;i&&ie(i)&&Et(i);)i=It(i,t);return i&&se(i)&&Et(i)&&!re(i)?n:i||function(e){let t=ue(e);for(;ee(t)&&!se(t);){if(re(t))return t;if(oe(t))return null;t=ue(t);}return null}(e)||n}const Bt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=Q(i),s=!!t&&kt(t.floating);if(i===a||s&&r)return n;let c={scrollLeft:0,scrollTop:0},l=Le(1);const u=Le(0),d=ee(i);if((d||!d&&!r)&&(("body"!==G(i)||ne(a))&&(c=le(i)),ee(i))){const e=yt(i);l=gt(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}return {width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x,y:n.y*l.y-c.scrollTop*l.y+u.y}},getDocumentElement:Q,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?kt(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=fe(e,[],false).filter((e=>Z(e)&&"body"!==G(e))),o=null;const r="fixed"===ce(e).position;let a=r?ue(e):e;for(;Z(a)&&!se(a);){const t=ce(a),n=re(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||ne(a)&&!n&&Ct(e,a))?i=i.filter((e=>e!==a)):o=t,a=ue(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce(((e,n)=>{const i=St(t,n,o);return e.top=Te(i.top,e.top),e.right=Be(i.right,e.right),e.bottom=Be(i.bottom,e.bottom),e.left=Te(i.left,e.left),e}),St(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:At,getElementRects:async function(e){const t=this.getOffsetParent||At,n=this.getDimensions,i=await n(e.floating);return {reference:xt(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=mt(e);return {width:t,height:n}},getScale:gt,isElement:Z,isRTL:function(e){return "rtl"===ce(e).direction}};function Tt(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:c=false}=i,l=pt(e),u=o||r?[...l?fe(l):[],...fe(t)]:[];u.forEach((e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);}));const d=l&&s?function(e,t){let n,i=null;const o=Q(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,c){ void 0===s&&(s=false),void 0===c&&(c=1),r();const{left:l,top:u,width:d,height:f}=e.getBoundingClientRect();if(s||t(),!d||!f)return;const h={rootMargin:-Re(u)+"px "+-Re(o.clientWidth-(l+d))+"px "+-Re(o.clientHeight-(u+f))+"px "+-Re(l)+"px",threshold:Te(0,Be(1,c))||1};let m=true;function p(e){const t=e[0].intersectionRatio;if(t!==c){if(!m)return a();t?a(false,t):n=setTimeout((()=>{a(false,1e-7);}),1e3);}m=false;}try{i=new IntersectionObserver(p,{...h,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(p,h);}i.observe(e);}(true),r}(l,n):null;let f,h=-1,m=null;a&&(m=new ResizeObserver((e=>{let[i]=e;i&&i.target===l&&m&&(m.unobserve(t),cancelAnimationFrame(h),h=requestAnimationFrame((()=>{var e;null==(e=m)||e.observe(t);}))),n();})),l&&!c&&m.observe(l),m.observe(t));let p=c?yt(e):null;return c&&function t(){const i=yt(e);!p||i.x===p.x&&i.y===p.y&&i.width===p.width&&i.height===p.height||n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach((e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);})),null==d||d(),null==(e=m)||e.disconnect(),m=null,c&&cancelAnimationFrame(f);}}const Pt=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,c=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=ze(n),s=_e(n),c="y"===je(n),l=["left","top"].includes(a)?-1:1,u=r&&c?-1:1,d=Me(t,e);let{mainAxis:f,crossAxis:h,alignmentAxis:m}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"==typeof m&&(h="end"===s?-1*m:m),c?{x:h*u,y:f*l}:{x:f*l,y:h*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+c.x,y:r+c.y,data:{...c,placement:a}}}}},Rt=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...c}=Me(e,t),l={x:n,y:i},u=await ht(t,c),d=je(ze(o)),f=He(d);let h=l[f],m=l[d];if(r){const e="y"===f?"bottom":"right";h=De(h+u["y"===f?"top":"left"],h,h-u[e]);}if(a){const e="y"===d?"bottom":"right";m=De(m+u["y"===d?"top":"left"],m,m-u[e]);}const p=s.fn({...t,[f]:h,[d]:m});return {...p,data:{x:p.x-n,y:p.y-i}}}}},Lt=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:c,elements:l}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:p=true,...g}=Me(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=ze(o),b=ze(s)===s,y=await(null==c.isRTL?void 0:c.isRTL(l.floating)),w=f||(b||!p?[Je(s)]:function(e){const t=Je(e);return [Ue(e),t,Ue(t)]}(s));f||"none"===m||w.push(...function(e,t,n,i){const o=_e(e);let r=function(e,t,n){const i=["left","right"],o=["right","left"],r=["top","bottom"],a=["bottom","top"];switch(e){case "top":case "bottom":return n?t?o:i:t?i:o;case "left":case "right":return t?r:a;default:return []}}(ze(e),"start"===n,i);return o&&(r=r.map((e=>e+"-"+o)),t&&(r=r.concat(r.map(Ue)))),r}(s,p,m,y));const k=[s,...w],N=await ht(t,g),S=[];let C=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&S.push(N[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=_e(e),o=Ve(e),r=$e(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=Je(a)),[a,Je(a)]}(o,a,y);S.push(N[e[0]],N[e[1]]);}if(C=[...C,{placement:o,overflows:S}],!S.every((e=>e<=0))){var x,E;const e=((null==(x=r.flip)?void 0:x.index)||0)+1,t=k[e];if(t)return {data:{index:e,overflows:C},reset:{placement:t}};let n=null==(E=C.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:E.placement;if(!n)switch(h){case "bestFit":{var I;const e=null==(I=C.map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:I[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},Ot=(e,t,n)=>{const i=new Map,o={platform:Bt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),c=await(null==a.isRTL?void 0:a.isRTL(t));let l=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=ft(l,i,c),f=i,h={},m=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:b,reset:y}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:h,rects:l,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,h={...h,[r]:{...h[r],...b}},y&&m<=50&&(m++,"object"==typeof y&&(y.placement&&(f=y.placement),y.rects&&(l=true===y.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):y.rects),({x:u,y:d}=ft(l,f,c))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:h}})(e,t,{...o,platform:r})};var Ft="undefined"!=typeof document?i.useLayoutEffect:i.useEffect;function Dt(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!=i--;)if(!Dt(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!=i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!=i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!Dt(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function Mt(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function zt(e,t){const n=Mt(e);return Math.round(t*n)/n}function _t(e){const t=i__namespace.useRef(e);return Ft((()=>{t.current=e;})),t}const Ht=(e,t)=>({...Rt(e),options:[e,t]}),$t=(e,t)=>({...Lt(e),options:[e,t]});function jt(e){return i__namespace.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}),e)}const Vt={...i__namespace},Ut=Vt.useInsertionEffect||(e=>e());function Jt(e){const t=i__namespace.useRef((()=>{}));return Ut((()=>{t.current=e;})),i__namespace.useCallback((function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)}),[])}const Wt="ArrowUp",qt="ArrowDown",Kt="ArrowLeft",Gt="ArrowRight";function Yt(e,t,n){return Math.floor(e/t)!==n}function Qt(e,t){return t<0||t>=e.current.length}function Xt(e,t){return en(e,{disabledIndices:t})}function Zt(e,t){return en(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function en(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&on(a,s,o));return s}function tn(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function nn(e,t){return t.flatMap(((t,n)=>e.includes(t)?[n]:[]))}function on(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var rn="undefined"!=typeof document?i.useLayoutEffect:i.useEffect;function an(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const sn=i__namespace.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function cn(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=i__namespace.useState((()=>new Map)),s=i__namespace.useCallback((e=>{a((t=>new Map(t).set(e,null)));}),[]),c=i__namespace.useCallback((e=>{a((t=>{const n=new Map(t);return n.delete(e),n}));}),[]);return rn((()=>{const e=new Map(r);Array.from(e.keys()).sort(an).forEach(((t,n)=>{e.set(t,n);})),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);}),[r]),i__namespace.createElement(sn.Provider,{value:i__namespace.useMemo((()=>({register:s,unregister:c,map:r,elementsRef:n,labelsRef:o})),[s,c,r,n,o])},t)}function ln(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=i__namespace.useContext(sn),[c,l]=i__namespace.useState(null),u=i__namespace.useRef(null),d=i__namespace.useCallback((e=>{if(u.current=e,null!==c&&(a.current[c]=e,s)){var n;const i=void 0!==t;s.current[c]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}}),[c,a,s,t]);return rn((()=>{const e=u.current;if(e)return n(e),()=>{o(e);}}),[n,o]),rn((()=>{const e=u.current?r.get(u.current):null;null!=e&&l(e);}),[r]),i__namespace.useMemo((()=>({ref:d,index:null==c?-1:c})),[c,d])}function un(){return un=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},un.apply(this,arguments)}let dn=false,fn=0;const hn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+fn++;const mn=Vt.useId||function(){const[e,t]=i__namespace.useState((()=>dn?hn():void 0));return rn((()=>{null==e&&t(hn());}),[]),i__namespace.useEffect((()=>{dn=true;}),[]),e};function vn(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach((e=>e(n)));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter((e=>e!==n)))||[]);}}}const bn=i__namespace.createContext(null),yn=i__namespace.createContext(null),wn=()=>{var e;return (null==(e=i__namespace.useContext(bn))?void 0:e.id)||null},kn=()=>i__namespace.useContext(yn);function Nn(e){const{children:t,id:n}=e,o=wn();return i__namespace.createElement(bn.Provider,{value:i__namespace.useMemo((()=>({id:n,parentId:o})),[n,o])},t)}function Sn(e){const{children:t}=e,n=i__namespace.useRef([]),o=i__namespace.useCallback((e=>{n.current=[...n.current,e];}),[]),r=i__namespace.useCallback((e=>{n.current=n.current.filter((t=>t!==e));}),[]),a=i__namespace.useState((()=>vn()))[0];return i__namespace.createElement(yn.Provider,{value:i__namespace.useMemo((()=>({nodesRef:n,addNode:o,removeNode:r,events:a})),[o,r,a])},t)}function Cn(e){return "data-floating-ui-"+e}function xn(e){const t=i.useRef(e);return rn((()=>{t.current=e;})),t}const En=Cn("safe-polygon");function In(e,t,n){return n&&!ke(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let An=0;function Bn(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(An);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():An=requestAnimationFrame(r);}function Tn(e,t){let n=e.filter((e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)})),i=n;for(;i.length;)i=e.filter((e=>{var t;return null==(t=i)?void 0:t.some((t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)}))})),n=n.concat(i);return n}let Pn=new WeakMap,Rn=new WeakSet,Ln={},On=0;const Fn=e=>e&&(e.host||Fn(e.parentNode)),Dn=(e,t)=>t.map((t=>{if(e.contains(t))return t;const n=Fn(t);return e.contains(n)?n:null})).filter((e=>null!=e));function Mn(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=Ne(e[0]).body;return function(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=Dn(t,e),s=new Set,c=new Set(a),l=[];Ln[o]||(Ln[o]=new WeakMap);const u=Ln[o];return a.forEach((function e(t){t&&!s.has(t)&&(s.add(t),t.parentNode&&e(t.parentNode));})),function e(t){t&&!c.has(t)&&[].forEach.call(t.children,(t=>{if("script"!==G(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(Pn.get(t)||0)+1,a=(u.get(t)||0)+1;Pn.set(t,i),u.set(t,a),l.push(t),1===i&&n&&Rn.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}}));}(t),s.clear(),On++,()=>{l.forEach((e=>{const t=(Pn.get(e)||0)-1,n=(u.get(e)||0)-1;Pn.set(e,t),u.set(e,n),t||(!Rn.has(e)&&r&&e.removeAttribute(r),Rn.delete(e)),n||e.removeAttribute(o);})),On--,On||(Pn=new WeakMap,Pn=new WeakMap,Rn=new WeakSet,Ln={});}}(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const zn=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function _n(e,t){const n=ut(e,zn());"prev"===t&&n.reverse();const i=n.indexOf(he(Ne(e)));return n.slice(i+1)[0]}function Hn(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!me(n,i)}const $n={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function jn(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const Vn=i__namespace.forwardRef((function(e,t){const[n,o]=i__namespace.useState();rn((()=>(ye()&&o("button"),document.addEventListener("keydown",jn),()=>{document.removeEventListener("keydown",jn);})),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Cn("focus-guard")]:"",style:$n};return i__namespace.createElement("span",un({},e,r))})),Un=i__namespace.createContext(null),Jn="data-floating-ui-focusable";function Wn(e){return e?e.hasAttribute(Jn)?e:e.querySelector("["+Jn+"]")||e:null}const qn=20;let Kn=[];function Gn(e){Kn=Kn.filter((e=>e.isConnected));let t=e;if(t&&"body"!==G(t)){if(!dt(t,zn())){const e=ut(t,zn())[0];e&&(t=e);}Kn.push(t),Kn.length>qn&&(Kn=Kn.slice(-20));}}function Yn(){return Kn.slice().reverse().find((e=>e.isConnected))}const Qn=i__namespace.forwardRef((function(e,t){return i__namespace.createElement("button",un({},e,{type:"button",ref:t,tabIndex:-1,style:$n}))}));function Xn(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:c=true,restoreFocus:l=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:h,refs:m,nodeId:p,onOpenChange:g,events:v,dataRef:b,floatingId:y,elements:{domReference:w,floating:k}}=t,N="number"==typeof s&&s<0,S=Ae(w)&&N,C="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,x=xn(r),E=xn(s),I=xn(c),A=kn(),B=i__namespace.useContext(Un),T=i__namespace.useRef(null),P=i__namespace.useRef(null),R=i__namespace.useRef(false),L=i__namespace.useRef(false),O=i__namespace.useRef(-1),F=null!=B,D=Wn(k),M=Jt((function(e){return void 0===e&&(e=D),e?ut(e,zn()):[]})),z=Jt((e=>{const t=M(e);return x.current.map((e=>w&&"reference"===e?w:D&&"floating"===e?D:t)).filter(Boolean).flat()}));function _(e){return !o&&d&&u?i__namespace.createElement(Qn,{ref:"start"===e?T:P,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}i__namespace.useEffect((()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){me(D,he(Ne(D)))&&0===M().length&&!S&&Ie(e);const t=z(),n=Ce(e);"reference"===x.current[0]&&n===w&&(Ie(e),e.shiftKey?Bn(t[t.length-1]):Bn(t[1])),"floating"===x.current[1]&&n===D&&e.shiftKey&&(Ie(e),Bn(t[0]));}}const t=Ne(D);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}}),[o,w,D,u,x,S,M,z]),i__namespace.useEffect((()=>{if(!o&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=Ce(e),n=M().indexOf(t);-1!==n&&(O.current=n);}}),[o,k,M]),i__namespace.useEffect((()=>{if(!o&&f)return k&&ee(w)?(w.addEventListener("focusout",t),w.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{w.removeEventListener("focusout",t),w.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){L.current=true,setTimeout((()=>{L.current=false;}));}function t(e){const t=e.relatedTarget;queueMicrotask((()=>{const n=!(me(w,t)||me(k,t)||me(t,k)||me(null==B?void 0:B.portalNode,t)||null!=t&&t.hasAttribute(Cn("focus-guard"))||A&&(Tn(A.nodesRef.current,p).find((e=>{var n,i;return me(null==(n=e.context)?void 0:n.elements.floating,t)||me(null==(i=e.context)?void 0:i.elements.domReference,t)}))||function(e,t){var n;let i=[],o=null==(n=e.find((e=>e.id===t)))?void 0:n.parentId;for(;o;){const t=e.find((e=>e.id===o));o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(A.nodesRef.current,p).find((e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t}))));if(l&&n&&he(Ne(D))===Ne(D).body){ee(D)&&D.focus();const e=O.current,t=M(),n=t[e]||t[t.length-1]||D;ee(n)&&n.focus();}!S&&u||!t||!n||L.current||t===Yn()||(R.current=true,g(false,e,"focus-out"));}));}}),[o,w,k,D,u,p,A,B,g,f,l,M,S]),i__namespace.useEffect((()=>{var e;if(o)return;const t=Array.from((null==B||null==(e=B.portalNode)?void 0:e.querySelectorAll("["+Cn("portal")+"]"))||[]);if(k){const e=[k,...t,T.current,P.current,x.current.includes("reference")||S?w:null].filter((e=>null!=e)),n=u||S?Mn(e,C,!C):Mn(e);return ()=>{n();}}}),[o,w,k,u,x,B,S,C]),rn((()=>{if(o||!ee(D))return;const e=he(Ne(D));queueMicrotask((()=>{const t=z(D),n=E.current,i=("number"==typeof n?t[n]:n.current)||D,o=me(D,e);N||o||!h||Bn(i,{preventScroll:i===D});}));}),[o,h,D,N,z,E]),rn((()=>{if(o||!D)return;let e=false;const t=Ne(D),n=he(t);let i=b.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&m.domReference.current&&Gn(m.domReference.current),"hover"===o&&"mouseleave"===r.type&&(R.current=true),"outside-press"===o&&(a?(R.current=false,e=true):R.current=!(ve(r)||be(r)));}Gn(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,$n),F&&w&&w.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=he(t),o=me(k,n)||A&&Tn(A.nodesRef.current,p).some((e=>{var t;return me(null==(t=e.context)?void 0:t.elements.floating,n)}));(o||i&&["click","mousedown"].includes(i.type))&&m.domReference.current&&Gn(m.domReference.current);const s="boolean"==typeof I.current?Yn()||a:I.current.current||a;queueMicrotask((()=>{I.current&&!R.current&&ee(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();}));}}),[o,k,D,I,b,m,v,A,p,F,w]),i__namespace.useEffect((()=>{queueMicrotask((()=>{R.current=false;}));}),[o]),rn((()=>{if(!o&&B)return B.setFocusManagerState({modal:u,closeOnFocusOut:f,open:h,onOpenChange:g,refs:m}),()=>{B.setFocusManagerState(null);}}),[o,B,u,h,g,m,f]),rn((()=>{if(o)return;if(!D)return;if("function"!=typeof MutationObserver)return;if(N)return;const e=()=>{const e=D.getAttribute("tabindex"),t=M(),n=he(Ne(k)),i=t.indexOf(n);-1!==i&&(O.current=i),x.current.includes("floating")||n!==m.domReference.current&&0===t.length?"0"!==e&&D.setAttribute("tabindex","0"):"-1"!==e&&D.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(D,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}}),[o,k,D,m,x,M,N]);const H=!o&&C&&(!u||!S)&&(F||u);return i__namespace.createElement(i__namespace.Fragment,null,H&&i__namespace.createElement(Vn,{"data-type":"inside",ref:null==B?void 0:B.beforeInsideRef,onFocus:e=>{if(u){const e=z();Bn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=B&&B.preserveTabOrder&&B.portalNode)if(R.current=false,Hn(e,B.portalNode)){const e=_n(document.body,"next")||w;null==e||e.focus();}else {var t;null==(t=B.beforeOutsideRef.current)||t.focus();}}}),!S&&_("start"),n,_("end"),H&&i__namespace.createElement(Vn,{"data-type":"inside",ref:null==B?void 0:B.afterInsideRef,onFocus:e=>{if(u)Bn(z()[0]);else if(null!=B&&B.preserveTabOrder&&B.portalNode)if(f&&(R.current=true),Hn(e,B.portalNode)){const e=_n(document.body,"prev")||w;null==e||e.focus();}else {var t;null==(t=B.afterOutsideRef.current)||t.focus();}}}))}function Zn(e){return ee(e.target)&&"BUTTON"===e.target.tagName}function ei(e){return Ee(e)}const ti={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},ni={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},ii=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function oi(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=mn(),a=i__namespace.useRef({}),[s]=i__namespace.useState((()=>vn())),c=null!=wn();const[l,u]=i__namespace.useState(o.reference),d=Jt(((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:c}),null==n||n(e,t,i);})),f=i__namespace.useMemo((()=>({setPositionReference:u})),[]),h=i__namespace.useMemo((()=>({reference:l||o.reference||null,floating:o.floating||null,domReference:o.reference})),[l,o.reference,o.floating]);return i__namespace.useMemo((()=>({dataRef:a,open:t,onOpenChange:d,elements:h,events:s,floatingId:r,refs:f})),[t,d,h,s,r,f])}function ri(e){ void 0===e&&(e={});const{nodeId:t}=e,n=oi({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=i__namespace.useState(null),[c,l]=i__namespace.useState(null),u=(null==r?void 0:r.domReference)||a,d=i__namespace.useRef(null),f=kn();rn((()=>{u&&(d.current=u);}),[u]);const h=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:c=true,whileElementsMounted:l,open:u}=e,[d,f]=i__namespace.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[h,p]=i__namespace.useState(o);Dt(h,o)||p(o);const[g,v]=i__namespace.useState(null),[b,y]=i__namespace.useState(null),w=i__namespace.useCallback((e=>{e!==C.current&&(C.current=e,v(e));}),[]),k=i__namespace.useCallback((e=>{e!==x.current&&(x.current=e,y(e));}),[]),N=a||g,S=s||b,C=i__namespace.useRef(null),x=i__namespace.useRef(null),E=i__namespace.useRef(d),I=null!=l,A=_t(l),B=_t(r),T=_t(u),P=i__namespace.useCallback((()=>{if(!C.current||!x.current)return;const e={placement:t,strategy:n,middleware:h};B.current&&(e.platform=B.current),Ot(C.current,x.current,e).then((e=>{const t={...e,isPositioned:false!==T.current};R.current&&!Dt(E.current,t)&&(E.current=t,m__namespace.flushSync((()=>{f(t);})));}));}),[h,t,n,B,T]);Ft((()=>{ false===u&&E.current.isPositioned&&(E.current.isPositioned=false,f((e=>({...e,isPositioned:false}))));}),[u]);const R=i__namespace.useRef(false);Ft((()=>(R.current=true,()=>{R.current=false;})),[]),Ft((()=>{if(N&&(C.current=N),S&&(x.current=S),N&&S){if(A.current)return A.current(N,S,P);P();}}),[N,S,P,A,I]);const L=i__namespace.useMemo((()=>({reference:C,floating:x,setReference:w,setFloating:k})),[w,k]),O=i__namespace.useMemo((()=>({reference:N,floating:S})),[N,S]),F=i__namespace.useMemo((()=>{const e={position:n,left:0,top:0};if(!O.floating)return e;const t=zt(O.floating,d.x),i=zt(O.floating,d.y);return c?{...e,transform:"translate("+t+"px, "+i+"px)",...Mt(O.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}}),[n,c,O.floating,d.x,d.y]);return i__namespace.useMemo((()=>({...d,update:P,refs:L,elements:O,floatingStyles:F})),[d,P,L,O,F])}({...e,elements:{...r,...c&&{reference:c}}}),p=i__namespace.useCallback((e=>{const t=Z(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;l(t),h.refs.setReference(t);}),[h.refs]),g=i__namespace.useCallback((e=>{(Z(e)||null===e)&&(d.current=e,s(e)),(Z(h.refs.reference.current)||null===h.refs.reference.current||null!==e&&!Z(e))&&h.refs.setReference(e);}),[h.refs]),v=i__namespace.useMemo((()=>({...h.refs,setReference:g,setPositionReference:p,domReference:d})),[h.refs,g,p]),b=i__namespace.useMemo((()=>({...h.elements,domReference:u})),[h.elements,u]),y=i__namespace.useMemo((()=>({...h,...o,refs:v,elements:b,nodeId:t})),[h,v,b,t,o]);return rn((()=>{o.dataRef.current.floatingContext=y;const e=null==f?void 0:f.nodesRef.current.find((e=>e.id===t));e&&(e.context=y);})),i__namespace.useMemo((()=>({...h,context:y,refs:v,elements:b})),[h,v,b,y])}const ai="active",si="selected";function ci(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[ai]:t,[si]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[Jn]:""},...r,...t.map((t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i})).concat(e).reduce(((e,t)=>t?(Object.entries(t).forEach((t=>{let[n,r]=t;var a;o&&[ai,si].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map((e=>e(...o))).find((e=>void 0!==e))})):e[n]=r);})),e):e),{})}}let li=false;function ui(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function di(e,t){return ui(t,e===Wt||e===qt,e===Kt||e===Gt)}function fi(e,t,n){return ui(t,e===qt,n?e===Kt:e===Gt)||"Enter"===e||" "===e||""===e}function hi(e,t,n){return ui(t,n?e===Gt:e===Kt,e===Wt)}function mi(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:c=(()=>{}),enabled:l=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:h=false,rtl:m=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:b=true,disabledIndices:y,orientation:w="vertical",cols:k=1,scrollItemIntoView:N=true,virtualItemRef:S,itemSizes:C,dense:x=false}=t;const E=xn(Wn(r.floating)),I=wn(),A=kn(),B=Jt(c),T=Ae(r.domReference),P=i__namespace.useRef(g),R=i__namespace.useRef(null!=u?u:-1),L=i__namespace.useRef(null),O=i__namespace.useRef(true),F=i__namespace.useRef(B),D=i__namespace.useRef(!!r.floating),M=i__namespace.useRef(n),z=i__namespace.useRef(false),_=i__namespace.useRef(false),H=xn(y),$=xn(n),j=xn(N),V=xn(u),[U,J]=i__namespace.useState(),[W,q]=i__namespace.useState(),K=Jt((function(e,t,n){function i(e){p?(J(e.id),null==A||A.events.emit("virtualfocus",e),S&&(S.current=e)):Bn(e,{preventScroll:true,sync:!(!pe().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!ye())&&(li||z.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame((()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=j.current;a&&Y&&(n||!O.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));}));}));rn((()=>{document.createElement("div").focus({get preventScroll(){return li=true,false}});}),[]),rn((()=>{l&&(n&&r.floating?P.current&&null!=u&&(_.current=true,R.current=u,B(u)):D.current&&(R.current=-1,F.current(null)));}),[l,n,r.floating,u,B]),rn((()=>{if(l&&n&&r.floating)if(null==s){if(z.current=false,null!=V.current)return;if(D.current&&(R.current=-1,K(a,R)),(!M.current||!D.current)&&P.current&&(null!=L.current||true===P.current&&null==L.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else R.current=null==L.current||fi(L.current,w,m)||h?Xt(a,H.current):Zt(a,H.current),L.current=null,B(R.current);};t();}}else Qt(a,s)||(R.current=s,K(a,R,_.current),_.current=false);}),[l,n,r.floating,s,V,h,a,w,m,B,K,H]),rn((()=>{var e;if(!l||r.floating||!A||p||!D.current)return;const t=A.nodesRef.current,n=null==(e=t.find((e=>e.id===I)))||null==(e=e.context)?void 0:e.elements.floating,i=he(Ne(r.floating)),o=t.some((e=>e.context&&me(e.context.elements.floating,i)));n&&!o&&O.current&&n.focus({preventScroll:true});}),[l,r.floating,A,I,p]),rn((()=>{if(l&&A&&p&&!I)return A.events.on("virtualfocus",e),()=>{A.events.off("virtualfocus",e);};function e(e){q(e.id),S&&(S.current=e);}}),[l,A,p,I,S]),rn((()=>{F.current=B,D.current=!!r.floating;})),rn((()=>{n||(L.current=null);}),[n]),rn((()=>{M.current=n;}),[n]);const G=null!=s,Y=i__namespace.useMemo((()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&B(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;O.current&&"touch"!==t&&(R.current=-1,K(a,R),B(null),p||Bn(E.current,{preventScroll:true}));}}}}),[n,E,K,v,a,B,p]),Q=Jt((e=>{if(O.current=false,z.current=true,229===e.which)return;if(!$.current&&e.currentTarget===E.current)return;if(h&&hi(e.key,w,m))return Ie(e),o(false,e.nativeEvent,"list-navigation"),void(ee(r.domReference)&&(p?null==A||A.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=R.current,i=Xt(a,y),s=Zt(a,y);if(T||("Home"===e.key&&(Ie(e),R.current=i,B(R.current)),"End"===e.key&&(Ie(e),R.current=s,B(R.current))),k>1){const t=C||Array.from({length:a.current.length},(()=>({width:1,height:1}))),n=function(e,t,n){const i=[];let o=0;return e.forEach(((e,r)=>{let{width:a,height:s}=e;let c=false;for(n&&(o=0);!c;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every((e=>null==i[e]))?(e.forEach((e=>{i[e]=r;})),c=true):o++;}})),[...i]}(t,k,x),o=n.findIndex((e=>null!=e&&!on(a.current,e,y))),r=n.reduce(((e,t,n)=>null==t||on(a.current,t,y)?e:n),-1),c=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:c,maxIndex:l,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===Wt){if(d&&Ie(n),-1===u)f=l;else if(f=en(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<c||f<0)){const e=u%a,t=l%a,n=l-(t-e);f=t===e?l:t>e?n:n-a;}Qt(e,f)&&(f=u);}if(n.key===qt&&(d&&Ie(n),-1===u?f=c:(f=en(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>l&&(f=en(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Qt(e,f)&&(f=u)),"both"===i){const t=Re(u/a);n.key===(r?Kt:Gt)&&(d&&Ie(n),u%a!=a-1?(f=en(e,{startingIndex:u,disabledIndices:s}),o&&Yt(f,a,t)&&(f=en(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=en(e,{startingIndex:u-u%a-1,disabledIndices:s})),Yt(f,a,t)&&(f=u)),n.key===(r?Gt:Kt)&&(d&&Ie(n),u%a!=0?(f=en(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&Yt(f,a,t)&&(f=en(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=en(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),Yt(f,a,t)&&(f=u));const i=Re(l/a)===t;Qt(e,f)&&(f=o&&i?n.key===(r?Gt:Kt)?l:en(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map((e=>null!=e?a.current[e]:null))},{event:e,orientation:w,loop:f,rtl:m,cols:k,disabledIndices:nn([...y||a.current.map(((e,t)=>on(a.current,t)?t:void 0)),void 0],n),minIndex:o,maxIndex:r,prevIndex:tn(R.current>s?i:R.current,t,n,k,e.key===qt?"bl":e.key===(m?Kt:Gt)?"tr":"tl"),stopEvent:true})];if(null!=c&&(R.current=c,B(R.current)),"both"===w)return}if(di(e.key,w)){if(Ie(e),n&&!p&&he(e.currentTarget.ownerDocument)===e.currentTarget)return R.current=fi(e.key,w,m)?i:s,void B(R.current);fi(e.key,w,m)?R.current=f?t>=s?d&&t!==a.current.length?-1:i:en(a,{startingIndex:t,disabledIndices:y}):Math.min(s,en(a,{startingIndex:t,disabledIndices:y})):R.current=f?t<=i?d&&-1!==t?a.current.length:s:en(a,{startingIndex:t,decrement:true,disabledIndices:y}):Math.max(i,en(a,{startingIndex:t,decrement:true,disabledIndices:y})),Qt(a,R.current)?B(null):B(R.current);}})),X=i__namespace.useMemo((()=>p&&n&&G&&{"aria-activedescendant":W||U}),[p,n,G,W,U]),Z=i__namespace.useMemo((()=>({"aria-orientation":"both"===w?void 0:w,...!Ae(r.domReference)&&X,onKeyDown:Q,onPointerMove(){O.current=true;}})),[X,Q,r.domReference,w]),te=i__namespace.useMemo((()=>{function e(e){"auto"===g&&ve(e.nativeEvent)&&(P.current=true);}return {...X,onKeyDown(e){O.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return ui(t,n?e===Kt:e===Gt,e===qt)}(e.key,w,m),c=hi(e.key,w,m),l=di(e.key,w),d=(h?s:l)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==A?void 0:A.nodesRef.current.find((e=>null==e.parentId)),n=A&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),Tn(e,o).forEach((e=>{t(e.id,r+1);}));}(t,0),e.find((e=>e.id===n))}(A.nodesRef.current,t.id):null;if(r&&n&&S){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||c){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=c&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find((e=>(null==e?void 0:e.id)===U)):null;o&&(Ie(e),o.dispatchEvent(t),q(void 0));}var v;if((l||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ie(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||b||!t)&&(d&&(L.current=h&&l?null:e.key),h?s&&(Ie(e),n?(R.current=Xt(a,H.current),B(R.current)):o(true,e.nativeEvent,"list-navigation")):l&&(null!=u&&(R.current=u),Ie(e),!n&&b?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&B(R.current)));},onFocus(){n&&!p&&B(null);},onPointerDown:function(e){P.current=g,"auto"===g&&be(e.nativeEvent)&&(P.current=true);},onMouseDown:e,onClick:e}}),[U,X,Q,H,g,a,h,B,o,n,b,w,m,u,A,p,S]);return i__namespace.useMemo((()=>l?{reference:te,floating:Z,item:Y}:{}),[l,te,Z,Y])}const pi=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function gi(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[c,l]=t[a]||[0,0];s>=i!=l>=i&&n<=(c-r)*(i-s)/(l-s)+r&&(o=!o);}return o}function vi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,c=performance.now();const l=e=>{let{x:n,y:l,placement:u,elements:d,onClose:f,nodeId:h,tree:m}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==l)return;const{clientX:g,clientY:v}=e,b=[g,v],y=Ce(e),w="mouseleave"===e.type,k=me(d.floating,y),N=me(d.domReference,y),S=d.domReference.getBoundingClientRect(),C=d.floating.getBoundingClientRect(),x=u.split("-")[0],E=n>C.right-C.width/2,I=l>C.bottom-C.height/2,A=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(b,S),B=C.width>S.width,T=C.height>S.height,P=(B?S:C).left,R=(B?S:C).right,L=(T?S:C).top,O=(T?S:C).bottom;if(k&&(r=true,!w))return;if(N&&(r=false),N&&!w)return void(r=true);if(w&&Z(e.relatedTarget)&&me(d.floating,e.relatedTarget))return;if(m&&Tn(m.nodesRef.current,h).some((e=>{let{context:t}=e;return null==t?void 0:t.open})))return;if("top"===x&&l>=S.bottom-1||"bottom"===x&&l<=S.top+1||"left"===x&&n>=S.right-1||"right"===x&&n<=S.left+1)return p();let F=[];switch(x){case "top":F=[[P,S.top+1],[P,C.bottom-1],[R,C.bottom-1],[R,S.top+1]];break;case "bottom":F=[[P,C.top+1],[P,S.bottom-1],[R,S.bottom-1],[R,C.top+1]];break;case "left":F=[[C.right-1,O],[C.right-1,L],[S.left+1,L],[S.left+1,O]];break;case "right":F=[[S.right-1,O],[S.right-1,L],[C.left+1,L],[C.left+1,O]];}if(!gi([g,v],F)){if(r&&!A)return p();if(!w&&i){const t=function(e,t){const n=performance.now(),i=n-c;if(null===a||null===s||0===i)return a=e,s=t,c=n,null;const o=e-a,r=t-s,l=Math.sqrt(o*o+r*r);return a=e,s=t,c=n,l/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}gi([g,v],function(e){let[n,i]=e;switch(x){case "top":return [[B?n+t/2:E?n+4*t:n-4*t,i+t+1],[B?n-t/2:E?n+4*t:n-4*t,i+t+1],...[[C.left,E||B?C.bottom-t:C.top],[C.right,E?B?C.bottom-t:C.top:C.bottom-t]]];case "bottom":return [[B?n+t/2:E?n+4*t:n-4*t,i-t],[B?n-t/2:E?n+4*t:n-4*t,i-t],...[[C.left,E||B?C.top+t:C.bottom],[C.right,E?B?C.top+t:C.bottom:C.top+t]]];case "left":{const e=[n+t+1,T?i+t/2:I?i+4*t:i-4*t],o=[n+t+1,T?i-t/2:I?i+4*t:i-4*t];return [...[[I||T?C.right-t:C.left,C.top],[I?T?C.right-t:C.left:C.right-t,C.bottom]],e,o]}case "right":return [[n-t,T?i+t/2:I?i+4*t:i-4*t],[n-t,T?i-t/2:I?i+4*t:i-4*t],...[[I||T?C.left+t:C.right,C.top],[I?T?C.left+t:C.right:C.left+t,C.bottom]]]}}([n,l]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return l.__options={blockPointerEvents:n},l}const bi=i.createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false}),yi=i.forwardRef((({className:t,disabled:n,children:i$1,...o},r)=>{const a=i.useContext(bi),c=ln(),l=kn(),u=c.index===a.activeIndex,d=w("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:jt([c.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,...a.getItemProps({onClick(e){o.onClick?.(e),l?.events.emit("click");},onFocus(e){o.onFocus?.(e),a.setHasFocusInside(true);}}),...o,children:i$1})}));yi.displayName="DropdownMenuItem";const wi=i.forwardRef((({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:h,children:m,...p},g)=>{const[v,b]=i.useState(false),[y,k]=i.useState(false),[N,S]=i.useState(null),C=i.useRef([]),x=i.useRef([]),E=i.useContext(bi),I=kn(),B=function(e){const t=mn(),n=kn(),i=wn();return rn((()=>{const e={id:t,parentId:i};return null==n||n.addNode(e),()=>{null==n||n.removeNode(e);}}),[n,t,i]),t}(),T=wn(),P=ln(),R=null!=T,{floatingStyles:L,refs:O,context:F}=ri({nodeId:B,open:v,onOpenChange:b,placement:R?"right-start":"bottom-start",middleware:[(D={mainAxis:R?0:4,alignmentAxis:R?-4:0},{...Pt(D),options:[D,M]}),$t(),Ht()],whileElementsMounted:Tt});var D,M;const z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:c=true,delay:l=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:h=true}=t,m=kn(),p=wn(),g=xn(u),v=xn(l),b=xn(n),y=i__namespace.useRef(),w=i__namespace.useRef(-1),k=i__namespace.useRef(),N=i__namespace.useRef(-1),S=i__namespace.useRef(true),C=i__namespace.useRef(false),x=i__namespace.useRef((()=>{})),E=i__namespace.useRef(false),I=i__namespace.useCallback((()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t}),[r]);i__namespace.useEffect((()=>{if(c)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(w.current),clearTimeout(N.current),S.current=true,E.current=false);}}),[c,a]),i__namespace.useEffect((()=>{if(!c)return;if(!g.current)return;if(!n)return;function e(e){I()&&o(false,e,"hover");}const t=Ne(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}}),[s.floating,n,o,c,g,I]);const A=i__namespace.useCallback((function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=In(v.current,"close",y.current);i&&!k.current?(clearTimeout(w.current),w.current=window.setTimeout((()=>o(false,e,n)),i)):t&&(clearTimeout(w.current),o(false,e,n));}),[v,o]),B=Jt((()=>{x.current(),k.current=void 0;})),T=Jt((()=>{if(C.current){const e=Ne(s.floating).body;e.style.pointerEvents="",e.removeAttribute(En),C.current=false;}})),P=Jt((()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type)));i__namespace.useEffect((()=>{if(c&&Z(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),h&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),h&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(w.current),S.current=false,d&&!ke(y.current)||f>0&&!In(v.current,"open"))return;const t=In(v.current,"open",y.current);t?w.current=window.setTimeout((()=>{b.current||o(true,e,"hover");}),t):n||o(true,e,"hover");}function i(e){if(P())return;x.current();const t=Ne(s.floating);if(clearTimeout(N.current),E.current=false,g.current&&r.current.floatingContext){n||clearTimeout(w.current),k.current=g.current({...r.current.floatingContext,tree:m,x:e.clientX,y:e.clientY,onClose(){T(),B(),P()||A(e,true,"safe-polygon");}});const i=k.current;return t.addEventListener("mousemove",i),void(x.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==y.current||!me(s.floating,e.relatedTarget))&&A(e);}function a(e){P()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:m,x:e.clientX,y:e.clientY,onClose(){T(),B(),P()||A(e);}})(e));}}),[s,c,e,d,f,h,A,B,T,o,n,b,m,v,g,r,P]),rn((()=>{var e;if(c&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&I()){C.current=true;const e=s.floating;if(Z(s.domReference)&&e){var t;const n=Ne(s.floating).body;n.setAttribute(En,"");const i=s.domReference,o=null==m||null==(t=m.nodesRef.current.find((e=>e.id===p)))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}}),[c,n,p,s,m,g,I]),rn((()=>{n||(y.current=void 0,E.current=false,B(),T());}),[n,B,T]),i__namespace.useEffect((()=>()=>{B(),clearTimeout(w.current),clearTimeout(N.current),T();}),[c,s.domReference,B,T]);const R=i__namespace.useMemo((()=>{function e(e){y.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){S.current||b.current||o(true,t,"hover");}d&&!ke(y.current)||n||0===f||E.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(N.current),"touch"===y.current?i():(E.current=true,N.current=window.setTimeout(i,f)));}}}),[d,o,n,b,f]),L=i__namespace.useMemo((()=>({onMouseEnter(){clearTimeout(w.current);},onMouseLeave(e){P()||A(e.nativeEvent,false);}})),[A,P]);return i__namespace.useMemo((()=>c?{reference:R,floating:L}:{}),[c,R,L])}(F,{enabled:R,delay:{open:75},handleClose:vi({blockPointerEvents:true})}),_=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:c="click",toggle:l=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,h=i__namespace.useRef(),m=i__namespace.useRef(false),p=i__namespace.useMemo((()=>({onPointerDown(e){h.current=e.pointerType;},onMouseDown(e){const t=h.current;0===e.button&&"click"!==c&&(ke(t,true)&&u||(!n||!l||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=h.current;"mousedown"===c&&h.current?h.current=void 0:ke(t,true)&&u||(!n||!l||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){h.current=void 0,e.defaultPrevented||!d||Zn(e)||(" "!==e.key||ei(a)||(e.preventDefault(),m.current=true),"Enter"===e.key&&o(!n||!l,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||Zn(e)||ei(a)||" "===e.key&&m.current&&(m.current=false,o(!n||!l,e.nativeEvent,"click"));}})),[r,a,c,u,d,o,n,f,l]);return i__namespace.useMemo((()=>s?{reference:p}:{}),[s,p])}(F,{event:"mousedown",toggle:!R,ignoreMouse:R}),H=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,c=null!=(n=pi.get(s))?n:s,l=mn(),u=null!=wn(),d=i__namespace.useMemo((()=>"tooltip"===c||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===c?"dialog":c,"aria-controls":o?r:void 0,..."listbox"===c&&{role:"combobox"},..."menu"===c&&{id:l},..."menu"===c&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}}),[c,r,u,o,l,s]),f=i__namespace.useMemo((()=>{const e={id:r,...c&&{role:c}};return "tooltip"===c||"label"===s?e:{...e,..."menu"===c&&{"aria-labelledby":l}}}),[c,r,l,s]),h=i__namespace.useCallback((e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}}),[r,s]);return i__namespace.useMemo((()=>a?{reference:d,floating:f,item:h}:{}),[a,d,f,h])}(F,{role:"menu"}),$=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:c=true,outsidePress:l=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:h=false,bubbles:m,capture:p}=t,g=kn(),v=Jt("function"==typeof l?l:()=>false),b="function"==typeof l?v:l,y=i__namespace.useRef(false),w=i__namespace.useRef(false),{escapeKey:k,outsidePress:N}=ii(m),{escapeKey:S,outsidePress:C}=ii(p),x=i__namespace.useRef(false),E=Jt((e=>{var t;if(!n||!s||!c||"Escape"!==e.key)return;if(x.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?Tn(g.nodesRef.current,i):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);})),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");})),I=Jt((e=>{var t;const n=()=>{var t;E(e),null==(t=Ce(e))||t.removeEventListener("keydown",n);};null==(t=Ce(e))||t.addEventListener("keydown",n);})),A=Jt((e=>{var t;const n=y.current;y.current=false;const i=w.current;if(w.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof b&&!b(e))return;const s=Ce(e),c="["+Cn("inert")+"]",l=Ne(r.floating).querySelectorAll(c);let d=Z(s)?s:null;for(;d&&!se(d);){const e=ue(d);if(se(e)||!Z(e))break;d=e;}if(l.length&&Z(s)&&!s.matches("html,body")&&!me(s,r.floating)&&Array.from(l).every((e=>!me(d,e))))return;if(ee(s)&&P){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===ce(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,h=g&&Tn(g.nodesRef.current,f).some((t=>{var n;return Se(e,null==(n=t.context)?void 0:n.elements.floating)}));if(Se(e,r.floating)||Se(e,r.domReference)||h)return;const m=g?Tn(g.nodesRef.current,f):[];if(m.length>0){let e=true;if(m.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);})),!e)return}o(false,e,"outside-press");})),B=Jt((e=>{var t;const n=()=>{var t;A(e),null==(t=Ce(e))||t.removeEventListener(u,n);};null==(t=Ce(e))||t.addEventListener(u,n);}));i__namespace.useEffect((()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=N;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),x.current=true;}function l(){e=window.setTimeout((()=>{x.current=false;}),ae()?5:0);}const d=Ne(r.floating);c&&(d.addEventListener("keydown",S?I:E,S),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",l)),b&&d.addEventListener(u,C?B:A,C);let f=[];return h&&(Z(r.domReference)&&(f=fe(r.domReference)),Z(r.floating)&&(f=f.concat(fe(r.floating))),!Z(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(fe(r.reference.contextElement)))),f=f.filter((e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)})),f.forEach((e=>{e.addEventListener("scroll",t,{passive:true});})),()=>{c&&(d.removeEventListener("keydown",S?I:E,S),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",l)),b&&d.removeEventListener(u,C?B:A,C),f.forEach((e=>{e.removeEventListener("scroll",t);})),window.clearTimeout(e);}}),[a,r,c,b,u,n,o,h,s,k,N,E,S,I,A,C,B]),i__namespace.useEffect((()=>{y.current=false;}),[b,u]);const T=i__namespace.useMemo((()=>({onKeyDown:E,[ti[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}})),[E,o,d,f]),P=i__namespace.useMemo((()=>({onKeyDown:E,onMouseDown(){w.current=true;},onMouseUp(){w.current=true;},[ni[u]]:()=>{y.current=true;}})),[E,u]);return i__namespace.useMemo((()=>s?{reference:T,floating:P}:{}),[s,T,P])}(F,{bubbles:true}),j=mi(F,{listRef:C,activeIndex:N,nested:R,onNavigate:S}),{getReferenceProps:V,getFloatingProps:U,getItemProps:J}=function(e){ void 0===e&&(e=[]);const t=e.map((e=>null==e?void 0:e.reference)),n=e.map((e=>null==e?void 0:e.floating)),o=e.map((e=>null==e?void 0:e.item)),r=i__namespace.useCallback((t=>ci(t,e,"reference")),t),a=i__namespace.useCallback((t=>ci(t,e,"floating")),n),s=i__namespace.useCallback((t=>ci(t,e,"item")),o);return i__namespace.useMemo((()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s})),[r,a,s])}([z,_,H,$,j]);i.useEffect((()=>{if(I)return I.events.on("click",e),I.events.on("menuopen",t),()=>{I.events.off("click",e),I.events.off("menuopen",t);};function e(){b(false);}function t(e){e.nodeId!==B&&e.parentId===T&&b(false);}}),[I,B,T]),i.useEffect((()=>{v&&I&&I.events.emit("menuopen",{parentId:T,nodeId:B});}),[I,v,B,T]);const W={activeIndex:N,setActiveIndex:S,getItemProps:J,setHasFocusInside:k,isOpen:v},q=i.useMemo((()=>W),[N,S,J,k,v]),K=w("io-dropdown-menu-button",R&&"io-dropdown-menu-item",v&&!R&&"active",n),G=jt([O.setReference,P.ref,g]),Y=E.activeIndex===P.index?0:-1;return jsxRuntimeExports.jsxs(Nn,{id:B,children:[jsxRuntimeExports.jsx(A,{className:K,ref:G,variant:R?"link":o,tabIndex:R?Y:void 0,role:R?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":R?"":void 0,"data-focus-inside":y?"":void 0,text:f,icon:R?"chevron-right":r,iconSize:"10",iconRight:!!R||a,disabled:h,...V(E.getItemProps({onFocus(e){p.onFocus?.(e),k(false),E.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx(bi.Provider,{value:q,children:jsxRuntimeExports.jsx(cn,{elementsRef:C,labelsRef:x,children:v&&jsxRuntimeExports.jsx(Xn,{context:F,modal:false,initialFocus:R?-1:0,returnFocus:!R,children:jsxRuntimeExports.jsx("div",{ref:O.setFloating,className:"io-dropdown-menu",style:L,...U(),children:m})})})})]})}));function ki({className:t,...n}){const i=w("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}wi.displayName="DropdownMenu";const Ni=i.forwardRef((({...t},n)=>null===wn()?jsxRuntimeExports.jsx(Sn,{children:jsxRuntimeExports.jsx(wi,{ref:n,...t})}):jsxRuntimeExports.jsx(wi,{ref:n,...t})));function Ci({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const c=w("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:c,...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function xi({className:t,children:n,...i}){const o=w("io-panel-header",t);return jsxRuntimeExports.jsx(j,{className:o,...i,children:n})}Ni.displayName="DropdownMenu",Ni.Item=yi,Ni.Separator=ki,xi.Title=E,xi.ButtonGroup=$,xi.Button=A,xi.ButtonIcon=N,xi.Dropdown=H;const Ei=i.forwardRef((({className:t,children:n,...i},o)=>{const r=w("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})}));function Ii({className:t,...n}){const i=w("io-panel-footer",t);return jsxRuntimeExports.jsx(J,{className:i,...n})}function Ai({className:t,children:n,...i}){const o=w("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pi({className:t,variant:n="active",value:i=0,...o}){const r=w("io-progress",n,t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${i<0?0:i>100?100:i}%`}})})}function Ri({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}Ei.displayName="PanelBody",Ii.ButtonGroup=$,Ii.Button=A,Ii.ButtonIcon=N,Ii.Dropdown=H,Ai.Header=xi,Ai.Body=Ei,Ai.Footer=Ii;const Li=i.forwardRef((({id:n="input",className:i$1,type:o="text",name:a="input",align:s="up",label:c,iconPrepend:l,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:h,disabled:m,readOnly:p,errorMessage:g,...v},b)=>{const y=w("io-control-input",l&&"io-control-leading-icon",d&&"io-control-trailing-icon",m&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i$1),N=i.useCallback((e=>{m?e.preventDefault():u&&u(e);}),[u,m]),S=i.useCallback((e=>{m?e.preventDefault():f&&f(e);}),[f,m]);return jsxRuntimeExports.jsxs("div",{className:y,children:[c&&jsxRuntimeExports.jsx(Ri,{htmlFor:n,text:c}),l&&jsxRuntimeExports.jsx(k,{variant:l,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:b,type:o,name:a,tabIndex:0,placeholder:h??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),disabled:m,readOnly:p,...v}),d&&jsxRuntimeExports.jsx(k,{variant:d,onClick:e=>S(e)}),g&&jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(k,{variant:"close"}),g]})]})}));Li.displayName="Input";const Oi=i.forwardRef((({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:c="Enter text here...",disabled:l,readOnly:u,...d},f)=>{const h=w("io-control-textarea",l&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:h,children:[a&&jsxRuntimeExports.jsx(Ri,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:c,disabled:l,readOnly:u,rows:s,...d})]})}));Oi.displayName="Textarea";const Fi=i.forwardRef((({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:c,...l},u)=>{const d=w("io-control-checkbox",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:0,checked:s,disabled:c,...l}),a&&jsxRuntimeExports.jsx(Ri,{htmlFor:n,text:a})]})}));Fi.displayName="Checkbox";const Di=i.forwardRef((({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:c,...l},u)=>{const d=w("io-control-radio",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:0,checked:s,disabled:c,...l}),a&&jsxRuntimeExports.jsx(Ri,{htmlFor:n,text:a})]})}));Di.displayName="Radio";const Mi=i.forwardRef((({id:n="toggle",className:i,name:o="toggle",align:r="left",label:a="Toggle",checked:s,disabled:c,...l},u)=>{const d=w("io-control-toggle",s&&"io-control-checked",c&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:d,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,checked:s,disabled:c,...l}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})}));Mi.displayName="Toggle";const Hi=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e);function $i({app:e,prefKey:t,decoder:n}){const i$1=i.useContext(IOConnectContext),[o,a]=i.useState(),[l,f]=i.useState(true),[h,m]=i.useState(),p=i.useRef(0),v=i.useCallback((e=>{if(null==e)return;return n.runWithException(e)}),[n]),b=i.useCallback((async()=>{if(!i$1)return;const n=await i$1.prefs.get(e);try{return v(n?.data[t])}catch(e){throw new Error(`The stored value for prefKey "${t}" is of an incorrect shape: ${Hi(e)}`)}}),[e,i$1,t,v]),y=i.useCallback((async n=>{if(!i$1)return;const o=++p.current;f(true),m(void 0);const r=e=>{o===p.current&&(f(false),e&&(console.error(e),m({message:Hi(e)})));};let a,s;if(n instanceof Function)try{a=n(await b());}catch(e){return r(e)}else a=n;try{s=v(a);}catch(e){return r(`The provided value for prefKey "${t}" is of an incorrect shape: ${Hi(e)}`)}try{await i$1.prefs.updateFor(e,{[t]:s});}catch(e){return r(e)}r();}),[e,b,i$1,t,v]);return i.useEffect((()=>{if(!i$1)return;let n=true;const o=i$1.prefs.subscribeFor(e,(e=>{try{const n=v(e.data[t]);a(n),m(void 0);}catch(e){const n=`The stored value for prefKey "${t}" is of an incorrect shape: ${Hi(e)}`;console.error(n),m({message:n});}n&&(n=false,f(false));}));return o}),[e,t,i$1,v]),{error:h,isLoading:l,value:o,update:y}}function Ui(e,t=500){const[n,i$1]=i.useState(e);return i.useEffect((()=>{const n=setTimeout((()=>{i$1(e);}),t);return ()=>clearTimeout(n)}),[e,t]),n}i.createContext({theme:"dark"});function Yi(e,t,n){return Math.min(Math.max(e,n),t)}class Qi extends Error{constructor(e){super(`Failed to parse color: "${e}"`);}}var Xi=Qi;function Zi(e){if("string"!=typeof e)throw new Xi(e);if("transparent"===e.trim().toLowerCase())return [0,0,0,0];let t=e.trim();t=so.test(e)?function(e){const t=e.toLowerCase().trim(),n=to[function(e){let t=5381,n=e.length;for(;n;)t=33*t^e.charCodeAt(--n);return (t>>>0)%2341}(t)];if(!n)throw new Xi(e);return `#${n}`}(e):e;const n=io.exec(t);if(n){const e=Array.from(n).slice(1);return [...e.slice(0,3).map((e=>parseInt(no(e,2),16))),parseInt(no(e[3]||"f",2),16)/255]}const i=oo.exec(t);if(i){const e=Array.from(i).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,16))),parseInt(e[3]||"ff",16)/255]}const o=ro.exec(t);if(o){const e=Array.from(o).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,10))),parseFloat(e[3]||"1")]}const r=ao.exec(t);if(r){const[t,n,i,o]=Array.from(r).slice(1).map(parseFloat);if(Yi(0,100,n)!==n)throw new Xi(e);if(Yi(0,100,i)!==i)throw new Xi(e);return [...lo(t,n,i),Number.isNaN(o)?1:o]}throw new Xi(e)}const eo=e=>parseInt(e.replace(/_/g,""),36),to="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce(((e,t)=>{const n=eo(t.substring(0,3)),i=eo(t.substring(3)).toString(16);let o="";for(let e=0;e<6-i.length;e++)o+="0";return e[n]=`${o}${i}`,e}),{});const no=(e,t)=>Array.from(Array(t)).map((()=>e)).join(""),io=new RegExp(`^#${no("([a-f0-9])",3)}([a-f0-9])?$`,"i"),oo=new RegExp(`^#${no("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),ro=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${no(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),ao=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,so=/^[a-z]+$/i,co=e=>Math.round(255*e),lo=(e,t,n)=>{let i=n/100;if(0===t)return [i,i,i].map(co);const o=(e%360+360)%360/60,r=(1-Math.abs(2*i-1))*(t/100),a=r*(1-Math.abs(o%2-1));let s=0,c=0,l=0;o>=0&&o<1?(s=r,c=a):o>=1&&o<2?(s=a,c=r):o>=2&&o<3?(c=r,l=a):o>=3&&o<4?(c=a,l=r):o>=4&&o<5?(s=a,l=r):o>=5&&o<6&&(s=r,l=a);const u=i-r/2;return [s+u,c+u,l+u].map(co)};function uo(e){return function(e){if("transparent"===e)return 0;function t(e){const t=e/255;return t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}const[n,i,o]=Zi(e);return .2126*t(n)+.7152*t(i)+.0722*t(o)}(e)>.179}function fo({className:t,channel:n,...i}){const o=w("io-channel-badge",t);return jsxRuntimeExports.jsx("div",{className:o,style:{color:(r=n.color,uo(r)?"#000":"#fff"),backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-badge-label",children:n.label})});var r;}function ho(){return jsxRuntimeExports.jsx(k,{variant:"check"})}function mo({channel:i,handleChannelRestricted:o,restricted:r}){return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Mi,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},disabled:r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Mi,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},disabled:r?.read})})]})}const po=i.createContext({});function go({channel:t,isSelected:n,onChannelSelect:i$1,onChannelRestrict:o,...a}){const{variant:c,selectedChannels:l,restrictedChannels:u}=i.useContext(po),d=n||t.isSelected||l?.includes(t),f=u?.find((e=>e.name===t.name)),h=i.useCallback((()=>i$1?.({...t,isSelected:!d})),[t,i$1,d]),m=i.useCallback((e=>{o&&o(e);}),[o]);return jsxRuntimeExports.jsx(R,{prepend:jsxRuntimeExports.jsx(fo,{channel:t}),append:"single"===c||"multi"===c?d&&jsxRuntimeExports.jsx(ho,{}):jsxRuntimeExports.jsx(mo,{channel:t,handleChannelRestricted:m,restricted:f}),isSelected:d,onClick:h,...a,children:t.name},t.name)}const vo=i.forwardRef((({className:n,variant:i$1="single",variantToggle:o=false,channels:r=[],restrictedChannels:a=[],onVariantChange:s,onChannelSelect:c,onChannelRestrict:u,...d},f)=>{const h=w("io-list-channels","directionalSingle"===i$1&&"io-bi-direction",n),m=r.filter((e=>e.isSelected)),p=i.useMemo((()=>({variant:i$1,selectedChannels:m,restrictedChannels:a,onVariantChange:s,onChannelSelect:c,onChannelRestrict:u})),[i$1,m,a,s,c,u]);let g="Select Channel";return "multi"===i$1?g="Select Channels":"directionalSingle"===i$1&&(g="Select Directional Channel"),jsxRuntimeExports.jsx(po.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:h,ref:f,children:jsxRuntimeExports.jsxs(z,{variant:"single",...d,children:[jsxRuntimeExports.jsx(z.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Mi,{label:"Directional",align:"right",onChange:e=>s&&s(e.target.checked),checked:"directionalSingle"===i$1}),children:g}),r?.map((t=>jsxRuntimeExports.jsx(go,{channel:t,onChannelSelect:c,onChannelRestrict:u},t.name)))]})})})}));vo.displayName="ChannelSelector";i.createContext({config:{message:""},theme:"dark",setResult:()=>{}});function To({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=tr();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(j,{children:[jsxRuntimeExports.jsx(j.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{})]}),jsxRuntimeExports.jsx(i,{})]})}const Ro=i.createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},isSearchVisible:false,showSearch:()=>{},hideSearch:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),Lo=()=>i.useContext(Ro);function Oo({className:n,icon:i$1="search",placeholder:o="Search",...r}){const a=w("io-header-search",n),s=i.useRef(null),{isSearchVisible:c,searchQuery:l,setSearch:f,itemsCount:h}=Lo();return i.useEffect((()=>{c?s.current?.focus():(s.current?.blur(),f(""));}),[c,f]),c?jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Li,{ref:s,value:l,iconPrepend:i$1,placeholder:o,onChange:e=>f(e.target.value),...r}),c&&l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${h} results`})]}):null}function Fo({className:n,...i}){const{SearchButton:o,SettingsButton:r,MoreButton:a}=tr();return jsxRuntimeExports.jsxs($,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})}function Do({...t}){const{isSearchVisible:n,showSearch:i,hideSearch:o,items:r}=Lo();return jsxRuntimeExports.jsx(N,{icon:n?"search-filled":"search",variant:"circle",size:"32",onClick:n?o:i,disabled:0===r.length,...t})}function Mo({icon:t="cog",...n}){const{showSettings:i}=Lo();return jsxRuntimeExports.jsx(N,{icon:t,variant:"circle",size:"32",onClick:i,...n})}function zo({icon:n="ellipsis",...i}){const{items:o,clearItems:r}=Lo(),a=0===o.length;return jsxRuntimeExports.jsxs(H,{variant:"light",...i,children:[jsxRuntimeExports.jsx(H.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{children:jsxRuntimeExports.jsx(H.Item,{disabled:a,onClick:e=>(e=>{a?e.stopPropagation():r();})(e),children:"Clear All"})})})]})}function _o(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),c=e.getMinutes();let l="";return l=c<10?`0${c}`:`${c}`,t?"Today"===t?n?"Today":`Today at ${s}:${l}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${l}`:`${s}:${l}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${l}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${l}`}function Ho(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),c=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?_o(n,"Today",false,true):s?_o(n,"Yesterday",false,true):c?_o(n,false,false,true):_o(n):a?"Today":s?"Yesterday":c?_o(n,false,true,true):_o(n,false,true)}function $o({className:t,...n}){const i$1=w("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=tr(),{items:s,searchQuery:c,setCount:d,sortItems:f}=Lo(),h=f(s),m=Ui(c),p=i.useMemo((()=>h.filter((e=>e.displayInfo.filename.toLowerCase().includes(m.toLowerCase())||e.displayInfo.url.toLowerCase().includes(m.toLowerCase())))),[h,m]),g=i.useMemo((()=>p.map((e=>({...e,displayInfo:{...e.displayInfo,startTime:Ho(e.displayInfo.startTime,{showTime:false})}})))),[p]),v=i.useMemo((()=>Object.values(g.reduce(((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e)),{}))),[g]);return i.useEffect((()=>{d(p.length);}),[p,d]),jsxRuntimeExports.jsx("div",{className:i$1,...n,children:v&&0!==v.length?v.map((t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map((t=>jsxRuntimeExports.jsx(a,{item:t},t.id)))},t[0].id??""))):jsxRuntimeExports.jsx(o,{})})}function jo({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=w("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(k,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function Vo({className:n,title:i,children:o,...r}){const a=w("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function Uo({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:c}=tr(),{state:l,url:u,filename:d,receivedBytes:f,totalBytes:h,speed:m,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=w("io-dm-item",o.displayInfo.state&&[l],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:l}),jsxRuntimeExports.jsx(s,{state:l,url:u,bytesReceived:f,bytesTotal:h,speed:m,timeRemaining:p}),jsxRuntimeExports.jsx(c,{itemID:o.id,state:l})]})}function Jo({bytesReceived:t=0,bytesTotal:n=0,...i$1}){const o=i.useCallback((()=>t&&n?Math.round(t/n*100):0),[t,n]);return jsxRuntimeExports.jsx(Pi,{value:o(),...i$1})}function Wo({className:n,itemID:i$1,filename:o,state:a,cancel:s,remove:c,...l}){const u=w("io-dm-item-header",n),{cancelItem:d,removeItem:f}=Lo(),h=i.useCallback((e=>{s?s(e):d(e);}),[s,d]),m=i.useCallback((e=>{c?c(e):f(e);}),[c,f]);return jsxRuntimeExports.jsxs("div",{className:u,...l,children:[jsxRuntimeExports.jsx(E,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",onClick:()=>{"progressing"===a||"paused"===a?h(i$1):m(i$1);}})]})}function qo({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:c=0,...l}){const u=w("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...l,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(h=i,"cancelled"===h||"interrupted"===h||"completed"===h?null:jsxRuntimeExports.jsx(Jo,{variant:"paused"===h?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(c)??0}`})]});var f,h;}const Ko={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Go({className:n,variant:i,text:o}){const r=w("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(k,{variant:Ko[i],className:"icon-severity"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function Yo({className:i$1,itemID:o,state:a,pauseResume:s,showInFolder:c,cancel:l,...u}){const d=w("io-dm-item-footer",i$1),{pauseResumeItem:f,showItemInFolder:h,cancelItem:m}=Lo(),p=i.useCallback((e=>{s?s(e):f(e);}),[s,f]),g=i.useCallback((e=>{c?c(e):h(e);}),[c,h]),v=i.useCallback((e=>{l?l(e):m(e);}),[l,m]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs($,{align:"right",children:[jsxRuntimeExports.jsx($.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx($.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx($,{align:"right",children:jsxRuntimeExports.jsx($.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Go,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx($,{align:"right",children:jsxRuntimeExports.jsx($.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:jsxRuntimeExports.jsx(Go,{variant:"warning",text:"Cancelled"})});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Go,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx($,{align:"right",children:jsxRuntimeExports.jsx($.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function Qo({className:n,title:i="Settings",...o}){const r=w("io-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:c,setDownloadLocationWithDialog:l,isDownloadLocationDialogVisible:u,downloadLocationList:d}=Lo();return jsxRuntimeExports.jsxs(Ai,{className:r,...o,children:[jsxRuntimeExports.jsxs(Ai.Header,{children:[jsxRuntimeExports.jsx(Ai.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Ai.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Ai.Body,{children:jsxRuntimeExports.jsxs($,{children:[jsxRuntimeExports.jsxs(H,{variant:"outline",disabled:u,children:[jsxRuntimeExports.jsx(H.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{children:d.map(((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(H.Item,{onClick:()=>{c(t);},children:t},t)))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-settings-panel-download-location-btn",text:"Browse",onClick:()=>{l();},disabled:u})]})})]})}const Xo={Header:To,ItemSearch:Oo,HeaderButtons:Fo,SearchButton:Do,SettingsButton:Mo,MoreButton:zo,Body:$o,DownloadListEmpty:jo,ItemGroup:Vo,Item:Uo,ItemProgress:Jo,ItemHeader:Wo,ItemBody:qo,ItemFooter:Yo,Settings:Qo},Zo=i.createContext(Xo),er=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Xo,...n})),[n]);return jsxRuntimeExports.jsx(Zo.Provider,{value:i$1,children:t})}));er.displayName="ComponentsStore";const tr=()=>i.useContext(Zo);function or(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout((function(){o.forEach((function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}}));}),0),function(){var i=n[e];i&&(i=i.reduce((function(e,n,i){return n===t&&e.length===i||e.push(n),e}),[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach((function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}})),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}or.default=or;v(or);const sr=i.createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),cr=()=>i.useContext(sr);function lr({...n}){const{config:i,close:o}=cr(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(j,{draggable:true,...n,children:[jsxRuntimeExports.jsx(j.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(j.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(j.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function ur({className:n,handleSubmit:i,...o}){const r=w("io-panel-body",n),{config:a,submitFeedback:s}=cr(),{IntroField:c,DescriptionField:l,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:h,SettingsField:m,MailListField:p}=Ar(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(c,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(m,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(h,{})]})}function dr({...n}){const{FooterButtons:i}=Ar(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=cr();return jsxRuntimeExports.jsx(J,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(I,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Ci,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(I,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function fr({className:t,...n}){const{CloseButton:i}=Ar(),{close:o}=cr();return jsxRuntimeExports.jsx($,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function hr({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=Ar(),{close:s,submitCompleted:c}=cr();return c?jsxRuntimeExports.jsx($,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs($,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function mr({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function pr({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function gr({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function vr({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...a,children:r}):null}function br({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(I,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(Oi,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function yr({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...c}){const{config:l}=cr(),u=t??l.errorMessage,d=r??l.errorMessage;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Oi,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function wr({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...c}){const{config:l}=cr(),u=t??l.showEnvironmentInfo,d=r??l.environmentInfo;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Oi,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function kr({showField:t=true,className:n,title:i$1="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:c,selectedCategories:l,...u}){const d=w("io-block-list-gap",n),{config:f}=cr(),h=c??f.attachments,m=l??f.selectedCategories,p=i.useCallback((e=>!!m&&-1!==m.indexOf(e)),[m]);return t?!h||h.length<=0?jsxRuntimeExports.jsx(I,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(I,{className:d,title:i$1,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:h.map((t=>jsxRuntimeExports.jsx(Fi,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id)))})}):null}function Nr({showField:t=true,className:n,title:i$1="Attachments",hint:o,readOnly:a=false,disabled:s,categories:c,selectedCategories:l,...u}){const{config:d,attachmentCategories:f}=cr(),h=c??f,m=l??d.selectedCategories,p=i.useCallback((e=>!!m&&-1!==m.indexOf(e)),[m]);return t?!h||h.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(I,{className:n,title:i$1,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:h.map((t=>jsxRuntimeExports.jsx(Mi,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t)))})}):null}function Sr({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:c,sendEmailLabel:l="Send Email",readOnly:u=false,disabled:d,...f}){const h=w("io-block-list-gap",n),{config:m,showMailingList:p,setShowMailingList:g}=cr();if(!r)return null;const v=a??m.createJiraTicket,b=c??m.sendEmail;return jsxRuntimeExports.jsxs(I,{className:h,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(Mi,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),b&&jsxRuntimeExports.jsx(Mi,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:l,align:"right",readOnly:u,disabled:d,defaultChecked:b})]})}function Cr({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...c}){const{config:l,showMailingList:u}=cr(),d=t??l.sendEmail,f=a??false===l.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(I,{className:n,hint:o,...c,children:jsxRuntimeExports.jsx(Li,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:l.mailingList??""})}):null}const xr={Header:lr,Body:ur,Footer:dr,HeaderButtons:fr,FooterButtons:hr,SubmitButton:mr,CancelButton:pr,CloseButton:gr,IntroField:vr,DescriptionField:br,TechInfoField:yr,EnvInfoField:wr,FileAttachmentsField:kr,CategoryAttachmentsField:Nr,SettingsField:Sr,MailListField:Cr},Er=i.createContext(xr),Ir=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...xr,...n})),[n]);return jsxRuntimeExports.jsx(Er.Provider,{value:i$1,children:t})}));function Ar(e){return {...i.useContext(Er),...e}}Ir.displayName="ComponentsStore";function Rr(e){const t=i.useContext(IOConnectContext),n=t?.appManager,[i$1,o]=i.useState([]),[a,l]=i.useState(0),d="*",f=i.useCallback((e=>[...e].sort(((e,t)=>{const n=(e.title??e.name).toLowerCase(),i=(t.title??t.name).toLowerCase();return n<i?-1:n>i?1:0}))),[]);return i.useEffect((()=>{if(!n)return;const e=n.onAppAdded((e=>{o((t=>[...t,{title:e.title,name:e.name,hidden:e.hidden}]));}));return ()=>{e();}}),[n]),i.useEffect((()=>{if(!n)return;const e=n.onAppRemoved((e=>{o((t=>t.filter((t=>t.name!==e.name))));}));return ()=>{e();}}),[n,i$1]),i.useEffect((()=>{if(!n)return;const e=n.onAppChanged((e=>{o((t=>{const n=t.find((t=>t.name===e.name));return [...t.filter((t=>t.name!==e.name)),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed}]}));}));return ()=>{e();}}),[n]),i.useEffect((()=>{const n=e?.allApplications??t.appManager.applications().length;let r=0;const a=[...i$1],s=e?.sourceFilter;if(void 0===s||!Array.isArray(s.allowed)||!Array.isArray(s.blocked))return;const c=s.allowed,u=s.blocked;0===c.length||-1!==u.indexOf(d)||0===c.length&&0===u.length||-1!==c.indexOf(d)&&-1!==u.indexOf(d)?(r=n,a.forEach((e=>{e.allowed=false;}))):-1!==c.indexOf(d)&&a.forEach((e=>{e.allowed=true;})),-1===u.indexOf(d)&&u.length>0&&(r=s.blocked.length),c.forEach((e=>{const t=a.find((t=>t.name===e));t&&(t.allowed=true);})),u.forEach((e=>{const t=a.find((t=>t.name===e));t&&(t.allowed=false);})),l(n-r),o(a);}),[e]),{apps:i$1,allowedApps:a,sortAppsAlphabetically:f}}const Dr=i.createContext({allApps:[],settings:{},configuration:{},notifications:[],onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],isPanelVisible:false,saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{}}),Mr=()=>i.useContext(Dr);const zr=i.createContext({isSearchVisible:false,showSearch:()=>{},hideSearch:()=>{},searchQuery:"",setSearch:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},notificationsCount:0,setCount:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),_r=()=>i.useContext(zr);function Hr({...n}){const{HeaderCaption:i,HeaderActions:o,HeaderBulkActions:r,HeaderSearch:a}=Xa(),{isBulkActionsSupported:s}=Mr(),{isBulkActionsVisible:c,notificationsCount:l}=_r();return jsxRuntimeExports.jsxs(xi,{...n,children:[jsxRuntimeExports.jsx(i,{}),s?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${c&&l>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]}):jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(a,{})]})}function $r({className:n,...i}){const o=w("io-panel-header-caption",n),{HeaderCaptionTitle:r,HeaderCaptionCount:a,HeaderCaptionButtons:s}=Xa();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}function jr({className:n,...i}){const o=w("io-panel-header-caption-filter",n),{allApplications:r,allowedApplications:a}=Mr();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsx(k,{variant:"filter"}),jsxRuntimeExports.jsx("span",{className:"io-panel-header-caption-filter-allowed",children:a}),"of"," ",jsxRuntimeExports.jsx("span",{className:"io-panel-header-caption-filter-all",children:r}),"apps"]})}function Vr({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=_r();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}function Ur({...n}){const{HeaderCaptionButtonSearch:i,HeaderCaptionButtonSettings:o,HeaderCaptionButtonClose:r}=Xa();return jsxRuntimeExports.jsxs($,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}const Jr="newest",Wr=["None","Low","Medium","High","Critical"],qr={key:Jr,descending:true},Kr=e=>[...e].sort(((e,t)=>(t.timestamp||0)-(e.timestamp||0))),Gr=e=>[...e].sort(((e,t)=>(e.timestamp||0)-(t.timestamp||0))),Yr=(e,t)=>{const n=Wr[0];return [...e].sort(((e,i)=>{const o=Wr.indexOf(e.severity||n),r=Wr.indexOf(i.severity||n);return (t?-1:1)*(o-r)}))},Qr={[Jr]:Kr,["oldest"]:Gr,["severity"]:Yr};function Xr({...t}){const[n,i$1]=i.useState([]),{NotificationsList:o,Notification:r}=Xa(),{sortNotificationsBy:a,viewNotificationsBy:s,setCount:f,searchQuery:h,notificationsCount:m}=_r(),{notifications:p}=Mr(),g=i.useRef(null),v=Ui(h),b=i.useMemo((()=>((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter((e=>"Active"===e.state||"Stale"===e.state));case "read":return e.filter((e=>"Acknowledged"===e.state||"Seen"===e.state));case "snoozed":return e.filter((e=>"Snoozed"===e.state))}})(p,s)),[p,s]),y=i.useMemo((()=>b.filter((e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase())))),[b,v]);return i.useEffect((()=>{switch(a){case "newest":i$1(Kr(y));break;case "oldest":i$1(Gr(y));break;case "severity":i$1(Yr(y,true));break;default:i$1(y);}f(y.length);}),[y,a,f]),i.useEffect((()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});}),[v,m,a,s]),jsxRuntimeExports.jsx(Ei,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function Zr({...t}){const{FooterButtons:n}=Xa();return jsxRuntimeExports.jsx(Ii,{...t,children:jsxRuntimeExports.jsx(n,{})})}function ea({className:n,...i$1}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=Xa(),{notifications:a}=Mr(),[s,l]=i.useState(false);return i.useEffect((()=>{a.filter((e=>"Stale"===e.state||"Acknowledged"===e.state)).length>0?l(true):l(false);}),[a]),jsxRuntimeExports.jsxs($,{className:n,align:"right",...i$1,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function ta({text:t="Clear All",...n}){const{clearAll:i}=Mr();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function na({text:t="Clear Old",...n}){const{clearAllOld:i}=Mr();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function ia({className:n,title:i="Settings",...o}){const r=w("io-settings-panel",n),{SettingsGeneral:a,SettingsPlacement:s,SettingsStacking:c,SettingsSnooze:l,SettingsSubscriptions:u}=Xa(),{hideSettings:d}=_r();return jsxRuntimeExports.jsxs(Ai,{className:r,...o,children:[jsxRuntimeExports.jsxs(Ai.Header,{children:[jsxRuntimeExports.jsx(Ai.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Ai.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(Ai.Header.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:d})})]}),jsxRuntimeExports.jsxs(Ai.Body,{children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{})]})]})}function oa({className:n,title:i="General",...o}){const r=w("io-panel-settings-general",n),{SettingsAllowNotifications:a,SettingsShowNotificationBadge:s,SettingsCloseNotificationOnClick:c,SettingsPanelAutoHide:l,SettingsHideToastsAfter:u}=Xa();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{})]})})}function ra({label:t="Allow notifications",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({enabledNotifications:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.enabledNotifications,...i$1})}function aa({label:t="Show notification badge",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({showNotificationBadge:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.showNotificationBadge,disabled:!o.enabledNotifications,...i$1})}function sa({label:t="Close notification on click",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({closeNotificationOnClick:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.closeNotificationOnClick,disabled:!o.enabledNotifications,...i$1})}function ca({label:t="Auto hide panel",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({autoHidePanel:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.autoHidePanel,...i$1})}function la({label:t="Panel always on top",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({alwaysOnTop:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.alwaysOnTop,...i$1})}function ua({className:n,title:i$1="Hide toasts after",items:o=[15,30,45,60],...a}){const s=w("flex","jc-between","ai-center",n),{settings:c,saveSetting:l}=Mr(),u=i.useCallback((e=>{e||(e=15e3),c.toastExpiry!==e&&l({toastExpiry:1e3*e});}),[c.toastExpiry,l]),d=e=>e<60?`${e} seconds`:60===e?"1 minute":e/60+" minutes";return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(c.enabledNotifications?"":"io-text-disabled"),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs(H,{variant:"light",disabled:!c.enabledNotifications,children:[jsxRuntimeExports.jsx(H.Button,{text:d(c.toastExpiry/1e3)}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>{u(t);},children:d(t)},t)))})})]})]})}function da({className:n,title:i="Highlight new for",...o}){const r=w("flex","jc-between","ai-center",n),{settings:a}=Mr(),s=["30 seconds","1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(a.enabledNotifications?"":"io-text-disabled"),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(H,{variant:"outline",disabled:!a.enabledNotifications,children:[jsxRuntimeExports.jsx(H.Button,{text:s[0]}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:s.map((t=>jsxRuntimeExports.jsx(H.Item,{children:t},t)))})})]})]})}function fa({className:n,title:i="Mark as read after",...o}){const r=w("flex","jc-between","ai-center",n),{settings:a}=Mr(),s=["1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(a.enabledNotifications?"":"io-text-disabled"),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs(H,{variant:"outline",disabled:!a.enabledNotifications,children:[jsxRuntimeExports.jsx(H.Button,{text:s[0]}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:s.map((t=>jsxRuntimeExports.jsx(H.Item,{children:t},t)))})})]})]})}function ha({className:n,title:i="Stacking",...o}){const r=w("io-panel-settings-stacking",n),{SettingsToastStacking:a,SettingsToastStackBy:s}=Xa();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})})}function ma({label:t="Allow toast stacking",align:n="right",...i$1}){const{settings:o,saveSetting:a}=Mr(),s=i.useCallback((e=>{a({toastStacking:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Mi,{label:t,align:n,onChange:s,checked:o.toastStacking,disabled:!o.enabledNotifications,...i$1})}const pa=e=>e.replace(/(^|-)\w/g,(e=>e.toUpperCase().replace("-"," ")));function ga({className:n,title:i$1="Group by",...o}){const a=w("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Mr(),l=i.useCallback((e=>{e||(e="severity"),s.stackBy!==e&&c({stackBy:e.toLowerCase()});}),[s.stackBy,c]);return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(s.enabledNotifications?"":"io-text-disabled"),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs(H,{variant:"light",disabled:!s.enabledNotifications,children:[jsxRuntimeExports.jsx(H.Button,{text:s.stackBy?pa(s.stackBy):"Severity"}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:["Severity","Application"].map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>{l(t);},children:t},t)))})})]})]})}function va({className:n,title:i="Placement",...o}){const r=w("io-panel-settings-placement",n),{SettingsPlacementPanel:a,SettingsPlacementToasts:s}=Xa();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})})}function ba({className:n,title:i$1="Panel position",...o}){const a=w("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Mr(),l=i.useCallback((e=>{e||(e="right"),s.placement?.panel!==e&&c({placement:{...s.placement,panel:e.toLowerCase()}});}),[s.placement,c]);return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs(H,{variant:"light",children:[jsxRuntimeExports.jsx(H.Button,{text:s.placement?.panel?pa(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:["Right","Left"].map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>{l(t);},children:t},t)))})})]})]})}function ya({className:n,title:i$1="Toasts position",...o}){const a=w("flex","jc-between","ai-center",n),{settings:s,saveSetting:c}=Mr(),l=i.useCallback((e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();c({placement:{...s.placement,toasts:t}});}),[s.placement,c]);return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs(H,{variant:"light",children:[jsxRuntimeExports.jsx(H.Button,{text:s.placement?.toasts?pa(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>{l(t);},children:t},t)))})})]})]})}function wa({className:t,title:n="Snooze",...i}){const o=w("io-panel-settings-snooze",t),{SettingsSnoozeDuration:r}=Xa(),{settings:a}=Mr();return a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(I,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function ka({className:n,title:i$1="Default duration",items:o=[60,120,180,300],...a}){const s=w("flex","jc-between","ai-center",n),{settings:c,saveSetting:l}=Mr(),u=i.useCallback((e=>{e||(e=6e4),c.snooze&&c.snooze?.duration!==e&&l({snooze:{...c.snooze,duration:1e3*e}});}),[c.snooze,l]),d=e=>e<60?`${e} seconds`:60===e?"1 minute":e/60+" minutes";return c.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(c.enabledNotifications?"":"io-text-disabled"),children:jsxRuntimeExports.jsx("span",{children:i$1})}),jsxRuntimeExports.jsxs(H,{variant:"outline",disabled:!c.enabledNotifications,children:[jsxRuntimeExports.jsx(H.Button,{text:d(c.snooze?.duration/1e3)}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>{u(t);},children:d(t)},t)))})})]})]}):null}function Na({className:n,title:i="Subscribe and Mute",...o}){const r=w("io-panel-settings-subscriptions",n),{SettingsSubscribeAll:a,SettingsSubscribeApp:s,SettingsSubscribeMuteAll:c,SettingsSubscribeMuteApp:l}=Xa(),{allApps:u}=Mr(),{sortAppsAlphabetically:d}=Rr(),f=d(u);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-settings-subscriptions-grid",children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:"io-panel-settings-subscriptions-grid",children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),jsxRuntimeExports.jsx(c,{label:""})]}),f.map((n=>!n||n.hidden?null:jsxRuntimeExports.jsxs("div",{className:"io-panel-settings-subscriptions-grid",children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),jsxRuntimeExports.jsx(l,{app:n,label:""})]},n.name)))]})})}function Sa({label:t="All apps",align:n="right",...i$1}){const{settings:o,configuration:a,saveAllFilter:s}=Mr(),c=i.useCallback((e=>{s({subscribe:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Mi,{align:n,label:t,onChange:c,checked:a.sourceFilter?.allowed?.includes("*"),disabled:!o.enabledNotifications,...i$1})}function Ca({label:t="App",align:n="right",app:i$1,...o}){const{allApps:a,settings:s,configuration:c,saveFilter:l}=Mr(),u=i.useCallback(((e,t)=>{const n={...c.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach((e=>{e.name!==t.name&&n.allowed?.push(e.name);}))),e?(n.allowed?.push(t.name),n.blocked=n.blocked?.filter((e=>e!==t.name))):(n.allowed=n.allowed?.filter((e=>e!==t.name)),n.blocked?.push(t.name)),n.allowed?.length&&n.allowed?.length>0&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),l(n);}),[a,c.sourceFilter,l]);return jsxRuntimeExports.jsx(Mi,{id:i$1.name,label:t,align:n,onChange:e=>u(e.target.checked,i$1),checked:c.sourceFilter?.allowed?.includes("*")||c.sourceFilter?.allowed?.includes(i$1.name),disabled:!s.enabledNotifications,...o})}function xa({label:t="Mute all",align:n="right",...i$1}){const{settings:o,configuration:a,saveAllFilter:s}=Mr(),c=i.useCallback((e=>{s({mute:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Mi,{align:n,label:t,onChange:c,checked:a.sourceFilter?.muted?.includes("*"),disabled:!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*"),...i$1})}function Ea({label:t="App",align:n="right",app:i$1,...o}){const{allApps:a,settings:s,configuration:c,saveFilter:l}=Mr(),u=i.useCallback(((e,t)=>{const n={...c.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach((e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);}))),e?n.muted?.push(t.name):n.muted=n.muted?.filter((e=>e!==t.name)),l(n);}),[a,c.sourceFilter,l]);return jsxRuntimeExports.jsx(Mi,{id:i$1.name,label:t,align:n,onChange:e=>u(e.target.checked,i$1),checked:c.sourceFilter?.muted?.includes("*")||c.sourceFilter?.muted?.includes(i$1.name),disabled:!s.enabledNotifications||c.sourceFilter?.blocked?.includes("*")||c.sourceFilter?.blocked?.includes(i$1.name)||0===c.sourceFilter?.allowed?.length||-1===c.sourceFilter?.allowed?.indexOf(i$1.name)&&-1===c.sourceFilter?.allowed?.indexOf("*")&&0===c.sourceFilter?.blocked?.length,...o})}function Ia({className:n,notification:i,...o}){const r=w("io-notification-header",n),{HeaderCount:a,HeaderBadge:s,HeaderTitle:c,HeaderTimestamp:l,HeaderButtonSnooze:u,HeaderButtonClose:d}=Ua();return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsxs($,{children:[jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsx(d,{notification:i})]})]})}function Aa({notification:t,...n}){const{settings:i,isPanelVisible:o,notificationStacks:r}=Mr(),{toastStacking:a,stackBy:s}=i,c="application"===s?"source":s??"source";let l;if(a){const e=r.find((e=>e.key===t[c]));l=e?.items.length??0;}return a&&!o&&l&&l>1?jsxRuntimeExports.jsx(x,{...n,children:l<10?l:"9+"}):null}function Ba({className:n,notification:i,...o}){if(!i?.severity||"None"===i.severity)return null;const r=w("io-notification-header-badge",n);return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(k,{variant:((e="None")=>{switch(e.toLowerCase()){case "low":case "medium":case "none":default:return "circle-info";case "high":return "triangle-exclamation";case "critical":return "ban"}})(i.severity),size:"12"}),i.severity]})}function Ta({className:n,state:i,severity:o="None",icon:r,...a}){const s=w("io-notification-header-icon",n),{isPanelVisible:c}=Mr();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:c&&"Acknowledged"!==i&&"New"})]})}function Pa({className:t,notification:{appTitle:n},...i}){const o=w("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Ra({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=w("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:Ho(n??0)??"Just Now"})}function La({notification:{id:t,state:n},...i$1}){const{settings:o,snooze:a}=Mr(),s=i.useCallback((e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);}),[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i$1}):null}function Oa({notification:{updateState:t,close:n},...i}){const{isPanelVisible:o}=Mr();return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",size:"24",tabIndex:-1,onClick:e=>{o?n().catch(console.error):(e.stopPropagation(),t("Acknowledged").catch(console.error));},...i})}function Fa({className:n,notification:i,...o}){const r=w("io-notification-body",n),{BodyIcon:a,BodyTitle:s,BodyDescription:c}=Ua(),{onClick:l}=i,{settings:u,isPanelVisible:d}=Mr();return jsxRuntimeExports.jsxs("div",{className:r,role:"button",tabIndex:0,onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||l({close:false});},onClick:()=>{if(u.toastStacking)l({close:false});else {l({close:d||(u?.closeNotificationOnClick??true)});}},...o,children:[jsxRuntimeExports.jsx(a,{icon:i.icon}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(s,{text:i.title}),jsxRuntimeExports.jsx(c,{text:i.body})]})]})}function Da({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=w("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function Ma({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function za({className:t,text:n,...i}){const o=w("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function _a({className:n,notification:i$1}){const o=w("io-notification-footer",n),{FooterButton:r}=Ua(),a=i.useMemo((()=>function(e){const t=[],n={};e.forEach((e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach(((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find((e=>e.displayId===t)));})),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);}));const i=e=>{e.forEach((e=>{e.children&&0===e.children.length?delete e.children:e.children&&i(e.children);}));};return i(t),t}(i$1.actions)),[i$1.actions]),s=(t,n)=>t.children?jsxRuntimeExports.jsx(Ni,{text:t.title,children:t.children.map(s)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Ni.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t,notificationId:i$1.id})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,children:jsxRuntimeExports.jsx($,{align:"right",children:a.map(((n,o)=>n.children?jsxRuntimeExports.jsxs($,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default",notificationId:i$1.id}),jsxRuntimeExports.jsx(Ni,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(s)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link",notificationId:i$1.id},`${n.title}-${o}`)))})})}function Ha({notificationAction:t,notificationId:n,...i}){const{settings:o,setState:r,isPanelVisible:a}=Mr();return jsxRuntimeExports.jsx(A,{text:t.title,onClick:e=>{e.stopPropagation();const i="boolean"!=typeof o?.closeNotificationOnClick||o?.closeNotificationOnClick;a||i?t.onClick({close:i}):(t.onClick({close:false}),r(n,"Acknowledged"));},...i})}const $a={Header:Ia,HeaderCount:Aa,HeaderBadge:Ba,HeaderIcon:Ta,HeaderTitle:Pa,HeaderTimestamp:Ra,HeaderButtonSnooze:La,HeaderButtonClose:Oa,Body:Fa,BodyIcon:Da,BodyTitle:Ma,BodyDescription:za,Footer:_a,FooterButton:Ha},ja=i.createContext($a),Va=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...$a,...n})),[n]);return jsxRuntimeExports.jsx(ja.Provider,{value:i$1,children:t})}));function Ua(e){return {...i.useContext(ja),...e}}function Ja({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=Ua(),{severity:c}=i,l=w("io-notification",`severity-${c?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:l,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function Wa({components:t,notification:n,...i}){return jsxRuntimeExports.jsx(Va,{components:t,children:jsxRuntimeExports.jsx(Ja,{notification:n,...i})})}function qa({className:n,notifications:i$1,...o}){const[a,s]=i.useState(false),l=i$1.length>=3?"large":"normal",u=2===i$1.length?"small":l,d=i$1[0].severity,f=w("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),h=i.useCallback((()=>{s(true);}),[]),m=i.useCallback((e=>{e.stopPropagation(),i$1.forEach((e=>{e.close();}));}),[i$1]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:h,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>m(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear All"})})}),i$1.map((t=>jsxRuntimeExports.jsx(Wa,{notification:t},t.id)))]})}function Ka({className:n,Notification:i,notifications:o,noNotificationText:r="No notifications to display",...a}){const s=w("io-notification-list",n),{notifications:c,notificationStacks:l,settings:u,configuration:d,isPanelVisible:f,selectedNotifications:h,selectNotification:m,isBulkActionsSupported:p}=Mr(),{isBulkActionsVisible:g}=_r(),{toastStacking:v}=u,b=o??c;return jsxRuntimeExports.jsx("div",{className:s,...a,children:v&&!f?l.length>0?l.map((t=>jsxRuntimeExports.jsx(qa,{notifications:t.items},t.key))):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r??""}):b.length>0?b.map((n=>{const o=d.sourceFilter?.muted?.includes(n.source)||d.sourceFilter?.muted?.includes("*");return !f&&o?null:f&&p&&g?jsxRuntimeExports.jsxs("div",{className:"io-notification-list-bulk-action-item "+(h.includes(n.id)?"selected":""),children:[jsxRuntimeExports.jsx(Fi,{checked:h.includes(n.id),onChange:e=>m(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n})]},n.id):jsxRuntimeExports.jsx(i,{notification:n},n.id)})):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r??""})})}Va.displayName="ComponentsStoreProvider";const Ga={Header:Hr,HeaderCaption:$r,HeaderCaptionFilter:jr,HeaderCaptionTitle:Vr,HeaderCaptionCount:function({...t}){const{notificationsCount:n}=_r();return jsxRuntimeExports.jsx(x,{...t,children:(n||0).toString()})},HeaderCaptionButtons:Ur,HeaderCaptionButtonSearch:function({...t}){const{isSearchVisible:n,showSearch:i,hideSearch:o,notificationsCount:r}=_r();return jsxRuntimeExports.jsx(N,{icon:n?"search-filled":"search",variant:"circle",size:"32",onClick:n?o:i,disabled:0===r,...t})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){const{showSettings:r}=_r();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:r,...o})},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",...o}){const{hidePanel:r}=Mr();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:r,...o})},HeaderActions:function({className:n,...i}){const o=w("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:c}=Xa();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs($,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs($,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i$1}){const{sortNotificationsBy:o,setSortBy:a}=_r(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Mr(),[t,n]=i.useState(qr),{key:i$1,descending:o}=t,a=i.useMemo((()=>Qr[i$1](e,o)),[e,i$1,o]),s=i.useCallback((e=>{n((t=>({key:e,descending:t.key!==e?qr.descending:!t.descending})));}),[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs(H,{variant:"light",...i$1,children:[jsxRuntimeExports.jsxs(H.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:o})]}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Severity"].map((t=>jsxRuntimeExports.jsx(H.Item,{isSelected:o===t.toLowerCase(),onClick:()=>{a(t.toLowerCase()),s(t.toLowerCase());},children:t},t)))})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=Mr(),{viewNotificationsBy:r,setViewBy:a}=_r(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(H,{variant:"light",...i,children:[jsxRuntimeExports.jsxs(H.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",checkIcon:"check",children:s.map((t=>jsxRuntimeExports.jsx(H.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t)))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i}=Mr(),{notificationsCount:o}=_r();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i}=Mr(),{showBulkActions:o,notificationsCount:r}=_r();return i?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:o,disabled:0===r,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=w("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:c,HeaderBulkActionSnooze:l,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=Xa(),{isBulkActionsSupported:f}=Mr();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs($,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o}=Mr(),{notificationsCount:r}=_r();return n?jsxRuntimeExports.jsx(Fi,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o}=Mr(),{notificationsCount:r}=_r();return i?jsxRuntimeExports.jsxs(H,{variant:"light",...n,children:[jsxRuntimeExports.jsx(H.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(T,{children:jsxRuntimeExports.jsxs(H.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(H.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map((t=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t)))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i$1="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,setStates:l}=Mr(),{notificationsCount:u}=_r(),d=i.useCallback((()=>{l(c,"Seen");}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i$1="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,setStates:l}=Mr(),{notificationsCount:u}=_r(),d=i.useCallback((()=>{l(c,"Active");}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i$1="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,snoozeMany:l,settings:u}=Mr(),{notificationsCount:d}=_r(),f=i.useCallback((()=>{l(c,u.snooze?.duration??0);}),[c,l,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i$1="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:c,clearMany:l}=Mr(),{notificationsCount:u}=_r(),d=i.useCallback((()=>{l(c);}),[c,l]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i$1,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o}=Mr(),{hideBulkActions:r,notificationsCount:a}=_r();return o?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:r,disabled:0===a,...i}):null},HeaderSearch:function({className:n,icon:i$1="search",placeholder:o="Search",...r}){const a=w("io-panel-header-search",n),{isSearchVisible:s,searchQuery:c,setSearch:l,notificationsCount:f}=_r(),h=i.useRef(null);return i.useEffect((()=>{s?h.current?.focus():(h.current?.blur(),l(""));}),[s,l]),s?jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Li,{ref:h,value:c,iconPrepend:i$1,placeholder:o,onChange:e=>l(e.target.value),...r}),s&&c.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${f} results`})]}):null},Body:Xr,Footer:Zr,FooterButtons:ea,FooterButtonClearAll:ta,FooterButtonClearAllOld:na,Notification:Wa,NotificationsList:Ka,Settings:ia,SettingsGeneral:oa,SettingsAllowNotifications:ra,SettingsShowNotificationBadge:aa,SettingsCloseNotificationOnClick:sa,SettingsPanelAutoHide:ca,SettingsPanelAlwaysOnTop:la,SettingsHideToastsAfter:ua,SettingsMarkAsNew:da,SettingsMarkAsRead:fa,SettingsStacking:ha,SettingsToastStacking:ma,SettingsToastStackBy:ga,SettingsPlacement:va,SettingsPlacementPanel:ba,SettingsPlacementToasts:ya,SettingsSnooze:wa,SettingsSnoozeDuration:ka,SettingsSubscriptions:Na,SettingsSubscribeAll:Sa,SettingsSubscribeApp:Ca,SettingsSubscribeMuteAll:xa,SettingsSubscribeMuteApp:Ea},Ya=i.createContext(Ga),Qa=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Ga,...n})),[n]);return jsxRuntimeExports.jsx(Ya.Provider,{value:i$1,children:t})}));function Xa(e){return {...i.useContext(Ya),...e}}Qa.displayName="ComponentsStoreProvider";const ts={Body:function({className:t,notifications:n,maxToasts:i$1=1,...o}){const r=w("io-toasts-body",t),{NotificationsList:a,Notification:s}=os(),[l,d]=i.useState([]);return i.useEffect((()=>{const e=i$1<0?n.length:i$1,t=n.filter((e=>"Active"===e.state)).slice(0,e);for(const e of t)e.onShow();d(t);}),[n,i$1]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:l,noNotificationText:""})})},Notification:Wa,NotificationsList:Ka},ns=i.createContext(ts),is=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...ts,...n})),[n]);return jsxRuntimeExports.jsx(ns.Provider,{value:i$1,children:t})}));function os(e){return {...i.useContext(ns),...e}}is.displayName="ComponentsStoreProvider";const cs=n=>{const{General:i,Layouts:o,Widget:r}=Ms();return jsxRuntimeExports.jsxs(Ei,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})},ls=({className:t,title:n="General",...i})=>{const{Theme:o}=Ms();return jsxRuntimeExports.jsx(I,{className:w("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},us=({className:n,title:i="Layouts",...o})=>{const{LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Ms();return jsxRuntimeExports.jsxs(I,{className:w("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},ds="layoutsShowDeletePrompt",fs="layoutsShowUnsavedChangesPrompt",hs="widgetEnableForExternalApps";var ms=function(e){return {ok:true,result:e}},ps=function(e){return {ok:false,error:e}},gs=function(e,t,n){return  false===t.ok?t:false===n.ok?n:ms(e(t.result,n.result))},vs=function(e,t){return  true===t.ok?t:ps(e(t.error))},bs=function(){return bs=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},bs.apply(this,arguments)};function ys(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!ys(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!ys(e[i[n]],t[i[n]]))return  false}return  true}}var ws=function(e){return Array.isArray(e)},ks=function(e){return "object"==typeof e&&null!==e&&!ws(e)},Ns=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Ss=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},Cs=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return bs({at:e+(n||"")},i)},xs=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return vs((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?ms(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?ms(e):ps({message:Ns("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?ms(e):ps({message:Ns("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?ms(e):ps({message:Ns("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return ys(e,t)?ms(t):ps({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(ks(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?ps({message:"the key '"+i+"' is required but was not present"}):ps(Cs("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return ms(n)}return ks(e)?ms(e):ps({message:Ns("an object",e)})}))},e.array=function(t){return new e((function(e){if(ws(e)&&t){return e.reduce((function(e,n,i){return gs((function(e,t){return e.concat([t])}),e,function(e,n){return vs((function(e){return Cs("["+n+"]",e)}),t.decode(e))}(n,i))}),ms([]))}return ws(e)?ms(e):ps({message:Ns("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(ws(e)){if(e.length!==t.length)return ps({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return ps(Cs("["+i+"]",o.error));n[i]=o.result;}return ms(n)}return ps({message:Ns("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return gs(Object.assign,t,n.decode(e))}),ms({}))}))},e.anyJson=function(){return new e((function(e){return ms(e)}))},e.unknownJson=function(){return new e((function(e){return ms(e)}))},e.dict=function(t){return new e((function(e){if(ks(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return ps(Cs("."+i,o.error));n[i]=o.result;}return ms(n)}return ps({message:Ns("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?ms(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return ps({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return ms(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return ps({at:Ss(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!ks(i))return ps({at:Ss(t.slice(0,o+1)),message:Ns("an object",i)});if("number"==typeof t[o]&&!ws(i))return ps({at:Ss(t.slice(0,o+1)),message:Ns("an array",i)});i=i[t[o]];}return vs((function(e){return void 0===i?{at:Ss(t),message:"path does not exist"}:Cs(Ss(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return ms(t)}))},e.fail=function(t){return new e((function(e){return ps({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}();xs.string,xs.number;var Es=xs.boolean;xs.anyJson,xs.unknownJson,xs.constant,xs.object,xs.array,xs.tuple,xs.dict,xs.optional,xs.oneOf,xs.union,xs.intersection,xs.withDefault,xs.valueAt,xs.succeed,xs.fail,xs.lazy;const Is=Es(),As=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=$i({app:"io-connect-platform",prefKey:t,decoder:Is});return jsxRuntimeExports.jsx(Mi,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},Bs=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(As,{align:t,label:n,prefKey:ds,...i}),Ts=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(As,{align:t,label:n,prefKey:fs,...i}),Ps=({className:n,title:i$1="Theme",...o})=>{const{currentTheme:a,selectTheme:l}=(()=>{const e=i.useContext(IOConnectContext),[t,n]=i.useState(null),i$1=i.useCallback((t=>e?.themes?.select(t)),[e]);return i.useEffect((()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}}),[e]),{currentTheme:t,selectTheme:i$1}})(),d=(()=>{const e=i.useContext(IOConnectContext),[t,n]=i.useState([]);return i.useEffect((()=>{e&&e.themes?.list().then(n).catch(console.warn);}),[e]),t})();return jsxRuntimeExports.jsxs("div",{className:w("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i$1}),jsxRuntimeExports.jsxs(H,{variant:"light",children:[jsxRuntimeExports.jsx(H.Button,{text:a?.displayName}),jsxRuntimeExports.jsx(H.Content,{children:jsxRuntimeExports.jsx(H.List,{variant:"single",children:d.map((({name:t,displayName:n})=>jsxRuntimeExports.jsx(H.Item,{onClick:()=>l(t),children:n},t)))})})]})]})},Rs=({className:t,title:n="Widget",...i})=>{const{WidgetEnableForExternalApps:o}=Ms();return jsxRuntimeExports.jsx(I,{className:w("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Ls=({align:t="right",label:n="Enable for external apps",...i})=>jsxRuntimeExports.jsx(As,{align:t,label:n,prefKey:hs,...i}),Os={Body:cs,General:ls,Layouts:us,LayoutsShowDeletePrompt:Bs,LayoutsShowUnsavedChangesPrompt:Ts,Theme:Ps,Widget:Rs,WidgetEnableForExternalApps:Ls},Fs=i.createContext(Os),Ds=i.memo((({children:t,components:n})=>{const i$1=i.useMemo((()=>({...Os,...n})),[n]);return jsxRuntimeExports.jsx(Fs.Provider,{value:i$1,children:t})}));Ds.displayName="PreferencesPanelComponentsStoreProvider";const Ms=()=>i.useContext(Fs);const Hs=({actionButtons:t,isButtonDisabled:n,onButtonClick:i$1})=>{const{actionButtonElementsRefs:o,autofocusButtonId:r,hasAutofocusButtonLostInitialFocus:a}=(e=>{const t=i.useRef([]),n=i.useMemo((()=>e.find((e=>e.autofocus))?.id??null),[e]),i$1=i.useRef(n),[o,r]=i.useState(!n);return i.useLayoutEffect((()=>{if(o)return;if(n!==i$1.current)return void r(true);const e=t.current.find((e=>e?.dataset.id===n));if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}}),[n,o]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:o}})(t);return jsxRuntimeExports.jsx($,{align:"right",children:t.map(((t,s)=>{const{id:c,text:l,variant:u}=t;return jsxRuntimeExports.jsx(A,{ref:e=>o.current[s]=e,className:r===c&&!a?"io-focus-button":void 0,disabled:n(c),onClick:()=>i$1(t),variant:u,"data-id":c,children:l},c)}))})},$s=({actionButtons:n,children:i,onCompletion:o,size:r,title:a="",validationErrors:s=[]})=>{const c=()=>{o({isClosed:true});},l={...r};return jsxRuntimeExports.jsxs(q,{className:"io-dialog-template",closeFn:c,isOpen:true,onCancel:e=>{e.preventDefault(),c();},onKeyDown:e=>{!(e=>"Enter"===e.key||" "===e.key)(e)||s.length||"BUTTON"===document.activeElement?.tagName||" "===e.key&&"INPUT"===document.activeElement?.tagName||o({isEnterPressed:true});},style:l,title:a,children:[jsxRuntimeExports.jsx(q.Body,{children:i}),jsxRuntimeExports.jsx(q.Footer,{children:jsxRuntimeExports.jsx(Hs,{actionButtons:n,isButtonDisabled:e=>s.some((t=>t.disabledButtonIds.some((t=>t===e)))),onButtonClick:({id:e,text:t})=>{o({responseButtonClicked:{id:e,text:t}});}})})]})};var js=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,text:s,title:c}=o;return jsxRuntimeExports.jsx($s,{actionButtons:r,onCompletion:n,size:i,title:c,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx("h3",{className:"io-dialog-template-heading",children:a}),jsxRuntimeExports.jsx("p",{children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:i$1,variables:o})=>{const{actionButtons:a,checkbox:s,heading:l,text:u,title:d}=o,[f,h]=i.useState(s.initialValue),m=i.useCallback((()=>h((e=>!e))),[]),p=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs($s,{actionButtons:a,onCompletion:e=>n({...e,inputs:p}),size:i$1,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx("h3",{className:"io-dialog-template-heading",children:l}),jsxRuntimeExports.jsx("p",{children:u})]}),jsxRuntimeExports.jsx(Fi,{checked:f,id:s.id,label:s.label,name:s.id,onChange:m})]})},SingleTextInputDialog:({onCompletion:n,size:i$1,variables:o})=>{const{actionButtons:r,heading:a,input:s,title:l}=o,[u,h]=i.useState(s.initialValue??""),m=i.useRef(null),p=(g=u,!(v=s.validation)||new RegExp(v.regex).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const b=[{id:s.id,type:"text",value:u}];return i.useLayoutEffect((()=>{m.current?.select();}),[]),jsxRuntimeExports.jsxs($s,{actionButtons:r,onCompletion:e=>n({...e,inputs:b}),size:i$1,title:l,validationErrors:p?[p]:[],children:[jsxRuntimeExports.jsx("h3",{className:"io-dialog-template-heading",children:a}),jsxRuntimeExports.jsx(Li,{ref:m,errorMessage:p?.message,id:s.id,label:s.label,name:s.id,onChange:e=>h(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}});

    const DEFAULT_DIALOG_TEMPLATES = [
        {
            name: "noInputsConfirmationDialog",
            Dialog: js.NoInputsConfirmationDialog,
            validate: noInputsConfirmationDialogDecoder.runWithException,
        },
        {
            name: "singleCheckboxDialog",
            Dialog: js.SingleCheckboxDialog,
            validate: singleCheckboxDialogDecoder.runWithException,
        },
        {
            name: "singleTextInputDialog",
            Dialog: js.SingleTextInputDialog,
            validate: singleTextInputDialogDecoder.runWithException,
        },
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

    var m = m$2;
    {
      createRoot = m.createRoot;
      m.hydrateRoot;
    }

    const Actions = ({ actions, onActionClick }) => {
        return (i.createElement($, null, actions.map((action, index) => (i.createElement(A, { key: index, onClick: (event) => onActionClick(event, action) }, action.title)))));
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
        const actions = !!data.config.actions?.length && (i.createElement(Actions, { actions: data.config.actions, onActionClick: (event, action) => {
                event.stopPropagation();
                const interopAction = {
                    name: action.title,
                    settings: action.clickInterop,
                };
                onClick({ interopAction, shouldCloseAlert: true });
            } }));
        return (i.createElement(C, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
    };

    const Alerts = ({ Alert = DefaultAlert, messagePort }) => {
        const [data, setData] = i.useState(null);
        i.useEffect(() => {
            const unsubscribe = messagePort.subscribe(({ data }) => {
                setData(data);
            });
            return unsubscribe;
        }, [messagePort]);
        return data ? (i.createElement(Alert, { data: data, onClick: ({ interopAction, shouldCloseAlert }) => {
                messagePort.postMessage({
                    id: data.id,
                    interopAction,
                    shouldCloseAlert,
                });
            } })) : null;
    };

    const Dialogs = ({ messagePort, templates }) => {
        const [data, setData] = i.useState(null);
        i.useEffect(() => {
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
        return data ? (i.createElement(data.Dialog, { onCompletion: (response) => messagePort.postMessage({ id: data.id, response }), size: data.config.size, variables: data.config.variables })) : null;
    };

    class DOMController {
        alertsMessagePort;
        dialogsMessagePort;
        dialogTemplates;
        alertsComponents;
        alertsContainerId = "io-alerts-container";
        dialogsContainerId = "io-dialogs-container";
        constructor(alertsMessagePort, dialogsMessagePort, dialogTemplates, alertsComponents) {
            this.alertsMessagePort = alertsMessagePort;
            this.dialogsMessagePort = dialogsMessagePort;
            this.dialogTemplates = dialogTemplates;
            this.alertsComponents = alertsComponents;
        }
        get alertsContainer() {
            return document.getElementById(this.alertsContainerId);
        }
        get dialogsContainer() {
            return document.getElementById(this.dialogsContainerId);
        }
        appendAlerts() {
            this.appendToDOM(this.alertsContainerId, i.createElement(Alerts, { messagePort: this.alertsMessagePort, Alert: this.alertsComponents?.Alert }));
        }
        appendDialogs() {
            this.appendToDOM(this.dialogsContainerId, i.createElement(Dialogs, { messagePort: this.dialogsMessagePort, templates: this.dialogTemplates }));
        }
        appendToDOM(containerId, reactNode) {
            const domNode = document.createElement("div");
            domNode.id = containerId;
            const root = createRoot(domNode);
            root.render(reactNode);
            document.body.appendChild(domNode);
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
                this._domController = new DOMController(this.alertsMessageChannel.componentPort, this.dialogsMessageChannel.componentPort, this.dialogTemplates, this.config.alerts?.components);
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
        const ioc = new IoC(io, validatedConfig);
        const logger = ioc.glueController.getLogger(`modals-ui.factory-${ioc.glueController.clientId}`);
        if (ioc.domController.alertsContainer) {
            throw new Error("Alerts already appended to the DOM");
        }
        if (ioc.domController.dialogsContainer) {
            throw new Error("Dialogs already appended to the DOM");
        }
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

    return IOBrowserModalsUIFactory;

}));
//# sourceMappingURL=io-browser-modals-ui-react.umd.js.map
