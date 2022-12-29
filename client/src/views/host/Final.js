import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import RankTable from "../../components/RankTable";
import {t} from 'react-switch-lang';

class Final extends Component {
    render() {
        return (
            <CenterBox logo cancel={t('general.return')} {...this.props}>
                <div className={"message-box"}>
                    <div style={{marginBottom: '20px'}}>{t('host.quizResults')} "{this.props.game.hostingRoom.title}":</div>
                    <RankTable data={this.props.generalRanking} showHeader/>
                </div>
            </CenterBox>
        );
    }
}

export default Final;