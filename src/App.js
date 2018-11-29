import React, { Component } from 'react';
import {DiffWords} from 'react-diff-components';
import stringSimilarity from 'string-similarity';

import logo from './logo.svg';
import './App.css';
import './Slider.css';

import isSameMinute from 'date-fns/is_same_minute'
import format from 'date-fns/format';

// Headline component
// Add class if value.isoDate is the same minute as slider time
const Headline = props => 
  props.obj.headlines.map(value => 
    <li 
      data-isotime={value.isoDate} 
      data-currentslidertime={props.sliderIsoTime}
      className={(isSameMinute(Number(value.isoDate), Number(props.sliderIsoTime))) ? 'visible' : 'invisible'}>
        {value.headline}<br/>
        <div className="diffBlock">
        {
          stringSimilarity.compareTwoStrings(value.prevHeadline || '', value.headline || '') > 0.4 
          && stringSimilarity.compareTwoStrings(value.prevHeadline || '', value.headline || '') !== 1 
          && <DiffWords from={value.prevHeadline || ''} to={value.headline || ''} />
          }
          </div>
    </li>
  )

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderIsoTime: 1,
      sliderPositon: 1,
      structuredData: {
        publications: [],
        formattedArray: [],
        timesArray: []
      }
    };
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    
    fetch('/.netlify/functions/getHeadlines').then(resp => resp.json()).then(val => this.setState({
      sliderIsoTime: Number(val.timesArray[val.timesArray.length-1]),
      sliderPosition: val.timesArray.length-1,
      structuredData: val
    }));
  }

  handleTimeChange(event) {
    this.setState({sliderIsoTime: event.target.value});
  }

  handleRangeChange(event) {
    this.setState({sliderPosition: event.target.value})
    this.setState({sliderIsoTime: this.state.structuredData.timesArray[event.target.value]})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <input className="slider" value={this.state.sliderPosition} onChange={this.handleRangeChange} type="range" min="0" max={this.state.structuredData.timesArray.length - 1}></input>
            <input type="text" style={{visibility: 'hidden'}} value={this.state.sliderIsoTime} onChange={this.handleTimeChange}></input>
            {format(this.state.sliderIsoTime, 'Do MMMM YYYY, H:mm')}
        </header>
        <ul className={'headlines-list'}>
          {
          this.state.structuredData.publications.map((value, i) => 
            <li 
              key={i}>
                <h2>{this.state.structuredData.formattedArray[Object.keys(value)[0]].pubTitle}</h2>
                <ul>
                  <Headline obj={this.state.structuredData.formattedArray[Object.keys(value)[0]]} sliderIsoTime={this.state.sliderIsoTime} />
                </ul>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
