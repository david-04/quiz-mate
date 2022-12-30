import React, { Component } from "react";
import { Button, ButtonGroup, Col, Container, ProgressBar, Row } from "react-bootstrap";
import CenterBox from "../../components/CenterBox";
import { answerStatsRequest, generalRankingRequest, timerSync } from "../../connection/config";
import "./Question.css";
import { toLetter } from "../../utilities";
import { ONE_HUNDRED } from "../../utilities/constants";

import ArrowForward from "../../assets/icons/arrow_forward.svg";
import Assessment from "../../assets/icons/assessment.svg";
import CheckBox from "../../assets/icons/check_box.svg";
import "../../assets/icons/material-ui-icon.css";
import PanTool from "../../assets/icons/pan_tool.svg";
import ViewList from "../../assets/icons/view_list.svg";

import RankTable from "../../components/RankTable";
import Timer from "../../components/Timer";

export const TAB_REVEAL_ANSWER = 1;
export const TAB_ANSWER_STATS = 2;
export const TAB_LEADERBOARD = 3;

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = { tab: 0 };
        this.timer = React.createRef();
    }

    componentDidMount() {
        if (this.props.game.hostingRoom.timeLimit > 0) {
            this.timer.current.startTimer(this.props.game.hostingRoom.timeLimit);
        }
    }

    timerTrigger = () => {
        if (this.props.questionIsOpen) {
            this.onNextButton();
        }
    };

    correctGreenBox = answer => {
        const isRevealAnswerTab = this.props.questionTab === TAB_REVEAL_ANSWER;
        const isCorrectAnswer = this.props.question.correct === answer;
        const mustRevealAnswer = (isRevealAnswerTab || this.props.revealAnswer) && isCorrectAnswer;
        return mustRevealAnswer ? " question-answer-correct" : "";
    };

    StatProgressBar = answer => {
        let value = 0;
        if (this.props.answerCount !== 0 && this.props.answerStats) {
            value = Math.round(this.props.answerStats[answer] * ONE_HUNDRED / this.props.answerCount);
        }
        if ((this.props.questionTab === TAB_ANSWER_STATS || this.props.revealStats)) {
            return (<ProgressBar now={value} label={value + "%"} className="question-progress" />);
        } else {
            return false;
        }
    };

    timerTick = value => {
        this.props.socket.emit(timerSync, this.props.game.hostingRoom.roomCode, value);
    };

    Answer = (answer, index) => (
        <Col md={6} sm={12} key={index}>
            <div className={"question-answer" + this.correctGreenBox(index)}>
                <div className="question-answer-letter">{toLetter(index)}</div>
                {answer}
                {this.StatProgressBar(index)}
            </div>
        </Col>
    );

    QuestionGrid = () => {
        return (
            <div>
                <Row>
                    <Col md={{ span: 4, order: 1 }} sm={{ span: 6, order: 2 }} xs={{ span: 6, order: 2 }}>
                        <div className="question-counter">
                            Question: {this.props.questionIndex + 1} / {this.props.lastIndexNumber}
                        </div>
                    </Col>
                    <Col md={{ span: 4, order: 2 }} sm={{ span: 12, order: 1 }} xs={{ span: 12, order: 1 }}>
                        {this.props.game.hostingRoom.timeLimit > 0 &&
                            <Timer ref={this.timer} trigger={this.timerTrigger} tick={this.timerTick} />
                        }
                    </Col>
                    <Col md={{ span: 4, order: 3 }} sm={{ span: 6, order: 3 }} xs={{ span: 6, order: 3 }}>
                        <div className="question-answers-counter">
                            Answers: {this.props.answerCount} / {this.props.connectedUsers}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="question-question">{this.props.question.question}</div>
                    </Col>
                    {this.props.question.answers.map((answer, index) => this.Answer(answer, index))}
                </Row>
            </div >
        );
    };

    ControlButtons = () => {
        return (
            <div className="question-control-buttons">
                <ButtonGroup>
                    <Button
                        variant="secondary"
                        disabled={this.props.questionIsOpen || this.props.questionTab === TAB_REVEAL_ANSWER}
                        onClick={() => { this.props.changeTab(TAB_REVEAL_ANSWER); }}>
                        <img src={CheckBox} className="material-ui-icon" alt="Show correct answer" />
                        <br />Correct
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={this.props.questionIsOpen || this.props.questionTab === TAB_ANSWER_STATS}
                        onClick={() => {
                            this.props.changeTab(TAB_ANSWER_STATS);
                            this.props.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
                        }}
                    >
                        <img src={Assessment} className="material-ui-icon" alt="Answer statistics" />
                        <br />Stats
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={this.props.questionIsOpen || this.props.questionTab === TAB_LEADERBOARD}
                        onClick={() => {
                            this.props.changeTab(TAB_LEADERBOARD);
                            this.props.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
                        }}
                    >
                        <img src={ViewList} className="material-ui-icon" alt="Leaderboard" />
                        <br />Ranking
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={this.props.isLastQuestion && !this.props.questionIsOpen}
                        onClick={this.onNextButton}
                    >
                        {
                            this.props.questionIsOpen
                                ? <img src={PanTool} className="material-ui-icon" alt="Stop round" />
                                : <img src={ArrowForward} className="material-ui-icon" alt="Add" />
                        }
                        <br />
                        {this.props.questionIsOpen ? "Stop" : "Next"}
                    </Button>
                </ButtonGroup>
            </div>
        );
    };

    onNextButton = () => {
        if (this.props.game.hostingRoom.timeLimit > 0) {
            if (this.props.questionIsOpen) {
                this.timer.current.stopTimer();
            } else {
                this.timer.current.startTimer(this.props.game.hostingRoom.timeLimit);
            }
        }
        this.props.nextButton();
    };

    render() {
        return (
            <CenterBox logo cancel="End quiz" closeRoomSignal roomHeader {...this.props}>
                <div className="message-box">
                    <Container fluid style={this.props.questionTab === TAB_LEADERBOARD ? { display: "none" } : {}}>
                        {this.QuestionGrid()}
                    </Container>
                    {this.props.questionTab === TAB_LEADERBOARD && (<RankTable data={this.props.generalRanking} />)}
                </div>
                <div className="question-control-offset" />
                {this.ControlButtons()}
            </CenterBox>
        );
    }
}

export default Question;
