import React, {Component} from 'react';
import {Container, Row, Form, InputGroup, Button} from 'react-bootstrap';
import {returnLetter} from "../../utilities";
import {t} from 'react-switch-lang';
import './QuestionEditor.css';

import CheckBoxIcon from '@material-ui/icons/CheckBox';

class QuestionEditor extends Component {

    updateQuestion = (value) => {
        this.props.update({
            question: value,
            correct: this.props.question.correct,
            answers: this.props.question.answers
        });
    };

    updateCorrect = (value) => {
        this.props.update({
            question: this.props.question.question,
            correct: value,
            answers: this.props.question.answers
        });
    };

    updateAnswer = (index, value) => {
        let newData = this.props.question.answers.slice();
        newData[index] = value;
        this.props.update({
            question: this.props.question.question,
            correct: this.props.question.correct,
            answers: newData
        });
    };

    AnswerBox = ({answer}) => {
        return(
            <Row>
                <div className={"question-editor-container-label"}>{t('components.answer')} {returnLetter(answer)}:</div>
                <InputGroup>
                    <Form.Control type={"text"}
                                  value={this.props.question.answers[answer]}
                                  className={"editor-textbox" + (answer === this.props.question.correct ? ' editor-textbox-correct' : '')}
                                  onChange={(e) => this.updateAnswer(answer, e.target.value)}
                                  maxLength={"120"}/>
                    <Button variant={"secondary"}
                            className={"correct-answer-button"}
                            disabled={answer === this.props.question.correct}
                            onClick={() => this.updateCorrect(answer)}>
                        <CheckBoxIcon/>
                    </Button>
                </InputGroup>
            </Row>
        )
    };

    render() {
        if(this.props.question) {
            return (
                <Container fluid className={"question-editor-container"}>
                    <Row>
                        <div className={"question-editor-container-label"}>{t('components.questionContent')}</div>
                        <Form.Control as={"textarea"}
                                      value={this.props.question.question}
                                      className={"editor-textarea"}
                                      onChange={(e) => this.updateQuestion(e.target.value)}
                                      maxLength={"200"}/>
                    </Row>
                    <this.AnswerBox answer={0}/>
                    <this.AnswerBox answer={1}/>
                    <this.AnswerBox answer={2}/>
                    <this.AnswerBox answer={3}/>
                </Container>
            );
        }else{
            return (
                <div style={{margin: '80px auto 0 auto'}}>
                    {t('components.chooseQuestion')}
                </div>
            );
        }
    }
}

export default QuestionEditor;