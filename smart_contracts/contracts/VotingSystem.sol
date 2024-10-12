// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// Interface of SBT contract 
interface SBT_SC {
    function balanceOf(address owner) external view returns (uint256);
    function name() external view returns (string memory);
    function owner() external view returns (address);
}

contract VotingSystem {

    struct CandidateStruct {
        string candidateName;
        uint256 candidateId;
        string area;
        string party;
        string imageUrl;    // candidate image url
    }

    enum VotingState { NotStarted, InProgress, Ended }

    uint256 private voteCount;          // Vote count
    uint256 public nextCandidateId;     // Next candidate ID                  
    address public owner;               // Owner address
    address public VID_Address;         // SBT contract address
    address public relayer;             // Relayer address
    address private userAddress;        // Voter address for meta tx
    bool public resultsDeclared;
    VotingState public votingState;     // State of the voting 0 = not started, 1 = in progress, 2 = ended

    CandidateStruct[] public candidates;
    mapping(uint256 => uint256) private votes;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => bool) private candidateExists;
    mapping(bytes32 => bool) private partyInAreaExists;
    mapping(address => uint256) public nonces;
    event CandidateAdded(string candidateName, uint256 candidateId);
    event VoteCast(address voter, uint256 candidateId);
    event ResultsDeclared();
    event VotingStarted();
    event VotingStopped();

    bool private inMetaTx;  // required for meta tx

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier onlyNftOwner() {
        require(SBT_SC(VID_Address).balanceOf(userAddress) > 0, "You must own an SBT");
        _;
    }

    modifier resultsAreNotDeclared() {
        require(!resultsDeclared, "Results have already been declared");
        _;
    }

    modifier resultsAreDeclared() {
        require(resultsDeclared, "Results have not been declared yet");
        _;
    }

    modifier votingNotStarted() {
        require(votingState == VotingState.NotStarted, "Voting has already started");
        _;
    }

    modifier votingInProgress() {
        require(votingState == VotingState.InProgress, "Voting is not in progress");
        _;
    }

    modifier votingEnded() {
        require(votingState == VotingState.Ended, "Voting has not ended yet");
        _;
    }

    constructor(address _VID_Address, address _relayer) {
        owner = msg.sender;
        VID_Address = _VID_Address;
        relayer = _relayer;
        voteCount = 0;
        resultsDeclared = false;
        votingState = VotingState.NotStarted;
        nextCandidateId = 1;
    }

    function nameOfSBT() public view returns (string memory) {
        return SBT_SC(VID_Address).name();
    }

    function isHolderOfSBT(address _addr) public view returns (bool) {
        return SBT_SC(VID_Address).balanceOf(_addr) > 0;
    }

    function ownerOfVIdSmartContract() public view returns (address) {
        return SBT_SC(VID_Address).owner();
    }

    // Add candidates
    function addCandidate(string memory _candidateName, string memory _area, string memory _party, string memory _imageUrl) public onlyOwner votingNotStarted {
        
        uint256 _candidateId = nextCandidateId;
        nextCandidateId++;
        // Create a unique hash for the party and area combination
        bytes32 partyAreaKey = keccak256(abi.encodePacked(_area, _party));
        require(!partyInAreaExists[partyAreaKey], "This party already has a candidate in this area");
        
        partyInAreaExists[partyAreaKey] = true;     // Mark that the party now has a candidate in this area

        candidates.push(CandidateStruct(_candidateName, _candidateId, _area, _party, _imageUrl));
        candidateExists[_candidateId] = true;

        emit CandidateAdded(_candidateName, _candidateId);
    }

    // Delete candidates
    function deleteCandidate(uint256 _candidateId) public onlyOwner votingNotStarted {
        require(candidateExists[_candidateId], "Candidate with this ID does not exist");

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateId == _candidateId) {
                bytes32 partyAreaKey = keccak256(abi.encodePacked(candidates[i].area, candidates[i].party));
                partyInAreaExists[partyAreaKey] = false;

                candidates[i] = candidates[candidates.length - 1];
                candidateExists[_candidateId] = false;

                candidates.pop();
                break;
            }
        }
    }

    // Get number of candidates
    function totalCandidates() public view returns (uint256) {
        return candidates.length;
    }

    // Get all candidates info
    function getAllCandidates() public view returns (CandidateStruct[] memory allCandidates) {
        return candidates;
    }

    // Vote
    function vote(uint256 _candidateId) public onlyNftOwner votingInProgress returns (string memory) {
        require(inMetaTx, "Only through relayer Voting is possible");  
        require(isValidCandidate(_candidateId), "Invalid candidate ID");
        require(!hasVoted[userAddress], "You have already voted");

        votes[_candidateId]++;
        voteCount++;
        hasVoted[userAddress] = true;
        emit VoteCast(userAddress, _candidateId);
        return "Voted successfully";
    }

    function isValidCandidate(uint256 _candidateId) internal view returns (bool) {
        return candidateExists[_candidateId];
    }

    function startVote() public onlyOwner votingNotStarted {
        require(candidates.length > 0, "No candidates to vote on");
        require(!resultsDeclared, "Results have already been declared");
        votingState = VotingState.InProgress;
        emit VotingStarted();
    }

    function stopVote() public onlyOwner votingInProgress {
        votingState = VotingState.Ended;
        emit VotingStopped();
    }

    function declareResults() public onlyOwner votingEnded resultsAreNotDeclared {
        resultsDeclared = true;
        emit ResultsDeclared();
    }

    function getVoteCount(uint256 _candidateId) public view resultsAreDeclared returns (uint256) {
        return votes[_candidateId];
    }

    function totalVotes() public view resultsAreDeclared returns (uint256) {
        return voteCount;
    }

    // Function to execute meta tx
    function executeMetaTx(address _userAddress, uint256 nonce, bytes memory functionSignature, bytes32 r, bytes32 s, uint8 v) public returns (bytes memory) {
        require(msg.sender == relayer, "You are not the relayer! Only relayer can execute meta tx");
        require(nonce == nonces[_userAddress], "Invalid nonce");
        userAddress = _userAddress;
        bytes32 messageHash = keccak256(abi.encodePacked(userAddress, nonce, functionSignature));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));   

        address signer = ecrecover(ethSignedMessageHash, v, r, s);
        require(signer == userAddress, "Invalid signer");

        nonces[userAddress]++;

        inMetaTx = true;
        (bool success, bytes memory returnData) = address(this).call(abi.encodePacked(functionSignature, userAddress));
        inMetaTx = false;

        require(success, "Function call failed");

        return returnData;
    }
}