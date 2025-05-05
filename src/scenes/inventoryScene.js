import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function inventoryScene() {
    k.add([k.text("Inventory size: "), k.pos(screenWidth / 2, screenHeight / 2)]);
}