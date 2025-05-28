import k from "../kaplayCtx";
import { inventory, displayItems, menu, menuHeight, screenWidth, screenHeight } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    if (inventory.length == 0) {
        k.add([k.text("you broke cuh", {size: 36, font: "pkmn"}), k.pos(screenWidth / 2 - 13 * 14, screenHeight / 2 + menuHeight)])
    }

    displayItems(inventory, "inventoryScene", 0, screenWidth, menuHeight, screenHeight, 200, 150, 6);
}