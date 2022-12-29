import React from 'react'
import {connect} from 'react-redux'
import {switchStateAC, setPlayerConfigAC} from '../../actions/game'
import {Row, Col, Container, Button, ButtonGroup, Form} from 'react-bootstrap'
import CenterBox from "../../components/CenterBox";
import {reconnectModeIsAvailable, getReconnectRoom, getReconnectPlayer} from '../../connection/reconnect'
import {t} from 'react-switch-lang'
import './main.css'

import logo from '../../assets/logo.svg'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PowerIcon from '@material-ui/icons/Power';
import LanguageSwitch from "../../components/LanguageSwitch";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: '',
            playerName: ''
        };
    }

    componentDidMount() {
        this.props.switchState('');
        this.props.setPlayerConfig('', '', false);
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code');
        if(code && !isNaN(code) && code.length === 6) {
            this.setState({roomCode: code});
        }
    }

    changeRoomCode = (e) => {
        let val = e.target.value;
        if(val.length > 6) val = val.substring(0, 6);
        this.setState({
            roomCode: val
        });
    };

    startGame = () => {
        if(this.state.roomCode !== '') {
            this.props.setPlayerConfig(this.state.roomCode, this.state.playerName, false);
            this.props.history.push('/player');
        }
    };

    reconnect = () => {
        this.props.setPlayerConfig(getReconnectRoom(), getReconnectPlayer(), true);
        this.props.history.push('/player');
    };

    render() {
        return (
            <CenterBox>
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <img src={logo} className={"main-logo-text"} alt={"quizario logo"}/>
                            <form>
                                <Form.Control type={"text"}
                                              value={this.state.playerName}
                                              onChange={(e) => this.setState({playerName: e.target.value})}
                                              placeholder={t('main.nickname')}
                                              maxLength={"40"}
                                              className={"main-textbox"}/>
                                <Form.Control type={"number"}
                                              value={this.state.roomCode}
                                              onChange={this.changeRoomCode}
                                              placeholder={t('main.accessCode')}
                                              className={"main-textbox"}/>
                                <Button type={"submit"}
                                        variant={"secondary"}
                                        onClick={this.startGame}
                                        disabled={this.state.roomCode.length !== 6 || this.state.playerName === ''}>
                                    <PlayCircleOutlineIcon/> {t('main.joinTheGame')}
                                </Button>

                                {reconnectModeIsAvailable() &&
                                <Button type={"submit"}
                                        variant={"warning"}
                                        onClick={this.reconnect} className={"reconnect-btn"}>
                                    <PowerIcon/> {t('main.reconnect')}
                                </Button>
                                }

                            </form>
                            <ButtonGroup className={"main-footer-btn"}>
                                <Button variant={"secondary"} onClick={() => this.props.history.push('/host')}>
                                    <AddCircleOutlineIcon fontSize={"large"}/><br/>
                                    {t('main.createNewGame')}
                                </Button>
                                <Button variant={"secondary"} onClick={() => this.props.history.push('/editor')}>
                                    <EditIcon fontSize={"large"}/><br/>
                                    {t('main.questionEditor')}
                                </Button>
                            </ButtonGroup>
                            <LanguageSwitch/>
                        </Col>
                    </Row>
                </Container>
            </CenterBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setPlayerConfig: (...args) => dispatch(setPlayerConfigAC(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main)