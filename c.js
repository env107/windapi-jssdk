var crypto = require("crypto")

const encrypt = (algo, data) => {
    var _hash = crypto.createHash(algo)
    _hash.update(data)
    return _hash.digest('hex')
}

const hmac = (algo,key,data) => {
  var _hmac = crypto.createHmac(algo,key)
  var _up = _hmac.update(data)
  return _up.digest("hex")
}

const sha1 = (str) => { return encrypt('sha1' , str) }

const base64_encode = (str) => {
  return new Buffer(str).toString('base64');
}

const base64_decode = (encode_str) => {
  return new Buffer(encode_str, 'base64').toString()
}

const hash_hmac = (algo , data , key) => { return hmac(algo , key , data) }

module.exports = {
    sha1,
    hash_hmac,
    base64_encode,
    base64_decode
}