import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {t} from "react-switch-lang";

import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {returnLetter} from "../../utilities";

class Waiting extends Component {
    render() {
        if(this.props.selectedAnswer != null) {
            if(this.props.correctAnswer != null) {
                if(this.props.selectedAnswer === this.props.correctAnswer) {
                    return (
                        <CenterBox logo cancel={t('general.exit')} roomHeader {...this.props}>
                            <InsertEmoticonIcon style={{fontSize: '4.5em'}}/>
                            <div className={"message-box"}>
                                {t('player.correctAnswer')}
                            </div>
                        </CenterBox>
                    );
                }else{
                    return (
                        <CenterBox logo cancel={t('general.exit')} roomHeader {...this.props}>
                            <SentimentVeryDissatisfiedIcon style={{fontSize: '4.5em'}}/>
                            <div className={"message-box"}>
                                {t('player.badAnswer')}<br/><br/>
                                {t('player.badAnswerCorrect')} {returnLetter(this.props.correctAnswer)}
                            </div>
                        </CenterBox>
                    );
                }
            }else{
                return (
                    <CenterBox logo cancel={t('general.exit')} roomHeader {...this.props}>
                        <QueryBuilderIcon style={{fontSize: '4.5em'}}/>
                        <div className={"message-box"}>
                            {t('player.selectedAnswer')} {returnLetter(this.props.selectedAnswer)}<br/><br/>
                            {t('player.waitForEnd')}
                        </div>
                    </CenterBox>
                );
            }
        }else{
            return (
                <CenterBox logo cancel={t('general.exit')} roomHeader {...this.props}>
                    <CheckCircleOutlineIcon style={{fontSize: '4.5em'}}/>
                    <div className={"message-box"}>
                        {t('player.connected')}<br/>
                        "{this.props.game.hostingRoom.title}"<br/><br/>
                        {t('player.waitForHost')}
                    </div>
                </CenterBox>
            );
        }
    }
}

export default Waiting;