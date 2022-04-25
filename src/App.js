import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';
import './Videojs-ign.css';
import logo from './svgs/ign-logo.svg';
import searchIcon from './svgs/search.svg';
import chevronDown from './svgs/chevron-down.svg';
import QualitySelector from '@silvermine/videojs-quality-selector';
QualitySelector(videojs);

class App extends React.Component
{
  render() {
    return (
      <div className="app">
        <Navbar />
        <Main />
      </div>
    );
  }
}

class Navbar extends React.Component
{
  render() {
    const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const date = new Date();
    const dateFormatted = <h2 className="date">{dayNames[date.getDay()]},<br/ >{monthNames[date.getMonth()] + " " + date.getDate().toString()}</h2>
    return(
      <div className="navbar">
        <div className="navbar-main">
          <div className="head">
            <img className="logo" src={logo} alt="IGN"></img>
            {dateFormatted}
          </div>
          <ul className="controls">
            <li><p>News</p></li>
            <li><p>Videos</p></li>
            <li><p>Reviews</p></li>
            <li><p>Shows</p></li>
            <li><p>Wikis</p></li>
            <li><div className="more-container">
              <p>More</p>
              <img className="chevron-down" src={chevronDown} alt="chevron-down"></img>
            </div></li>
            <li><img className="search-icon" src={searchIcon} alt="search icon"></img></li>
            <li><div className="profile"></div></li>
          </ul>
        </div>
        <div className="navbar-sub">
          <ul className="controls">
            <li><p>Kingdom Hearts III</p></li>
            <li><p>The Walking Dead</p></li>
            <li><p>God of War</p></li>
            <li><p>Marvel's The Avengers: Infinity War</p></li>
            <li><p>Super Troopers 2</p></li>
            <li><p>Marvel's The Defenders</p></li>
          </ul>
        </div>
      </div>
    );
  }
}

class Main extends React.Component
{
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

  changeVideo = (index) => {
    if (index > 319) return;
    this.setState({
      index: index,
    });
  }

  render() {
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

class MainContent extends React.Component
{
  render() {
    const sources = []
    for(let i = this.props.content.assets.length - 1; i >= 0; i--) {
      sources.push({
        src: this.props.content.assets[i].url,
        type: 'video/mp4',
        label: this.props.content.assets[i].height + "P"
      })
    }
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
      /*
        pause play
        autoplay
        volume
        quality selector
        cc
        fullscreen
        pip
      */
    }
    return (
      <div className="main-content">
        <VideoPlayer videoJsOptions={videoJsOptions} metadata={this.props.content.metadata} index={this.props.index} onVideoEnded={this.props.onVideoEnded}/>
        <ContentDescription metadata={this.props.content.metadata}/>
      </div>
    );
  }
}

class VideoPlayer extends React.Component
{
  componentDidMount() {
    videojs.registerComponent('autoplayToggle', VjsAutoplayToggle);
    videojs.registerComponent('titleBar', VjsTitleBar);
    videojs.registerComponent('shareButton', VjsShareButton);
    this.player = videojs(this.videoNode, this.props.videoJsOptions, () => {
      this.player.log('onPlayerReady', this);
    });
    this.player.on("play", this.onVideoReload);
    this.player.addChild('titleBar', {metadata: this.props.metadata});
    this.player.controlBar.addChild('autoplayToggle', {
      toggleAutoplay: this.toggleAutoplay
    }, 1);
    this.player.controlBar.addChild('qualitySelector', {}, 7);
    this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[0].label);
  }
  
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  componentDidUpdate() {
    
    this.player.src(this.props.videoJsOptions.sources);
    this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[0].label);
    this.player.poster(this.props.videoJsOptions.poster);
    this.player.autoplay(true);
  }

  onVideoReload = () => {
    for (let i = 0; i < this.props.videoJsOptions.sources.length; i++) {
      if (this.props.videoJsOptions.sources[i].selected) {
        for (let j = 0; j < this.props.videoJsOptions.sources.length; j++) {
          this.player.controlBar.children()[7].removeClass("vjs-" + this.props.videoJsOptions.sources[j].label);
        }
        this.player.controlBar.children()[7].addClass("vjs-" + this.props.videoJsOptions.sources[i].label);
      }
    }
    this.player.children()[11].changeTitle(this.props.metadata.title);
  }

  onVideoEnded = () => {
    this.props.onVideoEnded(this.props.index + 1);
  }

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

