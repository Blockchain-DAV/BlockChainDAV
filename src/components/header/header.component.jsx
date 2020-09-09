import React from 'react';
import './header.styles.scss';
import {Link} from 'react-router-dom';
import Logo from "../images/blockchain.png";

const Header = () => {

  return (
   <header className = "header">
        <div className = "header-content" >
          
          <div className = "header-title">
            <img src = {Logo} className = "header-title-logo" alt = "no preview"/>
            <span className = "header-title-bg">Block</span> 
            <span className = "header-title-sm">dvs</span>
          </div>

          <span className = "header-links">
            <Link className = "header-nav-link" to = "/">
              Home
            </Link>
            <Link className = "header-nav-link" to = "/guide">
              Guide
            </Link>
            <Link className = "header-nav-link" to = "/upload">
              Upload
            </Link>
            <Link className = "header-nav-link" to = "/verify">
              Verify
            </Link>
            <a className = "header-nav-link" href = "https://github.com/Blockchain-DAV/BlockChainDAV">
              Github
            </a>
          </span>

          
        </div>
     
   </header>
  );

}


export default Header;