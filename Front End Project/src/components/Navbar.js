import React from 'react';
import logo from '../svgs/ign-logo.svg';
import searchIcon from '../svgs/search.svg';
import chevronDown from '../svgs/chevron-down.svg';
import "./Navbar.css";

/**
 * Navbar Component for IGN-CodeFoo
 * @extends React.Component
 */
export class Navbar extends React.Component {
    render() {
        // Index to string mapping for Javascript.Date
        const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const date = new Date();

        // Formats date into Day, Month Date
        const dateFormatted = <h2 className="date">{dayNames[date.getDay()]},<br />{monthNames[date.getMonth()] + " " + date.getDate().toString()}</h2>
        return (
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