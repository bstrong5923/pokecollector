import kaplay from "kaplay";

export const kScreenWidth = 1920;
export const kScreenHeight = 1080;

const k = kaplay({
    width: kScreenWidth,
    height: kScreenHeight,
    letterbox: true,
    background: [20, 20, 20],
    global: false,
    debugKey: "d",
    debug: true,
});

export default k;