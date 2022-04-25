import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { ContentDescription } from './ContentDescription';

/**
 * Primary player + description component
 * @param {number} index index of current video
 * @param {object} content current video and metadata from api(https://ign-apis.herokuapp.com/)
 * @param {function} onVideoEnded event handler on video end
 */
export class MainContent extends React.Component {
    render() {
        // Compiles all quality levels of current video into sources object
        const sources = []
        for (let i = this.props.content.assets.length - 1; i >= 0; i--) {
            sources.push({
                src: this.props.content.assets[i].url,
                type: 'video/mp4',
                label: this.props.content.assets[i].height + "P"
            })
        }
        // Videojs options with custom component tree
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            sources: sources,
            poster: this.props.content.thumbnails[this.props.content.thumbnails.length - 1].url,
            fluid: true,
            aspectRatio: '16:9',
            controlBar: {
                children: [
                    "playToggle",
                    "volumePanel",
                    "currentTimeDisplay",
                    "timeDivider",
                    "durationDisplay",
                    "progressControl",
                    "captionsButton",
                    "fullscreenToggle",
                    "pictureInPictureToggle"
                ]
            },
            title: this.props.content.metadata.title
        }
        return (
            <div className="main-content">
                <VideoPlayer videoJsOptions={videoJsOptions} metadata={this.props.content.metadata} index={this.props.index} onVideoEnded={this.props.onVideoEnded} />
                <ContentDescription metadata={this.props.content.metadata} />
            </div>
        );
    }
}