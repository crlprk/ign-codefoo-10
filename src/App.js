import React from 'react';
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';
import 'video.js/dist/video-js.css';
import './App.css';
import './Videojs-ign.css';


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

export default App;
