var utils = {
    declinationApiCall: function(verb, tense, person, callback) {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
               if (xmlhttp.status == 200) {
                   callback(JSON.parse(xmlhttp.response))
               }
            }
        }
        var url = config.declinationApiUrl + verb + "?tense=" + tense + "&person=" + person
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}