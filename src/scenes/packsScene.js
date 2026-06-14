import k from "../kaplayCtx";
import { packs, menu, menuHeight, screenWidth, screenHeight, getPokedexEntry, selectPack, go, hoveringTrue, packsowned } from "../constants";

export default function packsScene() {
    menu("packs");

    const slotWidth = 500;
    const slotHeight = 310; // shorter than quest slots
    const slotSpacing = 40;
    const totalWidth = 3 * slotWidth + 2 * slotSpacing;
    const startX = (screenWidth - totalWidth) / 2;
    const startY = menuHeight + 40;

    for (let i = 0; i < Math.min(3, packs.length); i++) {
        const slotX = startX + i * (slotWidth + slotSpacing);
        const slotY = startY;

        const bg = k.add([
            k.rect(slotWidth, slotHeight),
            k.pos(slotX, slotY),
            k.color(40, 40, 40),
            k.outline(2, k.rgb(100, 100, 100)),
            k.area(),
        ]);

        // Pack name centered at top
        k.add([
            k.text(packs[i].name, { size: 36, font: "pkmn", align: "center", width: slotWidth - 20 }),
            k.pos(slotX + 10, slotY + 16),
        ]);

        // Cover pokemon: use the first item id in the pack as cover
        const coverIndex = packs[i].items && packs[i].items.length ? packs[i].items[0][0] : 1;
        const p = getPokedexEntry(coverIndex) || { codename: "", scale: 1, width: 100 };
        const spriteScale = (p.scale || 1) * 1.6;
        const spriteY = slotY + 70;
        if (p.codename) {
            const baseWidth = (p.width || 100) / (p.scale || 1); // original frame width
            const displayWidth = baseWidth * spriteScale;
            const centerX = slotX + (slotWidth - displayWidth) / 2;
            k.add([
                k.sprite(p.codename),
                k.pos(centerX, spriteY),
                k.scale(spriteScale),
            ]);
        }

        // Owned information under the sprite, centered
        k.add([
            k.text("Owned: " + (packsowned[i] || 0), { size: 24, font: "pkmn", align: "center", width: slotWidth }),
            k.pos(slotX, slotY + slotHeight - 46),
        ]);

        bg.onClick(() => {
            selectPack(packs[i].index);
            go("spinning");
        });
        bg.onUpdate(() => {
            if (bg.isHovering()) {
                hoveringTrue();
            }
        });
    }
}
