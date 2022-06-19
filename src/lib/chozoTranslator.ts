import {WORD_MAP} from '../constants/wordMap'

export default class ChozoTranslator {
    static reverseWordMap = Array.from(WORD_MAP.entries()).reduce((prev, entry) => {
        for (let rawWord of entry[1]) {
            const word = rawWord.toLocaleLowerCase()
            if (prev.has(word)) {
                const englishWords = prev.get(word) as string[]
                englishWords.push(entry[0])
                prev.set(word, englishWords)
            } else {
                prev.set(word, [entry[0]])
            }
        }
        return prev
    }, new Map<string, string[]>())

    static isChozo(word: string): boolean {
        return WORD_MAP.has(word.toLocaleLowerCase())
    }

    static translateToEnglish(word: string) {
        return WORD_MAP.get(word.toLocaleLowerCase())
    }

    static isEnglish(word: string): boolean {
        return ChozoTranslator.reverseWordMap.has(word.toLocaleLowerCase())
    }

    static translateToChozo(word: string) {
        return ChozoTranslator.reverseWordMap.get(word.toLocaleLowerCase())
    }
}