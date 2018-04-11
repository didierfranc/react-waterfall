import React, { Component } from 'react';
import { connect } from 'react-waterfall';

import logo from './logo.svg';
import './App.css';
import { NavLink } from 'react-router-dom';

class App extends Component {
  state = {
    greeting: '',
    user: 'Whatever',
  };

  change = (e) => {
    this.setState({ greeting: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { actions } = this.props;
    actions.changeGreeting(this.state.greeting);
  };

  render() {
    const { match, greeting } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{greeting}&nbsp;{match.params.user}</h1>
        </header>
        <br />
        <form onSubmit={this.submit}>
          <input type="text" value={this.state.greeting} placeholder={`Greeting: ${greeting}`} onChange={this.change} />
          <button type="submit">Change it!</button>
        </form>
        <br />
        <NavLink to='/'>Home</NavLink>
        &nbsp;|&nbsp;
        <NavLink to={`/${this.state.user}`}>{this.state.user}</NavLink>
      </div>
    );
  }
}

export default connect(state => ({ greeting: state.greeting }))(App);
