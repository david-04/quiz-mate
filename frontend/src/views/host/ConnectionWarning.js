import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../../assets/icons/material-ui-icon.css";
import CenterBox from "../../components/CenterBox";
import "./ConnectionWarning.css";

export class ConnectionWarning extends Component {

    render() {
        return (
            <div>
                <CenterBox logo cancel="Cancel" {...this.props} showGitHubLink>
                    <div className="message-box">
                        <form>
                            <Container>
                                <Row>
                                    <Col md={12} className="vcenter">
                                        <div className="connection-warning">
                                            <h1>⚠️ Make sure that your internet connection does not drop</h1>
                                            <p>
                                                This browser tab must remain connected to the backend server until the
                                                quiz concludes. Even if the connection drops only briefly, the quiz will
                                                be aborted and can't be resumed.
                                            </p>
                                            <p>
                                                Make sure that you have a stable
                                                internet connection and keep this browser tab in the foreground at all
                                                times. If you switch to another tab for too long, your browser might put
                                                this one to sleep. This causes the connection to drop as well.
                                            </p>
                                            <Button variant="warning"
                                                onClick={this.props.onConfirmed}
                                                style={{ width: "100%" }}>
                                                Proceed
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="vcenter">
                                    </Col>
                                </Row>
                            </Container>
                        </form>
                    </div>
                </CenterBox >
            </div>
        );
    }
}
