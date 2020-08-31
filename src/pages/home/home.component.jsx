import React from 'react';
import './home.styles.scss';


const Home = () => {
   return (
      <section className = "home">
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
               .......
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
               .......
            </div>
         </section>
      </section>
   );
}


export default Home;