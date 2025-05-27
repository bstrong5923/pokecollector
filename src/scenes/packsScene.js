import k from "../kaplayCtx";
import { packs, displayItems } from "../constants";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";

export default function packsScene() {
    menu("packs");

    displayItems(packs, "packsScene", 36, screenWidth - 36, menuHeight + 10, screenHeight - 10, 200, 150, 6);
}