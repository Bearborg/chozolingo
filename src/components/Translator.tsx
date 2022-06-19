import classNames from 'classnames';
import React, { createRef } from 'react';
import ChozoTranslator from '../lib/chozoTranslator'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import './Translator.css';

type Props = {
}

type State = {
    englishToChozo: boolean,
    englishText: string,
    chozoText: string
}

export default class Puzzle extends React.Component<Props, State> {
    separators = /([ ,\.!\?\n]+)/
    blockedChars = /[^a-zA-Z ,\.!\?\n]/g
    wordPattern = /^[a-zA-z]+$/
    inputRef = createRef<HTMLTextAreaElement>()
    outputRef = createRef<HTMLTextAreaElement>()

    constructor(props: Props) {
        super(props)
        this.state = {
            englishToChozo: true,
            englishText: '',
            chozoText: ''
        }
    }

    languages() {
        if (this.state.englishToChozo) {
            return ['English', 'Chozo']
        } else {
            return ['Chozo', 'English']
        }
    }

    handleSwap() {
        this.setState({englishToChozo: !this.state.englishToChozo}) 
    }

    handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
        const text = event.currentTarget.value.replaceAll(this.blockedChars, "")
        const translateWord = this.state.englishToChozo ? ChozoTranslator.translateToChozo : ChozoTranslator.translateToEnglish
        let translation = text.split(this.separators).map(
            (word) => {
                if (!word.length || !word.match(this.wordPattern)) return word
                return translateWord(word)?.at(0) ?? `[${word}]`
            }
        ).join("")
        if (this.state.englishToChozo) {
            this.setState({
                englishText: text,
                chozoText: translation
            })
        } else {
            this.setState({
                englishText: translation,
                chozoText: text
            })
        }
        
    }

    render() {
        return (
          <div className="translator-box">
            <div className='translator-pane'>
                <h2 className='language-title'>{this.languages()[0]}</h2>
                <textarea
                name={this.languages()[0]}
                autoComplete={this.state.englishToChozo.toString()}
                value={
                    this.state.englishToChozo
                    ? this.state.englishText
                    : this.state.chozoText
                }
                onChange={this.handleChange.bind(this)}
                ref={this.inputRef}
                />
            </div>
            <button className='swap-button' onClick={this.handleSwap.bind(this)}><SwitchHorizontalIcon/></button>
            <div className='translator-pane'>
                <h2 className='language-title'>{this.languages()[1]}</h2>
                <textarea
                name={this.languages()[1]}
                autoComplete={(!this.state.englishToChozo).toString()}
                value={
                    this.state.englishToChozo
                    ? this.state.chozoText
                    : this.state.englishText
                }
                readOnly
                ref={this.outputRef}
                />
            </div>
          </div>
        )
    }
}