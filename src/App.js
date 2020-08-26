import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';

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
      txReceipt : null
    };
  }

  sendParams = (data) => {
    this.setState({txReceipt: data})
  }

  render() {
    return (
      <div className="App">
        < Header />
        <div className = "App-body">
          <Switch>
            <Route exact path = "/" component = {Home} />
            <Route path = "/about" component = {About} />
            
            <Route path = "/login" component = {Login} />
            <Route path = "/upload" render = {
              () => < Upload sendParams = {this.sendParams}/>
              }
            />

            <Route path = "/verify" render = {
                () => < Verify txReceipt = {this.state.txReceipt} />
              } 
            />

          </Switch>
        </div>
        < Footer />
      </div>
    );
  }
}

export default App;
