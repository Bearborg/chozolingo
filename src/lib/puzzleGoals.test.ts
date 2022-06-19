import { PUZZLE_GOALS } from './puzzleGoals'
import ChozoTranslator from './chozoTranslator'

test('all solutions are valid', () => {
    for (const solution of PUZZLE_GOALS) {
        for (const word of solution.split(" ")) {
            // This structure is wonky but it allows the
            // word/translation pair to appear in the test results
            // if there's a failure

            const result: any = {}
            result[word] = ChozoTranslator.translateToChozo(word)

            const expectedObj: any = {}
            expectedObj[word] = expect.anything()

            expect(result).toMatchObject(expectedObj)
        }
    }
})
