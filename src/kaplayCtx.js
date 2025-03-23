import kaplay from "kaplay";

export const screenWidth = 1290;
export const screenHeight = 1080;

const k = kaplay({
    width: screenWidth,
    height: screenHeight,
    letterbox: true,
    background: [0, 0, 0],
    global: false,
    debugKey: "d",
    debug: true,
});

export default k;