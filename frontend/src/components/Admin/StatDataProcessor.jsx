export function calculateTotalVotes(data) {
    const totalVotes = data.reduce((sum, area) => sum + area.maxVotes, 0).toLocaleString();
    return totalVotes;
}
export function processAreaData(data) {
    function getRandomColor() {
        const r = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255
        const g = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255
        const b = Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
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
    return (AreaData);
}