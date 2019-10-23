
var jssdk = {}
var timestamp = require("timestamp")
var c = require("./c")

function _getValue(object , key , def ){
    if (def == undefined) {
        def = ''
    }
    if(typeof object !== 'object'){
        throw new Error("object must a Object-Type")
    }
    if(!object.hasOwnProperty(key)){
        return def
    }
    return object[key]
}

function _encodeQueryString(query) {
    if(query == undefined || query == null || query == {} ){
        return ''
    }
    var _keys = Object.keys(query)
    var _sort_query = []
    _keys = _keys.sort()
    for(var _index in _keys){
        _sort_query.push(encodeURIComponent(_keys[_index])+"="+encodeURIComponent(query[_keys[_index]]))
    }
    return _sort_query.join("&")
}

function _querySignature(host,method,encodeQueryString){
    return host + "#" + method.toString().toLowerCase() + "?query=" + c.sha1(encodeQueryString)
}

function _encodePackage(package){
    var _package = JSON.stringify(package)
    return c.base64_encode(_package)
}

jssdk.create = function(options) {

    const session_id = _getValue(options,'session_id')
    const host = _getValue(options,'host',null)
    const method = _getValue(options,'method','get')
    const query = _getValue(options,'query',{})
    const client_time = parseInt(timestamp() / 1000)
    const version = _getValue(options,'version','1.0')

    if(host == null) {
        throw new Error("Must put 'host' property in options")
    }

    var _package = {}
    _package.session_id = session_id
    _package.host = encodeURIComponent(host)
    _package.method = method
    _package.query = _encodeQueryString(query)
    _package.client_time = client_time.toString()
    _package.version = version
    _package.signature = c.hash_hmac('sha256' , _querySignature(_package.host,_package.method,_package.query) , _package.client_time)
    return _encodePackage(_package)

}


module.exports = {
    create : jssdk.create
};