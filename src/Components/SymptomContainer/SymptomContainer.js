import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import "./SymptomContainer.css";
import symptomsJson from "./symptoms.json";

class SymptomContainer extends Component {
  state = {
    response: null,
    value: "",
    suggestions: [],
    loading: false,
    chooseSuggest: false,
    notInList: "alert-remedy-list fadeOut",
    alertMsg: "",
    severityValue: "",
    appearDateValue: "",
    found: false,
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : symptomsJson.filter((lang) =>
          lang.name.toLowerCase().includes(inputValue)
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = (suggestion) => {
    for (let index = 0; index < this.props.symptomList.length; index++) {
      if (this.props.symptomList[index].name === suggestion.name) {
        alert("התסמין שהזנת כבר קיים ברישמה");
        return "";
      }
    }
    this.setState({ chooseSuggest: true });
    this.props.getSymptomValue(suggestion.name, this.props.symptomItem.id);
    this.props.chooseSuggestChange(true);

    return suggestion.name;
  };

  componentDidMount = () => {
    for (let index = 0; index < this.props.symptomList.length; index++) {
      const drugId = this.props.symptomList[index].id;
      if (this.props.symptomItem.id === drugId) {
        this.setState({
          value: this.props.symptomList[index].name,
          severityValue: this.props.symptomList[index].severity,
          appearDateValue: this.props.symptomList[index].appearDate,
          found: true,
          chooseSuggest: true,
        });
        break;
      }
    }
  };

  // Use your imagination to render suggestions.
  renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
      chooseSuggest: false,
    });
    this.props.chooseSuggestChange(false);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onAppearDateChange = (event) => {
    this.props.getSymptomAppearDate(
      this.props.symptomItem.id,
      event.target.value
    );
    this.setState({ appearDateValue: event.target.value });
  };

  onSeverityChange = (event) => {
    this.props.getSymptomSeverity(
      this.props.symptomItem.id,
      event.target.value
    );
    this.setState({ severityValue: event.target.value });
  };

  //Change State to the drug name that typed
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  onClickX = () => {
    const { id } = this.props.symptomItem;
    this.props.onClickDelete(id, this.state.value);
    this.props.chooseSuggestChange(true);
  };
  render() {
    let value = "";

    value = this.state.value;
    const suggestions = this.state.suggestions;
    let appearDateValue = this.state.appearDateValue;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "בחר תסמין",
      value,
      onChange: this.onChange,
    };

    const notValidDrugMsg = (
      <h6 style={{ color: "red" }}>אנא בחר תסמין המרשימה * </h6>
    );
    return (
      <div className="remedy-element-container">
        <div className="delete-remedy-btn-wrapper">
          <button className="delete-remedy-btn" onClick={this.onClickX}>
            X
          </button>
        </div>
        <label className="step2-lable" htmlFor="drug-name">
          שם תסמין
        </label>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        {this.state.chooseSuggest ? null : notValidDrugMsg}

        <div className="severity-appeardate-container">
          <div className="date-wrapper">
            <div
              className="severity-container"
              onChange={(e) => this.onSeverityChange(e)}
            >
              <h5>חומרתה של תופעת הלוואי</h5>
              <label className="radio-option">
                חמורה
                <input
                  className="radio-input"
                  type="radio"
                  name="sever"
                  value="sever"
                  checked={this.state.severityValue === "sever"}
                />
              </label>
              <label className="radio-option">
                לא חמורה
                <input
                  className="radio-input"
                  type="radio"
                  name={"notSever" + this.props.symptomItem.id}
                  value="notSever"
                  checked={this.state.severityValue === "notSever"}
                />
              </label>
            </div>
            <div className="date-of-appear-container">
              <label className="date-lable" forhtml="appearDate">
                תאריך הופעת תסמין
              </label>
              <input
                className="date-input"
                type="date"
                id="appearDate"
                name={"appearDate" + this.props.symptomItem.id}
                value={appearDateValue}
                onChange={(e) => this.onAppearDateChange(e)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SymptomContainer;
