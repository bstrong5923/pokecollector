import k from "../kaplayCtx";
import { packs, displayItems, menu, menuHeight, screenWidth, screenHeight } from "../constants";

export default function packsScene() {
    menu("packs");

    displayItems(packs, "packsScene", 0, screenWidth, menuHeight, screenHeight, 300, 225, 6);

    const redText = k.add([
        k.text("This is red text", { color: "rgb(255,0,0)", size: 24 }),
        k.pos(100, 100),
      ]);
}