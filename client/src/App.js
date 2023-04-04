import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LineChart } from "./LineChart";


function App() {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:5000');
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const width = 900;
    const voronoi = false
    const svg = d3.select(svgRef.current);
    console.log(data)

    const transformedData = [];

    for (const item of data) {
      const pollenEntries = Object.entries(item.pollen);
      
      for (const [pollen, value] of pollenEntries) {
        transformedData.push({
          pollen: pollen,
          value: value,
          date: new Date(item.date),
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });
      }
    }

    console.log(transformedData)
    const chart = LineChart(transformedData, svg, {
      x: d => d.date,
      y: d => d.value + (Math.random() * 0.2 - 0.1),
      z: d => d.pollen,
      // color: d => d.color,
      yLabel: "Pollen Count",
      width,
      height: 500,
      color: "steelblue",
      voronoi // if true, show Voronoi overlay
    })
    // if (data.length > 0) {
    //   const svg = d3.select(svgRef.current);
    //   const width = svg.attr('width');
    //   const height = svg.attr('height');
    //   const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    //   const x = d3.scaleLinear()
    //     .domain(d3.extent(data, d => d.x))
    //     .range([margin.left, width - margin.right]);
    //   const y = d3.scaleLinear()
    //     .domain([0, d3.max(data, d => d.y)])
    //     .nice()
    //     .range([height - margin.bottom, margin.top]);
    //   const line = d3.line()
    //     .x(d => x(d.x))
    //     .y(d => y(d.y));
    //   svg.append('g')
    //     .attr('transform', `translate(0,${height - margin.bottom})`)
    //     .call(d3.axisBottom(x));
    //   svg.append('g')
    //     .attr('transform', `translate(${margin.left},0)`)
    //     .call(d3.axisLeft(y));
    //   svg.append('path')
    //     .datum(data)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'steelblue')
    //     .attr('stroke-width', 1.5)
    //     .attr('d', line);
    // }
  }, [data]);

  return (
    <div>
      <h1>Data:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.date}</li>
        ))}
      </ul>
      <div>
        <h1>Line Plot</h1>
        <svg ref={svgRef} width={500} height={300}></svg>
      </div>
    </div>
  );
}

export default App;