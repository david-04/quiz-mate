import React, { Component } from "react";
import { Button, ButtonGroup, Col, Container, ProgressBar, Row } from "react-bootstrap";

import CenterBox from "../../components/CenterBox";
import RankTable from "../../components/RankTable";
import Timer from "../../components/Timer";
import { answerStatsRequest, generalRankingRequest, timerSync } from "../../connection/config";
import { toLetter } from "../../utilities";
import { ONE_HUNDRED } from "../../utilities/constants";

import ArrowForward from "../../assets/icons/arrow_forward.svg";
import Assessment from "../../assets/icons/assessment.svg";
import CheckBox from "../../assets/icons/check_box.svg";
import EmojiEvents from "../../assets/icons/emoji_events.svg";
import PausePresentation from "../../assets/icons/pause_presentation.svg";

import "../../assets/icons/material-ui-icon.css";
import "./Question.css";

export const TAB_REVEAL_ANSWER = 1;
export const TAB_ANSWER_STATS = 2;
export const TAB_LEADERBOARD = 3;

const BUTTON_STYLE = {
    ACTIVE: {
        variant: "secondary",
        disabled: false,
    },
    DISABLED: {
        variant: "secondary",
        disabled: true,
    },
};

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

    renderControlButton(icon, label1, label2, style, onClick) {
        return (
            <Button variant={style.variant} disabled={style.disabled} onClick={onClick}>
                <img src={icon} className="material-ui-icon" alt={`${label1} ${label2}`.trim()} />
                <br />{label1}
                <br />{label2}
            </Button>
        );
    }

    renderStopRoundButton() {
        const style = this.props.questionIsOpen ? BUTTON_STYLE.ACTIVE : BUTTON_STYLE.DISABLED;
        const onClick = () => this.onNextButton();
        return this.renderControlButton(PausePresentation, "Stop", "round", style, onClick);
    }

    renderRevealAnswerButton() {
        const style = this.props.questionIsOpen || this.props.questionTab === TAB_REVEAL_ANSWER
            ? BUTTON_STYLE.DISABLED
            : BUTTON_STYLE.ACTIVE;
        const onClick = () => this.props.changeTab(TAB_REVEAL_ANSWER);
        return this.renderControlButton(CheckBox, "Reveal", "answer", style, onClick);
    }

    renderAnswerStatsButton() {
        const style = this.props.questionIsOpen || this.props.questionTab === TAB_ANSWER_STATS
            ? BUTTON_STYLE.DISABLED
            : BUTTON_STYLE.ACTIVE;
        const onClick = () => {
            this.props.changeTab(TAB_ANSWER_STATS);
            this.props.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
        };
        return this.renderControlButton(Assessment, "Answer", "stats", style, onClick);
    }

    renderLeaderboardButton() {
        const style = this.props.questionIsOpen || this.props.questionTab === TAB_LEADERBOARD
            ? BUTTON_STYLE.DISABLED
            : BUTTON_STYLE.ACTIVE;
        const onClick = () => {
            this.props.changeTab(TAB_LEADERBOARD);
            this.props.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
        };
        return this.renderControlButton(EmojiEvents, "Leader-", "board", style, onClick);
    }

    renderNextButton() {
        const style = this.props.questionIsOpen || this.props.isLastQuestion
            ? BUTTON_STYLE.DISABLED
            : BUTTON_STYLE.ACTIVE;
        const onClick = () => this.onNextButton();
        return this.renderControlButton(ArrowForward, "Next", "question", style, onClick);
    }

    renderControlButtons = () => {
        return (
            <div className="question-control-buttons">
                <ButtonGroup>
                    {this.renderStopRoundButton()}
                </ButtonGroup>
                <ButtonGroup>
                    {this.renderRevealAnswerButton()}
                    {this.renderAnswerStatsButton()}
                    {this.renderLeaderboardButton()}
                </ButtonGroup>
                <ButtonGroup>
                    {this.renderNextButton()}
                    {/* <Button
                        variant="secondary"
                        disabled={this.props.isLastQuestion && !this.props.questionIsOpen}
                        onClick={this.onNextButton}
                    >
                        {
                            this.props.questionIsOpen
                                ? <img src={PausePresentation} className="material-ui-icon" alt="Stop round" />
                                : <img src={ArrowForward} className="material-ui-icon" alt="Add" />
                        }
                        <br />{this.props.questionIsOpen ? "Stop" : "Next"}
                        <br />{this.props.questionIsOpen ? "round" : "question"}
                    </Button> */}
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
            <CenterBox logo cancel="End quiz" closeRoomSignal renderJoinInfo {...this.props}>
                <div className="message-box">
                    <Container fluid style={this.props.questionTab === TAB_LEADERBOARD ? { display: "none" } : {}}>
                        {this.QuestionGrid()}
                    </Container>
                    {this.props.questionTab === TAB_LEADERBOARD && (<RankTable data={this.props.generalRanking} />)}
                </div>
                <div className="question-control-offset" />
                {this.renderControlButtons()}
            </CenterBox>
        );
    }
}

export default Question;
