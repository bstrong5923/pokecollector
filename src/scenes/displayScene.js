import k from "../kaplayCtx";
import { displayItem, menu, menuHeight, screenHeight, screenWidth, canvas, go, inventory, addMoney } from "../constants";

export default function displayScene() {
    menu();

    const closebutton = k.add([k.sprite("closebutton"), k.pos(screenWidth - 130, menuHeight + 30), k.area()]);
    closebutton.onUpdate(() => {
        if (closebutton.isHovering()) {
            canvas.style.cursor = "pointer";
        }
    });
    closebutton.onClick(() => {
        go("inventory");
    });

    const itemY = screenHeight / 2 + menuHeight - 300

    displayItem.add(screenWidth / 2 - 300, itemY);
    displayItem.setScale(3);

    k.add([k.text(displayItem.name, { size: 48, width: 1200, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 600, itemY + 480)]);

    const sellbutton = k.add([k.sprite("sellbutton"), k.pos(screenWidth / 2 - 77, itemY + 650), k.area()])
    sellbutton.onClick(() => {
        console.log(inventory.indexOf(displayItem));
        inventory.splice(inventory.indexOf(displayItem), 1);
        addMoney(displayItem.value);
        go("inventory");
    });
}