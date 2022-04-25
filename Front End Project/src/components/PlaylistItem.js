import React from "react";
import { Thumbnail } from './Thumbnail';

/**
 * Item component in a playlist. 
 * @param {number} index index of currently playing video
 * @param {object} metadata metadata of playlist item video
 * @param {function} onVideoClicked event handler on playlist item clicked
 * @extends React.Component
 */
export class PlaylistItem extends React.Component {
    /**
     * Changes video given index position of video
     * @param {number} index 
     */
    changeVideo = (index) => {
        this.props.onVideoClicked(index);
    }

    render() {
        return (
            <li className="playlist-item-container" onClick={() => this.changeVideo(this.props.index)}>
                <Thumbnail img={this.props.thumbnails} timestamp={this.props.metadata.duration} />
                <p className="playlist-item-title">{this.props.metadata.title}</p>
            </li>
        );
    }
}