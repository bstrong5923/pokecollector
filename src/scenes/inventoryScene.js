import k from "../kaplayCtx";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";
import { inventory, Box } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    for (let x = 0; x < 80; x++) {
        inventory.push(new Box());
    }

    const spacing = 6;
    const xIndent = 36
    const yIndent = 10;

    let page = 0;

    let x = xIndent
    let y = menuHeight + yIndent;
    for (let i = page * 54; i < inventory.length && i < (page + 1) * 54; i++) {
        const item = inventory[i];
        item.add(x, y);
        x += 200 + spacing;
        if (x > screenWidth - 200 - xIndent) {
            y += 150 + spacing;
            x = xIndent;
        }
    }
}