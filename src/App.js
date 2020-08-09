import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';
import Web3 from 'web3';

import Header from './components/header/header.component';
import Home from './pages/home/home.component';
import About from './pages/about/about.component';
import Verify from './pages/verify/verify.component';
import Login from './pages/login/login.component';
import Upload from './pages/upload/upload.component';
import Footer from './components/footer/footer.component';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      account: ''
    }
  }

  componentDidMount() {
    this.loadBlockChainData();
  }

  async loadBlockChainData() {
    const web3 = new Web3(Web3.givenProvider); // Provider from Metamask
    const accounts = await web3.eth.getAccounts(); // Get Ethereum blockchain account

    this.setState({account: accounts[0]});
    console.log(accounts[0]);
  }

  render() {
    return (
      <div className="App">
        < Header />
        <div className = "App-body">
          <Switch>
            <Route exact path = "/" component = {Home} />
            <Route path = "/about" component = {About} />
            <Route path = "/verify" component = {Verify} />
            <Route path = "/login" component = {Login} />
            <Route path = "/upload" component = {Upload} />
          </Switch>
        </div>
        < Footer />
      </div>
    );
  }
}

export default App;
