import React from 'react';
import { PlaylistItem } from './PlaylistItem';

/**
 * Playlist component
 * @param {number} index index of current playing video
 * @param {list} list list of videos in playlist
 * @param {function} onVideoClicked event handler on playlist item clicked
 * @extends React.Component
 */
export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxDisplayIndex: 4,
        }
        /**
         * Flag to check if current reload was triggered by video load
         */
        this.didLoadMore = false;
    }

    componentDidUpdate() {
        let maxDisplayIndex = this.state.maxDisplayIndex;

        // Checks if video changed, if so change display count of playlist to 4 items
        if (!this.didLoadMore) {
            maxDisplayIndex = this.props.index + 4;
        }

        // Checks if reached end of playlist count (320 for api(https://ign-apis.herokuapp.com/))
        if (maxDisplayIndex >= 319) {   // Hardcoded value of 320, can be changed to list.length for dynamic length playlists
            maxDisplayIndex = 319;
        }

        // Only updates state if any values changed
        if (maxDisplayIndex !== this.state.maxDisplayIndex) {
            this.setState({
                maxDisplayIndex: maxDisplayIndex,
            });
        }
        // Resets flag
        this.didLoadMore = false;
    }

    /**
     * Displays 4 more videos in playlist until max count reached
     */
    loadVideos = () => {
        // Checks if max count reached
        if (319 - (this.props.index + 5) < 4) {     // Hardcoded value of 320, can be changed to list.length for dynamic length playlists
            this.didLoadMore = true;
            this.setState({
                maxDisplayIndex: 319
            });
        }
        // Adds 4 to display count
        else {
            this.didLoadMore = true;
            this.setState({
                maxDisplayIndex: this.state.maxDisplayIndex + 4,
            });
        }
    }

    render() {
        // Adds current max display count of items to display to DOM
        const list = [];
        for (let i = this.props.index + 1; i < this.state.maxDisplayIndex + 1; i++) {
            list.push(
                <PlaylistItem key={this.props.list[i].contentId} index={i} thumbnails={this.props.list[i].thumbnails} metadata={this.props.list[i].metadata} onVideoClicked={this.props.onVideoClicked} />
            )
        }
        return (
            <div className="playlist-container">
                <ul className="playlist-body-container">
                    {list}
                </ul>
                {this.state.maxDisplayIndex === 319 &&  //Display "End of Playlist" if max count reached
                    <p className="EOL">End of Playlist</p>
                }
                {this.state.maxDisplayIndex !== 319 &&
                    <button className="playlist-load-button" onClick={() => this.loadVideos()}>Load More</button>
                }
            </div>
        );
    }
}