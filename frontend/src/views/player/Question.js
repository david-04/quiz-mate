import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CenterBox from "../../components/CenterBox";
import RemoteTimer from "../../components/Timer/RemoteTimer";
import { answerSelected } from "../../connection/config";
import { V_WAITING } from "./views";
import { toLetter } from "../../utilities";

import "./Question.css";

class Question extends Component {

    answer(answer, index) {
        return (
            <Col md={6} sm={12} key={index}>
                <div className="player-answer" onClick={() => this.selectAnswer(index)}>
                    <div className="player-answer-letter">{toLetter(index)}</div>
                    {answer}
                </div>
            </Col>
        );
    }

    QuestionGrid = () => {
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <div className="player-question">
                            {this.props.question.question}
                        </div>
                    </Col>
                    {this.props.question.answers.map((answer, index) => this.answer(answer, index))}
                </Row>
            </div>
        );
    };

    selectAnswer = number => {
        if (this.props.question) {
            this.props.selected(number);
            this.props.socket.emit(
                answerSelected,
                this.props.game.roomCode,
                this.props.game.playerName,
                this.props.question.index,
                number
            );
            this.props.switchState(V_WAITING);
        }
    };

    render() {
        return (
            <CenterBox logo cancel="Exit" {...this.props}>
                <div className="message-box">
                    {this.props.game.hostingRoom.timeLimit > 0 && (
                        <RemoteTimer seconds={this.props.timer} />
                    )}
                    <br />
                    <Container fluid>
                        {this.props.question ? this.QuestionGrid() : false}
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default Question;
