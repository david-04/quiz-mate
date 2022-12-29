import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Col, Row} from "react-bootstrap";
import {client} from "../../connection/config";
import {t} from 'react-switch-lang';
import './WaitingForStart.css'

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import QRCode from 'qrcode.react'

class WaitingForStart extends Component {
    render() {
        return (
            <CenterBox logo cancel={t('general.closeRoom')} closeRoomSignal {...this.props}>
                <div className={"message-box"}>
                    <Container>
                        <Row>
                            <Col md={8} sm={12}>
                                {t('host.goToAddress')}<br/>
                                <div className={"code-block"}>{client}</div>
                                {t('host.enterCode')}<br/>
                                <div className={"code-block"}>{this.props.game.hostingRoom.roomCode}</div>
                                <div className={"hide-qr"}>
                                    {t('host.scanQR')}
                                </div>
                                <br/>{t('host.connectedPlayers')} {this.props.connectedUsers}<br/>
                                <Button variant={"secondary"} onClick={() => {this.props.nextQuestion(0);}}
                                        className={"start-button"}>
                                    <PlayCircleOutlineIcon fontSize={"large"}/><br/>{t('host.startQuiz')}
                                </Button>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className={"qr-code hide-qr"}>
                                    <QRCode value={client + "/#/?code=" + this.props.game.hostingRoom.roomCode}
                                            size={250}
                                            renderas={'svg'}
                                            includeMargin/>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default WaitingForStart;