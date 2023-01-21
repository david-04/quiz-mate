import React, { Component } from "react";
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";

import { toLetter } from "../../utilities";

import CheckBox from "../../assets/icons/check_box.svg";
import CheckBoxOutlineBlank from "../../assets/icons/check_box_outline_blank.svg";

import "../../assets/icons/material-ui-icon.css";
import "./QuestionEditor.css";

const MAX_ANSWERS = 4;

class QuestionEditor extends Component {

    constructor(props) {
        super(props);
        this.onQuestionTextChange = this.onQuestionTextChange.bind(this);
    }

    onQuestionTextChange(event) {
        this.updateQuestion(event.target.value);
    }

    updateQuestion(value) {
        this.props.update({
            question: value,
            correct: this.props.question.correct,
            answers: this.props.question.answers
        });
    }

    setCorrectAnswerIndex(value) {
        this.props.update({
            question: this.props.question.question,
            correct: value,
            answers: this.props.question.answers
        });
    }

    updateAnswer(index, value) {
        const newData = this.props.question.answers.slice();
        newData[index] = value;
        this.props.update({
            question: this.props.question.question,
            correct: this.props.question.correct,
            answers: newData
        });
    }

    getMarkCorrectAnswerCallback(index) {
        return () => this.setCorrectAnswerIndex(index);
    }

    getUpdateAnswerCallback(index) {
        return (event => this.updateAnswer(index, event.target.value));
    }

    answerBox(answer) {
        return (
            <Row key={answer}>
                <div className="answer-row">
                    <InputGroup>
                        <Button variant="secondary" onClick={this.getMarkCorrectAnswerCallback(answer)}>
                            <img src={answer === this.props.question.correct ? CheckBox : CheckBoxOutlineBlank}
                                className="material-ui-icon answer-checkbox"
                                alt="Mark as correct answer" />
                            <span className="answer-letter">{toLetter(answer)}</span>
                        </Button>
                        <Form.Control type="text"
                            value={this.props.question.answers[answer]}
                            className={
                                "editor-text-box"
                                + (answer === this.props.question.correct ? ' editor-text-box-correct' : '')
                            }
                            onChange={this.getUpdateAnswerCallback(answer)}
                            maxLength="120" />
                    </InputGroup>
                </div>
            </Row>
        );
    };

    renderAnswerBoxes() {
        const answerBoxes = [];
        for (let index = 0; index < MAX_ANSWERS; index++) {
            answerBoxes.push(this.answerBox(index));
        }
        return answerBoxes;
    }

    render() {
        if (this.props.question) {
            return (
                <Container fluid className="question-editor-container">
                    <Row>
                        <Form.Control
                            as="textarea"
                            value={this.props.question.question}
                            className="editor-textarea"
                            onChange={this.onQuestionTextChange}
                            placeholder="Question"
                            maxLength="200"
                        />
                    </Row>
                    {this.renderAnswerBoxes()}
                </Container>
            );
        } else {
            return (
                <div style={{ margin: '40px auto 0 10px', textAlign: "left", fontSize: "1.2rem" }}>
                    <p>Use this editor to create or modify a quiz:</p>
                    <ul>
                        <li>Upload a quiz (if you have one)</li>
                        <li>Use the buttons above to add questions</li>
                        <li>Switch between questions on the left side</li>
                    </ul>
                    <p>Quizzes are NOT saved on the server!</p>
                    <p style={{ color: "red", fontWeight: "bold" }} >You must download the quiz when finished.</p>
                </div>
            );
        }
    }
}

export default QuestionEditor;
