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
  const [statusText, setStatusText] = useState(undefined);
  const [claimAvailable, setClaimAvailable] = useState(false);
  const [betsPaused, setBetsPaused] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [projected0, setProjected0] = useState(0);
  const [projected1, setProjected1] = useState(0);



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
            options: {
              responsive:true,
              maintainAspectRatio: false
            }
          },
        ],
        
      };
      const betsPaused = await predictionMarket.betsPaused();
      const matchFinished = await predictionMarket.matchFinished();

      const projected0 = ((parseFloat(ethers.utils.formatEther(myBets[0]))) / parseFloat(betPredictions.datasets[0].data[0])) * parseFloat(betPredictions.datasets[0].data[1])
      const projected1 = ((parseFloat(ethers.utils.formatEther(myBets[1]))) / parseFloat(betPredictions.datasets[0].data[1])) * parseFloat(betPredictions.datasets[0].data[0])
      setProjected0(projected0)
      setProjected1(projected1)

      if (matchFinished) {
        setMatchFinished(true);
        const outcome = await predictionMarket.result();
        const winner = betPredictions.labels[outcome.winner]
        setStatusText(`${winner} won! The oracle has reported the results. Winners may claim below.`);
        const winningBet = parseFloat(ethers.utils.formatEther(myBets[outcome.winner].toString())) > 0 ? true : false;
        if (winningBet) setClaimAvailable(true)
      } else if (betsPaused && !matchFinished) {
        setStatusText("The match is currently underway. Betting is closed.")
        setBetsPaused(true);
        setClaimAvailable(false);
      } else {
        setStatusText("The contract is now accepting bets!")
        setClaimAvailable(false);
      }

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
    return <div className="text-center loader"><img src="./loader.svg" alt="Loader"/></div>
  }

  const placeBet = async (side, e) => {
    console.log(predictionMarket)
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
            <h1 className="text-center title">Elastos Sportsball Bet</h1>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="jumbotron">
            <h2 className="text-center">Who will win Belgium vs. Italy in the Euro Cup?</h2>
            <p className="date-text text-center">Friday, July 2nd (7:00PM UTC)</p>
            <p className="odds-text text-center">Current odds</p>
            <div className="pie-container text-center">
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
                {(betsPaused || matchFinished) ? (  <button type="submit" className="btn btn-primary mb-2" disabled>
                  Submit
                </button>):   <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>}
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
                {(betsPaused || matchFinished) ? (  <button type="submit" className="btn btn-primary mb-2" disabled>
                  Submit
                </button>):   <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card bets">
            <h4>Match status (<>
            {(!betsPaused && !matchFinished) && <span style={{color: "green"}}>Upcoming</span>}
            {(betsPaused && !matchFinished) && <span style={{color: "yellow"}}>Underway</span>}
            {(matchFinished) && <span style={{color: "red"}}>Complete</span>}
            </>)</h4>
            <p>{statusText}</p>
          </div>
        </div>  
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card bets">
            <h4>Active Bets</h4>
             <ul>
              <li className="bet-option">Belgium: {ethers.utils.formatEther(myBets[0].toString())} ELA <span>(Estimated potential winnings of {projected0} ELA)</span></li>
              <li className="bet-option">Italy: {ethers.utils.formatEther(myBets[1].toString())} ELA <span>(Estimated potential winnings of {projected1} ELA)</span></li>
            </ul>
            {matchFinished && (
             <>{claimAvailable ? (<button type="submit" className="btn btn-primary mb-2" onClick={(e) => withdrawGain()}>
              Claim Winnings
            </button>) : (
            <h5>No winnings available to claim. Sorry!</h5>)}</>
            )}
          </div>
        </div>
      </div>

  </div>
  );
}

export default App;
