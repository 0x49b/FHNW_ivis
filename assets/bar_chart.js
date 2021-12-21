// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 250, left: 50},
    width = 400 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#bar_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/ages.csv").then(function (data) {

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1);


    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => (d.group));

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.1])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        //.call(d3.axisBottom(x).tickSizeOuter(0));
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 2500])
        .range([height, 0]);
    /*svg.append("g")
        .call(d3.axisLeft(y));
    */
    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#000000', '#3E3E3E', '#727272', '#9a9999', '#e0e0e0'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")

        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())

})