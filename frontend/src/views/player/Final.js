import { Component } from "react";

import CenterBox from "../../components/CenterBox";
import { comparePoints, formatSpeed } from "../../utilities";

import EmojiEvents from "../../assets/icons/emoji_events.svg";

import "../../assets/icons/material-ui-icon.css";

class Final extends Component {
    render() {
        if (!this.props.stats) {
            return (<span />);
        }
        const stats = this.props.stats.slice();
        stats.sort(comparePoints);
        const index = stats.findIndex(item => item.nickname === this.props.game.playerName);
        if (0 <= index) {
            const totalPoints = stats[index].points;
            const place = index + 1;
            const speed = formatSpeed(stats[index].duration, totalPoints);
            return (
                <CenterBox logo cancel="Return to menu" {...this.props}>
                    <img
                        src={EmojiEvents}
                        className="material-ui-icon"
                        style={{ fontSize: '4em' }}
                        alt="Quiz completed"
                    />
                    <div className="message-box">
                        <p>Quiz completed! Your place:</p>
                        <p style={{ fontSize: "3.5em", fontWeight: "bold" }}>{place}</p>
                        <p>
                            <span style={{ paddingRight: "1em" }}>Points: {totalPoints}</span>
                            <span>|</span>
                            <span style={{ paddingLeft: "1em", paddingRight: "1em" }}>Speed: {speed}</span>
                            <span>|</span>
                            <span style={{ paddingLeft: "1em" }}>Players: {this.props.stats.length}</span>
                        </p>
                    </div>
                </CenterBox >
            );
        } else {
            return (<span />);
        }
    }
}

export default Final;
