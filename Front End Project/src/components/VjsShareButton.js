import videojs from 'video.js';

/**
 * Share button placeholder component for Video-js player
 * @extends videojs.Button
 */
export class VjsShareButton extends videojs.getComponent('Button') {
    constructor(player, options) {
        super(player, options);
        this.addClass('vjs-share-button');
    }
}