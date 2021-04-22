import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import "./RemedyContainer.css";

class RemedyContainer extends Component {
  state = {
    drugList: [],
    response: null,
    value: "",
    suggestions: [],
    drugSuggestions: [],
    loading: false,
    chooseSuggest: false,
    notInList: "alert-remedy-list fadeOut",
    alertMsg: "",
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
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  //Submit Drug Item to list
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.chooseSuggest === false) {
      this.setState({
        notInList: "alert-remedy-list fadeIn",
        alertMsg: "יש לבחור תרופה מתוך הרשימה",
      });

      setTimeout(() => {
        this.setState({
          notInList: "alert-remedy-list fadeOut",
        });
      }, 2000);
      // this.setState({ alertMsg: "" });

      return;
    }
    this.setState({ chooseSuggest: false });

    const newDrugItem = {
      id: this.state.drugList.length + 1,
      name: this.state.value,
    };
    if (newDrugItem.name.trim().length !== 0) {
      if (this.props.drugInsertHandler) {
        this.props.drugInsertHandler(true);
      }
      //if the input not contains only spaces
      this.setState({ drugList: [...this.state.drugList, newDrugItem] });
      this.setState({ value: "" });
      this.props.drugListUpdate(newDrugItem);
    }
  };
  //Change State to the drug name that typed
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  removeRemedyHandler = () => {
    console.log("Im component with key " + this.props.remedyComponentKey);
    this.props.removeRemedyComponent(this.props.remedyComponentKey);
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
    return (
      <div className="remedy-element-container">
        <div className="delete-remedy-btn-wrapper">
          <button
            className="delete-remedy-btn"
            onClick={this.props.delRemedy.bind(this, id)}
          >
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
