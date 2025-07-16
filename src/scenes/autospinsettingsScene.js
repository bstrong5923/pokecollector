import k from "../kaplayCtx";
import { autospinsettings, displayItems, menu, menuHeight, packs, screenHeight, screenWidth, showNumberInput, whichPack } from "../constants";


export default function autospinsettingsScene() {
    menu();

    k.add([k.text("Autospin Settings", { size: 60, width: 1000, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 500, menuHeight + 40)]);

    const autosellunder = k.add([k.text("Autosell under * " + autospinsettings["sellUnder"], { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 373, menuHeight + 140), k.area()]);
    autosellunder.onClick(() => {
        showNumberInput("sellUnder", screenWidth / 2 - 94, menuHeight + 138);
    });

    const items = packs[whichPack].getAll();
    for (const box of items) {
        box.setScale(0.8);
    }
    displayItems(items, null, 20, screenWidth - 20, autosellunder.pos.x + 20, screenHeight + menuHeight - 20, 160, 120, 10, 25)
}