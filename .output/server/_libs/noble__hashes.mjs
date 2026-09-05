//#region node_modules/@noble/hashes/utils.js
/**
* Checks if something is Uint8Array. Be careful: nodejs Buffer will return true.
* @param a - value to test
* @returns `true` when the value is a Uint8Array-compatible view.
* @example
* Check whether a value is a Uint8Array-compatible view.
* ```ts
* isBytes(new Uint8Array([1, 2, 3]));
* ```
*/
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
/**
* Asserts something is a non-negative integer.
* @param n - number to validate
* @param title - label included in thrown errors
* @returns The validated number.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a non-negative integer option.
* ```ts
* anumber(32, 'length');
* ```
*/
function anumber(n, title = "") {
	if (typeof n !== "number") throw new TypeError(atitle(title) + "expected number, got " + typeof n);
	if (!Number.isSafeInteger(n) || n < 0) throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
	return n;
}
/**
* Asserts something is Uint8Array.
* @param value - value to validate
* @param length - optional exact length constraint
* @param title - label included in thrown errors
* @returns The validated byte array.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate that a value is a byte array.
* ```ts
* abytes(new Uint8Array([1, 2, 3]));
* ```
*/
function abytes(value, length, title = "") {
	if (isBytes(value) && (length === void 0 || value.length === length)) return value;
	if (length !== void 0) anumber(length, "length");
	const bytes = isBytes(value);
	const ofLen = length !== void 0 ? ` of length ${length}` : "";
	const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
	const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
	if (!bytes) throw new TypeError(message);
	throw new RangeError(message);
}
/**
* Copies bytes into a fresh Uint8Array.
* Buffer-style slices can alias the same backing store, so callers that need ownership should copy.
* @param bytes - source bytes to clone
* @returns Freshly allocated copy of `bytes`.
* @throws On wrong argument types. {@link TypeError}
* @example
* Clone a byte array before mutating it.
* ```ts
* const copy = copyBytes(new Uint8Array([1, 2, 3]));
* ```
*/
function copyBytes(bytes) {
	return Uint8Array.from(abytes(bytes));
}
/**
* Asserts something is a wrapped hash constructor.
* @param h - hash constructor to validate
* @throws On wrong argument types or invalid hash wrapper shape. {@link TypeError}
* @throws On invalid hash metadata ranges or values. {@link RangeError}
* @throws If the hash metadata allows empty outputs or block sizes. {@link Error}
* @example
* Validate a callable hash wrapper.
* ```ts
* import { ahash } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* ahash(sha256);
* ```
*/
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new TypeError("expected hash wrapped by utils.createHasher");
	anumber(h.outputLen);
	anumber(h.blockLen);
	if (h.outputLen < 1 || h.blockLen < 1) throw new Error("hash blockLen / outputLen must be >= 1");
}
var aobject = (value, label) => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
var aopts = (value, label) => {
	aobject(value, label);
	const proto = Object.getPrototypeOf(value);
	if (proto !== Object.prototype && proto !== null) throw new TypeError(`"${label}" expected plain object`);
	if (Object.hasOwn(value, "__proto__")) throw new TypeError(`"${label}.__proto__" is not allowed`);
};
/**
* Asserts a hash instance has not been destroyed or finished.
* @param instance - hash instance to validate
* @param checkFinished - whether to reject finalized instances
* @throws If the hash instance has already been destroyed or finalized. {@link Error}
* @example
* Validate that a hash instance is still usable.
* ```ts
* import { aexists } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aexists(hash);
* ```
*/
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("hash was destroyed");
	if (checkFinished && instance.finished) throw new Error("digest() was already called");
}
/**
* Asserts output is a sufficiently-sized byte array.
* @param out - destination buffer
* @param instance - hash instance providing output length
* Oversized buffers are allowed; downstream code only promises to fill the first `outputLen` bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a caller-provided digest buffer.
* ```ts
* import { aoutput } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aoutput(new Uint8Array(hash.outputLen), hash);
* ```
*/
function aoutput(out, instance) {
	abytes(out, void 0, "output");
	const min = instance.outputLen;
	if (!(out.length >= min)) throw new RangeError("\"output\" expected length >= " + min);
}
/**
* Casts a typed array view to Uint8Array.
* @param arr - source typed array
* @returns Uint8Array view over the same buffer.
* @example
* Reinterpret a typed array as bytes.
* ```ts
* u8(new Uint32Array([1, 2]));
* ```
*/
function u8(arr) {
	return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Casts a typed array view to Uint32Array.
* `arr.byteOffset` must already be 4-byte aligned or the platform
* Uint32Array constructor will throw.
* @param arr - source typed array
* @returns Uint32Array view over the same buffer.
* @example
* Reinterpret a byte array as 32-bit words.
* ```ts
* u32(new Uint8Array(8));
* ```
*/
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/**
* Zeroizes typed arrays in place. Warning: JS provides no guarantees.
* @param arrays - arrays to overwrite with zeros
* @example
* Zeroize sensitive buffers in place.
* ```ts
* clean(new Uint8Array([1, 2, 3]));
* ```
*/
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/**
* Creates a DataView for byte-level manipulation.
* @param arr - source typed array
* @returns DataView over the same buffer region.
* @example
* Create a DataView over an existing buffer.
* ```ts
* createView(new Uint8Array(4));
* ```
*/
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Rotate-right operation for uint32 values.
* @param word - source word
* @param shift - shift amount in bits
* @returns Rotated word.
* @example
* Rotate a 32-bit word to the right.
* ```ts
* rotr(0x12345678, 8);
* ```
*/
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
/** Whether the current platform is little-endian. */
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
/**
* Byte-swap operation for uint32 values.
* @param word - source word
* @returns Word with reversed byte order.
* @example
* Reverse the byte order of a 32-bit word.
* ```ts
* byteSwap(0x11223344);
* ```
*/
function byteSwap(word) {
	return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
/**
* Conditionally byte-swaps one 32-bit word on big-endian platforms.
* @param n - source word
* @returns Original or byte-swapped word depending on platform endianness.
* @example
* Normalize a 32-bit word for host endianness.
* ```ts
* swap8IfBE(0x11223344);
* ```
*/
var swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n) >>> 0;
/**
* Byte-swaps every word of a Uint32Array in place.
* @param arr - array to mutate
* @returns The same array after mutation; callers pass live state arrays here.
* @example
* Reverse the byte order of every word in place.
* ```ts
* byteSwap32(new Uint32Array([0x11223344]));
* ```
*/
function byteSwap32(arr) {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
}
/**
* Conditionally byte-swaps a Uint32Array on big-endian platforms.
* @param u - array to normalize for host endianness
* @returns Original or byte-swapped array depending on platform endianness.
*   On big-endian runtimes this mutates `u` in place via `byteSwap32(...)`.
* @example
* Normalize a word array for host endianness.
* ```ts
* swap32IfBE(new Uint32Array([0x11223344]));
* ```
*/
var swap32IfBE = isLE ? (u) => u : byteSwap32;
/**
* Converts string to bytes using UTF8 encoding.
* Built-in doesn't validate input to be string: we do the check.
* Non-ASCII details are delegated to the platform `TextEncoder`.
* @param str - string to encode
* @returns UTF-8 encoded bytes.
* @throws On wrong argument types. {@link TypeError}
* @example
* Encode a string as UTF-8 bytes.
* ```ts
* utf8ToBytes('abc'); // Uint8Array.from([97, 98, 99])
* ```
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new TypeError("string expected");
	const encoded = new TextEncoder().encode(str);
	try {
		return new Uint8Array(encoded);
	} finally {
		clean(encoded);
	}
}
/**
* Helper for KDFs: consumes Uint8Array or string.
* String inputs are UTF-8 encoded; byte-array inputs stay aliased to the caller buffer.
* @param data - user-provided KDF input
* @param errorTitle - label included in thrown errors
* @returns Byte representation of the input.
* @throws On wrong argument types. {@link TypeError}
* @example
* Normalize KDF input to bytes.
* ```ts
* kdfInputToBytes('password');
* ```
*/
function kdfInputToBytes(data, errorTitle = "") {
	if (typeof data === "string") return utf8ToBytes(data);
	return abytes(data, void 0, errorTitle);
}
/**
* Merges default options and passed options.
* @param defaults - base option object
* @param opts - user overrides
* @param title - label included in thrown override errors
* @returns Fresh merged option object with a null prototype.
* @throws On wrong argument types. {@link TypeError}
* @example
* Merge user overrides onto default options.
* ```ts
* checkOpts({ dkLen: 32 }, { asyncTick: 10 });
* ```
*/
function checkOpts(defaults, opts, title = "opts") {
	aopts(defaults, "defaults");
	if (opts !== void 0) aopts(opts, title);
	return Object.assign(Object.create(null), defaults, opts);
}
/**
* Creates a callable hash function from a stateful class constructor.
* @param hashCons - hash constructor or factory
* @param info - optional metadata such as DER OID
* @returns Frozen callable hash wrapper with `.create()`.
*   Wrapper construction eagerly calls `hashCons(undefined)` once to read
*   `outputLen` / `blockLen`, so constructor side effects happen at module
*   init time.
* @throws On wrong argument types. {@link TypeError}
* @example
* Wrap a stateful hash constructor into a callable helper.
* ```ts
* import { createHasher } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const wrapped = createHasher(sha256.create, { oid: sha256.oid });
* wrapped(new Uint8Array([1]));
* ```
*/
function createHasher(hashCons, info = {}) {
	if (typeof hashCons !== "function") throw new TypeError("\"hashCons\" expected function, got type=" + typeof hashCons);
	info = checkOpts({}, info, "info");
	const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
	const tmp = hashCons(void 0);
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.canXOF = tmp.canXOF;
	hashC.create = (opts) => hashCons(opts);
	Object.assign(hashC, info);
	return Object.freeze(hashC);
}
/**
* Creates OID metadata for NIST hashes with prefix `06 09 60 86 48 01 65 03 04 02`.
* @param suffix - final OID byte for the selected hash.
*   The helper accepts any byte even though only the documented NIST hash
*   suffixes are meaningful downstream.
* @returns Object containing the DER-encoded OID.
* @example
* Build OID metadata for a NIST hash.
* ```ts
* oidNist(0x01);
* ```
*/
var oidNist = (suffix) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	suffix
]) });
//#endregion
//#region node_modules/@noble/hashes/_blake.js
/**
* Internal blake permutation table.
* Rows `0..9` serve BLAKE2s, rows `0..11` serve BLAKE2b with `10..11 = 0..1`, and Blake1 also
* reuses the later rows shown below. Blake1 expands rounds `10..15` as `SIGMA[i % 10]`, so rows
* `10..15` intentionally repeat rows `0..5` for the 14-round (256) and 16-round (512) variants.
*/
var BSIGMA = /* @__PURE__ */ Uint8Array.from([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9,
	12,
	5,
	1,
	15,
	14,
	13,
	4,
	10,
	0,
	7,
	6,
	3,
	9,
	2,
	8,
	11,
	13,
	11,
	7,
	14,
	12,
	1,
	3,
	9,
	5,
	0,
	15,
	4,
	8,
	6,
	2,
	10,
	6,
	15,
	14,
	9,
	11,
	3,
	0,
	8,
	12,
	2,
	13,
	7,
	1,
	4,
	10,
	5,
	10,
	2,
	8,
	4,
	7,
	6,
	1,
	5,
	15,
	11,
	9,
	14,
	3,
	12,
	13,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9
]);
//#endregion
//#region node_modules/@noble/hashes/_u64.js
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE) {
	const h = fromNumH(n);
	const l = fromNumL(n);
	view.setUint32(byteOffset, isLE ? l : h, isLE);
	view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
//#endregion
//#region node_modules/@noble/hashes/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/**
* Shared 32-bit conditional boolean primitive reused by SHA-256, SHA-1, and MD5 `F`.
* Returns bits from `b` when `a` is set, otherwise from `c`.
* The XOR form is equivalent to MD5's `F(X,Y,Z) = XY v not(X)Z` because the masked terms never
* set the same bit.
* @param a - selector word
* @param b - word chosen when selector bit is set
* @param c - word chosen when selector bit is clear
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit choice primitive.
* ```ts
* Chi(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/**
* Shared 32-bit majority primitive reused by SHA-256 and SHA-1.
* Returns bits shared by at least two inputs.
* @param a - first input word
* @param b - second input word
* @param c - third input word
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit majority primitive.
* ```ts
* Maj(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
* Accepts only byte-aligned `Uint8Array` input, even when the underlying spec describes bit
* strings with partial-byte tails.
* @param blockLen - internal block size in bytes
* @param outputLen - digest size in bytes
* @param padOffset - trailing length field size in bytes
* @param isLE - whether length and state words are encoded in little-endian
* @example
* Use a concrete subclass to get the shared Merkle-Damgard update/digest flow.
* ```ts
* import { _SHA1 } from '@noble/hashes/legacy.js';
* const hash = new _SHA1();
* hash.update(new Uint8Array([97, 98, 99]));
* hash.digest();
* ```
*/
var HashMD = class {
	blockLen;
	outputLen;
	canXOF = false;
	padOffset;
	isLE;
	buffer;
	view;
	finished = false;
	length = 0;
	pos = 0;
	destroyed = false;
	constructor(blockLen, outputLen, padOffset, isLE) {
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		let processed = false;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				processed = true;
				continue;
			}
			buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
				processed = true;
			}
		}
		this.length += data.length;
		if (processed) this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		buffer.fill(0, pos);
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			buffer.fill(0);
		}
		setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
		this.process(view, 0);
		this.roundClean();
		const oview = out === buffer ? view : createView(out);
		const len = this.outputLen;
		const outLen = len / 4;
		const state = this.get();
		if (len % 4 || outLen > state.length) throw new Error("invalid outputLen");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneIntoMeta(to) {
		const { buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (pos) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state from RFC 6234 §6.1: the first 32 bits of the fractional parts of the
* square roots of the first eight prime numbers. Exported as a shared table; callers must treat
* it as read-only because constructors copy words from it by index. */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
//#endregion
//#region node_modules/@noble/hashes/blake2.js
/**
* blake2b (64-bit) & blake2s (8 to 32-bit) hash functions.
* b could have been faster, but there is no fast u64 in js, so s is 1.5x faster.
* @module
*/
var B2B_IV = /* @__PURE__ */ Uint32Array.from([
	4089235720,
	1779033703,
	2227873595,
	3144134277,
	4271175723,
	1013904242,
	1595750129,
	2773480762,
	2917565137,
	1359893119,
	725511199,
	2600822924,
	4215389547,
	528734635,
	327033209,
	1541459225
]);
var BBUF = /* @__PURE__ */ new Uint32Array(32);
function G1b(a, b, c, d, msg, x) {
	const Xl = msg[x], Xh = msg[x + 1];
	let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
	let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
	let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
	let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
	const ll = add3L(Al, Bl, Xl);
	Ah = add3H(ll, Ah, Bh, Xh);
	Al = ll | 0;
	let xh = Dh ^ Ah, xl = Dl ^ Al;
	Dh = rotr32H(xh, xl);
	Dl = rotr32L(xh, xl);
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = rotrSH(xh, xl, 24);
	Bl = rotrSL(xh, xl, 24);
	BBUF[2 * a] = Al;
	BBUF[2 * a + 1] = Ah;
	BBUF[2 * b] = Bl;
	BBUF[2 * b + 1] = Bh;
	BBUF[2 * c] = Cl;
	BBUF[2 * c + 1] = Ch;
	BBUF[2 * d] = Dl;
	BBUF[2 * d + 1] = Dh;
}
function G2b(a, b, c, d, msg, x) {
	const Xl = msg[x], Xh = msg[x + 1];
	let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
	let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
	let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
	let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
	const ll = add3L(Al, Bl, Xl);
	Ah = add3H(ll, Ah, Bh, Xh);
	Al = ll | 0;
	let xh = Dh ^ Ah, xl = Dl ^ Al;
	Dh = rotrSH(xh, xl, 16);
	Dl = rotrSL(xh, xl, 16);
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = rotrBH(xh, xl, 63);
	Bl = rotrBL(xh, xl, 63);
	BBUF[2 * a] = Al;
	BBUF[2 * a + 1] = Ah;
	BBUF[2 * b] = Bl;
	BBUF[2 * b + 1] = Bh;
	BBUF[2 * c] = Cl;
	BBUF[2 * c + 1] = Ch;
	BBUF[2 * d] = Dl;
	BBUF[2 * d + 1] = Dh;
}
function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
	anumber(keyLen);
	if (outputLen <= 0 || outputLen > keyLen) throw new Error("\"dkLen\" must be 1.." + keyLen + ", got " + outputLen);
	const { key, salt, personalization } = opts;
	if (key !== void 0 && (key.length < 1 || key.length > keyLen)) throw new Error("\"key\" expected to be undefined or of length=1.." + keyLen);
	if (salt !== void 0) abytes(salt, saltLen, "salt");
	if (personalization !== void 0) abytes(personalization, persLen, "personalization");
}
/** Internal base class for BLAKE2. */
var _BLAKE2 = class {
	buffer;
	buffer32;
	finished = false;
	destroyed = false;
	length = 0;
	pos = 0;
	blockLen;
	outputLen;
	canXOF = false;
	constructor(blockLen, outputLen) {
		anumber(blockLen);
		anumber(outputLen);
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.buffer = new Uint8Array(blockLen);
		this.buffer32 = u32(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes(data);
		const { blockLen, buffer, buffer32 } = this;
		const len = data.length;
		const offset = data.byteOffset;
		const buf = data.buffer;
		for (let pos = 0; pos < len;) {
			if (this.pos === blockLen) {
				swap32IfBE(buffer32);
				this.compress(buffer32, 0, false);
				swap32IfBE(buffer32);
				this.pos = 0;
			}
			const take = Math.min(blockLen - this.pos, len - pos);
			const dataOffset = offset + pos;
			if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
				const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
				swap32IfBE(data32);
				for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
					this.length += blockLen;
					this.compress(data32, pos32, false);
				}
				swap32IfBE(data32);
				continue;
			}
			buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			this.length += take;
			pos += take;
		}
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		if (out.byteOffset & 3) throw new RangeError("\"output\" expected 4-byte aligned byteOffset, got " + out.byteOffset);
		const { pos, buffer32 } = this;
		this.finished = true;
		this.buffer.fill(0, pos);
		swap32IfBE(buffer32);
		this.compress(buffer32, 0, true);
		swap32IfBE(buffer32);
		const state = this.get();
		const out32 = out === this.buffer ? buffer32 : u32(out);
		const full = Math.floor(this.outputLen / 4);
		for (let i = 0; i < full; i++) out32[i] = swap8IfBE(state[i]);
		const tail = this.outputLen % 4;
		if (!tail) return;
		const off = full * 4;
		const word = state[full];
		for (let i = 0; i < tail; i++) out[off + i] = word >>> 8 * i;
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		const { buffer, length, finished, destroyed, outputLen, pos } = this;
		to ||= new this.constructor({ dkLen: outputLen });
		to.set(...this.get());
		to.buffer.set(buffer);
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		to.outputLen = outputLen;
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/** Internal blake2b hash class with state stored as LE u32 low/high halves. */
var _BLAKE2b = class extends _BLAKE2 {
	v0l = B2B_IV[0] | 0;
	v0h = B2B_IV[1] | 0;
	v1l = B2B_IV[2] | 0;
	v1h = B2B_IV[3] | 0;
	v2l = B2B_IV[4] | 0;
	v2h = B2B_IV[5] | 0;
	v3l = B2B_IV[6] | 0;
	v3h = B2B_IV[7] | 0;
	v4l = B2B_IV[8] | 0;
	v4h = B2B_IV[9] | 0;
	v5l = B2B_IV[10] | 0;
	v5h = B2B_IV[11] | 0;
	v6l = B2B_IV[12] | 0;
	v6h = B2B_IV[13] | 0;
	v7l = B2B_IV[14] | 0;
	v7h = B2B_IV[15] | 0;
	constructor(opts = {}) {
		opts = checkOpts({}, opts);
		const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
		super(128, olen);
		checkBlake2Opts(olen, opts, 64, 16, 16);
		let { key, personalization, salt } = opts;
		let keyLength = 0;
		if (key !== void 0) {
			abytes(key, void 0, "key");
			keyLength = key.length;
		}
		this.v0l ^= this.outputLen | keyLength << 8 | 16842752;
		if (salt !== void 0) {
			abytes(salt, void 0, "salt");
			const slt = u32(copyBytes(salt));
			this.v4l ^= swap8IfBE(slt[0]);
			this.v4h ^= swap8IfBE(slt[1]);
			this.v5l ^= swap8IfBE(slt[2]);
			this.v5h ^= swap8IfBE(slt[3]);
		}
		if (personalization !== void 0) {
			abytes(personalization, void 0, "personalization");
			const pers = u32(copyBytes(personalization));
			this.v6l ^= swap8IfBE(pers[0]);
			this.v6h ^= swap8IfBE(pers[1]);
			this.v7l ^= swap8IfBE(pers[2]);
			this.v7h ^= swap8IfBE(pers[3]);
		}
		if (key !== void 0) {
			const tmp = new Uint8Array(this.blockLen);
			tmp.set(key);
			this.update(tmp);
			clean(tmp);
		}
	}
	get() {
		let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
		return [
			v0l,
			v0h,
			v1l,
			v1h,
			v2l,
			v2h,
			v3l,
			v3h,
			v4l,
			v4h,
			v5l,
			v5h,
			v6l,
			v6h,
			v7l,
			v7h
		];
	}
	set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
		this.v0l = v0l | 0;
		this.v0h = v0h | 0;
		this.v1l = v1l | 0;
		this.v1h = v1h | 0;
		this.v2l = v2l | 0;
		this.v2h = v2h | 0;
		this.v3l = v3l | 0;
		this.v3h = v3h | 0;
		this.v4l = v4l | 0;
		this.v4h = v4h | 0;
		this.v5l = v5l | 0;
		this.v5h = v5h | 0;
		this.v6l = v6l | 0;
		this.v6h = v6h | 0;
		this.v7l = v7l | 0;
		this.v7h = v7h | 0;
	}
	compress(msg, offset, isLast) {
		const { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
		BBUF[0] = v0l;
		BBUF[1] = v0h;
		BBUF[2] = v1l;
		BBUF[3] = v1h;
		BBUF[4] = v2l;
		BBUF[5] = v2h;
		BBUF[6] = v3l;
		BBUF[7] = v3h;
		BBUF[8] = v4l;
		BBUF[9] = v4h;
		BBUF[10] = v5l;
		BBUF[11] = v5h;
		BBUF[12] = v6l;
		BBUF[13] = v6h;
		BBUF[14] = v7l;
		BBUF[15] = v7h;
		BBUF.set(B2B_IV, 16);
		const l = fromNumL(this.length);
		const h = fromNumH(this.length);
		BBUF[24] = B2B_IV[8] ^ l;
		BBUF[25] = B2B_IV[9] ^ h;
		if (isLast) {
			BBUF[28] = ~BBUF[28];
			BBUF[29] = ~BBUF[29];
		}
		let j = 0;
		const s = BSIGMA;
		for (let i = 0; i < 12; i++) {
			G1b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
			G2b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
			G1b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
			G2b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
			G1b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
			G2b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
			G1b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
			G2b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
			G1b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
			G2b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
			G1b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
			G2b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
			G1b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
			G2b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
			G1b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
			G2b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
		}
		this.v0l ^= BBUF[0] ^ BBUF[16];
		this.v0h ^= BBUF[1] ^ BBUF[17];
		this.v1l ^= BBUF[2] ^ BBUF[18];
		this.v1h ^= BBUF[3] ^ BBUF[19];
		this.v2l ^= BBUF[4] ^ BBUF[20];
		this.v2h ^= BBUF[5] ^ BBUF[21];
		this.v3l ^= BBUF[6] ^ BBUF[22];
		this.v3h ^= BBUF[7] ^ BBUF[23];
		this.v4l ^= BBUF[8] ^ BBUF[24];
		this.v4h ^= BBUF[9] ^ BBUF[25];
		this.v5l ^= BBUF[10] ^ BBUF[26];
		this.v5h ^= BBUF[11] ^ BBUF[27];
		this.v6l ^= BBUF[12] ^ BBUF[28];
		this.v6h ^= BBUF[13] ^ BBUF[29];
		this.v7l ^= BBUF[14] ^ BBUF[30];
		this.v7h ^= BBUF[15] ^ BBUF[31];
		clean(BBUF);
	}
	destroy() {
		this.destroyed = true;
		clean(this.buffer32);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/**
* Blake2b hash function. 64-bit. 1.5x slower than blake2s in JS.
* @param msg - message that would be hashed
* @param opts - Optional output, MAC, salt, and personalization settings.
*   `dkLen` must be 1..64 bytes; `salt` and `personalization`, if present,
*   must be 16 bytes each. See {@link Blake2Opts}.
* @returns Digest bytes.
* @example
* Hash a message with Blake2b.
* ```ts
* blake2b(new Uint8Array([97, 98, 99]));
* ```
* @example
* Hash a message with Blake2b while selecting output, MAC, salt, and personalization settings.
* ```ts
* blake2b(new Uint8Array([97, 98, 99]), {
*   dkLen: 32,
*   key: new Uint8Array(32),
*   salt: new Uint8Array(16),
*   personalization: new Uint8Array(16),
* });
* ```
*/
var blake2b = /* @__PURE__ */ createHasher((opts) => new _BLAKE2b(opts));
//#endregion
//#region node_modules/@noble/hashes/argon2.js
/**
* Argon2 KDF from RFC 9106. Can be used to create a key from password and salt.
* We suggest to use Scrypt. JS Argon is 2-10x slower than native code because of 64-bitness:
* * argon uses uint64, but JS doesn't have fast uint64array
* * uint64 multiplication is 1/3 of time
* * `P` function would be very nice with u64, because most of value will be in registers,
*   hovewer with u32 it will require 32 registers, which is too much.
* * JS arrays do slow bound checks, so reading from `A2_BUF` slows it down
* @module
*/
var AT = {
	Argon2d: 0,
	Argon2i: 1,
	Argon2id: 2
};
var ARGON2_SYNC_POINTS = 4;
var abytesOrZero = (buf, errorTitle = "") => {
	if (buf === void 0) return Uint8Array.of();
	return kdfInputToBytes(buf, errorTitle);
};
var A2_BUF = /* @__PURE__ */ new Uint32Array(256);
function G(a, b, c, d) {
	let Al = A2_BUF[2 * a], Ah = A2_BUF[2 * a + 1];
	let Bl = A2_BUF[2 * b], Bh = A2_BUF[2 * b + 1];
	let Cl = A2_BUF[2 * c], Ch = A2_BUF[2 * c + 1];
	let Dl = A2_BUF[2 * d], Dh = A2_BUF[2 * d + 1];
	let ml = 0, mh = 0, rl = 0, xh = 0, xl = 0;
	ml = Math.imul(Al, Bl);
	mh = ((Al >>> 0) * (Bl >>> 0) - (ml >>> 0)) / 4294967296 + .5 | 0;
	rl = (Al >>> 0) + (Bl >>> 0) + (ml << 1 >>> 0);
	Ah = Ah + Bh + (mh << 1 | ml >>> 31) + (rl / 4294967296 | 0) | 0;
	Al = rl | 0;
	xh = Dh ^ Ah;
	xl = Dl ^ Al;
	Dh = xl;
	Dl = xh;
	ml = Math.imul(Cl, Dl);
	mh = ((Cl >>> 0) * (Dl >>> 0) - (ml >>> 0)) / 4294967296 + .5 | 0;
	rl = (Cl >>> 0) + (Dl >>> 0) + (ml << 1 >>> 0);
	Ch = Ch + Dh + (mh << 1 | ml >>> 31) + (rl / 4294967296 | 0) | 0;
	Cl = rl | 0;
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = xh >>> 24 | xl << 8;
	Bl = xh << 8 | xl >>> 24;
	ml = Math.imul(Al, Bl);
	mh = ((Al >>> 0) * (Bl >>> 0) - (ml >>> 0)) / 4294967296 + .5 | 0;
	rl = (Al >>> 0) + (Bl >>> 0) + (ml << 1 >>> 0);
	Ah = Ah + Bh + (mh << 1 | ml >>> 31) + (rl / 4294967296 | 0) | 0;
	Al = rl | 0;
	xh = Dh ^ Ah;
	xl = Dl ^ Al;
	Dh = xh >>> 16 | xl << 16;
	Dl = xh << 16 | xl >>> 16;
	ml = Math.imul(Cl, Dl);
	mh = ((Cl >>> 0) * (Dl >>> 0) - (ml >>> 0)) / 4294967296 + .5 | 0;
	rl = (Cl >>> 0) + (Dl >>> 0) + (ml << 1 >>> 0);
	Ch = Ch + Dh + (mh << 1 | ml >>> 31) + (rl / 4294967296 | 0) | 0;
	Cl = rl | 0;
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = xh << 1 | xl >>> 31;
	Bl = xh >>> 31 | xl << 1;
	A2_BUF[2 * a] = Al, A2_BUF[2 * a + 1] = Ah;
	A2_BUF[2 * b] = Bl, A2_BUF[2 * b + 1] = Bh;
	A2_BUF[2 * c] = Cl, A2_BUF[2 * c + 1] = Ch;
	A2_BUF[2 * d] = Dl, A2_BUF[2 * d + 1] = Dh;
}
function P(v00, v01, v02, v03, v04, v05, v06, v07, v08, v09, v10, v11, v12, v13, v14, v15) {
	G(v00, v04, v08, v12);
	G(v01, v05, v09, v13);
	G(v02, v06, v10, v14);
	G(v03, v07, v11, v15);
	G(v00, v05, v10, v15);
	G(v01, v06, v11, v12);
	G(v02, v07, v08, v13);
	G(v03, v04, v09, v14);
}
function block(x, xPos, yPos, outPos, needXor) {
	if (needXor) for (let i = 0; i < 256; i++) {
		const r = x[xPos + i] ^ x[yPos + i];
		A2_BUF[i] = r;
		x[outPos + i] ^= r;
	}
	else for (let i = 0; i < 256; i++) {
		const r = x[xPos + i] ^ x[yPos + i];
		A2_BUF[i] = r;
		x[outPos + i] = r;
	}
	for (let i = 0; i < 128; i += 16) P(i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10, i + 11, i + 12, i + 13, i + 14, i + 15);
	for (let i = 0; i < 16; i += 2) P(i, i + 1, i + 16, i + 17, i + 32, i + 33, i + 48, i + 49, i + 64, i + 65, i + 80, i + 81, i + 96, i + 97, i + 112, i + 113);
	for (let i = 0; i < 256; i++) x[outPos + i] ^= A2_BUF[i];
	clean(A2_BUF);
}
function Hp(A, dkLen) {
	const A8 = u8(A);
	const T = /* @__PURE__ */ new Uint32Array(1);
	const T8 = u8(T);
	T[0] = swap8IfBE(dkLen);
	if (dkLen <= 64) return blake2b.create({ dkLen }).update(T8).update(A8).digest();
	const out = new Uint8Array(dkLen);
	let V = blake2b.create({}).update(T8).update(A8).digest();
	let pos = 0;
	out.set(V.subarray(0, 32));
	pos += 32;
	for (; dkLen - pos > 64; pos += 32) {
		const Vh = blake2b.create({}).update(V);
		Vh.digestInto(V);
		Vh.destroy();
		out.set(V.subarray(0, 32), pos);
	}
	out.set(blake2b(V, { dkLen: dkLen - pos }), pos);
	clean(V, T);
	return out;
}
function indexAlpha(r, s, laneLen, segmentLen, index, randL, sameLane = false) {
	let area;
	if (r === 0) {
		if (s === 0) area = index - 1;
		else if (sameLane) area = s * segmentLen + index - 1;
		else area = s * segmentLen + (index == 0 ? -1 : 0);
	} else if (sameLane) area = laneLen - segmentLen + index - 1;
	else area = laneLen - segmentLen + (index == 0 ? -1 : 0);
	const startPos = r !== 0 && s !== 3 ? (s + 1) * segmentLen : 0;
	const randLow = Math.imul(randL, randL);
	const randHigh = ((randL >>> 0) * (randL >>> 0) - (randLow >>> 0)) / 4294967296 + .5 | 0;
	const areaLow = Math.imul(area, randHigh);
	const areaHigh = ((area >>> 0) * (randHigh >>> 0) - (areaLow >>> 0)) / 4294967296 + .5 | 0;
	return (startPos + (area - 1 - areaHigh)) % laneLen;
}
var maxUint32 = Math.pow(2, 32);
var ARGON2_DEFAULT_MEMORY = 1024 ** 2;
var ARGON2_DEFAULT_MAXMEM = ARGON2_DEFAULT_MEMORY * 1024;
function isU32(num) {
	return Number.isSafeInteger(num) && num >= 0 && num < maxUint32;
}
function argon2Opts(opts = {}) {
	opts = checkOpts({}, opts);
	const merged = {
		t: 3,
		m: ARGON2_DEFAULT_MEMORY,
		p: 1,
		version: 19,
		dkLen: 32,
		maxmem: ARGON2_DEFAULT_MAXMEM,
		asyncTick: 10
	};
	for (let [k, v] of Object.entries(opts)) if (v !== void 0) merged[k] = v;
	const { dkLen, p, m, t, version, onProgress, asyncTick } = merged;
	if (!isU32(dkLen) || dkLen < 4) throw new Error("\"dkLen\" must be 4..");
	if (!isU32(p) || p < 1 || p >= Math.pow(2, 24)) throw new Error("\"p\" must be 1..2^24");
	if (!isU32(m)) throw new Error("\"m\" must be 0..2^32");
	if (!isU32(t) || t < 1) throw new Error("\"t\" (iterations) must be 1..2^32");
	if (onProgress !== void 0 && typeof onProgress !== "function") throw new Error("\"onProgress\" must be a function");
	anumber(asyncTick, "asyncTick");
	if (!isU32(m) || m < 8 * p) throw new Error("\"m\" (memory) must be at least 8*p bytes");
	if (version !== 16 && version !== 19) throw new Error("\"version\" must be 0x10 or 0x13, got " + version);
	return merged;
}
function argon2InitialHash(password, salt, type, opts) {
	const ownedInputs = [];
	const BUF = /* @__PURE__ */ new Uint32Array(1);
	const BUF8 = u8(BUF);
	let h;
	let H0;
	let succeeded = false;
	const rememberOwned = (input, bytes) => {
		if (typeof input === "string") ownedInputs.push(bytes);
		return bytes;
	};
	try {
		const passwordBytes = rememberOwned(password, kdfInputToBytes(password, "password"));
		const saltBytes = rememberOwned(salt, kdfInputToBytes(salt, "salt"));
		if (!isU32(passwordBytes.length)) throw new Error("\"password\" must be less of length 1..4Gb");
		if (!isU32(saltBytes.length) || saltBytes.length < 8) throw new Error("\"salt\" must be of length 8..4Gb");
		if (!Object.values(AT).includes(type)) throw new Error("\"type\" was invalid");
		let { p, dkLen, m, t, version, key, personalization, maxmem, onProgress, asyncTick } = argon2Opts(opts);
		const keyInput = key;
		key = rememberOwned(keyInput, abytesOrZero(keyInput, "key"));
		const personalizationInput = personalization;
		personalization = rememberOwned(personalizationInput, abytesOrZero(personalizationInput, "personalization"));
		h = blake2b.create();
		for (let item of [
			p,
			dkLen,
			m,
			t,
			version,
			type
		]) {
			BUF[0] = swap8IfBE(item);
			h.update(BUF8);
		}
		for (let i of [
			passwordBytes,
			saltBytes,
			key,
			personalization
		]) {
			BUF[0] = swap8IfBE(i.length);
			h.update(BUF8).update(i);
		}
		H0 = /* @__PURE__ */ new Uint32Array(18);
		h.digestInto(u8(H0));
		succeeded = true;
		return {
			H0,
			p,
			dkLen,
			m,
			t,
			version,
			maxmem,
			onProgress,
			asyncTick
		};
	} finally {
		if (h) h.destroy();
		clean(BUF, ...ownedInputs);
		if (!succeeded && H0) clean(H0);
	}
}
function argon2Init(password, salt, type, opts) {
	const { H0, p, dkLen, m, t, version, maxmem, onProgress, asyncTick } = argon2InitialHash(password, salt, type, opts);
	try {
		const lanes = p;
		const mP = 4 * p * Math.floor(m / (ARGON2_SYNC_POINTS * p));
		const laneLen = Math.floor(mP / p);
		const segmentLen = Math.floor(laneLen / ARGON2_SYNC_POINTS);
		const memUsed = mP * 1024;
		if (!isU32(maxmem)) throw new Error("\"maxmem\" expected <2**32, got " + maxmem);
		if (memUsed > maxmem) throw new Error("\"maxmem\" limit was hit: memUsed(mP*1024)=" + memUsed + ", maxmem=" + maxmem);
		const B = new Uint32Array(memUsed / 4);
		for (let l = 0; l < p; l++) {
			const i = 256 * laneLen * l;
			H0[17] = swap8IfBE(l);
			H0[16] = swap8IfBE(0);
			B.set(swap32IfBE(u32(Hp(H0, 1024))), i);
			H0[16] = swap8IfBE(1);
			B.set(swap32IfBE(u32(Hp(H0, 1024))), i + 256);
		}
		let perBlock = () => {};
		if (onProgress) {
			const totalBlock = t * ARGON2_SYNC_POINTS * p * segmentLen - 2 * p;
			const callbackPer = Math.max(Math.floor(totalBlock / 1e4), 1);
			let blockCnt = 0;
			perBlock = () => {
				blockCnt++;
				if (onProgress && (!(blockCnt % callbackPer) || blockCnt === totalBlock)) onProgress(blockCnt / totalBlock);
			};
		}
		return {
			type,
			mP,
			p,
			t,
			version,
			B,
			laneLen,
			lanes,
			segmentLen,
			dkLen,
			perBlock,
			asyncTick
		};
	} finally {
		clean(H0);
	}
}
function argon2Output(B, p, laneLen, dkLen) {
	const B_final = /* @__PURE__ */ new Uint32Array(256);
	for (let l = 0; l < p; l++) for (let j = 0; j < 256; j++) B_final[j] ^= B[256 * (laneLen * l + laneLen - 1) + j];
	const res = Hp(swap32IfBE(B_final), dkLen);
	clean(B, B_final);
	return res;
}
/**
* Fills every Argon2 block for all passes / slices / lanes, yielding once per
* processed block so callers control pacing: the sync driver just drains the
* generator, while the async driver awaits `nextTick()` between time slices.
*/
function* argon2Blocks(ctx, address) {
	const { type, mP, p, t, version, B, laneLen, lanes, segmentLen, perBlock } = ctx;
	address[262] = mP;
	address[264] = t;
	address[266] = type;
	for (let r = 0; r < t; r++) {
		const needXor = r !== 0 && version === 19;
		address[256] = r;
		for (let s = 0; s < ARGON2_SYNC_POINTS; s++) {
			address[260] = s;
			const dataIndependent = type == AT.Argon2i || type == AT.Argon2id && r === 0 && s < 2;
			for (let l = 0; l < p; l++) {
				address[258] = l;
				address[268] = 0;
				let startPos = 0;
				if (r === 0 && s === 0) {
					startPos = 2;
					if (dataIndependent) {
						address[268]++;
						block(address, 256, 512, 0, false);
						block(address, 0, 512, 0, false);
					}
				}
				let offset = l * laneLen + s * segmentLen + startPos;
				for (let index = startPos; index < segmentLen; index++, offset++) {
					perBlock();
					const prev = offset % laneLen ? offset - 1 : offset + laneLen - 1;
					let randL, randH;
					if (dataIndependent) {
						let i128 = index % 128;
						if (i128 === 0) {
							address[268]++;
							block(address, 256, 512, 0, false);
							block(address, 0, 512, 0, false);
						}
						randL = address[2 * i128];
						randH = address[2 * i128 + 1];
					} else {
						const T = 256 * prev;
						randL = B[T];
						randH = B[T + 1];
					}
					const refLane = r === 0 && s === 0 ? l : randH % lanes;
					const refPos = indexAlpha(r, s, laneLen, segmentLen, index, randL, refLane == l);
					const refBlock = laneLen * refLane + refPos;
					block(B, 256 * prev, 256 * refBlock, offset * 256, needXor);
					yield;
				}
			}
		}
	}
	clean(address);
}
function argon2(type, password, salt, opts) {
	const ctx = argon2Init(password, salt, type, opts);
	const blocks = argon2Blocks(ctx, /* @__PURE__ */ new Uint32Array(768));
	while (!blocks.next().done);
	return argon2Output(ctx.B, ctx.p, ctx.laneLen, ctx.dkLen);
}
/**
* Argon2id, combining i+d, the most popular version from RFC 9106.
* @param password - password or input key material
* @param salt - unique salt value
* @param opts - Argon2 cost and optional tuning parameters. See {@link ArgonOpts}.
* @returns Derived key bytes.
* @throws If the Argon2 input or cost parameters are invalid. {@link Error}
* @example
* Derive a key with Argon2id.
* ```ts
* argon2id('password', 'salt1234', { t: 1, m: 8, p: 1, dkLen: 32 });
* ```
*/
var argon2id = (password, salt, opts = {}) => argon2(AT.Argon2id, password, salt, opts);
//#endregion
//#region node_modules/@noble/hashes/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
/**
* Internal class for HMAC.
* Accepts any byte key, although RFC 2104 §3 recommends keys at least
* `HashLen` bytes long.
*/
var _HMAC = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	canXOF = false;
	finished = false;
	destroyed = false;
	constructor(hash, key) {
		ahash(hash);
		abytes(key, void 0, "key");
		this.iHash = hash.create();
		if (typeof this.iHash.update !== "function") throw new Error("expected Hash instance");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
		this.oHash.update(pad);
		clean(pad);
	}
	update(buf) {
		aexists(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const buf = out.subarray(0, this.outputLen);
		this.iHash.digestInto(buf);
		this.oHash.update(buf);
		this.oHash.digestInto(buf);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to ||= Object.create(Object.getPrototypeOf(this), {});
		const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
		to = to;
		to.finished = finished;
		to.destroyed = destroyed;
		to.blockLen = blockLen;
		to.outputLen = outputLen;
		to.canXOF = canXOF;
		to.oHash = oHash._cloneInto(to.oHash);
		to.iHash = iHash._cloneInto(to.iHash);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = true;
		this.oHash.destroy();
		this.iHash.destroy();
	}
};
var hmac = /* @__PURE__ */ (() => {
	const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
	hmac_.create = (hash, key) => new _HMAC(hash, key);
	return hmac_;
})();
//#endregion
//#region node_modules/@noble/hashes/hkdf.js
/**
* HKDF (RFC 5869): extract + expand in one step.
* See {@link https://soatok.blog/2021/11/17/understanding-hkdf/}.
* @module
*/
var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
/**
* HKDF-expand from the spec. The most important part. `HKDF-Expand(PRK, info, L) -> OKM`
* @param hash - hash function that would be used (e.g. sha256)
* @param prk - a pseudorandom key of at least HashLen octets
*   (usually, the output from the extract step)
* @param info - optional context and application specific information (can be a zero-length string)
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @param _recycled - Internal destroyed extract hashes owned by the combined `hkdf()` call.
* @returns Output keying material with the requested length.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* Run the HKDF expand step.
* ```ts
* import { expand } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* expand(sha256, new Uint8Array(32), new Uint8Array([1, 2, 3]), 16);
* ```
*/
function expand(hash, prk, info, length = 32, _recycled) {
	ahash(hash);
	anumber(length, "length");
	abytes(prk, void 0, "prk");
	const olen = hash.outputLen;
	if (prk.length < olen) throw new Error("\"prk\" must be at least HashLen octets");
	if (length > 255 * olen) throw new Error("Length must be <= 255*HashLen");
	const blocks = Math.ceil(length / olen);
	if (info === void 0) info = EMPTY_BUFFER;
	else abytes(info, void 0, "info");
	if (!blocks) {
		if (_recycled) clean(prk);
		return /* @__PURE__ */ new Uint8Array();
	}
	const okm = _recycled && blocks === 1 ? prk : new Uint8Array(blocks * olen);
	const { iHash, oHash } = hmac.create(hash, prk);
	const T = _recycled ? prk : new Uint8Array(olen);
	const worker = blocks > 1 ? _recycled?.iHash || hash.create() : void 0;
	for (let counter = 0; counter < blocks - 1; counter++) {
		HKDF_COUNTER[0] = counter + 1;
		const iWork = iHash._cloneInto(worker);
		if (counter) iWork.update(T);
		iWork.update(info).update(HKDF_COUNTER).digestInto(T);
		oHash._cloneInto(worker).update(T).digestInto(T);
		okm.set(T, olen * counter);
	}
	HKDF_COUNTER[0] = blocks;
	if (blocks > 1) iHash.update(T);
	iHash.update(info).update(HKDF_COUNTER).digestInto(T);
	oHash.update(T).digestInto(T);
	okm.set(T, olen * (blocks - 1));
	iHash.destroy();
	oHash.destroy();
	worker?.destroy();
	if (T !== okm) clean(T);
	clean(HKDF_COUNTER);
	if (length === okm.length) return okm;
	const res = okm.slice(0, length);
	clean(okm);
	return res;
}
/**
* HKDF (RFC 5869): derive keys from an initial input.
* Combines hkdf_extract + hkdf_expand in one step
* @param hash - hash function that would be used (e.g. sha256)
* @param ikm - input keying material, the initial key
* @param salt - optional salt value (a non-secret random value)
* @param info - optional context and application specific information bytes
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @returns Output keying material derived from the input key.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* HKDF (RFC 5869): derive keys from an initial input.
* ```ts
* import { hkdf } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* import { randomBytes, utf8ToBytes } from '@noble/hashes/utils.js';
* const inputKey = randomBytes(32);
* const salt = randomBytes(32);
* const info = utf8ToBytes('application-key');
* const okm = hkdf(sha256, inputKey, salt, info, 32);
* ```
*/
var hkdf = (hash, ikm, salt, info, length) => {
	ahash(hash);
	if (salt === void 0) salt = new Uint8Array(hash.outputLen);
	const HMAC = hmac.create(hash, salt).update(ikm);
	return expand(hash, HMAC.digest(), info, length, HMAC);
};
//#endregion
//#region node_modules/@noble/hashes/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out {@link https://www.rfc-editor.org/rfc/rfc4634 | RFC 4634} and
* {@link https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf | FIPS 180-4}.
* @module
*/
/**
* SHA-224 / SHA-256 round constants from RFC 6234 §5.1: the first 32 bits
* of the cube roots of the first 64 primes (2..311).
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable SHA-224 / SHA-256 message schedule buffer `W_t` from RFC 6234 §6.2 step 1. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal SHA-224 / SHA-256 compression engine from RFC 6234 §6.2. */
var SHA2_32B = class extends HashMD {
	A = 0;
	B = 0;
	C = 0;
	D = 0;
	E = 0;
	F = 0;
	G = 0;
	H = 0;
	constructor(outputLen, IV) {
		super(64, outputLen, 8, false);
		this.A = IV[0] | 0;
		this.B = IV[1] | 0;
		this.C = IV[2] | 0;
		this.D = IV[3] | 0;
		this.E = IV[4] | 0;
		this.F = IV[5] | 0;
		this.G = IV[6] | 0;
		this.H = IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	_cloneInto(to) {
		(to ||= new this.constructor()).set(...this.get());
		return this._cloneIntoMeta(to);
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.destroyed = true;
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
/** Internal SHA-256 hash class grounded in RFC 6234 §6.2. */
var _SHA256 = class extends SHA2_32B {
	constructor() {
		super(32, SHA256_IV);
	}
};
/**
* SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
*
* - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
* - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
* - Each sha256 hash is executing 2^18 bit operations.
* - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
* @param msg - message bytes to hash
* @param opts - Reserved hash options.
* @returns Digest bytes.
* @example
* Hash a message with SHA2-256.
* ```ts
* sha256(new Uint8Array([97, 98, 99]));
* ```
*/
var sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
//#endregion
export { hkdf as n, argon2id as r, sha256 as t };
