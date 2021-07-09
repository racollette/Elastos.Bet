// const PredictionMarket = artifacts.require("PredictionMarket.sol");
// const PredictionMarket = artifacts.require("PredictionMarket2.sol");
const PredictionMarket = artifacts.require("England_Italy.sol");

const SIDE = {
  HOME: 0,
  AWAY: 1,
};

module.exports = async function (deployer, _network, addresses) {
  //   const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  const [oracle, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle);
  const predictionMarket = await PredictionMarket.deployed();
  await predictionMarket.placeBet(SIDE.HOME, { from: oracle, value: web3.utils.toWei("0.05") });
  await predictionMarket.placeBet(SIDE.AWAY, { from: oracle, value: web3.utils.toWei("0.05") });
};
