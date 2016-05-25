module.exports = {};

module.exports.parsePerson = function(data) {
    var obj = JSON.parse(data);
    if (obj.name) obj.name = obj.name.trim();
    data = JSON.stringify(obj);
    return data;
}

module.exports.stringifyPerson = function(obj) {
    if (!obj.age) {
        obj.birth = new Date(obj.birth);
        var difference = new Date() - obj.birth;
        obj.age = Math.floor(difference / 31536000000);
        delete obj.birth;
    }
    return JSON.stringify(obj);
}

module.exports.parseCookie = function(cookie) {
    var cookies = {};
    if (cookie) cookie.split(';').forEach(function(item) {
        var parts = item.split('=');
        cookies[(parts[0]).trim()] = (parts[1] || '').trim();
    });
    return cookies;
}

module.exports.strReplace = function(str, args) {
    args.forEach(function(arg){
        str = str.replace("%%", arg)
    });
    return str;
}