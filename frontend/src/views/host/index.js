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
import Question, { TAB_ANSWER_STATS, TAB_LEADERBOARD, TAB_REVEAL_ANSWER } from "./Question";
import { v_creating, v_final, v_question, v_waitingForCode, v_waitingForStart } from "./views";
import WaitingForCode from "./WaitingForCode";
import WaitingForStart from "./WaitingForStart";

class Host extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedUsers: 0,
            answerCount: 0,
            questions: [],
            questionIndex: 0,
            questionIsOpen: true,
            questionTab: 0,
            answerStats: null,
            generalRanking: null,
            revealAnswer: false,
            revealStats: false
        };
    }

    componentDidMount() {
        this.props.switchState(v_creating);

        this.socket = socketIOClient(server);

        this.socket.on(roomCreated, code => {
            this.props.setHostingRoom({ ...this.props.game.hostingRoom, roomCode: code });
            this.props.switchState(v_waitingForStart);
        });

        this.socket.on(userCountUpdate, count => this.setState({ connectedUsers: count }));
        this.socket.on(answerCountUpdate, count => this.setState({ answerCount: count }));
        this.socket.on(answerStatsResponse, stats => this.setState({ answerStats: stats }));
        this.socket.on(generalRankingResponse, stats => this.setState({ generalRanking: stats }));

        this.socket.on(gameCompleted, stats => {
            this.setState({ generalRanking: stats });
            this.props.switchState(v_final);
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    nextButton = () => {
        if (this.state.questionIsOpen) {
            this.setState({ questionIsOpen: false });
            this.socket.emit(
                closeQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[this.state.questionIndex]
            );
        } else {
            this.nextQuestion(this.state.questionIndex + 1);
        }
    };

    nextQuestion = index => {
        this.setState({
            questionIndex: index,
            questionIsOpen: true,
            answerCount: 0,
            questionTab: 0,
            revealAnswer: false,
            revealStats: false
        });
        this.props.switchState(v_question);
        this.socket.emit(newQuestion, this.props.game.hostingRoom.roomCode, { index, ...this.state.questions[index] });
    };

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
                this.setState({ questionTab: 1, revealAnswer: true });
                break;
            case TAB_ANSWER_STATS:
                this.setState({ questionTab: 2, answerStats: null, revealStats: true });
                break;
            case TAB_LEADERBOARD:
                this.setState({ questionTab: 3, generalRanking: null });
                break;
            default:
                this.setState({ questionTab: 0 });
        }
    };

    render() {
        switch (this.props.game.state) {
            case v_creating:
                return (<Creating {...this.props}
                    socket={this.socket}
                    questionList={q => this.setState({ questions: q })} />);
            case v_waitingForCode:
                return (<WaitingForCode {...this.props} />);
            case v_waitingForStart:
                return (<WaitingForStart {...this.props}
                    socket={this.socket}
                    nextQuestion={i => this.nextQuestion(i)}
                    connectedUsers={this.state.connectedUsers} />);
            case v_question:
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
            case v_final:
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
