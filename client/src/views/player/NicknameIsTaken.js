import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {t} from "react-switch-lang";

import WarningIcon from '@material-ui/icons/Warning';

class NicknameIsTaken extends Component {
    render() {
        return (
            <CenterBox logo cancel={t('general.return')} {...this.props}>
                <WarningIcon style={{fontSize: '4.5em'}}/>
                <div className={"message-box"}>
                    {t('player.nickname')} "{this.props.game.playerName}" {t('player.isTaken')}
                </div>
            </CenterBox>
        );
    }
}

export default NicknameIsTaken;