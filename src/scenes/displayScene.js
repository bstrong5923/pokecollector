import k from "../kaplayCtx";
import { displayIndex, menu, menuHeight, screenHeight, screenWidth, canvas, go, inventory, addMoney, changeDisplayIndex, sortInventory, inventoryStacked, stackedIndexes, hoveringTrue } from "../constants";

export default function displayScene() {
    menu();

    const displayItem = inventoryStacked[displayIndex];

    const closebutton = k.add([k.sprite("closebutton"), k.pos(screenWidth - 140, menuHeight + 30), k.area()]);
    closebutton.onUpdate(() => {
        if (closebutton.isHovering()) {
            hoveringTrue();
        }
    });
    closebutton.onClick(() => {
        go("inventory");
    });

    let pagearrowleft;
    let pagearrowright;
    if (displayIndex != 0) {
        pagearrowleft = k.add([k.sprite("pagearrowleft"), k.pos(10, screenHeight / 2 + menuHeight - 55), k.area(), k.layer("1")]);
        pagearrowleft.onClick(() => {
            changeDisplayIndex(-1);
            go("display");
        });
    }
    if (displayIndex != inventoryStacked.length - 1) {
        pagearrowright = k.add([k.sprite("pagearrowright"), k.pos(screenWidth - 120, screenHeight / 2 + menuHeight - 55), k.area(), k.layer("1")]);
        pagearrowright.onClick(() => {
            changeDisplayIndex(1);
            go("display");
        });
    }

    k.onUpdate(() => {
        if ((pagearrowleft != null && pagearrowleft.isHovering()) || (pagearrowright != null && pagearrowright.isHovering())) {
            hoveringTrue();
        }
    });

    const itemY = screenHeight / 2 + menuHeight - 300

    displayItem.add(screenWidth / 2 - 300, itemY);
    displayItem.setScale(3);

    let name = displayItem.name;
    if (stackedIndexes[displayIndex].length > 1) {
        name += " x" + stackedIndexes[displayIndex].length;
    }
    k.add([k.text(name, { size: 48, width: 1200, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 600, itemY + 480)]);

    const sellbutton = k.add([k.sprite("sellbutton"), k.pos(screenWidth / 2 - 77, itemY + 650), k.area()])
    sellbutton.onClick(() => {
        const stack = stackedIndexes[displayIndex];
        const stackSize = stack.length;
        addMoney(displayItem.value);
        inventory.splice(stack[stackSize - 1], 1); // gets rid of the newest duplicate
        sortInventory(); // rebuild stacks so every index is correct again
        try { if (window.saveNow) window.saveNow(); } catch (e) {}

        if (stackSize == 1) {
            go("inventory"); // that was the last one in the stack
        }
        else {
            // stay on this stack: find where it is after the rebuild
            const newIndex = inventoryStacked.findIndex((box) => box.stacksWith(displayItem));
            changeDisplayIndex(newIndex - displayIndex);
            go("display");
        }
    });
    sellbutton.onUpdate(() => {
        if (sellbutton.isHovering()) {
            hoveringTrue();
        }
    });
}