class VjsTitleBar extends videojs.getComponent('Component')
{
  constructor(player, options) {
    super(player, options);
    this.changeTitle(options.metadata.title);
  }

  changeTitle = (title) => {
    const el = this.el()
    el.className = 'vjs-title-bar';
    el.innerHTML = '<h1>' + title + '</h1>';
    this.controlText = title;
    this.addChild('shareButton');
  }
}

class VjsShareButton extends videojs.getComponent('Button')
{
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-share-button');
  }
}

class VjsAutoplayToggle extends videojs.getComponent('Button') 
{
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

class ContentDescription extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isDescriptionHidden: "description-hidden",
      showState: "Show more"
    }
  }
  showDescription = () => {
    if (this.state.isDescriptionHidden === "description-hidden")
    {
      this.setState({
        isDescriptionHidden: "description-shown",
        showState: "Show less"
      })
    }
    else {
      this.setState({
        isDescriptionHidden: "description-hidden",
        showState: "Show more"
      })
    }
  }

  render() {
    return (
      <div className="content-description">
        <h1 className="content-description-video-title">{this.props.metadata.title}</h1>    
        <p className={"content-description-video-description " + this.state.isDescriptionHidden} >{this.props.metadata.description}</p>
        <p className="show-toggle" onClick={() => this.showDescription()}>{this.state.showState}</p>
      </div>
    );
  }
}

class Playlist extends React.Component
{
  //Maxdisplaycount
  constructor(props) {
    super(props);
    this.state = {
      maxDisplayIndex: 4,
    }
    this.didLoadMore = false;
  }

  componentDidUpdate() {
    let maxDisplayIndex = this.state.maxDisplayIndex;
    if (!this.didLoadMore) {
      maxDisplayIndex = this.props.index + 4;
    }
    if (maxDisplayIndex >= 319) { 
      maxDisplayIndex = 319;
    }
    if (maxDisplayIndex !== this.state.maxDisplayIndex) {
      this.setState({
        maxDisplayIndex: maxDisplayIndex,
      });
    }
    this.didLoadMore = false;
  }
  
  loadVideos = () => {
    if (319 - (this.props.index + 5) < 4) {
      this.didLoadMore = true;
      this.setState({
        maxDisplayIndex: 319
      });
    }
    else {
      this.didLoadMore = true;
      this.setState({
        maxDisplayIndex: this.state.maxDisplayIndex + 4,
      });
    } 
  }

  render() {
    const list = [];
    for (let i = this.props.index + 1; i < this.state.maxDisplayIndex + 1; i++) {
      list.push(
        <PlaylistItem key={this.props.list[i].contentId} index={i} thumbnails={this.props.list[i].thumbnails} metadata={this.props.list[i].metadata} onVideoClicked={this.props.onVideoClicked}/>
      )
    }
    return (
      <div className="playlist-container">
        <ul className="playlist-body-container">
          {list}
        </ul>
        {this.state.maxDisplayIndex === 319 &&
          <p className="EOL">End of Playlist</p>
        }
        {this.state.maxDisplayIndex !== 319 &&
          <button className="playlist-load-button" onClick={() => this.loadVideos()}>Load More</button>
        } 
      </div>
    );
  }
}

class PlaylistItem extends React.Component
{
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

class Thumbnail extends React.Component
{
  render() {
    
    let img = null;
    img = this.props.img[2].url;
    
    let min = Math.floor(this.props.timestamp / 60);
    let hour = 0;
    if (min > 60) {
      hour = Math.floor(min / 60);
      min %= 60;
      if (min < 10) {
        min = "0" + min.toString();
      }
    } 
    let sec = this.props.timestamp % 60;
    if (sec < 10) {
      sec = "0" + sec.toString();
    }
    let timeFormatted = min + ":" + sec;
    if (hour !== 0) {
      timeFormatted = hour + ":" + timeFormatted;
    }
    return (
      <div className="thumbnail">
        <img className="thumbnail-img" src={img} alt="thumbnail"/>
        <p className="thumbnail-timestamp">{timeFormatted}</p>
      </div>
    );
  }
}


export default App;
