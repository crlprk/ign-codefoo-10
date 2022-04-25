import videojs from 'video.js';

/**
 * Autoplay toggle component for Video-js player
 * @param {function} toggleAutoplay event handler on button trigger
 * @extends videojs.Button
 */
export class VjsAutoplayToggle extends videojs.getComponent('Button') {
    constructor(player, options) {
        super(player, options);
        this.autoplayToggled = true;
        this.toggleAutoplay = options.toggleAutoplay;
        this.addClass('vjs-autoplay-toggle');
        this.addClass('vjs-autoplay-on');
        this.controlText('Autoplay On')
    }

    handleClick = () => {
        if (this.autoplayToggled) {
            this.autoplayToggled = false;
            this.removeClass('vjs-autoplay-on');
            this.addClass('vjs-autoplay-off');
            this.controlText('Autoplay Off')
            this.toggleAutoplay(this.autoplayToggled);
        }
        else {
            this.autoplayToggled = true;
            this.removeClass('vjs-autoplay-off');
            this.addClass('vjs-autoplay-on');
            this.controlText('Autoplay On')
            this.toggleAutoplay(this.autoplayToggled);
        }
    }
}