import { Component } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";

import { setHostingRoomAC, switchStateAC } from "../../actions/game";
import {
    addToRoom,
    answersClose,
    answersOpen,
    gameCompleted,
    joinedToRoom,
    nicknameIsTaken,
    roomNotFound,
    server,
    timerSync
} from "../../connection/config";
import { disableReconnectMode, enableReconnectMode } from "../../connection/reconnect";
import Final from "./Final";
import LoadingRoom from "./LoadingRoom";
import NicknameIsTaken from "./NicknameIsTaken";
import Question from "./Question";
import RoomNotFound from "./RoomNotFound";
import { V_FINAL, V_LOADING_ROOM, V_NICKNAME_IS_TAKEN, V_QUESTION, V_ROOM_NOT_FOUND, V_WAITING } from "./views";
import Waiting from "./Waiting";
import { onPlayerJoinGame } from "../../utilities";

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: null,
            selectedAnswer: null,
            correctAnswer: null,
            timerValue: 0
        };
        this.selected = this.selected.bind(this);
    }

    componentDidMount() {
        this.props.switchState(V_LOADING_ROOM);
        if (this.props.game.roomCode && this.props.game.playerName) {

            this.socket = socketIOClient(server, { closeOnBeforeunload: false });

            this.socket.on('connect', () => this.socket.emit(
                addToRoom, this.props.game.roomCode, this.props.game.playerName, this.props.game.reconnectMode
            ));

            this.socket.on(nicknameIsTaken, () => {
                this.props.switchState(V_NICKNAME_IS_TAKEN);
                disableReconnectMode();
            });

            this.socket.on(roomNotFound, () => {
                this.props.switchState(V_ROOM_NOT_FOUND);
                disableReconnectMode();
            });

            this.socket.on(joinedToRoom, roomObject => {
                onPlayerJoinGame(roomObject.title);
                this.props.setHostingRoom(roomObject);
                this.props.switchState(V_WAITING);
                enableReconnectMode(this.props.game.roomCode, this.props.game.playerName);
            });

            this.socket.on(answersOpen, question => {
                this.setState({
                    question: question,
                    selectedAnswer: null,
                    correctAnswer: null,
                    timerValue: this.props.game.hostingRoom.timeLimit
                });
                this.props.switchState(V_QUESTION);
            });

            this.socket.on(answersClose, question => {
                this.setState({ question: question, correctAnswer: question.correct });
                this.props.switchState(V_WAITING);
            });

            this.socket.on(timerSync, value => this.setState({ timerValue: value }));

            this.socket.on(gameCompleted, stats => {
                this.setState({ stats: stats });
                this.props.switchState(V_FINAL);
                disableReconnectMode();
            });

        } else {
            this.props.navigate('/');
        }
    }

    componentWillUnmount() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    selected(selectedAnswer) {
        this.setState({ selectedAnswer });
    };

    render() {
        switch (this.props.game.state) {
            case V_LOADING_ROOM:
                return (<LoadingRoom {...this.props} />);
            case V_NICKNAME_IS_TAKEN:
                return (<NicknameIsTaken {...this.props} />);
            case V_ROOM_NOT_FOUND:
                return (<RoomNotFound {...this.props} />);
            case V_WAITING:
                return (
                    <Waiting {...this.props}
                        question={this.state.question}
                        selectedAnswer={this.state.selectedAnswer}
                        correctAnswer={this.state.correctAnswer}
                    />
                );
            case V_QUESTION:
                return (
                    <Question {...this.props}
                        socket={this.socket}
                        question={this.state.question}
                        selected={this.selected}
                        timer={this.state.timerValue}
                    />
                );
            case V_FINAL:
                return (<Final {...this.props} stats={this.state.stats} />);
            default:
                return (<span>NOT FOUND</span>);
        }
    }
}

const mapStateToProps = state => {
    return {
        game: state.game
    };
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setHostingRoom: (...args) => dispatch(setHostingRoomAC(...args))
});

const ConnectedPlayer = connect(mapStateToProps, mapDispatchToProps)(Player);

const ConnectedPlayerWithNavigate = props => (<ConnectedPlayer {...props} navigate={useNavigate()} />);

export default ConnectedPlayerWithNavigate;
