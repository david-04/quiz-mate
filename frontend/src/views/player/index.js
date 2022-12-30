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
import { v_final, v_loadingRoom, v_nicknameIsTaken, v_question, v_roomNotFound, v_waiting } from "./views";
import Waiting from "./Waiting";

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null,
            selectedAnswer: null,
            correctAnswer: null,
            timerValue: 0
        };
    }

    componentDidMount() {
        this.props.switchState(v_loadingRoom);
        if (this.props.game.roomCode && this.props.game.playerName) {

            this.socket = socketIOClient(server);

            this.socket.on('connect', () => {
                this.socket.emit(
                    addToRoom, this.props.game.roomCode, this.props.game.playerName, this.props.game.reconnectMode
                );
            });

            this.socket.on(nicknameIsTaken, () => {
                this.props.switchState(v_nicknameIsTaken);
                disableReconnectMode();
            });

            this.socket.on(roomNotFound, () => {
                this.props.switchState(v_roomNotFound);
                disableReconnectMode();
            });

            this.socket.on(joinedToRoom, roomObject => {
                this.props.setHostingRoom(roomObject);
                this.props.switchState(v_waiting);
                enableReconnectMode(this.props.game.roomCode, this.props.game.playerName);
            });

            this.socket.on(answersOpen, question => {
                this.setState({
                    question: question,
                    selectedAnswer: null,
                    correctAnswer: null,
                    timerValue: this.props.game.hostingRoom.timeLimit
                });
                this.props.switchState(v_question);
            });

            this.socket.on(answersClose, question => {
                this.setState({ question: question, correctAnswer: question.correct });
                this.props.switchState(v_waiting);
            });

            this.socket.on(timerSync, value => {
                this.setState({ timerValue: value });
            });

            this.socket.on(gameCompleted, stats => {
                this.setState({ stats: stats });
                this.props.switchState(v_final);
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

    selected = number => {
        this.setState({ selectedAnswer: number });
    };

    render() {
        switch (this.props.game.state) {
            case v_loadingRoom:
                return (<LoadingRoom {...this.props} />);
            case v_nicknameIsTaken:
                return (<NicknameIsTaken {...this.props} />);
            case v_roomNotFound:
                return (<RoomNotFound {...this.props} />);
            case v_waiting:
                document.title = this.props.game.hostingRoom.title || "Quiz Mate";
                return (<Waiting {...this.props}
                    question={this.state.question}
                    selectedAnswer={this.state.selectedAnswer}
                    correctAnswer={this.state.correctAnswer} />);
            case v_question:
                return (<Question {...this.props}
                    socket={this.socket}
                    question={this.state.question}
                    selected={this.selected}
                    timer={this.state.timerValue} />);
            case v_final:
                return (<Final {...this.props}
                    stats={this.state.stats} />);
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
