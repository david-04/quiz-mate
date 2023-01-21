import React, { Component } from "react";
import { ButtonGroup, Col, Container, Row } from "react-bootstrap";
import CenterBox from "../../components/CenterBox";
import IconButton from "../../components/IconButton";
import LogicSwitch from "../../components/LogicSwitch";
import TimePicker from "../../components/TimePicker";
import { createNewRoom } from "../../connection/config";
import { onHostStartGame, installOnBeforeUnloadListener } from "../../utilities";
import { upliftAndValidate, SAMPLE_QUIZ } from "../../utilities/quiz-data";
import { v_waitingForCode } from "./views";

import Edit from "../../assets/icons/edit.svg";
import Publish from "../../assets/icons/publish.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";

import "../../assets/icons/material-ui-icon.css";
import "./Creating.css";

class Creating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            questions: [],
            timeLimit: 0,
            questionLimit: 0,
            randomOrder: false
        };
        this.inputFile = React.createRef();
    }

    shuffle = array => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    createRoom = () => {
        const data = {
            title: this.state.title.trim(),
            timeLimit: this.state.timeLimit,
            questionLimit: this.state.questionLimit,
            randomOrder: this.state.randomOrder
        };
        const q = this.state.questions.slice();
        if (this.state.randomOrder) {
            this.shuffle(q);
        }
        this.props.questionList(q);
        this.props.setHostingRoom(data);
        this.props.switchState(v_waitingForCode);
        this.props.socket.emit(createNewRoom, data);
    };

    uploadFile = () => {
        installOnBeforeUnloadListener();
        const fr = new FileReader();
        fr.onload = e => {
            try {
                const quiz = JSON.parse(e.target.result);
                this.startQuiz(quiz, this.inputFile.current.files.item(0).name);
            } catch (error) {
                this.setState({ questions: [], title: "" });
                const message = error instanceof Error ? error.message : `${error}`;
                alert(`Invalid file format: ${message}`);
            }
            this.inputFile.current.value = "";
        };
        if (this.inputFile.current.files.item(0)) {
            fr.readAsText(this.inputFile.current.files.item(0));
        }
    };

    startSampleQuiz = () => {
        this.startQuiz(SAMPLE_QUIZ);
    };

    startQuiz = (quiz, filename) => {
        try {
            quiz = upliftAndValidate(quiz, filename || "");
            onHostStartGame(quiz.title);
            this.setState({ questions: quiz.questions, title: quiz.title }, this.createRoom);
        } catch (error) {
            this.setState({ questions: [], title: "" });
            const message = error instanceof Error ? error.message : `${error}`;
            alert(`Invalid file format: ${message}`);
        }
    };

    render() {
        return (
            <div>
                <CenterBox logo cancel="Back" {...this.props} cancelIcon={ArrowBack} showGitHubLink>
                    <div className="message-box">
                        <form>
                            <Container>
                                <Row>
                                    <Col md={12} className="vcenter">
                                        <div>
                                            <TimePicker value={this.state.timeLimit}
                                                min={0} max={300} zeroText="No time limit"
                                                onChange={e => this.setState({ timeLimit: e })} />
                                            <div className="sort-order-buttons" style={{ marginTop: "2.5rem" }}>
                                                <LogicSwitch value={this.state.randomOrder}
                                                    offText="Ordered" onText="Shuffled"
                                                    onChange={e => this.setState({ randomOrder: e })} />
                                            </div>
                                            <div style={{ marginTop: "2.5rem" }}>
                                                <span
                                                    className="btn btn-file btn-warning"
                                                    style={{ fontSize: "1.0rem", width: "18rem" }}
                                                >
                                                    <img
                                                        src={Publish}
                                                        className="material-ui-icon"
                                                        style={{ filter: "none" }}
                                                        alt="Upload quiz"
                                                    /> Upload quiz
                                                    <input
                                                        type="file"
                                                        accept="application/json"
                                                        onChange={this.uploadFile}
                                                        ref={this.inputFile}
                                                    />
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: "0.5em",
                                                textAlign: "right",
                                                marginTop: "6em",
                                                marginBottom: "-6em"
                                            }}>
                                                ...or use this
                                                <button
                                                    onClick={() => this.startSampleQuiz()}
                                                    style={{
                                                        padding: "0.2em",
                                                        fontSize: "1em",
                                                        borderRadius: "0.3em",
                                                        border: "1px solid #ffffff88",
                                                        marginLeft: "0.4em",
                                                        paddingLeft: "0.2em",
                                                        paddingRight: "0.2em",
                                                        padding: "0",
                                                        backgroundColor: "#ffffff00",
                                                        color: "white"
                                                    }}
                                                >
                                                    sample quiz
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </form>
                    </div>
                    <ButtonGroup className="main-footer-btn">
                        <IconButton
                            icon={Edit}
                            label="Quiz editor"
                            buttonClassName="qm-fixed-bottom qm-fixed-left"
                            link="/editor"
                        />
                    </ButtonGroup>
                </CenterBox >
            </div>
        );
    }
}

export default Creating;
