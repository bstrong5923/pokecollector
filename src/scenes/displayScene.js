import k from "../kaplayCtx";
import { displayItem, menu, menuHeight, screenHeight, screenWidth } from "../constants";

export default function displayScene() {
    menu();

    k.add([k.sprite("x"), k.pos(screenWidth - 130, menuHeight + 30)]);

    const itemY = screenHeight / 2 + menuHeight - 150

    displayItem.add(screenWidth / 2 - 200, itemY);
    displayItem.setScale(2);

    k.add([k.text(displayItem.name, { size: 36, width: 400, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 200, itemY + 230)]);
}