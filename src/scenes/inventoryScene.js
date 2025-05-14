import k from "../kaplayCtx";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";

export default function inventoryScene() { // scene showin inventory
    menu("inventory");

    const button = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2, screenHeight / 2 + menuHeight), k.area()]);
    button.onClick(() => {
        button.destroy();
        console.log("a");
    })
}