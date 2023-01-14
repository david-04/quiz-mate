import QRCode from "qrcode.react";
import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CenterBox from "../../components/CenterBox";
import IconButton from "../../components/IconButton";
import CopyButton from "../../components/CopyButton";
import { getServerUrl } from "../../utilities";

import PlayCircleOutline from "../../assets/icons/play_circle_outline.svg";

import "./WaitingForStart.css";

class WaitingForStart extends Component {

    render() {
        return (
            <CenterBox logo cancel="Cancel the quiz" closeRoomSignal {...this.props}>
                <div className="message-box">
                    <Container>
                        <Row>
                            <Col sm={0} md={0} lg={2} >
                            </Col>
                            <Col sm={12} md={12} lg={8} >
                                <div className="qm-join-info">
                                    <div className="qm-join-info-quiz-title">
                                        Join {
                                            this.props.game.hostingRoom.title
                                                ? `"${this.props.game.hostingRoom.title}"`
                                                : "the quiz"
                                        } at
                                    </div>
                                    <div className="qm-join-info-url-and-copy-button qm-join-info-spacing-top">
                                        <div className="qm-join-info-url qm-join-info-highlight">
                                            <div>
                                                {getServerUrl()}
                                            </div>
                                        </div>
                                        <div className="qm-join-info-copy-button">
                                            <CopyButton text={getServerUrl(this.props.game.hostingRoom.roomCode)} />
                                        </div>
                                    </div>
                                    <div className="qm-join-info-details qm-join-info-spacing-top">
                                        <div className="qm-join-info-text-details qm-join-info-filler">
                                            <div>
                                                Code:
                                            </div>
                                            <div className="qm-join-info-room-code-container qm-join-info-spacing-top">
                                                <div className="qm-join-info-room-code qm-join-info-highlight">
                                                    {this.props.game.hostingRoom.roomCode}
                                                </div>
                                                <div className="qm-join-info-filler"></div>
                                            </div>
                                            <div className="qm-join-info-filler">
                                            </div>
                                            <div className="qm-join-info-space-above">
                                                Players: {this.props.connectedUsers}
                                            </div>
                                            <div className="qm-join-info-spacing-top">
                                                <IconButton
                                                    icon={PlayCircleOutline}
                                                    variant="warning"
                                                    label="Start the quiz"
                                                    labelStyle={{ fontSize: "1.2em" }}
                                                    onClick={() => this.props.nextQuestion(0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="qm-join-info-qr-code">
                                            <QRCode value={this.getUrlWithRoomCode}
                                                size={1080}
                                                renderas='svg'
                                                includeMargin
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={0} md={0} lg={2} >
                            </Col>
                        </Row>
                    </Container>
                </div>
            </CenterBox >
        );
    }
}

export default WaitingForStart;
