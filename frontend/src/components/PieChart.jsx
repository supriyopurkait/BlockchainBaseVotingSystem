import React from 'react';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { PieChart, pieArcLabelClasses, pieArcClasses } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const PieDiagram = ({ title, total, data = [], winner, fontsize, sizeH, sizeW, margin, padding, cx, cy, innerRadius, outerRadius }) => {

    return (
        <div className="PieDiagram flex flex-col justify-center p-2" tabIndex="0">
            <h2 className="text-justify text-2xl font-bold pl-2">{title}</h2>
            <div className="flex-grow">
                <PieChart
                tabIndex="0"
                series={[
                    {
                    data: data,
                    valueFormatter: (v, { dataIndex }) => {
                        if (data[dataIndex].label === winner){
                            return `(Winner) ${v.value} votes`;
                        }
                        return `${v.value} votes`;
                    },
                    arcLabel: (item) => {
                        return `${Math.round((item.value/total)*100)}%`;
                    },
                    Label: (item) => {
                        return `${Math.round((item.value/total)*100)}%`;
                    },
                    // arcLabel: (item) => `${item.value}%-> ${item.label}`,
                    arcLabelsRadiusOffset: 0,
                    arcLabelMinAngle: 15,
                    arcLabelRadius: '40%',
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: innerRadius, additionalRadius: -20, color: 'gray' },
                    highlighted: { innerRadius: 20, additionalRadius: 10 },
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
                slotProps={{
                    legend: {
                    // hidden: true,
                    labelStyle: {
                        // tableLayout: 'fixed',
                        fontSize: 17,
                        fontFamily: 'Arial',
                        fill: 'black',
                    },
                    direction: 'column',
                    layout: 'vertical',
                    position: {
                        horizontal: 'middle',
                        vertical: 'bottom',
                    },
                    padding: 5,
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    markGap: 4,
                    itemGap: 15,
                    onItemClick: (event, context, index) => {
                            alert(index);
                        }
                    },
                }}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                    fill: '#000000',
                    fontSize: fontsize,
                    },
                    [`& .${legendClasses.root}`]: {
                    transform: 'translate(0px, 0px)',
                    },
                }}
                tooltip={{ trigger: 'item' }}
                height={sizeH}
                width={sizeW}
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