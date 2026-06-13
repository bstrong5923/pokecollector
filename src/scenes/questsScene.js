import k from "../kaplayCtx";
import { quests, menu, menuHeight, screenWidth, screenHeight, checkQuestCompletion, hoveringTrue } from "../constants";

export default function questsScene() {
    menu("quests");

    const slotWidth = 500;
    const slotHeight = 350;
    const slotSpacing = 40;
    const totalWidth = 3 * slotWidth + 2 * slotSpacing;
    const startX = (screenWidth - totalWidth) / 2;
    const startY = menuHeight + 50;

    // array to store quest slot displays for updating
    const questSlots = [];

    // create 3 quest slots
    for (let i = 0; i < 3; i++) {
        const slotX = startX + i * (slotWidth + slotSpacing);
        const slotY = startY;

        // slot background
        k.add([
            k.rect(slotWidth, slotHeight),
            k.pos(slotX, slotY),
            k.color(40, 40, 40),
            k.outline(2, k.rgb(100, 100, 100))
        ]);

        const slot = {
            index: i,
            quest: quests[i],
            textElements: []
        };

        if (quests[i] != null) {
            const quest = quests[i];

            // pokemon sprite
            k.add([
                k.sprite(quest.pokemon.codename),
                k.pos(slotX + (slotWidth - quest.pokemon.width * 2) / 2, slotY + 30),
                k.scale(quest.pokemon.scale * 2)
            ]);

            // pokemon name
            const nameText = k.add([
                k.text(quest.name, { size: 20, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, slotY + 160)
            ]);
            slot.textElements.push({ type: "name", element: nameText });

            // time remaining
            const timeText = k.add([
                k.text("Time: " + quest.getTimeDisplay(), { size: 18, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, slotY + 210)
            ]);
            slot.textElements.push({ type: "time", element: timeText });

            // reward amount
            const rewardText = k.add([
                k.text("Reward: *" + quest.reward, { size: 18, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, slotY + 260)
            ]);
            slot.textElements.push({ type: "reward", element: rewardText });

        } else {
            // empty slot
            const emptyText = k.add([
                k.text("Empty", { size: 24, font: "pkmn", align: "center", width: slotWidth - 20, color: k.rgb(100, 100, 100) }),
                k.pos(slotX + 10, slotY + slotHeight / 2 - 30)
            ]);
            slot.textElements.push({ type: "empty", element: emptyText });
        }

        questSlots.push(slot);
    }

    // update loop - check for quest completion and update timers
    k.onUpdate(() => {
        checkQuestCompletion();

        // update time displays for active quests
        for (const slot of questSlots) {
            if (quests[slot.index] != null && slot.quest != quests[slot.index]) {
                // quest status changed, reload the scene
                k.go("questsScene");
                return;
            }

            if (quests[slot.index] != null) {
                // update time remaining text
                for (const textEl of slot.textElements) {
                    if (textEl.type === "time") {
                        textEl.element.text = "Time: " + quests[slot.index].getTimeDisplay();
                    }
                }
            }
        }
    });
}
