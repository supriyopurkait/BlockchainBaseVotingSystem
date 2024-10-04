import React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const PieDiagram = ({ title, data, size, mgr, cx, cy, ir, or }) => {
    return (
        <div className="PieDiagram bg-white flex flex-col justify-center rounded-2xl shadow-md m-2 p-4">
            <h2 className="text-justify text-2xl font-bold">{title}</h2>
            <div className="">
                <PieChart
                series={[
                    {
                    data: data,
                    arcLabel: (item) => `${item.value}%  ${item.label}`,
                    arcLabelsRadiusOffset: 10,
                    arcLabelMinAngle: 10,
                    arcLabelRadius: '90%',
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: ir,
                    outerRadius: or,
                    paddingAngle: 5,
                    cornerRadius: 10,
                    startAngle: 0,
                    endAngle: 360,
                    cx: cx,
                    cy: cy,
                    animate: true,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                    fill: '#000000',
                    fontSize: 20,
                    },
                }}
                height={size}
                width={size}
                legend={{ hidden: true }}
                margin={mgr}
                />
            </div>
        </div>
    );
};

export default PieDiagram;

// data: [
//     { id: 0, value: 10, label: 'Candidate 1', color: '#1BE7FF' },
//     { id: 1, value: 15, label: 'Candidate 2', color: '#6EEB83' },
//     { id: 2, value: 20, label: 'Candidate 3', color: '#E4FF1A' },
// ],