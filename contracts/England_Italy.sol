pragma solidity ^0.6.12;

contract England_Italy {
    // England = Home, Italy = Away
    enum Side { Home, Away }
    struct Result {
        Side winner;
        Side loser;
    }
    Result public result;
    bool public matchFinished;
    bool public betsPaused;

    mapping(Side => uint) public bets;
    mapping(address => mapping(Side => uint)) public betsPerGambler;
    address public oracle;

    constructor(address _oracle) public {
        oracle = _oracle;
    }

    function placeBet(Side _side) external payable {
        require(matchFinished == false, 'The match is over');
        require(betsPaused == false, 'Betting is suspended');
        bets[_side] += msg.value;
        betsPerGambler[msg.sender][_side] += msg.value;
    }

    function withdrawGain() external {
        uint gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, 'You do not have a winning bet');
        require(matchFinished == true, 'The match is not over');
        uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];
        betsPerGambler[msg.sender][Side.Home] = 0;
        betsPerGambler[msg.sender][Side.Away] = 0;
        msg.sender.transfer(gain);
    }

    function pauseBets(bool _pause) external {
        require(oracle == msg.sender, 'Only the oracle may call this function');
        require(matchFinished == false, 'The match is already over');
        betsPaused = _pause;
    }

    function reportResult(Side _winner, Side _loser) external {
        require(oracle == msg.sender, 'Only the oracle may call this function');
        require(matchFinished == false, 'The match is already over');
        result.winner = _winner;
        result.loser = _loser;
        matchFinished = true;
    }
}