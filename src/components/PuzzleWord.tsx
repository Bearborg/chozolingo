import React from 'react';
import {WORD_MAP} from '../constants/wordMap'

type Props = {
    goal: string,
    position: number
}

type State = {
    inputText: string,
    progressText: string,
    isValid: boolean
    isSolved: boolean
}

export default class PuzzleWord extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {inputText: '', progressText: '', isValid: false, isSolved: false};
        this.handleChange = this.handleChange.bind(this);
    }

    isValid() {
        return WORD_MAP.has(this.state.inputText.toLocaleLowerCase())
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        const text = event.currentTarget.value.replace(/[^a-zA-Z]/, "")
        const isValid = WORD_MAP.has(text.toLocaleLowerCase())
        let translation = text
        if (isValid) {
            const possibleTranslations = WORD_MAP.get(text.toLocaleLowerCase()) as string[]
            
            if (possibleTranslations.includes(this.props.goal.toLocaleLowerCase())) {
                translation = this.props.goal
            } else {
                translation = possibleTranslations[0]
            }
        }

        this.setState({
            inputText: text,
            progressText: translation,
            isValid: isValid,
            isSolved: isValid && translation === this.props.goal
        });
    }

    focusNthWord(i: number) {
        const nextInput = document.querySelector(`#puzzle-sentence>.puzzle-word:nth-of-type(${i})>input`)
        if (nextInput as HTMLInputElement && !nextInput?.attributes.getNamedItem("disabled")) {
            (nextInput as HTMLInputElement).focus()
        }
    }

    handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const caretPos = event.currentTarget.selectionStart
        const textLength = event.currentTarget.value.length
        if (event.key === ' ' || event.key === 'Enter' || (event.key === 'ArrowRight' && caretPos === textLength)) {
            this.focusNthWord(this.props.position + 1)
        } else if ((textLength === 0 && event.key === 'Backspace') || (event.key === 'ArrowLeft' && caretPos === 0)) {
            this.focusNthWord(this.props.position - 1)
        }
    }

    handleBlur(event: React.FormEvent<HTMLInputElement>) {
        if (this.state.isSolved) {
            event.currentTarget.setAttribute("disabled", "")
        }
    }

    render() {
        return (
            <div className='puzzle-word'>
                <p>{this.props.goal}</p>
                <p className={this.isValid() ? '' : 'mawkin-font'} style={ {color: this.state.isSolved ? "green" : "", height: "1em"}}>{this.state.progressText}</p>
                <input type="text" autoComplete='off' value={this.state.inputText} onChange={this.handleChange} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)}/>
            </div>
        );
    }
}
