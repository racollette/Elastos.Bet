import React, { useState, useEffect } from "react";
import getBlockchain from "./ethereum.js";
import { Pie } from "react-chartjs-2";
import { ethers } from "ethers";
import './app.css';

const SIDE = {
  BELGIUM: 0,
  ITALY: 1,
};

function App() {
  const [predictionMarket, setPredictionMarket] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);
  const [betPredictions, setBetPredictions] = useState(undefined);
  const [poolTotal, setPoolTotal] = useState(undefined);

  useEffect(() => {
    const init = async () => {

      const { signerAddress, predictionMarket } = await getBlockchain();
      const myBets = await Promise.all([
        predictionMarket.betsPerGambler(signerAddress, SIDE.BELGIUM),
        predictionMarket.betsPerGambler(signerAddress, SIDE.ITALY),
      ]);
      const bets = await Promise.all([predictionMarket.bets(SIDE.BELGIUM), predictionMarket.bets(SIDE.ITALY)]);
      const betPredictions = {
        labels: ["Belgium", "Italy"],
        datasets: [
          {
            label: 'ELA',
            data: [ethers.utils.formatEther(bets[0]), ethers.utils.formatEther(bets[1])],
            backgroundColor: ["#b3b300", "#00b300"],
            hoverBackgroundColor: ["#808000", "#008000"],
          },
        ],
      };

      setPredictionMarket(predictionMarket);
      setMyBets(myBets);
      setBetPredictions(betPredictions);
      setPoolTotal(parseFloat(betPredictions.datasets[0].data[0]) + parseFloat(betPredictions.datasets[0].data[1]))
    };
    init();
  }, []);

  if (
    typeof predictionMarket === "undefined" ||
    typeof myBets === "undefined" ||
    typeof betPredictions === "undefined"
  ) {
    return "Loading...";
  }

  const placeBet = async (side, e) => {
    e.preventDefault();
    await predictionMarket.placeBet(side, { value: ethers.utils.parseEther(e.target.elements[0].value) });
  };

  const withdrawGain = async () => {
    await predictionMarket.withdrawGain();
  };

  return (
    <div className="container">

      <div className="row">
        <div className="col-sm-12">
          <div className="card header">
            <h1 className="text-center title">Elastos Degen Bet</h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="jumbotron">
            <h2 className="text-center">Who will win Belgium vs. Italy in the Euro Cup?</h2>
            <p className="date-text text-center">Friday, July 2nd (7:00PM UTC)</p>
            <p className="odds-text text-center">Current odds</p>
            <div>
              <Pie data={betPredictions}/>
            </div>
            <div className="pool-total text-center">Total: <b>{poolTotal} ELA</b></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <img src="./img/belgium1.png" alt="Belgium" />
            <div className="card-body">
              <h4 className="card-title">Belgium</h4>
              <form className="form-inline" onSubmit={(e) => placeBet(SIDE.BELGIUM, e)}>
                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Bet amount (ELA)" />
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="card">
            <img src="./img/italy1.png" alt="Italy" />
            <div className="card-body">
              <h4 className="card-title">Italy</h4>
              <form className="form-inline" onSubmit={(e) => placeBet(SIDE.ITALY, e)}>
                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Bet amount (ELA)" />
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card bets">
            <h4>Your bets</h4>
            <ul>
              <li className="bet-option">Belgium: {ethers.utils.formatEther(myBets[0].toString())} ELA</li>
              <li className="bet-option">Italy: {ethers.utils.formatEther(myBets[1].toString())} ELA</li>
              {/* <li>Belgium: {myBets[0].toString()} ELA (wei)</li>
              <li>Italy: {myBets[1].toString()} ELA (wei)</li> */}
            </ul>
          </div>
        </div>
      </div>
     

      <div className="row">
        <div className="col-sm-12">
          <div className="card bets">
            <h4>Were you right?</h4>
            <button type="submit" className="btn btn-primary mb-2" onClick={(e) => withdrawGain()}>
              Claim Winnings
            </button>
          </div>
        </div>  
      </div>
  </div>
  );
}

export default App;
