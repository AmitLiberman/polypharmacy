import React, { Component } from "react";
import "./InteractionResults.css";

class InteractionResults extends Component {
  render() {
    let results = [];
    const resultsLength = Object.keys(this.props.results).length;
    let safe_msg = "";

    if (resultsLength === 1 && this.props.results[0].comment === "safe") {
      safe_msg = <h3>לא נמצא אינטראקציה בין התרופות שהזנת</h3>;
      results.push(safe_msg);
      return <div>{results}</div>;
    }

    for (let index = 0; index < resultsLength; index++) {
      let severit = "";

      if (this.props.results[index].severity != null) {
        severit = <h6 className="highSeverity">High Risk</h6>;
      }
      if (this.props.results[index].error != null) {
        results.push(
          <h6>{this.props.results[index].error} לא נמצאה תרופה עם השם</h6>
        );
      } else {
        results.push(
          <div key={index} className="drugInteractionElement">
            <h5>
              {this.props.results[index].drug1_name}
              <span className="generic-drug-name">
                ({this.props.results[index].drug1_generic_name})
              </span>
              -{this.props.results[index].drug2_name}
              <span className="generic-drug-name">
                ({this.props.results[index].drug2_generic_name})
              </span>
            </h5>
            <h6 className="interaction-description">
              {this.props.results[index].description}
            </h6>
            {severit}
          </div>
        );
      }
    }

    return <div>{results}</div>;
  }
}

export default InteractionResults;