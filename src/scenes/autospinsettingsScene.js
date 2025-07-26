import k from "../kaplayCtx";
import { autospinsettings, canvas, displayItems, go, menu, menuHeight, packs, screenHeight, screenWidth, showNumberInput, whichPack } from "../constants";

const preferenceTexts = ["Sell if selling", "Always keep", "Always sell"];

class BoxWithChance {
    constructor(box, chance) {
        this.box = box;
        this.chance = chance;
        this.scale = 1;
        this.preferencekey = this.box.pokemon.indexRegional;
    }
    add(x, y) {
        this.box.add(x, y);
        this.sprite = this.box.sprite;
        this.sprite.push(k.add([k.text(this.chance + "%", { font: "pkmn", size: 15 }), k.pos(x + 10 * this.scale, y + 6 * this.scale)]))
        this.sprite.push(k.add([k.sprite("textbox", { frame: autospinsettings.specificPreferences[this.preferencekey] }), k.pos(x, y + 155 * this.scale), k.scale(this.scale), k.area()]));
        this.sprite.push(k.add([k.text(preferenceTexts[autospinsettings.specificPreferences[this.preferencekey]], { size: 16, width: 200 * this.scale, align: "center", font: "pkmn" }), k.pos(x, y + 166 * this.scale)]));
        this.sprite[this.sprite.length - 2].onClick(() => {
            autospinsettings.specificPreferences[this.preferencekey]++;
            if (autospinsettings.specificPreferences[this.preferencekey] >= preferenceTexts.length) {
                autospinsettings.specificPreferences[this.preferencekey] = 0;
            }
            go("autospinsettings");
        });
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
        items[i].setScale(0.8);
    }
    displayItems(items, null, 20, screenWidth - 20, autosellunder.pos.y + 20, screenHeight + menuHeight - 50, 160, 120, 5, 40);

    k.onUpdate(() => {
        for (const item of items) {
            if (item.sprite[item.sprite.length - 2].isHovering()) {
                canvas.style.cursor = "pointer";
                break;
            }
        }
    });
}