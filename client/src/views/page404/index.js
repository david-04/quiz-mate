import React from 'react'
import CenterBox from "../../components/CenterBox";
import {t} from 'react-switch-lang'

class Page404 extends React.Component {
    render() {
        return(
            <CenterBox logo cancel={t('general.return')} {...this.props}>
                <div className={"message-box"}>
                    <div style={{fontSize: '4em'}}>404</div>
                    {t('general.error404')}
                </div>
            </CenterBox>
        );
    }
}

export default Page404