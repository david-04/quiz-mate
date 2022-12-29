import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {t} from "react-switch-lang";

import WarningIcon from '@material-ui/icons/Warning';

class RoomNotFound extends Component {
    render() {
        return (
            <CenterBox logo cancel={t('general.return')} {...this.props}>
                <WarningIcon style={{fontSize: '4.5em'}}/>
                <div className={"message-box"}>
                    {t('player.roomWithNumber')} {this.props.game.roomCode} {t('player.notFound')}
                </div>
            </CenterBox>
        );
    }
}

export default RoomNotFound;