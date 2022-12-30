import QRCode from "qrcode.react";
import React, { Component } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import CenterBox from "../../components/CenterBox";
import IconButton from "../../components/IconButton";
import { client } from "../../connection/config";

import PlayCircleOutline from "../../assets/icons/play_circle_outline.svg";

import "./WaitingForStart.css";

class WaitingForStart extends Component {
    render() {
        // document.title = this.props.game.hostingRoom.title;
        return (
            <CenterBox logo cancel="Cancel the quiz" closeRoomSignal {...this.props}>
                <div style={{ position: "absolute", top: "0.35em", right: "0.5em" }}>
                    <Button variant="secondary" style={{ fontSize: "0.65em" }}>
                        {this.props.game.hostingRoom.title}
                    </Button>
                </div>
                <div className="message-box">
                    <Container>
                        <Row>
                            <Col md={4} sm={12}>
                            </Col>
                            <Col md={8} sm={12} style={{ textAlign: "left", marginBottom: "1em" }}>
                                {/* {this.props.game.hostingRoom.title} */}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4} sm={12}>
                                <div className="qr-code hide-qr" style={{ marginRight: "1em" }}>
                                    <QRCode value={`${client}/#/?code=${this.props.game.hostingRoom.roomCode}`}
                                        size={250}
                                        renderas='svg'
                                        includeMargin />
                                </div>
                                <br /><br />
                                {/* <div className="room-code">
                                    {`${client}/#/?code=${this.props.game.hostingRoom.roomCode}`}
                                </div> */}
                            </Col>
                            <Col md={8} sm={12} style={{ textAlign: "left" }}>
                                <p>{this.props.game.hostingRoom.title}</p>
                                <p className="code-block">{client}</p>
                                <p style={{ marginTop: "1.3em" }}>Access code:</p>
                                <p className="code-block">{this.props.game.hostingRoom.roomCode}</p>
                                <p style={{ marginTop: "1.3em" }}>Players: {this.props.connectedUsers}</p>
                                <IconButton
                                    icon={PlayCircleOutline}
                                    variant="warning"
                                    invert={false}
                                    label="Start the first question"
                                    onClick={() => this.props.nextQuestion(0)}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </CenterBox >
        );
    }
}

export default WaitingForStart;
