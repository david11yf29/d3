const svg = d3.select('svg');

d3.json('./menu.json').then(data => {
  
  // join data to rect (only one rect element)
  const rect = svg.selectAll('rect')
    .data(data)

  rect.attr('width', 50)
    .attr('height', d => d.orders)
    .attr('fill', 'orange')
    .attr('x', (d,i) => i * 70)

})