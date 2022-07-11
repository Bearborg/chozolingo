import Puzzle from './Puzzle'

describe('getWordAt', () => {
    test('Basic word boundaries', () => {
        const result = Puzzle.getWordAt(3, "A sentence containing several words")
        expect(result).toMatchObject({text: "sentence", wordIndex: 2, wordStart: 2, wordEnd: 10})
    }),
    test('End of word', () => {
        const result = Puzzle.getWordAt(1, "A sentence containing several words")
        expect(result).toMatchObject({text: "A", wordIndex: 0, wordStart: 0, wordEnd: 1})
    }),
    test('Gap between words', () => {
        const result = Puzzle.getWordAt(3, "A        big gap")
        expect(result).toMatchObject({text: "        ", wordIndex: 1, wordStart: 1, wordEnd: 9})
    }),
    test('End of string', () => {
        const result = Puzzle.getWordAt(35, "A sentence containing several words")
        expect(result).toMatchObject({text: "words", wordIndex: 8, wordStart: 30, wordEnd: 35})
    })
})

describe('getFirstWrongCharacter', () => {
    test('First letter', () => {
        const result = Puzzle.getFirstWrongCharacter("Olmen", "Sidur")
        expect(result).toEqual(0)
    }),
    test('Second letter', () => {
        const result = Puzzle.getFirstWrongCharacter("Hadar", "Horek")
        expect(result).toEqual(1)
    }),
    test('Full match', () => {
        const result = Puzzle.getFirstWrongCharacter("Hadar", "Hadar")
        expect(result).toEqual(undefined)
    })
    test('Too short', () => {
        const result = Puzzle.getFirstWrongCharacter("Ai", "Aimar")
        expect(result).toEqual(2)
    }),
    test('Mixed cases', () => {
        const result = Puzzle.getFirstWrongCharacter("HADAR", "hadar")
        expect(result).toEqual(undefined)
    }),
    test('Extra characters', () => {
        const result = Puzzle.getFirstWrongCharacter("Hadaris", "Hadar")
        expect(result).toEqual(undefined)
    }),
    test('Empty guess', () => {
        const result = Puzzle.getFirstWrongCharacter("", "Hadar")
        expect(result).toEqual(0)
    })
})
