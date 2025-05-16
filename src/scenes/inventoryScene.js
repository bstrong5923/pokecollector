import k from "../kaplayCtx";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";
import { inventory, Box } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    const spacing = 5;

    let x = spacing
    let y = menuHeight + spacing
    for ( const item of inventory ) {
        item.add(x, y);
        x += 200 + spacing;
    }

    k.add([k.text(inventory.length, {size: 36, font: "pkmn"}), k.pos(screenWidth / 2, screenHeight / 2 + menuHeight)]);
}