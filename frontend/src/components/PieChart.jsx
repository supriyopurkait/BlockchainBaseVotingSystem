import React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const PieDiagram = ({ title, total, data = [], fontsize, sizeH, sizeW, margin, padding, cx, cy, innerRadius, outerRadius }) => {

    return (
        <div className="PieDiagram w-max flex flex-col justify-center p-2">
            <h2 className="text-justify text-2xl font-bold pl-2">{title}</h2>
            <div className="">
                <PieChart
                series={[
                    {
                    data: data,
                    arcLabel: (item) => `${Math.round((item.value/total)*100)}%`,
                    // arcLabel: (item) => `${item.value}%-> ${item.label}`,
                    arcLabelsRadiusOffset: 0,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: '50%',
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
                    paddingAngle: 1,
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
                    fontSize: fontsize,
                    },
                }}
                height={sizeH}
                width={sizeW}
                legend={{ hidden: false }}
                margin={margin}
                padding={padding}
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