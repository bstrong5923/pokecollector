import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function inventoryScene() { // scene showin inventory

    const button = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2, screenHeight / 2), k.area()]);
    button.onClick(() => {
        button.destroy();
        console.log("a");
    })
}