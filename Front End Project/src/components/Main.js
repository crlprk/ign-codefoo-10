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

            /*
                Due to the api not having a Access-Control-Allow-Origin header, CORS policy causes a failed fetch request without a proxy server of some sort. 
                Due to only developing a front end program and deploying to github pages, a temporary proxy server was used.
                In a real production environment, a self-hosted proxy server or backend server would replace the temporary server in the fetch request or the API server would be reconfigured
            */
            //requests.push(fetch("https://cors-anywhere.herokuapp.com/https://ign-apis.herokuapp.com/videos?startIndex=" + (20 * i) + "&count=20"));   // Temporary proxy server, uncomment before build
            requests.push(fetch("https://ign-apis.herokuapp.com/videos?startIndex=" + (20 * i) + "&count=20"));   // Alternative link if running in development mode
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