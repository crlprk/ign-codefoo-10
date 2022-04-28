import React from "react";
import "./ContentDescription.css";

/**
 * Description area component
 * @param {object} metadata metadata for currently playing video
 * @extends React.Component
 */
export class ContentDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDescriptionHidden: "description-hidden",
            showState: "Show more"
        }
    }

    /**
     * Toggles full description visibility 
     */
    showDescription = () => {
        if (this.state.isDescriptionHidden === "description-hidden") {
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
                <h1 className="video-title">{this.props.metadata.title}</h1>
                <p className={"video-description " + this.state.isDescriptionHidden} >{this.props.metadata.description}</p>
                <p className="show-toggle" onClick={() => this.showDescription()}>{this.state.showState}</p>
            </div>
        );
    }
}