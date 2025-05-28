import k from "../kaplayCtx";
import { packs, displayItems, menu, menuHeight, screenWidth, screenHeight } from "../constants";

export default function packsScene() {
    menu("packs");

    displayItems(packs, "packsScene", 0, screenWidth, menuHeight, screenHeight, 300, 225, 6);
}