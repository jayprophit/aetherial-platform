// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GiftCard
 * @dev Implements a blockchain-based gift card system
 */
contract GiftCard is Ownable, ReentrancyGuard {
    struct Card {
        uint256 id;
        uint256 amount;
        address tokenAddress; // Address of the ERC20 token, or address(0) for native token
        address issuer;
        address recipient;
        uint256 issueTime;
        uint256 expiryTime;
        bool isRedeemed;
        bool isExpired;
    }

    // Mapping from card ID to Card
    mapping(uint256 => Card) public cards;
    
    // Count of all cards created
    uint256 public cardCount;
    
    // Fee percentage (in basis points, e.g., 100 = 1%)
    uint256 public feePercentage;
    
    // Address to collect fees
    address public feeCollector;
    
    // Events
    event CardIssued(
        uint256 indexed cardId,
        address indexed issuer,
        address indexed recipient,
        uint256 amount,
        address tokenAddress,
        uint256 expiryTime
    );
    
    event CardRedeemed(uint256 indexed cardId, address indexed redeemer, uint256 amount);
    event CardExpired(uint256 indexed cardId);
    event FeeUpdated(uint256 newFeePercentage);
    event FeeCollectorUpdated(address newFeeCollector);

    constructor(uint256 _feePercentage, address _feeCollector) {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _feePercentage;
        feeCollector = _feeCollector;
    }

    /**
     * @dev Issue a new gift card with native currency (ETH, MATIC, etc.)
     */
    function issueNativeGiftCard(
        address _recipient,
        uint256 _durationInDays
    ) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_recipient != address(0), "Invalid recipient address");
        
        uint256 fee = (msg.value * feePercentage) / 10000;
        uint256 amountAfterFee = msg.value - fee;
        
        // Transfer fee to fee collector
        if (fee > 0) {
            (bool feeSuccess, ) = feeCollector.call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        _createCard(amountAfterFee, address(0), _recipient, _durationInDays);
    }

    /**
     * @dev Issue a new gift card with ERC20 tokens
     */
    function issueERC20GiftCard(
        address _tokenAddress,
        uint256 _amount,
        address _recipient,
        uint256 _durationInDays
    ) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(_tokenAddress != address(0), "Invalid token address");
        require(_recipient != address(0), "Invalid recipient address");
        
        IERC20 token = IERC20(_tokenAddress);
        
        uint256 fee = (_amount * feePercentage) / 10000;
        uint256 amountAfterFee = _amount - fee;
        
        // Transfer tokens from sender to this contract
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed");
        
        // Transfer fee to fee collector
        if (fee > 0) {
            success = token.transfer(feeCollector, fee);
            require(success, "Fee transfer failed");
        }
        
        _createCard(amountAfterFee, _tokenAddress, _recipient, _durationInDays);
    }

    /**
     * @dev Redeem a gift card
     */
    function redeemGiftCard(uint256 _cardId) external nonReentrant {
        Card storage card = cards[_cardId];
        
        require(card.id != 0, "Card does not exist");
        require(!card.isRedeemed, "Card already redeemed");
        require(!card.isExpired, "Card has expired");
        require(block.timestamp < card.expiryTime, "Card has expired");
        require(
            msg.sender == card.recipient || msg.sender == owner(),
            "Not authorized to redeem this card"
        );
        
        card.isRedeemed = true;
        
        if (card.tokenAddress == address(0)) {
            // Native token transfer
            (bool success, ) = payable(card.recipient).call{value: card.amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token transfer
            IERC20 token = IERC20(card.tokenAddress);
            bool success = token.transfer(card.recipient, card.amount);
            require(success, "Token transfer failed");
        }
        
        emit CardRedeemed(_cardId, msg.sender, card.amount);
    }

    /**
     * @dev Check if a card is expired
     */
    function checkExpiry(uint256 _cardId) external {
        Card storage card = cards[_cardId];
        
        if (!card.isExpired && block.timestamp >= card.expiryTime) {
            card.isExpired = true;
            emit CardExpired(_cardId);
        }
    }

    /**
     * @dev Update the fee percentage (only owner)
     */
    function updateFeePercentage(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = _newFeePercentage;
        emit FeeUpdated(_newFeePercentage);
    }

    /**
     * @dev Update the fee collector address (only owner)
     */
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
        emit FeeCollectorUpdated(_newFeeCollector);
    }

    /**
     * @dev Internal function to create a new gift card
     */
    function _createCard(
        uint256 _amount,
        address _tokenAddress,
        address _recipient,
        uint256 _durationInDays
    ) internal {
        cardCount++;
        
        uint256 expiryTime = block.timestamp + (_durationInDays * 1 days);
        
        cards[cardCount] = Card({
            id: cardCount,
            amount: _amount,
            tokenAddress: _tokenAddress,
            issuer: msg.sender,
            recipient: _recipient,
            issueTime: block.timestamp,
            expiryTime: expiryTime,
            isRedeemed: false,
            isExpired: false
        });
        
        emit CardIssued(
            cardCount,
            msg.sender,
            _recipient,
            _amount,
            _tokenAddress,
            expiryTime
        );
    }
    
    // Allow the contract to receive native tokens
    receive() external payable {}
}
