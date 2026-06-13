import k from "../kaplayCtx";
import { quests, menu, menuHeight, screenWidth, screenHeight, checkQuestCompletion, hoveringTrue, startQuestSelection, cancelQuest, go } from "../constants";

export default function questsScene() {
    menu("quests");

    const slotWidth = 500;
    const slotHeight = 700;
    const slotSpacing = 40;
    const totalWidth = 3 * slotWidth + 2 * slotSpacing;
    const startX = (screenWidth - totalWidth) / 2;
    const startY = menuHeight + 40;

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
            const baseScale = quest.pokemon.scale;
            const rawWidth = quest.pokemon.width / baseScale;
            const rawHeight = quest.pokemon.height / baseScale;
            const maxSpriteWidth = slotWidth - 80;
            const maxSpriteHeight = 250;
            const extraScale = Math.min(maxSpriteWidth / (rawWidth * baseScale), maxSpriteHeight / (rawHeight * baseScale), 4.5);
            const spriteScale = baseScale * extraScale;
            const displayWidth = rawWidth * spriteScale;
            const displayHeight = rawHeight * spriteScale;
            const spriteX = slotX + slotWidth / 2 - displayWidth / 2;
            const spriteY = slotY + 110;
            const statsY = spriteY + displayHeight + 30;

            // pokemon name
            const nameText = k.add([
                k.text(quest.name, { size: 36, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, slotY + 30)
            ]);
            slot.textElements.push({ type: "name", element: nameText });

            // pokemon sprite
            k.add([
                k.sprite(quest.pokemon.codename),
                k.pos(spriteX, spriteY),
                k.scale(spriteScale),
                k.opacity(1)
            ]);

            // time remaining
            const timeText = k.add([
                k.text("Time: " + quest.getTimeDisplay(), { size: 30, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, statsY)
            ]);
            slot.textElements.push({ type: "time", element: timeText });

            // reward amount
            const rewardText = k.add([
                k.text("Reward: *" + quest.reward, { size: 30, font: "pkmn", align: "center", width: slotWidth - 20 }),
                k.pos(slotX + 10, statsY + 70)
            ]);
            slot.textElements.push({ type: "reward", element: rewardText });

            const cancelButton = k.add([
                k.rect(200, 60),
                k.pos(slotX + slotWidth / 2 - 100, statsY + 130),
                k.color(120, 0, 0),
                k.outline(2, k.rgb(190, 40, 40)),
                k.area()
            ]);
            const cancelText = k.add([
                k.text("Cancel", { size: 30, font: "pkmn", align: "center", width: 200, color: "white" }),
                k.pos(slotX + slotWidth / 2 - 100, statsY + 145)
            ]);
            const cancelArea = cancelButton;
            cancelArea.onClick(() => {
                cancelQuest(i);
                go("quests");
            });
            cancelArea.onUpdate(() => {
                if (cancelArea.isHovering()) {
                    hoveringTrue();
                }
            });
        } else {
            const emptyTitle = k.add([
                k.text("Empty Slot", { size: 28, font: "pkmn", align: "center", width: slotWidth - 20, color: k.rgb(170, 170, 170) }),
                k.pos(slotX + 10, slotY + 40)
            ]);
            slot.textElements.push({ type: "empty", element: emptyTitle });

            const button = k.add([
                k.text("Add Pokemon", { size: 28, font: "pkmn", align: "center", width: slotWidth - 20, color: "red" }),
                k.pos(slotX + 10, slotY + slotHeight / 2 - 30),
                k.area()
            ]);
            button.onClick(() => {
                startQuestSelection(i);
            });
            button.onUpdate(() => {
                if (button.isHovering()) {
                    hoveringTrue();
                }
            });
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
