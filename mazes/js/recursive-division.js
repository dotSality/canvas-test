const SMALLEST_SIZE = 60;
const DivideOrientation = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
}

const random = (min, max, step = 1) => Math.trunc((Math.random() * ((max - min) / step))) * step + min;

const getDivideOrientation = (width, height) => {
    if (width > height) {
        return DivideOrientation.VERTICAL;
    } else if (width < height) {
        return DivideOrientation.HORIZONTAL;
    } else {
        return Math.random() > 0.5 ? DivideOrientation.VERTICAL : DivideOrientation.HORIZONTAL;
    }
}

const excludedDots = new Map();

const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const width = canvas.width, height = canvas.height;

ctx.fillStyle = "black";
ctx.lineWidth = 1;

const dimensions = {
    x0: 0,
    y0: 0,
    x1: width,
    y1: height,
}

const drawBorder = () => {
    ctx.beginPath();
    ctx.moveTo(dimensions.x0, dimensions.y0);
    ctx.lineTo(dimensions.x1, dimensions.y0);
    ctx.lineTo(dimensions.x1, dimensions.y1);
    ctx.lineTo(dimensions.x0, dimensions.y1);
    ctx.lineTo(dimensions.x0, dimensions.y0);
    ctx.stroke();
}

drawBorder();

const divide = (x0, y0, width, height) => {
    if (width === SMALLEST_SIZE && height === SMALLEST_SIZE) return;

    const x1 = x0 + width, y1 = y0 + height;
    const direction = getDivideOrientation(width, height);

    const Xd0 = direction === DivideOrientation.HORIZONTAL ? x0 : random(x0, x1, SMALLEST_SIZE);
    const Yd0 = direction === DivideOrientation.VERTICAL ? y0 : random(y0, y1, SMALLEST_SIZE);

    const Xd = direction === DivideOrientation.VERTICAL ? Xd0 : Xd0 + width;
    const Yd = direction === DivideOrientation.HORIZONTAL ? Yd0 : Yd0 + height;

    const zones = [

    ]

    ctx.beginPath();
    ctx.moveTo(Xd0, Yd0);
    ctx.lineTo(Xd, Yd);
    ctx.stroke();

    return zones;
}

divide(...Object.values(dimensions));