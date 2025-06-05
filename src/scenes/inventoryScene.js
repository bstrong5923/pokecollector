import k from "../kaplayCtx";
import { inventory, displayItems, menu, menuHeight, screenWidth, screenHeight } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    if (inventory.length == 0) {
        k.add([k.text("you broke cuh", {size: 36, font: "pkmn"}), k.pos(screenWidth / 2 - 13 * 14, screenHeight / 2 + menuHeight)])
    }
    else {
        let totalvalue = 0;
        for (const item of inventory) {
            totalvalue += item.value;
        }
        k.add([k.text("Total Value: *" + totalvalue, { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 10 * ((totalvalue + 1) % 10 + 14), menuHeight + 24)]);
    }

    displayItems(inventory, "inventoryScene", 20, screenWidth - 20, menuHeight + 24, menuHeight + screenHeight - 50, 200, 150, 6);

    for (const item of inventory) {
        item.setScale(1);
    }
}