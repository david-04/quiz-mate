import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Col, Row, ButtonGroup, ProgressBar} from "react-bootstrap";
import {t} from 'react-switch-lang';
import './Question.css'
import {
    answerStatsRequest,
    generalRankingRequest,
    timerSync
} from "../../connection/config";

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ViewListIcon from '@material-ui/icons/ViewList';
import PanToolIcon from '@material-ui/icons/PanTool';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import RankTable from "../../components/RankTable";
import Timer from '../../components/Timer';


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        };
        this.timer = React.createRef();
    }

    componentDidMount() {
        if(this.props.game.hostingRoom.timeLimit > 0) {
            this.timer.current.startTimer(this.props.game.hostingRoom.timeLimit);
        }
    }

    timerTrigger = () => {
        if(this.props.questionIsOpen) this.nextButton();
    };

    correctGreenBox = (answer) => {
        return(this.props.questionTab === 1 && this.props.question.correct === answer ? ' question-answer-correct' : '');
    };

    StatProgressBar = ({answer}) => {
        let value = 0;
        if(this.props.answerCount !== 0 && this.props.answerStats) {
            value = Math.round(this.props.answerStats[answer] * 100 / this.props.answerCount);
        }
        return(this.props.questionTab === 2 && <ProgressBar now={value} label={value + '%'} className={"question-progress"}/>);
    };

    timerTick = (value) => {
        this.props.socket.emit(timerSync, this.props.game.hostingRoom.roomCode, value);
    };

    QuestionGrid = () => {
        return(
            <div>
                <Row noGutters>
                    <Col md={{span: 4, order: 1}} sm={{span: 6, order: 2}} xs={{span: 6, order: 2}}>
                        <div className={"question-counter"}>
                            {t('host.questionNo')} {this.props.questionIndex+1}/{this.props.lastIndexNumber}
                        </div>
                    </Col>
                    <Col md={{span: 4, order: 2}} sm={{span: 12, order: 1}} xs={{span: 12, order: 1}}>
                        {this.props.game.hostingRoom.timeLimit > 0 &&
                        <Timer ref={this.timer} trigger={this.timerTrigger} tick={this.timerTick}/>
                        }
                    </Col>
                    <Col md={{span: 4, order: 3}} sm={{span: 6, order: 3}} xs={{span: 6, order: 3}}>
                        <div className={"question-answers-counter"}>
                            {t('host.answered')} {this.props.answerCount}
                        </div>
                    </Col>
                </Row>
                <Row noGutters>
                    <Col xs={12}>
                        <div className={"question-question"}>{this.props.question.question}</div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer" + this.correctGreenBox(0)}>
                            <div className={"question-answer-letter"}>A</div>
                            {this.props.question.answers[0]}
                            <this.StatProgressBar answer={0}/>
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer" + this.correctGreenBox(1)}>
                            <div className={"question-answer-letter"}>B</div>
                            {this.props.question.answers[1]}
                            <this.StatProgressBar answer={1}/>
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer" + this.correctGreenBox(2)}>
                            <div className={"question-answer-letter"}>C</div>
                            {this.props.question.answers[2]}
                            <this.StatProgressBar answer={2}/>
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer" + this.correctGreenBox(3)}>
                            <div className={"question-answer-letter"}>D</div>
                            {this.props.question.answers[3]}
                            <this.StatProgressBar answer={3}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    ControlButtons = () => {
        return(
            <div className={"question-control-buttons"}>
                <ButtonGroup>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen || this.props.questionTab === 1} onClick={() => {
                        this.props.changeTab(1)
                    }}>
                        <CheckBoxIcon fontSize={"large"}/><br/>{t('host.correct')}
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen || this.props.questionTab === 2} onClick={() => {
                        this.props.changeTab(2);
                        this.props.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
                    }}>
                        <AssessmentIcon fontSize={"large"}/><br/>{t('host.stats')}
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen || this.props.questionTab === 3} onClick={() => {
                        this.props.changeTab(3);
                        this.props.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
                    }}>
                        <ViewListIcon fontSize={"large"}/><br/>{t('host.ranking')}
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.isLastQuestion && !this.props.questionIsOpen} onClick={this.nextButton}>
                        {this.props.questionIsOpen ? <PanToolIcon fontSize={"large"}/> : <ArrowForwardIcon/>}
                        <br/>
                        {this.props.questionIsOpen ? t('host.stop') : t('host.next')}
                    </Button>
                </ButtonGroup>
            </div>
        );
    };

    nextButton = () => {
        if(this.props.game.hostingRoom.timeLimit > 0) {
            if(this.props.questionIsOpen) {
                this.timer.current.stopTimer();
            }else{
                this.timer.current.startTimer(this.props.game.hostingRoom.timeLimit);
            }
        }
        this.props.nextButton();
    };

    render() {
        return (
            <CenterBox logo cancel={t('general.finishQuiz')} closeRoomSignal roomHeader {...this.props}>
                <div className={"message-box"}>
                    <Container fluid style={this.props.questionTab === 3 ? {display: 'none'} : {}}>
                        <this.QuestionGrid/>
                    </Container>
                    {this.props.questionTab === 3 && <RankTable data={this.props.generalRanking}/>}
                </div>
                <div className={"question-control-offset"}/>
                <this.ControlButtons/>
            </CenterBox>
        );
    }
}

export default Question;