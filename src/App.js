import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';

import Header from './components/header/header.component';
import Home from './pages/home/home.component';
import Guide from './pages/guide/guide.component';
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
            <Route path = "/guide" component = {Guide} />
            <Route path = "/upload" render = {
              () => < Upload sendParams = {this.sendParams}/>
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
