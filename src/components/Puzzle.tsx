import classNames from 'classnames';
import React, { createRef } from 'react';
import ChozoTranslator from '../lib/chozoTranslator'
import './Puzzle.css';

type Props = {
    goal: string
}

type State = {
    inputText: string,
    progressText: ProgressWord[],
    isSolved: boolean,
    hintCount: number
}

type ProgressWord = {
    input: string,
    output: string,
    isTranslated: boolean,
    isCorrect: boolean
}

export default class Puzzle extends React.Component<Props, State> {
    goal: string[]
    lastCaretPos = 0
    inputRef = createRef<HTMLInputElement>()
    separators = /[ ]+/
    blockedChars = /[^a-zA-Z ]/g

    constructor(props: Props) {
        super(props);
        this.goal = this.props.goal.split(this.separators)
        this.state = {inputText: '', progressText: [], isSolved: false, hintCount: 0};
        this.handleChange = this.handleChange.bind(this);
    }

    translateWord(word: string, goal: string | undefined): ProgressWord {
        let ret = {
            input: word,
            output: word,
            isTranslated: false,
            isCorrect: false
        }

        if (ChozoTranslator.isChozo(word)) {
            ret.isTranslated = true
            const possibleTranslations = ChozoTranslator.translateToEnglish(word) as string[]
            
            if (goal && possibleTranslations.map((word) => word.toLocaleLowerCase()).includes(goal.toLocaleLowerCase())) {
                ret.isCorrect = true
                ret.output = goal
            } else {
                ret.output = possibleTranslations[0]
            }
        }

        return ret
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        const text = event.currentTarget.value.replaceAll(this.blockedChars, "")
        const charsRemoved = event.currentTarget.value.length - text.length
        this.lastCaretPos = event.currentTarget.selectionStart as number - charsRemoved
        let translation = text.split(this.separators).map(
            (word, i) => {
                return this.translateWord.bind(this)(word, this.goal.at(i))
            }
        )
        this.setState({
            inputText: text,
            progressText: translation,
            isSolved: translation.length === this.goal.length && translation.reduce((prev, word) => {
                return word.isCorrect && prev
            }, true)
        })
    }

    componentDidUpdate() {
        this.inputRef.current?.setSelectionRange(this.lastCaretPos, this.lastCaretPos)
    }

    getWordAt(position: number, text: string) {
        // Special case for end of word
        if (text[position] == ' ' && text[position - 1]) {
            position--
        }

        // TODO: support punctuation via regex?
        let prevSpace = text.lastIndexOf(' ', position)
        let nextSpace = text.indexOf(' ', position)
        prevSpace = prevSpace === -1 ? 0 : prevSpace + 1
        nextSpace = nextSpace === -1 ? text.length : nextSpace

        // This is pretty hacky.
        const mockWord = '!dummy!'
        const mockText = text.substring(0, prevSpace) + mockWord + text.substring(nextSpace)
        const pos = mockText.split(this.separators).indexOf(mockWord)
        const word = text.substring(prevSpace, nextSpace)
        return {text: word, wordIndex: pos, wordStart: prevSpace, wordEnd: nextSpace}
    }

    giveHint() {
        if (!this.inputRef.current || this.state.isSolved) return

        const caretPos = this.inputRef.current.selectionStart ?? this.inputRef.current.value.length
        let currentText = this.inputRef.current.value

        let word = this.getWordAt(caretPos, currentText)
        if (word.wordIndex >= this.goal.length || word.text === ' ') return

        // If we're at the end of a solved word, enter a space
        // So that we can give a hint for the next word instead
        // TODO: Seek first existing unsolved word?
        if (this.state.progressText.at(word.wordIndex)?.isCorrect && caretPos === currentText.length) {
            if (word.wordIndex >= this.goal.length - 1) return

            this.inputRef.current.value = currentText = currentText.substring(0, word.wordEnd) + ' ' + currentText.substring(word.wordEnd)
            word = this.getWordAt(word.wordEnd + 1, currentText)

            this.lastCaretPos = word.wordEnd + 1
        }

        if (this.state.progressText.at(word.wordIndex)?.isCorrect) return // This word is solved already

        const hintGoal = ChozoTranslator.translateToChozo(this.goal[word.wordIndex])?.at(0)
        if (hintGoal) {
            let inputText: string
            if (hintGoal.startsWith(word.text.toLocaleLowerCase())) {
                inputText = currentText.substring(0, word.wordStart + word.text.length) + hintGoal[word.text.length] + currentText.substring(word.wordEnd)
                this.lastCaretPos = word.wordEnd + 1
            } else {
                inputText = currentText.substring(0, word.wordStart) + hintGoal[0] + currentText.substring(word.wordEnd)
                this.lastCaretPos = word.wordStart + 1
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
                <p className='puzzle-progress-text'>{this.state.progressText.map((word, i) =>
                    <React.Fragment key={i}>
                        <span className={classNames({'untranslated-word mawkin-font': !word.isTranslated, 'correct-word': word.isCorrect})}>{word.output}</span>
                        <span> </span>
                    </React.Fragment>
                )}</p>
                <input ref={this.inputRef} className='puzzle-input' type='text' autoComplete='off' value={this.state.inputText} onChange={this.handleChange} onKeyDown={this.handleKeyDown.bind(this)}/>
                <p style={{textAlign: 'center'}}>{this.state.isSolved && <>You win! </>}Hints used: {this.state.hintCount}</p>
            </div>
        );
    }
}
