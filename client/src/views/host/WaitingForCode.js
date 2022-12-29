import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {t} from 'react-switch-lang';

class WaitingForCode extends Component {
    render() {
        return (
            <CenterBox logo cancel={t('general.cancel')} {...this.props}>
                <div className={"message-box"}>
                    {t('host.connecting')}
                </div>
            </CenterBox>
        );
    }
}

export default WaitingForCode;