

d3.text("https://raw.githubusercontent.com/lichtwellenreiter/ivis-test/master/data/cybercrime-switzerland-2020.csv")
    .then(d3.csvParse)
    .then(tryData);


const rectangle = document.getElementById("bar-chart");


//rectangle.onmouseleave = e => moreData.style.display = "none";
close.onclick = _ => moreData.style.display = 'none';

function tryData(data) {

    let bubbles1 = d3.select("#bar-chart")
        .append("svg")
        .attr("width", 900)
        .attr("id", "bubbles1");

    let r = 5;
    let cx = r;
    let cy = r;
    let m = r + 2;

    let previousTitle = "";
    const categories = getCategories(data)

    console.log(categories)

    categories.forEach((it, idx) => {

        const cases_for_cat = getCasesForCategory(data, it);
        const circles = calcPoints(cases_for_cat);
        let colorVal = '#000000';


        for (let c = 0; c < circles; c++) {

            //(idx % 2 === 0) ? colorVal = '#000000' : colorVal = '#ffffff';

            bubbles1.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("id", c)
                .attr("data-title", it)
                .attr("fill", colorVal)
                .attr("r", r);

            cx += r + m;
            if (cx >= rectangle.getBoundingClientRect().width) {
                cy += r + m;
                cx = r;
            }
        }
        cx = r;
        cy += 20;
    });

    rectangle.style.height = cy + "px";
    const bubbles1Svg = document.getElementById("bubbles1");
    bubbles1Svg.setAttribute("height", (cy + r) + "px");
}


const getCategories = data => {
    const categories = [];
    data.forEach(d => categories.push(d.category));
    return [...new Set(categories)];
}

const getCasesForCategory = (data, category) => {
    let cases = 0;
    data.forEach(d => {
        (d.category === category) ? cases += parseInt(d.cases) : "";
    });
    return cases;
}






function calcPoints(numberOfCases) {
    const c = (Math.ceil(numberOfCases / 10) * 10) / 10;
    return (c > 0) ? c : 1;
}

