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
var l$1=Symbol.for("react.element"),n$1=Symbol.for("react.portal"),p$2=Symbol.for("react.fragment"),q$2=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v$1=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x$1=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z$2=Symbol.iterator;function A$2(a){if(null===a||"object"!==typeof a)return null;a=z$2&&a[z$2]||a["@@iterator"];return "function"===typeof a?a:null}
var B$2={isMounted:function(){return  false},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C$2=Object.assign,D$2={};function E$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}E$2.prototype.isReactComponent={};
E$2.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState");};E$2.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F$1(){}F$1.prototype=E$2.prototype;function G$2(a,b,e){this.props=a;this.context=b;this.refs=D$2;this.updater=e||B$2;}var H$2=G$2.prototype=new F$1;
H$2.constructor=G$2;C$2(H$2,E$2.prototype);H$2.isPureReactComponent=true;var I$2=Array.isArray,J$1=Object.prototype.hasOwnProperty,K$2={current:null},L$2={key:true,ref:true,__self:true,__source:true};
function M$2(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J$1.call(b,d)&&!L$2.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f;}if(a&&a.defaultProps)for(d in g=a.defaultProps,g) void 0===c[d]&&(c[d]=g[d]);return {$$typeof:l$1,type:a,key:k,ref:h,props:c,_owner:K$2.current}}
function N$2(a,b){return {$$typeof:l$1,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O$2(a){return "object"===typeof a&&null!==a&&a.$$typeof===l$1}function escape(a){var b={"=":"=0",":":"=2"};return "$"+a.replace(/[=:]/g,function(a){return b[a]})}var P$2=/\/+/g;function Q$2(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R$2(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=false;if(null===a)h=true;else switch(k){case "string":case "number":h=true;break;case "object":switch(a.$$typeof){case l$1:case n$1:h=true;}}if(h)return h=a,c=c(h),a=""===d?"."+Q$2(h,0):d,I$2(c)?(e="",null!=a&&(e=a.replace(P$2,"$&/")+"/"),R$2(c,b,e,"",function(a){return a})):null!=c&&(O$2(c)&&(c=N$2(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P$2,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I$2(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q$2(k,g);h+=R$2(k,b,e,f,c);}else if(f=A$2(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q$2(k,g++),h+=R$2(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S$2(a,b,e){if(null==a)return a;var d=[],c=0;R$2(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T$2(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b;},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b;});-1===a._status&&(a._status=0,a._result=b);}if(1===a._status)return a._result.default;throw a._result;}
var U$2={current:null},V$2={transition:null},W$2={ReactCurrentDispatcher:U$2,ReactCurrentBatchConfig:V$2,ReactCurrentOwner:K$2};function X$2(){throw Error("act(...) is not supported in production builds of React.");}
react_production_min.Children={map:S$2,forEach:function(a,b,e){S$2(a,function(){b.apply(this,arguments);},e);},count:function(a){var b=0;S$2(a,function(){b++;});return b},toArray:function(a){return S$2(a,function(a){return a})||[]},only:function(a){if(!O$2(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E$2;react_production_min.Fragment=p$2;react_production_min.Profiler=r;react_production_min.PureComponent=G$2;react_production_min.StrictMode=q$2;react_production_min.Suspense=w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W$2;react_production_min.act=X$2;
react_production_min.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C$2({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){ void 0!==b.ref&&(k=b.ref,h=K$2.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J$1.call(b,f)&&!L$2.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f]);}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
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
var aa$1=reactExports,ca$1=schedulerExports;function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da$1=new Set,ea$1={};function fa$1(a,b){ha$1(a,b);ha$1(a+"Capture",b);}
function ha$1(a,b){ea$1[a]=b;for(a=0;a<b.length;a++)da$1.add(b[a]);}
var ia$1=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja$1=Object.prototype.hasOwnProperty,ka$1=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la$1=
{},ma$1={};function oa$1(a){if(ja$1.call(ma$1,a))return  true;if(ja$1.call(la$1,a))return  false;if(ka$1.test(a))return ma$1[a]=true;la$1[a]=true;return  false}function pa$1(a,b,c,d){if(null!==c&&0===c.type)return  false;switch(typeof b){case "function":case "symbol":return  true;case "boolean":if(d)return  false;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return  false}}
function qa$1(a,b,c,d){if(null===b||"undefined"===typeof b||pa$1(a,b,c,d))return  true;if(d)return  false;if(null!==c)switch(c.type){case 3:return !b;case 4:return  false===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return  false}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g;}var z$1={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z$1[a]=new v(a,0,false,a,null,false,false);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z$1[b]=new v(b,1,false,a[1],null,false,false);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z$1[a]=new v(a,2,false,a.toLowerCase(),null,false,false);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z$1[a]=new v(a,2,false,a,null,false,false);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z$1[a]=new v(a,3,false,a.toLowerCase(),null,false,false);});
["checked","multiple","muted","selected"].forEach(function(a){z$1[a]=new v(a,3,true,a,null,false,false);});["capture","download"].forEach(function(a){z$1[a]=new v(a,4,false,a,null,false,false);});["cols","rows","size","span"].forEach(function(a){z$1[a]=new v(a,6,false,a,null,false,false);});["rowSpan","start"].forEach(function(a){z$1[a]=new v(a,5,false,a.toLowerCase(),null,false,false);});var ra$1=/[\-:]([a-z])/g;function sa$1(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra$1,
sa$1);z$1[b]=new v(b,1,false,a,null,false,false);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,false,a,"http://www.w3.org/1999/xlink",false,false);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra$1,sa$1);z$1[b]=new v(b,1,false,a,"http://www.w3.org/XML/1998/namespace",false,false);});["tabIndex","crossOrigin"].forEach(function(a){z$1[a]=new v(a,1,false,a.toLowerCase(),null,false,false);});
z$1.xlinkHref=new v("xlinkHref",1,false,"xlink:href","http://www.w3.org/1999/xlink",true,false);["src","href","action","formAction"].forEach(function(a){z$1[a]=new v(a,1,false,a.toLowerCase(),null,true,true);});
function ta$1(a,b,c,d){var e=z$1.hasOwnProperty(b)?z$1[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa$1(b,c,e,d)&&(c=null),d||null===e?oa$1(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?false:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&true===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)));}
var ua$1=aa$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va$1=Symbol.for("react.element"),wa$1=Symbol.for("react.portal"),ya$1=Symbol.for("react.fragment"),za$1=Symbol.for("react.strict_mode"),Aa$1=Symbol.for("react.profiler"),Ba$1=Symbol.for("react.provider"),Ca$1=Symbol.for("react.context"),Da$1=Symbol.for("react.forward_ref"),Ea$1=Symbol.for("react.suspense"),Fa$1=Symbol.for("react.suspense_list"),Ga$1=Symbol.for("react.memo"),Ha$1=Symbol.for("react.lazy");var Ia$1=Symbol.for("react.offscreen");var Ja$1=Symbol.iterator;function Ka$1(a){if(null===a||"object"!==typeof a)return null;a=Ja$1&&a[Ja$1]||a["@@iterator"];return "function"===typeof a?a:null}var A$1=Object.assign,La$1;function Ma$1(a){if(void 0===La$1)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La$1=b&&b[1]||"";}return "\n"+La$1+a}var Na$1=false;
function Oa$1(a,b){if(!a||Na$1)return "";Na$1=true;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[]);}catch(l){var d=l;}Reflect.construct(a,[],b);}else {try{b.call();}catch(l){d=l;}a.call(b.prototype);}else {try{throw Error();}catch(l){d=l;}a();}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na$1=false,Error.prepareStackTrace=c;}return (a=a?a.displayName||a.name:"")?Ma$1(a):""}
function Pa$1(a){switch(a.tag){case 5:return Ma$1(a.type);case 16:return Ma$1("Lazy");case 13:return Ma$1("Suspense");case 19:return Ma$1("SuspenseList");case 0:case 2:case 15:return a=Oa$1(a.type,false),a;case 11:return a=Oa$1(a.type.render,false),a;case 1:return a=Oa$1(a.type,true),a;default:return ""}}
function Qa$1(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya$1:return "Fragment";case wa$1:return "Portal";case Aa$1:return "Profiler";case za$1:return "StrictMode";case Ea$1:return "Suspense";case Fa$1:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca$1:return (a.displayName||"Context")+".Consumer";case Ba$1:return (a._context.displayName||"Context")+".Provider";case Da$1:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga$1:return b=a.displayName||null,null!==b?b:Qa$1(a.type)||"Memo";case Ha$1:b=a._payload;a=a._init;try{return Qa$1(a(b))}catch(c){}}return null}
function Ra$1(a){var b=a.type;switch(a.tag){case 24:return "Cache";case 9:return (b.displayName||"Context")+".Consumer";case 10:return (b._context.displayName||"Context")+".Provider";case 18:return "DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return "Fragment";case 5:return b;case 4:return "Portal";case 3:return "Root";case 6:return "Text";case 16:return Qa$1(b);case 8:return b===za$1?"StrictMode":"Mode";case 22:return "Offscreen";
case 12:return "Profiler";case 21:return "Scope";case 13:return "Suspense";case 19:return "SuspenseList";case 25:return "TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa$1(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return ""}}
function Ta$1(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua$1(a){var b=Ta$1(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:true,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
null;delete a[b];}}}}function Va$1(a){a._valueTracker||(a._valueTracker=Ua$1(a));}function Wa$1(a){if(!a)return  false;var b=a._valueTracker;if(!b)return  true;var c=b.getValue();var d="";a&&(d=Ta$1(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),true):false}function Xa$1(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
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
var ac$1=ca$1.unstable_scheduleCallback,bc$1=ca$1.unstable_cancelCallback,cc$1=ca$1.unstable_shouldYield,dc$1=ca$1.unstable_requestPaint,B$1=ca$1.unstable_now,ec$1=ca$1.unstable_getCurrentPriorityLevel,fc$1=ca$1.unstable_ImmediatePriority,gc$1=ca$1.unstable_UserBlockingPriority,hc$1=ca$1.unstable_NormalPriority,ic$1=ca$1.unstable_LowPriority,jc$1=ca$1.unstable_IdlePriority,kc$1=null,lc$1=null;function mc$1(a){if(lc$1&&"function"===typeof lc$1.onCommitFiberRoot)try{lc$1.onCommitFiberRoot(kc$1,a,void 0,128===(a.current.flags&128));}catch(b){}}
var oc$1=Math.clz32?Math.clz32:nc$1,pc$1=Math.log,qc$1=Math.LN2;function nc$1(a){a>>>=0;return 0===a?32:31-(pc$1(a)/qc$1|0)|0}var rc$1=64,sc$1=4194304;
function tc$1(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc$1(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc$1(h):(f&=g,0!==f&&(d=tc$1(f)));}else g=c&~e,0!==g?d=tc$1(g):0!==f&&(d=tc$1(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc$1(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc$1(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return  -1;case 134217728:case 268435456:case 536870912:case 1073741824:return  -1;default:return  -1}}
function wc$1(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc$1(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc$1(h,b);}else k<=b&&(a.expiredLanes|=h);f&=~h;}}function xc$1(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc$1(){var a=rc$1;rc$1<<=1;0===(rc$1&4194240)&&(rc$1=64);return a}function zc$1(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac$1(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc$1(b);a[b]=c;}function Bc$1(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc$1(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f;}}
function Cc$1(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc$1(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e;}}var C$1=0;function Dc$1(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec$1,Fc$1,Gc$1,Hc$1,Ic$1,Jc$1=false,Kc$1=[],Lc$1=null,Mc$1=null,Nc$1=null,Oc$1=new Map,Pc$1=new Map,Qc$1=[],Rc$1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc$1(a,b){switch(a){case "focusin":case "focusout":Lc$1=null;break;case "dragenter":case "dragleave":Mc$1=null;break;case "mouseover":case "mouseout":Nc$1=null;break;case "pointerover":case "pointerout":Oc$1.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc$1.delete(b.pointerId);}}
function Tc$1(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc$1(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc$1(a,b,c,d,e){switch(b){case "focusin":return Lc$1=Tc$1(Lc$1,a,b,c,d,e),true;case "dragenter":return Mc$1=Tc$1(Mc$1,a,b,c,d,e),true;case "mouseover":return Nc$1=Tc$1(Nc$1,a,b,c,d,e),true;case "pointerover":var f=e.pointerId;Oc$1.set(f,Tc$1(Oc$1.get(f)||null,a,b,c,d,e));return  true;case "gotpointercapture":return f=e.pointerId,Pc$1.set(f,Tc$1(Pc$1.get(f)||null,a,b,c,d,e)),true}return  false}
function Vc$1(a){var b=Wc$1(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic$1(a.priority,function(){Gc$1(c);});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null;}
function Xc$1(a){if(null!==a.blockedOn)return  false;for(var b=a.targetContainers;0<b.length;){var c=Yc$1(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null;}else return b=Cb(c),null!==b&&Fc$1(b),a.blockedOn=c,false;b.shift();}return  true}function Zc$1(a,b,c){Xc$1(a)&&c.delete(b);}function $c$1(){Jc$1=false;null!==Lc$1&&Xc$1(Lc$1)&&(Lc$1=null);null!==Mc$1&&Xc$1(Mc$1)&&(Mc$1=null);null!==Nc$1&&Xc$1(Nc$1)&&(Nc$1=null);Oc$1.forEach(Zc$1);Pc$1.forEach(Zc$1);}
function ad$1(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc$1||(Jc$1=true,ca$1.unstable_scheduleCallback(ca$1.unstable_NormalPriority,$c$1)));}
function bd$1(a){function b(b){return ad$1(b,a)}if(0<Kc$1.length){ad$1(Kc$1[0],a);for(var c=1;c<Kc$1.length;c++){var d=Kc$1[c];d.blockedOn===a&&(d.blockedOn=null);}}null!==Lc$1&&ad$1(Lc$1,a);null!==Mc$1&&ad$1(Mc$1,a);null!==Nc$1&&ad$1(Nc$1,a);Oc$1.forEach(b);Pc$1.forEach(b);for(c=0;c<Qc$1.length;c++)d=Qc$1[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc$1.length&&(c=Qc$1[0],null===c.blockedOn);)Vc$1(c),null===c.blockedOn&&Qc$1.shift();}var cd$1=ua$1.ReactCurrentBatchConfig,dd=true;
function ed$1(a,b,c,d){var e=C$1,f=cd$1.transition;cd$1.transition=null;try{C$1=1,fd$1(a,b,c,d);}finally{C$1=e,cd$1.transition=f;}}function gd$1(a,b,c,d){var e=C$1,f=cd$1.transition;cd$1.transition=null;try{C$1=4,fd$1(a,b,c,d);}finally{C$1=e,cd$1.transition=f;}}
function fd$1(a,b,c,d){if(dd){var e=Yc$1(a,b,c,d);if(null===e)hd$1(a,b,d,id,c),Sc$1(a,d);else if(Uc$1(e,a,b,c,d))d.stopPropagation();else if(Sc$1(a,d),b&4&&-1<Rc$1.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec$1(f);f=Yc$1(a,b,c,d);null===f&&hd$1(a,b,d,id,c);if(f===e)break;e=f;}null!==e&&d.stopPropagation();}else hd$1(a,b,d,null,c);}}var id=null;
function Yc$1(a,b,c,d){id=null;a=xb(d);a=Wc$1(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null;}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null;}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec$1()){case fc$1:return 1;case gc$1:return 4;case hc$1:case ic$1:return 16;case jc$1:return 536870912;default:return 16}default:return 16}}var kd$1=null,ld=null,md$1=null;function nd$1(){if(md$1)return md$1;var a,b=ld,c=b.length,d,e="value"in kd$1?kd$1.value:kd$1.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md$1=e.slice(a,1<d?1-d:void 0)}
function od$1(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd$1(){return  true}function qd$1(){return  false}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:false===f.returnValue)?pd$1:qd$1;this.isPropagationStopped=qd$1;return this}A$1(b.prototype,{preventDefault:function(){this.defaultPrevented=true;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=false),this.isDefaultPrevented=pd$1);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=true),this.isPropagationStopped=pd$1);},persist:function(){},isPersistent:pd$1});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td$1=rd(sd),ud=A$1({},sd,{view:0,detail:0}),vd$1=rd(ud),wd$1,xd$1,yd$1,Ad$1=A$1({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd$1&&(yd$1&&"mousemove"===a.type?(wd$1=a.screenX-yd$1.screenX,xd$1=a.screenY-yd$1.screenY):xd$1=wd$1=0,yd$1=a);return wd$1},movementY:function(a){return "movementY"in a?a.movementY:xd$1}}),Bd$1=rd(Ad$1),Cd$1=A$1({},Ad$1,{dataTransfer:0}),Dd$1=rd(Cd$1),Ed$1=A$1({},ud,{relatedTarget:0}),Fd=rd(Ed$1),Gd$1=A$1({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd$1),Id$1=A$1({},sd,{clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd$1=rd(Id$1),Kd$1=A$1({},sd,{data:0}),Ld=rd(Kd$1),Md$1={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd$1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od$1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd$1(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od$1[a])?!!b[a]:false}function zd(){return Pd$1}
var Qd$1=A$1({},ud,{key:function(a){if(a.key){var b=Md$1[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=od$1(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd$1[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return "keypress"===a.type?od$1(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===
a.type?od$1(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd$1),Sd$1=A$1({},Ad$1,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td$1=rd(Sd$1),Ud$1=A$1({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud$1),Wd$1=A$1({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd$1=rd(Wd$1),Yd$1=A$1({},Ad$1,{deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd$1=rd(Yd$1),$d=[9,13,27,32],ae$1=ia$1&&"CompositionEvent"in window,be$1=null;ia$1&&"documentMode"in document&&(be$1=document.documentMode);var ce$1=ia$1&&"TextEvent"in window&&!be$1,de$1=ia$1&&(!ae$1||be$1&&8<be$1&&11>=be$1),ee$1=String.fromCharCode(32),fe$1=false;
function ge$1(a,b){switch(a){case "keyup":return  -1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return  true;default:return  false}}function he$1(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var ie$1=false;function je$1(a,b){switch(a){case "compositionend":return he$1(b);case "keypress":if(32!==b.which)return null;fe$1=true;return ee$1;case "textInput":return a=b.data,a===ee$1&&fe$1?null:a;default:return null}}
function ke$1(a,b){if(ie$1)return "compositionend"===a||!ae$1&&ge$1(a,b)?(a=nd$1(),md$1=ld=kd$1=null,ie$1=false,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de$1&&"ko"!==b.locale?null:b.data;default:return null}}
var le$1={color:true,date:true,datetime:true,"datetime-local":true,email:true,month:true,number:true,password:true,range:true,search:true,tel:true,text:true,time:true,url:true,week:true};function me$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!le$1[a.type]:"textarea"===b?true:false}function ne$1(a,b,c,d){Eb(d);b=oe$1(b,"onChange");0<b.length&&(c=new td$1("onChange","change",null,c,d),a.push({event:c,listeners:b}));}var pe$1=null,qe$1=null;function re$1(a){se$1(a,0);}function te$1(a){var b=ue$1(a);if(Wa$1(b))return a}
function ve$1(a,b){if("change"===a)return b}var we$1=false;if(ia$1){var xe$1;if(ia$1){var ye$1="oninput"in document;if(!ye$1){var ze$1=document.createElement("div");ze$1.setAttribute("oninput","return;");ye$1="function"===typeof ze$1.oninput;}xe$1=ye$1;}else xe$1=false;we$1=xe$1&&(!document.documentMode||9<document.documentMode);}function Ae$1(){pe$1&&(pe$1.detachEvent("onpropertychange",Be$1),qe$1=pe$1=null);}function Be$1(a){if("value"===a.propertyName&&te$1(qe$1)){var b=[];ne$1(b,qe$1,a,xb(a));Jb(re$1,b);}}
function Ce$1(a,b,c){"focusin"===a?(Ae$1(),pe$1=b,qe$1=c,pe$1.attachEvent("onpropertychange",Be$1)):"focusout"===a&&Ae$1();}function De$1(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te$1(qe$1)}function Ee$1(a,b){if("click"===a)return te$1(b)}function Fe$1(a,b){if("input"===a||"change"===a)return te$1(b)}function Ge$1(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He$1="function"===typeof Object.is?Object.is:Ge$1;
function Ie$1(a,b){if(He$1(a,b))return  true;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return  false;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return  false;for(d=0;d<c.length;d++){var e=c[d];if(!ja$1.call(b,e)||!He$1(a[e],b[e]))return  false}return  true}function Je$1(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke$1(a,b){var c=Je$1(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Je$1(c);}}function Le$1(a,b){return a&&b?a===b?true:a&&3===a.nodeType?false:b&&3===b.nodeType?Le$1(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):false:false}
function Me$1(){for(var a=window,b=Xa$1();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href;}catch(d){c=false;}if(c)a=b.contentWindow;else break;b=Xa$1(a.document);}return b}function Ne$1(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe$1(a){var b=Me$1(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le$1(c.ownerDocument.documentElement,c)){if(null!==d&&Ne$1(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke$1(c,f);var g=Ke$1(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)));}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top;}}
var Pe$1=ia$1&&"documentMode"in document&&11>=document.documentMode,Qe$1=null,Re$1=null,Se$1=null,Te$1=false;
function Ue$1(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te$1||null==Qe$1||Qe$1!==Xa$1(d)||(d=Qe$1,"selectionStart"in d&&Ne$1(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se$1&&Ie$1(Se$1,d)||(Se$1=d,d=oe$1(Re$1,"onSelect"),0<d.length&&(b=new td$1("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe$1)));}
function Ve$1(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We$1={animationend:Ve$1("Animation","AnimationEnd"),animationiteration:Ve$1("Animation","AnimationIteration"),animationstart:Ve$1("Animation","AnimationStart"),transitionend:Ve$1("Transition","TransitionEnd")},Xe$1={},Ye$1={};
ia$1&&(Ye$1=document.createElement("div").style,"AnimationEvent"in window||(delete We$1.animationend.animation,delete We$1.animationiteration.animation,delete We$1.animationstart.animation),"TransitionEvent"in window||delete We$1.transitionend.transition);function Ze$1(a){if(Xe$1[a])return Xe$1[a];if(!We$1[a])return a;var b=We$1[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye$1)return Xe$1[a]=b[c];return a}var $e$1=Ze$1("animationend"),af$1=Ze$1("animationiteration"),bf$1=Ze$1("animationstart"),cf$1=Ze$1("transitionend"),df$1=new Map,ef$1="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff$1(a,b){df$1.set(a,b);fa$1(b,[a]);}for(var gf$1=0;gf$1<ef$1.length;gf$1++){var hf$1=ef$1[gf$1],jf$1=hf$1.toLowerCase(),kf=hf$1[0].toUpperCase()+hf$1.slice(1);ff$1(jf$1,"on"+kf);}ff$1($e$1,"onAnimationEnd");ff$1(af$1,"onAnimationIteration");ff$1(bf$1,"onAnimationStart");ff$1("dblclick","onDoubleClick");ff$1("focusin","onFocus");ff$1("focusout","onBlur");ff$1(cf$1,"onTransitionEnd");ha$1("onMouseEnter",["mouseout","mouseover"]);ha$1("onMouseLeave",["mouseout","mouseover"]);ha$1("onPointerEnter",["pointerout","pointerover"]);
ha$1("onPointerLeave",["pointerout","pointerover"]);fa$1("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa$1("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa$1("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa$1("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa$1("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa$1("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf$1="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf$1=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf$1));
function nf$1(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null;}
function se$1(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf$1(e,h,l);f=k;}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf$1(e,h,l);f=k;}}}if(Qb)throw a=Rb,Qb=false,Rb=null,a;}
function D$1(a,b){var c=b[of$1];void 0===c&&(c=b[of$1]=new Set);var d=a+"__bubble";c.has(d)||(pf$1(b,a,2,false),c.add(d));}function qf$1(a,b,c){var d=0;b&&(d|=4);pf$1(c,a,d,b);}var rf$1="_reactListening"+Math.random().toString(36).slice(2);function sf$1(a){if(!a[rf$1]){a[rf$1]=true;da$1.forEach(function(b){"selectionchange"!==b&&(mf$1.has(b)||qf$1(b,false,a),qf$1(b,true,a));});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf$1]||(b[rf$1]=true,qf$1("selectionchange",false,b));}}
function pf$1(a,b,c,d){switch(jd(b)){case 1:var e=ed$1;break;case 4:e=gd$1;break;default:e=fd$1;}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=true);d?void 0!==e?a.addEventListener(b,c,{capture:true,passive:e}):a.addEventListener(b,c,true):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,false);}
function hd$1(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return;}for(;null!==h;){g=Wc$1(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode;}}d=d.return;}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df$1.get(a);if(void 0!==h){var k=td$1,n=a;switch(a){case "keypress":if(0===od$1(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd$1;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd$1;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e$1:case af$1:case bf$1:k=Hd;break;case cf$1:k=Xd$1;break;case "scroll":k=vd$1;break;case "wheel":k=Zd$1;break;case "copy":case "cut":case "paste":k=Jd$1;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td$1;}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf$1(w,F,u))));if(J)break;w=w.return;}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}));}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc$1(n)||n[uf$1]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc$1(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null;}else k=null,n=d;if(k!==n){t=Bd$1;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td$1,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue$1(k);u=null==n?h:ue$1(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc$1(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf$1(u))w++;u=0;for(F=x;F;F=vf$1(F))u++;for(;0<w-u;)t=vf$1(t),w--;for(;0<u-w;)x=
vf$1(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf$1(t);x=vf$1(x);}t=null;}else t=null;null!==k&&wf$1(g,h,k,t,false);null!==n&&null!==J&&wf$1(g,J,n,t,true);}}}a:{h=d?ue$1(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve$1;else if(me$1(h))if(we$1)na=Fe$1;else {na=De$1;var xa=Ce$1;}else (k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee$1);if(na&&(na=na(a,d))){ne$1(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value);}xa=d?ue$1(d):window;switch(a){case "focusin":if(me$1(xa)||"true"===xa.contentEditable)Qe$1=xa,Re$1=d,Se$1=null;break;case "focusout":Se$1=Re$1=Qe$1=null;break;case "mousedown":Te$1=true;break;case "contextmenu":case "mouseup":case "dragend":Te$1=false;Ue$1(g,c,e);break;case "selectionchange":if(Pe$1)break;case "keydown":case "keyup":Ue$1(g,c,e);}var $a;if(ae$1)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0;}else ie$1?ge$1(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de$1&&"ko"!==c.locale&&(ie$1||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie$1&&($a=nd$1()):(kd$1=e,ld="value"in kd$1?kd$1.value:kd$1.textContent,ie$1=true)),xa=oe$1(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he$1(c),null!==$a&&(ba.data=$a))));if($a=ce$1?je$1(a,c):ke$1(a,c))d=oe$1(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a);}se$1(g,b);});}function tf$1(a,b,c){return {instance:a,listener:b,currentTarget:c}}function oe$1(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf$1(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf$1(a,f,e)));a=a.return;}return d}function vf$1(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf$1(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf$1(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf$1(c,k,h))));c=c.return;}0!==g.length&&a.push({event:b,listeners:g});}var xf=/\r\n?/g,yf$1=/\u0000|\uFFFD/g;function zf$1(a){return ("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf$1,"")}function Af$1(a,b,c){b=zf$1(b);if(zf$1(a)!==b&&c)throw Error(p(425));}function Bf$1(){}
var Cf=null,Df$1=null;function Ef$1(a,b){return "textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff$1="function"===typeof setTimeout?setTimeout:void 0,Gf$1="function"===typeof clearTimeout?clearTimeout:void 0,Hf$1="function"===typeof Promise?Promise:void 0,Jf$1="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf$1?function(a){return Hf$1.resolve(null).then(a).catch(If$1)}:Ff$1;function If$1(a){setTimeout(function(){throw a;});}
function Kf$1(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd$1(b);return}d--;}else "$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e;}while(c);bd$1(b);}function Lf$1(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf$1(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--;}else "/$"===c&&b++;}a=a.previousSibling;}return null}var Nf$1=Math.random().toString(36).slice(2),Of$1="__reactFiber$"+Nf$1,Pf$1="__reactProps$"+Nf$1,uf$1="__reactContainer$"+Nf$1,of$1="__reactEvents$"+Nf$1,Qf$1="__reactListeners$"+Nf$1,Rf$1="__reactHandles$"+Nf$1;
function Wc$1(a){var b=a[Of$1];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf$1]||c[Of$1]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf$1(a);null!==a;){if(c=a[Of$1])return c;a=Mf$1(a);}return b}a=c;c=a.parentNode;}return null}function Cb(a){a=a[Of$1]||a[uf$1];return !a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue$1(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf$1]||null}var Sf$1=[],Tf$1=-1;function Uf$1(a){return {current:a}}
function E$1(a){0>Tf$1||(a.current=Sf$1[Tf$1],Sf$1[Tf$1]=null,Tf$1--);}function G$1(a,b){Tf$1++;Sf$1[Tf$1]=a.current;a.current=b;}var Vf$1={},H$1=Uf$1(Vf$1),Wf$1=Uf$1(false),Xf$1=Vf$1;function Yf$1(a,b){var c=a.type.contextTypes;if(!c)return Vf$1;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf$1(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f$1(){E$1(Wf$1);E$1(H$1);}function ag(a,b,c){if(H$1.current!==Vf$1)throw Error(p(168));G$1(H$1,b);G$1(Wf$1,c);}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra$1(a)||"Unknown",e));return A$1({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf$1;Xf$1=H$1.current;G$1(H$1,a);G$1(Wf$1,Wf$1.current);return  true}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf$1),d.__reactInternalMemoizedMergedChildContext=a,E$1(Wf$1),E$1(H$1),G$1(H$1,a)):E$1(Wf$1);G$1(Wf$1,c);}var eg=null,fg=false,gg=false;function hg(a){null===eg?eg=[a]:eg.push(a);}function ig(a){fg=true;hg(a);}
function jg(){if(!gg&&null!==eg){gg=true;var a=0,b=C$1;try{var c=eg;for(C$1=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1;}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac$1(fc$1,jg),e;}finally{C$1=b,gg=false;}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b;}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc$1(d)-1;d&=~(1<<e);c+=1;var f=32-oc$1(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc$1(b)+e|c<<e|d;sg=f+a;}else rg=1<<f|c<<e|d,sg=a;}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0));}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null;}var xg=null,yg=null,I$1=false,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c);}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf$1(b.firstChild),true):false;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,true):false;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,true):false;default:return  false}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I$1){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf$1(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I$1=false,xg=a);}}else {if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I$1=false;xg=a;}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a;}
function Gg(a){if(a!==xg)return  false;if(!I$1)return Fg(a),I$1=true,false;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef$1(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf$1(b.nextSibling);}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf$1(a.nextSibling);break a}b--;}else "$"!==c&&"$!"!==c&&"$?"!==c||b++;}a=a.nextSibling;}yg=
null;}}else yg=xg?Lf$1(a.stateNode.nextSibling):null;return  true}function Hg(){for(var a=yg;a;)a=Lf$1(a.nextSibling);}function Ig(){yg=xg=null;I$1=false;}function Jg(a){null===zg?zg=[a]:zg.push(a);}var Kg=ua$1.ReactCurrentBatchConfig;
function Lg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode;}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;null===a?delete b[f]:b[f]=a;};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
function Mg(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function Ng(a){var b=a._init;return b(a._payload)}
function Og(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c);}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Pg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Qg(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya$1)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha$1&&Ng(f)===b.type))return d=e(b,c.props),d.ref=Lg(a,b,c),d.return=a,d;d=Rg(c.type,c.key,c.props,null,a.mode,d);d.ref=Lg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=Sg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Tg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=Qg(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va$1:return c=Rg(b.type,b.key,b.props,null,a.mode,c),
c.ref=Lg(a,null,b),c.return=a,c;case wa$1:return b=Sg(b,a.mode,c),b.return=a,b;case Ha$1:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka$1(b))return b=Tg(b,a.mode,c,null),b.return=a,b;Mg(a,b);}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va$1:return c.key===e?k(a,b,c,d):null;case wa$1:return c.key===e?l(a,b,c,d):null;case Ha$1:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka$1(c))return null!==e?null:m(a,b,c,d,null);Mg(a,c);}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va$1:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa$1:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha$1:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka$1(d))return a=a.get(c)||null,m(b,a,d,e,null);Mg(b,d);}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x;}if(w===h.length)return c(e,u),I$1&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I$1&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function t(e,g,h,k){var l=Ka$1(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x;}if(n.done)return c(e,
m),I$1&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I$1&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I$1&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya$1&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va$1:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya$1){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha$1&&Ng(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=Lg(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling;}f.type===ya$1?(d=Tg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rg(f.type,f.key,f.props,null,a.mode,h),h.ref=Lg(a,d,f),h.return=a,a=h);}return g(a);case wa$1:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else {c(a,d);break}else b(a,d);d=d.sibling;}d=Sg(f,a.mode,h);d.return=a;a=d;}return g(a);case Ha$1:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka$1(f))return t(a,d,f,h);Mg(a,f);}return "string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=Qg(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Ug=Og(true),Vg=Og(false),Wg=Uf$1(null),Xg=null,Yg=null,Zg=null;function $g(){Zg=Yg=Xg=null;}function ah$1(a){var b=Wg.current;E$1(Wg);a._currentValue=b;}function bh(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return;}}
function ch$1(a,b){Xg=a;Zg=Yg=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(dh=true),a.firstContext=null);}function eh$1(a){var b=a._currentValue;if(Zg!==a)if(a={context:a,memoizedValue:b,next:null},null===Yg){if(null===Xg)throw Error(p(308));Yg=a;Xg.dependencies={lanes:0,firstContext:a};}else Yg=Yg.next=a;return b}var fh=null;function gh(a){null===fh?fh=[a]:fh.push(a);}
function hh(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,gh(b)):(c.next=e.next,e.next=c);b.interleaved=c;return ih$1(a,d)}function ih$1(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var jh=false;function kh(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null};}
function lh$1(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects});}function mh(a,b){return {eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function nh$1(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K$1&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return ih$1(a,c)}e=d.interleaved;null===e?(b.next=b,gh(d)):(b.next=e.next,e.next=b);d.interleaved=b;return ih$1(a,c)}function oh$1(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
function ph(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next;}while(null!==c);null===f?e=f=b:f=f.next=b;}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b;}
function qh(a,b,c,d){var e=a.updateQueue;jh=false;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k));}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A$1({},q,r);break a;case 2:jh=true;}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h));}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null;}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);rh$1|=g;a.lanes=g;a.memoizedState=q;}}
function sh$1(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d);}}}var th$1={},uh$1=Uf$1(th$1),vh=Uf$1(th$1),wh=Uf$1(th$1);function xh(a){if(a===th$1)throw Error(p(174));return a}
function yh(a,b){G$1(wh,b);G$1(vh,a);G$1(uh$1,th$1);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a);}E$1(uh$1);G$1(uh$1,b);}function zh(){E$1(uh$1);E$1(vh);E$1(wh);}function Ah(a){xh(wh.current);var b=xh(uh$1.current);var c=lb(b,a.type);b!==c&&(G$1(vh,a),G$1(uh$1,c));}function Bh(a){vh.current===a&&(E$1(uh$1),E$1(vh));}var L$1=Uf$1(0);
function Ch(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}return null}var Dh=[];
function Eh(){for(var a=0;a<Dh.length;a++)Dh[a]._workInProgressVersionPrimary=null;Dh.length=0;}var Fh=ua$1.ReactCurrentDispatcher,Gh=ua$1.ReactCurrentBatchConfig,Hh=0,M$1=null,N$1=null,O$1=null,Ih=false,Jh=false,Kh=0,Lh=0;function P$1(){throw Error(p(321));}function Mh(a,b){if(null===b)return  false;for(var c=0;c<b.length&&c<a.length;c++)if(!He$1(a[c],b[c]))return  false;return  true}
function Nh(a,b,c,d,e,f){Hh=f;M$1=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Fh.current=null===a||null===a.memoizedState?Oh:Ph;a=c(d,e);if(Jh){f=0;do{Jh=false;Kh=0;if(25<=f)throw Error(p(301));f+=1;O$1=N$1=null;b.updateQueue=null;Fh.current=Qh;a=c(d,e);}while(Jh)}Fh.current=Rh;b=null!==N$1&&null!==N$1.next;Hh=0;O$1=N$1=M$1=null;Ih=false;if(b)throw Error(p(300));return a}function Sh(){var a=0!==Kh;Kh=0;return a}
function Th(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;return O$1}function Uh(){if(null===N$1){var a=M$1.alternate;a=null!==a?a.memoizedState:null;}else a=N$1.next;var b=null===O$1?M$1.memoizedState:O$1.next;if(null!==b)O$1=b,N$1=a;else {if(null===a)throw Error(p(310));N$1=a;a={memoizedState:N$1.memoizedState,baseState:N$1.baseState,baseQueue:N$1.baseQueue,queue:N$1.queue,next:null};null===O$1?M$1.memoizedState=O$1=a:O$1=O$1.next=a;}return O$1}
function Vh(a,b){return "function"===typeof b?b(a):b}
function Wh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=N$1,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g;}d.baseQueue=e=f;c.pending=null;}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Hh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else {var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;M$1.lanes|=m;rh$1|=m;}l=l.next;}while(null!==l&&l!==f);null===k?g=d:k.next=h;He$1(d,b.memoizedState)||(dh=true);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d;}a=c.interleaved;if(null!==a){e=a;do f=e.lane,M$1.lanes|=f,rh$1|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return [b.memoizedState,c.dispatch]}
function Xh(a){var b=Uh(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He$1(f,b.memoizedState)||(dh=true);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f;}return [f,d]}function Yh(){}
function Zh(a,b){var c=M$1,d=Uh(),e=b(),f=!He$1(d.memoizedState,e);f&&(d.memoizedState=e,dh=true);d=d.queue;$h(ai$1.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==O$1&&O$1.memoizedState.tag&1){c.flags|=2048;bi$1(9,ci$1.bind(null,c,d,e,b),void 0,null);if(null===Q$1)throw Error(p(349));0!==(Hh&30)||di$1(c,b,e);}return e}function di$1(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a));}
function ci$1(a,b,c,d){b.value=c;b.getSnapshot=d;ei$1(b)&&fi$1(a);}function ai$1(a,b,c){return c(function(){ei$1(b)&&fi$1(a);})}function ei$1(a){var b=a.getSnapshot;a=a.value;try{var c=b();return !He$1(a,c)}catch(d){return  true}}function fi$1(a){var b=ih$1(a,1);null!==b&&gi$1(b,a,1,-1);}
function hi$1(a){var b=Th();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Vh,lastRenderedState:a};b.queue=a;a=a.dispatch=ii$1.bind(null,M$1,a);return [b.memoizedState,a]}
function bi$1(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=M$1.updateQueue;null===b?(b={lastEffect:null,stores:null},M$1.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function ji$1(){return Uh().memoizedState}function ki$1(a,b,c,d){var e=Th();M$1.flags|=a;e.memoizedState=bi$1(1|b,c,void 0,void 0===d?null:d);}
function li$1(a,b,c,d){var e=Uh();d=void 0===d?null:d;var f=void 0;if(null!==N$1){var g=N$1.memoizedState;f=g.destroy;if(null!==d&&Mh(d,g.deps)){e.memoizedState=bi$1(b,c,f,d);return}}M$1.flags|=a;e.memoizedState=bi$1(1|b,c,f,d);}function mi$1(a,b){return ki$1(8390656,8,a,b)}function $h(a,b){return li$1(2048,8,a,b)}function ni$1(a,b){return li$1(4,2,a,b)}function oi$1(a,b){return li$1(4,4,a,b)}
function pi$1(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null);};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null;}}function qi$1(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return li$1(4,4,pi$1.bind(null,b,a),c)}function ri$1(){}function si$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function ti$1(a,b){var c=Uh();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Mh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function ui$1(a,b,c){if(0===(Hh&21))return a.baseState&&(a.baseState=false,dh=true),a.memoizedState=c;He$1(c,b)||(c=yc$1(),M$1.lanes|=c,rh$1|=c,a.baseState=true);return b}function vi$1(a,b){var c=C$1;C$1=0!==c&&4>c?c:4;a(true);var d=Gh.transition;Gh.transition={};try{a(!1),b();}finally{C$1=c,Gh.transition=d;}}function wi$1(){return Uh().memoizedState}
function xi$1(a,b,c){var d=yi$1(a);c={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi$1(a))Ai$1(b,c);else if(c=hh(a,b,c,d),null!==c){var e=R$1();gi$1(c,a,d,e);Bi$1(c,b,d);}}
function ii$1(a,b,c){var d=yi$1(a),e={lane:d,action:c,hasEagerState:false,eagerState:null,next:null};if(zi$1(a))Ai$1(b,e);else {var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He$1(h,g)){var k=b.interleaved;null===k?(e.next=e,gh(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=hh(a,b,e,d);null!==c&&(e=R$1(),gi$1(c,a,d,e),Bi$1(c,b,d));}}
function zi$1(a){var b=a.alternate;return a===M$1||null!==b&&b===M$1}function Ai$1(a,b){Jh=Ih=true;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b;}function Bi$1(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc$1(a,c);}}
var Rh={readContext:eh$1,useCallback:P$1,useContext:P$1,useEffect:P$1,useImperativeHandle:P$1,useInsertionEffect:P$1,useLayoutEffect:P$1,useMemo:P$1,useReducer:P$1,useRef:P$1,useState:P$1,useDebugValue:P$1,useDeferredValue:P$1,useTransition:P$1,useMutableSource:P$1,useSyncExternalStore:P$1,useId:P$1,unstable_isNewReconciler:false},Oh={readContext:eh$1,useCallback:function(a,b){Th().memoizedState=[a,void 0===b?null:b];return a},useContext:eh$1,useEffect:mi$1,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ki$1(4194308,
4,pi$1.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ki$1(4194308,4,a,b)},useInsertionEffect:function(a,b){return ki$1(4,2,a,b)},useMemo:function(a,b){var c=Th();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Th();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=xi$1.bind(null,M$1,a);return [d.memoizedState,a]},useRef:function(a){var b=
Th();a={current:a};return b.memoizedState=a},useState:hi$1,useDebugValue:ri$1,useDeferredValue:function(a){return Th().memoizedState=a},useTransition:function(){var a=hi$1(false),b=a[0];a=vi$1.bind(null,a[1]);Th().memoizedState=a;return [b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=M$1,e=Th();if(I$1){if(void 0===c)throw Error(p(407));c=c();}else {c=b();if(null===Q$1)throw Error(p(349));0!==(Hh&30)||di$1(d,b,c);}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;mi$1(ai$1.bind(null,d,
f,a),[a]);d.flags|=2048;bi$1(9,ci$1.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=Th(),b=Q$1.identifierPrefix;if(I$1){var c=sg;var d=rg;c=(d&~(1<<32-oc$1(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Kh++;0<c&&(b+="H"+c.toString(32));b+=":";}else c=Lh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:false},Ph={readContext:eh$1,useCallback:si$1,useContext:eh$1,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Wh,useRef:ji$1,useState:function(){return Wh(Vh)},
useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Wh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:false},Qh={readContext:eh$1,useCallback:si$1,useContext:eh$1,useEffect:$h,useImperativeHandle:qi$1,useInsertionEffect:ni$1,useLayoutEffect:oi$1,useMemo:ti$1,useReducer:Xh,useRef:ji$1,useState:function(){return Xh(Vh)},useDebugValue:ri$1,useDeferredValue:function(a){var b=Uh();return null===
N$1?b.memoizedState=a:ui$1(b,N$1.memoizedState,a)},useTransition:function(){var a=Xh(Vh)[0],b=Uh().memoizedState;return [a,b]},useMutableSource:Yh,useSyncExternalStore:Zh,useId:wi$1,unstable_isNewReconciler:false};function Ci$1(a,b){if(a&&a.defaultProps){b=A$1({},b);a=a.defaultProps;for(var c in a) void 0===b[c]&&(b[c]=a[c]);return b}return b}function Di$1(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A$1({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c);}
var Ei$1={isMounted:function(a){return (a=a._reactInternals)?Vb(a)===a:false},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh$1(a,f,e);null!==b&&(gi$1(b,a,e,d),oh$1(b,a,e));},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=R$1(),e=yi$1(a),f=mh(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=nh$1(a,f,e);null!==b&&(gi$1(b,a,e,d),oh$1(b,a,e));},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=R$1(),d=
yi$1(a),e=mh(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=nh$1(a,e,d);null!==b&&(gi$1(b,a,d,c),oh$1(b,a,d));}};function Fi$1(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie$1(c,d)||!Ie$1(e,f):true}
function Gi$1(a,b,c){var d=false,e=Vf$1;var f=b.contextType;"object"===typeof f&&null!==f?f=eh$1(f):(e=Zf$1(b)?Xf$1:H$1.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf$1(a,e):Vf$1);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Ei$1;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Hi$1(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Ei$1.enqueueReplaceState(b,b.state,null);}
function Ii$1(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs={};kh(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=eh$1(f):(f=Zf$1(b)?Xf$1:H$1.current,e.context=Yf$1(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Di$1(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Ei$1.enqueueReplaceState(e,e.state,null),qh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308);}function Ji$1(a,b){try{var c="",d=b;do c+=Pa$1(d),d=d.return;while(d);var e=c;}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack;}return {value:a,source:b,stack:e,digest:null}}
function Ki$1(a,b,c){return {value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}function Li$1(a,b){try{console.error(b.value);}catch(c){setTimeout(function(){throw c;});}}var Mi$1="function"===typeof WeakMap?WeakMap:Map;function Ni$1(a,b,c){c=mh(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Oi$1||(Oi$1=true,Pi$1=d);Li$1(a,b);};return c}
function Qi$1(a,b,c){c=mh(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Li$1(a,b);};}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Li$1(a,b);"function"!==typeof d&&(null===Ri$1?Ri$1=new Set([this]):Ri$1.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""});});return c}
function Si$1(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Mi$1;var e=new Set;d.set(b,e);}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ti$1.bind(null,a,b,c),b.then(a,a));}function Ui$1(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?true:false:true;if(b)return a;a=a.return;}while(null!==a);return null}
function Vi$1(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=mh(-1,1),b.tag=2,nh$1(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Wi$1=ua$1.ReactCurrentOwner,dh=false;function Xi$1(a,b,c,d){b.child=null===a?Vg(b,null,c,d):Ug(b,a.child,c,d);}
function Yi$1(a,b,c,d,e){c=c.render;var f=b.ref;ch$1(b,e);d=Nh(a,b,c,d,f,e);c=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi$1(a,b,e);I$1&&c&&vg(b);b.flags|=1;Xi$1(a,b,d,e);return b.child}
function $i$1(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!aj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,bj(a,b,f,d,e);a=Rg(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie$1;if(c(g,d)&&a.ref===b.ref)return Zi$1(a,b,e)}b.flags|=1;a=Pg(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function bj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie$1(f,d)&&a.ref===b.ref)if(dh=false,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(dh=true);else return b.lanes=a.lanes,Zi$1(a,b,e)}return cj(a,b,c,d,e)}
function dj(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G$1(ej,fj),fj|=c;else {if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G$1(ej,fj),fj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G$1(ej,fj);fj|=d;}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G$1(ej,fj),fj|=d;Xi$1(a,b,e,c);return b.child}function gj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152;}function cj(a,b,c,d,e){var f=Zf$1(c)?Xf$1:H$1.current;f=Yf$1(b,f);ch$1(b,e);c=Nh(a,b,c,d,f,e);d=Sh();if(null!==a&&!dh)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,Zi$1(a,b,e);I$1&&d&&vg(b);b.flags|=1;Xi$1(a,b,c,e);return b.child}
function hj(a,b,c,d,e){if(Zf$1(c)){var f=true;cg(b);}else f=false;ch$1(b,e);if(null===b.stateNode)ij(a,b),Gi$1(b,c,d),Ii$1(b,c,d,e),d=true;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=eh$1(l):(l=Zf$1(c)?Xf$1:H$1.current,l=Yf$1(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&Hi$1(b,g,d,l);jh=false;var r=b.memoizedState;g.state=r;qh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf$1.current||jh?("function"===typeof m&&(Di$1(b,c,m,d),k=b.memoizedState),(h=jh||Fi$1(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=false);}else {g=b.stateNode;lh$1(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Ci$1(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=eh$1(k):(k=Zf$1(c)?Xf$1:H$1.current,k=Yf$1(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&Hi$1(b,g,d,k);jh=false;r=b.memoizedState;g.state=r;qh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf$1.current||jh?("function"===typeof y&&(Di$1(b,c,y,d),n=b.memoizedState),(l=jh||Fi$1(b,c,l,d,r,n,k)||false)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=false);}return jj(a,b,c,d,f,e)}
function jj(a,b,c,d,e,f){gj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,false),Zi$1(a,b,f);d=b.stateNode;Wi$1.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Ug(b,a.child,null,f),b.child=Ug(b,null,h,f)):Xi$1(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,true);return b.child}function kj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,false);yh(a,b.containerInfo);}
function lj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Xi$1(a,b,c,d);return b.child}var mj={dehydrated:null,treeContext:null,retryLane:0};function nj(a){return {baseLanes:a,cachePool:null,transitions:null}}
function oj(a,b,c){var d=b.pendingProps,e=L$1.current,f=false,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?false:0!==(e&2));if(h)f=true,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G$1(L$1,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=pj(g,d,0,null),a=Tg(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=nj(c),b.memoizedState=mj,a):qj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return rj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=Pg(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=Pg(h,f):(f=Tg(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?nj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=mj;return d}f=a.child;a=f.sibling;d=Pg(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function qj(a,b){b=pj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function sj(a,b,c,d){null!==d&&Jg(d);Ug(b,a.child,null,c);a=qj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function rj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Ki$1(Error(p(422))),sj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=pj({mode:"visible",children:d.children},e,0,null);f=Tg(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Ug(b,a.child,null,g);b.child.memoizedState=nj(g);b.memoizedState=mj;return f}if(0===(b.mode&1))return sj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p(419));d=Ki$1(f,d,void 0);return sj(a,b,g,d)}h=0!==(g&a.childLanes);if(dh||h){d=Q$1;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0;}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,ih$1(a,e),gi$1(d,a,e,-1));}tj();d=Ki$1(Error(p(421)));return sj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=uj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf$1(e.nextSibling);xg=b;I$1=true;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=qj(b,d.children);b.flags|=4096;return b}function vj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);bh(a.return,b,c);}
function wj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e);}
function xj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Xi$1(a,b,d.children,c);d=L$1.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else {if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&vj(a,c,b);else if(19===a.tag)vj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return;}a.sibling.return=a.return;a=a.sibling;}d&=1;}G$1(L$1,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Ch(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);wj(b,false,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Ch(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a;}wj(b,true,c,null,f);break;case "together":wj(b,false,null,null,void 0);break;default:b.memoizedState=null;}return b.child}
function ij(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);}function Zi$1(a,b,c){null!==a&&(b.dependencies=a.dependencies);rh$1|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=Pg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Pg(a,a.pendingProps),c.return=b;c.sibling=null;}return b.child}
function yj(a,b,c){switch(b.tag){case 3:kj(b);Ig();break;case 5:Ah(b);break;case 1:Zf$1(b.type)&&cg(b);break;case 4:yh(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G$1(Wg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G$1(L$1,L$1.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return oj(a,b,c);G$1(L$1,L$1.current&1);a=Zi$1(a,b,c);return null!==a?a.sibling:null}G$1(L$1,L$1.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return xj(a,b,c);b.flags|=128;}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G$1(L$1,L$1.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,dj(a,b,c)}return Zi$1(a,b,c)}var zj,Aj,Bj,Cj;
zj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;}c.sibling.return=c.return;c=c.sibling;}};Aj=function(){};
Bj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;xh(uh$1.current);var f=null;switch(c){case "input":e=Ya$1(a,e);d=Ya$1(a,d);f=[];break;case "select":e=A$1({},e,{value:void 0});d=A$1({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf$1);}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="");}else "dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea$1.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g]);}else c||(f||(f=[]),f.push(l,
c)),c=k;else "dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea$1.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D$1("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k));}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4;}};Cj=function(a,b,c,d){c!==d&&(b.flags|=4);};
function Dj(a,b){if(!I$1)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null;}}
function S$1(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Ej(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S$1(b),null;case 1:return Zf$1(b.type)&&$f$1(),S$1(b),null;case 3:d=b.stateNode;zh();E$1(Wf$1);E$1(H$1);Eh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Fj(zg),zg=null));Aj(a,b);S$1(b);return null;case 5:Bh(b);var e=xh(wh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Bj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else {if(!d){if(null===b.stateNode)throw Error(p(166));S$1(b);return null}a=xh(uh$1.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of$1]=b;d[Pf$1]=f;a=0!==(b.mode&1);switch(c){case "dialog":D$1("cancel",d);D$1("close",d);break;case "iframe":case "object":case "embed":D$1("load",d);break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$1(lf$1[e],d);break;case "source":D$1("error",d);break;case "img":case "image":case "link":D$1("error",
d);D$1("load",d);break;case "details":D$1("toggle",d);break;case "input":Za$1(d,f);D$1("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D$1("invalid",d);break;case "textarea":hb(d,f),D$1("invalid",d);}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(true!==f.suppressHydrationWarning&&Af$1(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(true!==f.suppressHydrationWarning&&Af$1(d.textContent,
h,a),e=["children",""+h]):ea$1.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D$1("scroll",d);}switch(c){case "input":Va$1(d);db(d,f,true);break;case "textarea":Va$1(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf$1);}d=e;b.updateQueue=d;null!==d&&(b.flags|=4);}else {g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=true:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of$1]=b;a[Pf$1]=d;zj(a,b,false,false);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D$1("cancel",a);D$1("close",a);e=d;break;case "iframe":case "object":case "embed":D$1("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf$1.length;e++)D$1(lf$1[e],a);e=d;break;case "source":D$1("error",a);e=d;break;case "img":case "image":case "link":D$1("error",
a);D$1("load",a);e=d;break;case "details":D$1("toggle",a);e=d;break;case "input":Za$1(a,d);e=Ya$1(a,d);D$1("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A$1({},d,{value:void 0});D$1("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D$1("invalid",a);break;default:e=d;}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea$1.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D$1("scroll",a):null!=k&&ta$1(a,f,k,g));}switch(c){case "input":Va$1(a);db(a,d,false);break;case "textarea":Va$1(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa$1(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,false):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
true);break;default:"function"===typeof e.onClick&&(a.onclick=Bf$1);}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=true;break a;default:d=false;}}d&&(b.flags|=4);}null!==b.ref&&(b.flags|=512,b.flags|=2097152);}S$1(b);return null;case 6:if(a&&null!=b.stateNode)Cj(a,b,a.memoizedProps,d);else {if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=xh(wh.current);xh(uh$1.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of$1]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af$1(d.nodeValue,c,0!==(a.mode&1));break;case 5:true!==a.memoizedProps.suppressHydrationWarning&&Af$1(d.nodeValue,c,0!==(a.mode&1));}f&&(b.flags|=4);}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of$1]=b,b.stateNode=d;}S$1(b);return null;case 13:E$1(L$1);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I$1&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=false;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of$1]=b;}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S$1(b);f=false;}else null!==zg&&(Fj(zg),zg=null),f=true;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(L$1.current&1)?0===T$1&&(T$1=3):tj()));null!==b.updateQueue&&(b.flags|=4);S$1(b);return null;case 4:return zh(),
Aj(a,b),null===a&&sf$1(b.stateNode.containerInfo),S$1(b),null;case 10:return ah$1(b.type._context),S$1(b),null;case 17:return Zf$1(b.type)&&$f$1(),S$1(b),null;case 19:E$1(L$1);f=b.memoizedState;if(null===f)return S$1(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Dj(f,false);else {if(0!==T$1||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Ch(a);if(null!==g){b.flags|=128;Dj(f,false);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G$1(L$1,L$1.current&1|2);return b.child}a=
a.sibling;}null!==f.tail&&B$1()>Gj&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);}else {if(!d)if(a=Ch(g),null!==a){if(b.flags|=128,d=true,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Dj(f,true),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I$1)return S$1(b),null}else 2*B$1()-f.renderingStartTime>Gj&&1073741824!==c&&(b.flags|=128,d=true,Dj(f,false),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g);}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B$1(),b.sibling=null,c=L$1.current,G$1(L$1,d?c&1|2:c&1),b;S$1(b);return null;case 22:case 23:return Hj(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(fj&1073741824)&&(S$1(b),b.subtreeFlags&6&&(b.flags|=8192)):S$1(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
function Ij(a,b){wg(b);switch(b.tag){case 1:return Zf$1(b.type)&&$f$1(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return zh(),E$1(Wf$1),E$1(H$1),Eh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Bh(b),null;case 13:E$1(L$1);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig();}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E$1(L$1),null;case 4:return zh(),null;case 10:return ah$1(b.type._context),null;case 22:case 23:return Hj(),
null;case 24:return null;default:return null}}var Jj=false,U$1=false,Kj="function"===typeof WeakSet?WeakSet:Set,V$1=null;function Lj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null);}catch(d){W$1(a,b,d);}else c.current=null;}function Mj(a,b,c){try{c();}catch(d){W$1(a,b,d);}}var Nj=false;
function Oj(a,b){Cf=dd;a=Me$1();if(Ne$1(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType;}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y;}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode;}q=y;}c=-1===h||-1===k?null:{start:h,end:k};}else c=null;}c=c||{start:0,end:0};}else c=null;Df$1={focusedElem:a,selectionRange:c};dd=false;for(V$1=b;null!==V$1;)if(b=V$1,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V$1=a;else for(;null!==V$1;){b=V$1;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Ci$1(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w;}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W$1(b,b.return,F);}a=b.sibling;if(null!==a){a.return=b.return;V$1=a;break}V$1=b.return;}n=Nj;Nj=false;return n}
function Pj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Mj(b,c,f);}e=e.next;}while(e!==d)}}function Qj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d();}c=c.next;}while(c!==b)}}function Rj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c;}"function"===typeof b?b(a):b.current=a;}}
function Sj(a){var b=a.alternate;null!==b&&(a.alternate=null,Sj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of$1],delete b[Pf$1],delete b[of$1],delete b[Qf$1],delete b[Rf$1]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null;}function Tj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Uj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Tj(a.return))return null;a=a.return;}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child;}if(!(a.flags&2))return a.stateNode}}
function Vj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf$1));else if(4!==d&&(a=a.child,null!==a))for(Vj(a,b,c),a=a.sibling;null!==a;)Vj(a,b,c),a=a.sibling;}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling;}var X$1=null,Xj=false;function Yj(a,b,c){for(c=c.child;null!==c;)Zj(a,b,c),c=c.sibling;}
function Zj(a,b,c){if(lc$1&&"function"===typeof lc$1.onCommitFiberUnmount)try{lc$1.onCommitFiberUnmount(kc$1,c);}catch(h){}switch(c.tag){case 5:U$1||Lj(c,b);case 6:var d=X$1,e=Xj;X$1=null;Yj(a,b,c);X$1=d;Xj=e;null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X$1.removeChild(c.stateNode));break;case 18:null!==X$1&&(Xj?(a=X$1,c=c.stateNode,8===a.nodeType?Kf$1(a.parentNode,c):1===a.nodeType&&Kf$1(a,c),bd$1(a)):Kf$1(X$1,c.stateNode));break;case 4:d=X$1;e=Xj;X$1=c.stateNode.containerInfo;Xj=true;
Yj(a,b,c);X$1=d;Xj=e;break;case 0:case 11:case 14:case 15:if(!U$1&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Mj(c,b,g):0!==(f&4)&&Mj(c,b,g));e=e.next;}while(e!==d)}Yj(a,b,c);break;case 1:if(!U$1&&(Lj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount();}catch(h){W$1(c,b,h);}Yj(a,b,c);break;case 21:Yj(a,b,c);break;case 22:c.mode&1?(U$1=(d=U$1)||null!==
c.memoizedState,Yj(a,b,c),U$1=d):Yj(a,b,c);break;default:Yj(a,b,c);}}function ak(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Kj);b.forEach(function(b){var d=bk.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d));});}}
function ck(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X$1=h.stateNode;Xj=!1;break a;case 3:X$1=h.stateNode.containerInfo;Xj=!0;break a;case 4:X$1=h.stateNode.containerInfo;Xj=!0;break a}h=h.return;}if(null===X$1)throw Error(p(160));Zj(f,g,e);X$1=null;Xj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null;}catch(l){W$1(e,b,l);}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)dk(b,a),b=b.sibling;}
function dk(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:ck(b,a);ek(a);if(d&4){try{Pj(3,a,a.return),Qj(3,a);}catch(t){W$1(a,a.return,t);}try{Pj(5,a,a.return);}catch(t){W$1(a,a.return,t);}}break;case 1:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);break;case 5:ck(b,a);ek(a);d&512&&null!==c&&Lj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"");}catch(t){W$1(a,a.return,t);}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta$1(e,m,q,l);}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1));}e[Pf$1]=f;}catch(t){W$1(a,a.return,t);}}break;case 6:ck(b,a);ek(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f;}catch(t){W$1(a,a.return,t);}}break;case 3:ck(b,a);ek(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd$1(b.containerInfo);}catch(t){W$1(a,a.return,t);}break;case 4:ck(b,a);ek(a);break;case 13:ck(b,a);ek(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(fk=B$1()));d&4&&ak(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U$1=(l=U$1)||m,ck(b,a),U$1=l):ck(b,a);ek(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V$1=a,m=a.child;null!==m;){for(q=V$1=m;null!==V$1;){r=V$1;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Pj(4,r,r.return);break;case 1:Lj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount();}catch(t){W$1(d,c,t);}}break;case 5:Lj(r,r.return);break;case 22:if(null!==r.memoizedState){gk(q);continue}}null!==y?(y.return=r,V$1=y):gk(q);}m=m.sibling;}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g));}catch(t){W$1(a,a.return,t);}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps;}catch(t){W$1(a,a.return,t);}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return;}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling;}}break;case 19:ck(b,a);ek(a);d&4&&ak(a);break;case 21:break;default:ck(b,
a),ek(a);}}function ek(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Tj(c)){var d=c;break a}c=c.return;}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Uj(a);Wj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Uj(a);Vj(a,h,g);break;default:throw Error(p(161));}}catch(k){W$1(a,a.return,k);}a.flags&=-3;}b&4096&&(a.flags&=-4097);}function hk(a,b,c){V$1=a;ik(a);}
function ik(a,b,c){for(var d=0!==(a.mode&1);null!==V$1;){var e=V$1,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Jj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U$1;h=Jj;var l=U$1;Jj=g;if((U$1=k)&&!l)for(V$1=e;null!==V$1;)g=V$1,k=g.child,22===g.tag&&null!==g.memoizedState?jk(e):null!==k?(k.return=g,V$1=k):jk(e);for(;null!==f;)V$1=f,ik(f),f=f.sibling;V$1=e;Jj=h;U$1=l;}kk(a);}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V$1=f):kk(a);}}
function kk(a){for(;null!==V$1;){var b=V$1;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U$1||Qj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U$1)if(null===c)d.componentDidMount();else {var e=b.elementType===b.type?c.memoizedProps:Ci$1(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate);}var f=b.updateQueue;null!==f&&sh$1(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode;}sh$1(b,g,c);}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src);}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd$1(q);}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p(163));}U$1||b.flags&512&&Rj(b);}catch(r){W$1(b,b.return,r);}}if(b===a){V$1=null;break}c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}function gk(a){for(;null!==V$1;){var b=V$1;if(b===a){V$1=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V$1=c;break}V$1=b.return;}}
function jk(a){for(;null!==V$1;){var b=V$1;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Qj(4,b);}catch(k){W$1(b,c,k);}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount();}catch(k){W$1(b,e,k);}}var f=b.return;try{Rj(b);}catch(k){W$1(b,f,k);}break;case 5:var g=b.return;try{Rj(b);}catch(k){W$1(b,g,k);}}}catch(k){W$1(b,b.return,k);}if(b===a){V$1=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V$1=h;break}V$1=b.return;}}
var lk=Math.ceil,mk=ua$1.ReactCurrentDispatcher,nk=ua$1.ReactCurrentOwner,ok=ua$1.ReactCurrentBatchConfig,K$1=0,Q$1=null,Y$1=null,Z$1=0,fj=0,ej=Uf$1(0),T$1=0,pk=null,rh$1=0,qk=0,rk=0,sk=null,tk=null,fk=0,Gj=Infinity,uk=null,Oi$1=false,Pi$1=null,Ri$1=null,vk=false,wk=null,xk=0,yk=0,zk=null,Ak=-1,Bk=0;function R$1(){return 0!==(K$1&6)?B$1():-1!==Ak?Ak:Ak=B$1()}
function yi$1(a){if(0===(a.mode&1))return 1;if(0!==(K$1&2)&&0!==Z$1)return Z$1&-Z$1;if(null!==Kg.transition)return 0===Bk&&(Bk=yc$1()),Bk;a=C$1;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function gi$1(a,b,c,d){if(50<yk)throw yk=0,zk=null,Error(p(185));Ac$1(a,c,d);if(0===(K$1&2)||a!==Q$1)a===Q$1&&(0===(K$1&2)&&(qk|=c),4===T$1&&Ck(a,Z$1)),Dk(a,d),1===c&&0===K$1&&0===(b.mode&1)&&(Gj=B$1()+500,fg&&jg());}
function Dk(a,b){var c=a.callbackNode;wc$1(a,b);var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)null!==c&&bc$1(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc$1(c);if(1===b)0===a.tag?ig(Ek.bind(null,a)):hg(Ek.bind(null,a)),Jf$1(function(){0===(K$1&6)&&jg();}),c=null;else {switch(Dc$1(d)){case 1:c=fc$1;break;case 4:c=gc$1;break;case 16:c=hc$1;break;case 536870912:c=jc$1;break;default:c=hc$1;}c=Fk(c,Gk.bind(null,a));}a.callbackPriority=b;a.callbackNode=c;}}
function Gk(a,b){Ak=-1;Bk=0;if(0!==(K$1&6))throw Error(p(327));var c=a.callbackNode;if(Hk()&&a.callbackNode!==c)return null;var d=uc$1(a,a===Q$1?Z$1:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Ik(a,d);else {b=d;var e=K$1;K$1|=2;var f=Jk();if(Q$1!==a||Z$1!==b)uk=null,Gj=B$1()+500,Kk(a,b);do try{Lk();break}catch(h){Mk(a,h);}while(1);$g();mk.current=f;K$1=e;null!==Y$1?b=0:(Q$1=null,Z$1=0,b=T$1);}if(0!==b){2===b&&(e=xc$1(a),0!==e&&(d=e,b=Nk(a,e)));if(1===b)throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;if(6===b)Ck(a,d);
else {e=a.current.alternate;if(0===(d&30)&&!Ok(e)&&(b=Ik(a,d),2===b&&(f=xc$1(a),0!==f&&(d=f,b=Nk(a,f))),1===b))throw c=pk,Kk(a,0),Ck(a,d),Dk(a,B$1()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Pk(a,tk,uk);break;case 3:Ck(a,d);if((d&130023424)===d&&(b=fk+500-B$1(),10<b)){if(0!==uc$1(a,0))break;e=a.suspendedLanes;if((e&d)!==d){R$1();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff$1(Pk.bind(null,a,tk,uk),b);break}Pk(a,tk,uk);break;case 4:Ck(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc$1(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f;}d=e;d=B$1()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*lk(d/1960))-d;if(10<d){a.timeoutHandle=Ff$1(Pk.bind(null,a,tk,uk),d);break}Pk(a,tk,uk);break;case 5:Pk(a,tk,uk);break;default:throw Error(p(329));}}}Dk(a,B$1());return a.callbackNode===c?Gk.bind(null,a):null}
function Nk(a,b){var c=sk;a.current.memoizedState.isDehydrated&&(Kk(a,b).flags|=256);a=Ik(a,b);2!==a&&(b=tk,tk=c,null!==b&&Fj(b));return a}function Fj(a){null===tk?tk=a:tk.push.apply(tk,a);}
function Ok(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He$1(f(),e))return !1}catch(g){return  false}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else {if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return  true;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return  true}
function Ck(a,b){b&=~rk;b&=~qk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc$1(b),d=1<<c;a[c]=-1;b&=~d;}}function Ek(a){if(0!==(K$1&6))throw Error(p(327));Hk();var b=uc$1(a,0);if(0===(b&1))return Dk(a,B$1()),null;var c=Ik(a,b);if(0!==a.tag&&2===c){var d=xc$1(a);0!==d&&(b=d,c=Nk(a,d));}if(1===c)throw c=pk,Kk(a,0),Ck(a,b),Dk(a,B$1()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Pk(a,tk,uk);Dk(a,B$1());return null}
function Qk(a,b){var c=K$1;K$1|=1;try{return a(b)}finally{K$1=c,0===K$1&&(Gj=B$1()+500,fg&&jg());}}function Rk(a){null!==wk&&0===wk.tag&&0===(K$1&6)&&Hk();var b=K$1;K$1|=1;var c=ok.transition,d=C$1;try{if(ok.transition=null,C$1=1,a)return a()}finally{C$1=d,ok.transition=c,K$1=b,0===(K$1&6)&&jg();}}function Hj(){fj=ej.current;E$1(ej);}
function Kk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf$1(c));if(null!==Y$1)for(c=Y$1.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f$1();break;case 3:zh();E$1(Wf$1);E$1(H$1);Eh();break;case 5:Bh(d);break;case 4:zh();break;case 13:E$1(L$1);break;case 19:E$1(L$1);break;case 10:ah$1(d.type._context);break;case 22:case 23:Hj();}c=c.return;}Q$1=a;Y$1=a=Pg(a.current,null);Z$1=fj=b;T$1=0;pk=null;rk=qk=rh$1=0;tk=sk=null;if(null!==fh){for(b=
0;b<fh.length;b++)if(c=fh[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g;}c.pending=d;}fh=null;}return a}
function Mk(a,b){do{var c=Y$1;try{$g();Fh.current=Rh;if(Ih){for(var d=M$1.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next;}Ih=!1;}Hh=0;O$1=N$1=M$1=null;Jh=!1;Kh=0;nk.current=null;if(null===c||null===c.return){T$1=1;pk=b;Y$1=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z$1;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null);}var y=Ui$1(g);if(null!==y){y.flags&=-257;Vi$1(y,g,h,f,b);y.mode&1&&Si$1(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t;}else n.add(k);break a}else {if(0===(b&1)){Si$1(f,l,b);tj();break a}k=Error(p(426));}}else if(I$1&&h.mode&1){var J=Ui$1(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Vi$1(J,g,h,f,b);Jg(Ji$1(k,h));break a}}f=k=Ji$1(k,h);4!==T$1&&(T$1=2);null===sk?sk=[f]:sk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Ni$1(f,k,b);ph(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Ri$1||!Ri$1.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Qi$1(f,h,b);ph(f,F);break a}}f=f.return;}while(null!==f)}Sk(c);}catch(na){b=na;Y$1===c&&null!==c&&(Y$1=c=c.return);continue}break}while(1)}function Jk(){var a=mk.current;mk.current=Rh;return null===a?Rh:a}
function tj(){if(0===T$1||3===T$1||2===T$1)T$1=4;null===Q$1||0===(rh$1&268435455)&&0===(qk&268435455)||Ck(Q$1,Z$1);}function Ik(a,b){var c=K$1;K$1|=2;var d=Jk();if(Q$1!==a||Z$1!==b)uk=null,Kk(a,b);do try{Tk();break}catch(e){Mk(a,e);}while(1);$g();K$1=c;mk.current=d;if(null!==Y$1)throw Error(p(261));Q$1=null;Z$1=0;return T$1}function Tk(){for(;null!==Y$1;)Uk(Y$1);}function Lk(){for(;null!==Y$1&&!cc$1();)Uk(Y$1);}function Uk(a){var b=Vk(a.alternate,a,fj);a.memoizedProps=a.pendingProps;null===b?Sk(a):Y$1=b;nk.current=null;}
function Sk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Ej(c,b,fj),null!==c){Y$1=c;return}}else {c=Ij(c,b);if(null!==c){c.flags&=32767;Y$1=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else {T$1=6;Y$1=null;return}}b=b.sibling;if(null!==b){Y$1=b;return}Y$1=b=a;}while(null!==b);0===T$1&&(T$1=5);}function Pk(a,b,c){var d=C$1,e=ok.transition;try{ok.transition=null,C$1=1,Wk(a,b,c,d);}finally{ok.transition=e,C$1=d;}return null}
function Wk(a,b,c,d){do Hk();while(null!==wk);if(0!==(K$1&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc$1(a,f);a===Q$1&&(Y$1=Q$1=null,Z$1=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||vk||(vk=true,Fk(hc$1,function(){Hk();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=ok.transition;ok.transition=null;
var g=C$1;C$1=1;var h=K$1;K$1|=4;nk.current=null;Oj(a,c);dk(c,a);Oe$1(Df$1);dd=!!Cf;Df$1=Cf=null;a.current=c;hk(c);dc$1();K$1=h;C$1=g;ok.transition=f;}else a.current=c;vk&&(vk=false,wk=a,xk=e);f=a.pendingLanes;0===f&&(Ri$1=null);mc$1(c.stateNode);Dk(a,B$1());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Oi$1)throw Oi$1=false,a=Pi$1,Pi$1=null,a;0!==(xk&1)&&0!==a.tag&&Hk();f=a.pendingLanes;0!==(f&1)?a===zk?yk++:(yk=0,zk=a):yk=0;jg();return null}
function Hk(){if(null!==wk){var a=Dc$1(xk),b=ok.transition,c=C$1;try{ok.transition=null;C$1=16>a?16:a;if(null===wk)var d=!1;else {a=wk;wk=null;xk=0;if(0!==(K$1&6))throw Error(p(331));var e=K$1;K$1|=4;for(V$1=a.current;null!==V$1;){var f=V$1,g=f.child;if(0!==(V$1.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V$1=l;null!==V$1;){var m=V$1;switch(m.tag){case 0:case 11:case 15:Pj(8,m,f);}var q=m.child;if(null!==q)q.return=m,V$1=q;else for(;null!==V$1;){m=V$1;var r=m.sibling,y=m.return;Sj(m);if(m===
l){V$1=null;break}if(null!==r){r.return=y;V$1=r;break}V$1=y;}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J;}while(null!==t)}}V$1=f;}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V$1=g;else b:for(;null!==V$1;){f=V$1;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Pj(9,f,f.return);}var x=f.sibling;if(null!==x){x.return=f.return;V$1=x;break b}V$1=f.return;}}var w=a.current;for(V$1=w;null!==V$1;){g=V$1;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V$1=u;else b:for(g=w;null!==V$1;){h=V$1;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Qj(9,h);}}catch(na){W$1(h,h.return,na);}if(h===g){V$1=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V$1=F;break b}V$1=h.return;}}K$1=e;jg();if(lc$1&&"function"===typeof lc$1.onPostCommitFiberRoot)try{lc$1.onPostCommitFiberRoot(kc$1,a);}catch(na){}d=!0;}return d}finally{C$1=c,ok.transition=b;}}return  false}function Xk(a,b,c){b=Ji$1(c,b);b=Ni$1(a,b,1);a=nh$1(a,b,1);b=R$1();null!==a&&(Ac$1(a,1,b),Dk(a,b));}
function W$1(a,b,c){if(3===a.tag)Xk(a,a,c);else for(;null!==b;){if(3===b.tag){Xk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ri$1||!Ri$1.has(d))){a=Ji$1(c,a);a=Qi$1(b,a,1);b=nh$1(b,a,1);a=R$1();null!==b&&(Ac$1(b,1,a),Dk(b,a));break}}b=b.return;}}
function Ti$1(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=R$1();a.pingedLanes|=a.suspendedLanes&c;Q$1===a&&(Z$1&c)===c&&(4===T$1||3===T$1&&(Z$1&130023424)===Z$1&&500>B$1()-fk?Kk(a,0):rk|=c);Dk(a,b);}function Yk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc$1,sc$1<<=1,0===(sc$1&130023424)&&(sc$1=4194304)));var c=R$1();a=ih$1(a,b);null!==a&&(Ac$1(a,b,c),Dk(a,c));}function uj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Yk(a,c);}
function bk(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Yk(a,c);}var Vk;
Vk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf$1.current)dh=true;else {if(0===(a.lanes&c)&&0===(b.flags&128))return dh=false,yj(a,b,c);dh=0!==(a.flags&131072)?true:false;}else dh=false,I$1&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;ij(a,b);a=b.pendingProps;var e=Yf$1(b,H$1.current);ch$1(b,c);e=Nh(null,b,d,a,e,c);var f=Sh();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf$1(d)?(f=true,cg(b)):f=false,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,kh(b),e.updater=Ei$1,b.stateNode=e,e._reactInternals=b,Ii$1(b,d,a,c),b=jj(null,b,d,true,f,c)):(b.tag=0,I$1&&f&&vg(b),Xi$1(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{ij(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=Zk(d);a=Ci$1(d,a);switch(e){case 0:b=cj(null,b,d,a,c);break a;case 1:b=hj(null,b,d,a,c);break a;case 11:b=Yi$1(null,b,d,a,c);break a;case 14:b=$i$1(null,b,d,Ci$1(d.type,a),c);break a}throw Error(p(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),cj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),hj(a,b,d,e,c);case 3:a:{kj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;lh$1(a,b);qh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:false,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ji$1(Error(p(423)),b);b=lj(a,b,d,c,e);break a}else if(d!==e){e=Ji$1(Error(p(424)),b);b=lj(a,b,d,c,e);break a}else for(yg=Lf$1(b.stateNode.containerInfo.firstChild),xg=b,I$1=true,zg=null,c=Vg(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else {Ig();if(d===e){b=Zi$1(a,b,c);break a}Xi$1(a,b,d,c);}b=b.child;}return b;case 5:return Ah(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef$1(d,e)?g=null:null!==f&&Ef$1(d,f)&&(b.flags|=32),
gj(a,b),Xi$1(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return oj(a,b,c);case 4:return yh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Ug(b,null,d,c):Xi$1(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),Yi$1(a,b,d,e,c);case 7:return Xi$1(a,b,b.pendingProps,c),b.child;case 8:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 12:return Xi$1(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G$1(Wg,d._currentValue);d._currentValue=g;if(null!==f)if(He$1(f.value,g)){if(f.children===e.children&&!Wf$1.current){b=Zi$1(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=mh(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k;}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);bh(f.return,
c,b);h.lanes|=c;break}k=k.next;}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);bh(g,c,b);g=f.sibling;}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return;}f=g;}Xi$1(a,b,e.children,c);b=b.child;}return b;case 9:return e=b.type,d=b.pendingProps.children,ch$1(b,c),e=eh$1(e),d=d(e),b.flags|=1,Xi$1(a,b,d,c),
b.child;case 14:return d=b.type,e=Ci$1(d,b.pendingProps),e=Ci$1(d.type,e),$i$1(a,b,d,e,c);case 15:return bj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Ci$1(d,e),ij(a,b),b.tag=1,Zf$1(d)?(a=true,cg(b)):a=false,ch$1(b,c),Gi$1(b,d,e),Ii$1(b,d,e,c),jj(null,b,d,true,a,c);case 19:return xj(a,b,c);case 22:return dj(a,b,c)}throw Error(p(156,b.tag));};function Fk(a,b){return ac$1(a,b)}
function $k(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null;}function Bg(a,b,c,d){return new $k(a,b,c,d)}function aj(a){a=a.prototype;return !(!a||!a.isReactComponent)}
function Zk(a){if("function"===typeof a)return aj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da$1)return 11;if(a===Ga$1)return 14}return 2}
function Pg(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Rg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)aj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya$1:return Tg(c.children,e,f,b);case za$1:g=8;e|=8;break;case Aa$1:return a=Bg(12,c,b,e|2),a.elementType=Aa$1,a.lanes=f,a;case Ea$1:return a=Bg(13,c,b,e),a.elementType=Ea$1,a.lanes=f,a;case Fa$1:return a=Bg(19,c,b,e),a.elementType=Fa$1,a.lanes=f,a;case Ia$1:return pj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba$1:g=10;break a;case Ca$1:g=9;break a;case Da$1:g=11;
break a;case Ga$1:g=14;break a;case Ha$1:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Tg(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function pj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia$1;a.lanes=c;a.stateNode={isHidden:false};return a}function Qg(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function Sg(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function al(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc$1(0);this.expirationTimes=zc$1(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc$1(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null;}function bl$1(a,b,c,d,e,f,g,h,k){a=new al(a,b,c,h,k);1===b?(b=1,true===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};kh(f);return a}function cl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:wa$1,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function dl$1(a){if(!a)return Vf$1;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf$1(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf$1(c))return bg(a,c,b)}return b}
function el$1(a,b,c,d,e,f,g,h,k){a=bl$1(c,d,true,a,e,f,g,h,k);a.context=dl$1(null);c=a.current;d=R$1();e=yi$1(c);f=mh(d,e);f.callback=void 0!==b&&null!==b?b:null;nh$1(c,f,e);a.current.lanes=e;Ac$1(a,e,d);Dk(a,d);return a}function fl$1(a,b,c,d){var e=b.current,f=R$1(),g=yi$1(e);c=dl$1(c);null===b.context?b.context=c:b.pendingContext=c;b=mh(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=nh$1(e,b,g);null!==a&&(gi$1(a,e,g,f),oh$1(a,e,g));return g}
function gl$1(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function hl$1(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b;}}function il(a,b){hl$1(a,b);(a=a.alternate)&&hl$1(a,b);}function jl$1(){return null}var kl="function"===typeof reportError?reportError:function(a){console.error(a);};function ll(a){this._internalRoot=a;}
ml$1.prototype.render=ll.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));fl$1(a,b,null,null);};ml$1.prototype.unmount=ll.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Rk(function(){fl$1(null,a,null,null);});b[uf$1]=null;}};function ml$1(a){this._internalRoot=a;}
ml$1.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc$1();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc$1.length&&0!==b&&b<Qc$1[c].priority;c++);Qc$1.splice(c,0,a);0===c&&Vc$1(a);}};function nl(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function ol(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function pl$1(){}
function ql$1(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=gl$1(g);f.call(a);};}var g=el$1(b,d,a,0,null,false,false,"",pl$1);a._reactRootContainer=g;a[uf$1]=g.current;sf$1(8===a.nodeType?a.parentNode:a);Rk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=gl$1(k);h.call(a);};}var k=bl$1(a,0,false,null,null,false,false,"",pl$1);a._reactRootContainer=k;a[uf$1]=k.current;sf$1(8===a.nodeType?a.parentNode:a);Rk(function(){fl$1(b,k,c,d);});return k}
function rl$1(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=gl$1(g);h.call(a);};}fl$1(b,g,a,e);}else g=ql$1(c,b,a,e,d);return gl$1(g)}Ec$1=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc$1(b.pendingLanes);0!==c&&(Cc$1(b,c|1),Dk(b,B$1()),0===(K$1&6)&&(Gj=B$1()+500,jg()));}break;case 13:Rk(function(){var b=ih$1(a,1);if(null!==b){var c=R$1();gi$1(b,a,1,c);}}),il(a,1);}};
Fc$1=function(a){if(13===a.tag){var b=ih$1(a,134217728);if(null!==b){var c=R$1();gi$1(b,a,134217728,c);}il(a,134217728);}};Gc$1=function(a){if(13===a.tag){var b=yi$1(a),c=ih$1(a,b);if(null!==c){var d=R$1();gi$1(c,a,b,d);}il(a,b);}};Hc$1=function(){return C$1};Ic$1=function(a,b){var c=C$1;try{return C$1=a,b()}finally{C$1=c;}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa$1(d);bb(d,e);}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,false);}};Gb=Qk;Hb=Rk;
var sl={usingClientEntryPoint:false,Events:[Cb,ue$1,Db,Eb,Fb,Qk]},tl={findFiberByHostInstance:Wc$1,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"};
var ul={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua$1.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||
jl$1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var vl$1=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!vl$1.isDisabled&&vl$1.supportsFiber)try{kc$1=vl$1.inject(ul),lc$1=vl$1;}catch(a){}}reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sl;
reactDom_production_min.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!nl(b))throw Error(p(200));return cl(a,b,null,c)};reactDom_production_min.createRoot=function(a,b){if(!nl(a))throw Error(p(299));var c=false,d="",e=kl;null!==b&&void 0!==b&&(true===b.unstable_strictMode&&(c=true),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=bl$1(a,1,false,null,null,c,false,d,e);a[uf$1]=b.current;sf$1(8===a.nodeType?a.parentNode:a);return new ll(b)};
reactDom_production_min.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};reactDom_production_min.flushSync=function(a){return Rk(a)};reactDom_production_min.hydrate=function(a,b,c){if(!ol(b))throw Error(p(200));return rl$1(null,a,b,true,c)};
reactDom_production_min.hydrateRoot=function(a,b,c){if(!nl(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=false,f="",g=kl;null!==c&&void 0!==c&&(true===c.unstable_strictMode&&(e=true),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=el$1(b,null,a,1,null!=c?c:null,e,false,f,g);a[uf$1]=b.current;sf$1(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new ml$1(b)};reactDom_production_min.render=function(a,b,c){if(!ol(b))throw Error(p(200));return rl$1(null,a,b,false,c)};reactDom_production_min.unmountComponentAtNode=function(a){if(!ol(a))throw Error(p(40));return a._reactRootContainer?(Rk(function(){rl$1(null,null,a,!1,function(){a._reactRootContainer=null;a[uf$1]=null;});}),true):false};reactDom_production_min.unstable_batchedUpdates=Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!ol(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return rl$1(a,b,c,false,d)};reactDom_production_min.version="18.3.1-next-f1338f8080-20240426";

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

function b(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var C,k={exports:{}};
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/C=k,function(){var e={}.hasOwnProperty;function t(){for(var e="",t=0;t<arguments.length;t++){var i=arguments[t];i&&(e=o(e,n(i)));}return e}function n(n){if("string"==typeof n||"number"==typeof n)return n;if("object"!=typeof n)return "";if(Array.isArray(n))return t.apply(null,n);if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]"))return n.toString();var i="";for(var r in n)e.call(n,r)&&n[r]&&(i=o(i,r));return i}function o(e,t){return t?e?e+" "+t:e+t:e}C.exports?(t.default=t,C.exports=t):window.classNames=t;}();var x=b(k.exports);function S({className:t,size:n="16",variant:o="workspace",...i}){const r=x("icon",n&&[`icon-size-${n}`],t);return jsxRuntimeExports.jsx("span",{className:r,"aria-label":`icon-${o}`,role:"presentation",...i,children:jsxRuntimeExports.jsx("i",{className:`icon-${o}`})})}const N=reactExports.forwardRef(({className:t,variant:n="default",icon:o="workspace",size:i="16",tooltip:r,iconSize:s="16",onClick:l,disabled:c,children:u,...d},f)=>{const m=x("io-btn-icon","default"!==n&&[`io-btn-icon-${n}`],[`io-btn-icon-size-${i}`],t),p=reactExports.useCallback(e=>{if(!c)return l?l(e):void 0;e.preventDefault();},[l,c]);return jsxRuntimeExports.jsx("button",{className:m,type:"button",ref:f,"aria-label":"icon button","aria-disabled":c,title:r,onClick:p,disabled:c,...d,children:u??(o&&jsxRuntimeExports.jsx(S,{variant:o,size:s}))})});N.displayName="ButtonIcon";const D={default:void 0,info:"info",success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function E({className:n,variant:o="default",size:i="normal",text:r,close:a=false,closeButtonOnClick:s,append:l,...c}){const u=x("io-alert",`io-alert-${o}`,"large"===i&&"io-alert-lg",n),d=D[o];return jsxRuntimeExports.jsxs("div",{"data-testid":"io-alert",className:u,role:"alert","aria-label":"alert",...c,children:[d&&jsxRuntimeExports.jsx(S,{"data-testid":"io-alert-icon",variant:d,className:"icon-severity"}),r&&jsxRuntimeExports.jsx("p",{"data-testid":"io-alert-text",className:"io-text-smaller",children:r}),"large"===i&&l,a&&jsxRuntimeExports.jsx(N,{"data-testid":"io-alert-close-button",className:"ms-auto",size:"16",iconSize:"10",icon:"close",onClick:s})]})}function I({className:t,variant:n="default",children:o,...i}){const r=x("io-badge","default"!==n&&[`io-badge-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:o})}function M({className:t,tag:n="h2",size:o="normal",text:i="Title",...r}){const a=n,s=x("small"===o&&"io-title-semibold","normal"===o&&"io-title","large"===o&&"io-title-large",t);return jsxRuntimeExports.jsx(a,{className:s,...r,children:i})}function P({className:n,title:o,titleSize:i="normal",tag:r,hint:a,children:s,...l}){const c=x("io-block",n),u=o?"block-title":void 0;return jsxRuntimeExports.jsxs("section",{className:c,"aria-label":o?void 0:"Block","aria-labelledby":u,...l,children:[o&&jsxRuntimeExports.jsx(M,{id:u,tag:r,text:o,size:i}),s,a&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:a})]})}const T=e=>"Enter"===e.key||" "===e.key,A=reactExports.forwardRef(({className:n,variant:o="default",size:i="normal",icon:r,iconSize:s="12",iconRight:l=false,text:c,onClick:u,disabled:d,children:f,...m},p)=>{const h=x("io-btn",("primary"===o||"critical"===o||"outline"===o||"link"===o)&&[`io-btn-${o}`],"large"===i&&"io-btn-lg",n),g=reactExports.useCallback(e=>{if(!d)return u?u(e):void 0;e.preventDefault();},[u,d]),v=reactExports.useCallback(e=>{d||T(e)&&(e.preventDefault(),g(e));},[g,d]);return jsxRuntimeExports.jsxs("button",{className:h,ref:p,type:"button","aria-disabled":d,onClick:g,onKeyDown:v,disabled:d,tabIndex:0,...m,children:[r&&!l&&jsxRuntimeExports.jsx(S,{variant:r,size:s}),f??c,r&&l&&jsxRuntimeExports.jsx(S,{variant:r,size:s})]})});A.displayName="Button";const O=reactExports.createContext({}),L=reactExports.forwardRef(({icon:t="chevron-down",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=reactExports.useContext(O),d=reactExports.useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=reactExports.useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),m=reactExports.useCallback(e=>{o?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(A,{icon:t,iconRight:true,onClick:f,onKeyDown:m,disabled:c,ref:d,...i})});L.displayName="DropdownButton";const F=reactExports.forwardRef(({size:t="32",onClick:n,onKeyDown:o,...i},r)=>{const{handleToggle:s,disabled:c,setTriggerRef:u}=reactExports.useContext(O),d=reactExports.useCallback(e=>{u?.(e),r&&("function"==typeof r?r(e):r.current=e);},[r,u]),f=reactExports.useCallback(e=>{e.stopPropagation(),n?.(e),e.defaultPrevented||s?.();},[n,s]),m=reactExports.useCallback(e=>{o?.(e),e.defaultPrevented||T(e)&&(e.preventDefault(),e.stopPropagation(),s?.());},[o,s]);return jsxRuntimeExports.jsx(N,{size:t,onClick:f,onKeyDown:m,disabled:c,ref:d,...i})});function B({className:t,...n}){const o=x("io-dropdown-content",t);return jsxRuntimeExports.jsx("div",{className:o,...n})}F.displayName="DropdownButtonIcon";const R=reactExports.createContext({}),_=reactExports.forwardRef((n,o)=>{const{className:i,prepend:r,append:a,isSelected:s,onClick:c,description:u,disabled:d=false,children:f,tooltip:m,...p}=n,{variant:h="default",selected:g,checkIcon:v,handleItemClick:y}=reactExports.useContext(R),w=s??g?.some(e=>e.children===f),b="default"!==h&&!!v,C=b||r,k=x("io-list-item",C&&"io-list-item-left",a&&"io-list-item-right","default"!==h&&w&&"selected",u&&"io-list-item-description",d&&"io-list-item-disabled",i);return jsxRuntimeExports.jsxs("li",{className:k,ref:o,role:"menuitem","aria-roledescription":"menuitem",tabIndex:0,onClick:e=>{d?e.preventDefault():(y?.(e,{children:f}),c?.(e));},...p,children:[C&&jsxRuntimeExports.jsxs("div",{className:"io-list-left-column",children:[b&&jsxRuntimeExports.jsx(S,{variant:v.variant,title:w?v.tooltip:void 0,"data-testid":"list-item-check-icon"}),r]}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:m,"data-testid":"list-item-title",children:f}),a&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:a}),u&&jsxRuntimeExports.jsx("div",{className:"io-list-text-description",children:u})]})});_.displayName="ListItem";const H=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-title",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,"data-testid":"list-item-title",children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});H.displayName="ListItemTitle";const $=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item",o&&"io-list-item-left",i&&"io-list-item-right","io-list-item-section",n);return jsxRuntimeExports.jsxs("li",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});$.displayName="ListItemSection";const j=reactExports.forwardRef(({className:n,prepend:o,append:i,children:r,tooltip:a,...s},l)=>{const c=x("io-list-item-header",n);return jsxRuntimeExports.jsxs("div",{className:c,ref:l,...s,children:[o&&jsxRuntimeExports.jsx("div",{className:"io-list-left-column",children:o}),jsxRuntimeExports.jsx("span",{className:"io-list-text",title:a,children:r}),i&&jsxRuntimeExports.jsx("div",{className:"io-list-right-column",children:i})]})});j.displayName="ListItemHeader";const z=reactExports.forwardRef(({className:t,children:n,...o},i)=>{const r=x("io-list-item","io-list-with-sub-items",t);return jsxRuntimeExports.jsx("li",{className:r,ref:i,...o,children:n})});z.displayName="ListItemWithSubItems";const V=reactExports.forwardRef((t,n)=>{const{className:o,variant:i="default",checkIcon:r,children:s,...l}=t,[d,f]=reactExports.useState([]),m=x("io-list","default"!==i&&"io-list-selectable",o),p=reactExports.useMemo(()=>{if(r)return "object"==typeof r?r:{variant:r}},[r]),h=reactExports.useCallback((e,t)=>{if("default"===i)return;const n=d.some(e=>e.children?.toString()===t.children?.toString());"single"===i?f([t]):(()=>{const e=n?d.filter(e=>e.children!==t.children):[...d,t];f(e);})();},[d,i]),g=reactExports.useMemo(()=>({variant:i,selected:d,checkIcon:p,handleItemClick:h}),[i,d,p,h]);return jsxRuntimeExports.jsx(R.Provider,{value:g,children:jsxRuntimeExports.jsx("ul",{className:m,ref:n,...l,children:s})})});V.displayName="List";const W=V;W.Item=_,W.ItemTitle=H,W.ItemSection=$,W.ItemHeader=j,W.ItemWithSubItems=z;const Y=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(W,{...t,ref:n}));Y.displayName="DropdownList";const U=reactExports.forwardRef((t,n)=>{const{handleClose:o}=reactExports.useContext(O),{onClick:i,onKeyDown:r,...s}=t,c=reactExports.useRef(null),u=reactExports.useCallback(e=>{c.current=e,"function"==typeof n?n(e):n&&(n.current=e);},[n]);return jsxRuntimeExports.jsx(_,{...s,ref:u,onClick:e=>{i?.(e),o?.();},onKeyDown:e=>{if(r?.(e),e.defaultPrevented||!T(e))return;e.preventDefault(),e.stopPropagation();const t=("function"==typeof n?null:n?.current)||c.current;t?.click();}})});U.displayName="DropdownItem";const K=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(H,{...t,ref:n}));K.displayName="DropdownItemTitle";const J=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx($,{...t,ref:n}));function q({className:t,...n}){const o=x("io-separator",t);return jsxRuntimeExports.jsx("hr",{className:o,...n})}J.displayName="DropdownItemSection";const G=reactExports.forwardRef((t,n)=>jsxRuntimeExports.jsx(q,{...t}));G.displayName="DropdownSeparator";function Q(e,t,n){const o=reactExports.useCallback(n=>{const o=t.some(e=>n.key===e);o&&(n.preventDefault(),e());},[e,t]);reactExports.useEffect(()=>{const e=n?.current||document;return e.addEventListener("keydown",o),()=>{e.removeEventListener("keydown",o);}},[o,n]);}const X=reactExports.forwardRef(({className:t,variant:n="outline",align:o="down",disabled:i,isOpen:r,onOpenChange:s,children:l,...p},h)=>{const g=reactExports.useRef(null),v=reactExports.useRef(null);reactExports.useImperativeHandle(h,()=>v.current,[]);const{isOpen:y,handleOpen:w,handleClose:b}=((e,t)=>{const[n,o]=reactExports.useState(false),i=void 0!==e,r=i?e:n,s=reactExports.useCallback(e=>{i||o(e),t?.(e);},[i,t]),l=reactExports.useCallback(()=>s(true),[s]),u=reactExports.useCallback(()=>s(false),[s]);return {isOpen:r,setOpen:s,handleOpen:l,handleClose:u}})(r,s);((e,t,n=true)=>{reactExports.useEffect(()=>{if(!n)return;const o=n=>{const o=n.target;o&&e.current&&!e.current.contains(o)&&(n.composedPath&&n.composedPath().some(t=>t===e.current||e.current&&t.nodeType===Node.ELEMENT_NODE&&e.current.contains(t))||t());},i=requestAnimationFrame(()=>{document.addEventListener("mousedown",o,true);});return ()=>{cancelAnimationFrame(i),document.removeEventListener("mousedown",o,true);}},[e,t,n]);})(v,b,y),Q(()=>{y&&b();},["Escape"],v),Q(()=>{y||i||g.current!==document.activeElement||w();},["ArrowDown","ArrowUp"],v);const C=reactExports.useMemo(()=>({variant:n,align:o,disabled:i,isOpen:y,handleOpen:w,handleClose:b,handleToggle:y?b:w,setTriggerRef:e=>g.current=e}),[n,o,i,y,w,b]),k=x("io-dropdown",y&&"io-dropdown-open","default"!==n&&`io-dropdown-${n}`,t);return jsxRuntimeExports.jsx(O.Provider,{value:C,children:jsxRuntimeExports.jsx("div",{className:k,ref:v,...p,children:l})})});function Z({className:t,variant:n="default",align:o="left",children:i,...r}){const a=x("io-btn-group","default"!==n&&`io-btn-group-${n}`,"right"===o&&"io-btn-group-right",t);return jsxRuntimeExports.jsx("div",{className:a,"data-testid":"button-group",...r,children:i})}function ee({className:t,draggable:n=false,children:o,...i}){const r=x("io-header",n&&["draggable"],t);return jsxRuntimeExports.jsx("header",{className:r,...i,children:o})}function te({className:t,children:n,...o}){const i=x("io-dialog-header",t);return jsxRuntimeExports.jsx(ee,{"data-testid":"io-dialog-header",className:i,...o,children:n})}function ne({className:t,children:n,...o}){const i=x("io-dialog-body",t);return jsxRuntimeExports.jsx("div",{"data-testid":"io-dialog-body",className:i,...o,children:n})}function oe({className:t,children:n,...o}){const i=x("io-footer",t);return jsxRuntimeExports.jsx("footer",{className:i,...o,children:n})}function ie({className:t,...n}){const o=x("io-dialog-footer",t);return jsxRuntimeExports.jsx(oe,{"data-testid":"io-dialog-footer",className:o,...n})}function re({className:n,variant:o="default",title:i="Dialog Title",isOpen:r=false,draggable:a=false,closeFn:s,children:l,...c}){const u=reactExports.useRef(null),f=x("io-dialog","centered"===o&&"io-dialog-center",n);return reactExports.useLayoutEffect(()=>{const e=u?.current;e&&(r?e.showModal():"function"==typeof e.close&&e.close());},[r]),jsxRuntimeExports.jsxs("dialog",{"data-testid":"io-dialog",className:f,ref:u,"data-modal":true,onClose:()=>{r&&s&&s();},onClick:e=>{r&&s&&"DIALOG"===e.target.nodeName&&s();},onKeyDown:e=>{const t=e.target instanceof HTMLDialogElement&&"DIALOG"===e.target.nodeName;r&&s&&" "===e.key&&t&&s();},...c,children:[jsxRuntimeExports.jsxs(te,{draggable:a,children:[jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-title",children:i}),jsxRuntimeExports.jsx(Z,{children:jsxRuntimeExports.jsx(N,{className:"non-draggable","data-testid":"io-dialog-close-button",size:"24",icon:"close",iconSize:"12",onClick:s,tabIndex:-1})})]}),l]})}function ae(){return "undefined"!=typeof window}function se(e){return ue(e)?(e.nodeName||"").toLowerCase():"#document"}function le(e){var t;return (null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function ce(e){var t;return null==(t=(ue(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function ue(e){return !!ae()&&(e instanceof Node||e instanceof le(e).Node)}function de(e){return !!ae()&&(e instanceof Element||e instanceof le(e).Element)}function fe(e){return !!ae()&&(e instanceof HTMLElement||e instanceof le(e).HTMLElement)}function me(e){return !(!ae()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof le(e).ShadowRoot)}X.Button=L,X.ButtonIcon=F,X.Content=B,X.List=Y,X.Item=U,X.ItemTitle=K,X.ItemSection=J,X.Separator=G,Z.Button=A,Z.ButtonIcon=N,Z.Dropdown=X,ee.Title=M,ee.ButtonGroup=Z,ee.Button=A,ee.ButtonIcon=N,ee.Dropdown=X,te.Title=M,te.ButtonGroup=Z,te.Button=A,te.ButtonIcon=N,te.Dropdown=X,ne.Content=function({className:t,children:n,...o}){const i=x("io-dialog-content",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})},oe.ButtonGroup=Z,oe.Button=A,oe.ButtonIcon=N,oe.Dropdown=X,ie.ButtonGroup=Z,ie.Button=A,ie.ButtonIcon=N,ie.Dropdown=X,re.Header=te,re.Body=ne,re.Footer=ie;const pe=new Set(["inline","contents"]);function he(e){const{overflow:t,overflowX:n,overflowY:o,display:i}=Ee(e);return /auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!pe.has(i)}const ge=new Set(["table","td","th"]);function ve(e){return ge.has(se(e))}const ye=[":popover-open",":modal"];function we(e){return ye.some(t=>{try{return e.matches(t)}catch(e){return  false}})}const be=["transform","translate","scale","rotate","perspective"],Ce=["transform","translate","scale","rotate","perspective","filter"],ke=["paint","layout","strict","content"];function xe(e){const t=Se(),n=de(e)?Ee(e):e;return be.some(e=>!!n[e]&&"none"!==n[e])||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||Ce.some(e=>(n.willChange||"").includes(e))||ke.some(e=>(n.contain||"").includes(e))}function Se(){return !("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}const Ne=new Set(["html","body","#document"]);function De(e){return Ne.has(se(e))}function Ee(e){return le(e).getComputedStyle(e)}function Ie(e){return de(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Me(e){if("html"===se(e))return e;const t=e.assignedSlot||e.parentNode||me(e)&&e.host||ce(e);return me(t)?t.host:t}function Pe(e){const t=Me(e);return De(t)?e.ownerDocument?e.ownerDocument.body:e.body:fe(t)&&he(t)?t:Pe(t)}function Te(e,t,n){var o;void 0===t&&(t=[]),void 0===n&&(n=true);const i=Pe(e),r=i===(null==(o=e.ownerDocument)?void 0:o.body),a=le(i);if(r){const e=Ae(a);return t.concat(a,a.visualViewport||[],he(i)?i:[],e&&n?Te(e):[])}return t.concat(i,Te(i,[],n))}function Ae(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Oe(e){let t=e.activeElement;for(;null!=(null==(n=t)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;t=t.shadowRoot.activeElement;}return t}function Le(e,t){if(!e||!t)return  false;const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return  true;if(n&&me(n)){let n=t;for(;n;){if(e===n)return  true;n=n.parentNode||n.host;}}return  false}function Fe(){const e=navigator.userAgentData;return null!=e&&e.platform?e.platform:navigator.platform}function Be(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(e=>{let{brand:t,version:n}=e;return t+"/"+n}).join(" "):navigator.userAgent}function Re(e){return !(0!==e.mozInputSource||!e.isTrusted)||($e()&&e.pointerType?"click"===e.type&&1===e.buttons:0===e.detail&&!e.pointerType)}function _e(e){return !Be().includes("jsdom/")&&(!$e()&&0===e.width&&0===e.height||$e()&&1===e.width&&1===e.height&&0===e.pressure&&0===e.detail&&"mouse"===e.pointerType||e.width<1&&e.height<1&&0===e.pressure&&0===e.detail&&"touch"===e.pointerType)}function He(){return /apple/i.test(navigator.vendor)}function $e(){const e=/android/i;return e.test(Fe())||e.test(Be())}function je(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function ze(e){return (null==e?void 0:e.ownerDocument)||document}function Ve(e,t){if(null==t)return  false;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return null!=n.target&&t.contains(n.target)}function We(e){return "composedPath"in e?e.composedPath()[0]:e.target}function Ye(e){return fe(e)&&e.matches("input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])")}function Ue(e){e.preventDefault(),e.stopPropagation();}function Ke(e){return !!e&&("combobox"===e.getAttribute("role")&&Ye(e))}const Je=Math.min,qe=Math.max,Ge=Math.round,Qe=Math.floor,Xe=e=>({x:e,y:e}),Ze={left:"right",right:"left",bottom:"top",top:"bottom"},et={start:"end",end:"start"};function tt(e,t,n){return qe(e,Je(t,n))}function nt(e,t){return "function"==typeof e?e(t):e}function ot(e){return e.split("-")[0]}function it(e){return e.split("-")[1]}function rt(e){return "x"===e?"y":"x"}function at(e){return "y"===e?"height":"width"}const st=new Set(["top","bottom"]);function lt(e){return st.has(ot(e))?"y":"x"}function ct(e){return rt(lt(e))}function ut(e){return e.replace(/start|end/g,e=>et[e])}const dt=["left","right"],ft=["right","left"],mt=["top","bottom"],pt=["bottom","top"];function ht(e,t,n,o){const i=it(e);let r=function(e,t,n){switch(e){case "top":case "bottom":return n?t?ft:dt:t?dt:ft;case "left":case "right":return t?mt:pt;default:return []}}(ot(e),"start"===n,o);return i&&(r=r.map(e=>e+"-"+i),t&&(r=r.concat(r.map(ut)))),r}function gt(e){return e.replace(/left|right|bottom|top/g,e=>Ze[e])}function vt(e){const{x:t,y:n,width:o,height:i}=e;return {width:o,height:i,top:n,left:t,right:t+o,bottom:n+i,x:t,y:n}}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var yt=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"].join(","),wt="undefined"==typeof Element,bt=wt?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Ct=!wt&&Element.prototype.getRootNode?function(e){var t;return null==e||null===(t=e.getRootNode)||void 0===t?void 0:t.call(e)}:function(e){return null==e?void 0:e.ownerDocument},kt=function e(t,n){var o;void 0===n&&(n=true);var i=null==t||null===(o=t.getAttribute)||void 0===o?void 0:o.call(t,"inert");return ""===i||"true"===i||n&&t&&e(t.parentNode)},xt=function e(t,n,o){for(var i=[],r=Array.from(t);r.length;){var a=r.shift();if(!kt(a,false))if("SLOT"===a.tagName){var s=a.assignedElements(),l=e(s.length?s:a.children,true,o);o.flatten?i.push.apply(i,l):i.push({scopeParent:a,candidates:l});}else {bt.call(a,yt)&&o.filter(a)&&(n||!t.includes(a))&&i.push(a);var c=a.shadowRoot||"function"==typeof o.getShadowRoot&&o.getShadowRoot(a),u=!kt(c,false)&&(!o.shadowRootFilter||o.shadowRootFilter(a));if(c&&u){var d=e(true===c?a.children:c.children,true,o);o.flatten?i.push.apply(i,d):i.push({scopeParent:a,candidates:d});}else r.unshift.apply(r,a.children);}}return i},St=function(e){return !isNaN(parseInt(e.getAttribute("tabindex"),10))},Nt=function(e){if(!e)throw new Error("No node provided");return e.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||function(e){var t,n=null==e||null===(t=e.getAttribute)||void 0===t?void 0:t.call(e,"contenteditable");return ""===n||"true"===n}(e))&&!St(e)?0:e.tabIndex},Dt=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},Et=function(e){return "INPUT"===e.tagName},It=function(e){return function(e){return Et(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return  true;var t,n=e.form||Ct(e),o=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=o(window.CSS.escape(e.name));else try{t=o(e.name);}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),false}var i=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return !i||i===e}(e)},Mt=function(e){var t=e.getBoundingClientRect(),n=t.width,o=t.height;return 0===n&&0===o},Pt=function(e,t){var n=t.displayCheck,o=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return  true;var i=bt.call(e,"details>summary:first-of-type")?e.parentElement:e;if(bt.call(i,"details:not([open]) *"))return  true;if(n&&"full"!==n&&"legacy-full"!==n){if("non-zero-area"===n)return Mt(e)}else {if("function"==typeof o){for(var r=e;e;){var a=e.parentElement,s=Ct(e);if(a&&!a.shadowRoot&&true===o(a))return Mt(e);e=e.assignedSlot?e.assignedSlot:a||s===e.ownerDocument?a:s.host;}e=r;}if(function(e){var t,n,o,i,r=e&&Ct(e),a=null===(t=r)||void 0===t?void 0:t.host,s=false;if(r&&r!==e)for(s=!!(null!==(n=a)&&void 0!==n&&null!==(o=n.ownerDocument)&&void 0!==o&&o.contains(a)||null!=e&&null!==(i=e.ownerDocument)&&void 0!==i&&i.contains(e));!s&&a;){var l,c,u;s=!(null===(c=a=null===(l=r=Ct(a))||void 0===l?void 0:l.host)||void 0===c||null===(u=c.ownerDocument)||void 0===u||!u.contains(a));}return s}(e))return !e.getClientRects().length;if("legacy-full"!==n)return  true}return  false},Tt=function(e,t){return !(t.disabled||kt(t)||function(e){return Et(e)&&"hidden"===e.type}(t)||Pt(t,e)||function(e){return "DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some(function(e){return "SUMMARY"===e.tagName})}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var o=t.children.item(n);if("LEGEND"===o.tagName)return !!bt.call(t,"fieldset[disabled] *")||!o.contains(e)}return  true}t=t.parentElement;}return  false}(t))},At=function(e,t){return !(It(t)||Nt(t)<0||!Tt(e,t))},Ot=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return !!(isNaN(t)||t>=0)},Lt=function e(t){var n=[],o=[];return t.forEach(function(t,i){var r=!!t.scopeParent,a=r?t.scopeParent:t,s=function(e,t){var n=Nt(e);return n<0&&t&&!St(e)?0:n}(a,r),l=r?e(t.candidates):a;0===s?r?n.push.apply(n,l):n.push(a):o.push({documentOrder:i,tabIndex:s,item:t,isScope:r,content:l});}),o.sort(Dt).reduce(function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e},[]).concat(n)},Ft=function(e,t){var n;return n=(t=t||{}).getShadowRoot?xt([e],t.includeContainer,{filter:At.bind(null,t),flatten:false,getShadowRoot:t.getShadowRoot,shadowRootFilter:Ot}):function(e,t,n){if(kt(e))return [];var o=Array.prototype.slice.apply(e.querySelectorAll(yt));return t&&bt.call(e,yt)&&o.unshift(e),o.filter(n)}(e,t.includeContainer,At.bind(null,t)),Lt(n)};function Bt(e,t,n){let{reference:o,floating:i}=e;const r=lt(t),a=ct(t),s=at(a),l=ot(t),c="y"===r,u=o.x+o.width/2-i.width/2,d=o.y+o.height/2-i.height/2,f=o[s]/2-i[s]/2;let m;switch(l){case "top":m={x:u,y:o.y-i.height};break;case "bottom":m={x:u,y:o.y+o.height};break;case "right":m={x:o.x+o.width,y:d};break;case "left":m={x:o.x-i.width,y:d};break;default:m={x:o.x,y:o.y};}switch(it(t)){case "start":m[a]-=f*(n&&c?-1:1);break;case "end":m[a]+=f*(n&&c?-1:1);}return m}async function Rt(e,t){var n;void 0===t&&(t={});const{x:o,y:i,platform:r,rects:a,elements:s,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:f=false,padding:m=0}=nt(t,e),p=function(e){return "number"!=typeof e?function(e){return {top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}(m),h=s[f?"floating"===d?"reference":"floating":d],g=vt(await r.getClippingRect({element:null==(n=await(null==r.isElement?void 0:r.isElement(h)))||n?h:h.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(s.floating)),boundary:c,rootBoundary:u,strategy:l})),v="floating"===d?{x:o,y:i,width:a.floating.width,height:a.floating.height}:a.reference,y=await(null==r.getOffsetParent?void 0:r.getOffsetParent(s.floating)),w=await(null==r.isElement?void 0:r.isElement(y))&&await(null==r.getScale?void 0:r.getScale(y))||{x:1,y:1},b=vt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:v,offsetParent:y,strategy:l}):v);return {top:(g.top-b.top+p.top)/w.y,bottom:(b.bottom-g.bottom+p.bottom)/w.y,left:(g.left-b.left+p.left)/w.x,right:(b.right-g.right+p.right)/w.x}}const _t=new Set(["left","top"]);function Ht(e){const t=Ee(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const i=fe(e),r=i?e.offsetWidth:n,a=i?e.offsetHeight:o,s=Ge(n)!==r||Ge(o)!==a;return s&&(n=r,o=a),{width:n,height:o,$:s}}function $t(e){return de(e)?e:e.contextElement}function jt(e){const t=$t(e);if(!fe(t))return Xe(1);const n=t.getBoundingClientRect(),{width:o,height:i,$:r}=Ht(t);let a=(r?Ge(n.width):n.width)/o,s=(r?Ge(n.height):n.height)/i;return a&&Number.isFinite(a)||(a=1),s&&Number.isFinite(s)||(s=1),{x:a,y:s}}const zt=Xe(0);function Vt(e){const t=le(e);return Se()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:zt}function Wt(e,t,n,o){ void 0===t&&(t=false),void 0===n&&(n=false);const i=e.getBoundingClientRect(),r=$t(e);let a=Xe(1);t&&(o?de(o)&&(a=jt(o)):a=jt(e));const s=function(e,t,n){return void 0===t&&(t=false),!(!n||t&&n!==le(e))&&t}(r,n,o)?Vt(r):Xe(0);let l=(i.left+s.x)/a.x,c=(i.top+s.y)/a.y,u=i.width/a.x,d=i.height/a.y;if(r){const e=le(r),t=o&&de(o)?le(o):o;let n=e,i=Ae(n);for(;i&&o&&t!==n;){const e=jt(i),t=i.getBoundingClientRect(),o=Ee(i),r=t.left+(i.clientLeft+parseFloat(o.paddingLeft))*e.x,a=t.top+(i.clientTop+parseFloat(o.paddingTop))*e.y;l*=e.x,c*=e.y,u*=e.x,d*=e.y,l+=r,c+=a,n=le(i),i=Ae(n);}}return vt({width:u,height:d,x:l,y:c})}function Yt(e,t){const n=Ie(e).scrollLeft;return t?t.left+n:Wt(ce(e)).left+n}function Ut(e,t,n){ void 0===n&&(n=false);const o=e.getBoundingClientRect();return {x:o.left+t.scrollLeft-(n?0:Yt(e,o)),y:o.top+t.scrollTop}}const Kt=new Set(["absolute","fixed"]);function Jt(e,t,n){let o;if("viewport"===t)o=function(e,t){const n=le(e),o=ce(e),i=n.visualViewport;let r=o.clientWidth,a=o.clientHeight,s=0,l=0;if(i){r=i.width,a=i.height;const e=Se();(!e||e&&"fixed"===t)&&(s=i.offsetLeft,l=i.offsetTop);}return {width:r,height:a,x:s,y:l}}(e,n);else if("document"===t)o=function(e){const t=ce(e),n=Ie(e),o=e.ownerDocument.body,i=qe(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=qe(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let a=-n.scrollLeft+Yt(e);const s=-n.scrollTop;return "rtl"===Ee(o).direction&&(a+=qe(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:a,y:s}}(ce(e));else if(de(t))o=function(e,t){const n=Wt(e,true,"fixed"===t),o=n.top+e.clientTop,i=n.left+e.clientLeft,r=fe(e)?jt(e):Xe(1);return {width:e.clientWidth*r.x,height:e.clientHeight*r.y,x:i*r.x,y:o*r.y}}(t,n);else {const n=Vt(e);o={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height};}return vt(o)}function qt(e,t){const n=Me(e);return !(n===t||!de(n)||De(n))&&("fixed"===Ee(n).position||qt(n,t))}function Gt(e,t,n){const o=fe(t),i=ce(t),r="fixed"===n,a=Wt(e,true,r,t);let s={scrollLeft:0,scrollTop:0};const l=Xe(0);function c(){l.x=Yt(i);}if(o||!o&&!r)if(("body"!==se(t)||he(i))&&(s=Ie(t)),o){const e=Wt(t,true,r,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop;}else i&&c();r&&!o&&i&&c();const u=!i||o||r?Xe(0):Ut(i,s);return {x:a.left+s.scrollLeft-l.x-u.x,y:a.top+s.scrollTop-l.y-u.y,width:a.width,height:a.height}}function Qt(e){return "static"===Ee(e).position}function Xt(e,t){if(!fe(e)||"fixed"===Ee(e).position)return null;if(t)return t(e);let n=e.offsetParent;return ce(e)===n&&(n=n.ownerDocument.body),n}function Zt(e,t){const n=le(e);if(we(e))return n;if(!fe(e)){let t=Me(e);for(;t&&!De(t);){if(de(t)&&!Qt(t))return t;t=Me(t);}return n}let o=Xt(e,t);for(;o&&ve(o)&&Qt(o);)o=Xt(o,t);return o&&De(o)&&Qt(o)&&!xe(o)?n:o||function(e){let t=Me(e);for(;fe(t)&&!De(t);){if(xe(t))return t;if(we(t))return null;t=Me(t);}return null}(e)||n}const en={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:o,strategy:i}=e;const r="fixed"===i,a=ce(o),s=!!t&&we(t.floating);if(o===a||s&&r)return n;let l={scrollLeft:0,scrollTop:0},c=Xe(1);const u=Xe(0),d=fe(o);if((d||!d&&!r)&&(("body"!==se(o)||he(a))&&(l=Ie(o)),fe(o))){const e=Wt(o);c=jt(o),u.x=e.x+o.clientLeft,u.y=e.y+o.clientTop;}const f=!a||d||r?Xe(0):Ut(a,l,true);return {width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-l.scrollLeft*c.x+u.x+f.x,y:n.y*c.y-l.scrollTop*c.y+u.y+f.y}},getDocumentElement:ce,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:o,strategy:i}=e;const r=[..."clippingAncestors"===n?we(t)?[]:function(e,t){const n=t.get(e);if(n)return n;let o=Te(e,[],false).filter(e=>de(e)&&"body"!==se(e)),i=null;const r="fixed"===Ee(e).position;let a=r?Me(e):e;for(;de(a)&&!De(a);){const t=Ee(a),n=xe(a);n||"fixed"!==t.position||(i=null),(r?!n&&!i:!n&&"static"===t.position&&i&&Kt.has(i.position)||he(a)&&!n&&qt(e,a))?o=o.filter(e=>e!==a):i=t,a=Me(a);}return t.set(e,o),o}(t,this._c):[].concat(n),o],a=r[0],s=r.reduce((e,n)=>{const o=Jt(t,n,i);return e.top=qe(o.top,e.top),e.right=Je(o.right,e.right),e.bottom=Je(o.bottom,e.bottom),e.left=qe(o.left,e.left),e},Jt(t,a,i));return {width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:Zt,getElementRects:async function(e){const t=this.getOffsetParent||Zt,n=this.getDimensions,o=await n(e.floating);return {reference:Gt(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=Ht(e);return {width:t,height:n}},getScale:jt,isElement:de,isRTL:function(e){return "rtl"===Ee(e).direction}};function tn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function nn(e,t,n,o){ void 0===o&&(o={});const{ancestorScroll:i=true,ancestorResize:r=true,elementResize:a="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=false}=o,c=$t(e),u=i||r?[...c?Te(c):[],...Te(t)]:[];u.forEach(e=>{i&&e.addEventListener("scroll",n,{passive:true}),r&&e.addEventListener("resize",n);});const d=c&&s?function(e,t){let n,o=null;const i=ce(e);function r(){var e;clearTimeout(n),null==(e=o)||e.disconnect(),o=null;}return function a(s,l){ void 0===s&&(s=false),void 0===l&&(l=1),r();const c=e.getBoundingClientRect(),{left:u,top:d,width:f,height:m}=c;if(s||t(),!f||!m)return;const p={rootMargin:-Qe(d)+"px "+-Qe(i.clientWidth-(u+f))+"px "+-Qe(i.clientHeight-(d+m))+"px "+-Qe(u)+"px",threshold:qe(0,Je(1,l))||1};let h=true;function g(t){const o=t[0].intersectionRatio;if(o!==l){if(!h)return a();o?a(false,o):n=setTimeout(()=>{a(false,1e-7);},1e3);}1!==o||tn(c,e.getBoundingClientRect())||a(),h=false;}try{o=new IntersectionObserver(g,{...p,root:i.ownerDocument});}catch(e){o=new IntersectionObserver(g,p);}o.observe(e);}(true),r}(c,n):null;let f,m=-1,p=null;a&&(p=new ResizeObserver(e=>{let[o]=e;o&&o.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var e;null==(e=p)||e.observe(t);})),n();}),c&&!l&&p.observe(c),p.observe(t));let h=l?Wt(e):null;return l&&function t(){const o=Wt(e);h&&!tn(h,o)&&n();h=o,f=requestAnimationFrame(t);}(),n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener("scroll",n),r&&e.removeEventListener("resize",n);}),null==d||d(),null==(e=p)||e.disconnect(),p=null,l&&cancelAnimationFrame(f);}}const on=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,o;const{x:i,y:r,placement:a,middlewareData:s}=t,l=await async function(e,t){const{placement:n,platform:o,elements:i}=e,r=await(null==o.isRTL?void 0:o.isRTL(i.floating)),a=ot(n),s=it(n),l="y"===lt(n),c=_t.has(a)?-1:1,u=r&&l?-1:1,d=nt(t,e);let{mainAxis:f,crossAxis:m,alignmentAxis:p}="number"==typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&"number"==typeof p&&(m="end"===s?-1*p:p),l?{x:m*u,y:f*c}:{x:f*c,y:m*u}}(t,e);return a===(null==(n=s.offset)?void 0:n.placement)&&null!=(o=s.arrow)&&o.alignmentOffset?{}:{x:i+l.x,y:r+l.y,data:{...l,placement:a}}}}},rn=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:i}=t,{mainAxis:r=true,crossAxis:a=false,limiter:s={fn:e=>{let{x:t,y:n}=e;return {x:t,y:n}}},...l}=nt(e,t),c={x:n,y:o},u=await Rt(t,l),d=lt(ot(i)),f=rt(d);let m=c[f],p=c[d];if(r){const e="y"===f?"bottom":"right";m=tt(m+u["y"===f?"top":"left"],m,m-u[e]);}if(a){const e="y"===d?"bottom":"right";p=tt(p+u["y"===d?"top":"left"],p,p-u[e]);}const h=s.fn({...t,[f]:m,[d]:p});return {...h,data:{x:h.x-n,y:h.y-o,enabled:{[f]:r,[d]:a}}}}}},an=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:i,middlewareData:r,rects:a,initialPlacement:s,platform:l,elements:c}=t,{mainAxis:u=true,crossAxis:d=true,fallbackPlacements:f,fallbackStrategy:m="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:h=true,...g}=nt(e,t);if(null!=(n=r.arrow)&&n.alignmentOffset)return {};const v=ot(i),y=lt(s),w=ot(s)===s,b=await(null==l.isRTL?void 0:l.isRTL(c.floating)),C=f||(w||!h?[gt(s)]:function(e){const t=gt(e);return [ut(e),t,ut(t)]}(s)),k="none"!==p;!f&&k&&C.push(...ht(s,h,p,b));const x=[s,...C],S=await Rt(t,g),N=[];let D=(null==(o=r.flip)?void 0:o.overflows)||[];if(u&&N.push(S[v]),d){const e=function(e,t,n){ void 0===n&&(n=false);const o=it(e),i=ct(e),r=at(i);let a="x"===i?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return t.reference[r]>t.floating[r]&&(a=gt(a)),[a,gt(a)]}(i,a,b);N.push(S[e[0]],S[e[1]]);}if(D=[...D,{placement:i,overflows:N}],!N.every(e=>e<=0)){var E,I;const e=((null==(E=r.flip)?void 0:E.index)||0)+1,t=x[e];if(t){if(!("alignment"===d&&y!==lt(t))||D.every(e=>lt(e.placement)!==y||e.overflows[0]>0))return {data:{index:e,overflows:D},reset:{placement:t}}}let n=null==(I=D.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:I.placement;if(!n)switch(m){case "bestFit":{var M;const e=null==(M=D.filter(e=>{if(k){const t=lt(e.placement);return t===y||"y"===t}return  true}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:M[0];e&&(n=e);break}case "initialPlacement":n=s;}if(i!==n)return {reset:{placement:n}}}return {}}}},sn=(e,t,n)=>{const o=new Map,i={platform:en,...n},r={...i.platform,_c:o};return (async(e,t,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:a}=n,s=r.filter(Boolean),l=await(null==a.isRTL?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=Bt(c,o,l),f=o,m={},p=0;for(let n=0;n<s.length;n++){const{name:r,fn:h}=s[n],{x:g,y:v,data:y,reset:w}=await h({x:u,y:d,initialPlacement:o,placement:f,strategy:i,middlewareData:m,rects:c,platform:a,elements:{reference:e,floating:t}});u=null!=g?g:u,d=null!=v?v:d,m={...m,[r]:{...m[r],...y}},w&&p<=50&&(p++,"object"==typeof w&&(w.placement&&(f=w.placement),w.rects&&(c=true===w.rects?await a.getElementRects({reference:e,floating:t,strategy:i}):w.rects),({x:u,y:d}=Bt(c,f,l))),n=-1);}return {x:u,y:d,placement:f,strategy:i,middlewareData:m}})(e,t,{...i,platform:r})};var ln="undefined"!=typeof document?reactExports.useLayoutEffect:function(){};function cn(e,t){if(e===t)return  true;if(typeof e!=typeof t)return  false;if("function"==typeof e&&e.toString()===t.toString())return  true;let n,o,i;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if(n=e.length,n!==t.length)return  false;for(o=n;0!==o--;)if(!cn(e[o],t[o]))return  false;return  true}if(i=Object.keys(e),n=i.length,n!==Object.keys(t).length)return  false;for(o=n;0!==o--;)if(!{}.hasOwnProperty.call(t,i[o]))return  false;for(o=n;0!==o--;){const n=i[o];if(("_owner"!==n||!e.$$typeof)&&!cn(e[n],t[n]))return  false}return  true}return e!=e&&t!=t}function un(e){if("undefined"==typeof window)return 1;return (e.ownerDocument.defaultView||window).devicePixelRatio||1}function dn(e,t){const n=un(e);return Math.round(t*n)/n}function fn(e){const t=reactExports.useRef(e);return ln(()=>{t.current=e;}),t}const mn=(e,t)=>({...rn(e),options:[e,t]}),pn=(e,t)=>({...an(e),options:[e,t]});function hn(e){return reactExports.useMemo(()=>e.every(e=>null==e)?null:t=>{e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t);});},e)}const gn={...o},vn=gn.useInsertionEffect||(e=>e());function yn(e){const t=reactExports.useRef(()=>{});return vn(()=>{t.current=e;}),reactExports.useCallback(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return null==t.current?void 0:t.current(...n)},[])}const wn="ArrowUp",bn="ArrowDown",Cn="ArrowLeft",kn="ArrowRight";function xn(e,t,n){return Math.floor(e/t)!==n}function Sn(e,t){return t<0||t>=e.current.length}function Nn(e,t){return En(e,{disabledIndices:t})}function Dn(e,t){return En(e,{decrement:true,startingIndex:e.current.length,disabledIndices:t})}function En(e,t){let{startingIndex:n=-1,decrement:o=false,disabledIndices:i,amount:r=1}=void 0===t?{}:t;const a=e.current;let s=n;do{s+=o?-r:r;}while(s>=0&&s<=a.length-1&&Pn(a,s,i));return s}function In(e,t,n,o,i){if(-1===e)return  -1;const r=n.indexOf(e),a=t[e];switch(i){case "tl":return r;case "tr":return a?r+a.width-1:r;case "bl":return a?r+(a.height-1)*o:r;case "br":return n.lastIndexOf(e)}}function Mn(e,t){return t.flatMap((t,n)=>e.includes(t)?[n]:[])}function Pn(e,t,n){if(n)return n.includes(t);const o=e[t];return null==o||o.hasAttribute("disabled")||"true"===o.getAttribute("aria-disabled")}var Tn="undefined"!=typeof document?reactExports.useLayoutEffect:reactExports.useEffect;function An(e,t){const n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING||n&Node.DOCUMENT_POSITION_CONTAINED_BY?-1:n&Node.DOCUMENT_POSITION_PRECEDING||n&Node.DOCUMENT_POSITION_CONTAINS?1:0}const On=reactExports.createContext({register:()=>{},unregister:()=>{},map:new Map,elementsRef:{current:[]}});function Ln(e){const{children:t,elementsRef:n,labelsRef:i}=e,[r,a]=reactExports.useState(()=>new Map),s=reactExports.useCallback(e=>{a(t=>new Map(t).set(e,null));},[]),l=reactExports.useCallback(e=>{a(t=>{const n=new Map(t);return n.delete(e),n});},[]);return Tn(()=>{const e=new Map(r);Array.from(e.keys()).sort(An).forEach((t,n)=>{e.set(t,n);}),function(e,t){if(e.size!==t.size)return  false;for(const[n,o]of e.entries())if(o!==t.get(n))return  false;return  true}(r,e)||a(e);},[r]),reactExports.createElement(On.Provider,{value:reactExports.useMemo(()=>({register:s,unregister:l,map:r,elementsRef:n,labelsRef:i}),[s,l,r,n,i])},t)}function Fn(e){ void 0===e&&(e={});const{label:t}=e,{register:n,unregister:i,map:r,elementsRef:a,labelsRef:s}=reactExports.useContext(On),[l,c]=reactExports.useState(null),u=reactExports.useRef(null),d=reactExports.useCallback(e=>{if(u.current=e,null!==l&&(a.current[l]=e,s)){var n;const o=void 0!==t;s.current[l]=o?t:null!=(n=null==e?void 0:e.textContent)?n:null;}},[l,a,s,t]);return Tn(()=>{const e=u.current;if(e)return n(e),()=>{i(e);}},[n,i]),Tn(()=>{const e=u.current?r.get(u.current):null;null!=e&&c(e);},[r]),reactExports.useMemo(()=>({ref:d,index:null==l?-1:l}),[l,d])}function Bn(){return Bn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e},Bn.apply(this,arguments)}let Rn=false,_n=0;const Hn=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+_n++;const $n=gn.useId||function(){const[e,t]=reactExports.useState(()=>Rn?Hn():void 0);return Tn(()=>{null==e&&t(Hn());},[]),reactExports.useEffect(()=>{Rn=true;},[]),e};function Vn(){const e=new Map;return {emit(t,n){var o;null==(o=e.get(t))||o.forEach(e=>e(n));},on(t,n){e.set(t,[...e.get(t)||[],n]);},off(t,n){var o;e.set(t,(null==(o=e.get(t))?void 0:o.filter(e=>e!==n))||[]);}}}const Wn=reactExports.createContext(null),Yn=reactExports.createContext(null),Un=()=>{var e;return (null==(e=reactExports.useContext(Wn))?void 0:e.id)||null},Kn=()=>reactExports.useContext(Yn);function Jn(e){const{children:t,id:n}=e,i=Un();return reactExports.createElement(Wn.Provider,{value:reactExports.useMemo(()=>({id:n,parentId:i}),[n,i])},t)}function qn(e){const{children:t}=e,n=reactExports.useRef([]),i=reactExports.useCallback(e=>{n.current=[...n.current,e];},[]),r=reactExports.useCallback(e=>{n.current=n.current.filter(t=>t!==e);},[]),a=reactExports.useState(()=>Vn())[0];return reactExports.createElement(Yn.Provider,{value:reactExports.useMemo(()=>({nodesRef:n,addNode:i,removeNode:r,events:a}),[i,r,a])},t)}function Gn(e){return "data-floating-ui-"+e}function Qn(e){const t=reactExports.useRef(e);return Tn(()=>{t.current=e;}),t}const Xn=Gn("safe-polygon");function Zn(e,t,n){return n&&!je(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}let eo=0;function to(e,t){ void 0===t&&(t={});const{preventScroll:n=false,cancelPrevious:o=true,sync:i=false}=t;o&&cancelAnimationFrame(eo);const r=()=>null==e?void 0:e.focus({preventScroll:n});i?r():eo=requestAnimationFrame(r);}function no(e,t){let n=e.filter(e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)}),o=n;for(;o.length;)o=e.filter(e=>{var t;return null==(t=o)?void 0:t.some(t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)})}),n=n.concat(o);return n}let oo=new WeakMap,io=new WeakSet,ro={},ao=0;const so=e=>e&&(e.host||so(e.parentNode));function lo(e,t,n,o){const i="data-floating-ui-inert",r=o?"inert":n?"aria-hidden":null,a=((e,t)=>t.map(t=>{if(e.contains(t))return t;const n=so(t);return e.contains(n)?n:null}).filter(e=>null!=e))(t,e),s=new Set,l=new Set(a),c=[];ro[i]||(ro[i]=new WeakMap);const u=ro[i];return a.forEach(function e(t){if(!t||s.has(t))return;s.add(t),t.parentNode&&e(t.parentNode);}),function e(t){if(!t||l.has(t))return;[].forEach.call(t.children,t=>{if("script"!==se(t))if(s.has(t))e(t);else {const e=r?t.getAttribute(r):null,n=null!==e&&"false"!==e,o=(oo.get(t)||0)+1,a=(u.get(t)||0)+1;oo.set(t,o),u.set(t,a),c.push(t),1===o&&n&&io.add(t),1===a&&t.setAttribute(i,""),!n&&r&&t.setAttribute(r,"true");}});}(t),s.clear(),ao++,()=>{c.forEach(e=>{const t=(oo.get(e)||0)-1,n=(u.get(e)||0)-1;oo.set(e,t),u.set(e,n),t||(!io.has(e)&&r&&e.removeAttribute(r),io.delete(e)),n||e.removeAttribute(i);}),ao--,ao||(oo=new WeakMap,oo=new WeakMap,io=new WeakSet,ro={});}}function co(e,t,n){ void 0===t&&(t=false),void 0===n&&(n=false);const o=ze(e[0]).body;return lo(e.concat(Array.from(o.querySelectorAll("[aria-live]"))),o,t,n)}const uo=()=>({getShadowRoot:true,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function fo(e,t){const n=Ft(e,uo());"prev"===t&&n.reverse();const o=n.indexOf(Oe(ze(e)));return n.slice(o+1)[0]}function mo(e,t){const n=t||e.currentTarget,o=e.relatedTarget;return !o||!Le(n,o)}const po={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function ho(e){"Tab"===e.key&&(e.target,clearTimeout(undefined));}const go=reactExports.forwardRef(function(e,t){const[n,i]=reactExports.useState();Tn(()=>(He()&&i("button"),document.addEventListener("keydown",ho),()=>{document.removeEventListener("keydown",ho);}),[]);const r={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[Gn("focus-guard")]:"",style:po};return reactExports.createElement("span",Bn({},e,r))}),vo=reactExports.createContext(null),yo="data-floating-ui-focusable";function wo(e){return e?e.hasAttribute(yo)?e:e.querySelector("["+yo+"]")||e:null}let bo=[];function Co(e){bo=bo.filter(e=>e.isConnected);let t=e;if(t&&"body"!==se(t)){if(!function(e,t){if(t=t||{},!e)throw new Error("No node provided");return  false!==bt.call(e,yt)&&At(t,e)}(t,uo())){const e=Ft(t,uo())[0];e&&(t=e);}bo.push(t),bo.length>20&&(bo=bo.slice(-20));}}function ko(){return bo.slice().reverse().find(e=>e.isConnected)}const xo=reactExports.forwardRef(function(e,t){return reactExports.createElement("button",Bn({},e,{type:"button",ref:t,tabIndex:-1,style:po}))});function So(e){const{context:t,children:n,disabled:i=false,order:r=["content"],guards:a=true,initialFocus:s=0,returnFocus:l=true,restoreFocus:c=false,modal:u=true,visuallyHiddenDismiss:d=false,closeOnFocusOut:f=true}=e,{open:m,refs:p,nodeId:h,onOpenChange:g,events:v,dataRef:y,floatingId:w,elements:{domReference:b,floating:C}}=t,k="number"==typeof s&&s<0,x=Ke(b)&&k,S="undefined"==typeof HTMLElement||!("inert"in HTMLElement.prototype)||a,N=Qn(r),D=Qn(s),E=Qn(l),I=Kn(),M=reactExports.useContext(vo),P=reactExports.useRef(null),T=reactExports.useRef(null),A=reactExports.useRef(false),O=reactExports.useRef(false),L=reactExports.useRef(-1),F=null!=M,B=wo(C),R=yn(function(e){return void 0===e&&(e=B),e?Ft(e,uo()):[]}),_=yn(e=>{const t=R(e);return N.current.map(e=>b&&"reference"===e?b:B&&"floating"===e?B:t).filter(Boolean).flat()});function H(e){return !i&&d&&u?reactExports.createElement(xo,{ref:"start"===e?P:T,onClick:e=>g(false,e.nativeEvent)},"string"==typeof d?d:"Dismiss"):null}reactExports.useEffect(()=>{if(i)return;if(!u)return;function e(e){if("Tab"===e.key){Le(B,Oe(ze(B)))&&0===R().length&&!x&&Ue(e);const t=_(),n=We(e);"reference"===N.current[0]&&n===b&&(Ue(e),e.shiftKey?to(t[t.length-1]):to(t[1])),"floating"===N.current[1]&&n===B&&e.shiftKey&&(Ue(e),to(t[0]));}}const t=ze(B);return t.addEventListener("keydown",e),()=>{t.removeEventListener("keydown",e);}},[i,b,B,u,N,x,R,_]),reactExports.useEffect(()=>{if(!i&&C)return C.addEventListener("focusin",e),()=>{C.removeEventListener("focusin",e);};function e(e){const t=We(e),n=R().indexOf(t);-1!==n&&(L.current=n);}},[i,C,R]),reactExports.useEffect(()=>{if(!i&&f)return C&&fe(b)?(b.addEventListener("focusout",t),b.addEventListener("pointerdown",e),C.addEventListener("focusout",t),()=>{b.removeEventListener("focusout",t),b.removeEventListener("pointerdown",e),C.removeEventListener("focusout",t);}):void 0;function e(){O.current=true,setTimeout(()=>{O.current=false;});}function t(e){const t=e.relatedTarget;queueMicrotask(()=>{const n=!(Le(b,t)||Le(C,t)||Le(t,C)||Le(null==M?void 0:M.portalNode,t)||null!=t&&t.hasAttribute(Gn("focus-guard"))||I&&(no(I.nodesRef.current,h).find(e=>{var n,o;return Le(null==(n=e.context)?void 0:n.elements.floating,t)||Le(null==(o=e.context)?void 0:o.elements.domReference,t)})||function(e,t){var n;let o=[],i=null==(n=e.find(e=>e.id===t))?void 0:n.parentId;for(;i;){const t=e.find(e=>e.id===i);i=null==t?void 0:t.parentId,t&&(o=o.concat(t));}return o}(I.nodesRef.current,h).find(e=>{var n,o;return (null==(n=e.context)?void 0:n.elements.floating)===t||(null==(o=e.context)?void 0:o.elements.domReference)===t})));if(c&&n&&Oe(ze(B))===ze(B).body){fe(B)&&B.focus();const e=L.current,t=R(),n=t[e]||t[t.length-1]||B;fe(n)&&n.focus();}!x&&u||!t||!n||O.current||t===ko()||(A.current=true,g(false,e,"focus-out"));});}},[i,b,C,B,u,h,I,M,g,f,c,R,x]),reactExports.useEffect(()=>{var e;if(i)return;const t=Array.from((null==M||null==(e=M.portalNode)?void 0:e.querySelectorAll("["+Gn("portal")+"]"))||[]);if(C){const e=[C,...t,P.current,T.current,N.current.includes("reference")||x?b:null].filter(e=>null!=e),n=u||x?co(e,S,!S):co(e);return ()=>{n();}}},[i,b,C,u,N,M,x,S]),Tn(()=>{if(i||!fe(B))return;const e=Oe(ze(B));queueMicrotask(()=>{const t=_(B),n=D.current,o=("number"==typeof n?t[n]:n.current)||B,i=Le(B,e);k||i||!m||to(o,{preventScroll:o===B});});},[i,m,B,k,_,D]),Tn(()=>{if(i||!B)return;let e=false;const t=ze(B),n=Oe(t);let o=y.current.openEvent;function r(t){let{open:n,reason:i,event:r,nested:a}=t;n&&(o=r),"escape-key"===i&&p.domReference.current&&Co(p.domReference.current),"hover"===i&&"mouseleave"===r.type&&(A.current=true),"outside-press"===i&&(a?(A.current=false,e=true):A.current=!(Re(r)||_e(r)));}Co(n),v.on("openchange",r);const a=t.createElement("span");return a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),Object.assign(a.style,po),F&&b&&b.insertAdjacentElement("afterend",a),()=>{v.off("openchange",r);const n=Oe(t),i=Le(C,n)||I&&no(I.nodesRef.current,h).some(e=>{var t;return Le(null==(t=e.context)?void 0:t.elements.floating,n)});(i||o&&["click","mousedown"].includes(o.type))&&p.domReference.current&&Co(p.domReference.current);const s="boolean"==typeof E.current?ko()||a:E.current.current||a;queueMicrotask(()=>{E.current&&!A.current&&fe(s)&&(s===n||n===t.body||i)&&s.focus({preventScroll:e}),a.remove();});}},[i,C,B,E,y,p,v,I,h,F,b]),reactExports.useEffect(()=>{queueMicrotask(()=>{A.current=false;});},[i]),Tn(()=>{if(!i&&M)return M.setFocusManagerState({modal:u,closeOnFocusOut:f,open:m,onOpenChange:g,refs:p}),()=>{M.setFocusManagerState(null);}},[i,M,u,m,g,p,f]),Tn(()=>{if(i)return;if(!B)return;if("function"!=typeof MutationObserver)return;if(k)return;const e=()=>{const e=B.getAttribute("tabindex"),t=R(),n=Oe(ze(C)),o=t.indexOf(n);-1!==o&&(L.current=o),N.current.includes("floating")||n!==p.domReference.current&&0===t.length?"0"!==e&&B.setAttribute("tabindex","0"):"-1"!==e&&B.setAttribute("tabindex","-1");};e();const t=new MutationObserver(e);return t.observe(B,{childList:true,subtree:true,attributes:true}),()=>{t.disconnect();}},[i,C,B,p,N,R,k]);const $=!i&&S&&(!u||!x)&&(F||u);return reactExports.createElement(reactExports.Fragment,null,$&&reactExports.createElement(go,{"data-type":"inside",ref:null==M?void 0:M.beforeInsideRef,onFocus:e=>{if(u){const e=_();to("reference"===r[0]?e[0]:e[e.length-1]);}else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(A.current=false,mo(e,M.portalNode)){const e=fo(document.body,"next")||b;null==e||e.focus();}else {var t;null==(t=M.beforeOutsideRef.current)||t.focus();}}}),!x&&H("start"),n,H("end"),$&&reactExports.createElement(go,{"data-type":"inside",ref:null==M?void 0:M.afterInsideRef,onFocus:e=>{if(u)to(_()[0]);else if(null!=M&&M.preserveTabOrder&&M.portalNode)if(f&&(A.current=true),mo(e,M.portalNode)){const e=fo(document.body,"prev")||b;null==e||e.focus();}else {var t;null==(t=M.afterOutsideRef.current)||t.focus();}}}))}function No(e){return fe(e.target)&&"BUTTON"===e.target.tagName}function Do(e){return Ye(e)}const Eo={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},Io={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},Mo=e=>{var t,n;return {escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function Po(e){const{open:t=false,onOpenChange:n,elements:i}=e,r=$n(),a=reactExports.useRef({}),[s]=reactExports.useState(()=>Vn()),l=null!=Un();const[c,u]=reactExports.useState(i.reference),d=yn((e,t,o)=>{a.current.openEvent=e?t:void 0,s.emit("openchange",{open:e,event:t,reason:o,nested:l}),null==n||n(e,t,o);}),f=reactExports.useMemo(()=>({setPositionReference:u}),[]),m=reactExports.useMemo(()=>({reference:c||i.reference||null,floating:i.floating||null,domReference:i.reference}),[c,i.reference,i.floating]);return reactExports.useMemo(()=>({dataRef:a,open:t,onOpenChange:d,elements:m,events:s,floatingId:r,refs:f}),[t,d,m,s,r,f])}function To(e){ void 0===e&&(e={});const{nodeId:t}=e,n=Po({...e,elements:{reference:null,floating:null,...e.elements}}),i=e.rootContext||n,r=i.elements,[a,s]=reactExports.useState(null),[l,c]=reactExports.useState(null),u=(null==r?void 0:r.domReference)||a,d=reactExports.useRef(null),f=Kn();Tn(()=>{u&&(d.current=u);},[u]);const m=function(e){ void 0===e&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:i=[],platform:r,elements:{reference:a,floating:s}={},transform:l=true,whileElementsMounted:c,open:u}=e,[d,f]=reactExports.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:false}),[m,p]=reactExports.useState(i);cn(m,i)||p(i);const[h,g]=reactExports.useState(null),[y,w]=reactExports.useState(null),b=reactExports.useCallback(e=>{e!==S.current&&(S.current=e,g(e));},[]),C=reactExports.useCallback(e=>{e!==N.current&&(N.current=e,w(e));},[]),k=a||h,x=s||y,S=reactExports.useRef(null),N=reactExports.useRef(null),D=reactExports.useRef(d),E=null!=c,I=fn(c),M=fn(r),P=fn(u),T=reactExports.useCallback(()=>{if(!S.current||!N.current)return;const e={placement:t,strategy:n,middleware:m};M.current&&(e.platform=M.current),sn(S.current,N.current,e).then(e=>{const t={...e,isPositioned:false!==P.current};A.current&&!cn(D.current,t)&&(D.current=t,reactDomExports.flushSync(()=>{f(t);}));});},[m,t,n,M,P]);ln(()=>{ false===u&&D.current.isPositioned&&(D.current.isPositioned=false,f(e=>({...e,isPositioned:false})));},[u]);const A=reactExports.useRef(false);ln(()=>(A.current=true,()=>{A.current=false;}),[]),ln(()=>{if(k&&(S.current=k),x&&(N.current=x),k&&x){if(I.current)return I.current(k,x,T);T();}},[k,x,T,I,E]);const O=reactExports.useMemo(()=>({reference:S,floating:N,setReference:b,setFloating:C}),[b,C]),L=reactExports.useMemo(()=>({reference:k,floating:x}),[k,x]),F=reactExports.useMemo(()=>{const e={position:n,left:0,top:0};if(!L.floating)return e;const t=dn(L.floating,d.x),o=dn(L.floating,d.y);return l?{...e,transform:"translate("+t+"px, "+o+"px)",...un(L.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:o}},[n,l,L.floating,d.x,d.y]);return reactExports.useMemo(()=>({...d,update:T,refs:O,elements:L,floatingStyles:F}),[d,T,O,L,F])}({...e,elements:{...r,...l&&{reference:l}}}),p=reactExports.useCallback(e=>{const t=de(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c(t),m.refs.setReference(t);},[m.refs]),h=reactExports.useCallback(e=>{(de(e)||null===e)&&(d.current=e,s(e)),(de(m.refs.reference.current)||null===m.refs.reference.current||null!==e&&!de(e))&&m.refs.setReference(e);},[m.refs]),g=reactExports.useMemo(()=>({...m.refs,setReference:h,setPositionReference:p,domReference:d}),[m.refs,h,p]),y=reactExports.useMemo(()=>({...m.elements,domReference:u}),[m.elements,u]),w=reactExports.useMemo(()=>({...m,...i,refs:g,elements:y,nodeId:t}),[m,g,y,t,i]);return Tn(()=>{i.dataRef.current.floatingContext=w;const e=null==f?void 0:f.nodesRef.current.find(e=>e.id===t);e&&(e.context=w);}),reactExports.useMemo(()=>({...m,context:w,refs:g,elements:y}),[m,g,y,w])}const Ao="active",Oo="selected";function Lo(e,t,n){const o=new Map,i="item"===n;let r=e;if(i&&e){const{[Ao]:t,[Oo]:n,...o}=e;r=o;}return {..."floating"===n&&{tabIndex:-1,[yo]:""},...r,...t.map(t=>{const o=t?t[n]:null;return "function"==typeof o?e?o(e):null:o}).concat(e).reduce((e,t)=>t?(Object.entries(t).forEach(t=>{let[n,r]=t;var a;i&&[Ao,Oo].includes(n)||(0===n.indexOf("on")?(o.has(n)||o.set(n,[]),"function"==typeof r&&(null==(a=o.get(n))||a.push(r),e[n]=function(){for(var e,t=arguments.length,i=new Array(t),r=0;r<t;r++)i[r]=arguments[r];return null==(e=o.get(n))?void 0:e.map(e=>e(...i)).find(e=>void 0!==e)})):e[n]=r);}),e):e,{})}}let Fo=false;function Bo(e,t,n){switch(e){case "vertical":return t;case "horizontal":return n;default:return t||n}}function Ro(e,t){return Bo(t,e===wn||e===bn,e===Cn||e===kn)}function _o(e,t,n){return Bo(t,e===bn,n?e===Cn:e===kn)||"Enter"===e||" "===e||""===e}function Ho(e,t,n){return Bo(t,n?e===kn:e===Cn,e===wn)}function $o(e,t){const{open:n,onOpenChange:i,elements:r}=e,{listRef:a,activeIndex:s,onNavigate:l=()=>{},enabled:c=true,selectedIndex:u=null,allowEscape:d=false,loop:f=false,nested:m=false,rtl:p=false,virtual:h=false,focusItemOnOpen:g="auto",focusItemOnHover:v=true,openOnArrowKeyDown:y=true,disabledIndices:w,orientation:b="vertical",cols:C=1,scrollItemIntoView:k=true,virtualItemRef:x,itemSizes:S,dense:N=false}=t;const D=Qn(wo(r.floating)),E=Un(),I=Kn(),M=yn(l),P=Ke(r.domReference),T=reactExports.useRef(g),A=reactExports.useRef(null!=u?u:-1),O=reactExports.useRef(null),L=reactExports.useRef(true),F=reactExports.useRef(M),B=reactExports.useRef(!!r.floating),R=reactExports.useRef(n),_=reactExports.useRef(false),H=reactExports.useRef(false),$=Qn(w),j=Qn(n),z=Qn(k),V=Qn(u),[W,Y]=reactExports.useState(),[U,K]=reactExports.useState(),J=yn(function(e,t,n){function o(e){h?(Y(e.id),null==I||I.events.emit("virtualfocus",e),x&&(x.current=e)):to(e,{preventScroll:true,sync:!(!Fe().toLowerCase().startsWith("mac")||navigator.maxTouchPoints||!He())&&(Fo||_.current)});} void 0===n&&(n=false);const i=e.current[t.current];i&&o(i),requestAnimationFrame(()=>{const r=e.current[t.current]||i;if(!r)return;i||o(r);const a=z.current;a&&G&&(n||!L.current)&&(null==r.scrollIntoView||r.scrollIntoView("boolean"==typeof a?{block:"nearest",inline:"nearest"}:a));});});Tn(()=>{document.createElement("div").focus({get preventScroll(){return Fo=true,false}});},[]),Tn(()=>{c&&(n&&r.floating?T.current&&null!=u&&(H.current=true,A.current=u,M(u)):B.current&&(A.current=-1,F.current(null)));},[c,n,r.floating,u,M]),Tn(()=>{if(c&&n&&r.floating)if(null==s){if(_.current=false,null!=V.current)return;if(B.current&&(A.current=-1,J(a,A)),(!R.current||!B.current)&&T.current&&(null!=O.current||true===T.current&&null==O.current)){let e=0;const t=()=>{if(null==a.current[0]){if(e<2){(e?requestAnimationFrame:queueMicrotask)(t);}e++;}else A.current=null==O.current||_o(O.current,b,p)||m?Nn(a,$.current):Dn(a,$.current),O.current=null,M(A.current);};t();}}else Sn(a,s)||(A.current=s,J(a,A,H.current),H.current=false);},[c,n,r.floating,s,V,m,a,b,p,M,J,$]),Tn(()=>{var e;if(!c||r.floating||!I||h||!B.current)return;const t=I.nodesRef.current,n=null==(e=t.find(e=>e.id===E))||null==(e=e.context)?void 0:e.elements.floating,o=Oe(ze(r.floating)),i=t.some(e=>e.context&&Le(e.context.elements.floating,o));n&&!i&&L.current&&n.focus({preventScroll:true});},[c,r.floating,I,E,h]),Tn(()=>{if(c&&I&&h&&!E)return I.events.on("virtualfocus",e),()=>{I.events.off("virtualfocus",e);};function e(e){K(e.id),x&&(x.current=e);}},[c,I,h,E,x]),Tn(()=>{F.current=M,B.current=!!r.floating;}),Tn(()=>{n||(O.current=null);},[n]),Tn(()=>{R.current=n;},[n]);const q=null!=s,G=reactExports.useMemo(()=>{function e(e){if(!n)return;const t=a.current.indexOf(e);-1!==t&&M(t);}return {onFocus(t){let{currentTarget:n}=t;e(n);},onClick:e=>{let{currentTarget:t}=e;return t.focus({preventScroll:true})},...v&&{onMouseMove(t){let{currentTarget:n}=t;e(n);},onPointerLeave(e){let{pointerType:t}=e;L.current&&"touch"!==t&&(A.current=-1,J(a,A),M(null),h||to(D.current,{preventScroll:true}));}}}},[n,D,J,v,a,M,h]),Q=yn(e=>{if(L.current=false,_.current=true,229===e.which)return;if(!j.current&&e.currentTarget===D.current)return;if(m&&Ho(e.key,b,p))return Ue(e),i(false,e.nativeEvent,"list-navigation"),void(fe(r.domReference)&&(h?null==I||I.events.emit("virtualfocus",r.domReference):r.domReference.focus()));const t=A.current,o=Nn(a,w),s=Dn(a,w);if(P||("Home"===e.key&&(Ue(e),A.current=o,M(A.current)),"End"===e.key&&(Ue(e),A.current=s,M(A.current))),C>1){const t=S||Array.from({length:a.current.length},()=>({width:1,height:1})),n=function(e,t,n){const o=[];let i=0;return e.forEach((e,r)=>{let{width:a,height:s}=e;let l=false;for(n&&(i=0);!l;){const e=[];for(let n=0;n<a;n++)for(let o=0;o<s;o++)e.push(i+n+o*t);i%t+a<=t&&e.every(e=>null==o[e])?(e.forEach(e=>{o[e]=r;}),l=true):i++;}}),[...o]}(t,C,N),i=n.findIndex(e=>null!=e&&!Pn(a.current,e,w)),r=n.reduce((e,t,n)=>null==t||Pn(a.current,t,w)?e:n,-1),l=n[function(e,t){let{event:n,orientation:o,loop:i,rtl:r,cols:a,disabledIndices:s,minIndex:l,maxIndex:c,prevIndex:u,stopEvent:d=false}=t,f=u;if(n.key===wn){if(d&&Ue(n),-1===u)f=c;else if(f=En(e,{startingIndex:f,amount:a,decrement:true,disabledIndices:s}),i&&(u-a<l||f<0)){const e=u%a,t=c%a,n=c-(t-e);f=t===e?c:t>e?n:n-a;}Sn(e,f)&&(f=u);}if(n.key===bn&&(d&&Ue(n),-1===u?f=l:(f=En(e,{startingIndex:u,amount:a,disabledIndices:s}),i&&u+a>c&&(f=En(e,{startingIndex:u%a-a,amount:a,disabledIndices:s}))),Sn(e,f)&&(f=u)),"both"===o){const t=Qe(u/a);n.key===(r?Cn:kn)&&(d&&Ue(n),u%a!==a-1?(f=En(e,{startingIndex:u,disabledIndices:s}),i&&xn(f,a,t)&&(f=En(e,{startingIndex:u-u%a-1,disabledIndices:s}))):i&&(f=En(e,{startingIndex:u-u%a-1,disabledIndices:s})),xn(f,a,t)&&(f=u)),n.key===(r?kn:Cn)&&(d&&Ue(n),u%a!==0?(f=En(e,{startingIndex:u,decrement:true,disabledIndices:s}),i&&xn(f,a,t)&&(f=En(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s}))):i&&(f=En(e,{startingIndex:u+(a-u%a),decrement:true,disabledIndices:s})),xn(f,a,t)&&(f=u));const o=Qe(c/a)===t;Sn(e,f)&&(f=i&&o?n.key===(r?kn:Cn)?c:En(e,{startingIndex:u-u%a-1,disabledIndices:s}):u);}return f}({current:n.map(e=>null!=e?a.current[e]:null)},{event:e,orientation:b,loop:f,rtl:p,cols:C,disabledIndices:Mn([...w||a.current.map((e,t)=>Pn(a.current,t)?t:void 0),void 0],n),minIndex:i,maxIndex:r,prevIndex:In(A.current>s?o:A.current,t,n,C,e.key===bn?"bl":e.key===(p?Cn:kn)?"tr":"tl"),stopEvent:true})];if(null!=l&&(A.current=l,M(A.current)),"both"===b)return}if(Ro(e.key,b)){if(Ue(e),n&&!h&&Oe(e.currentTarget.ownerDocument)===e.currentTarget)return A.current=_o(e.key,b,p)?o:s,void M(A.current);_o(e.key,b,p)?A.current=f?t>=s?d&&t!==a.current.length?-1:o:En(a,{startingIndex:t,disabledIndices:w}):Math.min(s,En(a,{startingIndex:t,disabledIndices:w})):A.current=f?t<=o?d&&-1!==t?a.current.length:s:En(a,{startingIndex:t,decrement:true,disabledIndices:w}):Math.max(o,En(a,{startingIndex:t,decrement:true,disabledIndices:w})),Sn(a,A.current)?M(null):M(A.current);}}),X=reactExports.useMemo(()=>h&&n&&q&&{"aria-activedescendant":U||W},[h,n,q,U,W]),Z=reactExports.useMemo(()=>({"aria-orientation":"both"===b?void 0:b,...!Ke(r.domReference)&&X,onKeyDown:Q,onPointerMove(){L.current=true;}}),[X,Q,r.domReference,b]),ee=reactExports.useMemo(()=>{function e(e){"auto"===g&&Re(e.nativeEvent)&&(T.current=true);}return {...X,onKeyDown(e){L.current=false;const t=e.key.startsWith("Arrow"),o=["Home","End"].includes(e.key),r=t||o,s=function(e,t,n){return Bo(t,n?e===Cn:e===kn,e===bn)}(e.key,b,p),l=Ho(e.key,b,p),c=Ro(e.key,b),d=(m?s:c)||"Enter"===e.key||""===e.key.trim();if(h&&n){const t=null==I?void 0:I.nodesRef.current.find(e=>null==e.parentId),n=I&&t?function(e,t){let n,o=-1;return function t(i,r){r>o&&(n=i,o=r),no(e,i).forEach(e=>{t(e.id,r+1);});}(t,0),e.find(e=>e.id===n)}(I.nodesRef.current,t.id):null;if(r&&n&&x){const t=new KeyboardEvent("keydown",{key:e.key,bubbles:true});if(s||l){var f,g;const o=(null==(f=n.context)?void 0:f.elements.domReference)===e.currentTarget,i=l&&!o?null==(g=n.context)?void 0:g.elements.domReference:s?a.current.find(e=>(null==e?void 0:e.id)===W):null;i&&(Ue(e),i.dispatchEvent(t),K(void 0));}var v;if((c||o)&&n.context)if(n.context.open&&n.parentId&&e.currentTarget!==n.context.elements.domReference)return Ue(e),void(null==(v=n.context.elements.domReference)||v.dispatchEvent(t))}return Q(e)}(n||y||!t)&&(d&&(O.current=m&&c?null:e.key),m?s&&(Ue(e),n?(A.current=Nn(a,$.current),M(A.current)):i(true,e.nativeEvent,"list-navigation")):c&&(null!=u&&(A.current=u),Ue(e),!n&&y?i(true,e.nativeEvent,"list-navigation"):Q(e),n&&M(A.current)));},onFocus(){n&&!h&&M(null);},onPointerDown:function(e){T.current=g,"auto"===g&&_e(e.nativeEvent)&&(T.current=true);},onMouseDown:e,onClick:e}},[W,X,Q,$,g,a,m,M,i,n,y,b,p,u,I,h,x]);return reactExports.useMemo(()=>c?{reference:ee,floating:Z,item:G}:{},[c,ee,Z,G])}const jo=new Map([["select","listbox"],["combobox","listbox"],["label",false]]);function zo(e,t){const[n,o]=e;let i=false;const r=t.length;for(let e=0,a=r-1;e<r;a=e++){const[r,s]=t[e]||[0,0],[l,c]=t[a]||[0,0];s>=o!=c>=o&&n<=(l-r)*(o-s)/(c-s)+r&&(i=!i);}return i}function Vo(e){ void 0===e&&(e={});const{buffer:t=.5,blockPointerEvents:n=false,requireIntent:o=true}=e;let i,r=false,a=null,s=null,l=performance.now();const c=e=>{let{x:n,y:c,placement:u,elements:d,onClose:f,nodeId:m,tree:p}=e;return function(e){function h(){clearTimeout(i),f();}if(clearTimeout(i),!d.domReference||!d.floating||null==u||null==n||null==c)return;const{clientX:g,clientY:v}=e,y=[g,v],w=We(e),b="mouseleave"===e.type,C=Le(d.floating,w),k=Le(d.domReference,w),x=d.domReference.getBoundingClientRect(),S=d.floating.getBoundingClientRect(),N=u.split("-")[0],D=n>S.right-S.width/2,E=c>S.bottom-S.height/2,I=function(e,t){return e[0]>=t.x&&e[0]<=t.x+t.width&&e[1]>=t.y&&e[1]<=t.y+t.height}(y,x),M=S.width>x.width,P=S.height>x.height,T=(M?x:S).left,A=(M?x:S).right,O=(P?x:S).top,L=(P?x:S).bottom;if(C&&(r=true,!b))return;if(k&&(r=false),k&&!b)return void(r=true);if(b&&de(e.relatedTarget)&&Le(d.floating,e.relatedTarget))return;if(p&&no(p.nodesRef.current,m).some(e=>{let{context:t}=e;return null==t?void 0:t.open}))return;if("top"===N&&c>=x.bottom-1||"bottom"===N&&c<=x.top+1||"left"===N&&n>=x.right-1||"right"===N&&n<=x.left+1)return h();let F=[];switch(N){case "top":F=[[T,x.top+1],[T,S.bottom-1],[A,S.bottom-1],[A,x.top+1]];break;case "bottom":F=[[T,S.top+1],[T,x.bottom-1],[A,x.bottom-1],[A,S.top+1]];break;case "left":F=[[S.right-1,L],[S.right-1,O],[x.left+1,O],[x.left+1,L]];break;case "right":F=[[x.right-1,L],[x.right-1,O],[S.left+1,O],[S.left+1,L]];}if(!zo([g,v],F)){if(r&&!I)return h();if(!b&&o){const t=function(e,t){const n=performance.now(),o=n-l;if(null===a||null===s||0===o)return a=e,s=t,l=n,null;const i=e-a,r=t-s,c=Math.sqrt(i*i+r*r);return a=e,s=t,l=n,c/o}(e.clientX,e.clientY);if(null!==t&&t<.1)return h()}zo([g,v],function(e){let[n,o]=e;switch(N){case "top":return [[M?n+t/2:D?n+4*t:n-4*t,o+t+1],[M?n-t/2:D?n+4*t:n-4*t,o+t+1],...[[S.left,D||M?S.bottom-t:S.top],[S.right,D?M?S.bottom-t:S.top:S.bottom-t]]];case "bottom":return [[M?n+t/2:D?n+4*t:n-4*t,o-t],[M?n-t/2:D?n+4*t:n-4*t,o-t],...[[S.left,D||M?S.top+t:S.bottom],[S.right,D?M?S.top+t:S.bottom:S.top+t]]];case "left":{const e=[n+t+1,P?o+t/2:E?o+4*t:o-4*t],i=[n+t+1,P?o-t/2:E?o+4*t:o-4*t];return [...[[E||P?S.right-t:S.left,S.top],[E?P?S.right-t:S.left:S.right-t,S.bottom]],e,i]}case "right":return [[n-t,P?o+t/2:E?o+4*t:o-4*t],[n-t,P?o-t/2:E?o+4*t:o-4*t],...[[E||P?S.left+t:S.right,S.top],[E?P?S.left+t:S.right:S.left+t,S.bottom]]]}}([n,c]))?!r&&o&&(i=window.setTimeout(h,40)):h();}}};return c.__options={blockPointerEvents:n},c}const Wo=reactExports.createContext({getItemProps:()=>({}),activeIndex:null,setActiveIndex:()=>{},setHasFocusInside:()=>{},isOpen:false,setIsOpen:()=>{}}),Yo=reactExports.forwardRef(({className:t,disabled:n,children:o,...i},r)=>{const a=reactExports.useContext(Wo),s=Fn(),c=Kn(),u=s.index===a.activeIndex,d=x("io-dropdown-menu-item",n&&"io-dropdown-menu-item-disabled",t);return jsxRuntimeExports.jsx("div",{ref:hn([s.ref,r]),role:"menuitem",className:d,tabIndex:u?0:-1,"aria-disabled":n,...i,...a.getItemProps({onClick(e){if(n)return e.preventDefault(),void e.stopPropagation();i.onClick?.(e),a.setIsOpen(false),c?.events.emit("click");},onFocus(e){n||(i.onFocus?.(e),a.setHasFocusInside(true));}}),children:o})});Yo.displayName="DropdownMenuItem";const Uo=reactExports.forwardRef(({className:n,variant:i="default",icon:r,iconRight:a,text:s="",disabled:m,children:p,...h},g)=>{const[v,y]=reactExports.useState(false),[w,b]=reactExports.useState(false),[C,k]=reactExports.useState(null),S=reactExports.useRef([]),N=reactExports.useRef([]),D=reactExports.useContext(Wo),E=Kn(),I=function(){const e=$n(),t=Kn(),n=Un();return Tn(()=>{const o={id:e,parentId:n};return null==t||t.addNode(o),()=>{null==t||t.removeNode(o);}},[t,e,n]),e}(),M=Un(),P=Fn(),T=null!=M,{floatingStyles:O,refs:L,context:F}=To({nodeId:I,open:v,onOpenChange:y,placement:T?"right-start":"bottom-start",middleware:[(B={mainAxis:T?0:4,alignmentAxis:T?-4:0},{...on(B),options:[B,R]}),pn(),mn()],whileElementsMounted:nn});var B,R;const _=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,events:a,elements:s}=e,{enabled:l=true,delay:c=0,handleClose:u=null,mouseOnly:d=false,restMs:f=0,move:m=true}=t,p=Kn(),h=Un(),g=Qn(u),v=Qn(c),y=Qn(n),w=reactExports.useRef(),b=reactExports.useRef(-1),C=reactExports.useRef(),k=reactExports.useRef(-1),x=reactExports.useRef(true),S=reactExports.useRef(false),N=reactExports.useRef(()=>{}),D=reactExports.useRef(false),E=reactExports.useCallback(()=>{var e;const t=null==(e=r.current.openEvent)?void 0:e.type;return (null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[r]);reactExports.useEffect(()=>{if(l)return a.on("openchange",e),()=>{a.off("openchange",e);};function e(e){let{open:t}=e;t||(clearTimeout(b.current),clearTimeout(k.current),x.current=true,D.current=false);}},[l,a]),reactExports.useEffect(()=>{if(!l)return;if(!g.current)return;if(!n)return;function e(e){E()&&i(false,e,"hover");}const t=ze(s.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e);}},[s.floating,n,i,l,g,E]);const I=reactExports.useCallback(function(e,t,n){ void 0===t&&(t=true),void 0===n&&(n="hover");const o=Zn(v.current,"close",w.current);o&&!C.current?(clearTimeout(b.current),b.current=window.setTimeout(()=>i(false,e,n),o)):t&&(clearTimeout(b.current),i(false,e,n));},[v,i]),M=yn(()=>{N.current(),C.current=void 0;}),P=yn(()=>{if(S.current){const e=ze(s.floating).body;e.style.pointerEvents="",e.removeAttribute(Xn),S.current=false;}}),T=yn(()=>!!r.current.openEvent&&["click","mousedown"].includes(r.current.openEvent.type));reactExports.useEffect(()=>{if(l&&de(s.domReference)){var e;const i=s.domReference;return n&&i.addEventListener("mouseleave",a),null==(e=s.floating)||e.addEventListener("mouseleave",a),m&&i.addEventListener("mousemove",t,{once:true}),i.addEventListener("mouseenter",t),i.addEventListener("mouseleave",o),()=>{var e;n&&i.removeEventListener("mouseleave",a),null==(e=s.floating)||e.removeEventListener("mouseleave",a),m&&i.removeEventListener("mousemove",t),i.removeEventListener("mouseenter",t),i.removeEventListener("mouseleave",o);}}function t(e){if(clearTimeout(b.current),x.current=false,d&&!je(w.current)||f>0&&!Zn(v.current,"open"))return;const t=Zn(v.current,"open",w.current);t?b.current=window.setTimeout(()=>{y.current||i(true,e,"hover");},t):n||i(true,e,"hover");}function o(e){if(T())return;N.current();const t=ze(s.floating);if(clearTimeout(k.current),D.current=false,g.current&&r.current.floatingContext){n||clearTimeout(b.current),C.current=g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){P(),M(),T()||I(e,true,"safe-polygon");}});const o=C.current;return t.addEventListener("mousemove",o),void(N.current=()=>{t.removeEventListener("mousemove",o);})}("touch"!==w.current||!Le(s.floating,e.relatedTarget))&&I(e);}function a(e){T()||r.current.floatingContext&&(null==g.current||g.current({...r.current.floatingContext,tree:p,x:e.clientX,y:e.clientY,onClose(){P(),M(),T()||I(e);}})(e));}},[s,l,e,d,f,m,I,M,P,i,n,y,p,v,g,r,T]),Tn(()=>{var e;if(l&&n&&null!=(e=g.current)&&e.__options.blockPointerEvents&&E()){S.current=true;const e=s.floating;if(de(s.domReference)&&e){var t;const n=ze(s.floating).body;n.setAttribute(Xn,"");const o=s.domReference,i=null==p||null==(t=p.nodesRef.current.find(e=>e.id===h))||null==(t=t.context)?void 0:t.elements.floating;return i&&(i.style.pointerEvents=""),n.style.pointerEvents="none",o.style.pointerEvents="auto",e.style.pointerEvents="auto",()=>{n.style.pointerEvents="",o.style.pointerEvents="",e.style.pointerEvents="";}}}},[l,n,h,s,p,g,E]),Tn(()=>{n||(w.current=void 0,D.current=false,M(),P());},[n,M,P]),reactExports.useEffect(()=>()=>{M(),clearTimeout(b.current),clearTimeout(k.current),P();},[l,s.domReference,M,P]);const A=reactExports.useMemo(()=>{function e(e){w.current=e.pointerType;}return {onPointerDown:e,onPointerEnter:e,onMouseMove(e){const{nativeEvent:t}=e;function o(){x.current||y.current||i(true,t,"hover");}d&&!je(w.current)||n||0===f||D.current&&e.movementX**2+e.movementY**2<2||(clearTimeout(k.current),"touch"===w.current?o():(D.current=true,k.current=window.setTimeout(o,f)));}}},[d,i,n,y,f]),O=reactExports.useMemo(()=>({onMouseEnter(){clearTimeout(b.current);},onMouseLeave(e){T()||I(e.nativeEvent,false);}}),[I,T]);return reactExports.useMemo(()=>l?{reference:A,floating:O}:{},[l,A,O])}(F,{enabled:T,delay:{open:75},handleClose:Vo({blockPointerEvents:true})}),H=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,dataRef:r,elements:{domReference:a}}=e,{enabled:s=true,event:l="click",toggle:c=true,ignoreMouse:u=false,keyboardHandlers:d=true,stickIfOpen:f=true}=t,m=reactExports.useRef(),p=reactExports.useRef(false),h=reactExports.useMemo(()=>({onPointerDown(e){m.current=e.pointerType;},onMouseDown(e){const t=m.current;0===e.button&&"click"!==l&&(je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"mousedown"!==r.current.openEvent.type?(e.preventDefault(),i(true,e.nativeEvent,"click")):i(false,e.nativeEvent,"click")));},onClick(e){const t=m.current;"mousedown"===l&&m.current?m.current=void 0:je(t,true)&&u||(!n||!c||r.current.openEvent&&f&&"click"!==r.current.openEvent.type?i(true,e.nativeEvent,"click"):i(false,e.nativeEvent,"click"));},onKeyDown(e){m.current=void 0,e.defaultPrevented||!d||No(e)||(" "!==e.key||Do(a)||(e.preventDefault(),p.current=true),"Enter"===e.key&&i(!n||!c,e.nativeEvent,"click"));},onKeyUp(e){e.defaultPrevented||!d||No(e)||Do(a)||" "===e.key&&p.current&&(p.current=false,i(!n||!c,e.nativeEvent,"click"));}}),[r,a,l,u,d,i,n,f,c]);return reactExports.useMemo(()=>s?{reference:h}:{},[s,h])}(F,{event:"mousedown",toggle:!T,ignoreMouse:T}),$=function(e,t){var n;void 0===t&&(t={});const{open:i,floatingId:r}=e,{enabled:a=true,role:s="dialog"}=t,l=null!=(n=jo.get(s))?n:s,c=$n(),u=null!=Un(),d=reactExports.useMemo(()=>"tooltip"===l||"label"===s?{["aria-"+("label"===s?"labelledby":"describedby")]:i?r:void 0}:{"aria-expanded":i?"true":"false","aria-haspopup":"alertdialog"===l?"dialog":l,"aria-controls":i?r:void 0,..."listbox"===l&&{role:"combobox"},..."menu"===l&&{id:c},..."menu"===l&&u&&{role:"menuitem"},..."select"===s&&{"aria-autocomplete":"none"},..."combobox"===s&&{"aria-autocomplete":"list"}},[l,r,u,i,c,s]),f=reactExports.useMemo(()=>{const e={id:r,...l&&{role:l}};return "tooltip"===l||"label"===s?e:{...e,..."menu"===l&&{"aria-labelledby":c}}},[l,r,c,s]),m=reactExports.useCallback(e=>{let{active:t,selected:n}=e;const o={role:"option",...t&&{id:r+"-option"}};switch(s){case "select":return {...o,"aria-selected":t&&n};case "combobox":return {...o,...t&&{"aria-selected":true}}}return {}},[r,s]);return reactExports.useMemo(()=>a?{reference:d,floating:f,item:m}:{},[a,d,f,m])}(F,{role:"menu"}),j=function(e,t){ void 0===t&&(t={});const{open:n,onOpenChange:i,elements:r,dataRef:a}=e,{enabled:s=true,escapeKey:l=true,outsidePress:c=true,outsidePressEvent:u="pointerdown",referencePress:d=false,referencePressEvent:f="pointerdown",ancestorScroll:m=false,bubbles:p,capture:h}=t,g=Kn(),v=yn("function"==typeof c?c:()=>false),y="function"==typeof c?v:c,w=reactExports.useRef(false),b=reactExports.useRef(false),{escapeKey:C,outsidePress:k}=Mo(p),{escapeKey:x,outsidePress:S}=Mo(h),N=reactExports.useRef(false),D=yn(e=>{var t;if(!n||!s||!l||"Escape"!==e.key)return;if(N.current)return;const o=null==(t=a.current.floatingContext)?void 0:t.nodeId,r=g?no(g.nodesRef.current,o):[];if(!C&&(e.stopPropagation(),r.length>0)){let e=true;if(r.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__escapeKeyBubbles||(e=false);}),!e)return}i(false,function(e){return "nativeEvent"in e}(e)?e.nativeEvent:e,"escape-key");}),E=yn(e=>{var t;const n=()=>{var t;D(e),null==(t=We(e))||t.removeEventListener("keydown",n);};null==(t=We(e))||t.addEventListener("keydown",n);}),I=yn(e=>{var t;const n=w.current;w.current=false;const o=b.current;if(b.current=false,"click"===u&&o)return;if(n)return;if("function"==typeof y&&!y(e))return;const s=We(e),l="["+Gn("inert")+"]",c=ze(r.floating).querySelectorAll(l);let d=de(s)?s:null;for(;d&&!De(d);){const e=Me(d);if(De(e)||!de(e))break;d=e;}if(c.length&&de(s)&&!s.matches("html,body")&&!Le(s,r.floating)&&Array.from(c).every(e=>!Le(d,e)))return;if(fe(s)&&T){const t=s.clientWidth>0&&s.scrollWidth>s.clientWidth,n=s.clientHeight>0&&s.scrollHeight>s.clientHeight;let o=n&&e.offsetX>s.clientWidth;if(n&&"rtl"===Ee(s).direction&&(o=e.offsetX<=s.offsetWidth-s.clientWidth),o||t&&e.offsetY>s.clientHeight)return}const f=null==(t=a.current.floatingContext)?void 0:t.nodeId,m=g&&no(g.nodesRef.current,f).some(t=>{var n;return Ve(e,null==(n=t.context)?void 0:n.elements.floating)});if(Ve(e,r.floating)||Ve(e,r.domReference)||m)return;const p=g?no(g.nodesRef.current,f):[];if(p.length>0){let e=true;if(p.forEach(t=>{var n;null==(n=t.context)||!n.open||t.context.dataRef.current.__outsidePressBubbles||(e=false);}),!e)return}i(false,e,"outside-press");}),M=yn(e=>{var t;const n=()=>{var t;I(e),null==(t=We(e))||t.removeEventListener(u,n);};null==(t=We(e))||t.addEventListener(u,n);});reactExports.useEffect(()=>{if(!n||!s)return;a.current.__escapeKeyBubbles=C,a.current.__outsidePressBubbles=k;let e=-1;function t(e){i(false,e,"ancestor-scroll");}function o(){window.clearTimeout(e),N.current=true;}function c(){e=window.setTimeout(()=>{N.current=false;},Se()?5:0);}const d=ze(r.floating);l&&(d.addEventListener("keydown",x?E:D,x),d.addEventListener("compositionstart",o),d.addEventListener("compositionend",c)),y&&d.addEventListener(u,S?M:I,S);let f=[];return m&&(de(r.domReference)&&(f=Te(r.domReference)),de(r.floating)&&(f=f.concat(Te(r.floating))),!de(r.reference)&&r.reference&&r.reference.contextElement&&(f=f.concat(Te(r.reference.contextElement)))),f=f.filter(e=>{var t;return e!==(null==(t=d.defaultView)?void 0:t.visualViewport)}),f.forEach(e=>{e.addEventListener("scroll",t,{passive:true});}),()=>{l&&(d.removeEventListener("keydown",x?E:D,x),d.removeEventListener("compositionstart",o),d.removeEventListener("compositionend",c)),y&&d.removeEventListener(u,S?M:I,S),f.forEach(e=>{e.removeEventListener("scroll",t);}),window.clearTimeout(e);}},[a,r,l,y,u,n,i,m,s,C,k,D,x,E,I,S,M]),reactExports.useEffect(()=>{w.current=false;},[y,u]);const P=reactExports.useMemo(()=>({onKeyDown:D,[Eo[f]]:e=>{d&&i(false,e.nativeEvent,"reference-press");}}),[D,i,d,f]),T=reactExports.useMemo(()=>({onKeyDown:D,onMouseDown(){b.current=true;},onMouseUp(){b.current=true;},[Io[u]]:()=>{w.current=true;}}),[D,u]);return reactExports.useMemo(()=>s?{reference:P,floating:T}:{},[s,P,T])}(F,{bubbles:true}),z=$o(F,{listRef:S,activeIndex:C,nested:T,onNavigate:k}),{getReferenceProps:V,getFloatingProps:W,getItemProps:Y}=function(e){ void 0===e&&(e=[]);const t=e.map(e=>null==e?void 0:e.reference),n=e.map(e=>null==e?void 0:e.floating),i=e.map(e=>null==e?void 0:e.item),r=reactExports.useCallback(t=>Lo(t,e,"reference"),t),a=reactExports.useCallback(t=>Lo(t,e,"floating"),n),s=reactExports.useCallback(t=>Lo(t,e,"item"),i);return reactExports.useMemo(()=>({getReferenceProps:r,getFloatingProps:a,getItemProps:s}),[r,a,s])}([_,H,$,j,z]);reactExports.useEffect(()=>{if(E)return E.events.on("click",e),E.events.on("menuopen",t),()=>{E.events.off("click",e),E.events.off("menuopen",t);};function e(){y(false);}function t(e){e.nodeId!==I&&e.parentId===M&&y(false);}},[E,I,M]),reactExports.useEffect(()=>{v&&E&&E.events.emit("menuopen",{parentId:M,nodeId:I});},[E,v,I,M]);const U={activeIndex:C,setActiveIndex:k,getItemProps:Y,setHasFocusInside:b,isOpen:v,setIsOpen:y},K=reactExports.useMemo(()=>U,[C,k,Y,b,v]),J=x("io-dropdown-menu-button",T&&"io-dropdown-menu-item",v&&!T&&"active",n),q=hn([L.setReference,P.ref,g]),G=D.activeIndex===P.index?0:-1;return jsxRuntimeExports.jsxs(Jn,{id:I,children:[jsxRuntimeExports.jsx(A,{className:J,ref:q,variant:T?"link":i,tabIndex:T?G:void 0,role:T?"menuitem":void 0,"data-open":v?"":void 0,"data-nested":T?"":void 0,"data-focus-inside":w?"":void 0,text:s,icon:T?"chevron-right":r,iconSize:"10",iconRight:!!T||a,disabled:m,...V(D.getItemProps({onFocus(e){h.onFocus?.(e),b(false),D.setHasFocusInside(true);},...h}))}),jsxRuntimeExports.jsx(Wo.Provider,{value:K,children:jsxRuntimeExports.jsx(Ln,{elementsRef:S,labelsRef:N,children:v&&jsxRuntimeExports.jsx(So,{context:F,modal:false,initialFocus:T?-1:0,returnFocus:!T,children:jsxRuntimeExports.jsx("div",{ref:L.setFloating,className:"io-dropdown-menu",style:O,...W(),children:p})})})})]})});Uo.displayName="DropdownMenu";const Ko=reactExports.forwardRef(({...t},n)=>null===Un()?jsxRuntimeExports.jsx(qn,{children:jsxRuntimeExports.jsx(Uo,{ref:n,...t})}):jsxRuntimeExports.jsx(Uo,{ref:n,...t}));function qo({className:n,size:o="large",variant:i="default",align:r="up",text:a,...s}){const l=x("io-loader",{[`io-loader-${i}`]:"default"!==i},"normal"===o&&"io-loader-md","small"===o&&"io-loader-sm",r&&[`direction-${r}`],n);return jsxRuntimeExports.jsxs("div",{className:l,role:"status","aria-live":"polite",...s,children:[jsxRuntimeExports.jsx("div",{className:"io-loader-icon"}),a&&jsxRuntimeExports.jsx("div",{className:"io-loader-text",children:a})]})}function Go({className:t,children:n,...o}){const i=x("io-panel-header",t);return jsxRuntimeExports.jsx(ee,{className:i,...o,children:n})}Ko.displayName="DropdownMenu",Ko.Item=Yo,Ko.Separator=q,Go.Title=M,Go.ButtonGroup=Z,Go.Button=A,Go.ButtonIcon=N,Go.Dropdown=X;const Qo=reactExports.forwardRef(({className:t,children:n,...o},i)=>{const r=x("io-panel-body",t);return jsxRuntimeExports.jsx("div",{className:r,ref:i,"data-testid":"panel-body",...o,children:n})});function Xo({className:t,...n}){const o=x("io-panel-footer",t);return jsxRuntimeExports.jsx(oe,{className:o,...n})}function Zo({className:t,children:n,...o}){const i=x("io-panel",t);return jsxRuntimeExports.jsx("div",{className:i,"data-testid":"panel",...o,children:n})}function ei({className:t,variant:n="default",children:o,...i}){const r=x("io-pill","default"!==n&&[`io-pill-${n}`],t);return jsxRuntimeExports.jsx("div",{className:r,role:"status",...i,children:o})}function ti({className:t,variant:n="active",value:o=0,...i}){const r=x("io-progress",n,t);let a;return a=o<0?0:o>100?100:o,jsxRuntimeExports.jsx("div",{className:r,role:"progressbar","aria-valuenow":a,"aria-valuemin":0,"aria-valuemax":100,...i,children:jsxRuntimeExports.jsx("div",{className:"io-progress-bar",style:{width:`${a}%`}})})}
/*!
 * OverlayScrollbars
 * Version: 2.12.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */Qo.displayName="PanelBody",Xo.ButtonGroup=Z,Xo.Button=A,Xo.ButtonIcon=N,Xo.Dropdown=X,Zo.Header=Go,Zo.Body=Qo,Zo.Footer=Xo,ei.Icon=S;const ni=(e,t)=>{const{o:n,i:o,u:i}=e;let r,a=n;const s=(e,t)=>{const n=a,s=e,l=t||(o?!o(n,s):n!==s);return (l||i)&&(a=s,r=n),[a,l,r]};return [t?e=>s(t(a,r),e):s,e=>[a,!!e,r]]},oi="undefined"!=typeof window&&"undefined"!=typeof HTMLElement&&!!window.document?window:{},ii=Math.max,ri=Math.min,ai=Math.round,si=Math.abs,li=Math.sign,ci=oi.cancelAnimationFrame,ui=oi.requestAnimationFrame,di=oi.setTimeout,fi=oi.clearTimeout,mi=e=>void 0!==oi[e]?oi[e]:void 0,pi=mi("MutationObserver"),hi=mi("IntersectionObserver"),gi=mi("ResizeObserver"),vi=mi("ScrollTimeline"),yi=e=>void 0===e,wi=e=>null===e,bi=e=>"number"==typeof e,Ci=e=>"string"==typeof e,ki=e=>"boolean"==typeof e,xi=e=>"function"==typeof e,Si=e=>Array.isArray(e),Ni=e=>"object"==typeof e&&!Si(e)&&!wi(e),Di=e=>{const t=!!e&&e.length,n=bi(t)&&t>-1&&t%1==0;return !!(Si(e)||!xi(e)&&n)&&(!(t>0&&Ni(e))||t-1 in e)},Ei=e=>!!e&&e.constructor===Object,Ii=e=>e instanceof HTMLElement,Mi=e=>e instanceof Element;function Pi(e,t){if(Di(e))for(let n=0;n<e.length&&false!==t(e[n],n,e);n++);else e&&Pi(Object.keys(e),n=>t(e[n],n,e));return e}const Ti=(e,t)=>e.indexOf(t)>=0,Ai=(e,t)=>e.concat(t),Oi=(e,t,n)=>(!Ci(t)&&Di(t)?Array.prototype.push.apply(e,t):e.push(t),e),Li=e=>Array.from(e||[]),Fi=e=>Si(e)?e:!Ci(e)&&Di(e)?Li(e):[e],Bi=e=>!!e&&!e.length,Ri=e=>Li(new Set(e)),_i=(e,t,n)=>{Pi(e,e=>!e||e.apply(void 0,t||[])),n||(e.length=0);},Hi="paddingTop",$i="paddingRight",ji="paddingLeft",zi="paddingBottom",Vi="marginLeft",Wi="marginRight",Yi="marginBottom",Ui="overflowX",Ki="overflowY",Ji="width",qi="height",Gi="visible",Qi="hidden",Xi="scroll",Zi=(e,t,n,o)=>{if(e&&t){let o=true;return Pi(n,n=>{e[n]!==t[n]&&(o=false);}),o}return  false},er=(e,t)=>Zi(e,t,["w","h"]),tr=(e,t)=>Zi(e,t,["x","y"]),nr=(e,t)=>Zi(e,t,["t","r","b","l"]),or=(e,...t)=>e.bind(0,...t),ir=e=>{let t;const n=e?di:ui,o=e?fi:ci;return [i=>{o(t),t=n(()=>i(),xi(e)?e():e);},()=>o(t)]},rr=e=>{const t=xi(e)?e():e;if(bi(t)){const e=t?di:ui,n=t?fi:ci;return o=>{const i=e(()=>o(),t);return ()=>{n(i);}}}return t&&t._},ar=(e,t)=>{const{p:n,v:o,S:i,m:r}=t||{};let a,s,l,c;const u=function(t){s&&s(),a&&a(),c=s=a=l=void 0,e.apply(this,t);},d=e=>r&&l?r(l,e):e,f=()=>{s&&l&&u(d(l)||l);},m=function(){const e=Li(arguments),t=rr(n);if(t){const n=rr(o),r=d(e)||e,m=u.bind(0,r);s&&s(),i&&!c?(m(),c=true,s=t(()=>c=void 0)):(s=t(m),n&&!a&&(a=n(f))),l=r;}else u(e);};return m.O=f,m},sr=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),lr=e=>e?Object.keys(e):[],cr=(e,t,n,o,i,r,a)=>{const s=[t,n,o,i,r,a];return "object"==typeof e&&!wi(e)||xi(e)||(e={}),Pi(s,t=>{Pi(t,(n,o)=>{const i=t[o];if(e===i)return  true;const r=Si(i);if(i&&Ei(i)){const t=e[o];let n=t;r&&!Si(t)?n=[]:r||Ei(t)||(n={}),e[o]=cr(n,i);}else e[o]=r?i.slice():i;});}),e},ur=(e,t)=>Pi(cr({},e),(e,t,n)=>{ void 0===e?delete n[t]:e&&Ei(e)&&(n[t]=ur(e));}),dr=e=>!lr(e).length,fr=()=>{},mr=(e,t,n)=>ii(e,ri(t,n)),pr=e=>Ri((Si(e)?e:(e||"").split(" ")).filter(e=>e)),hr=(e,t)=>e&&e.getAttribute(t),gr=(e,t)=>e&&e.hasAttribute(t),vr=(e,t,n)=>{Pi(pr(t),t=>{e&&e.setAttribute(t,String(n||""));});},yr=(e,t)=>{Pi(pr(t),t=>e&&e.removeAttribute(t));},wr=(e,t)=>{const n=pr(hr(e,t)),o=or(vr,e,t),i=(e,t)=>{const o=new Set(n);return Pi(pr(e),e=>{o[t](e);}),Li(o).join(" ")};return {C:e=>o(i(e,"delete")),$:e=>o(i(e,"add")),H:e=>{const t=pr(e);return t.reduce((e,t)=>e&&n.includes(t),t.length>0)}}},br=(e,t,n)=>(wr(e,t).C(n),or(Cr,e,t,n)),Cr=(e,t,n)=>(wr(e,t).$(n),or(br,e,t,n)),kr=(e,t,n,o)=>(o?Cr:br)(e,t,n),xr=(e,t,n)=>wr(e,t).H(n),Sr=e=>wr(e,"class"),Nr=(e,t)=>{Sr(e).C(t);},Dr=(e,t)=>(Sr(e).$(t),or(Nr,e,t)),Er=(e,t)=>{const n=t?Mi(t)&&t:document;return n?Li(n.querySelectorAll(e)):[]},Ir=(e,t)=>Mi(e)&&e.matches(t),Mr=e=>Ir(e,"body"),Pr=e=>e?Li(e.childNodes):[],Tr=e=>e&&e.parentElement,Ar=(e,t)=>Mi(e)&&e.closest(t),Or=e=>document.activeElement,Lr=(e,t,n)=>{const o=Ar(e,t),i=e&&((e,t)=>{const n=t?Mi(t)&&t:document;return n&&n.querySelector(e)})(n,o),r=Ar(i,t)===o;return !(!o||!i)&&(o===e||i===e||r&&Ar(Ar(e,n),t)!==o)},Fr=e=>{Pi(Fi(e),e=>{const t=Tr(e);e&&t&&t.removeChild(e);});},Br=(e,t)=>or(Fr,e&&t&&Pi(Fi(t),t=>{t&&e.appendChild(t);}));let Rr;const _r=e=>{const t=document.createElement("div");return vr(t,"class",e),t},Hr=e=>{const t=_r(),n=Rr,o=e.trim();return t.innerHTML=n?n.createHTML(o):o,Pi(Pr(t),e=>Fr(e))},$r=(e,t)=>e.getPropertyValue(t)||e[t]||"",jr=e=>{const t=e||0;return isFinite(t)?t:0},zr=e=>jr(parseFloat(e||"")),Vr=e=>Math.round(1e4*e)/1e4,Wr=e=>`${Vr(jr(e))}px`;function Yr(e,t){e&&t&&Pi(t,(t,n)=>{try{const o=e.style,i=wi(t)||ki(t)?"":bi(t)?Wr(t):t;0===n.indexOf("--")?o.setProperty(n,i):o[n]=i;}catch(e){}});}function Ur(e,t,n){const o=Ci(t);let i=o?"":{};if(e){const r=oi.getComputedStyle(e,n)||e.style;i=o?$r(r,t):Li(t).reduce((e,t)=>(e[t]=$r(r,t),e),i);}return i}const Kr=(e,t,n)=>{const o=t?`${t}-`:"",i=n?`-${n}`:"",r=`${o}top${i}`,a=`${o}right${i}`,s=`${o}bottom${i}`,l=`${o}left${i}`,c=Ur(e,[r,a,s,l]);return {t:zr(c[r]),r:zr(c[a]),b:zr(c[s]),l:zr(c[l])}},Jr=(e,t)=>"translate"+(Ni(e)?`(${e.x},${e.y})`:`${t?"X":"Y"}(${e})`),qr={w:0,h:0},Gr=(e,t)=>t?{w:t[`${e}Width`],h:t[`${e}Height`]}:qr,Qr=e=>Gr("inner",e||oi),Xr=or(Gr,"offset"),Zr=or(Gr,"client"),ea=or(Gr,"scroll"),ta=e=>{const t=parseFloat(Ur(e,Ji))||0,n=parseFloat(Ur(e,qi))||0;return {w:t-ai(t),h:n-ai(n)}},na=e=>e.getBoundingClientRect(),oa=e=>!(!e||!e[qi]&&!e[Ji]),ia=(e,t)=>{const n=oa(e);return !oa(t)&&n},ra=(e,t,n,o)=>{Pi(pr(t),t=>{e&&e.removeEventListener(t,n,o);});},aa=(e,t,n,o)=>{var i;const r=null==(i=o&&o.T)||i,a=o&&o.I||false,s=o&&o.A||false,l={passive:r,capture:a};return or(_i,pr(t).map(t=>{const o=s?i=>{ra(e,t,o,a),n&&n(i);}:n;return e&&e.addEventListener(t,o,l),or(ra,e,t,o,a)}))},sa=e=>e.stopPropagation(),la=e=>e.preventDefault(),ca=e=>sa(e)||la(e),ua=(e,t)=>{const{x:n,y:o}=bi(t)?{x:t,y:t}:t||{};bi(n)&&(e.scrollLeft=n),bi(o)&&(e.scrollTop=o);},da=e=>({x:e.scrollLeft,y:e.scrollTop}),fa=(e,t)=>{const{D:n,M:o}=e,{w:i,h:r}=t,a=(e,t,n)=>{let o=li(e)*n,i=li(t)*n;if(o===i){const n=si(e),r=si(t);i=n>r?0:i,o=n<r?0:o;}return o=o===i?0:o,[o+0,i+0]},[s,l]=a(n.x,o.x,i),[c,u]=a(n.y,o.y,r);return {D:{x:s,y:c},M:{x:l,y:u}}},ma=({D:e,M:t})=>{const n=(e,t)=>0===e&&e<=t;return {x:n(e.x,t.x),y:n(e.y,t.y)}},pa=({D:e,M:t},n)=>{const o=(e,t,n)=>mr(0,1,(e-n)/(e-t)||0);return {x:o(e.x,t.x,n.x),y:o(e.y,t.y,n.y)}},ha=e=>{e&&e.focus&&e.focus({preventScroll:true});},ga=(e,t)=>{Pi(Fi(t),e);},va=e=>{const t=new Map,n=(e,n)=>{if(e){const o=t.get(e);ga(e=>{o&&o[e?"delete":"clear"](e);},n);}else t.forEach(e=>{e.clear();}),t.clear();},o=(e,i)=>{if(Ci(e)){const o=t.get(e)||new Set;return t.set(e,o),ga(e=>{xi(e)&&o.add(e);},i),or(n,e,i)}ki(i)&&i&&n();const r=lr(e),a=[];return Pi(r,t=>{const n=e[t];n&&Oi(a,o(t,n));}),or(_i,a)};return o(e||{}),[o,n,(e,n)=>{Pi(Li(t.get(e)),e=>{n&&!Bi(n)?e.apply(0,n):e();});}]},ya={},wa={},ba=(e,t,n)=>lr(e).map(o=>{const{static:i,instance:r}=e[o],[a,s,l]=n||[],c=n?r:i;if(c){const e=n?c(a,s,t):c(t);return (l||wa)[o]=e}}),Ca=e=>wa[e],ka="data-overlayscrollbars",xa="os-environment",Sa=`${xa}-scrollbar-hidden`,Na=`${ka}-initialize`,Da="noClipping",Ea=`${ka}-body`,Ia=ka,Ma=`${ka}-viewport`,Pa=Ui,Ta=Ki,Aa="measuring",Oa="scrollbarHidden",La=`${ka}-padding`,Fa=`${ka}-content`,Ba="os-size-observer",Ra=`${Ba}-appear`,_a=`${Ba}-listener`,Ha="os-scrollbar",$a=`${Ha}-rtl`,ja=`${Ha}-horizontal`,za=`${Ha}-vertical`,Va=`${Ha}-track`,Wa=`${Ha}-handle`,Ya=`${Ha}-visible`,Ua=`${Ha}-cornerless`,Ka=`${Ha}-interaction`,Ja=`${Ha}-unusable`,qa=`${Ha}-auto-hide`,Ga=`${qa}-hidden`,Qa=`${Ha}-wheel`,Xa=`${Va}-interactive`,Za=`${Wa}-interactive`,es=e=>0===e.indexOf(Gi),ts=(e,t)=>{if("auto"===e)return t?Xi:Qi;const n=e||Qi;return [Qi,Xi,Gi].includes(n)?n:Qi},ns=(e,t)=>{const{overflowX:n,overflowY:o}=Ur(e,[Ui,Ki]);return {x:ts(n,t.x),y:ts(o,t.y)}},os="__osScrollbarsHidingPlugin",is=e=>JSON.stringify(e,(e,t)=>{if(xi(t))throw 0;return t}),rs=(e,t)=>e?`${t}`.split(".").reduce((e,t)=>e&&sr(e,t)?e[t]:void 0,e):void 0,as={paddingAbsolute:false,showNativeOverlaidScrollbars:false,update:{elementEvents:[["img","load"]],debounce:[0,33],attributes:null,ignoreMutation:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:false,dragScroll:true,clickScroll:false,pointers:["mouse","touch","pen"]}},ss=(e,t)=>{const n={};return Pi(Ai(lr(t),lr(e)),o=>{const i=e[o],r=t[o];if(Ni(i)&&Ni(r))cr(n[o]={},ss(i,r)),dr(n[o])&&delete n[o];else if(sr(t,o)&&r!==i){let e=true;if(Si(i)||Si(r))try{is(i)===is(r)&&(e=!1);}catch(e){}e&&(n[o]=r);}}),n},ls=(e,t,n)=>o=>[rs(e,o),n||void 0!==rs(t,o)];let cs;let us;const ds=()=>{const e=(e,t,n)=>{Br(document.body,e),Br(document.body,e);const o=Zr(e),i=Xr(e),r=ta(t);return n&&Fr(e),{x:i.h-o.h+r.h,y:i.w-o.w+r.w}},t=Hr(`<div class="${xa}"><div></div><style>${`.${xa}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${xa} div{width:200%;height:200%;margin:10px 0}.${Sa}{scrollbar-width:none!important}.${Sa}::-webkit-scrollbar,.${Sa}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`}</style></div>`)[0],n=t.firstChild,o=t.lastChild,i=cs;i&&(o.nonce=i);const[r,,a]=va(),[s,l]=ni({o:e(t,n),i:tr},or(e,t,n,true)),[c]=l(),u=(e=>{let t=false;const n=Dr(e,Sa);try{t="none"===Ur(e,"scrollbar-width")||"none"===Ur(e,"display","::-webkit-scrollbar");}catch(e){}return n(),t})(t),d={x:0===c.x,y:0===c.y},f={elements:{host:null,padding:!u,viewport:e=>u&&Mr(e)&&e,content:false},scrollbars:{slot:true},cancel:{nativeScrollbarsOverlaid:false,body:null}},m=cr({},as),p=or(cr,{},m),h=or(cr,{},f),g={P:c,k:d,U:u,J:!!vi,G:or(r,"r"),K:h,Z:e=>cr(f,e)&&h(),tt:p,nt:e=>cr(m,e)&&p(),ot:cr({},f),st:cr({},m)};if(yr(t,"style"),Fr(t),aa(oi,"resize",()=>{a("r",[]);}),xi(oi.matchMedia)&&!u&&(!d.x||!d.y)){const e=t=>{const n=oi.matchMedia(`(resolution: ${oi.devicePixelRatio}dppx)`);aa(n,"change",()=>{t(),e(t);},{A:true});};e(()=>{const[e,t]=s();cr(g.P,e),a("r",[t]);});}return g},fs=()=>(us||(us=ds()),us),ms=(e,t,n,o)=>{let i=false;const{et:r,ct:a,rt:s,it:l,lt:c,ut:u}=o||{},d=ar(()=>i&&n(true),{p:33,v:99}),[f,m]=((e,t,n)=>{let o=false;const i=!!n&&new WeakMap,r=r=>{if(i&&n){const a=n.map(t=>{const[n,o]=t||[];return [o&&n?(r||Er)(n,e):[],o]});Pi(a,n=>Pi(n[0],r=>{const a=n[1],s=i.get(r)||[];if(e.contains(r)&&a){const e=aa(r,a,n=>{o?(e(),i.delete(r)):t(n);});i.set(r,Oi(s,e));}else _i(s),i.delete(r);}));}};return r(),[()=>{o=true;},r]})(e,d,s),p=a||[],h=Ai(r||[],p),g=(i,r)=>{if(!Bi(r)){const a=c||fr,s=u||fr,d=[],f=[];let h=false,g=false;if(Pi(r,n=>{const{attributeName:i,target:r,type:c,oldValue:u,addedNodes:m,removedNodes:v}=n,y="attributes"===c,w="childList"===c,b=e===r,C=y&&i,k=C&&hr(r,i||""),x=Ci(k)?k:null,S=C&&u!==x,N=Ti(p,i)&&S;if(t&&(w||!b)){const t=y&&S,c=t&&l&&Ir(r,l),f=(c?!a(r,i,u,x):!y||t)&&!s(n,!!c,e,o);Pi(m,e=>Oi(d,e)),Pi(v,e=>Oi(d,e)),g=g||f;}!t&&b&&S&&!a(r,i,u,x)&&(Oi(f,i),h=h||N);}),m(e=>Ri(d).reduce((t,n)=>(Oi(t,Er(e,n)),Ir(n,e)?Oi(t,n):t),[])),t)return !i&&g&&n(false),[false];if(!Bi(f)||h){const e=[Ri(f),h];return i||n.apply(0,e),e}}},v=new pi(or(g,false));return [()=>(v.observe(e,{attributes:true,attributeOldValue:true,attributeFilter:h,subtree:t,childList:t,characterData:t}),i=true,()=>{i&&(f(),v.disconnect(),i=false);}),()=>{if(i)return d.O(),g(true,v.takeRecords())}]};let ps=null;const hs=(e,t,n)=>{const{ft:o}=n||{},i=Ca("__osSizeObserverPlugin"),[r]=ni({o:false,u:true});return ()=>{const n=[],a=Hr(`<div class="${Ba}"><div class="${_a}"></div></div>`)[0],s=a.firstChild,l=e=>{let n=false,o=false;if(Si(e)&&!Bi(e)){const t=e[0],[i,,a]=r(t.contentRect),s=oa(i);o=ia(i,a),n=!o&&!s;}else o=true===e;n||t({_t:true,ft:o});};if(gi){if(!ki(ps)){const t=new gi(fr);t.observe(e,{get box(){ps=true;}}),ps=ps||false,t.disconnect();}const t=ar(l,{p:0,v:0}),o=e=>t(e),i=new gi(o);if(i.observe(ps?e:s),Oi(n,[()=>{i.disconnect();},!ps&&Br(e,a)]),ps){const t=new gi(o);t.observe(e,{box:"border-box"}),Oi(n,()=>t.disconnect());}}else {if(!i)return fr;{const[t,r]=i(s,l,o);Oi(n,Ai([Dr(a,Ra),aa(a,"animationstart",t),Br(e,a)],r));}}return or(_i,n)}},gs=(e,t)=>{let n;const o=_r("os-trinsic-observer"),[i]=ni({o:false}),r=(e,n)=>{if(e){const o=i((e=>0===e.h||e.isIntersecting||e.intersectionRatio>0)(e)),[,r]=o;return r&&!n&&t(o)&&[o]}},a=(e,t)=>r(t.pop(),e);return [()=>{const t=[];if(hi)n=new hi(or(a,false),{root:e}),n.observe(o),Oi(t,()=>{n.disconnect();});else {const e=()=>{const e=Xr(o);r(e);};Oi(t,hs(o,e)()),e();}return or(_i,Oi(t,Br(e,o)))},()=>n&&a(true,n.takeRecords())]},vs=(e,t,n,o)=>{let i,r,a,s,l,c;const u=`[${Ia}]`,d=`[${Ma}]`,f=["id","class","style","open","wrap","cols","rows"],{dt:m,vt:p,L:h,gt:g,ht:v,V:y,bt:w,wt:b,yt:C,St:k}=e,x=e=>"rtl"===Ur(e,"direction"),S={Ot:false,B:x(m)},N=fs(),D=Ca(os),[E]=ni({i:er,o:{w:0,h:0}},()=>{const o=D&&D.R(e,t,S,N,n).Y,i=!(w&&y)&&xr(p,Ia,Da),r=!y&&b("arrange"),a=r&&da(g),s=a&&k(),l=C(Aa,i),c=r&&o&&o(),u=ea(h),d=ta(h);return c&&c(),ua(g,a),s&&s(),i&&l(),{w:u.w+d.w,h:u.h+d.h}}),I=ar(o,{p:()=>i,v:()=>r,m(e,t){const[n]=e,[o]=t;return [Ai(lr(n),lr(o)).reduce((e,t)=>(e[t]=n[t]||o[t],e),{})]}}),M=e=>{const t=x(m);cr(e,{Ct:c!==t}),cr(S,{B:t}),c=t;},P=(e,t)=>{const[n,i]=e,r={$t:i};return cr(S,{Ot:n}),t||o(r),r},T=({_t:e,ft:t})=>{const n=!(e&&!t)&&N.U?I:o,i={_t:e||t,ft:t};M(i),n(i);},A=(e,t)=>{const[,n]=E(),i={xt:n};M(i);return n&&!t&&(e?o:I)(i),i},O=(e,t,n)=>{const o={Ht:t};return M(o),t&&!n&&I(o),o},[L,F]=v?gs(p,P):[],B=!y&&hs(p,T,{ft:true}),[R,_]=ms(p,false,O,{ct:f,et:f}),H=y&&gi&&new gi(e=>{const t=e[e.length-1].contentRect;T({_t:true,ft:ia(t,l)}),l=t;}),$=ar(()=>{const[,e]=E();o({xt:e,_t:w});},{p:222,S:true});return [()=>{H&&H.observe(p);const e=B&&B(),t=L&&L(),n=R(),o=N.G(e=>{e?I({Et:e}):$();});return ()=>{H&&H.disconnect(),e&&e(),t&&t(),s&&s(),n(),o();}},({zt:e,Tt:t,It:n})=>{const o={},[l]=e("update.ignoreMutation"),[c,m]=e("update.attributes"),[p,g]=e("update.elementEvents"),[w,b]=e("update.debounce"),C=t||n;if(g||m){a&&a(),s&&s();const[e,t]=ms(v||h,true,A,{et:Ai(f,c||[]),rt:p,it:u,ut:(e,t)=>{const{target:n,attributeName:o}=e;return !(t||!o||y)&&Lr(n,u,d)||!!Ar(n,`.${Ha}`)||!!(e=>xi(l)&&l(e))(e)}});s=e(),a=t;}if(b)if(I.O(),Si(w)){const e=w[0],t=w[1];i=bi(e)&&e,r=bi(t)&&t;}else bi(w)?(i=w,r=false):(i=false,r=false);if(C){const e=_(),t=F&&F(),n=a&&a();e&&cr(o,O(e[0],e[1],C)),t&&cr(o,P(t[0],C)),n&&cr(o,A(n[0],C));}return M(o),o},S]},ys=(e,t)=>xi(t)?t.apply(0,e):t,ws=(e,t,n,o)=>{const i=yi(o)?n:o;return ys(e,i)||t.apply(0,e)},bs=(e,t,n,o)=>{const i=yi(o)?n:o,r=ys(e,i);return !!r&&(Ii(r)?r:t.apply(0,e))},Cs=(e,t,n,o)=>{const i="--os-viewport-percent",r="--os-scroll-percent",a="--os-scroll-direction",{K:s}=fs(),{scrollbars:l}=s(),{slot:c}=l,{dt:u,vt:d,L:f,At:m,gt:p,bt:h,V:g}=t,{scrollbars:v}=m?{}:e,{slot:y}=v||{},w=[],b=[],C=[],k=bs([u,d,f],()=>g&&h?u:d,c,y),x=e=>{if(vi){let t=null,o=[];const i=new vi({source:p,axis:e}),r=()=>{t&&t.cancel(),t=null;},a=a=>{const{Dt:s}=n,l=ma(s)[e],c="x"===e,u=[Jr(0,c),Jr(`calc(100cq${c?"w":"h"} + -100%)`,c)],d=l?u:u.reverse();return o[0]===d[0]&&o[1]===d[1]||(r(),o=d,t=a.Mt.animate({clear:["left"],transform:d},{timeline:i})),r};return {kt:a}}},S={x:x("x"),y:x("y")},N=(e,t,n)=>{const o=n?Dr:Nr;Pi(e,e=>{o(e.Lt,t);});},D=(e,t)=>{Pi(e,e=>{const[n,o]=t(e);Yr(n,o);});},E=(e,t,n)=>{const o=ki(n),i=!o||!n;(!o||n)&&N(b,e,t),i&&N(C,e,t);},I=e=>{const t=e?"x":"y",n=_r(`${Ha} ${e?ja:za}`),i=_r(Va),r=_r(Wa),a={Lt:n,Ut:i,Mt:r},s=S[t];return Oi(e?b:C,a),Oi(w,[Br(n,i),Br(i,r),or(Fr,n),s&&s.kt(a),o(a,E,e)]),a},M=or(I,true),P=or(I,false);return M(),P(),[{Pt:()=>{const e=(()=>{const{Rt:e,Vt:t}=n,o=(e,t)=>mr(0,1,e/(e+t)||0);return {x:o(t.x,e.x),y:o(t.y,e.y)}})(),t=e=>t=>[t.Lt,{[i]:Vr(e)+""}];D(b,t(e.x)),D(C,t(e.y));},Nt:()=>{if(!vi){const{Dt:e}=n,t=pa(e,da(p)),o=e=>t=>[t.Lt,{[r]:Vr(e)+""}];D(b,o(t.x)),D(C,o(t.y));}},qt:()=>{const{Dt:e}=n,t=ma(e),o=e=>t=>[t.Lt,{[a]:e?"0":"1"}];D(b,o(t.x)),D(C,o(t.y)),vi&&(b.forEach(S.x.kt),C.forEach(S.y.kt));},Bt:()=>{if(g&&!h){const{Rt:e,Dt:t}=n,o=ma(t),i=pa(t,da(p)),r=t=>{const{Lt:n}=t,r=Tr(n)===f&&n,a=(e,t,n)=>{const o=t*e;return Wr(n?o:-o)};return [r,r&&{transform:Jr({x:a(i.x,e.x,o.x),y:a(i.y,e.y,o.y)})}]};D(b,r),D(C,r);}},Ft:E,jt:{Xt:b,Yt:M,Wt:or(D,b)},Jt:{Xt:C,Yt:P,Wt:or(D,C)}},()=>(Br(k,b[0].Lt),Br(k,C[0].Lt),or(_i,w))]},ks=(e,t,n,o)=>(i,r,a)=>{const{vt:s,L:l,V:c,gt:u,Gt:d,St:f}=t,{Lt:m,Ut:p,Mt:h}=i,[g,v]=ir(333),[y,w]=ir(444),b=e=>{xi(u.scrollBy)&&u.scrollBy({behavior:"smooth",left:e.x,top:e.y});};let C=true;return or(_i,[aa(h,"pointermove pointerleave",o),aa(m,"pointerenter",()=>{r(Ka,true);}),aa(m,"pointerleave pointercancel",()=>{r(Ka,false);}),!c&&aa(m,"mousedown",()=>{const e=Or();(gr(e,Ma)||gr(e,Ia)||e===document.body)&&di(or(ha,l),25);}),aa(m,"wheel",e=>{const{deltaX:t,deltaY:n,deltaMode:o}=e;C&&0===o&&Tr(m)===s&&b({x:t,y:n}),C=false,r(Qa,true),g(()=>{C=true,r(Qa);}),la(e);},{T:false,I:true}),aa(m,"pointerdown",()=>{const e=aa(d,"click",e=>{t(),ca(e);},{A:true,I:true,T:false}),t=aa(d,"pointerup pointercancel",()=>{t(),setTimeout(e,150);},{I:true,T:true});},{I:true,T:true}),(()=>{const t="pointerup pointercancel lostpointercapture",o="client"+(a?"X":"Y"),i=a?Ji:qi,r=a?"left":"top",s=a?"w":"h",l=a?"x":"y",c=(e,t)=>o=>{const{Rt:i}=n,r=Xr(p)[s]-Xr(h)[s],a=t*o/r*i[l];ua(u,{[l]:e+a});},m=[];return aa(p,"pointerdown",n=>{const a=Ar(n.target,`.${Wa}`)===h,g=a?h:p,v=e.scrollbars,C=v[a?"dragScroll":"clickScroll"],{button:k,isPrimary:x,pointerType:S}=n,{pointers:N}=v;if(0===k&&x&&C&&(N||[]).includes(S)){_i(m),w();const e=!a&&(n.shiftKey||"instant"===C),v=or(na,h),k=or(na,p),x=(e,t)=>(e||v())[r]-(t||k())[r],S=ai(na(u)[i])/Xr(u)[s]||1,N=c(da(u)[l],1/S),D=n[o],E=v(),I=k(),M=E[i],P=x(E,I)+M/2,T=D-I[r],A=a?0:T-P,O=e=>{_i(B),g.releasePointerCapture(e.pointerId);},L=a||e,F=f(),B=[aa(d,t,O),aa(d,"selectstart",e=>la(e),{T:false}),aa(p,t,O),L&&aa(p,"pointermove",e=>N(A+(e[o]-D))),L&&(()=>{const e=da(u);F();const t=da(u),n={x:t.x-e.x,y:t.y-e.y};(si(n.x)>3||si(n.y)>3)&&(f(),ua(u,e),b(n),y(F));})];if(g.setPointerCapture(n.pointerId),e)N(A);else if(!a){const e=Ca("__osClickScrollPlugin");if(e){const t=e(N,A,M,e=>{e?F():Oi(B,F);});Oi(B,t),Oi(m,or(t,true));}}}})})(),v,w])},xs=e=>{const t=fs(),{K:n,U:o}=t,{elements:i}=n(),{padding:r,viewport:a,content:s}=i,l=Ii(e),c=l?{}:e,{elements:u}=c,{padding:d,viewport:f,content:m}=u||{},p=l?e:c.target,h=Mr(p),g=p.ownerDocument,v=g.documentElement,y=()=>g.defaultView||oi,w=or(ws,[p]),b=or(bs,[p]),C=or(_r,""),k=or(w,C,a),x=or(b,C,s),S=k(f),N=S===p,D=N&&h,E=!N&&x(m),I=!N&&S===E,M=D?v:S,P=D?M:p,T=!N&&b(C,r,d),A=!I&&E,O=[A,M,T,P].map(e=>Ii(e)&&!Tr(e)&&e),L=e=>e&&Ti(O,e),F=!L(M)&&(e=>{const t=Xr(e),n=ea(e),o=Ur(e,Ui),i=Ur(e,Ki);return n.w-t.w>0&&!es(o)||n.h-t.h>0&&!es(i)})(M)?M:p,B=D?v:M,R={dt:p,vt:P,L:M,rn:T,ht:A,gt:B,Kt:D?g:M,ln:h?v:F,Gt:g,bt:h,At:l,V:N,an:y,wt:e=>xr(M,Ma,e),yt:(e,t)=>kr(M,Ma,e,t),St:()=>kr(B,Ma,"scrolling",true)},{dt:_,vt:H,rn:$,L:j,ht:z}=R,V=[()=>{yr(H,[Ia,Na]),yr(_,Na),h&&yr(v,[Na,Ia]);}];let W=Pr([z,j,$,H,_].find(e=>e&&!L(e)));const Y=D?_:z||j,U=or(_i,V);return [R,()=>{const e=y(),t=Or(),n=e=>{Br(Tr(e),Pr(e)),Fr(e);},i=e=>aa(e,"focusin focusout focus blur",ca,{I:true,T:false}),r="tabindex",a=hr(j,r),s=i(t);return vr(H,Ia,N?"":"host"),vr($,La,""),vr(j,Ma,""),vr(z,Fa,""),N||(vr(j,r,a||"-1"),h&&vr(v,Ea,"")),Br(Y,W),Br(H,$),Br($||H,!N&&j),Br(j,z),Oi(V,[s,()=>{const e=Or(),t=L(j),o=t&&e===j?_:e,s=i(o);yr($,La),yr(z,Fa),yr(j,Ma),h&&yr(v,Ea),a?vr(j,r,a):yr(j,r),L(z)&&n(z),t&&n(j),L($)&&n($),ha(o),s();}]),o&&!N&&(Cr(j,Ma,Oa),Oi(V,or(yr,j,Ma))),ha(!N&&h&&t===_&&e.top===e?j:t),s(),W=0,U},U]},Ss=({ht:e})=>({Qt:t,un:n,It:o})=>{const{$t:i}=t||{},{Ot:r}=n;e&&(i||o)&&Yr(e,{[qi]:r&&"100%"});},Ns=({vt:e,rn:t,L:n,V:o},i)=>{const[r,a]=ni({i:nr,o:Kr()},or(Kr,e,"padding",""));return ({zt:e,Qt:s,un:l,It:c})=>{let[u,d]=a(c);const{U:f}=fs(),{_t:m,xt:p,Ct:h}=s||{},{B:g}=l,[v,y]=e("paddingAbsolute");(m||d||(c||p))&&([u,d]=r(c));const w=!o&&(y||h||d);if(w){const e=!v||!t&&!f,o=u.r+u.l,r=u.t+u.b,a={[Wi]:e&&!g?-o:0,[Yi]:e?-r:0,[Vi]:e&&g?-o:0,top:e?-u.t:0,right:e?g?-u.r:"auto":0,left:e?g?"auto":-u.l:0,[Ji]:e&&`calc(100% + ${o}px)`},s={[Hi]:e?u.t:0,[$i]:e?u.r:0,[zi]:e?u.b:0,[ji]:e?u.l:0};Yr(t||n,a),Yr(n,s),cr(i,{rn:u,fn:!e,F:t?s:cr({},a,s)});}return {_n:w}}},Ds=(e,t)=>{const n=fs(),{vt:o,rn:i,L:r,V:a,Kt:s,gt:l,bt:c,yt:u,an:d}=e,{U:f}=n,m=c&&a,p=or(ii,0),h={display:()=>false,direction:e=>"ltr"!==e,flexDirection:e=>e.endsWith("-reverse"),writingMode:e=>"horizontal-tb"!==e},g=lr(h),v={i:er,o:{w:0,h:0}},y={i:tr,o:{}},w=e=>{u(Aa,!m&&e);},b=e=>{const t=g.some(t=>{const n=e[t];return n&&h[t](n)});if(!t)return {D:{x:0,y:0},M:{x:1,y:1}};w(true);const n=da(l),o=u("noContent",true),i=aa(s,Xi,e=>{const t=da(l);e.isTrusted&&t.x===n.x&&t.y===n.y&&sa(e);},{I:true,A:true});ua(l,{x:0,y:0}),o();const r=da(l),a=ea(l);ua(l,{x:a.w,y:a.h});const c=da(l);ua(l,{x:c.x-r.x<1&&-a.w,y:c.y-r.y<1&&-a.h});const d=da(l);return ua(l,n),ui(()=>i()),{D:r,M:d}},C=(e,t)=>{const n=oi.devicePixelRatio%1!=0?1:0,o={w:p(e.w-t.w),h:p(e.h-t.h)};return {w:o.w>n?o.w:0,h:o.h>n?o.h:0}},k=(e,t)=>{const n=(e,t,n,o)=>{const i=e===Gi?Qi:(e=>e.replace(`${Gi}-`,""))(e),r=es(e),a=es(n);if(!t&&!o)return Qi;if(r&&a)return Gi;if(r){return t&&o?i:t?Gi:Qi}return t?i:a&&o?Gi:Qi};return {x:n(t.x,e.x,t.y,e.y),y:n(t.y,e.y,t.x,e.x)}},x=e=>{const t=e=>[Gi,Qi,Xi].map(t=>_(ts(t),e)),n=t(true).concat(t()).join(" ");u(n),u(lr(e).map(t=>_(e[t],"x"===t)).join(" "),true);},[S,N]=ni(v,or(ta,r)),[D,E]=ni(v,or(ea,r)),[I,M]=ni(v),[P]=ni(y),[T,A]=ni(v),[O]=ni(y),[L]=ni({i:(e,t)=>Zi(e,t,g),o:{}},()=>(e=>!!e&&(e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length))(e))(r)?Ur(r,g):{}),[F,B]=ni({i:(e,t)=>tr(e.D,t.D)&&tr(e.M,t.M),o:{D:{x:0,y:0},M:{x:0,y:0}}}),R=Ca(os),_=(e,t)=>`${t?Pa:Ta}${(e=>{const t=String(e||"");return t?t[0].toUpperCase()+t.slice(1):""})(e)}`;return ({zt:a,Qt:s,un:l,It:c},{_n:h})=>{const{_t:g,Ht:v,xt:y,Ct:_,ft:H,Et:$}=s||{},j=R&&R.R(e,t,l,n,a),{X:z,Y:V,W:W}=j||{},[Y,U]=((e,t)=>{const{k:n}=t,[o,i]=e("showNativeOverlaidScrollbars");return [o&&n.x&&n.y,i]})(a,n),[K,J]=a("overflow"),q=es(K.x),G=es(K.y),Q=g||h||y||_||$||U;let X=N(c),Z=E(c),ee=M(c),te=A(c);if(U&&f&&u(Oa,!Y),Q){xr(o,Ia,Da)&&w(true);const e=V&&V(),[t]=X=S(c),[n]=Z=D(c),i=Zr(r),a=m&&Qr(d()),s={w:p(n.w+t.w),h:p(n.h+t.h)},l={w:p((a?a.w:i.w+p(i.w-n.w))+t.w),h:p((a?a.h:i.h+p(i.h-n.h))+t.h)};e&&e(),te=T(l),ee=I(C(s,l),c);}const[ne,oe]=te,[ie,re]=ee,[ae,se]=Z,[le,ce]=X,[ue,de]=P({x:ie.w>0,y:ie.h>0}),fe=q&&G&&(ue.x||ue.y)||q&&ue.x&&!ue.y||G&&ue.y&&!ue.x,me=h||_||$||ce||se||oe||re||J||U||Q||v&&m,[pe,he]=L(c),ge=_||H||he||de||c,[ve,ye]=ge?F(b(pe),c):B();let we=k(ue,K);w(false),me&&(x(we),we=ns(r,ue),W&&z&&(z(we,ae,le),Yr(r,W(we))));const[be,Ce]=O(we);return kr(o,Ia,Da,fe),kr(i,La,Da,fe),cr(t,{cn:be,Vt:{x:ne.w,y:ne.h},Rt:{x:ie.w,y:ie.h},j:ue,Dt:fa(ve,ie)}),{sn:Ce,tn:oe,nn:re,en:ye||re}}},Es=e=>{const[t,n,o]=xs(e),i={rn:{t:0,r:0,b:0,l:0},fn:false,F:{[Wi]:0,[Yi]:0,[Vi]:0,[Hi]:0,[$i]:0,[zi]:0,[ji]:0},Vt:{x:0,y:0},Rt:{x:0,y:0},cn:{x:Qi,y:Qi},j:{x:false,y:false},Dt:{D:{x:0,y:0},M:{x:0,y:0}}},{dt:r,gt:a,V:s,St:l}=t,{U:c,k:u}=fs(),d=!c&&(u.x||u.y),f=[Ss(t),Ns(t,i),Ds(t,i)];return [n,e=>{const t={},n=d&&da(a),o=n&&l();return Pi(f,n=>{cr(t,n(e,t)||{});}),ua(a,n),o&&o(),s||ua(r,0),t},i,t,o]},Is=(e,t,n,o,i)=>{let r=false;const a=ls(t,{}),[s,l,c,u,d]=Es(e),[f,m,p]=vs(u,c,a,e=>{w({},e);}),[h,g,,v]=((e,t,n,o,i,r)=>{let a,s,l,c,u,d=fr,f=0;const m=["mouse","pen"],p=e=>m.includes(e.pointerType),[h,g]=ir(),[v,y]=ir(100),[w,b]=ir(100),[C,k]=ir(()=>f),[x,S]=Cs(e,i,o,ks(t,i,o,e=>p(e)&&L())),{vt:N,Kt:D,bt:E}=i,{Ft:I,Pt:M,Nt:P,qt:T,Bt:A}=x,O=(e,t)=>{if(k(),e)I(Ga);else {const e=or(I,Ga,true);f>0&&!t?C(e):e();}},L=()=>{(l?a:c)||(O(true),v(()=>{O(false);}));},F=e=>{I(qa,e,true),I(qa,e,false);},B=e=>{p(e)&&(a=l,l&&O(true));},R=[k,y,b,g,()=>d(),aa(N,"pointerover",B,{A:true}),aa(N,"pointerenter",B),aa(N,"pointerleave",e=>{p(e)&&(a=false,l&&O(false));}),aa(N,"pointermove",e=>{p(e)&&s&&L();}),aa(D,"scroll",e=>{h(()=>{P(),L();}),r(e),A();})],_=Ca(os);return [()=>or(_i,Oi(R,S())),({zt:e,It:t,Qt:i,Zt:r})=>{const{tn:a,nn:m,sn:p,en:h}=r||{},{Ct:g,ft:v}=i||{},{B:y}=n,{k:b,U:C}=fs(),{cn:k,j:x}=o,[S,N]=e("showNativeOverlaidScrollbars"),[L,B]=e("scrollbars.theme"),[R,H]=e("scrollbars.visibility"),[$,j]=e("scrollbars.autoHide"),[z,V]=e("scrollbars.autoHideSuspend"),[W]=e("scrollbars.autoHideDelay"),[Y,U]=e("scrollbars.dragScroll"),[K,J]=e("scrollbars.clickScroll"),[q,G]=e("overflow"),Q=v&&!t,X=x.x||x.y,Z=a||m||h||g||t,ee=p||H||G,te=S&&b.x&&b.y,ne=!C&&!_,oe=te||ne,ie=(e,t,n)=>{const o=e.includes(Xi)&&(R===Gi||"auto"===R&&t===Xi);return I(Ya,o,n),o};if(f=W,Q&&(z&&X?(F(false),d(),w(()=>{d=aa(D,"scroll",or(F,true),{A:true});})):F(true)),(N||ne)&&I("os-theme-none",oe),B&&(I(u),I(L,true),u=L),V&&!z&&F(true),j&&(s="move"===$,l="leave"===$,c="never"===$,O(c,true)),U&&I(Za,Y),J&&I(Xa,!!K),ee){const e=ie(q.x,k.x,true),t=ie(q.y,k.y,false);I(Ua,!(e&&t));}Z&&(P(),M(),A(),h&&T(),I(Ja,!x.x,true),I(Ja,!x.y,false),I($a,y&&!E));},{},x]})(e,t,p,c,u,i),y=e=>lr(e).some(t=>!!e[t]),w=(e,i)=>{if(n())return  false;const{dn:a,It:s,Tt:c,pn:u}=e,d=a||{},f=!!s||!r,h={zt:ls(t,d,f),dn:d,It:f};if(u)return g(h),false;const v=i||m(cr({},h,{Tt:c})),w=l(cr({},h,{un:p,Qt:v}));g(cr({},h,{Qt:v,Zt:w}));const b=y(v),C=y(w),k=b||C||!dr(d)||f;return r=true,k&&o(e,{Qt:v,Zt:w}),k};return [()=>{const{ln:e,gt:t,St:n}=u,o=da(e),i=[f(),s(),h()],r=n();return ua(t,o),r(),or(_i,i)},w,()=>({vn:p,gn:c}),{hn:u,bn:v},d]},Ms=new WeakMap,Ps=e=>Ms.get(e),Ts=(e,t,n)=>{const{tt:o}=fs(),i=Ii(e),r=i?e:e.target,a=Ps(r);if(t&&!a){let a=false;const s=[],l={},c=e=>{const t=ur(e),n=Ca("__osOptionsValidationPlugin");return n?n(t,true):t},u=cr({},o(),c(t)),[d,f,m]=va(),[p,h,g]=va(n),v=(e,t)=>{g(e,t),m(e,t);},[y,w,b,C,k]=Is(e,u,()=>a,({dn:e,It:t},{Qt:n,Zt:o})=>{const{_t:i,Ct:r,$t:a,xt:s,Ht:l,ft:c}=n,{tn:u,nn:d,sn:f,en:m}=o;v("updated",[S,{updateHints:{sizeChanged:!!i,directionChanged:!!r,heightIntrinsicChanged:!!a,overflowEdgeChanged:!!u,overflowAmountChanged:!!d,overflowStyleChanged:!!f,scrollCoordinatesChanged:!!m,contentMutation:!!s,hostMutation:!!l,appear:!!c},changedOptions:e||{},force:!!t}]);},e=>v("scroll",[S,e])),x=e=>{(e=>{Ms.delete(e);})(r),_i(s),a=true,v("destroyed",[S,e]),f(),h();},S={options(e,t){if(e){const n=t?o():{},i=ss(u,cr(n,c(e)));dr(i)||(cr(u,i),w({dn:i}));}return cr({},u)},on:p,off:(e,t)=>{e&&t&&h(e,t);},state(){const{vn:e,gn:t}=b(),{B:n}=e,{Vt:o,Rt:i,cn:r,j:s,rn:l,fn:c,Dt:u}=t;return cr({},{overflowEdge:o,overflowAmount:i,overflowStyle:r,hasOverflow:s,scrollCoordinates:{start:u.D,end:u.M},padding:l,paddingAbsolute:c,directionRTL:n,destroyed:a})},elements(){const{dt:e,vt:t,rn:n,L:o,ht:i,gt:r,Kt:a}=C.hn,{jt:s,Jt:l}=C.bn,c=e=>{const{Mt:t,Ut:n,Lt:o}=e;return {scrollbar:o,track:n,handle:t}},u=e=>{const{Xt:t,Yt:n}=e,o=c(t[0]);return cr({},o,{clone:()=>{const e=c(n());return w({pn:true}),e}})};return cr({},{target:e,host:t,padding:n||o,viewport:o,content:i||o,scrollOffsetElement:r,scrollEventElement:a,scrollbarHorizontal:u(s),scrollbarVertical:u(l)})},update:e=>w({It:e,Tt:true}),destroy:or(x,false),plugin:e=>l[lr(e)[0]]};return Oi(s,[k]),((e,t)=>{Ms.set(e,t);})(r,S),ba(ya,Ts,[S,d,l]),((e,t)=>{const{nativeScrollbarsOverlaid:n,body:o}=t||{},{k:i,U:r,K:a}=fs(),{nativeScrollbarsOverlaid:s,body:l}=a().cancel,c=null!=n?n:s,u=yi(o)?l:o,d=(i.x||i.y)&&c,f=e&&(wi(u)?!r:u);return !!d||!!f})(C.hn.bt,!i&&e.cancel)?(x(true),S):(Oi(s,y()),v("initialized",[S]),S.update(),S)}return a};Ts.plugin=e=>{const t=Si(e),n=t?e:[e],o=n.map(e=>ba(e,Ts)[0]);return (e=>{Pi(e,e=>Pi(e,(t,n)=>{ya[n]=e[n];}));})(n),t?o:o[0]},Ts.valid=e=>{const t=e&&e.elements,n=xi(t)&&t();return Ei(n)&&!!Ps(n.target)},Ts.env=()=>{const{P:e,k:t,U:n,J:o,ot:i,st:r,K:a,Z:s,tt:l,nt:c}=fs();return cr({},{scrollbarsSize:e,scrollbarsOverlaid:t,scrollbarsHiding:n,scrollTimeline:o,staticDefaultInitialization:i,staticDefaultOptions:r,getDefaultInitialization:a,setDefaultInitialization:s,getDefaultOptions:l,setDefaultOptions:c})},Ts.nonce=e=>{cs=e;},Ts.trustedTypePolicy=e=>{Rr=e;};const As=()=>{if(typeof window>"u"){const e=()=>{};return [e,e]}let e,t;const n=window,o="function"==typeof n.requestIdleCallback,i=n.requestAnimationFrame,r=n.cancelAnimationFrame,a=o?n.requestIdleCallback:i,s=o?n.cancelIdleCallback:r,l=()=>{s(e),r(t);};return [(n,r)=>{l(),e=a(o?()=>{l(),t=i(n);}:n,"object"==typeof r?r:{timeout:2233});},l]},Os=e=>{const{options:t,events:n,defer:o}=e||{},[i,r]=reactExports.useMemo(As,[]),a=reactExports.useRef(null),s=reactExports.useRef(o),l=reactExports.useRef(t),c=reactExports.useRef(n);return reactExports.useEffect(()=>{s.current=o;},[o]),reactExports.useEffect(()=>{const{current:e}=a;l.current=t,Ts.valid(e)&&e.options(t||{},true);},[t]),reactExports.useEffect(()=>{const{current:e}=a;c.current=n,Ts.valid(e)&&e.on(n||{},true);},[n]),reactExports.useEffect(()=>()=>{var e;r(),null==(e=a.current)||e.destroy();},[]),reactExports.useMemo(()=>[e=>{const t=a.current;if(Ts.valid(t))return;const n=s.current,o=l.current||{},r=c.current||{},u=()=>a.current=Ts(e,o,r);n?i(u,n):u();},()=>a.current],[])};reactExports.forwardRef((e,t)=>{const{element:n="div",options:o,events:r,defer:a,children:s,...l}=e,c=n,u=reactExports.useRef(null),p=reactExports.useRef(null),[h,g]=Os({options:o,events:r,defer:a});return reactExports.useEffect(()=>{const{current:e}=u,{current:t}=p;if(!e)return;return h("body"===n?{target:e,cancel:{body:null}}:{target:e,elements:{viewport:t,content:t}}),()=>{var e;return null==(e=g())?void 0:e.destroy()}},[h,n]),reactExports.useImperativeHandle(t,()=>({osInstance:g,getElement:()=>u.current}),[]),React.createElement(c,{"data-overlayscrollbars-initialize":"",ref:u,...l},"body"===n?s:React.createElement("div",{"data-overlayscrollbars-contents":"",ref:p},s))});const Ls=reactExports.forwardRef((t,n)=>{const{children:o,element:i="div",elementProps:r,wrapperClassName:s}=t,l=reactExports.useRef(null),c=reactExports.useRef(null),[u,m]=Os({options:{scrollbars:{autoHide:"leave",autoHideDelay:0}},defer:true}),p=reactExports.useCallback(e=>{c.current=e,"function"==typeof n?n(e):null!==n&&(n.current=e);},[n]);return reactExports.useEffect(()=>{if(c.current&&l.current)return u({target:l.current,elements:{viewport:c.current,content:c.current}}),()=>m()?.destroy()},[u,m]),jsxRuntimeExports.jsx("div",{"data-overlayscrollbars-initialize":"",ref:l,className:x("io-overlay-scrollbars-container",s),children:jsxRuntimeExports.jsx(i,{"data-overlayscrollbars-contents":"",ref:p,...r,children:o})})});function Fs({text:t="Label",...n}){return jsxRuntimeExports.jsx("label",{...n,children:t})}const Bs=reactExports.forwardRef(({id:n="input",className:o,type:i="text",name:r="input",align:s="up",label:l,iconPrepend:c,iconPrependOnClick:u,iconAppend:d,iconAppendOnClick:f,placeholder:m,disabled:p,readOnly:h,errorMessage:g,errorDataTestId:v,...y},w)=>{const b=x("io-control-input",c&&"io-control-leading-icon",d&&"io-control-trailing-icon",p&&"io-control-disabled",h&&"io-control-readonly",g&&"io-control-error",s&&[`direction-${s}`],o),C=reactExports.useCallback(e=>{p?e.preventDefault():u&&u(e);},[u,p]),k=reactExports.useCallback(e=>{p?e.preventDefault():f&&f(e);},[f,p]);return jsxRuntimeExports.jsxs("div",{className:b,children:[l&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:l}),c&&jsxRuntimeExports.jsx(S,{variant:c,onClick:e=>C(e)}),jsxRuntimeExports.jsx("input",{id:n,className:"io-input",ref:w,type:i,name:r,tabIndex:0,placeholder:m??(()=>{switch(i){case "email":return "Enter your email here...";case "number":return "Enter number here...";case "password":return "Enter your password here...";case "tel":return "Enter your phone number here...";case "file":return "Select a file...";default:return "Enter text here..."}})(),"aria-label":l,disabled:p,readOnly:h,...g?{"aria-invalid":true,"aria-describedby":`${n}-error`}:{},...y}),d&&jsxRuntimeExports.jsx(S,{variant:d,onClick:e=>k(e)}),g&&jsxRuntimeExports.jsxs("div",{"data-testid":v,id:`${n}-error`,className:"io-input-error",children:[jsxRuntimeExports.jsx(S,{variant:"close"}),g]})]})});Bs.displayName="Input";const Rs=reactExports.forwardRef(({id:n="textarea",className:o,name:i="textarea",align:r="up",label:a,rows:s=4,placeholder:l="Enter text here...",disabled:c,readOnly:u,...d},f)=>{const m=x("io-control-textarea",c&&"io-control-disabled",u&&"io-control-readonly",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:m,children:[a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a}),jsxRuntimeExports.jsx("textarea",{id:n,className:"io-textarea",ref:f,name:i,tabIndex:0,placeholder:l,"aria-label":a,disabled:c,readOnly:u,rows:s,...d})]})});Rs.displayName="Textarea";const _s=reactExports.forwardRef(({id:n="checkbox",className:o,name:i="checkbox",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=x("io-control-checkbox",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:n,className:"io-checkbox",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a,"data-testid":c["data-testid"]?`${c["data-testid"]}-label`:void 0})]})});_s.displayName="Checkbox";const Hs=reactExports.forwardRef(({id:n="radio",className:o,name:i="radio",align:r="left",label:a,checked:s,disabled:l,...c},u)=>{const d=x("io-control-radio",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsxs("div",{className:d,children:[jsxRuntimeExports.jsx("input",{type:"radio",id:n,className:"io-radio",ref:u,name:i,tabIndex:l?-1:0,checked:s,disabled:l,"aria-checked":s,...c}),a&&jsxRuntimeExports.jsx(Fs,{htmlFor:n,text:a})]})});Hs.displayName="Radio";var $s=React["undefined"!=typeof document&&void 0!==document.createElement?"useLayoutEffect":"useEffect"],js=0,zs=()=>js++,Vs=0;const Ws="function"==typeof reactExports.useId?reactExports.useId:function(e,t){ void 0===t&&(t="🅰");var[n,o]=reactExports.useState(Vs?zs:void 0);return $s(()=>{ void 0===n&&o(js++),Vs=1;},[]),e||(void 0===n?n:t+n)},Ys=reactExports.forwardRef(({id:n,className:o,name:i="toggle",align:r="left",label:a,checked:s,disabled:l,onKeyDown:c,"data-testid":u="toggle",...d},f)=>{const m=Ws(),p=n||`toggle-${m}`,h=x("io-control-toggle",s&&"io-control-checked",l&&"io-control-disabled",r&&[`direction-${r}`],o);return jsxRuntimeExports.jsx("div",{className:h,children:jsxRuntimeExports.jsxs("label",{className:"io-toggle",htmlFor:p,tabIndex:l?-1:0,onKeyDown:c,"data-testid":`${u}-label`,children:[jsxRuntimeExports.jsx("input",{type:"checkbox",id:p,className:"io-checkbox",ref:f,name:i,checked:s,disabled:l,"aria-checked":s,tabIndex:-1,"data-testid":u,...d}),jsxRuntimeExports.jsx("span",{className:"slider","data-testid":`${u}-slider`}),a]})})});function Js(e,t=500){const[n,o]=reactExports.useState(e);return reactExports.useEffect(()=>{const n=setTimeout(()=>{o(e);},t);return ()=>clearTimeout(n)},[e,t]),n}Ys.displayName="Toggle";const Xs=()=>void 0!==window.glue42gd||void 0!==window.iodesktop;function Zs(){return reactExports.useMemo(()=>"object"==typeof window&&Xs(),[])}const el=()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState(null),o=reactExports.useCallback(t=>e?.themes?.select(t),[e]);return reactExports.useEffect(()=>{if(!e)return;let t=false;const o=e=>{t||n(e);};return e.themes?.onChanged(o),e.themes?.getCurrent().then(o).catch(console.warn),()=>{t=true;}},[e]),{currentTheme:t,selectTheme:o}};reactExports.createContext({theme:"dark"});const rl="___platform_prefs___",dl="_launchpad_pinnedPosition",fl="_launchpad_allowDocking",ml="_launchpad_minimizeToTray",pl="_launchpad_autoCloseStartingAppsAndWorkspaces",hl="_launchpad_showTutorialOnStartup",gl="_layouts_restoreLastSaved",vl="_layouts_saveCurrentOnExit",yl="_layouts_showUnsavedChangesPrompt",wl="_layouts_showDeletePrompt",bl="_downloads_askForEachDownload",Tl=e=>"string"==typeof e?e:e?.message?"string"==typeof e.message?e.message:JSON.stringify(e.message):JSON.stringify(e),Al="warning",Ol={success:5e3,warning:1e4};var Ll=function(e){return {ok:true,result:e}},Fl=function(e){return {ok:false,error:e}},Bl=function(e,t,n){return  false===t.ok?t:false===n.ok?n:Ll(e(t.result,n.result))},Rl=function(e,t){return  true===t.ok?t:Fl(e(t.error))},_l=function(){return _l=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},_l.apply(this,arguments)};function Hl(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!Hl(e[n],t[n]))return  false;return  true}var o=Object.keys(e);if(o.length!==Object.keys(t).length)return  false;for(n=0;n<o.length;n++){if(!t.hasOwnProperty(o[n]))return  false;if(!Hl(e[o[n]],t[o[n]]))return  false}return  true}}var $l=function(e){return Array.isArray(e)},jl=function(e){return "object"==typeof e&&null!==e&&!$l(e)},zl=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},Vl=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},Wl=function(e,t){var n=t.at,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(o=Object.getOwnPropertySymbols(e);i<o.length;i++)t.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(e,o[i])&&(n[o[i]]=e[o[i]]);}return n}(t,["at"]);return _l({at:e+(n||"")},o)},Yl=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return Rl(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?Ll(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,o){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(o)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?Ll(e):Fl({message:zl("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?Ll(e):Fl({message:zl("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?Ll(e):Fl({message:zl("a boolean",e)})})},e.constant=function(t){return new e(function(e){return Hl(e,t)?Ll(t):Fl({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(jl(e)&&t){var n={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o].decode(e[o]);if(true!==i.ok)return void 0===e[o]?Fl({message:"the key '"+o+"' is required but was not present"}):Fl(Wl("."+o,i.error));void 0!==i.result&&(n[o]=i.result);}return Ll(n)}return jl(e)?Ll(e):Fl({message:zl("an object",e)})})},e.array=function(t){return new e(function(e){if($l(e)&&t){return e.reduce(function(e,n,o){return Bl(function(e,t){return e.concat([t])},e,function(e,n){return Rl(function(e){return Wl("["+n+"]",e)},t.decode(e))}(n,o))},Ll([]))}return $l(e)?Ll(e):Fl({message:zl("an array",e)})})},e.tuple=function(t){return new e(function(e){if($l(e)){if(e.length!==t.length)return Fl({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e[o]);if(!i.ok)return Fl(Wl("["+o+"]",i.error));n[o]=i.result;}return Ll(n)}return Fl({message:zl("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return e.oneOf.apply(e,[t,n].concat(o))},e.intersection=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return new e(function(e){return [t,n].concat(o).reduce(function(t,n){return Bl(Object.assign,t,n.decode(e))},Ll({}))})},e.anyJson=function(){return new e(function(e){return Ll(e)})},e.unknownJson=function(){return new e(function(e){return Ll(e)})},e.dict=function(t){return new e(function(e){if(jl(e)){var n={};for(var o in e)if(e.hasOwnProperty(o)){var i=t.decode(e[o]);if(true!==i.ok)return Fl(Wl("."+o,i.error));n[o]=i.result;}return Ll(n)}return Fl({message:zl("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?Ll(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e);if(true===i.ok)return i;n[o]=i.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return Fl({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return Ll(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var o=e,i=0;i<t.length;i++){if(void 0===o)return Fl({at:Vl(t.slice(0,i+1)),message:"path does not exist"});if("string"==typeof t[i]&&!jl(o))return Fl({at:Vl(t.slice(0,i+1)),message:zl("an object",o)});if("number"==typeof t[i]&&!$l(o))return Fl({at:Vl(t.slice(0,i+1)),message:zl("an array",o)});o=o[t[i]];}return Rl(function(e){return void 0===o?{at:Vl(t),message:"path does not exist"}:Wl(Vl(t),e)},n.decode(o))})},e.succeed=function(t){return new e(function(e){return Ll(t)})},e.fail=function(t){return new e(function(e){return Fl({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),Ul=Yl.string;Yl.number;var Kl=Yl.boolean,Jl=Yl.anyJson;Yl.unknownJson;var ql=Yl.constant,Gl=Yl.object,Ql=Yl.array;Yl.tuple,Yl.dict;var Xl=Yl.optional,Zl=Yl.oneOf;Yl.union,Yl.intersection,Yl.withDefault,Yl.valueAt,Yl.succeed,Yl.fail,Yl.lazy;const ec=["name","title","version","customProperties","icon","caption","type"],tc=["appId","name","type","details","version","title","tooltip","lang","description","categories","icons","screenshots","contactEmail","moreInfo","publisher","customConfig","hostManifests","interop","localizedVersions"];var nc=function(e){return {ok:true,result:e}},oc=function(e){return {ok:false,error:e}},ic=function(e,t,n){return  false===t.ok?t:false===n.ok?n:nc(e(t.result,n.result))},rc=function(e,t){return  true===t.ok?t:oc(e(t.error))},ac=function(){return ac=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},ac.apply(this,arguments)};function sc(e,t){if(e===t)return  true;if(null===e&&null===t)return  true;if(typeof e!=typeof t)return  false;if("object"==typeof e){if(Array.isArray(e)){if(!Array.isArray(t))return  false;if(e.length!==t.length)return  false;for(var n=0;n<e.length;n++)if(!sc(e[n],t[n]))return  false;return  true}var o=Object.keys(e);if(o.length!==Object.keys(t).length)return  false;for(n=0;n<o.length;n++){if(!t.hasOwnProperty(o[n]))return  false;if(!sc(e[o[n]],t[o[n]]))return  false}return  true}}var lc=function(e){return Array.isArray(e)},cc=function(e){return "object"==typeof e&&null!==e&&!lc(e)},uc=function(e,t){return "expected "+e+", got "+function(e){switch(typeof e){case "string":return "a string";case "number":return "a number";case "boolean":return "a boolean";case "undefined":return "undefined";case "object":return e instanceof Array?"an array":null===e?"null":"an object";default:return JSON.stringify(e)}}(t)},dc=function(e){return e.map(function(e){return "string"==typeof e?"."+e:"["+e+"]"}).join("")},fc=function(e,t){var n=t.at,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(o=Object.getOwnPropertySymbols(e);i<o.length;i++)t.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(e,o[i])&&(n[o[i]]=e[o[i]]);}return n}(t,["at"]);return ac({at:e+(n||"")},o)},mc=function(){function e(t){var n=this;this.decode=t,this.run=function(e){return rc(function(t){return {kind:"DecoderError",input:e,at:"input"+(t.at||""),message:t.message||""}},n.decode(e))},this.runPromise=function(e){return function(e){return  true===e.ok?Promise.resolve(e.result):Promise.reject(e.error)}(n.run(e))},this.runWithException=function(e){return function(e){if(true===e.ok)return e.result;throw e.error}(n.run(e))},this.map=function(t){return new e(function(e){return function(e,t){return  true===t.ok?nc(e(t.result)):t}(t,n.decode(e))})},this.andThen=function(t){return new e(function(e){return function(e,t){return  true===t.ok?e(t.result):t}(function(n){return t(n).decode(e)},n.decode(e))})},this.where=function(t,o){return n.andThen(function(n){return t(n)?e.succeed(n):e.fail(o)})};}return e.string=function(){return new e(function(e){return "string"==typeof e?nc(e):oc({message:uc("a string",e)})})},e.number=function(){return new e(function(e){return "number"==typeof e?nc(e):oc({message:uc("a number",e)})})},e.boolean=function(){return new e(function(e){return "boolean"==typeof e?nc(e):oc({message:uc("a boolean",e)})})},e.constant=function(t){return new e(function(e){return sc(e,t)?nc(t):oc({message:"expected "+JSON.stringify(t)+", got "+JSON.stringify(e)})})},e.object=function(t){return new e(function(e){if(cc(e)&&t){var n={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o].decode(e[o]);if(true!==i.ok)return void 0===e[o]?oc({message:"the key '"+o+"' is required but was not present"}):oc(fc("."+o,i.error));void 0!==i.result&&(n[o]=i.result);}return nc(n)}return cc(e)?nc(e):oc({message:uc("an object",e)})})},e.array=function(t){return new e(function(e){if(lc(e)&&t){return e.reduce(function(e,n,o){return ic(function(e,t){return e.concat([t])},e,function(e,n){return rc(function(e){return fc("["+n+"]",e)},t.decode(e))}(n,o))},nc([]))}return lc(e)?nc(e):oc({message:uc("an array",e)})})},e.tuple=function(t){return new e(function(e){if(lc(e)){if(e.length!==t.length)return oc({message:"expected a tuple of length "+t.length+", got one of length "+e.length});for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e[o]);if(!i.ok)return oc(fc("["+o+"]",i.error));n[o]=i.result;}return nc(n)}return oc({message:uc("a tuple of length "+t.length,e)})})},e.union=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return e.oneOf.apply(e,[t,n].concat(o))},e.intersection=function(t,n){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];return new e(function(e){return [t,n].concat(o).reduce(function(t,n){return ic(Object.assign,t,n.decode(e))},nc({}))})},e.anyJson=function(){return new e(function(e){return nc(e)})},e.unknownJson=function(){return new e(function(e){return nc(e)})},e.dict=function(t){return new e(function(e){if(cc(e)){var n={};for(var o in e)if(e.hasOwnProperty(o)){var i=t.decode(e[o]);if(true!==i.ok)return oc(fc("."+o,i.error));n[o]=i.result;}return nc(n)}return oc({message:uc("an object",e)})})},e.optional=function(t){return new e(function(e){return null==e?nc(void 0):t.decode(e)})},e.oneOf=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return new e(function(e){for(var n=[],o=0;o<t.length;o++){var i=t[o].decode(e);if(true===i.ok)return i;n[o]=i.error;}var r=n.map(function(e){return "at error"+(e.at||"")+": "+e.message}).join('", "');return oc({message:'expected a value matching one of the decoders, got the errors ["'+r+'"]'})})},e.withDefault=function(t,n){return new e(function(e){return nc(function(e,t){return  true===t.ok?t.result:e}(t,n.decode(e)))})},e.valueAt=function(t,n){return new e(function(e){for(var o=e,i=0;i<t.length;i++){if(void 0===o)return oc({at:dc(t.slice(0,i+1)),message:"path does not exist"});if("string"==typeof t[i]&&!cc(o))return oc({at:dc(t.slice(0,i+1)),message:uc("an object",o)});if("number"==typeof t[i]&&!lc(o))return oc({at:dc(t.slice(0,i+1)),message:uc("an array",o)});o=o[t[i]];}return rc(function(e){return void 0===o?{at:dc(t),message:"path does not exist"}:fc(dc(t),e)},n.decode(o))})},e.succeed=function(t){return new e(function(e){return nc(t)})},e.fail=function(t){return new e(function(e){return oc({message:t})})},e.lazy=function(t){return new e(function(e){return t().decode(e)})},e}(),pc=mc.string,hc=mc.number,gc=mc.boolean,vc=mc.anyJson;mc.unknownJson;var yc=mc.constant,wc=mc.object,bc=mc.array;mc.tuple;var Cc=mc.dict,kc=mc.optional,xc=mc.oneOf;mc.union,mc.intersection,mc.withDefault,mc.valueAt,mc.succeed,mc.fail,mc.lazy;const Sc=pc().where(e=>e.length>0,"Expected a non-empty string"),Nc=hc().where(e=>e>=0,"Expected a non-negative number"),Dc=vc().andThen(e=>e instanceof RegExp?vc():fail("expected a regex, got a "+typeof e)),Ec=wc({name:Sc,displayName:kc(pc()),contexts:kc(bc(pc())),customConfig:kc(wc())}),Ic=xc(yc("web"),yc("native"),yc("citrix"),yc("onlineNative"),yc("other")),Mc=wc({url:Sc}),Pc=wc({src:Sc,size:kc(Sc),type:kc(Sc)}),Tc=wc({src:Sc,size:kc(Sc),type:kc(Sc),label:kc(Sc)}),Ac=wc({contexts:bc(Sc),displayName:kc(Sc),resultType:kc(Sc),customConfig:kc(vc())}),Oc=wc({listensFor:kc(Cc(Ac)),raises:kc(Cc(bc(Sc)))}),Lc=wc({broadcasts:kc(bc(Sc)),listensFor:kc(bc(Sc))}),Fc=wc({name:Sc,description:kc(Sc),broadcasts:kc(bc(Sc)),listensFor:kc(bc(Sc))}),Bc=wc({intents:kc(Oc),userChannels:kc(Lc),appChannels:kc(bc(Fc))}),Rc=wc({url:kc(Sc),top:kc(hc()),left:kc(hc()),width:kc(Nc),height:kc(Nc)}),_c=wc({name:kc(Sc),type:kc(Sc.where(e=>"window"===e,"Expected a value of window")),title:kc(Sc),version:kc(Sc),customProperties:kc(vc()),icon:kc(pc()),caption:kc(pc()),details:kc(Rc),intents:kc(bc(Ec)),hidden:kc(gc())}),Hc=wc({name:Sc,appId:Sc,title:kc(Sc),version:kc(Sc),manifest:Sc,manifestType:Sc,tooltip:kc(Sc),description:kc(Sc),contactEmail:kc(Sc),supportEmail:kc(Sc),publisher:kc(Sc),images:kc(bc(wc({url:kc(Sc)}))),icons:kc(bc(wc({icon:kc(Sc)}))),customConfig:vc(),intents:kc(bc(Ec))}),$c=wc({appId:kc(Sc),name:kc(Sc),details:kc(Mc),version:kc(Sc),title:kc(Sc),tooltip:kc(Sc),lang:kc(Sc),description:kc(Sc),categories:kc(bc(Sc)),icons:kc(bc(Pc)),screenshots:kc(bc(Tc)),contactEmail:kc(Sc),supportEmail:kc(Sc),moreInfo:kc(Sc),publisher:kc(Sc),customConfig:kc(bc(vc())),hostManifests:kc(vc()),interop:kc(Bc)}),jc=wc({appId:Sc,name:kc(Sc),type:Ic,details:Mc,version:kc(Sc),title:kc(Sc),tooltip:kc(Sc),lang:kc(Sc),description:kc(Sc),categories:kc(bc(Sc)),icons:kc(bc(Pc)),screenshots:kc(bc(Tc)),contactEmail:kc(Sc),supportEmail:kc(Sc),moreInfo:kc(Sc),publisher:kc(Sc),customConfig:kc(bc(vc())),hostManifests:kc(vc()),interop:kc(Bc),localizedVersions:kc(Cc($c))}),zc=xc(Hc,jc),Vc=e=>`${e.kind} at ${e.at}: ${JSON.stringify(e.input)}. Reason - ${e.message}`;class Wc{fdc3ToDesktopDefinitionType={web:"window",native:"exe",citrix:"citrix",onlineNative:"clickonce",other:"window"};toApi(){return {isFdc3Definition:this.isFdc3Definition.bind(this),parseToBrowserBaseAppData:this.parseToBrowserBaseAppData.bind(this),parseToDesktopAppConfig:this.parseToDesktopAppConfig.bind(this)}}isFdc3Definition(e){const t=zc.run(e);return t.ok?e.appId&&e.details?{isFdc3:true,version:"2.0"}:e.manifest?{isFdc3:true,version:"1.2"}:{isFdc3:false,reason:"The passed definition is not FDC3"}:{isFdc3:false,reason:Vc(t.error)}}parseToBrowserBaseAppData(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const o=zc.run(e);if(!o.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(o.error)}`);const i=this.getUserPropertiesFromDefinition(e,n),r={url:this.getUrl(e,n)},a={name:e.appId,type:"window",createOptions:r,userProperties:{...i,intents:"1.2"===n?i.intents:this.getIntentsFromV2AppDefinition(e),details:r},title:e.title,version:e.version,icon:this.getIconFromDefinition(e,n),caption:e.description,fdc3:"2.0"===n?{...e,definitionVersion:"2.0"}:void 0},s=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!s)return a;const l=_c.run(s);if(!l.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(l.error)}`);return Object.keys(l.result).length?this.mergeBaseAppDataWithGlueManifest(a,l.result):a}parseToDesktopAppConfig(e){const{isFdc3:t,version:n}=this.isFdc3Definition(e);if(!t)throw new Error("The passed definition is not FDC3");const o=zc.run(e);if(!o.ok)throw new Error(`Invalid FDC3 ${n} definition. Error: ${Vc(o.error)}`);if("1.2"===n){const t=e;return {name:t.appId,type:"window",details:{url:this.getUrl(e,n)},version:t.version,title:t.title,tooltip:t.tooltip,caption:t.description,icon:t.icons?.[0].icon,intents:t.intents,customProperties:{manifestType:t.manifestType,images:t.images,contactEmail:t.contactEmail,supportEmail:t.supportEmail,publisher:t.publisher,icons:t.icons,customConfig:t.customConfig}}}const i=e,r={name:i.appId,type:this.fdc3ToDesktopDefinitionType[i.type],details:i.details,version:i.version,title:i.title,tooltip:i.tooltip,caption:i.description,icon:this.getIconFromDefinition(i,"2.0"),intents:this.getIntentsFromV2AppDefinition(i),fdc3:{...i,definitionVersion:"2.0"}},a=e.hostManifests?.ioConnect||e.hostManifests?.Glue42;if(!a)return r;if("object"!=typeof a||Array.isArray(a))throw new Error(`Invalid '${e.hostManifests.ioConnect?"hostManifests.ioConnect":"hostManifests['Glue42']"}' key`);return this.mergeDesktopConfigWithGlueManifest(r,a)}getUserPropertiesFromDefinition(e,t){return "1.2"===t?Object.fromEntries(Object.entries(e).filter(([e])=>!ec.includes(e))):Object.fromEntries(Object.entries(e).filter(([e])=>!ec.includes(e)&&!tc.includes(e)))}getUrl(e,t){let n;if("1.2"===t){const t=JSON.parse(e.manifest);n=t.details?.url||t.url;}else n=e.details?.url;if(!n||"string"!=typeof n)throw new Error(`Invalid FDC3 ${t} definition. Provide valid 'url' under '${"1.2"===t?"manifest":"details"}' key`);return n}getIntentsFromV2AppDefinition(e){const t=e.interop?.intents?.listensFor;if(!t)return;return Object.entries(t).map(e=>{const[t,n]=e;return {name:t,...n}})}getIconFromDefinition(e,t){return "1.2"===t?e.icons?.find(e=>e.icon)?.icon||void 0:e.icons?.find(e=>e.src)?.src||void 0}mergeBaseAppDataWithGlueManifest(e,t){let n=e;if(t.customProperties&&(n.userProperties={...e.userProperties,...t.customProperties}),t.details){const o={...e.createOptions,...t.details};n.createOptions=o,n.userProperties.details=o;}return Array.isArray(t.intents)&&(n.userProperties.intents=(n.userProperties.intents||[]).concat(t.intents)),n={...n,...t},delete n.details,delete n.intents,n}mergeDesktopConfigWithGlueManifest(e,t){const n=Object.assign({},e,t,{details:{...e.details,...t.details}});return Array.isArray(t.intents)&&(n.intents=(e.intents||[]).concat(t.intents)),n}}const Yc={common:{nonEmptyStringDecoder:Sc,nonNegativeNumberDecoder:Nc,regexDecoder:Dc},fdc3:{allDefinitionsDecoder:zc,v1DefinitionDecoder:Hc,v2DefinitionDecoder:jc}};var Uc;!function(e){e.USER_CANCELLED="User Closed Intents Resolver UI without choosing a handler",e.CALLER_NOT_DEFINED="Caller Id is not defined",e.TIMEOUT_HIT="Timeout hit",e.INTENT_NOT_FOUND="Cannot find Intent",e.HANDLER_NOT_FOUND="Cannot find Intent Handler",e.TARGET_INSTANCE_UNAVAILABLE="Cannot start Target Instance",e.INTENT_DELIVERY_FAILED="Target Instance did not add a listener",e.RESOLVER_UNAVAILABLE="Intents Resolver UI unavailable",e.RESOLVER_TIMEOUT="User did not choose a handler",e.INVALID_RESOLVER_RESPONSE="Intents Resolver UI returned invalid response",e.INTENT_HANDLER_REJECTION="Intent Handler function processing the raised intent threw an error or rejected the promise it returned";}(Uc||(Uc={}));const Kc=new class{_fdc3;_decoders=Yc;_errors={intents:Uc};get fdc3(){return this._fdc3||(this._fdc3=(new Wc).toApi()),this._fdc3}get decoders(){return this._decoders}get errors(){return this._errors}};Kc.fdc3;const Jc=Kc.decoders;Kc.errors;const qc=Jc.common.nonEmptyStringDecoder,Gc=Zl(ql("add"),ql("align-bottom"),ql("align-bottom-solid"),ql("align-left"),ql("align-left-bottom"),ql("align-left-bottom-solid"),ql("align-left-solid"),ql("align-left-top"),ql("align-left-top-solid"),ql("align-right"),ql("align-right-bottom"),ql("align-right-bottom-solid"),ql("align-right-solid"),ql("align-right-top"),ql("align-right-top-solid"),ql("align-top"),ql("align-top-solid"),ql("always-on-top"),ql("always-on-top-on"),ql("application"),ql("arrow-down-long"),ql("arrow-down-to-bracket"),ql("arrow-left-long"),ql("arrow-right-from-bracket"),ql("arrow-right-long"),ql("arrow-right"),ql("arrow-up"),ql("arrow-up-long"),ql("ban"),ql("bell"),ql("bell-solid"),ql("bookmark"),ql("bullseye-pointer"),ql("certificate"),ql("check"),ql("check-light"),ql("check-solid"),ql("chevron-down"),ql("chevron-left"),ql("chevron-right"),ql("chevron-up"),ql("circle-info"),ql("circle-xmark"),ql("circle-xmark-full"),ql("clock"),ql("clock-rotate-left"),ql("clone"),ql("close"),ql("cog"),ql("cog-solid"),ql("collapse"),ql("copy"),ql("download"),ql("delete-left"),ql("dev-tools"),ql("ellipsis"),ql("ellipsis-vertical"),ql("expand"),ql("envelope"),ql("envelope-open"),ql("exclamation-mark"),ql("expand"),ql("feedback"),ql("filter"),ql("floppy"),ql("floppy-disk-pen"),ql("folder"),ql("folder-open"),ql("globe"),ql("group"),ql("hidden"),ql("home"),ql("house"),ql("info"),ql("keyboard"),ql("layout"),ql("link"),ql("list-ul"),ql("lock"),ql("logo"),ql("minimize"),ql("minimize-down"),ql("paper-plane-top"),ql("paperclip"),ql("pause"),ql("pen-line"),ql("pen-to-square"),ql("pin"),ql("play"),ql("pop-in"),ql("pop-in-widget"),ql("pop-out"),ql("power-off"),ql("publish"),ql("refresh"),ql("resize"),ql("restore"),ql("rotate-right"),ql("search"),ql("search-filled"),ql("sleep"),ql("sliders"),ql("snooze"),ql("spinner"),ql("square"),ql("square-arrow-down"),ql("square-arrow-up"),ql("star"),ql("star-full"),ql("sticky-off"),ql("sticky-off-hover"),ql("sticky-on"),ql("sticky-on-hover"),ql("subscribe"),ql("system-close"),ql("system-maximize"),ql("system-minimize"),ql("thumbs-down"),ql("thumbs-up"),ql("trash"),ql("trash-can"),ql("triangle-exclamation"),ql("unlock"),ql("unpin"),ql("up-to-line"),ql("user"),ql("user-gear"),ql("visible"),ql("workspace")),Qc=Gl({id:qc,title:qc,description:Xl(Ul()),icon:Xl(Gc),iconSrc:Xl(qc),contextMenuActions:Xl(Ql(Jl())),type:qc}),Xc=Zl(ql("Left"),ql("Right")),Zc=Zl(ql("daily"),ql("weekly")),eu=Zl(ql("Sunday"),ql("Monday"),ql("Tuesday"),ql("Wednesday"),ql("Thursday"),ql("Friday"),ql("Saturday")),tu=Gl({customPrefs:Xl(Jl()),_launchpad_collapsedSections:Xl(Ql(qc)),_launchpad_favorites:Xl(Ql(Qc)),_launchpad_isLayoutsPanelOpen:Xl(Kl()),_launchpad_isCollapsed:Xl(Kl()),_launchpad_isPinned:Xl(Kl()),_launchpad_pinnedPosition:Xl(Xc),_launchpad_allowDocking:Xl(Kl()),_launchpad_minimizeToTray:Xl(Kl()),_launchpad_autoCloseStartingAppsAndWorkspaces:Xl(Kl()),_launchpad_showTutorialOnStartup:Xl(Kl()),_layouts_restoreLastSaved:Xl(Kl()),_layouts_saveCurrentOnExit:Xl(Kl()),_layouts_showUnsavedChangesPrompt:Xl(Kl()),_layouts_showDeletePrompt:Xl(Kl()),_downloads_askForEachDownload:Xl(Kl()),_downloads_location:Xl(Ul()),_system_scheduleRestart:Xl(Kl()),_system_scheduleRestartTime:Xl(qc),_system_scheduleRestartFrequency:Xl(Zc),_system_scheduleRestartDay:Xl(eu),_system_scheduleShutdown:Xl(Kl()),_system_scheduleShutdownTime:Xl(qc),_system_scheduleShutdownFrequency:Xl(Zc),_system_scheduleShutdownDay:Xl(eu)}),nu=async e=>{const{io:t,variant:n,text:o,error:i}=e,r=Tl(i);try{if(n===Al&&t.logger.warn(r?`${o} ${r}`:o),!("modals"in t)||!t.modals)throw new Error("Modals are not enabled.");const e={text:o,variant:n,ttl:Ol[n]};await t.modals.alerts.request(e);}catch(e){console.warn("Failed to request alert. ",{error:e});}},ou=reactExports.createContext(void 0);function au({prefKey:e}){const t=reactExports.useContext(IOConnectContext),n=reactExports.useContext(ou),o=n?.prefs?.[e],i=n?.isInitialSetupCompleted??false,[r,s]=reactExports.useState(!i),[u,m]=reactExports.useState(),p=reactExports.useRef(0);reactExports.useEffect(()=>{i&&0===p.current&&s(false);},[i]);const h=reactExports.useCallback(async n=>{if(!t)return;const o=++p.current;s(true),m(void 0);const i=async n=>{n&&await nu({io:t,variant:Al,text:`Failed to update prefKey "${e}".`,error:n}),o===p.current&&(s(false),n&&m({message:Tl(n)}));};let r;if(n instanceof Function)try{r=n((await t.contexts.get(rl))[e]);}catch(e){return i(e)}else r=n;try{const n=tu.runWithException({[e]:r});await t.contexts.update(rl,n);}catch(e){return i(e)}await i();},[t,e]);if(void 0===n)throw new Error("usePlatformPref must be used within a PlatformPrefsProvider");return {error:u,isLoading:r,update:h,value:o}}const su="var(--io-neutrals-0)",lu="var(--io-neutrals-900)";function cu(e){let t,n,o;if(e.startsWith("#")){let i=e.slice(1);3===i.length&&(i=i.split("").map(e=>e+e).join("")),t=parseInt(i.substring(0,2),16),n=parseInt(i.substring(2,4),16),o=parseInt(i.substring(4,6),16);}else {if(!e.startsWith("rgb")){const t=document.createElement("canvas").getContext("2d");if(!t)return lu;t.fillStyle=e;return cu(t.fillStyle)}{const i=e.match(/\d+/g)?.map(Number);if(!i||i.length<3)return lu;[t,n,o]=i;}}return (.2126*t+.7152*n+.0722*o)/255>.5?lu:su}function uu({className:t,channel:n,...o}){const i=x("io-channel-badge",t),r=reactExports.useMemo(()=>cu(n.color),[n.color]);return jsxRuntimeExports.jsx("div",{className:i,style:{color:r,backgroundColor:n.color},"data-testid":`channel-selector-badge-${n.color}`,...o,children:jsxRuntimeExports.jsx("span",{className:"io-channel-selector-badge-label","data-testid":"channel-selector-label",children:n.label})})}function du(){return jsxRuntimeExports.jsx(S,{variant:"check","data-testid":"channel-selector-channel-selected"})}function fu({channel:o,handleChannelRestricted:i,lockedChannelRestriction:r}){const a=(e,t)=>n=>{n.stopPropagation(),T(n)&&(n.preventDefault(),t||i({...o,[e]:!o[e]}));};return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:o.isSelected&&jsxRuntimeExports.jsx("span",{"data-testid":"channel-selector-channel-selected",children:"Active"})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-publish-toggle-container",children:jsxRuntimeExports.jsx(Ys,{label:"Publish",checked:o.write,onChange:()=>{i({...o,write:!o.write});},onKeyDown:a("write",!o.isSelected||r?.write),onClick:e=>e.stopPropagation(),disabled:!o.isSelected||r?.write})}),jsxRuntimeExports.jsx("div",{role:"button",onClick:e=>e.stopPropagation(),"data-testid":"channel-selector-subscribe-toggle-container",children:jsxRuntimeExports.jsx(Ys,{label:"Subscribe",checked:o.read,onChange:()=>{i({...o,read:!o.read});},onKeyDown:a("read",!o.isSelected||r?.read),disabled:!o.isSelected||r?.read})})]})}const mu=reactExports.createContext({});function pu({channel:t,isSelected:n,onChannelSelect:o,onChannelRestrict:i,...r}){const{variant:s,selectedChannels:c,lockedChannelRestrictions:u}=reactExports.useContext(mu),d=n||t.isSelected||c?.includes(t),f=u?.find(e=>e.name===t.name),m=reactExports.useCallback(()=>o?.({...t,isSelected:!d}),[t,o,d]),p=reactExports.useCallback(e=>{const n=e.target;n.closest(".io-toggle")||n.classList.contains("io-toggle")||T(e)&&(e.preventDefault(),o?.({...t,isSelected:!d}));},[t,o,d]),h=reactExports.useCallback(e=>{i?.(e);},[i]);return jsxRuntimeExports.jsx(_,{prepend:jsxRuntimeExports.jsx(uu,{channel:t}),append:"single"===s||"multi"===s?d&&jsxRuntimeExports.jsx(du,{}):jsxRuntimeExports.jsx(fu,{channel:t,handleChannelRestricted:h,lockedChannelRestriction:f}),isSelected:d,onClick:m,onKeyDown:p,...r,children:t.name},t.name)}function hu({variant:t,onVariantChange:n,disabled:o=false}){const i="directionalSingle"===t||"directionalMulti"===t,r=reactExports.useCallback(()=>{n?.(!i);},[i,n]),s=reactExports.useCallback(e=>{e.stopPropagation();},[]),l=reactExports.useCallback(e=>{e.stopPropagation(),T(e)&&(e.preventDefault(),o||r());},[o,r]);return jsxRuntimeExports.jsx(Ys,{label:"Directional",align:"right",checked:i,onChange:r,onClick:s,onKeyDown:l,disabled:o,"data-testid":`channel-selector-toggle-${t}`})}const gu=reactExports.forwardRef(({className:n,variant:o="single",variantToggle:i=false,channels:r=[],lockedChannelRestrictions:a=[],onVariantChange:s,onChannelSelect:l,onChannelRestrict:c,...d},f)=>{const m=x("io-list-channels","io-channel-selector-panel",("directionalSingle"===o||"directionalMulti"===o)&&"io-list-channels-directional io-channel-selector-panel-directional",n),p=reactExports.useMemo(()=>({variant:o,selectedChannels:r.filter(e=>e.isSelected),lockedChannelRestrictions:a,onVariantChange:s,onChannelSelect:l,onChannelRestrict:c}),[r,o,a,s,l,c]);return jsxRuntimeExports.jsx(mu.Provider,{value:p,children:jsxRuntimeExports.jsx("div",{className:m,ref:f,children:jsxRuntimeExports.jsxs(W,{...d,children:[jsxRuntimeExports.jsx(W.ItemTitle,{"data-testid":"channel-selector-title",append:i&&jsxRuntimeExports.jsx(hu,{variant:o,onVariantChange:s}),children:{single:"Select Channel",directionalSingle:"Select Directional Channel",multi:"Select Channels",directionalMulti:"Select Directional Channels"}[o]}),r?.map(t=>jsxRuntimeExports.jsx(pu,{channel:t,isSelected:t.isSelected,onChannelSelect:l,onChannelRestrict:c,"data-testid":`channel-selector-channel-${t.name}`},t.name))]})})})});gu.displayName="ChannelSelector";const vu=reactExports.forwardRef(({className:t,title:n,ariaLabel:o,onClick:i,onKeyDown:r,children:a,disabled:s=false,...l},c)=>jsxRuntimeExports.jsx("div",{ref:c,className:x(t,{disabled:s}),title:n,role:"button",tabIndex:s?-1:0,"aria-label":o,"aria-disabled":s,onClick:e=>{!s&&i&&i(e);},onKeyDown:e=>{!s&&r&&r(e);},...l,children:a}));vu.displayName="ChannelSelectorButtonWrapper";reactExports.createContext({config:{message:""},theme:"dark",setResult:()=>{}});function Au({title:n="Downloads"}){const{ItemSearch:o,HeaderButtons:i}=od();return jsxRuntimeExports.jsxs("div",{className:"io-dm-header",children:[jsxRuntimeExports.jsxs(ee,{draggable:true,children:[jsxRuntimeExports.jsx(ee.Title,{tag:"h1",text:n,size:"large"}),jsxRuntimeExports.jsx(i,{className:"non-draggable"})]}),jsxRuntimeExports.jsx(o,{})]})}const Lu=reactExports.createContext({configuration:{},items:[],removeItem:()=>{},pauseResumeItem:()=>{},cancelItem:()=>{},clearItems:()=>{},showItemInFolder:()=>{},isSettingsVisible:false,showSettings:()=>{},hideSettings:()=>{},searchQuery:"",setSearch:()=>{},itemsCount:0,setCount:()=>{},setDownloadLocation:()=>{},setDownloadLocationWithDialog:()=>{},sortItems:()=>[],downloadLocationList:[],isDownloadLocationDialogVisible:false}),Fu=()=>reactExports.useContext(Lu);function Bu({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=x("io-header-search",n),c=reactExports.useRef(null),{searchQuery:u,setSearch:f,itemsCount:m}=Fu(),p=u.length>0,h=reactExports.useCallback(()=>{f(""),c.current&&c.current.focus();},[f]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Bs,{ref:c,value:u,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?h:void 0,placeholder:o,onChange:e=>f(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-header-search-count",children:`${m} results`})]})}function Ru({className:n,...o}){const{MoreButton:i,CloseButton:r}=od();return jsxRuntimeExports.jsxs(Z,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{})]})}function _u({icon:n="ellipsis-vertical",...o}){const{items:i,clearItems:r,showSettings:a}=Fu(),s=0===i.length;return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsx(X.ButtonIcon,{icon:n,variant:"circle",size:"32"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsxs(X.List,{children:[jsxRuntimeExports.jsx(X.Item,{onClick:e=>(e=>{s?e.stopPropagation():r();})(e),disabled:s,children:"Clear All"}),jsxRuntimeExports.jsx(X.Item,{onClick:a,children:"Settings"})]})})]})}const Hu={minimizeWindow:async function(e){if(e)try{const t=e.windows?.my();await(t?.minimize());}catch(e){console.error("Failed to minimize window",e);}},closeWindow:async function(e,t){if(e)try{const n=e.windows?.my();await(n?.close(t));}catch(e){console.error("Failed to close window",e);}},restartPlatform:async function(e,t=true){if(e)try{await e.appManager.restart({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to restart io.Connect Desktop",e);}},shutdownPlatform:async function(e,t=true){if(e)try{await e.appManager.exit({autoSave:t,showDialog:!0});}catch(e){console.error("Failed to shutdown io.Connect Desktop",e);}}};function $u({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const a=reactExports.useContext(IOConnectContext);return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):Hu.closeWindow(a).catch(e=>{console.error("Failed to close window:",e);});},...r})}function ju(e,t=false,n=false,o=false){const i=e.getDate(),r=["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()],a=e.getFullYear(),s=e.getHours(),l=e.getMinutes();let c="";return c=l<10?`0${l}`:`${l}`,t?"Today"===t?n?"Today":`Today at ${s}:${c}`:"Yesterday"===t?n?"Yesterday":`Yesterday at ${s}:${c}`:`${s}:${c}`:o?n?`${r} ${i}`:`${r} ${i} at ${s}:${c}`:n?`${r} ${i}, ${a}`:`${r} ${i}, ${a} at ${s}:${c}`}function zu(e,t={showTime:true}){const n=new Date(1e3*e),o=new Date,i=Math.round((o-n)/1e3),r=Math.round(i/60),a=o.toDateString()===n.toDateString(),s=new Date(o.setDate(o.getDate()-1)).toDateString()===n.toDateString(),l=o.getFullYear()===n.getFullYear();return t.showTime?i<5?"Just Now":i<60?`${i} seconds ago`:i<90?"about a minute ago":r<60?`${r} minutes ago`:a?ju(n,"Today",false,true):s?ju(n,"Yesterday",false,true):l?ju(n,false,false,true):ju(n):a?"Today":s?"Yesterday":l?ju(n,false,true,true):ju(n,false,true)}function Vu({className:t,...n}){const o=x("io-dm-body",t),{DownloadListEmpty:i,ItemGroup:r,Item:a}=od(),{items:s,searchQuery:l,setCount:c,sortItems:d}=Fu(),m=d(s),p=Js(l),h=reactExports.useMemo(()=>m.filter(e=>e.displayInfo.filename.toLowerCase().includes(p.toLowerCase())||e.displayInfo.url.toLowerCase().includes(p.toLowerCase())),[m,p]),g=reactExports.useMemo(()=>h.map(e=>({...e,displayInfo:{...e.displayInfo,startTime:zu(e.displayInfo.startTime,{showTime:false})}})),[h]),v=reactExports.useMemo(()=>Object.values(g.reduce((e={},t)=>(e[t.displayInfo.startTime]=e[t.displayInfo.startTime]?.concat([])??[],e[t.displayInfo.startTime].push(t),e),{})),[g]);return reactExports.useEffect(()=>{c(h.length);},[h,c]),jsxRuntimeExports.jsx("div",{className:o,...n,children:v&&0!==v.length?v.map(t=>jsxRuntimeExports.jsx(r,{title:String(t[0].displayInfo.startTime)??null,children:t.map(t=>jsxRuntimeExports.jsx(a,{item:t},t.id))},t[0].id??"")):jsxRuntimeExports.jsx(i,{})})}function Wu({className:n,icon:o="download",text:i="No downloads to display.",...r}){const a=x("io-dm-no-items",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[jsxRuntimeExports.jsx(S,{variant:o}),jsxRuntimeExports.jsx("p",{children:i})]})}function Yu({className:n,title:o,children:i,...r}){const a=x("io-dm-item-group",n);return jsxRuntimeExports.jsxs("div",{className:a,...r,children:[o&&jsxRuntimeExports.jsx("p",{children:o}),i]})}function Uu({className:o,item:i,...r}){const{ItemHeader:a,ItemBody:s,ItemFooter:l}=od(),{state:c,url:u,filename:d,receivedBytes:f,totalBytes:m,speed:p,timeRemaining:h}=i.displayInfo;if(!i)return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{});const g=x("io-dm-item",i.displayInfo.state&&[c],o);return jsxRuntimeExports.jsxs("div",{className:g,...r,children:[jsxRuntimeExports.jsx(a,{itemID:i.id,filename:d,state:c}),jsxRuntimeExports.jsx(s,{state:c,url:u,bytesReceived:f,bytesTotal:m,speed:p,timeRemaining:h}),jsxRuntimeExports.jsx(l,{itemID:i.id,state:c})]})}function Ku({bytesReceived:t=0,bytesTotal:n=0,...o}){const i=reactExports.useCallback(()=>t&&n?Math.round(t/n*100):0,[t,n]);return jsxRuntimeExports.jsx(ti,{value:i(),...o})}function Ju({className:n,itemID:o,filename:i,state:r,cancel:s,remove:l,...c}){const u=x("io-dm-item-header",n),{cancelItem:d,removeItem:f}=Fu(),m=reactExports.useCallback(e=>{s?s(e):d(e);},[s,d]),p=reactExports.useCallback(e=>{l?l(e):f(e);},[l,f]);return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx(M,{text:i,style:{textDecoration:"interrupted"===r||"cancelled"===r?"line-through":"none"}}),jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"12",onClick:()=>{"progressing"===r||"paused"===r?m(o):p(o);}})]})}function qu({className:n,state:o,url:i,bytesReceived:r=0,bytesTotal:a=0,speed:s=0,timeRemaining:l=0,...c}){const u=x("io-dm-item-body",n),d=e=>{const t=["Bytes","KB","MB","GB","TB"];if(0===e)return "0";const n=Math.floor(Math.log(e)/Math.log(1024));return 0===n?`${e}${t[n]}`:`${(e/1024**n).toFixed(1)}${t[n]}`};return jsxRuntimeExports.jsxs("div",{className:u,...c,children:[jsxRuntimeExports.jsx("p",{className:"io-text-small",children:i}),(m=o,"cancelled"===m||"interrupted"===m||"completed"===m?null:jsxRuntimeExports.jsx(Ku,{variant:"paused"===m?"paused":"active",bytesReceived:r,bytesTotal:a})),jsxRuntimeExports.jsx("p",{className:"io-text-default-lh16",children:"completed"===o?`${d(r??0)} - Done`:"cancelled"===o||"interrupted"===o?`${d(r??0)}/${d(a??0)} - Failed`:`${d(r??0)}/${d(a??0)} (${f=s,(f?`${(f/1e6/8).toFixed(2)}MB/s`:0)??0}) - ${(e=>{const t=Math.floor(e/3600),n=Math.floor(e%3600/60);let o="";return t>0&&(o+=`${t} hour${t>1?"s":""}, `),n>0&&(o+=`${n} min${n>1?"s":""}, `),((e=Math.floor(e%60))>0||""===o)&&(o+=`${e} sec${1!==e?"s":""}`),`${o.trim()} left`})(l)??0}`})]});var f,m;}const Gu={success:"check-solid",warning:"exclamation-mark",critical:"exclamation-mark"};function Qu({className:n,variant:o,text:i}){const r=x("io-dm-item-status",`io-dm-item-status-${o}`,n);return jsxRuntimeExports.jsxs("div",{className:r,children:[o&&jsxRuntimeExports.jsx(S,{variant:Gu[o],className:"icon-severity",size:"10"}),i&&jsxRuntimeExports.jsx("p",{className:"io-text-smaller",children:i})]})}function Xu({className:o,itemID:i,state:r,pauseResume:s,showInFolder:l,cancel:c,...u}){const d=x("io-dm-item-footer",o),{pauseResumeItem:f,showItemInFolder:m,cancelItem:p}=Fu(),h=reactExports.useCallback(e=>{s?s(e):f(e);},[s,f]),g=reactExports.useCallback(e=>{l?l(e):m(e);},[l,m]),v=reactExports.useCallback(e=>{c?c(e):p(e);},[c,p]);return jsxRuntimeExports.jsx("div",{className:d,...u,children:(()=>{switch(r){case "progressing":return jsxRuntimeExports.jsxs(Z,{align:"right",children:[jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Pause",onClick:()=>h(i)}),jsxRuntimeExports.jsx(Z.Button,{variant:"link",text:"Cancel",onClick:()=>v(i)})]});case "paused":return jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Resume",onClick:()=>h(i)})});case "completed":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Qu,{variant:"success",text:"Complete"}),jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Show in Folder",onClick:()=>g(i)})})]});case "cancelled":return jsxRuntimeExports.jsx(Qu,{variant:"warning",text:"Cancelled"});case "interrupted":return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Qu,{variant:"critical",text:"Failed"}),jsxRuntimeExports.jsx(Z,{align:"right",children:jsxRuntimeExports.jsx(Z.Button,{variant:"primary",text:"Retry",onClick:()=>h(i)})})]});default:return null}})()})}function Zu({className:n,title:o="Download Settings",...i}){const r=x("io-dm-settings-panel",n),{configuration:{downloadFolder:a},hideSettings:s,setDownloadLocation:l,setDownloadLocationWithDialog:c,isDownloadLocationDialogVisible:u,downloadLocationList:d}=Fu();return jsxRuntimeExports.jsxs(Zo,{className:r,...i,children:[jsxRuntimeExports.jsxs(Zo.Header,{children:[jsxRuntimeExports.jsx(Zo.Header.Title,{size:"large",text:o,tag:"h1"}),jsxRuntimeExports.jsx(Zo.Header.ButtonGroup,{children:jsxRuntimeExports.jsx(N,{variant:"circle",icon:"close",size:"32",onClick:()=>{s();},disabled:u})})]}),jsxRuntimeExports.jsx(Zo.Body,{children:jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsxs(X,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(X.Button,{children:jsxRuntimeExports.jsx("span",{className:"io-dm-settings-panel-download-location",children:a??d[0]})}),d.length>1&&jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{children:d.map((t,n)=>!t||0===n||n>3?null:jsxRuntimeExports.jsx(X.Item,{onClick:()=>{l(t);},children:t},t))})})]}),jsxRuntimeExports.jsx(A,{className:"io-btn io-dm-settings-panel-download-location-btn",text:"Browse",onClick:()=>{c();},disabled:u})]})})]})}const ed={Header:Au,ItemSearch:Bu,HeaderButtons:Ru,MoreButton:_u,CloseButton:$u,Body:Vu,DownloadListEmpty:Wu,ItemGroup:Yu,Item:Uu,ItemProgress:Ku,ItemHeader:Ju,ItemBody:qu,ItemFooter:Xu,Settings:Zu},td=reactExports.createContext(ed),nd=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...ed,...n}),[n]);return jsxRuntimeExports.jsx(td.Provider,{value:o,children:t})});nd.displayName="ComponentsStore";const od=()=>reactExports.useContext(td);function ad(e){if(e&&e.errorHandling&&"function"!=typeof e.errorHandling&&"log"!==e.errorHandling&&"silent"!==e.errorHandling&&"throw"!==e.errorHandling)throw new Error('Invalid options passed to createRegistry. Prop errorHandling should be ["log" | "silent" | "throw" | (err) => void], but '+typeof e.errorHandling+" was passed");var t=e&&"function"==typeof e.errorHandling&&e.errorHandling,n={};function o(n,o){var i=n instanceof Error?n:new Error(n);if(t)t(i);else {var r='[ERROR] callback-registry: User callback for key "'+o+'" failed: '+i.stack;if(e)switch(e.errorHandling){case "log":return console.error(r);case "silent":return;case "throw":throw new Error(r)}console.error(r);}}return {add:function(e,t,i){var r=n[e];return r||(r=[],n[e]=r),r.push(t),i&&setTimeout(function(){i.forEach(function(i){var r;if(null===(r=n[e])||void 0===r?void 0:r.includes(t))try{Array.isArray(i)?t.apply(void 0,i):t.apply(void 0,[i]);}catch(t){o(t,e);}});},0),function(){var o=n[e];o&&(o=o.reduce(function(e,n,o){return n===t&&e.length===o||e.push(n),e},[]),0===o.length?delete n[e]:n[e]=o);}},execute:function(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];var r=n[e];if(!r||0===r.length)return [];var a=[];return r.forEach(function(n){try{var i=n.apply(void 0,t);a.push(i);}catch(t){a.push(void 0),o(t,e);}}),a},clear:function(){n={};},clearKey:function(e){n[e]&&delete n[e];}}}ad.default=ad;b(ad);const cd={env:"",region:"",version:"",buildVersion:"",theme:"",isError:false,mailingList:"",createJiraTicket:true,sendEmail:false,attachments:[],applicationTitle:"",allowEditRecipients:true,attachmentsViewMode:"category",environmentInfo:"",selectedCategories:[],errorMessage:"",showEnvironmentInfo:false,context:{},technicalInfo:"",sendEmailClient:"Outlook"};const fd=reactExports.createContext({config:cd,onThemeChanged:()=>{},openUrl:()=>{},submit:()=>Promise.resolve({}),setBounds:()=>{},close:()=>{},showMailingList:true,setShowMailingList:()=>{},attachmentCategories:[],submitInProgress:false,setSubmitInProgress:()=>{},submitStatus:{type:"success",title:"",text:""},setSubmitStatus:()=>{},submitCompleted:false,setSubmitCompleted:()=>{},jiraTicketURL:"",setJiraTicketURL:()=>{},submitFeedback:()=>{}}),md=()=>reactExports.useContext(fd);function pd({...n}){const{config:o,close:i}=md(),{applicationTitle:r}=o;return jsxRuntimeExports.jsxs(ee,{draggable:true,...n,children:[jsxRuntimeExports.jsx(ee.Title,{tag:"h1",text:r?`Feedback Form - ${r}`:"Feedback Form",size:"large"}),jsxRuntimeExports.jsx(ee.ButtonGroup,{className:"non-draggable",children:jsxRuntimeExports.jsx(ee.ButtonIcon,{variant:"circle",icon:"close",size:"32",onClick:()=>i()})})]})}function hd({className:n,handleSubmit:o,...i}){const r=x("io-panel-body",n),{config:a,submitFeedback:s}=md(),{IntroField:l,DescriptionField:c,TechInfoField:u,EnvInfoField:d,FileAttachmentsField:f,CategoryAttachmentsField:m,SettingsField:p,MailListField:h}=Od(),g=o??s,v=`Your feedback will be submitted to the ${a.buildVersion} team and some additional information will be automatically included to help us examine your issue.`;return jsxRuntimeExports.jsxs("form",{className:r,id:"feedback",onSubmit:e=>g(e),...i,children:[jsxRuntimeExports.jsx(l,{children:jsxRuntimeExports.jsx("p",{children:v})}),jsxRuntimeExports.jsx(p,{}),jsxRuntimeExports.jsx(h,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{readOnly:true}),jsxRuntimeExports.jsx(d,{readOnly:true}),"file"===a.attachmentsViewMode?jsxRuntimeExports.jsx(f,{}):jsxRuntimeExports.jsx(m,{})]})}function gd({...n}){const{FooterButtons:o}=Od(),{openUrl:i,submitInProgress:r,submitStatus:a,jiraTicketURL:s}=md();return jsxRuntimeExports.jsx(oe,{...n,children:jsxRuntimeExports.jsxs("div",r?{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsx(P,{children:jsxRuntimeExports.jsx("p",{children:a.title})}),jsxRuntimeExports.jsx(qo,{align:"right",size:"small"})]}:{className:"flex ai-center jc-between",children:[jsxRuntimeExports.jsxs(P,{children:[jsxRuntimeExports.jsx("p",{className:"error"===a.type?"io-text-error":"",children:a.title}),s&&jsxRuntimeExports.jsx("a",{href:s,onClick:e=>{e.preventDefault(),i(s);},children:s})]}),jsxRuntimeExports.jsx(o,{})]})})}function vd({className:t,...n}){const{CloseButton:o}=Od(),{close:i}=md(),r=x("non-draggable",t);return jsxRuntimeExports.jsx(Z,{className:r,...n,children:jsxRuntimeExports.jsx(o,{onClick:()=>i()})})}function yd({className:n,...o}){const{SubmitButton:i,CancelButton:r,CloseButton:a}=Od(),{close:s,submitCompleted:l}=md();return l?jsxRuntimeExports.jsx(Z,{className:n,...o,children:jsxRuntimeExports.jsx(a,{text:"Close",onClick:()=>s()})}):jsxRuntimeExports.jsxs(Z,{className:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{onClick:()=>s()})]})}function wd({text:t="Submit",...n}){return jsxRuntimeExports.jsx(A,{form:"feedback",type:"submit",variant:"primary",text:t,...n})}function bd({text:t="Cancel",...n}){return jsxRuntimeExports.jsx(A,{variant:"link",text:t,...n})}function Cd({...t}){return jsxRuntimeExports.jsx(A,{variant:"primary",...t})}function kd({showField:t=true,className:n,title:o,hint:i,children:r,...a}){return t?jsxRuntimeExports.jsx(P,{className:n,title:o,hint:i,...a,children:r}):null}function xd({showField:t=true,className:n,title:o="Description",hint:i,readOnly:r=false,disabled:a,...s}){return t?jsxRuntimeExports.jsx(P,{className:n,hint:i,title:"",...s,children:jsxRuntimeExports.jsx(Rs,{id:"description",name:"description",label:o,readOnly:r,disabled:a})}):null}function Sd({showField:t,className:n,title:o="Technical Information",hint:i,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=md(),u=t??c.errorMessage,d=r??c.errorMessage;return u&&d?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Rs,{id:"errorMessage",name:"errorMessage",label:o,value:d,readOnly:a,disabled:s})}):null}function Nd({showField:t,className:n,title:o="Environment Information",hint:i,fieldValue:r,readOnly:a=false,disabled:s,...l}){const{config:c}=md(),u=t??c.showEnvironmentInfo,d=r??c.environmentInfo;return u&&d?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Rs,{id:"environmentInfo",name:"environmentInfo",label:o,value:d,readOnly:a,disabled:s})}):null}function Dd({showField:t=true,className:n,title:o="Attachments",hint:i,readOnly:r=false,disabled:s,attachments:l,selectedCategories:c,...u}){const d=x("io-block-list-gap",n),{config:f}=md(),m=l??f.attachments,p=c??f.selectedCategories,h=reactExports.useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!m||m.length<=0?jsxRuntimeExports.jsx(P,{title:"Attachments",children:jsxRuntimeExports.jsx("p",{children:"No Attachments"})}):jsxRuntimeExports.jsx(P,{className:d,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"file-attachments",children:m.map(t=>jsxRuntimeExports.jsx(_s,{id:t.id,name:t.id,label:t.name,readOnly:r,disabled:s,defaultChecked:h(t.category)},t.id))})}):null}function Ed({showField:t=true,className:n,title:o="Attachments",hint:i,readOnly:r=false,disabled:s,categories:l,selectedCategories:c,...u}){const{config:d,attachmentCategories:f}=md(),m=l??f,p=c??d.selectedCategories,h=reactExports.useCallback(e=>!!p&&-1!==p.indexOf(e),[p]);return t?!m||m.length<=0?jsxRuntimeExports.jsx("p",{children:"No Attachments"}):jsxRuntimeExports.jsx(P,{className:n,title:o,hint:i,...u,children:jsxRuntimeExports.jsx("div",{className:"category-attachments",children:m.map(t=>jsxRuntimeExports.jsx(Ys,{id:t,name:t,align:"right",label:t,readOnly:r,disabled:s,defaultChecked:h(t)},t))})}):null}function Id({className:n,title:o,hint:i,showField:r=true,showJiraTicketField:a,jiraTicketLabel:s="Create Jira Ticket",showSendEmailField:l,sendEmailLabel:c="Send Email",readOnly:u=false,disabled:d,...f}){const m=x("io-block-list-gap",n),{config:p,showMailingList:h,setShowMailingList:g}=md();if(!r)return null;const v=a??p.createJiraTicket,y=l??p.sendEmail;return jsxRuntimeExports.jsxs(P,{className:m,hint:i,title:o,...f,children:[v&&jsxRuntimeExports.jsx(Ys,{id:"createJiraTicket",name:"createJiraTicket",label:s,align:"right",readOnly:u,disabled:d,defaultChecked:v}),y&&jsxRuntimeExports.jsx(Ys,{onChange:()=>{g(!h);},id:"sendEmail",name:"sendEmail",label:c,align:"right",readOnly:u,disabled:d,defaultChecked:y})]})}function Md({showField:t=true,className:n,title:o="Email List",hint:i="Separate with commas or semicolons.",placeholder:r="john.doe@somedomain.com; jane.doe@otherdomain.com",readOnly:a,disabled:s,...l}){const{config:c,showMailingList:u}=md(),d=t??c.sendEmail,f=a??false===c.allowEditRecipients;return d&&u?jsxRuntimeExports.jsx(P,{className:n,hint:i,...l,children:jsxRuntimeExports.jsx(Bs,{id:"mailingList",name:"mailingList",label:o,placeholder:r,readOnly:f,disabled:s,defaultValue:c.mailingList??""})}):null}const Pd={Header:pd,Body:hd,Footer:gd,HeaderButtons:vd,FooterButtons:yd,SubmitButton:wd,CancelButton:bd,CloseButton:Cd,IntroField:kd,DescriptionField:xd,TechInfoField:Sd,EnvInfoField:Nd,FileAttachmentsField:Dd,CategoryAttachmentsField:Ed,SettingsField:Id,MailListField:Md},Td=reactExports.createContext(Pd),Ad=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Pd,...n}),[n]);return jsxRuntimeExports.jsx(Td.Provider,{value:o,children:t})});function Od(e){return {...reactExports.useContext(Td),...e}}Ad.displayName="ComponentsStore";function Bd({className:n,title:o="General",...i}){const r=x("io-notifications-settings-panel-general",n),{AllowNotifications:a,AllowNotificationToasts:s,ShowNotificationBadge:l,CloseNotificationOnClick:c,PanelAutoHide:u,HideToastsAfter:d}=bf(),f=Zs();return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[f&&jsxRuntimeExports.jsx(a,{}),f&&jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),f&&jsxRuntimeExports.jsx(u,{}),f&&jsxRuntimeExports.jsx(c,{}),f&&jsxRuntimeExports.jsx(d,{})]})})}function _d(e){const t=reactExports.useContext(IOConnectContext),n=t?.appManager,o=Zs(),[i,r]=reactExports.useState([]),[s,d]=reactExports.useState(0),m="Platform",p=reactExports.useCallback((e="asc")=>{if(null===o)return [];const t=[...i].sort((t,n)=>{const o=(t.title??t.name).toLowerCase(),i=(n.title??n.name).toLowerCase();return "asc"===e?o.localeCompare(i):i.localeCompare(o)});if(!o){const e=t.findIndex(e=>e.name===m);if(-1!==e){const[n]=t.splice(e,1);t.unshift(n);}}return t},[i,o]),h=reactExports.useMemo(()=>p("asc"),[p]),g=reactExports.useMemo(()=>p("desc"),[p]);reactExports.useEffect(()=>{if(null===o||o)return;const e={title:"System",name:m,hidden:false,userProperties:{hidden:false}};r(t=>t.some(t=>t.name===e.name)?t:[...t,e]);},[o]),reactExports.useEffect(()=>{if(!n)return;const e=n.onAppAdded(e=>{r(t=>[...t,{title:e.title,name:e.name,hidden:e.hidden,userProperties:e.userProperties}]);}),t=n.onAppRemoved(e=>{r(t=>t.filter(t=>t.name!==e.name));}),o=n.onAppChanged(e=>{r(t=>{const n=t.find(t=>t.name===e.name);return [...t.filter(t=>t.name!==e.name),{title:e.title,name:n?.name,hidden:n?.hidden,allowed:n?.allowed,userProperties:n?.userProperties}]});});return ()=>{e(),t(),o();}},[n]);return {apps:reactExports.useMemo(()=>{if(!e?.sourceFilter||!Array.isArray(i))return i;const{allowed:t=[],blocked:n=[]}=e.sourceFilter,o=t.includes("*"),r=n.includes("*");let a=0;const s=i.map(e=>{const n=o||t.includes(e.name),i=!r&&n;return i&&a++,{...e,allowed:i}});return d(a),s},[e,i]),allowedApps:s,sortedAppsAsc:h,sortedAppsDesc:g,sortAppsAlphabetically:p}}const Wd=reactExports.createContext({allApps:[],settings:{},configuration:{},notifications:[],notificationsCount:0,onClose:()=>{},allApplications:0,clearAll:()=>{},showPanel:()=>{},hidePanel:()=>{},saveFilter:()=>{},clearAllOld:()=>{},notificationStacks:[],saveSetting:()=>{},allowedApplications:0,saveAllFilter:()=>{},isBulkActionsSupported:false,selectedNotifications:[],selectNotification:()=>{},selectAllNotifications:()=>{},clearMany:()=>{},snooze:()=>{},snoozeMany:()=>{},setState:()=>{},setStates:()=>{},setCount:()=>{}}),Yd=()=>reactExports.useContext(Wd);function Ud({label:t="Allow notifications",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=reactExports.useCallback(e=>{r({enabledNotifications:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.enabledNotifications??false,...o}):null}function Kd({label:t="Allow notification toasts",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({enabledToasts:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.enabledToasts??false,disabled:l,...o}):null}function Jd({label:t="Show notification badge",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs()&&!i.enabledNotifications,l=reactExports.useCallback(e=>{r({showNotificationBadge:e.target.checked});},[r]);return jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.showNotificationBadge??false,disabled:s,...o})}function qd({label:t="Close notification on click",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({closeNotificationOnClick:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.closeNotificationOnClick??false,disabled:l,...o}):null}function Gd({label:t="Auto hide panel",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=reactExports.useCallback(e=>{r({autoHidePanel:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:l,checked:i.autoHidePanel??false,...o}):null}const Qd=(e,t)=>e?`${e} ${t}${1!==e?"s":""}`:"",Xd=e=>{const t=Math.floor(e/60),n=e%60,o=Qd(t,"minute"),i=Qd(n,"second");return o+(o&&i?" ":"")+i};function Zd({className:n,title:o="Hide toasts after",items:i=[15,30,45,60],...r}){const s=x("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Yd(),u=Zs(),d=u&&!l.enabledNotifications,f=reactExports.useCallback((e=15e3)=>{l.toastExpiry!==e&&c({toastExpiry:1e3*e});},[l.toastExpiry,c]);return u?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper "+(d?"io-text-disabled":""),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(X.Button,{text:Xd((l.toastExpiry??0)/1e3)}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{f(t);},children:Xd(t)},t))})})]})]}):null}function ef({className:n,title:o="Stacking",...i}){const r=x("io-notifications-settings-panel-stacking",n),{ToastStacking:a,ToastStackBy:s}=bf();return Zs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}function tf({label:t="Allow toast stacking",align:n="right",...o}){const{settings:i,saveSetting:r}=Yd(),s=Zs(),l=s&&!i.enabledNotifications,c=reactExports.useCallback(e=>{r({toastStacking:e.target.checked});},[r]);return s?jsxRuntimeExports.jsx(Ys,{label:t,align:n,onChange:c,checked:i.toastStacking??false,disabled:l,...o}):null}const nf={application:"Application",severity:"Priority"},of=Object.fromEntries(Object.entries(nf).map(([e,t])=>[t,e]));function rf({className:n,title:o="Group by",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=c&&!s.enabledNotifications,d=reactExports.useCallback((e="severity")=>{s.stackBy!==e&&l({stackBy:e.toLowerCase()});},[s.stackBy,l]);if(!c)return null;const f=Object.values(nf);return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:x("io-text-clipper",{"io-text-disabled":u}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:u,children:[jsxRuntimeExports.jsx(X.Button,{text:nf[s.stackBy??"severity"]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:f.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{const e=of[t];d(e);},children:t},t))})})]})]})}function af({className:n,title:o="Placement",...i}){const r=x("io-notifications-settings-panel-placement",n),{PlacementPanel:a,PlacementToasts:s}=bf();return Zs()?jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o,children:[jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})}):null}const sf=e=>e.replace(/(^|-)\w/g,e=>e.toUpperCase().replace("-"," "));function lf({className:n,title:o="Panel position",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=reactExports.useCallback(e=>{e||(e="right"),s.placement?.panel!==e&&l({placement:{...s.placement,panel:e.toLowerCase()}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",children:[jsxRuntimeExports.jsx(X.Button,{text:s.placement?.panel?sf(s.placement?.panel):"Right"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:["Right","Left"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function cf({className:n,title:o="Toasts position",...i}){const r=x("flex","jc-between","ai-center",n),{settings:s,saveSetting:l}=Yd(),c=Zs(),u=reactExports.useCallback(e=>{if(e||(e="bottom-right"),s.placement?.toasts===e)return;const t=e.replace(/\s+/g,"-").toLowerCase();l({placement:{...s.placement,toasts:t}});},[s.placement,l]);if(!c)return null;return jsxRuntimeExports.jsxs("div",{className:r,...i,children:[jsxRuntimeExports.jsx("div",{className:"io-text-clipper",children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",children:[jsxRuntimeExports.jsx(X.Button,{text:s.placement?.toasts?sf(s.placement?.toasts):"Bottom Right"}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:["Top Right","Top Left","Bottom Right","Bottom Left"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{u(t);},children:t},t))})})]})]})}function uf({className:t,title:n="Snooze",...o}){const i=x("io-notifications-settings-panel-snooze",t),{SnoozeDuration:r}=bf(),{settings:a}=Yd();return Zs()&&a.snooze?.enabled?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsx(P,{title:n,children:jsxRuntimeExports.jsx(r,{})})}):null}function df({className:n,title:o="Default duration",items:i=[60,120,180,300],...r}){const s=x("flex","jc-between","ai-center",n),{settings:l,saveSetting:c}=Yd(),u=Zs(),d=u&&!l.enabledNotifications,f=reactExports.useCallback((e=6e4)=>{l.snooze&&l.snooze?.duration!==e&&c({snooze:{...l.snooze,duration:1e3*e}});},[l.snooze,c]);return u&&l.snooze?.enabled?jsxRuntimeExports.jsxs("div",{className:s,...r,children:[jsxRuntimeExports.jsx("div",{className:x("io-text-clipper",{"io-text-disabled":d}),children:jsxRuntimeExports.jsx("span",{children:o})}),jsxRuntimeExports.jsxs(X,{variant:"light",disabled:d,children:[jsxRuntimeExports.jsx(X.Button,{text:Xd((l.snooze?.duration??0)/1e3)}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",children:i.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>{f(t);},children:Xd(t)},t))})})]})]}):null}function ff({className:n,title:o,...i}){const r=x("io-notifications-settings-panel-subscriptions",n),{SubscribeAll:a,SubscribeApp:s,SubscribeMuteAll:l,SubscribeMuteApp:c}=bf(),{sortAppsAlphabetically:u}=_d(),d=Zs(),f=u(),m="io-notifications-subscriptions-grid "+(d?"with-three-columns":"with-two-columns");return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsxs(P,{title:o??(d?"Subscribe & Mute":"Subscribe"),children:[jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Sources"}),jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Subscribe"}),d&&jsxRuntimeExports.jsx("p",{className:"io-text-section",children:"Mute"})]}),jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:"All Sources"}),jsxRuntimeExports.jsx(a,{label:""}),d&&jsxRuntimeExports.jsx(l,{label:""})]}),f.map(n=>!n||n.hidden||n?.userProperties?.hidden?null:jsxRuntimeExports.jsxs("div",{className:m,children:[jsxRuntimeExports.jsx("p",{children:n.title??n.name}),jsxRuntimeExports.jsx(s,{app:n,label:""}),d&&jsxRuntimeExports.jsx(c,{app:n,label:""})]},n.name))]})})}function mf({label:t="All apps",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=Yd(),l=Zs()&&!i.enabledNotifications,c=reactExports.useCallback(e=>{s({subscribe:e.target.checked});},[s]);return jsxRuntimeExports.jsx(Ys,{align:n,label:t,onChange:c,checked:(r.sourceFilter?.allowed?.includes("*")&&0===r.sourceFilter?.blocked?.length)??false,disabled:l,...o})}function pf({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=Yd(),u=Zs()&&!s.enabledNotifications,d=reactExports.useCallback((e,t)=>{const n={...l.sourceFilter},o=n.allowed?.indexOf("*");"number"==typeof o&&o>-1&&(n.allowed?.splice(o,1),r.forEach(e=>{e.name!==t.name&&n.allowed?.push(e.name);})),e?(n.allowed=[...new Set([...n.allowed??[],t.name])],n.blocked=n.blocked?.filter(e=>e!==t.name)):(n.allowed=n.allowed?.filter(e=>e!==t.name),n.blocked=[...new Set([...n.blocked??[],t.name])]),n.allowed?.length&&n.blocked?.includes("*")&&n.blocked.splice(n.blocked.indexOf("*"),1),c(n);},[r,l.sourceFilter,c]);return jsxRuntimeExports.jsx(Ys,{id:o.name,label:t,align:n,onChange:e=>d(e.target.checked,o),checked:(l.sourceFilter?.allowed?.includes("*")&&!l.sourceFilter?.blocked?.includes(o.name)||l.sourceFilter?.allowed?.includes(o.name))??false,disabled:u,...i})}function hf({label:t="Mute all",align:n="right",...o}){const{settings:i,configuration:r,saveAllFilter:s}=Yd(),l=Zs(),c=l&&(!i.enabledNotifications||-1===r.sourceFilter?.allowed?.indexOf("*")),u=reactExports.useCallback(e=>{s({mute:e.target.checked});},[s]);return l?jsxRuntimeExports.jsx(Ys,{align:n,label:t,onChange:u,checked:r.sourceFilter?.muted?.includes("*")??false,disabled:c??false,...o}):null}function gf({label:t="App",align:n="right",app:o,...i}){const{allApps:r,settings:s,configuration:l,saveFilter:c}=Yd(),u=Zs(),d=u&&(!s.enabledNotifications||l.sourceFilter?.blocked?.includes("*")||l.sourceFilter?.blocked?.includes(o.name)||0===l.sourceFilter?.allowed?.length||-1===l.sourceFilter?.allowed?.indexOf(o.name)&&-1===l.sourceFilter?.allowed?.indexOf("*")&&0===l.sourceFilter?.blocked?.length),f=reactExports.useCallback((e,t)=>{const n={...l.sourceFilter},o=n?.muted?.indexOf("*");"number"==typeof o&&o>-1&&(n.muted?.splice(o,1),r.forEach(e=>{e.name===t.name||e.hidden||n.muted?.push(e.name);})),e?n.muted?.push(t.name):n.muted=n.muted?.filter(e=>e!==t.name),c(n);},[r,l.sourceFilter,c]);return !u||o.hidden?null:jsxRuntimeExports.jsx(Ys,{id:o.name,label:t,align:n,onChange:e=>f(e.target.checked,o),checked:(l.sourceFilter?.muted?.includes("*")||l.sourceFilter?.muted?.includes(o.name))??false,disabled:d??false,...i})}const vf={Body:n=>{const{General:o,Placement:i,Stacking:r,Snooze:a,Subscriptions:s}=bf();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},General:Bd,AllowNotifications:Ud,AllowNotificationToasts:Kd,ShowNotificationBadge:Jd,CloseNotificationOnClick:qd,PanelAutoHide:Gd,HideToastsAfter:Zd,Stacking:ef,ToastStacking:tf,ToastStackBy:rf,Placement:af,PlacementPanel:lf,PlacementToasts:cf,Snooze:uf,SnoozeDuration:df,Subscriptions:ff,SubscribeAll:mf,SubscribeApp:pf,SubscribeMuteAll:hf,SubscribeMuteApp:gf},yf=reactExports.createContext(vf),wf=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...vf,...n}),[n]);return jsxRuntimeExports.jsx(yf.Provider,{value:o,children:t})});wf.displayName="NotificationsSettingsPanelComponentsStoreProvider";const bf=()=>reactExports.useContext(yf);const Sf=reactExports.createContext({searchQuery:"",setSearch:()=>{},isPanelVisible:false,sortNotificationsBy:"newest",setSortBy:()=>{},viewNotificationsBy:"all",setViewBy:()=>{},isBulkActionsVisible:false,showBulkActions:()=>{},hideBulkActions:()=>{}}),Nf=()=>reactExports.useContext(Sf);function Df({title:n,onClose:o,onOpenSettings:i,...r}){const{HeaderCaptionTitle:a,HeaderCaptionCount:s,HeaderCaptionButtonSettings:l,HeaderCaptionButtonClose:c,HeaderActions:u,HeaderBulkActions:d,HeaderSearch:f}=vm(),{isBulkActionsSupported:m,notificationsCount:p}=Yd(),{isBulkActionsVisible:h}=Nf(),g=Zs();return jsxRuntimeExports.jsxs(Go,{...r,children:[jsxRuntimeExports.jsxs("div",{className:"io-panel-header-caption",children:[jsxRuntimeExports.jsx(a,{title:n}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsxs(Go.ButtonGroup,{children:[g&&jsxRuntimeExports.jsx(l,{onClick:i}),jsxRuntimeExports.jsx(c,{onClick:o})]})]}),jsxRuntimeExports.jsx(f,{}),m?jsxRuntimeExports.jsxs("div",{className:`io-panel-header-actions-wrapper ${h&&p>0?"io-panel-header-bulk-actions-opened":""} `,children:[jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]}):jsxRuntimeExports.jsx(u,{})]})}function Ef({text:n="Notifications",counter:o,...i}){const{notificationsCount:r}=Yd();return jsxRuntimeExports.jsx(M,{text:n,size:"large",...i,children:(o??true)&&jsxRuntimeExports.jsxs("span",{children:["(",r,")"]})})}const If="newest",Mf="oldest",Pf="severity",Tf=["None","Low","Medium","High","Critical"],Af={key:If,descending:true},Of=e=>[...e].sort((e,t)=>(t.timestamp||0)-(e.timestamp||0)),Lf=e=>[...e].sort((e,t)=>(e.timestamp||0)-(t.timestamp||0)),Ff=(e,t)=>{const n=Tf[0];return [...e].sort((e,o)=>{const i=Tf.indexOf(e.severity||n),r=Tf.indexOf(o.severity||n);return (t?-1:1)*(i-r)})},Bf={[If]:Of,[Mf]:Lf,[Pf]:Ff},Rf={severity:"Priority",newest:"Newest",oldest:"Oldest"};function _f({...t}){const[n,o]=reactExports.useState([]),{NotificationsList:i,Notification:r}=vm(),{notifications:a,setCount:s,notificationsCount:l}=Yd(),{sortNotificationsBy:m,viewNotificationsBy:p,searchQuery:h}=Nf(),g=reactExports.useRef(null),v=Js(h),y=reactExports.useMemo(()=>{const e=((e,t)=>{if(!e)return [];switch(t){case "all":default:return e;case "unread":return e.filter(e=>"Active"===e.state||"Stale"===e.state);case "read":return e.filter(e=>"Acknowledged"===e.state||"Seen"===e.state);case "snoozed":return e.filter(e=>"Snoozed"===e.state)}})(a,p);return e.filter(e=>e.title.toLowerCase().includes(v.toLowerCase())||e.source?.toLowerCase().includes(v.toLowerCase())||e.body?.toLowerCase().includes(v.toLowerCase()))},[v,a,p]);return reactExports.useEffect(()=>{switch(m){case "newest":o(Of(y));break;case "oldest":o(Lf(y));break;case "severity":o(Ff(y,true));break;default:o(y);}s(y.length);},[y,m,s]),reactExports.useEffect(()=>{g.current&&g.current?.scrollTo({top:0,behavior:"smooth"});},[v,l,m,p]),jsxRuntimeExports.jsx(Ls,{ref:g,element:Qo,elementProps:t,children:jsxRuntimeExports.jsx(i,{notifications:n,Notification:r})})}function Hf({...t}){const{FooterButtons:n}=vm();return jsxRuntimeExports.jsx(Xo,{...t,children:jsxRuntimeExports.jsx(n,{})})}function $f({className:n,...o}){const{FooterButtonClearAll:i,FooterButtonClearAllOld:r}=vm(),{notifications:a}=Yd(),[s,l]=reactExports.useState(false);return reactExports.useEffect(()=>{a.filter(e=>"Stale"===e.state||"Acknowledged"===e.state).length>0?l(true):l(false);},[a]),jsxRuntimeExports.jsxs(Z,{className:n,align:"right",...o,children:[jsxRuntimeExports.jsx(r,{disabled:!s}),jsxRuntimeExports.jsx(i,{disabled:a.length<=0})]})}function jf({text:t="Clear All",...n}){const{clearAll:o}=Yd();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{o();},...n})}function zf({text:t="Clear Old",...n}){const{clearAllOld:o}=Yd();return jsxRuntimeExports.jsx(A,{text:t,onClick:()=>{o();},...n})}function Vf(e){const t=Zs(),{onClose:n,settings:o}=Yd(),{isPanelVisible:i}=Nf(),{id:r,onClick:s,updateState:l}=e,c=reactExports.useCallback(async()=>{if(!s)return;if(!t){try{await s({close:!0});}catch(e){console.error(e);}return void n(r)}const e=o?.toastStacking??false;let a;a=i?o?.closeNotificationOnClick??true:!e&&null;try{null!==a?await s({close:a}):(await s({close:!1}),await l("Acknowledged"));}catch(e){console.error(e);}},[t,r,i,s,n,l,o?.closeNotificationOnClick,o?.toastStacking]),u=reactExports.useCallback(async e=>{const t=e.target;t.closest("button")||t.closest("[role='button']")||t.closest("a")||t.closest(".io-dropdown-menu")||await c();},[c]);return {handleClick:c,handleWrapperClick:u}}function Wf({className:n,notification:o,onClick:i,...r}){const a=x("io-notification-header",n),{HeaderCount:s,HeaderBadge:l,HeaderTitle:c,HeaderTimestamp:u,HeaderButtonSnooze:d,HeaderButtonClose:f}=sm(),{handleWrapperClick:m}=Vf(o);return jsxRuntimeExports.jsxs("div",{className:a,onClick:async e=>{await m(e),i?.(e);},...r,children:[jsxRuntimeExports.jsx(l,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o}),jsxRuntimeExports.jsx(c,{notification:o}),jsxRuntimeExports.jsx(u,{notification:o}),jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(d,{notification:o}),jsxRuntimeExports.jsx(f,{notification:o})]})]})}function Yf({notification:t,...n}){const{settings:o,notificationStacks:i}=Yd(),{isPanelVisible:r}=Nf(),{toastStacking:a,stackBy:s}=o,l="application"===s?"source":s??"source";let c=0;if(a){const e=i.find(e=>e.key===t[l]);c=e?.items.length??0;}return r||!a||c<=1?null:jsxRuntimeExports.jsx(ei,{...n,children:c>9?"9+":c})}function Uf({className:t,notification:n,...o}){if(!n?.severity||"None"===n.severity)return null;const i=x("io-notification-header-badge",t);return jsxRuntimeExports.jsx(ei,{className:i,...o,children:n.severity})}function Kf({className:n,state:o,severity:i="None",icon:r,...a}){const s=x("io-notification-header-icon",n),{isPanelVisible:l}=Nf();return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[r&&jsxRuntimeExports.jsx("span",{className:"io-notification-header-icon-image",children:jsxRuntimeExports.jsx("img",{src:r,alt:`io-notification-header-icon-${r}`})}),jsxRuntimeExports.jsx("span",{className:`io-notification-header-icon-badge color-${i.toLowerCase()}`,children:l&&"Acknowledged"!==o&&"New"})]})}function Jf({className:t,notification:{appTitle:n},...o}){const i=x("io-notification-header-title",t);return jsxRuntimeExports.jsx("div",{className:i,...o,children:n})}function qf({className:t,notification:{timestamp:n,state:o,snooze:i},...r}){const a=x("io-notification-timestamp",t);return jsxRuntimeExports.jsx("small",i&&"Snoozed"===o?{className:a,...r,children:"Snoozed"}:{className:a,...r,children:zu(n??0)??"Just Now"})}function Gf({notification:{id:t,state:n},...o}){const{settings:i,snooze:r}=Yd(),s=reactExports.useCallback(e=>{e.stopPropagation(),r&&r(t,i.snooze?.duration??0);},[t,r,i.snooze?.duration]);return r&&"Snoozed"!==n&&i.snooze?.enabled?jsxRuntimeExports.jsx(A,{icon:"snooze",variant:"link",text:"Snooze",tabIndex:-1,onClick:s,...o}):null}function Qf({notification:{id:t,updateState:n},...o}){const i=Zs(),{onClose:r}=Yd(),{isPanelVisible:s}=Nf(),l=reactExports.useCallback(e=>{e.stopPropagation(),!i||s?r(t):n("Acknowledged").catch(console.error);},[i,t,r,s,n]);return jsxRuntimeExports.jsx(N,{icon:"close",iconSize:"10",tabIndex:-1,onClick:l,...o})}function Xf({className:n,notification:o,...i}){const r=x("io-notification-body",n),{BodyIcon:a,BodyTitle:s,BodyDescription:l}=sm(),{icon:c,title:u,body:d}=o,{handleClick:f}=Vf(o);return jsxRuntimeExports.jsxs("div",{className:r,role:"button",tabIndex:0,onKeyDown:async e=>{T(e)&&await f();},onClick:f,...i,children:[jsxRuntimeExports.jsx(a,{icon:c}),jsxRuntimeExports.jsxs("div",{className:"io-notification-body-content",children:[jsxRuntimeExports.jsx(s,{text:u}),jsxRuntimeExports.jsx(l,{text:d})]})]})}function Zf({className:t,icon:n,altText:o="notification icon",...i}){if(!n)return null;const r=x("io-notification-body-icon",t);return jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx("img",{src:n,alt:o})})}function em({text:t,...n}){return jsxRuntimeExports.jsx(M,{text:t,...n})}function tm({className:t,text:n,...o}){const i=x("io-notification-body-description",t);return jsxRuntimeExports.jsx("p",{className:i,...o,children:n})}function nm({className:n,notification:o}){const i=x("io-notification-footer",n),{FooterButton:r}=sm(),{handleWrapperClick:a}=Vf(o),s=reactExports.useMemo(()=>function(e){const t=[],n={};if(!e)return;e.forEach(e=>{const{displayId:o,displayPath:i}=e,r={...e,children:[]};if(i&&i.length>0){let e;i.forEach((t,o)=>{0===o?e=n[t]:e&&(e=e.children?.find(e=>e.displayId===t));}),e&&e.children?.push(r);}else o?(t.push(r),n[o]=r):t.push(r);o&&(n[o]=r);});const o=e=>{e.forEach(e=>{0===e.children?.length?delete e.children:e.children&&o(e.children);});};return o(t),t}(o.actions),[o.actions]),l=(t,n)=>t.children?jsxRuntimeExports.jsx(Ko,{text:t.title,children:t.children.map(l)},`${t.title}-${n}`):((t,n)=>jsxRuntimeExports.jsx(Ko.Item,{children:jsxRuntimeExports.jsx(r,{variant:"link",className:"io-dropdown-menu-item io-dropdown-menu-button",notificationAction:t})},`${t.title}-${n}`))(t,n);return jsxRuntimeExports.jsx("div",{className:i,onClick:a,children:jsxRuntimeExports.jsx(Z,{align:"right",children:s?.map((n,o)=>n.children?jsxRuntimeExports.jsxs(Z,{variant:"append",children:[jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"default"}),jsxRuntimeExports.jsx(Ko,{variant:0===o?"primary":"default",icon:"ellipsis",children:n.children.map(l)})]},`${n.title}-${o}`):jsxRuntimeExports.jsx(r,{notificationAction:n,variant:0===o?"primary":"link"},`${n.title}-${o}`))})})}function om({notificationAction:t,...n}){const o=reactExports.useCallback(e=>{e.stopPropagation(),t.onClick({close:true});},[t]);return jsxRuntimeExports.jsx(A,{text:t.title,onClick:o,...n})}const im={Header:Wf,HeaderCount:Yf,HeaderBadge:Uf,HeaderIcon:Kf,HeaderTitle:Jf,HeaderTimestamp:qf,HeaderButtonSnooze:Gf,HeaderButtonClose:Qf,Body:Xf,BodyIcon:Zf,BodyTitle:em,BodyDescription:tm,Footer:nm,FooterButton:om},rm=reactExports.createContext(im),am=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...im,...n}),[n]);return jsxRuntimeExports.jsx(rm.Provider,{value:o,children:t})});function sm(e){return {...reactExports.useContext(rm),...e}}function lm({className:n,notification:o,...i}){const{Header:r,Body:a,Footer:s}=sm(),{severity:l}=o,c=x("io-notification",`severity-${l?.toLowerCase()??"none"}`,"Acknowledged"!==o.state&&"state-new",n);return jsxRuntimeExports.jsxs("div",{className:c,...i,children:[jsxRuntimeExports.jsx(r,{notification:o}),jsxRuntimeExports.jsx(a,{notification:o}),jsxRuntimeExports.jsx(s,{notification:o})]})}function cm({components:t,notification:n,...o}){return jsxRuntimeExports.jsx(am,{components:t,children:jsxRuntimeExports.jsx(lm,{notification:n,...o})})}function um({className:n,notifications:o,...i}){const[r,s]=reactExports.useState(false),l=o.length>=3?"large":"normal",u=2===o.length?"small":l,d=o[0].severity,f=x("io-notification-stack",r&&"io-notification-stack-open","normal"!==u&&[`io-notification-stack-${u}`],d&&"None"!==d&&[`io-notification-stack-${d.toLowerCase()}`],n),m=reactExports.useCallback(()=>{s(true);},[]),p=reactExports.useCallback(e=>{e.stopPropagation(),o.forEach(e=>{e.close();});},[o]);return jsxRuntimeExports.jsxs("div",{className:f,onClick:m,...i,children:[r&&"normal"!==u&&jsxRuntimeExports.jsx("div",{className:"io-notification-stack-btn",children:jsxRuntimeExports.jsx(A,{icon:"close",onClick:e=>p(e),children:jsxRuntimeExports.jsx("span",{className:"io-btn-text",children:"Clear Stack"})})}),o.map(t=>jsxRuntimeExports.jsx(cm,{notification:t},t.id))]})}function dm({...t}){const{notificationStacks:o}=Yd();return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment,{children:o.map(n=>jsxRuntimeExports.jsx(um,{notifications:n.items,...t},n.key))})}am.displayName="ComponentsStoreProvider";const fm=({notification:n,Notification:o,...i})=>{const{configuration:r,isBulkActionsSupported:a,selectedNotifications:s,selectNotification:l}=Yd(),{isPanelVisible:c,isBulkActionsVisible:u}=Nf(),d=r.sourceFilter?.muted??[],f=n.source&&d.includes(n.source)||d.includes("*");if(!c&&f)return null;const m=c&&a&&u,p=s.includes(n.id);return m?jsxRuntimeExports.jsxs("div",{className:x("io-notification-list-bulk-action-item",{selected:p}),children:[jsxRuntimeExports.jsx(_s,{checked:p,onChange:e=>l(n.id,e.target.checked)}),jsxRuntimeExports.jsx(o,{notification:n,...i})]}):jsxRuntimeExports.jsx(o,{notification:n,...i})};function mm({className:n,Notification:o,notifications:i=[],noNotificationText:r="No notifications to display",...a}){const s=x("io-notification-list",n),{settings:l}=Yd(),{isPanelVisible:c}=Nf(),{toastStacking:u}=l,d=u&&!c,f=i.length>0;return jsxRuntimeExports.jsxs("div",{className:s,...a,children:[d&&jsxRuntimeExports.jsx(dm,{}),!d&&(f?i.map(t=>jsxRuntimeExports.jsx(fm,{notification:t,Notification:o,...a},t.id)):jsxRuntimeExports.jsx("div",{className:"io-notification-list-no-notifications",children:r}))]})}const pm={Header:Df,HeaderCaptionTitle:Ef,HeaderCaptionCount:function({variant:t="primary",...n}){const{notificationsCount:o=0}=Yd();return 0===o?null:jsxRuntimeExports.jsx(I,{variant:t,...n,children:o>99?"99+":o})},HeaderCaptionButtonSettings:function({icon:t="cog",size:n="32",variant:o="circle",...i}){return Zs()?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,...i}):null},HeaderCaptionButtonClose:function({icon:t="close",size:n="32",variant:o="circle",onClick:i,...r}){const{hidePanel:a}=Yd(),s=Zs();return jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,onClick:e=>{i?i(e):s&&a();},...r})},HeaderActions:function({className:n,...o}){const i=x("io-panel-header-actions",n),{HeaderActionSort:r,HeaderActionView:a,HeaderActionClear:s,HeaderActionEdit:l}=vm();return jsxRuntimeExports.jsxs("div",{className:i,...o,children:[jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]}),jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{})]})]})},HeaderActionSort:function({text:n="Sort by",...o}){const{sortNotificationsBy:i,setSortBy:r}=Nf(),{onNotificationsSort:s}=(()=>{const{notifications:e}=Yd(),[t,n]=reactExports.useState(Af),{key:o,descending:i}=t,r=reactExports.useMemo(()=>Bf[o](e,i),[e,o,i]),s=reactExports.useCallback(e=>{n(t=>({key:e,descending:t.key!==e?Af.descending:!t.descending}));},[]);return {onNotificationsSort:s,sortedNotifications:r}})();return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(X.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:Rf[i].toLowerCase()})]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",checkIcon:"check",children:["Newest","Oldest","Priority"].map(t=>{const n="Priority"===t?"severity":t.toLowerCase();return jsxRuntimeExports.jsx(X.Item,{isSelected:i===n,onClick:()=>{r(n),s(n);},children:t},t)})})})]})},HeaderActionView:function({text:n="View",...o}){const{settings:i}=Yd(),{viewNotificationsBy:r,setViewBy:a}=Nf(),s=i.snooze?.enabled?["All","Read","Unread","Snoozed"]:["All","Read","Unread"];return jsxRuntimeExports.jsxs(X,{variant:"light",...o,children:[jsxRuntimeExports.jsxs(X.Button,{variant:"link",children:[n," ",jsxRuntimeExports.jsx("strong",{children:r})]}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{variant:"single",checkIcon:"check",children:s.map(t=>jsxRuntimeExports.jsx(X.Item,{isSelected:r===t.toLowerCase(),onClick:()=>a(t.toLowerCase()),children:t},t))})})]})},HeaderActionClear:function({text:t="Clear All",...n}){const{clearAll:o,notificationsCount:i}=Yd();return jsxRuntimeExports.jsx(A,{variant:"link",text:t,onClick:o,disabled:0===i,...n})},HeaderActionEdit:function({tooltip:t="Bulk Edit",...n}){const{isBulkActionsSupported:o,notificationsCount:i}=Yd(),{showBulkActions:r}=Nf();return o?jsxRuntimeExports.jsx(N,{icon:"pen-to-square",title:t,size:"32",onClick:r,disabled:0===i,...n}):null},HeaderBulkActions:function({className:n,...o}){const i=x("io-panel-header-bulk-actions",n),{HeaderBulkActionSelect:r,HeaderBulkActionSelectDropdown:a,HeaderBulkActionMarkAsRead:s,HeaderBulkActionMarkAsUnread:l,HeaderBulkActionSnooze:c,HeaderBulkActionClear:u,HeaderBulkActionClose:d}=vm(),{isBulkActionsSupported:f}=Yd();return f?jsxRuntimeExports.jsx("div",{className:i,...o,children:jsxRuntimeExports.jsxs(Z,{children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{}),jsxRuntimeExports.jsx(l,{}),jsxRuntimeExports.jsx(c,{}),jsxRuntimeExports.jsx(u,{}),jsxRuntimeExports.jsx(d,{})]})}):null},HeaderBulkActionSelect:function({...t}){const{isBulkActionsSupported:n,selectedNotifications:o,selectAllNotifications:i,notificationsCount:r}=Yd();return n?jsxRuntimeExports.jsx(_s,{checked:r===o.length&&r>0,onChange:e=>i("all",e.target.checked),disabled:0===r,...t}):null},HeaderBulkActionSelectDropdown:function({...n}){const{isBulkActionsSupported:o,selectAllNotifications:i,notificationsCount:r}=Yd();return o?jsxRuntimeExports.jsxs(X,{variant:"light",...n,children:[jsxRuntimeExports.jsx(X.ButtonIcon,{variant:"default",icon:"chevron-down",size:"16",iconSize:"10",disabled:0===r}),jsxRuntimeExports.jsx(B,{children:jsxRuntimeExports.jsxs(X.List,{variant:"single",checkIcon:"check",children:[jsxRuntimeExports.jsx(X.ItemSection,{children:"Select"}),["All","Read","Unread","Snoozed"].map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>i(t.toLowerCase(),true),children:t},t))]})})]}):null},HeaderBulkActionMarkAsRead:function({icon:t="envelope-open",size:n="32",variant:o="circle",tooltip:i="Mark as read",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Yd(),d=reactExports.useCallback(()=>{c(l,"Seen");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionMarkAsUnread:function({icon:t="envelope",size:n="32",variant:o="circle",tooltip:i="Mark as unread",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,setStates:c,notificationsCount:u}=Yd(),d=reactExports.useCallback(()=>{c(l,"Active");},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionSnooze:function({icon:t="snooze",size:n="32",variant:o="circle",tooltip:i="Snooze",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,snoozeMany:c,settings:u,notificationsCount:d}=Yd(),f=reactExports.useCallback(()=>{c(l,u.snooze?.duration??0);},[l,c,u.snooze?.duration]);return s&&u.snooze?.enabled?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:f,disabled:0===d,...r}):null},HeaderBulkActionClear:function({icon:t="trash",size:n="32",variant:o="circle",tooltip:i="Clear",...r}){const{isBulkActionsSupported:s,selectedNotifications:l,clearMany:c,notificationsCount:u}=Yd(),d=reactExports.useCallback(()=>{c(l);},[l,c]);return s?jsxRuntimeExports.jsx(N,{icon:t,size:n,variant:o,title:i,onClick:d,disabled:0===u,...r}):null},HeaderBulkActionClose:function({text:t="Done",variant:n="primary",...o}){const{isBulkActionsSupported:i,notificationsCount:r}=Yd(),{hideBulkActions:a}=Nf();return i?jsxRuntimeExports.jsx(A,{variant:n,text:t,onClick:a,disabled:0===r,...o}):null},HeaderSearch:function({className:n,placeholder:o="Search",iconPrepend:i="search",iconAppend:r="close",...s}){const l=x("io-panel-header-search",n),c=reactExports.useRef(null),{notificationsCount:u}=Yd(),{searchQuery:f,setSearch:m}=Nf(),p=f.length>0,h=reactExports.useCallback(()=>{m(""),c.current&&c.current.focus();},[m]);return jsxRuntimeExports.jsxs("div",{className:l,children:[jsxRuntimeExports.jsx(Bs,{ref:c,value:f,iconPrepend:i,iconAppend:p?r:void 0,iconAppendOnClick:p?h:void 0,placeholder:o,onChange:e=>m(e.target.value),...s}),p&&jsxRuntimeExports.jsx("p",{className:"io-panel-header-search-count",children:`${u} results`})]})},Body:_f,Footer:Hf,FooterButtons:$f,FooterButtonClearAll:jf,FooterButtonClearAllOld:zf,Notification:cm,NotificationsList:mm},hm=reactExports.createContext(pm),gm=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...pm,...n}),[n]);return jsxRuntimeExports.jsx(hm.Provider,{value:o,children:t})});function vm(e){return {...reactExports.useContext(hm),...e}}gm.displayName="ComponentsStoreProvider";const bm={Body:function({className:t,notifications:n,maxToasts:o=1,...i}){const r=x("io-toasts-body",t),{NotificationsList:a,Notification:s}=xm(),[l,u]=reactExports.useState([]);return reactExports.useEffect(()=>{const e=o<0?n.length:o,t=n.filter(e=>"Active"===e.state).slice(0,e);for(const e of t)e.onShow();u(t);},[n,o]),jsxRuntimeExports.jsx("div",{className:r,...i,children:jsxRuntimeExports.jsx(a,{Notification:s,notifications:l,noNotificationText:""})})},Notification:cm,NotificationsList:mm},Cm=reactExports.createContext(bm),km=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...bm,...n}),[n]);return jsxRuntimeExports.jsx(Cm.Provider,{value:o,children:t})});function xm(e){return {...reactExports.useContext(Cm),...e}}km.displayName="ComponentsStoreProvider";const Em=n=>{const{General:o,Layouts:i,Downloads:r,System:a}=Bp();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})},Im=({title:n="General",...o})=>{const{Theme:i,PinnedPosition:r,MinimizeToTray:a,ShowTutorialOnStartup:s}=Bp();return jsxRuntimeExports.jsxs(P,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(s,{})]})},Mm=({className:n,title:o="Theme",...i})=>{const{currentTheme:r,selectTheme:a}=el(),s=(()=>{const e=reactExports.useContext(IOConnectContext),[t,n]=reactExports.useState([]);return reactExports.useEffect(()=>{e&&e.themes?.list().then(n).catch(console.warn);},[e]),t})();return jsxRuntimeExports.jsxs("div",{className:x("flex jc-between ai-center",n),"data-testid":"theme-container",...i,children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper","data-testid":"theme-label",children:o}),jsxRuntimeExports.jsxs(X,{variant:"light","data-testid":"theme-dropdown",children:[jsxRuntimeExports.jsx(X.Button,{text:r?.displayName??"Dark","data-testid":"theme-dropdown-button"}),jsxRuntimeExports.jsx(X.Content,{"data-testid":"theme-dropdown-content",children:jsxRuntimeExports.jsx(X.List,{children:s.map(({displayName:t,name:n})=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>a(n),"data-testid":`theme-dropdown-item-${n}`,children:t},n))})})]})]})},Pm=({prefKey:n,options:o,disabled:i,...r})=>{const{isLoading:a,value:s="Select option",update:l}=au({prefKey:n});return jsxRuntimeExports.jsxs(X,{variant:"light",disabled:a||i,...r,children:[jsxRuntimeExports.jsx(X.Button,{children:s}),jsxRuntimeExports.jsx(X.Content,{children:jsxRuntimeExports.jsx(X.List,{children:o.map(t=>jsxRuntimeExports.jsx(X.Item,{onClick:()=>(async e=>{if(e!==s)try{await l(e);}catch(e){console.error("Failed to update platform preference:",e);}})(t),children:t},t))})})]})},Tm=({className:n,label:o="Pinned position",...i})=>jsxRuntimeExports.jsx(P,{className:x("io-block-list-gap",n),...i,children:jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(Pm,{className:n,prefKey:dl,options:["Left","Right"],...i})]})}),Am=({prefKey:t,...n})=>{const{isLoading:o,value:i=false,update:r}=au({prefKey:t});return jsxRuntimeExports.jsx(Ys,{checked:i,disabled:o,onChange:e=>r(e.target.checked),...n})},Om=({align:t="right",label:n="Allow docking",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:fl,...o}),Lm=({align:t="right",label:n="Minimize to tray",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:ml,...o}),Fm=({align:t="right",label:n="Auto-close on starting apps and workspaces",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:pl,disabled:true,...o}),Bm=({align:t="right",label:n="Show tutorial on startup",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:hl,...o}),Rm=({title:n="Layouts",...o})=>{const{LayoutsSaveCurrentOnExit:i,LayoutsShowDeletePrompt:r,LayoutsShowUnsavedChangesPrompt:a}=Bp();return jsxRuntimeExports.jsxs(P,{title:n,...o,children:[jsxRuntimeExports.jsx(i,{}),jsxRuntimeExports.jsx(a,{}),jsxRuntimeExports.jsx(r,{})]})},_m=({align:t="right",label:n="Restore last saved on startup",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:gl,...o}),Hm=({align:t="right",label:n="Save current on exit",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:vl,...o}),$m=({align:t="right",label:n="Show prompt for unsaved changes",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:yl,"data-testid":"layouts-show-unsaved-changes-prompt-toggle-button",...o}),jm=({align:t="right",label:n="Show prompt for deleting",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:wl,"data-testid":"layouts-show-delete-prompt-toggle",...o}),zm=({className:t,title:n="Downloads",...o})=>{const{DownloadsLocation:i}=Bp();return jsxRuntimeExports.jsx(P,{className:x("io-block-list-gap",t),title:n,...o,children:jsxRuntimeExports.jsx(i,{})})},Vm=({align:t="right",label:n="Ask where to save each file before downloading",...o})=>jsxRuntimeExports.jsx(Am,{align:t,label:n,prefKey:bl,...o}),Wm=({className:n,label:o="Location",...i})=>{const{configuration:{downloadFolder:r},setDownloadLocationWithDialog:a,isDownloadLocationDialogVisible:s,downloadLocationList:l}=Fu();return jsxRuntimeExports.jsxs(P,{className:x("io-preferences-download-section",n),...i,children:[jsxRuntimeExports.jsxs("div",{className:"flex jc-between ai-center",children:[jsxRuntimeExports.jsx("label",{className:"io-text-clipper",children:o}),jsxRuntimeExports.jsx(A,{text:"Change",onClick:a,disabled:s})]}),jsxRuntimeExports.jsx("p",{children:r??l?.[0]??"Not set"})]})},Ym=({className:n,title:o="System",...i})=>{const{SystemRestartSection:r,SystemShutdownSection:a}=Bp();return jsxRuntimeExports.jsxs(P,{className:x("io-block-list-gap",n),title:o,...i,children:[jsxRuntimeExports.jsx(r,{}),jsxRuntimeExports.jsx(a,{})]})};var Um=["onChange","onClose","onDayCreate","onDestroy","onKeyDown","onMonthChange","onOpen","onParseConfig","onReady","onValueUpdate","onYearChange","onPreCalendarPosition"],Km={_disable:[],allowInput:false,allowInvalidPreload:false,altFormat:"F j, Y",altInput:false,altInputClass:"form-control input",animate:"object"==typeof window&&-1===window.navigator.userAgent.indexOf("MSIE"),ariaDateFormat:"F j, Y",autoFillDefaultTime:true,clickOpens:true,closeOnSelect:true,conjunction:", ",dateFormat:"Y-m-d",defaultHour:12,defaultMinute:0,defaultSeconds:0,disable:[],disableMobile:false,enableSeconds:false,enableTime:false,errorHandler:function(e){return "undefined"!=typeof console&&console.warn(e)},getWeek:function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var n=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-n.getTime())/864e5-3+(n.getDay()+6)%7)/7)},hourIncrement:1,ignoredFocusElements:[],inline:false,locale:"default",minuteIncrement:5,mode:"single",monthSelectorType:"dropdown",nextArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",noCalendar:false,now:new Date,onChange:[],onClose:[],onDayCreate:[],onDestroy:[],onKeyDown:[],onMonthChange:[],onOpen:[],onParseConfig:[],onReady:[],onValueUpdate:[],onYearChange:[],onPreCalendarPosition:[],plugins:[],position:"auto",positionElement:void 0,prevArrow:"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",shorthandCurrentMonth:false,showMonths:1,static:false,time_24hr:false,weekNumbers:false,wrap:false},Jm={weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]},daysInMonth:[31,28,31,30,31,30,31,31,30,31,30,31],firstDayOfWeek:0,ordinal:function(e){var t=e%100;if(t>3&&t<21)return "th";switch(t%10){case 1:return "st";case 2:return "nd";case 3:return "rd";default:return "th"}},rangeSeparator:" to ",weekAbbreviation:"Wk",scrollTitle:"Scroll to increment",toggleTitle:"Click to toggle",amPM:["AM","PM"],yearAriaLabel:"Year",monthAriaLabel:"Month",hourAriaLabel:"Hour",minuteAriaLabel:"Minute",time_24hr:false},qm=function(e,t){return void 0===t&&(t=2),("000"+e).slice(-1*t)},Gm=function(e){return  true===e?1:0};function Qm(e,t){var n;return function(){var o=this,i=arguments;clearTimeout(n),n=setTimeout(function(){return e.apply(o,i)},t);}}var Xm=function(e){return e instanceof Array?e:[e]};function Zm(e,t,n){if(true===n)return e.classList.add(t);e.classList.remove(t);}function ep(e,t,n){var o=window.document.createElement(e);return t=t||"",n=n||"",o.className=t,void 0!==n&&(o.textContent=n),o}function tp(e){for(;e.firstChild;)e.removeChild(e.firstChild);}function np(e,t){return t(e)?e:e.parentNode?np(e.parentNode,t):void 0}function op(e,t){var n=ep("div","numInputWrapper"),o=ep("input","numInput "+e),i=ep("span","arrowUp"),r=ep("span","arrowDown");if(-1===navigator.userAgent.indexOf("MSIE 9.0")?o.type="number":(o.type="text",o.pattern="\\d*"),void 0!==t)for(var a in t)o.setAttribute(a,t[a]);return n.appendChild(o),n.appendChild(i),n.appendChild(r),n}function ip(e){try{return "function"==typeof e.composedPath?e.composedPath()[0]:e.target}catch(t){return e.target}}var rp=function(){},ap=function(e,t,n){return n.months[t?"shorthand":"longhand"][e]},sp={D:rp,F:function(e,t,n){e.setMonth(n.months.longhand.indexOf(t));},G:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},H:function(e,t){e.setHours(parseFloat(t));},J:function(e,t){e.setDate(parseFloat(t));},K:function(e,t,n){e.setHours(e.getHours()%12+12*Gm(new RegExp(n.amPM[1],"i").test(t)));},M:function(e,t,n){e.setMonth(n.months.shorthand.indexOf(t));},S:function(e,t){e.setSeconds(parseFloat(t));},U:function(e,t){return new Date(1e3*parseFloat(t))},W:function(e,t,n){var o=parseInt(t),i=new Date(e.getFullYear(),0,2+7*(o-1),0,0,0,0);return i.setDate(i.getDate()-i.getDay()+n.firstDayOfWeek),i},Y:function(e,t){e.setFullYear(parseFloat(t));},Z:function(e,t){return new Date(t)},d:function(e,t){e.setDate(parseFloat(t));},h:function(e,t){e.setHours((e.getHours()>=12?12:0)+parseFloat(t));},i:function(e,t){e.setMinutes(parseFloat(t));},j:function(e,t){e.setDate(parseFloat(t));},l:rp,m:function(e,t){e.setMonth(parseFloat(t)-1);},n:function(e,t){e.setMonth(parseFloat(t)-1);},s:function(e,t){e.setSeconds(parseFloat(t));},u:function(e,t){return new Date(parseFloat(t))},w:rp,y:function(e,t){e.setFullYear(2e3+parseFloat(t));}},lp={D:"",F:"",G:"(\\d\\d|\\d)",H:"(\\d\\d|\\d)",J:"(\\d\\d|\\d)\\w+",K:"",M:"",S:"(\\d\\d|\\d)",U:"(.+)",W:"(\\d\\d|\\d)",Y:"(\\d{4})",Z:"(.+)",d:"(\\d\\d|\\d)",h:"(\\d\\d|\\d)",i:"(\\d\\d|\\d)",j:"(\\d\\d|\\d)",l:"",m:"(\\d\\d|\\d)",n:"(\\d\\d|\\d)",s:"(\\d\\d|\\d)",u:"(.+)",w:"(\\d\\d|\\d)",y:"(\\d{2})"},cp={Z:function(e){return e.toISOString()},D:function(e,t,n){return t.weekdays.shorthand[cp.w(e,t,n)]},F:function(e,t,n){return ap(cp.n(e,t,n)-1,false,t)},G:function(e,t,n){return qm(cp.h(e,t,n))},H:function(e){return qm(e.getHours())},J:function(e,t){return void 0!==t.ordinal?e.getDate()+t.ordinal(e.getDate()):e.getDate()},K:function(e,t){return t.amPM[Gm(e.getHours()>11)]},M:function(e,t){return ap(e.getMonth(),true,t)},S:function(e){return qm(e.getSeconds())},U:function(e){return e.getTime()/1e3},W:function(e,t,n){return n.getWeek(e)},Y:function(e){return qm(e.getFullYear(),4)},d:function(e){return qm(e.getDate())},h:function(e){return e.getHours()%12?e.getHours()%12:12},i:function(e){return qm(e.getMinutes())},j:function(e){return e.getDate()},l:function(e,t){return t.weekdays.longhand[e.getDay()]},m:function(e){return qm(e.getMonth()+1)},n:function(e){return e.getMonth()+1},s:function(e){return e.getSeconds()},u:function(e){return e.getTime()},w:function(e){return e.getDay()},y:function(e){return String(e.getFullYear()).substring(2)}},up=function(e){var t=e.config,n=void 0===t?Km:t,o=e.l10n,i=void 0===o?Jm:o,r=e.isMobile,a=void 0!==r&&r;return function(e,t,o){var r=o||i;return void 0===n.formatDate||a?t.split("").map(function(t,o,i){return cp[t]&&"\\"!==i[o-1]?cp[t](e,r,n):"\\"!==t?t:""}).join(""):n.formatDate(e,t,r)}},dp=function(e){var t=e.config,n=void 0===t?Km:t,o=e.l10n,i=void 0===o?Jm:o;return function(e,t,o,r){if(0===e||e){var a,s=r||i,l=e;if(e instanceof Date)a=new Date(e.getTime());else if("string"!=typeof e&&void 0!==e.toFixed)a=new Date(e);else if("string"==typeof e){var c=t||(n||Km).dateFormat,u=String(e).trim();if("today"===u)a=new Date,o=true;else if(n&&n.parseDate)a=n.parseDate(e,c);else if(/Z$/.test(u)||/GMT$/.test(u))a=new Date(e);else {for(var d=void 0,f=[],m=0,p=0,h="";m<c.length;m++){var g=c[m],v="\\"===g,y="\\"===c[m-1]||v;if(lp[g]&&!y){h+=lp[g];var w=new RegExp(h).exec(e);w&&(d=true)&&f["Y"!==g?"push":"unshift"]({fn:sp[g],val:w[++p]});}else v||(h+=".");}a=n&&n.noCalendar?new Date((new Date).setHours(0,0,0,0)):new Date((new Date).getFullYear(),0,1,0,0,0,0),f.forEach(function(e){var t=e.fn,n=e.val;return a=t(a,n,s)||a}),a=d?a:void 0;}}if(a instanceof Date&&!isNaN(a.getTime()))return  true===o&&a.setHours(0,0,0,0),a;n.errorHandler(new Error("Invalid date provided: "+l));}}};function fp(e,t,n){return void 0===n&&(n=true),false!==n?new Date(e.getTime()).setHours(0,0,0,0)-new Date(t.getTime()).setHours(0,0,0,0):e.getTime()-t.getTime()}var mp=function(e,t,n){return 3600*e+60*t+n},pp=864e5;function hp(e){var t=e.defaultHour,n=e.defaultMinute,o=e.defaultSeconds;if(void 0!==e.minDate){var i=e.minDate.getHours(),r=e.minDate.getMinutes(),a=e.minDate.getSeconds();t<i&&(t=i),t===i&&n<r&&(n=r),t===i&&n===r&&o<a&&(o=e.minDate.getSeconds());}if(void 0!==e.maxDate){var s=e.maxDate.getHours(),l=e.maxDate.getMinutes();(t=Math.min(t,s))===s&&(n=Math.min(l,n)),t===s&&n===l&&(o=e.maxDate.getSeconds());}return {hours:t,minutes:n,seconds:o}}"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined or null to object");for(var o=function(t){t&&Object.keys(t).forEach(function(n){return e[n]=t[n]});},i=0,r=t;i<r.length;i++){o(r[i]);}return e});var gp=function(){return gp=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},gp.apply(this,arguments)},vp=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var o=Array(e),i=0;for(t=0;t<n;t++)for(var r=arguments[t],a=0,s=r.length;a<s;a++,i++)o[i]=r[a];return o};function yp(e,t){var n={config:gp(gp({},Km),bp.defaultConfig),l10n:Jm};function o(){var e;return (null===(e=n.calendarContainer)||void 0===e?void 0:e.getRootNode()).activeElement||document.activeElement}function i(e){return e.bind(n)}function r(){var e=n.config;false===e.weekNumbers&&1===e.showMonths||true!==e.noCalendar&&window.requestAnimationFrame(function(){if(void 0!==n.calendarContainer&&(n.calendarContainer.style.visibility="hidden",n.calendarContainer.style.display="block"),void 0!==n.daysContainer){var t=(n.days.offsetWidth+1)*e.showMonths;n.daysContainer.style.width=t+"px",n.calendarContainer.style.width=t+(void 0!==n.weekWrapper?n.weekWrapper.offsetWidth:0)+"px",n.calendarContainer.style.removeProperty("visibility"),n.calendarContainer.style.removeProperty("display");}});}function a(e){if(0===n.selectedDates.length){var t=void 0===n.config.minDate||fp(new Date,n.config.minDate)>=0?new Date:new Date(n.config.minDate.getTime()),o=hp(n.config);t.setHours(o.hours,o.minutes,o.seconds,t.getMilliseconds()),n.selectedDates=[t],n.latestSelectedDateObj=t;} void 0!==e&&"blur"!==e.type&&function(e){e.preventDefault();var t="keydown"===e.type,o=ip(e),i=o;void 0!==n.amPM&&o===n.amPM&&(n.amPM.textContent=n.l10n.amPM[Gm(n.amPM.textContent===n.l10n.amPM[0])]);var r=parseFloat(i.getAttribute("min")),a=parseFloat(i.getAttribute("max")),s=parseFloat(i.getAttribute("step")),l=parseInt(i.value,10),c=e.delta||(t?38===e.which?1:-1:0),u=l+s*c;if(void 0!==i.value&&2===i.value.length){var d=i===n.hourElement,f=i===n.minuteElement;u<r?(u=a+u+Gm(!d)+(Gm(d)&&Gm(!n.amPM)),f&&h(void 0,-1,n.hourElement)):u>a&&(u=i===n.hourElement?u-a-Gm(!n.amPM):r,f&&h(void 0,1,n.hourElement)),n.amPM&&d&&(1===s?u+l===23:Math.abs(u-l)>s)&&(n.amPM.textContent=n.l10n.amPM[Gm(n.amPM.textContent===n.l10n.amPM[0])]),i.value=qm(u);}}(e);var i=n._input.value;s(),Z(),n._input.value!==i&&n._debouncedChange();}function s(){if(void 0!==n.hourElement&&void 0!==n.minuteElement){var e,t,o=(parseInt(n.hourElement.value.slice(-2),10)||0)%24,i=(parseInt(n.minuteElement.value,10)||0)%60,r=void 0!==n.secondElement?(parseInt(n.secondElement.value,10)||0)%60:0;void 0!==n.amPM&&(e=o,t=n.amPM.textContent,o=e%12+12*Gm(t===n.l10n.amPM[1]));var a=void 0!==n.config.minTime||n.config.minDate&&n.minDateHasTime&&n.latestSelectedDateObj&&0===fp(n.latestSelectedDateObj,n.config.minDate,true),s=void 0!==n.config.maxTime||n.config.maxDate&&n.maxDateHasTime&&n.latestSelectedDateObj&&0===fp(n.latestSelectedDateObj,n.config.maxDate,true);if(void 0!==n.config.maxTime&&void 0!==n.config.minTime&&n.config.minTime>n.config.maxTime){var l=mp(n.config.minTime.getHours(),n.config.minTime.getMinutes(),n.config.minTime.getSeconds()),u=mp(n.config.maxTime.getHours(),n.config.maxTime.getMinutes(),n.config.maxTime.getSeconds()),d=mp(o,i,r);if(d>u&&d<l){var f=function(e){var t=Math.floor(e/3600),n=(e-3600*t)/60;return [t,n,e-3600*t-60*n]}(l);o=f[0],i=f[1],r=f[2];}}else {if(s){var m=void 0!==n.config.maxTime?n.config.maxTime:n.config.maxDate;(o=Math.min(o,m.getHours()))===m.getHours()&&(i=Math.min(i,m.getMinutes())),i===m.getMinutes()&&(r=Math.min(r,m.getSeconds()));}if(a){var p=void 0!==n.config.minTime?n.config.minTime:n.config.minDate;(o=Math.max(o,p.getHours()))===p.getHours()&&i<p.getMinutes()&&(i=p.getMinutes()),i===p.getMinutes()&&(r=Math.max(r,p.getSeconds()));}}c(o,i,r);}}function l(e){var t=e||n.latestSelectedDateObj;t&&t instanceof Date&&c(t.getHours(),t.getMinutes(),t.getSeconds());}function c(e,t,o){ void 0!==n.latestSelectedDateObj&&n.latestSelectedDateObj.setHours(e%24,t,o||0,0),n.hourElement&&n.minuteElement&&!n.isMobile&&(n.hourElement.value=qm(n.config.time_24hr?e:(12+e)%12+12*Gm(e%12==0)),n.minuteElement.value=qm(t),void 0!==n.amPM&&(n.amPM.textContent=n.l10n.amPM[Gm(e>=12)]),void 0!==n.secondElement&&(n.secondElement.value=qm(o)));}function u(e){var t=ip(e),n=parseInt(t.value)+(e.delta||0);(n/1e3>1||"Enter"===e.key&&!/[^\d]/.test(n.toString()))&&P(n);}function d(e,t,o,i){return t instanceof Array?t.forEach(function(t){return d(e,t,o,i)}):e instanceof Array?e.forEach(function(e){return d(e,t,o,i)}):(e.addEventListener(t,o,i),void n._handlers.push({remove:function(){return e.removeEventListener(t,o,i)}}))}function f(){J("onChange");}function m(e,t){var o=void 0!==e?n.parseDate(e):n.latestSelectedDateObj||(n.config.minDate&&n.config.minDate>n.now?n.config.minDate:n.config.maxDate&&n.config.maxDate<n.now?n.config.maxDate:n.now),i=n.currentYear,r=n.currentMonth;try{void 0!==o&&(n.currentYear=o.getFullYear(),n.currentMonth=o.getMonth());}catch(e){e.message="Invalid date supplied: "+o,n.config.errorHandler(e);}t&&n.currentYear!==i&&(J("onYearChange"),k()),!t||n.currentYear===i&&n.currentMonth===r||J("onMonthChange"),n.redraw();}function p(e){var t=ip(e);~t.className.indexOf("arrow")&&h(e,t.classList.contains("arrowUp")?1:-1);}function h(e,t,n){var o=e&&ip(e),i=n||o&&o.parentNode&&o.parentNode.firstChild,r=q("increment");r.delta=t,i&&i.dispatchEvent(r);}function g(e,t,o,i){var r=T(t,true),a=ep("span",e,t.getDate().toString());return a.dateObj=t,a.$i=i,a.setAttribute("aria-label",n.formatDate(t,n.config.ariaDateFormat)),-1===e.indexOf("hidden")&&0===fp(t,n.now)&&(n.todayDateElem=a,a.classList.add("today"),a.setAttribute("aria-current","date")),r?(a.tabIndex=-1,G(t)&&(a.classList.add("selected"),n.selectedDateElem=a,"range"===n.config.mode&&(Zm(a,"startRange",n.selectedDates[0]&&0===fp(t,n.selectedDates[0],true)),Zm(a,"endRange",n.selectedDates[1]&&0===fp(t,n.selectedDates[1],true)),"nextMonthDay"===e&&a.classList.add("inRange")))):a.classList.add("flatpickr-disabled"),"range"===n.config.mode&&function(e){return !("range"!==n.config.mode||n.selectedDates.length<2)&&(fp(e,n.selectedDates[0])>=0&&fp(e,n.selectedDates[1])<=0)}(t)&&!G(t)&&a.classList.add("inRange"),n.weekNumbers&&1===n.config.showMonths&&"prevMonthDay"!==e&&i%7==6&&n.weekNumbers.insertAdjacentHTML("beforeend","<span class='flatpickr-day'>"+n.config.getWeek(t)+"</span>"),J("onDayCreate",a),a}function v(e){e.focus(),"range"===n.config.mode&&F(e);}function y(e){for(var t=e>0?0:n.config.showMonths-1,o=e>0?n.config.showMonths:-1,i=t;i!=o;i+=e)for(var r=n.daysContainer.children[i],a=e>0?0:r.children.length-1,s=e>0?r.children.length:-1,l=a;l!=s;l+=e){var c=r.children[l];if(-1===c.className.indexOf("hidden")&&T(c.dateObj))return c}}function w(e,t){var i=o(),r=A(i||document.body),a=void 0!==e?e:r?i:void 0!==n.selectedDateElem&&A(n.selectedDateElem)?n.selectedDateElem:void 0!==n.todayDateElem&&A(n.todayDateElem)?n.todayDateElem:y(t>0?1:-1);void 0===a?n._input.focus():r?function(e,t){for(var o=-1===e.className.indexOf("Month")?e.dateObj.getMonth():n.currentMonth,i=t>0?n.config.showMonths:-1,r=t>0?1:-1,a=o-n.currentMonth;a!=i;a+=r)for(var s=n.daysContainer.children[a],l=o-n.currentMonth===a?e.$i+t:t<0?s.children.length-1:0,c=s.children.length,u=l;u>=0&&u<c&&u!=(t>0?c:-1);u+=r){var d=s.children[u];if(-1===d.className.indexOf("hidden")&&T(d.dateObj)&&Math.abs(e.$i-u)>=Math.abs(t))return v(d)}n.changeMonth(r),w(y(r),0);}(a,t):v(a);}function b(e,t){for(var o=(new Date(e,t,1).getDay()-n.l10n.firstDayOfWeek+7)%7,i=n.utils.getDaysInMonth((t-1+12)%12,e),r=n.utils.getDaysInMonth(t,e),a=window.document.createDocumentFragment(),s=n.config.showMonths>1,l=s?"prevMonthDay hidden":"prevMonthDay",c=s?"nextMonthDay hidden":"nextMonthDay",u=i+1-o,d=0;u<=i;u++,d++)a.appendChild(g("flatpickr-day "+l,new Date(e,t-1,u),0,d));for(u=1;u<=r;u++,d++)a.appendChild(g("flatpickr-day",new Date(e,t,u),0,d));for(var f=r+1;f<=42-o&&(1===n.config.showMonths||d%7!=0);f++,d++)a.appendChild(g("flatpickr-day "+c,new Date(e,t+1,f%r),0,d));var m=ep("div","dayContainer");return m.appendChild(a),m}function C(){if(void 0!==n.daysContainer){tp(n.daysContainer),n.weekNumbers&&tp(n.weekNumbers);for(var e=document.createDocumentFragment(),t=0;t<n.config.showMonths;t++){var o=new Date(n.currentYear,n.currentMonth,1);o.setMonth(n.currentMonth+t),e.appendChild(b(o.getFullYear(),o.getMonth()));}n.daysContainer.appendChild(e),n.days=n.daysContainer.firstChild,"range"===n.config.mode&&1===n.selectedDates.length&&F();}}function k(){if(!(n.config.showMonths>1||"dropdown"!==n.config.monthSelectorType)){var e=function(e){return !(void 0!==n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&e<n.config.minDate.getMonth())&&!(void 0!==n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()&&e>n.config.maxDate.getMonth())};n.monthsDropdownContainer.tabIndex=-1,n.monthsDropdownContainer.innerHTML="";for(var t=0;t<12;t++)if(e(t)){var o=ep("option","flatpickr-monthDropdown-month");o.value=new Date(n.currentYear,t).getMonth().toString(),o.textContent=ap(t,n.config.shorthandCurrentMonth,n.l10n),o.tabIndex=-1,n.currentMonth===t&&(o.selected=true),n.monthsDropdownContainer.appendChild(o);}}}function x(){var e,t=ep("div","flatpickr-month"),o=window.document.createDocumentFragment();n.config.showMonths>1||"static"===n.config.monthSelectorType?e=ep("span","cur-month"):(n.monthsDropdownContainer=ep("select","flatpickr-monthDropdown-months"),n.monthsDropdownContainer.setAttribute("aria-label",n.l10n.monthAriaLabel),d(n.monthsDropdownContainer,"change",function(e){var t=ip(e),o=parseInt(t.value,10);n.changeMonth(o-n.currentMonth),J("onMonthChange");}),k(),e=n.monthsDropdownContainer);var i=op("cur-year",{tabindex:"-1"}),r=i.getElementsByTagName("input")[0];r.setAttribute("aria-label",n.l10n.yearAriaLabel),n.config.minDate&&r.setAttribute("min",n.config.minDate.getFullYear().toString()),n.config.maxDate&&(r.setAttribute("max",n.config.maxDate.getFullYear().toString()),r.disabled=!!n.config.minDate&&n.config.minDate.getFullYear()===n.config.maxDate.getFullYear());var a=ep("div","flatpickr-current-month");return a.appendChild(e),a.appendChild(i),o.appendChild(a),t.appendChild(o),{container:t,yearElement:r,monthElement:e}}function S(){tp(n.monthNav),n.monthNav.appendChild(n.prevMonthNav),n.config.showMonths&&(n.yearElements=[],n.monthElements=[]);for(var e=n.config.showMonths;e--;){var t=x();n.yearElements.push(t.yearElement),n.monthElements.push(t.monthElement),n.monthNav.appendChild(t.container);}n.monthNav.appendChild(n.nextMonthNav);}function N(){n.weekdayContainer?tp(n.weekdayContainer):n.weekdayContainer=ep("div","flatpickr-weekdays");for(var e=n.config.showMonths;e--;){var t=ep("div","flatpickr-weekdaycontainer");n.weekdayContainer.appendChild(t);}return D(),n.weekdayContainer}function D(){if(n.weekdayContainer){var e=n.l10n.firstDayOfWeek,t=vp(n.l10n.weekdays.shorthand);e>0&&e<t.length&&(t=vp(t.splice(e,t.length),t.splice(0,e)));for(var o=n.config.showMonths;o--;)n.weekdayContainer.children[o].innerHTML="\n      <span class='flatpickr-weekday'>\n        "+t.join("</span><span class='flatpickr-weekday'>")+"\n      </span>\n      ";}}function E(e,t){ void 0===t&&(t=true);var o=t?e:e-n.currentMonth;o<0&&true===n._hidePrevMonthArrow||o>0&&true===n._hideNextMonthArrow||(n.currentMonth+=o,(n.currentMonth<0||n.currentMonth>11)&&(n.currentYear+=n.currentMonth>11?1:-1,n.currentMonth=(n.currentMonth+12)%12,J("onYearChange"),k()),C(),J("onMonthChange"),Q());}function I(e){return n.calendarContainer.contains(e)}function M(e){if(n.isOpen&&!n.config.inline){var t=ip(e),o=I(t),i=!(t===n.input||t===n.altInput||n.element.contains(t)||e.path&&e.path.indexOf&&(~e.path.indexOf(n.input)||~e.path.indexOf(n.altInput)))&&!o&&!I(e.relatedTarget),r=!n.config.ignoredFocusElements.some(function(e){return e.contains(t)});i&&r&&(n.config.allowInput&&n.setDate(n._input.value,false,n.config.altInput?n.config.altFormat:n.config.dateFormat),void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement&&""!==n.input.value&&void 0!==n.input.value&&a(),n.close(),n.config&&"range"===n.config.mode&&1===n.selectedDates.length&&n.clear(false));}}function P(e){if(!(!e||n.config.minDate&&e<n.config.minDate.getFullYear()||n.config.maxDate&&e>n.config.maxDate.getFullYear())){var t=e,o=n.currentYear!==t;n.currentYear=t||n.currentYear,n.config.maxDate&&n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth=Math.min(n.config.maxDate.getMonth(),n.currentMonth):n.config.minDate&&n.currentYear===n.config.minDate.getFullYear()&&(n.currentMonth=Math.max(n.config.minDate.getMonth(),n.currentMonth)),o&&(n.redraw(),J("onYearChange"),k());}}function T(e,t){var o;void 0===t&&(t=true);var i=n.parseDate(e,void 0,t);if(n.config.minDate&&i&&fp(i,n.config.minDate,void 0!==t?t:!n.minDateHasTime)<0||n.config.maxDate&&i&&fp(i,n.config.maxDate,void 0!==t?t:!n.maxDateHasTime)>0)return  false;if(!n.config.enable&&0===n.config.disable.length)return  true;if(void 0===i)return  false;for(var r=!!n.config.enable,a=null!==(o=n.config.enable)&&void 0!==o?o:n.config.disable,s=0,l=void 0;s<a.length;s++){if("function"==typeof(l=a[s])&&l(i))return r;if(l instanceof Date&&void 0!==i&&l.getTime()===i.getTime())return r;if("string"==typeof l){var c=n.parseDate(l,void 0,true);return c&&c.getTime()===i.getTime()?r:!r}if("object"==typeof l&&void 0!==i&&l.from&&l.to&&i.getTime()>=l.from.getTime()&&i.getTime()<=l.to.getTime())return r}return !r}function A(e){return void 0!==n.daysContainer&&(-1===e.className.indexOf("hidden")&&-1===e.className.indexOf("flatpickr-disabled")&&n.daysContainer.contains(e))}function O(e){var t=e.target===n._input,o=n._input.value.trimEnd()!==X();!t||!o||e.relatedTarget&&I(e.relatedTarget)||n.setDate(n._input.value,true,e.target===n.altInput?n.config.altFormat:n.config.dateFormat);}function L(t){var i=ip(t),r=n.config.wrap?e.contains(i):i===n._input,l=n.config.allowInput,c=n.isOpen&&(!l||!r),u=n.config.inline&&r&&!l;if(13===t.keyCode&&r){if(l)return n.setDate(n._input.value,true,i===n.altInput?n.config.altFormat:n.config.dateFormat),n.close(),i.blur();n.open();}else if(I(i)||c||u){var d=!!n.timeContainer&&n.timeContainer.contains(i);switch(t.keyCode){case 13:d?(t.preventDefault(),a(),z()):V(t);break;case 27:t.preventDefault(),z();break;case 8:case 46:r&&!n.config.allowInput&&(t.preventDefault(),n.clear());break;case 37:case 39:if(d||r)n.hourElement&&n.hourElement.focus();else {t.preventDefault();var f=o();if(void 0!==n.daysContainer&&(false===l||f&&A(f))){var m=39===t.keyCode?1:-1;t.ctrlKey?(t.stopPropagation(),E(m),w(y(1),0)):w(void 0,m);}}break;case 38:case 40:t.preventDefault();var p=40===t.keyCode?1:-1;n.daysContainer&&void 0!==i.$i||i===n.input||i===n.altInput?t.ctrlKey?(t.stopPropagation(),P(n.currentYear-p),w(y(1),0)):d||w(void 0,7*p):i===n.currentYearElement?P(n.currentYear-p):n.config.enableTime&&(!d&&n.hourElement&&n.hourElement.focus(),a(t),n._debouncedChange());break;case 9:if(d){var h=[n.hourElement,n.minuteElement,n.secondElement,n.amPM].concat(n.pluginElements).filter(function(e){return e}),g=h.indexOf(i);if(-1!==g){var v=h[g+(t.shiftKey?-1:1)];t.preventDefault(),(v||n._input).focus();}}else !n.config.noCalendar&&n.daysContainer&&n.daysContainer.contains(i)&&t.shiftKey&&(t.preventDefault(),n._input.focus());}}if(void 0!==n.amPM&&i===n.amPM)switch(t.key){case n.l10n.amPM[0].charAt(0):case n.l10n.amPM[0].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[0],s(),Z();break;case n.l10n.amPM[1].charAt(0):case n.l10n.amPM[1].charAt(0).toLowerCase():n.amPM.textContent=n.l10n.amPM[1],s(),Z();}(r||I(i))&&J("onKeyDown",t);}function F(e,t){if(void 0===t&&(t="flatpickr-day"),1===n.selectedDates.length&&(!e||e.classList.contains(t)&&!e.classList.contains("flatpickr-disabled"))){for(var o=e?e.dateObj.getTime():n.days.firstElementChild.dateObj.getTime(),i=n.parseDate(n.selectedDates[0],void 0,true).getTime(),r=Math.min(o,n.selectedDates[0].getTime()),a=Math.max(o,n.selectedDates[0].getTime()),s=false,l=0,c=0,u=r;u<a;u+=pp)T(new Date(u),true)||(s=s||u>r&&u<a,u<i&&(!l||u>l)?l=u:u>i&&(!c||u<c)&&(c=u));Array.from(n.rContainer.querySelectorAll("*:nth-child(-n+"+n.config.showMonths+") > ."+t)).forEach(function(t){var r,a,u,d=t.dateObj.getTime(),f=l>0&&d<l||c>0&&d>c;if(f)return t.classList.add("notAllowed"),void["inRange","startRange","endRange"].forEach(function(e){t.classList.remove(e);});s&&!f||(["startRange","inRange","endRange","notAllowed"].forEach(function(e){t.classList.remove(e);}),void 0!==e&&(e.classList.add(o<=n.selectedDates[0].getTime()?"startRange":"endRange"),i<o&&d===i?t.classList.add("startRange"):i>o&&d===i&&t.classList.add("endRange"),d>=l&&(0===c||d<=c)&&(a=i,u=o,(r=d)>Math.min(a,u)&&r<Math.max(a,u))&&t.classList.add("inRange")));});}}function B(){!n.isOpen||n.config.static||n.config.inline||$();}function R(e){return function(t){var o=n.config["_"+e+"Date"]=n.parseDate(t,n.config.dateFormat),i=n.config["_"+("min"===e?"max":"min")+"Date"];void 0!==o&&(n["min"===e?"minDateHasTime":"maxDateHasTime"]=o.getHours()>0||o.getMinutes()>0||o.getSeconds()>0),n.selectedDates&&(n.selectedDates=n.selectedDates.filter(function(e){return T(e)}),n.selectedDates.length||"min"!==e||l(o),Z()),n.daysContainer&&(j(),void 0!==o?n.currentYearElement[e]=o.getFullYear().toString():n.currentYearElement.removeAttribute(e),n.currentYearElement.disabled=!!i&&void 0!==o&&i.getFullYear()===o.getFullYear());}}function _(){return n.config.wrap?e.querySelector("[data-input]"):e}function H(){"object"!=typeof n.config.locale&&void 0===bp.l10ns[n.config.locale]&&n.config.errorHandler(new Error("flatpickr: invalid locale "+n.config.locale)),n.l10n=gp(gp({},bp.l10ns.default),"object"==typeof n.config.locale?n.config.locale:"default"!==n.config.locale?bp.l10ns[n.config.locale]:void 0),lp.D="("+n.l10n.weekdays.shorthand.join("|")+")",lp.l="("+n.l10n.weekdays.longhand.join("|")+")",lp.M="("+n.l10n.months.shorthand.join("|")+")",lp.F="("+n.l10n.months.longhand.join("|")+")",lp.K="("+n.l10n.amPM[0]+"|"+n.l10n.amPM[1]+"|"+n.l10n.amPM[0].toLowerCase()+"|"+n.l10n.amPM[1].toLowerCase()+")",void 0===gp(gp({},t),JSON.parse(JSON.stringify(e.dataset||{}))).time_24hr&&void 0===bp.defaultConfig.time_24hr&&(n.config.time_24hr=n.l10n.time_24hr),n.formatDate=up(n),n.parseDate=dp({config:n.config,l10n:n.l10n});}function $(e){if("function"!=typeof n.config.position){if(void 0!==n.calendarContainer){J("onPreCalendarPosition");var t=e||n._positionElement,o=Array.prototype.reduce.call(n.calendarContainer.children,function(e,t){return e+t.offsetHeight},0),i=n.calendarContainer.offsetWidth,r=n.config.position.split(" "),a=r[0],s=r.length>1?r[1]:null,l=t.getBoundingClientRect(),c=window.innerHeight-l.bottom,u="above"===a||"below"!==a&&c<o&&l.top>o,d=window.pageYOffset+l.top+(u?-o-2:t.offsetHeight+2);if(Zm(n.calendarContainer,"arrowTop",!u),Zm(n.calendarContainer,"arrowBottom",u),!n.config.inline){var f=window.pageXOffset+l.left,m=false,p=false;"center"===s?(f-=(i-l.width)/2,m=true):"right"===s&&(f-=i-l.width,p=true),Zm(n.calendarContainer,"arrowLeft",!m&&!p),Zm(n.calendarContainer,"arrowCenter",m),Zm(n.calendarContainer,"arrowRight",p);var h=window.document.body.offsetWidth-(window.pageXOffset+l.right),g=f+i>window.document.body.offsetWidth,v=h+i>window.document.body.offsetWidth;if(Zm(n.calendarContainer,"rightMost",g),!n.config.static)if(n.calendarContainer.style.top=d+"px",g)if(v){var y=function(){for(var e=null,t=0;t<document.styleSheets.length;t++){var n=document.styleSheets[t];if(n.cssRules){try{n.cssRules;}catch(e){continue}e=n;break}}return null!=e?e:(o=document.createElement("style"),document.head.appendChild(o),o.sheet);var o;}();if(void 0===y)return;var w=window.document.body.offsetWidth,b=Math.max(0,w/2-i/2),C=y.cssRules.length,k="{left:"+l.left+"px;right:auto;}";Zm(n.calendarContainer,"rightMost",false),Zm(n.calendarContainer,"centerMost",true),y.insertRule(".flatpickr-calendar.centerMost:before,.flatpickr-calendar.centerMost:after"+k,C),n.calendarContainer.style.left=b+"px",n.calendarContainer.style.right="auto";}else n.calendarContainer.style.left="auto",n.calendarContainer.style.right=h+"px";else n.calendarContainer.style.left=f+"px",n.calendarContainer.style.right="auto";}}}else n.config.position(n,e);}function j(){n.config.noCalendar||n.isMobile||(k(),Q(),C());}function z(){n._input.focus(),-1!==window.navigator.userAgent.indexOf("MSIE")||void 0!==navigator.msMaxTouchPoints?setTimeout(n.close,0):n.close();}function V(e){e.preventDefault(),e.stopPropagation();var t=np(ip(e),function(e){return e.classList&&e.classList.contains("flatpickr-day")&&!e.classList.contains("flatpickr-disabled")&&!e.classList.contains("notAllowed")});if(void 0!==t){var o=t,i=n.latestSelectedDateObj=new Date(o.dateObj.getTime()),r=(i.getMonth()<n.currentMonth||i.getMonth()>n.currentMonth+n.config.showMonths-1)&&"range"!==n.config.mode;if(n.selectedDateElem=o,"single"===n.config.mode)n.selectedDates=[i];else if("multiple"===n.config.mode){var a=G(i);a?n.selectedDates.splice(parseInt(a),1):n.selectedDates.push(i);}else "range"===n.config.mode&&(2===n.selectedDates.length&&n.clear(false,false),n.latestSelectedDateObj=i,n.selectedDates.push(i),0!==fp(i,n.selectedDates[0],true)&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()}));if(s(),r){var l=n.currentYear!==i.getFullYear();n.currentYear=i.getFullYear(),n.currentMonth=i.getMonth(),l&&(J("onYearChange"),k()),J("onMonthChange");}if(Q(),C(),Z(),r||"range"===n.config.mode||1!==n.config.showMonths?void 0!==n.selectedDateElem&&void 0===n.hourElement&&n.selectedDateElem&&n.selectedDateElem.focus():v(o),void 0!==n.hourElement&&void 0!==n.hourElement&&n.hourElement.focus(),n.config.closeOnSelect){var c="single"===n.config.mode&&!n.config.enableTime,u="range"===n.config.mode&&2===n.selectedDates.length&&!n.config.enableTime;(c||u)&&z();}f();}}n.parseDate=dp({config:n.config,l10n:n.l10n}),n._handlers=[],n.pluginElements=[],n.loadedPlugins=[],n._bind=d,n._setHoursFromDate=l,n._positionCalendar=$,n.changeMonth=E,n.changeYear=P,n.clear=function(e,t){ void 0===e&&(e=true);void 0===t&&(t=true);n.input.value="",void 0!==n.altInput&&(n.altInput.value="");void 0!==n.mobileInput&&(n.mobileInput.value="");n.selectedDates=[],n.latestSelectedDateObj=void 0,true===t&&(n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth());if(true===n.config.enableTime){var o=hp(n.config);c(o.hours,o.minutes,o.seconds);}n.redraw(),e&&J("onChange");},n.close=function(){n.isOpen=false,n.isMobile||(void 0!==n.calendarContainer&&n.calendarContainer.classList.remove("open"),void 0!==n._input&&n._input.classList.remove("active"));J("onClose");},n.onMouseOver=F,n._createElement=ep,n.createDay=g,n.destroy=function(){ void 0!==n.config&&J("onDestroy");for(var e=n._handlers.length;e--;)n._handlers[e].remove();if(n._handlers=[],n.mobileInput)n.mobileInput.parentNode&&n.mobileInput.parentNode.removeChild(n.mobileInput),n.mobileInput=void 0;else if(n.calendarContainer&&n.calendarContainer.parentNode)if(n.config.static&&n.calendarContainer.parentNode){var t=n.calendarContainer.parentNode;if(t.lastChild&&t.removeChild(t.lastChild),t.parentNode){for(;t.firstChild;)t.parentNode.insertBefore(t.firstChild,t);t.parentNode.removeChild(t);}}else n.calendarContainer.parentNode.removeChild(n.calendarContainer);n.altInput&&(n.input.type="text",n.altInput.parentNode&&n.altInput.parentNode.removeChild(n.altInput),delete n.altInput);n.input&&(n.input.type=n.input._type,n.input.classList.remove("flatpickr-input"),n.input.removeAttribute("readonly"));["_showTimeInput","latestSelectedDateObj","_hideNextMonthArrow","_hidePrevMonthArrow","__hideNextMonthArrow","__hidePrevMonthArrow","isMobile","isOpen","selectedDateElem","minDateHasTime","maxDateHasTime","days","daysContainer","_input","_positionElement","innerContainer","rContainer","monthNav","todayDateElem","calendarContainer","weekdayContainer","prevMonthNav","nextMonthNav","monthsDropdownContainer","currentMonthElement","currentYearElement","navigationCurrentMonth","selectedDateElem","config"].forEach(function(e){try{delete n[e];}catch(e){}});},n.isEnabled=T,n.jumpToDate=m,n.updateValue=Z,n.open=function(e,t){ void 0===t&&(t=n._positionElement);if(true===n.isMobile){if(e){e.preventDefault();var o=ip(e);o&&o.blur();}return void 0!==n.mobileInput&&(n.mobileInput.focus(),n.mobileInput.click()),void J("onOpen")}if(n._input.disabled||n.config.inline)return;var i=n.isOpen;n.isOpen=true,i||(n.calendarContainer.classList.add("open"),n._input.classList.add("active"),J("onOpen"),$(t));true===n.config.enableTime&&true===n.config.noCalendar&&(false!==n.config.allowInput||void 0!==e&&n.timeContainer.contains(e.relatedTarget)||setTimeout(function(){return n.hourElement.select()},50));},n.redraw=j,n.set=function(e,t){if(null!==e&&"object"==typeof e)for(var o in Object.assign(n.config,e),e) void 0!==W[o]&&W[o].forEach(function(e){return e()});else n.config[e]=t,void 0!==W[e]?W[e].forEach(function(e){return e()}):Um.indexOf(e)>-1&&(n.config[e]=Xm(t));n.redraw(),Z(true);},n.setDate=function(e,t,o){ void 0===t&&(t=false);void 0===o&&(o=n.config.dateFormat);if(0!==e&&!e||e instanceof Array&&0===e.length)return n.clear(t);Y(e,o),n.latestSelectedDateObj=n.selectedDates[n.selectedDates.length-1],n.redraw(),m(void 0,t),l(),0===n.selectedDates.length&&n.clear(false);Z(t),t&&J("onChange");},n.toggle=function(e){if(true===n.isOpen)return n.close();n.open(e);};var W={locale:[H,D],showMonths:[S,r,N],minDate:[m],maxDate:[m],positionElement:[K],clickOpens:[function(){ true===n.config.clickOpens?(d(n._input,"focus",n.open),d(n._input,"click",n.open)):(n._input.removeEventListener("focus",n.open),n._input.removeEventListener("click",n.open));}]};function Y(e,t){var o=[];if(e instanceof Array)o=e.map(function(e){return n.parseDate(e,t)});else if(e instanceof Date||"number"==typeof e)o=[n.parseDate(e,t)];else if("string"==typeof e)switch(n.config.mode){case "single":case "time":o=[n.parseDate(e,t)];break;case "multiple":o=e.split(n.config.conjunction).map(function(e){return n.parseDate(e,t)});break;case "range":o=e.split(n.l10n.rangeSeparator).map(function(e){return n.parseDate(e,t)});}else n.config.errorHandler(new Error("Invalid date supplied: "+JSON.stringify(e)));n.selectedDates=n.config.allowInvalidPreload?o:o.filter(function(e){return e instanceof Date&&T(e,false)}),"range"===n.config.mode&&n.selectedDates.sort(function(e,t){return e.getTime()-t.getTime()});}function U(e){return e.slice().map(function(e){return "string"==typeof e||"number"==typeof e||e instanceof Date?n.parseDate(e,void 0,true):e&&"object"==typeof e&&e.from&&e.to?{from:n.parseDate(e.from,void 0),to:n.parseDate(e.to,void 0)}:e}).filter(function(e){return e})}function K(){n._positionElement=n.config.positionElement||n._input;}function J(e,t){if(void 0!==n.config){var o=n.config[e];if(void 0!==o&&o.length>0)for(var i=0;o[i]&&i<o.length;i++)o[i](n.selectedDates,n.input.value,n,t);"onChange"===e&&(n.input.dispatchEvent(q("change")),n.input.dispatchEvent(q("input")));}}function q(e){var t=document.createEvent("Event");return t.initEvent(e,true,true),t}function G(e){for(var t=0;t<n.selectedDates.length;t++){var o=n.selectedDates[t];if(o instanceof Date&&0===fp(o,e))return ""+t}return  false}function Q(){n.config.noCalendar||n.isMobile||!n.monthNav||(n.yearElements.forEach(function(e,t){var o=new Date(n.currentYear,n.currentMonth,1);o.setMonth(n.currentMonth+t),n.config.showMonths>1||"static"===n.config.monthSelectorType?n.monthElements[t].textContent=ap(o.getMonth(),n.config.shorthandCurrentMonth,n.l10n)+" ":n.monthsDropdownContainer.value=o.getMonth().toString(),e.value=o.getFullYear().toString();}),n._hidePrevMonthArrow=void 0!==n.config.minDate&&(n.currentYear===n.config.minDate.getFullYear()?n.currentMonth<=n.config.minDate.getMonth():n.currentYear<n.config.minDate.getFullYear()),n._hideNextMonthArrow=void 0!==n.config.maxDate&&(n.currentYear===n.config.maxDate.getFullYear()?n.currentMonth+1>n.config.maxDate.getMonth():n.currentYear>n.config.maxDate.getFullYear()));}function X(e){var t=e||(n.config.altInput?n.config.altFormat:n.config.dateFormat);return n.selectedDates.map(function(e){return n.formatDate(e,t)}).filter(function(e,t,o){return "range"!==n.config.mode||n.config.enableTime||o.indexOf(e)===t}).join("range"!==n.config.mode?n.config.conjunction:n.l10n.rangeSeparator)}function Z(e){ void 0===e&&(e=true),void 0!==n.mobileInput&&n.mobileFormatStr&&(n.mobileInput.value=void 0!==n.latestSelectedDateObj?n.formatDate(n.latestSelectedDateObj,n.mobileFormatStr):""),n.input.value=X(n.config.dateFormat),void 0!==n.altInput&&(n.altInput.value=X(n.config.altFormat)),false!==e&&J("onValueUpdate");}function ee(e){var t=ip(e),o=n.prevMonthNav.contains(t),i=n.nextMonthNav.contains(t);o||i?E(o?-1:1):n.yearElements.indexOf(t)>=0?t.select():t.classList.contains("arrowUp")?n.changeYear(n.currentYear+1):t.classList.contains("arrowDown")&&n.changeYear(n.currentYear-1);}return function(){n.element=n.input=e,n.isOpen=false,function(){var o=["wrap","weekNumbers","allowInput","allowInvalidPreload","clickOpens","time_24hr","enableTime","noCalendar","altInput","shorthandCurrentMonth","inline","static","enableSeconds","disableMobile"],r=gp(gp({},JSON.parse(JSON.stringify(e.dataset||{}))),t),a={};n.config.parseDate=r.parseDate,n.config.formatDate=r.formatDate,Object.defineProperty(n.config,"enable",{get:function(){return n.config._enable},set:function(e){n.config._enable=U(e);}}),Object.defineProperty(n.config,"disable",{get:function(){return n.config._disable},set:function(e){n.config._disable=U(e);}});var s="time"===r.mode;if(!r.dateFormat&&(r.enableTime||s)){var l=bp.defaultConfig.dateFormat||Km.dateFormat;a.dateFormat=r.noCalendar||s?"H:i"+(r.enableSeconds?":S":""):l+" H:i"+(r.enableSeconds?":S":"");}if(r.altInput&&(r.enableTime||s)&&!r.altFormat){var c=bp.defaultConfig.altFormat||Km.altFormat;a.altFormat=r.noCalendar||s?"h:i"+(r.enableSeconds?":S K":" K"):c+" h:i"+(r.enableSeconds?":S":"")+" K";}Object.defineProperty(n.config,"minDate",{get:function(){return n.config._minDate},set:R("min")}),Object.defineProperty(n.config,"maxDate",{get:function(){return n.config._maxDate},set:R("max")});var u=function(e){return function(t){n.config["min"===e?"_minTime":"_maxTime"]=n.parseDate(t,"H:i:S");}};Object.defineProperty(n.config,"minTime",{get:function(){return n.config._minTime},set:u("min")}),Object.defineProperty(n.config,"maxTime",{get:function(){return n.config._maxTime},set:u("max")}),"time"===r.mode&&(n.config.noCalendar=true,n.config.enableTime=true);Object.assign(n.config,a,r);for(var d=0;d<o.length;d++)n.config[o[d]]=true===n.config[o[d]]||"true"===n.config[o[d]];Um.filter(function(e){return void 0!==n.config[e]}).forEach(function(e){n.config[e]=Xm(n.config[e]||[]).map(i);}),n.isMobile=!n.config.disableMobile&&!n.config.inline&&"single"===n.config.mode&&!n.config.disable.length&&!n.config.enable&&!n.config.weekNumbers&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);for(d=0;d<n.config.plugins.length;d++){var f=n.config.plugins[d](n)||{};for(var m in f)Um.indexOf(m)>-1?n.config[m]=Xm(f[m]).map(i).concat(n.config[m]):void 0===r[m]&&(n.config[m]=f[m]);}r.altInputClass||(n.config.altInputClass=_().className+" "+n.config.altInputClass);J("onParseConfig");}(),H(),function(){if(n.input=_(),!n.input)return void n.config.errorHandler(new Error("Invalid input element specified"));n.input._type=n.input.type,n.input.type="text",n.input.classList.add("flatpickr-input"),n._input=n.input,n.config.altInput&&(n.altInput=ep(n.input.nodeName,n.config.altInputClass),n._input=n.altInput,n.altInput.placeholder=n.input.placeholder,n.altInput.disabled=n.input.disabled,n.altInput.required=n.input.required,n.altInput.tabIndex=n.input.tabIndex,n.altInput.type="text",n.input.setAttribute("type","hidden"),!n.config.static&&n.input.parentNode&&n.input.parentNode.insertBefore(n.altInput,n.input.nextSibling));n.config.allowInput||n._input.setAttribute("readonly","readonly");K();}(),function(){n.selectedDates=[],n.now=n.parseDate(n.config.now)||new Date;var e=n.config.defaultDate||("INPUT"!==n.input.nodeName&&"TEXTAREA"!==n.input.nodeName||!n.input.placeholder||n.input.value!==n.input.placeholder?n.input.value:null);e&&Y(e,n.config.dateFormat);n._initialDate=n.selectedDates.length>0?n.selectedDates[0]:n.config.minDate&&n.config.minDate.getTime()>n.now.getTime()?n.config.minDate:n.config.maxDate&&n.config.maxDate.getTime()<n.now.getTime()?n.config.maxDate:n.now,n.currentYear=n._initialDate.getFullYear(),n.currentMonth=n._initialDate.getMonth(),n.selectedDates.length>0&&(n.latestSelectedDateObj=n.selectedDates[0]);void 0!==n.config.minTime&&(n.config.minTime=n.parseDate(n.config.minTime,"H:i"));void 0!==n.config.maxTime&&(n.config.maxTime=n.parseDate(n.config.maxTime,"H:i"));n.minDateHasTime=!!n.config.minDate&&(n.config.minDate.getHours()>0||n.config.minDate.getMinutes()>0||n.config.minDate.getSeconds()>0),n.maxDateHasTime=!!n.config.maxDate&&(n.config.maxDate.getHours()>0||n.config.maxDate.getMinutes()>0||n.config.maxDate.getSeconds()>0);}(),n.utils={getDaysInMonth:function(e,t){return void 0===e&&(e=n.currentMonth),void 0===t&&(t=n.currentYear),1===e&&(t%4==0&&t%100!=0||t%400==0)?29:n.l10n.daysInMonth[e]}},n.isMobile||function(){var e=window.document.createDocumentFragment();if(n.calendarContainer=ep("div","flatpickr-calendar"),n.calendarContainer.tabIndex=-1,!n.config.noCalendar){if(e.appendChild((n.monthNav=ep("div","flatpickr-months"),n.yearElements=[],n.monthElements=[],n.prevMonthNav=ep("span","flatpickr-prev-month"),n.prevMonthNav.innerHTML=n.config.prevArrow,n.nextMonthNav=ep("span","flatpickr-next-month"),n.nextMonthNav.innerHTML=n.config.nextArrow,S(),Object.defineProperty(n,"_hidePrevMonthArrow",{get:function(){return n.__hidePrevMonthArrow},set:function(e){n.__hidePrevMonthArrow!==e&&(Zm(n.prevMonthNav,"flatpickr-disabled",e),n.__hidePrevMonthArrow=e);}}),Object.defineProperty(n,"_hideNextMonthArrow",{get:function(){return n.__hideNextMonthArrow},set:function(e){n.__hideNextMonthArrow!==e&&(Zm(n.nextMonthNav,"flatpickr-disabled",e),n.__hideNextMonthArrow=e);}}),n.currentYearElement=n.yearElements[0],Q(),n.monthNav)),n.innerContainer=ep("div","flatpickr-innerContainer"),n.config.weekNumbers){var t=function(){n.calendarContainer.classList.add("hasWeeks");var e=ep("div","flatpickr-weekwrapper");e.appendChild(ep("span","flatpickr-weekday",n.l10n.weekAbbreviation));var t=ep("div","flatpickr-weeks");return e.appendChild(t),{weekWrapper:e,weekNumbers:t}}(),o=t.weekWrapper,i=t.weekNumbers;n.innerContainer.appendChild(o),n.weekNumbers=i,n.weekWrapper=o;}n.rContainer=ep("div","flatpickr-rContainer"),n.rContainer.appendChild(N()),n.daysContainer||(n.daysContainer=ep("div","flatpickr-days"),n.daysContainer.tabIndex=-1),C(),n.rContainer.appendChild(n.daysContainer),n.innerContainer.appendChild(n.rContainer),e.appendChild(n.innerContainer);}n.config.enableTime&&e.appendChild(function(){n.calendarContainer.classList.add("hasTime"),n.config.noCalendar&&n.calendarContainer.classList.add("noCalendar");var e=hp(n.config);n.timeContainer=ep("div","flatpickr-time"),n.timeContainer.tabIndex=-1;var t=ep("span","flatpickr-time-separator",":"),o=op("flatpickr-hour",{"aria-label":n.l10n.hourAriaLabel});n.hourElement=o.getElementsByTagName("input")[0];var i=op("flatpickr-minute",{"aria-label":n.l10n.minuteAriaLabel});n.minuteElement=i.getElementsByTagName("input")[0],n.hourElement.tabIndex=n.minuteElement.tabIndex=-1,n.hourElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getHours():n.config.time_24hr?e.hours:function(e){switch(e%24){case 0:case 12:return 12;default:return e%12}}(e.hours)),n.minuteElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getMinutes():e.minutes),n.hourElement.setAttribute("step",n.config.hourIncrement.toString()),n.minuteElement.setAttribute("step",n.config.minuteIncrement.toString()),n.hourElement.setAttribute("min",n.config.time_24hr?"0":"1"),n.hourElement.setAttribute("max",n.config.time_24hr?"23":"12"),n.hourElement.setAttribute("maxlength","2"),n.minuteElement.setAttribute("min","0"),n.minuteElement.setAttribute("max","59"),n.minuteElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(o),n.timeContainer.appendChild(t),n.timeContainer.appendChild(i),n.config.time_24hr&&n.timeContainer.classList.add("time24hr");if(n.config.enableSeconds){n.timeContainer.classList.add("hasSeconds");var r=op("flatpickr-second");n.secondElement=r.getElementsByTagName("input")[0],n.secondElement.value=qm(n.latestSelectedDateObj?n.latestSelectedDateObj.getSeconds():e.seconds),n.secondElement.setAttribute("step",n.minuteElement.getAttribute("step")),n.secondElement.setAttribute("min","0"),n.secondElement.setAttribute("max","59"),n.secondElement.setAttribute("maxlength","2"),n.timeContainer.appendChild(ep("span","flatpickr-time-separator",":")),n.timeContainer.appendChild(r);}n.config.time_24hr||(n.amPM=ep("span","flatpickr-am-pm",n.l10n.amPM[Gm((n.latestSelectedDateObj?n.hourElement.value:n.config.defaultHour)>11)]),n.amPM.title=n.l10n.toggleTitle,n.amPM.tabIndex=-1,n.timeContainer.appendChild(n.amPM));return n.timeContainer}());Zm(n.calendarContainer,"rangeMode","range"===n.config.mode),Zm(n.calendarContainer,"animate",true===n.config.animate),Zm(n.calendarContainer,"multiMonth",n.config.showMonths>1),n.calendarContainer.appendChild(e);var r=void 0!==n.config.appendTo&&void 0!==n.config.appendTo.nodeType;if((n.config.inline||n.config.static)&&(n.calendarContainer.classList.add(n.config.inline?"inline":"static"),n.config.inline&&(!r&&n.element.parentNode?n.element.parentNode.insertBefore(n.calendarContainer,n._input.nextSibling):void 0!==n.config.appendTo&&n.config.appendTo.appendChild(n.calendarContainer)),n.config.static)){var a=ep("div","flatpickr-wrapper");n.element.parentNode&&n.element.parentNode.insertBefore(a,n.element),a.appendChild(n.element),n.altInput&&a.appendChild(n.altInput),a.appendChild(n.calendarContainer);}n.config.static||n.config.inline||(void 0!==n.config.appendTo?n.config.appendTo:window.document.body).appendChild(n.calendarContainer);}(),function(){n.config.wrap&&["open","close","toggle","clear"].forEach(function(e){Array.prototype.forEach.call(n.element.querySelectorAll("[data-"+e+"]"),function(t){return d(t,"click",n[e])});});if(n.isMobile)return void function(){var e=n.config.enableTime?n.config.noCalendar?"time":"datetime-local":"date";n.mobileInput=ep("input",n.input.className+" flatpickr-mobile"),n.mobileInput.tabIndex=1,n.mobileInput.type=e,n.mobileInput.disabled=n.input.disabled,n.mobileInput.required=n.input.required,n.mobileInput.placeholder=n.input.placeholder,n.mobileFormatStr="datetime-local"===e?"Y-m-d\\TH:i:S":"date"===e?"Y-m-d":"H:i:S",n.selectedDates.length>0&&(n.mobileInput.defaultValue=n.mobileInput.value=n.formatDate(n.selectedDates[0],n.mobileFormatStr));n.config.minDate&&(n.mobileInput.min=n.formatDate(n.config.minDate,"Y-m-d"));n.config.maxDate&&(n.mobileInput.max=n.formatDate(n.config.maxDate,"Y-m-d"));n.input.getAttribute("step")&&(n.mobileInput.step=String(n.input.getAttribute("step")));n.input.type="hidden",void 0!==n.altInput&&(n.altInput.type="hidden");try{n.input.parentNode&&n.input.parentNode.insertBefore(n.mobileInput,n.input.nextSibling);}catch(e){}d(n.mobileInput,"change",function(e){n.setDate(ip(e).value,false,n.mobileFormatStr),J("onChange"),J("onClose");});}();var e=Qm(B,50);n._debouncedChange=Qm(f,300),n.daysContainer&&!/iPhone|iPad|iPod/i.test(navigator.userAgent)&&d(n.daysContainer,"mouseover",function(e){"range"===n.config.mode&&F(ip(e));});d(n._input,"keydown",L),void 0!==n.calendarContainer&&d(n.calendarContainer,"keydown",L);n.config.inline||n.config.static||d(window,"resize",e);void 0!==window.ontouchstart?d(window.document,"touchstart",M):d(window.document,"mousedown",M);d(window.document,"focus",M,{capture:true}),true===n.config.clickOpens&&(d(n._input,"focus",n.open),d(n._input,"click",n.open));void 0!==n.daysContainer&&(d(n.monthNav,"click",ee),d(n.monthNav,["keyup","increment"],u),d(n.daysContainer,"click",V));if(void 0!==n.timeContainer&&void 0!==n.minuteElement&&void 0!==n.hourElement){var t=function(e){return ip(e).select()};d(n.timeContainer,["increment"],a),d(n.timeContainer,"blur",a,{capture:true}),d(n.timeContainer,"click",p),d([n.hourElement,n.minuteElement],["focus","click"],t),void 0!==n.secondElement&&d(n.secondElement,"focus",function(){return n.secondElement&&n.secondElement.select()}),void 0!==n.amPM&&d(n.amPM,"click",function(e){a(e);});}n.config.allowInput&&d(n._input,"blur",O);}(),(n.selectedDates.length||n.config.noCalendar)&&(n.config.enableTime&&l(n.config.noCalendar?n.latestSelectedDateObj:void 0),Z(false)),r();var o=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);!n.isMobile&&o&&$(),J("onReady");}(),n}function wp(e,t){for(var n=Array.prototype.slice.call(e).filter(function(e){return e instanceof HTMLElement}),o=[],i=0;i<n.length;i++){var r=n[i];try{if(null!==r.getAttribute("data-fp-omit"))continue;void 0!==r._flatpickr&&(r._flatpickr.destroy(),r._flatpickr=void 0),r._flatpickr=yp(r,t||{}),o.push(r._flatpickr);}catch(e){console.error(e);}}return 1===o.length?o[0]:o}"undefined"!=typeof HTMLElement&&"undefined"!=typeof HTMLCollection&&"undefined"!=typeof NodeList&&(HTMLCollection.prototype.flatpickr=NodeList.prototype.flatpickr=function(e){return wp(this,e)},HTMLElement.prototype.flatpickr=function(e){return wp([this],e)});var bp=function(e,t){return "string"==typeof e?wp(window.document.querySelectorAll(e),t):e instanceof Node?wp([e],t):wp(e,t)};bp.defaultConfig={},bp.l10ns={en:gp({},Jm),default:gp({},Jm)},bp.localize=function(e){bp.l10ns.default=gp(gp({},bp.l10ns.default),e);},bp.setDefaults=function(e){bp.defaultConfig=gp(gp({},bp.defaultConfig),e);},bp.parseDate=dp({}),bp.formatDate=up({}),bp.compareDates=fp,"undefined"!=typeof jQuery&&void 0!==jQuery.fn&&(jQuery.fn.flatpickr=function(e){return wp(this,e)}),Date.prototype.fp_incr=function(e){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+("string"==typeof e?parseInt(e,10):e))},"undefined"!=typeof window&&(window.flatpickr=bp);const Cp=["onCreate","onDestroy"],kp=["onChange","onOpen","onClose","onMonthChange","onYearChange","onReady","onValueUpdate","onDayCreate"],xp=t=>{const n=reactExports.useMemo(()=>({...t}),[t]),{defaultValue:o,options:i={},value:r,children:s,render:l,onCreate:c,onDestroy:p}=n,h=reactExports.useMemo(()=>((e,t)=>(kp.forEach(n=>{const o=t[n],i=e[n];if(o){i&&!Array.isArray(i)?e[n]=[e[n]]:e[n]||(e[n]=[]);const t=Array.isArray(o)?o:[o];0===e[n].length?e[n]=t:e[n].push(...t);}}),kp.forEach(e=>{delete t[e];}),Cp.forEach(e=>{delete t[e];}),e))(i,n),[i,n]),g=reactExports.useRef(null),v=reactExports.useRef(void 0);reactExports.useImperativeHandle(t.ref,()=>({get flatpickr(){return v.current}}),[]),reactExports.useEffect(()=>((()=>{var e;h.onClose=h.onClose||(()=>{var e;null!=(e=g.current)&&e.blur&&g.current.blur();}),v.current=((null==(e=bp)?void 0:e.default)||bp)(g.current,h),null==c||c(v.current);})(),()=>{null==p||p(v.current),v.current&&v.current.destroy(),v.current=void 0;}),[h,c,p]),reactExports.useEffect(()=>{var e;if(v.current){const t=Object.getOwnPropertyNames(h);for(let n=t.length-1;n>=0;n--){const o=t[n];let i=h[o];(null==i?void 0:i.toString())!==(null==(e=v.current.config[o])?void 0:e.toString())&&(kp.includes(o)&&!Array.isArray(i)&&(i=[i]),v.current.set(o,i));} void 0!==r&&r!==v.current.input.value&&v.current.setDate(r,false);}},[h,r]);const y=reactExports.useCallback(e=>{g.current=e;},[]);if(l)return l({...n,defaultValue:o,value:r},y);const w=reactExports.useCallback(e=>{var n,o;t&&t.onChange&&(Array.isArray(null==t?void 0:t.onChange)?null==(n=null==t?void 0:t.onChange)||n.forEach(()=>[new Date(e.target.value)],(null==r?void 0:r.toString())||""):"function"==typeof t.onChange&&(null==(o=null==t?void 0:t.onChange)||o.call(t,[new Date(e.target.value)],(null==r?void 0:r.toString())||"",v.current)));},[t,r]);return i.wrap?jsxRuntimeExports.jsx("div",{className:"flatpickr",ref:y,children:s}):jsxRuntimeExports.jsx("input",{onChange:w,...n,value:null==r?void 0:r.toString(),defaultValue:o,ref:y})},Sp="T42.GD.Execute",Np=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Dp=(e,t)=>e in t;function Ep({time:e,frequency:t,day:n}){const o=new Date(`01/01/2000 ${e}`),i=o.getMinutes(),r=o.getHours();let a="*";return "weekly"===t&&n&&(a=function(e){const t={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};if(!Dp(e,t))throw new Error(`Invalid day: ${e}`);return t[e]}(n).toString()),`${i} ${r} * * ${a}`}function Ip(e){const t=reactExports.useContext(IOConnectContext),{value:n,update:o}=au({prefKey:Mp(e)}),{value:i,update:r}=au({prefKey:Mp(e,"Time")}),{value:s,update:c}=au({prefKey:Mp(e,"Frequency")}),{value:u,update:d}=au({prefKey:Mp(e,"Day")}),m=reactExports.useCallback(async()=>{try{await t.interop.invoke(Sp,{command:`cancel-${e}`});}catch(e){console.error(e);}},[t,e]),p=reactExports.useCallback(async()=>{try{const n=Ep({time:i??"12:00 AM",frequency:s??"daily",day:"weekly"===s?u:"*"});await t.interop.invoke(Sp,{command:`schedule-${e}`,args:{cronTime:n,discardUnsavedLayoutChanges:!1}});}catch(t){console.error(`Failed to update cron job for ${e}:`,t);}},[t,e,i,s,u]);reactExports.useEffect(()=>{t&&n&&p();},[t,n,p]);return {enabled:n??false,time:i??"12:00 AM",frequency:s??"daily",day:u??"Monday",setEnabled:async e=>{e||await m();try{await o(e);}catch(e){console.error("Failed to update enabled state:",e);}},setTime:async e=>{try{await r(e);}catch(e){console.error("Failed to update time:",e);}},setFrequency:async e=>{try{await c(e),"daily"===e&&await d(void 0);}catch(e){console.error("Failed to update frequency:",e);}},setDay:async e=>{var t;if(t=e,Np.includes(t))try{await d(e);}catch(e){console.error("Failed to update day:",e);}else console.error("Invalid day provided");}}}function Mp(e,t){const n="restart"===e?"_system_scheduleRestart":"_system_scheduleShutdown";return t?`${n}${t}`:n}function Pp({className:n,variant:o,...i}){const r=x("io-block-list-gap",o,n),{enabled:a,time:s,frequency:l,day:c,setEnabled:u,setTime:d,setFrequency:f,setDay:m}=Ip(o);return jsxRuntimeExports.jsxs(P,{className:r,...i,children:[jsxRuntimeExports.jsx(Ys,{label:`Schedule ${o}`,align:"right",onChange:e=>u(e.target.checked),checked:a}),jsxRuntimeExports.jsxs("div",{className:"scheduler-controls",children:[jsxRuntimeExports.jsxs("div",{className:"io-control-input io-control-leading-icon direction-up",children:[jsxRuntimeExports.jsx(S,{variant:"clock"}),jsxRuntimeExports.jsx(xp,{className:"io-input",options:{enableTime:true,noCalendar:true,dateFormat:"h:i K",defaultDate:s,clickOpens:true},value:s,onClose:async([e])=>{const t=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});await d(t);}})]}),jsxRuntimeExports.jsxs(Ko,{text:l.charAt(0).toUpperCase()+l.slice(1),icon:"chevron-down",iconRight:true,children:[jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>f("daily"),children:"Daily"}),jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>f("weekly"),children:"Weekly"})]}),"weekly"===l&&jsxRuntimeExports.jsx(Ko,{text:c,icon:"chevron-down",iconRight:true,children:Np.map(t=>jsxRuntimeExports.jsx(Ko.Item,{onClick:()=>m(t),children:t},t))})]})]})}function Tp({className:t,...n}){return jsxRuntimeExports.jsx(Pp,{...n,className:t,variant:"restart"})}function Ap({className:t,...n}){return jsxRuntimeExports.jsx(Pp,{...n,className:t,variant:"shutdown"})}const Op={Body:Em,General:Im,Theme:Mm,PinnedPosition:Tm,AllowDocking:Om,MinimizeToTray:Lm,AutoClose:Fm,ShowTutorialOnStartup:Bm,Layouts:Rm,LayoutsRestoreLastSaved:_m,LayoutsSaveCurrentOnExit:Hm,LayoutsShowUnsavedChangesPrompt:$m,LayoutsShowDeletePrompt:jm,Downloads:zm,DownloadsAskForEachDownload:Vm,DownloadsLocation:Wm,System:Ym,SystemRestartSection:Tp,SystemShutdownSection:Ap},Lp=reactExports.createContext(Op),Fp=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Op,...n}),[n]);return jsxRuntimeExports.jsx(Lp.Provider,{value:o,children:t})});Fp.displayName="PreferencesPanelComponentsStoreProvider";const Bp=()=>reactExports.useContext(Lp);const jp=n=>{const{General:o,Layouts:i}=Kp();return jsxRuntimeExports.jsxs(Ls,{element:Qo,elementProps:n,children:[jsxRuntimeExports.jsx(o,{}),jsxRuntimeExports.jsx(i,{})]})},zp=({title:t="General",...n})=>{const{Theme:o}=Kp();return jsxRuntimeExports.jsx(P,{title:t,"data-testid":"preferences-panel-general-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Vp=({title:t="Layouts",...n})=>{const{LayoutsShowDeletePrompt:o}=Kp();return jsxRuntimeExports.jsx(P,{title:t,"data-testid":"preferences-panel-layouts-block",...n,children:jsxRuntimeExports.jsx(o,{})})},Wp={Body:jp,General:zp,Theme:Mm,Layouts:Vp,LayoutsShowUnsavedChangesPrompt:$m,LayoutsShowDeletePrompt:jm},Yp=reactExports.createContext(Wp),Up=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...Wp,...n}),[n]);return jsxRuntimeExports.jsx(Yp.Provider,{value:o,children:t})});Up.displayName="PreferencesPanelComponentsStoreProvider";const Kp=()=>reactExports.useContext(Yp);const Gp=({actionButtons:t,actionButtonElementsRefs:n,isAutofocusButton:o,isButtonDisabled:i,onButtonClick:r})=>jsxRuntimeExports.jsx(Z,{"data-testid":"io-dialog-action-buttons-group",align:"right",children:t.map((t,a)=>{const{id:s,text:l,variant:c}=t,u=o(s);return jsxRuntimeExports.jsx(A,{"data-testid":`io-dialog-action-button-${s}`,id:s,ref:e=>{0===a&&(n.current=[]),n.current[a]=e;},className:u?"io-focus-button":void 0,disabled:i(s),onClick:()=>r(t),variant:c,children:l},s)})}),Qp=({actionButtons:n,children:o,onCompletion:i,size:r,title:a=(Xs()?"io.Connect Desktop":"io.Connect Browser"),validationErrors:s=[]})=>{const{actionButtonElementsRefs:l,autofocusButtonId:f,hasAutofocusButtonLostInitialFocus:m}=(e=>{const t=reactExports.useRef([]),n=reactExports.useMemo(()=>e.find(e=>e.autofocus)?.id??null,[e]),o=reactExports.useRef(n),[i,r]=reactExports.useState(!o.current);return reactExports.useLayoutEffect(()=>{if(i)return;if(n!==o.current)return void r(true);const e=t.current.find(e=>e?.id===n);if(!e)return;e.focus();const a=()=>{r(true);};return e.addEventListener("blur",a),()=>{e.removeEventListener("blur",a);}},[n,i]),{actionButtonElementsRefs:t,autofocusButtonId:n,hasAutofocusButtonLostInitialFocus:i}})(n),h=()=>{i({isClosed:true});},g={...r};return jsxRuntimeExports.jsxs(re,{className:"io-dialog-template",closeFn:h,isOpen:true,onCancel:e=>{e.preventDefault(),h();},onKeyDown:e=>{!T(e)||s.length||e.target instanceof HTMLButtonElement||" "===e.key&&e.target instanceof HTMLInputElement||i({isEnterPressed:true});},style:g,title:a,children:[jsxRuntimeExports.jsx(re.Body,{children:o}),jsxRuntimeExports.jsx(re.Footer,{children:jsxRuntimeExports.jsx(Gp,{actionButtonElementsRefs:l,actionButtons:n,isAutofocusButton:e=>f===e&&!m,isButtonDisabled:e=>s.some(t=>t.disabledButtonIds.some(t=>t===e)),onButtonClick:({id:e,text:t})=>{i({responseButtonClicked:{id:e,text:t}});}})})]})},Xp=({children:t})=>jsxRuntimeExports.jsx("h3",{"data-testid":"io-dialog-heading",className:"io-dialog-template-heading",children:t});var Zp=Object.freeze({__proto__:null,NoInputsConfirmationDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,heading:a,text:s,title:l}=i;return jsxRuntimeExports.jsx(Qp,{actionButtons:r,onCompletion:n,size:o,title:l,children:jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Xp,{children:a}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:s})]})})},SingleCheckboxDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,checkbox:s,heading:l,text:u,title:d}=i,[f,m]=reactExports.useState(s.initialValue),p=reactExports.useCallback(()=>m(e=>!e),[]),h=[{id:s.id,type:"checkbox",checked:f}];return jsxRuntimeExports.jsxs(Qp,{actionButtons:r,onCompletion:e=>n({...e,inputs:h}),size:o,title:d,children:[jsxRuntimeExports.jsxs("div",{children:[jsxRuntimeExports.jsx(Xp,{children:l}),jsxRuntimeExports.jsx("p",{"data-testid":"io-dialog-text",children:u})]}),jsxRuntimeExports.jsx(_s,{"data-testid":`io-dialog-checkbox-${s.id}`,checked:f,id:s.id,label:s.label,name:s.id,onChange:p})]})},SingleTextInputDialog:({onCompletion:n,size:o,variables:i})=>{const{actionButtons:r,heading:a,input:s,title:l}=i,[u,f]=reactExports.useState(s.initialValue??""),m=reactExports.useRef(null),h=(g=u,!(v=s.validation)||new RegExp(v.regexPattern).test(g)?null:{disabledButtonIds:v.disabledButtonIds,message:v.errorMessage});var g,v;const y=[{id:s.id,type:"text",value:u}];return reactExports.useLayoutEffect(()=>{m.current?.select();},[]),jsxRuntimeExports.jsxs(Qp,{actionButtons:r,onCompletion:e=>n({...e,inputs:y}),size:o,title:l,validationErrors:h?[h]:[],children:[jsxRuntimeExports.jsx(Xp,{children:a}),jsxRuntimeExports.jsx(Bs,{"data-testid":`io-dialog-input-${s.id}`,ref:m,errorDataTestId:`io-dialog-input-${s.id}-error-message`,errorMessage:h?.message,id:s.id,label:s.label,name:s.id,onChange:e=>f(e.target.value),placeholder:s.placeholder,type:"text",value:u})]})}});const eh=({name:n,value:o})=>jsxRuntimeExports.jsxs("div",{className:"io-profile-section-item",children:[jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-name",children:n}),jsxRuntimeExports.jsx("div",{className:"io-profile-section-item-value",children:o})]}),th=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("div",{className:x("io-profile-section-body",n),children:[i&&jsxRuntimeExports.jsx(M,{className:"io-profile-section-title",text:i}),o.map(({name:t,value:n})=>jsxRuntimeExports.jsx(eh,{name:t,value:n},t))]}),nh=({className:n,items:o,title:i})=>jsxRuntimeExports.jsxs("section",{className:x("io-profile-section",n),children:[jsxRuntimeExports.jsx(th,{items:o,title:i}),jsxRuntimeExports.jsx(q,{className:"mt-8"})]}),oh=({title:t="License",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),ih=({title:t="Version",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),rh=({title:t="Plugins",...n})=>jsxRuntimeExports.jsx(nh,{title:t,...n}),ah=({className:n})=>{const o=Xs()?"io.Connect Desktop":"io.Connect Browser";return jsxRuntimeExports.jsxs("div",{className:x("io-trademark-container",n),children:[jsxRuntimeExports.jsx("h4",{className:"io-trademark-title",children:o}),jsxRuntimeExports.jsxs("p",{className:"io-trademark-text",children:[o,"® is a registered trademark of"," ",jsxRuntimeExports.jsx("a",{href:"https://www.interop.io",rel:"noreferrer",target:"_blank",children:"Interop Inc©"})," ",(new Date).getFullYear(),". All rights reserved."]})]})},sh=({avatarInitials:n=(Xs()?"CD":"CB"),className:o,items:i,onLogout:r,title:a})=>jsxRuntimeExports.jsxs("section",{className:x("io-profile-section",o),children:[jsxRuntimeExports.jsxs("div",{className:"io-user-details-container",children:[jsxRuntimeExports.jsx("div",{className:"io-user-avatar",children:n}),jsxRuntimeExports.jsx(th,{className:"mt-12",items:i,title:a})]}),r&&jsxRuntimeExports.jsx(A,{className:"io-log-out-button",onClick:r,variant:"primary",icon:"arrow-right-from-bracket",children:"Log out"}),jsxRuntimeExports.jsx(q,{className:"mt-8"})]}),lh={LicenseSection:oh,ProductsInfoSection:ih,PluginsSection:rh,Trademark:ah,UserSection:sh},ch=reactExports.createContext(lh),uh=reactExports.memo(({children:t,components:n})=>{const o=reactExports.useMemo(()=>({...lh,...n}),[n]);return jsxRuntimeExports.jsx(ch.Provider,{value:o,children:t})});uh.displayName="ProfilePanelComponentsStoreProvider";reactExports.createContext(void 0);document.querySelector("#root")??document.body;

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

var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

const Actions = ({ actions, onActionClick }) => {
    return (React.createElement(Z, { "data-testid": "io-alert-action-buttons-group" }, actions.map((action) => (React.createElement(A, { "data-testid": `io-alert-action-button-${action.id}`, key: action.id, onClick: (event) => onActionClick(event, action) }, action.title)))));
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
    return (React.createElement(E, { append: actions, close: data.config.showCloseButton ?? true, closeButtonOnClick: handleCloseButtonClick, onClick: handleClick, size: "large", text: data.config.text, variant: data.config.variant, ...data.config.data }));
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
if (typeof window !== "undefined") {
    window.IOBrowserModalsUI = IOBrowserModalsUIFactory;
}
eventController.notifyStarted();

export { IOBrowserModalsUIFactory as default };
//# sourceMappingURL=io-browser-modals-ui.es.js.map
