import k from "../kaplayCtx";
import { packsPage, packs } from "../constants";
import menu from "../menu";
import { menuHeight, screenWidth, screenHeight } from "../menu";

export default function packsScene() {
    menu("packs");

    const spacing = 6;
    const xIndent = 36
    const yIndent = 10;

    let page = packsPage[0];

    if (page != 0) {
        const button = k.add([k.sprite("pagearrowleft"), k.pos(10, screenHeight / 2 + menuHeight - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            packsPage[0]--;
            k.go("packsScene");
        });
    }
    if (packs.length > (page + 1) * 54) {
        const button = k.add([k.sprite("pagearrowright"), k.pos(screenWidth - 160, screenHeight / 2 + menuHeight - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            packsPage[0]++;
            k.go("packsScene");
        });
    }

    let x = xIndent
    let y = menuHeight + yIndent;
    for (let i = page * 54; i < packs.length && i < (page + 1) * 54; i++) {
        const pack = packs[i];
        pack.add(x, y);
        x += 200 + spacing;
        if (x > screenWidth - 200 - xIndent) {
            y += 150 + spacing;
            x = xIndent;
        }
    }
}