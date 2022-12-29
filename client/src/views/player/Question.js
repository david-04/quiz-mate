import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Container, Col, Row, Button} from 'react-bootstrap'
import {answerSelected} from "../../connection/config";
import RemoteTimer from "../../components/Timer/RemoteTimer";
import {t} from "react-switch-lang";
import {v_waiting} from "./views";
import './Question.css'

import answerA from '../../assets/answerA.svg';
import answerB from '../../assets/answerB.svg';
import answerC from '../../assets/answerC.svg';
import answerD from '../../assets/answerD.svg';

class Question extends Component {
    Keyboard = () => {
        return(
            <div>
                <Row noGutters>
                    <Col md={3} xs={6}>
                        <Button variant={"secondary"}
                                className={"keyboard-button keyboard-left-column"}
                                onClick={() => this.selectAnswer(0)}>
                            <img src={answerA} alt={"answer A"}/>
                        </Button>
                    </Col>
                    <Col md={3} xs={6}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(1)}>
                            <img src={answerB} alt={"answer B"}/>
                        </Button>
                    </Col>
                    <Col md={3} xs={6}>
                        <Button variant={"secondary"}
                                className={"keyboard-button keyboard-left-column"}
                                onClick={() => this.selectAnswer(2)}>
                            <img src={answerC} alt={"answer C"}/>
                        </Button>
                    </Col>
                    <Col md={3} xs={6}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(3)}>
                            <img src={answerD} alt={"answer D"}/>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    };

    selectAnswer = (number) => {
        if(this.props.question) {
            this.props.selected(number);
            this.props.socket.emit(answerSelected, this.props.game.roomCode, this.props.game.playerName, number);
            this.props.switchState(v_waiting);
        }
    };

    render() {
        return (
            <CenterBox logo cancel={t('general.exit')} roomHeader {...this.props}>
                <div className={"message-box"}>
                    {this.props.game.hostingRoom.timeLimit > 0 && <RemoteTimer seconds={this.props.timer}/>}
                    {t('player.chooseAnswer')}<br/>
                    <Container fluid>
                        <this.Keyboard/>
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default Question;