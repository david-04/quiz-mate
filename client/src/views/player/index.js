import React from 'react'
import socketIOClient from 'socket.io-client'
import {
    server,
    addToRoom,
    roomNotFound,
    nicknameIsTaken,
    joinedToRoom,
    answersOpen,
    answersClose,
    timerSync,
    gameCompleted
} from '../../connection/config'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import LoadingRoom from "./LoadingRoom";
import NicknameIsTaken from "./NicknameIsTaken";
import RoomNotFound from "./RoomNotFound";
import Waiting from "./Waiting";
import Question from "./Question";
import Final from "./Final";
import {disableReconnectMode, enableReconnectMode} from "../../connection/reconnect";
import {v_loadingRoom, v_nicknameIsTaken, v_roomNotFound, v_waiting, v_question, v_final} from './views'

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null,
            selectedAnswer: null,
            correctAnswer: null,
            timerValue: 0
        }
    }

    componentDidMount() {
        this.props.switchState(v_loadingRoom);
        if(this.props.game.roomCode && this.props.game.playerName) {

            this.socket = socketIOClient(server);

            this.socket.on('connect', () => {
                this.socket.emit(addToRoom, this.props.game.roomCode, this.props.game.playerName, this.props.game.reconnectMode);
            });

            this.socket.on(nicknameIsTaken, () => {
                this.props.switchState(v_nicknameIsTaken);
                disableReconnectMode();
            });

            this.socket.on(roomNotFound, () => {
                this.props.switchState(v_roomNotFound);
                disableReconnectMode();
            });

            this.socket.on(joinedToRoom, (roomObject) => {
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
                this.setState({question: question, correctAnswer: question.correct});
                this.props.switchState(v_waiting);
            });

            this.socket.on(timerSync, value => {
                this.setState({timerValue: value});
            });

            this.socket.on(gameCompleted, stats => {
                this.setState({stats: stats});
                this.props.switchState(v_final);
                disableReconnectMode();
            });

        }else{
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        if(this.socket) this.socket.disconnect();
    }

    selected = (number) => {
        this.setState({selectedAnswer: number});
    };

    render() {
        switch(this.props.game.state) {
            case v_loadingRoom:
                return(<LoadingRoom {...this.props}/>);
            case v_nicknameIsTaken:
                return(<NicknameIsTaken {...this.props}/>);
            case v_roomNotFound:
                return(<RoomNotFound {...this.props}/>);
            case v_waiting:
                return(<Waiting {...this.props}
                                selectedAnswer={this.state.selectedAnswer}
                                correctAnswer={this.state.correctAnswer}/>);
            case v_question:
                return(<Question {...this.props}
                                 socket={this.socket}
                                 question={this.state.question}
                                 selected={this.selected}
                                 timer={this.state.timerValue}/>);
            case v_final:
                return(<Final {...this.props}
                              stats={this.state.stats}/>);
            default:
                return(<span>NOT FOUND</span>);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setHostingRoom: (...args) => dispatch(setHostingRoomAC(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Player)