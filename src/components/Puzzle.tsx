import classNames from 'classnames';
import React, { createRef } from 'react';
import ChozoTranslator, { TranslatedToken } from '../lib/chozoTranslator'
import './Puzzle.css';

type Props = {
    goal: string
}

type State = {
    inputText: string,
    progress: ProgressToken[],
    isSolved: boolean,
    hintCount: number
}

type ProgressToken = {
    input: string,
    output: string,
    isWord: boolean,
    isTranslated: boolean,
    isCorrect: boolean
}

export default class Puzzle extends React.Component<Props, State> {
    goal: string[]
    lastCaretPos = 0
    inputRef = createRef<HTMLInputElement>()
    blockedChars = /[^ ,!?()"\-:;a-zA-Z]/g

    constructor(props: Props) {
        super(props);
        this.goal = this.props.goal.split(ChozoTranslator.separators)
        this.state = {inputText: '', progress: [], isSolved: false, hintCount: 0};
        this.handleChange = this.handleChange.bind(this);
    }

    addGoalData(translatedWord: TranslatedToken, goal: string | undefined): ProgressToken {
        let ret = {
            input: translatedWord.inputText,
            output: translatedWord.inputText,
            isWord: translatedWord.isWord,
            isTranslated: false,
            isCorrect: false
        }

        if (ChozoTranslator.isChozo(translatedWord.inputText)) {
            ret.isTranslated = true
            
            if (translatedWord.outputText) {
                if (goal && translatedWord.outputText?.map((word) => word.toLocaleLowerCase()).includes(goal.toLocaleLowerCase())) {
                    ret.isCorrect = true
                    ret.output = goal
                } else {
                    ret.output = translatedWord.outputText[0]
                }
            }
        }

        return ret
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        const text = event.currentTarget.value.replaceAll(this.blockedChars, "")
        const charsRemoved = event.currentTarget.value.length - text.length
        this.lastCaretPos = event.currentTarget.selectionStart as number - charsRemoved
        let translation = ChozoTranslator.translateTextToEnglish(text).map(
            (word, i) => this.addGoalData.bind(this)(word, this.goal.at(i))
        )
        const translationWordsOnly = translation.filter(token => token.isWord)
        const goalWordsOnly = this.goal.filter(token => ChozoTranslator.isEnglish(token))
        this.setState({
            inputText: text,
            progress: translation,
            isSolved: translationWordsOnly.length === goalWordsOnly.length && translationWordsOnly.reduce((prev, token) => {
                return token.isCorrect && prev
            }, true)
        })
    }

    componentDidUpdate() {
        this.inputRef.current?.setSelectionRange(this.lastCaretPos, this.lastCaretPos)
    }

    static getWordAt(position: number, text: string) {
        // Special case for end of word
        if (text.length &&
            position && 
            text.charAt(position)?.toString().match(ChozoTranslator.separators) &&
            text.charAt(position - 1)?.toString().match(ChozoTranslator.wordPattern)) {
            position--
        }

        const tokens = text.split(ChozoTranslator.separators)
        let currLen = 0
        let currToken = 0
        while(currLen <= position && currToken < tokens.length) {
            currLen += tokens[currToken].length
            currToken++
        }
        
        const pos = Math.max(currToken - 1, 0)
        const word = tokens[pos]
        const prevSpace = Math.max(currLen - word.length, 0)
        const nextSpace = currLen

        return {text: word, wordIndex: pos, wordStart: prevSpace, wordEnd: nextSpace}
    }

    static getFirstWrongCharacter(text: string, goal: string): number | undefined {
        for (let i = 0; i < goal.length; i++) {
            if (goal.charAt(i).toLocaleLowerCase() !== text.charAt(i).toLocaleLowerCase())
                return i
        }
        return undefined
    }

    giveHint() {
        if (!this.inputRef.current || this.state.isSolved) return

        const caretPos = this.inputRef.current.selectionStart ?? this.inputRef.current.value.length
        let currentText = this.inputRef.current.value

        let word = Puzzle.getWordAt(caretPos, currentText)
        if (word.wordIndex >= this.goal.length || word.text.match(ChozoTranslator.separators)) return

        // If we're at the end of a solved word, enter a space
        // So that we can give a hint for the next word instead
        // TODO: Seek first existing unsolved word?
        if (this.state.progress.at(word.wordIndex)?.isCorrect && caretPos === currentText.length) {
            if (word.wordIndex >= this.goal.length - 1) return

            this.inputRef.current.value = currentText = currentText.substring(0, word.wordEnd) + ' ' + currentText.substring(word.wordEnd)
            word = Puzzle.getWordAt(word.wordEnd + 1, currentText)

            this.lastCaretPos = word.wordEnd + 1
        }

        if (this.state.progress.at(word.wordIndex)?.isCorrect) return // This word is solved already

        const hintGoal = ChozoTranslator.translateWordToChozo(this.goal[word.wordIndex]).outputText?.at(0)
        if (hintGoal) {
            let inputText: string
            const firstWrongChar = Puzzle.getFirstWrongCharacter(word.text, hintGoal)
            if (firstWrongChar !== undefined) {
                inputText = currentText.substring(0, word.wordStart + firstWrongChar) + hintGoal[firstWrongChar] + currentText.substring(word.wordEnd)
                this.lastCaretPos = word.wordStart + firstWrongChar + 1
            } else {
                // Should only get here if guess is too long
                inputText = currentText.substring(0, word.wordStart) + hintGoal + currentText.substring(word.wordEnd)
                this.lastCaretPos = word.wordStart + hintGoal.length
            }
            this.setState({
                hintCount: this.state.hintCount + 1,
                inputText: inputText
            })
        } else {
            throw Error(`Bad solution: No translation for ${this.goal[word.wordIndex]}`)
        }
    }

    handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === '.') {
            this.giveHint.bind(this)()
        }
    }

    render() {
        return (
            <div className='puzzle-box'>
                <p className='puzzle-solution-text'>{this.props.goal}</p>
                <p className='puzzle-progress-text'>{this.state.progress.map((word, i) =>
                    <React.Fragment key={i}>
                        <span className={classNames({'untranslated-word mawkin-font': word.isWord && !word.isTranslated, 'correct-word': word.isCorrect || this.state.isSolved })}>{word.output}</span>
                    </React.Fragment>
                )}</p>
                <input ref={this.inputRef} className='puzzle-input' type='text' autoComplete='off' value={this.state.inputText} onChange={this.handleChange} onKeyDown={this.handleKeyDown.bind(this)}/>
                <p style={{textAlign: 'center'}}>{this.state.isSolved && <>You win! </>}Hints used: {this.state.hintCount}</p>
            </div>
        );
    }
}
