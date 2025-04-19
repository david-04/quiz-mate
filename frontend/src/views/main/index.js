import { Component, createRef } from "react";
import { ButtonGroup, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlayerConfigAC, switchStateAC } from "../../actions/game";
import Edit from "../../assets/icons/edit.svg";
import EmojiPeople from "../../assets/icons/emoji_people.svg";
import "../../assets/icons/material-ui-icon.css";
import Power from "../../assets/icons/power.svg";
import PresentToAll from "../../assets/icons/present_to_all.svg";
import logo from "../../assets/logo.svg";
import CenterBox from "../../components/CenterBox";
import IconButton from "../../components/IconButton";
import { getReconnectPlayer, getReconnectRoom, reconnectModeIsAvailable } from "../../connection/reconnect";
import { installOnBeforeUnloadListener, isValidRoomCode, onExitGame } from "../../utilities";
import "./main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            playerName: "",
        };
        this.userNameReference = createRef();
        this.roomCodeReference = createRef();
        this.onInputFieldKeyEvent = this.onInputFieldKeyEvent.bind(this);
        this.reconnect = this.reconnect.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.startGame = this.startGame.bind(this);
        this.changeRoomCode = this.changeRoomCode.bind(this);
    }

    componentDidMount() {
        onExitGame();
        this.props.switchState("");
        this.props.setPlayerConfig("", "", false);
        if (isValidRoomCode(this.props.roomCode)) {
            this.setState({ roomCode: `${this.props.roomCode}` }, () => this.focusOnInput());
        } else {
            this.focusOnInput();
        }
    }

    onNameChanged(event) {
        this.setState({ playerName: event.target.value });
    }

    focusOnInput() {
        if (!this.state.playerName) {
            this.userNameReference.current.focus();
        } else if (!this.state.roomCode) {
            this.roomCodeReference.current.focus();
        }
    }

    onInputFieldKeyEvent(event) {
        installOnBeforeUnloadListener();
        if (event.key === "Enter" && isValidRoomCode(this.state.roomCode) && this.state.playerName.trim()) {
            this.startGame();
        }
    }

    changeRoomCode(event) {
        this.setState({ roomCode: event.target.value });
    }

    startGame() {
        if (this.state.roomCode !== "") {
            installOnBeforeUnloadListener();
            this.props.setPlayerConfig(
                this.state.roomCode,
                this.state.playerName,
                false
            );
            this.props.navigate("/player");
        }
    }

    reconnect() {
        installOnBeforeUnloadListener();
        this.props.setPlayerConfig(getReconnectRoom(), getReconnectPlayer(), true);
        this.props.navigate("/player");
    }

    render() {
        return (
            <CenterBox showGitHubLink>
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
                                            onClick={this.reconnect}
                                        />
                                    </div>
                                )}
                                <Form.Control
                                    type="text"
                                    value={this.state.playerName}
                                    onChange={this.onNameChanged}
                                    placeholder="Name"
                                    ref={this.userNameReference}
                                    onKeyPress={this.onInputFieldKeyEvent}
                                    maxLength="40"
                                    className="main-input-field equal-width"
                                />
                                <Form.Control
                                    type="number"
                                    value={this.state.roomCode}
                                    onChange={this.changeRoomCode}
                                    ref={this.roomCodeReference}
                                    onKeyPress={this.onInputFieldKeyEvent}
                                    placeholder="6-digit access code"
                                    className="main-input-field equal-width"
                                />
                                <IconButton
                                    disabled={!isValidRoomCode(this.state.roomCode) || !this.state.playerName.trim()}
                                    icon={EmojiPeople}
                                    variant="warning"
                                    label="Join"
                                    buttonClassName="equal-width"
                                    buttonStyle={{ width: "100%", maxWidth: "18rem" }}
                                    onClick={this.startGame}
                                />
                            </form>

                            <ButtonGroup className="main-footer-btn">
                                <IconButton
                                    link="/editor"
                                    icon={Edit}
                                    label="Quiz editor"
                                    buttonClassName="qm-fixed-bottom qm-fixed-left"
                                />
                                <span style={{ padding: "0.25rem" }}>{" "}</span>
                                <IconButton
                                    link="/host"
                                    icon={PresentToAll}
                                    label="Host a quiz"
                                    buttonClassName="qm-fixed-bottom qm-fixed-left"
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
