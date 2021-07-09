import React from "react";
// import getBlockchain from "./ethereum.js";
import { Match } from "./components/match.js";
import { Tabs, Tab } from "react-bootstrap";
// import { ethers } from "ethers";
import "./app.css";

import England_Denmark from "./contracts/PredictionMarket2.json";
import England_Italy from "./contracts/England_Italy.json";

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="card header">
            <h1 className="text-center title">Elastos Prediction Market</h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <Tabs defaultActiveKey="primary">
            <Tab eventKey="primary" title="Euro 2020 Final">
               <Match
                contract={England_Italy}
                home="England"
                away="Italy"
                homePic="../img/england1.png"
                awayPic="../img/italy1.png"
                title="Euro 2020 Final"
                time="Sunday, July 11th (7:00PM UTC)"
              />
            </Tab>
            <Tab eventKey="second" title="Euro 2020 Semi-final">
               <Match
                contract={England_Denmark}
                home="England"
                away="Denmark"
                homePic="../img/england1.png"
                awayPic="../img/denmark1.png"
                title="Euro 2020 Semi-final"
                time="Wednesday, July 7th (7:00PM UTC)"
              />
            </Tab>
          </Tabs>
        </div>
      </div>

    </div>
  );
}

export default App;
