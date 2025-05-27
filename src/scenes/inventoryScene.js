import k from "../kaplayCtx";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";
import { inventory, displayItems } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    if (inventory.length == 0) {
        k.add([k.text("you broke cuh", {size: 36, font: "pkmn"}), k.pos(screenWidth / 2 - 13 * 14, screenHeight / 2 + menuHeight)])
    }

    displayItems(inventory, "inventoryScene", 36, screenWidth - 36, menuHeight + 10, screenHeight - 10, 200, 150, 6);
}