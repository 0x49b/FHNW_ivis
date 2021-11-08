d3.text("./src/data/cybercrime-switzerland-2020.csv")
    .then(d3.csvParse)
    .then(charting);

//.then(BubbleChart(data, {}));

function logging(data) {
    console.table(data)
}

function charting(data) {

    const rect = document.getElementById("rectangle");
    let chart = BubbleChart(data, {
        label: d => d.title,//[...d.id.split(".").pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString("en")].join("\n"),
        value: d => d.cases,
        group: d => d.group,
        title: d => d.title,
        link: d => "bla",//`https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, "/")}.as`,
        width: 1152
    });
    rect.append(chart);
}


function BubbleChart(data, {
    name = ([x]) => x, // alias for label
    label = name, // given d in data, returns text to display on the bubble
    value = ([, y]) => y, // given d in data, returns a quantitative size
    group, // given d in data, returns a categorical value for color
    title, // given d in data, returns text to show on hover
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = width, // outer height, in pixels
    padding = 3, // padding between circles
    margin = 1, // default margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    groups, // array of group names (the domain of the color scale)
    colors = d3.schemeTableau10, // an array of colors (for groups)
    fill = "#ccc", // a static fill color, if no group channel is specified
    fillOpacity = 0.7, // the fill opacity of the bubbles
    stroke, // a static stroke around the bubbles
    strokeWidth, // the stroke width around the bubbles, if any
    strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
    // Compute the values.
    const D = d3.map(data, d => d);
    const V = d3.map(data, value);
    const G = group == null ? null : d3.map(data, group);
    const I = d3.range(V.length).filter(i => V[i] > 0);

    // Unique the groups.
    if (G && groups === undefined) groups = I.map(i => G[i]);
    groups = G && new d3.InternSet(groups);

    // Construct scales.
    const color = G && d3.scaleOrdinal(groups, colors);

    // Compute labels and titles.
    const L = label == null ? null : d3.map(data, label);
    const T = title === undefined ? L : title == null ? null : d3.map(data, title);

    // Compute layout: create a 1-deep hierarchy, and pack it.
    const root = d3.pack()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .padding(padding)
        (d3.hierarchy({children: I})
            .sum(i => V[i]));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, -marginTop, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("fill", "currentColor")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

    const leaf = svg.selectAll("a")
        .data(root.leaves())
        .join("a")
        .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
        .attr("target", link == null ? null : linkTarget)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    leaf.append("circle")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
        .attr("fill-opacity", fillOpacity)
        .attr("r", d => d.r);

    if (T) leaf.append("title")
        .text(d => T[d.data]);

    if (L) {
        // A unique identifier for clip paths (to avoid conflicts).
        const uid = `O-${Math.random().toString(16).slice(2)}`;

        leaf.append("clipPath")
            .attr("id", d => `${uid}-clip-${d.data}`)
            .append("circle")
            .attr("r", d => d.r);

        leaf.append("text")
            .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
            .selectAll("tspan")
            .data(d => `${L[d.data]}`.split(/\n/g))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
            .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
            .text(d => d);
    }

    return Object.assign(svg.node(), {scales: {color}});
}


/*
let width = 960,
    height = 500,
    padding = 0, // separation between same-color nodes
    clusterPadding = 0, // separation between different-color nodes
    maxRadius = 20,
    minRadius = 5,
    csvURL = "./src/data/cybercrime-switzerland-2020.csv"; //"https://gitlab.fhnw.ch/joyce.haenggi/ivis/-/raw/master/src/data/cybercrime-switzerland-2020.csv"


d3.csv(csvURL, function (data) {
    //calculate teh maximum group present
    m = d3.max(data, (d) => d.group);
    //create teh color categories
    color = d3.scale.category10().domain(d3.range(m));
    //make teh clusters array each cluster for each group
    clusters = new Array(m);
    dataset = data.map(function (d) {
        //find the radius intered in the csv
        let r = parseInt(d.cases / 10);
        let dta = {
            cluster: d.group,//group
            name: d.title,//label
            radius: r,//radius
            x: Math.cos(d.group / m * 2 * Math.PI) * 100 + width / 2 + Math.random(),
            y: Math.sin(d.group / m * 2 * Math.PI) * 100 + height / 2 + Math.random()
        };
        //add the one off the node inside teh cluster
        if (!clusters[d.group] || (d.radius > clusters[d.group].radius)) clusters[d.group] = dta;
        return dta;
    });
    //after mapping use that t make the graph
    makeGraph(dataset);
});

//this will make the grapg from nodes
function makeGraph(nodes) {
    let force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();

    let svg = d3.select("#rectangle").append("svg")
        .attr("width", width)
        .attr("height", height);

    let node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("g").call(force.drag);

    //addcircle to the group
    node.append("circle")
        .style("fill", function (d) {
            return color(d.cluster);
        }).attr("r", function (d) {
        return d.radius
    })
    //add text to the group
    node.append("text")
        .text(function (d) {
            return d.name;
        })
        .attr("dx", -10)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name
        })
        .style("stroke", "none");


    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            //.attr("transform", functon(d) {});
            .attr("transform", function (d) {
                let k = "translate(" + d.x + "," + d.y + ")";
                return k;
            })

    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {
            let cluster = clusters[d.cluster];
            if (cluster === d) return;
            let x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        let quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            let r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    let x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}
*/
