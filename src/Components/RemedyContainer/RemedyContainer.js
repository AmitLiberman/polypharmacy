import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import "./RemedyContainer.css";
import { alignPropType } from "react-bootstrap/esm/DropdownMenu";

class RemedyContainer extends Component {
  state = {
    response: null,
    value: "",
    suggestions: [],
    drugSuggestions: [],
    loading: false,
    chooseSuggest: false,
    notInList: "alert-remedy-list fadeOut",
    alertMsg: "",
    stam: 0,
  };
  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : this.state.drugSuggestions.filter(
          (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = (suggestion) => {
    this.setState({ chooseSuggest: true });
    this.props.chooseSuggestChange(true);
    const { id } = this.props.remedyItem;
    this.props.addDrug(this.state.value, id);
    this.props.isValidDrug(true);

    return suggestion.name;
  };

  // Use your imagination to render suggestions.
  renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  componentDidMount = () => {
    const request = "https://drugcheq.herokuapp.com/suggest";
    this.setState({ loading: true }, () => {
      axios
        .get(request)
        .then((response) => {
          this.setState({ loading: false });
          this.setState({ drugSuggestions: response.data });
        })
        .catch((error) => {
          alert("error!");
        });
    });
  };

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

  //Change State to the drug name that typed
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  onClickX = () => {
    const { id } = this.props.remedyItem;
    this.props.delRemedy(id);
    this.props.isValidDrug(true);
    this.props.chooseSuggestChange(true);
    this.props.onDrugAdded(true);
  };

  render() {
    const { value, suggestions } = this.state;
    const { id } = this.props.remedyItem;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "בחר תרופה",
      value,
      onChange: this.onChange,
    };

    const notValidDrugMsg = (
      <h6 style={{ color: "red" }}>אנא בחר תרופה המרשימה * </h6>
    );
    return (
      <div className="remedy-element-container">
        <div className="delete-remedy-btn-wrapper">
          <button className="delete-remedy-btn" onClick={this.onClickX}>
            X
          </button>
        </div>
        <label className="step2-lable" htmlFor="drug-name">
          שם התרופה
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
        <div className="from-until-dates-container">
          <div className="date-wrapper">
            <label className="date-lable" for="from-date">
              תאריך תחילת שימוש
            </label>
            <input
              className="date-input"
              type="date"
              id="from-date"
              name="from-date"
            />
          </div>
          <div className="date-wrapper">
            <label className="date-lable" for="until-date">
              תאריך סיום שימוש
            </label>
            <input
              className="date-input"
              type="date"
              id="until-date"
              name="until-date"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RemedyContainer;
