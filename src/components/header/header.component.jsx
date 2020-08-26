import React from 'react';
import './header.styles.scss';
import {Link} from 'react-router-dom';

const Header = () => (
   <header className="header">
        <span className = "header-title">
            BlockChainDVS
        </span>
        <Link className = "header-nav-link" to = "/">
          Home
        </Link>

        <Link className = "header-nav-link" to = "/about">
          About
        </Link>
        
        <Link className = "header-nav-link" to = "/upload">
          Upload
        </Link>

        <Link className = "header-nav-link" to = "/verify">
          Verify
        </Link>

        <Link className = "header-nav-link" to = "/login">
          Login
        </Link>

   </header>
);


export default Header;