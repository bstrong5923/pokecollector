import k from "../kaplayCtx";
import { displayIndex, menu, menuHeight, screenHeight, screenWidth, canvas, go, inventory, addMoney, changeDisplayIndex, inventoryStacked, stackedIndexes } from "../constants";

export default function displayScene() {
    menu();

    const displayItem = inventoryStacked[displayIndex];

    const closebutton = k.add([k.sprite("closebutton"), k.pos(screenWidth - 140, menuHeight + 30), k.area()]);
    closebutton.onUpdate(() => {
        if (closebutton.isHovering()) {
            canvas.style.cursor = "pointer";
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
    if (displayIndex != inventory.length - 1) {
        pagearrowright = k.add([k.sprite("pagearrowright"), k.pos(screenWidth - 120, screenHeight / 2 + menuHeight - 55), k.area(), k.layer("1")]);
        pagearrowright.onClick(() => {
            changeDisplayIndex(1);
            go("display");
        });
    }

    k.onUpdate(() => {
        if ((pagearrowleft != null && pagearrowleft.isHovering()) || (pagearrowright != null && pagearrowright.isHovering())) {
            canvas.style.cursor = "pointer";
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
        addMoney(displayItem.value);
        inventory.splice(stackedIndexes[displayIndex][stackedIndexes[displayIndex].length - 1], 1); // gets rid of the newest duplicate
        stackedIndexes[displayIndex].splice(stackedIndexes[displayIndex].length - 1);
        if (stackedIndexes[displayIndex].length == 0) {
            go("inventory");
        }
        else {
            go("display");
        }

    });
    sellbutton.onUpdate(() => {
        if (sellbutton.isHovering) {
            canvas.style.cursor = "pointer";
        }
    });
}