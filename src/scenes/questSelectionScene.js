import k from "../kaplayCtx";
import { inventory, inventoryStacked, stackedIndexes, displayItems, menu, menuHeight, screenWidth, screenHeight, page, sortInventory, go, assignQuestFromInventory, hoveringTrue, questSelectionSlot } from "../constants";

export default function questSelectionScene() {
    if (questSelectionSlot == null) {
        go("quests");
        return;
    }

    menu("quests");
    sortInventory();

    k.add([
        k.text("Select a Pokémon for Quest Slot " + (questSelectionSlot + 1), { size: 32, font: "pkmn", width: screenWidth - 40, align: "center" }),
        k.pos(20, menuHeight + 10)
    ]);

    if (inventory.length === 0) {
        k.add([
            k.text("No Pokémon available to send on quests.", { size: 28, font: "pkmn", width: screenWidth - 40, align: "center" }),
            k.pos(20, menuHeight + 120)
        ]);
        return;
    }

    for (let i = 0; i < inventoryStacked.length; i++) {
        inventoryStacked[i].setOnClickAction(() => {
            assignQuestFromInventory(i);
        });
    }

    displayItems(inventoryStacked, "questSelection", 20, screenWidth - 20, menuHeight + 80, menuHeight + screenHeight - 50, 200, 150, 6, 6, "small_", 3, screenWidth / 2 - 138, menuHeight + 80, screenWidth / 2 + 61, menuHeight + 80);

    k.onUpdate(() => {
        for (const item of inventoryStacked) {
            if (item.sprite.length > 0 && item.sprite[0].isHovering()) {
                hoveringTrue();
            }
        }
    });
}
