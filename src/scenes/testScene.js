import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../constants";

export default function testScene() {
    k.add([k.sprite("6-mega-x"), k.pos(screenWidth / 2, screenHeight / 2)]);
}