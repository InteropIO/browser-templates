(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["io-browser-intent-resolver-ui"] = factory());
})(this, (function () { 'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    const GLUE42_EVENT_NAME = "Glue42";
    const INTENT_RESOLVER_UI_FACTORY_READY = "intentResolverUIFactoryReady";
    const REQUEST_INTENT_RESOLVER_UI_FACTORY_READY = "requestIntentResolverUIFactoryReady";

    class EventController {
        events = {
            [REQUEST_INTENT_RESOLVER_UI_FACTORY_READY]: { name: REQUEST_INTENT_RESOLVER_UI_FACTORY_READY, handle: this.handleIntentResolverUIFactoryReadyRequest.bind(this) },
        };
        wireCustomEventListener = () => {
            window.addEventListener(GLUE42_EVENT_NAME, this.handleMessage.bind(this));
        };
        notifyStarted() {
            this.send(INTENT_RESOLVER_UI_FACTORY_READY);
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
        handleIntentResolverUIFactoryReadyRequest() {
            this.send(INTENT_RESOLVER_UI_FACTORY_READY);
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
        return r.ok === true ? ok$1(f(r.result)) : r;
    };
    /**
     * Apply `f` to the result of two `Ok`s, or pass an error through. If both
     * `Result`s are errors then the first one is returned.
     */
    var map2 = function (f, ar, br) {
        return ar.ok === false ? ar :
            br.ok === false ? br :
                ok$1(f(ar.result, br.result));
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
                    ? ok$1(json)
                    : err({ message: expectedGot('a string', json) });
            });
        };
        /**
         * Decoder primitive that validates numbers, and fails on all other input.
         */
        Decoder.number = function () {
            return new Decoder(function (json) {
                return typeof json === 'number'
                    ? ok$1(json)
                    : err({ message: expectedGot('a number', json) });
            });
        };
        /**
         * Decoder primitive that validates booleans, and fails on all other input.
         */
        Decoder.boolean = function () {
            return new Decoder(function (json) {
                return typeof json === 'boolean'
                    ? ok$1(json)
                    : err({ message: expectedGot('a boolean', json) });
            });
        };
        Decoder.constant = function (value) {
            return new Decoder(function (json) {
                return isEqual(json, value)
                    ? ok$1(value)
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
                    return ok$1(obj);
                }
                else if (isJsonObject(json)) {
                    return ok$1(json);
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
                    }, ok$1([]));
                }
                else if (isJsonArray(json)) {
                    return ok$1(json);
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
                    return ok$1(result);
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
                return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2(Object.assign, acc, decoder.decode(json)); }, ok$1({}));
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
                    return ok$1(obj);
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
                return ok$1(withDefault(defaultValue, decoder.decode(json)));
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
            return new Decoder(function (json) { return ok$1(fixedValue); });
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
    Decoder.dict;
    /** See `Decoder.optional` */
    var optional = Decoder.optional;
    /** See `Decoder.oneOf` */
    var oneOf = Decoder.oneOf;
    /** See `Decoder.union` */
    var union = Decoder.union;
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

    const nonEmptyStringDecoder = string().where((s) => s.length > 0, "Expected a non-empty string");
    const nonNegativeNumberDecoder = number().where((num) => num >= 0, "Expected a non-negative number");
    const functionCheck = (input, propDescription) => {
        const providedType = typeof input;
        return providedType === "function" ?
            anyJson() :
            fail(`The provided argument as ${propDescription} should be of type function, provided: ${typeof providedType}`);
    };
    const configDecoder = object({
        enable: boolean(),
        rootElement: anyJson(),
        CustomIntentResolver: optional(anyJson().andThen((result) => functionCheck(result, "CustomIntentResolver")))
    });
    const handlerExclusionCriteriaApplicationNameDecoder = object({
        applicationName: nonEmptyStringDecoder
    });
    const handlerExclusionCriteriaInstanceIdDecoder = object({
        instanceId: nonEmptyStringDecoder
    });
    const handlerExclusionCriteriaDecoder = oneOf(handlerExclusionCriteriaApplicationNameDecoder, handlerExclusionCriteriaInstanceIdDecoder);
    const handlerFilterDecoder = object({
        title: optional(nonEmptyStringDecoder),
        openResolver: optional(boolean()),
        timeout: optional(nonNegativeNumberDecoder),
        intent: optional(nonEmptyStringDecoder),
        contextTypes: optional(array(nonEmptyStringDecoder)),
        resultType: optional(nonEmptyStringDecoder),
        applicationNames: optional(array(nonEmptyStringDecoder)),
        excludeList: optional(array(handlerExclusionCriteriaDecoder))
    });
    const intentTargetDecoder = oneOf(constant("startNew"), constant("reuse"), object({
        app: optional(nonEmptyStringDecoder),
        instance: optional(nonEmptyStringDecoder)
    }));
    const intentContextDecoder = object({
        type: optional(nonEmptyStringDecoder),
        data: optional(anyJson())
    });
    const windowRelativeDirectionDecoder = oneOf(constant("top"), constant("left"), constant("right"), constant("bottom"));
    const windowOpenSettingsDecoder = optional(object({
        top: optional(number()),
        left: optional(number()),
        width: optional(nonNegativeNumberDecoder),
        height: optional(nonNegativeNumberDecoder),
        context: optional(anyJson()),
        relativeTo: optional(nonEmptyStringDecoder),
        relativeDirection: optional(windowRelativeDirectionDecoder),
        windowId: optional(nonEmptyStringDecoder),
        layoutComponentId: optional(nonEmptyStringDecoder)
    }));
    const intentHandlerDecoder = object({
        applicationName: nonEmptyStringDecoder,
        applicationTitle: optional(string()),
        applicationDescription: optional(string()),
        applicationIcon: optional(string()),
        type: oneOf(constant("app"), constant("instance")),
        displayName: optional(string()),
        contextTypes: optional(array(nonEmptyStringDecoder)),
        instanceId: optional(string()),
        instanceTitle: optional(string()),
        resultType: optional(string())
    });
    const intentRequestDecoder = object({
        intent: nonEmptyStringDecoder,
        target: optional(intentTargetDecoder),
        context: optional(intentContextDecoder),
        options: optional(windowOpenSettingsDecoder),
        handlers: optional(array(intentHandlerDecoder)),
        timeout: optional(nonNegativeNumberDecoder),
        waitUserResponseIndefinitely: optional(boolean()),
        clearSavedHandler: optional(boolean())
    });
    const uiSettingsDecoder = object({
        showCloseButton: optional(boolean()),
    });
    const openConfigWithIntentRequestDecoder = object({
        intentRequest: intentRequestDecoder,
        uiSettings: optional(uiSettingsDecoder),
    });
    const openConfigWithHandlerFilterDecoder = object({
        handlerFilter: handlerFilterDecoder,
        uiSettings: optional(uiSettingsDecoder),
    });
    const openConfigDecoder = union(openConfigWithIntentRequestDecoder, openConfigWithHandlerFilterDecoder);
    const closeConfigDecoder = object({
        id: nonEmptyStringDecoder
    });

    class IOController {
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

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var react = {exports: {}};

    var react_production_min = {};

    /**
     * @license React
     * react.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var l$1=Symbol.for("react.element"),n$1=Symbol.for("react.portal"),p$2=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v$1=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x$1=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z$2=Symbol.iterator;function A$1(a){if(null===a||"object"!==typeof a)return null;a=z$2&&a[z$2]||a["@@iterator"];return "function"===typeof a?a:null}
    var B$1={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$2=Object.assign,D$2={};function E$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$1;}E$2.prototype.isReactComponent={};
    E$2.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$2.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F$1(){}F$1.prototype=E$2.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$1;}var H$2=G$2.prototype=new F$1;
    H$2.constructor=G$2;C$2(H$2,E$2.prototype);H$2.isPureReactComponent=!0;var I$1=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$2={current:null},L$2={key:!0,ref:!0,__self:!0,__source:!0};
    function M$2(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$2.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$1,type:a,key:k,ref:h,props:c,_owner:K$2.current}}
    function N$2(a,b){return {$$typeof:l$1,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$2(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$1}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$2=/\/+/g;function Q$2(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
    function R$2(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l$1:case n$1:h=!0;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$2(h,0):d,I$1(c)?(e="",null!=a&&(e=a.replace(P$2,"$&/")+"/"),R$2(c,b,e,"",function(a){return a})):null!=c&&(O$2(c)&&(c=N$2(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$2,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$1(a))for(var g=0;g<a.length;g++){k=
    a[g];var f=d+Q$2(k,g);h+=R$2(k,b,e,f,c);}else if(f=A$1(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$2(k,g++),h+=R$2(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
    function S$2(a,b,e){if(null==a)return a;var d=[],c=0;R$2(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$2(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
    var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$2};function X$2(){throw Error("act(...) is not supported in production builds of React.");}
    react_production_min.Children={map:S$2,forEach:function(a,b,e){S$2(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$2(a,function(){b++;});return b},toArray:function(a){return S$2(a,function(a){return a})||[]},only:function(a){if(!O$2(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$2;react_production_min.Fragment=p$2;react_production_min.Profiler=r;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w;
    react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;react_production_min.act=X$2;
    react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$2({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K$2.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$2.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
    for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$1,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};react_production_min.createElement=M$2;react_production_min.createFactory=function(a){var b=M$2.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
    react_production_min.forwardRef=function(a){return {$$typeof:v$1,render:a}};react_production_min.isValidElement=O$2;react_production_min.lazy=function(a){return {$$typeof:y,_payload:{_status:-1,_result:a},_init:T$2}};react_production_min.memo=function(a,b){return {$$typeof:x$1,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V$2.transition;V$2.transition={};try{a();}finally{V$2.transition=b;}};react_production_min.unstable_act=X$2;react_production_min.useCallback=function(a,b){return U$2.current.useCallback(a,b)};react_production_min.useContext=function(a){return U$2.current.useContext(a)};
    react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U$2.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U$2.current.useEffect(a,b)};react_production_min.useId=function(){return U$2.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U$2.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U$2.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U$2.current.useLayoutEffect(a,b)};
    react_production_min.useMemo=function(a,b){return U$2.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U$2.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U$2.current.useRef(a)};react_production_min.useState=function(a){return U$2.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U$2.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U$2.current.useTransition()};react_production_min.version="18.3.1";

    {
      react.exports = react_production_min;
    }

    var reactExports = react.exports;
    var React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

    var o = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        default: React
    }, [reactExports]);

    var reactDom = {exports: {}};

    var reactDom_production_min = {};

    var scheduler = {exports: {}};

    var scheduler_production_min = {};

    /**
     * @license React
     * scheduler.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    (function (exports) {
    function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
    	function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
    	"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t);}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else {var b=h(t);null!==b&&K(H,b.startTime-a);}}
    	function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b);}else k(r);v=h(r);}if(null!==v)var w=!0;else {var m=h(t);null!==m&&K(H,m.startTime-b);w=!1;}return w}finally{v=null,y=c,z=!1;}}var N=!1,O=null,L=-1,P=5,Q=-1;
    	function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a);}finally{b?S():(N=!1,O=null);}}else N=!1;}var S;if("function"===typeof F)S=function(){F(R);};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null);};}else S=function(){D(R,0);};function I(a){O=a;N||(N=!0,S());}function K(a,b){L=D(function(){a(exports.unstable_now());},b);}
    	exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J));};
    	exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5;};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y;}var c=y;y=b;try{return a()}finally{y=c;}};exports.unstable_pauseExecution=function(){};
    	exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=y;y=a;try{return b()}finally{y=c;}};
    	exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
    	exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c;}}}; 
    } (scheduler_production_min));

    {
      scheduler.exports = scheduler_production_min;
    }

    var schedulerExports = scheduler.exports;

    /**
     * @license React
     * react-dom.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var aa$1=reactExports,ca$1=schedulerExports;function p$1(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da$1=new Set,ea$1={};function fa$1(a,b){ha$1(a,b);ha$1(a+"Capture",b);}
    function ha$1(a,b){ea$1[a]=b;for(a=0;a<b.length;a++)da$1.add(b[a]);}
    var ia$1=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja$1=Object.prototype.hasOwnProperty,ka$1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la$1=
    {},ma$1={};function oa$1(a){if(ja$1.call(ma$1,a))return !0;if(ja$1.call(la$1,a))return !1;if(ka$1.test(a))return ma$1[a]=!0;la$1[a]=!0;return !1}function pa$1(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
    function qa$1(a,b,c,d){if(null===b||"undefined"===typeof b||pa$1(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$1={};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$1[a]=new v(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$1[b]=new v(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$1[a]=new v(a,2,!1,a.toLowerCase(),null,!1,!1);});
    ["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$1[a]=new v(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$1[a]=new v(a,3,!1,a.toLowerCase(),null,!1,!1);});
    ["checked","multiple","muted","selected"].forEach(function(a){z$1[a]=new v(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){z$1[a]=new v(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){z$1[a]=new v(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){z$1[a]=new v(a,5,!1,a.toLowerCase(),null,!1,!1);});var ra$1=/[\-:]([a-z])/g;function sa$1(a){return a[1].toUpperCase()}
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra$1,
    sa$1);z$1[b]=new v(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){z$1[a]=new v(a,1,!1,a.toLowerCase(),null,!1,!1);});
    z$1.xlinkHref=new v("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z$1[a]=new v(a,1,!1,a.toLowerCase(),null,!0,!0);});
    function ta$1(a,b,c,d){var e=z$1.hasOwnProperty(b)?z$1[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa$1(b,c,e,d)&&(c=null),d||null===e?oa$1(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
    var ua$1=aa$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va$1=Symbol.for("react.element"),wa$1=Symbol.for("react.portal"),ya$1=Symbol.for("react.fragment"),za$1=Symbol.for("react.strict_mode"),Aa$1=Symbol.for("react.profiler"),Ba$1=Symbol.for("react.provider"),Ca$1=Symbol.for("react.context"),Da$1=Symbol.for("react.forward_ref"),Ea$1=Symbol.for("react.suspense"),Fa$1=Symbol.for("react.suspense_list"),Ga$1=Symbol.for("react.memo"),Ha$1=Symbol.for("react.lazy");var Ia$1=Symbol.for("react.offscreen");var Ja$1=Symbol.iterator;function Ka$1(a){if(null===a||"object"!==typeof a)return null;a=Ja$1&&a[Ja$1]||a["@@iterator"];return "function"===typeof a?a:null}var A=Object.assign,La$1;function Ma$1(a){if(void 0===La$1)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La$1=b&&b[1]||"";}return "\n"+La$1+a}var Na$1=!1;
    function Oa$1(a,b){if(!a||Na$1)return "";Na$1=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(l){var d=l;}Reflect.construct(a,[],b);}else {try{b.call();}catch(l){d=l;}a.call(b.prototype);}else {try{throw Error();}catch(l){d=l;}a();}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
    f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na$1=!1,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Ma$1(a):""}
    function Pa$1(a){switch(a.tag){case 5:return Ma$1(a.type);case 16:return Ma$1("Lazy");case 13:return Ma$1("Suspense");case 19:return Ma$1("SuspenseList");case 0:case 2:case 15:return a=Oa$1(a.type,!1),a;case 11:return a=Oa$1(a.type.render,!1),a;case 1:return a=Oa$1(a.type,!0),a;default:return ""}}
    function Qa$1(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya$1:return "Fragment";case wa$1:return "Portal";case Aa$1:return "Profiler";case za$1:return "StrictMode";case Ea$1:return "Suspense";case Fa$1:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca$1:return (a.displayName||"Context")+".Consumer";case Ba$1:return (a._context.displayName||"Context")+".Provider";case Da$1:var b=a.render;a=a.displayName;a||(a=b.displayName||
    b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga$1:return b=a.displayName||null,null!==b?b:Qa$1(a.type)||"Memo";case Ha$1:b=a._payload;a=a._init;try{return Qa$1(a(b))}catch(c){}}return null}
    function Ra$1(a){var b=a.type;switch(a.tag){case 24:return "Cache";case 9:return (b.displayName||"Context")+".Consumer";case 10:return (b._context.displayName||"Context")+".Provider";case 18:return "DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return "Fragment";case 5:return b;case 4:return "Portal";case 3:return "Root";case 6:return "Text";case 16:return Qa$1(b);case 8:return b===za$1?"StrictMode":"Mode";case 22:return "Offscreen";
    case 12:return "Profiler";case 21:return "Scope";case 13:return "Suspense";case 19:return "SuspenseList";case 25:return "TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa$1(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return ""}}
    function Ta$1(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
    function Ua$1(a){var b=Ta$1(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
    null;delete a[b];}}}}function Va$1(a){a._valueTracker||(a._valueTracker=Ua$1(a));}function Wa$1(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=Ta$1(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa$1(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
    function Ya$1(a,b){var c=b.checked;return A({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za$1(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa$1(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function ab(a,b){b=b.checked;null!=b&&ta$1(a,"checked",b,!1);}
    function bb(a,b){ab(a,b);var c=Sa$1(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa$1(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
    function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
    function cb(a,b,c){if("number"!==b||Xa$1(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var eb=Array.isArray;
    function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else {c=""+Sa$1(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
    function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p$1(91));return A({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p$1(92));if(eb(c)){if(1<c.length)throw Error(p$1(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa$1(c)};}
    function ib(a,b){var c=Sa$1(b.value),d=Sa$1(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
    function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
    var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
    function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
    var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
    zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
    function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
    function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p$1(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p$1(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p$1(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p$1(62));}}
    function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
    function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p$1(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb();}}
    function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;if(c&&"function"!==
    typeof c)throw Error(p$1(231,b,typeof c));return c}var Lb=!1;if(ia$1)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=!1;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments);}
    function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null;}else throw Error(p$1(198));Qb||(Qb=!0,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p$1(188));}
    function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p$1(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p$1(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
    c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p$1(189));}}if(c.alternate!==d)throw Error(p$1(190));}if(3!==c.tag)throw Error(p$1(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
    var ac$1=ca$1.unstable_scheduleCallback,bc$1=ca$1.unstable_cancelCallback,cc$1=ca$1.unstable_shouldYield,dc$1=ca$1.unstable_requestPaint,B=ca$1.unstable_now,ec$1=ca$1.unstable_getCurrentPriorityLevel,fc$1=ca$1.unstable_ImmediatePriority,gc$1=ca$1.unstable_UserBlockingPriority,hc$1=ca$1.unstable_NormalPriority,ic$1=ca$1.unstable_LowPriority,jc$1=ca$1.unstable_IdlePriority,kc$1=null,lc$1=null;function mc$1(a){if(lc$1&&"function"===typeof lc$1.onCommitFiberRoot)try{lc$1.onCommitFiberRoot(kc$1,a,void 0,128===(a.current.flags&128));}catch(b){}}
    var oc$1=Math.clz32?Math.clz32:nc$1,pc$1=Math.log,qc$1=Math.LN2;function nc$1(a){a>>>=0;return 0===a?32:31-(pc$1(a)/qc$1|0)|0}var rc$1=64,sc$1=4194304;
    function tc$1(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
    default:return a}}function uc$1(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc$1(h):(f&=g,0!==f&&(d=tc$1(f)));}else g=c&~e,0!==g?d=tc$1(g):0!==f&&(d=tc$1(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc$1(b),e=1<<c,d|=a[c],b&=~e;return d}
    function vc$1(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return -1;case 134217728:case 268435456:case 536870912:case 1073741824:return -1;default:return -1}}
    function wc$1(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc$1(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc$1(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc$1(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc$1(){var a=rc$1;rc$1<<=1;0===(rc$1&4194240)&&(rc$1=64);return a}function zc$1(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
    function Ac$1(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc$1(b);a[b]=c;}function Bc$1(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc$1(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
    function Cc$1(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc$1(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C$1=0;function Dc$1(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec$1,Fc$1,Gc$1,Hc$1,Ic$1,Jc$1=!1,Kc$1=[],Lc=null,Mc=null,Nc$1=null,Oc=new Map,Pc$1=new Map,Qc$1=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function Sc$1(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc$1=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc$1.delete(b.pointerId);}}
    function Tc$1(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc$1(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
    function Uc$1(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc$1(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc$1(Mc,a,b,c,d,e),!0;case "mouseover":return Nc$1=Tc$1(Nc$1,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc$1(Oc.get(f)||null,a,b,c,d,e));return !0;case "gotpointercapture":return f=e.pointerId,Pc$1.set(f,Tc$1(Pc$1.get(f)||null,a,b,c,d,e)),!0}return !1}
    function Vc$1(a){var b=Wc$1(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic$1(a.priority,function(){Gc$1(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
    function Xc$1(a){if(null!==a.blockedOn)return !1;for(var b=a.targetContainers;0<b.length;){var c=Yc$1(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc$1(b),a.blockedOn=c,!1;b.shift();}return !0}function Zc$1(a,b,c){Xc$1(a)&&c.delete(b);}function $c$1(){Jc$1=!1;null!==Lc&&Xc$1(Lc)&&(Lc=null);null!==Mc&&Xc$1(Mc)&&(Mc=null);null!==Nc$1&&Xc$1(Nc$1)&&(Nc$1=null);Oc.forEach(Zc$1);Pc$1.forEach(Zc$1);}
    function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc$1||(Jc$1=!0,ca$1.unstable_scheduleCallback(ca$1.unstable_NormalPriority,$c$1)));}
    function bd$1(a){function b(b){return ad(b,a)}if(0<Kc$1.length){ad(Kc$1[0],a);for(var c=1;c<Kc$1.length;c++){var d=Kc$1[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc$1&&ad(Nc$1,a);Oc.forEach(b);Pc$1.forEach(b);for(c=0;c<Qc$1.length;c++)d=Qc$1[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc$1.length&&(c=Qc$1[0],null===c.blockedOn);)Vc$1(c),null===c.blockedOn&&Qc$1.shift();}var cd$1=ua$1.ReactCurrentBatchConfig,dd$1=!0;
    function ed(a,b,c,d){var e=C$1,f=cd$1.transition;cd$1.transition=null;try{C$1=1,fd$1(a,b,c,d);}finally{C$1=e,cd$1.transition=f;}}function gd$1(a,b,c,d){var e=C$1,f=cd$1.transition;cd$1.transition=null;try{C$1=4,fd$1(a,b,c,d);}finally{C$1=e,cd$1.transition=f;}}
    function fd$1(a,b,c,d){if(dd$1){var e=Yc$1(a,b,c,d);if(null===e)hd$1(a,b,d,id,c),Sc$1(a,d);else if(Uc$1(e,a,b,c,d))d.stopPropagation();else if(Sc$1(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec$1(f);f=Yc$1(a,b,c,d);null===f&&hd$1(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd$1(a,b,d,null,c);}}var id=null;
    function Yc$1(a,b,c,d){id=null;a=xb(d);a=Wc$1(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
    function jd$1(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
    case "message":switch(ec$1()){case fc$1:return 1;case gc$1:return 4;case hc$1:case ic$1:return 16;case jc$1:return 536870912;default:return 16}default:return 16}}var kd$1=null,ld$1=null,md$1=null;function nd(){if(md$1)return md$1;var a,b=ld$1,c=b.length,d,e="value"in kd$1?kd$1.value:kd$1.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md$1=e.slice(a,1<d?1-d:void 0)}
    function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd$1(){return !0}function qd$1(){return !1}
    function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd$1:qd$1;this.isPropagationStopped=qd$1;return this}A(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
    (a.returnValue=!1),this.isDefaultPrevented=pd$1);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd$1);},persist:function(){},isPersistent:pd$1});return b}
    var sd$1={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td$1=rd(sd$1),ud$1=A({},sd$1,{view:0,detail:0}),vd$1=rd(ud$1),wd$1,xd$1,yd$1,Ad$1=A({},ud$1,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd$1,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
    a)return a.movementX;a!==yd$1&&(yd$1&&"mousemove"===a.type?(wd$1=a.screenX-yd$1.screenX,xd$1=a.screenY-yd$1.screenY):xd$1=wd$1=0,yd$1=a);return wd$1},movementY:function(a){return "movementY"in a?a.movementY:xd$1}}),Bd$1=rd(Ad$1),Cd$1=A({},Ad$1,{dataTransfer:0}),Dd$1=rd(Cd$1),Ed$1=A({},ud$1,{relatedTarget:0}),Fd$1=rd(Ed$1),Gd$1=A({},sd$1,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd$1=rd(Gd$1),Id$1=A({},sd$1,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd$1=rd(Id$1),Kd$1=A({},sd$1,{data:0}),Ld$1=rd(Kd$1),Md={Esc:"Escape",
    Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd$1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
    119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od$1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd$1(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od$1[a])?!!b[a]:!1}function zd$1(){return Pd$1}
    var Qd=A({},ud$1,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd$1[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd$1,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
    a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd$1=rd(Qd),Sd$1=A({},Ad$1,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td$1=rd(Sd$1),Ud$1=A({},ud$1,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd$1}),Vd$1=rd(Ud$1),Wd$1=A({},sd$1,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd$1),Yd=A({},Ad$1,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
    deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae$1=ia$1&&"CompositionEvent"in window,be$1=null;ia$1&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=ia$1&&"TextEvent"in window&&!be$1,de$1=ia$1&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=!1;
    function ge$1(a,b){switch(a){case "keyup":return -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return !0;default:return !1}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=!1;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=!0;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
    function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md$1=ld$1=kd$1=null,ie$1=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
    var le$1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?!0:!1}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td$1("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe$1=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa$1(b))return a}
    function ve$1(a,b){if("change"===a)return b}var we$1=!1;if(ia$1){var xe$1;if(ia$1){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=!1;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe$1=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$1(qe$1)){var b=[];ne$1(b,qe$1,a,xb(a));Jb(re$1,b);}}
    function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe$1=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe$1)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
    function Ie$1(a,b){if(He$1(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++){var e=c[d];if(!ja$1.call(b,e)||!He$1(a[e],b[e]))return !1}return !0}function Je$1(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
    function Ke$1(a,b){var c=Je$1(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je$1(c);}}function Le$1(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
    function Me$1(){for(var a=window,b=Xa$1();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=!1;}if(c)a=b.contentWindow;else break;b=Xa$1(a.document);}return b}function Ne$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
    function Oe$1(a){var b=Me$1(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le$1(c.ownerDocument.documentElement,c)){if(null!==d&&Ne$1(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke$1(c,f);var g=Ke$1(c,
    d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
    var Pe$1=ia$1&&"documentMode"in document&&11>=document.documentMode,Qe$1=null,Re$1=null,Se$1=null,Te$1=!1;
    function Ue$1(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe$1||Qe$1!==Xa$1(d)||(d=Qe$1,"selectionStart"in d&&Ne$1(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Ie$1(Se$1,d)||(Se$1=d,d=oe$1(Re$1,"onSelect"),0<d.length&&(b=new td$1("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe$1)));}
    function Ve$1(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We$1={animationend:Ve$1("Animation","AnimationEnd"),animationiteration:Ve$1("Animation","AnimationIteration"),animationstart:Ve$1("Animation","AnimationStart"),transitionend:Ve$1("Transition","TransitionEnd")},Xe$1={},Ye$1={};
    ia$1&&(Ye$1=document.createElement("div").style,"AnimationEvent"in window||(delete We$1.animationend.animation,delete We$1.animationiteration.animation,delete We$1.animationstart.animation),"TransitionEvent"in window||delete We$1.transitionend.transition);function Ze$1(a){if(Xe$1[a])return Xe$1[a];if(!We$1[a])return a;var b=We$1[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye$1)return Xe$1[a]=b[c];return a}var $e$1=Ze$1("animationend"),af=Ze$1("animationiteration"),bf$1=Ze$1("animationstart"),cf=Ze$1("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ff(a,b){df.set(a,b);fa$1(b,[a]);}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf$1=hf.toLowerCase(),kf$1=hf[0].toUpperCase()+hf.slice(1);ff(jf$1,"on"+kf$1);}ff($e$1,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf$1,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha$1("onMouseEnter",["mouseout","mouseover"]);ha$1("onMouseLeave",["mouseout","mouseover"]);ha$1("onPointerEnter",["pointerout","pointerover"]);
    ha$1("onPointerLeave",["pointerout","pointerover"]);fa$1("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa$1("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa$1("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa$1("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa$1("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
    fa$1("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
    function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
    function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
    function D$1(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d));}function qf$1(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da$1.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf$1(b,!1,a),qf$1(b,!0,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf$1("selectionchange",!1,b));}}
    function pf(a,b,c,d){switch(jd$1(b)){case 1:var e=ed;break;case 4:e=gd$1;break;default:e=fd$1;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1);}
    function hd$1(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc$1(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
    a:{var h=df.get(a);if(void 0!==h){var k=td$1,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd$1;break;case "focusin":n="focus";k=Fd$1;break;case "focusout":n="blur";k=Fd$1;break;case "beforeblur":case "afterblur":k=Fd$1;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd$1;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
    Dd$1;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd$1;break;case $e$1:case af:case bf$1:k=Hd$1;break;case cf:k=Xd;break;case "scroll":k=vd$1;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd$1;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td$1;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
    w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc$1(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc$1(n):null,null!==
    n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd$1;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td$1,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc$1(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
    vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf$1(g,h,k,t,!1);null!==n&&null!==J&&wf$1(g,J,n,t,!0);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
    xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=!0;break;case "contextmenu":case "mouseup":case "dragend":Te$1=!1;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
    break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd()):(kd$1=e,ld$1="value"in kd$1?kd$1.value:kd$1.textContent,ie$1=!0)),xa=oe$1(d,ba),0<xa.length&&(ba=new Ld$1(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),
    0<d.length&&(e=new Ld$1("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se$1(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
    function wf$1(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf$1=/\r\n?/g,yf$1=/\u0000|\uFFFD/g;function zf$1(a){return ("string"===typeof a?a:""+a).replace(xf$1,"\n").replace(yf$1,"")}function Af$1(a,b,c){b=zf$1(b);if(zf$1(a)!==b&&c)throw Error(p$1(425));}function Bf(){}
    var Cf$1=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
    var Ff$1="function"===typeof setTimeout?setTimeout:void 0,Gf$1="function"===typeof clearTimeout?clearTimeout:void 0,Hf$1="function"===typeof Promise?Promise:void 0,Jf$1="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf$1?function(a){return Hf$1.resolve(null).then(a).catch(If$1)}:Ff$1;function If$1(a){setTimeout(function(){throw a;});}
    function Kf$1(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd$1(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd$1(b);}function Lf$1(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
    function Mf$1(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf$1=Math.random().toString(36).slice(2),Of$1="__reactFiber$"+Nf$1,Pf$1="__reactProps$"+Nf$1,uf="__reactContainer$"+Nf$1,of="__reactEvents$"+Nf$1,Qf="__reactListeners$"+Nf$1,Rf$1="__reactHandles$"+Nf$1;
    function Wc$1(a){var b=a[Of$1];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of$1]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf$1(a);null!==a;){if(c=a[Of$1])return c;a=Mf$1(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of$1]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p$1(33));}function Db(a){return a[Pf$1]||null}var Sf$1=[],Tf=-1;function Uf$1(a){return {current:a}}
    function E$1(a){0>Tf||(a.current=Sf$1[Tf],Sf$1[Tf]=null,Tf--);}function G$1(a,b){Tf++;Sf$1[Tf]=a.current;a.current=b;}var Vf$1={},H$1=Uf$1(Vf$1),Wf$1=Uf$1(!1),Xf=Vf$1;function Yf$1(a,b){var c=a.type.contextTypes;if(!c)return Vf$1;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
    function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f$1(){E$1(Wf$1);E$1(H$1);}function ag(a,b,c){if(H$1.current!==Vf$1)throw Error(p$1(168));G$1(H$1,b);G$1(Wf$1,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p$1(108,Ra$1(a)||"Unknown",e));return A({},c,d)}
    function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf$1;Xf=H$1.current;G$1(H$1,a);G$1(Wf$1,Wf$1.current);return !0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p$1(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E$1(Wf$1),E$1(H$1),G$1(H$1,a)):E$1(Wf$1);G$1(Wf$1,c);}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=!0;hg(a);}
    function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C$1;try{var c=eg;for(C$1=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac$1(fc$1,jg),e;}finally{C$1=b,gg=!1;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
    function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc$1(d)-1;d&=~(1<<e);c+=1;var f=32-oc$1(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc$1(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I=!1,zg=null;
    function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
    function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf$1(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
    null,!0):!1;default:return !1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p$1(418));b=Lf$1(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I=!1,xg=a);}}else {if(Dg(a))throw Error(p$1(418));a.flags=a.flags&-4097|2;I=!1;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
    function Gg(a){if(a!==xg)return !1;if(!I)return Fg(a),I=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p$1(418));for(;b;)Ag(a,b),b=Lf$1(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p$1(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf$1(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
    null;}}else yg=xg?Lf$1(a.stateNode.nextSibling):null;return !0}function Hg(){for(var a=yg;a;)a=Lf$1(a.nextSibling);}function Ig(){yg=xg=null;I=!1;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua$1.ReactCurrentBatchConfig;
    function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p$1(309));var d=c.stateNode;}if(!d)throw Error(p$1(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p$1(284));if(!c._owner)throw Error(p$1(290,a));}return a}
    function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p$1(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
    function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
    null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya$1)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha$1&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
    b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va$1:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
    c.ref=Lg(a,null,b),c.return=a,c;case wa$1:return b=Sg(b,a.mode,c),b.return=a,b;case Ha$1:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka$1(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va$1:return c.key===e?k(a,b,c,d):null;case wa$1:return c.key===e?l(a,b,c,d):null;case Ha$1:return e=c._init,r(a,
    b,e(c._payload),d)}if(eb(c)||Ka$1(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va$1:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa$1:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha$1:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka$1(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
    function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
    x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function t(e,g,h,k){var l=Ka$1(h);if("function"!==typeof l)throw Error(p$1(150));h=l.call(h);if(null==h)throw Error(p$1(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
    m),I&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya$1&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va$1:a:{for(var k=
    f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya$1){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha$1&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya$1?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa$1:a:{for(l=f.key;null!==
    d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha$1:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka$1(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
    (c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(!0),Vg=Og(!1),Wg=Uf$1(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah(a){var b=Wg.current;E$1(Wg);a._currentValue=b;}function bh$1(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
    function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh$1=!0),a.firstContext=null);}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p$1(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh$1(a){null===fh?fh=[a]:fh.push(a);}
    function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh$1(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh$1=!1;function kh$1(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
    function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh$1(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
    function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$1&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh$1(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
    function ph$1(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
    b;c.lastBaseUpdate=b;}
    function qh$1(a,b,c,d){var e=a.updateQueue;jh$1=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
    next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A({},q,r);break a;case 2:jh$1=!0;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
    h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q;}}
    function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p$1(191,e));e.call(d);}}}var th={},uh=Uf$1(th),vh$1=Uf$1(th),wh$1=Uf$1(th);function xh$1(a){if(a===th)throw Error(p$1(174));return a}
    function yh$1(a,b){G$1(wh$1,b);G$1(vh$1,a);G$1(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E$1(uh);G$1(uh,b);}function zh$1(){E$1(uh);E$1(vh$1);E$1(wh$1);}function Ah$1(a){xh$1(wh$1.current);var b=xh$1(uh.current);var c=lb(b,a.type);b!==c&&(G$1(vh$1,a),G$1(uh,c));}function Bh$1(a){vh$1.current===a&&(E$1(uh),E$1(vh$1));}var L$1=Uf$1(0);
    function Ch$1(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh$1=[];
    function Eh$1(){for(var a=0;a<Dh$1.length;a++)Dh$1[a]._workInProgressVersionPrimary=null;Dh$1.length=0;}var Fh$1=ua$1.ReactCurrentDispatcher,Gh$1=ua$1.ReactCurrentBatchConfig,Hh$1=0,M$1=null,N$1=null,O$1=null,Ih$1=!1,Jh$1=!1,Kh$1=0,Lh$1=0;function P$1(){throw Error(p$1(321));}function Mh(a,b){if(null===b)return !1;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return !1;return !0}
    function Nh$1(a,b,c,d,e,f){Hh$1=f;M$1=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh$1.current=null===a||null===a.memoizedState?Oh:Ph$1;a=c(d,e);if(Jh$1){f=0;do{Jh$1=!1;Kh$1=0;if(25<=f)throw Error(p$1(301));f+=1;O$1=N$1=null;b.updateQueue=null;Fh$1.current=Qh$1;a=c(d,e);}while(Jh$1)}Fh$1.current=Rh$1;b=null!==N$1&&null!==N$1.next;Hh$1=0;O$1=N$1=M$1=null;Ih$1=!1;if(b)throw Error(p$1(300));return a}function Sh$1(){var a=0!==Kh$1;Kh$1=0;return a}
    function Th$1(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;return O$1}function Uh$1(){if(null===N$1){var a=M$1.alternate;a=null!==a?a.memoizedState:null;}else a=N$1.next;var b=null===O$1?M$1.memoizedState:O$1.next;if(null!==b)O$1=b,N$1=a;else {if(null===a)throw Error(p$1(310));N$1=a;a={memoizedState:N$1.memoizedState,baseState:N$1.baseState,baseQueue:N$1.baseQueue,queue:N$1.queue,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;}return O$1}
    function Vh$1(a,b){return "function"===typeof b?b(a):b}
    function Wh$1(a){var b=Uh$1(),c=b.queue;if(null===c)throw Error(p$1(311));c.lastRenderedReducer=a;var d=N$1,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh$1&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
    eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M$1.lanes|=m;rh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(dh$1=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M$1.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
    function Xh$1(a){var b=Uh$1(),c=b.queue;if(null===c)throw Error(p$1(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(dh$1=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh$1(){}
    function Zh$1(a,b){var c=M$1,d=Uh$1(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,dh$1=!0);d=d.queue;$h(ai$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O$1&&O$1.memoizedState.tag&1){c.flags|=2048;bi$1(9,ci$1.bind(null,c,d,e,b),void 0,null);if(null===Q$1)throw Error(p$1(349));0!==(Hh$1&30)||di$1(c,b,e);}return e}function di$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
    function ci$1(a,b,c,d){b.value=c;b.getSnapshot=d;ei$1(b)&&fi$1(a);}function ai$1(a,b,c){return c(function(){ei$1(b)&&fi$1(a);})}function ei$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return !0}}function fi$1(a){var b=ih(a,1);null!==b&&gi$1(b,a,1,-1);}
    function hi$1(a){var b=Th$1();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh$1,lastRenderedState:a};b.queue=a;a=a.dispatch=ii$1.bind(null,M$1,a);return [b.memoizedState,a]}
    function bi$1(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji$1(){return Uh$1().memoizedState}function ki$1(a,b,c,d){var e=Th$1();M$1.flags|=a;e.memoizedState=bi$1(1|b,c,void 0,void 0===d?null:d);}
    function li$1(a,b,c,d){var e=Uh$1();d=void 0===d?null:d;var f=void 0;if(null!==N$1){var g=N$1.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi$1(b,c,f,d);return}}M$1.flags|=a;e.memoizedState=bi$1(1|b,c,f,d);}function mi$1(a,b){return ki$1(8390656,8,a,b)}function $h(a,b){return li$1(2048,8,a,b)}function ni$1(a,b){return li$1(4,2,a,b)}function oi$1(a,b){return li$1(4,4,a,b)}
    function pi$1(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi$1(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li$1(4,4,pi$1.bind(null,b,a),c)}function ri$1(){}function si$1(a,b){var c=Uh$1();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
    function ti$1(a,b){var c=Uh$1();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui$1(a,b,c){if(0===(Hh$1&21))return a.baseState&&(a.baseState=!1,dh$1=!0),a.memoizedState=c;He$1(c,b)||(c=yc$1(),M$1.lanes|=c,rh|=c,a.baseState=!0);return b}function vi$1(a,b){var c=C$1;C$1=0!==c&&4>c?c:4;a(!0);var d=Gh$1.transition;Gh$1.transition={};try{a(!1),b();}finally{C$1=c,Gh$1.transition=d;}}function wi$1(){return Uh$1().memoizedState}
    function xi$1(a,b,c){var d=yi$1(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi$1(a))Ai$1(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R$1();gi$1(c,a,d,e);Bi$1(c,b,d);}}
    function ii$1(a,b,c){var d=yi$1(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(zi$1(a))Ai$1(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,gh$1(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R$1(),gi$1(c,a,d,e),Bi$1(c,b,d));}}
    function zi$1(a){var b=a.alternate;return a===M$1||null!==b&&b===M$1}function Ai$1(a,b){Jh$1=Ih$1=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi$1(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
    var Rh$1={readContext:eh,useCallback:P$1,useContext:P$1,useEffect:P$1,useImperativeHandle:P$1,useInsertionEffect:P$1,useLayoutEffect:P$1,useMemo:P$1,useReducer:P$1,useRef:P$1,useState:P$1,useDebugValue:P$1,useDeferredValue:P$1,useTransition:P$1,useMutableSource:P$1,useSyncExternalStore:P$1,useId:P$1,unstable_isNewReconciler:!1},Oh={readContext:eh,useCallback:function(a,b){Th$1().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki$1(4194308,
    4,pi$1.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki$1(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki$1(4,2,a,b)},useMemo:function(a,b){var c=Th$1();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th$1();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi$1.bind(null,M$1,a);return [d.memoizedState,a]},useRef:function(a){var b=
    Th$1();a={current:a};return b.memoizedState=a},useState:hi$1,useDebugValue:ri$1,useDeferredValue:function(a){return Th$1().memoizedState=a},useTransition:function(){var a=hi$1(!1),b=a[0];a=vi$1.bind(null,a[1]);Th$1().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M$1,e=Th$1();if(I){if(void 0===c)throw Error(p$1(407));c=c();}else {c=b();if(null===Q$1)throw Error(p$1(349));0!==(Hh$1&30)||di$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi$1(ai$1.bind(null,d,
    f,a),[a]);d.flags|=2048;bi$1(9,ci$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th$1(),b=Q$1.identifierPrefix;if(I){var c=sg;var d=rg;c=(d&~(1<<32-oc$1(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh$1++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh$1++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Ph$1={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Wh$1,useRef:ji$1,useState:function(){return Wh$1(Vh$1)},
    useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh$1();return ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Wh$1(Vh$1)[0],b=Uh$1().memoizedState;return [a,b]},useMutableSource:Yh$1,useSyncExternalStore:Zh$1,useId:wi$1,unstable_isNewReconciler:!1},Qh$1={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Xh$1,useRef:ji$1,useState:function(){return Xh$1(Vh$1)},useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh$1();return null===
    N$1?b.memoizedState=a:ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Xh$1(Vh$1)[0],b=Uh$1().memoizedState;return [a,b]},useMutableSource:Yh$1,useSyncExternalStore:Zh$1,useId:wi$1,unstable_isNewReconciler:!1};function Ci$1(a,b){if(a&&a.defaultProps){b=A({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di$1(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
    var Ei$1={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh$1(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh$1(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R$1(),d=
    yi$1(a),e=mh$1(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi$1(b,a,d,c),oh(b,a,d));}};function Fi$1(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):!0}
    function Gi$1(a,b,c){var d=!1,e=Vf$1;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H$1.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf$1(a,e):Vf$1);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei$1;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
    function Hi$1(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei$1.enqueueReplaceState(b,b.state,null);}
    function Ii$1(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh$1(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H$1.current,e.context=Yf$1(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di$1(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
    "function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei$1.enqueueReplaceState(e,e.state,null),qh$1(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji$1(a,b){try{var c="",d=b;do c+=Pa$1(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
    function Ki$1(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li$1(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi$1="function"===typeof WeakMap?WeakMap:Map;function Ni$1(a,b,c){c=mh$1(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi$1||(Oi$1=!0,Pi$1=d);Li$1(a,b);};return c}
    function Qi$1(a,b,c){c=mh$1(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li$1(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li$1(a,b);"function"!==typeof d&&(null===Ri$1?Ri$1=new Set([this]):Ri$1.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
    function Si$1(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi$1;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti$1.bind(null,a,b,c),b.then(a,a));}function Ui$1(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return;}while(null!==a);return null}
    function Vi$1(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh$1(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi$1=ua$1.ReactCurrentOwner,dh$1=!1;function Xi$1(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
    function Yi$1(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh$1(a,b,c,d,f,e);c=Sh$1();if(null!==a&&!dh$1)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi$1(a,b,e);I&&c&&vg(b);b.flags|=1;Xi$1(a,b,d,e);return b.child}
    function $i$1(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return Zi$1(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
    function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(dh$1=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh$1=!0);else return b.lanes=a.lanes,Zi$1(a,b,e)}return cj(a,b,c,d,e)}
    function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(ej,fj);fj|=d;}else null!==
    f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(ej,fj),fj|=d;Xi$1(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H$1.current;f=Yf$1(b,f);ch(b,e);c=Nh$1(a,b,c,d,f,e);d=Sh$1();if(null!==a&&!dh$1)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi$1(a,b,e);I&&d&&vg(b);b.flags|=1;Xi$1(a,b,c,e);return b.child}
    function hj(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b);}else f=!1;ch(b,e);if(null===b.stateNode)ij(a,b),Gi$1(b,c,d),Ii$1(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H$1.current,l=Yf$1(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
    (h!==d||k!==l)&&Hi$1(b,g,d,l);jh$1=!1;var r=b.memoizedState;g.state=r;qh$1(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf$1.current||jh$1?("function"===typeof m&&(Di$1(b,c,m,d),k=b.memoizedState),(h=jh$1||Fi$1(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
    ("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1);}else {g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci$1(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H$1.current,k=Yf$1(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
    "function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi$1(b,g,d,k);jh$1=!1;r=b.memoizedState;g.state=r;qh$1(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf$1.current||jh$1?("function"===typeof y&&(Di$1(b,c,y,d),n=b.memoizedState),(l=jh$1||Fi$1(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
    g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
    a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1);}return jj(a,b,c,d,f,e)}
    function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),Zi$1(a,b,f);d=b.stateNode;Wi$1.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi$1(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);yh$1(a,b.containerInfo);}
    function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi$1(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
    function oj(a,b,c){var d=b.pendingProps,e=L$1.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(L$1,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
    g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
    b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
    function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
    function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki$1(Error(p$1(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
    if(d)var h=d.dgst;d=h;f=Error(p$1(419));d=Ki$1(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh$1||h){d=Q$1;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
    0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi$1(d,a,e,-1));}tj();d=Ki$1(Error(p$1(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf$1(e.nextSibling);xg=b;I=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh$1(a.return,b,c);}
    function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
    function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi$1(a,b,d.children,c);d=L$1.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(L$1,d);if(0===(b.mode&1))b.memoizedState=
    null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch$1(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch$1(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,!0,c,null,f);break;case "together":wj(b,!1,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
    function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi$1(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p$1(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
    function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah$1(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh$1(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(L$1,L$1.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G$1(L$1,L$1.current&1);a=Zi$1(a,b,c);return null!==a?a.sibling:null}G$1(L$1,L$1.current&1);break;case 19:d=0!==(c&
    b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(L$1,L$1.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi$1(a,b,c)}var zj,Aj,Bj,Cj;
    zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
    Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh$1(uh.current);var f=null;switch(c){case "input":e=Ya$1(a,e);d=Ya$1(a,d);f=[];break;case "select":e=A({},e,{value:void 0});d=A({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
    (c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea$1.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
    c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea$1.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$1("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
    function Dj(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
    function S$1(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
    function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$1(b),null;case 1:return Zf(b.type)&&$f$1(),S$1(b),null;case 3:d=b.stateNode;zh$1();E$1(Wf$1);E$1(H$1);Eh$1();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S$1(b);return null;case 5:Bh$1(b);var e=xh$1(wh$1.current);
    c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p$1(166));S$1(b);return null}a=xh$1(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of$1]=b;d[Pf$1]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$1("cancel",d);D$1("close",d);break;case "iframe":case "object":case "embed":D$1("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D$1(lf[e],d);break;case "source":D$1("error",d);break;case "img":case "image":case "link":D$1("error",
    d);D$1("load",d);break;case "details":D$1("toggle",d);break;case "input":Za$1(d,f);D$1("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$1("invalid",d);break;case "textarea":hb(d,f),D$1("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af$1(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af$1(d.textContent,
    h,a),e=["children",""+h]):ea$1.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$1("scroll",d);}switch(c){case "input":Va$1(d);db(d,f,!0);break;case "textarea":Va$1(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
    "string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of$1]=b;a[Pf$1]=d;zj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$1("cancel",a);D$1("close",a);e=d;break;case "iframe":case "object":case "embed":D$1("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D$1(lf[e],a);e=d;break;case "source":D$1("error",a);e=d;break;case "img":case "image":case "link":D$1("error",
    a);D$1("load",a);e=d;break;case "details":D$1("toggle",a);e=d;break;case "input":Za$1(a,d);e=Ya$1(a,d);D$1("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A({},d,{value:void 0});D$1("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$1("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
    c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea$1.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$1("scroll",a):null!=k&&ta$1(a,f,k,g));}switch(c){case "input":Va$1(a);db(a,d,!1);break;case "textarea":Va$1(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa$1(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
    !0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$1(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p$1(166));c=xh$1(wh$1.current);xh$1(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of$1]=b;if(f=d.nodeValue!==c)if(a=
    xg,null!==a)switch(a.tag){case 3:Af$1(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af$1(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of$1]=b,b.stateNode=d;}S$1(b);return null;case 13:E$1(L$1);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
    a){if(!f)throw Error(p$1(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p$1(317));f[Of$1]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$1(b);f=!1;}else null!==zg&&(Fj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L$1.current&1)?0===T$1&&(T$1=3):tj()));null!==b.updateQueue&&(b.flags|=4);S$1(b);return null;case 4:return zh$1(),
    Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S$1(b),null;case 10:return ah(b.type._context),S$1(b),null;case 17:return Zf(b.type)&&$f$1(),S$1(b),null;case 19:E$1(L$1);f=b.memoizedState;if(null===f)return S$1(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,!1);else {if(0!==T$1||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch$1(a);if(null!==g){b.flags|=128;Dj(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
    g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(L$1,L$1.current&1|2);return b.child}a=
    a.sibling;}null!==f.tail&&B()>Gj&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);}else {if(!d)if(a=Ch$1(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I)return S$1(b),null}else 2*B()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=!0,Dj(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
    b,f.tail=b.sibling,f.renderingStartTime=B(),b.sibling=null,c=L$1.current,G$1(L$1,d?c&1|2:c&1),b;S$1(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S$1(b),b.subtreeFlags&6&&(b.flags|=8192)):S$1(b),null;case 24:return null;case 25:return null}throw Error(p$1(156,b.tag));}
    function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f$1(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh$1(),E$1(Wf$1),E$1(H$1),Eh$1(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh$1(b),null;case 13:E$1(L$1);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p$1(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E$1(L$1),null;case 4:return zh$1(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
    null;case 24:return null;default:return null}}var Jj=!1,U$1=!1,Kj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Nj=!1;
    function Oj(a,b){Cf$1=dd$1;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
    q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd$1=!1;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
    case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci$1(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p$1(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Nj;Nj=!1;return n}
    function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
    function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of$1],delete b[Pf$1],delete b[of],delete b[Qf],delete b[Rf$1]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
    function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
    function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
    function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X$1=null,Xj=!1;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
    function Zj(a,b,c){if(lc$1&&"function"===typeof lc$1.onCommitFiberUnmount)try{lc$1.onCommitFiberUnmount(kc$1,c);}catch(h){}switch(c.tag){case 5:U$1||Lj(c,b);case 6:var d=X$1,e=Xj;X$1=null;Yj(a,b,c);X$1=d;Xj=e;null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf$1(a.parentNode,c):1===a.nodeType&&Kf$1(a,c),bd$1(a)):Kf$1(X$1,c.stateNode));break;case 4:d=X$1;e=Xj;X$1=c.stateNode.containerInfo;Xj=!0;
    Yj(a,b,c);X$1=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U$1&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
    c.memoizedState,Yj(a,b,c),U$1=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
    function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Xj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Xj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X$1)throw Error(p$1(160));Zj(f,g,e);X$1=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
    function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W$1(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
    a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta$1(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
    f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf$1]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p$1(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd$1(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
    null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,ck(b,a),U$1=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
    b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V$1=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
    rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
    a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p$1(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p$1(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V$1=a;ik(a);}
    function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Jj;var l=U$1;Jj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V$1=k):jk(e);for(;null!==f;)V$1=f,ik(f),f=f.sibling;V$1=e;Jj=h;U$1=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):kk(a);}}
    function kk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci$1(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
    b.child.stateNode;break;case 1:c=b.child.stateNode;}sh(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd$1(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
    default:throw Error(p$1(163));}U$1||b.flags&512&&Rj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function gk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
    function jk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
    var lk=Math.ceil,mk=ua$1.ReactCurrentDispatcher,nk=ua$1.ReactCurrentOwner,ok=ua$1.ReactCurrentBatchConfig,K$1=0,Q$1=null,Y$1=null,Z$1=0,fj=0,ej=Uf$1(0),T$1=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi$1=!1,Pi$1=null,Ri$1=null,vk=!1,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R$1(){return 0!==(K$1&6)?B():-1!==Ak?Ak:Ak=B()}
    function yi$1(a){if(0===(a.mode&1))return 1;if(0!==(K$1&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Bk&&(Bk=yc$1()),Bk;a=C$1;if(0!==a)return a;a=window.event;a=void 0===a?16:jd$1(a.type);return a}function gi$1(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p$1(185));Ac$1(a,c,d);if(0===(K$1&2)||a!==Q$1)a===Q$1&&(0===(K$1&2)&&(qk|=c),4===T$1&&Ck(a,Z$1)),Dk(a,d),1===c&&0===K$1&&0===(b.mode&1)&&(Gj=B()+500,fg&&jg());}
    function Dk(a,b){var c=a.callbackNode;wc$1(a,b);var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)null!==c&&bc$1(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc$1(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf$1(function(){0===(K$1&6)&&jg();}),c=null;else {switch(Dc$1(d)){case 1:c=fc$1;break;case 4:c=gc$1;break;case 16:c=hc$1;break;case 536870912:c=jc$1;break;default:c=hc$1;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
    function Gk(a,b){Ak=-1;Bk=0;if(0!==(K$1&6))throw Error(p$1(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K$1;K$1|=2;var f=Jk();if(Q$1!==a||Z$1!==b)uk=null,Gj=B()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K$1=e;null!==Y$1?b=0:(Q$1=null,Z$1=0,b=T$1);}if(0!==b){2===b&&(e=xc$1(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;if(6===b)Ck(a,d);
    else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc$1(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p$1(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B(),10<b)){if(0!==uc$1(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R$1();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff$1(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
    d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc$1(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff$1(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p$1(329));}}}Dk(a,B());return a.callbackNode===c?Gk.bind(null,a):null}
    function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
    function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return !1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return !0;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return !0}
    function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc$1(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K$1&6))throw Error(p$1(327));Hk();var b=uc$1(a,0);if(0===(b&1))return Dk(a,B()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc$1(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B()),c;if(6===c)throw Error(p$1(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B());return null}
    function Qk(a,b){var c=K$1;K$1|=1;try{return a(b)}finally{K$1=c,0===K$1&&(Gj=B()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K$1&6)&&Hk();var b=K$1;K$1|=1;var c=ok.transition,d=C$1;try{if(ok.transition=null,C$1=1,a)return a()}finally{C$1=d,ok.transition=c,K$1=b,0===(K$1&6)&&jg();}}function Hj(){fj=ej.current;E$1(ej);}
    function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf$1(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f$1();break;case 3:zh$1();E$1(Wf$1);E$1(H$1);Eh$1();break;case 5:Bh$1(d);break;case 4:zh$1();break;case 13:E$1(L$1);break;case 19:E$1(L$1);break;case 10:ah(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q$1=a;Y$1=a=Pg(a.current,null);Z$1=fj=b;T$1=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
    0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
    function Mk(a,b){do{var c=Y$1;try{$g();Fh$1.current=Rh$1;if(Ih$1){for(var d=M$1.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih$1=!1;}Hh$1=0;O$1=N$1=M$1=null;Jh$1=!1;Kh$1=0;nk.current=null;if(null===c||null===c.return){T$1=1;pk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
    m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui$1(g);if(null!==y){y.flags&=-257;Vi$1(y,g,h,f,b);y.mode&1&&Si$1(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si$1(f,l,b);tj();break a}k=Error(p$1(426));}}else if(I&&h.mode&1){var J=Ui$1(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi$1(J,g,h,f,b);Jg(Ji$1(k,h));break a}}f=k=Ji$1(k,h);4!==T$1&&(T$1=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
    b&=-b;f.lanes|=b;var x=Ni$1(f,k,b);ph$1(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri$1||!Ri$1.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi$1(f,h,b);ph$1(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh$1;return null===a?Rh$1:a}
    function tj(){if(0===T$1||3===T$1||2===T$1)T$1=4;null===Q$1||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q$1,Z$1);}function Ik(a,b){var c=K$1;K$1|=2;var d=Jk();if(Q$1!==a||Z$1!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K$1=c;mk.current=d;if(null!==Y$1)throw Error(p$1(261));Q$1=null;Z$1=0;return T$1}function Tk(){for(;null!==Y$1;)Uk(Y$1);}function Lk(){for(;null!==Y$1&&!cc$1();)Uk(Y$1);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y$1=b;nk.current=null;}
    function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y$1=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$1=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$1&&(T$1=5);}function Pk(a,b,c){var d=C$1,e=ok.transition;try{ok.transition=null,C$1=1,Wk(a,b,c,d);}finally{ok.transition=e,C$1=d;}return null}
    function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K$1&6))throw Error(p$1(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p$1(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc$1(a,f);a===Q$1&&(Y$1=Q$1=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=!0,Fk(hc$1,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
    var g=C$1;C$1=1;var h=K$1;K$1|=4;nk.current=null;Oj(a,c);dk(c,a);Oe$1(Df);dd$1=!!Cf$1;Df=Cf$1=null;a.current=c;hk(c);dc$1();K$1=h;C$1=g;ok.transition=f;}else a.current=c;vk&&(vk=!1,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri$1=null);mc$1(c.stateNode);Dk(a,B());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi$1)throw Oi$1=!1,a=Pi$1,Pi$1=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
    function Hk(){if(null!==wk){var a=Dc$1(xk),b=ok.transition,c=C$1;try{ok.transition=null;C$1=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K$1&6))throw Error(p$1(331));var e=K$1;K$1|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Sj(m);if(m===
    l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
    u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$1=e;jg();if(lc$1&&"function"===typeof lc$1.onPostCommitFiberRoot)try{lc$1.onPostCommitFiberRoot(kc$1,a);}catch(na){}d=!0;}return d}finally{C$1=c,ok.transition=b;}}return !1}function Xk(a,b,c){b=Ji$1(c,b);b=Ni$1(a,b,1);a=nh(a,b,1);b=R$1();null!==a&&(Ac$1(a,1,b),Dk(a,b));}
    function W$1(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri$1||!Ri$1.has(d))){a=Ji$1(c,a);a=Qi$1(b,a,1);b=nh(b,a,1);a=R$1();null!==b&&(Ac$1(b,1,a),Dk(b,a));break}}b=b.return;}}
    function Ti$1(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R$1();a.pingedLanes|=a.suspendedLanes&c;Q$1===a&&(Z$1&c)===c&&(4===T$1||3===T$1&&(Z$1&130023424)===Z$1&&500>B()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc$1,sc$1<<=1,0===(sc$1&130023424)&&(sc$1=4194304)));var c=R$1();a=ih(a,b);null!==a&&(Ac$1(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
    function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p$1(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
    Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf$1.current)dh$1=!0;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh$1=!1,yj(a,b,c);dh$1=0!==(a.flags&131072)?!0:!1;}else dh$1=!1,I&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf$1(b,H$1.current);ch(b,c);e=Nh$1(null,b,d,a,e,c);var f=Sh$1();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
    null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh$1(b),e.updater=Ei$1,b.stateNode=e,e._reactInternals=b,Ii$1(b,d,a,c),b=jj(null,b,d,!0,f,c)):(b.tag=0,I&&f&&vg(b),Xi$1(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci$1(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi$1(null,b,d,a,c);break a;case 14:b=$i$1(null,b,d,Ci$1(d.type,a),c);break a}throw Error(p$1(306,
    d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p$1(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh$1(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
    f,b.memoizedState=f,b.flags&256){e=Ji$1(Error(p$1(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji$1(Error(p$1(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf$1(b.stateNode.containerInfo.firstChild),xg=b,I=!0,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi$1(a,b,c);break a}Xi$1(a,b,d,c);}b=b.child;}return b;case 5:return Ah$1(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
    gj(a,b),Xi$1(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh$1(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi$1(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),Yi$1(a,b,d,e,c);case 7:return Xi$1(a,b,b.pendingProps,c),b.child;case 8:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 12:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
    g=e.value;G$1(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf$1.current){b=Zi$1(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh$1(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh$1(f.return,
    c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p$1(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh$1(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi$1(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi$1(a,b,d,c),
    b.child;case 14:return d=b.type,e=Ci$1(d,b.pendingProps),e=Ci$1(d.type,e),$i$1(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),ij(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,ch(b,c),Gi$1(b,d,e),Ii$1(b,d,e,c),jj(null,b,d,!0,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p$1(156,b.tag));};function Fk(a,b){return ac$1(a,b)}
    function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
    function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da$1)return 11;if(a===Ga$1)return 14}return 2}
    function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
    c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
    function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya$1:return Tg(c.children,e,f,b);case za$1:g=8;e|=8;break;case Aa$1:return a=Bg(12,c,b,e|2),a.elementType=Aa$1,a.lanes=f,a;case Ea$1:return a=Bg(13,c,b,e),a.elementType=Ea$1,a.lanes=f,a;case Fa$1:return a=Bg(19,c,b,e),a.elementType=Fa$1,a.lanes=f,a;case Ia$1:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba$1:g=10;break a;case Ca$1:g=9;break a;case Da$1:g=11;
    break a;case Ga$1:g=14;break a;case Ha$1:g=16;d=null;break a}throw Error(p$1(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia$1;a.lanes=c;a.stateNode={isHidden:!1};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
    function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
    function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc$1(0);this.expirationTimes=zc$1(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc$1(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
    null;}function bl(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh$1(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa$1,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
    function dl$1(a){if(!a)return Vf$1;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p$1(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p$1(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
    function el(a,b,c,d,e,f,g,h,k){a=bl(c,d,!0,a,e,f,g,h,k);a.context=dl$1(null);c=a.current;d=R$1();e=yi$1(c);f=mh$1(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac$1(a,e,d);Dk(a,d);return a}function fl$1(a,b,c,d){var e=b.current,f=R$1(),g=yi$1(e);c=dl$1(c);null===b.context?b.context=c:b.pendingContext=c;b=mh$1(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi$1(a,e,g,f),oh(a,e,g));return g}
    function gl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl$1(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il$1(a,b){hl$1(a,b);(a=a.alternate)&&hl$1(a,b);}function jl(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a);};function ll(a){this._internalRoot=a;}
    ml.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p$1(409));fl$1(a,b,null,null);};ml.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl$1(null,a,null,null);});b[uf]=null;}};function ml(a){this._internalRoot=a;}
    ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc$1();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc$1.length&&0!==b&&b<Qc$1[c].priority;c++);Qc$1.splice(c,0,a);0===c&&Vc$1(a);}};function nl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl$1(){}
    function ql(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl(g);f.call(a);};}var g=el(b,d,a,0,null,!1,!1,"",pl$1);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl(k);h.call(a);};}var k=bl(a,0,!1,null,null,!1,!1,"",pl$1);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl$1(b,k,c,d);});return k}
    function rl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl(g);h.call(a);};}fl$1(b,g,a,e);}else g=ql(c,b,a,e,d);return gl(g)}Ec$1=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc$1(b.pendingLanes);0!==c&&(Cc$1(b,c|1),Dk(b,B()),0===(K$1&6)&&(Gj=B()+500,jg()));}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R$1();gi$1(b,a,1,c);}}),il$1(a,1);}};
    Fc$1=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R$1();gi$1(b,a,134217728,c);}il$1(a,134217728);}};Gc$1=function(a){if(13===a.tag){var b=yi$1(a),c=ih(a,b);if(null!==c){var d=R$1();gi$1(c,a,b,d);}il$1(a,b);}};Hc$1=function(){return C$1};Ic$1=function(a,b){var c=C$1;try{return C$1=a,b()}finally{C$1=c;}};
    yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p$1(90));Wa$1(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1);}};Gb=Qk;Hb=Rk;
    var sl={usingClientEntryPoint:!1,Events:[Cb,ue$1,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc$1,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
    var ul$1={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua$1.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
    jl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl.isDisabled&&vl.supportsFiber)try{kc$1=vl.inject(ul$1),lc$1=vl;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
    reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p$1(200));return cl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl(a))throw Error(p$1(299));var c=!1,d="",e=kl;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll(b)};
    reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p$1(188));a=Object.keys(a).join(",");throw Error(p$1(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol(b))throw Error(p$1(200));return rl(null,a,b,!0,c)};
    reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p$1(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=kl;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
    e);return new ml(b)};reactDom_production_min.render=function(a,b,c){if(!ol(b))throw Error(p$1(200));return rl(null,a,b,!1,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p$1(40));return a._reactRootContainer?(Rk(function(){rl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),!0):!1};reactDom_production_min.unstable_batchedUpdates=Qk;
    reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p$1(200));if(null==a||void 0===a._reactInternals)throw Error(p$1(38));return rl(a,b,c,!1,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";

    function checkDCE() {
      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
      ) {
        return;
      }
      try {
        // Verify that the code above has been dead code eliminated (DCE'd).
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        // DevTools shouldn't crash React, no matter what.
        // We should still report in case we break this code.
        console.error(err);
      }
    }

    {
      // DCE check should happen before ReactDOM bundle executes so that
      // DevTools can report bad minification during injection.
      checkDCE();
      reactDom.exports = reactDom_production_min;
    }

    var reactDomExports = reactDom.exports;

    var createRoot;

    var m$1 = reactDomExports;
    {
      createRoot = m$1.createRoot;
      m$1.hydrateRoot;
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
    var f=reactExports,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
    function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

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
        const [io, setIOConnect] = reactExports.useState(null);
        reactExports.useEffect(() => {
            const initialize = async () => {
                try {
                    if (settings.browser && settings.browserPlatform) {
                        throw new Error("Cannot initialize, because the settings are over-specified: defined are both browser and browserPlatform. Please set one or the other");
                    }
                    const isDesktop = (typeof window.glue42gd !== "undefined") || (typeof window.iodesktop !== "undefined");
                    if (isDesktop) {
                        const factory = settings.desktop?.factory || settings.browser?.factory || settings.browserPlatform?.factory || window.IODesktop || window.Glue;
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

    const IOConnectContext = reactExports.createContext(null);
    const IOConnectProvider = reactExports.memo(({ children, fallback = null, settings = {}, onInitError }) => {
        const glue = useIOConnectInit(settings, onInitError);
        return glue ? (React.createElement(IOConnectContext.Provider, { value: glue }, children)) : (React.createElement(React.Fragment, null, fallback));
    });
    IOConnectProvider.propTypes = {
        children: propTypesExports.node,
        settings: propTypesExports.object,
        fallback: propTypesExports.node,
    };
    IOConnectProvider.displayName = 'IOConnectProvider';

    function b(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var k,C={exports:{}};
    /*!
    	Copyright (c) 2018 Jed Watson.
    	Licensed under the MIT License (MIT), see
    	http://jedwatson.github.io/classnames
    */k=C,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var i=arguments[t];i&&(e=o(e,n(i)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var i="";for(var r in n)e.call(n,r)&&n[r]&&(i=o(i,r));return i}function o(e,t){return t?e?e+" "+t:e+t:e}k.exports?(t.default=t,k.exports=t):window.classNames=t;}();var S=b(C.exports);function x({className:t,size:n="16",variant:o="workspace",...i}){const r=S("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,"aria-label":`icon-${o}`,role:"presentation",...i,children:jsxRuntimeExports.jsx("i",{className:`icon-${o}`})})}const N=reactExports.forwardRef(({className:t,variant:n="default",icon:o="workspace",size:i="16",tooltip:r,iconSize:s="16",onClick:l,disabled:c,children:u,...d},f)=>{const h=S("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${i}`],t),p=reactExports.useCallback(e=>{if(!c)return l?l(e):void 0;e.preventDefault();},[l,c]);return jsxRuntimeExports.jsx("button",{className:h,type:"button",ref:f,"aria-label":"icon button","aria-disabled":c,title:r,onClick:p,disabled:c,...d,children:u??(o&&jsxRuntimeExports.jsx(x,{variant:o,size:s}))})});N.displayName="ButtonIcon";function P({className:t,variant:n="default",children:o,...i}){const r=S("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:o})}function E({className:t,tag:n="h2",size:o="normal",text:i="Title",...r}){const a=n,s=S("small"===o&&"io-title-semibold","normal"===o&&"io-title","large"===o&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:i})}function T({className:n,title:o,titleSize:i="normal",tag:r,hint:a,children:s,...l}){const c=S("io-block",n),u=o?"block-title":void 0;return jsxRuntimeExports.jsxs("section",{className:c,"aria-label":o?void 0:"Block","aria-labelledby":u,...l,children:[o&&jsxRuntimeExports.jsx(E,{id:u,tag:r,text:o,size:i}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const D=e=>"Enter"===e.key||" "===e.key;const L=reactExports.forwardRef(({className:n,variant:o="default",size:i="normal",icon:r,iconSize:s="12",iconRight:l=!1,text:c,onClick:u,disabled:d,children:f,...h},p)=>{const m=S("io-btn",("primary"===o||"critical"===o||"outline"===o||"link"===o)&&[`io-btn-${o}`],"large"===i&&"io-btn-lg",n),g=reactExports.useCallback(e=>{if(!d)return u?u(e):void 0;e.preventDefault();},[u,d]),v=reactExports.useCallback(e=>{d||D(e)&&(e.preventDefault(),g(e));},[g,d]);return jsxRuntimeExports.jsxs("button",{className:m,ref:p,type:"button","aria-disabled":d,onClick:g,onKeyDown:v,disabled:d,tabIndex:0,...h,children:[r&&!l&&jsxRuntimeExports.jsx(x,{variant:r,size:s}),f??c,r&&l&&jsxRuntimeExports.jsx(x,{variant:r,size:s})]})});L.displayName="Button";const R=reactExports.createContext({}),F=reactExports.forwardRef(({icon:t="chevron-down",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=reactExports.useContext(R),d=reactExports.useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=reactExports.useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),h=reactExports.useCallback(e=>{o?.(e),e.defaultPrevented||D(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(L,{icon:t,iconRight:!0,onClick:f,onKeyDown:h,disabled:c,ref:d,...i})});F.displayName="DropdownButton";const O=reactExports.forwardRef(({size:t="32",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=reactExports.useContext(R),d=reactExports.useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=reactExports.useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),h=reactExports.useCallback(e=>{o?.(e),e.defaultPrevented||D(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(N,{size:t,onClick:f,onKeyDown:h,disabled:c,ref:d,...i})});function M({className:t,...n}){const o=S("io-dropdown-content",t);return jsxRuntimeExports.jsx("div",{className:o,...n})}O.displayName="DropdownButtonIcon";const $=reactExports.createContext({}),_=reactExports.forwardRef((n,o)=>{const{className:i,prepend:r,append:a,isSelected:s,onClick:c,description:u,disabled:d=!1,children:f,tooltip:h,...p}=n,{variant:m="default",selected:g,checkIcon:v,handleItemClick:y}=reactExports.useContext($),w=s??g?.some(e=>e.children===f),b="default"!==m&&!!v,k=b||r,C=S("io-list-item",k&&"io-list-item-left",a&&"io-list-item-right","default"!==m&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",i);return jsxRuntimeExports.jsxs("li",{className:C,ref:o,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...p,children:[k&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(x,{variant:v.variant,title:w?v.tooltip:void 0,"data-testid":"list-item-check-icon"}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:h,"data-testid":"list-item-title",children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})});_.displayName="ListItem";const z=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=S("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});z.displayName="ListItemHeader";const H=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=S("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,"data-testid":"list-item-title",children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});H.displayName="ListItemTitle";const j=reactExports.forwardRef(({className:t,children:n,...o},i)=>{const r=S("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:i,...o,children:n})});j.displayName="ListItemWithSubItems";const V=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=S("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});function W({className:t,...n}){const o=S("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:o,...n})}V.displayName="ListItemSection";const K=t=>jsxRuntimeExports.jsx(W,{...t});K.displayName="ListItemSeparator";const U=reactExports.forwardRef((t,n)=>{const{className:o,variant:i="default",checkIcon:r,children:s,...l}=t,[d,f]=reactExports.useState([]),h=S("io-list","default"!==i&&"io-list-selectable",o),p=reactExports.useMemo(()=>{if(r)return "object"==typeof r?r:{variant:r}},[r]),m=reactExports.useCallback((e,t)=>{if("default"===i)return;const n=d.some(e=>e.children?.toString()===t.children?.toString());"single"===i?f([t]):(()=>{const e=n?d.filter(e=>e.children!==t.children):[...d,t];f(e);})();},[d,i]),g=reactExports.useMemo(()=>({variant:i,selected:d,checkIcon:p,handleItemClick:m}),[i,d,p,m]);return jsxRuntimeExports.jsx($.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:h,ref:n,...l,children:s})})});U.displayName="List";const J=U;J.Item=_,J.ItemTitle=H,J.ItemSection=V,J.ItemHeader=z,J.ItemWithSubItems=j,J.ItemSeparator=K;const q=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(J,{...t,ref:n}));q.displayName="DropdownList";const G=reactExports.forwardRef((t,n)=>{const{handleClose:o}=reactExports.useContext(R),{onClick:i,onKeyDown:r,...s}=t,c=reactExports.useRef(null),u=reactExports.useCallback(e=>{c.current=e,"function"==typeof n?n(e):n&&(n.current=e);},[n]);return jsxRuntimeExports.jsx(_,{...s,ref:u,onClick:e=>{i?.(e),o?.();},onKeyDown:e=>{if(r?.(e),e.defaultPrevented||!D(e))return;e.preventDefault(),e.stopPropagation();const t=("function"==typeof n?null:n?.current)||c.current;t?.click();}})});G.displayName="DropdownItem";const Y=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(H,{...t,ref:n}));Y.displayName="DropdownItemTitle";const Q=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(V,{...t,ref:n}));Q.displayName="DropdownItemSection";const X=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(W,{...t}));X.displayName="DropdownSeparator";function Z(e,t,n){const o=reactExports.useCallback(n=>{const o=t.some(e=>n.key===e);o&&(n.preventDefault(),e());},[e,t]);reactExports.useEffect(()=>{const e=n?.current||document;return e.addEventListener("keydown",o),()=>{e.removeEventListener("keydown",o);}},[o,n]);}const ee=reactExports.forwardRef(({className:t,variant:n="outline",align:o="down",disabled:i,isOpen:r,onOpenChange:s,children:l,...p},m)=>{const g=reactExports.useRef(null),v=reactExports.useRef(null);reactExports.useImperativeHandle(m,()=>v.current,[]);const{isOpen:y,handleOpen:w,handleClose:b}=((e,t)=>{const[n,o]=reactExports.useState(!1),i=void 0!==e,r=i?e:n,s=reactExports.useCallback(e=>{i||o(e),t?.(e);},[i,t]),l=reactExports.useCallback(()=>s(!0),[s]),u=reactExports.useCallback(()=>s(!1),[s]);return {isOpen:r,setOpen:s,handleOpen:l,handleClose:u}})(r,s);((e,t,n=!0)=>{reactExports.useEffect(()=>{if(!n)return;const o=n=>{const o=n.target;o&&e.current&&!e.current.contains(o)&&(n.composedPath&&n.composedPath().some(t=>t===e.current||e.current&&t.nodeType===Node.ELEMENT_NODE&&e.current.contains(t))||t());},i=requestAnimationFrame(()=>{document.addEventListener("mousedown",o,!0);});return ()=>{cancelAnimationFrame(i),document.removeEventListener("mousedown",o,!0);}},[e,t,n]);})(v,b,y),Z(()=>{y&&b();},["Escape"],v),Z(()=>{y||i||g.current!==document.activeElement||w();},["ArrowDown","ArrowUp"],v);const k=reactExports.useMemo(()=>({variant:n,align:o,disabled:i,isOpen:y,handleOpen:w,handleClose:b,handleToggle:y?b:w,setTriggerRef:e=>g.current=e}),[n,o,i,y,w,b]),C=S("io-dropdown",y&&"io-dropdown-open","default"!==n&&`io-dropdown-${n}`,t);return jsxRuntimeExports.jsx(R.Provider,{value:k,children:jsxRuntimeExports.jsx("div",{className:C,ref:v,...p,children:l})})});function te({className:t,variant:n="default",align:o="left",children:i,...r}){const a=S("io-btn-group","default"!==n&&`io-btn-group-${n}`,"right"===o&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,"data-testid":"button-group",...r,children:i})}function ne({className:t,draggable:n=!1,children:o,...i}){const r=S("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,...i,children:o})}function oe({className:t,children:n,...o}){const i=S("io-dialog-header",t);return jsxRuntimeExports.jsx(ne,{"data-testid":"io-dialog-header",className:i,...o,children:n})}function ie({className:t,children:n,...o}){const i=S("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:i,...o,children:n})}function re({className:t,children:n,...o}){const i=S("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:i,...o,children:n})}function ae({className:t,...n}){const o=S("io-dialog-footer",t);return jsxRuntimeExports.jsx(re,{"data-testid":"io-dialog-footer",className:o,...n})}function se({className:n,variant:o="default",title:i="Dialog Title",isOpen:r=!1,draggable:a=!1,closeFn:s,children:l,...c}){const u=reactExports.useRef(null),f=S("io-dialog","centered"===o&&"io-dialog-center",n);return reactExports.useLayoutEffect(()=>{const e=u?.current;e&&(r?e.showModal():"function"==typeof e.close&&e.close());},[r]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:f,ref:u,"data-modal":!0,onClose:()=>{r&&s&&s();},onClick:e=>{r&&s&&"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;r&&s&&" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(oe,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:i}),jsxRuntimeExports.jsx(te,{children:jsxRuntimeExports.jsx(N,{className:"non-draggable","data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function le(){return "undefined"!=typeof window}function ce(e){return fe(e)?(e.nodeName||"").toLowerCase():"#document"}function ue(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function de(e){var t;return null==(t=(fe(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function fe(e){return !!le()&&(e instanceof Node||e instanceof ue(e).Node)}function he(e){return !!le()&&(e instanceof Element||e instanceof ue(e).Element)}function pe(e){return !!le()&&(e instanceof HTMLElement||e instanceof ue(e).HTMLElement)}function me(e){return !(!le()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof ue(e).ShadowRoot)}function ge(e){const{overflow:t,overflowX:n,overflowY:o,display:i}=Ie(e);return /auto|scroll|overlay|hidden|clip/.test(t+o+n)&&"inline"!==i&&"contents"!==i}function ve(e){return /^(table|td|th)$/.test(ce(e))}function ye(e){try{if(e.matches(":popover-open"))return !0}catch(e){}try{return e.matches(":modal")}catch(e){return !1}}ee.Button=F,ee.ButtonIcon=O,ee.Content=M,ee.List=q,ee.Item=G,ee.ItemTitle=Y,ee.ItemSection=Q,ee.Separator=X,te.Button=L,te.ButtonIcon=N,te.Dropdown=ee,ne.Title=E,ne.ButtonGroup=te,ne.Button=L,ne.ButtonIcon=N,ne.Dropdown=ee,oe.Title=E,oe.ButtonGroup=te,oe.Button=L,oe.ButtonIcon=N,oe.Dropdown=ee,ie.Content=function({className:t,children:n,...o}){const i=S("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})},re.ButtonGroup=te,re.Button=L,re.ButtonIcon=N,re.Dropdown=ee,ae.ButtonGroup=te,ae.Button=L,ae.ButtonIcon=N,ae.Dropdown=ee,se.Header=oe,se.Body=ie,se.Footer=ae;const we=/transform|translate|scale|rotate|perspective|filter/,be=/paint|layout|strict|content/,ke=e=>!!e&&"none"!==e;let Ce;function Se(e){const t=he(e)?Ie(e):e;return ke(t.transform)||ke(t.translate)||ke(t.scale)||ke(t.rotate)||ke(t.perspective)||!xe()&&(ke(t.backdropFilter)||ke(t.filter))||we.test(t.willChange||"")||be.test(t.contain||"")}function xe(){return null==Ce&&(Ce="undefined"!=typeof CSS&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Ce}function Ne(e){return /^(html|body|#document)$/.test(ce(e))}function Ie(e){return ue(e).getComputedStyle(e)}function Ae(e){return he(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Pe(e){if("html"===ce(e))return e;const t=e.assignedSlot||e.parentNode||me(e)&&e.host||de(e);return me(t)?t.host:t}function Ee(e){const t=Pe(e);return Ne(t)?e.ownerDocument?e.ownerDocument.body:e.body:pe(t)&&ge(t)?t:Ee(t)}function Te(e,t,n){var o;void 0===t&&(t=[]),void 0===n&&(n=!0);const i=Ee(e),r=i===(null==(o=e.ownerDocument)?void 0:o.body),a=ue(i);if(r){const e=De(a);return t.concat(a,a.visualViewport||[],ge(i)?i:[],e&&n?Te(e):[])}return t.concat(i,Te(i,[],n))}function De(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Be(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function Le(e,t){if(!e||!t)return !1;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return !0;if(n&&me(n)){let n=t;for(;n;){if(e===n)return !0;n=n.parentNode||n.host;}}return !1}function Re(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function Fe(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(e=>{let{brand:t,version:n}=e;return t+"/"+n}).join(" "):navigator.userAgent}function Oe(e){return !(0!==e.mozInputSource||!e.isTrusted)||(_e()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function Me(e){return !Fe().includes("jsdom/")&&(!_e()&&0===e.width&&0===e.height||_e()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function $e(){return /apple/i.test(navigator.vendor)}function _e(){const e=/android/i;return e.test(Re())||e.test(Fe())}function ze(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function He(e){return (null==e?void 0:e.ownerDocument)||document}function je(e,t){if(null==t)return !1;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function Ve(e){return "composedPath"in e?e.composedPath()[0]:e.target}function We(e){return pe(e)&&e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])")}function Ke(e){e.preventDefault(),e.stopPropagation();}function Ue(e){return !!e&&("combobox"===e.getAttribute("role")&&We(e))}const Je=Math.min,qe=Math.max,Ge=Math.round,Ye=Math.floor,Qe=e=>({x:e,y:e}),Xe={left:"right",right:"left",bottom:"top",top:"bottom"};function Ze(e,t,n){return qe(e,Je(t,n))}function et(e,t){return "function"==typeof e?e(t):e}function tt(e){return e.split("-")[0]}function nt(e){return e.split("-")[1]}function ot(e){return "x"===e?"y":"x"}function it(e){return "y"===e?"height":"width"}function rt(e){const t=e[0];return "t"===t||"b"===t?"y":"x"}function at(e){return ot(rt(e))}function st(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const lt=["left","right"],ct=["right","left"],ut=["top","bottom"],dt=["bottom","top"];function ft(e,t,n,o){const i=nt(e);let r=function(e,t,n){switch(e){case"top":case"bottom":return n?t?ct:lt:t?lt:ct;case"left":case"right":return t?ut:dt;default:return []}}(tt(e),"start"===n,o);return i&&(r=r.map(e=>e+"-"+i),t&&(r=r.concat(r.map(st)))),r}function ht(e){const t=tt(e);return Xe[t]+e.slice(t.length)}function pt(e){const{x:t,y:n,width:o,height:i}=e;return {width:o,height:i,top:n,left:t,right:t+o,bottom:n+i,x:t,y:n}}
    /*!
    * tabbable 6.4.0
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */var mt=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"].join(","),gt="undefined"==typeof Element,vt=gt?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,yt=!gt&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},wt=function(e,t){var n;void 0===t&&(t=!0);var o=null==e||null===(n=e.getAttribute)||void 0===n?void 0:n.call(e,"inert");return ""===o||"true"===o||t&&e&&("function"==typeof e.closest?e.closest("[inert]"):wt(e.parentNode))},bt=function(e,t,n){for(var o=[],i=Array.from(e);i.length;){var r=i.shift();if(!wt(r,!1))if("SLOT"===r.tagName){var a=r.assignedElements(),s=a.length?a:r.children,l=bt(s,!0,n);n.flatten?o.push.apply(o,l):o.push({scopeParent:r,candidates:l});}else {vt.call(r,mt)&&n.filter(r)&&(t||!e.includes(r))&&o.push(r);var c=r.shadowRoot||"function"==typeof n.getShadowRoot&&n.getShadowRoot(r),u=!wt(c,!1)&&(!n.shadowRootFilter||n.shadowRootFilter(r));if(c&&u){var d=bt(!0===c?r.children:c.children,!0,n);n.flatten?o.push.apply(o,d):o.push({scopeParent:r,candidates:d});}else i.unshift.apply(i,r.children);}}return o},kt=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},Ct=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!kt(e)?0:e.tabIndex},St=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},xt=function(e){return "INPUT"===e.tagName},Nt=function(e){return function(e){return xt(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return !0;var t,n=e.form||yt(e),o=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=o(window.CSS.escape(e.name));else try{t=o(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),!1}var i=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !i||i===e}(e)},It=function(e){var t=e.getBoundingClientRect(),n=t.width,o=t.height;return 0===n&&0===o},At=function(e,t){var n=t.displayCheck,o=t.getShadowRoot;if("full-native"===n&&"checkVisibility"in e)return !e.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});if("hidden"===getComputedStyle(e).visibility)return !0;var i=vt.call(e,"details>summary:first-of-type")?e.parentElement:e;if(vt.call(i,"details:not([open]) *"))return !0;if(n&&"full"!==n&&"full-native"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return It(e)}else {if("function"==typeof o){for(var r=e;e;){var a=e.parentElement,s=yt(e);if(a&&!a.shadowRoot&&!0===o(a))return It(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,o,i,r=e&&yt(e),a=null===(t=r)||void 0===t?void 0:t.host,s=!1;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(o=n.ownerDocument)&&void 0!==o&&o.contains(a)||null!=e&&null!==(i=e.ownerDocument)&&void 0!==i&&i.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=yt(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return !0}return !1},Pt=function(e,t){return !(t.disabled||function(e){return xt(e)&&"hidden"===e.type}(t)||At(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some(function(e){return "SUMMARY"===e.tagName})}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var o=t.children.item(n);if("LEGEND"===o.tagName)return !!vt.call(t,"fieldset[disabled] *")||!o.contains(e)}return !0}t=t.parentElement;}return !1}(t))},Et=function(e,t){return !(Nt(t)||Ct(t)<0||!Pt(e,t))},Tt=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},Dt=function(e){var t=[],n=[];return e.forEach(function(e,o){var i=!!e.scopeParent,r=i?e.scopeParent:e,a=function(e,t){var n=Ct(e);return n<0&&t&&!kt(e)?0:n}(r,i),s=i?Dt(e.candidates):r;0===a?i?t.push.apply(t,s):t.push(r):n.push({documentOrder:o,tabIndex:a,item:e,isScope:i,content:s});}),n.sort(St).reduce(function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e},[]).concat(t)},Bt=function(e,t){var n;return n=(t=t||{}).getShadowRoot?bt([e],t.includeContainer,{filter:Et.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:Tt}):function(e,t,n){if(wt(e))return [];var o=Array.prototype.slice.apply(e.querySelectorAll(mt));return t&&vt.call(e,mt)&&o.unshift(e),o.filter(n)}(e,t.includeContainer,Et.bind(null,t)),Dt(n)};function Lt(e,t,n){let{reference:o,floating:i}=e;const r=rt(t),a=at(t),s=it(a),l=tt(t),c="y"===r,u=o.x+o.width/2-i.width/2,d=o.y+o.height/2-i.height/2,f=o[s]/2-i[s]/2;let h;switch(l){case"top":h={x:u,y:o.y-i.height};break;case"bottom":h={x:u,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:d};break;case"left":h={x:o.x-i.width,y:d};break;default:h={x:o.x,y:o.y};}switch(nt(t)){case"start":h[a]-=f*(n&&c?-1:1);break;case"end":h[a]+=f*(n&&c?-1:1);}return h}async function Rt(e,t){var n;void 0===t&&(t={});const{x:o,y:i,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=!1,padding:h=0}=et(t,e),p=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(h),m=s[f?"floating"===d?"reference":"floating":d],g=pt(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(m)))||n?m:m.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:o,y:i,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=pt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+p.top)/w.y,bottom:(b.bottom-g.bottom+p.bottom)/w.y,left:(g.left-b.left+p.left)/w.x,right:(b.right-g.right+p.right)/w.x}}const Ft=new Set(["left","top"]);function Ot(e){const t=Ie(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const i=pe(e),r=i?e.offsetWidth:n,a=i?e.offsetHeight:o,s=Ge(n)!==r||Ge(o)!==a;return s&&(n=r,o=a),{width:n,height:o,$:s}}function Mt(e){return he(e)?e:e.contextElement}function $t(e){const t=Mt(e);if(!pe(t))return Qe(1);const n=t.getBoundingClientRect(),{width:o,height:i,$:r}=Ot(t);let a=(r?Ge(n.width):n.width)/o,s=(r?Ge(n.height):n.height)/i;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const _t=Qe(0);function zt(e){const t=ue(e);return xe()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:_t}function Ht(e,t,n,o){void 0===t&&(t=!1),void 0===n&&(n=!1);const i=e.getBoundingClientRect(),r=Mt(e);let a=Qe(1);t&&(o?he(o)&&(a=$t(o)):a=$t(e));const s=function(e,t,n){return void 0===t&&(t=!1),!(!n||t&&n!==ue(e))&&t}(r,n,o)?zt(r):Qe(0);let l=(i.left+s.x)/a.x,c=(i.top+s.y)/a.y,u=i.width/a.x,d=i.height/a.y;if(r){const e=ue(r),t=o&&he(o)?ue(o):o;let n=e,i=De(n);for(;i&&o&&t!==n;){const e=$t(i),t=i.getBoundingClientRect(),o=Ie(i),r=t.left+(i.clientLeft+parseFloat(o.paddingLeft))*e.x,a=t.top+(i.clientTop+parseFloat(o.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=ue(i),i=De(n);}}return pt({width:u,height:d,x:l,y:c})}function jt(e,t){const n=Ae(e).scrollLeft;return t?t.left+n:Ht(de(e)).left+n}function Vt(e,t){const n=e.getBoundingClientRect();return {x:n.left+t.scrollLeft-jt(e,n),y:n.top+t.scrollTop}}function Wt(e,t,n){let o;if("viewport"===t)o=function(e,t){const n=ue(e),o=de(e),i=n.visualViewport;let r=o.clientWidth,a=o.clientHeight,s=0,l=0;if(i){r=i.width,a=i.height;const e=xe();(!e||e&&"fixed"===t)&&(s=i.offsetLeft,l=i.offsetTop);}const c=jt(o);if(c<=0){const e=o.ownerDocument,t=e.body,n=getComputedStyle(t),i="CSS1Compat"===e.compatMode&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,a=Math.abs(o.clientWidth-t.clientWidth-i);a<=25&&(r-=a);}else c<=25&&(r+=c);return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)o=function(e){const t=de(e),n=Ae(e),o=e.ownerDocument.body,i=qe(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=qe(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let a=-n.scrollLeft+jt(e);const s=-n.scrollTop;return "rtl"===Ie(o).direction&&(a+=qe(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:a,y:s}}(de(e));else if(he(t))o=function(e,t){const n=Ht(e,!0,"fixed"===t),o=n.top+e.clientTop,i=n.left+e.clientLeft,r=pe(e)?$t(e):Qe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:i*r.x,y:o*r.y}}(t,n);else {const n=zt(e);o={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height};}return pt(o)}function Kt(e,t){const n=Pe(e);return !(n===t||!he(n)||Ne(n))&&("fixed"===Ie(n).position||Kt(n,t))}function Ut(e,t,n){const o=pe(t),i=de(t),r="fixed"===n,a=Ht(e,!0,r,t);let s={scrollLeft:0,scrollTop:0};const l=Qe(0);function c(){l.x=jt(i);}if(o||!o&&!r)if(("body"!==ce(t)||ge(i))&&(s=Ae(t)),o){const e=Ht(t,!0,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else i&&c();r&&!o&&i&&c();const u=!i||o||r?Qe(0):Vt(i,s);return {x:a.left+s.scrollLeft-l.x-u.x,y:a.top+s.scrollTop-l.y-u.y,width:a.width,height:a.height}}function Jt(e){return "static"===Ie(e).position}function qt(e,t){if(!pe(e)||"fixed"===Ie(e).position)return null;if(t)return t(e);let n=e.offsetParent;return de(e)===n&&(n=n.ownerDocument.body),n}function Gt(e,t){const n=ue(e);if(ye(e))return n;if(!pe(e)){let t=Pe(e);for(;t&&!Ne(t);){if(he(t)&&!Jt(t))return t;t=Pe(t);}return n}let o=qt(e,t);for(;o&&ve(o)&&Jt(o);)o=qt(o,t);return o&&Ne(o)&&Jt(o)&&!Se(o)?n:o||function(e){let t=Pe(e);for(;pe(t)&&!Ne(t);){if(Se(t))return t;if(ye(t))return null;t=Pe(t);}return null}(e)||n}const Yt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:o,strategy:i}=e;const r="fixed"===i,a=de(o),s=!!t&&ye(t.floating);if(o===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Qe(1);const u=Qe(0),d=pe(o);if((d||!d&&!r)&&(("body"!==ce(o)||ge(a))&&(l=Ae(o)),d)){const e=Ht(o);c=$t(o),u.x=e.x+o.clientLeft,u.y=e.y+o.clientTop;}const f=!a||d||r?Qe(0):Vt(a,l);return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x+f.x,y:n.y*c.y-l.scrollTop*c.y+u.y+f.y}},getDocumentElement:de,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:o,strategy:i}=e;const r=[..."clippingAncestors"===n?ye(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let o=Te(e,[],!1).filter(e=>he(e)&&"body"!==ce(e)),i=null;const r="fixed"===Ie(e).position;let a=r?Pe(e):e;for(;he(a)&&!Ne(a);){const t=Ie(a),n=Se(a);n||"fixed"!==t.position||(i=null),(r?!n&&!i:!n&&"static"===t.position&&i&&("absolute"===i.position||"fixed"===i.position)||ge(a)&&!n&&Kt(e,a))?o=o.filter(e=>e!==a):i=t,a=Pe(a);}return t.set(e,o),o}(t,this._c):[].concat(n),o],a=Wt(t,r[0],i);let s=a.top,l=a.right,c=a.bottom,u=a.left;for(let e=1;e<r.length;e++){const n=Wt(t,r[e],i);s=qe(n.top,s),l=Je(n.right,l),c=Je(n.bottom,c),u=qe(n.left,u);}return {width:l-u,height:c-s,x:u,y:s}},getOffsetParent:Gt,getElementRects:async function(e){const t=this.getOffsetParent||Gt,n=this.getDimensions,o=await n(e.floating);return {reference:Ut(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=Ot(e);return {width:t,height:n}},getScale:$t,isElement:he,isRTL:function(e){return "rtl"===Ie(e).direction}};function Qt(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Xt(e,t,n,o){void 0===o&&(o={});const{ancestorScroll:i=!0,ancestorResize:r=!0,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=!1}=o,c=Mt(e),u=i||r?[...c?Te(c):[],...t?Te(t):[]]:[];u.forEach(e=>{i&&e.addEventListener("scroll",n,{passive:!0}),r&&e.addEventListener("resize",n);});const d=c&&s?function(e,t){let n,o=null;const i=de(e);function r(){var e;clearTimeout(n),null==(e=o)||e.disconnect(),o=null;}return function a(s,l){void 0===s&&(s=!1),void 0===l&&(l=1),r();const c=e.getBoundingClientRect(),{left:u,top:d,width:f,height:h}=c;if(s||t(),!f||!h)return;const p={rootMargin:-Ye(d)+"px "+-Ye(i.clientWidth-(u+f))+"px "+-Ye(i.clientHeight-(d+h))+"px "+-Ye(u)+"px",threshold:qe(0,Je(1,l))||1};let m=!0;function g(t){const o=t[0].intersectionRatio;if(o!==l){if(!m)return a();o?a(!1,o):n=setTimeout(()=>{a(!1,1e-7);},1e3);}1!==o||Qt(c,e.getBoundingClientRect())||a(),m=!1;}try{o=new IntersectionObserver(g,{...p,root:i.ownerDocument});}catch(e){o=new IntersectionObserver(g,p);}o.observe(e);}(!0),r}(c,n):null;let f,h=-1,p=null;a&&(p=new ResizeObserver(e=>{let[o]=e;o&&o.target===c&&p&&t&&(p.unobserve(t),cancelAnimationFrame(h),h=requestAnimationFrame(()=>{var e;null==(e=p)||e.observe(t);})),n();}),c&&!l&&p.observe(c),t&&p.observe(t));let m=l?Ht(e):null;return l&&function t(){const o=Ht(e);m&&!Qt(m,o)&&n();m=o,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);}),null==d||d(),null==(e=p)||e.disconnect(),p=null,l&&cancelAnimationFrame(f);}}const Zt=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,o;const{x:i,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:o,elements:i}=e,r=await(null==o.isRTL?void 0:o.isRTL(i.floating)),a=tt(n),s=nt(n),l="y"===rt(n),c=Ft.has(a)?-1:1,u=r&&l?-1:1,d=et(t,e);let{mainAxis:f,crossAxis:h,alignmentAxis:p}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&"number"==typeof p&&(h="end"===s?-1*p:p),l?{x:h*u,y:f*c}:{x:f*c,y:h*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(o=s.arrow)&&o.alignmentOffset?{}:{x:i+l.x,y:r+l.y,data:{...l,placement:a}}}}},en=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:i,platform:r}=t,{mainAxis:a=!0,crossAxis:s=!1,limiter:l={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...c}=et(e,t),u={x:n,y:o},d=await r.detectOverflow(t,c),f=rt(tt(i)),h=ot(f);let p=u[h],m=u[f];if(a){const e="y"===h?"bottom":"right";p=Ze(p+d["y"===h?"top":"left"],p,p-d[e]);}if(s){const e="y"===f?"bottom":"right";m=Ze(m+d["y"===f?"top":"left"],m,m-d[e]);}const g=l.fn({...t,[h]:p,[f]:m});return {...g,data:{x:g.x-n,y:g.y-o,enabled:{[h]:a,[f]:s}}}}}},tn=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:i,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:f,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:m=!0,...g}=et(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=tt(i),y=rt(s),w=tt(s)===s,b=await(null==l.isRTL?void 0:l.isRTL(c.floating)),k=f||(w||!m?[ht(s)]:function(e){const t=ht(e);return [st(e),t,st(t)]}(s)),C="none"!==p;!f&&C&&k.push(...ft(s,m,p,b));const S=[s,...k],x=await l.detectOverflow(t,g),N=[];let I=(null==(o=r.flip)?void 0:o.overflows)||[];if(u&&N.push(x[v]),d){const e=function(e,t,n){void 0===n&&(n=!1);const o=nt(e),i=at(e),r=it(i);let a="x"===i?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=ht(a)),[a,ht(a)]}(i,a,b);N.push(x[e[0]],x[e[1]]);}if(I=[...I,{placement:i,overflows:N}],!N.every(e=>e<=0)){var A,P;const e=((null==(A=r.flip)?void 0:A.index)||0)+1,t=S[e];if(t){if(!("alignment"===d&&y!==rt(t))||I.every(e=>rt(e.placement)!==y||e.overflows[0]>0))return {data:{index:e,overflows:I},reset:{placement:t}}}let n=null==(P=I.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:P.placement;if(!n)switch(h){case"bestFit":{var E;const e=null==(E=I.filter(e=>{if(C){const t=rt(e.placement);return t===y||"y"===t}return !0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:E[0];e&&(n=e);break}case"initialPlacement":n=s;}if(i!==n)return {reset:{placement:n}}}return {}}}},nn=(e,t,n)=>{const o=new Map,i={platform:Yt,...n},r={...i.platform,_c:o};return (async(e,t,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:a}=n,s=a.detectOverflow?a:{...a,detectOverflow:Rt},l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=Lt(c,o,l),f=o,h=0;const p={};for(let n=0;n<r.length;n++){const m=r[n];if(!m)continue;const{name:g,fn:v}=m,{x:y,y:w,data:b,reset:k}=await v({x:u,y:d,initialPlacement:o,placement:f,strategy:i,middlewareData:p,rects:c,platform:s,elements:{reference:e,floating:t}});u=null!=y?y:u,d=null!=w?w:d,p[g]={...p[g],...b},k&&h<50&&(h++,"object"==typeof k&&(k.placement&&(f=k.placement),k.rects&&(c=!0===k.rects?await a.getElementRects({reference:e,floating:t,strategy:i}):k.rects),({x:u,y:d}=Lt(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:i,middlewareData:p}})(e,t,{...i,platform:r})};var on="undefined"!=typeof document?reactExports.useLayoutEffect:function(){};function rn(e,t){if(e===t)return !0;if(typeof e!=typeof t)return !1;if("function"==typeof e&&e.toString()===t.toString())return !0;let n,o,i;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return !1;for(o=n;0!==o--;)if(!rn(e[o],t[o]))return !1;return !0}if(i=Object.keys(e),n=i.length,n!==Object.keys(t).length)return !1;for(o=n;0!==o--;)if(!{}.hasOwnProperty.call(t,i[o]))return !1;for(o=n;0!==o--;){const n=i[o];if(("_owner"!==n||!e.$$typeof)&&!rn(e[n],t[n]))return !1}return !0}return e!=e&&t!=t}function an(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function sn(e,t){const n=an(e);return Math.round(t*n)/n}function ln(e){const t=reactExports.useRef(e);return on(()=>{t.current=e;}),t}const cn=(e,t)=>{const n=Zt(e);return {name:n.name,fn:n.fn,options:[e,t]}},un=(e,t)=>{const n=en(e);return {name:n.name,fn:n.fn,options:[e,t]}},dn=(e,t)=>{const n=tn(e);return {name:n.name,fn:n.fn,options:[e,t]}};function fn(e){return reactExports.useMemo(()=>e.every(e=>null==e)?null:t=>{e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);});},e)}const hn={...o},pn=hn.useInsertionEffect||(e=>e());function mn(e){const t=reactExports.useRef(()=>{});return pn(()=>{t.current=e;}),reactExports.useCallback(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return null==t.current?void 0:t.current(...n)},[])}const gn="ArrowUp",vn="ArrowDown",yn="ArrowLeft",wn="ArrowRight";function bn(e,t,n){return Math.floor(e/t)!==n}function kn(e,t){return t<0||t>=e.current.length}function Cn(e,t){return xn(e,{disabledIndices:t})}function Sn(e,t){return xn(e,{decrement:!0,startingIndex:e.current.length,disabledIndices:t})}function xn(e,t){let{startingIndex:n=-1,decrement:o=!1,disabledIndices:i,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=o?-r:r;}while(s>=0&&s<=a.length-1&&An(a,s,i));return s}function Nn(e,t,n,o,i){if(-1===e)return -1;const r=n.indexOf(e),a=t[e];switch(i){case"tl":return r;case"tr":return a?r+a.width-1:r;case"bl":return a?r+(a.height-1)*o:r;case"br":return n.lastIndexOf(e)}}function In(e,t){return t.flatMap((t,n)=>e.includes(t)?[n]:[])}function An(e,t,n){if(n)return n.includes(t);const o=e[t];return null==o||o.hasAttribute("disabled")||"true"===o.getAttribute("aria-disabled")}var Pn="undefined"!=typeof document?reactExports.useLayoutEffect:reactExports.useEffect;function En(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const Tn=reactExports.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function Dn(e){const{children:t,elementsRef:n,labelsRef:i}=e,[r,a]=reactExports.useState(()=>new Map),s=reactExports.useCallback(e=>{a(t=>new Map(t).set(e,null));},[]),l=reactExports.useCallback(e=>{a(t=>{const n=new Map(t);return n.delete(e),n});},[]);return Pn(()=>{const e=new Map(r);Array.from(e.keys()).sort(En).forEach((t,n)=>{e.set(t,n);}),function(e,t){if(e.size!==t.size)return !1;for(const[n,o]of e.entries())if(o!==t.get(n))return !1;return !0}(r,e)||a(e);},[r]),reactExports.createElement(Tn.Provider,{value:reactExports.useMemo(()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:i}),[s,l,r,n,i])},t)}function Bn(e){void 0===e&&(e={});const{label:t}=e,{register:n,unregister:i,map:r,elementsRef:a,labelsRef:s}=reactExports.useContext(Tn),[l,c]=reactExports.useState(null),u=reactExports.useRef(null),d=reactExports.useCallback(e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const o=void 0!==t;s.current[l]=o?t:null!=(n=null==e?void 0:e.textContent)?n:null;}},[l,a,s,t]);return Pn(()=>{const e=u.current;if(e)return n(e),()=>{i(e);}},[n,i]),Pn(()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);},[r]),reactExports.useMemo(()=>({ref:d,index:null==l?-1:l}),[l,d])}function Ln(){return Ln=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e},Ln.apply(this,arguments)}let Rn=!1,Fn=0;const On=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+Fn++;const Mn=hn.useId||function(){const[e,t]=reactExports.useState(()=>Rn?On():void 0);return Pn(()=>{null==e&&t(On());},[]),reactExports.useEffect(()=>{Rn=!0;},[]),e};function zn(){const e=new Map;return {emit(t,n){var o;null==(o=e.get(t))||o.forEach(e=>e(n));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var o;e.set(t,(null==(o=e.get(t))?void 0:o.filter(e=>e!==n))||[]);}}}const Hn=reactExports.createContext(null),jn=reactExports.createContext(null),Vn=()=>{var e;return (null==(e=reactExports.useContext(Hn))?void 0:e.id)||null},Wn=()=>reactExports.useContext(jn);function Kn(e){const{children:t,id:n}=e,i=Vn();return reactExports.createElement(Hn.Provider,{value:reactExports.useMemo(()=>({id:n,parentId:i}),[n,i])},t)}function Un(e){const{children:t}=e,n=reactExports.useRef([]),i=reactExports.useCallback(e=>{n.current=[...n.current,e];},[]),r=reactExports.useCallback(e=>{n.current=n.current.filter(t=>t!==e);},[]),a=reactExports.useState(()=>zn())[0];return reactExports.createElement(jn.Provider,{value:reactExports.useMemo(()=>({nodesRef:n,addNode:i,removeNode:r,events:a}),[i,r,a])},t)}function Jn(e){return "data-floating-ui-"+e}function qn(e){const t=reactExports.useRef(e);return Pn(()=>{t.current=e;}),t}const Gn=Jn("safe-polygon");function Yn(e,t,n){return n&&!ze(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Qn=0;function Xn(e,t){void 0===t&&(t={});const{preventScroll:n=!1,cancelPrevious:o=!0,sync:i=!1}=t;o&&cancelAnimationFrame(Qn);const r=()=>null==e?void 0:e.focus({preventScroll:n});i?r():Qn=requestAnimationFrame(r);}function Zn(e,t){let n=e.filter(e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)}),o=n;for(;o.length;)o=e.filter(e=>{var t;return null==(t=o)?void 0:t.some(t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)})}),n=n.concat(o);return n}let eo=new WeakMap,to=new WeakSet,no={},oo=0;const io=e=>e&&(e.host||io(e.parentNode));function ro(e,t,n,o){const i="data-floating-ui-inert",r=o?"inert":n?"aria-hidden":null,a=((e,t)=>t.map(t=>{if(e.contains(t))return t;const n=io(t);return e.contains(n)?n:null}).filter(e=>null!=e))(t,e),s=new Set,l=new Set(a),c=[];no[i]||(no[i]=new WeakMap);const u=no[i];return a.forEach(function e(t){if(!t||s.has(t))return;s.add(t),t.parentNode&&e(t.parentNode);}),function e(t){if(!t||l.has(t))return;[].forEach.call(t.children,t=>{if("script"!==ce(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,o=(eo.get(t)||0)+1,a=(u.get(t)||0)+1;eo.set(t,o),u.set(t,a),c.push(t),1===o&&n&&to.add(t),1===a&&t.setAttribute(i,""),!n&&r&&t.setAttribute(r,"true");}});}(t),s.clear(),oo++,()=>{c.forEach(e=>{const t=(eo.get(e)||0)-1,n=(u.get(e)||0)-1;eo.set(e,t),u.set(e,n),t||(!to.has(e)&&r&&e.removeAttribute(r),to.delete(e)),n||e.removeAttribute(i);}),oo--,oo||(eo=new WeakMap,eo=new WeakMap,to=new WeakSet,no={});}}function ao(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=!1);const o=He(e[0]).body;return ro(e.concat(Array.from(o.querySelectorAll("[aria-live]"))),o,t,n)}const so=()=>({getShadowRoot:!0,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function lo(e,t){const n=Bt(e,so());"prev"===t&&n.reverse();const o=n.indexOf(Be(He(e)));return n.slice(o+1)[0]}function co(e,t){const n=t||e.currentTarget,o=e.relatedTarget;return !o||!Le(n,o)}const uo={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function fo(e){"Tab"===e.key&&(e.target,clearTimeout(void 0));}const ho=reactExports.forwardRef(function(e,t){const[n,i]=reactExports.useState();Pn(()=>($e()&&i("button"),document.addEventListener("keydown",fo),()=>{document.removeEventListener("keydown",fo);}),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Jn("focus-guard")]:"",style:uo};return reactExports.createElement("span",Ln({},e,r))}),po=reactExports.createContext(null),mo="data-floating-ui-focusable";function go(e){return e?e.hasAttribute(mo)?e:e.querySelector("["+mo+"]")||e:null}let vo=[];function yo(e){vo=vo.filter(e=>e.isConnected);let t=e;if(t&&"body"!==ce(t)){if(!function(e,t){if(t=t||{},!e)throw new Error("No node provided");return !1!==vt.call(e,mt)&&Et(t,e)}(t,so())){const e=Bt(t,so())[0];e&&(t=e);}vo.push(t),vo.length>20&&(vo=vo.slice(-20));}}function wo(){return vo.slice().reverse().find(e=>e.isConnected)}const bo=reactExports.forwardRef(function(e,t){return reactExports.createElement("button",Ln({},e,{type:"button",ref:t,tabIndex:-1,style:uo}))});function ko(e){const{context:t,children:n,disabled:i=!1,order:r=["content"],guards:a=!0,initialFocus:s=0,returnFocus:l=!0,restoreFocus:c=!1,modal:u=!0,visuallyHiddenDismiss:d=!1,closeOnFocusOut:f=!0}=e,{open:h,refs:p,nodeId:m,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:k}}=t,C="number"==typeof s&&s<0,S=Ue(b)&&C,x="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,N=qn(r),I=qn(s),A=qn(l),P=Wn(),E=reactExports.useContext(po),T=reactExports.useRef(null),D=reactExports.useRef(null),B=reactExports.useRef(!1),L=reactExports.useRef(!1),R=reactExports.useRef(-1),F=null!=E,O=go(k),M=mn(function(e){return void 0===e&&(e=O),e?Bt(e,so()):[]}),$=mn(e=>{const t=M(e);return N.current.map(e=>b&&"reference"===e?b:O&&"floating"===e?O:t).filter(Boolean).flat()});function _(e){return !i&&d&&u?reactExports.createElement(bo,{ref:"start"===e?T:D,onClick:e=>g(!1,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}reactExports.useEffect(()=>{if(i)return;if(!u)return;function e(e){if("Tab"===e.key){Le(O,Be(He(O)))&&0===M().length&&!S&&Ke(e);const t=$(),n=Ve(e);"reference"===N.current[0]&&n===b&&(Ke(e),e.shiftKey?Xn(t[t.length-1]):Xn(t[1])),"floating"===N.current[1]&&n===O&&e.shiftKey&&(Ke(e),Xn(t[0]));}}const t=He(O);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}},[i,b,O,u,N,S,M,$]),reactExports.useEffect(()=>{if(!i&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=Ve(e),n=M().indexOf(t);-1!==n&&(R.current=n);}},[i,k,M]),reactExports.useEffect(()=>{if(!i&&f)return k&&pe(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){L.current=!0,setTimeout(()=>{L.current=!1;});}function t(e){const t=e.relatedTarget;queueMicrotask(()=>{const n=!(Le(b,t)||Le(k,t)||Le(t,k)||Le(null==E?void 0:E.portalNode,t)||null!=t&&t.hasAttribute(Jn("focus-guard"))||P&&(Zn(P.nodesRef.current,m).find(e=>{var n,o;return Le(null==(n=e.context)?void 0:n.elements.floating,t)||Le(null==(o=e.context)?void 0:o.elements.domReference,t)})||function(e,t){var n;let o=[],i=null==(n=e.find(e=>e.id===t))?void 0:n.parentId;for(;i;){const t=e.find(e=>e.id===i);i=null==t?void 0:t.parentId,t&&(o=o.concat(t));}return o}(P.nodesRef.current,m).find(e=>{var n,o;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(o=e.context)?void 0:o.elements.domReference)===t})));if(c&&n&&Be(He(O))===He(O).body){pe(O)&&O.focus();const e=R.current,t=M(),n=t[e]||t[t.length-1]||O;pe(n)&&n.focus();}!S&&u||!t||!n||L.current||t===wo()||(B.current=!0,g(!1,e,"focus-out"));});}},[i,b,k,O,u,m,P,E,g,f,c,M,S]),reactExports.useEffect(()=>{var e;if(i)return;const t=Array.from((null==E||null==(e=E.portalNode)?void 0:e.querySelectorAll("["+Jn("portal")+"]"))||[]);if(k){const e=[k,...t,T.current,D.current,N.current.includes("reference")||S?b:null].filter(e=>null!=e),n=u||S?ao(e,x,!x):ao(e);return ()=>{n();}}},[i,b,k,u,N,E,S,x]),Pn(()=>{if(i||!pe(O))return;const e=Be(He(O));queueMicrotask(()=>{const t=$(O),n=I.current,o=("number"==typeof n?t[n]:n.current)||O,i=Le(O,e);C||i||!h||Xn(o,{preventScroll:o===O});});},[i,h,O,C,$,I]),Pn(()=>{if(i||!O)return;let e=!1;const t=He(O),n=Be(t);let o=y.current.openEvent;function r(t){let{open:n,reason:i,event:r,nested:a}=t;n&&(o=r),"escape-key"===i&&p.domReference.current&&yo(p.domReference.current),"hover"===i&&"mouseleave"===r.type&&(B.current=!0),"outside-press"===i&&(a?(B.current=!1,e=!0):B.current=!(Oe(r)||Me(r)));}yo(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,uo),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=Be(t),i=Le(k,n)||P&&Zn(P.nodesRef.current,m).some(e=>{var t;return Le(null==(t=e.context)?void 0:t.elements.floating,n)});(i||o&&["click","mousedown"].includes(o.type))&&p.domReference.current&&yo(p.domReference.current);const s="boolean"==typeof A.current?wo()||a:A.current.current||a;queueMicrotask(()=>{A.current&&!B.current&&pe(s)&&(s===n||n===t.body||i)&&s.focus({preventScroll:e}),a.remove();});}},[i,k,O,A,y,p,v,P,m,F,b]),reactExports.useEffect(()=>{queueMicrotask(()=>{B.current=!1;});},[i]),Pn(()=>{if(!i&&E)return E.setFocusManagerState({modal:u,closeOnFocusOut:f,open:h,onOpenChange:g,refs:p}),()=>{E.setFocusManagerState(null);}},[i,E,u,h,g,p,f]),Pn(()=>{if(i)return;if(!O)return;if("function"!=typeof MutationObserver)return;if(C)return;const e=()=>{const e=O.getAttribute("tabindex"),t=M(),n=Be(He(k)),o=t.indexOf(n);-1!==o&&(R.current=o),N.current.includes("floating")||n!==p.domReference.current&&0===t.length?"0"!==e&&O.setAttribute("tabindex","0"):"-1"!==e&&O.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(O,{childList:!0,subtree:!0,attributes:!0}),()=>{t.disconnect();}},[i,k,O,p,N,M,C]);const z=!i&&x&&(!u||!S)&&(F||u);return reactExports.createElement(reactExports.Fragment,null,z&&reactExports.createElement(ho,{"data-type":"inside",ref:null==E?void 0:E.beforeInsideRef,onFocus:e=>{if(u){const e=$();Xn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=E&&E.preserveTabOrder&&E.portalNode)if(B.current=!1,co(e,E.portalNode)){const e=lo(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=E.beforeOutsideRef.current)||t.focus();}}}),!S&&_("start"),n,_("end"),z&&reactExports.createElement(ho,{"data-type":"inside",ref:null==E?void 0:E.afterInsideRef,onFocus:e=>{if(u)Xn($()[0]);else if(null!=E&&E.preserveTabOrder&&E.portalNode)if(f&&(B.current=!0),co(e,E.portalNode)){const e=lo(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=E.afterOutsideRef.current)||t.focus();}}}))}function Co(e){return pe(e.target)&&"BUTTON"===e.target.tagName}function So(e){return We(e)}const xo={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},No={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},Io=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function Ao(e){const{open:t=!1,onOpenChange:n,elements:i}=e,r=Mn(),a=reactExports.useRef({}),[s]=reactExports.useState(()=>zn()),l=null!=Vn();const[c,u]=reactExports.useState(i.reference),d=mn((e,t,o)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:o,nested:l}),null==n||n(e,t,o);}),f=reactExports.useMemo(()=>({setPositionReference:u}),[]),h=reactExports.useMemo(()=>({reference:c||i.reference||null,floating:i.floating||null,domReference:i.reference}),[c,i.reference,i.floating]);return reactExports.useMemo(()=>({dataRef:a,open:t,onOpenChange:d,elements:h,events:s,floatingId:r,refs:f}),[t,d,h,s,r,f])}function Po(e){void 0===e&&(e={});const{nodeId:t}=e,n=Ao({...e,elements:{reference:null,floating:null,...e.elements}}),i=e.rootContext||n,r=i.elements,[a,s]=reactExports.useState(null),[l,c]=reactExports.useState(null),u=(null==r?void 0:r.domReference)||a,d=reactExports.useRef(null),f=Wn();Pn(()=>{u&&(d.current=u);},[u]);const h=function(e){void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:i=[],platform:r,elements:{reference:a,floating:s}={},transform:l=!0,whileElementsMounted:c,open:u}=e,[d,f]=reactExports.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:!1}),[h,p]=reactExports.useState(i);rn(h,i)||p(i);const[m,g]=reactExports.useState(null),[y,w]=reactExports.useState(null),b=reactExports.useCallback(e=>{e!==x.current&&(x.current=e,g(e));},[]),k=reactExports.useCallback(e=>{e!==N.current&&(N.current=e,w(e));},[]),C=a||m,S=s||y,x=reactExports.useRef(null),N=reactExports.useRef(null),I=reactExports.useRef(d),A=null!=c,P=ln(c),E=ln(r),T=ln(u),D=reactExports.useCallback(()=>{if(!x.current||!N.current)return;const e={placement:t,strategy:n,middleware:h};E.current&&(e.platform=E.current),nn(x.current,N.current,e).then(e=>{const t={...e,isPositioned:!1!==T.current};B.current&&!rn(I.current,t)&&(I.current=t,reactDomExports.flushSync(()=>{f(t);}));});},[h,t,n,E,T]);on(()=>{!1===u&&I.current.isPositioned&&(I.current.isPositioned=!1,f(e=>({...e,isPositioned:!1})));},[u]);const B=reactExports.useRef(!1);on(()=>(B.current=!0,()=>{B.current=!1;}),[]),on(()=>{if(C&&(x.current=C),S&&(N.current=S),C&&S){if(P.current)return P.current(C,S,D);D();}},[C,S,D,P,A]);const L=reactExports.useMemo(()=>({reference:x,floating:N,setReference:b,setFloating:k}),[b,k]),R=reactExports.useMemo(()=>({reference:C,floating:S}),[C,S]),F=reactExports.useMemo(()=>{const e={position:n,left:0,top:0};if(!R.floating)return e;const t=sn(R.floating,d.x),o=sn(R.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+o+"px)",...an(R.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:o}},[n,l,R.floating,d.x,d.y]);return reactExports.useMemo(()=>({...d,update:D,refs:L,elements:R,floatingStyles:F}),[d,D,L,R,F])}({...e,elements:{...r,...l&&{reference:l}}}),p=reactExports.useCallback(e=>{const t=he(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),h.refs.setReference(t);},[h.refs]),m=reactExports.useCallback(e=>{(he(e)||null===e)&&(d.current=e,s(e)),(he(h.refs.reference.current)||null===h.refs.reference.current||null!==e&&!he(e))&&h.refs.setReference(e);},[h.refs]),g=reactExports.useMemo(()=>({...h.refs,setReference:m,setPositionReference:p,domReference:d}),[h.refs,m,p]),y=reactExports.useMemo(()=>({...h.elements,domReference:u}),[h.elements,u]),w=reactExports.useMemo(()=>({...h,...i,refs:g,elements:y,nodeId:t}),[h,g,y,t,i]);return Pn(()=>{i.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find(e=>e.id===t);e&&(e.context=w);}),reactExports.useMemo(()=>({...h,context:w,refs:g,elements:y}),[h,g,y,w])}const Eo="active",To="selected";function Do(e,t,n){const o=new Map,i="item"===n;let r=e;if(i&&e){const{[Eo]:t,[To]:n,...o}=e;r=o;}return {..."floating"===n&&{tabIndex:-1,[mo]:""},...r,...t.map(t=>{const o=t?t[n]:null;return "function"==typeof o?e?o(e):null:o}).concat(e).reduce((e,t)=>t?(Object.entries(t).forEach(t=>{let[n,r]=t;var a;i&&[Eo,To].includes(n)||(0===n.indexOf("on")?(o.has(n)||o.set(n,[]),"function"==typeof r&&(null==(a=o.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,i=new Array(t),r=0;r<t;r++)i[r]=arguments[r];return null==(e=o.get(n))?void 0:e.map(e=>e(...i)).find(e=>void 0!==e)})):e[n]=r);}),e):e,{})}}let Bo=!1;function Lo(e,t,n){switch(e){case"vertical":return t;case"horizontal":return n;default:return t||n}}function Ro(e,t){return Lo(t,e===gn||e===vn,e===yn||e===wn)}function Fo(e,t,n){return Lo(t,e===vn,n?e===yn:e===wn)||"Enter"===e||" "===e||""===e}function Oo(e,t,n){return Lo(t,n?e===wn:e===yn,e===gn)}function Mo(e,t){const{open:n,onOpenChange:i,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=()=>{},enabled:c=!0,selectedIndex:u=null,allowEscape:d=!1,loop:f=!1,nested:h=!1,rtl:p=!1,virtual:m=!1,focusItemOnOpen:g="auto",focusItemOnHover:v=!0,openOnArrowKeyDown:y=!0,disabledIndices:w,orientation:b="vertical",cols:k=1,scrollItemIntoView:C=!0,virtualItemRef:S,itemSizes:x,dense:N=!1}=t;const I=qn(go(r.floating)),A=Vn(),P=Wn(),E=mn(l),T=Ue(r.domReference),D=reactExports.useRef(g),B=reactExports.useRef(null!=u?u:-1),L=reactExports.useRef(null),R=reactExports.useRef(!0),F=reactExports.useRef(E),O=reactExports.useRef(!!r.floating),M=reactExports.useRef(n),$=reactExports.useRef(!1),_=reactExports.useRef(!1),z=qn(w),H=qn(n),j=qn(C),V=qn(u),[W,K]=reactExports.useState(),[U,J]=reactExports.useState(),q=mn(function(e,t,n){function o(e){m?(K(e.id),null==P||P.events.emit("virtualfocus",e),S&&(S.current=e)):Xn(e,{preventScroll:!0,sync:!(!Re().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!$e())&&(Bo||$.current)});}void 0===n&&(n=!1);const i=e.current[t.current];i&&o(i),requestAnimationFrame(()=>{const r=e.current[t.current]||i;if(!r)return;i||o(r);const a=j.current;a&&Y&&(n||!R.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));});});Pn(()=>{document.createElement("div").focus({get preventScroll(){return Bo=!0,!1}});},[]),Pn(()=>{c&&(n&&r.floating?D.current&&null!=u&&(_.current=!0,B.current=u,E(u)):O.current&&(B.current=-1,F.current(null)));},[c,n,r.floating,u,E]),Pn(()=>{if(c&&n&&r.floating)if(null==s){if($.current=!1,null!=V.current)return;if(O.current&&(B.current=-1,q(a,B)),(!M.current||!O.current)&&D.current&&(null!=L.current||!0===D.current&&null==L.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else B.current=null==L.current||Fo(L.current,b,p)||h?Cn(a,z.current):Sn(a,z.current),L.current=null,E(B.current);};t();}}else kn(a,s)||(B.current=s,q(a,B,_.current),_.current=!1);},[c,n,r.floating,s,V,h,a,b,p,E,q,z]),Pn(()=>{var e;if(!c||r.floating||!P||m||!O.current)return;const t=P.nodesRef.current,n=null==(e=t.find(e=>e.id===A))||null==(e=e.context)?void 0:e.elements.floating,o=Be(He(r.floating)),i=t.some(e=>e.context&&Le(e.context.elements.floating,o));n&&!i&&R.current&&n.focus({preventScroll:!0});},[c,r.floating,P,A,m]),Pn(()=>{if(c&&P&&m&&!A)return P.events.on("virtualfocus",e),()=>{P.events.off("virtualfocus",e);};function e(e){J(e.id),S&&(S.current=e);}},[c,P,m,A,S]),Pn(()=>{F.current=E,O.current=!!r.floating;}),Pn(()=>{n||(L.current=null);},[n]),Pn(()=>{M.current=n;},[n]);const G=null!=s,Y=reactExports.useMemo(()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&E(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:!0})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;R.current&&"touch"!==t&&(B.current=-1,q(a,B),E(null),m||Xn(I.current,{preventScroll:!0}));}}}},[n,I,q,v,a,E,m]),Q=mn(e=>{if(R.current=!1,$.current=!0,229===e.which)return;if(!H.current&&e.currentTarget===I.current)return;if(h&&Oo(e.key,b,p))return Ke(e),i(!1,e.nativeEvent,"list-navigation"),void(pe(r.domReference)&&(m?null==P||P.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=B.current,o=Cn(a,w),s=Sn(a,w);if(T||("Home"===e.key&&(Ke(e),B.current=o,E(B.current)),"End"===e.key&&(Ke(e),B.current=s,E(B.current))),k>1){const t=x||Array.from({length:a.current.length},()=>({width:1,height:1})),n=function(e,t,n){const o=[];let i=0;return e.forEach((e,r)=>{let{width:a,height:s}=e;if(a>t&&"production"!=="production")throw new Error("[Floating UI]: Invalid grid - item width at index "+r+" is greater than grid columns");let l=!1;for(n&&(i=0);!l;){const e=[];for(let n=0;n<a;n++)for(let o=0;o<s;o++)e.push(i+n+o*t);i%t+a<=t&&e.every(e=>null==o[e])?(e.forEach(e=>{o[e]=r;}),l=!0):i++;}}),[...o]}(t,k,N),i=n.findIndex(e=>null!=e&&!An(a.current,e,w)),r=n.reduce((e,t,n)=>null==t||An(a.current,t,w)?e:n,-1),l=n[function(e,t){let{event:n,orientation:o,loop:i,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=!1}=t,f=u;if(n.key===gn){if(d&&Ke(n),-1===u)f=c;else if(f=xn(e,{startingIndex:f,amount:a,decrement:!0,disabledIndices:s}),i&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}kn(e,f)&&(f=u);}if(n.key===vn&&(d&&Ke(n),-1===u?f=l:(f=xn(e,{startingIndex:u,amount:a,disabledIndices:s}),i&&u+a>c&&(f=xn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),kn(e,f)&&(f=u)),"both"===o){const t=Ye(u/a);n.key===(r?yn:wn)&&(d&&Ke(n),u%a!==a-1?(f=xn(e,{startingIndex:u,disabledIndices:s}),i&&bn(f,a,t)&&(f=xn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):i&&(f=xn(e,{startingIndex:u-u%a-1,disabledIndices:s})),bn(f,a,t)&&(f=u)),n.key===(r?wn:yn)&&(d&&Ke(n),u%a!==0?(f=xn(e,{startingIndex:u,decrement:!0,disabledIndices:s}),i&&bn(f,a,t)&&(f=xn(e,{startingIndex:u+(a-u%a),decrement:!0,disabledIndices:s}))):i&&(f=xn(e,{startingIndex:u+(a-u%a),decrement:!0,disabledIndices:s})),bn(f,a,t)&&(f=u));const o=Ye(c/a)===t;kn(e,f)&&(f=i&&o?n.key===(r?wn:yn)?c:xn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map(e=>null!=e?a.current[e]:null)},{event:e,orientation:b,loop:f,rtl:p,cols:k,disabledIndices:In([...w||a.current.map((e,t)=>An(a.current,t)?t:void 0),void 0],n),minIndex:i,maxIndex:r,prevIndex:Nn(B.current>s?o:B.current,t,n,k,e.key===vn?"bl":e.key===(p?yn:wn)?"tr":"tl"),stopEvent:!0})];if(null!=l&&(B.current=l,E(B.current)),"both"===b)return}if(Ro(e.key,b)){if(Ke(e),n&&!m&&Be(e.currentTarget.ownerDocument)===e.currentTarget)return B.current=Fo(e.key,b,p)?o:s,void E(B.current);Fo(e.key,b,p)?B.current=f?t>=s?d&&t!==a.current.length?-1:o:xn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,xn(a,{startingIndex:t,disabledIndices:w})):B.current=f?t<=o?d&&-1!==t?a.current.length:s:xn(a,{startingIndex:t,decrement:!0,disabledIndices:w}):Math.max(o,xn(a,{startingIndex:t,decrement:!0,disabledIndices:w})),kn(a,B.current)?E(null):E(B.current);}}),X=reactExports.useMemo(()=>m&&n&&G&&{"aria-activedescendant":U||W},[m,n,G,U,W]),Z=reactExports.useMemo(()=>({"aria-orientation":"both"===b?void 0:b,...!Ue(r.domReference)&&X,onKeyDown:Q,onPointerMove(){R.current=!0;}}),[X,Q,r.domReference,b]),ee=reactExports.useMemo(()=>{function e(e){"auto"===g&&Oe(e.nativeEvent)&&(D.current=!0);}return {...X,onKeyDown(e){R.current=!1;const t=e.key.startsWith("Arrow"),o=["Home","End"].includes(e.key),r=t||o,s=function(e,t,n){return Lo(t,n?e===yn:e===wn,e===vn)}(e.key,b,p),l=Oo(e.key,b,p),c=Ro(e.key,b),d=(h?s:c)||"Enter"===e.key||""===e.key.trim();if(m&&n){const t=null==P?void 0:P.nodesRef.current.find(e=>null==e.parentId),n=P&&t?function(e,t){let n,o=-1;return function t(i,r){r>o&&(n=i,o=r),Zn(e,i).forEach(e=>{t(e.id,r+1);});}(t,0),e.find(e=>e.id===n)}(P.nodesRef.current,t.id):null;if(r&&n&&S){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:!0});if(s||l){var f,g;const o=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,i=l&&!o?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find(e=>(null==e?void 0:e.id)===W):null;i&&(Ke(e),i.dispatchEvent(t),J(void 0));}var v;if((c||o)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ke(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(L.current=h&&c?null:e.key),h?s&&(Ke(e),n?(B.current=Cn(a,z.current),E(B.current)):i(!0,e.nativeEvent,"list-navigation")):c&&(null!=u&&(B.current=u),Ke(e),!n&&y?i(!0,e.nativeEvent,"list-navigation"):Q(e),n&&E(B.current)));},onFocus(){n&&!m&&E(null);},onPointerDown:function(e){D.current=g,"auto"===g&&Me(e.nativeEvent)&&(D.current=!0);},onMouseDown:e,onClick:e}},[W,X,Q,z,g,a,h,E,i,n,y,b,p,u,P,m,S]);return reactExports.useMemo(()=>c?{reference:ee,floating:Z,item:Y}:{},[c,ee,Z,Y])}const $o=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function _o(e,t){const[n,o]=e;let i=!1;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=o!=c>=o&&n<=(l-r)*(o-s)/(c-s)+r&&(i=!i);}return i}function zo(e){void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=!1,requireIntent:o=!0}=e;let i,r=!1,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:h,tree:p}=e;return function(e){function m(){clearTimeout(i),f();}if(clearTimeout(i),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=Ve(e),b="mouseleave"===e.type,k=Le(d.floating,w),C=Le(d.domReference,w),S=d.domReference.getBoundingClientRect(),x=d.floating.getBoundingClientRect(),N=u.split("-")[0],I=n>x.right-x.width/2,A=c>x.bottom-x.height/2,P=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,S),E=x.width>S.width,T=x.height>S.height,D=(E?S:x).left,B=(E?S:x).right,L=(T?S:x).top,R=(T?S:x).bottom;if(k&&(r=!0,!b))return;if(C&&(r=!1),C&&!b)return void(r=!0);if(b&&he(e.relatedTarget)&&Le(d.floating,e.relatedTarget))return;if(p&&Zn(p.nodesRef.current,h).some(e=>{let{context:t}=e;return null==t?void 0:t.open}))return;if("top"===N&&c>=S.bottom-1||"bottom"===N&&c<=S.top+1||"left"===N&&n>=S.right-1||"right"===N&&n<=S.left+1)return m();let F=[];switch(N){case"top":F=[[D,S.top+1],[D,x.bottom-1],[B,x.bottom-1],[B,S.top+1]];break;case"bottom":F=[[D,x.top+1],[D,S.bottom-1],[B,S.bottom-1],[B,x.top+1]];break;case"left":F=[[x.right-1,R],[x.right-1,L],[S.left+1,L],[S.left+1,R]];break;case"right":F=[[S.right-1,R],[S.right-1,L],[x.left+1,L],[x.left+1,R]];}if(!_o([g,v],F)){if(r&&!P)return m();if(!b&&o){const t=function(e,t){const n=performance.now(),o=n-l;if(null===a||null===s||0===o)return a=e,s=t,l=n,null;const i=e-a,r=t-s,c=Math.sqrt(i*i+r*r);return a=e,s=t,l=n,c/o}(e.clientX,e.clientY);if(null!==t&&t<.1)return m()}_o([g,v],function(e){let[n,o]=e;switch(N){case"top":return [[E?n+t/2:I?n+4*t:n-4*t,o+t+1],[E?n-t/2:I?n+4*t:n-4*t,o+t+1],...[[x.left,I||E?x.bottom-t:x.top],[x.right,I?E?x.bottom-t:x.top:x.bottom-t]]];case"bottom":return [[E?n+t/2:I?n+4*t:n-4*t,o-t],[E?n-t/2:I?n+4*t:n-4*t,o-t],...[[x.left,I||E?x.top+t:x.bottom],[x.right,I?E?x.top+t:x.bottom:x.top+t]]];case"left":{const e=[n+t+1,T?o+t/2:A?o+4*t:o-4*t],i=[n+t+1,T?o-t/2:A?o+4*t:o-4*t];return [...[[A||T?x.right-t:x.left,x.top],[A?T?x.right-t:x.left:x.right-t,x.bottom]],e,i]}case"right":return [[n-t,T?o+t/2:A?o+4*t:o-4*t],[n-t,T?o-t/2:A?o+4*t:o-4*t],...[[A||T?x.left+t:x.right,x.top],[A?T?x.left+t:x.right:x.left+t,x.bottom]]]}}([n,c]))?!r&&o&&(i=window.setTimeout(m,40)):m();}}};return c.__options={blockPointerEvents:n},c}const Ho=reactExports.createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:!1,setIsOpen:()=>{}}),jo=reactExports.forwardRef(({className:t,disabled:n,children:o,...i},r)=>{const a=reactExports.useContext(Ho),s=Bn(),c=Wn(),u=s.index===a.activeIndex,d=S("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:fn([s.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,"aria-disabled":n,...i,...a.getItemProps({onClick(e){if(n)return e.preventDefault(),void e.stopPropagation();i.onClick?.(e),a.setIsOpen(!1),c?.events.emit("click");},onFocus(e){n||(i.onFocus?.(e),a.setHasFocusInside(!0));}}),children:o})});jo.displayName="DropdownMenuItem";const Vo=reactExports.forwardRef(({className:n,variant:i="default",icon:r,iconRight:a,text:s="",disabled:h,children:p,...m},g)=>{const[v,y]=reactExports.useState(!1),[w,b]=reactExports.useState(!1),[k,C]=reactExports.useState(null),x=reactExports.useRef([]),N=reactExports.useRef([]),I=reactExports.useContext(Ho),A=Wn(),P=function(){const e=Mn(),t=Wn(),n=Vn();return Pn(()=>{const o={id:e,parentId:n};return null==t||t.addNode(o),()=>{null==t||t.removeNode(o);}},[t,e,n]),e}(),E=Vn(),T=Bn(),D=null!=E,{floatingStyles:B,refs:R,context:F}=Po({nodeId:P,open:v,onOpenChange:y,placement:D?"right-start":"bottom-start",middleware:[cn({mainAxis:D?0:4,alignmentAxis:D?-4:0}),dn(),un()],whileElementsMounted:Xt}),O=function(e,t){void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,events:a,elements:s}=e,{enabled:l=!0,delay:c=0,handleClose:u=null,mouseOnly:d=!1,restMs:f=0,move:h=!0}=t,p=Wn(),m=Vn(),g=qn(u),v=qn(c),y=qn(n),w=reactExports.useRef(),b=reactExports.useRef(-1),k=reactExports.useRef(),C=reactExports.useRef(-1),S=reactExports.useRef(!0),x=reactExports.useRef(!1),N=reactExports.useRef(()=>{}),I=reactExports.useRef(!1),A=reactExports.useCallback(()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[r]);reactExports.useEffect(()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(C.current),S.current=!0,I.current=!1);}},[l,a]),reactExports.useEffect(()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){A()&&i(!1,e,"hover");}const t=He(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}},[s.floating,n,i,l,g,A]);const P=reactExports.useCallback(function(e,t,n){void 0===t&&(t=!0),void 0===n&&(n="hover");const o=Yn(v.current,"close",w.current);o&&!k.current?(clearTimeout(b.current),b.current=window.setTimeout(()=>i(!1,e,n),o)):t&&(clearTimeout(b.current),i(!1,e,n));},[v,i]),E=mn(()=>{N.current(),k.current=void 0;}),T=mn(()=>{if(x.current){const e=He(s.floating).body;e.style.pointerEvents="",e.removeAttribute(Gn),x.current=!1;}}),D=mn(()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type));reactExports.useEffect(()=>{if(l&&he(s.domReference)){var e;const i=s.domReference;return n&&i.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),h&&i.addEventListener("mousemove",t,{once:!0}),i.addEventListener("mouseenter",t),i.addEventListener("mouseleave",o),()=>{var e;n&&i.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),h&&i.removeEventListener("mousemove",t),i.removeEventListener("mouseenter",t),i.removeEventListener("mouseleave",o);}}function t(e){if(clearTimeout(b.current),S.current=!1,d&&!ze(w.current)||f>0&&!Yn(v.current,"open"))return;const t=Yn(v.current,"open",w.current);t?b.current=window.setTimeout(()=>{y.current||i(!0,e,"hover");},t):n||i(!0,e,"hover");}function o(e){if(D())return;N.current();const t=He(s.floating);if(clearTimeout(C.current),I.current=!1,g.current&&r.current.floatingContext){n||clearTimeout(b.current),k.current=g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){T(),E(),D()||P(e,!0,"safe-polygon");}});const o=k.current;return t.addEventListener("mousemove",o),void(N.current=()=>{t.removeEventListener("mousemove",o);})}("touch"!==w.current||!Le(s.floating,e.relatedTarget))&&P(e);}function a(e){D()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){T(),E(),D()||P(e);}})(e));}},[s,l,e,d,f,h,P,E,T,i,n,y,p,v,g,r,D]),Pn(()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&A()){x.current=!0;const e=s.floating;if(he(s.domReference)&&e){var t;const n=He(s.floating).body;n.setAttribute(Gn,"");const o=s.domReference,i=null==p||null==(t=p.nodesRef.current.find(e=>e.id===m))||null==(t=t.context)?void 0:t.elements.floating;return i&&(i.style.pointerEvents=""),n.style.pointerEvents="none",o.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",o.style.pointerEvents="",e.style.pointerEvents="";}}}},[l,n,m,s,p,g,A]),Pn(()=>{n||(w.current=void 0,I.current=!1,E(),T());},[n,E,T]),reactExports.useEffect(()=>()=>{E(),clearTimeout(b.current),clearTimeout(C.current),T();},[l,s.domReference,E,T]);const B=reactExports.useMemo(()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function o(){S.current||y.current||i(!0,t,"hover");}d&&!ze(w.current)||n||0===f||I.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(C.current),"touch"===w.current?o():(I.current=!0,C.current=window.setTimeout(o,f)));}}},[d,i,n,y,f]),L=reactExports.useMemo(()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){D()||P(e.nativeEvent,!1);}}),[P,D]);return reactExports.useMemo(()=>l?{reference:B,floating:L}:{},[l,B,L])}(F,{enabled:D,delay:{open:75},handleClose:zo({blockPointerEvents:!0})}),M=function(e,t){void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,elements:{domReference:a}}=e,{enabled:s=!0,event:l="click",toggle:c=!0,ignoreMouse:u=!1,keyboardHandlers:d=!0,stickIfOpen:f=!0}=t,h=reactExports.useRef(),p=reactExports.useRef(!1),m=reactExports.useMemo(()=>({onPointerDown(e){h.current=e.pointerType;},onMouseDown(e){const t=h.current;0===e.button&&"click"!==l&&(ze(t,!0)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),i(!0,e.nativeEvent,"click")):i(!1,e.nativeEvent,"click")));},onClick(e){const t=h.current;"mousedown"===l&&h.current?h.current=void 0:ze(t,!0)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?i(!0,e.nativeEvent,"click"):i(!1,e.nativeEvent,"click"));},onKeyDown(e){h.current=void 0,e.defaultPrevented||!d||Co(e)||(" "!==e.key||So(a)||(e.preventDefault(),p.current=!0),"Enter"===e.key&&i(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||Co(e)||So(a)||" "===e.key&&p.current&&(p.current=!1,i(!n||!c,e.nativeEvent,"click"));}}),[r,a,l,u,d,i,n,f,c]);return reactExports.useMemo(()=>s?{reference:m}:{},[s,m])}(F,{event:"mousedown",toggle:!D,ignoreMouse:D}),$=function(e,t){var n;void 0===t&&(t={});const{open:i,floatingId:r}=e,{enabled:a=!0,role:s="dialog"}=t,l=null!=(n=$o.get(s))?n:s,c=Mn(),u=null!=Vn(),d=reactExports.useMemo(()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:i?r:void 0}:{"aria-expanded":i?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":i?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}},[l,r,u,i,c,s]),f=reactExports.useMemo(()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}},[l,r,c,s]),h=reactExports.useCallback(e=>{let{active:t,selected:n}=e;const o={role:"option",...t&&{id:r+"-option"}};switch(s){case"select":return {...o,"aria-selected":t&&n};case"combobox":return {...o,...t&&{"aria-selected":!0}}}return {}},[r,s]);return reactExports.useMemo(()=>a?{reference:d,floating:f,item:h}:{},[a,d,f,h])}(F,{role:"menu"}),_=function(e,t){void 0===t&&(t={});const{open:n,onOpenChange:i,elements:r,dataRef:a}=e,{enabled:s=!0,escapeKey:l=!0,outsidePress:c=!0,outsidePressEvent:u="pointerdown",referencePress:d=!1,referencePressEvent:f="pointerdown",ancestorScroll:h=!1,bubbles:p,capture:m}=t,g=Wn(),v=mn("function"==typeof c?c:()=>!1),y="function"==typeof c?v:c,w=reactExports.useRef(!1),b=reactExports.useRef(!1),{escapeKey:k,outsidePress:C}=Io(p),{escapeKey:S,outsidePress:x}=Io(m),N=reactExports.useRef(!1),I=mn(e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(N.current)return;const o=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?Zn(g.nodesRef.current,o):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=!0;if(r.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=!1);}),!e)return}i(!1,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");}),A=mn(e=>{var t;const n=()=>{var t;I(e),null==(t=Ve(e))||t.removeEventListener("keydown",n);};null==(t=Ve(e))||t.addEventListener("keydown",n);}),P=mn(e=>{var t;const n=w.current;w.current=!1;const o=b.current;if(b.current=!1,"click"===u&&o)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=Ve(e),l="["+Jn("inert")+"]",c=He(r.floating).querySelectorAll(l);let d=he(s)?s:null;for(;d&&!Ne(d);){const e=Pe(d);if(Ne(e)||!he(e))break;d=e;}if(c.length&&he(s)&&!s.matches("html,body")&&!Le(s,r.floating)&&Array.from(c).every(e=>!Le(d,e)))return;if(pe(s)&&D){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let o=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===Ie(s).direction&&(o=e.offsetX<=s.offsetWidth-s.clientWidth),o||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,h=g&&Zn(g.nodesRef.current,f).some(t=>{var n;return je(e,null==(n=t.context)?void 0:n.elements.floating)});if(je(e,r.floating)||je(e,r.domReference)||h)return;const p=g?Zn(g.nodesRef.current,f):[];if(p.length>0){let e=!0;if(p.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=!1);}),!e)return}i(!1,e,"outside-press");}),E=mn(e=>{var t;const n=()=>{var t;P(e),null==(t=Ve(e))||t.removeEventListener(u,n);};null==(t=Ve(e))||t.addEventListener(u,n);});reactExports.useEffect(()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=C;let e=-1;function t(e){i(!1,e,"ancestor-scroll");}function o(){window.clearTimeout(e),N.current=!0;}function c(){e=window.setTimeout(()=>{N.current=!1;},xe()?5:0);}const d=He(r.floating);l&&(d.addEventListener("keydown",S?A:I,S),d.addEventListener("compositionstart",o),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,x?E:P,x);let f=[];return h&&(he(r.domReference)&&(f=Te(r.domReference)),he(r.floating)&&(f=f.concat(Te(r.floating))),!he(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(Te(r.reference.contextElement)))),f=f.filter(e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)}),f.forEach(e=>{e.addEventListener("scroll",t,{passive:!0});}),()=>{l&&(d.removeEventListener("keydown",S?A:I,S),d.removeEventListener("compositionstart",o),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,x?E:P,x),f.forEach(e=>{e.removeEventListener("scroll",t);}),window.clearTimeout(e);}},[a,r,l,y,u,n,i,h,s,k,C,I,S,A,P,x,E]),reactExports.useEffect(()=>{w.current=!1;},[y,u]);const T=reactExports.useMemo(()=>({onKeyDown:I,[xo[f]]:e=>{d&&i(!1,e.nativeEvent,"reference-press");}}),[I,i,d,f]),D=reactExports.useMemo(()=>({onKeyDown:I,onMouseDown(){b.current=!0;},onMouseUp(){b.current=!0;},[No[u]]:()=>{w.current=!0;}}),[I,u]);return reactExports.useMemo(()=>s?{reference:T,floating:D}:{},[s,T,D])}(F,{bubbles:!0}),z=Mo(F,{listRef:x,activeIndex:k,nested:D,onNavigate:C}),{getReferenceProps:H,getFloatingProps:j,getItemProps:V}=function(e){void 0===e&&(e=[]);const t=e.map(e=>null==e?void 0:e.reference),n=e.map(e=>null==e?void 0:e.floating),i=e.map(e=>null==e?void 0:e.item),r=reactExports.useCallback(t=>Do(t,e,"reference"),t),a=reactExports.useCallback(t=>Do(t,e,"floating"),n),s=reactExports.useCallback(t=>Do(t,e,"item"),i);return reactExports.useMemo(()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s}),[r,a,s])}([O,M,$,_,z]);reactExports.useEffect(()=>{if(A)return A.events.on("click",e),A.events.on("menuopen",t),()=>{A.events.off("click",e),A.events.off("menuopen",t);};function e(){y(!1);}function t(e){e.nodeId!==P&&e.parentId===E&&y(!1);}},[A,P,E]),reactExports.useEffect(()=>{v&&A&&A.events.emit("menuopen",{parentId:E,nodeId:P});},[A,v,P,E]);const W={activeIndex:k,setActiveIndex:C,getItemProps:V,setHasFocusInside:b,isOpen:v,setIsOpen:y},K=reactExports.useMemo(()=>W,[k,C,V,b,v]),U=S("io-dropdown-menu-button",D&&"io-dropdown-menu-item",v&&!D&&"active",n),J=fn([R.setReference,T.ref,g]),q=I.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(Kn,{id:P,children:[jsxRuntimeExports.jsx(L,{className:U,ref:J,variant:D?"link":i,tabIndex:D?q:void 0,role:D?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":D?"":void 0,"data-focus-inside":w?"":void 0,text:s,icon:D?"chevron-right":r,iconSize:"10",iconRight:!!D||a,disabled:h,...H(I.getItemProps({onFocus(e){m.onFocus?.(e),b(!1),I.setHasFocusInside(!0);},...m}))}),jsxRuntimeExports.jsx(Ho.Provider,{value:K,children:jsxRuntimeExports.jsx(Dn,{elementsRef:x,labelsRef:N,children:v&&jsxRuntimeExports.jsx(ko,{context:F,modal:!1,initialFocus:D?-1:0,returnFocus:!D,children:jsxRuntimeExports.jsx("div",{ref:R.setFloating,className:"io-dropdown-menu",style:B,...j(),children:p})})})})]})});Vo.displayName="DropdownMenu";const Wo=reactExports.forwardRef(({...t},n)=>null===Vn()?jsxRuntimeExports.jsx(Un,{children:jsxRuntimeExports.jsx(Vo,{ref:n,...t})}):jsxRuntimeExports.jsx(Vo,{ref:n,...t}));function Ko({className:t,variant:n="default",size:o="16",src:i,alt:r,...a}){const s=S("io-image-icon","grayscale"===n&&[`io-image-icon-${n}`],o&&[`io-image-icon-${o}`],t);return jsxRuntimeExports.jsx("img",{className:s,style:{width:`${o}px`,filter:"grayscale"===n?"grayscale(100%)":"none"},src:i,alt:r,...a})}function Uo({className:n,size:o="large",variant:i="default",align:r="up",text:a,...s}){const l=S("io-loader",{[`io-loader-${i}`]:"default"!==i},"normal"===o&&"io-loader-md","small"===o&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,role:"status","aria-live":"polite",...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Jo({className:t,children:n,...o}){const i=S("io-panel-header",t);return jsxRuntimeExports.jsx(ne,{className:i,...o,children:n})}Wo.displayName="DropdownMenu",Wo.Item=jo,Wo.Separator=W,Jo.Title=E,Jo.ButtonGroup=te,Jo.Button=L,Jo.ButtonIcon=N,Jo.Dropdown=ee;const qo=reactExports.forwardRef(({className:t,children:n,...o},i)=>{const r=S("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:i,"data-testid":"panel-body",...o,children:n})});function Go({className:t,...n}){const o=S("io-panel-footer",t);return jsxRuntimeExports.jsx(re,{className:o,...n})}function Yo({className:t,children:n,...o}){const i=S("io-panel",t);return jsxRuntimeExports.jsx("div",{className:i,"data-testid":"panel",...o,children:n})}function Qo({className:t,variant:n="default",children:o,...i}){const r=S("io-pill","default"!==n&&[`io-pill-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,role:"status",...i,children:o})}function Xo({className:t,variant:n="active",value:o=0,...i}){const r=S("io-progress",n,t);let a;return a=o<0?0:o>100?100:o,jsxRuntimeExports.jsx("div",{className:r,role:"progressbar","aria-valuenow":a,"aria-valuemin":0,"aria-valuemax":100,...i,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${a}%`}})})}
    /*!
     * OverlayScrollbars
     * Version: 2.14.0
     *
     * Copyright (c) Rene Haas | KingSora.
     * https://github.com/KingSora
     *
     * Released under the MIT license.
     */qo.displayName="PanelBody",Go.ButtonGroup=te,Go.Button=L,Go.ButtonIcon=N,Go.Dropdown=ee,Yo.Header=Jo,Yo.Body=qo,Yo.Footer=Go,Qo.Icon=x;const Zo=(e,t)=>{const{o:n,i:o,u:i}=e;let r,a=n;const s=(e,t)=>{const n=a,s=e,l=t||(o?!o(n,s):n!==s);return (l||i)&&(a=s,r=n),[a,l,r]};return [t?e=>s(t(a,r),e):s,e=>[a,!!e,r]]},ei="undefined"!=typeof window&&"undefined"!=typeof HTMLElement&&!!window.document?window:{},ti=Math.max,ni=Math.min,oi=Math.round,ii=Math.abs,ri=Math.sign,ai=ei.cancelAnimationFrame,si=ei.requestAnimationFrame,li=ei.setTimeout,ci=ei.clearTimeout,ui=e=>void 0!==ei[e]?ei[e]:void 0,di=ui("MutationObserver"),fi=ui("IntersectionObserver"),hi=ui("ResizeObserver"),pi=ui("ScrollTimeline"),mi=e=>void 0===e,gi=e=>null===e,vi=e=>"number"==typeof e,yi=e=>"string"==typeof e,wi=e=>"boolean"==typeof e,bi=e=>"function"==typeof e,ki=e=>Array.isArray(e),Ci=e=>"object"==typeof e&&!ki(e)&&!gi(e),Si=e=>{const t=!!e&&e.length,n=vi(t)&&t>-1&&t%1==0;return !!(ki(e)||!bi(e)&&n)&&(!(t>0&&Ci(e))||t-1 in e)},xi=e=>!!e&&e.constructor===Object,Ni=e=>e instanceof HTMLElement,Ii=e=>e instanceof Element;function Ai(e,t){if(Si(e))for(let n=0;n<e.length&&!1!==t(e[n],n,e);n++);else e&&Ai(Object.keys(e),n=>t(e[n],n,e));return e}const Pi=(e,t)=>e.indexOf(t)>=0,Ei=(e,t)=>e.concat(t),Ti=(e,t,n)=>(!yi(t)&&Si(t)?Array.prototype.push.apply(e,t):e.push(t),e),Di=e=>Array.from(e||[]),Bi=e=>ki(e)?e:!yi(e)&&Si(e)?Di(e):[e],Li=e=>!!e&&!e.length,Ri=e=>Di(new Set(e)),Fi=(e,t,n)=>{Ai(e,e=>!e||e.apply(void 0,t||[])),n||(e.length=0);},Oi="paddingTop",Mi="paddingRight",$i="paddingLeft",_i="paddingBottom",zi="marginLeft",Hi="marginRight",ji="marginBottom",Vi="overflowX",Wi="overflowY",Ki="width",Ui="height",Ji="visible",qi="hidden",Gi="scroll",Yi=(e,t,n,o)=>{if(e&&t){let o=!0;return Ai(n,n=>{e[n]!==t[n]&&(o=!1);}),o}return !1},Qi=(e,t)=>Yi(e,t,["w","h"]),Xi=(e,t)=>Yi(e,t,["x","y"]),Zi=(e,t)=>Yi(e,t,["t","r","b","l"]),er=(e,...t)=>e.bind(0,...t),tr=e=>{let t;const n=e?li:si,o=e?ci:ai;return [i=>{o(t),t=n(()=>i(),bi(e)?e():e);},()=>o(t)]},nr=e=>{const t=bi(e)?e():e;if(vi(t)){const e=t?li:si,n=t?ci:ai;return o=>{const i=e(()=>o(),t);return ()=>{n(i);}}}return t&&t._},or=(e,t)=>{const{p:n,v:o,S:i,m:r}=t||{};let a,s,l,c;const u=function(t){s&&s(),a&&a(),c=s=a=l=void 0,e.apply(this,t);},d=e=>r&&l?r(l,e):e,f=()=>{s&&l&&u(d(l)||l);},h=function(){const e=Di(arguments),t=nr(n);if(t){const n="function"==typeof i?i():i,r=nr(o),h=d(e)||e,p=u.bind(0,h);s&&s(),n&&!c?(p(),c=!0,s=t(()=>c=void 0)):(s=t(p),r&&!a&&(a=r(f))),l=h;}else u(e);};return h.O=f,h},ir=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),rr=e=>e?Object.keys(e):[],ar=(e,t,n,o,i,r,a)=>{const s=[t,n,o,i,r,a];return "object"==typeof e&&!gi(e)||bi(e)||(e={}),Ai(s,t=>{Ai(t,(n,o)=>{const i=t[o];if(e===i)return !0;const r=ki(i);if(i&&xi(i)){const t=e[o];let n=t;r&&!ki(t)?n=[]:r||xi(t)||(n={}),e[o]=ar(n,i);}else e[o]=r?i.slice():i;});}),e},sr=(e,t)=>Ai(ar({},e),(e,t,n)=>{void 0===e?delete n[t]:e&&xi(e)&&(n[t]=sr(e));}),lr=e=>!rr(e).length,cr=()=>{},ur=(e,t,n)=>ti(e,ni(t,n)),dr=e=>Ri((ki(e)?e:(e||"").split(" ")).filter(e=>e)),fr=(e,t)=>e&&e.getAttribute(t),hr=(e,t)=>e&&e.hasAttribute(t),pr=(e,t,n)=>{Ai(dr(t),t=>{e&&e.setAttribute(t,String(n||""));});},mr=(e,t)=>{Ai(dr(t),t=>e&&e.removeAttribute(t));},gr=(e,t)=>{const n=dr(fr(e,t)),o=er(pr,e,t),i=(e,t)=>{const o=new Set(n);return Ai(dr(e),e=>{o[t](e);}),Di(o).join(" ")};return {C:e=>o(i(e,"delete")),$:e=>o(i(e,"add")),H:e=>{const t=dr(e);return t.reduce((e,t)=>e&&n.includes(t),t.length>0)}}},vr=(e,t,n)=>(gr(e,t).C(n),er(yr,e,t,n)),yr=(e,t,n)=>(gr(e,t).$(n),er(vr,e,t,n)),wr=(e,t,n,o)=>(o?yr:vr)(e,t,n),br=(e,t,n)=>gr(e,t).H(n),kr=e=>gr(e,"class"),Cr=(e,t)=>{kr(e).C(t);},Sr=(e,t)=>(kr(e).$(t),er(Cr,e,t)),xr=(e,t)=>{const n=t?Ii(t)&&t:document;return n?Di(n.querySelectorAll(e)):[]},Nr=(e,t)=>Ii(e)&&e.matches(t),Ir=e=>Nr(e,"body"),Ar=e=>e?Di(e.childNodes):[],Pr=e=>e&&e.parentElement,Er=(e,t)=>Ii(e)&&e.closest(t),Tr=e=>document.activeElement,Dr=(e,t,n)=>{const o=Er(e,t),i=e&&((e,t)=>{const n=t?Ii(t)&&t:document;return n&&n.querySelector(e)})(n,o),r=Er(i,t)===o;return !(!o||!i)&&(o===e||i===e||r&&Er(Er(e,n),t)!==o)},Br=e=>{Ai(Bi(e),e=>{const t=Pr(e);e&&t&&t.removeChild(e);});},Lr=(e,t)=>er(Br,e&&t&&Ai(Bi(t),t=>{t&&e.appendChild(t);}));let Rr;const Fr=e=>{const t=document.createElement("div");return pr(t,"class",e),t},Or=e=>{const t=Fr(),n=Rr,o=e.trim();return t.innerHTML=n?n.createHTML(o):o,Ai(Ar(t),e=>Br(e))},Mr=(e,t)=>e.getPropertyValue(t)||e[t]||"",$r=e=>{const t=e||0;return isFinite(t)?t:0},_r=e=>$r(parseFloat(e||"")),zr=e=>Math.round(1e4*e)/1e4,Hr=e=>`${zr($r(e))}px`;function jr(e,t){e&&t&&Ai(t,(t,n)=>{try{const o=e.style,i=gi(t)||wi(t)?"":vi(t)?Hr(t):t;0===n.indexOf("--")?o.setProperty(n,i):o[n]=i;}catch(e){}});}function Vr(e,t,n){const o=yi(t);let i=o?"":{};if(e){const r=ei.getComputedStyle(e,n)||e.style;i=o?Mr(r,t):Di(t).reduce((e,t)=>(e[t]=Mr(r,t),e),i);}return i}const Wr=(e,t,n)=>{const o=t?`${t}-`:"",i=n?`-${n}`:"",r=`${o}top${i}`,a=`${o}right${i}`,s=`${o}bottom${i}`,l=`${o}left${i}`,c=Vr(e,[r,a,s,l]);return {t:_r(c[r]),r:_r(c[a]),b:_r(c[s]),l:_r(c[l])}},Kr=(e,t)=>"translate"+(Ci(e)?`(${e.x},${e.y})`:`${t?"X":"Y"}(${e})`),Ur={w:0,h:0},Jr=(e,t)=>t?{w:t[`${e}Width`],h:t[`${e}Height`]}:Ur,qr=e=>Jr("inner",e||ei),Gr=er(Jr,"offset"),Yr=er(Jr,"client"),Qr=er(Jr,"scroll"),Xr=e=>{const t=parseFloat(Vr(e,Ki))||0,n=parseFloat(Vr(e,Ui))||0;return {w:t-oi(t),h:n-oi(n)}},Zr=e=>e.getBoundingClientRect(),ea=e=>!(!e||!e[Ui]&&!e[Ki]),ta=(e,t)=>{const n=ea(e);return !ea(t)&&n},na=(e,t,n,o)=>{Ai(dr(t),t=>{e&&e.removeEventListener(t,n,o);});},oa=(e,t,n,o)=>{var i;const r=null==(i=o&&o.I)||i,a=o&&o.A||!1,s=o&&o.T||!1,l={passive:r,capture:a};return er(Fi,dr(t).map(t=>{const o=s?i=>{na(e,t,o,a),n&&n(i);}:n;return e&&e.addEventListener(t,o,l),er(na,e,t,o,a)}))},ia=e=>e.stopPropagation(),ra=e=>e.preventDefault(),aa=e=>ia(e)||ra(e),sa=(e,t)=>{const{x:n,y:o}=vi(t)?{x:t,y:t}:t||{};vi(n)&&(e.scrollLeft=n),vi(o)&&(e.scrollTop=o);},la=e=>({x:e.scrollLeft,y:e.scrollTop}),ca=(e,t)=>{const{D:n,M:o}=e,{w:i,h:r}=t,a=(e,t,n)=>{let o=ri(e)*n,i=ri(t)*n;if(o===i){const n=ii(e),r=ii(t);i=n>r?0:i,o=n<r?0:o;}return o=o===i?0:o,[o+0,i+0]},[s,l]=a(n.x,o.x,i),[c,u]=a(n.y,o.y,r);return {D:{x:s,y:c},M:{x:l,y:u}}},ua=({D:e,M:t})=>{const n=(e,t)=>0===e&&e<=t;return {x:n(e.x,t.x),y:n(e.y,t.y)}},da=({D:e,M:t},n)=>{const o=(e,t,n)=>ur(0,1,(e-n)/(e-t)||0);return {x:o(e.x,t.x,n.x),y:o(e.y,t.y,n.y)}},fa=e=>{e&&e.focus&&e.focus({preventScroll:!0,focusVisible:!1});},ha=(e,t)=>{Ai(Bi(t),e);},pa=e=>{const t=new Map,n=(e,n)=>{if(e){const o=t.get(e);ha(e=>{o&&o[e?"delete":"clear"](e);},n);}else t.forEach(e=>{e.clear();}),t.clear();},o=(e,i)=>{if(yi(e)){const o=t.get(e)||new Set;return t.set(e,o),ha(e=>{bi(e)&&o.add(e);},i),er(n,e,i)}wi(i)&&i&&n();const r=rr(e),a=[];return Ai(r,t=>{const n=e[t];n&&Ti(a,o(t,n));}),er(Fi,a)};return o(e||{}),[o,n,(e,n)=>{Ai(Di(t.get(e)),e=>{n&&!Li(n)?e.apply(0,n):e();});}]},ma={},ga={},va=(e,t,n)=>rr(e).map(o=>{const{static:i,instance:r}=e[o],[a,s,l]=n||[],c=n?r:i;if(c){const e=n?c(a,s,t):c(t);return (l||ga)[o]=e}}),ya=e=>ga[e],wa="data-overlayscrollbars",ba="os-environment",ka=`${ba}-scrollbar-hidden`,Ca=`${wa}-initialize`,Sa="noClipping",xa=`${wa}-body`,Na=wa,Ia=`${wa}-viewport`,Aa=Vi,Pa=Wi,Ea="measuring",Ta="scrollbarHidden",Da=`${wa}-padding`,Ba=`${wa}-content`,La="os-size-observer",Ra=`${La}-appear`,Fa=`${La}-listener`,Oa="os-scrollbar",Ma=`${Oa}-rtl`,$a=`${Oa}-horizontal`,_a=`${Oa}-vertical`,za=`${Oa}-track`,Ha=`${Oa}-handle`,ja=`${Oa}-visible`,Va=`${Oa}-cornerless`,Wa=`${Oa}-interaction`,Ka=`${Oa}-unusable`,Ua=`${Oa}-auto-hide`,Ja=`${Ua}-hidden`,qa=`${Oa}-wheel`,Ga=`${za}-interactive`,Ya=`${Ha}-interactive`,Qa=e=>0===e.indexOf(Ji),Xa=(e,t)=>{if("auto"===e)return t?Gi:qi;const n=e||qi;return [qi,Gi,Ji].includes(n)?n:qi},Za=(e,t)=>{const{overflowX:n,overflowY:o}=Vr(e,[Vi,Wi]);return {x:Xa(n,t.x),y:Xa(o,t.y)}},es="__osScrollbarsHidingPlugin",ts=e=>JSON.stringify(e,(e,t)=>{if(bi(t))throw 0;return t}),ns=(e,t)=>e?`${t}`.split(".").reduce((e,t)=>e&&ir(e,t)?e[t]:void 0,e):void 0,os=[33,99],is=[222,666,!0],rs={paddingAbsolute:!1,showNativeOverlaidScrollbars:!1,update:{elementEvents:[["img","load"]],debounce:{mutation:[0,33],resize:null,event:os,env:is},attributes:null,ignoreMutation:null,flowDirectionStyles:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:!1,dragScroll:!0,clickScroll:!1,pointers:["mouse","touch","pen"]}},as=(e,t)=>{const n={};return Ai(Ei(rr(t),rr(e)),o=>{const i=e[o],r=t[o];if(Ci(i)&&Ci(r))ar(n[o]={},as(i,r)),lr(n[o])&&delete n[o];else if(ir(t,o)&&r!==i){let e=!0;if(ki(i)||ki(r))try{ts(i)===ts(r)&&(e=!1);}catch(e){}e&&(n[o]=r);}}),n},ss=(e,t,n)=>o=>[ns(e,o),n||void 0!==ns(t,o)];let ls;let cs;const us=()=>{const e=(e,t,n)=>{Lr(document.body,e),Lr(document.body,e);const o=Yr(e),i=Gr(e),r=Xr(t);return n&&Br(e),{x:i.h-o.h+r.h,y:i.w-o.w+r.w}},t=Or(`<div class="${ba}"><div></div><style>${`.${ba}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${ba} div{width:200%;height:200%;margin:10px 0}.${ka}{scrollbar-width:none!important}.${ka}::-webkit-scrollbar,.${ka}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`}</style></div>`)[0],n=t.firstChild,o=t.lastChild,i=ls;i&&(o.nonce=i);const[r,,a]=pa(),[s,l]=Zo({o:e(t,n),i:Xi},er(e,t,n,!0)),[c]=l(),u=(e=>{let t=!1;const n=Sr(e,ka);try{t="none"===Vr(e,"scrollbar-width")||"none"===Vr(e,"display","::-webkit-scrollbar");}catch(e){}return n(),t})(t),d={x:0===c.x,y:0===c.y},f={elements:{host:null,padding:!u,viewport:e=>u&&Ir(e)&&e,content:!1},scrollbars:{slot:!0},cancel:{nativeScrollbarsOverlaid:!1,body:null}},h=ar({},rs),p=er(ar,{},h),m=er(ar,{},f),g={P:c,k:d,U:u,J:!!pi,G:er(r,"r"),K:m,Z:e=>ar(f,e)&&m(),tt:p,nt:e=>ar(h,e)&&p(),ot:ar({},f),st:ar({},h)};if(mr(t,"style"),Br(t),oa(ei,"resize",()=>{a("r",[]);}),bi(ei.matchMedia)&&!u&&(!d.x||!d.y)){const e=t=>{const n=ei.matchMedia(`(resolution: ${ei.devicePixelRatio}dppx)`);oa(n,"change",()=>{t(),e(t);},{T:!0});};e(()=>{const[e,t]=s();ar(g.P,e),a("r",[t]);});}return g},ds=()=>(cs||(cs=us()),cs),fs=(e,t,n,o)=>{let i=!1;const{et:r,ct:a,rt:s,it:l,lt:c,ut:u}=o||{},[d,f]=((e,t,n)=>{let o=!1;const i=!!n&&new WeakMap,r=r=>{if(i&&n){const a=n.map(t=>{const[n,o]=t||[];return [o&&n?(r||xr)(n,e):[],o]});Ai(a,n=>Ai(n[0],r=>{const a=n[1],s=i.get(r)||[];if(e.contains(r)&&a){const e=oa(r,a,n=>{o?(e(),i.delete(r)):t(n);});i.set(r,Ti(s,e));}else Fi(s),i.delete(r);}));}};return r(),[()=>{o=!0;},r]})(e,()=>i&&n(!0),s),h=a||[],p=Ei(r||[],h),m=(i,r)=>{if(!Li(r)){const a=c||cr,s=u||cr,d=[],p=[];let m=!1,g=!1;if(Ai(r,n=>{const{attributeName:i,target:r,type:c,oldValue:u,addedNodes:f,removedNodes:v}=n,y="attributes"===c,w="childList"===c,b=e===r,k=y&&i,C=k&&fr(r,i||""),S=yi(C)?C:null,x=k&&u!==S,N=Pi(h,i)&&x;if(t&&(w||!b)){const t=y&&x,c=t&&l&&Nr(r,l),h=(c?!a(r,i,u,S):!y||t)&&!s(n,!!c,e,o);Ai(f,e=>Ti(d,e)),Ai(v,e=>Ti(d,e)),g=g||h;}!t&&b&&x&&!a(r,i,u,S)&&(Ti(p,i),m=m||N);}),f(e=>Ri(d).reduce((t,n)=>(Ti(t,xr(e,n)),Nr(n,e)?Ti(t,n):t),[])),t)return !i&&g&&n(!1),[!1];if(!Li(p)||m){const e=[Ri(p),m];return i||n.apply(0,e),e}}},g=new di(er(m,!1));return [()=>(g.observe(e,{attributes:!0,attributeOldValue:!0,attributeFilter:p,subtree:t,childList:t,characterData:t}),i=!0,()=>{i&&(d(),g.disconnect(),i=!1);}),()=>{if(i)return m(!0,g.takeRecords())}]};let hs=null;const ps=(e,t,n)=>{const{ft:o}=n||{},i=ya("__osSizeObserverPlugin"),[r]=Zo({o:!1,u:!0});return ()=>{const n=[],a=Or(`<div class="${La}"><div class="${Fa}"></div></div>`)[0],s=a.firstChild,l=e=>{let n=!1,o=!1;if(ki(e)&&!Li(e)){const t=e[0],[i,,a]=r(t.contentRect),s=ea(i);o=ta(i,a),n=!o&&!s;}else o=!0===e;n||t({_t:!0,ft:o});};if(hi){if(!wi(hs)){const t=new hi(cr);t.observe(e,{get box(){hs=!0;}}),hs=hs||!1,t.disconnect();}const t=or(l,{p:0,v:0}),o=e=>t(e),i=new hi(o);if(i.observe(hs?e:s),Ti(n,[()=>{i.disconnect();},!hs&&Lr(e,a)]),hs){const t=new hi(o);t.observe(e,{box:"border-box"}),Ti(n,()=>t.disconnect());}}else {if(!i)return cr;{const[t,r]=i(s,l,o);Ti(n,Ei([Sr(a,Ra),oa(a,"animationstart",t),Lr(e,a)],r));}}return er(Fi,n)}},ms=(e,t)=>{let n;const o=Fr("os-trinsic-observer"),[i]=Zo({o:!1}),r=(e,n)=>{if(e){const o=i((e=>0===e.h||e.isIntersecting||e.intersectionRatio>0)(e)),[,r]=o;return r&&!n&&t(o)&&[o]}},a=(e,t)=>r(t.pop(),e);return [()=>{const t=[];if(fi)n=new fi(er(a,!1),{root:e}),n.observe(o),Ti(t,()=>{n.disconnect();});else {const e=()=>{const e=Gr(o);r(e);};Ti(t,ps(o,e)()),e();}return er(Fi,Ti(t,Lr(e,o)))},()=>n&&a(!0,n.takeRecords())]},gs=(e,t,n,o)=>{let i,r,a,s,l,c,u,d;const f=`[${Na}]`,h=`[${Ia}]`,p=["id","class","style","open","wrap","cols","rows"],{dt:m,vt:g,L:v,gt:y,ht:w,V:b,bt:k,wt:C,yt:S,St:x}=e,N=e=>"rtl"===Vr(e,"direction"),I={Ot:!1,B:N(m)},A=ds(),P=ya(es),[E]=Zo({i:Qi,o:{w:0,h:0}},()=>{const o=P&&P.R(e,t,I,A,n).Y,i=!(k&&b)&&br(g,Na,Sa),r=!b&&C("arrange"),a=r&&la(y),s=a&&x(),l=S(Ea,i),c=r&&o&&o(),u=Qr(v),d=Xr(v);return c&&c(),sa(y,a),s&&s(),i&&l(),{w:u.w+d.w,h:u.h+d.h}}),T=(()=>{let e,t,n;const i=or(o,{p:()=>e,v:()=>t,S:()=>n,m(e,t){const[n]=e,[o]=t;return [Ei(rr(n),rr(o)).reduce((e,t)=>(e[t]=n[t]||o[t],e),{})]}}),r=(o,r)=>{if(ki(r)){const[o,i,a]=r;e=o,t=i,n=a;}else vi(r)?(e=r,t=!1,n=!1):(e=!1,t=!1,n=!1);i(o);};return r.O=i.O,r})(),D=e=>{const t=N(m);ar(e,{Ct:d!==t}),ar(I,{B:t}),d=t;},B=(e,t)=>{const[n,i]=e,r={$t:i};return ar(I,{Ot:n}),t||o(r),r},L=({_t:e,ft:t})=>{const n=t?o:T,i={_t:e||t,ft:t};D(i),n(i,r);},R=(e,t)=>{const[,n]=E(),o={xt:n};return D(o),n&&!t&&T(o,e?a:i),o},F=(e,t,n)=>{const o={Ht:t};return D(o),t&&!n&&T(o,i),o},[O,M]=w?ms(g,B):[],$=!b&&ps(g,L,{ft:!0}),[_,z]=fs(g,!1,F,{ct:p,et:p}),H=b&&hi&&new hi(e=>{const t=e[e.length-1].contentRect;L({_t:!0,ft:ta(t,u)}),u=t;});return [()=>{H&&H.observe(g);const e=$&&$(),t=O&&O(),n=_(),o=A.G(e=>{const[,t]=E();T({Et:e,xt:t,_t:k},s);});return ()=>{H&&H.disconnect(),e&&e(),t&&t(),c&&c(),n(),o();}},({zt:e,It:t,At:n})=>{const o={},[u]=e("update.ignoreMutation"),[d,m]=e("update.attributes"),[g,y]=e("update.elementEvents"),[k,C]=e("update.debounce"),S=t||n;if(y||m){l&&l(),c&&c();const[e,t]=fs(w||v,!0,R,{et:Ei(p,d||[]),rt:g,it:f,ut:(e,t)=>{const{target:n,attributeName:o}=e;return !(t||!o||b)&&Dr(n,f,h)||!!Er(n,`.${Oa}`)||!!(e=>bi(u)&&u(e))(e)}});c=e(),l=t;}if(C&&(T.O(),ki(k)||vi(k)?(i=k,r=!1,a=os,s=is):xi(k)?(i=k.mutation,r=k.resize,a=k.event,s=k.env):(i=!1,r=!1,a=!1,s=!1)),S){const e=z(),t=M&&M(),n=l&&l();e&&ar(o,F(e[0],e[1],S)),t&&ar(o,B(t[0],S)),n&&ar(o,R(n[0],S));}return D(o),o},I]},vs=(e,t)=>bi(t)?t.apply(0,e):t,ys=(e,t,n,o)=>{const i=mi(o)?n:o;return vs(e,i)||t.apply(0,e)},ws=(e,t,n,o)=>{const i=mi(o)?n:o,r=vs(e,i);return !!r&&(Ni(r)?r:t.apply(0,e))},bs=(e,t,n,o)=>{const i="--os-viewport-percent",r="--os-scroll-percent",a="--os-scroll-direction",{K:s}=ds(),{scrollbars:l}=s(),{slot:c}=l,{dt:u,vt:d,L:f,Tt:h,gt:p,bt:m,V:g}=t,{scrollbars:v}=h?{}:e,{slot:y}=v||{},w=[],b=[],k=[],C=ws([u,d,f],()=>g&&m?u:d,c,y),S=e=>{if(pi){let t=null,o=[];const i=new pi({source:p,axis:e}),r=()=>{t&&t.cancel(),t=null;},a=a=>{const{Dt:s}=n,l=ua(s)[e],c="x"===e,u=[Kr(0,c),Kr(`calc(-100% + 100cq${c?"w":"h"})`,c)],d=l?u:u.reverse();return o[0]===d[0]&&o[1]===d[1]||(o=d,r(),t=a.Mt.animate({clear:["left"],transform:d},{timeline:i})),r};return {kt:a}}},x={x:S("x"),y:S("y")},N=(e,t,n)=>{const o=n?Sr:Cr;Ai(e,e=>{o(e.Lt,t);});},I=(e,t)=>{Ai(e,e=>{const[n,o]=t(e);jr(n,o);});},A=(e,t,n)=>{const o=wi(n),i=!o||!n;(!o||n)&&N(b,e,t),i&&N(k,e,t);},P=e=>{const t=e?"x":"y",n=Fr(`${Oa} ${e?$a:_a}`),i=Fr(za),r=Fr(Ha),a={Lt:n,Ut:i,Mt:r},s=x[t];return Ti(e?b:k,a),Ti(w,[Lr(n,i),Lr(i,r),er(Br,n),s&&s.kt(a),o(a,A,e)]),a},E=er(P,!0),T=er(P,!1);return E(),T(),[{Pt:()=>{const e=(()=>{const{Rt:e,Vt:t}=n,o=(e,t)=>ur(0,1,e/(e+t)||0);return {x:o(t.x,e.x),y:o(t.y,e.y)}})(),t=e=>t=>[t.Lt,{[i]:zr(e)+""}];I(b,t(e.x)),I(k,t(e.y));},Nt:()=>{if(!pi){const{Dt:e}=n,t=da(e,la(p)),o=e=>t=>[t.Lt,{[r]:zr(e)+""}];I(b,o(t.x)),I(k,o(t.y));}},qt:()=>{const{Dt:e}=n,t=ua(e),o=e=>t=>[t.Lt,{[a]:e?"0":"1"}];I(b,o(t.x)),I(k,o(t.y)),pi&&(b.forEach(x.x.kt),k.forEach(x.y.kt));},Bt:()=>{if(g&&!m){const{Rt:e,Dt:t}=n,o=ua(t),i=da(t,la(p)),r=t=>{const{Lt:n}=t,r=Pr(n)===f&&n,a=(e,t,n)=>{const o=t*e;return Hr(n?o:-o)};return [r,r&&{transform:Kr({x:a(i.x,e.x,o.x),y:a(i.y,e.y,o.y)})}]};I(b,r),I(k,r);}},Ft:A,jt:{Xt:b,Yt:E,Wt:er(I,b)},Jt:{Xt:k,Yt:T,Wt:er(I,k)}},()=>(Lr(C,b[0].Lt),Lr(C,k[0].Lt),er(Fi,w))]},ks=(e,t,n,o)=>(i,r,a)=>{const{vt:s,L:l,V:c,gt:u,Gt:d,St:f}=t,{Lt:h,Ut:p,Mt:m}=i,[g,v]=tr(333),[y,w]=tr(444),b=e=>{bi(u.scrollBy)&&u.scrollBy({behavior:"smooth",left:e.x,top:e.y});};let k=!0;return er(Fi,[oa(m,"pointermove pointerleave",o),oa(h,"pointerenter",()=>{r(Wa,!0);}),oa(h,"pointerleave pointercancel",()=>{r(Wa,!1);}),!c&&oa(h,"mousedown",()=>{const e=Tr();(hr(e,Ia)||hr(e,Na)||e===document.body)&&li(er(fa,l),25);}),oa(h,"wheel",e=>{const{deltaX:t,deltaY:n,deltaMode:o}=e;k&&0===o&&Pr(h)===s&&b({x:t,y:n}),k=!1,r(qa,!0),g(()=>{k=!0,r(qa);}),ra(e);},{I:!1,A:!0}),oa(h,"pointerdown",()=>{const e=oa(d,"click",e=>{t(),aa(e);},{T:!0,A:!0,I:!1}),t=oa(d,"pointerup pointercancel",()=>{t(),setTimeout(e,150);},{A:!0,I:!0});},{A:!0,I:!0}),(()=>{const t="pointerup pointercancel lostpointercapture",o="client"+(a?"X":"Y"),i=a?Ki:Ui,r=a?"left":"top",s=a?"w":"h",l=a?"x":"y",c=(e,t)=>o=>{const{Rt:i}=n,r=Gr(p)[s]-Gr(m)[s],a=t*o/r*i[l];sa(u,{[l]:e+a});},h=[];return oa(p,"pointerdown",n=>{const a=Er(n.target,`.${Ha}`)===m,g=a?m:p,v=e.scrollbars,k=v[a?"dragScroll":"clickScroll"],{button:C,isPrimary:S,pointerType:x}=n,{pointers:N}=v;if(0===C&&S&&k&&(N||[]).includes(x)){Fi(h),w();const e=!a&&(n.shiftKey||"instant"===k),v=er(Zr,m),C=er(Zr,p),S=(e,t)=>(e||v())[r]-(t||C())[r],x=oi(Zr(u)[i])/Gr(u)[s]||1,N=c(la(u)[l],1/x),I=n[o],A=v(),P=C(),E=A[i],T=S(A,P)+E/2,D=I-P[r],B=a?0:D-T,L=e=>{Fi(O),g.releasePointerCapture(e.pointerId);},R=a||e,F=f(),O=[oa(d,t,L),oa(d,"selectstart",e=>ra(e),{I:!1}),oa(p,t,L),R&&oa(p,"pointermove",e=>N(B+(e[o]-I))),R&&(()=>{const e=la(u);F();const t=la(u),n={x:t.x-e.x,y:t.y-e.y};(ii(n.x)>3||ii(n.y)>3)&&(f(),sa(u,e),b(n),y(F));})];if(g.setPointerCapture(n.pointerId),e)N(B);else if(!a){const e=ya("__osClickScrollPlugin");if(e){const t=e(N,B,E,e=>{e?F():Ti(O,F);});Ti(O,t),Ti(h,er(t,!0));}}}})})(),v,w])},Cs=e=>{const t=ds(),{K:n,U:o}=t,{elements:i}=n(),{padding:r,viewport:a,content:s}=i,l=Ni(e),c=l?{}:e,{elements:u}=c,{padding:d,viewport:f,content:h}=u||{},p=l?e:c.target,m=Ir(p),g=p.ownerDocument,v=g.documentElement,y=()=>g.defaultView||ei,w=er(ys,[p]),b=er(ws,[p]),k=er(Fr,""),C=er(w,k,a),S=er(b,k,s),x=C(f),N=x===p,I=N&&m,A=!N&&S(h),P=!N&&x===A,E=I?v:x,T=I?E:p,D=!N&&b(k,r,d),B=!P&&A,L=[B,E,D,T].map(e=>Ni(e)&&!Pr(e)&&e),R=e=>e&&Pi(L,e),F=!R(E)&&(e=>{const t=Gr(e),n=Qr(e),o=Vr(e,Vi),i=Vr(e,Wi);return n.w-t.w>0&&!Qa(o)||n.h-t.h>0&&!Qa(i)})(E)?E:p,O=I?v:E,M={dt:p,vt:T,L:E,rn:D,ht:B,gt:O,Kt:I?g:E,ln:m?v:F,Gt:g,bt:m,Tt:l,V:N,an:y,wt:e=>br(E,Ia,e),yt:(e,t)=>wr(E,Ia,e,t),St:()=>wr(O,Ia,"scrolling",!0)},{dt:$,vt:_,rn:z,L:H,ht:j}=M,V=[()=>{mr(_,[Na,Ca]),mr($,Ca),m&&mr(v,[Ca,Na]);}];let W=Ar([j,H,z,_,$].find(e=>e&&!R(e)));const K=I?$:j||H,U=er(Fi,V);return [M,()=>{const e=y(),t=Tr(),n=e=>{Lr(Pr(e),Ar(e)),Br(e);},i=e=>oa(e,"focusin focusout focus blur",aa,{A:!0,I:!1}),r="tabindex",a=fr(H,r),s=i(t);return pr(_,Na,N?"":"host"),pr(z,Da,""),pr(H,Ia,""),pr(j,Ba,""),N||(pr(H,r,a||"-1"),m&&pr(v,xa,"")),Lr(K,W),Lr(_,z),Lr(z||_,!N&&H),Lr(H,j),Ti(V,[s,()=>{const e=Tr(),t=R(H),o=t&&e===H?$:e,s=i(o);mr(z,Da),mr(j,Ba),mr(H,Ia),m&&mr(v,xa),a?pr(H,r,a):mr(H,r),R(j)&&n(j),t&&n(H),R(z)&&n(z),fa(o),s();}]),o&&!N&&(yr(H,Ia,Ta),Ti(V,er(mr,H,Ia))),fa(!N&&m&&t===$&&e.top===e?H:t),s(),W=0,U},U]},Ss=({ht:e})=>({Qt:t,un:n,At:o})=>{const{$t:i}=t||{},{Ot:r}=n;e&&(i||o)&&jr(e,{[Ui]:r&&"100%"});},xs=({vt:e,rn:t,L:n,V:o},i)=>{const[r,a]=Zo({i:Zi,o:Wr()},er(Wr,e,"padding",""));return ({zt:e,Qt:s,un:l,At:c})=>{let[u,d]=a(c);const{U:f}=ds(),{_t:h,xt:p,Ct:m}=s||{},{B:g}=l,[v,y]=e("paddingAbsolute");(h||d||(c||p))&&([u,d]=r(c));const w=!o&&(y||m||d);if(w){const e=!v||!t&&!f,o=u.r+u.l,r=u.t+u.b,a={[Hi]:e&&!g?-o:0,[ji]:e?-r:0,[zi]:e&&g?-o:0,top:e?-u.t:0,right:e?g?-u.r:"auto":0,left:e?g?"auto":-u.l:0,[Ki]:e&&`calc(100% + ${o}px)`},s={[Oi]:e?u.t:0,[Mi]:e?u.r:0,[_i]:e?u.b:0,[$i]:e?u.l:0};jr(t||n,a),jr(n,s),ar(i,{rn:u,fn:!e,F:t?s:ar({},a,s)});}return {_n:w}}},Ns=(e,t)=>{const n=ds(),{vt:o,rn:i,L:r,V:a,Kt:s,gt:l,bt:c,yt:u,an:d}=e,{U:f}=n,h=c&&a,p=er(ti,0),m={display:()=>!1,direction:e=>"ltr"!==e,flexDirection:e=>e.endsWith("-reverse"),writingMode:e=>"horizontal-tb"!==e},g=rr(m),v={i:Qi,o:{w:0,h:0}},y={i:Xi,o:{}},w=e=>{u(Ea,!h&&e);},b=()=>Vr(r,g),k=(e,t)=>{const n=!rr(e).length,o=!t&&g.some(t=>{const n=e[t];return yi(n)&&m[t](n)});if(n&&!o||!(e=>!!e&&(e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length))(e))(r))return {D:{x:0,y:0},M:{x:1,y:1}};w(!0);const i=la(l),a=oa(s,Gi,e=>{const t=la(l);e.isTrusted&&t.x===i.x&&t.y===i.y&&ia(e);},{A:!0,T:!0}),c=u("noContent",!0);sa(l,{x:0,y:0}),c();const d=la(l),f=Qr(l);sa(l,{x:f.w,y:f.h});const h=la(l),p={x:h.x-d.x,y:h.y-d.y};sa(l,{x:-f.w,y:-f.h});const v=la(l),y={x:v.x-d.x,y:v.y-d.y},b={x:ii(p.x)>=ii(y.x)?h.x:v.x,y:ii(p.y)>=ii(y.y)?h.y:v.y};return sa(l,i),si(()=>a()),{D:d,M:b}},C=(e,t)=>{const n=ei.devicePixelRatio%1!=0?1:0,o={w:p(e.w-t.w),h:p(e.h-t.h)};return {w:o.w>n?o.w:0,h:o.h>n?o.h:0}},S=(e,t)=>{const n=(e,t,n,o)=>{const i=e===Ji?qi:(e=>e.replace(`${Ji}-`,""))(e),r=Qa(e),a=Qa(n);if(!t&&!o)return qi;if(r&&a)return Ji;if(r){return t&&o?i:t?Ji:qi}return t?i:a&&o?Ji:qi};return {x:n(t.x,e.x,t.y,e.y),y:n(t.y,e.y,t.x,e.x)}},x=e=>{const t=e=>[Ji,qi,Gi].map(t=>_(Xa(t),e)),n=t(!0).concat(t()).join(" ");u(n),u(rr(e).map(t=>_(e[t],"x"===t)).join(" "),!0);},[N,I]=Zo(v,er(Xr,r)),[A,P]=Zo(v,er(Qr,r)),[E,T]=Zo(v),[D]=Zo(y),[B,L]=Zo(v),[R]=Zo(y),[F]=Zo({i:(e,t)=>Yi(e,t,Ri(Ei(rr(e),rr(t)))),o:{}}),[O,M]=Zo({i:(e,t)=>Xi(e.D,t.D)&&Xi(e.M,t.M),o:{D:{x:0,y:0},M:{x:0,y:0}}}),$=ya(es),_=(e,t)=>`${t?Aa:Pa}${(e=>{const t=String(e||"");return t?t[0].toUpperCase()+t.slice(1):""})(e)}`;return ({zt:a,Qt:s,un:l,At:c},{_n:m})=>{const{_t:g,Ht:v,xt:y,Ct:_,ft:z,Et:H}=s||{},j=$&&$.R(e,t,l,n,a),{X:V,Y:W,W:K}=j||{},[U,J]=((e,t)=>{const{k:n}=t,[o,i]=e("showNativeOverlaidScrollbars");return [o&&n.x&&n.y,i]})(a,n),[q,G]=a("overflow"),Y=Qa(q.x),Q=Qa(q.y),X=g||m||y||_||H||J;let Z=I(c),ee=P(c),te=T(c),ne=L(c);if(J&&f&&u(Ta,!U),X){br(o,Na,Sa)&&w(!0);const e=W&&W(),[t]=Z=N(c),[n]=ee=A(c),i=Yr(r),a=h&&qr(d()),s={w:p(n.w+t.w),h:p(n.h+t.h)},l={w:p((a?a.w:i.w+p(i.w-n.w))+t.w),h:p((a?a.h:i.h+p(i.h-n.h))+t.h)};e&&e(),ne=B(l),te=E(C(s,l),c);}const[oe,ie]=ne,[re,ae]=te,[se,le]=ee,[ce,ue]=Z,[de,fe]=D({x:re.w>0,y:re.h>0}),he=Y&&Q&&(de.x||de.y)||Y&&de.x&&!de.y||Q&&de.y&&!de.x,pe=m||_||H||ue||le||ie||ae||G||J||X||v&&h,[me]=a("update.flowDirectionStyles"),[ge,ve]=F(me?me(r):b(),c),ye=_||z||ve||fe||c,[we,be]=ye?O(k(ge,!!me),c):M();let ke=S(de,q);w(!1),pe&&(x(ke),ke=Za(r,de),K&&V&&(V(ke,se,ce),jr(r,K(ke))));const[Ce,Se]=R(ke);return wr(o,Na,Sa,he),wr(i,Da,Sa,he),ar(t,{cn:Ce,Vt:{x:oe.w,y:oe.h},Rt:{x:re.w,y:re.h},j:de,Dt:ca(we,re)}),{sn:Se,tn:ie,nn:ae,en:be||ae}}},Is=e=>{const[t,n,o]=Cs(e),i={rn:{t:0,r:0,b:0,l:0},fn:!1,F:{[Hi]:0,[ji]:0,[zi]:0,[Oi]:0,[Mi]:0,[_i]:0,[$i]:0},Vt:{x:0,y:0},Rt:{x:0,y:0},cn:{x:qi,y:qi},j:{x:!1,y:!1},Dt:{D:{x:0,y:0},M:{x:0,y:0}}},{dt:r,gt:a,V:s,St:l}=t,{U:c,k:u}=ds(),d=!c&&(u.x||u.y),f=[Ss(t),xs(t,i),Ns(t,i)];return [n,e=>{const t={},n=d&&la(a),o=n&&l();return Ai(f,n=>{ar(t,n(e,t)||{});}),sa(a,n),o&&o(),s||sa(r,0),t},i,t,o]},As=(e,t,n,o,i)=>{let r=!1;const a=ss(t,{}),[s,l,c,u,d]=Is(e),[f,h,p]=gs(u,c,a,e=>{w({},e);}),[m,g,,v]=((e,t,n,o,i,r)=>{let a,s,l,c,u,d=cr,f=0;const h=["mouse","pen"],p=e=>h.includes(e.pointerType),[m,g]=tr(),[v,y]=tr(100),[w,b]=tr(100),[k,C]=tr(()=>f),[S,x]=bs(e,i,o,ks(t,i,o,e=>p(e)&&R())),{vt:N,Kt:I,bt:A}=i,{Ft:P,Pt:E,Nt:T,qt:D,Bt:B}=S,L=(e,t)=>{if(C(),e)P(Ja);else {const e=er(P,Ja,!0);f>0&&!t?k(e):e();}},R=()=>{(l?a:c)||(L(!0),v(()=>{L(!1);}));},F=e=>{P(Ua,e,!0),P(Ua,e,!1);},O=e=>{p(e)&&(a=l,l&&L(!0));},M=[C,y,b,g,()=>d(),oa(N,"pointerover",O,{T:!0}),oa(N,"pointerenter",O),oa(N,"pointerleave",e=>{p(e)&&(a=!1,l&&L(!1));}),oa(N,"pointermove",e=>{p(e)&&s&&R();}),oa(I,"scroll",e=>{m(()=>{T(),R();}),r(e),B();})],$=ya(es);return [()=>er(Fi,Ti(M,x())),({zt:e,At:t,Qt:i,Zt:r})=>{const{tn:a,nn:h,sn:p,en:m}=r||{},{Ct:g,ft:v}=i||{},{B:y}=n,{k:b,U:k}=ds(),{cn:C,j:S}=o,[x,N]=e("showNativeOverlaidScrollbars"),[R,O]=e("scrollbars.theme"),[M,_]=e("scrollbars.visibility"),[z,H]=e("scrollbars.autoHide"),[j,V]=e("scrollbars.autoHideSuspend"),[W]=e("scrollbars.autoHideDelay"),[K,U]=e("scrollbars.dragScroll"),[J,q]=e("scrollbars.clickScroll"),[G,Y]=e("overflow"),Q=v&&!t,X=S.x||S.y,Z=a||h||m||g||t,ee=p||_||Y,te=x&&b.x&&b.y,ne=!k&&!$,oe=te||ne,ie=(e,t,n)=>{const o=e.includes(Gi)&&(M===Ji||"auto"===M&&t===Gi);return P(ja,o,n),o};if(f=W,Q&&(j&&X?(F(!1),d(),w(()=>{d=oa(I,"scroll",er(F,!0),{T:!0});})):F(!0)),(N||ne)&&P("os-theme-none",oe),O&&(P(u),P(R,!0),u=R),V&&!j&&F(!0),H&&(s="move"===z,l="leave"===z,c="never"===z,L(c,!0)),U&&P(Ya,K),q&&P(Ga,!!J),ee){const e=ie(G.x,C.x,!0),t=ie(G.y,C.y,!1);P(Va,!(e&&t));}Z&&(T(),E(),B(),m&&D(),P(Ka,!S.x,!0),P(Ka,!S.y,!1),P(Ma,y&&!A));},{},S]})(e,t,p,c,u,i),y=e=>rr(e).some(t=>!!e[t]),w=(e,i)=>{if(n())return !1;const{dn:a,At:s,It:c,pn:u}=e,d=a||{},f=!!s||!r,m={zt:ss(t,d,f),dn:d,At:f};if(u)return g(m),!1;const v=i||h(ar({},m,{It:c})),w=l(ar({},m,{un:p,Qt:v}));g(ar({},m,{Qt:v,Zt:w}));const b=y(v),k=y(w),C=b||k||!lr(d)||f;return r=!0,C&&o(e,{Qt:v,Zt:w}),C};return [()=>{const{ln:e,gt:t,St:n}=u,o=la(e),i=[f(),s(),m()],r=n();return sa(t,o),r(),er(Fi,i)},w,()=>({vn:p,gn:c}),{hn:u,bn:v},d]},Ps=new WeakMap,Es=e=>Ps.get(e),Ts=(e,t,n)=>{const{tt:o}=ds(),i=Ni(e),r=i?e:e.target,a=Es(r);if(t&&!a){let a=!1;const s=[],l={},c=e=>{const t=sr(e),n=ya("__osOptionsValidationPlugin");return n?n(t,!0):t},u=ar({},o(),c(t)),[d,f,h]=pa(),[p,m,g]=pa(n),v=(e,t)=>{g(e,t),h(e,t);},[y,w,b,k,C]=As(e,u,()=>a,({dn:e,At:t},{Qt:n,Zt:o})=>{const{_t:i,Ct:r,$t:a,xt:s,Ht:l,ft:c}=n,{tn:u,nn:d,sn:f,en:h}=o;v("updated",[x,{updateHints:{sizeChanged:!!i,directionChanged:!!r,heightIntrinsicChanged:!!a,overflowEdgeChanged:!!u,overflowAmountChanged:!!d,overflowStyleChanged:!!f,scrollCoordinatesChanged:!!h,contentMutation:!!s,hostMutation:!!l,appear:!!c},changedOptions:e||{},force:!!t}]);},e=>v("scroll",[x,e])),S=e=>{(e=>{Ps.delete(e);})(r),Fi(s),a=!0,v("destroyed",[x,e]),f(),m();},x={options(e,t){if(e){const n=t?o():{},i=as(u,ar(n,c(e)));lr(i)||(ar(u,i),w({dn:i}));}return ar({},u)},on:p,off:(e,t)=>{e&&t&&m(e,t);},state(){const{vn:e,gn:t}=b(),{B:n}=e,{Vt:o,Rt:i,cn:r,j:s,rn:l,fn:c,Dt:u}=t;return ar({},{overflowEdge:o,overflowAmount:i,overflowStyle:r,hasOverflow:s,scrollCoordinates:{start:u.D,end:u.M},padding:l,paddingAbsolute:c,directionRTL:n,destroyed:a})},elements(){const{dt:e,vt:t,rn:n,L:o,ht:i,gt:r,Kt:a}=k.hn,{jt:s,Jt:l}=k.bn,c=e=>{const{Mt:t,Ut:n,Lt:o}=e;return {scrollbar:o,track:n,handle:t}},u=e=>{const{Xt:t,Yt:n}=e,o=c(t[0]);return ar({},o,{clone:()=>{const e=c(n());return w({pn:!0}),e}})};return ar({},{target:e,host:t,padding:n||o,viewport:o,content:i||o,scrollOffsetElement:r,scrollEventElement:a,scrollbarHorizontal:u(s),scrollbarVertical:u(l)})},update:e=>w({At:e,It:!0}),destroy:er(S,!1),plugin:e=>l[rr(e)[0]]};return Ti(s,[C]),((e,t)=>{Ps.set(e,t);})(r,x),va(ma,Ts,[x,d,l]),((e,t)=>{const{nativeScrollbarsOverlaid:n,body:o}=t||{},{k:i,U:r,K:a}=ds(),{nativeScrollbarsOverlaid:s,body:l}=a().cancel,c=null!=n?n:s,u=mi(o)?l:o,d=(i.x||i.y)&&c,f=e&&(gi(u)?!r:u);return !!d||!!f})(k.hn.bt,!i&&e.cancel)?(S(!0),x):(Ti(s,y()),v("initialized",[x]),x.update(),x)}return a};Ts.plugin=e=>{const t=ki(e),n=t?e:[e],o=n.map(e=>va(e,Ts)[0]);return (e=>{Ai(e,e=>Ai(e,(t,n)=>{ma[n]=e[n];}));})(n),t?o:o[0]},Ts.valid=e=>{const t=e&&e.elements,n=bi(t)&&t();return xi(n)&&!!Es(n.target)},Ts.env=()=>{const{P:e,k:t,U:n,J:o,ot:i,st:r,K:a,Z:s,tt:l,nt:c}=ds();return ar({},{scrollbarsSize:e,scrollbarsOverlaid:t,scrollbarsHiding:n,scrollTimeline:o,staticDefaultInitialization:i,staticDefaultOptions:r,getDefaultInitialization:a,setDefaultInitialization:s,getDefaultOptions:l,setDefaultOptions:c})},Ts.nonce=e=>{ls=e;},Ts.trustedTypePolicy=e=>{Rr=e;};const Ds=()=>{if(typeof window>"u"){const e=()=>{};return [e,e]}let e,t;const n=window,o="function"==typeof n.requestIdleCallback,i=n.requestAnimationFrame,r=n.cancelAnimationFrame,a=o?n.requestIdleCallback:i,s=o?n.cancelIdleCallback:r,l=()=>{s(e),r(t);};return [(n,r)=>{l(),e=a(o?()=>{l(),t=i(n);}:n,"object"==typeof r?r:{timeout:2233});},l]},Bs=e=>{const{options:t,events:n,defer:o}=e||{},[i,r]=reactExports.useMemo(Ds,[]),a=reactExports.useRef(null),s=reactExports.useRef(o),l=reactExports.useRef(t),c=reactExports.useRef(n);return reactExports.useEffect(()=>{s.current=o;},[o]),reactExports.useEffect(()=>{const{current:e}=a;l.current=t,Ts.valid(e)&&e.options(t||{},!0);},[t]),reactExports.useEffect(()=>{const{current:e}=a;c.current=n,Ts.valid(e)&&e.on(n||{},!0);},[n]),reactExports.useEffect(()=>()=>{var e;r(),null==(e=a.current)||e.destroy();},[]),reactExports.useMemo(()=>[e=>{const t=a.current;if(Ts.valid(t))return;const n=s.current,o=l.current||{},r=c.current||{},u=()=>a.current=Ts(e,o,r);n?i(u,n):u();},()=>a.current],[])};reactExports.forwardRef((e,t)=>{const{element:n="div",options:o,events:r,defer:a,children:s,...l}=e,c=n,u=reactExports.useRef(null),p=reactExports.useRef(null),[m,g]=Bs({options:o,events:r,defer:a});return reactExports.useEffect(()=>{const{current:e}=u,{current:t}=p;if(!e)return;return m("body"===n?{target:e,cancel:{body:null}}:{target:e,elements:{viewport:t,content:t}}),()=>{var e;return null==(e=g())?void 0:e.destroy()}},[m,n]),reactExports.useImperativeHandle(t,()=>({osInstance:g,getElement:()=>u.current}),[]),React.createElement(c,{"data-overlayscrollbars-initialize":"",ref:u,...l},"body"===n?s:React.createElement("div",{"data-overlayscrollbars-contents":"",ref:p},s))});const Ls=reactExports.forwardRef((t,n)=>{const{children:o,element:i="div",elementProps:r,wrapperClassName:s}=t,l=reactExports.useRef(null),c=reactExports.useRef(null),[u,h]=Bs({options:{scrollbars:{autoHide:"leave",autoHideDelay:0}},defer:!0}),p=reactExports.useCallback(e=>{c.current=e,"function"==typeof n?n(e):null!==n&&(n.current=e);},[n]);return reactExports.useEffect(()=>{if(c.current&&l.current)return u({target:l.current,elements:{viewport:c.current,content:c.current}}),()=>h()?.destroy()},[u,h]),jsxRuntimeExports.jsx("div",{"data-overlayscrollbars-initialize":"",ref:l,className:S("io-overlay-scrollbars-container",s),children:jsxRuntimeExports.jsx(i,{"data-overlayscrollbars-contents":"",ref:p,...r,children:o})})});function Rs({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}var Fs=React["undefined"!=typeof document&&void 0!==document.createElement?"useLayoutEffect":"useEffect"],Os=0,Ms=()=>Os++,$s=0;function _s(e,t){void 0===t&&(t="🅰");var[n,o]=reactExports.useState($s?Ms:void 0);return Fs(()=>{void 0===n&&o(Os++),$s=1;},[]),e||(void 0===n?n:t+n)}function zs(){return ("function"==typeof reactExports.useId?reactExports.useId:_s)()??""}const Hs=reactExports.forwardRef(({id:n,className:o,type:i="text",name:r="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:h,disabled:p,readOnly:m,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=zs(),k=n||`input-${b}`,C=S("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",p&&"io-control-disabled",m&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],o),N=reactExports.useCallback(e=>{p?e.preventDefault():u&&u(e);},[u,p]),I=reactExports.useCallback(e=>{p?e.preventDefault():f&&f(e);},[f,p]);return jsxRuntimeExports.jsxs("div",{className:C,children:[l&&jsxRuntimeExports.jsx(Rs,{htmlFor:k,text:l}),c&&jsxRuntimeExports.jsx(x,{variant:c,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:k,className:"io-input",ref:w,type:i,name:r,tabIndex:0,placeholder:h??(()=>{switch(i){case"email":return "Enter your email here...";case"number":return "Enter number here...";case"password":return "Enter your password here...";case"tel":return "Enter your phone number here...";case"file":return "Select a file...";default:return "Enter text here..."}})(),"aria-label":l,disabled:p,readOnly:m,...g?{"aria-invalid":!0,"aria-describedby":`${k}-error`}:{},...y}),d&&jsxRuntimeExports.jsx(x,{variant:d,onClick:e=>I(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,id:`${k}-error`,className:"io-input-error",children:[jsxRuntimeExports.jsx(x,{variant:"close"}),g]})]})});Hs.displayName="Input";const js=reactExports.forwardRef(({id:n,className:o,name:i="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const h=zs(),p=n||`textarea-${h}`,m=S("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(Rs,{htmlFor:p,text:a}),jsxRuntimeExports.jsx("textarea",{id:p,className:"io-textarea",ref:f,name:i,tabIndex:0,placeholder:l,"aria-label":a,disabled:c,readOnly:u,rows:s,...d})]})});js.displayName="Textarea";const Vs=reactExports.forwardRef(({id:n,className:o,name:i="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=zs(),f=n||`checkbox-${d}`,h=S("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:h,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:f,className:"io-checkbox",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Rs,{htmlFor:f,text:a,"data-testid":c["data-testid"]?`${c["data-testid"]}-label`:void 0})]})});Vs.displayName="Checkbox";const Ws=reactExports.forwardRef(({id:n,className:o,name:i="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=zs(),f=n||`radio-${d}`,h=S("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:h,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:f,className:"io-radio",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Rs,{htmlFor:f,text:a})]})});Ws.displayName="Radio";const Ks=()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState(null),o=reactExports.useCallback(t=>e?.themes?.select(t),[e]);return reactExports.useEffect(()=>{if(!e)return;let t=!1;const o=e=>{t||n(e);};return e.themes?.onChanged(o),e.themes?.getCurrent().then(o).catch(console.warn),()=>{t=!0;}},[e]),{currentTheme:t,selectTheme:o}};function Us(e,t=500){const[n,o]=reactExports.useState(e);return reactExports.useEffect(()=>{const n=setTimeout(()=>{o(e);},t);return ()=>clearTimeout(n)},[e,t]),n}const qs=()=>void 0!==window.glue42gd||void 0!==window.glue42alert||void 0!==window.glue42dialog||void 0!==window.iodesktop;function Gs(){return reactExports.useMemo(()=>"object"==typeof window&&qs(),[])}const il=()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState([]);return reactExports.useEffect(()=>{e&&e.themes?.list().then(n).catch(console.warn);},[e]),t};const ul=reactExports.forwardRef(({id:n,className:o,name:i="toggle",align:r="left",label:a,checked:s,disabled:l,onKeyDown:c,"data-testid":u="toggle",...d},f)=>{const h=zs(),p=n||`toggle-${h}`,m=S("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsx("div",{className:m,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",htmlFor:p,tabIndex:l?-1:0,onKeyDown:c,"data-testid":`${u}-label`,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:p,className:"io-checkbox",ref:f,name:i,checked:s,disabled:l,"aria-checked":s,tabIndex:-1,"data-testid":u,...d}),jsxRuntimeExports.jsx("span",{className:"slider","data-testid":`${u}-slider`}),a]})})});function dl(e){return {name:e.name,title:e.title,hidden:e.isHidden,userProperties:e.customProperties}}function fl(e){return {name:e.name,title:e.title,hidden:e.hidden,userProperties:e.userProperties}}ul.displayName="Toggle";const hl={getMyApplication:async function(e){if(e)try{const t=e.apps;if(t){const e=t.my?.appName;if(!e)return;const n=await t.registry.get({name:e});if(!n)return;return dl(n)}const n=e.appManager?.myApplication;if(!n)return;return fl(n)}catch(e){return void console.error("Failed to get my application",e)}},getApplications:async function(e){if(!e)return [];try{const t=e.apps?.registry;if(t){const e=await t.getMany()??[];return e.map(e=>dl(e))}const n=e.appManager?.applications()??[];return n.map(e=>fl(e))}catch(e){console.error("Failed to get applications",e);}return []},startApplication:async function(e,t,n){if(e)try{const o=e.apps;if(o){await(o.registry?.get({name:t}))||console.error(`Application "${t}" not found in registry`);const e=o.instances;return e?void await e.start({name:t,...n}):void console.error("io.apps.instances API is not available")}const i=e.appManager?.application(t);if(!i)return void console.error(`Application "${t}" not found`);await i.start(n);}catch(e){return void console.error(`Failed to start application "${t}"`,e)}},stopApplication:async function(e,t,n){if(e)try{const o=e.apps;if(o){const e=o.instances;return e?void await e.stop({id:t.id,force:n?.force,reason:n?.reason,timeout:n?.timeout}):void console.error("io.apps.instances API is not available")}const i=e.appManager.instances().find(e=>e.id===t.id);if(!i)return void console.error(`Instance "${t.id}" not found`);await i.stop();}catch(e){return void console.error(`Failed to stop application instance "${t.id}"`,e)}},onAppAdded:async function(e,t){if(e)try{const n=e.apps?.registry;if(n){return await n.onAdded(({app:e})=>{const n=dl(e);t(n);})}const o=e.appManager?.onAppAdded(e=>{const n=fl(e);t(n);});return o}catch(e){return void console.error("Failed to subscribe to app added events",e)}},onAppRemoved:async function(e,t){if(e)try{const n=e.apps?.registry;if(n){return await n.onRemoved(({appName:e})=>{t({name:e});})}const o=e.appManager?.onAppRemoved(e=>{t({name:e.name});});return o}catch(e){return void console.error("Failed to subscribe to app removed events",e)}},onAppChanged:async function(e,t){if(e)try{const n=e.apps?.registry;if(n){return await n.onUpdated(e=>{const n=dl(e.app);t(n);})}const o=e.appManager?.onAppChanged(e=>{const n=fl(e);t(n);});return o}catch(e){return void console.error("Failed to subscribe to app changed events",e)}},restartPlatform:async function(e,t=!0){if(!e)return;const n={autoSave:t,showDialog:!0};try{if(e.platform?.restart)return void await e.platform.restart(n);await(e.appManager?.restart(n));}catch(e){console.error("Failed to restart platform",e);}},shutdownPlatform:async function(e,t=!0){if(!e)return;const n={autoSave:t,showDialog:!0};try{if(e.platform?.shutdown)return void await e.platform.shutdown(n);await(e.appManager?.exit(n));}catch(e){console.error("Failed to shutdown platform",e);}}};const pl={minimizeWindow:async function(e){if(e)try{const t=e.windows?.my();await(t?.minimize());}catch(e){console.error("Failed to minimize window",e);}},closeWindow:async function(e,t){if(e)try{const n=e.windows?.my();await(n?.close(t));}catch(e){console.error("Failed to close window",e);}},restartPlatform:hl.restartPlatform,shutdownPlatform:hl.shutdownPlatform};reactExports.createContext({theme:"dark"});const yl="___platform_prefs___",Il="_launchpad_minimizeToTray",Pl="_launchpad_pinnedPosition",El="_launchpad_allowDocking",Tl="_launchpad_dockedAlwaysOnTop",Dl="_launchpad_dockedClaimsSpace",Bl="_launchpad_showExtendedArea",Ll="_launchpad_hideLabelsInExtendedArea",Rl="_launchpad_showFavoritesInExtendedArea",Fl="_launchpad_hideFavoritesSection",Ol="_launchpad_showRecentAppsInExtendedArea",$l="_layouts_saveCurrentOnExit",_l="_layouts_showUnsavedChangesPrompt",zl="_layouts_showDeletePrompt",Hl="_downloads_askForEachDownload",Xl=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),Zl="warning",ec={success:5e3,warning:1e4};var tc=function(e){return {ok:!0,result:e}},nc=function(e){return {ok:!1,error:e}},oc=function(e,t,n){return !1===t.ok?t:!1===n.ok?n:tc(e(t.result,n.result))},ic=function(e,t){return !0===t.ok?t:nc(e(t.error))},rc=function(){return rc=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},rc.apply(this,arguments)};function ac(e,t){if(e===t)return !0;if(null===e&&null===t)return !0;if(typeof e!=typeof t)return !1;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return !1;if(e.length!==t.length)return !1;for(var n=0;n<e.length;n++)if(!ac(e[n],t[n]))return !1;return !0}var o=Object.keys(e);if(o.length!==Object.keys(t).length)return !1;for(n=0;n<o.length;n++){if(!t.hasOwnProperty(o[n]))return !1;if(!ac(e[o[n]],t[o[n]]))return !1}return !0}}var sc=function(e){return Array.isArray(e)},lc=function(e){return "object"==typeof e&&null!==e&&!sc(e)},cc=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case"string":return "a string";case"number":return "a number";case"boolean":return "a boolean";case"undefined":return "undefined";case"object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},uc=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},dc=function(e,t){var n=t.at,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(o=Object.getOwnPropertySymbols(e);i<o.length;i++)t.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(e,o[i])&&(n[o[i]]=e[o[i]]);}return n}(t,["at"]);return rc({at:e+(n||"")},o)},fc=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return ic(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return function(e){return !0===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(!0===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return !0===t.ok?tc(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return !0===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,o){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(o)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?tc(e):nc({message:cc("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?tc(e):nc({message:cc("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?tc(e):nc({message:cc("a boolean",e)})})},e.constant=function(t){return new e(function(e){return ac(e,t)?tc(t):nc({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(lc(e)&&t){var n={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o].decode(e[o]);if(!0!==i.ok)return void 0===e[o]?nc({message:"the key '"+o+"' is required but was not present"}):nc(dc("."+o,i.error));void 0!==i.result&&(n[o]=i.result);}return tc(n)}return lc(e)?tc(e):nc({message:cc("an object",e)})})},e.array=function(t){return new e(function(e){if(sc(e)&&t){return e.reduce(function(e,n,o){return oc(function(e,t){return e.concat([t])},e,function(e,n){return ic(function(e){return dc("["+n+"]",e)},t.decode(e))}(n,o))},tc([]))}return sc(e)?tc(e):nc({message:cc("an array",e)})})},e.tuple=function(t){return new e(function(e){if(sc(e)){if(e.length!==t.length)return nc({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e[o]);if(!i.ok)return nc(dc("["+o+"]",i.error));n[o]=i.result;}return tc(n)}return nc({message:cc("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return e.oneOf.apply(e,[t,n].concat(o))},e.intersection=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return new e(function(e){return [t,n].concat(o).reduce(function(t,n){return oc(Object.assign,t,n.decode(e))},tc({}))})},e.anyJson=function(){return new e(function(e){return tc(e)})},e.unknownJson=function(){return new e(function(e){return tc(e)})},e.dict=function(t){return new e(function(e){if(lc(e)){var n={};for(var o in e)if(e.hasOwnProperty(o)){var i=t.decode(e[o]);if(!0!==i.ok)return nc(dc("."+o,i.error));n[o]=i.result;}return tc(n)}return nc({message:cc("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?tc(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e);if(!0===i.ok)return i;n[o]=i.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return nc({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return tc(function(e,t){return !0===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var o=e,i=0;i<t.length;i++){if(void 0===o)return nc({at:uc(t.slice(0,i+1)),message:"path does not exist"});if("string"==typeof t[i]&&!lc(o))return nc({at:uc(t.slice(0,i+1)),message:cc("an object",o)});if("number"==typeof t[i]&&!sc(o))return nc({at:uc(t.slice(0,i+1)),message:cc("an array",o)});o=o[t[i]];}return ic(function(e){return void 0===o?{at:uc(t),message:"path does not exist"}:dc(uc(t),e)},n.decode(o))})},e.succeed=function(t){return new e(function(e){return tc(t)})},e.fail=function(t){return new e(function(e){return nc({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),hc=fc.string,pc=fc.number,mc=fc.boolean,gc=fc.anyJson;fc.unknownJson;var vc=fc.constant,yc=fc.object,wc=fc.array;fc.tuple,fc.dict;var bc=fc.optional,kc=fc.oneOf;fc.union,fc.intersection,fc.withDefault,fc.valueAt,fc.succeed;var Cc=fc.fail;fc.lazy;const Sc=hc().where(e=>e.length>0,"Expected a non-empty string"),xc=kc(vc("add"),vc("align-bottom"),vc("align-bottom-solid"),vc("align-left"),vc("align-left-bottom"),vc("align-left-bottom-solid"),vc("align-left-solid"),vc("align-left-top"),vc("align-left-top-solid"),vc("align-right"),vc("align-right-bottom"),vc("align-right-bottom-solid"),vc("align-right-solid"),vc("align-right-top"),vc("align-right-top-solid"),vc("align-top"),vc("align-top-solid"),vc("always-on-top"),vc("always-on-top-on"),vc("application"),vc("arrow-down-long"),vc("arrow-down-to-bracket"),vc("arrow-left-long"),vc("arrow-right-from-bracket"),vc("arrow-right-long"),vc("arrow-right"),vc("arrow-up"),vc("arrow-up-long"),vc("ban"),vc("bell"),vc("bell-solid"),vc("bookmark"),vc("bullseye-pointer"),vc("certificate"),vc("check"),vc("check-light"),vc("check-solid"),vc("chevron-down"),vc("chevron-left"),vc("chevron-right"),vc("chevron-up"),vc("circle-info"),vc("circle-xmark"),vc("circle-xmark-full"),vc("clock"),vc("clock-rotate-left"),vc("clone"),vc("close"),vc("cog"),vc("cog-solid"),vc("collapse"),vc("copy"),vc("download"),vc("delete-left"),vc("dev-tools"),vc("ellipsis"),vc("ellipsis-vertical"),vc("expand"),vc("envelope"),vc("envelope-open"),vc("exclamation-mark"),vc("expand"),vc("feedback"),vc("filter"),vc("floppy"),vc("floppy-disk-pen"),vc("folder"),vc("folder-open"),vc("globe"),vc("group"),vc("hidden"),vc("home"),vc("house"),vc("info"),vc("keyboard"),vc("layout"),vc("link"),vc("list-ul"),vc("lock"),vc("logo"),vc("minimize"),vc("minimize-down"),vc("paper-plane-top"),vc("paperclip"),vc("pause"),vc("pen-line"),vc("pen-to-square"),vc("pin"),vc("play"),vc("pop-in"),vc("pop-in-widget"),vc("pop-out"),vc("power-off"),vc("publish"),vc("refresh"),vc("resize"),vc("restore"),vc("rotate-right"),vc("search"),vc("search-filled"),vc("sleep"),vc("sliders"),vc("snooze"),vc("spinner"),vc("square"),vc("square-arrow-down"),vc("square-arrow-up"),vc("star"),vc("star-full"),vc("sticky-off"),vc("sticky-off-hover"),vc("sticky-on"),vc("sticky-on-hover"),vc("subscribe"),vc("system-close"),vc("system-maximize"),vc("system-minimize"),vc("thumbs-down"),vc("thumbs-up"),vc("trash"),vc("trash-can"),vc("triangle-exclamation"),vc("unlock"),vc("unpin"),vc("up-to-line"),vc("user"),vc("user-gear"),vc("visible"),vc("workspace")),Nc=yc({id:Sc,title:Sc,description:bc(hc()),icon:bc(xc),iconSrc:bc(Sc),contextMenuActions:bc(wc(gc())),type:Sc}),Ic=yc({name:Sc,type:Sc}),Ac=kc(vc("Left"),vc("Right")),Pc=kc(vc("daily"),vc("weekly")),Ec=kc(vc("Sunday"),vc("Monday"),vc("Tuesday"),vc("Wednesday"),vc("Thursday"),vc("Friday"),vc("Saturday")),Tc=yc({customPrefs:bc(gc()),_launchpad_collapsedSections:bc(wc(Sc)),_launchpad_favorites:bc(wc(Nc)),_launchpad_recent:bc(wc(Ic)),_launchpad_isLayoutsPanelOpen:bc(mc()),_launchpad_isCollapsed:bc(mc()),_launchpad_isPinned:bc(mc()),_launchpad_isDocked:bc(mc()),_launchpad_minimizeToTray:bc(mc()),_launchpad_autoCloseStartingAppsAndWorkspaces:bc(mc()),_launchpad_pinnedPosition:bc(Ac),_launchpad_allowDocking:bc(mc()),_launchpad_dockedAlwaysOnTop:bc(mc()),_launchpad_dockedClaimsSpace:bc(mc()),_launchpad_showExtendedArea:bc(mc()),_launchpad_hideLabelsInExtendedArea:bc(mc()),_launchpad_showFavoritesInExtendedArea:bc(mc()),_launchpad_hideFavoritesSection:bc(mc()),_launchpad_showRecentAppsInExtendedArea:bc(mc()),_layouts_restoreLastSaved:bc(mc()),_layouts_saveCurrentOnExit:bc(mc()),_layouts_showUnsavedChangesPrompt:bc(mc()),_layouts_showDeletePrompt:bc(mc()),_downloads_askForEachDownload:bc(mc()),_downloads_location:bc(hc()),_system_scheduleRestart:bc(mc()),_system_scheduleRestartTime:bc(Sc),_system_scheduleRestartFrequency:bc(Pc),_system_scheduleRestartDay:bc(Ec),_system_scheduleShutdown:bc(mc()),_system_scheduleShutdownTime:bc(Sc),_system_scheduleShutdownFrequency:bc(Pc),_system_scheduleShutdownDay:bc(Ec)}),Dc=async e=>{const{io:t,variant:n,text:o,error:i}=e,r=Xl(i);try{if(n===Zl&&t.logger.warn(r?`${o} ${r}`:o),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:o,variant:n,ttl:ec[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},Bc=reactExports.createContext(void 0);function Fc({prefKey:e}){const t=reactExports.useContext(IOConnectContext),n=reactExports.useContext(Bc),o=n?.prefs?.[e],i=n?.isInitialSetupCompleted??!1,[r,s]=reactExports.useState(!i),[u,h]=reactExports.useState(),p=reactExports.useRef(0);reactExports.useEffect(()=>{i&&0===p.current&&s(!1);},[i]);const m=reactExports.useCallback(async n=>{if(!t)return;const o=++p.current;s(!0),h(void 0);const i=async n=>{n&&await Dc({io:t,variant:Zl,text:`Failed to update prefKey "${e}".`,error:n}),o===p.current&&(s(!1),n&&h({message:Xl(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(yl))[e]);}catch(e){return i(e)}else r=n;try{const n=Tc.runWithException({[e]:r});await t.contexts.update(yl,n);}catch(e){return i(e)}await i();},[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:u,isLoading:r,update:m,value:o}}reactExports.createContext(void 0);const $c=n=>{const{General:o,Launchpad:i,Docking:r,ExtendedArea:a,Layouts:s,Downloads:l,System:c}=Ju();return jsxRuntimeExports.jsxs(Ls,{element:qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{})]})},_c=({title:t="General",...n})=>{const{Theme:o}=Ju();return jsxRuntimeExports.jsx(T,{title:t,...n,children:jsxRuntimeExports.jsx(o,{})})},zc=({className:n,title:o="Theme",...i})=>{const{currentTheme:r,selectTheme:a}=Ks(),s=il();return jsxRuntimeExports.jsxs("div",{className:S("flex jc-between ai-center",n),"data-testid":"theme-container",...i,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper","data-testid":"theme-label",children:o}),jsxRuntimeExports.jsxs(ee,{variant:"light","data-testid":"theme-dropdown",children:[jsxRuntimeExports.jsx(ee.Button,{text:r?.displayName??"Dark","data-testid":"theme-dropdown-button"}),jsxRuntimeExports.jsx(ee.Content,{"data-testid":"theme-dropdown-content",children:jsxRuntimeExports.jsx(ee.List,{children:s.map(({displayName:t,name:n})=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>a(n),"data-testid":`theme-dropdown-item-${n}`,children:t},n))})})]})]})},Hc=({prefKey:t,...n})=>{const{isLoading:o,value:i=!1,update:r}=Fc({prefKey:t});return jsxRuntimeExports.jsx(ul,{checked:i,disabled:o,onChange:e=>r(e.target.checked),...n})},jc=({align:t="right",label:n="Minimize to tray",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Il,...o}),Vc=({prefKey:n,options:o,disabled:i,...r})=>{const{isLoading:a,value:s="Select option",update:l}=Fc({prefKey:n});return jsxRuntimeExports.jsxs(ee,{variant:"light",disabled:a||i,...r,children:[jsxRuntimeExports.jsx(ee.Button,{children:s}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{children:o.map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t))})})]})},Wc=({className:n,label:o="Pinned position",...i})=>jsxRuntimeExports.jsx(T,{className:S("io-block-list-gap",n),...i,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(Vc,{className:n,prefKey:Pl,options:["Left","Right"],...i})]})}),Kc=({align:t="right",label:n='Hide "Favorites"',...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Fl,...o}),Uc=({align:t="right",label:n="Allow docking to top",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:El,...o}),Jc=({align:t="right",label:n="Always on top",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Tl,...o}),qc=({align:t="right",label:n="Claim occupied space",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Dl,...o}),Gc=({align:t="right",label:n="Show the extended Launchpad area",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Bl,...o}),Yc=({align:t="right",label:n="Hide labels",...o})=>{const{value:i}=Fc({prefKey:Bl});return jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Ll,disabled:!i,...o})},Qc=({align:t="right",label:n='Show "Favorites"',...o})=>{const{value:i}=Fc({prefKey:Bl});return jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Rl,disabled:!i,...o})},Xc=({align:t="right",label:n='Show "Recent"',...o})=>{const{value:i}=Fc({prefKey:Bl});return jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Ol,disabled:!i,...o})},Zc=({title:n="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:i,LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Ju();return jsxRuntimeExports.jsxs(T,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},eu=({align:t="right",label:n="Save current on exit",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:$l,...o}),tu=({align:t="right",label:n="Show prompt for unsaved changes",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:_l,"data-testid":"layouts-show-unsaved-changes-prompt-toggle-button",...o}),nu=({align:t="right",label:n="Show prompt for deleting",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:zl,"data-testid":"layouts-show-delete-prompt-toggle",...o}),ou=({title:t="Downloads",...n})=>{const{DownloadsLocation:o}=Ju();return jsxRuntimeExports.jsx(T,{title:t,...n,children:jsxRuntimeExports.jsx(o,{})})};function iu({title:n="Downloads"}){const{ItemSearch:o,HeaderButtons:i}=Eu();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(ne,{draggable:!0,children:[jsxRuntimeExports.jsx(ne.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(i,{className:"non-draggable"})]}),jsxRuntimeExports.jsx(o,{})]})}const au=reactExports.createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:!1,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:!1}),su=()=>reactExports.useContext(au);function lu({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=S("io-header-search",n),c=reactExports.useRef(null),{searchQuery:u,setSearch:f,itemsCount:h}=su(),p=u.length>0,m=reactExports.useCallback(()=>{f(""),c.current&&c.current.focus();},[f]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Hs,{ref:c,value:u,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?m:void 0,placeholder:o,onChange:e=>f(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${h} results`})]})}function cu({className:n,...o}){const{MoreButton:i,CloseButton:r,ExternalButton:a}=Eu();return jsxRuntimeExports.jsxs(te,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})}function uu({icon:n="ellipsis-vertical",...o}){const{items:i,clearItems:r,showSettings:a}=su(),s=0===i.length;return jsxRuntimeExports.jsxs(ee,{variant:"light",...o,children:[jsxRuntimeExports.jsx(ee.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsxs(ee.List,{children:[jsxRuntimeExports.jsx(ee.Item,{onClick:e=>(e=>{s?e.stopPropagation():r();})(e),disabled:s,children:"Clear All"}),jsxRuntimeExports.jsx(ee.Item,{onClick:a,children:"Settings"})]})})]})}function du({className:t,icon:n="pop-out",...o}){const i=reactExports.useContext(IOConnectContext),r=reactExports.useCallback(()=>{hl.startApplication(i,"io-connect-download-manager").catch(e=>{console.error("Failed to open Download Manager",e);});},[i]);return jsxRuntimeExports.jsx(N,{className:S("io-dm-compact-mode-only",t),icon:n,variant:"circle",size:"32",onClick:r,...o})}function fu({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const a=reactExports.useContext(IOConnectContext);return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):pl.closeWindow(a).catch(e=>{console.error("Failed to close window:",e);});},...r})}function hu(e,t=!1,n=!1,o=!1){const i=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:o?n?`${r} ${i}`:`${r} ${i} at ${s}:${c}`:n?`${r} ${i}, ${a}`:`${r} ${i}, ${a} at ${s}:${c}`}function pu(e,t={showTime:!0}){const n=new Date(1e3*e),o=new Date,i=Math.round((o-n)/1e3),r=Math.round(i/60),a=o.toDateString()===n.toDateString(),s=new Date(o.setDate(o.getDate()-1)).toDateString()===n.toDateString(),l=o.getFullYear()===n.getFullYear();return t.showTime?i<5?"Just Now":i<60?`${i} seconds ago`:i<90?"about a minute ago":r<60?`${r} minutes ago`:a?hu(n,"Today",!1,!0):s?hu(n,"Yesterday",!1,!0):l?hu(n,!1,!1,!0):hu(n):a?"Today":s?"Yesterday":l?hu(n,!1,!0,!0):hu(n,!1,!0)}function mu({className:t,...n}){const o=S("io-dm-body","io-panel-body",t),{DownloadListEmpty:i,ItemGroup:r,Item:a}=Eu(),{items:s,searchQuery:l,setCount:c,sortItems:d}=su(),h=d(s),p=Us(l),m=reactExports.useMemo(()=>h.filter(e=>e.displayInfo.filename.toLowerCase().includes(p.toLowerCase())||e.displayInfo.url.toLowerCase().includes(p.toLowerCase())),[h,p]),g=reactExports.useMemo(()=>m.map(e=>({...e,displayInfo:{...e.displayInfo,startTime:pu(e.displayInfo.startTime,{showTime:!1})}})),[m]),v=reactExports.useMemo(()=>Object.values(g.reduce((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e),{})),[g]);return reactExports.useEffect(()=>{c(m.length);},[m,c]),jsxRuntimeExports.jsx(Ls,{elementProps:{className:o,...n},children:v&&0!==v.length?v.map(t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map(t=>jsxRuntimeExports.jsx(a,{item:t},t.id))},t[0].id??"")):jsxRuntimeExports.jsx(i,{})})}function gu({className:n,icon:o="download",text:i="No downloads to display.",...r}){const a=S("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(x,{variant:o}),jsxRuntimeExports.jsx("p",{children:i})]})}function vu({className:n,title:o,children:i,...r}){const a=S("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[o&&jsxRuntimeExports.jsx("p",{className:"io-dm-items-group-title",children:o}),i]})}function yu({className:o,item:i,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=Eu(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:h,speed:p,timeRemaining:m}=i.displayInfo;if(!i)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=S("io-dm-item",i.displayInfo.state&&[c],o);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:i.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:h,speed:p,timeRemaining:m}),jsxRuntimeExports.jsx(l,{itemID:i.id,state:c})]})}function wu({bytesReceived:t=0,bytesTotal:n=0,...o}){const i=reactExports.useCallback(()=>t&&n?Math.round(t/n*100):0,[t,n]);return jsxRuntimeExports.jsx(Xo,{value:i(),...o})}function bu({className:n,itemID:o,filename:i,state:r,pauseResume:s,showInFolder:l,cancel:c,remove:u,...d}){const f=S("io-dm-item-header",n),{pauseResumeItem:h,showItemInFolder:p,cancelItem:m,removeItem:g}=su(),v="progressing"===r||"paused"===r,y="interrupted"===r||"cancelled"===r,w=v?"Cancel Download":"Remove Download",b=c??m,k=u??g,C=function(e,t,n,o){return "paused"===e||"progressing"===e?{statusIcon:"paused"===e?"play":"pause",onStatusActionClick:()=>n(t)}:"completed"===e?{statusIcon:"folder",onStatusActionClick:()=>o(t)}:null}(r,o,s??h,l??p),x=reactExports.useCallback(()=>{v?b(o):k(o);},[v,b,o,k]);return jsxRuntimeExports.jsxs("div",{className:f,...d,children:[jsxRuntimeExports.jsx(E,{text:i,style:{textDecoration:y?"line-through":"none"}}),jsxRuntimeExports.jsxs(te,{children:[C&&jsxRuntimeExports.jsx(N,{icon:C.statusIcon,iconSize:"12",onClick:C.onStatusActionClick,className:"io-dm-compact-mode-only"}),jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"12",title:w,onClick:x})]})]})}function ku({className:n,state:o,url:i,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=S("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:i}),(h=o,"cancelled"===h||"interrupted"===h||"completed"===h?null:jsxRuntimeExports.jsx(wu,{variant:"paused"===h?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===o?`${d(r??0)} - Done`:"cancelled"===o||"interrupted"===o?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let o="";return t>0&&(o+=`${t} hour${t>1?"s":""}, `),n>0&&(o+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===o)&&(o+=`${e} sec${1===e?"":"s"}`),`${o.trim()} left`})(l)??0}`})]});var f,h;}const Cu={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Su({className:n,variant:o,text:i}){const r=S("io-dm-item-status",`io-dm-item-status-${o}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[o&&jsxRuntimeExports.jsx(x,{variant:Cu[o],className:"icon-severity",size:"10"}),i&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:i})]})}function xu({className:o,itemID:i,state:r,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=S("io-dm-item-footer",o),{pauseResumeItem:f,showItemInFolder:h,cancelItem:p}=su(),m=reactExports.useCallback(e=>{s?s(e):f(e);},[s,f]),g=reactExports.useCallback(e=>{l?l(e):h(e);},[l,h]),v=reactExports.useCallback(e=>{c?c(e):p(e);},[c,p]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(r){case"progressing":return jsxRuntimeExports.jsxs(te,{align:"right",children:[jsxRuntimeExports.jsx(te.Button,{variant:"primary",text:"Pause",onClick:()=>m(i)}),jsxRuntimeExports.jsx(te.Button,{variant:"link",text:"Cancel",onClick:()=>v(i)})]});case"paused":return jsxRuntimeExports.jsx(te,{align:"right",children:jsxRuntimeExports.jsx(te.Button,{variant:"primary",text:"Resume",onClick:()=>m(i)})});case"completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Su,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(te,{align:"right",children:jsxRuntimeExports.jsx(te.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(i)})})]});case"cancelled":return jsxRuntimeExports.jsx(Su,{variant:"warning",text:"Cancelled"});case"interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Su,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(te,{align:"right",children:jsxRuntimeExports.jsx(te.Button,{variant:"primary",text:"Retry",onClick:()=>m(i)})})]});default:return null}})()})}function Nu({className:n,title:o="Download Settings",...i}){const r=S("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=su();return jsxRuntimeExports.jsxs(Yo,{className:r,...i,children:[jsxRuntimeExports.jsxs(Yo.Header,{children:[jsxRuntimeExports.jsx(Yo.Header.Title,{size:"large",text:o,tag:"h1"}),jsxRuntimeExports.jsx(Yo.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{className:"non-draggable",variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Yo.Body,{children:jsxRuntimeExports.jsxs(te,{children:[jsxRuntimeExports.jsxs(ee,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(ee.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{children:d.map((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{l(t);},children:t},t))})})]}),jsxRuntimeExports.jsx(L,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const Iu={Header:iu,ItemSearch:lu,HeaderButtons:cu,MoreButton:uu,ExternalButton:du,CloseButton:fu,Body:mu,DownloadListEmpty:gu,ItemGroup:vu,Item:yu,ItemProgress:wu,ItemHeader:bu,ItemBody:ku,ItemFooter:xu,Settings:Nu},Au=reactExports.createContext(Iu),Pu=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Iu,...n}),[n]);return jsxRuntimeExports.jsx(Au.Provider,{value:o,children:t})});Pu.displayName="ComponentsStore";const Eu=()=>reactExports.useContext(Au);const Bu=({className:n,label:o="Location",...i})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=su();return jsxRuntimeExports.jsxs(T,{className:S("io-preferences-download-section",n),...i,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(L,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Lu=({align:t="right",label:n="Ask where to save each file before downloading",...o})=>jsxRuntimeExports.jsx(Hc,{align:t,label:n,prefKey:Hl,...o}),Ru=({title:n="System",...o})=>{const{SystemRestartSection:i,SystemShutdownSection:r}=Ju();return jsxRuntimeExports.jsxs(T,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{})]})},Fu="T42.GD.Execute",Ou=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Mu=(e,t)=>e in t;function $u({time:e,frequency:t,day:n}){const[o,i]=e.split(":"),r=Number.parseInt(o,10),a=Number.parseInt(i,10);let s="*";return "weekly"===t&&n&&(s=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!Mu(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${a} ${r} * * ${s}`}function _u(e){const t=reactExports.useContext(IOConnectContext),{value:n,update:o}=Fc({prefKey:zu(e)}),{value:i,update:r}=Fc({prefKey:zu(e,"Time")}),{value:s,update:c}=Fc({prefKey:zu(e,"Frequency")}),{value:u,update:d}=Fc({prefKey:zu(e,"Day")}),h=reactExports.useCallback(async()=>{try{await t.interop.invoke(Fu,{command:`cancel-${e}`});}catch(e){console.error(e);}},[t,e]),p=reactExports.useCallback(async()=>{try{const n=$u({time:i??"12:00",frequency:s??"daily",day:"weekly"===s?u:"*"});await t.interop.invoke(Fu,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}},[t,e,i,s,u]);reactExports.useEffect(()=>{t&&n&&p();},[t,n,i,s,u,p]);return {enabled:n??!1,time:i??"12:00",frequency:s??"daily",day:u??"Monday",setEnabled:async e=>{e||await h();try{await o(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await r(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await d(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,Ou.includes(t))try{await d(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function zu(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function Hu({className:n,variant:o,...i}){const r=S("io-block-list-gap",o,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:h}=_u(o);return jsxRuntimeExports.jsxs(T,{className:r,...i,children:[jsxRuntimeExports.jsx(ul,{label:`Schedule ${o}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsx("div",{className:"io-control-input io-control-leading-icon direction-up",children:jsxRuntimeExports.jsx("input",{type:"time",className:"io-input",value:s,onChange:e=>d(e.target.value)})}),jsxRuntimeExports.jsxs(Wo,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:!0,children:[jsxRuntimeExports.jsx(Wo.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(Wo.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(Wo,{text:c,icon:"chevron-down",iconRight:!0,children:Ou.map(t=>jsxRuntimeExports.jsx(Wo.Item,{onClick:()=>h(t),children:t},t))})]})]})}function ju({className:t,...n}){return jsxRuntimeExports.jsx(Hu,{...n,className:t,variant:"restart"})}function Vu({className:t,...n}){return jsxRuntimeExports.jsx(Hu,{...n,className:t,variant:"shutdown"})}const Wu={Body:$c,General:_c,Theme:zc,Launchpad:({title:n="Launchpad",...o})=>{const{MinimizeToTray:i,PinnedPosition:r,HideFavoritesFromLaunchpad:a}=Ju();return jsxRuntimeExports.jsxs(T,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},MinimizeToTray:jc,PinnedPosition:Wc,HideFavoritesFromLaunchpad:Kc,Docking:({title:n="Docking",...o})=>{const{AllowDocking:i,DockedAlwaysOnTop:r,DockedClaimsSpace:a}=Ju();return jsxRuntimeExports.jsxs(T,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},AllowDocking:Uc,DockedAlwaysOnTop:Jc,DockedClaimsSpace:qc,ExtendedArea:({title:n="Extended Area",...o})=>{const{ShowExtendedArea:i,HideLabelsInExtendedArea:r,ShowFavoritesInExtendedArea:a,ShowRecentAppsInExtendedArea:s}=Ju();return jsxRuntimeExports.jsxs(T,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},ShowExtendedArea:Gc,HideLabelsInExtendedArea:Yc,ShowFavoritesInExtendedArea:Qc,ShowRecentAppsInExtendedArea:Xc,Layouts:Zc,LayoutsSaveCurrentOnExit:eu,LayoutsShowUnsavedChangesPrompt:tu,LayoutsShowDeletePrompt:nu,Downloads:ou,DownloadsLocation:Bu,DownloadsAskForEachDownload:Lu,System:Ru,SystemRestartSection:ju,SystemShutdownSection:Vu},Ku=reactExports.createContext(Wu),Uu=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Wu,...n}),[n]);return jsxRuntimeExports.jsx(Ku.Provider,{value:o,children:t})});Uu.displayName="PreferencesPanelComponentsStoreProvider";const Ju=()=>reactExports.useContext(Ku);function Qu({className:n,title:o="General",...i}){const r=S("io-notifications-settings-panel-general",n),{AllowNotifications:a,AllowNotificationToasts:s,ShowNotificationBadge:l,CloseNotificationOnClick:c,PanelAutoHide:u,HideToastsAfter:d}=Od(),f=Gs();return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(T,{title:o,children:[f&&jsxRuntimeExports.jsx(a,{}),f&&jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),f&&jsxRuntimeExports.jsx(u,{}),f&&jsxRuntimeExports.jsx(c,{}),f&&jsxRuntimeExports.jsx(d,{})]})})}function Xu(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function o(n,o){var i=n instanceof Error?n:new Error(n);if(t)t(i);else {var r='[ERROR] callback-registry: User callback for key "'+o+'" failed: '+i.stack;if(e)switch(e.errorHandling){case"log":return console.error(r);case"silent":return;case"throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,i){var r=n[e];return r||(r=[],n[e]=r),r.push(t),i&&setTimeout(function(){i.forEach(function(i){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(i)?t.apply(void 0,i):t.apply(void 0,[i]);}catch(t){o(t,e);}});},0),function(){var o=n[e];o&&(o=o.reduce(function(e,n,o){return n===t&&e.length===o||e.push(n),e},[]),0===o.length?delete n[e]:n[e]=o);}},execute:function(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach(function(n){try{var i=n.apply(void 0,t);a.push(i);}catch(t){a.push(void 0),o(t,e);}}),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}Xu.default=Xu;b(Xu);function td(e){const t=reactExports.useContext(IOConnectContext),n=Gs(),[o,i]=reactExports.useState([]),[r,s]=reactExports.useState(0),d="Platform",h=reactExports.useCallback((e="asc")=>{if(null===n)return [];const t=[...o].sort((t,n)=>{const o=(t.title??t.name).toLowerCase(),i=(n.title??n.name).toLowerCase();return "asc"===e?o.localeCompare(i):i.localeCompare(o)});if(!n){const e=t.findIndex(e=>e.name===d);if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t},[o,n]),p=reactExports.useMemo(()=>h("asc"),[h]),m=reactExports.useMemo(()=>h("desc"),[h]);reactExports.useEffect(()=>{if(null===n||n)return;const e={title:"System",name:d,hidden:!1,userProperties:{hidden:!1}};i(t=>t.some(t=>t.name===e.name)?t:[...t,e]);},[n]),reactExports.useEffect(()=>{if(!t)return;let e,n,o,r=!1;const a=e=>{i(t=>[...t.filter(t=>t.name!==e.name),{title:e.title??e.name,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]);},s=e=>{i(t=>t.filter(t=>t.name!==e.name));},l=e=>{i(t=>t.find(t=>t.name===e.name)?t.map(t=>t.name===e.name?{...t,title:e.title??t.title,hidden:e.hidden??t.hidden,userProperties:e.userProperties??t.userProperties}:t):t);};return (async()=>{const c=await hl.getApplications(t);if(r)return;i(e=>{const t=new Map;return e.forEach(e=>t.set(e.name,e)),c.forEach(e=>{t.set(e.name,{title:e.title??e.name,name:e.name,hidden:e.hidden,userProperties:e.userProperties});}),Array.from(t.values())});const[u,d,f]=await Promise.all([hl.onAppAdded(t,a),hl.onAppRemoved(t,s),hl.onAppChanged(t,l)]);if(r)return u?.(),d?.(),void f?.();e=u,n=d,o=f;})().catch(e=>{console.error("Failed to initialize apps",e);}),()=>{r=!0,e?.(),n?.(),o?.();}},[t]);return {apps:reactExports.useMemo(()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const l=o.map(e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}});return s(a),l},[e,o]),allowedApps:r,sortedAppsAsc:p,sortedAppsDesc:m,sortAppsAlphabetically:h}}const sd=reactExports.createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:!1,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),ld=()=>reactExports.useContext(sd);function cd({label:t="Allow notifications",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs(),l=reactExports.useCallback(e=>{r({enabledNotifications:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:l,checked:i.enabledNotifications??!1,...o}):null}function ud({label:t="Allow notification toasts",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({enabledToasts:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:c,checked:i.enabledToasts??!1,disabled:l,...o}):null}function dd({label:t="Show notification badge",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs()&&!i.enabledNotifications,l=reactExports.useCallback(e=>{r({showNotificationBadge:e.target.checked});},[r]);return jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:l,checked:i.showNotificationBadge??!1,disabled:s,...o})}function fd({label:t="Close notification on click",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({closeNotificationOnClick:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:c,checked:i.closeNotificationOnClick??!1,disabled:l,...o}):null}function hd({label:t="Auto hide panel",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs(),l=reactExports.useCallback(e=>{r({autoHidePanel:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:l,checked:i.autoHidePanel??!1,...o}):null}const pd=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",md=e=>{const t=Math.floor(e/60),n=e%60,o=pd(t,"minute"),i=pd(n,"second");return o+(o&&i?" ":"")+i};function gd({className:n,title:o="Hide toasts after",items:i=[15,30,45,60],...r}){const s=S("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=ld(),u=Gs(),d=u&&!l.enabledNotifications,f=reactExports.useCallback((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});},[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(ee,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(ee.Button,{text:md((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{f(t);},children:md(t)},t))})})]})]}):null}function vd({className:n,title:o="Stacking",...i}){const r=S("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=Od();return Gs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(T,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function yd({label:t="Allow toast stacking",align:n="right",...o}){const{settings:i,saveSetting:r}=ld(),s=Gs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({toastStacking:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(ul,{label:t,align:n,onChange:c,checked:i.toastStacking??!1,disabled:l,...o}):null}const wd={application:"Application",severity:"Priority"},bd=Object.fromEntries(Object.entries(wd).map(([e,t])=>[t,e]));function kd({className:n,title:o="Group by",...i}){const r=S("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=ld(),c=Gs(),u=c&&!s.enabledNotifications,d=reactExports.useCallback((e="severity")=>{s.stackBy!==e&&l({stackBy:e.toLowerCase()});},[s.stackBy,l]);if(!c)return null;const f=Object.values(wd);return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:S("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(ee,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(ee.Button,{text:wd[s.stackBy??"severity"]}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",children:f.map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{const e=bd[t];d(e);},children:t},t))})})]})]})}function Cd({className:n,title:o="Placement",...i}){const r=S("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=Od();return Gs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(T,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}const Sd=e=>e.replace(/(^|-)\w/g,e=>e.toUpperCase().replace("-"," "));function xd({className:n,title:o="Panel position",...i}){const r=S("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=ld(),c=Gs(),u=reactExports.useCallback(e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(ee,{variant:"light",children:[jsxRuntimeExports.jsx(ee.Button,{text:s.placement?.panel?Sd(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",children:["Right","Left"].map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function Nd({className:n,title:o="Toasts position",...i}){const r=S("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=ld(),c=Gs(),u=reactExports.useCallback(e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(ee,{variant:"light",children:[jsxRuntimeExports.jsx(ee.Button,{text:s.placement?.toasts?Sd(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function Id({className:t,title:n="Snooze",...o}){const i=S("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=Od(),{settings:a}=ld();return Gs()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsx(T,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function Ad({className:n,title:o="Default duration",items:i=[60,120,180,300],...r}){const s=S("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=ld(),u=Gs(),d=u&&!l.enabledNotifications,f=reactExports.useCallback((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});},[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:S("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(ee,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(ee.Button,{text:md((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>{f(t);},children:md(t)},t))})})]})]}):null}function Pd({className:n,title:o,...i}){const r=S("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=Od(),{sortAppsAlphabetically:u}=td(),d=Gs(),f=u(),h="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(T,{title:o??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:h,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:h,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map(n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:h,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name))]})})}function Ed({label:t="All apps",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=ld(),l=Gs()&&!i.enabledNotifications,c=reactExports.useCallback(e=>{s({subscribe:e.target.checked});},[s]);return jsxRuntimeExports.jsx(ul,{align:n,label:t,onChange:c,checked:(r.sourceFilter?.allowed?.includes("*")&&0===r.sourceFilter?.blocked?.length)??!1,disabled:l,...o})}function Td({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=ld(),u=Gs()&&!s.enabledNotifications,d=reactExports.useCallback((e,t)=>{const n={...l.sourceFilter},o=n.allowed?.indexOf("*");"number"==typeof o&&o>-1&&(n.allowed?.splice(o,1),r.forEach(e=>{e.name!==t.name&&n.allowed?.push(e.name);})),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter(e=>e!==t.name)):(n.allowed=n.allowed?.filter(e=>e!==t.name),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);},[r,l.sourceFilter,c]);return jsxRuntimeExports.jsx(ul,{id:`subscribe-${o.name}`,label:t,align:n,onChange:e=>d(e.target.checked,o),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(o.name)||l.sourceFilter?.allowed?.includes(o.name))??!1,disabled:u,...i})}function Dd({label:t="Mute all",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=ld(),l=Gs(),c=l&&(!i.enabledNotifications||-1===r.sourceFilter?.allowed?.indexOf("*")),u=reactExports.useCallback(e=>{s({mute:e.target.checked});},[s]);return l?jsxRuntimeExports.jsx(ul,{align:n,label:t,onChange:u,checked:r.sourceFilter?.muted?.includes("*")??!1,disabled:c??!1,...o}):null}function Bd({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=ld(),u=Gs(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(o.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(o.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=reactExports.useCallback((e,t)=>{const n={...l.sourceFilter},o=n?.muted?.indexOf("*");"number"==typeof o&&o>-1&&(n.muted?.splice(o,1),r.forEach(e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);})),e?n.muted?.push(t.name):n.muted=n.muted?.filter(e=>e!==t.name),c(n);},[r,l.sourceFilter,c]);return !u||o.hidden?null:jsxRuntimeExports.jsx(ul,{id:`mute-${o.name}`,label:t,align:n,onChange:e=>f(e.target.checked,o),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(o.name))??!1,disabled:d??!1,...i})}const Ld={Body:n=>{const{General:o,Placement:i,Stacking:r,Snooze:a,Subscriptions:s}=Od();return jsxRuntimeExports.jsxs(Ls,{element:qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:Qu,AllowNotifications:cd,AllowNotificationToasts:ud,ShowNotificationBadge:dd,CloseNotificationOnClick:fd,PanelAutoHide:hd,HideToastsAfter:gd,Stacking:vd,ToastStacking:yd,ToastStackBy:kd,Placement:Cd,PlacementPanel:xd,PlacementToasts:Nd,Snooze:Id,SnoozeDuration:Ad,Subscriptions:Pd,SubscribeAll:Ed,SubscribeApp:Td,SubscribeMuteAll:Dd,SubscribeMuteApp:Bd},Rd=reactExports.createContext(Ld),Fd=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Ld,...n}),[n]);return jsxRuntimeExports.jsx(Rd.Provider,{value:o,children:t})});Fd.displayName="NotificationsSettingsPanelComponentsStoreProvider";const Od=()=>reactExports.useContext(Rd),_d=({name:n,value:o})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:o})]}),zd=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("div",{className:S("io-profile-section-body",n),children:[i&&jsxRuntimeExports.jsx(E,{className:"io-profile-section-title",text:i}),o.map(({name:t,value:n})=>jsxRuntimeExports.jsx(_d,{name:t,value:n},t))]}),Hd=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("section",{className:S("io-profile-section",n),children:[jsxRuntimeExports.jsx(zd,{items:o,title:i}),jsxRuntimeExports.jsx(W,{className:"mt-8"})]}),jd=({title:t="License",...n})=>jsxRuntimeExports.jsx(Hd,{title:t,...n}),Vd=({title:t="Version",...n})=>jsxRuntimeExports.jsx(Hd,{title:t,...n}),Wd=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(Hd,{title:t,...n}),Kd=({className:n})=>{const o=qs()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:S("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:o}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[o,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},Ud=({avatarInitials:n=(qs()?"CD":"CB"),className:o,items:i,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:S("io-profile-section",o),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(zd,{className:"mt-12",items:i,title:a})]}),r&&jsxRuntimeExports.jsx(L,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(W,{className:"mt-8"})]}),Jd={LicenseSection:jd,ProductsInfoSection:Vd,PluginsSection:Wd,Trademark:Kd,UserSection:Ud},qd=reactExports.createContext(Jd),Gd=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Jd,...n}),[n]);return jsxRuntimeExports.jsx(qd.Provider,{value:o,children:t})});Gd.displayName="ProfilePanelComponentsStoreProvider";document.querySelector("#root")??document.body;reactExports.createContext({theme:"dark"});const yf="var(--io-neutrals-0)",wf="var(--io-neutrals-900)";function bf(e){let t,n,o;if(e.startsWith("#")){let i=e.slice(1);3===i.length&&(i=i.split("").map(e=>e+e).join("")),t=parseInt(i.substring(0,2),16),n=parseInt(i.substring(2,4),16),o=parseInt(i.substring(4,6),16);}else {if(!e.startsWith("rgb")){const t=document.createElement("canvas").getContext("2d");if(!t)return wf;t.fillStyle=e;return bf(t.fillStyle)}{const i=e.match(/\d+/g)?.map(Number);if(!i||i.length<3)return wf;[t,n,o]=i;}}return (.2126*t+.7152*n+.0722*o)/255>.5?wf:yf}function kf({className:t,channel:n,...o}){const i=S("io-channel-badge",t),r=reactExports.useMemo(()=>bf(n.color),[n.color]);return jsxRuntimeExports.jsx("div",{className:i,style:{color:r,backgroundColor:n.color},"data-testid":`channel-selector-badge-${n.color}`,...o,children:jsxRuntimeExports.jsx("span",{className:"io-channel-selector-badge-label","data-testid":"channel-selector-label",children:n.label})})}function Cf(){return jsxRuntimeExports.jsx(x,{variant:"check","data-testid":"channel-selector-channel-selected"})}function Sf({channel:o,handleChannelRestricted:i,lockedChannelRestriction:r}){const a=(e,t)=>n=>{n.stopPropagation(),D(n)&&(n.preventDefault(),t||i({...o,[e]:!o[e]}));};return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:o.isSelected&&jsxRuntimeExports.jsx("span",{"data-testid":"channel-selector-channel-selected",children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-publish-toggle-container",children:jsxRuntimeExports.jsx(ul,{label:"Publish",checked:o.write,onChange:()=>{i({...o,write:!o.write});},onKeyDown:a("write",!o.isSelected||r?.write),onClick:e=>e.stopPropagation(),disabled:!o.isSelected||r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-subscribe-toggle-container",children:jsxRuntimeExports.jsx(ul,{label:"Subscribe",checked:o.read,onChange:()=>{i({...o,read:!o.read});},onKeyDown:a("read",!o.isSelected||r?.read),disabled:!o.isSelected||r?.read})})]})}const xf=reactExports.createContext({});function Nf({channel:t,isSelected:n,onChannelSelect:o,onChannelRestrict:i,...r}){const{variant:s,selectedChannels:c,lockedChannelRestrictions:u}=reactExports.useContext(xf),d=n||t.isSelected||c?.includes(t),f=u?.find(e=>e.name===t.name),h=reactExports.useCallback(()=>o?.({...t,isSelected:!d}),[t,o,d]),p=reactExports.useCallback(e=>{const n=e.target;n.closest(".io-toggle")||n.classList.contains("io-toggle")||D(e)&&(e.preventDefault(),o?.({...t,isSelected:!d}));},[t,o,d]),m=reactExports.useCallback(e=>{i?.(e);},[i]);return jsxRuntimeExports.jsx(_,{prepend:jsxRuntimeExports.jsx(kf,{channel:t}),append:"single"===s||"multi"===s?d&&jsxRuntimeExports.jsx(Cf,{}):jsxRuntimeExports.jsx(Sf,{channel:t,handleChannelRestricted:m,lockedChannelRestriction:f}),isSelected:d,onClick:h,onKeyDown:p,...r,children:t.name},t.name)}function If({variant:t,onVariantChange:n,disabled:o=!1}){const i="directionalSingle"===t||"directionalMulti"===t,r=reactExports.useCallback(()=>{n?.(!i);},[i,n]),s=reactExports.useCallback(e=>{e.stopPropagation();},[]),l=reactExports.useCallback(e=>{e.stopPropagation(),D(e)&&(e.preventDefault(),o||r());},[o,r]);return jsxRuntimeExports.jsx(ul,{label:"Directional",align:"right",checked:i,onChange:r,onClick:s,onKeyDown:l,disabled:o,"data-testid":`channel-selector-toggle-${t}`})}const Af=reactExports.forwardRef(({className:n,variant:o="single",variantToggle:i=!1,channels:r=[],lockedChannelRestrictions:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:c,...d},f)=>{const h=S("io-list-channels","io-channel-selector-panel",("directionalSingle"===o||"directionalMulti"===o)&&"io-list-channels-directional io-channel-selector-panel-directional",n),p=reactExports.useMemo(()=>({variant:o,selectedChannels:r.filter(e=>e.isSelected),lockedChannelRestrictions:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:c}),[r,o,a,s,l,c]);return jsxRuntimeExports.jsx(xf.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:h,ref:f,children:jsxRuntimeExports.jsxs(J,{...d,children:[jsxRuntimeExports.jsx(J.ItemTitle,{"data-testid":"channel-selector-title",append:i&&jsxRuntimeExports.jsx(If,{variant:o,onVariantChange:s}),children:{single:"Select Channel",directionalSingle:"Select Directional Channel",multi:"Select Channels",directionalMulti:"Select Directional Channels"}[o]}),r?.map(t=>jsxRuntimeExports.jsx(Nf,{channel:t,isSelected:t.isSelected,onChannelSelect:l,onChannelRestrict:c,"data-testid":`channel-selector-channel-${t.name}`},t.name))]})})})});Af.displayName="ChannelSelector";const Pf=reactExports.forwardRef(({className:t,title:n,ariaLabel:o,onClick:i,onKeyDown:r,children:a,disabled:s=!1,...l},c)=>jsxRuntimeExports.jsx("div",{ref:c,className:S(t,{disabled:s}),title:n,role:"button",tabIndex:s?-1:0,"aria-label":o,"aria-disabled":s,onClick:e=>{!s&&i&&i(e);},onKeyDown:e=>{!s&&r&&r(e);},...l,children:a}));Pf.displayName="ChannelSelectorButtonWrapper";function Lf({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:o,isButtonDisabled:i,onButtonClick:r}){return jsxRuntimeExports.jsx(te,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map((t,a)=>{const{id:s,text:l,variant:c}=t,u=o(s);return jsxRuntimeExports.jsx(L,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:i(s),onClick:()=>r(t),variant:c,children:l},s)})})}function Rf({actionButtons:n,children:o,onCompletion:i,size:r,title:a=(qs()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]}){const{actionButtonElementsRefs:l,autofocusButtonId:f,hasAutofocusButtonLostInitialFocus:h}=(e=>{const t=reactExports.useRef([]),n=reactExports.useMemo(()=>e.find(e=>e.autofocus)?.id??null,[e]),o=reactExports.useRef(n),[i,r]=reactExports.useState(!o.current);return reactExports.useLayoutEffect(()=>{if(i)return;if(n!==o.current)return void r(!0);const e=t.current.find(e=>e?.id===n);if(!e)return;e.focus();const a=()=>{r(!0);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}},[n,i]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:i}})(n),m=()=>{i({isClosed:!0});},g={...r};return jsxRuntimeExports.jsxs(se,{className:"io-dialog-template",closeFn:m,isOpen:!0,onCancel:e=>{e.preventDefault(),m();},onKeyDown:e=>{!D(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||i({isEnterPressed:!0});},style:g,title:a,draggable:!0,children:[jsxRuntimeExports.jsx(se.Body,{children:o}),jsxRuntimeExports.jsx(se.Footer,{children:jsxRuntimeExports.jsx(Lf,{actionButtonElementsRefs:l,actionButtons:n,isAutofocusButton:e=>f===e&&!h,isButtonDisabled:e=>s.some(t=>t.disabledButtonIds.some(t=>t===e)),onButtonClick:({id:e,text:t})=>{i({responseButtonClicked:{id:e,text:t}});}})})]})}function Ff({children:t}){return jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t})}function Of({onCompletion:n,size:o,variables:i}){const{actionButtons:r,heading:a,text:s,title:l}=i;return jsxRuntimeExports.jsx(Rf,{actionButtons:r,onCompletion:n,size:o,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Ff,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})}function Mf({onCompletion:n,size:o,variables:i}){const{actionButtons:r,checkbox:s,heading:l,text:u,title:d}=i,[f,h]=reactExports.useState(s.initialValue),p=reactExports.useCallback(()=>h(e=>!e),[]),m=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(Rf,{actionButtons:r,onCompletion:e=>n({...e,inputs:m}),size:o,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Ff,{children:l}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(Vs,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:p})]})}function $f({onCompletion:n,size:o,variables:i}){const{actionButtons:r,heading:a,input:s,title:l}=i,[u,f]=reactExports.useState(s.initialValue??""),h=reactExports.useRef(null),m=(g=u,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:u}];return reactExports.useLayoutEffect(()=>{h.current?.select();},[]),jsxRuntimeExports.jsxs(Rf,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:o,title:l,validationErrors:m?[m]:[],children:[jsxRuntimeExports.jsx(Ff,{children:a}),jsxRuntimeExports.jsx(Hs,{"data-testid":`io-dialog-input-${s.id}`,ref:h,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:m?.message,id:s.id,label:s.label,name:s.id,onChange:e=>f(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}const _f=hc().where(e=>e.length>0,"Expected a non-empty string"),zf=pc().where(e=>e>=0,"Expected a non-negative number"),Hf=yc({width:zf,height:zf}),jf=gc().andThen(e=>((e,t)=>{const n=typeof e;return "function"===n?gc():Cc(`The argument provided as "${t}" must be a function, received: ${n}`)})(e,"onCompletion")),Vf=yc({autofocus:bc(mc()),id:_f,text:_f,variant:kc(vc("default"),vc("primary"),vc("critical"),vc("outline"),vc("link"))}),Wf=yc({disabledButtonIds:wc(_f),errorMessage:_f,regexPattern:_f}),Kf=yc({actionButtons:wc(Vf),heading:hc(),text:hc(),title:bc(hc())}),Uf=yc({templateName:vc("noInputsConfirmationDialog"),onCompletion:jf,size:bc(Hf),variables:Kf}),Jf=yc({actionButtons:wc(Vf),checkbox:yc({id:_f,initialValue:bc(mc()),label:bc(hc())}),heading:hc(),text:hc(),title:bc(hc())}),qf=yc({templateName:vc("singleCheckboxDialog"),onCompletion:jf,size:bc(Hf),variables:Jf}),Gf=yc({actionButtons:wc(Vf),heading:hc(),input:yc({id:_f,initialValue:bc(hc()),label:bc(hc()),placeholder:bc(hc()),validation:bc(Wf)}),title:bc(hc())}),Yf=yc({templateName:vc("singleTextInputDialog"),onCompletion:jf,size:bc(Hf),variables:Gf});[{name:"noInputsConfirmationDialog",Dialog:Of,validate:Uf.runWithException},{name:"singleCheckboxDialog",Dialog:Mf,validate:qf.runWithException},{name:"singleTextInputDialog",Dialog:$f,validate:Yf.runWithException}];reactExports.createContext({config:{message:""},theme:"dark",setResult:()=>{}});const dh={env:"",region:"",version:"",buildVersion:"",theme:"",isError:!1,mailingList:"",createJiraTicket:!0,sendEmail:!1,attachments:[],applicationTitle:"",allowEditRecipients:!0,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:!1,context:{},technicalInfo:"",sendEmailClient:"Outlook"};const ph=reactExports.createContext({config:dh,onThemeChanged:()=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:()=>{},showMailingList:!0,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:!1,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:!1,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),mh=()=>reactExports.useContext(ph);function gh({...n}){const{config:o,close:i}=mh(),{applicationTitle:r}=o;return jsxRuntimeExports.jsxs(ne,{draggable:!0,...n,children:[jsxRuntimeExports.jsx(ne.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(ne.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(ne.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>i()})})]})}function vh({className:n,handleSubmit:o,...i}){const r=S("io-panel-body",n),{config:a,submitFeedback:s}=mh(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:h,MailListField:p}=Fh(),m=o??s,g=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:m,...i,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:g})}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:!0}),jsxRuntimeExports.jsx(d,{readOnly:!0}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(h,{})]})}function yh({...n}){const{FooterButtons:o}=Fh(),{openUrl:i,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=mh();return jsxRuntimeExports.jsx(re,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(T,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Uo,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(T,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),i(s);},children:s})]}),jsxRuntimeExports.jsx(o,{})]})})}function wh({className:t,...n}){const{CloseButton:o}=Fh(),{close:i}=mh(),r=S("non-draggable",t);return jsxRuntimeExports.jsx(te,{className:r,...n,children:jsxRuntimeExports.jsx(o,{onClick:()=>i()})})}function bh({className:n,...o}){const{SubmitButton:i,CancelButton:r,CloseButton:a}=Fh(),{close:s,submitCompleted:l}=mh();return l?jsxRuntimeExports.jsx(te,{className:n,...o,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(te,{className:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function kh({text:t="Submit",...n}){return jsxRuntimeExports.jsx(L,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function Ch({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(L,{variant:"link",text:t,...n})}function Sh({...t}){return jsxRuntimeExports.jsx(L,{variant:"primary",...t})}function xh({showField:t=!0,className:n,title:o,hint:i,children:r,...a}){return t?jsxRuntimeExports.jsx(T,{className:n,title:o,hint:i,...a,children:r}):null}function Nh({showField:t=!0,className:n,title:o="Description",hint:i,readOnly:r=!1,disabled:a,...s}){return t?jsxRuntimeExports.jsx(T,{className:n,hint:i,title:"",...s,children:jsxRuntimeExports.jsx(js,{id:"description",name:"description",label:o,readOnly:r,disabled:a})}):null}function Ih({showField:t,className:n,title:o="Technical Information",hint:i,fieldValue:r,readOnly:a=!1,disabled:s,...l}){const{config:c}=mh(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(T,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(js,{id:"errorMessage",name:"errorMessage",label:o,value:d,readOnly:a,disabled:s})}):null}function Ah({showField:t,className:n,title:o="Environment Information",hint:i,fieldValue:r,readOnly:a=!1,disabled:s,...l}){const{config:c}=mh(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(T,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(js,{id:"environmentInfo",name:"environmentInfo",label:o,value:d,readOnly:a,disabled:s})}):null}function Ph({showField:t=!0,className:n,title:o="Attachments",hint:i,readOnly:r=!1,disabled:s,attachments:l,selectedCategories:c,...u}){const d=S("io-block-list-gap",n),{config:f}=mh(),h=l??f.attachments,p=c??f.selectedCategories,m=reactExports.useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!h||h.length<=0?jsxRuntimeExports.jsx(T,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(T,{className:d,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:h.map(t=>jsxRuntimeExports.jsx(Vs,{id:t.id,name:t.id,label:t.name,readOnly:r,disabled:s,defaultChecked:m(t.category)},t.id))})}):null}function Eh({showField:t=!0,className:n,title:o="Attachments",hint:i,readOnly:r=!1,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=mh(),h=l??f,p=c??d.selectedCategories,m=reactExports.useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!h||h.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(T,{className:n,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:h.map(t=>jsxRuntimeExports.jsx(ul,{id:t,name:t,align:"right",label:t,readOnly:r,disabled:s,defaultChecked:m(t)},t))})}):null}function Th({className:n,title:o,hint:i,showField:r=!0,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=!1,disabled:d,...f}){const h=S("io-block-list-gap",n),{config:p,showMailingList:m,setShowMailingList:g}=mh();if(!r)return null;const v=a??p.createJiraTicket,y=l??p.sendEmail;return jsxRuntimeExports.jsxs(T,{className:h,hint:i,title:o,...f,children:[v&&jsxRuntimeExports.jsx(ul,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(ul,{onChange:()=>{g(!m);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function Dh({showField:t=!0,className:n,title:o="Email List",hint:i="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=mh(),d=t??c.sendEmail,f=a??!1===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(T,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Hs,{id:"mailingList",name:"mailingList",label:o,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const Bh={Header:gh,Body:vh,Footer:yh,HeaderButtons:wh,FooterButtons:bh,SubmitButton:kh,CancelButton:Ch,CloseButton:Sh,IntroField:xh,DescriptionField:Nh,TechInfoField:Ih,EnvInfoField:Ah,FileAttachmentsField:Ph,CategoryAttachmentsField:Eh,SettingsField:Th,MailListField:Dh},Lh=reactExports.createContext(Bh),Rh=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Bh,...n}),[n]);return jsxRuntimeExports.jsx(Lh.Provider,{value:o,children:t})});function Fh(e){return {...reactExports.useContext(Lh),...e}}Rh.displayName="ComponentsStore";const _h=reactExports.createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:!1,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:!1,showBulkActions:()=>{},hideBulkActions:()=>{}}),zh=()=>reactExports.useContext(_h);function Hh({title:n,onOpenSettings:o,onClose:i,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=Bp(),{isBulkActionsSupported:h,notificationsCount:p}=ld(),{isBulkActionsVisible:m}=zh(),g=Gs();return jsxRuntimeExports.jsxs(Jo,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Jo.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:o}),jsxRuntimeExports.jsx(c,{onClick:i})]})]}),jsxRuntimeExports.jsx(f,{}),h?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${m&&p>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{})]})}function jh({text:n="Notifications",counter:o,...i}){const{notificationsCount:r}=ld();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...i,children:(o??!0)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const Vh="newest",Wh="oldest",Kh="severity",Uh=["None","Low","Medium","High","Critical"],Jh={key:Vh,descending:!0},qh=e=>[...e].sort((e,t)=>(t.timestamp||0)-(e.timestamp||0)),Gh=e=>[...e].sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),Yh=(e,t)=>{const n=Uh[0];return [...e].sort((e,o)=>{const i=Uh.indexOf(e.severity||n),r=Uh.indexOf(o.severity||n);return (t?-1:1)*(i-r)})},Qh={[Vh]:qh,[Wh]:Gh,[Kh]:Yh},Xh={severity:"Priority",newest:"Newest",oldest:"Oldest"};function Zh({...t}){const[n,o]=reactExports.useState([]),{NotificationsList:i,Notification:r}=Bp(),{notifications:a,setCount:s,notificationsCount:l}=ld(),{sortNotificationsBy:h,viewNotificationsBy:p,searchQuery:m}=zh(),g=reactExports.useRef(null),v=Us(m),y=reactExports.useMemo(()=>{const e=((e,t)=>{if(!e)return [];switch(t){case"all":default:return e;case"unread":return e.filter(e=>"Active"===e.state||"Stale"===e.state);case"read":return e.filter(e=>"Acknowledged"===e.state||"Seen"===e.state);case"snoozed":return e.filter(e=>"Snoozed"===e.state)}})(a,p);return e.filter(e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase()))},[v,a,p]);return reactExports.useEffect(()=>{switch(h){case"newest":o(qh(y));break;case"oldest":o(Gh(y));break;case"severity":o(Yh(y,!0));break;default:o(y);}s(y.length);},[y,h,s]),reactExports.useEffect(()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});},[v,l,h,p]),jsxRuntimeExports.jsx(Ls,{ref:g,element:qo,elementProps:t,children:jsxRuntimeExports.jsx(i,{notifications:n,Notification:r})})}function ep({...t}){const{FooterButtons:n}=Bp();return jsxRuntimeExports.jsx(Go,{...t,children:jsxRuntimeExports.jsx(n,{})})}function tp({className:n,...o}){const{FooterButtonClearAll:i,FooterButtonClearAllOld:r}=Bp(),{notifications:a}=ld(),[s,l]=reactExports.useState(!1);return reactExports.useEffect(()=>{a.filter(e=>"Stale"===e.state||"Acknowledged"===e.state).length>0?l(!0):l(!1);},[a]),jsxRuntimeExports.jsxs(te,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(i,{disabled:a.length<=0})]})}function np({text:t="Clear All",...n}){const{clearAll:o}=ld();return jsxRuntimeExports.jsx(L,{text:t,onClick:()=>{o();},...n})}function op({text:t="Clear Old",...n}){const{clearAllOld:o}=ld();return jsxRuntimeExports.jsx(L,{text:t,onClick:()=>{o();},...n})}function ip(e){const t=Gs(),{onClose:n,settings:o}=ld(),{isPanelVisible:i}=zh(),{id:r,onClick:s,updateState:l}=e,c=reactExports.useCallback(async()=>{if(!s)return;if(!t){try{await s({close:!0});}catch(e){console.error(e);}return void n(r)}const e=o?.toastStacking??!1;let a;a=i?o?.closeNotificationOnClick??!0:!e&&null;try{null!==a?await s({close:a}):(await s({close:!1}),await l("Acknowledged"));}catch(e){console.error(e);}},[t,r,i,s,n,l,o?.closeNotificationOnClick,o?.toastStacking]),u=reactExports.useCallback(async e=>{const t=e.target;t.closest("button")||t.closest("[role='button']")||t.closest("a")||t.closest(".io-dropdown-menu")||await c();},[c]);return {handleClick:c,handleWrapperClick:u}}function rp({className:n,notification:o,onClick:i,...r}){const a=S("io-notification-header",n),{HeaderCount:s,HeaderBadge:l,HeaderTitle:c,HeaderTimestamp:u,HeaderButtonSnooze:d,HeaderButtonClose:f}=Cp(),{handleWrapperClick:h}=ip(o);return jsxRuntimeExports.jsxs("div",{className:a,onClick:async e=>{await h(e),i?.(e);},...r,children:[jsxRuntimeExports.jsx(l,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o}),jsxRuntimeExports.jsx(c,{notification:o}),jsxRuntimeExports.jsx(u,{notification:o}),jsxRuntimeExports.jsxs(te,{children:[jsxRuntimeExports.jsx(d,{notification:o}),jsxRuntimeExports.jsx(f,{notification:o})]})]})}function ap({notification:t,...n}){const{settings:o,notificationStacks:i}=ld(),{isPanelVisible:r}=zh(),{toastStacking:a,stackBy:s}=o,l="application"===s?"source":s??"source";let c=0;if(a){const e=i.find(e=>e.key===t[l]);c=e?.items.length??0;}return r||!a||c<=1?null:jsxRuntimeExports.jsx(Qo,{...n,children:c>9?"9+":c})}function sp({className:t,notification:n,...o}){if(!n?.severity||"None"===n.severity)return null;const i=S("io-notification-header-badge",t);return jsxRuntimeExports.jsx(Qo,{className:i,...o,children:n.severity})}function lp({className:n,state:o,severity:i="None",icon:r,...a}){const s=S("io-notification-header-icon",n),{isPanelVisible:l}=zh();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${i.toLowerCase()}`,children:l&&"Acknowledged"!==o&&"New"})]})}function cp({className:t,notification:{appTitle:n},...o}){const i=S("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})}function up({className:t,notification:{timestamp:n,state:o,snooze:i},...r}){const a=S("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",i&&"Snoozed"===o?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:pu(n??0)??"Just Now"})}function dp({notification:{id:t,state:n},...o}){const{settings:i,snooze:r}=ld(),s=reactExports.useCallback(e=>{e.stopPropagation(),r&&r(t,i.snooze?.duration??0);},[t,r,i.snooze?.duration]);return r&&"Snoozed"!==n&&i.snooze?.enabled?jsxRuntimeExports.jsx(L,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...o}):null}function fp({notification:{id:t,updateState:n},...o}){const i=Gs(),{onClose:r}=ld(),{isPanelVisible:s}=zh(),l=reactExports.useCallback(e=>{e.stopPropagation(),!i||s?r(t):n("Acknowledged").catch(console.error);},[i,t,r,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",tabIndex:-1,onClick:l,...o})}function hp({className:n,notification:o,...i}){const r=S("io-notification-body",n),{BodyIcon:a,BodyTitle:s,BodyDescription:l}=Cp(),{icon:c,title:u,body:d}=o,{handleClick:f}=ip(o);return jsxRuntimeExports.jsxs("div",{className:r,role:"button",tabIndex:0,onKeyDown:async e=>{D(e)&&await f();},onClick:f,...i,children:[jsxRuntimeExports.jsx(a,{icon:c}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(s,{text:u}),jsxRuntimeExports.jsx(l,{text:d})]})]})}function pp({className:t,icon:n,altText:o="notification icon",...i}){if(!n)return null;const r=S("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx("img",{src:n,alt:o})})}function mp({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function gp({className:t,text:n,...o}){const i=S("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:i,...o,children:n})}function vp({className:n,notification:o}){const i=S("io-notification-footer",n),{FooterButton:r}=Cp(),{handleWrapperClick:a}=ip(o),s=reactExports.useMemo(()=>function(e){const t=[],n={};if(!e)return;e.forEach(e=>{const{displayId:o,displayPath:i}=e,r={...e,children:[]};if(i&&i.length>0){let e;i.forEach((t,o)=>{0===o?e=n[t]:e&&(e=e.children?.find(e=>e.displayId===t));}),e&&e.children?.push(r);}else o?(t.push(r),n[o]=r):t.push(r);o&&(n[o]=r);});const o=e=>{e.forEach(e=>{0===e.children?.length?delete e.children:e.children&&o(e.children);});};return o(t),t}(o.actions),[o.actions]),l=(t,n)=>t.children?jsxRuntimeExports.jsx(Wo,{text:t.title,children:t.children.map(l)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Wo.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:i,onClick:a,children:jsxRuntimeExports.jsx(te,{align:"right",children:s?.map((n,o)=>n.children?jsxRuntimeExports.jsxs(te,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default"}),jsxRuntimeExports.jsx(Wo,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(l)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link"},`${n.title}-${o}`))})})}function yp({notificationAction:t,...n}){const o=reactExports.useCallback(e=>{e.stopPropagation(),t.onClick({close:!0});},[t]);return jsxRuntimeExports.jsx(L,{text:t.title,onClick:o,...n})}const wp={Header:rp,HeaderCount:ap,HeaderBadge:sp,HeaderIcon:lp,HeaderTitle:cp,HeaderTimestamp:up,HeaderButtonSnooze:dp,HeaderButtonClose:fp,Body:hp,BodyIcon:pp,BodyTitle:mp,BodyDescription:gp,Footer:vp,FooterButton:yp},bp=reactExports.createContext(wp),kp=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...wp,...n}),[n]);return jsxRuntimeExports.jsx(bp.Provider,{value:o,children:t})});function Cp(e){return {...reactExports.useContext(bp),...e}}function Sp({className:n,notification:o,...i}){const{Header:r,Body:a,Footer:s}=Cp(),{severity:l}=o,c=S("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==o.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...i,children:[jsxRuntimeExports.jsx(r,{notification:o}),jsxRuntimeExports.jsx(a,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o})]})}function xp({components:t,notification:n,...o}){return jsxRuntimeExports.jsx(kp,{components:t,children:jsxRuntimeExports.jsx(Sp,{notification:n,...o})})}function Np({className:n,notifications:o,...i}){const[r,s]=reactExports.useState(!1),l=o.length>=3?"large":"normal",u=2===o.length?"small":l,d=o[0].severity,f=S("io-notification-stack",r&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),h=reactExports.useCallback(()=>{s(!0);},[]),p=reactExports.useCallback(e=>{e.stopPropagation(),o.forEach(e=>{e.close();});},[o]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:h,...i,children:[r&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(L,{icon:"close",onClick:e=>p(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear Stack"})})}),o.map(t=>jsxRuntimeExports.jsx(xp,{notification:t},t.id))]})}function Ip({...t}){const{notificationStacks:o}=ld();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:o.map(n=>jsxRuntimeExports.jsx(Np,{notifications:n.items,...t},n.key))})}kp.displayName="ComponentsStoreProvider";const Ap=({notification:n,Notification:o,...i})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=ld(),{isPanelVisible:c,isBulkActionsVisible:u}=zh(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const h=c&&a&&u,p=s.includes(n.id);return h?jsxRuntimeExports.jsxs("div",{className:S("io-notification-list-bulk-action-item",{selected:p}),children:[jsxRuntimeExports.jsx(Vs,{checked:p,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(o,{notification:n,...i})]}):jsxRuntimeExports.jsx(o,{notification:n,...i})};function Pp({className:n,Notification:o,notifications:i=[],noNotificationText:r="No notifications to display",...a}){const s=S("io-notification-list",n),{settings:l}=ld(),{isPanelVisible:c}=zh(),{toastStacking:u}=l,d=u&&!c,f=i.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(Ip,{}),!d&&(f?i.map(t=>jsxRuntimeExports.jsx(Ap,{notification:t,Notification:o,...a},t.id)):jsxRuntimeExports.jsx("div",{className:"io-notification-list-no-notifications",children:r}))]})}const Ep={Header:Hh,HeaderCaptionTitle:jh,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:o=0}=ld();return 0===o?null:jsxRuntimeExports.jsx(P,{variant:t,...n,children:o>99?"99+":o})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:o="circle",...i}){return Gs()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,...i}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const{hidePanel:a}=ld(),s=Gs();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):s&&a();},...r})},HeaderActions:function({className:n,...o}){const i=S("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=Bp();return jsxRuntimeExports.jsxs("div",{className:i,...o,children:[jsxRuntimeExports.jsxs(te,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(te,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...o}){const{sortNotificationsBy:i,setSortBy:r}=zh(),{onNotificationsSort:s}=(()=>{const{notifications:e}=ld(),[t,n]=reactExports.useState(Jh),{key:o,descending:i}=t,r=reactExports.useMemo(()=>Qh[o](e,i),[e,o,i]),s=reactExports.useCallback(e=>{n(t=>({key:e,descending:t.key!==e?Jh.descending:!t.descending}));},[]);return {onNotificationsSort:s,sortedNotifications:r}})();return jsxRuntimeExports.jsxs(ee,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(ee.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:Xh[i].toLowerCase()})]}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Priority"].map(t=>{const n="Priority"===t?"severity":t.toLowerCase();return jsxRuntimeExports.jsx(ee.Item,{isSelected:i===n,onClick:()=>{r(n),s(n);},children:t},t)})})})]})},HeaderActionView:function({text:n="View",...o}){const{settings:i}=ld(),{viewNotificationsBy:r,setViewBy:a}=zh(),s=i.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(ee,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(ee.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(ee.Content,{children:jsxRuntimeExports.jsx(ee.List,{variant:"single",checkIcon:"check",children:s.map(t=>jsxRuntimeExports.jsx(ee.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:o,notificationsCount:i}=ld();return jsxRuntimeExports.jsx(L,{variant:"link",text:t,onClick:o,disabled:0===i,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:o,notificationsCount:i}=ld(),{showBulkActions:r}=zh();return o?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===i,...n}):null},HeaderBulkActions:function({className:n,...o}){const i=S("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=Bp(),{isBulkActionsSupported:f}=ld();return f?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsxs(te,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:o,selectAllNotifications:i,notificationsCount:r}=ld();return n?jsxRuntimeExports.jsx(Vs,{checked:r===o.length&&r>0,onChange:e=>i("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:o,selectAllNotifications:i,notificationsCount:r}=ld();return o?jsxRuntimeExports.jsxs(ee,{variant:"light",...n,children:[jsxRuntimeExports.jsx(ee.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(M,{children:jsxRuntimeExports.jsxs(ee.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(ee.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map(t=>jsxRuntimeExports.jsx(ee.Item,{onClick:()=>i(t.toLowerCase(),!0),children:t},t))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:o="circle",tooltip:i="Mark as read",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=ld(),d=reactExports.useCallback(()=>{c(l,"Seen");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:o="circle",tooltip:i="Mark as unread",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=ld(),d=reactExports.useCallback(()=>{c(l,"Active");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:o="circle",tooltip:i="Snooze",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=ld(),f=reactExports.useCallback(()=>{c(l,u.snooze?.duration??0);},[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:f,disabled:0===d,...r}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:o="circle",tooltip:i="Clear",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=ld(),d=reactExports.useCallback(()=>{c(l);},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...o}){const{isBulkActionsSupported:i,notificationsCount:r}=ld(),{hideBulkActions:a}=zh();return i?jsxRuntimeExports.jsx(L,{variant:n,text:t,onClick:a,disabled:0===r,...o}):null},HeaderSearch:function({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=S("io-panel-header-search",n),c=reactExports.useRef(null),{notificationsCount:u}=ld(),{searchQuery:f,setSearch:h}=zh(),p=f.length>0,m=reactExports.useCallback(()=>{h(""),c.current&&c.current.focus();},[h]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Hs,{ref:c,value:f,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?m:void 0,placeholder:o,onChange:e=>h(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${u} results`})]})},Body:Zh,Footer:ep,FooterButtons:tp,FooterButtonClearAll:np,FooterButtonClearAllOld:op,Notification:xp,NotificationsList:Pp},Tp=reactExports.createContext(Ep),Dp=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Ep,...n}),[n]);return jsxRuntimeExports.jsx(Tp.Provider,{value:o,children:t})});function Bp(e){return {...reactExports.useContext(Tp),...e}}Dp.displayName="ComponentsStoreProvider";const Fp=({className:t,notifications:n,maxToasts:o=1,...i})=>{const r=S("io-toasts-body",t),{NotificationsList:a,Notification:s}=_p(),[l,u]=reactExports.useState([]);return reactExports.useEffect(()=>{const e=o<0?n.length:o,t=n.filter(e=>"Active"===e.state).slice(0,e);for(const e of t)e.onShow();u(t);},[n,o]),jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:l,noNotificationText:""})})};Fp.displayName="Body";const Op={Body:Fp,Notification:xp,NotificationsList:Pp},Mp=reactExports.createContext(Op),$p=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Op,...n}),[n]);return jsxRuntimeExports.jsx(Mp.Provider,{value:o,children:t})});function _p(e){return {...reactExports.useContext(Mp),...e}}$p.displayName="ComponentsStoreProvider";const Wp=n=>{const{General:o,Layouts:i}=Yp();return jsxRuntimeExports.jsxs(Ls,{element:qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{})]})},Kp=({title:t="General",...n})=>{const{Theme:o}=Yp();return jsxRuntimeExports.jsx(T,{title:t,"data-testid":"preferences-panel-general-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Up=({title:t="Layouts",...n})=>{const{LayoutsShowDeletePrompt:o}=Yp();return jsxRuntimeExports.jsx(T,{title:t,"data-testid":"preferences-panel-layouts-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Jp={Body:Wp,General:Kp,Theme:zc,Layouts:Up,LayoutsShowUnsavedChangesPrompt:tu,LayoutsShowDeletePrompt:nu},qp=reactExports.createContext(Jp),Gp=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Jp,...n}),[n]);return jsxRuntimeExports.jsx(qp.Provider,{value:o,children:t})});Gp.displayName="PreferencesPanelComponentsStoreProvider";const Yp=()=>reactExports.useContext(qp);

    const CustomIOContext = reactExports.createContext(null);
    const useCustomIOContext = () => {
        const context = reactExports.useContext(CustomIOContext);
        if (!context) {
            throw new Error(`useCustomIOContext must be used within a CustomIOContextProvider`);
        }
        return context;
    };
    const CustomIOContextProvider = ({ io, children }) => {
        return React.createElement(CustomIOContext.Provider, { value: io }, children);
    };

    const getTitleByHandlerFilter = (handlerFilter, chosenIntentName) => {
        if (handlerFilter.title) {
            return handlerFilter.title;
        }
        const { contextTypes, resultType } = handlerFilter;
        const contextTypesString = contextTypes?.length ? `'${contextTypes.join(", ")}' context types` : "";
        const actionBaseMsg = chosenIntentName ? `an app for performing '${chosenIntentName}' action` : "action";
        if (chosenIntentName) {
            const resultTypeString = typeof resultType === "string" ? ` and '${resultType}' result type.` : ".";
            return `Choose ${actionBaseMsg} with ${contextTypesString}${resultTypeString}`;
        }
        if (contextTypesString && typeof resultType === "string") {
            return `Choose ${actionBaseMsg} for ${contextTypesString} and '${resultType}' result type.`;
        }
        if (contextTypesString && typeof resultType !== "string") {
            return `Choose ${actionBaseMsg} for ${contextTypesString}`;
        }
        if (!contextTypesString && typeof resultType === "string") {
            return `Choose ${actionBaseMsg} for '${resultType}' result type.`;
        }
        return "Choose action";
    };
    const getTitle = (config, chosenIntentName) => {
        const { intentRequest, handlerFilter } = config;
        if (intentRequest) {
            return `"${intentRequest.intent}" action is unassigned. Choose an app to perform this action.`;
        }
        return getTitleByHandlerFilter(handlerFilter, chosenIntentName);
    };
    const getCheckboxLabel = (config, chosenIntentName) => {
        const { intentRequest, handlerFilter } = config;
        if (intentRequest) {
            return `Always use this app for '${chosenIntentName}'`;
        }
        if (!handlerFilter) {
            return "Always use this app for this action";
        }
        const { contextTypes, resultType } = handlerFilter;
        const contextTypesString = contextTypes?.length ? `'${contextTypes.join(", ")}' context types` : "";
        if (contextTypesString && resultType) {
            return `Always use this app for '${chosenIntentName}' action with ${contextTypesString} and '${resultType}' result type.`;
        }
        if (contextTypesString && !resultType) {
            return `Always use this app for '${chosenIntentName}' action with ${contextTypesString}`;
        }
        if (!contextTypesString && resultType) {
            return `Always use this app for '${chosenIntentName}' action with '${resultType}' result type.`;
        }
        return `Always use this app for '${chosenIntentName}' action`;
    };
    const isIntentHandlerInExclusionList = (handler, excludeList) => {
        if (!excludeList?.length) {
            return false;
        }
        const isInExclusionList = excludeList.some((criteria) => {
            if ("applicationName" in criteria) {
                return criteria.applicationName === handler.applicationName;
            }
            if ("instanceId" in criteria) {
                return criteria.instanceId === handler.instanceId;
            }
            return false;
        });
        return isInExclusionList;
    };
    const checkIfValidIntentHandlerByHandlerFilter = (handler, intentName, handlerFilter) => {
        const isExcluded = isIntentHandlerInExclusionList(handler, handlerFilter.excludeList);
        if (isExcluded) {
            return false;
        }
        if (handlerFilter.intent && handlerFilter.intent !== intentName) {
            return false;
        }
        if (handlerFilter.resultType && handler.resultType !== handlerFilter.resultType) {
            return false;
        }
        if (handlerFilter.contextTypes &&
            !handlerFilter.contextTypes.every((contextType) => handler.contextTypes?.includes(contextType))) {
            return false;
        }
        if (handlerFilter.applicationNames && !handlerFilter.applicationNames.includes(handler.applicationName)) {
            return false;
        }
        return true;
    };
    const checkIfInstanceIntentHandlerInPassedHandlers = (handler, handlers) => {
        return !!handlers.find((h) => h.applicationName === handler.applicationName && h.instanceId === handler.instanceId);
    };
    const checkIfAppIntentHandlerInPassedHandlers = (handler, handlers, target) => {
        const filteredHandlersByAppName = handlers.filter((h) => h.applicationName === handler.applicationName);
        if (!filteredHandlersByAppName.length) {
            return false;
        }
        if (!target || target === "startNew") {
            return filteredHandlersByAppName.some((handler) => handler.type === "app");
        }
        if (target === "reuse") {
            return !filteredHandlersByAppName.some((h) => h.type === "instance");
        }
        return filteredHandlersByAppName.some((handler) => handler.type === "app");
    };
    const checkIsValidInstanceIntentHandler = (handler, intentName, config) => {
        const { intentRequest, handlerFilter } = config;
        if (handlerFilter) {
            return checkIfValidIntentHandlerByHandlerFilter(handler, intentName, handlerFilter);
        }
        if (!intentRequest || intentName !== intentRequest.intent) {
            return false;
        }
        if (typeof intentRequest.target === "object" && intentRequest.target.app) {
            return intentRequest.target.app === handler.applicationName;
        }
        if (intentRequest.handlers) {
            return checkIfInstanceIntentHandlerInPassedHandlers(handler, intentRequest.handlers);
        }
        return true;
    };
    const checkIsValidAppIntentHandlerByIntentRequest = (handler, intentName, intentRequest) => {
        if (intentName !== intentRequest.intent) {
            return false;
        }
        if (typeof intentRequest.target === "object" && intentRequest.target?.app) {
            return intentRequest.target.app === handler.applicationName;
        }
        if (intentRequest.handlers) {
            return checkIfAppIntentHandlerInPassedHandlers(handler, intentRequest.handlers, intentRequest.target);
        }
        return true;
    };
    const checkIsValidAppIntentHandler = (handler, intentName, config) => {
        const { intentRequest, handlerFilter } = config;
        if (intentRequest) {
            return checkIsValidAppIntentHandlerByIntentRequest(handler, intentName, intentRequest);
        }
        return checkIfValidIntentHandlerByHandlerFilter(handler, intentName, handlerFilter);
    };
    const checkIsValidIntentHandler = (handler, intentName, config) => {
        const isInstanceHandler = !!handler.instanceId;
        return isInstanceHandler
            ? checkIsValidInstanceIntentHandler(handler, intentName, config)
            : checkIsValidAppIntentHandler(handler, intentName, config);
    };

    const Intents = ({ handlerFilter, chosenIntentName, onNextButtonClick }) => {
        const io = useCustomIOContext();
        const [intents, setIntents] = reactExports.useState([]);
        const isNextButtonDisabled = reactExports.useMemo(() => !intents.some((intent) => intent.isSelected), [intents]);
        reactExports.useEffect(() => {
            const getIntentNames = async () => {
                const allIntents = await io.intents.all();
                const filteredIntents = allIntents.filter((intent) => {
                    if (handlerFilter.intent && handlerFilter.intent !== intent.name) {
                        return false;
                    }
                    return intent.handlers.some((handler) => checkIfValidIntentHandlerByHandlerFilter(handler, intent.name, handlerFilter));
                });
                const intents = Array.from(new Set(filteredIntents.map((intent) => intent.name))).map((intentName) => ({ intentName, isSelected: intentName === chosenIntentName }));
                setIntents(intents);
            };
            getIntentNames();
        }, [io.intents, handlerFilter, chosenIntentName]);
        const handleIntentClick = (intentName) => {
            setIntents((intents) => intents.map((intent) => ({ ...intent, isSelected: intent.intentName === intentName ? !intent.isSelected : false })));
        };
        const handleNextButtonClick = () => {
            const selectedIntent = intents.find((intent) => intent.isSelected);
            if (!selectedIntent) {
                return;
            }
            onNextButtonClick(selectedIntent.intentName);
        };
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "io-intent-list-wrapper" },
                React.createElement(J, { checkIcon: "check", variant: "single" }, intents.map(({ intentName, isSelected }) => (React.createElement(J.Item, { key: intentName, isSelected: isSelected, onClick: () => handleIntentClick(intentName), "data-testId": `io-intent-resolver-intent-${intentName}` }, intentName))))),
            React.createElement(te, { align: "right", variant: "fullwidth", "data-testid": "io-intent-resolver-next-button-group" },
                React.createElement(L, { disabled: isNextButtonDisabled, variant: "primary", text: "Next", onClick: handleNextButtonClick, "data-testId": "io-intent-resolver-next-button" }))));
    };

    const InstanceHandlersDropdown = ({ instances, chosenHandler, onHandlerClick }) => {
        return (React.createElement(Wo, { text: "App Instances", icon: "chevron-down", iconRight: true, "data-testid": "io-intent-resolver-instances-dropdown" }, instances.map((handler) => (React.createElement(Wo.Item, { key: handler.instanceId, onClick: () => onHandlerClick(handler), "data-testid": `io-intent-resolver-instance-${handler.instanceId}` },
            chosenHandler?.instanceId === handler.instanceId ? React.createElement(x, { variant: "check" }) : React.createElement(x, null),
            handler.instanceTitle ||
                `${handler.applicationTitle || handler.applicationName} (${handler.instanceId})`)))));
    };

    const InstanceHandlers = ({ handlers, chosenHandler, onHandlerClick }) => {
        const groupInstances = () => {
            return handlers.reduce((grouped, handler) => {
                const appName = handler.applicationTitle || handler.applicationName;
                if (grouped[appName]) {
                    grouped[appName].push(handler);
                }
                else {
                    grouped[appName] = [handler];
                }
                return grouped;
            }, {});
        };
        const handleListItemClick = (instances) => {
            if (instances.length > 1) {
                return;
            }
            onHandlerClick(instances[0]);
        };
        return (React.createElement(J, { checkIcon: "check", variant: "single" },
            React.createElement(J.ItemSection, { "data-testid": "io-intent-resolver-instances-list" }, "Open apps"),
            Object.entries(groupInstances()).map(([appName, instances]) => (React.createElement(J.Item, { key: appName, prepend: instances[0].applicationIcon ? React.createElement(Ko, { src: instances[0].applicationIcon, alt: "" }) : React.createElement(x, { variant: "application" }), onClick: () => handleListItemClick(instances), isSelected: instances.some((instance) => instance.instanceId === chosenHandler?.instanceId), "data-testid": `io-intent-resolver-instance-${appName}`, append: instances.length > 1 ? React.createElement(InstanceHandlersDropdown, { instances: instances, chosenHandler: chosenHandler, onHandlerClick: onHandlerClick }) : null }, appName)))));
    };

    const AppHandlers = ({ handlers, chosenHandler, onHandlerClick }) => {
        return (React.createElement(J, { checkIcon: "check", variant: "single" },
            React.createElement(J.ItemSection, { "data-testid": "io-intent-resolver-apps-list" }, "All Available Apps"),
            handlers.map((handler) => (React.createElement(J.Item, { key: handler.id, prepend: handler.applicationIcon ? React.createElement(Ko, { src: handler.applicationIcon, alt: "" }) : React.createElement(x, { variant: "application" }), onClick: () => onHandlerClick(handler), isSelected: !chosenHandler?.instanceId && chosenHandler?.applicationName === handler.applicationName, "data-testid": `io-intent-resolver-app-${handler.applicationName}` }, handler.applicationTitle || handler.applicationName)))));
    };

    const Handlers = ({ chosenIntentName, config, chosenHandler, showBackButton, setChosenHandler, onConfirmButtonClick, onBackButtonClick, }) => {
        const io = useCustomIOContext();
        const [handlers, setHandlers] = reactExports.useState({ apps: [], instances: [] });
        const [searchQuery, setSearchQuery] = reactExports.useState("");
        const [saveUserChoice, setSaveUserChoice] = reactExports.useState(false);
        const filteredHandlers = reactExports.useMemo(() => {
            const filterCondition = (handler) => (handler.applicationTitle || handler.applicationName).toLowerCase().includes(searchQuery.toLowerCase());
            return {
                apps: handlers.apps.filter(filterCondition),
                instances: handlers.instances.filter(filterCondition),
            };
        }, [searchQuery, handlers]);
        const checkboxLabel = reactExports.useMemo(() => getCheckboxLabel(config, chosenIntentName), [config, chosenIntentName]);
        reactExports.useEffect(() => {
            const unsubOnHandlerAdded = io.intents.onHandlerAdded((handler, intentName) => {
                if (chosenIntentName && chosenIntentName !== intentName) {
                    return;
                }
                const isValidHandler = checkIsValidIntentHandler(handler, intentName, config);
                if (!isValidHandler) {
                    return;
                }
                if (handler.instanceId) {
                    setHandlers((prevHandlers) => ({
                        ...prevHandlers,
                        instances: [
                            ...prevHandlers.instances,
                            {
                                ...handler,
                                type: "instance",
                                id: handler.instanceId,
                                instanceId: handler.instanceId,
                            },
                        ],
                    }));
                    return;
                }
                setHandlers((prevHandlers) => ({
                    ...prevHandlers,
                    apps: [...prevHandlers.apps, { ...handler, type: "app", id: handler.applicationName }],
                }));
            });
            const handleInstanceHandlerRemoval = (removedHandler) => {
                setChosenHandler((prevChosenHandler) => {
                    if (!prevChosenHandler || !removedHandler.instanceId) {
                        return null;
                    }
                    const isSameInstance = prevChosenHandler.instanceId === removedHandler.instanceId && prevChosenHandler.applicationName === removedHandler.applicationName;
                    return isSameInstance ? null : prevChosenHandler;
                });
                setHandlers((prevHandlers) => ({
                    apps: prevHandlers.apps,
                    instances: prevHandlers.instances.filter((handler) => handler.instanceId !== removedHandler.instanceId),
                }));
            };
            const handleAppHandlerRemoval = (removedHandler) => {
                setChosenHandler((prevChosenHandler) => {
                    if (!prevChosenHandler || prevChosenHandler.instanceId) {
                        return null;
                    }
                    const isSameApplication = prevChosenHandler.applicationName === removedHandler.applicationName && !removedHandler.instanceId;
                    return isSameApplication ? null : prevChosenHandler;
                });
                setHandlers((prevHandlers) => ({
                    apps: prevHandlers.apps.filter((handler) => handler.applicationName !== removedHandler.applicationName),
                    instances: prevHandlers.instances,
                }));
            };
            const unsubOnHandlerRemoved = io.intents.onHandlerRemoved((removedHandler, intentName) => {
                if (chosenIntentName && chosenIntentName !== intentName) {
                    return;
                }
                const isValidHandler = checkIsValidIntentHandler(removedHandler, intentName, config);
                if (!isValidHandler) {
                    return;
                }
                if (removedHandler.instanceId) {
                    return handleInstanceHandlerRemoval(removedHandler);
                }
                handleAppHandlerRemoval(removedHandler);
            });
            return () => {
                unsubOnHandlerAdded();
                unsubOnHandlerRemoved();
            };
        }, [io, config, chosenIntentName]);
        const handleSelectHandlerClick = (handler) => {
            if (!chosenHandler) {
                setChosenHandler(handler);
                return;
            }
            const instanceHandlerId = handler?.instanceId;
            const chosenHandlerId = chosenHandler.instanceId;
            const isSameInstance = instanceHandlerId && instanceHandlerId === chosenHandlerId;
            const isSameApplication = !instanceHandlerId && !chosenHandlerId && handler.applicationName === chosenHandler.applicationName;
            const shouldDeselect = isSameInstance || isSameApplication;
            setChosenHandler(shouldDeselect ? null : handler);
        };
        const handleCheckboxClick = (e) => {
            setSaveUserChoice(e.target.checked);
        };
        const handleConfirmButtonClick = () => {
            onConfirmButtonClick(saveUserChoice);
        };
        return (React.createElement(React.Fragment, null,
            React.createElement(Hs, { placeholder: "Filter apps", value: searchQuery, iconPrepend: "search", iconAppend: "close", iconAppendOnClick: () => setSearchQuery(""), onChange: (e) => setSearchQuery(e.target.value), "data-testid": "io-intent-resolver-search-input" }),
            React.createElement("div", { className: "io-intent-list-wrapper" },
                !!filteredHandlers.instances.length && (React.createElement(InstanceHandlers, { handlers: filteredHandlers.instances, chosenHandler: chosenHandler, onHandlerClick: handleSelectHandlerClick })),
                !!filteredHandlers.apps.length && (React.createElement(AppHandlers, { handlers: filteredHandlers.apps, chosenHandler: chosenHandler, onHandlerClick: handleSelectHandlerClick }))),
            React.createElement(Vs, { label: checkboxLabel, onClick: handleCheckboxClick, "data-testid": "io-intent-resolver-checkbox" }),
            React.createElement(te, { align: "right", variant: "fullwidth", "data-testid": "io-intent-resolver-button-group" },
                showBackButton && React.createElement(L, { text: "Back", onClick: onBackButtonClick, "data-testid": "io-intent-resolver-back-button" }),
                React.createElement(L, { disabled: !chosenHandler, variant: "primary", text: "Confirm", onClick: handleConfirmButtonClick, "data-testid": "io-intent-resolver-confirm-button" }))));
    };

    const DefaultIntentResolver = ({ config, io, onUserResponse }) => {
        const [chosenIntentName, setChosenIntentName] = reactExports.useState(config.intentRequest?.intent || config.handlerFilter?.intent || null);
        const [chosenIntentHandler, setChosenIntentHandler] = reactExports.useState(null);
        const [showIntentsList, setShowIntentsList] = reactExports.useState(!!config.handlerFilter && !config.handlerFilter.intent);
        const title = getTitle(config, chosenIntentName);
        const handleBackButtonClick = () => {
            if (!config.handlerFilter) {
                return;
            }
            setShowIntentsList(true);
            setChosenIntentName(null);
            setChosenIntentHandler(null);
        };
        const handleConfirmClick = (saveUserChoice) => {
            if (!chosenIntentHandler || !chosenIntentName) {
                return;
            }
            const response = {
                userChoice: {
                    intent: chosenIntentName,
                    handler: chosenIntentHandler,
                    userSettings: {
                        preserveChoice: saveUserChoice,
                    },
                },
            };
            onUserResponse(response);
        };
        const handleCloseButtonClick = () => {
            onUserResponse({ isClosed: true });
        };
        const handleNextButtonClick = (intentName) => {
            if (!intentName) {
                return;
            }
            setChosenIntentName(intentName);
            setShowIntentsList(false);
        };
        return (React.createElement(CustomIOContextProvider, { io: io },
            React.createElement(Yo, { className: "io-resolver-panel p-16", "data-testid": "io-intent-resolver" },
                React.createElement(Yo.Header, null,
                    React.createElement(E, { "data-testid": "io-intent-resolver-title", text: "Intent Resolver", size: "large" }),
                    config.uiSettings?.showCloseButton !== false && React.createElement(te, null,
                        React.createElement(N, { size: "24", icon: "close", iconSize: "16", onClick: handleCloseButtonClick, tabIndex: -1, "data-testid": "io-intent-resolver-close-button" }))),
                React.createElement(Yo.Body, null,
                    React.createElement("p", { "data-testid": "io-intent-resolver-subtitle", className: "io-text-default-lh16" }, title),
                    showIntentsList ? (React.createElement(Intents, { chosenIntentName: chosenIntentName, handlerFilter: config.handlerFilter, onNextButtonClick: handleNextButtonClick })) : (React.createElement(Handlers, { config: config, chosenIntentName: chosenIntentName, chosenHandler: chosenIntentHandler, setChosenHandler: setChosenIntentHandler, onConfirmButtonClick: handleConfirmClick, onBackButtonClick: handleBackButtonClick, showBackButton: !!(config.handlerFilter && !config.handlerFilter.intent) }))))));
    };

    const IntentResolverUI = ({ messagePort, io, Component = DefaultIntentResolver }) => {
        const [data, setData] = reactExports.useState(null);
        reactExports.useEffect(() => {
            const unsubscribe = messagePort.subscribe(({ data }) => {
                if (data === null) {
                    return setData(null);
                }
                setData(data);
            });
            return unsubscribe;
        }, [messagePort, Component]);
        return (data ? (React.createElement(Component, { io: io, config: data.config, onUserResponse: (response) => messagePort.postMessage({ id: data.id, response }) })) : null);
    };

    class DOMController {
        messagePort;
        ioController;
        config;
        containerId = "io-intent-resolver-container";
        constructor(messagePort, ioController, config) {
            this.messagePort = messagePort;
            this.ioController = ioController;
            this.config = config;
        }
        appendIntentResolver() {
            this.appendToDOM(this.containerId, React.createElement(IntentResolverUI, { messagePort: this.messagePort, io: this.ioController.io, Component: this.config.CustomIntentResolver }));
        }
        appendToDOM(containerId, reactNode) {
            const domNode = this.getRootDomNode(containerId);
            const root = createRoot(domNode);
            root.render(reactNode);
            this.config.rootElement.appendChild(domNode);
        }
        getRootDomNode(containerId) {
            const existingDomNode = document.getElementById(containerId);
            if (existingDomNode) {
                return existingDomNode;
            }
            const domNode = document.createElement("div");
            domNode.id = containerId;
            return domNode;
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

    class IntentResolverUIMessageChannel {
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
            return { postMessage, subscribe };
        }
    }

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

    class IntentResolverController {
        config;
        ioController;
        messagePort;
        logger;
        openedResolver = null;
        constructor(config, ioController, messagePort) {
            this.config = config;
            this.ioController = ioController;
            this.messagePort = messagePort;
            this.logger = ioController.getLogger(`intent-resolver-ui.controller-${ioController.clientId}`);
            messagePort.subscribe((event) => {
                if (this.openedResolver?.id !== event.data.id) {
                    this.logger.warn(`Cannot complete intent resolver result with ID ${event.data.id} because resolver is not open.`);
                    return;
                }
                this.openedResolver.config.onUserResponse({ response: event.data.response });
            });
        }
        exposeAPI() {
            return {
                open: this.open.bind(this),
                close: this.close.bind(this)
            };
        }
        open(config) {
            if (!this.config.enable) {
                throw new Error("Unable to execute open command because intent resolver is not enabled.");
            }
            this.logger.trace(`open command was invoked with config: ${JSON.stringify(config)}.`);
            const verifiedConfig = openConfigDecoder.runWithException(config);
            if (!config.intentRequest && !config.handlerFilter) {
                throw new Error("Either 'intentRequest' or 'handlerFilter' must be provided.");
            }
            if (config.intentRequest && config.handlerFilter) {
                throw new Error("Both 'intentRequest' and 'handlerFilter' cannot be provided at the same time.");
            }
            const id = nanoid(10);
            const message = { id, config: verifiedConfig };
            this.messagePort.postMessage(message);
            this.openedResolver = { id, config };
            return { id };
        }
        close(config) {
            if (!this.config.enable) {
                throw new Error("Unable to execute close command because intent resolver is not enabled.");
            }
            this.logger.trace(`close command was invoked with config: ${JSON.stringify(config)}.`);
            closeConfigDecoder.runWithException(config);
            if (this.openedResolver?.id !== config.id) {
                this.logger.warn(`There is no open intent resolver with ID ${config.id}.`);
                return;
            }
            this.messagePort.postMessage(null);
            this.openedResolver = null;
        }
    }

    class IoC {
        io;
        config;
        _ioController;
        _domController;
        _messageChannel;
        _intentResolverController;
        constructor(io, config) {
            this.io = io;
            this.config = config;
        }
        get ioController() {
            if (!this._ioController) {
                this._ioController = new IOController(this.io);
            }
            return this._ioController;
        }
        get domController() {
            if (!this._domController) {
                this._domController = new DOMController(this.messageChannel.componentPort, this.ioController, this.config);
            }
            return this._domController;
        }
        get intentResolverController() {
            if (!this._intentResolverController) {
                this._intentResolverController = new IntentResolverController(this.config, this.ioController, this.messageChannel.controllerPort);
            }
            return this._intentResolverController;
        }
        get messageChannel() {
            if (!this._messageChannel) {
                this._messageChannel = new IntentResolverUIMessageChannel();
            }
            return this._messageChannel;
        }
    }

    const IOBrowserIntentResolverUIFactory = async (io, config) => {
        const verifiedConfig = configDecoder.runWithException(config);
        if (!(verifiedConfig.rootElement instanceof HTMLDivElement)) {
            throw new Error("'rootElement' must be an instance of HTMLDivElement");
        }
        const ioc = new IoC(io, verifiedConfig);
        const logger = ioc.ioController.getLogger(`intent-resolver-ui.factory-${ioc.ioController.clientId}`);
        if (verifiedConfig.enable) {
            logger.trace("Intent Resolver will be appended to the DOM");
            ioc.domController.appendIntentResolver();
        }
        const api = ioc.intentResolverController.exposeAPI();
        return api;
    };

    const eventController = new EventController();
    eventController.wireCustomEventListener();
    if (typeof window !== 'undefined') {
        window.IOBrowserIntentResolverUI = IOBrowserIntentResolverUIFactory;
    }
    eventController.notifyStarted();

    return IOBrowserIntentResolverUIFactory;

}));
//# sourceMappingURL=io-browser-intent-resolver-ui.umd.js.map
