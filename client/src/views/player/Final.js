import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {t} from "react-switch-lang";

import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

class Final extends Component {
    render() {
        if(!this.props.stats) return(<span/>);
        let stats = this.props.stats.slice();
        stats.sort((a, b) => {
            if(a.points < b.points) return 1;
            if(a.points > b.points) return -1;
            return 0;
        });
        let place = stats.findIndex(item => {
            return item.nickname === this.props.game.playerName;
        });
        if(place > -1) {
            let totalPoints = stats[place].points;
            place++; // 0 > 1, 1 > 2 etc.
            return (
                <CenterBox logo cancel={t('general.return')} roomHeader {...this.props}>
                    <AssignmentTurnedInIcon style={{fontSize: '4.5em'}}/>
                    <div className={"message-box"}>
                        {t('player.quizCompleted')}<br/><br/>
                        {t('player.totalPoints')}<br/>
                        {totalPoints}<br/>
                        <br/>
                        {t('player.place')}<br/>
                        {place}
                    </div>
                </CenterBox>
            );
        }else{
            return(<span/>);
        }
    }
}

export default Final;