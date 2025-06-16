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
var ok$2 = function (result) { return ({ ok: true, result: result }); };
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
    return r.ok === true ? ok$2(f(r.result)) : r;
};
/**
 * Apply `f` to the result of two `Ok`s, or pass an error through. If both
 * `Result`s are errors then the first one is returned.
 */
var map2$1 = function (f, ar, br) {
    return ar.ok === false ? ar :
        br.ok === false ? br :
            ok$2(f(ar.result, br.result));
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
                ? ok$2(json)
                : err$1({ message: expectedGot$1('a string', json) });
        });
    };
    /**
     * Decoder primitive that validates numbers, and fails on all other input.
     */
    Decoder.number = function () {
        return new Decoder(function (json) {
            return typeof json === 'number'
                ? ok$2(json)
                : err$1({ message: expectedGot$1('a number', json) });
        });
    };
    /**
     * Decoder primitive that validates booleans, and fails on all other input.
     */
    Decoder.boolean = function () {
        return new Decoder(function (json) {
            return typeof json === 'boolean'
                ? ok$2(json)
                : err$1({ message: expectedGot$1('a boolean', json) });
        });
    };
    Decoder.constant = function (value) {
        return new Decoder(function (json) {
            return isEqual$1(json, value)
                ? ok$2(value)
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
                return ok$2(obj);
            }
            else if (isJsonObject$1(json)) {
                return ok$2(json);
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
                }, ok$2([]));
            }
            else if (isJsonArray$1(json)) {
                return ok$2(json);
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
                return ok$2(result);
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
            return [ad, bd].concat(ds).reduce(function (acc, decoder) { return map2$1(Object.assign, acc, decoder.decode(json)); }, ok$2({}));
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
    Decoder.anyJson = function () { return new Decoder(function (json) { return ok$2(json); }); };
    /**
     * Decoder identity function which always succeeds and types the result as
     * `unknown`.
     */
    Decoder.unknownJson = function () {
        return new Decoder(function (json) { return ok$2(json); });
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
                return ok$2(obj);
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
        return new Decoder(function (json) { return (json === undefined || json === null ? ok$2(undefined) : decoder.decode(json)); });
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
            return ok$2(withDefault$1(defaultValue, decoder.decode(json)));
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
        return new Decoder(function (json) { return ok$2(fixedValue); });
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
var l$1=Symbol.for("react.element"),n$1=Symbol.for("react.portal"),p$2=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v$1=Symbol.for("react.forward_ref"),w$1=Symbol.for("react.suspense"),x$1=Symbol.for("react.memo"),y$1=Symbol.for("react.lazy"),z$2=Symbol.iterator;function A$2(a){if(null===a||"object"!==typeof a)return null;a=z$2&&a[z$2]||a["@@iterator"];return "function"===typeof a?a:null}
var B$2={isMounted:function(){return  false},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$2=Object.assign,D$2={};function E$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}E$2.prototype.isReactComponent={};
E$2.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$2.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F$1(){}F$1.prototype=E$2.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}var H$2=G$2.prototype=new F$1;
H$2.constructor=G$2;C$2(H$2,E$2.prototype);H$2.isPureReactComponent=true;var I$2=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$2={current:null},L$2={key:true,ref:true,__self:true,__source:true};
function M$2(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$2.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g) void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$1,type:a,key:k,ref:h,props:c,_owner:K$2.current}}
function N$2(a,b){return {$$typeof:l$1,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$2(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$1}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$2=/\/+/g;function Q$2(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R$2(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=false;if(null===a)h=true;else switch(k){case "string":case "number":h=true;break;case "object":switch(a.$$typeof){case l$1:case n$1:h=true;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$2(h,0):d,I$2(c)?(e="",null!=a&&(e=a.replace(P$2,"$&/")+"/"),R$2(c,b,e,"",function(a){return a})):null!=c&&(O$2(c)&&(c=N$2(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$2,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$2(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q$2(k,g);h+=R$2(k,b,e,f,c);}else if(f=A$2(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$2(k,g++),h+=R$2(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S$2(a,b,e){if(null==a)return a;var d=[],c=0;R$2(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$2(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$2};function X$2(){throw Error("act(...) is not supported in production builds of React.");}
react_production_min.Children={map:S$2,forEach:function(a,b,e){S$2(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$2(a,function(){b++;});return b},toArray:function(a){return S$2(a,function(a){return a})||[]},only:function(a){if(!O$2(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$2;react_production_min.Fragment=p$2;react_production_min.Profiler=r;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w$1;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;react_production_min.act=X$2;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$2({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){ void 0!==b.ref&&(k=b.ref,h=K$2.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$2.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g;}return {$$typeof:l$1,type:a.type,key:c,ref:k,props:d,_owner:h}};react_production_min.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};react_production_min.createElement=M$2;react_production_min.createFactory=function(a){var b=M$2.bind(null,a);b.type=a;return b};react_production_min.createRef=function(){return {current:null}};
react_production_min.forwardRef=function(a){return {$$typeof:v$1,render:a}};react_production_min.isValidElement=O$2;react_production_min.lazy=function(a){return {$$typeof:y$1,_payload:{_status:-1,_result:a},_init:T$2}};react_production_min.memo=function(a,b){return {$$typeof:x$1,type:a,compare:void 0===b?null:b}};react_production_min.startTransition=function(a){var b=V$2.transition;V$2.transition={};try{a();}finally{V$2.transition=b;}};react_production_min.unstable_act=X$2;react_production_min.useCallback=function(a,b){return U$2.current.useCallback(a,b)};react_production_min.useContext=function(a){return U$2.current.useContext(a)};
react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U$2.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U$2.current.useEffect(a,b)};react_production_min.useId=function(){return U$2.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U$2.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U$2.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U$2.current.useLayoutEffect(a,b)};
react_production_min.useMemo=function(a,b){return U$2.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U$2.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U$2.current.useRef(a)};react_production_min.useState=function(a){return U$2.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U$2.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U$2.current.useTransition()};react_production_min.version="18.3.1";

{
  react.exports = react_production_min;
}

var reactExports = react.exports;
var React = /*@__PURE__*/getDefaultExportFromCjs(reactExports);

var i = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    default: React
}, [reactExports]);

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k$1=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$1={key:true,ref:true,__self:true,__source:true};
function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$1.call(a,b)&&!p$1.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

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
	function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()};}else {var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q};}var r=[],t=[],u=1,v=null,y=3,z=false,A=false,B=false,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
	"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t);}}function H(a){B=false;G(a);if(!A)if(null!==h(r))A=true,I(J);else {var b=h(t);null!==b&&K(H,b.startTime-a);}}
	function J(a,b){A=false;B&&(B=false,E(L),L=-1);z=true;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b);}else k(r);v=h(r);}if(null!==v)var w=!0;else {var m=h(t);null!==m&&K(H,m.startTime-b);w=!1;}return w}finally{v=null,y=c,z=false;}}var N=false,O=null,L=-1,P=5,Q=-1;
	function M(){return exports.unstable_now()-Q<P?false:true}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=true;try{b=O(!0,a);}finally{b?S():(N=false,O=null);}}else N=false;}var S;if("function"===typeof F)S=function(){F(R);};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null);};}else S=function(){D(R,0);};function I(a){O=a;N||(N=true,S());}function K(a,b){L=D(function(){a(exports.unstable_now());},b);}
	exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){A||z||(A=true,I(J));};
	exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5;};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y;}var c=y;y=b;try{return a()}finally{y=c;}};exports.unstable_pauseExecution=function(){};
	exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=y;y=a;try{return b()}finally{y=c;}};
	exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3;}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=true,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=true,I(J)));return a};
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
var aa$1=reactExports,ca=schedulerExports;function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea$1={};function fa(a,b){ha(a,b);ha(a+"Capture",b);}
function ha(a,b){ea$1[a]=b;for(a=0;a<b.length;a++)da.add(b[a]);}
var ia$1=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja$1=Object.prototype.hasOwnProperty,ka$1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la$1=
{},ma={};function oa$1(a){if(ja$1.call(ma,a))return  true;if(ja$1.call(la$1,a))return  false;if(ka$1.test(a))return ma[a]=true;la$1[a]=true;return  false}function pa(a,b,c,d){if(null!==c&&0===c.type)return  false;switch(typeof b){case "function":case "symbol":return  true;case "boolean":if(d)return  false;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return  false}}
function qa$1(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return  true;if(d)return  false;if(null!==c)switch(c.type){case 3:return !b;case 4:return  false===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return  false}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$1={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$1[a]=new v(a,0,false,a,null,false,false);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$1[b]=new v(b,1,false,a[1],null,false,false);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$1[a]=new v(a,2,false,a.toLowerCase(),null,false,false);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$1[a]=new v(a,2,false,a,null,false,false);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$1[a]=new v(a,3,false,a.toLowerCase(),null,false,false);});
["checked","multiple","muted","selected"].forEach(function(a){z$1[a]=new v(a,3,true,a,null,false,false);});["capture","download"].forEach(function(a){z$1[a]=new v(a,4,false,a,null,false,false);});["cols","rows","size","span"].forEach(function(a){z$1[a]=new v(a,6,false,a,null,false,false);});["rowSpan","start"].forEach(function(a){z$1[a]=new v(a,5,false,a.toLowerCase(),null,false,false);});var ra$1=/[\-:]([a-z])/g;function sa$1(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra$1,
sa$1);z$1[b]=new v(b,1,false,a,null,false,false);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,false,a,"http://www.w3.org/1999/xlink",false,false);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,false,a,"http://www.w3.org/XML/1998/namespace",false,false);});["tabIndex","crossOrigin"].forEach(function(a){z$1[a]=new v(a,1,false,a.toLowerCase(),null,false,false);});
z$1.xlinkHref=new v("xlinkHref",1,false,"xlink:href","http://www.w3.org/1999/xlink",true,false);["src","href","action","formAction"].forEach(function(a){z$1[a]=new v(a,1,false,a.toLowerCase(),null,true,true);});
function ta$1(a,b,c,d){var e=z$1.hasOwnProperty(b)?z$1[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa$1(b,c,e,d)&&(c=null),d||null===e?oa$1(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?false:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&true===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
var ua=aa$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za$1=Symbol.for("react.strict_mode"),Aa$1=Symbol.for("react.profiler"),Ba$1=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da$1=Symbol.for("react.forward_ref"),Ea$1=Symbol.for("react.suspense"),Fa$1=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha$1=Symbol.for("react.lazy");var Ia$1=Symbol.for("react.offscreen");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return "function"===typeof a?a:null}var A$1=Object.assign,La$1;function Ma$1(a){if(void 0===La$1)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La$1=b&&b[1]||"";}return "\n"+La$1+a}var Na$1=false;
function Oa$1(a,b){if(!a||Na$1)return "";Na$1=true;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(l){var d=l;}Reflect.construct(a,[],b);}else {try{b.call();}catch(l){d=l;}a.call(b.prototype);}else {try{throw Error();}catch(l){d=l;}a();}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na$1=false,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Ma$1(a):""}
function Pa$1(a){switch(a.tag){case 5:return Ma$1(a.type);case 16:return Ma$1("Lazy");case 13:return Ma$1("Suspense");case 19:return Ma$1("SuspenseList");case 0:case 2:case 15:return a=Oa$1(a.type,false),a;case 11:return a=Oa$1(a.type.render,false),a;case 1:return a=Oa$1(a.type,true),a;default:return ""}}
function Qa$1(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return "Fragment";case wa:return "Portal";case Aa$1:return "Profiler";case za$1:return "StrictMode";case Ea$1:return "Suspense";case Fa$1:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return (a.displayName||"Context")+".Consumer";case Ba$1:return (a._context.displayName||"Context")+".Provider";case Da$1:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa$1(a.type)||"Memo";case Ha$1:b=a._payload;a=a._init;try{return Qa$1(a(b))}catch(c){}}return null}
function Ra$1(a){var b=a.type;switch(a.tag){case 24:return "Cache";case 9:return (b.displayName||"Context")+".Consumer";case 10:return (b._context.displayName||"Context")+".Provider";case 18:return "DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return "Fragment";case 5:return b;case 4:return "Portal";case 3:return "Root";case 6:return "Text";case 16:return Qa$1(b);case 8:return b===za$1?"StrictMode":"Mode";case 22:return "Offscreen";
case 12:return "Profiler";case 21:return "Scope";case 13:return "Suspense";case 19:return "SuspenseList";case 25:return "TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa$1(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return ""}}
function Ta$1(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua$1(a){var b=Ta$1(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:true,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
null;delete a[b];}}}}function Va$1(a){a._valueTracker||(a._valueTracker=Ua$1(a));}function Wa(a){if(!a)return  false;var b=a._valueTracker;if(!b)return  true;var c=b.getValue();var d="";a&&(d=Ta$1(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),true):false}function Xa$1(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya$1(a,b){var c=b.checked;return A$1({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za$1(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa$1(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function ab(a,b){b=b.checked;null!=b&&ta$1(a,"checked",b,false);}
function bb(a,b){ab(a,b);var c=Sa$1(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa$1(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
function cb(a,b,c){if("number"!==b||Xa$1(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=true;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=true);}else {c=""+Sa$1(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=true;d&&(a[e].defaultSelected=true);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=true);}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p(91));return A$1({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p(92));if(eb(c)){if(1<c.length)throw Error(p(93));c=c[0];}b=c;}null==b&&(b="");c=b;}a._wrapperState={initialValue:Sa$1(c)};}
function ib(a,b){var c=Sa$1(b.value),d=Sa$1(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b);}function kb(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else {mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
var pb={animationIterationCount:true,aspectRatio:true,borderImageOutset:true,borderImageSlice:true,borderImageWidth:true,boxFlex:true,boxFlexGroup:true,boxOrdinalGroup:true,columnCount:true,columns:true,flex:true,flexGrow:true,flexPositive:true,flexShrink:true,flexNegative:true,flexOrder:true,gridArea:true,gridRow:true,gridRowEnd:true,gridRowSpan:true,gridRowStart:true,gridColumn:true,gridColumnEnd:true,gridColumnSpan:true,gridColumnStart:true,fontWeight:true,lineClamp:true,lineHeight:true,opacity:true,order:true,orphans:true,tabSize:true,widows:true,zIndex:true,
zoom:true,fillOpacity:true,floodOpacity:true,stopOpacity:true,strokeDasharray:true,strokeDashoffset:true,strokeMiterlimit:true,strokeOpacity:true,strokeWidth:true},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a];});});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var tb=A$1({menuitem:true},{area:true,base:true,br:true,col:true,embed:true,hr:true,img:true,input:true,keygen:true,link:true,meta:true,param:true,source:true,track:true,wbr:true});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return  false;default:return  true}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b));}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a;}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a]);}}function Gb(a,b){return a(b)}function Hb(){}var Ib=false;function Jb(a,b,c){if(Ib)return a(b,c);Ib=true;try{return Gb(a,b,c)}finally{if(Ib=false,null!==zb||null!==Ab)Hb(),Fb();}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=false;}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p(231,b,typeof c));return c}var Lb=false;if(ia$1)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0;}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb);}catch(a){Lb=false;}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}var Ob=false,Pb=null,Qb=false,Rb=null,Sb={onError:function(a){Ob=true;Pb=a;}};function Tb(a,b,c,d,e,f,g,h,k){Ob=false;Pb=null;Nb.apply(Sb,arguments);}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=false;Pb=null;}else throw Error(p(198));Qb||(Qb=true,Rb=l);}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else {a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling;}throw Error(p(188));}if(c.return!==d.return)c=e,d=f;else {for(var g=false,h=e.child;h;){if(h===c){g=true;c=e;d=f;break}if(h===d){g=true;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===
c){g=true;c=f;d=e;break}if(h===d){g=true;d=f;c=e;break}h=h.sibling;}if(!g)throw Error(p(189));}}if(c.alternate!==d)throw Error(p(190));}if(3!==c.tag)throw Error(p(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling;}return null}
var ac$1=ca.unstable_scheduleCallback,bc$1=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc$1=ca.unstable_requestPaint,B$1=ca.unstable_now,ec$1=ca.unstable_getCurrentPriorityLevel,fc$1=ca.unstable_ImmediatePriority,gc$1=ca.unstable_UserBlockingPriority,hc$1=ca.unstable_NormalPriority,ic$1=ca.unstable_LowPriority,jc$1=ca.unstable_IdlePriority,kc$1=null,lc=null;function mc$1(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc$1,a,void 0,128===(a.current.flags&128));}catch(b){}}
var oc$1=Math.clz32?Math.clz32:nc,pc$1=Math.log,qc$1=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc$1(a)/qc$1|0)|0}var rc$1=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc$1(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)));}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc$1(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc$1(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return  -1;case 134217728:case 268435456:case 536870912:case 1073741824:return  -1;default:return  -1}}
function wc$1(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc$1(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc$1(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc$1(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc$1(){var a=rc$1;rc$1<<=1;0===(rc$1&4194240)&&(rc$1=64);return a}function zc$1(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac$1(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc$1(b);a[b]=c;}function Bc$1(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc$1(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
function Cc$1(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc$1(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C$1=0;function Dc$1(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec$1,Fc$1,Gc$1,Hc$1,Ic$1,Jc$1=false,Kc$1=[],Lc$1=null,Mc$1=null,Nc$1=null,Oc$1=new Map,Pc$1=new Map,Qc$1=[],Rc$1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc$1(a,b){switch(a){case "focusin":case "focusout":Lc$1=null;break;case "dragenter":case "dragleave":Mc$1=null;break;case "mouseover":case "mouseout":Nc$1=null;break;case "pointerover":case "pointerout":Oc$1.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc$1.delete(b.pointerId);}}
function Tc$1(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc$1(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc$1(a,b,c,d,e){switch(b){case "focusin":return Lc$1=Tc$1(Lc$1,a,b,c,d,e),true;case "dragenter":return Mc$1=Tc$1(Mc$1,a,b,c,d,e),true;case "mouseover":return Nc$1=Tc$1(Nc$1,a,b,c,d,e),true;case "pointerover":var f=e.pointerId;Oc$1.set(f,Tc$1(Oc$1.get(f)||null,a,b,c,d,e));return  true;case "gotpointercapture":return f=e.pointerId,Pc$1.set(f,Tc$1(Pc$1.get(f)||null,a,b,c,d,e)),true}return  false}
function Vc$1(a){var b=Wc$1(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic$1(a.priority,function(){Gc$1(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
function Xc$1(a){if(null!==a.blockedOn)return  false;for(var b=a.targetContainers;0<b.length;){var c=Yc$1(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc$1(b),a.blockedOn=c,false;b.shift();}return  true}function Zc$1(a,b,c){Xc$1(a)&&c.delete(b);}function $c$1(){Jc$1=false;null!==Lc$1&&Xc$1(Lc$1)&&(Lc$1=null);null!==Mc$1&&Xc$1(Mc$1)&&(Mc$1=null);null!==Nc$1&&Xc$1(Nc$1)&&(Nc$1=null);Oc$1.forEach(Zc$1);Pc$1.forEach(Zc$1);}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc$1||(Jc$1=true,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c$1)));}
function bd(a){function b(b){return ad(b,a)}if(0<Kc$1.length){ad(Kc$1[0],a);for(var c=1;c<Kc$1.length;c++){var d=Kc$1[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc$1&&ad(Lc$1,a);null!==Mc$1&&ad(Mc$1,a);null!==Nc$1&&ad(Nc$1,a);Oc$1.forEach(b);Pc$1.forEach(b);for(c=0;c<Qc$1.length;c++)d=Qc$1[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc$1.length&&(c=Qc$1[0],null===c.blockedOn);)Vc$1(c),null===c.blockedOn&&Qc$1.shift();}var cd=ua.ReactCurrentBatchConfig,dd=true;
function ed(a,b,c,d){var e=C$1,f=cd.transition;cd.transition=null;try{C$1=1,fd(a,b,c,d);}finally{C$1=e,cd.transition=f;}}function gd(a,b,c,d){var e=C$1,f=cd.transition;cd.transition=null;try{C$1=4,fd(a,b,c,d);}finally{C$1=e,cd.transition=f;}}
function fd(a,b,c,d){if(dd){var e=Yc$1(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc$1(a,d);else if(Uc$1(e,a,b,c,d))d.stopPropagation();else if(Sc$1(a,d),b&4&&-1<Rc$1.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec$1(f);f=Yc$1(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd(a,b,d,null,c);}}var id=null;
function Yc$1(a,b,c,d){id=null;a=xb(d);a=Wc$1(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec$1()){case fc$1:return 1;case gc$1:return 4;case hc$1:case ic$1:return 16;case jc$1:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return  true}function qd(){return  false}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:false===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A$1(b.prototype,{preventDefault:function(){this.defaultPrevented=true;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=false),this.isDefaultPrevented=pd);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=true),this.isPropagationStopped=pd);},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A$1({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A$1({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return "movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A$1({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A$1({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A$1({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A$1({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A$1({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:false}function zd(){return Pd}
var Qd=A$1({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A$1({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A$1({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A$1({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A$1({},Ad,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae$1=ia$1&&"CompositionEvent"in window,be$1=null;ia$1&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=ia$1&&"TextEvent"in window&&!be$1,de$1=ia$1&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=false;
function ge$1(a,b){switch(a){case "keyup":return  -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return  true;default:return  false}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=false;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=true;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd(),md=ld=kd=null,ie$1=false,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
var le$1={color:true,date:true,datetime:true,"datetime-local":true,email:true,month:true,number:true,password:true,range:true,search:true,tel:true,text:true,time:true,url:true,week:true};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?true:false}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe$1=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa(b))return a}
function ve$1(a,b){if("change"===a)return b}var we$1=false;if(ia$1){var xe$1;if(ia$1){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=false;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe$1=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$1(qe$1)){var b=[];ne$1(b,qe$1,a,xb(a));Jb(re$1,b);}}
function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe$1=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe$1)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
function Ie$1(a,b){if(He$1(a,b))return  true;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return  false;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return  false;for(d=0;d<c.length;d++){var e=c[d];if(!ja$1.call(b,e)||!He$1(a[e],b[e]))return  false}return  true}function Je$1(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke$1(a,b){var c=Je$1(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je$1(c);}}function Le$1(a,b){return a&&b?a===b?true:a&&3===a.nodeType?false:b&&3===b.nodeType?Le$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):false:false}
function Me$1(){for(var a=window,b=Xa$1();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=false;}if(c)a=b.contentWindow;else break;b=Xa$1(a.document);}return b}function Ne$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe$1(a){var b=Me$1(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le$1(c.ownerDocument.documentElement,c)){if(null!==d&&Ne$1(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke$1(c,f);var g=Ke$1(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
var Pe$1=ia$1&&"documentMode"in document&&11>=document.documentMode,Qe$1=null,Re$1=null,Se$1=null,Te$1=false;
function Ue$1(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe$1||Qe$1!==Xa$1(d)||(d=Qe$1,"selectionStart"in d&&Ne$1(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Ie$1(Se$1,d)||(Se$1=d,d=oe$1(Re$1,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe$1)));}
function Ve$1(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We$1={animationend:Ve$1("Animation","AnimationEnd"),animationiteration:Ve$1("Animation","AnimationIteration"),animationstart:Ve$1("Animation","AnimationStart"),transitionend:Ve$1("Transition","TransitionEnd")},Xe$1={},Ye$1={};
ia$1&&(Ye$1=document.createElement("div").style,"AnimationEvent"in window||(delete We$1.animationend.animation,delete We$1.animationiteration.animation,delete We$1.animationstart.animation),"TransitionEvent"in window||delete We$1.transitionend.transition);function Ze$1(a){if(Xe$1[a])return Xe$1[a];if(!We$1[a])return a;var b=We$1[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye$1)return Xe$1[a]=b[c];return a}var $e$1=Ze$1("animationend"),af=Ze$1("animationiteration"),bf=Ze$1("animationstart"),cf=Ze$1("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a]);}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf);}ff($e$1,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=false,Rb=null,a;}
function D$1(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,false),c.add(d));}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b);}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=true;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,false,a),qf(b,true,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=true,qf("selectionchange",false,b));}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=true);d?void 0!==e?a.addEventListener(b,c,{capture:true,passive:e}):a.addEventListener(b,c,true):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,false);}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc$1(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e$1:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc$1(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc$1(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc$1(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x);}t=null;}else t=null;null!==k&&wf(g,h,k,t,false);null!==n&&null!==J&&wf(g,J,n,t,true);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=true;break;case "contextmenu":case "mouseup":case "dragend":Te$1=false;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie$1=true)),xa=oe$1(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se$1(g,b);});}function tf(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return;}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;});}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd(b);}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc$1(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of]||a[uf];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return {current:a}}
function E$1(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--);}function G$1(a,b){Tf++;Sf[Tf]=a.current;a.current=b;}var Vf={},H$1=Uf(Vf),Wf=Uf(false),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E$1(Wf);E$1(H$1);}function ag(a,b,c){if(H$1.current!==Vf)throw Error(p(168));G$1(H$1,b);G$1(Wf,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra$1(a)||"Unknown",e));return A$1({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H$1.current;G$1(H$1,a);G$1(Wf,Wf.current);return  true}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E$1(Wf),E$1(H$1),G$1(H$1,a)):E$1(Wf);G$1(Wf,c);}var eg=null,fg=false,gg=false;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=true;hg(a);}
function jg(){if(!gg&&null!==eg){gg=true;var a=0,b=C$1;try{var c=eg;for(C$1=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac$1(fc$1,jg),e;}finally{C$1=b,gg=false;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc$1(d)-1;d&=~(1<<e);c+=1;var f=32-oc$1(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc$1(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I$1=false,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),true):false;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,true):false;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,true):false;default:return  false}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I$1){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I$1=false,xg=a);}}else {if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I$1=false;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
function Gg(a){if(a!==xg)return  false;if(!I$1)return Fg(a),I$1=true,false;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
null;}}else yg=xg?Lf(a.stateNode.nextSibling):null;return  true}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling);}function Ig(){yg=xg=null;I$1=false;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode;}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha$1&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa:return b=Sg(b,a.mode,c),b.return=a,b;case Ha$1:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha$1:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha$1:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I$1&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I$1&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
m),I$1&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I$1&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha$1&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha$1:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(true),Vg=Og(false),Wg=Uf(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah(a){var b=Wg.current;E$1(Wg);a._currentValue=b;}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
function ch(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=true),a.firstContext=null);}function eh(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a);}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih(a,d)}function ih(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=false;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
function lh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$1&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih(a,c)}function oh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b;}
function qh(a,b,c,d){var e=a.updateQueue;jh=false;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A$1({},q,r);break a;case 2:jh=true;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh|=g;a.lanes=g;a.memoizedState=q;}}
function sh(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d);}}}var th={},uh=Uf(th),vh=Uf(th),wh=Uf(th);function xh(a){if(a===th)throw Error(p(174));return a}
function yh(a,b){G$1(wh,b);G$1(vh,a);G$1(uh,th);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E$1(uh);G$1(uh,b);}function zh(){E$1(uh);E$1(vh);E$1(wh);}function Ah(a){xh(wh.current);var b=xh(uh.current);var c=lb(b,a.type);b!==c&&(G$1(vh,a),G$1(uh,c));}function Bh(a){vh.current===a&&(E$1(uh),E$1(vh));}var L$1=Uf(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0;}var Fh=ua.ReactCurrentDispatcher,Gh=ua.ReactCurrentBatchConfig,Hh=0,M$1=null,N$1=null,O$1=null,Ih=false,Jh=false,Kh=0,Lh=0;function P$1(){throw Error(p(321));}function Mh(a,b){if(null===b)return  false;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return  false;return  true}
function Nh(a,b,c,d,e,f){Hh=f;M$1=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=false;Kh=0;if(25<=f)throw Error(p(301));f+=1;O$1=N$1=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e);}while(Jh)}Fh.current=Rh;b=null!==N$1&&null!==N$1.next;Hh=0;O$1=N$1=M$1=null;Ih=false;if(b)throw Error(p(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;return O$1}function Uh(){if(null===N$1){var a=M$1.alternate;a=null!==a?a.memoizedState:null;}else a=N$1.next;var b=null===O$1?M$1.memoizedState:O$1.next;if(null!==b)O$1=b,N$1=a;else {if(null===a)throw Error(p(310));N$1=a;a={memoizedState:N$1.memoizedState,baseState:N$1.baseState,baseQueue:N$1.baseQueue,queue:N$1.queue,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;}return O$1}
function Vh(a,b){return "function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=N$1,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M$1.lanes|=m;rh|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(dh=true);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M$1.lanes|=f,rh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(dh=true);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh(){}
function Zh(a,b){var c=M$1,d=Uh(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,dh=true);d=d.queue;$h(ai$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O$1&&O$1.memoizedState.tag&1){c.flags|=2048;bi$1(9,ci$1.bind(null,c,d,e,b),void 0,null);if(null===Q$1)throw Error(p(349));0!==(Hh&30)||di$1(c,b,e);}return e}function di$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
function ci$1(a,b,c,d){b.value=c;b.getSnapshot=d;ei$1(b)&&fi$1(a);}function ai$1(a,b,c){return c(function(){ei$1(b)&&fi$1(a);})}function ei$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return  true}}function fi$1(a){var b=ih(a,1);null!==b&&gi$1(b,a,1,-1);}
function hi$1(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii$1.bind(null,M$1,a);return [b.memoizedState,a]}
function bi$1(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji(){return Uh().memoizedState}function ki$1(a,b,c,d){var e=Th();M$1.flags|=a;e.memoizedState=bi$1(1|b,c,void 0,void 0===d?null:d);}
function li$1(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N$1){var g=N$1.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi$1(b,c,f,d);return}}M$1.flags|=a;e.memoizedState=bi$1(1|b,c,f,d);}function mi$1(a,b){return ki$1(8390656,8,a,b)}function $h(a,b){return li$1(2048,8,a,b)}function ni$1(a,b){return li$1(4,2,a,b)}function oi$1(a,b){return li$1(4,4,a,b)}
function pi$1(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi$1(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li$1(4,4,pi$1.bind(null,b,a),c)}function ri$1(){}function si$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui$1(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=false,dh=true),a.memoizedState=c;He$1(c,b)||(c=yc$1(),M$1.lanes|=c,rh|=c,a.baseState=true);return b}function vi$1(a,b){var c=C$1;C$1=0!==c&&4>c?c:4;a(true);var d=Gh.transition;Gh.transition={};try{a(!1),b();}finally{C$1=c,Gh.transition=d;}}function wi$1(){return Uh().memoizedState}
function xi$1(a,b,c){var d=yi$1(a);c={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi(a))Ai$1(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R$1();gi$1(c,a,d,e);Bi$1(c,b,d);}}
function ii$1(a,b,c){var d=yi$1(a),e={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi(a))Ai$1(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R$1(),gi$1(c,a,d,e),Bi$1(c,b,d));}}
function zi(a){var b=a.alternate;return a===M$1||null!==b&&b===M$1}function Ai$1(a,b){Jh=Ih=true;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi$1(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
var Rh={readContext:eh,useCallback:P$1,useContext:P$1,useEffect:P$1,useImperativeHandle:P$1,useInsertionEffect:P$1,useLayoutEffect:P$1,useMemo:P$1,useReducer:P$1,useRef:P$1,useState:P$1,useDebugValue:P$1,useDeferredValue:P$1,useTransition:P$1,useMutableSource:P$1,useSyncExternalStore:P$1,useId:P$1,unstable_isNewReconciler:false},Oh={readContext:eh,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh,useEffect:mi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki$1(4194308,
4,pi$1.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki$1(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki$1(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi$1.bind(null,M$1,a);return [d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi$1,useDebugValue:ri$1,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi$1(false),b=a[0];a=vi$1.bind(null,a[1]);Th().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M$1,e=Th();if(I$1){if(void 0===c)throw Error(p(407));c=c();}else {c=b();if(null===Q$1)throw Error(p(349));0!==(Hh&30)||di$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi$1(ai$1.bind(null,d,
f,a),[a]);d.flags|=2048;bi$1(9,ci$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q$1.identifierPrefix;if(I$1){var c=sg;var d=rg;c=(d&~(1<<32-oc$1(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:false},Ph={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Wh,useRef:ji,useState:function(){return Wh(Vh)},
useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:false},Qh={readContext:eh,useCallback:si$1,useContext:eh,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Xh,useRef:ji,useState:function(){return Xh(Vh)},useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return null===
N$1?b.memoizedState=a:ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:false};function Ci$1(a,b){if(a&&a.defaultProps){b=A$1({},b);a=a.defaultProps;for(var c in a) void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di$1(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A$1({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
var Ei$1={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:false},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh(a,f,e);null!==b&&(gi$1(b,a,e,d),oh(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R$1(),d=
yi$1(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh(a,e,d);null!==b&&(gi$1(b,a,d,c),oh(b,a,d));}};function Fi$1(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):true}
function Gi(a,b,c){var d=false,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=eh(f):(e=Zf(b)?Xf:H$1.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei$1;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei$1.enqueueReplaceState(b,b.state,null);}
function Ii$1(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh(f):(f=Zf(b)?Xf:H$1.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di$1(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei$1.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji$1(a,b){try{var c="",d=b;do c+=Pa$1(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
function Ki(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li$1(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi$1="function"===typeof WeakMap?WeakMap:Map;function Ni$1(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi$1||(Oi$1=true,Pi$1=d);Li$1(a,b);};return c}
function Qi(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li$1(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li$1(a,b);"function"!==typeof d&&(null===Ri$1?Ri$1=new Set([this]):Ri$1.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
function Si(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi$1;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti.bind(null,a,b,c),b.then(a,a));}function Ui(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?true:false:true;if(b)return a;a=a.return;}while(null!==a);return null}
function Vi$1(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi=ua.ReactCurrentOwner,dh=false;function Xi$1(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
function Yi(a,b,c,d,e){c=c.render;var f=b.ref;ch(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&c&&vg(b);b.flags|=1;Xi$1(a,b,d,e);return b.child}
function $i(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return Zi(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(dh=false,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=true);else return b.lanes=a.lanes,Zi(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(ej,fj);fj|=d;}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(ej,fj),fj|=d;Xi$1(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf(c)?Xf:H$1.current;f=Yf(b,f);ch(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi(a,b,e);I$1&&d&&vg(b);b.flags|=1;Xi$1(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf(c)){var f=true;cg(b);}else f=false;ch(b,e);if(null===b.stateNode)ij(a,b),Gi(b,c,d),Ii$1(b,c,d,e),d=true;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh(l):(l=Zf(c)?Xf:H$1.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi(b,g,d,l);jh=false;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||jh?("function"===typeof m&&(Di$1(b,c,m,d),k=b.memoizedState),(h=jh||Fi$1(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=false);}else {g=b.stateNode;lh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci$1(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh(k):(k=Zf(c)?Xf:H$1.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi(b,g,d,k);jh=false;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||jh?("function"===typeof y&&(Di$1(b,c,y,d),n=b.memoizedState),(l=jh||Fi$1(b,c,l,d,r,n,k)||false)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=false);}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,false),Zi(a,b,f);d=b.stateNode;Wi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi$1(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,true);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,false);yh(a,b.containerInfo);}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi$1(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L$1.current,f=false,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?false:0!==(e&2));if(h)f=true,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(L$1,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki(Error(p(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p(419));d=Ki(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q$1;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih(a,e),gi$1(d,a,e,-1));}tj();d=Ki(Error(p(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I$1=true;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c);}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi$1(a,b,d.children,c);d=L$1.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(L$1,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,false,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,true,c,null,f);break;case "together":wj(b,false,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(L$1,L$1.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G$1(L$1,L$1.current&1);a=Zi(a,b,c);return null!==a?a.sibling:null}G$1(L$1,L$1.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(L$1,L$1.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh.current);var f=null;switch(c){case "input":e=Ya$1(a,e);d=Ya$1(a,d);f=[];break;case "select":e=A$1({},e,{value:void 0});d=A$1({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea$1.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea$1.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$1("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
function Dj(a,b){if(!I$1)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
function S$1(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$1(b),null;case 1:return Zf(b.type)&&$f(),S$1(b),null;case 3:d=b.stateNode;zh();E$1(Wf);E$1(H$1);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S$1(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p(166));S$1(b);return null}a=xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$1("cancel",d);D$1("close",d);break;case "iframe":case "object":case "embed":D$1("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D$1(lf[e],d);break;case "source":D$1("error",d);break;case "img":case "image":case "link":D$1("error",
d);D$1("load",d);break;case "details":D$1("toggle",d);break;case "input":Za$1(d,f);D$1("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$1("invalid",d);break;case "textarea":hb(d,f),D$1("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(true!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(true!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea$1.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$1("scroll",d);}switch(c){case "input":Va$1(d);db(d,f,true);break;case "textarea":Va$1(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=true:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;zj(a,b,false,false);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$1("cancel",a);D$1("close",a);e=d;break;case "iframe":case "object":case "embed":D$1("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D$1(lf[e],a);e=d;break;case "source":D$1("error",a);e=d;break;case "img":case "image":case "link":D$1("error",
a);D$1("load",a);e=d;break;case "details":D$1("toggle",a);e=d;break;case "input":Za$1(a,d);e=Ya$1(a,d);D$1("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A$1({},d,{value:void 0});D$1("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$1("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea$1.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$1("scroll",a):null!=k&&ta$1(a,f,k,g));}switch(c){case "input":Va$1(a);db(a,d,false);break;case "textarea":Va$1(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa$1(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,false):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
true);break;default:"function"===typeof e.onClick&&(a.onclick=Bf);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=true;break a;default:d=false;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$1(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=xh(wh.current);xh(uh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:true!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d;}S$1(b);return null;case 13:E$1(L$1);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I$1&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=false;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$1(b);f=false;}else null!==zg&&(Fj(zg),zg=null),f=true;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L$1.current&1)?0===T$1&&(T$1=3):tj()));null!==b.updateQueue&&(b.flags|=4);S$1(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf(b.stateNode.containerInfo),S$1(b),null;case 10:return ah(b.type._context),S$1(b),null;case 17:return Zf(b.type)&&$f(),S$1(b),null;case 19:E$1(L$1);f=b.memoizedState;if(null===f)return S$1(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,false);else {if(0!==T$1||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,false);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(L$1,L$1.current&1|2);return b.child}a=
a.sibling;}null!==f.tail&&B$1()>Gj&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);}else {if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=true,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,true),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I$1)return S$1(b),null}else 2*B$1()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B$1(),b.sibling=null,c=L$1.current,G$1(L$1,d?c&1|2:c&1),b;S$1(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S$1(b),b.subtreeFlags&6&&(b.flags|=8192)):S$1(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E$1(Wf),E$1(H$1),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E$1(L$1);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E$1(L$1),null;case 4:return zh(),null;case 10:return ah(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=false,U$1=false,Kj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Nj=false;
function Oj(a,b){Cf=dd;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df={focusedElem:a,selectionRange:c};dd=false;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci$1(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Nj;Nj=false;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X$1=null,Xj=false;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
function Zj(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc$1,c);}catch(h){}switch(c.tag){case 5:U$1||Lj(c,b);case 6:var d=X$1,e=Xj;X$1=null;Yj(a,b,c);X$1=d;Xj=e;null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X$1,c.stateNode));break;case 4:d=X$1;e=Xj;X$1=c.stateNode.containerInfo;Xj=true;
Yj(a,b,c);X$1=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U$1&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
c.memoizedState,Yj(a,b,c),U$1=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Xj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Xj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X$1)throw Error(p(160));Zj(f,g,e);X$1=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W$1(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta$1(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B$1()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,ck(b,a),U$1=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V$1=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V$1=a;ik(a);}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Jj;var l=U$1;Jj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V$1=k):jk(e);for(;null!==f;)V$1=f,ik(f),f=f.sibling;V$1=e;Jj=h;U$1=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):kk(a);}}
function kk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci$1(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode;}sh(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p(163));}U$1||b.flags&512&&Rj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function gk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
function jk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
var lk=Math.ceil,mk=ua.ReactCurrentDispatcher,nk=ua.ReactCurrentOwner,ok=ua.ReactCurrentBatchConfig,K$1=0,Q$1=null,Y$1=null,Z$1=0,fj=0,ej=Uf(0),T$1=0,pk=null,rh=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi$1=false,Pi$1=null,Ri$1=null,vk=false,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R$1(){return 0!==(K$1&6)?B$1():-1!==Ak?Ak:Ak=B$1()}
function yi$1(a){if(0===(a.mode&1))return 1;if(0!==(K$1&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Bk&&(Bk=yc$1()),Bk;a=C$1;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi$1(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p(185));Ac$1(a,c,d);if(0===(K$1&2)||a!==Q$1)a===Q$1&&(0===(K$1&2)&&(qk|=c),4===T$1&&Ck(a,Z$1)),Dk(a,d),1===c&&0===K$1&&0===(b.mode&1)&&(Gj=B$1()+500,fg&&jg());}
function Dk(a,b){var c=a.callbackNode;wc$1(a,b);var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)null!==c&&bc$1(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc$1(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf(function(){0===(K$1&6)&&jg();}),c=null;else {switch(Dc$1(d)){case 1:c=fc$1;break;case 4:c=gc$1;break;case 16:c=hc$1;break;case 536870912:c=jc$1;break;default:c=hc$1;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K$1&6))throw Error(p(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K$1;K$1|=2;var f=Jk();if(Q$1!==a||Z$1!==b)uk=null,Gj=B$1()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K$1=e;null!==Y$1?b=0:(Q$1=null,Z$1=0,b=T$1);}if(0!==b){2===b&&(e=xc$1(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;if(6===b)Ck(a,d);
else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc$1(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B$1(),10<b)){if(0!==uc$1(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R$1();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc$1(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B$1()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p(329));}}}Dk(a,B$1());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return  false}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return  true;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return  true}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc$1(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K$1&6))throw Error(p(327));Hk();var b=uc$1(a,0);if(0===(b&1))return Dk(a,B$1()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc$1(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B$1()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B$1());return null}
function Qk(a,b){var c=K$1;K$1|=1;try{return a(b)}finally{K$1=c,0===K$1&&(Gj=B$1()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K$1&6)&&Hk();var b=K$1;K$1|=1;var c=ok.transition,d=C$1;try{if(ok.transition=null,C$1=1,a)return a()}finally{C$1=d,ok.transition=c,K$1=b,0===(K$1&6)&&jg();}}function Hj(){fj=ej.current;E$1(ej);}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:zh();E$1(Wf);E$1(H$1);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E$1(L$1);break;case 19:E$1(L$1);break;case 10:ah(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q$1=a;Y$1=a=Pg(a.current,null);Z$1=fj=b;T$1=0;pk=null;rk=qk=rh=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
function Mk(a,b){do{var c=Y$1;try{$g();Fh.current=Rh;if(Ih){for(var d=M$1.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih=!1;}Hh=0;O$1=N$1=M$1=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T$1=1;pk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui(g);if(null!==y){y.flags&=-257;Vi$1(y,g,h,f,b);y.mode&1&&Si(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si(f,l,b);tj();break a}k=Error(p(426));}}else if(I$1&&h.mode&1){var J=Ui(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi$1(J,g,h,f,b);Jg(Ji$1(k,h));break a}}f=k=Ji$1(k,h);4!==T$1&&(T$1=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni$1(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri$1||!Ri$1.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi(f,h,b);ph(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T$1||3===T$1||2===T$1)T$1=4;null===Q$1||0===(rh&268435455)&&0===(qk&268435455)||Ck(Q$1,Z$1);}function Ik(a,b){var c=K$1;K$1|=2;var d=Jk();if(Q$1!==a||Z$1!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K$1=c;mk.current=d;if(null!==Y$1)throw Error(p(261));Q$1=null;Z$1=0;return T$1}function Tk(){for(;null!==Y$1;)Uk(Y$1);}function Lk(){for(;null!==Y$1&&!cc();)Uk(Y$1);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y$1=b;nk.current=null;}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y$1=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$1=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$1&&(T$1=5);}function Pk(a,b,c){var d=C$1,e=ok.transition;try{ok.transition=null,C$1=1,Wk(a,b,c,d);}finally{ok.transition=e,C$1=d;}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K$1&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc$1(a,f);a===Q$1&&(Y$1=Q$1=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=true,Fk(hc$1,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C$1;C$1=1;var h=K$1;K$1|=4;nk.current=null;Oj(a,c);dk(c,a);Oe$1(Df);dd=!!Cf;Df=Cf=null;a.current=c;hk(c);dc$1();K$1=h;C$1=g;ok.transition=f;}else a.current=c;vk&&(vk=false,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri$1=null);mc$1(c.stateNode);Dk(a,B$1());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi$1)throw Oi$1=false,a=Pi$1,Pi$1=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc$1(xk),b=ok.transition,c=C$1;try{ok.transition=null;C$1=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K$1&6))throw Error(p(331));var e=K$1;K$1|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$1=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc$1,a);}catch(na){}d=!0;}return d}finally{C$1=c,ok.transition=b;}}return  false}function Xk(a,b,c){b=Ji$1(c,b);b=Ni$1(a,b,1);a=nh(a,b,1);b=R$1();null!==a&&(Ac$1(a,1,b),Dk(a,b));}
function W$1(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri$1||!Ri$1.has(d))){a=Ji$1(c,a);a=Qi(b,a,1);b=nh(b,a,1);a=R$1();null!==b&&(Ac$1(b,1,a),Dk(b,a));break}}b=b.return;}}
function Ti(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R$1();a.pingedLanes|=a.suspendedLanes&c;Q$1===a&&(Z$1&c)===c&&(4===T$1||3===T$1&&(Z$1&130023424)===Z$1&&500>B$1()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=R$1();a=ih(a,b);null!==a&&(Ac$1(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)dh=true;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh=false,yj(a,b,c);dh=0!==(a.flags&131072)?true:false;}else dh=false,I$1&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf(b,H$1.current);ch(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=true,cg(b)):f=false,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei$1,b.stateNode=e,e._reactInternals=b,Ii$1(b,d,a,c),b=jj(null,b,d,true,f,c)):(b.tag=0,I$1&&f&&vg(b),Xi$1(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci$1(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi(null,b,d,a,c);break a;case 14:b=$i(null,b,d,Ci$1(d.type,a),c);break a}throw Error(p(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:false,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji$1(Error(p(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji$1(Error(p(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I$1=true,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi(a,b,c);break a}Xi$1(a,b,d,c);}b=b.child;}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
gj(a,b),Xi$1(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi$1(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),Yi(a,b,d,e,c);case 7:return Xi$1(a,b,b.pendingProps,c),b.child;case 8:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 12:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G$1(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf.current){b=Zi(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi$1(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch(b,c),e=eh(e),d=d(e),b.flags|=1,Xi$1(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci$1(d,b.pendingProps),e=Ci$1(d.type,e),$i(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),ij(a,b),b.tag=1,Zf(d)?(a=true,cg(b)):a=false,ch(b,c),Gi(b,d,e),Ii$1(b,d,e,c),jj(null,b,d,true,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p(156,b.tag));};function Fk(a,b){return ac$1(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da$1)return 11;if(a===Ga)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Tg(c.children,e,f,b);case za$1:g=8;e|=8;break;case Aa$1:return a=Bg(12,c,b,e|2),a.elementType=Aa$1,a.lanes=f,a;case Ea$1:return a=Bg(13,c,b,e),a.elementType=Ea$1,a.lanes=f,a;case Fa$1:return a=Bg(19,c,b,e),a.elementType=Fa$1,a.lanes=f,a;case Ia$1:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba$1:g=10;break a;case Ca:g=9;break a;case Da$1:g=11;
break a;case Ga:g=14;break a;case Ha$1:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia$1;a.lanes=c;a.stateNode={isHidden:false};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al$1(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc$1(0);this.expirationTimes=zc$1(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc$1(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null;}function bl$1(a,b,c,d,e,f,g,h,k){a=new al$1(a,b,c,h,k);1===b?(b=1,true===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl$1(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function el$1(a,b,c,d,e,f,g,h,k){a=bl$1(c,d,true,a,e,f,g,h,k);a.context=dl(null);c=a.current;d=R$1();e=yi$1(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh(c,f,e);a.current.lanes=e;Ac$1(a,e,d);Dk(a,d);return a}function fl(a,b,c,d){var e=b.current,f=R$1(),g=yi$1(e);c=dl(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh(e,b,g);null!==a&&(gi$1(a,e,g,f),oh(a,e,g));return g}
function gl$1(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl$1(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il$1(a,b){hl$1(a,b);(a=a.alternate)&&hl$1(a,b);}function jl$1(){return null}var kl$1="function"===typeof reportError?reportError:function(a){console.error(a);};function ll$1(a){this._internalRoot=a;}
ml.prototype.render=ll$1.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));fl(a,b,null,null);};ml.prototype.unmount=ll$1.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl(null,a,null,null);});b[uf]=null;}};function ml(a){this._internalRoot=a;}
ml.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc$1();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc$1.length&&0!==b&&b<Qc$1[c].priority;c++);Qc$1.splice(c,0,a);0===c&&Vc$1(a);}};function nl$1(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol$1(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl$1(){}
function ql$1(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl$1(g);f.call(a);};}var g=el$1(b,d,a,0,null,false,false,"",pl$1);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl$1(k);h.call(a);};}var k=bl$1(a,0,false,null,null,false,false,"",pl$1);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Rk(function(){fl(b,k,c,d);});return k}
function rl$1(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl$1(g);h.call(a);};}fl(b,g,a,e);}else g=ql$1(c,b,a,e,d);return gl$1(g)}Ec$1=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc$1(b,c|1),Dk(b,B$1()),0===(K$1&6)&&(Gj=B$1()+500,jg()));}break;case 13:Rk(function(){var b=ih(a,1);if(null!==b){var c=R$1();gi$1(b,a,1,c);}}),il$1(a,1);}};
Fc$1=function(a){if(13===a.tag){var b=ih(a,134217728);if(null!==b){var c=R$1();gi$1(b,a,134217728,c);}il$1(a,134217728);}};Gc$1=function(a){if(13===a.tag){var b=yi$1(a),c=ih(a,b);if(null!==c){var d=R$1();gi$1(c,a,b,d);}il$1(a,b);}};Hc$1=function(){return C$1};Ic$1=function(a,b){var c=C$1;try{return C$1=a,b()}finally{C$1=c;}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,false);}};Gb=Qk;Hb=Rk;
var sl$1={usingClientEntryPoint:false,Events:[Cb,ue$1,Db,Eb,Fb,Qk]},tl$1={findFiberByHostInstance:Wc$1,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul$1={bundleType:tl$1.bundleType,version:tl$1.version,rendererPackageName:tl$1.rendererPackageName,rendererConfig:tl$1.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl$1.findFiberByHostInstance||
jl$1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl$1=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl$1.isDisabled&&vl$1.supportsFiber)try{kc$1=vl$1.inject(ul$1),lc=vl$1;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl$1;
reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl$1(b))throw Error(p(200));return cl$1(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl$1(a))throw Error(p(299));var c=false,d="",e=kl$1;null!==b&&void 0!==b&&(true===b.unstable_strictMode&&(c=true),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl$1(a,1,false,null,null,c,false,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ll$1(b)};
reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol$1(b))throw Error(p(200));return rl$1(null,a,b,true,c)};
reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl$1(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=false,f="",g=kl$1;null!==c&&void 0!==c&&(true===c.unstable_strictMode&&(e=true),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el$1(b,null,a,1,null!=c?c:null,e,false,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml(b)};reactDom_production_min.render=function(a,b,c){if(!ol$1(b))throw Error(p(200));return rl$1(null,a,b,false,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol$1(a))throw Error(p(40));return a._reactRootContainer?(Rk(function(){rl$1(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null;});}),true):false};reactDom_production_min.unstable_batchedUpdates=Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol$1(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return rl$1(a,b,c,false,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";

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

function y(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var w,b={exports:{}};
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/w=b,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var o=arguments[t];o&&(e=i(e,n(o)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var o="";for(var r in n)e.call(n,r)&&n[r]&&(o=i(o,r));return o}function i(e,t){return t?e?e+" "+t:e+t:e}w.exports?(t.default=t,w.exports=t):window.classNames=t;}();var k=y(b.exports);function C({className:t,size:n="16",variant:i="workspace",...o}){const r=k("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,...o,children:jsxRuntimeExports.jsx("i",{className:`icon-${i}`})})}const N=reactExports.forwardRef((({className:t,variant:n="default",icon:i="workspace",size:o="16",iconSize:a="16",onClick:s,disabled:l,children:c,...u},d)=>{const f=k("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${o}`],t),m=reactExports.useCallback((e=>{if(!l)return s?s(e):void 0;e.preventDefault();}),[s,l]);return jsxRuntimeExports.jsx("button",{className:f,type:"button",ref:d,"aria-label":"button",onClick:m,disabled:l,...u,children:c??(i&&jsxRuntimeExports.jsx(C,{variant:i,size:a}))})}));N.displayName="ButtonIcon";const x={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function S({className:n,variant:i="default",size:o="normal",text:r,close:a=false,closeButtonOnClick:s,append:l,...c}){const u=k("io-alert",`io-alert-${i}`,"large"===o&&"io-alert-lg",n),d=x[i];return jsxRuntimeExports.jsxs("div",{"data-testid":"io-alert",className:u,...c,children:[d&&jsxRuntimeExports.jsx(C,{"data-testid":"io-alert-icon",variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{"data-testid":"io-alert-text",className:"io-text-smaller",children:r}),"large"===o&&l,a&&jsxRuntimeExports.jsx(N,{"data-testid":"io-alert-close-button",className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function D({className:t,variant:n="default",children:i,...o}){const r=k("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:i})}function E({className:t,tag:n="h2",size:i="normal",text:o="Title",...r}){const a=n,s=k("small"===i&&"io-title-semibold","normal"===i&&"io-title","large"===i&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:o})}function I({className:n,title:i,titleSize:o="normal",tag:r,hint:a,children:s,...l}){const c=k("io-block",n);return jsxRuntimeExports.jsxs("div",{className:c,...l,children:[i&&jsxRuntimeExports.jsx(E,{tag:r,text:i,size:o}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const A=reactExports.forwardRef((({className:n,variant:i="default",size:o="normal",icon:a,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},h)=>{const p=k("io-btn",("primary"===i||"critical"===i||"outline"===i||"link"===i)&&[`io-btn-${i}`],"large"===o&&"io-btn-lg",n),g=reactExports.useCallback((e=>{if(!d)return u?u(e):void 0;e.preventDefault();}),[u,d]);return jsxRuntimeExports.jsxs("button",{className:p,ref:h,type:"button","aria-label":"button",onClick:g,disabled:d,tabIndex:0,...m,children:[a&&!l&&jsxRuntimeExports.jsx(C,{variant:a,size:s}),f??c,a&&l&&jsxRuntimeExports.jsx(C,{variant:a,size:s})]})}));A.displayName="Button";const M=reactExports.createContext({});const T=reactExports.forwardRef((({size:t="32",...n},i)=>{const{handleOpen:o,disabled:a}=reactExports.useContext(M),l=reactExports.useCallback((()=>{o&&o();}),[o]);return jsxRuntimeExports.jsx(N,{ref:i,size:t,onClick:l,disabled:a,...n})}));function P({className:t,...n}){const{handleOpen:i}=reactExports.useContext(M),o=k("io-dropdown-content",t),a=reactExports.useCallback((e=>{e.stopPropagation(),i&&i();}),[i]);return jsxRuntimeExports.jsx("div",{className:o,role:"button",onClick:a,...n})}T.displayName="DropdownButtonIcon";const _=reactExports.createContext({}),O=reactExports.forwardRef(((n,i)=>{const{className:o,prepend:r,append:a,isSelected:l,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,...h}=n,{variant:p="default",selected:g,checkIcon:v,handleItemClick:y}=reactExports.useContext(_),w=l??g?.some((e=>e.children===f)),b="default"!==p&&!!v,N=b||r,x=k("io-list-item",N&&"io-list-item-left",a&&"io-list-item-right","default"!==p&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",o);return jsxRuntimeExports.jsxs("li",{className:x,ref:i,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...h,children:[N&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(C,{variant:v.variant,title:w?v.tooltip:void 0}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})}));O.displayName="ListItem";const F=reactExports.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));F.displayName="ListItemTitle";const L=reactExports.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item",i&&"io-list-item-left",o&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));L.displayName="ListItemSection";const B=reactExports.forwardRef((({className:n,prepend:i,append:o,children:r,tooltip:a,...s},l)=>{const c=k("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[i&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:i}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),o&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:o})]})}));B.displayName="ListItemHeader";const R=reactExports.forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:o,...i,children:n})}));R.displayName="ListItemWithSubItems";const j=reactExports.forwardRef(((t,n)=>{const{className:i,variant:o="default",checkIcon:a,children:s,...u}=t,[d,f]=reactExports.useState([]),m=k("io-list","default"!==o&&"io-list-selectable",i),h=reactExports.useMemo((()=>{if(a)return "object"==typeof a?a:{variant:a}}),[a]),p=reactExports.useCallback(((e,t)=>{if("default"===o)return;const n=d.some((e=>e.children?.toString()===t.children?.toString()));"single"===o?f([t]):(()=>{const e=n?d.filter((e=>e.children!==t.children)):[...d,t];f(e);})();}),[d,o]),g=reactExports.useMemo((()=>({variant:o,selected:d,checkIcon:h,handleItemClick:p})),[o,d,h,p]);return jsxRuntimeExports.jsx(_.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...u,children:s})})}));j.displayName="List";const H=j;function z(e,t){reactExports.useEffect((()=>{const n=n=>{e.current&&!e.current.contains(n.target)&&t();};return document.addEventListener("mousedown",n),()=>{document.removeEventListener("mousedown",n);}}),[e,t]);}function $({className:t,variant:n="outline",align:i="down",disabled:o,children:a,...s}){const[u,f]=reactExports.useState(false),m=reactExports.useRef(null),h=k("io-dropdown",u&&"io-dropdown-open","default"!==n&&[`io-dropdown-${n}`],t),p=reactExports.useCallback((()=>{f(!u);}),[u]);z(m,reactExports.useCallback((()=>{f(false);}),[]));const g=reactExports.useMemo((()=>({isOpen:u,handleOpen:p,variant:n,align:i,disabled:o})),[u,p,n,i,o]);return jsxRuntimeExports.jsx(M.Provider,{value:g,children:jsxRuntimeExports.jsx("div",{className:h,ref:m,...s,children:a})})}function V({className:t,variant:n="default",align:i="left",children:o,...r}){const a=k("io-btn-group","sticky"===n&&"io-btn-group-sticky","append"===n&&"io-btn-group-append","fullwidth"===n&&"io-btn-group-fullwidth","right"===i&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,...r,children:o})}function Y({className:t,draggable:n=false,children:i,...o}){const r=k("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--spacing-8)"},...o,children:i})}function U({className:t,children:n,...i}){const o=k("io-dialog-header",t);return jsxRuntimeExports.jsx(Y,{"data-testid":"io-dialog-header",className:o,...i,children:n})}function W({className:t,children:n,...i}){const o=k("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:o,...i,children:n})}function J({className:t,children:n,...i}){const o=k("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:o,...i,children:n})}function q({className:t,...n}){const i=k("io-dialog-footer",t);return jsxRuntimeExports.jsx(J,{"data-testid":"io-dialog-footer",className:i,...n})}function K({className:n,variant:i="default",title:o="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s=(()=>console.log("closeFn not provided")),children:l,...c}){const u=reactExports.useRef(null),m=k("io-dialog","centered"===i&&"io-dialog-center",n);return reactExports.useLayoutEffect((()=>{const e=u?.current;e&&(r?e.showModal():e.close());}),[r,u]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:m,ref:u,"data-modal":true,onClose:()=>{r&&s();},onClick:e=>{"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(U,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:o}),jsxRuntimeExports.jsx(V,{children:jsxRuntimeExports.jsx(N,{"data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function G(){return "undefined"!=typeof window}function Q(e){return ee(e)?(e.nodeName||"").toLowerCase():"#document"}function X(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function Z(e){var t;return null==(t=(ee(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ee(e){return !!G()&&(e instanceof Node||e instanceof X(e).Node)}function te(e){return !!G()&&(e instanceof Element||e instanceof X(e).Element)}function ne(e){return !!G()&&(e instanceof HTMLElement||e instanceof X(e).HTMLElement)}function ie(e){return !(!G()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof X(e).ShadowRoot)}function oe(e){const{overflow:t,overflowX:n,overflowY:i,display:o}=ue(e);return /auto|scroll|overlay|hidden|clip/.test(t+i+n)&&!["inline","contents"].includes(o)}function re(e){return ["table","td","th"].includes(Q(e))}function ae(e){return [":popover-open",":modal"].some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function se(e){const t=le(),n=te(e)?ue(e):e;return "none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((e=>(n.willChange||"").includes(e)))||["paint","layout","strict","content"].some((e=>(n.contain||"").includes(e)))}function le(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function ce(e){return ["html","body","#document"].includes(Q(e))}function ue(e){return X(e).getComputedStyle(e)}function de(e){return te(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function fe(e){if("html"===Q(e))return e;const t=e.assignedSlot||e.parentNode||ie(e)&&e.host||Z(e);return ie(t)?t.host:t}function me(e){const t=fe(e);return ce(t)?e.ownerDocument?e.ownerDocument.body:e.body:ne(t)&&oe(t)?t:me(t)}function he(e,t,n){var i;void 0===t&&(t=[]),void 0===n&&(n=true);const o=me(e),r=o===(null==(i=e.ownerDocument)?void 0:i.body),a=X(o);if(r){const e=function(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}(a);return t.concat(a,a.visualViewport||[],oe(o)?o:[],e&&n?he(e):[])}return t.concat(o,he(o,[],n))}function pe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function ge(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&ie(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function ve(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function ye(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map((e=>{let{brand:t,version:n}=e;return t+"/"+n})).join(" "):navigator.userAgent}function we(e){return !(0!==e.mozInputSource||!e.isTrusted)||(Ce()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function be(e){return !ye().includes("jsdom/")&&(!Ce()&&0===e.width&&0===e.height||Ce()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function ke(){return /apple/i.test(navigator.vendor)}function Ce(){const e=/android/i;return e.test(ve())||e.test(ye())}function Ne(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function xe(e){return (null==e?void 0:e.ownerDocument)||document}function Se(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function De(e){return "composedPath"in e?e.composedPath()[0]:e.target}H.Item=O,H.ItemTitle=F,H.ItemSection=L,H.ItemHeader=B,H.ItemWithSubItems=R,$.Button=function({icon:t="chevron-down",...n}){const{handleOpen:i,disabled:o}=reactExports.useContext(M),a=reactExports.useCallback((e=>{e.stopPropagation(),i&&i();}),[i]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:a,disabled:o,...n})},$.ButtonIcon=T,$.Content=P,$.List=H,$.Item=O,$.ItemTitle=F,$.ItemSection=L,V.Button=A,V.ButtonIcon=N,V.Dropdown=$,Y.Title=E,Y.ButtonGroup=V,Y.Button=A,Y.ButtonIcon=N,Y.Dropdown=$,U.Title=E,U.ButtonGroup=V,U.Button=A,U.ButtonIcon=N,U.Dropdown=$,W.Content=function({className:t,children:n,...i}){const o=k("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})},J.ButtonGroup=V,J.Button=A,J.ButtonIcon=N,J.Dropdown=$,q.ButtonGroup=V,q.Button=A,q.ButtonIcon=N,q.Dropdown=$,K.Header=U,K.Body=W,K.Footer=q;const Ee="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function Ie(e){return ne(e)&&e.matches(Ee)}function Ae(e){e.preventDefault(),e.stopPropagation();}function Me(e){return !!e&&("combobox"===e.getAttribute("role")&&Ie(e))}const Te=Math.min,Pe=Math.max,_e=Math.round,Oe=Math.floor,Fe=e=>({x:e,y:e}),Le={left:"right",right:"left",bottom:"top",top:"bottom"},Be={start:"end",end:"start"};function Re(e,t,n){return Pe(e,Te(t,n))}function je(e,t){return "function"==typeof e?e(t):e}function He(e){return e.split("-")[0]}function ze(e){return e.split("-")[1]}function $e(e){return "x"===e?"y":"x"}function Ve(e){return "y"===e?"height":"width"}function Ye(e){return ["top","bottom"].includes(He(e))?"y":"x"}function Ue(e){return $e(Ye(e))}function We(e){return e.replace(/start|end/g,(e=>Be[e]))}function Je(e){return e.replace(/left|right|bottom|top/g,(e=>Le[e]))}function qe(e){const{x:t,y:n,width:i,height:o}=e;return {width:i,height:o,top:n,left:t,right:t+i,bottom:n+o,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var Ke=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),Ge="undefined"==typeof Element,Qe=Ge?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Xe=!Ge&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},Ze=function e(t,n){var i;void 0===n&&(n=true);var o=null==t||null===(i=t.getAttribute)||void 0===i?void 0:i.call(t,"inert");return ""===o||"true"===o||n&&t&&e(t.parentNode)},et=function e(t,n,i){for(var o=[],r=Array.from(t);r.length;){var a=r.shift();if(!Ze(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,i);i.flatten?o.push.apply(o,l):o.push({scopeParent:a,candidates:l});}else {Qe.call(a,Ke)&&i.filter(a)&&(n||!t.includes(a))&&o.push(a);var c=a.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(a),u=!Ze(c,false)&&(!i.shadowRootFilter||i.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,i);i.flatten?o.push.apply(o,d):o.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return o},tt=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},nt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!tt(e)?0:e.tabIndex},it=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},ot=function(e){return "INPUT"===e.tagName},rt=function(e){return function(e){return ot(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Xe(e),i=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=i(window.CSS.escape(e.name));else try{t=i(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var o=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !o||o===e}(e)},at=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return 0===n&&0===i},st=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var o=Qe.call(e,"details>summary:first-of-type")?e.parentElement:e;if(Qe.call(o,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return at(e)}else {if("function"==typeof i){for(var r=e;e;){var a=e.parentElement,s=Xe(e);if(a&&!a.shadowRoot&&true===i(a))return at(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,i,o,r=e&&Xe(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(i=n.ownerDocument)&&void 0!==i&&i.contains(a)||null!=e&&null!==(o=e.ownerDocument)&&void 0!==o&&o.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=Xe(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},lt=function(e,t){return !(t.disabled||Ze(t)||function(e){return ot(e)&&"hidden"===e.type}(t)||st(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return "SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if("LEGEND"===i.tagName)return !!Qe.call(t,"fieldset[disabled] *")||!i.contains(e)}return  true}t=t.parentElement;}return  false}(t))},ct=function(e,t){return !(rt(t)||nt(t)<0||!lt(e,t))},ut=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},dt=function e(t){var n=[],i=[];return t.forEach((function(t,o){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=nt(e);return n<0&&t&&!tt(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):i.push({documentOrder:o,tabIndex:s,item:t,isScope:r,content:l});})),i.sort(it).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)},ft=function(e,t){var n;return n=(t=t||{}).getShadowRoot?et([e],t.includeContainer,{filter:ct.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:ut}):function(e,t,n){if(Ze(e))return [];var i=Array.prototype.slice.apply(e.querySelectorAll(Ke));return t&&Qe.call(e,Ke)&&i.unshift(e),i.filter(n)}(e,t.includeContainer,ct.bind(null,t)),dt(n)},mt=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==Qe.call(e,Ke)&&ct(t,e)};function ht(e,t,n){let{reference:i,floating:o}=e;const r=Ye(t),a=Ue(t),s=Ve(a),l=He(t),c="y"===r,u=i.x+i.width/2-o.width/2,d=i.y+i.height/2-o.height/2,f=i[s]/2-o[s]/2;let m;switch(l){case "top":m={x:u,y:i.y-o.height};break;case "bottom":m={x:u,y:i.y+i.height};break;case "right":m={x:i.x+i.width,y:d};break;case "left":m={x:i.x-o.width,y:d};break;default:m={x:i.x,y:i.y};}switch(ze(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function pt(e,t){var n;void 0===t&&(t={});const{x:i,y:o,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=je(t,e),h=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),p=s[f?"floating"===d?"reference":"floating":d],g=qe(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(p)))||n?p:p.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=qe(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+h.top)/w.y,bottom:(b.bottom-g.bottom+h.bottom)/w.y,left:(g.left-b.left+h.left)/w.x,right:(b.right-g.right+h.right)/w.x}}function gt(e){const t=ue(e);let n=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const o=ne(e),r=o?e.offsetWidth:n,a=o?e.offsetHeight:i,s=_e(n)!==r||_e(i)!==a;return s&&(n=r,i=a),{width:n,height:i,$:s}}function vt(e){return te(e)?e:e.contextElement}function yt(e){const t=vt(e);if(!ne(t))return Fe(1);const n=t.getBoundingClientRect(),{width:i,height:o,$:r}=gt(t);let a=(r?_e(n.width):n.width)/i,s=(r?_e(n.height):n.height)/o;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const wt=Fe(0);function bt(e){const t=X(e);return le()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:wt}function kt(e,t,n,i){ void 0===t&&(t=false),void 0===n&&(n=false);const o=e.getBoundingClientRect(),r=vt(e);let a=Fe(1);t&&(i?te(i)&&(a=yt(i)):a=yt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==X(e))&&t}(r,n,i)?bt(r):Fe(0);let l=(o.left+s.x)/a.x,c=(o.top+s.y)/a.y,u=o.width/a.x,d=o.height/a.y;if(r){const e=X(r),t=i&&te(i)?X(i):i;let n=e,o=n.frameElement;for(;o&&i&&t!==n;){const e=yt(o),t=o.getBoundingClientRect(),i=ue(o),r=t.left+(o.clientLeft+parseFloat(i.paddingLeft))*e.x,a=t.top+(o.clientTop+parseFloat(i.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=X(o),o=n.frameElement;}}return qe({width:u,height:d,x:l,y:c})}const Ct=[":popover-open",":modal"];function Nt(e){return Ct.some((t=>{try{return e.matches(t)}catch(e){return  false}}))}function xt(e){return kt(Z(e)).left+de(e).scrollLeft}function St(e,t,n){let i;if("viewport"===t)i=function(e,t){const n=X(e),i=Z(e),o=n.visualViewport;let r=i.clientWidth,a=i.clientHeight,s=0,l=0;if(o){r=o.width,a=o.height;const e=le();(!e||e&&"fixed"===t)&&(s=o.offsetLeft,l=o.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)i=function(e){const t=Z(e),n=de(e),i=e.ownerDocument.body,o=Pe(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),r=Pe(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+xt(e);const s=-n.scrollTop;return "rtl"===ue(i).direction&&(a+=Pe(t.clientWidth,i.clientWidth)-o),{width:o,height:r,x:a,y:s}}(Z(e));else if(te(t))i=function(e,t){const n=kt(e,true,"fixed"===t),i=n.top+e.clientTop,o=n.left+e.clientLeft,r=ne(e)?yt(e):Fe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:o*r.x,y:i*r.y}}(t,n);else {const n=bt(e);i={...t,x:t.x-n.x,y:t.y-n.y};}return qe(i)}function Dt(e,t){const n=fe(e);return !(n===t||!te(n)||ce(n))&&("fixed"===ue(n).position||Dt(n,t))}function Et(e,t,n){const i=ne(t),o=Z(t),r="fixed"===n,a=kt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=Fe(0);if(i||!i&&!r)if(("body"!==Q(t)||oe(o))&&(s=de(t)),i){const e=kt(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else o&&(l.x=xt(o));return {x:a.left+s.scrollLeft-l.x,y:a.top+s.scrollTop-l.y,width:a.width,height:a.height}}function It(e){return "static"===ue(e).position}function At(e,t){return ne(e)&&"fixed"!==ue(e).position?t?t(e):e.offsetParent:null}function Mt(e,t){const n=X(e);if(Nt(e))return n;if(!ne(e)){let t=fe(e);for(;t&&!ce(t);){if(te(t)&&!It(t))return t;t=fe(t);}return n}let i=At(e,t);for(;i&&re(i)&&It(i);)i=At(i,t);return i&&ce(i)&&It(i)&&!se(i)?n:i||function(e){let t=fe(e);for(;ne(t)&&!ce(t);){if(se(t))return t;if(ae(t))return null;t=fe(t);}return null}(e)||n}const Tt={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:i,strategy:o}=e;const r="fixed"===o,a=Z(i),s=!!t&&Nt(t.floating);if(i===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Fe(1);const u=Fe(0),d=ne(i);if((d||!d&&!r)&&(("body"!==Q(i)||oe(a))&&(l=de(i)),ne(i))){const e=kt(i);c=yt(i),u.x=e.x+i.clientLeft,u.y=e.y+i.clientTop;}return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x,y:n.y*c.y-l.scrollTop*c.y+u.y}},getDocumentElement:Z,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:i,strategy:o}=e;const r=[..."clippingAncestors"===n?Nt(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let i=he(e,[],false).filter((e=>te(e)&&"body"!==Q(e))),o=null;const r="fixed"===ue(e).position;let a=r?fe(e):e;for(;te(a)&&!ce(a);){const t=ue(a),n=se(a);n||"fixed"!==t.position||(o=null),(r?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||oe(a)&&!n&&Dt(e,a))?i=i.filter((e=>e!==a)):o=t,a=fe(a);}return t.set(e,i),i}(t,this._c):[].concat(n),i],a=r[0],s=r.reduce(((e,n)=>{const i=St(t,n,o);return e.top=Pe(i.top,e.top),e.right=Te(i.right,e.right),e.bottom=Te(i.bottom,e.bottom),e.left=Pe(i.left,e.left),e}),St(t,a,o));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Mt,getElementRects:async function(e){const t=this.getOffsetParent||Mt,n=this.getDimensions,i=await n(e.floating);return {reference:Et(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=gt(e);return {width:t,height:n}},getScale:yt,isElement:te,isRTL:function(e){return "rtl"===ue(e).direction}};function Pt(e,t,n,i){ void 0===i&&(i={});const{ancestorScroll:o=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=i,c=vt(e),u=o||r?[...c?he(c):[],...he(t)]:[];u.forEach((e=>{o&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);}));const d=c&&s?function(e,t){let n,i=null;const o=Z(e);function r(){var e;clearTimeout(n),null==(e=i)||e.disconnect(),i=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const{left:c,top:u,width:d,height:f}=e.getBoundingClientRect();if(s||t(),!d||!f)return;const m={rootMargin:-Oe(u)+"px "+-Oe(o.clientWidth-(c+d))+"px "+-Oe(o.clientHeight-(u+f))+"px "+-Oe(c)+"px",threshold:Pe(0,Te(1,l))||1};let h=true;function p(e){const t=e[0].intersectionRatio;if(t!==l){if(!h)return a();t?a(false,t):n=setTimeout((()=>{a(false,1e-7);}),1e3);}h=false;}try{i=new IntersectionObserver(p,{...m,root:o.ownerDocument});}catch(e){i=new IntersectionObserver(p,m);}i.observe(e);}(true),r}(c,n):null;let f,m=-1,h=null;a&&(h=new ResizeObserver((e=>{let[i]=e;i&&i.target===c&&h&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame((()=>{var e;null==(e=h)||e.observe(t);}))),n();})),c&&!l&&h.observe(c),h.observe(t));let p=l?kt(e):null;return l&&function t(){const i=kt(e);!p||i.x===p.x&&i.y===p.y&&i.width===p.width&&i.height===p.height||n();p=i,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach((e=>{o&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);})),null==d||d(),null==(e=h)||e.disconnect(),h=null,l&&cancelAnimationFrame(f);}}const _t=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,i;const{x:o,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:i,elements:o}=e,r=await(null==i.isRTL?void 0:i.isRTL(o.floating)),a=He(n),s=ze(n),l="y"===Ye(n),c=["left","top"].includes(a)?-1:1,u=r&&l?-1:1,d=je(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:h}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"==typeof h&&(m="end"===s?-1*h:h),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(i=s.arrow)&&i.alignmentOffset?{}:{x:o+l.x,y:r+l.y,data:{...l,placement:a}}}}},Ot=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:i,placement:o}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=je(e,t),c={x:n,y:i},u=await pt(t,l),d=Ye(He(o)),f=$e(d);let m=c[f],h=c[d];if(r){const e="y"===f?"bottom":"right";m=Re(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";h=Re(h+u["y"===d?"top":"left"],h,h-u[e]);}const p=s.fn({...t,[f]:m,[d]:h});return {...p,data:{x:p.x-n,y:p.y-i}}}}},Ft=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,i;const{placement:o,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:p=true,...g}=je(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=He(o),y=He(s)===s,w=await(null==l.isRTL?void 0:l.isRTL(c.floating)),b=f||(y||!p?[Je(s)]:function(e){const t=Je(e);return [We(e),t,We(t)]}(s));f||"none"===h||b.push(...function(e,t,n,i){const o=ze(e);let r=function(e,t,n){const i=["left","right"],o=["right","left"],r=["top","bottom"],a=["bottom","top"];switch(e){case "top":case "bottom":return n?t?o:i:t?i:o;case "left":case "right":return t?r:a;default:return []}}(He(e),"start"===n,i);return o&&(r=r.map((e=>e+"-"+o)),t&&(r=r.concat(r.map(We)))),r}(s,p,h,w));const k=[s,...b],C=await pt(t,g),N=[];let x=(null==(i=r.flip)?void 0:i.overflows)||[];if(u&&N.push(C[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const i=ze(e),o=Ue(e),r=Ve(o);let a="x"===o?i===(n?"end":"start")?"right":"left":"start"===i?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=Je(a)),[a,Je(a)]}(o,a,w);N.push(C[e[0]],C[e[1]]);}if(x=[...x,{placement:o,overflows:N}],!N.every((e=>e<=0))){var S,D;const e=((null==(S=r.flip)?void 0:S.index)||0)+1,t=k[e];if(t)return {data:{index:e,overflows:x},reset:{placement:t}};let n=null==(D=x.filter((e=>e.overflows[0]<=0)).sort(((e,t)=>e.overflows[1]-t.overflows[1]))[0])?void 0:D.placement;if(!n)switch(m){case "bestFit":{var E;const e=null==(E=x.map((e=>[e.placement,e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)])).sort(((e,t)=>e[1]-t[1]))[0])?void 0:E[0];e&&(n=e);break}case "initialPlacement":n=s;}if(o!==n)return {reset:{placement:n}}}return {}}}},Lt=(e,t,n)=>{const i=new Map,o={platform:Tt,...n},r={...o.platform,_c:i};return (async(e,t,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:d}=ht(c,i,l),f=i,m={},h=0;for(let n=0;n<s.length;n++){const{name:r,fn:p}=s[n],{x:g,y:v,data:y,reset:w}=await p({x:u,y:d,initialPlacement:i,placement:f,strategy:o,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&h<=50&&(h++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:o}):w.rects),({x:u,y:d}=ht(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:o,middlewareData:m}})(e,t,{...o,platform:r})};var Bt="undefined"!=typeof document?reactExports.useLayoutEffect:reactExports.useEffect;function Rt(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,i,o;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(i=n;0!=i--;)if(!Rt(e[i],t[i]))return  false;return  true}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return  false;for(i=n;0!=i--;)if(!{}.hasOwnProperty.call(t,o[i]))return  false;for(i=n;0!=i--;){const n=o[i];if(("_owner"!==n||!e.$$typeof)&&!Rt(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function jt(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function Ht(e,t){const n=jt(e);return Math.round(t*n)/n}function zt(e){const t=reactExports.useRef(e);return Bt((()=>{t.current=e;})),t}const $t=(e,t)=>({...Ot(e),options:[e,t]}),Vt=(e,t)=>({...Ft(e),options:[e,t]});function Yt(e){return reactExports.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);}));}),e)}const Ut={...i},Wt=Ut.useInsertionEffect||(e=>e());function Jt(e){const t=reactExports.useRef((()=>{}));return Wt((()=>{t.current=e;})),reactExports.useCallback((function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return null==t.current?void 0:t.current(...n)}),[])}const qt="ArrowUp",Kt="ArrowDown",Gt="ArrowLeft",Qt="ArrowRight";function Xt(e,t,n){return Math.floor(e/t)!==n}function Zt(e,t){return t<0||t>=e.current.length}function en(e,t){return nn(e,{disabledIndices:t})}function tn(e,t){return nn(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function nn(e,t){let{startingIndex:n=-1,decrement:i=false,disabledIndices:o,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=i?-r:r;}while(s>=0&&s<=a.length-1&&an(a,s,o));return s}function on(e,t,n,i,o){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(o){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*i:r;case "br":return n.lastIndexOf(e)}}function rn(e,t){return t.flatMap(((t,n)=>e.includes(t)?[n]:[]))}function an(e,t,n){if(n)return n.includes(t);const i=e[t];return null==i||i.hasAttribute("disabled")||"true"===i.getAttribute("aria-disabled")}var sn="undefined"!=typeof document?reactExports.useLayoutEffect:reactExports.useEffect;function ln(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const cn=reactExports.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function un(e){const{children:t,elementsRef:n,labelsRef:o}=e,[r,a]=reactExports.useState((()=>new Map)),s=reactExports.useCallback((e=>{a((t=>new Map(t).set(e,null)));}),[]),l=reactExports.useCallback((e=>{a((t=>{const n=new Map(t);return n.delete(e),n}));}),[]);return sn((()=>{const e=new Map(r);Array.from(e.keys()).sort(ln).forEach(((t,n)=>{e.set(t,n);})),function(e,t){if(e.size!==t.size)return  false;for(const[n,i]of e.entries())if(i!==t.get(n))return  false;return  true}(r,e)||a(e);}),[r]),reactExports.createElement(cn.Provider,{value:reactExports.useMemo((()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:o})),[s,l,r,n,o])},t)}function dn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:o,map:r,elementsRef:a,labelsRef:s}=reactExports.useContext(cn),[l,c]=reactExports.useState(null),u=reactExports.useRef(null),d=reactExports.useCallback((e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const i=void 0!==t;s.current[l]=i?t:null!=(n=null==e?void 0:e.textContent)?n:null;}}),[l,a,s,t]);return sn((()=>{const e=u.current;if(e)return n(e),()=>{o(e);}}),[n,o]),sn((()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);}),[r]),reactExports.useMemo((()=>({ref:d,index:null==l?-1:l})),[l,d])}function fn(){return fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i]);}return e},fn.apply(this,arguments)}let mn=false,hn=0;const pn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+hn++;const gn=Ut.useId||function(){const[e,t]=reactExports.useState((()=>mn?pn():void 0));return sn((()=>{null==e&&t(pn());}),[]),reactExports.useEffect((()=>{mn=true;}),[]),e};function wn(){const e=new Map;return {emit(t,n){var i;null==(i=e.get(t))||i.forEach((e=>e(n)));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var i;e.set(t,(null==(i=e.get(t))?void 0:i.filter((e=>e!==n)))||[]);}}}const bn=reactExports.createContext(null),kn=reactExports.createContext(null),Cn=()=>{var e;return (null==(e=reactExports.useContext(bn))?void 0:e.id)||null},Nn=()=>reactExports.useContext(kn);function xn(e){const{children:t,id:n}=e,o=Cn();return reactExports.createElement(bn.Provider,{value:reactExports.useMemo((()=>({id:n,parentId:o})),[n,o])},t)}function Sn(e){const{children:t}=e,n=reactExports.useRef([]),o=reactExports.useCallback((e=>{n.current=[...n.current,e];}),[]),r=reactExports.useCallback((e=>{n.current=n.current.filter((t=>t!==e));}),[]),a=reactExports.useState((()=>wn()))[0];return reactExports.createElement(kn.Provider,{value:reactExports.useMemo((()=>({nodesRef:n,addNode:o,removeNode:r,events:a})),[o,r,a])},t)}function Dn(e){return "data-floating-ui-"+e}function En(e){const t=reactExports.useRef(e);return sn((()=>{t.current=e;})),t}const In=Dn("safe-polygon");function An(e,t,n){return n&&!Ne(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let Mn=0;function Tn(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:i=true,sync:o=false}=t;i&&cancelAnimationFrame(Mn);const r=()=>null==e?void 0:e.focus({preventScroll:n});o?r():Mn=requestAnimationFrame(r);}function Pn(e,t){let n=e.filter((e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)})),i=n;for(;i.length;)i=e.filter((e=>{var t;return null==(t=i)?void 0:t.some((t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)}))})),n=n.concat(i);return n}let _n=new WeakMap,On=new WeakSet,Fn={},Ln=0;const Bn=e=>e&&(e.host||Bn(e.parentNode)),Rn=(e,t)=>t.map((t=>{if(e.contains(t))return t;const n=Bn(t);return e.contains(n)?n:null})).filter((e=>null!=e));function jn(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const i=xe(e[0]).body;return function(e,t,n,i){const o="data-floating-ui-inert",r=i?"inert":n?"aria-hidden":null,a=Rn(t,e),s=new Set,l=new Set(a),c=[];Fn[o]||(Fn[o]=new WeakMap);const u=Fn[o];return a.forEach((function e(t){t&&!s.has(t)&&(s.add(t),t.parentNode&&e(t.parentNode));})),function e(t){t&&!l.has(t)&&[].forEach.call(t.children,(t=>{if("script"!==Q(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,i=(_n.get(t)||0)+1,a=(u.get(t)||0)+1;_n.set(t,i),u.set(t,a),c.push(t),1===i&&n&&On.add(t),1===a&&t.setAttribute(o,""),!n&&r&&t.setAttribute(r,"true");}}));}(t),s.clear(),Ln++,()=>{c.forEach((e=>{const t=(_n.get(e)||0)-1,n=(u.get(e)||0)-1;_n.set(e,t),u.set(e,n),t||(!On.has(e)&&r&&e.removeAttribute(r),On.delete(e)),n||e.removeAttribute(o);})),Ln--,Ln||(_n=new WeakMap,_n=new WeakMap,On=new WeakSet,Fn={});}}(e.concat(Array.from(i.querySelectorAll("[aria-live]"))),i,t,n)}const Hn=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function zn(e,t){const n=ft(e,Hn());"prev"===t&&n.reverse();const i=n.indexOf(pe(xe(e)));return n.slice(i+1)[0]}function $n(e,t){const n=t||e.currentTarget,i=e.relatedTarget;return !i||!ge(n,i)}const Vn={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function Yn(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const Un=reactExports.forwardRef((function(e,t){const[n,o]=reactExports.useState();sn((()=>(ke()&&o("button"),document.addEventListener("keydown",Yn),()=>{document.removeEventListener("keydown",Yn);})),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Dn("focus-guard")]:"",style:Vn};return reactExports.createElement("span",fn({},e,r))})),Wn=reactExports.createContext(null),Jn="data-floating-ui-focusable";function qn(e){return e?e.hasAttribute(Jn)?e:e.querySelector("["+Jn+"]")||e:null}const Kn=20;let Gn=[];function Qn(e){Gn=Gn.filter((e=>e.isConnected));let t=e;if(t&&"body"!==Q(t)){if(!mt(t,Hn())){const e=ft(t,Hn())[0];e&&(t=e);}Gn.push(t),Gn.length>Kn&&(Gn=Gn.slice(-20));}}function Xn(){return Gn.slice().reverse().find((e=>e.isConnected))}const Zn=reactExports.forwardRef((function(e,t){return reactExports.createElement("button",fn({},e,{type:"button",ref:t,tabIndex:-1,style:Vn}))}));function ei(e){const{context:t,children:n,disabled:o=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:h,nodeId:p,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:k}}=t,C="number"==typeof s&&s<0,N=Me(b)&&C,x="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,S=En(r),D=En(s),E=En(l),I=Nn(),A=reactExports.useContext(Wn),M=reactExports.useRef(null),T=reactExports.useRef(null),P=reactExports.useRef(false),_=reactExports.useRef(false),O=reactExports.useRef(-1),F=null!=A,L=qn(k),B=Jt((function(e){return void 0===e&&(e=L),e?ft(e,Hn()):[]})),R=Jt((e=>{const t=B(e);return S.current.map((e=>b&&"reference"===e?b:L&&"floating"===e?L:t)).filter(Boolean).flat()}));function j(e){return !o&&d&&u?reactExports.createElement(Zn,{ref:"start"===e?M:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}reactExports.useEffect((()=>{if(o)return;if(!u)return;function e(e){if("Tab"===e.key){ge(L,pe(xe(L)))&&0===B().length&&!N&&Ae(e);const t=R(),n=De(e);"reference"===S.current[0]&&n===b&&(Ae(e),e.shiftKey?Tn(t[t.length-1]):Tn(t[1])),"floating"===S.current[1]&&n===L&&e.shiftKey&&(Ae(e),Tn(t[0]));}}const t=xe(L);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}}),[o,b,L,u,S,N,B,R]),reactExports.useEffect((()=>{if(!o&&k)return k.addEventListener("focusin",e),()=>{k.removeEventListener("focusin",e);};function e(e){const t=De(e),n=B().indexOf(t);-1!==n&&(O.current=n);}}),[o,k,B]),reactExports.useEffect((()=>{if(!o&&f)return k&&ne(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),k.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),k.removeEventListener("focusout",t);}):void 0;function e(){_.current=true,setTimeout((()=>{_.current=false;}));}function t(e){const t=e.relatedTarget;queueMicrotask((()=>{const n=!(ge(b,t)||ge(k,t)||ge(t,k)||ge(null==A?void 0:A.portalNode,t)||null!=t&&t.hasAttribute(Dn("focus-guard"))||I&&(Pn(I.nodesRef.current,p).find((e=>{var n,i;return ge(null==(n=e.context)?void 0:n.elements.floating,t)||ge(null==(i=e.context)?void 0:i.elements.domReference,t)}))||function(e,t){var n;let i=[],o=null==(n=e.find((e=>e.id===t)))?void 0:n.parentId;for(;o;){const t=e.find((e=>e.id===o));o=null==t?void 0:t.parentId,t&&(i=i.concat(t));}return i}(I.nodesRef.current,p).find((e=>{var n,i;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(i=e.context)?void 0:i.elements.domReference)===t}))));if(c&&n&&pe(xe(L))===xe(L).body){ne(L)&&L.focus();const e=O.current,t=B(),n=t[e]||t[t.length-1]||L;ne(n)&&n.focus();}!N&&u||!t||!n||_.current||t===Xn()||(P.current=true,g(false,e,"focus-out"));}));}}),[o,b,k,L,u,p,I,A,g,f,c,B,N]),reactExports.useEffect((()=>{var e;if(o)return;const t=Array.from((null==A||null==(e=A.portalNode)?void 0:e.querySelectorAll("["+Dn("portal")+"]"))||[]);if(k){const e=[k,...t,M.current,T.current,S.current.includes("reference")||N?b:null].filter((e=>null!=e)),n=u||N?jn(e,x,!x):jn(e);return ()=>{n();}}}),[o,b,k,u,S,A,N,x]),sn((()=>{if(o||!ne(L))return;const e=pe(xe(L));queueMicrotask((()=>{const t=R(L),n=D.current,i=("number"==typeof n?t[n]:n.current)||L,o=ge(L,e);C||o||!m||Tn(i,{preventScroll:i===L});}));}),[o,m,L,C,R,D]),sn((()=>{if(o||!L)return;let e=false;const t=xe(L),n=pe(t);let i=y.current.openEvent;function r(t){let{open:n,reason:o,event:r,nested:a}=t;n&&(i=r),"escape-key"===o&&h.domReference.current&&Qn(h.domReference.current),"hover"===o&&"mouseleave"===r.type&&(P.current=true),"outside-press"===o&&(a?(P.current=false,e=true):P.current=!(we(r)||be(r)));}Qn(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,Vn),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=pe(t),o=ge(k,n)||I&&Pn(I.nodesRef.current,p).some((e=>{var t;return ge(null==(t=e.context)?void 0:t.elements.floating,n)}));(o||i&&["click","mousedown"].includes(i.type))&&h.domReference.current&&Qn(h.domReference.current);const s="boolean"==typeof E.current?Xn()||a:E.current.current||a;queueMicrotask((()=>{E.current&&!P.current&&ne(s)&&(s===n||n===t.body||o)&&s.focus({preventScroll:e}),a.remove();}));}}),[o,k,L,E,y,h,v,I,p,F,b]),reactExports.useEffect((()=>{queueMicrotask((()=>{P.current=false;}));}),[o]),sn((()=>{if(!o&&A)return A.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:h}),()=>{A.setFocusManagerState(null);}}),[o,A,u,m,g,h,f]),sn((()=>{if(o)return;if(!L)return;if("function"!=typeof MutationObserver)return;if(C)return;const e=()=>{const e=L.getAttribute("tabindex"),t=B(),n=pe(xe(k)),i=t.indexOf(n);-1!==i&&(O.current=i),S.current.includes("floating")||n!==h.domReference.current&&0===t.length?"0"!==e&&L.setAttribute("tabindex","0"):"-1"!==e&&L.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(L,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}}),[o,k,L,h,S,B,C]);const H=!o&&x&&(!u||!N)&&(F||u);return reactExports.createElement(reactExports.Fragment,null,H&&reactExports.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.beforeInsideRef,onFocus:e=>{if(u){const e=R();Tn("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(P.current=false,$n(e,A.portalNode)){const e=zn(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=A.beforeOutsideRef.current)||t.focus();}}}),!N&&j("start"),n,j("end"),H&&reactExports.createElement(Un,{"data-type":"inside",ref:null==A?void 0:A.afterInsideRef,onFocus:e=>{if(u)Tn(R()[0]);else if(null!=A&&A.preserveTabOrder&&A.portalNode)if(f&&(P.current=true),$n(e,A.portalNode)){const e=zn(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=A.afterOutsideRef.current)||t.focus();}}}))}function ti(e){return ne(e.target)&&"BUTTON"===e.target.tagName}function ni(e){return Ie(e)}const ii={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},oi={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},ri=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function ai(e){const{open:t=false,onOpenChange:n,elements:o}=e,r=gn(),a=reactExports.useRef({}),[s]=reactExports.useState((()=>wn())),l=null!=Cn();const[c,u]=reactExports.useState(o.reference),d=Jt(((e,t,i)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:i,nested:l}),null==n||n(e,t,i);})),f=reactExports.useMemo((()=>({setPositionReference:u})),[]),m=reactExports.useMemo((()=>({reference:c||o.reference||null,floating:o.floating||null,domReference:o.reference})),[c,o.reference,o.floating]);return reactExports.useMemo((()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f})),[t,d,m,s,r,f])}function si(e){ void 0===e&&(e={});const{nodeId:t}=e,n=ai({...e,elements:{reference:null,floating:null,...e.elements}}),o=e.rootContext||n,r=o.elements,[a,s]=reactExports.useState(null),[l,c]=reactExports.useState(null),u=(null==r?void 0:r.domReference)||a,d=reactExports.useRef(null),f=Nn();sn((()=>{u&&(d.current=u);}),[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=reactExports.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,h]=reactExports.useState(o);Rt(m,o)||h(o);const[g,v]=reactExports.useState(null),[y,w]=reactExports.useState(null),b=reactExports.useCallback((e=>{e!==x.current&&(x.current=e,v(e));}),[]),k=reactExports.useCallback((e=>{e!==S.current&&(S.current=e,w(e));}),[]),C=a||g,N=s||y,x=reactExports.useRef(null),S=reactExports.useRef(null),D=reactExports.useRef(d),E=null!=c,I=zt(c),A=zt(r),M=zt(u),T=reactExports.useCallback((()=>{if(!x.current||!S.current)return;const e={placement:t,strategy:n,middleware:m};A.current&&(e.platform=A.current),Lt(x.current,S.current,e).then((e=>{const t={...e,isPositioned:false!==M.current};P.current&&!Rt(D.current,t)&&(D.current=t,reactDomExports.flushSync((()=>{f(t);})));}));}),[m,t,n,A,M]);Bt((()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f((e=>({...e,isPositioned:false}))));}),[u]);const P=reactExports.useRef(false);Bt((()=>(P.current=true,()=>{P.current=false;})),[]),Bt((()=>{if(C&&(x.current=C),N&&(S.current=N),C&&N){if(I.current)return I.current(C,N,T);T();}}),[C,N,T,I,E]);const _=reactExports.useMemo((()=>({reference:x,floating:S,setReference:b,setFloating:k})),[b,k]),O=reactExports.useMemo((()=>({reference:C,floating:N})),[C,N]),F=reactExports.useMemo((()=>{const e={position:n,left:0,top:0};if(!O.floating)return e;const t=Ht(O.floating,d.x),i=Ht(O.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+i+"px)",...jt(O.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:i}}),[n,l,O.floating,d.x,d.y]);return reactExports.useMemo((()=>({...d,update:T,refs:_,elements:O,floatingStyles:F})),[d,T,_,O,F])}({...e,elements:{...r,...l&&{reference:l}}}),h=reactExports.useCallback((e=>{const t=te(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);}),[m.refs]),g=reactExports.useCallback((e=>{(te(e)||null===e)&&(d.current=e,s(e)),(te(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!te(e))&&m.refs.setReference(e);}),[m.refs]),v=reactExports.useMemo((()=>({...m.refs,setReference:g,setPositionReference:h,domReference:d})),[m.refs,g,h]),y=reactExports.useMemo((()=>({...m.elements,domReference:u})),[m.elements,u]),w=reactExports.useMemo((()=>({...m,...o,refs:v,elements:y,nodeId:t})),[m,v,y,t,o]);return sn((()=>{o.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find((e=>e.id===t));e&&(e.context=w);})),reactExports.useMemo((()=>({...m,context:w,refs:v,elements:y})),[m,v,y,w])}const li="active",ci="selected";function ui(e,t,n){const i=new Map,o="item"===n;let r=e;if(o&&e){const{[li]:t,[ci]:n,...i}=e;r=i;}return {..."floating"===n&&{tabIndex:-1,[Jn]:""},...r,...t.map((t=>{const i=t?t[n]:null;return "function"==typeof i?e?i(e):null:i})).concat(e).reduce(((e,t)=>t?(Object.entries(t).forEach((t=>{let[n,r]=t;var a;o&&[li,ci].includes(n)||(0===n.indexOf("on")?(i.has(n)||i.set(n,[]),"function"==typeof r&&(null==(a=i.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return null==(e=i.get(n))?void 0:e.map((e=>e(...o))).find((e=>void 0!==e))})):e[n]=r);})),e):e),{})}}let di=false;function fi(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function mi(e,t){return fi(t,e===qt||e===Kt,e===Gt||e===Qt)}function hi(e,t,n){return fi(t,e===Kt,n?e===Gt:e===Qt)||"Enter"===e||" "===e||""===e}function pi(e,t,n){return fi(t,n?e===Qt:e===Gt,e===qt)}function gi(e,t){const{open:n,onOpenChange:o,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=(()=>{}),enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:h=false,virtual:p=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:k=1,scrollItemIntoView:C=true,virtualItemRef:N,itemSizes:x,dense:S=false}=t;const D=En(qn(r.floating)),E=Cn(),I=Nn(),A=Jt(l),M=Me(r.domReference),T=reactExports.useRef(g),P=reactExports.useRef(null!=u?u:-1),_=reactExports.useRef(null),O=reactExports.useRef(true),F=reactExports.useRef(A),L=reactExports.useRef(!!r.floating),B=reactExports.useRef(n),R=reactExports.useRef(false),j=reactExports.useRef(false),H=En(w),z=En(n),$=En(C),V=En(u),[Y,U]=reactExports.useState(),[W,J]=reactExports.useState(),q=Jt((function(e,t,n){function i(e){p?(U(e.id),null==I||I.events.emit("virtualfocus",e),N&&(N.current=e)):Tn(e,{preventScroll:true,sync:!(!ve().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!ke())&&(di||R.current)});} void 0===n&&(n=false);const o=e.current[t.current];o&&i(o),requestAnimationFrame((()=>{const r=e.current[t.current]||o;if(!r)return;o||i(r);const a=$.current;a&&G&&(n||!O.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));}));}));sn((()=>{document.createElement("div").focus({get preventScroll(){return di=true,false}});}),[]),sn((()=>{c&&(n&&r.floating?T.current&&null!=u&&(j.current=true,P.current=u,A(u)):L.current&&(P.current=-1,F.current(null)));}),[c,n,r.floating,u,A]),sn((()=>{if(c&&n&&r.floating)if(null==s){if(R.current=false,null!=V.current)return;if(L.current&&(P.current=-1,q(a,P)),(!B.current||!L.current)&&T.current&&(null!=_.current||true===T.current&&null==_.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else P.current=null==_.current||hi(_.current,b,h)||m?en(a,H.current):tn(a,H.current),_.current=null,A(P.current);};t();}}else Zt(a,s)||(P.current=s,q(a,P,j.current),j.current=false);}),[c,n,r.floating,s,V,m,a,b,h,A,q,H]),sn((()=>{var e;if(!c||r.floating||!I||p||!L.current)return;const t=I.nodesRef.current,n=null==(e=t.find((e=>e.id===E)))||null==(e=e.context)?void 0:e.elements.floating,i=pe(xe(r.floating)),o=t.some((e=>e.context&&ge(e.context.elements.floating,i)));n&&!o&&O.current&&n.focus({preventScroll:true});}),[c,r.floating,I,E,p]),sn((()=>{if(c&&I&&p&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){J(e.id),N&&(N.current=e);}}),[c,I,p,E,N]),sn((()=>{F.current=A,L.current=!!r.floating;})),sn((()=>{n||(_.current=null);}),[n]),sn((()=>{B.current=n;}),[n]);const K=null!=s,G=reactExports.useMemo((()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&A(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;O.current&&"touch"!==t&&(P.current=-1,q(a,P),A(null),p||Tn(D.current,{preventScroll:true}));}}}}),[n,D,q,v,a,A,p]),Q=Jt((e=>{if(O.current=false,R.current=true,229===e.which)return;if(!z.current&&e.currentTarget===D.current)return;if(m&&pi(e.key,b,h))return Ae(e),o(false,e.nativeEvent,"list-navigation"),void(ne(r.domReference)&&(p?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=P.current,i=en(a,w),s=tn(a,w);if(M||("Home"===e.key&&(Ae(e),P.current=i,A(P.current)),"End"===e.key&&(Ae(e),P.current=s,A(P.current))),k>1){const t=x||Array.from({length:a.current.length},(()=>({width:1,height:1}))),n=function(e,t,n){const i=[];let o=0;return e.forEach(((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(o=0);!l;){const e=[];for(let n=0;n<a;n++)for(let i=0;i<s;i++)e.push(o+n+i*t);o%t+a<=t&&e.every((e=>null==i[e]))?(e.forEach((e=>{i[e]=r;})),l=true):o++;}})),[...i]}(t,k,S),o=n.findIndex((e=>null!=e&&!an(a.current,e,w))),r=n.reduce(((e,t,n)=>null==t||an(a.current,t,w)?e:n),-1),l=n[function(e,t){let{event:n,orientation:i,loop:o,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===qt){if(d&&Ae(n),-1===u)f=c;else if(f=nn(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),o&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}Zt(e,f)&&(f=u);}if(n.key===Kt&&(d&&Ae(n),-1===u?f=l:(f=nn(e,{startingIndex:u,amount:a,disabledIndices:s}),o&&u+a>c&&(f=nn(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Zt(e,f)&&(f=u)),"both"===i){const t=Oe(u/a);n.key===(r?Gt:Qt)&&(d&&Ae(n),u%a!=a-1?(f=nn(e,{startingIndex:u,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u-u%a-1,disabledIndices:s})),Xt(f,a,t)&&(f=u)),n.key===(r?Qt:Gt)&&(d&&Ae(n),u%a!=0?(f=nn(e,{startingIndex:u,decrement:true,disabledIndices:s}),o&&Xt(f,a,t)&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):o&&(f=nn(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),Xt(f,a,t)&&(f=u));const i=Oe(c/a)===t;Zt(e,f)&&(f=o&&i?n.key===(r?Qt:Gt)?c:nn(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map((e=>null!=e?a.current[e]:null))},{event:e,orientation:b,loop:f,rtl:h,cols:k,disabledIndices:rn([...w||a.current.map(((e,t)=>an(a.current,t)?t:void 0)),void 0],n),minIndex:o,maxIndex:r,prevIndex:on(P.current>s?i:P.current,t,n,k,e.key===Kt?"bl":e.key===(h?Gt:Qt)?"tr":"tl"),stopEvent:true})];if(null!=l&&(P.current=l,A(P.current)),"both"===b)return}if(mi(e.key,b)){if(Ae(e),n&&!p&&pe(e.currentTarget.ownerDocument)===e.currentTarget)return P.current=hi(e.key,b,h)?i:s,void A(P.current);hi(e.key,b,h)?P.current=f?t>=s?d&&t!==a.current.length?-1:i:nn(a,{startingIndex:t,disabledIndices:w}):Math.min(s,nn(a,{startingIndex:t,disabledIndices:w})):P.current=f?t<=i?d&&-1!==t?a.current.length:s:nn(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(i,nn(a,{startingIndex:t,decrement:true,disabledIndices:w})),Zt(a,P.current)?A(null):A(P.current);}})),X=reactExports.useMemo((()=>p&&n&&K&&{"aria-activedescendant":W||Y}),[p,n,K,W,Y]),Z=reactExports.useMemo((()=>({"aria-orientation":"both"===b?void 0:b,...!Me(r.domReference)&&X,onKeyDown:Q,onPointerMove(){O.current=true;}})),[X,Q,r.domReference,b]),ee=reactExports.useMemo((()=>{function e(e){"auto"===g&&we(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){O.current=false;const t=e.key.startsWith("Arrow"),i=["Home","End"].includes(e.key),r=t||i,s=function(e,t,n){return fi(t,n?e===Gt:e===Qt,e===Kt)}(e.key,b,h),l=pi(e.key,b,h),c=mi(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(p&&n){const t=null==I?void 0:I.nodesRef.current.find((e=>null==e.parentId)),n=I&&t?function(e,t){let n,i=-1;return function t(o,r){r>i&&(n=o,i=r),Pn(e,o).forEach((e=>{t(e.id,r+1);}));}(t,0),e.find((e=>e.id===n))}(I.nodesRef.current,t.id):null;if(r&&n&&N){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const i=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,o=l&&!i?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find((e=>(null==e?void 0:e.id)===Y)):null;o&&(Ae(e),o.dispatchEvent(t),J(void 0));}var v;if((c||i)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ae(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(_.current=m&&c?null:e.key),m?s&&(Ae(e),n?(P.current=en(a,H.current),A(P.current)):o(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(P.current=u),Ae(e),!n&&y?o(true,e.nativeEvent,"list-navigation"):Q(e),n&&A(P.current)));},onFocus(){n&&!p&&A(null);},onPointerDown:function(e){T.current=g,"auto"===g&&be(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}}),[Y,X,Q,H,g,a,m,A,o,n,y,b,h,u,I,p,N]);return reactExports.useMemo((()=>c?{reference:ee,floating:Z,item:G}:{}),[c,ee,Z,G])}const vi=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function yi(e,t){const[n,i]=e;let o=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=i!=c>=i&&n<=(l-r)*(i-s)/(c-s)+r&&(o=!o);}return o}function wi(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:i=true}=e;let o,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:h}=e;return function(e){function p(){clearTimeout(o),f();}if(clearTimeout(o),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=De(e),b="mouseleave"===e.type,k=ge(d.floating,w),C=ge(d.domReference,w),N=d.domReference.getBoundingClientRect(),x=d.floating.getBoundingClientRect(),S=u.split("-")[0],D=n>x.right-x.width/2,E=c>x.bottom-x.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,N),A=x.width>N.width,M=x.height>N.height,T=(A?N:x).left,P=(A?N:x).right,_=(M?N:x).top,O=(M?N:x).bottom;if(k&&(r=true,!b))return;if(C&&(r=false),C&&!b)return void(r=true);if(b&&te(e.relatedTarget)&&ge(d.floating,e.relatedTarget))return;if(h&&Pn(h.nodesRef.current,m).some((e=>{let{context:t}=e;return null==t?void 0:t.open})))return;if("top"===S&&c>=N.bottom-1||"bottom"===S&&c<=N.top+1||"left"===S&&n>=N.right-1||"right"===S&&n<=N.left+1)return p();let F=[];switch(S){case "top":F=[[T,N.top+1],[T,x.bottom-1],[P,x.bottom-1],[P,N.top+1]];break;case "bottom":F=[[T,x.top+1],[T,N.bottom-1],[P,N.bottom-1],[P,x.top+1]];break;case "left":F=[[x.right-1,O],[x.right-1,_],[N.left+1,_],[N.left+1,O]];break;case "right":F=[[N.right-1,O],[N.right-1,_],[x.left+1,_],[x.left+1,O]];}if(!yi([g,v],F)){if(r&&!I)return p();if(!b&&i){const t=function(e,t){const n=performance.now(),i=n-l;if(null===a||null===s||0===i)return a=e,s=t,l=n,null;const o=e-a,r=t-s,c=Math.sqrt(o*o+r*r);return a=e,s=t,l=n,c/i}(e.clientX,e.clientY);if(null!==t&&t<.1)return p()}yi([g,v],function(e){let[n,i]=e;switch(S){case "top":return [[A?n+t/2:D?n+4*t:n-4*t,i+t+1],[A?n-t/2:D?n+4*t:n-4*t,i+t+1],...[[x.left,D||A?x.bottom-t:x.top],[x.right,D?A?x.bottom-t:x.top:x.bottom-t]]];case "bottom":return [[A?n+t/2:D?n+4*t:n-4*t,i-t],[A?n-t/2:D?n+4*t:n-4*t,i-t],...[[x.left,D||A?x.top+t:x.bottom],[x.right,D?A?x.top+t:x.bottom:x.top+t]]];case "left":{const e=[n+t+1,M?i+t/2:E?i+4*t:i-4*t],o=[n+t+1,M?i-t/2:E?i+4*t:i-4*t];return [...[[E||M?x.right-t:x.left,x.top],[E?M?x.right-t:x.left:x.right-t,x.bottom]],e,o]}case "right":return [[n-t,M?i+t/2:E?i+4*t:i-4*t],[n-t,M?i-t/2:E?i+4*t:i-4*t],...[[E||M?x.left+t:x.right,x.top],[E?M?x.left+t:x.right:x.left+t,x.bottom]]]}}([n,c]))?!r&&i&&(o=window.setTimeout(p,40)):p();}}};return c.__options={blockPointerEvents:n},c}const bi=reactExports.createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),ki=reactExports.forwardRef((({className:t,disabled:n,children:i,...o},r)=>{const a=reactExports.useContext(bi),l=dn(),c=Nn(),u=l.index===a.activeIndex,d=k("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:Yt([l.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,...o,...a.getItemProps({onClick(e){o.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){o.onFocus?.(e),a.setHasFocusInside(true);}}),children:i})}));ki.displayName="DropdownMenuItem";const Ci=reactExports.forwardRef((({className:n,variant:o="default",icon:r,iconRight:a,text:f="",disabled:m,children:h,...p},g)=>{const[v,y]=reactExports.useState(false),[w,b]=reactExports.useState(false),[C,N]=reactExports.useState(null),x=reactExports.useRef([]),S=reactExports.useRef([]),D=reactExports.useContext(bi),E=Nn(),I=function(e){const t=gn(),n=Nn(),i=Cn();return sn((()=>{const e={id:t,parentId:i};return null==n||n.addNode(e),()=>{null==n||n.removeNode(e);}}),[n,t,i]),t}(),M=Cn(),T=dn(),P=null!=M,{floatingStyles:_,refs:O,context:F}=si({nodeId:I,open:v,onOpenChange:y,placement:P?"right-start":"bottom-start",middleware:[(L={mainAxis:P?0:4,alignmentAxis:P?-4:0},{..._t(L),options:[L,B]}),Vt(),$t()],whileElementsMounted:Pt});var L,B;const R=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,h=Nn(),p=Cn(),g=En(u),v=En(c),y=En(n),w=reactExports.useRef(),b=reactExports.useRef(-1),k=reactExports.useRef(),C=reactExports.useRef(-1),N=reactExports.useRef(true),x=reactExports.useRef(false),S=reactExports.useRef((()=>{})),D=reactExports.useRef(false),E=reactExports.useCallback((()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t}),[r]);reactExports.useEffect((()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(C.current),N.current=true,D.current=false);}}),[l,a]),reactExports.useEffect((()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&o(false,e,"hover");}const t=xe(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}}),[s.floating,n,o,l,g,E]);const I=reactExports.useCallback((function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const i=An(v.current,"close",w.current);i&&!k.current?(clearTimeout(b.current),b.current=window.setTimeout((()=>o(false,e,n)),i)):t&&(clearTimeout(b.current),o(false,e,n));}),[v,o]),A=Jt((()=>{S.current(),k.current=void 0;})),M=Jt((()=>{if(x.current){const e=xe(s.floating).body;e.style.pointerEvents="",e.removeAttribute(In),x.current=false;}})),T=Jt((()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type)));reactExports.useEffect((()=>{if(l&&te(s.domReference)){var e;const o=s.domReference;return n&&o.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&o.addEventListener("mousemove",t,{once:true}),o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i),()=>{var e;n&&o.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&o.removeEventListener("mousemove",t),o.removeEventListener("mouseenter",t),o.removeEventListener("mouseleave",i);}}function t(e){if(clearTimeout(b.current),N.current=false,d&&!Ne(w.current)||f>0&&!An(v.current,"open"))return;const t=An(v.current,"open",w.current);t?b.current=window.setTimeout((()=>{y.current||o(true,e,"hover");}),t):n||o(true,e,"hover");}function i(e){if(T())return;S.current();const t=xe(s.floating);if(clearTimeout(C.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),k.current=g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e,true,"safe-polygon");}});const i=k.current;return t.addEventListener("mousemove",i),void(S.current=()=>{t.removeEventListener("mousemove",i);})}("touch"!==w.current||!ge(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){M(),A(),T()||I(e);}})(e));}}),[s,l,e,d,f,m,I,A,M,o,n,y,h,v,g,r,T]),sn((()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){x.current=true;const e=s.floating;if(te(s.domReference)&&e){var t;const n=xe(s.floating).body;n.setAttribute(In,"");const i=s.domReference,o=null==h||null==(t=h.nodesRef.current.find((e=>e.id===p)))||null==(t=t.context)?void 0:t.elements.floating;return o&&(o.style.pointerEvents=""),n.style.pointerEvents="none",i.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",i.style.pointerEvents="",e.style.pointerEvents="";}}}}),[l,n,p,s,h,g,E]),sn((()=>{n||(w.current=void 0,D.current=false,A(),M());}),[n,A,M]),reactExports.useEffect((()=>()=>{A(),clearTimeout(b.current),clearTimeout(C.current),M();}),[l,s.domReference,A,M]);const P=reactExports.useMemo((()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function i(){N.current||y.current||o(true,t,"hover");}d&&!Ne(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(C.current),"touch"===w.current?i():(D.current=true,C.current=window.setTimeout(i,f)));}}}),[d,o,n,y,f]),_=reactExports.useMemo((()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}})),[I,T]);return reactExports.useMemo((()=>l?{reference:P,floating:_}:{}),[l,P,_])}(F,{enabled:P,delay:{open:75},handleClose:wi({blockPointerEvents:true})}),j=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=reactExports.useRef(),h=reactExports.useRef(false),p=reactExports.useMemo((()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(Ne(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),o(true,e.nativeEvent,"click")):o(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:Ne(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?o(true,e.nativeEvent,"click"):o(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||ti(e)||(" "!==e.key||ni(a)||(e.preventDefault(),h.current=true),"Enter"===e.key&&o(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||ti(e)||ni(a)||" "===e.key&&h.current&&(h.current=false,o(!n||!c,e.nativeEvent,"click"));}})),[r,a,l,u,d,o,n,f,c]);return reactExports.useMemo((()=>s?{reference:p}:{}),[s,p])}(F,{event:"mousedown",toggle:!P,ignoreMouse:P}),H=function(e,t){var n;void 0===t&&(t={});const{open:o,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=vi.get(s))?n:s,c=gn(),u=null!=Cn(),d=reactExports.useMemo((()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:o?r:void 0}:{"aria-expanded":o?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":o?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}}),[l,r,u,o,c,s]),f=reactExports.useMemo((()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}}),[l,r,c,s]),m=reactExports.useCallback((e=>{let{active:t,selected:n}=e;const i={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...i,"aria-selected":t&&n};case "combobox":return {...i,...t&&{"aria-selected":true}}}return {}}),[r,s]);return reactExports.useMemo((()=>a?{reference:d,floating:f,item:m}:{}),[a,d,f,m])}(F,{role:"menu"}),z=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:o,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:h,capture:p}=t,g=Nn(),v=Jt("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=reactExports.useRef(false),b=reactExports.useRef(false),{escapeKey:k,outsidePress:C}=ri(h),{escapeKey:N,outsidePress:x}=ri(p),S=reactExports.useRef(false),D=Jt((e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(S.current)return;const i=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?Pn(g.nodesRef.current,i):[];if(!k&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);})),!e)return}o(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");})),E=Jt((e=>{var t;const n=()=>{var t;D(e),null==(t=De(e))||t.removeEventListener("keydown",n);};null==(t=De(e))||t.addEventListener("keydown",n);})),I=Jt((e=>{var t;const n=w.current;w.current=false;const i=b.current;if(b.current=false,"click"===u&&i)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=De(e),l="["+Dn("inert")+"]",c=xe(r.floating).querySelectorAll(l);let d=te(s)?s:null;for(;d&&!ce(d);){const e=fe(d);if(ce(e)||!te(e))break;d=e;}if(c.length&&te(s)&&!s.matches("html,body")&&!ge(s,r.floating)&&Array.from(c).every((e=>!ge(d,e))))return;if(ne(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let i=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===ue(s).direction&&(i=e.offsetX<=s.offsetWidth-s.clientWidth),i||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&Pn(g.nodesRef.current,f).some((t=>{var n;return Se(e,null==(n=t.context)?void 0:n.elements.floating)}));if(Se(e,r.floating)||Se(e,r.domReference)||m)return;const h=g?Pn(g.nodesRef.current,f):[];if(h.length>0){let e=true;if(h.forEach((t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);})),!e)return}o(false,e,"outside-press");})),A=Jt((e=>{var t;const n=()=>{var t;I(e),null==(t=De(e))||t.removeEventListener(u,n);};null==(t=De(e))||t.addEventListener(u,n);}));reactExports.useEffect((()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=k,a.current.__outsidePressBubbles=C;let e=-1;function t(e){o(false,e,"ancestor-scroll");}function i(){window.clearTimeout(e),S.current=true;}function c(){e=window.setTimeout((()=>{S.current=false;}),le()?5:0);}const d=xe(r.floating);l&&(d.addEventListener("keydown",N?E:D,N),d.addEventListener("compositionstart",i),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,x?A:I,x);let f=[];return m&&(te(r.domReference)&&(f=he(r.domReference)),te(r.floating)&&(f=f.concat(he(r.floating))),!te(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(he(r.reference.contextElement)))),f=f.filter((e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)})),f.forEach((e=>{e.addEventListener("scroll",t,{passive:true});})),()=>{l&&(d.removeEventListener("keydown",N?E:D,N),d.removeEventListener("compositionstart",i),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,x?A:I,x),f.forEach((e=>{e.removeEventListener("scroll",t);})),window.clearTimeout(e);}}),[a,r,l,y,u,n,o,m,s,k,C,D,N,E,I,x,A]),reactExports.useEffect((()=>{w.current=false;}),[y,u]);const M=reactExports.useMemo((()=>({onKeyDown:D,[ii[f]]:e=>{d&&o(false,e.nativeEvent,"reference-press");}})),[D,o,d,f]),T=reactExports.useMemo((()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[oi[u]]:()=>{w.current=true;}})),[D,u]);return reactExports.useMemo((()=>s?{reference:M,floating:T}:{}),[s,M,T])}(F,{bubbles:true}),$=gi(F,{listRef:x,activeIndex:C,nested:P,onNavigate:N}),{getReferenceProps:V,getFloatingProps:Y,getItemProps:U}=function(e){ void 0===e&&(e=[]);const t=e.map((e=>null==e?void 0:e.reference)),n=e.map((e=>null==e?void 0:e.floating)),o=e.map((e=>null==e?void 0:e.item)),r=reactExports.useCallback((t=>ui(t,e,"reference")),t),a=reactExports.useCallback((t=>ui(t,e,"floating")),n),s=reactExports.useCallback((t=>ui(t,e,"item")),o);return reactExports.useMemo((()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s})),[r,a,s])}([R,j,H,z,$]);reactExports.useEffect((()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}}),[E,I,M]),reactExports.useEffect((()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});}),[E,v,I,M]);const W={activeIndex:C,setActiveIndex:N,getItemProps:U,setHasFocusInside:b,isOpen:v,setIsOpen:y},J=reactExports.useMemo((()=>W),[C,N,U,b,v]),q=k("io-dropdown-menu-button",P&&"io-dropdown-menu-item",v&&!P&&"active",n),K=Yt([O.setReference,T.ref,g]),G=D.activeIndex===T.index?0:-1;return jsxRuntimeExports.jsxs(xn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:q,ref:K,variant:P?"link":o,tabIndex:P?G:void 0,role:P?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":P?"":void 0,"data-focus-inside":w?"":void 0,text:f,icon:P?"chevron-right":r,iconSize:"10",iconRight:!!P||a,disabled:m,...V(D.getItemProps({onFocus(e){p.onFocus?.(e),b(false),D.setHasFocusInside(true);},...p}))}),jsxRuntimeExports.jsx(bi.Provider,{value:J,children:jsxRuntimeExports.jsx(un,{elementsRef:x,labelsRef:S,children:v&&jsxRuntimeExports.jsx(ei,{context:F,modal:false,initialFocus:P?-1:0,returnFocus:!P,children:jsxRuntimeExports.jsx("div",{ref:O.setFloating,className:"io-dropdown-menu",style:_,...Y(),children:h})})})})]})}));function Ni({className:t,...n}){const i=k("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:i,...n})}Ci.displayName="DropdownMenu";const xi=reactExports.forwardRef((({...t},n)=>null===Cn()?jsxRuntimeExports.jsx(Sn,{children:jsxRuntimeExports.jsx(Ci,{ref:n,...t})}):jsxRuntimeExports.jsx(Ci,{ref:n,...t})));function Di({className:n,size:i="large",variant:o="default",align:r="up",text:a,...s}){const l=k("io-loader",{[`io-loader-${o}`]:"default"!==o},"normal"===i&&"io-loader-md","small"===i&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Ei({className:t,children:n,...i}){const o=k("io-panel-header",t);return jsxRuntimeExports.jsx(Y,{className:o,...i,children:n})}xi.displayName="DropdownMenu",xi.Item=ki,xi.Separator=Ni,Ei.Title=E,Ei.ButtonGroup=V,Ei.Button=A,Ei.ButtonIcon=N,Ei.Dropdown=$;const Ii=reactExports.forwardRef((({className:t,children:n,...i},o)=>{const r=k("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:o,...i,children:n})}));function Ai({className:t,...n}){const i=k("io-panel-footer",t);return jsxRuntimeExports.jsx(J,{className:i,...n})}function Mi({className:t,children:n,...i}){const o=k("io-panel",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pi({className:t,variant:n="active",value:i=0,...o}){const r=k("io-progress",n,t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${i<0?0:i>100?100:i}%`}})})}function _i({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}Ii.displayName="PanelBody",Ai.ButtonGroup=V,Ai.Button=A,Ai.ButtonIcon=N,Ai.Dropdown=$,Mi.Header=Ei,Mi.Body=Ii,Mi.Footer=Ai;const Oi=reactExports.forwardRef((({id:n="input",className:i,type:o="text",name:a="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:h,readOnly:p,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=k("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",h&&"io-control-disabled",p&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],i),N=reactExports.useCallback((e=>{h?e.preventDefault():u&&u(e);}),[u,h]),x=reactExports.useCallback((e=>{h?e.preventDefault():f&&f(e);}),[f,h]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(C,{variant:c,onClick:e=>N(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:o,name:a,tabIndex:0,placeholder:m??(()=>{switch(o){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),disabled:h,readOnly:p,...y}),d&&jsxRuntimeExports.jsx(C,{variant:d,onClick:e=>x(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,children:[jsxRuntimeExports.jsx(C,{variant:"close"}),g]})]})}));Oi.displayName="Input";const Fi=reactExports.forwardRef((({id:n="textarea",className:i,name:o="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=k("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:o,tabIndex:0,placeholder:l,disabled:c,readOnly:u,rows:s,...d})]})}));Fi.displayName="Textarea";const Li=reactExports.forwardRef((({id:n="checkbox",className:i,name:o="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Li.displayName="Checkbox";const Bi=reactExports.forwardRef((({id:n="radio",className:i,name:o="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=k("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:o,tabIndex:0,checked:s,disabled:l,...c}),a&&jsxRuntimeExports.jsx(_i,{htmlFor:n,text:a})]})}));Bi.displayName="Radio";const Ri=reactExports.forwardRef((({id:n="toggle",className:i,name:o="toggle",align:r="left",label:a="Toggle",checked:s,disabled:l,...c},u)=>{const d=k("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],i);return jsxRuntimeExports.jsx("div",{className:d,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:o,checked:s,disabled:l,...c}),jsxRuntimeExports.jsx("span",{className:"slider"}),a]})})}));function Vi(e,t=500){const[n,i]=reactExports.useState(e);return reactExports.useEffect((()=>{const n=setTimeout((()=>{i(e);}),t);return ()=>clearTimeout(n)}),[e,t]),n}Ri.displayName="Toggle";const Ji=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function qi(){return reactExports.useMemo((()=>"object"==typeof window&&Ji()),[])}reactExports.createContext({theme:"dark"});const Xi="___platform_prefs___",eo="_launchpad_pinnedPosition",to="_launchpad_allowDocking",no="_launchpad_minimizeToTray",io="_launchpad_autoCloseStartingAppsAndWorkspaces",oo="_launchpad_showTutorialOnStartup",ro="_layouts_restoreLastSaved",ao="_layouts_saveCurrentOnExit",so="_layouts_showUnsavedChangesPrompt",lo="_layouts_showDeletePrompt",co="_downloads_askForEachDownload",uo="_widget_enableForExternalApps",mo=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),ho={SUCCESS:"success",WARNING:"warning"},po={success:5e3,warning:1e4};var go=function(e){return {ok:true,result:e}},vo=function(e){return {ok:false,error:e}},yo=function(e,t,n){return  false===t.ok?t:false===n.ok?n:go(e(t.result,n.result))},wo=function(e,t){return  true===t.ok?t:vo(e(t.error))},bo=function(){return bo=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},bo.apply(this,arguments)};function ko(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!ko(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!ko(e[i[n]],t[i[n]]))return  false}return  true}}var Co=function(e){return Array.isArray(e)},No=function(e){return "object"==typeof e&&null!==e&&!Co(e)},xo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},So=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},Do=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return bo({at:e+(n||"")},i)},Eo=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return wo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?go(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?go(e):vo({message:xo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?go(e):vo({message:xo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?go(e):vo({message:xo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return ko(e,t)?go(t):vo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(No(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?vo({message:"the key '"+i+"' is required but was not present"}):vo(Do("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return go(n)}return No(e)?go(e):vo({message:xo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Co(e)&&t){return e.reduce((function(e,n,i){return yo((function(e,t){return e.concat([t])}),e,function(e,n){return wo((function(e){return Do("["+n+"]",e)}),t.decode(e))}(n,i))}),go([]))}return Co(e)?go(e):vo({message:xo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Co(e)){if(e.length!==t.length)return vo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return vo(Do("["+i+"]",o.error));n[i]=o.result;}return go(n)}return vo({message:xo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return yo(Object.assign,t,n.decode(e))}),go({}))}))},e.anyJson=function(){return new e((function(e){return go(e)}))},e.unknownJson=function(){return new e((function(e){return go(e)}))},e.dict=function(t){return new e((function(e){if(No(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return vo(Do("."+i,o.error));n[i]=o.result;}return go(n)}return vo({message:xo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?go(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return vo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return go(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return vo({at:So(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!No(i))return vo({at:So(t.slice(0,o+1)),message:xo("an object",i)});if("number"==typeof t[o]&&!Co(i))return vo({at:So(t.slice(0,o+1)),message:xo("an array",i)});i=i[t[o]];}return wo((function(e){return void 0===i?{at:So(t),message:"path does not exist"}:Do(So(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return go(t)}))},e.fail=function(t){return new e((function(e){return vo({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Io=Eo.string;Eo.number;var Ao=Eo.boolean,Mo=Eo.anyJson;Eo.unknownJson;var To=Eo.constant,Po=Eo.object,_o=Eo.array;Eo.tuple,Eo.dict;var Oo=Eo.optional,Fo=Eo.oneOf;Eo.union,Eo.intersection,Eo.withDefault,Eo.valueAt,Eo.succeed,Eo.fail,Eo.lazy;const Lo=["name","title","version","customProperties","icon","caption","type"],Bo=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var Ro=function(e){return {ok:true,result:e}},jo=function(e){return {ok:false,error:e}},Ho=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Ro(e(t.result,n.result))},zo=function(e,t){return  true===t.ok?t:jo(e(t.error))},$o=function(){return $o=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},$o.apply(this,arguments)};function Vo(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Vo(e[n],t[n]))return  false;return  true}var i=Object.keys(e);if(i.length!==Object.keys(t).length)return  false;for(n=0;n<i.length;n++){if(!t.hasOwnProperty(i[n]))return  false;if(!Vo(e[i[n]],t[i[n]]))return  false}return  true}}var Yo=function(e){return Array.isArray(e)},Uo=function(e){return "object"==typeof e&&null!==e&&!Yo(e)},Wo=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Jo=function(e){return e.map((function(e){return "string"==typeof e?"."+e:"["+e+"]"})).join("")},qo=function(e,t){var n=t.at,i=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(n[i[o]]=e[i[o]]);}return n}(t,["at"]);return $o({at:e+(n||"")},i)},Ko=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return zo((function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}}),n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e((function(e){return function(e,t){return  true===t.ok?Ro(e(t.result)):t}(t,n.decode(e))}))},this.andThen=function(t){return new e((function(e){return function(e,t){return  true===t.ok?e(t.result):t}((function(n){return t(n).decode(e)}),n.decode(e))}))},this.where=function(t,i){return n.andThen((function(n){return t(n)?e.succeed(n):e.fail(i)}))};}return e.string=function(){return new e((function(e){return "string"==typeof e?Ro(e):jo({message:Wo("a string",e)})}))},e.number=function(){return new e((function(e){return "number"==typeof e?Ro(e):jo({message:Wo("a number",e)})}))},e.boolean=function(){return new e((function(e){return "boolean"==typeof e?Ro(e):jo({message:Wo("a boolean",e)})}))},e.constant=function(t){return new e((function(e){return Vo(e,t)?Ro(t):jo({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})}))},e.object=function(t){return new e((function(e){if(Uo(e)&&t){var n={};for(var i in t)if(t.hasOwnProperty(i)){var o=t[i].decode(e[i]);if(true!==o.ok)return void 0===e[i]?jo({message:"the key '"+i+"' is required but was not present"}):jo(qo("."+i,o.error));void 0!==o.result&&(n[i]=o.result);}return Ro(n)}return Uo(e)?Ro(e):jo({message:Wo("an object",e)})}))},e.array=function(t){return new e((function(e){if(Yo(e)&&t){return e.reduce((function(e,n,i){return Ho((function(e,t){return e.concat([t])}),e,function(e,n){return zo((function(e){return qo("["+n+"]",e)}),t.decode(e))}(n,i))}),Ro([]))}return Yo(e)?Ro(e):jo({message:Wo("an array",e)})}))},e.tuple=function(t){return new e((function(e){if(Yo(e)){if(e.length!==t.length)return jo({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e[i]);if(!o.ok)return jo(qo("["+i+"]",o.error));n[i]=o.result;}return Ro(n)}return jo({message:Wo("a tuple of length "+t.length,e)})}))},e.union=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return e.oneOf.apply(e,[t,n].concat(i))},e.intersection=function(t,n){for(var i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];return new e((function(e){return [t,n].concat(i).reduce((function(t,n){return Ho(Object.assign,t,n.decode(e))}),Ro({}))}))},e.anyJson=function(){return new e((function(e){return Ro(e)}))},e.unknownJson=function(){return new e((function(e){return Ro(e)}))},e.dict=function(t){return new e((function(e){if(Uo(e)){var n={};for(var i in e)if(e.hasOwnProperty(i)){var o=t.decode(e[i]);if(true!==o.ok)return jo(qo("."+i,o.error));n[i]=o.result;}return Ro(n)}return jo({message:Wo("an object",e)})}))},e.optional=function(t){return new e((function(e){return null==e?Ro(void 0):t.decode(e)}))},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e((function(e){for(var n=[],i=0;i<t.length;i++){var o=t[i].decode(e);if(true===o.ok)return o;n[i]=o.error;}var r=n.map((function(e){return "at error"+(e.at||"")+": "+e.message})).join('", "');return jo({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})}))},e.withDefault=function(t,n){return new e((function(e){return Ro(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))}))},e.valueAt=function(t,n){return new e((function(e){for(var i=e,o=0;o<t.length;o++){if(void 0===i)return jo({at:Jo(t.slice(0,o+1)),message:"path does not exist"});if("string"==typeof t[o]&&!Uo(i))return jo({at:Jo(t.slice(0,o+1)),message:Wo("an object",i)});if("number"==typeof t[o]&&!Yo(i))return jo({at:Jo(t.slice(0,o+1)),message:Wo("an array",i)});i=i[t[o]];}return zo((function(e){return void 0===i?{at:Jo(t),message:"path does not exist"}:qo(Jo(t),e)}),n.decode(i))}))},e.succeed=function(t){return new e((function(e){return Ro(t)}))},e.fail=function(t){return new e((function(e){return jo({message:t})}))},e.lazy=function(t){return new e((function(e){return t().decode(e)}))},e}(),Go=Ko.string,Qo=Ko.number,Xo=Ko.boolean,Zo=Ko.anyJson;Ko.unknownJson;var er=Ko.constant,tr=Ko.object,nr=Ko.array;Ko.tuple;var ir=Ko.dict,or=Ko.optional,rr=Ko.oneOf;Ko.union,Ko.intersection,Ko.withDefault,Ko.valueAt,Ko.succeed,Ko.fail,Ko.lazy;const ar=Go().where((e=>e.length>0),"Expected a non-empty string"),sr=Qo().where((e=>e>=0),"Expected a non-negative number"),lr=tr({name:ar,displayName:or(Go()),contexts:or(nr(Go())),customConfig:or(tr())}),cr=rr(er("web"),er("native"),er("citrix"),er("onlineNative"),er("other")),ur=tr({url:ar}),dr=tr({src:ar,size:or(ar),type:or(ar)}),fr=tr({src:ar,size:or(ar),type:or(ar),label:or(ar)}),mr=tr({contexts:nr(ar),displayName:or(ar),resultType:or(ar),customConfig:or(Zo())}),hr=tr({listensFor:or(ir(mr)),raises:or(ir(nr(ar)))}),pr=tr({broadcasts:or(nr(ar)),listensFor:or(nr(ar))}),gr=tr({name:ar,description:or(ar),broadcasts:or(nr(ar)),listensFor:or(nr(ar))}),vr=tr({intents:or(hr),userChannels:or(pr),appChannels:or(nr(gr))}),yr=tr({url:or(ar),top:or(Qo()),left:or(Qo()),width:or(sr),height:or(sr)}),wr=tr({name:or(ar),type:or(ar.where((e=>"window"===e),"Expected a value of window")),title:or(ar),version:or(ar),customProperties:or(Zo()),icon:or(Go()),caption:or(Go()),details:or(yr),intents:or(nr(lr)),hidden:or(Xo())}),br=tr({name:ar,appId:ar,title:or(ar),version:or(ar),manifest:ar,manifestType:ar,tooltip:or(ar),description:or(ar),contactEmail:or(ar),supportEmail:or(ar),publisher:or(ar),images:or(nr(tr({url:or(ar)}))),icons:or(nr(tr({icon:or(ar)}))),customConfig:Zo(),intents:or(nr(lr))}),kr=tr({appId:or(ar),name:or(ar),details:or(ur),version:or(ar),title:or(ar),tooltip:or(ar),lang:or(ar),description:or(ar),categories:or(nr(ar)),icons:or(nr(dr)),screenshots:or(nr(fr)),contactEmail:or(ar),supportEmail:or(ar),moreInfo:or(ar),publisher:or(ar),customConfig:or(nr(Zo())),hostManifests:or(Zo()),interop:or(vr)}),Cr=tr({appId:ar,name:ar,type:cr,details:ur,version:or(ar),title:or(ar),tooltip:or(ar),lang:or(ar),description:or(ar),categories:or(nr(ar)),icons:or(nr(dr)),screenshots:or(nr(fr)),contactEmail:or(ar),supportEmail:or(ar),moreInfo:or(ar),publisher:or(ar),customConfig:or(nr(Zo())),hostManifests:or(Zo()),interop:or(vr),localizedVersions:or(ir(kr))}),Nr=rr(br,Cr),xr=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class Sr{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=Nr.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:xr(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Nr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(i.error)}`);const o=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...o,intents:"1.2"===n?o.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=wr.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const i=Nr.run(e);if(!i.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${xr(i.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const o=e,r={name:o.appId,type:this.fdc3ToDesktopDefinitionType[o.type],details:o.details,version:o.version,title:o.title,tooltip:o.tooltip,caption:o.description,icon:this.getIconFromDefinition(o,"2.0"),intents:this.getIntentsFromV2AppDefinition(o),fdc3:{...o,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)))):Object.fromEntries(Object.entries(e).filter((([e])=>!Lo.includes(e)&&!Bo.includes(e))))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map((e=>{const[t,n]=e;return {name:t,...n}}))}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find((e=>e.icon))?.icon||void 0:e.icons?.find((e=>e.src))?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const i={...e.createOptions,...t.details};n.createOptions=i,n.userProperties.details=i;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Dr={common:{nonEmptyStringDecoder:ar,nonNegativeNumberDecoder:sr},fdc3:{allDefinitionsDecoder:Nr,v1DefinitionDecoder:br,v2DefinitionDecoder:Cr}};var Er;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Er||(Er={}));const Ir=new class{_fdc3;_decoders=Dr;_errors={intents:Er};get fdc3(){return this._fdc3||(this._fdc3=(new Sr).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Ir.fdc3;const Ar=Ir.decoders;Ir.errors;const Mr=Ar.common.nonEmptyStringDecoder,Tr=Fo(To("add"),To("align-bottom"),To("align-bottom-solid"),To("align-left"),To("align-left-bottom"),To("align-left-bottom-solid"),To("align-left-solid"),To("align-left-top"),To("align-left-top-solid"),To("align-right"),To("align-right-bottom"),To("align-right-bottom-solid"),To("align-right-solid"),To("align-right-top"),To("align-right-top-solid"),To("align-top"),To("align-top-solid"),To("always-on-top"),To("always-on-top-on"),To("application"),To("arrow-down-long"),To("arrow-down-to-bracket"),To("arrow-left-long"),To("arrow-right-from-bracket"),To("arrow-right-long"),To("arrow-right"),To("arrow-up"),To("arrow-up-long"),To("ban"),To("bell"),To("bell-solid"),To("bookmark"),To("bullseye-pointer"),To("certificate"),To("check"),To("check-light"),To("check-solid"),To("chevron-down"),To("chevron-left"),To("chevron-right"),To("chevron-up"),To("circle-info"),To("circle-xmark"),To("circle-xmark-full"),To("clock"),To("clock-rotate-left"),To("clone"),To("close"),To("cog"),To("cog-solid"),To("collapse"),To("copy"),To("download"),To("delete-left"),To("dev-tools"),To("ellipsis"),To("ellipsis-vertical"),To("expand"),To("envelope"),To("envelope-open"),To("exclamation-mark"),To("expand"),To("feedback"),To("filter"),To("floppy"),To("floppy-disk-pen"),To("folder"),To("folder-open"),To("globe"),To("group"),To("hidden"),To("home"),To("house"),To("info"),To("keyboard"),To("layout"),To("link"),To("list-ul"),To("lock"),To("logo"),To("minimize"),To("minimize-down"),To("paper-plane-top"),To("paperclip"),To("pause"),To("pen-line"),To("pen-to-square"),To("pin"),To("play"),To("pop-in"),To("pop-in-widget"),To("pop-out"),To("power-off"),To("publish"),To("refresh"),To("resize"),To("restore"),To("rotate-right"),To("search"),To("search-filled"),To("sliders"),To("snooze"),To("spinner"),To("square"),To("square-arrow-down"),To("square-arrow-up"),To("star"),To("star-full"),To("sticky-off"),To("sticky-off-hover"),To("sticky-on"),To("sticky-on-hover"),To("subscribe"),To("system-close"),To("system-maximize"),To("system-minimize"),To("thumbs-down"),To("thumbs-up"),To("trash"),To("trash-can"),To("triangle-exclamation"),To("unlock"),To("unpin"),To("up-to-line"),To("user"),To("user-gear"),To("visible"),To("workspace")),Pr=Po({id:Mr,title:Mr,description:Oo(Io()),icon:Oo(Tr),iconSrc:Oo(Mr),contextMenuActions:Oo(_o(Mo())),type:Mr}),_r=Fo(To("Left"),To("Right")),Or=Fo(To("daily"),To("weekly")),Fr=Fo(To("Sunday"),To("Monday"),To("Tuesday"),To("Wednesday"),To("Thursday"),To("Friday"),To("Saturday")),Lr=Po({customPrefs:Oo(Mo()),_launchpad_collapsedSections:Oo(_o(Mr)),_launchpad_favorites:Oo(_o(Pr)),_launchpad_isLayoutsPanelOpen:Oo(Ao()),_launchpad_isCollapsed:Oo(Ao()),_launchpad_isPinned:Oo(Ao()),_launchpad_pinnedPosition:Oo(_r),_launchpad_allowDocking:Oo(Ao()),_launchpad_minimizeToTray:Oo(Ao()),_launchpad_autoCloseStartingAppsAndWorkspaces:Oo(Ao()),_launchpad_showTutorialOnStartup:Oo(Ao()),_layouts_restoreLastSaved:Oo(Ao()),_layouts_saveCurrentOnExit:Oo(Ao()),_layouts_showUnsavedChangesPrompt:Oo(Ao()),_layouts_showDeletePrompt:Oo(Ao()),_downloads_askForEachDownload:Oo(Ao()),_downloads_location:Oo(Io()),_system_scheduleRestart:Oo(Ao()),_system_scheduleRestartTime:Oo(Mr),_system_scheduleRestartFrequency:Oo(Or),_system_scheduleRestartDay:Oo(Fr),_system_scheduleShutdown:Oo(Ao()),_system_scheduleShutdownTime:Oo(Mr),_system_scheduleShutdownFrequency:Oo(Or),_system_scheduleShutdownDay:Oo(Fr),_widget_enableForExternalApps:Oo(Ao())}),Br=async e=>{const{io:t,variant:n,text:i,error:o}=e,r=mo(o);try{if(n===ho.WARNING&&t.logger.warn(r?`${i} ${r}`:i),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:i,variant:n,ttl:po[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},Rr=reactExports.createContext(void 0);function zr({prefKey:e}){const t=reactExports.useContext(IOConnectContext),n=reactExports.useContext(Rr),i=n?.prefs?.[e],o=n?.isInitialSetupCompleted??false,[a,c]=reactExports.useState(!o),[f,m]=reactExports.useState(),h=reactExports.useRef(0);reactExports.useEffect((()=>{o&&0===h.current&&c(false);}),[o]);const p=reactExports.useCallback((async n=>{if(!t)return;const i=++h.current;c(true),m(void 0);const o=async n=>{n&&await Br({io:t,variant:ho.WARNING,text:`Failed to update prefKey "${e}".`,error:n}),i===h.current&&(c(false),n&&m({message:mo(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(Xi))[e]);}catch(e){return o(e)}else r=n;try{const n=Lr.runWithException({[e]:r});await t.contexts.update(Xi,n);}catch(e){return o(e)}await o();}),[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:f,isLoading:a,update:p,value:i}}function $r(e,t,n){return Math.min(Math.max(e,n),t)}class Vr extends Error{constructor(e){super(`Failed to parse color: "${e}"`);}}var Yr=Vr;function Ur(e){if("string"!=typeof e)throw new Yr(e);if("transparent"===e.trim().toLowerCase())return [0,0,0,0];let t=e.trim();t=Zr.test(e)?function(e){const t=e.toLowerCase().trim(),n=Jr[function(e){let t=5381,n=e.length;for(;n;)t=33*t^e.charCodeAt(--n);return (t>>>0)%2341}(t)];if(!n)throw new Yr(e);return `#${n}`}(e):e;const n=Kr.exec(t);if(n){const e=Array.from(n).slice(1);return [...e.slice(0,3).map((e=>parseInt(qr(e,2),16))),parseInt(qr(e[3]||"f",2),16)/255]}const i=Gr.exec(t);if(i){const e=Array.from(i).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,16))),parseInt(e[3]||"ff",16)/255]}const o=Qr.exec(t);if(o){const e=Array.from(o).slice(1);return [...e.slice(0,3).map((e=>parseInt(e,10))),parseFloat(e[3]||"1")]}const r=Xr.exec(t);if(r){const[t,n,i,o]=Array.from(r).slice(1).map(parseFloat);if($r(0,100,n)!==n)throw new Yr(e);if($r(0,100,i)!==i)throw new Yr(e);return [...ta(t,n,i),Number.isNaN(o)?1:o]}throw new Yr(e)}const Wr=e=>parseInt(e.replace(/_/g,""),36),Jr="1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce(((e,t)=>{const n=Wr(t.substring(0,3)),i=Wr(t.substring(3)).toString(16);let o="";for(let e=0;e<6-i.length;e++)o+="0";return e[n]=`${o}${i}`,e}),{});const qr=(e,t)=>Array.from(Array(t)).map((()=>e)).join(""),Kr=new RegExp(`^#${qr("([a-f0-9])",3)}([a-f0-9])?$`,"i"),Gr=new RegExp(`^#${qr("([a-f0-9]{2})",3)}([a-f0-9]{2})?$`,"i"),Qr=new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${qr(",\\s*(\\d+)\\s*",2)}(?:,\\s*([\\d.]+))?\\s*\\)$`,"i"),Xr=/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,Zr=/^[a-z]+$/i,ea=e=>Math.round(255*e),ta=(e,t,n)=>{let i=n/100;if(0===t)return [i,i,i].map(ea);const o=(e%360+360)%360/60,r=(1-Math.abs(2*i-1))*(t/100),a=r*(1-Math.abs(o%2-1));let s=0,l=0,c=0;o>=0&&o<1?(s=r,l=a):o>=1&&o<2?(s=a,l=r):o>=2&&o<3?(l=r,c=a):o>=3&&o<4?(l=a,c=r):o>=4&&o<5?(s=a,c=r):o>=5&&o<6&&(s=r,c=a);const u=i-r/2;return [s+u,l+u,c+u].map(ea)};function na(e){return function(e){if("transparent"===e)return 0;function t(e){const t=e/255;return t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}const[n,i,o]=Ur(e);return .2126*t(n)+.7152*t(i)+.0722*t(o)}(e)>.179}function ia({className:t,channel:n,...i}){const o=k("io-channel-badge",t);return jsxRuntimeExports.jsx("div",{className:o,style:{color:(r=n.color,na(r)?"#000":"#fff"),backgroundColor:n.color},...i,children:jsxRuntimeExports.jsx("span",{className:"io-channel-badge-label",children:n.label})});var r;}function oa(){return jsxRuntimeExports.jsx(C,{variant:"check"})}function ra({channel:i,handleChannelRestricted:o,restricted:r}){return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:i.isSelected&&jsxRuntimeExports.jsx("span",{children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Publish",checked:i.write,onChange:()=>{o({...i,write:!i.write});},disabled:r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||e.stopPropagation();},tabIndex:0,children:jsxRuntimeExports.jsx(Ri,{label:"Subscribe",checked:i.read,onChange:()=>{o({...i,read:!i.read});},disabled:r?.read})})]})}const aa=reactExports.createContext({});function sa({channel:t,isSelected:n,onChannelSelect:i,onChannelRestrict:o,...a}){const{variant:l,selectedChannels:c,restrictedChannels:u}=reactExports.useContext(aa),d=n||t.isSelected||c?.includes(t),f=u?.find((e=>e.name===t.name)),m=reactExports.useCallback((()=>i?.({...t,isSelected:!d})),[t,i,d]),h=reactExports.useCallback((e=>{o&&o(e);}),[o]);return jsxRuntimeExports.jsx(O,{prepend:jsxRuntimeExports.jsx(ia,{channel:t}),append:"single"===l||"multi"===l?d&&jsxRuntimeExports.jsx(oa,{}):jsxRuntimeExports.jsx(ra,{channel:t,handleChannelRestricted:h,restricted:f}),isSelected:d,onClick:m,...a,children:t.name},t.name)}const la=reactExports.forwardRef((({className:n,variant:i="single",variantToggle:o=false,channels:r=[],restrictedChannels:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:u,...d},f)=>{const m=k("io-list-channels","directionalSingle"===i&&"io-bi-direction",n),h=r.filter((e=>e.isSelected)),p=reactExports.useMemo((()=>({variant:i,selectedChannels:h,restrictedChannels:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:u})),[i,h,a,s,l,u]);let g="Select Channel";return "multi"===i?g="Select Channels":"directionalSingle"===i&&(g="Select Directional Channel"),jsxRuntimeExports.jsx(aa.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(H,{variant:"single",...d,children:[jsxRuntimeExports.jsx(H.ItemTitle,{append:o&&jsxRuntimeExports.jsx(Ri,{label:"Directional",align:"right",onChange:e=>s&&s(e.target.checked),checked:"directionalSingle"===i}),children:g}),r?.map((t=>jsxRuntimeExports.jsx(sa,{channel:t,onChannelSelect:l,onChannelRestrict:u},t.name)))]})})})}));la.displayName="ChannelSelector";reactExports.createContext({config:{message:""},theme:"dark",setResult:()=>{}});function ka({title:n="Downloads"}){const{ItemSearch:i,HeaderButtons:o}=Ua();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(Y,{children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(o,{})]}),jsxRuntimeExports.jsx(i,{})]})}const Na=reactExports.createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),xa=()=>reactExports.useContext(Na);function Sa({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-header-search",n),s=reactExports.useRef(null),{searchQuery:l,setSearch:c,itemsCount:u}=xa();return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:s,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${u} results`})]})}function Da({className:n,...i}){const{SettingsButton:o,MoreButton:r}=Ua();return jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})}function Ea({icon:t="cog",...n}){const{showSettings:i}=xa();return jsxRuntimeExports.jsx(N,{icon:t,variant:"circle",size:"32",onClick:i,...n})}function Ia({icon:n="ellipsis",...i}){const{items:o,clearItems:r}=xa(),a=0===o.length;return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsx($.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:jsxRuntimeExports.jsx($.Item,{disabled:a,onClick:e=>(e=>{a?e.stopPropagation():r();})(e),children:"Clear All"})})})]})}function Aa(e,t=false,n=false,i=false){const o=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:i?n?`${r} ${o}`:`${r} ${o} at ${s}:${c}`:n?`${r} ${o}, ${a}`:`${r} ${o}, ${a} at ${s}:${c}`}function Ma(e,t={showTime:true}){const n=new Date(1e3*e),i=new Date,o=Math.round((i-n)/1e3),r=Math.round(o/60),a=i.toDateString()===n.toDateString(),s=new Date(i.setDate(i.getDate()-1)).toDateString()===n.toDateString(),l=i.getFullYear()===n.getFullYear();return t.showTime?o<5?"Just Now":o<60?`${o} seconds ago`:o<90?"about a minute ago":r<60?`${r} minutes ago`:a?Aa(n,"Today",false,true):s?Aa(n,"Yesterday",false,true):l?Aa(n,false,false,true):Aa(n):a?"Today":s?"Yesterday":l?Aa(n,false,true,true):Aa(n,false,true)}function Ta({className:t,...n}){const i=k("io-dm-body",t),{DownloadListEmpty:o,ItemGroup:r,Item:a}=Ua(),{items:s,searchQuery:l,setCount:d,sortItems:f}=xa(),m=f(s),h=Vi(l),p=reactExports.useMemo((()=>m.filter((e=>e.displayInfo.filename.toLowerCase().includes(h.toLowerCase())||e.displayInfo.url.toLowerCase().includes(h.toLowerCase())))),[m,h]),g=reactExports.useMemo((()=>p.map((e=>({...e,displayInfo:{...e.displayInfo,startTime:Ma(e.displayInfo.startTime,{showTime:false})}})))),[p]),v=reactExports.useMemo((()=>Object.values(g.reduce(((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e)),{}))),[g]);return reactExports.useEffect((()=>{d(p.length);}),[p,d]),jsxRuntimeExports.jsx("div",{className:i,...n,children:v&&0!==v.length?v.map((t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map((t=>jsxRuntimeExports.jsx(a,{item:t},t.id)))},t[0].id??""))):jsxRuntimeExports.jsx(o,{})})}function Pa({className:n,icon:i="download",text:o="No downloads to display.",...r}){const a=k("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(C,{variant:i}),jsxRuntimeExports.jsx("p",{children:o})]})}function _a({className:n,title:i,children:o,...r}){const a=k("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[i&&jsxRuntimeExports.jsx("p",{children:i}),o]})}function Oa({className:i,item:o,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=Ua(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:h,timeRemaining:p}=o.displayInfo;if(!o)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=k("io-dm-item",o.displayInfo.state&&[c],i);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:o.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:h,timeRemaining:p}),jsxRuntimeExports.jsx(l,{itemID:o.id,state:c})]})}function Fa({bytesReceived:t=0,bytesTotal:n=0,...i}){const o=reactExports.useCallback((()=>t&&n?Math.round(t/n*100):0),[t,n]);return jsxRuntimeExports.jsx(Pi,{value:o(),...i})}function La({className:n,itemID:i,filename:o,state:a,cancel:s,remove:l,...c}){const u=k("io-dm-item-header",n),{cancelItem:d,removeItem:f}=xa(),m=reactExports.useCallback((e=>{s?s(e):d(e);}),[s,d]),h=reactExports.useCallback((e=>{l?l(e):f(e);}),[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(E,{text:o,style:{textDecoration:"interrupted"===a||"cancelled"===a?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",onClick:()=>{"progressing"===a||"paused"===a?m(i):h(i);}})]})}function Ba({className:n,state:i,url:o,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=k("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:o}),(m=i,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Fa,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===i?`${d(r??0)} - Done`:"cancelled"===i||"interrupted"===i?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let i="";return t>0&&(i+=`${t} hour${t>1?"s":""}, `),n>0&&(i+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===i)&&(i+=`${e} sec${1!==e?"s":""}`),`${i.trim()} left`})(l)??0}`})]});var f,m;}const Ra={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function ja({className:n,variant:i,text:o}){const r=k("io-dm-item-status",`io-dm-item-status-${i}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[i&&jsxRuntimeExports.jsx(C,{variant:Ra[i],className:"icon-severity"}),o&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:o})]})}function Ha({className:i,itemID:o,state:a,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=k("io-dm-item-footer",i),{pauseResumeItem:f,showItemInFolder:m,cancelItem:h}=xa(),p=reactExports.useCallback((e=>{s?s(e):f(e);}),[s,f]),g=reactExports.useCallback((e=>{l?l(e):m(e);}),[l,m]),v=reactExports.useCallback((e=>{c?c(e):h(e);}),[c,h]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(a){case "progressing":return jsxRuntimeExports.jsxs(V,{align:"right",children:[jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Pause",onClick:()=>p(o)}),jsxRuntimeExports.jsx(V.Button,{variant:"link",text:"Cancel",onClick:()=>v(o)})]});case "paused":return jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Resume",onClick:()=>p(o)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(ja,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(o)})})]});case "cancelled":return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:jsxRuntimeExports.jsx(ja,{variant:"warning",text:"Cancelled"})});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(ja,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(V,{align:"right",children:jsxRuntimeExports.jsx(V.Button,{variant:"primary",text:"Retry",onClick:()=>p(o)})})]});default:return null}})()})}function za({className:n,title:i="Settings",...o}){const r=k("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=xa();return jsxRuntimeExports.jsxs(Mi,{className:r,...o,children:[jsxRuntimeExports.jsxs(Mi.Header,{children:[jsxRuntimeExports.jsx(Mi.Header.Title,{size:"large",text:i,tag:"h1"}),jsxRuntimeExports.jsx(Mi.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Mi.Body,{children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map(((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx($.Item,{onClick:()=>{l(t);},children:t},t)))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const $a={Header:ka,ItemSearch:Sa,HeaderButtons:Da,SettingsButton:Ea,MoreButton:Ia,Body:Ta,DownloadListEmpty:Pa,ItemGroup:_a,Item:Oa,ItemProgress:Fa,ItemHeader:La,ItemBody:Ba,ItemFooter:Ha,Settings:za},Va=reactExports.createContext($a),Ya=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...$a,...n})),[n]);return jsxRuntimeExports.jsx(Va.Provider,{value:i,children:t})}));Ya.displayName="ComponentsStore";const Ua=()=>reactExports.useContext(Va);function qa(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function i(n,i){var o=n instanceof Error?n:new Error(n);if(t)t(o);else {var r='[ERROR] callback-registry: User callback for key "'+i+'" failed: '+o.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,o){var r=n[e];return r||(r=[],n[e]=r),r.push(t),o&&setTimeout((function(){o.forEach((function(o){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(o)?t.apply(void 0,o):t.apply(void 0,[o]);}catch(t){i(t,e);}}));}),0),function(){var i=n[e];i&&(i=i.reduce((function(e,n,i){return n===t&&e.length===i||e.push(n),e}),[]),0===i.length?delete n[e]:n[e]=i);}},execute:function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach((function(n){try{var o=n.apply(void 0,t);a.push(o);}catch(t){a.push(void 0),i(t,e);}})),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}qa.default=qa;y(qa);const Qa=reactExports.createContext({config:{env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"},onThemeChanged:e=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:e=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),Xa=()=>reactExports.useContext(Qa);function Za({...n}){const{config:i,close:o}=Xa(),{applicationTitle:r}=i;return jsxRuntimeExports.jsxs(Y,{draggable:true,...n,children:[jsxRuntimeExports.jsx(Y.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(Y.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(Y.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>o()})})]})}function es({className:n,handleSubmit:i,...o}){const r=k("io-panel-body",n),{config:a,submitFeedback:s}=Xa(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:h,MailListField:p}=ys(),g=i??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...o,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function ts({...n}){const{FooterButtons:i}=ys(),{openUrl:o,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=Xa();return jsxRuntimeExports.jsx(J,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(I,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(Di,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(I,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),o(s);},children:s})]}),jsxRuntimeExports.jsx(i,{})]})})}function ns({className:t,...n}){const{CloseButton:i}=ys(),{close:o}=Xa();return jsxRuntimeExports.jsx(V,{className:t,...n,children:jsxRuntimeExports.jsx(i,{onClick:()=>o()})})}function is({className:n,...i}){const{SubmitButton:o,CancelButton:r,CloseButton:a}=ys(),{close:s,submitCompleted:l}=Xa();return l?jsxRuntimeExports.jsx(V,{className:n,...i,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(V,{className:n,...i,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function os({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function rs({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function as({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function ss({showField:t=true,className:n,title:i,hint:o,children:r,...a}){return t?jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...a,children:r}):null}function ls({showField:t=true,className:n,title:i="Description",hint:o,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(I,{className:n,hint:o,title:"",...s,children:jsxRuntimeExports.jsx(Fi,{id:"description",name:"description",label:i,readOnly:r,disabled:a})}):null}function cs({showField:t,className:n,title:i="Technical Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Xa(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Fi,{id:"errorMessage",name:"errorMessage",label:i,value:d,readOnly:a,disabled:s})}):null}function us({showField:t,className:n,title:i="Environment Information",hint:o,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=Xa(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Fi,{id:"environmentInfo",name:"environmentInfo",label:i,value:d,readOnly:a,disabled:s})}):null}function ds({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=k("io-block-list-gap",n),{config:f}=Xa(),m=l??f.attachments,h=c??f.selectedCategories,p=reactExports.useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(I,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(I,{className:d,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Li,{id:t.id,name:t.id,label:t.name,readOnly:a,disabled:s,defaultChecked:p(t.category)},t.id)))})}):null}function fs({showField:t=true,className:n,title:i="Attachments",hint:o,readOnly:a=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=Xa(),m=l??f,h=c??d.selectedCategories,p=reactExports.useCallback((e=>!!h&&-1!==h.indexOf(e)),[h]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(I,{className:n,title:i,hint:o,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map((t=>jsxRuntimeExports.jsx(Ri,{id:t,name:t,align:"right",label:t,readOnly:a,disabled:s,defaultChecked:p(t)},t)))})}):null}function ms({className:n,title:i,hint:o,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=k("io-block-list-gap",n),{config:h,showMailingList:p,setShowMailingList:g}=Xa();if(!r)return null;const v=a??h.createJiraTicket,y=l??h.sendEmail;return jsxRuntimeExports.jsxs(I,{className:m,hint:o,title:i,...f,children:[v&&jsxRuntimeExports.jsx(Ri,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Ri,{onChange:()=>{g(!p);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function hs({showField:t=true,className:n,title:i="Email List",hint:o="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=Xa(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(I,{className:n,hint:o,...l,children:jsxRuntimeExports.jsx(Oi,{id:"mailingList",name:"mailingList",label:i,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const ps={Header:Za,Body:es,Footer:ts,HeaderButtons:ns,FooterButtons:is,SubmitButton:os,CancelButton:rs,CloseButton:as,IntroField:ss,DescriptionField:ls,TechInfoField:cs,EnvInfoField:us,FileAttachmentsField:ds,CategoryAttachmentsField:fs,SettingsField:ms,MailListField:hs},gs=reactExports.createContext(ps),vs=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...ps,...n})),[n]);return jsxRuntimeExports.jsx(gs.Provider,{value:i,children:t})}));function ys(e){return {...reactExports.useContext(gs),...e}}vs.displayName="ComponentsStore";function ks({className:n,title:i="General",...o}){const r=k("io-notifications-settings-panel-general",n),{AllowNotifications:a,ShowNotificationBadge:s,CloseNotificationOnClick:l,PanelAutoHide:c,HideToastsAfter:u}=ul(),d=qi();return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[d&&jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),d&&jsxRuntimeExports.jsx(l,{}),d&&jsxRuntimeExports.jsx(c,{}),d&&jsxRuntimeExports.jsx(u,{})]})})}function Ns(e){const t=reactExports.useContext(IOConnectContext),n=t?.appManager,i=qi(),[o,a]=reactExports.useState([]),[d,f]=reactExports.useState(0),m="Platform",h=reactExports.useCallback(((e="asc")=>{if(null===i)return [];const t=[...o].sort(((t,n)=>{const i=(t.title??t.name).toLowerCase(),o=(n.title??n.name).toLowerCase();return "asc"===e?i.localeCompare(o):o.localeCompare(i)}));if(!i){const e=t.findIndex((e=>e.name===m));if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t}),[o,i]),p=reactExports.useMemo((()=>h("asc")),[h]),g=reactExports.useMemo((()=>h("desc")),[h]);reactExports.useEffect((()=>{if(null===i||i)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};a((t=>t.some((t=>t.name===e.name))?t:[...t,e]));}),[i]),reactExports.useEffect((()=>{if(!n)return;const e=n.onAppAdded((e=>{a((t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]));})),t=n.onAppRemoved((e=>{a((t=>t.filter((t=>t.name!==e.name))));})),i=n.onAppChanged((e=>{a((t=>{const n=t.find((t=>t.name===e.name));return [...t.filter((t=>t.name!==e.name)),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]}));}));return ()=>{e(),t(),i();}}),[n]);return {apps:reactExports.useMemo((()=>{if(!e?.sourceFilter||!Array.isArray(o))return o;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,i=t.includes("*"),r=n.includes("*");let a=0;const s=o.map((e=>{const n=i||t.includes(e.name),o=!r&&n;return o&&a++,{...e,allowed:o}}));return f(a),s}),[e,o]),allowedApps:d,sortedAppsAsc:p,sortedAppsDesc:g,sortAppsAlphabetically:h}}const Ds="newest",Es="oldest",Is="severity",As=["None","Low","Medium","High","Critical"],Ms={key:Ds,descending:true};const Fs=reactExports.createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),Ls=()=>reactExports.useContext(Fs);function Bs({label:t="Allow notifications",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=reactExports.useCallback((e=>{a({enabledNotifications:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.enabledNotifications??false,...i}):null}function Rs({label:t="Show notification badge",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi()&&!o.enabledNotifications,l=reactExports.useCallback((e=>{a({showNotificationBadge:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.showNotificationBadge??false,disabled:s,...i})}function js({label:t="Close notification on click",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=s&&!o.enabledNotifications,c=reactExports.useCallback((e=>{a({closeNotificationOnClick:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.closeNotificationOnClick??false,disabled:l,...i}):null}function Hs({label:t="Auto hide panel",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=reactExports.useCallback((e=>{a({autoHidePanel:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:l,checked:o.autoHidePanel??false,...i}):null}function zs({label:t="Panel always on top",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=reactExports.useCallback((e=>{a({alwaysOnTop:e.target.checked});}),[a]);return jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:s,checked:o.alwaysOnTop??false,...i})}const $s=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",Vs=e=>{const t=Math.floor(e/60),n=e%60,i=$s(t,"minute"),o=$s(n,"second");return i+(i&&o?" ":"")+o};function Ys({className:n,title:i="Hide toasts after",items:o=[15,30,45,60],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Ls(),u=qi(),d=u&&!l.enabledNotifications,f=reactExports.useCallback(((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});}),[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:Vs((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:Vs(t)},t)))})})]})]}):null}function Us({className:n,title:i="Highlight new for",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,l=["30 seconds","1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:l[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Ws({className:n,title:i="Mark as read after",...o}){const r=k("flex","jc-between","ai-center",n),{settings:a}=Ls(),s=qi()&&!a.enabledNotifications,l=["1 minute","5 minutes","Never"];return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":s}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:s,children:[jsxRuntimeExports.jsx($.Button,{text:l[0]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:l.map((t=>jsxRuntimeExports.jsx($.Item,{children:t},t)))})})]})]})}function Js({className:n,title:i="Stacking",...o}){const r=k("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=ul();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function qs({label:t="Allow toast stacking",align:n="right",...i}){const{settings:o,saveSetting:a}=Ls(),s=qi(),l=s&&!o.enabledNotifications,c=reactExports.useCallback((e=>{a({toastStacking:e.target.checked});}),[a]);return s?jsxRuntimeExports.jsx(Ri,{label:t,align:n,onChange:c,checked:o.toastStacking??false,disabled:l,...i}):null}const Ks=e=>e.replace(/(^|-)\w/g,(e=>e.toUpperCase().replace("-"," ")));function Gs({className:n,title:i="Group by",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=c&&!s.enabledNotifications,d=reactExports.useCallback((e=>{e||(e="severity"),s.stackBy!==e&&l({stackBy:e.toLowerCase()});}),[s.stackBy,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx($.Button,{text:s.stackBy?Ks(s.stackBy):"Severity"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Severity","Application"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{d(t);},children:t},t)))})})]})]})}function Qs({className:n,title:i="Placement",...o}){const r=k("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=ul();return qi()?jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function Xs({className:n,title:i="Panel position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=reactExports.useCallback((e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.panel?Ks(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Right","Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function Zs({className:n,title:i="Toasts position",...o}){const a=k("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Ls(),c=qi(),u=reactExports.useCallback((e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});}),[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:a,...o,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:s.placement?.toasts?Ks(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{u(t);},children:t},t)))})})]})]})}function el({className:t,title:n="Snooze",...i}){const o=k("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=ul(),{settings:a}=Ls();return qi()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsx(I,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function tl({className:n,title:i="Default duration",items:o=[60,120,180,300],...a}){const s=k("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Ls(),u=qi(),d=u&&!l.enabledNotifications,f=reactExports.useCallback(((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});}),[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...a,children:[jsxRuntimeExports.jsx("div",{className:k("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:i})}),jsxRuntimeExports.jsxs($,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx($.Button,{text:Vs((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",children:o.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>{f(t);},children:Vs(t)},t)))})})]})]}):null}function nl({className:n,title:i,...o}){const r=k("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=ul(),{sortAppsAlphabetically:u}=Ns(),d=qi(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsxs(I,{title:i??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map((n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name)))]})})}function il({label:t="All apps",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),l=qi()&&!o.enabledNotifications,c=reactExports.useCallback((e=>{s({subscribe:e.target.checked});}),[s]);return jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:c,checked:(a.sourceFilter?.allowed?.includes("*")&&0===a.sourceFilter?.blocked?.length)??false,disabled:l,...i})}function ol({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=Ls(),u=qi()&&!s.enabledNotifications,d=reactExports.useCallback(((e,t)=>{const n={...l.sourceFilter},i=n.allowed?.indexOf("*");"number"==typeof i&&i>-1&&(n.allowed?.splice(i,1),a.forEach((e=>{e.name!==t.name&&n.allowed?.push(e.name);}))),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter((e=>e!==t.name))):(n.allowed=n.allowed?.filter((e=>e!==t.name)),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);}),[a,l.sourceFilter,c]);return jsxRuntimeExports.jsx(Ri,{id:i.name,label:t,align:n,onChange:e=>d(e.target.checked,i),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(i.name)||l.sourceFilter?.allowed?.includes(i.name))??false,disabled:u,...o})}function rl({label:t="Mute all",align:n="right",...i}){const{settings:o,configuration:a,saveAllFilter:s}=Ls(),l=qi(),c=l&&(!o.enabledNotifications||-1===a.sourceFilter?.allowed?.indexOf("*")),u=reactExports.useCallback((e=>{s({mute:e.target.checked});}),[s]);return l?jsxRuntimeExports.jsx(Ri,{align:n,label:t,onChange:u,checked:a.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...i}):null}function al({label:t="App",align:n="right",app:i,...o}){const{allApps:a,settings:s,configuration:l,saveFilter:c}=Ls(),u=qi(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(i.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(i.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=reactExports.useCallback(((e,t)=>{const n={...l.sourceFilter},i=n?.muted?.indexOf("*");"number"==typeof i&&i>-1&&(n.muted?.splice(i,1),a.forEach((e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);}))),e?n.muted?.push(t.name):n.muted=n.muted?.filter((e=>e!==t.name)),c(n);}),[a,l.sourceFilter,c]);return !u||i.hidden?null:jsxRuntimeExports.jsx(Ri,{id:i.name,label:t,align:n,onChange:e=>f(e.target.checked,i),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(i.name))??false,disabled:d??false,...o})}const sl={Body:n=>{const{General:i,Placement:o,Stacking:r,Snooze:a,Subscriptions:s}=ul();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:ks,AllowNotifications:Bs,ShowNotificationBadge:Rs,CloseNotificationOnClick:js,PanelAutoHide:Hs,PanelAlwaysOnTop:zs,HideToastsAfter:Ys,MarkAsNew:Us,MarkAsRead:Ws,Stacking:Js,ToastStacking:qs,ToastStackBy:Gs,Placement:Qs,PlacementPanel:Xs,PlacementToasts:Zs,Snooze:el,SnoozeDuration:tl,Subscriptions:nl,SubscribeAll:il,SubscribeApp:ol,SubscribeMuteAll:rl,SubscribeMuteApp:al},ll=reactExports.createContext(sl),cl=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...sl,...n})),[n]);return jsxRuntimeExports.jsx(ll.Provider,{value:i,children:t})}));cl.displayName="NotificationsSettingsPanelComponentsStoreProvider";const ul=()=>reactExports.useContext(ll);const hl=reactExports.createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),pl=()=>reactExports.useContext(hl);function gl({title:n,onClose:i,onOpenSettings:o,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=ec(),{isBulkActionsSupported:m,notificationsCount:h}=Ls(),{isBulkActionsVisible:p}=pl(),g=qi();return jsxRuntimeExports.jsxs(Ei,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Ei.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:o}),jsxRuntimeExports.jsx(c,{onClick:i})]})]}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${p&&h>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(f,{})]})}function vl({text:n="Notifications",counter:i,...o}){const{notificationsCount:r}=Ls();return jsxRuntimeExports.jsx(E,{text:n,size:"large",...o,children:(i??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const yl=e=>[...e].sort(((e,t)=>(t.timestamp||0)-(e.timestamp||0))),wl=e=>[...e].sort(((e,t)=>(e.timestamp||0)-(t.timestamp||0))),bl=(e,t)=>{const n=As[0];return [...e].sort(((e,i)=>{const o=As.indexOf(e.severity||n),r=As.indexOf(i.severity||n);return (t?-1:1)*(o-r)}))},kl={[Ds]:yl,[Es]:wl,[Is]:bl};function Cl({...t}){const[n,i]=reactExports.useState([]),{NotificationsList:o,Notification:r}=ec(),{notifications:a,setCount:s,notificationsCount:f}=Ls(),{sortNotificationsBy:m,viewNotificationsBy:h,searchQuery:p}=pl(),g=reactExports.useRef(null),v=Vi(p),y=reactExports.useMemo((()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter((e=>"Active"===e.state||"Stale"===e.state));case "read":return e.filter((e=>"Acknowledged"===e.state||"Seen"===e.state));case "snoozed":return e.filter((e=>"Snoozed"===e.state))}})(a,h);return e.filter((e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase())))}),[v,a,h]);return reactExports.useEffect((()=>{switch(m){case "newest":i(yl(y));break;case "oldest":i(wl(y));break;case "severity":i(bl(y,true));break;default:i(y);}s(y.length);}),[y,m,s]),reactExports.useEffect((()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});}),[v,f,m,h]),jsxRuntimeExports.jsx(Ii,{ref:g,...t,children:jsxRuntimeExports.jsx(o,{notifications:n,Notification:r})})}function Nl({...t}){const{FooterButtons:n}=ec();return jsxRuntimeExports.jsx(Ai,{...t,children:jsxRuntimeExports.jsx(n,{})})}function xl({className:n,...i}){const{FooterButtonClearAll:o,FooterButtonClearAllOld:r}=ec(),{notifications:a}=Ls(),[s,c]=reactExports.useState(false);return reactExports.useEffect((()=>{a.filter((e=>"Stale"===e.state||"Acknowledged"===e.state)).length>0?c(true):c(false);}),[a]),jsxRuntimeExports.jsxs(V,{className:n,align:"right",...i,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(o,{disabled:a.length<=0})]})}function Sl({text:t="Clear All",...n}){const{clearAll:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function Dl({text:t="Clear Old",...n}){const{clearAllOld:i}=Ls();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{i();},...n})}function El({className:n,notification:i,...o}){const r=k("io-notification-header",n),{HeaderCount:a,HeaderBadge:s,HeaderTitle:l,HeaderTimestamp:c,HeaderButtonSnooze:u,HeaderButtonClose:d}=Yl();return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(s,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(l,{notification:i}),jsxRuntimeExports.jsx(c,{notification:i}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(u,{notification:i}),jsxRuntimeExports.jsx(d,{notification:i})]})]})}function Il({notification:t,...n}){const{settings:i,notificationStacks:o}=Ls(),{isPanelVisible:r}=pl(),{toastStacking:a,stackBy:s}=i,l="application"===s?"source":s??"source";let c;if(a){const e=o.find((e=>e.key===t[l]));c=e?.items.length??0;}return a&&!r&&c&&c>1?jsxRuntimeExports.jsx(D,{...n,children:c<10?c:"9+"}):null}function Al({className:n,notification:i,...o}){if(!i?.severity||"None"===i.severity)return null;const r=k("io-notification-header-badge",n);return jsxRuntimeExports.jsxs("div",{className:r,...o,children:[jsxRuntimeExports.jsx(C,{variant:((e="None")=>{switch(e.toLowerCase()){case "low":case "medium":case "none":default:return "circle-info";case "high":return "triangle-exclamation";case "critical":return "ban"}})(i.severity),size:"12"}),i.severity]})}function Ml({className:n,state:i,severity:o="None",icon:r,...a}){const s=k("io-notification-header-icon",n),{isPanelVisible:l}=pl();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${o.toLowerCase()}`,children:l&&"Acknowledged"!==i&&"New"})]})}function Tl({className:t,notification:{appTitle:n},...i}){const o=k("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:o,...i,children:n})}function Pl({className:t,notification:{timestamp:n,state:i,snooze:o},...r}){const a=k("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",o&&"Snoozed"===i?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:Ma(n??0)??"Just Now"})}function _l({notification:{id:t,state:n},...i}){const{settings:o,snooze:a}=Ls(),s=reactExports.useCallback((e=>{e.stopPropagation(),a&&a(t,o.snooze?.duration??0);}),[t,a,o.snooze?.duration]);return a&&"Snoozed"!==n&&o.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...i}):null}function Ol({notification:{id:t,updateState:n},...i}){const o=qi(),{onClose:a}=Ls(),{isPanelVisible:s}=pl(),l=reactExports.useCallback((e=>{e.stopPropagation(),!o||s?a(t):n("Acknowledged").catch(console.error);}),[o,t,a,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",size:"24",tabIndex:-1,onClick:l,...i})}function Fl({className:n,notification:i,...o}){const a=k("io-notification-body",n),s=qi(),{BodyIcon:l,BodyTitle:c,BodyDescription:u}=Yl(),{id:d,icon:f,title:m,body:h,onClick:p,updateState:g}=i,{settings:v,onClose:y}=Ls(),{isPanelVisible:w}=pl(),b=reactExports.useCallback((async()=>{if(!p)return;if(!s)return void y(d);const e=!v?.toastStacking&&null,t=w?v?.closeNotificationOnClick??true:e;null!==t?await p({close:t}).catch(console.error):(await p({close:false}).catch(console.error),await g("Acknowledged").catch(console.error));}),[s,d,w,p,y,g,v?.closeNotificationOnClick,v?.toastStacking]);return jsxRuntimeExports.jsxs("div",{className:a,role:"button",tabIndex:0,onKeyDown:async e=>{(e=>"Enter"===e.key||" "===e.key)(e)&&await b();},onClick:b,...o,children:[jsxRuntimeExports.jsx(l,{icon:f}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(c,{text:m}),jsxRuntimeExports.jsx(u,{text:h})]})]})}function Ll({className:t,icon:n,altText:i="notification icon",...o}){if(!n)return null;const r=k("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx("img",{src:n,alt:i})})}function Bl({text:t,...n}){return jsxRuntimeExports.jsx(E,{text:t,...n})}function Rl({className:t,text:n,...i}){const o=k("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:o,...i,children:n})}function jl({className:n,notification:i}){const o=k("io-notification-footer",n),{FooterButton:r}=Yl(),a=reactExports.useMemo((()=>function(e){const t=[],n={};if(!e)return;e.forEach((e=>{const{displayId:i,displayPath:o}=e,r={...e,children:[]};if(o&&o.length>0){let e;o.forEach(((t,i)=>{0===i?e=n[t]:e&&(e=e.children?.find((e=>e.displayId===t)));})),e&&e.children?.push(r);}else i?(t.push(r),n[i]=r):t.push(r);i&&(n[i]=r);}));const i=e=>{e.forEach((e=>{e.children&&0===e.children.length?delete e.children:e.children&&i(e.children);}));};return i(t),t}(i.actions)),[i.actions]),s=(t,n)=>t.children?jsxRuntimeExports.jsx(xi,{text:t.title,children:t.children.map(s)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(xi.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t,notificationId:i.id})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:o,children:jsxRuntimeExports.jsx(V,{align:"right",children:a?.map(((n,o)=>n.children?jsxRuntimeExports.jsxs(V,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default",notificationId:i.id}),jsxRuntimeExports.jsx(xi,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(s)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link",notificationId:i.id},`${n.title}-${o}`)))})})}function Hl({notificationAction:t,...n}){const i=reactExports.useCallback((e=>{e.stopPropagation(),t.onClick({close:true});}),[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:i,...n})}const zl={Header:El,HeaderCount:Il,HeaderBadge:Al,HeaderIcon:Ml,HeaderTitle:Tl,HeaderTimestamp:Pl,HeaderButtonSnooze:_l,HeaderButtonClose:Ol,Body:Fl,BodyIcon:Ll,BodyTitle:Bl,BodyDescription:Rl,Footer:jl,FooterButton:Hl},$l=reactExports.createContext(zl),Vl=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...zl,...n})),[n]);return jsxRuntimeExports.jsx($l.Provider,{value:i,children:t})}));function Yl(e){return {...reactExports.useContext($l),...e}}function Ul({className:n,notification:i,...o}){const{Header:r,Body:a,Footer:s}=Yl(),{severity:l}=i,c=k("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==i.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...o,children:[jsxRuntimeExports.jsx(r,{notification:i}),jsxRuntimeExports.jsx(a,{notification:i}),jsxRuntimeExports.jsx(s,{notification:i})]})}function Wl({components:t,notification:n,...i}){return jsxRuntimeExports.jsx(Vl,{components:t,children:jsxRuntimeExports.jsx(Ul,{notification:n,...i})})}function Jl({className:n,notifications:i,...o}){const[a,s]=reactExports.useState(false),c=i.length>=3?"large":"normal",u=2===i.length?"small":c,d=i[0].severity,f=k("io-notification-stack",a&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=reactExports.useCallback((()=>{s(true);}),[]),h=reactExports.useCallback((e=>{e.stopPropagation(),i.forEach((e=>{e.close();}));}),[i]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...o,children:[a&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>h(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear All"})})}),i.map((t=>jsxRuntimeExports.jsx(Wl,{notification:t},t.id)))]})}function ql({...t}){const{notificationStacks:i}=Ls();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:i.map((n=>jsxRuntimeExports.jsx(Jl,{notifications:n.items,...t},n.key)))})}Vl.displayName="ComponentsStoreProvider";const Kl=({notification:n,Notification:i,...o})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=Ls(),{isPanelVisible:c,isBulkActionsVisible:u}=pl(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,h=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:k("io-notification-list-bulk-action-item",{selected:h}),children:[jsxRuntimeExports.jsx(Li,{checked:h,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(i,{notification:n,...o})]}):jsxRuntimeExports.jsx(i,{notification:n,...o})};function Gl({className:n,Notification:i,notifications:o=[],noNotificationText:r="No notifications to display",...a}){const s=k("io-notification-list",n),{settings:l}=Ls(),{isPanelVisible:c}=pl(),{toastStacking:u}=l,d=u&&!c,f=o.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(ql,{}),!d&&(f?o.map((t=>jsxRuntimeExports.jsx(Kl,{notification:t,Notification:i,...a},t.id))):jsxRuntimeExports.jsx("div",{className:"flex jc-center mt-8",children:r}))]})}const Ql={Header:gl,HeaderCaptionTitle:vl,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:i=0}=Ls();return 0===i?null:jsxRuntimeExports.jsx(D,{variant:t,...n,children:i>99?"99+":i})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:i="circle",...o}){return qi()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,...o}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:i="circle",onClick:o,...r}){const{hidePanel:a}=Ls(),s=qi();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,onClick:e=>{o?o(e):s&&a();},...r})},HeaderActions:function({className:n,...i}){const o=k("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=ec();return jsxRuntimeExports.jsxs("div",{className:o,...i,children:[jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...i}){const{sortNotificationsBy:o,setSortBy:a}=pl(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Ls(),[t,n]=reactExports.useState(Ms),{key:i,descending:o}=t,a=reactExports.useMemo((()=>kl[i](e,o)),[e,i,o]),s=reactExports.useCallback((e=>{n((t=>({key:e,descending:t.key!==e?Ms.descending:!t.descending})));}),[]);return {onNotificationsSort:s,sortedNotifications:a}})();return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:o})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Severity"].map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:o===t.toLowerCase(),onClick:()=>{a(t.toLowerCase()),s(t.toLowerCase());},children:t},t)))})})]})},HeaderActionView:function({text:n="View",...i}){const{settings:o}=Ls(),{viewNotificationsBy:r,setViewBy:a}=pl(),s=o.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs($,{variant:"light",...i,children:[jsxRuntimeExports.jsxs($.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{variant:"single",checkIcon:"check",children:s.map((t=>jsxRuntimeExports.jsx($.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t)))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:i,notificationsCount:o}=Ls();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:i,disabled:0===o,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:i,notificationsCount:o}=Ls(),{showBulkActions:r}=pl();return i?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===o,...n}):null},HeaderBulkActions:function({className:n,...i}){const o=k("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=ec(),{isBulkActionsSupported:f}=Ls();return f?jsxRuntimeExports.jsx("div",{className:o,...i,children:jsxRuntimeExports.jsxs(V,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:i,selectAllNotifications:o,notificationsCount:r}=Ls();return n?jsxRuntimeExports.jsx(Li,{checked:r===i.length&&r>0,onChange:e=>o("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:i,selectAllNotifications:o,notificationsCount:r}=Ls();return i?jsxRuntimeExports.jsxs($,{variant:"light",...n,children:[jsxRuntimeExports.jsx($.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(P,{children:jsxRuntimeExports.jsxs($.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx($.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>o(t.toLowerCase(),true),children:t},t)))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:i="circle",tooltip:o="Mark as read",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Ls(),d=reactExports.useCallback((()=>{c(l,"Seen");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:i="circle",tooltip:o="Mark as unread",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Ls(),d=reactExports.useCallback((()=>{c(l,"Active");}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:i="circle",tooltip:o="Snooze",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=Ls(),f=reactExports.useCallback((()=>{c(l,u.snooze?.duration??0);}),[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:f,disabled:0===d,...a}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:i="circle",tooltip:o="Clear",...a}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=Ls(),d=reactExports.useCallback((()=>{c(l);}),[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:i,title:o,onClick:d,disabled:0===u,...a}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...i}){const{isBulkActionsSupported:o,notificationsCount:r}=Ls(),{hideBulkActions:a}=pl();return o?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...i}):null},HeaderSearch:function({className:n,icon:i="search",placeholder:o="Search",...r}){const a=k("io-panel-header-search",n),{notificationsCount:s}=Ls(),{searchQuery:l,setSearch:c}=pl(),u=reactExports.useRef(null);return jsxRuntimeExports.jsxs("div",{className:a,children:[jsxRuntimeExports.jsx(Oi,{ref:u,value:l,iconPrepend:i,placeholder:o,onChange:e=>c(e.target.value),...r}),l.length>0&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${s} results`})]})},Body:Cl,Footer:Nl,FooterButtons:xl,FooterButtonClearAll:Sl,FooterButtonClearAllOld:Dl,Notification:Wl,NotificationsList:Gl},Xl=reactExports.createContext(Ql),Zl=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...Ql,...n})),[n]);return jsxRuntimeExports.jsx(Xl.Provider,{value:i,children:t})}));function ec(e){return {...reactExports.useContext(Xl),...e}}Zl.displayName="ComponentsStoreProvider";const ic={Body:function({className:t,notifications:n,maxToasts:i=1,...o}){const r=k("io-toasts-body",t),{NotificationsList:a,Notification:s}=ac(),[c,d]=reactExports.useState([]);return reactExports.useEffect((()=>{const e=i<0?n.length:i,t=n.filter((e=>"Active"===e.state)).slice(0,e);for(const e of t)e.onShow();d(t);}),[n,i]),jsxRuntimeExports.jsx("div",{className:r,...o,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:c,noNotificationText:""})})},Notification:Wl,NotificationsList:Gl},oc=reactExports.createContext(ic),rc=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...ic,...n})),[n]);return jsxRuntimeExports.jsx(oc.Provider,{value:i,children:t})}));function ac(e){return {...reactExports.useContext(oc),...e}}rc.displayName="ComponentsStoreProvider";const uc=n=>{const{General:i,Layouts:o,Downloads:r,System:a}=Nu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},dc=({className:n,title:i="General",...o})=>{const{Theme:r,PinnedPosition:a,MinimizeToTray:s,ShowTutorialOnStartup:l}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})},fc=(e="dark")=>{switch(e){case "dark":return "Dark";case "light":return "Light";default:return e}},mc=({className:n,title:i="Theme",...o})=>{const{currentTheme:a,selectTheme:c}=(()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState(null),i=reactExports.useCallback((t=>e?.themes?.select(t)),[e]);return reactExports.useEffect((()=>{if(!e)return;let t=false;const i=e=>{t||n(e);};return e.themes?.onChanged(i),e.themes?.getCurrent().then(i).catch(console.warn),()=>{t=true;}}),[e]),{currentTheme:t,selectTheme:i}})(),d=(()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState([]);return reactExports.useEffect((()=>{e&&e.themes?.list().then(n).catch(console.warn);}),[e]),t})();return jsxRuntimeExports.jsxs("div",{className:k("flex jc-between ai-center",n),...o,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsxs($,{variant:"light",children:[jsxRuntimeExports.jsx($.Button,{text:fc(a?.name)}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:d.map((({name:t})=>jsxRuntimeExports.jsx($.Item,{onClick:()=>c(t),children:fc(t)},t)))})})]})]})},hc=({prefKey:n,options:i,disabled:o,...r})=>{const{isLoading:a,value:s="Select option",update:l}=zr({prefKey:n});return jsxRuntimeExports.jsxs($,{variant:"light",disabled:a||o,...r,children:[jsxRuntimeExports.jsx($.Button,{children:s}),jsxRuntimeExports.jsx($.Content,{children:jsxRuntimeExports.jsx($.List,{children:i.map((t=>jsxRuntimeExports.jsx($.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t)))})})]})},pc=({className:n,label:i="Pinned position",...o})=>jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",n),...o,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(hc,{className:n,prefKey:eo,options:["Left","Right"],...o})]})}),gc=({prefKey:t,...n})=>{const{isLoading:i,value:o=false,update:r}=zr({prefKey:t});return jsxRuntimeExports.jsx(Ri,{checked:o,disabled:i,onChange:e=>r(e.target.checked),...n})},vc=({align:t="right",label:n="Allow docking",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:to,...i}),yc=({align:t="right",label:n="Minimize to tray",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:no,...i}),wc=({align:t="right",label:n="Auto-close on starting apps and workspaces",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:io,disabled:true,...i}),bc=({align:t="right",label:n="Show tutorial on startup",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:oo,...i}),kc=({className:n,title:i="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:r,LayoutsShowDeletePrompt:a,LayoutsShowUnsavedChangesPrompt:s}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(a,{})]})},Cc=({align:t="right",label:n="Restore last saved on startup",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:ro,...i}),Nc=({align:t="right",label:n="Save current on exit",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:ao,...i}),xc=({align:t="right",label:n="Show prompt for unsaved changes",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:so,...i}),Sc=({align:t="right",label:n="Show prompt for deleting",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:lo,...i}),Dc=({className:t,title:n="Downloads",...i})=>{const{DownloadsLocation:o}=Nu();return jsxRuntimeExports.jsx(I,{className:k("io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Ec=({align:t="right",label:n="Ask where to save each file before downloading",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:co,...i}),Ic=({className:n,label:i="Location",...o})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=xa();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),...o,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:i}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Ac=({className:n,title:i="System",...o})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Nu();return jsxRuntimeExports.jsxs(I,{className:k("io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Mc=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Tc={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Pc={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},_c=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},Oc=function(e){return  true===e?1:0};function Fc(e,t){var n;return function(){var i=this,o=arguments;clearTimeout(n),n=setTimeout((function(){return e.apply(i,o)}),t);}}var Lc=function(e){return e instanceof Array?e:[e]};function Bc(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function Rc(e,t,n){var i=window.document.createElement(e);return t=t||"",n=n||"",i.className=t,void 0!==n&&(i.textContent=n),i}function jc(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function Hc(e,t){return t(e)?e:e.parentNode?Hc(e.parentNode,t):void 0}function zc(e,t){var n=Rc("div","numInputWrapper"),i=Rc("input","numInput "+e),o=Rc("span","arrowUp"),r=Rc("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?i.type="number":(i.type="text",i.pattern="\\d*"),void 0!==t)for(var a in t)i.setAttribute(a,t[a]);return n.appendChild(i),n.appendChild(o),n.appendChild(r),n}function $c(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var Vc=function(){},Yc=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},Uc={D:Vc,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*Oc(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var i=parseInt(t),o=new Date(e.getFullYear(),0,2+7*(i-1),0,0,0,0);return o.setDate(o.getDate()-o.getDay()+n.firstDayOfWeek),o},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:Vc,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:Vc,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},Wc={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},Jc={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[Jc.w(e,t,n)]},F:function(e,t,n){return Yc(Jc.n(e,t,n)-1,false,t)},G:function(e,t,n){return _c(Jc.h(e,t,n))},H:function(e){return _c(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[Oc(e.getHours()>11)]},M:function(e,t){return Yc(e.getMonth(),true,t)},S:function(e){return _c(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return _c(e.getFullYear(),4)},d:function(e){return _c(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return _c(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return _c(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},qc=function(e){var t=e.config,n=void 0===t?Tc:t,i=e.l10n,o=void 0===i?Pc:i,r=e.isMobile,a=void 0!==r&&r;return function(e,t,i){var r=i||o;return void 0===n.formatDate||a?t.split("").map((function(t,i,o){return Jc[t]&&"\\"!==o[i-1]?Jc[t](e,r,n):"\\"!==t?t:""})).join(""):n.formatDate(e,t,r)}},Kc=function(e){var t=e.config,n=void 0===t?Tc:t,i=e.l10n,o=void 0===i?Pc:i;return function(e,t,i,r){if(0===e||e){var a,s=r||o,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||Tc).dateFormat,u=String(e).trim();if("today"===u)a=new Date,i=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,h=0,p="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(Wc[g]&&!y){p+=Wc[g];var w=new RegExp(p).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:Uc[g],val:w[++h]});}else v||(p+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach((function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a})),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===i&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function Gc(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var Qc=function(e,t,n){return e>Math.min(t,n)&&e<Math.max(t,n)},Xc=function(e,t,n){return 3600*e+60*t+n},Zc=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]},eu={DAY:864e5};function tu(e){var t=e.defaultHour,n=e.defaultMinute,i=e.defaultSeconds;if(void 0!==e.minDate){var o=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<o&&(t=o),t===o&&n<r&&(n=r),t===o&&n===r&&i<a&&(i=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(i=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:i}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var i=function(t){t&&Object.keys(t).forEach((function(n){return e[n]=t[n]}));},o=0,r=t;o<r.length;o++){i(r[o]);}return e});var nu=function(){return nu=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},nu.apply(this,arguments)},iu=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var i=Array(e),o=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,o++)i[o]=r[a];return i},ou=300;function ru(e,t){var n={config:nu(nu({},Tc),su.defaultConfig),l10n:Pc};function i(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function o(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame((function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}}));}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||Gc(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),i=tu(n.config);t.setHours(i.hours,i.minutes,i.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,i=$c(e),o=i;void 0!==n.amPM&&i===n.amPM&&(n.amPM.textContent=n.l10n.amPM[Oc(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(o.getAttribute("min")),a=parseFloat(o.getAttribute("max")),s=parseFloat(o.getAttribute("step")),l=parseInt(o.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==o.value&&2===o.value.length){var d=o===n.hourElement,f=o===n.minuteElement;u<r?(u=a+u+Oc(!d)+(Oc(d)&&Oc(!n.amPM)),f&&p(void 0,-1,n.hourElement)):u>a&&(u=o===n.hourElement?u-a-Oc(!n.amPM):r,f&&p(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[Oc(n.amPM.textContent===n.l10n.amPM[0])]),o.value=_c(u);}}(e);var o=n._input.value;s(),Z(),n._input.value!==o&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,i=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,o=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=i,t=n.amPM.textContent,i=e%12+12*Oc(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===Gc(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===Gc(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=Xc(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=Xc(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=Xc(i,o,r);if(d>u&&d<l){var f=Zc(l);i=f[0],o=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(i=Math.min(i,m.getHours()))===m.getHours()&&(o=Math.min(o,m.getMinutes())),o===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var h=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(i=Math.max(i,h.getHours()))===h.getHours()&&o<h.getMinutes()&&(o=h.getMinutes()),o===h.getMinutes()&&(r=Math.max(r,h.getSeconds()));}}c(i,o,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,i){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,i||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=_c(n.config.time_24hr?e:(12+e)%12+12*Oc(e%12==0)),n.minuteElement.value=_c(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[Oc(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=_c(i)));}function u(e){var t=$c(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&M(n);}function d(e,t,i,o){return t instanceof Array?t.forEach((function(t){return d(e,t,i,o)})):e instanceof Array?e.forEach((function(e){return d(e,t,i,o)})):(e.addEventListener(t,i,o),void n._handlers.push({remove:function(){return e.removeEventListener(t,i,o)}}))}function f(){q("onChange");}function m(e,t){var i=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),o=n.currentYear,r=n.currentMonth;try{void 0!==i&&(n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth());}catch(e){e.message="Invalid date supplied: "+i,n.config.errorHandler(e);}t&&n.currentYear!==o&&(q("onYearChange"),C()),!t||n.currentYear===o&&n.currentMonth===r||q("onMonthChange"),n.redraw();}function h(e){var t=$c(e);~t.className.indexOf("arrow")&&p(e,t.classList.contains("arrowUp")?1:-1);}function p(e,t,n){var i=e&&$c(e),o=n||i&&i.parentNode&&i.parentNode.firstChild,r=K("increment");r.delta=t,o&&o.dispatchEvent(r);}function g(e,t,i,o){var r=T(t,true),a=Rc("span",e,t.getDate().toString());return a.dateObj=t,a.$i=o,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===Gc(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Bc(a,"startRange",n.selectedDates[0]&&0===Gc(t,n.selectedDates[0],true)),Bc(a,"endRange",n.selectedDates[1]&&0===Gc(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(Gc(e,n.selectedDates[0])>=0&&Gc(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&o%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),q("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,i=e>0?n.config.showMonths:-1,o=t;o!=i;o+=e)for(var r=n.daysContainer.children[o],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function w(e,t){var o=i(),r=P(o||document.body),a=void 0!==e?e:r?o:void 0!==n.selectedDateElem&&P(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&P(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var i=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,o=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=i-n.currentMonth;a!=o;a+=r)for(var s=n.daysContainer.children[a],l=i-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var i=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,o=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=o+1-i,d=0;u<=o;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-i&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=Rc("div","dayContainer");return m.appendChild(a),m}function k(){if(void 0!==n.daysContainer){jc(n.daysContainer),n.weekNumbers&&jc(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),e.appendChild(b(i.getFullYear(),i.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function C(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var i=Rc("option","flatpickr-monthDropdown-month");i.value=new Date(n.currentYear,t).getMonth().toString(),i.textContent=Yc(t,n.config.shorthandCurrentMonth,n.l10n),i.tabIndex=-1,n.currentMonth===t&&(i.selected=true),n.monthsDropdownContainer.appendChild(i);}}}function N(){var e,t=Rc("div","flatpickr-month"),i=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=Rc("span","cur-month"):(n.monthsDropdownContainer=Rc("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",(function(e){var t=$c(e),i=parseInt(t.value,10);n.changeMonth(i-n.currentMonth),q("onMonthChange");})),C(),e=n.monthsDropdownContainer);var o=zc("cur-year",{tabindex:"-1"}),r=o.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=Rc("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(o),i.appendChild(a),t.appendChild(i),{container:t,yearElement:r,monthElement:e}}function x(){jc(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=N();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function S(){n.weekdayContainer?jc(n.weekdayContainer):n.weekdayContainer=Rc("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=Rc("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=iu(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=iu(t.splice(e,t.length),t.splice(0,e)));for(var i=n.config.showMonths;i--;)n.weekdayContainer.children[i].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var i=t?e:e-n.currentMonth;i<0&&true===n._hidePrevMonthArrow||i>0&&true===n._hideNextMonthArrow||(n.currentMonth+=i,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,q("onYearChange"),C()),k(),q("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function A(e){if(n.isOpen&&!n.config.inline){var t=$c(e),i=I(t),o=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!i&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some((function(e){return e.contains(t)}));o&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function M(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,i=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),i&&(n.redraw(),q("onYearChange"),C());}}function T(e,t){var i;void 0===t&&(t=true);var o=n.parseDate(e,void 0,t);if(n.config.minDate&&o&&Gc(o,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&o&&Gc(o,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===o)return  false;for(var r=!!n.config.enable,a=null!==(i=n.config.enable)&&void 0!==i?i:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(o))return r;if(l instanceof Date&&void 0!==o&&l.getTime()===o.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===o.getTime()?r:!r}if("object"==typeof l&&void 0!==o&&l.from&&l.to&&o.getTime()>=l.from.getTime()&&o.getTime()<=l.to.getTime())return r}return !r}function P(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function _(e){var t=e.target===n._input,i=n._input.value.trimEnd()!==X();!t||!i||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function O(t){var o=$c(t),r=n.config.wrap?e.contains(o):o===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,o===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),o.blur();n.open();}else if(I(o)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(o);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),$()):V(t);break;case 27:t.preventDefault(),$();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=i();if(void 0!==n.daysContainer&&(false===l||f&&P(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var h=40===t.keyCode?1:-1;n.daysContainer&&void 0!==o.$i||o===n.input||o===n.altInput?t.ctrlKey?(t.stopPropagation(),M(n.currentYear-h),w(y(1),0)):d||w(void 0,7*h):o===n.currentYearElement?M(n.currentYear-h):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var p=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter((function(e){return e})),g=p.indexOf(o);if(-1!==g){var v=p[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(o)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&o===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(o))&&q("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var i=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),o=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(i,n.selectedDates[0].getTime()),a=Math.max(i,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=eu.DAY)T(new Date(u),true)||(s=s||u>r&&u<a,u<o&&(!l||u>l)?l=u:u>o&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach((function(t){var r=t.dateObj.getTime(),a=l>0&&r<l||c>0&&r>c;if(a)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach((function(e){t.classList.remove(e);}));s&&!a||(["startRange","inRange","endRange","notAllowed"].forEach((function(e){t.classList.remove(e);})),void 0!==e&&(e.classList.add(i<=n.selectedDates[0].getTime()?"startRange":"endRange"),o<i&&r===o?t.classList.add("startRange"):o>i&&r===o&&t.classList.add("endRange"),r>=l&&(0===c||r<=c)&&Qc(r,o,i)&&t.classList.add("inRange")));}));}}function L(){!n.isOpen||n.config.static||n.config.inline||H();}function B(e){return function(t){var i=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),o=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==i&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=i.getHours()>0||i.getMinutes()>0||i.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter((function(e){return T(e)})),n.selectedDates.length||"min"!==e||l(i),Z()),n.daysContainer&&(z(),void 0!==i?n.currentYearElement[e]=i.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!o&&void 0!==i&&o.getFullYear()===i.getFullYear());}}function R(){return n.config.wrap?e.querySelector("[data-input]"):e}function j(){"object"!=typeof n.config.locale&&void 0===su.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=nu(nu({},su.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?su.l10ns[n.config.locale]:void 0),Wc.D="("+n.l10n.weekdays.shorthand.join("|")+")",Wc.l="("+n.l10n.weekdays.longhand.join("|")+")",Wc.M="("+n.l10n.months.shorthand.join("|")+")",Wc.F="("+n.l10n.months.longhand.join("|")+")",Wc.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===nu(nu({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===su.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=qc(n),n.parseDate=Kc({config:n.config,l10n:n.l10n});}function H(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){q("onPreCalendarPosition");var t=e||n._positionElement,i=Array.prototype.reduce.call(n.calendarContainer.children,(function(e,t){return e+t.offsetHeight}),0),o=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<i&&l.top>i,d=window.pageYOffset+l.top+(u?-i-2:t.offsetHeight+2);if(Bc(n.calendarContainer,"arrowTop",!u),Bc(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,h=false;"center"===s?(f-=(o-l.width)/2,m=true):"right"===s&&(f-=o-l.width,h=true),Bc(n.calendarContainer,"arrowLeft",!m&&!h),Bc(n.calendarContainer,"arrowCenter",m),Bc(n.calendarContainer,"arrowRight",h);var p=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+o>window.document.body.offsetWidth,v=p+o>window.document.body.offsetWidth;if(Bc(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(i=document.createElement("style"),document.head.appendChild(i),i.sheet);var i;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-o/2),k=y.cssRules.length,C="{left:"+l.left+"px;right:auto;}";Bc(n.calendarContainer,"rightMost",false),Bc(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+C,k),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=p+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function z(){n.config.noCalendar||n.isMobile||(C(),Q(),k());}function $(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=Hc($c(e),(function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")}));if(void 0!==t){var i=t,o=n.latestSelectedDateObj=new Date(i.dateObj.getTime()),r=(o.getMonth()<n.currentMonth||o.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=i,"single"===n.config.mode)n.selectedDates=[o];else if("multiple"===n.config.mode){var a=G(o);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(o);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=o,n.selectedDates.push(o),0!==Gc(o,n.selectedDates[0],true)&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()})));if(s(),r){var l=n.currentYear!==o.getFullYear();n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth(),l&&(q("onYearChange"),C()),q("onMonthChange");}if(Q(),k(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(i),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&$();}f();}}n.parseDate=Kc({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=H,n.changeMonth=E,n.changeYear=M,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var i=tu(n.config);c(i.hours,i.minutes,i.seconds);}n.redraw(),e&&q("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));q("onClose");},n.onMouseOver=F,n._createElement=Rc,n.createDay=g,n.destroy=function(){ void 0!==n.config&&q("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach((function(e){try{delete n[e];}catch(e){}}));},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var i=$c(e);i&&i.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void q("onOpen")}if(n._input.disabled||n.config.inline)return;var o=n.isOpen;n.isOpen=true,o||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),q("onOpen"),H(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout((function(){return n.hourElement.select()}),50));},n.redraw=z,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var i in Object.assign(n.config,e),e) void 0!==Y[i]&&Y[i].forEach((function(e){return e()}));else n.config[e]=t,void 0!==Y[e]?Y[e].forEach((function(e){return e()})):Mc.indexOf(e)>-1&&(n.config[e]=Lc(t));n.redraw(),Z(true);},n.setDate=function(e,t,i){ void 0===t&&(t=false);void 0===i&&(i=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);U(e,i),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&q("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var Y={locale:[j,D],showMonths:[x,r,S],minDate:[m],maxDate:[m],positionElement:[J],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function U(e,t){var i=[];if(e instanceof Array)i=e.map((function(e){return n.parseDate(e,t)}));else if(e instanceof Date||"number"==typeof e)i=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":i=[n.parseDate(e,t)];break;case "multiple":i=e.split(n.config.conjunction).map((function(e){return n.parseDate(e,t)}));break;case "range":i=e.split(n.l10n.rangeSeparator).map((function(e){return n.parseDate(e,t)}));}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?i:i.filter((function(e){return e instanceof Date&&T(e,false)})),"range"===n.config.mode&&n.selectedDates.sort((function(e,t){return e.getTime()-t.getTime()}));}function W(e){return e.slice().map((function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e})).filter((function(e){return e}))}function J(){n._positionElement=n.config.positionElement||n._input;}function q(e,t){if(void 0!==n.config){var i=n.config[e];if(void 0!==i&&i.length>0)for(var o=0;i[o]&&o<i.length;o++)i[o](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(K("change")),n.input.dispatchEvent(K("input")));}}function K(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var i=n.selectedDates[t];if(i instanceof Date&&0===Gc(i,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach((function(e,t){var i=new Date(n.currentYear,n.currentMonth,1);i.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=Yc(i.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=i.getMonth().toString(),e.value=i.getFullYear().toString();})),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map((function(e){return n.formatDate(e,t)})).filter((function(e,t,i){return "range"!==n.config.mode||n.config.enableTime||i.indexOf(e)===t})).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&q("onValueUpdate");}function ee(e){var t=$c(e),i=n.prevMonthNav.contains(t),o=n.nextMonthNav.contains(t);i||o?E(i?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var i=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=nu(nu({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=W(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=W(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=su.defaultConfig.dateFormat||Tc.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=su.defaultConfig.altFormat||Tc.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:B("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:B("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<i.length;d++)n.config[i[d]]=true===n.config[i[d]]||"true"===n.config[i[d]];Mc.filter((function(e){return void 0!==n.config[e]})).forEach((function(e){n.config[e]=Lc(n.config[e]||[]).map(o);})),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Mc.indexOf(m)>-1?n.config[m]=Lc(f[m]).map(o).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=R().className+" "+n.config.altInputClass);q("onParseConfig");}(),j(),function(){if(n.input=R(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=Rc(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");J();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&U(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=Rc("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=Rc("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=Rc("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=Rc("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,x(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Bc(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Bc(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=Rc("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=Rc("div","flatpickr-weekwrapper");e.appendChild(Rc("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=Rc("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),i=t.weekWrapper,o=t.weekNumbers;n.innerContainer.appendChild(i),n.weekNumbers=o,n.weekWrapper=i;}n.rContainer=Rc("div","flatpickr-rContainer"),n.rContainer.appendChild(S()),n.daysContainer||(n.daysContainer=Rc("div","flatpickr-days"),n.daysContainer.tabIndex=-1),k(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=tu(n.config);n.timeContainer=Rc("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=Rc("span","flatpickr-time-separator",":"),i=zc("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=i.getElementsByTagName("input")[0];var o=zc("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=o.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(i),n.timeContainer.appendChild(t),n.timeContainer.appendChild(o),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=zc("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=_c(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(Rc("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=Rc("span","flatpickr-am-pm",n.l10n.amPM[Oc((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Bc(n.calendarContainer,"rangeMode","range"===n.config.mode),Bc(n.calendarContainer,"animate",true===n.config.animate),Bc(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=Rc("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach((function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),(function(t){return d(t,"click",n[e])}));}));if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=Rc("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",(function(e){n.setDate($c(e).value,false,n.mobileFormatStr),q("onChange"),q("onClose");}));}();var e=Fc(L,50);n._debouncedChange=Fc(f,ou),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",(function(e){"range"===n.config.mode&&F($c(e));}));d(n._input,"keydown",O),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",O);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",A):d(window.document,"mousedown",A);d(window.document,"focus",A,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return $c(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",h),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",(function(){return n.secondElement&&n.secondElement.select()})),void 0!==n.amPM&&d(n.amPM,"click",(function(e){a(e);}));}n.config.allowInput&&d(n._input,"blur",_);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var i=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&i&&H(),q("onReady");}(),n}function au(e,t){for(var n=Array.prototype.slice.call(e).filter((function(e){return e instanceof HTMLElement})),i=[],o=0;o<n.length;o++){var r=n[o];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=ru(r,t||{}),i.push(r._flatpickr);}catch(e){console.error(e);}}return 1===i.length?i[0]:i}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return au(this,e)},HTMLElement.prototype.flatpickr=function(e){return au([this],e)});var su=function(e,t){return "string"==typeof e?au(window.document.querySelectorAll(e),t):e instanceof Node?au([e],t):au(e,t)};su.defaultConfig={},su.l10ns={en:nu({},Pc),default:nu({},Pc)},su.localize=function(e){su.l10ns.default=nu(nu({},su.l10ns.default),e);},su.setDefaults=function(e){su.defaultConfig=nu(nu({},su.defaultConfig),e);},su.parseDate=Kc({}),su.formatDate=qc({}),su.compareDates=Gc,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return au(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=su);const lu=["onCreate","onDestroy"],cu=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],uu=t=>{const n=reactExports.useMemo((()=>({...t})),[t]),{defaultValue:i,options:o={},value:a,children:s,render:l}=n,f=reactExports.useMemo((()=>((e,t)=>(cu.forEach((n=>{const i=t[n],o=e[n];if(i){o&&!Array.isArray(o)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(i)?i:[i];0===e[n].length?e[n]=t:e[n].push(...t);}})),cu.forEach((e=>{delete t[e];})),lu.forEach((e=>{delete t[e];})),e))(o,n)),[o,n]),m=reactExports.useRef(null),p=reactExports.useRef(void 0);reactExports.useImperativeHandle(t.ref,(()=>({get flatpickr(){return p.current}})),[]),reactExports.useEffect((()=>{var e;if(f.onClose=f.onClose||(()=>{var e;null!=(e=m.current)&&e.blur&&m.current.blur();}),p.current=((null==(n=su)?void 0:n.default)||su)(m.current,f),p.current&&void 0!==a&&p.current.setDate(a,false),t.onCreate&&t.onCreate(p.current),p.current){const t=Object.getOwnPropertyNames(f);for(let n=t.length-1;n>=0;n--){const i=t[n];let o=f[i];(null==o?void 0:o.toString())!==(null==(e=p.current.config[i])?void 0:e.toString())&&(cu.includes(i)&&!Array.isArray(o)&&(o=[o]),p.current.set(i,o));} void 0!==a&&a!==p.current.input.value&&p.current.setDate(a,false);}var n;return ()=>{t.onDestroy&&t.onDestroy(p.current),p.current&&p.current.destroy(),p.current=void 0;}}),[f,o,n,a,t]);const g=reactExports.useCallback((e=>{m.current=e;}),[]);if(l)return l({...n,defaultValue:i,value:a},g);const v=reactExports.useCallback((e=>{var n,i;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach((()=>[new Date(e.target.value)]),(null==a?void 0:a.toString())||""):"function"==typeof t.onChange&&(null==(i=null==t?void 0:t.onChange)||i.call(t,[new Date(e.target.value)],(null==a?void 0:a.toString())||"",p.current)));}),[t,a]);return o.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:g,children:s}):jsxRuntimeExports.jsx("input",{onChange:v,...n,value:null==a?void 0:a.toString(),defaultValue:i,ref:g})},du="T42.GD.Execute",fu=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],mu=(e,t)=>e in t;function hu({time:e,frequency:t,day:n}){const i=new Date(`01/01/2000 ${e}`),o=i.getMinutes(),r=i.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!mu(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${o} ${r} * * ${a}`}function pu(e){const t=reactExports.useContext(IOConnectContext),{value:n,update:i}=zr({prefKey:gu(e)}),{value:o,update:a}=zr({prefKey:gu(e,"Time")}),{value:l,update:c}=zr({prefKey:gu(e,"Frequency")}),{value:d,update:f}=zr({prefKey:gu(e,"Day")}),m=reactExports.useCallback((async()=>{try{await t.interop.invoke(du,{command:`cancel-${e}`});}catch(e){console.error(e);}}),[t,e]),h=reactExports.useCallback((async()=>{try{const n=hu({time:o??"12:00 AM",frequency:l??"daily",day:"weekly"===l?d:"*"});await t.interop.invoke(du,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}}),[t,e,o,l,d]);reactExports.useEffect((()=>{t&&n&&h();}),[t,n,h]);return {enabled:n??false,time:o??"12:00 AM",frequency:l??"daily",day:d??"Monday",setEnabled:async e=>{e||await m();try{await i(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await a(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await f(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,fu.includes(t))try{await f(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function gu(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function vu({className:n,variant:i,...o}){const r=k("io-block-list-gap",i,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=pu(i);return jsxRuntimeExports.jsxs(I,{className:r,...o,children:[jsxRuntimeExports.jsx(Ri,{label:`Schedule ${i}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(C,{variant:"clock"}),jsxRuntimeExports.jsx(uu,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(xi,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(xi.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(xi,{text:c,icon:"chevron-down",iconRight:true,children:fu.map((t=>jsxRuntimeExports.jsx(xi.Item,{onClick:()=>m(t),children:t},t)))})]})]})}function yu({className:t,...n}){return jsxRuntimeExports.jsx(vu,{...n,className:t,variant:"restart"})}function wu({className:t,...n}){return jsxRuntimeExports.jsx(vu,{...n,className:t,variant:"shutdown"})}const bu={Body:uc,General:dc,Theme:mc,PinnedPosition:pc,AllowDocking:vc,MinimizeToTray:yc,AutoClose:wc,ShowTutorialOnStartup:bc,Layouts:kc,LayoutsRestoreLastSaved:Cc,LayoutsSaveCurrentOnExit:Nc,LayoutsShowUnsavedChangesPrompt:xc,LayoutsShowDeletePrompt:Sc,Downloads:Dc,DownloadsAskForEachDownload:Ec,DownloadsLocation:Ic,System:Ac,SystemRestartSection:yu,SystemShutdownSection:wu},ku=reactExports.createContext(bu),Cu=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...bu,...n})),[n]);return jsxRuntimeExports.jsx(ku.Provider,{value:i,children:t})}));Cu.displayName="PreferencesPanelComponentsStoreProvider";const Nu=()=>reactExports.useContext(ku);const Eu=n=>{const{General:i,Layouts:o,Widget:r}=Fu();return jsxRuntimeExports.jsxs(Ii,{...n,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{})]})},Iu=({className:t,title:n="General",...i})=>{const{Theme:o}=Fu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Au=({className:n,title:i="Layouts",...o})=>{const{LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Fu();return jsxRuntimeExports.jsxs(I,{className:k("io-block io-block-list-gap",n),title:i,...o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},Mu=({className:t,title:n="Widget",...i})=>{const{WidgetEnableForExternalApps:o}=Fu();return jsxRuntimeExports.jsx(I,{className:k("io-block io-block-list-gap",t),title:n,...i,children:jsxRuntimeExports.jsx(o,{})})},Tu=({align:t="right",label:n="Enable for external apps",...i})=>jsxRuntimeExports.jsx(gc,{align:t,label:n,prefKey:uo,...i}),Pu={Body:Eu,General:Iu,Theme:mc,Layouts:Au,LayoutsShowUnsavedChangesPrompt:xc,LayoutsShowDeletePrompt:Sc,Widget:Mu,WidgetEnableForExternalApps:Tu},_u=reactExports.createContext(Pu),Ou=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...Pu,...n})),[n]);return jsxRuntimeExports.jsx(_u.Provider,{value:i,children:t})}));Ou.displayName="PreferencesPanelComponentsStoreProvider";const Fu=()=>reactExports.useContext(_u);const Ru=({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:i,isButtonDisabled:o,onButtonClick:r})=>jsxRuntimeExports.jsx(V,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map(((t,a)=>{const{id:s,text:l,variant:c}=t,u=i(s);return jsxRuntimeExports.jsx(A,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:o(s),onClick:()=>r(t),variant:c,children:l},s)}))}),ju=({actionButtons:n,children:i,onCompletion:o,size:r,title:a=(Ji()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]})=>{const{actionButtonElementsRefs:u,autofocusButtonId:m,hasAutofocusButtonLostInitialFocus:h}=(e=>{const t=reactExports.useRef([]),n=reactExports.useMemo((()=>e.find((e=>e.autofocus))?.id??null),[e]),i=reactExports.useRef(n),[o,r]=reactExports.useState(!i.current);return reactExports.useLayoutEffect((()=>{if(o)return;if(n!==i.current)return void r(true);const e=t.current.find((e=>e?.id===n));if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}}),[n,o]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:o}})(n),p=()=>{o({isClosed:true});},g={...r};return jsxRuntimeExports.jsxs(K,{className:"io-dialog-template",closeFn:p,isOpen:true,onCancel:e=>{e.preventDefault(),p();},onKeyDown:e=>{!(e=>"Enter"===e.key||" "===e.key)(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||o({isEnterPressed:true});},style:g,title:a,children:[jsxRuntimeExports.jsx(K.Body,{children:i}),jsxRuntimeExports.jsx(K.Footer,{children:jsxRuntimeExports.jsx(Ru,{actionButtonElementsRefs:u,actionButtons:n,isAutofocusButton:e=>m===e&&!h,isButtonDisabled:e=>s.some((t=>t.disabledButtonIds.some((t=>t===e)))),onButtonClick:({id:e,text:t})=>{o({responseButtonClicked:{id:e,text:t}});}})})]})},Hu=({children:t})=>jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t});var zu=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,text:s,title:l}=o;return jsxRuntimeExports.jsx(ju,{actionButtons:r,onCompletion:n,size:i,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Hu,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:a,checkbox:s,heading:c,text:u,title:d}=o,[f,m]=reactExports.useState(s.initialValue),h=reactExports.useCallback((()=>m((e=>!e))),[]),p=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(ju,{actionButtons:a,onCompletion:e=>n({...e,inputs:p}),size:i,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Hu,{children:c}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(Li,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:h})]})},SingleTextInputDialog:({onCompletion:n,size:i,variables:o})=>{const{actionButtons:r,heading:a,input:s,title:c}=o,[u,m]=reactExports.useState(s.initialValue??""),h=reactExports.useRef(null),p=(g=u,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:u}];return reactExports.useLayoutEffect((()=>{h.current?.select();}),[]),jsxRuntimeExports.jsxs(ju,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:i,title:c,validationErrors:p?[p]:[],children:[jsxRuntimeExports.jsx(Hu,{children:a}),jsxRuntimeExports.jsx(Oi,{"data-testid":`io-dialog-input-${s.id}`,ref:h,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:p?.message,id:s.id,label:s.label,name:s.id,onChange:e=>m(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}});const $u=({name:n,value:i})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:i})]}),Vu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("div",{className:k("io-profile-section-body",n),children:[o&&jsxRuntimeExports.jsx(E,{className:"io-profile-section-title",text:o}),i.map((({name:t,value:n})=>jsxRuntimeExports.jsx($u,{name:t,value:n},t)))]}),Yu=({className:n,items:i,title:o})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",n),children:[jsxRuntimeExports.jsx(Vu,{items:i,title:o}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),Uu=({title:t="License",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),Wu=({title:t="Version",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),Ju=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(Yu,{title:t,...n}),qu=({className:n})=>{const i=Ji()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:k("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:i}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[i,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},Ku=({avatarInitials:n=(Ji()?"CD":"CB"),className:i,items:o,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:k("io-profile-section",i),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(Vu,{className:"mt-12",items:o,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(Ni,{className:"mt-8"})]}),Gu={LicenseSection:Uu,ProductsInfoSection:Wu,PluginsSection:Ju,Trademark:qu,UserSection:Ku},Qu=reactExports.createContext(Gu),Xu=reactExports.memo((({children:t,components:n})=>{const i=reactExports.useMemo((()=>({...Gu,...n})),[n]);return jsxRuntimeExports.jsx(Qu.Provider,{value:i,children:t})}));Xu.displayName="ProfilePanelComponentsStoreProvider";

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

var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

const Actions = ({ actions, onActionClick }) => {
    return (React.createElement(V, { "data-testid": "io-alert-action-buttons-group" }, actions.map((action) => (React.createElement(A, { "data-testid": `io-alert-action-button-${action.id}`, key: action.id, onClick: (event) => onActionClick(event, action) }, action.title)))));
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
    const actions = !!data.config.actions?.length && (React.createElement(Actions, { actions: data.config.actions, onActionClick: (event, action) => {
            event.stopPropagation();
            const interopAction = {
                name: action.title,
                settings: action.clickInterop,
            };
            onClick({ interopAction, shouldCloseAlert: true });
        } }));
    return (React.createElement(S, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
};

const Alerts = ({ Alert = DefaultAlert, messagePort }) => {
    const [data, setData] = reactExports.useState(null);
    reactExports.useEffect(() => {
        const unsubscribe = messagePort.subscribe(({ data }) => {
            setData(data);
        });
        return unsubscribe;
    }, [messagePort]);
    return data ? (React.createElement(Alert, { data: data, onClick: ({ interopAction, shouldCloseAlert }) => {
            messagePort.postMessage({
                id: data.id,
                interopAction,
                shouldCloseAlert,
            });
        } })) : null;
};

const Dialogs = ({ messagePort, templates }) => {
    const [data, setData] = reactExports.useState(null);
    reactExports.useEffect(() => {
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
    return data ? (React.createElement(data.Dialog, { onCompletion: (response) => messagePort.postMessage({ id: data.id, response }), size: data.config.size, variables: data.config.variables })) : null;
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
        this.appendToDOM(this.alertsContainerId, React.createElement(Alerts, { messagePort: this.alertsMessagePort, Alert: this.alertsComponents?.Alert }));
    }
    appendDialogs() {
        this.appendToDOM(this.dialogsContainerId, React.createElement(Dialogs, { messagePort: this.dialogsMessagePort, templates: this.dialogTemplates }));
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
//# sourceMappingURL=io-browser-modals-ui.es.js.map
