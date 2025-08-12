import k from "../kaplayCtx";
import { autospinsettings, canvas, displayItems, go, hoveringTrue, menu, menuHeight, packs, screenHeight, screenWidth, showNumberInput, whichPack } from "../constants";

const preferenceTexts = ["Sell if selling", "Always keep", "Always sell"];

class BoxWithChance {
    constructor(box, chance) {
        this.box = box;
        this.chance = chance;
        this.scale = 1;
        this.preferencekey = this.box.pokemon.index_regional;
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

    const closebutton = k.add([k.sprite("closebutton"), k.pos(screenWidth - 140, menuHeight + 30), k.scale(0.8), k.area()]);
    closebutton.onUpdate(() => {
        if (closebutton.isHovering()) {
            hoveringTrue();
        }
    });
    closebutton.onClick(() => {
        go("spinning");
    });

    k.add([k.text("Autospin Settings", { size: 60, width: 1000, font: "pkmn", align: "center" }), k.pos(screenWidth / 2 - 500, menuHeight + 40)]);

    const autosellunder = k.add([k.text("Autosell under * " + autospinsettings["sellUnder"], { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 373, menuHeight + 140), k.area()]);
    autosellunder.onClick(() => {
        showNumberInput("sellUnder", screenWidth / 2 - 94, menuHeight + 138);
    });

    const alwaysKeepShinies = [
        k.add([k.text("Always keep shinies", { size: 24, font: "pkmn" }), k.pos(autosellunder.pos.x + 29, autosellunder.pos.y + 55), k.area()]),
        k.add([k.sprite("checkbox", { frame: Number(autospinsettings.alwaysKeepShinies) }), k.pos(autosellunder.pos.x, autosellunder.pos.y + 55), k.area(), k.scale(3)]),
    ];
    for (const comp of alwaysKeepShinies) {
        comp.onClick(() => {
            if (autospinsettings.alwaysKeepShinies) {
                autospinsettings.alwaysKeepShinies = false;
            }
            else {
                autospinsettings.alwaysKeepShinies = true;
            }
            go("autospinsettings");
        });
        comp.onUpdate(() => {
            if (comp.isHovering()) {
                hoveringTrue();
            }
        });
    }

    const items = [];
    const boxes = packs[whichPack].getAll()[0];
    const chances = packs[whichPack].getAll()[1];
    for (let i = 0; i < boxes.length; i++) {
        items.push(new BoxWithChance(boxes[i], chances[i]));
        items[i].setScale(0.8);
    }
    displayItems(items, null, 20, screenWidth - 20, alwaysKeepShinies[0].pos.y + 55, screenHeight + menuHeight - 50, 160, 155, 5, 5); // grid of possible pokemon

    k.onUpdate(() => {
        for (const item of items) {
            if (item.sprite[item.sprite.length - 2].isHovering()) {
                hoveringTrue();
                break;
            }
        }
    });
}