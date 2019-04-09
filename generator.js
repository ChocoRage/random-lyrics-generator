function generator(initSettings) {
	var settings
	var sentenceStructures

	var initGenerator = function() {
		setSettings(initSettings)
		getDslFile("data/syntax_" + settings.language + ".dsl")
	}

	var addSentenceStructure = function(newSentenceStructure) {
		if(newSentenceStructure instanceof SentenceStructure) {
			sentenceStructures.concat(newSentenceStructure)
		}
	}

	var getSettings = function() {
		return settings
	}

	var setSettings = function(newSettings) {
		if(newSettings && newSettings instanceof GeneratorSettings) {
			settings = newSettings
		} else {
			settings = new GeneratorSettings(config.defaultSettings.language)
		}
	}

	var createSentence = function() {
		return getRandomSentence()
	}

	function conjugate() {
		function getConjugationResult(result) {
			var conjugation = result[0]["conjugations"].filter(function(c) {
				var tenseMatches = c["partofspeech"]["tense"] == sentence.tense
				var personMatches = !c["partofspeech"]["person"] || c["partofspeech"]["person"].indexOf(sentence.person) >= 0
				var numberMatches = !c["partofspeech"]["number"] || c["partofspeech"]["number"].indexOf(sentence.number) >= 0
				return tenseMatches && personMatches && numberMatches
			})
			document.getElementById("lyrics").textContent = conjugation[0]["surfaceform"]
		}

		utils.conjugationApiCall(verb, sentence, getConjugationResult)
	}

	var getRandomWord = function (type, sentence, modifyFunction) {
		if (!type || !wordTypes[type]) {
			var typeKeys = Object.keys(wordTypes)
			type = typeKeys[Math.floor(Math.random() * typeKeys.length)]
		}
		var words = getWordArrayForSentence(wordTypes[type], sentence)
		return words[Math.floor(Math.random() * words.length)]
	}

	function getRandomSentence() {
		var person = persons[Math.floor(Math.random() * persons.length)]
		var personNumber = number[Math.floor(Math.random() * number.length)]
		var tense = tenses[Math.floor(Math.random() * tenses.length)]
		var gender = person == "third" && number == "singular" ? genders[Math.floor(Math.random()*genders.length)] : undefined
		var language = settings.language

		return new Sentence(
			"",
			person,
			personNumber,
			tense,
			gender,
			null,
			language
		)
	}

	function getDslFile(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url, true)
		request.onreadystatechange = function (){
			if(request.readyState === 4) {
				if(request.status === 200 || request.status == 0) {
					parseDsl(request.responseText);
				}
			}
		}
		request.send(null);
	}

	function validateDslLine(line) {
		// #1 parenthesis and quotation
		var parenthesisCount = 0
		if(line.match(/\"/g) && line.match(/\"/g).length % 2 != 0) {
			console.error("DSL validation failed: bad quotation")
			return false
		}
		for(var c in line) {
			if(!line.hasOwnProperty(c)) continue
			if(!line[c].match(/[\w|$|\(|\)|:|\?| |\||\"]/)) {
				var quotationsBefore = line.substring(0, c).match(/\"/g) ? line.substring(0, c).match(/\"/g).length : []
				var quotationsAfter = line.substring(parseInt(c)+1).match(/\"/g) ? line.substring(parseInt(c)+1).match(/\"/g).length : []
				if(quotationsBefore % 2 != 1 || quotationsAfter % 2 != 1) {
					var blanks = ""
					var n = 0
					while(n < c) {
						blanks += " "
						n++
					}
					console.error("DSL validation failed: unexpected character - '" + line[c] + "'\n" + line + "\n" + blanks + "^")
					return false
				}
			}
			if(line[c] == "(") {
				parenthesisCount += 1
			} else if(line[c] == ")") {
				parenthesisCount -= 1
				if(parenthesisCount < 0) {
					console.error("DSL validation failed: bad parenthesis")
					return false
				}
			}
		}
		if(parenthesisCount != 0) {
			console.error("DSL validation failed: bad parenthesis")
			return false
		}
		return true
	}

	function createSentenceStructureFromDslLine(dslLine) {
		var sentenceStructure = new SentenceStructure()

		function resolve(str, subParts) {
			var parenthesisIndex = str.indexOf("(")
			var blankIndex = str.indexOf(" ")
			var pipeIndex = str.indexOf("|")

			if(parenthesisIndex >= 0 && parenthesisIndex < blankIndex) {
				var innerPartClose = str.indexOf(")")
				var innerPartOpen = str.lastIndexOf("(")
				var innerPart = str.substring(innerPartOpen, innerPartClose)
			} else if(blankIndex >= 0 && parenthesisIndex > blankIndex) {
				// var part = 
			} else if(pipeIndex >= 0) {

			}
		}

		var rawParts = resolve(dslLine, [])

		// for(var rawPart of rawParts) {
		// 	var part = new SentenceStructurePart(type, modifyFunction)
		// 	sentenceStructure.addPart(part)
		// }

		addSentenceStructure(sentenceStructure)
	}

	function parseDsl(dslContent) {
		var lines = dslContent.split(/\r?\n/)
		lines = lines.filter(function(line) {
			return line && line.indexOf("#") != 0
		})
		for(var line of lines) {
			if(validateDslLine(line)) {
				var sentenceStructure = createSentenceStructureFromDslLine(line)
				addSentenceStructure(sentenceStructure)
			}
		}
	}

	function getWordArrayForSentence(array, sentence) {
		if(array && sentence) {
			if(array.any) return array.any
			if(array[sentence.number]) {
				if(array[sentence.number].any) return array[sentence.number].any
				else if(array[sentence.number][sentence.person]) return array[sentence.number][sentence.person]
			}
		}
		return null
	}

	initGenerator()

	return {
		getSettings: getSettings,
		setSettings: setSettings,
		createSentence: createSentence,
		addSentenceStructure: addSentenceStructure
	}
}

class Sentence {
	constructor(text, person, number, tense, gender, structure, language) {
		this.text = text
		this.person = person
		this.number = number
		this.tense = tense
		this.gender = gender
		this.structure = structure
		this.language = language
	}
}

class SentenceStructure {
	constructor(parts) {
		this.parts = parts
	}

	addPart(part) {
		part.added = true
		if(this.parts) {
			this.parts = this.parts.concat(part)
		} else {
			this.parts = [part]
		}
	}
}

class SentenceStructurePart {
	constructor(type, modifyFunction) {
		this.type = type
		this.modifyFunction = modifyFunction
		this.added = false
	}
}

class GeneratorSettings {
	constructor(language) {
		this.language = language
	}
}
