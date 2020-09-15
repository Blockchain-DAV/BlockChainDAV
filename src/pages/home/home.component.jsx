import React from 'react';
import './home.styles.scss';
import {Link} from 'react-router-dom';
import FileImage from '../../components/images/shield.svg';
import PeerImage from '../../components/images/peer.png';


const Home = () => {
   return (
      <section className = "home">
         <section className = "home-section-0">
            <div className = "home-section-0-content-0">
               <span className = "home-section-0-content-0-title-0">
                  Document Verification system
               </span>
               <span className = "home-section-0-content-0-title-1">
                  Blockchain based verifier using IPFS and Ethereum
               </span>
            </div>
            <div className = "home-section-0-content-1">
               <Link className = "home-section-0-content-1-button-1" to = "/upload">
                  <div className = "home-section-0-content-1-button-1-text">
                     Get Started
                  </div>
               </Link>
               <Link className = "home-section-0-content-1-button-2" to = "/guide">
                  <div className = "home-section-0-content-1-button-2-text">
                     Learn More
                  </div>
               </Link>
            </div>
         </section>
         <section className = "home-section-1">
            <div className = "home-section-1-content-1">
               <h1 className = "home-section-1-content-1-title">
                  Secure your Achievements
               </h1>
               <div className = "home-section-1-content-1-desc">
                  With BlockDVS, your official documents now become yours forever!
               </div>
               <div className = "home-section-1-content-1-desc">
                  New and improved technology to secure your information.
               </div>
            </div>
            <div className = "home-section-1-content-2">
               <img src = {FileImage} className = "home-section-1-content-2-image" alt ="preview not available" />
            </div>
         </section>

         <section className = "home-section-2">
            <div className = "home-section-2-content-1">
                  <h1 className = "home-section-2-content-1-title">
                     Decentralized Verification
                  </h1>
                  <div className = "home-section-2-content-1-desc">
                     Documents can be verified by anyone on the blockchain network.
                  </div>
                  <div className = "home-section-2-content-1-desc">
                     Altering verified information becomes nearly impossible!
                  </div>
            </div>

            <div className = "home-section-2-content-2">
            <img src = {PeerImage} className = "home-section-2-content-2-image" alt ="preview not available" />
            </div>
         </section>
      </section>
   );
}


export default Home;