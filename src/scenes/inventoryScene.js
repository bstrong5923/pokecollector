import k from "../kaplayCtx";
import { inventory, displayItems, menu, menuHeight, screenWidth, screenHeight, page, sortStyle, go, canvas, sortInventory, setSortStyle, toggleStacking, stacking, stackedIndexes, inventoryStacked } from "../constants";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    if (inventory.length == 0) {
        k.add([k.text("you broke cuh", {size: 36, font: "pkmn"}), k.pos(screenWidth / 2 - 13 * 14, screenHeight / 2 + menuHeight)])
    }
    k.add([k.text("Page " + (page + 1), { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 10 * Math.floor(Math.log10(page + 1)) - 88, menuHeight + 24)]);

    let totalvalue = 0;
    for (const item of inventory) {
        totalvalue += item.value;
    }
    k.add([k.text("Total Value: *" + totalvalue, { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 + 450 + 24 * Math.floor(Math.log10(inventory.length + 1)), menuHeight + 24)]);
    k.add([k.text("Used: " + inventory.length + "/500", { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 + 150, menuHeight + 24)]);

    const sortButton = k.add([k.text("Sort by: " + sortStyle, { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 10 * sortStyle.length - 400, menuHeight + 24), k.area()]);
    const sortStyles = ["Time ^", "Time v", "Value ^", "Value v", "Index ^", "Index v"];
    sortButton.onClick(() => {
        for (let s = 0; s < sortStyles.length; s++) {
            if (sortStyle == sortStyles[s]) {
                if (s != sortStyles.length - 1) {
                    setSortStyle(sortStyles[s + 1]);
                }
                else {
                    setSortStyle(sortStyles[0]);
                }
                break;
            }
        }
        go("inventory");
    });
    sortButton.onUpdate(() => {
        if (sortButton.isHovering()) {
            canvas.style.cursor = "pointer";
        }
    })
    const stackbutton = [
        k.add([k.text("Stacking", { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 700, menuHeight + 24), k.area()]),
        k.add([k.sprite("checkbox", { frame: stacking }), k.pos(screenWidth / 2 - 733, menuHeight + 20), k.area(), k.scale(4)]),
    ];
    for (const comp of stackbutton) {
        comp.onClick(() => {
            toggleStacking();
            go("inventory");
        });
    }

    sortInventory();

    displayItems(inventoryStacked, "inventory", 20, screenWidth - 20, menuHeight + 24, menuHeight + screenHeight - 50, 200, 150, 6, "small_", 3, screenWidth / 2 - 138, menuHeight + 24, screenWidth / 2 + 61, menuHeight + 24);

}