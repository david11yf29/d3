// under canvas class append svg element
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins and dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100}
const graphWidth = 600 - margin.right - margin.left;
const graphHeight = 600 - margin.top - margin.bottom;

// under svg element append graph(g) element for margin
const graph = svg.append('g') // graph(g) core content
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// create x axis
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

// create y axis
const yAxisGroup = graph.append('g');

db.collection('dishes').get().then(res => {
  const data = [];
  res.docs.forEach(doc => {
    data.push(doc.data());
  })

  // find min/max value in data
  const min = d3.min(data, d => d.orders);
  const max = d3.max(data, d => d.orders);
  const extent = d3.extent(data, d => d.orders); // return array with min, max

  // create scaler in y axis(shrink number at some ratio)
  const y = d3.scaleLinear()
    .domain([0, max]) // max/min
    .range([graphHeight, 0]) // shrink to what max/min

  // create scaler in x axis(bandscales)
  const x = d3.scaleBand()
    .domain(data.map(item => item.name)) // ['veg soup', ...]
    .range([0, 500])
    .paddingInner(0.2) // add x padding inner
    .paddingOuter(0.2); // add x padding outer
  
  // join data to rect(if there is any under graph(g) element)
  const rects = graph.selectAll('rect')
    .data(data)

  // set rect attr
  rects.attr('width', x.bandwidth) // apply x scaler(bandwidth) here is 500/4(items) = 125
    .attr('height', d => graphHeight - y(d.orders)) // input into y scaler
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name)) // input into x scaler
    .attr('y', d => y(d.orders)) // set the start point for y

  // append the rect element under graph(g) for the rest data and set rect attr
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.orders)) // input into y scaler
      .attr('fill', 'orange')
      .attr('x', (d) => x(d.name)) // input inyto x scaler 500/4(items) = 125
      .attr('y', d => y(d.orders)) // set the start point for y

  // create and call the axes
  const xAxis = d3.axisBottom(x) // input x scaler
  const yAxis = d3.axisLeft(y) // input y scaler
    .ticks(3)
    .tickFormat(d => d + ' orders');

  xAxisGroup.call(xAxis); // put xAxis into xAxisGroup
  yAxisGroup.call(yAxis); // put yAxis into yAxisGroup

  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange')
})