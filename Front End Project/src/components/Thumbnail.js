import React from 'react';

/**
 * Thumbnail component with image and timestamp. 
 * @param {object} img thumbnail sources from api(https://ign-apis.herokuapp.com/)
 * @param {number} timestamp duration of video in seconds
 * @extends React.Component
 */
export class Thumbnail extends React.Component {
    /**
     * Formats timestamp in HH:MM:SS given time in seconds
     * @param {string} timestampRaw timestamp in seconds
     * @returns {string} Timestamp formatted in HH:MM:SS
     */
    formatTimeStamp(timestampRaw) {
        let min = Math.floor(timestampRaw / 60);
        let hour = 0;
        if (min > 60) {
            hour = Math.floor(min / 60);
            min %= 60;
            if (min < 10) {
                min = "0" + min.toString();
            }
        }
        let sec = timestampRaw % 60;
        if (sec < 10) {
            sec = "0" + sec.toString();
        }
        let timeFormatted = min + ":" + sec;
        if (hour !== 0) {
            timeFormatted = hour + ":" + timeFormatted;
        }

        return timeFormatted;
    }

    render() {
        // Retrieves largest thumbnail image from api(https://ign-apis.herokuapp.com/)
        const img = this.props.img[2].url;
        const timeFormatted = this.formatTimeStamp(this.props.timestamp);
        
        return (
            <div className="thumbnail">
                <img className="img" src={img} alt="thumbnail" />
                <p className="timestamp">{timeFormatted}</p>
            </div>
        );
    }
}