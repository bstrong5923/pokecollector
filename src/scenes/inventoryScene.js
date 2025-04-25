import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function inventoryScene() {
    k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2, screenHeight / 2)]);
}