import {WORD_MAP} from '../constants/wordMap'

export type TranslatedToken = {
    inputText: string,
    outputText: string[] | undefined,
    isWord: boolean
}

export default class ChozoTranslator {
    static separators   = /([ \n,.!?()"\-:;]+)/
    static blockedChars = /[^ \n,.!?()"\-:;a-zA-Z]/g
    static wordPattern  = /^[a-zA-z]+$/

    static reverseWordMap = Array.from(WORD_MAP.entries()).reduce((reverseMap, entry) => {
        for (let rawWord of entry[1]) {
            const word = rawWord.toLocaleLowerCase()
            if (reverseMap.has(word)) {
                const englishWords = reverseMap.get(word) as string[]
                englishWords.push(entry[0])
                reverseMap.set(word, englishWords)
            } else {
                reverseMap.set(word, [entry[0]])
            }
        }
        return reverseMap
    }, new Map<string, string[]>())

    static isChozo(word: string): boolean {
        return WORD_MAP.has(word.toLocaleLowerCase())
    }

    static translateToEnglish(word: string) {
        return WORD_MAP.get(word.toLocaleLowerCase())
    }

    static translateWord(word: string, translationMap: Map<string, string[]>): TranslatedToken {
        if (!word.length || !word.match(ChozoTranslator.wordPattern)) {
            return {
                inputText: word,
                outputText: undefined,
                isWord: false
            }
        }
        return {
            inputText: word,
            outputText: translationMap.get(word.toLocaleLowerCase()),
            isWord: true,
        }
    }

    static translateWordToEnglish(word: string): TranslatedToken {
        return ChozoTranslator.translateWord(word, WORD_MAP)
    }

    static translateWordToChozo(word: string): TranslatedToken {
        return ChozoTranslator.translateWord(word, ChozoTranslator.reverseWordMap)
    }

    static translateTextToEnglish(inputText: string): TranslatedToken[] {
        const text = inputText.replaceAll(ChozoTranslator.blockedChars, "")
        let translation = text.split(ChozoTranslator.separators).map(ChozoTranslator.translateWordToEnglish)
        return translation
    }

    static translateTextToChozo(inputText: string): TranslatedToken[] {
        const text = inputText.replaceAll(ChozoTranslator.blockedChars, "")
        let translation = text.split(ChozoTranslator.separators).map(ChozoTranslator.translateWordToChozo)
        return translation
    }

    static isEnglish(word: string): boolean {
        return ChozoTranslator.reverseWordMap.has(word.toLocaleLowerCase())
    }

    static translateToChozo(word: string) {
        return ChozoTranslator.reverseWordMap.get(word.toLocaleLowerCase())
    }
}