import { Component } from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

import { setHostingRoomAC, switchStateAC } from "../../actions/game";
import {
    answerCountUpdate,
    answerStatsResponse,
    closeQuestion,
    gameCompleted,
    generalRankingResponse,
    newQuestion,
    roomCreated,
    server,
    userCountUpdate
} from "../../connection/config";
import Creating from "./Creating";
import Final from "./Final";
import Question, { TAB_ANSWER_STATS, TAB_LEADERBOARD, TAB_LOOK_DOWN, TAB_REVEAL_ANSWER } from "./Question";
import { V_CREATING, V_FINAL, V_QUESTION, V_WAITING_FOR_ROOM_CODE, V_WAITING_FOR_START } from "./views";
import WaitingForCode from "./WaitingForCode";
import WaitingForStart from "./WaitingForStart";

class Host extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectedUsers: 0,
            answerCount: 0,
            questions: [],
            questionIndex: -1,
            questionIsOpen: true,
            questionTab: 0,
            answerStats: null,
            generalRanking: null,
            revealAnswer: false,
            revealStats: false
        };
        this.onReceiveQuestions = this.onReceiveQuestions.bind(this);
        this.onStartQuiz = this.onStartQuiz.bind(this);
        this.nextButton = this.nextButton.bind(this);
    }

    componentDidMount() {
        this.props.switchState(V_CREATING);

        this.socket = socketIOClient(server, { closeOnBeforeunload: false });

        this.socket.on(roomCreated, code => {
            this.props.setHostingRoom({ ...this.props.game.hostingRoom, roomCode: code });
            this.props.switchState(V_WAITING_FOR_START);
        });

        this.socket.on(userCountUpdate, count => this.setState({ connectedUsers: count }));
        this.socket.on(answerCountUpdate, count => this.setState({ answerCount: count }));
        this.socket.on(answerStatsResponse, stats => this.setState({ answerStats: stats }));
        this.socket.on(generalRankingResponse, stats => this.setState({ generalRanking: stats }));

        this.socket.on(gameCompleted, stats => {
            this.setState({ generalRanking: stats });
            this.props.switchState(V_FINAL);
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    onReceiveQuestions(questions) {
        this.setState({ questions });
    }

    onStartQuiz() {
        this.nextQuestion(-1);
    }

    nextButton() {
        if (this.state.questionIsOpen && 0 <= this.state.questionIndex) {
            this.setState({ questionIsOpen: false });
            this.socket.emit(
                closeQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[this.state.questionIndex]
            );
        } else {
            this.nextQuestion(this.state.questionIndex + 1);
        }
    }

    nextQuestion(index) {
        this.setState({
            questionIndex: index,
            questionIsOpen: true,
            answerCount: 0,
            questionTab: 0,
            revealAnswer: false,
            revealStats: false
        }, () => {
            this.props.switchState(V_QUESTION);
            if (0 <= index) {
                this.socket.emit(
                    newQuestion, this.props.game.hostingRoom.roomCode, { index, ...this.state.questions[index] }
                );
            }
        });
    }

    isLastQuestion = () => this.state.questionIndex + 1 === this.lastIndexNumber();

    lastIndexNumber = () => {
        if (this.props.game.hostingRoom.questionLimit === 0) {
            return this.state.questions.length;
        } else {
            return Math.min(this.props.game.hostingRoom.questionLimit, this.state.questions.length);
        }
    };

    changeTab = tab => {
        switch (tab) {
            case TAB_REVEAL_ANSWER:
                this.setState({ questionTab: TAB_REVEAL_ANSWER, revealAnswer: true });
                break;
            case TAB_ANSWER_STATS:
                this.setState({ questionTab: TAB_ANSWER_STATS, answerStats: null, revealStats: true });
                break;
            case TAB_LEADERBOARD:
                this.setState({ questionTab: TAB_LEADERBOARD, generalRanking: null });
                break;
            case TAB_LOOK_DOWN:
                this.setState({ questionTab: TAB_LOOK_DOWN, generalRanking: null });
                break;
            default:
                this.setState({ questionTab: 0 });
        }
    };

    render() {
        switch (this.props.game.state) {
            case V_CREATING:
                return (<Creating {...this.props}
                    socket={this.socket}
                    questionList={this.onReceiveQuestions} />);
            case V_WAITING_FOR_ROOM_CODE:
                return (<WaitingForCode {...this.props} />);
            case V_WAITING_FOR_START:
                return (<WaitingForStart {...this.props}
                    socket={this.socket}
                    onStartQuiz={this.onStartQuiz}
                    connectedUsers={this.state.connectedUsers} />);
            case V_QUESTION:
                return (<Question {...this.props}
                    socket={this.socket}
                    answerCount={this.state.answerCount}
                    questionIndex={this.state.questionIndex}
                    connectedUsers={this.state.connectedUsers}
                    isLastQuestion={this.isLastQuestion()}
                    lastIndexNumber={this.lastIndexNumber()}
                    question={this.state.questions[this.state.questionIndex]}
                    questionIsOpen={this.state.questionIsOpen}
                    questionTab={this.state.questionTab}
                    changeTab={this.changeTab}
                    nextButton={this.nextButton}
                    answerStats={this.state.answerStats}
                    revealAnswer={this.state.revealAnswer}
                    revealStats={this.state.revealStats}
                    generalRanking={this.state.generalRanking} />);
            case V_FINAL:
                return (<Final {...this.props}
                    generalRanking={this.state.generalRanking} />);
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

export default connect(mapStateToProps, mapDispatchToProps)(Host);
