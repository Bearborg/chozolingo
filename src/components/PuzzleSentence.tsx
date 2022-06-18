import React from 'react';
import PuzzleWord from './PuzzleWord';

export default class PuzzleSentence extends React.Component {
    solution = "Close your eyes and rest".split(" ")

    render() {
        return (
            <div id="puzzle-sentence" style={ {display: "flex", justifyContent: "center", flexWrap: "wrap"} }>
                {this.solution.map((word, i) => (
                    <PuzzleWord key={i} goal={word} position={i + 1 /* 1-indexed */} />
                ))}
            </div>
        );
    }
}