const svg = d3.select('svg');

d3.json('./menu.json').then(data => {

  // create scaler in y axis(shrink number at some ratio)
  const y = d3.scaleLinear()
    .domain([0, 1000]) // max/min
    .range([0 ,500]) // shrink to what max/min
  
  // join data to rect (only one rect element)
  const rect = svg.selectAll('rect')
    .data(data)

  // set rect attr (only one)
  rect.attr('width', 50)
    .attr('height', d => y(d.orders)) // input into scaler
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70)

  // append the enter selection to rect (rest data)
  rect.enter()
    .append('rect')
      .attr('width', 50)
      .attr('height', d => y(d.orders)) // input into scaler
      .attr('fill', 'orange')
      .attr('x', (d, i) => i * 70)

})