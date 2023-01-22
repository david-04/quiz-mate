import React, { Component } from "react";
import { Button, ButtonGroup, Col, Container, ProgressBar, Row } from "react-bootstrap";

import CenterBox from "../../components/CenterBox";
import RankTable from "../../components/RankTable";
import Timer from "../../components/Timer";
import { answerStatsRequest, closeRoom, generalRankingRequest, timerSync } from "../../connection/config";
import { toLetter } from "../../utilities";
import { ONE_HUNDRED } from "../../utilities/constants";

import ArrowForward from "../../assets/icons/arrow_forward.svg";
import Assessment from "../../assets/icons/assessment.svg";
import CheckBox from "../../assets/icons/check_box.svg";
import EmojiEvents from "../../assets/icons/emoji_events.svg";
import LookAtBrowser from "../../assets/icons/look_at_browser.svg";
import PausePresentation from "../../assets/icons/pause_presentation.svg";

import "../../assets/icons/material-ui-icon.css";
import "./Question.css";

export const TAB_REVEAL_ANSWER = 1;
export const TAB_ANSWER_STATS = 2;
export const TAB_LEADERBOARD = 3;
export const TAB_LOOK_DOWN = 4;

const Phase = {
    NOT_STARTED: 1,
    GUESSING: 2,
    REVEALING: 3,
};

