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

    uint256 public voteCount;   // Total number of votes
    address public owner;       // Owner address
    address public VID_Address; // SBT contract address
    address public relayer;     // Relayer address
    address private userAddress; 
    CandidateStruct[] public candidates;                                 // Array of candidates
    mapping(uint256 => uint256) internal votes;                          // Mapping from candidate ID to number of votes
    mapping(address => bool) public hasVoted;                            // Mapping from voter address to whether they have voted
    mapping(uint256 => bool) private candidateExists;                    // Checks if a candidate ID is present or not
    mapping(bytes32 => bool) private partyInAreaExists;                  // Ensures only one candidate from a party in an area
    mapping(address => uint256) public nonces;                           // Mapping from voter address to nonce for meta tx
    event CandidateAdded(string candidateName, uint256 candidateId);     // Event when a candidate is added
    event VoteCast(address voter, uint256 candidateId);                  // Event when a voter casts a vote

    bool private inMetaTx;

    // modifier to restrict access to only owner of this contract
    modifier onlyOwner() { 
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Modifier to restrict access to only NFT owners
    modifier onlyNftOwner() {
        require(SBT_SC(VID_Address).balanceOf(userAddress) > 0, "You must own an SBT");
        _;
    }

    constructor(address _VID_Address, address _relayer) {
        owner = msg.sender;
        VID_Address = _VID_Address;
        voteCount = 0;
        relayer = _relayer;
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
        // Ensure candidateId does not already exist
        require( !candidateExists[_candidateId], "Candidate with this ID already exists");

        // Create a unique hash for the party and area combination
        bytes32 partyAreaKey = keccak256(abi.encodePacked(_area, _party));
        require( !partyInAreaExists[partyAreaKey], "This party already has a candidate in this area");

        // Mark that the party now has a candidate in this area
        partyInAreaExists[partyAreaKey] = true;

        candidates.push(CandidateStruct(_candidateName, _candidateId, _area, _party));
        candidateExists[_candidateId] = true;

        emit CandidateAdded(_candidateName, _candidateId); // Emit event
    }

    // Delete a candidate
    function deleteCandidate(uint256 _candidateId) public onlyOwner {
        require(candidateExists[_candidateId], "Candidate with this ID does not exist");

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateId == _candidateId) {
                // Recreate the partyAreaKey to mark the party as no longer having a candidate in this area
                bytes32 partyAreaKey = keccak256(abi.encodePacked(candidates[i].area, candidates[i].party));
                partyInAreaExists[partyAreaKey] = false;  // Update the partyInAreaExists mapping

                // Remove the candidate
                candidates[i] = candidates[candidates.length - 1];
                candidateExists[_candidateId] = false;

                candidates.pop();
                break;
            }
        }
    }

    // Get total number of candidates
    function totalCandidates() public view returns (uint256) {
        return candidates.length;
    }

    function getAllCandidates() public view returns (CandidateStruct[] memory allCandidates) {
        return candidates;
    }
    
    // Only SBT holder can vote
    function vote(uint256 _candidateId) public onlyNftOwner returns (string memory) {
        require(inMetaTx, "Only through relayer Voting is possible");        
        require(isValidCandidate(_candidateId), "Invalid candidate ID");
        require(!hasVoted[userAddress], "You have already voted");

        votes[_candidateId]++;  // Increment the vote count for the given candidateId
        voteCount++;
        hasVoted[userAddress] = true;
        emit VoteCast(userAddress, _candidateId);  // Emit event with candidateId
        return string(abi.encodePacked("Voted successfully"));
    }

    // Checks if a candidate ID is present or not
    function isValidCandidate(uint256 _candidateId) internal view returns (bool) {
        return candidateExists[_candidateId];
    }

    // Function to get vote count of a candidate
    function getVoteCount(uint256 _candidateId) public view onlyOwner returns (uint256) {
        return votes[_candidateId];
    }

    // Function to get total vote counts for all candidates
    function totalVotes() public view onlyOwner returns (uint256) {
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
