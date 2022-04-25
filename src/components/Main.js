import React from 'react';
import { Playlist } from './Playlist';
import { MainContent } from './MainContent';
/**
 * Main content component, includes video play + description + playlist
 */
export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            videos: [],
            index: 0,
        };
    }

    componentDidMount() {
        // Loads all videos from api(https://ign-apis.herokuapp.com/) into playlist then displays
        const requests = [];
        for (let i = 0; i < 16; i++) {
            requests.push(fetch("/videos?startIndex=" + (20 * i) + "&count=20"));
        }
        Promise.all(requests)
            .then(res => Promise.all(res.map(r => r.json())))
            .then(
                (result) => {
                    let tmp = [];
                    for (let i = 0; i < 16; i++) {
                        tmp = tmp.concat(result[i].data);
                    }
                    this.setState({
                        isLoaded: true,
                        videos: this.state.videos.concat(tmp),
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    /**
     * Changes currently playing video given index
     * @param {number} index index of video to change to
     */
    changeVideo = (index) => {
        // Check if input is greater than max index
        if (index > 319) return;  // Hardcoded value of 320, can be changed to this.state.videos.index for dynamic length playlists
        this.setState({
            index: index,
        });
    }

    render() {
        // Checks if videos are loaded before displaying
        const { error, isLoaded, videos, index } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else if (!isLoaded) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div className="main-container">
                    <MainContent content={videos[index]} index={index} onVideoEnded={this.changeVideo} />
                    <Playlist list={videos} index={index} onVideoClicked={this.changeVideo} />
                </div>
            );
        }
    }
}