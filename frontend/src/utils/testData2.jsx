// Static data
export const data = [
    {"area": "area1", "maxVotes": 100, "candidates": [
        {"id": 1, "candidateId": "1", "candidateName": "cand1", "voteCount": 20, "party": "Party 1"},
        {"id": 2, "candidateId": "2", "candidateName": "cand2", "voteCount": 20, "party": "Party 2"},
        {"id": 3, "candidateId": "3", "candidateName": "cand3", "voteCount": 10, "party": "Party 3"}
    ],
    "winner": {"id": 1, "candidateId": "1", "candidateName": "cand1", "voteCount": 20, "party": "Party 1"},
    "message": "Winner determined by lottery"
    },
    {"area": "area2", "maxVotes": 60, "candidates": [
        {"id": 1, "candidateId": "4", "candidateName": "cand1", "voteCount": 10, "party": "Party 1"},
        {"id": 2, "candidateId": "5", "candidateName": "cand2", "voteCount": 20, "party": "Party 2"},
        {"id": 3, "candidateId": "6", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"}
    ],
    "winner": {"id": 3, "candidateId": "6", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"},
    "message": "Winner determined"
    },
    {"area": "area3", "maxVotes": 40, "candidates": [
        {"id": 1, "candidateId": "7", "candidateName": "cand1", "voteCount": 10, "party": "Party 1"},
        {"id": 2, "candidateId": "8", "candidateName": "cand2", "voteCount": 20, "party": "Party 2"},
        {"id": 3, "candidateId": "9", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"}
    ],
    "winner": {"id": "3", "candidateId": "9", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"},
    "message": "Winner determined"
    }
];
export function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}


const totalVotes = data.reduce((sum, area) => sum + area.maxVotes, 0).toLocaleString();
// Generate statData (overall statistics)
const statData = data.flatMap(area => area.candidates).reduce((acc, candidate) => {
    const existingCandidate = acc.find(c => c.label === candidate.candidateName);
    if (existingCandidate) {
        existingCandidate.value += candidate.voteCount;
    } 
    else {
        acc.push({id: acc.length, value: candidate.voteCount, label: candidate.candidateName, color: getRandomColor()});
    }
    return acc;
}, []);

// Generate AreaData
const AreaData = data.map((area, index) => ({
    id: index,
    areaName: area.area,
    totalVotes: area.maxVotes,
    winner: area.winner.candidateName,
    wonByVotes: area.winner.voteCount,
    statData: area.candidates.map((candidate, idx) => ({
        id: idx,
        value: candidate.voteCount,
        label: candidate.candidateName,
        color: getRandomColor()
    }))
}));

// Helper function to generate random colors
// Export the data
export { totalVotes, statData, AreaData };