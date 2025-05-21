import k from "../kaplayCtx";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";
import { inventory, inventoryPage, Box } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    const spacing = 6;
    const xIndent = 36
    const yIndent = 10;

    let page = inventoryPage[0];
    console.log(page);

    if (page != 0) {
        const button = k.add([k.sprite("pagearrowleft"), k.pos(10, screenHeight / 2 + menuHeight - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            inventoryPage[0]--;
            k.go("inventoryScene");
        });
    }
    if (inventory.length > (page + 1) * 54) {
        const button = k.add([k.sprite("pagearrowright"), k.pos(screenWidth - 160, screenHeight / 2 + menuHeight - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            inventoryPage[0]++;
            k.go("inventoryScene");
        });
    }

    k.onUpdate(() => {
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
    });
}