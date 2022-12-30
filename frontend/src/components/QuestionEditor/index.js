import React, { Component } from "react";
import { Container, Row, Form, InputGroup, Button } from "react-bootstrap";
import { toLetter } from "../../utilities";
import "./QuestionEditor.css";

import CheckBox from "../../assets/icons/check_box.svg";
import CheckBoxOutlineBlank from "../../assets/icons/check_box_outline_blank.svg";
import "../../assets/icons/material-ui-icon.css";

class QuestionEditor extends Component {

    updateQuestion = value => {
        this.props.update({
            question: value,
            correct: this.props.question.correct,
            answers: this.props.question.answers
        });
    };

    updateCorrect = value => {
        this.props.update({
            question: this.props.question.question,
            correct: value,
            answers: this.props.question.answers
        });
    };

    updateAnswer = (index, value) => {
        const newData = this.props.question.answers.slice();
        newData[index] = value;
        this.props.update({
            question: this.props.question.question,
            correct: this.props.question.correct,
            answers: newData
        });
    };

    answerBox = answer => {
        return (
            <Row>
                <div className="answer-row">
                    <InputGroup>
                        <Button variant="secondary" onClick={() => this.updateCorrect(answer)}>
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
                            onChange={event => this.updateAnswer(answer, event.target.value)}
                            maxLength="120" />
                    </InputGroup>
                </div>
            </Row>
        );
    };

    render() {
        if (this.props.question) {
            return (
                <Container fluid className="question-editor-container">
                    <Row>
                        <Form.Control
                            as="textarea"
                            value={this.props.question.question}
                            className="editor-textarea"
                            onChange={event => this.updateQuestion(event.target.value)}
                            placeholder="Question"
                            maxLength="200"
                        />
                    </Row>
                    {this.answerBox(0)}
                    {this.answerBox(1)}
                    {this.answerBox(2)}
                    {this.answerBox(3)}
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
