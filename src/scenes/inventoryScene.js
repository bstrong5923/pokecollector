import k from "../kaplayCtx";
import menu from "../menu";
import { screenHeight, screenWidth, menuHeight } from "../menu";
import inventory from inventory;

export default function inventoryScene() {
    menu();

    k.add([k.text("Inventory size: " + inventory.length), k.pos(screenWidth / 2, screenHeight / 2)]);
}