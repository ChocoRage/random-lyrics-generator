function generator() {
    var wordTypes = {
        NOUN: 0,
        VERB: 1,
        ADJECTIVE: 2,
        PERSONAL_PRONOUN: 3,
        POSSESSIVE_PRONOUN: 4,
        MODAL_VERB: 5,
        MODAL_VERB_TO: 6
    }
    
    function create() {
        var verb = document.getElementById("test").textContent = generator.getRandomWord(wordTypes.VERB)
        var tense = tenses[Math.floor(Math.random()*(tenses.length - 1))]
        var person
        if(tensesAnyperson.indexOf(tense) >= 0) {
            person = "anyperson"
        } else {
            person = persons[Math.floor(Math.random()*(persons.length - 1))]
        }
        var result = utils.declinationApiCall(verb, tense, person, getResultValue)
    }

    function getResultValue(result) {
        console.log(result.surfaceform)
    }

    var getRandomWord = function (type) {
        if (!type || type < 0 || type >= Object.keys(wordTypes).length) {
            type = Math.floor(Math.random() * (Object.keys(wordTypes).length - 1))
        }
        switch (type) {
            case wordTypes.NOUN:
                return nouns[Math.floor(Math.random() * (nouns.length - 1))]
            case wordTypes.VERB:
                return verbs[Math.floor(Math.random() * (verbs.length - 1))]
            case wordTypes.ADJECTIVE:
                return adjectives[Math.floor(Math.random() * (adjectives.length - 1))]
            case wordTypes.PERSONAL_PRONOUN:
                return personal_pronouns[Math.floor(Math.random() * (personal_pronouns.length - 1))]
            case wordTypes.POSSESSIVE_PRONOUN:
                return possessive_pronouns[Math.floor(Math.random() * (possessive_pronouns.length - 1))]
            default:
                console.error("Error: no such word type for enum index " + type)
        }
    }

    var getRandomSentence = function () {
        var sentence = {
            text: "",
            person: 0,
            modus: null
        }
    }

    return {
        wordTypes: wordTypes,
        getRandomWord: getRandomWord,
        getRandomSentence: getRandomSentence,
        create: create
    }
}