const ButtonStyle = {
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
        this.onNextButton = this.onNextButton.bind(this);
        this.endQuiz = this.endQuiz.bind(this);
        this.onTimerStop = this.onTimerStop.bind(this);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.onStopButton = this.onStopButton.bind(this);
        this.timerTick = this.timerTick.bind(this);
    }

    getPhase() {
        if (this.props.questionIndex < 0) {
            return Phase.NOT_STARTED;
        } else if (this.props.questionIsOpen) {
            return Phase.GUESSING;
        } else {
            return Phase.REVEALING;
        }
    }

    isTimerEnabled() {
        return 0 < this.props.game.hostingRoom.timeLimit;
    }

    startTimer() {
        if (this.isTimerEnabled() && this.timer && this.timer.current) {
            this.timer.current.startTimer();
        }
    }

    stopTimer() {
        if (this.isTimerEnabled() && this.timer && this.timer.current) {
            this.timer.current.stopTimer();
        }
    }

    onTimerStop() {
        if (Phase.GUESSING === this.getPhase()) {
            this.onStopButton();
        }
    }

    timerTick(value) {
        this.props.socket.emit(timerSync, this.props.game.hostingRoom.roomCode, value);
    }

    correctGreenBox(answer) {
        const isRevealAnswerTab = this.props.questionTab === TAB_REVEAL_ANSWER;
        const isCorrectAnswer = this.props.question.correct === answer;
        const mustRevealAnswer = (isRevealAnswerTab || this.props.revealAnswer) && isCorrectAnswer;
        return mustRevealAnswer ? " question-answer-correct" : "";
    }

    StatProgressBar(answer) {
        let value = 0;
        if (this.props.answerCount !== 0 && this.props.answerStats) {
            value = Math.round(this.props.answerStats[answer] * ONE_HUNDRED / this.props.answerCount);
        }
        if ((this.props.questionTab === TAB_ANSWER_STATS || this.props.revealStats)) {
            return (<ProgressBar now={value} label={value + "%"} className="question-progress" />);
        } else {
            return false;
        }
    }

    renderAnswer(answer, index) {
        return (
            <Col md={6} sm={12} key={index}>
                <div className={"question-answer" + this.correctGreenBox(index)}>
                    <div className="question-answer-letter">{toLetter(index)}</div>
                    {answer}
                    {this.StatProgressBar(index)}
                </div>
            </Col>
        );
    }

    renderTimer() {
        if (this.isTimerEnabled()) {
            return (
                <Timer
                    ref={this.timer}
                    timeLimit={this.props.game.hostingRoom.timeLimit}
                    onTimerStop={this.onTimerStop}
                    tick={this.timerTick}
                />
            );
        } else {
            return false;
        }
    }

    QuestionGrid() {
        return (
            <div>
                <Row>
                    <Col md={{ span: 4, order: 1 }} sm={{ span: 6, order: 2 }} xs={{ span: 6, order: 2 }}>
                        <div className="question-counter">
                            Question: {this.props.questionIndex + 1} / {this.props.lastIndexNumber}
                        </div>
                    </Col>
                    <Col md={{ span: 4, order: 2 }} sm={{ span: 12, order: 1 }} xs={{ span: 12, order: 1 }}>
                        {this.renderTimer()}
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
                    {this.props.question.answers.map(this.renderAnswer)}
                </Row>
            </div >
        );
    }

    renderControlButton(icon, label1, label2, style, onClick) {
        return (
            <Button variant={style.variant} disabled={style.disabled} onClick={onClick}>
                <img src={icon} className="material-ui-icon" alt={`${label1} ${label2}`.trim()} />
                <br />{label1}
                <br />{label2}
            </Button>
        );
    }

    renderStopRoundButton(phase) {
        const style = Phase.GUESSING === phase ? ButtonStyle.ACTIVE : ButtonStyle.DISABLED;
        return this.renderControlButton(PausePresentation, "Stop", "round", style, this.onStopButton);
    }

    renderRevealAnswerButton(phase) {
        const style = Phase.REVEALING !== phase || TAB_REVEAL_ANSWER === this.props.questionTab
            ? ButtonStyle.DISABLED
            : ButtonStyle.ACTIVE;
        const onClick = () => this.props.changeTab(TAB_REVEAL_ANSWER);
        return this.renderControlButton(CheckBox, "Reveal", "answer", style, onClick);
    }

    renderAnswerStatsButton(phase) {
        const style = Phase.REVEALING !== phase || TAB_ANSWER_STATS === this.props.questionTab
            ? ButtonStyle.DISABLED
            : ButtonStyle.ACTIVE;
        const onClick = () => {
            this.props.changeTab(TAB_ANSWER_STATS);
            this.props.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
        };
        return this.renderControlButton(Assessment, "Answer", "stats", style, onClick);
    }

    renderLeaderboardButton(phase) {
        const style = Phase.REVEALING !== phase || TAB_LEADERBOARD === this.props.questionTab
            ? ButtonStyle.DISABLED
            : ButtonStyle.ACTIVE;
        const onClick = () => {
            if (this.props.isLastQuestion) {
                this.endQuiz();
            } else {
                this.props.changeTab(TAB_LEADERBOARD);
                this.props.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
            }
        };
        return this.renderControlButton(EmojiEvents, "Leader-", "board", style, onClick);
    }

    renderLookAtBrowserButton(phase) {
        const style = Phase.REVEALING === phase
            && !this.props.isLastQuestion
            && TAB_LOOK_DOWN !== this.props.questionTab
            ? ButtonStyle.ACTIVE
            : ButtonStyle.DISABLED;
        const onClick = () => this.props.changeTab(TAB_LOOK_DOWN);
        return this.renderControlButton(LookAtBrowser, "Look at", "browser", style, onClick);
    }

    renderNextButton(phase) {
        const style = Phase.GUESSING === phase ? ButtonStyle.DISABLED : ButtonStyle.ACTIVE;
        if (!this.props.isLastQuestion) {
            return this.renderControlButton(ArrowForward, "Next", "question", style, this.onNextButton);
        } else {
            return this.renderControlButton(ArrowForward, "Leader-", "board", style, this.endQuiz);
        }
    }

    endQuiz() {
        this.props.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
    }

    renderControlButtons(phase) {
        return (
            <div className="question-control-buttons">
                <ButtonGroup>
                    {this.renderStopRoundButton(phase)}
                </ButtonGroup>
                <ButtonGroup>
                    {this.renderAnswerStatsButton(phase)}
                    {this.renderRevealAnswerButton(phase)}
                    {this.renderLeaderboardButton(phase)}
                </ButtonGroup>
                <ButtonGroup>
                    {this.renderLookAtBrowserButton(phase)}
                    {this.renderNextButton(phase)}
                </ButtonGroup>
            </div>
        );
    }

    onStopButton() {
        this.stopTimer();
        this.props.nextButton();
    }

    onNextButton() {
        this.startTimer();
        this.props.nextButton();
    }

    renderQuestion(phase) {
        if (Phase.NOT_STARTED !== phase
            && this.props.questionTab !== TAB_LEADERBOARD
            && this.props.questionTab !== TAB_LOOK_DOWN) {
            return (
                <Container fluid>
                    {this.QuestionGrid()}
                </Container>
            );
        } else {
            return false;
        }
    }

    renderLeaderboard(phase) {
        if (Phase.NOT_STARTED !== phase && this.props.questionTab === TAB_LEADERBOARD) {
            return <RankTable data={this.props.generalRanking} />;
        } else {
            return false;
        }
    }

    renderLookDown(phase) {
        if (Phase.NOT_STARTED === phase || this.props.questionTab === TAB_LOOK_DOWN) {
            const index = Phase.NOT_STARTED === phase ? "first" : "next";
            return (
                <div style={{ fontSize: "1.25em" }}>
                    <div style={{ marginBottom: "2vh" }}>
                        Look at your browser or phone.
                    </div>
                    <div style={{ fontSize: "4em" }}>
                        <img src={LookAtBrowser} className="material-ui-icon" alt="Look at browser or phone" />
                    </div>
                    <div style={{ marginTop: "2vh", marginBottom: "2em" }}>
                        The {index} question is coming up...
                    </div>
                </div>
            );
        } else {
            return false;
        }
    }

    render() {
        const phase = this.getPhase();
        return (
            <CenterBox logo cancel="End quiz" closeRoomSignal renderJoinInfo {...this.props}>
                <div style={{ marginBottom: "2em" }}>
                    {this.renderQuestion(phase)}
                    {this.renderLeaderboard(phase)}
                    {this.renderLookDown(phase)}
                    {this.renderControlButtons(phase)}
                </div>
            </CenterBox>
        );
    }
}

export default Question;
