import React from 'react';
import videojs from 'video.js';
import { VjsTitleBar } from './VjsTitleBar';
import { VjsAutoplayToggle } from './VjsAutoplayToggle';
import { VjsShareButton } from './VjsShareButton';
import QualitySelector from '@silvermine/videojs-quality-selector';
QualitySelector(videojs);   //Setup for QualitySelector

/**
 * Video player component implementing Video-js for React
 * @param {object} videoJsOptions Video-js [options](https://videojs.com/guides/options/)
 * @param {object} metadata metadata for currently playing video
 * @param {number} index index of currently playing video
 * @param {function} onVideoEnded event handler on video playback end
 */
export class VideoPlayer extends React.Component {
    componentDidMount() {
        // Register custom components to Video-js
        videojs.registerComponent('autoplayToggle', VjsAutoplayToggle);
        videojs.registerComponent('titleBar', VjsTitleBar);
        videojs.registerComponent('shareButton', VjsShareButton);

        // Initialize player using videoJsOptions
        this.player = videojs(this.videoNode, this.props.videoJsOptions, () => {
            this.player.log('onPlayerReady', this);
        });

        // Assign on video reload event for quality selector
        this.player.on("play", this.onVideoReload);
        
        // Add custom components as children to player
        this.player.addChild('titleBar', { metadata: this.props.metadata });
        this.player.controlBar.addChild('autoplayToggle', {
            toggleAutoplay: this.toggleAutoplay
        }, 1);
        this.player.controlBar.addChild('qualitySelector', {}, 7);
        this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[0].label);     //Quality selector plugin cannot be referenced by name. Manual reference using children list format
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
    }

    componentDidUpdate() {
        // Changes currently playing video on render
        this.player.src(this.props.videoJsOptions.sources);
        this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[0].label);     //Quality selector plugin cannot be referenced by name. Manual reference using children list format
        this.player.poster(this.props.videoJsOptions.poster);
        this.player.autoplay(true);
    }

    /**
     * Handles quality selector and title bar video reload behavior
     */
    onVideoReload = () => {
        for (let i = 0; i < this.props.videoJsOptions.sources.length; i++) {
            if (this.props.videoJsOptions.sources[i].selected) {
                for (let j = 0; j < this.props.videoJsOptions.sources.length; j++) {
                    this.player.controlBar.children()[7].removeClass("vjs-" + this.props.videoJsOptions.sources[j].label);     //Quality selector plugin cannot be referenced by name. Manual reference using children list format
                }
                this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[i].label);     //Quality selector plugin cannot be referenced by name. Manual reference using children list format
            }
        }
        this.player.children()[11].changeTitle(this.props.metadata.title);
    }
    
    /**
     * Handles autoplay on video end
     */
    onVideoEnded = () => {
        this.props.onVideoEnded(this.props.index + 1);
    }

    /**
     * Handles event assignment on autoplay toggle
     * @param {boolean} bool autoplay toggle state
     */
    toggleAutoplay = (bool) => {
        if (bool) {
            this.player.on("ended", this.onVideoEnded);
        }
        else {
            this.player.off("ended", this.onVideoEnded);
        }
    }

    render() {
        return (
            <div className="video-player" data-vjs-player>
                <video ref={node => this.videoNode = node} className="vjs-ign video-js vjs-big-play-centered"></video>
            </div>
        );
    }
}