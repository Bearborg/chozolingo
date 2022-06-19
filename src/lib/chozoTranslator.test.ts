import ChozoTranslator from './chozoTranslator'
import { WORD_MAP } from '../constants/wordMap'

test('all words round-trip successfully', () => {
    for (const word of WORD_MAP.keys()) {
        expect(ChozoTranslator.translateToChozo((ChozoTranslator.translateToEnglish(word) as string[])[0])).toContain(word)
    }
})
