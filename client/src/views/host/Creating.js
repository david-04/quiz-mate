import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Row, Col, Form} from "react-bootstrap";
import {createNewRoom} from "../../connection/config";
import './Creating.css';
import TimePicker from "../../components/TimePicker";
import NumberPicker from "../../components/NumberPicker";
import LogicSwitch from "../../components/LogicSwitch";
import {t} from 'react-switch-lang';

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import {validateJson} from "../../utilities";
import {v_waitingForCode} from "./views";

class Creating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            questions: [],
            timeLimit: 0,
            questionLimit: 0,
            randomOrder: false
        };
        this.inputFile = React.createRef();
    }

    shuffle = (array) => {
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
        let q = this.state.questions.slice();
        if(this.state.randomOrder) this.shuffle(q);
        this.props.questionList(q);
        this.props.setHostingRoom(data);
        this.props.switchState(v_waitingForCode);
        this.props.socket.emit(createNewRoom, data);
    };

    uploadFile = () => {
        let fr = new FileReader();
        fr.onload = (e) => {
            let output = null;
            try {
                output = JSON.parse(e.target.result);
                if(validateJson(output)) {
                    this.setState({
                        questions: output
                    });
                }else{
                    this.setState({
                        questions: []
                    });
                    alert(t('general.badFile'));
                }
            }catch(error) {
                this.setState({
                    questions: []
                });
                alert(t('general.badJSON'));
            }
            this.inputFile.current.value = "";
        };
        if(this.inputFile.current.files.item(0)) {
            fr.readAsText(this.inputFile.current.files.item(0));
        }
    };

    render() {
        return (
            <CenterBox logo cancel={t('general.return')} {...this.props}>
                <div className={"message-box"}>
                    <form>
                        <Container>
                            <Row>
                                <Col md={6} className={"vcenter"}>
                                    <div>
                                        <div className={"creating-label"}>{t('host.quizTitle')}</div>
                                        <Form.Control type={"text"}
                                                      value={this.state.title}
                                                      className={"creating-textbox"}
                                                      onChange={(e) => this.setState({title: e.target.value})}
                                                      maxLength={"30"}/>
                                        <div className={"creating-label"}>{t('host.questionDB')}</div>
                                        <span className={"btn btn-secondary btn-file"}>
                                            <PublishIcon/> {t('host.chooseFile')}
                                            <input type={"file"} accept={"application/json"} onChange={this.uploadFile} ref={this.inputFile}/>
                                        </span>
                                        <div className={"questions-info"}>
                                            {
                                                this.state.questions.length === 0
                                                ?
                                                    t('host.questionEmpty')
                                                    :
                                                    t('host.questionLoaded') + ' ' + this.state.questions.length
                                            }
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className={"vcenter"}>
                                    <div>
                                        <div className={"creating-label"}>{t('host.questionOrder')}</div>
                                        <LogicSwitch value={this.state.randomOrder}
                                                     offText={t('host.orderNormal')} onText={t('host.orderRandom')}
                                                     onChange={(e) => this.setState({randomOrder: e})}/>
                                        <div className={"creating-label"}>{t('host.timeLimit')}</div>
                                        <TimePicker value={this.state.timeLimit}
                                                    min={0} max={300} zeroText={t('host.offText')}
                                                    onChange={(e) => this.setState({timeLimit: e})}/>
                                        <div className={"creating-label"}>{t('host.questionLimit')}</div>
                                        <NumberPicker value={this.state.questionLimit}
                                                      min={0} max={500} zeroText={t('host.offText')}
                                                      onChange={(e) => this.setState({questionLimit: e})}/>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Button type={"submit"}
                                variant={"secondary"}
                                onClick={this.createRoom}
                                disabled={this.state.title.trim() === '' || this.state.questions.length === 0}
                                className={"creating-button"}>
                            <PlayCircleOutlineIcon/><br/>
                            {t('host.createRoom')}
                        </Button>
                    </form>
                </div>
            </CenterBox>
        );
    }
}

export default Creating;