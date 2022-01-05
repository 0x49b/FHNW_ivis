const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');

const section = document.getElementsByClassName("fp-tableCell")[0]

let w = canvas.width = document.body.offsetWidth;
//let h = canvas.height = document.body.offsetHeight;
let matrixHeight = canvas.height = section.getBoundingClientRect().height;

console.log(section.getBoundingClientRect().height);

const cols = Math.floor(w / 20) + 1;
const ypos = Array(cols).fill(0);

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, matrixHeight);


function roundedRect(ctx, options) {
    ctx.strokeStyle = options.color;
    ctx.fillStyle = options.color;
    ctx.lineJoin = "round";
    ctx.lineWidth = options.radius;

    ctx.strokeRect(
        options.x + (options.radius * .5),
        options.y + (options.radius * .5),
        options.width - options.radius,
        options.height - options.radius
    );

    ctx.fillRect(
        options.x + (options.radius * .5),
        options.y + (options.radius * .5),
        options.width - options.radius,
        options.height - options.radius
    );

    ctx.stroke();
    ctx.fill();
}


function matrix() {

    ctx.fillStyle = 'rgba(246,220,0,0.1)';
    ctx.fillRect(0, 0, w, matrixHeight);

    ctx.fillStyle = '#000';
    ctx.font = '15pt monospace';

    ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
    });

    cybercrime();
}

function cybercrime() {

    roundedRect(ctx, {
        x: (w / 2) - 300,
        y: (matrixHeight / 2) - 150,
        width: 600,
        height: 300,
        radius: 40,
        color: "#000"
    });

    ctx.font = "100px Patua One";
    ctx.fillStyle = 'rgba(246,220,0,1.0)';
    ctx.fillText("Cybercrime", (w / 2) - 250, (matrixHeight / 2) + (110 - 150));

    ctx.font = "20px Montserrat";
    ctx.fillStyle = 'rgba(246,220,0,1.0)';
    ctx.fillText("scroll down", (w / 2) - 50, (matrixHeight / 2) + (170 - 150) );

    let arrow = new Image();
    arrow.onload = function () {
        ctx.drawImage(arrow, (w / 2) - 15, (matrixHeight / 2) + (200 - 150), 37, 36);
    };
    arrow.src = "./assets/arrow_down.svg";
}


setInterval(matrix, 50);
