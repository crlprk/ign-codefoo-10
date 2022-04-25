import videojs from 'video.js';

/**
 * Title bar overlay component for Video-js player
 * @param {object} metadata metadata for first video in playlist
 */
export class VjsTitleBar extends videojs.getComponent('Component') {
    constructor(player, options) {
        super(player, options);
        this.changeTitle(options.metadata.title);
    }

    /**
     * Changes title bar text given a string title
     * @param {string} title title of currently playing video
     */
    changeTitle = (title) => {
        // References and changes this component's DOM element
        const el = this.el()
        el.className = 'vjs-title-bar';
        el.innerHTML = '<h1>' + title + '</h1>';
        this.controlText = title;
        this.addChild('shareButton');   // Readds share button to title bar due to changing innerHTML
    }
}