import kaplay from "kaplay";

export const screenWidth = 1920;
export const screenHeight = 1080;

const k = kaplay({
    width: screenWidth,
    height: screenHeight,
    letterbox: true,
    background: [20, 20, 20],
    global: false,
    debugKey: "d",
    debug: true,
});

export default k;