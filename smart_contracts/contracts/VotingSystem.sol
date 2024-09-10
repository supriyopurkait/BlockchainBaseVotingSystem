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
    }

    uint256 public voteCount;
    address public owner;
    address public VID_Address;

    CandidateStruct[] public candidates;
    mapping(string => uint256) internal votes;
    mapping(address => bool) public hasVoted;
    mapping(string => bool) private candidateExists;  // Checks if a candidate name is present or not
    mapping(string => bool) private candidateAreaExists;    // Ensures only one candidate per area
    event CandidateAdded(string candidateName, uint256 candidateId);
    event VoteCast(address voter, string candidateName);

    // modifier to restrict access to only owner of this contract
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Modifier to restrict access to only NFT owners
    modifier onlyNftOwner() {
        require(SBT_SC(VID_Address).balanceOf(msg.sender) > 0, "You must own an SBT");
        _;
    }

    constructor(address _VID_Address) {
        owner = msg.sender;
        VID_Address = _VID_Address;
        voteCount = 0;
    }

    function nameOfSBT() public view returns (string memory) {
        return SBT_SC(VID_Address).name();
    }

    // Checks if an address holds a SBT or not
    function isHolderOfSBT(address _addr) public view returns (bool) {
        return SBT_SC(VID_Address).balanceOf(_addr) > 0;
    }

    // Function to get the owners address of SBT contract
    function ownerOfVIdSmartContract() public view returns (address) {
        return SBT_SC(VID_Address).owner();
    }

    // Add candinate names 
    function addCandidate(string memory _candidateName, uint256 _candidateId, string memory _area, string memory _party) public onlyOwner {
        require(!candidateExists[_candidateName], "Candidate already exists");
        require(!candidateAreaExists[_area], "A candidate already exists in this area");
        
        candidateAreaExists[_area] = true;
        candidates.push(CandidateStruct(_candidateName, _candidateId, _area, _party));
        candidateExists[_candidateName] = true;
        emit CandidateAdded(_candidateName, _candidateId);  // Emit event
    }

    // Get total number of candidates
    function totalCandidates() public  view  returns  (uint256){
        return candidates.length;
    }

    // Only SBT holder can vote
    function vote(string memory _candidateName) public onlyNftOwner {
        require(isValidCandidate(_candidateName), "Invalid candidate name");
        require(!hasVoted[msg.sender], "You have already voted");

        votes[_candidateName]++;
        voteCount++;
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender, _candidateName);  // Emit event
    }

    // Checks if a candidate name is present or not
    function isValidCandidate(string memory _candidateName) internal view returns (bool) {
       return candidateExists[_candidateName];
    }

    // Function to get vote count of a candidate
    function getVoteCount(string memory _candidateName) public view onlyOwner returns(uint256) {
        return votes[_candidateName];
    }

    // Function to get total vote counts for all candidates
    function totalVotes() public view onlyOwner returns(uint256) {
        return voteCount;
    }
}