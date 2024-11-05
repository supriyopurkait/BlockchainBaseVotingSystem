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
    console.log('recived data before process: ', data.data[0].candidates[0].candidate_name);
    console.log('data.data.candidates before process: ', typeof(data.data[0].candidates));
    console.log('data.data before process: ', typeof(data.data));
    const AreaData = data.data.map((area, index) => ({
    // const AreaData = Object.entries(data).map((index, area) => ({
        id: index,
        areaName: area.area,
        totalVotes: area.max_votes,
        winner: area.winner.candidate_name,
        wonByVotes: area.winner.vote_count,
        statData: area.candidates.map((candidate, idx) => ({
            id: idx,
            value: candidate.vote_count,
            label: candidate.candidate_name,
            color: getRandomColor()
        }))
    }));
    console.log('data after process: ', AreaData)
    return (AreaData);
}