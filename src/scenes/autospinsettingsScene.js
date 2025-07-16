import k from "../kaplayCtx";
import { autospinsettings, displayItems, menu, menuHeight, packs, screenHeight, screenWidth, showNumberInput, whichPack } from "../constants";

class BoxWithChance {
    constructor(box, chance) {
        this.box = box;
        this.chance = chance;
        this.scale = 1;
    }
    add(x, y) {
        this.box.add(x, y);
        this.sprite = this.box.sprite;
        this.sprite.push(k.add([k.text(this.chance + "%", { font: "pkmn", size: 15 }), k.pos(x + 2, y + 152 * this.scale)]))
    }
    setScale(val) {
        this.box.setScale(val);
        this.scale = val;
    }
}

export default function autospinsettingsScene() {
    menu();

    k.add([k.text("Autospin Settings", { size: 60, width: 1000, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 500, menuHeight + 40)]);

    const autosellunder = k.add([k.text("Autosell under * " + autospinsettings["sellUnder"], { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 373, menuHeight + 140), k.area()]);
    autosellunder.onClick(() => {
        showNumberInput("sellUnder", screenWidth / 2 - 94, menuHeight + 138);
    });

    const items = [];
    const boxes = packs[whichPack].getAll()[0];
    const chances = packs[whichPack].getAll()[1];
    for (let i = 0; i < boxes.length; i++) {
        items.push(new BoxWithChance(boxes[i], chances[i]));
        items[i].setScale(0.8)
    }
    displayItems(items, null, 20, screenWidth - 20, autosellunder.pos.x + 20, screenHeight + menuHeight - 20, 160, 120, 10, 25)
}