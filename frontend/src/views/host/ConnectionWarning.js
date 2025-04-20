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
                                            <h1>⚠️ Make sure that your internet connection doesn't drop</h1>
                                            <p>
                                                This browser tab must remain connected to the backend server until the
                                                quiz concludes. Even brief connection drops can cause the quiz to be
                                                aborted.
                                            </p>
                                            <p>
                                                Make sure that you have a stable internet connection and always keep
                                                this browser tab in the foreground. Switching to another tab for too
                                                long can prompt the browser to put this tab to sleep (and disconnect it
                                                from the server).
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
            </div >
        );
    }
}
