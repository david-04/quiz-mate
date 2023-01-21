// https://github.com/shrhdk/text-to-svg
// npm install text-to-svg

// font: https://fonts.google.com/specimen/Quicksand

const textToSVG = require("text-to-svg").loadSync("Quicksand-Regular.ttf");

const attributes = { fill: "white" };
const options = { x: 0, y: 0, fontSize: 24, anchor: "top", attributes: attributes };

const svg = textToSVG.getSVG("quiz mate", options);

console.log(svg);
