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

// scales
// create scaler in y axis(shrink number at some ratio)
const y = d3.scaleLinear()
    .range([graphHeight, 0]) // shrink to what max/min

// create scaler in x axis(bandscales)
const x = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.2) // add x padding inner
  .paddingOuter(0.2); // add x padding outer

// create the axes
const xAxis = d3.axisBottom(x) // input x scaler
const yAxis = d3.axisLeft(y) // input y scaler
  .ticks(3)
  .tickFormat(d => d + ' orders');

// update x axis text
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')

// update function
const update = (data) => {

  // updating scale domains
  y.domain([0, d3.max(data, d => d.orders)]);
  x.domain(data.map(item => item.name)) // ['veg soup', ...]

  // join the data to rects
  const rects = graph.selectAll('rect')
    .data(data);

  // remove rect that don't need
  rects.exit().remove();

  // update current shapes in dom
  rects.attr('width', x.bandwidth) 
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    // .transition().duration(1000)
    //   .attr('y', d => y(d.orders)) 
    //   .attr('height', d => graphHeight - y(d.orders)) 

  // append the enter selection to the DOM
  rects.enter()
  .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', 0) // start
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    .attr('y', graphHeight) //start
    .merge(rects) // all rect apply code display in next lines
    .transition().duration(2000) // add transistion
      .attr('y', d => y(d.orders)) // end(decide direction -> go up)
      .attr('height', d => graphHeight - y(d.orders)) // end

  // call axes  
  xAxisGroup.call(xAxis); // put xAxis into xAxisGroup
  yAxisGroup.call(yAxis); // put yAxis into yAxisGroup
};


let data = [];
// get data from firestore
db.collection('dishes').onSnapshot(res => {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id};

    switch(change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

    console.log(change);
    
  });

  update(data);
})

// TWEENS

const widthTween = (d) => {
  
}






// // get data from firestore
// db.collection('dishes').get().then(res => {

//   const data = [];
//   res.docs.forEach(doc => {
//     data.push(doc.data());
//   });

//   update(data);

// });