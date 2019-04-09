var utils = {
    conjugationApiCall: function(verb, sentence, callback) {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
               if (xmlhttp.status == 200) {
                   callback(JSON.parse(xmlhttp.response))
               }
            }
        }
        var url = config.conjugationApiUrl + verb + "?tense=" + sentence.tense + "&person=" + sentence.person
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}

Object.prototype.getAt = function(index) {
    return this[Object.keys(this)[index]]
}

Object.prototype.getKeyAt = function(index) {
    return Object.keys(this)[index]
}