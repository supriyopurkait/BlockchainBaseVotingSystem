export function calculateTotalVotes(data) {
    const totalVotes = data.data.reduce((sum, area) => sum + area.max_votes, 0).toLocaleString();
    return totalVotes;
}
export function processAreaData(data) {
    function getRandomColor() {
        const r = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255
        const g = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255
        const b = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    const AreaData = data.data.map((area, index) => ({
        id: index,
        areaName: area.area,
        totalVotes: area.max_votes,
        winner: area.winners[0].candidate_name,
        wonByVotes: area.winners[0].vote_count,
        statData: area.candidates.map((candidate, idx) => ({
            id: idx,
            value: area.max_votes?candidate.vote_count:1,
            label: candidate.candidate_name,
            color: area.max_votes?getRandomColor():'#D1CFD6'
        }))
    }));
    return (AreaData);
}