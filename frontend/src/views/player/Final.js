import { Component } from "react";
import CenterBox from "../../components/CenterBox";
import { sortByPoints, formatSpeed } from "../../utilities";

import EmojiEvents from "../../assets/icons/emoji_events.svg";

import "../../assets/icons/material-ui-icon.css";

class Final extends Component {
    render() {
        if (!this.props.stats) {
            return (<span />);
        }
        const stats = this.props.stats.slice();
        stats.sort(sortByPoints);
        const index = stats.findIndex(item => item.nickname === this.props.game.playerName);
        if (0 <= index) {
            const totalPoints = stats[index].points;
            const place = index + 1;
            const speed = formatSpeed(stats[index].duration, totalPoints);
            return (
                <CenterBox logo cancel="Return to menu" roomHeader {...this.props}>
                    <img
                        src={EmojiEvents}
                        className="material-ui-icon"
                        style={{ fontSize: '4em' }}
                        alt="Quiz completed"
                    />
                    <div className="message-box">
                        <p>Quiz completed! Your place:</p>
                        <p style={{ fontSize: "3.5em", fontWeight: "bold" }}>{place}</p>
                        <p>Total points: {totalPoints}</p>
                        <p>Speed: {speed}</p>
                        <p>Number of players: {this.props.stats.length}</p>
                    </div>
                </CenterBox >
            );
        } else {
            return (<span />);
        }
    }
}

export default Final;