import { Component } from "react";
import { ButtonGroup, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlayerConfigAC, switchStateAC } from "../../actions/game";
import CenterBox from "../../components/CenterBox";
import IconButton from "../../components/IconButton";
import { getReconnectPlayer, getReconnectRoom, reconnectModeIsAvailable } from "../../connection/reconnect";
import { isValidRoomCode } from "../../utilities";

import EmojiPeople from "../../assets/icons/emoji_people.svg";
import Power from "../../assets/icons/power.svg";
import PresentToAll from "../../assets/icons/present_to_all.svg";
import logo from "../../assets/logo.svg";

import "../../assets/icons/material-ui-icon.css";
import "./main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            playerName: "",
        };
    }

    componentDidMount() {
        this.props.switchState("");
        this.props.setPlayerConfig("", "", false);
        if (isValidRoomCode(this.props.roomCode)) {
            this.setState({ roomCode: `${this.props.roomCode}` });
        }
    }

    changeRoomCode = event => this.setState({ roomCode: event.target.value });

    startGame = () => {
        if (this.state.roomCode !== "") {
            this.props.setPlayerConfig(
                this.state.roomCode,
                this.state.playerName,
                false
            );
            this.props.navigate("/player");
        }
    };

    reconnect = () => {
        this.props.setPlayerConfig(getReconnectRoom(), getReconnectPlayer(), true);
        this.props.navigate("/player");
    };

    render() {
        document.title = "Quiz Mate";
        return (
            <CenterBox>
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <img
                                src={logo}
                                className="main-logo-text equal-width"
                                alt="Quiz mate"
                            />
                            <form>
                                {reconnectModeIsAvailable() && (
                                    <div>
                                        <br />
                                        <IconButton
                                            variant="warning"
                                            buttonClassName="reconnect-btn equal-width"
                                            buttonStyle={{ width: "100%", maxWidth: "18rem" }}
                                            icon={Power}
                                            label="Rejoin previous game"
                                            invert={false}
                                            onClick={() => this.reconnect()}
                                        />
                                    </div>
                                )}
                                <Form.Control
                                    type="text"
                                    value={this.state.playerName}
                                    onChange={e => this.setState({ playerName: e.target.value })}
                                    placeholder="Name"
                                    maxLength="40"
                                    className="main-input-field equal-width"
                                />
                                <Form.Control
                                    type="number"
                                    value={this.state.roomCode}
                                    onChange={this.changeRoomCode}
                                    placeholder="6-digit access code"
                                    className="main-input-field equal-width"
                                />
                                <IconButton
                                    disabled={!isValidRoomCode(this.state.roomCode) || !this.state.playerName.trim()}
                                    icon={EmojiPeople}
                                    variant="warning"
                                    invert={false}
                                    label="Join"
                                    buttonClassName="equal-width"
                                    buttonStyle={{ width: "100%", maxWidth: "18rem" }}
                                    onClick={() => this.startGame()}
                                />
                            </form>
                            <ButtonGroup className="main-footer-btn">
                                <IconButton
                                    link="/host"
                                    icon={PresentToAll}
                                    label="Host a quiz"
                                    buttonClassNames="qm-fixed-bottom qm-fixed-left"
                                />
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Container>
            </CenterBox>
        );
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
    };
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setPlayerConfig: (...args) => dispatch(setPlayerConfigAC(...args)),
});

const ConnectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);

const ConnectedMainWithNavigate = props => (<ConnectedMain {...props} navigate={useNavigate()} />);

export default ConnectedMainWithNavigate;
