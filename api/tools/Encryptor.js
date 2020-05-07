


/*
    Manual SHA-256 implementation 

    References: 
    https://brilliant.org/wiki/secure-hashing-algorithms/
    "SHA-256 (FIPS 180-4) implementation in JavaScript", Chris Veness 2002-2019, MIT Licence 
        <https://www.movable-type.co.uk/scripts/sha256.html>
    https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf

*/
exports.EncryptString256 = (str, options) => {

    //Converting all input to UTF-8
    const defaults = { msgFormat: 'string', outFormat: 'hex' };
    const opt = Object.assign(defaults, options);
    str = convertToUTF(str, opt)

    //64 Assigned SHA-256 K constants ("the first 32-bits of the fractional parts of the cube roots of the first 64 primes")
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

    //8 Assigned SHA-256 H constants (Initial Hash Values)
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    //converting string into n blocks of 512->n*16*32
    var arrs = preprocessing(str)
    //console.log(arrs)

    //Computing Hash
    hashComputation(arrs, H, K)

   switch (opt.outFormat) {
        case 'hex':
            return (H.map((item) => {return item.toString(16)}).join(''))
        case 'binaryString':
            return (H.map((item) => {return ("00000000"+item.toString(2)).substr(-8)}).join(''))
    }
    //console.log(H[0].toString(16))

}

/*Defined SHA-256 Logic Functions*/

//Circular Right bit Shift value x by n. i.e. ROTR^n(x)
const ROTR = (n, x) => {
    return (x >>> n) | (x << (32 - n));
}

//Bit Shift right value x by n. i.e. SHR^n(x)
const SHR = (n, x) => {
    return (x >>> n)
}

//S<0,256>(x) = ROTR^2(x) xor ROTR^13(x) xor ROTR^22(x)
const SIGMA0 = (x) => {
    return (ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x))
}

//S<1,256>(x) = ROTR^6(x) xor ROTR^11(x) xor ROTR^25(x)
const SIGMA1 = (x) => {
    return (ROTR(6,  x) ^ ROTR(11, x) ^ ROTR(25, x))
}

//s<0,256>(x) = ROTR^7(x) xor ROTR^18(x) xor SHR^3(x)
const sigma0 = (x) => {
    return ROTR(7,  x) ^ ROTR(18, x) ^ SHR(3, x)
}

//s<1,256>(x) = ROTR^17(x) xor ROTR^19(x) xor SHR^10(x)
const sigma1 = (x) => {
    return ROTR(17, x) ^ ROTR(19, x) ^ SHR(10, x)
}

//Majority(x,y,z) => (x and y) xor (x and z) xor (y and z)
const Maj = (x, y, z) => {
    return (x & y) ^ (x & z) ^ (y & z)
}

//Change(x,y,z) => (x and y) xor ((not x) and z)
const Ch = (x, y, z) => {
    return (x & y) ^ (~x ^ z)
}

/*Procedural Functions*/

const preprocessing = (str) => {
    const strLen = str.length
    const arrsNeeded = Math.ceil(((strLen + 1) * 8 + 64) / 16)
    var ptr = 0
    var arrs = new Array(arrsNeeded)
    for (var i = 0; i < arrsNeeded; i++) {
        arrs[i] = new Array(16)
        for (var j = 0; j < 16; j++) {
            arrs[i][j] = parseInt([
                generateCode(str, strLen, ptr, j * 4), //8
                generateCode(str, strLen, ptr, (j * 4) + 1), //16
                generateCode(str, strLen, ptr, (j * 4) + 2), //24
                generateCode(str, strLen, ptr, (j * 4) + 3) //32
            ].join(''), 2)
        }
        ptr += 32
    }
    const lenHi = ((strLen) * 8) / Math.pow(2, 32);
    const lenLo = ((strLen) * 8) >>> 0;
    arrs[arrsNeeded - 1][14] = Math.floor(lenHi);
    arrs[arrsNeeded - 1][15] = lenLo;
    return arrs;
}

const hashComputation = (arrays, H, K) => {
    len = arrays.length
    for(let i = 0; i < len; i++) {

        //1. Preparing message schedule W{0,63}
        let W = new Array(64)
        for (let t=0;  t<64; t++) {
            if (t <= 15) {
                W[t] = arrays[i][t]
            } else {
                W[t] = sigma1(W[t-2])+W[t-7]+sigma0(W[t-15])+W[t-16]
            }
        };

        //2. Initialize the working hashes of the previous loop (or initial value)
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7]

        //3. Looping the hash values
        for (let t = 0; t < 63; t++) {
            let T1 = h + SIGMA1(e) + K[t] + Ch(e,f,g) + W[t]
            let T2 = SIGMA0(a) + Maj(a,b,c)
            h = g
            g = f
            f = e
            e = (d + T1) >>> 0;
            d = c
            c = b
            b = a
            a = (T1 + T2) >>> 0;
        }

        //4. Record the new hash values for the new loop
        H[0] = (H[0]+a) >>> 0;
        H[1] = (H[1]+b) >>> 0;
        H[2] = (H[2]+c) >>> 0;
        H[3] = (H[3]+d) >>> 0;
        H[4] = (H[4]+e) >>> 0;
        H[5] = (H[5]+f) >>> 0;
        H[6] = (H[6]+g) >>> 0;
        H[7] = (H[7]+h) >>> 0;

        //console.log(W)
    }
}

/*Helper functions (some are taken from references)*/

const generateCode = (str, strLen, ptr, offset) => {
    return ((ptr + offset < strLen) ? str[ptr].charCodeAt(0).toString(2) : ((ptr + offset + 1 < strLen) ? "10000000" : "00000000"))
}

const convertToUTF = (str, opt) => {
    switch (opt.msgFormat) {
        default:
        case 'string':
            str = UTF8Encode(str);
            break;
        case 'hex-bytes':
            str = hexBytesToString(str);
            break;
    }
    return str
}

const UTF8Encode = (str) => {
    try {
        return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
    } catch (e) {
        // no TextEncoder available?
        return unescape(encodeURIComponent(str)); // monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
    }
}

const hexBytesToString = (hexStr) => { // convert string of hex numbers to a string of chars (eg '616263' -> 'abc').
    const str = hexStr.replace(' ', ''); // allow space-separated groups
    return str == '' ? '' : str.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
}

