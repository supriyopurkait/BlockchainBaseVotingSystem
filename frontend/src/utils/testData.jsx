import Face from 'pub/picture/face_img.png';
import Add from 'pub/picture/Add_Candidate.png';


export const totalVotes = "9,884,153";

export const statData = [
    { id: 0, value: 10, label: 'Sancharita Dutta', color: '#1BE7FF' },
    { id: 1, value: 15, label: 'Soumya Samanta', color: '#6EEB83' },
    { id: 2, value: 20, label: 'Supriyo Purkait', color: '#E4FF1A' },
];

export const AreaData = [
    {id:0, areaName:"area 1", totalVotes:100, winner:"Sancharita Dutta", wonByVotes:10, statData:[ 
        { id: 0, value: 28, label: 'Sancharita Dutta', color: '#8338EC'},
        { id: 1, value: 18, label: 'Soumya Samanta', color: '#FB5607' },
        { id: 2, value: 18, label: 'Supriyo Purkait', color: '#FF006E' },
        { id: 3, value: 18, label: 'Sajal Paul', color: '#FFBE0B' },
        { id: 4, value: 18, label: 'Subhasish Mondal', color: '#3A86FF' },
    ]},
    {id:1, areaName:"area 2", totalVotes:100, winner:"Soumya Samanta", wonByVotes:20, statData:[ 
        { id: 0, value: 16, label: 'Sancharita Dutta', color: '#8338EC'},
        { id: 1, value: 26, label: 'Soumya Samanta', color: '#FB5607' },
        { id: 2, value: 16, label: 'Supriyo Purkait', color: '#FF006E' },
        { id: 3, value: 16, label: 'Sajal Paul', color: '#FFBE0B' },
        { id: 4, value: 16, label: 'Subhasish Mondal', color: '#3A86FF' },
    ]},
    {id:2, areaName:"area 3", totalVotes:100, winner:"Supriyo Purkait", wonByVotes:30, statData:[ 
        { id: 0, value: 14, label: 'Sancharita Dutta', color: '#8338EC'},
        { id: 1, value: 14, label: 'Soumya Samanta', color: '#FB5607' },
        { id: 2, value: 34, label: 'Supriyo Purkait', color: '#FF006E' },
        { id: 3, value: 14, label: 'Sajal Paul', color: '#FFBE0B' },
        { id: 4, value: 14, label: 'Subhasish Mondal', color: '#3A86FF' },
    ]},
    {id:3, areaName:"area 4", totalVotes:100, winner:"Sajal Paul", wonByVotes:40, statData:[ 
        { id: 0, value: 12, label: 'Sancharita Dutta', color: '#8338EC'},
        { id: 1, value: 12, label: 'Soumya Samanta', color: '#FB5607' },
        { id: 2, value: 12, label: 'Supriyo Purkait', color: '#FF006E' },
        { id: 3, value: 42, label: 'Sajal Paul', color: '#FFBE0B' },
        { id: 4, value: 12, label: 'Subhasish Mondal', color: '#3A86FF' },
    ]},
    {id:4, areaName:"area 5", totalVotes:100, winner:"Subhasish Mondal", wonByVotes:50, statData:[ 
        { id: 0, value: 10, label: 'Sancharita Dutta', color: '#8338EC'},
        { id: 1, value: 10, label: 'Soumya Samanta', color: '#FB5607' },
        { id: 2, value: 10, label: 'Supriyo Purkait', color: '#FF006E' },
        { id: 3, value: 10, label: 'Sajal Paul', color: '#FFBE0B' },
        { id: 4, value: 60, label: 'Subhasish Mondal', color: '#3A86FF' },
    ]},
];

export const dummyCandidates = [
{
    id: 1,
    photo: Face,
    name: 'Alice Johnson',
    candidate_id: '1',
    area: 'area1',
    party: 'Progressive Party'
},
{
    id: 2,
    photo: Face,
    name: 'Bob Smith',
    candidate_id: '2',
    area: 'area2',
    party: 'Liberal Party'
},
{
    id: 3,
    photo: Face,
    name: 'Charlie Brown',
    candidate_id: '3',
    area: 'area3',
    party: 'Conservative Party'
},
{
    id: 4,
    photo: Face,
    name: 'Diana Prince',
    candidate_id: '4',
    area: 'area4',
    party: 'Libertarian Party'
},
{
    id: 5,
    photo: Face,
    name: 'Ethan Hunt',
    candidate_id: '5',
    area: 'area5',
    party: 'Independent'
}
];

export const newCandidate = [{
    id: 9999,
    photo: Add,
    name: 'Add Candidate',
    candidate_id: '',
    area: '',
    party: ''
}];