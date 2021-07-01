const PredictionMarket = artifacts.require("PredictionMarket.sol");

const SIDE = {
  BELGIUM: 0,
  ITALY: 1,
};

module.exports = async function (deployer, _network, addresses) {
  //   const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  const [oracle, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle);
  const predictionMarket = await PredictionMarket.deployed();
  await predictionMarket.placeBet(SIDE.BELGIUM, { from: oracle, value: web3.utils.toWei("0.046") });

  //   await predictionMarket.placeBet(SIDE.BELGIUM, { from: gambler1, value: web3.utils.toWei("1") });

  //   await predictionMarket.placeBet(SIDE.BELGIUM, { from: gambler1, value: web3.utils.toWei("2") });

  await predictionMarket.placeBet(SIDE.ITALY, { from: oracle, value: web3.utils.toWei("0.01") });
};
