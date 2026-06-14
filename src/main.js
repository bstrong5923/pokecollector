import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";
import packsScene from "./scenes/packsScene";
import displayScene from "./scenes/displayScene";
import testScene from "./scenes/testScene";
import autospinsettingsScene from "./scenes/autospinsettingsScene";
import questsScene from "./scenes/questsScene";
import questSelectionScene from "./scenes/questSelectionScene";
import { go, inventory, sortInventory, addMoney, subtractMoney, money, packsowned, quests, Box, Quest, autospinsettings, sortStyle, setSortStyle, stacking, setStacking } from "./constants";
import { initLoginUI } from "./LoginUI.js";
import { onAuthChange } from "./authService.js";
import { savePlayerData, loadPlayerData } from "./playerDataService.js";

// set up layers
k.setLayers(["5", "4", "3", "2", "1", "0"], "4"); 

// load the sprites
k.loadSprite("boxes", "images/allboxes.png", { 
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/buttons/spinbutton.png");
k.loadSprite("buybutton", "images/buttons/buybutton.png");
k.loadSprite("buymults", "images/buttons/buymults.png", {
    sliceX: 2,
    sliceY: 3,
});
k.loadSprite("closebutton", "images/pagebuttons/close.png");
k.loadSprite("sellbutton", "images/buttons/sellbutton.png");
k.loadSprite("sellallbutton", "images/buttons/sellallbutton.png");
k.loadSprite("checkbox", "images/buttons/checkbox.png", {
    sliceX: 1,
    sliceY: 2,
});
k.loadSprite("settings", "images/buttons/settings.png");
k.loadSprite("pagearrowright", "images/pagebuttons/right.png");
k.loadSprite("pagearrowleft", "images/pagebuttons/left.png");
k.loadSprite("small_left", "images/pagebuttons/small_left.png");
k.loadSprite("small_right", "images/pagebuttons/small_right.png");
k.loadSprite("pack", "images/pack.png");
k.loadSprite("shinies", "images/shinies.png", {
    sliceX: 3,
    sliceY: 1,
});
k.loadSprite("textbox", "images/textboxes.png", {
    sliceX: 1,
    sliceY: 3,
});

// loading the pokemon
for (let x = 0; x <= 19; x++) {
    let num = Math.floor(x / 2);
    if (x % 2 == 1) {
        num += "v";
    }

    const atlas = {}; // empty dictionary
    await fetch("images/pokemon/pokemon_icons_" + num + ".json") // chatgpt's work
        .then((response) => response.json())  // chatgpt's work
        .then((data) => { // chatgpt's work
            const frames = data.textures[0].frames; // frames is the list of pokemon with x, y, w, h, and other stuff in the json

            for (const sprite of frames) { // for each pokemon sprite
                // define it in the atlas, where keyword is the pokemon filename and the data is all the sprite data
                atlas[sprite.filename] = { x: sprite.frame.x, y: sprite.frame.y, width: sprite.frame.w, height: sprite.frame.h };
            }
        });

    await k.loadSpriteAtlas("images/pokemon/pokemon_icons_" + num + ".png", atlas)
        .then(() => { console.log("atlas loading " + (x + 1) + "/20"); });
}


// create the scenes
k.scene("spinningScene", () => spinningScene()); 
k.scene("inventoryScene", () => inventoryScene());
k.scene("packsScene", () => packsScene());
k.scene("displayScene", () => displayScene());
k.scene("testScene", () => testScene());
k.scene("autospinsettingsScene", () => autospinsettingsScene());
k.scene("questsScene", () => questsScene());
k.scene("questSelectionScene", () => questSelectionScene());

// load fonts
k.loadFont("pkmn", "fonts/pkmnbydrizzee.ttf");

// v start on this scene v
k.onLoad(() => { // once everything is loaded
        // mount login UI
        try { initLoginUI() } catch (e) { console.warn('initLoginUI failed:', e) }

        go("packs");

        // auth handling: load player data on login, reset on logout
        let currentUser = null;
        let autosaveInterval = null;

        function serializeState() {
            return {
                money: money,
                packsowned: packsowned,
                inventory: inventory.map(item => ({ pokemon: item.pokemon, value: item.value, dateCreated: item.dateCreated, name: item.name })),
                quests: quests.map(q => q ? { box: { pokemon: q.box.pokemon, name: q.box.name, value: q.box.value, dateCreated: q.box.dateCreated }, startTime: q.startTime } : null),
                autospinsettings: autospinsettings,
                sortStyle: sortStyle,
                stacking: stacking,
            };
        }

        async function saveNow() {
            if (!currentUser) return;
            try {
                await savePlayerData(currentUser.uid, serializeState());
            } catch (err) {
                console.error('Error saving player data', err);
            }
        }
        // expose saveNow globally so scenes and constants can trigger an immediate save
        try { window.saveNow = saveNow } catch (e) { /* non-browser or restricted env */ }

        onAuthChange(async (user) => {
            if (user) {
                currentUser = user;
                try {
                    const data = await loadPlayerData(user.uid);
                    if (data) {
                        // restore money
                        if (typeof data.money === 'number') {
                            const delta = data.money - money;
                            if (delta > 0) addMoney(delta);
                            else if (delta < 0) subtractMoney(-delta);
                        }

                        // restore packsowned
                        if (Array.isArray(data.packsowned)) {
                            packsowned.length = 0;
                            for (const p of data.packsowned) packsowned.push(p);
                        }

                        // restore inventory (reconstruct Box instances when possible)
                        if (Array.isArray(data.inventory)) {
                            inventory.length = 0;
                            for (const it of data.inventory) {
                                try {
                                    const box = new Box(it.pokemon);
                                    if (it.value) box.value = it.value;
                                    if (it.dateCreated) box.dateCreated = it.dateCreated;
                                    if (it.name) box.name = it.name;
                                    inventory.push(box);
                                } catch (e) {
                                    console.warn('Failed to reconstruct inventory item', e);
                                }
                            }
                            sortInventory();
                        }

                        // restore quests
                        if (Array.isArray(data.quests)) {
                            for (let i = 0; i < quests.length; i++) {
                                const q = data.quests[i];
                                if (q == null) {
                                    quests[i] = null;
                                } else {
                                    try {
                                        const b = new Box(q.box.pokemon || q.box);
                                        if (q.box.value) b.value = q.box.value;
                                        if (q.box.dateCreated) b.dateCreated = q.box.dateCreated;
                                        const quest = new Quest(b);
                                        if (q.startTime) quest.startTime = q.startTime;
                                        quests[i] = quest;
                                    } catch (e) {
                                        console.warn('Failed to reconstruct quest', e);
                                        quests[i] = null;
                                    }
                                }
                            }
                        }

                        // restore autospinsettings
                        if (data.autospinsettings && typeof data.autospinsettings === 'object') {
                            autospinsettings.sellUnder = Number(data.autospinsettings.sellUnder) || autospinsettings.sellUnder;
                            autospinsettings.alwaysKeepShinies = Boolean(data.autospinsettings.alwaysKeepShinies);
                            if (data.autospinsettings.specificPreferences && typeof data.autospinsettings.specificPreferences === 'object') {
                                for (const key in autospinsettings.specificPreferences) {
                                    if (data.autospinsettings.specificPreferences.hasOwnProperty(key)) {
                                        const parsed = Number(data.autospinsettings.specificPreferences[key]);
                                        if (!Number.isNaN(parsed)) {
                                            autospinsettings.specificPreferences[key] = parsed;
                                        }
                                    }
                                }
                            }
                        }

                        // restore inventory sorting prefs
                        if (typeof data.sortStyle === 'string') {
                            setSortStyle(data.sortStyle);
                        }
                        if (data.stacking === 0 || data.stacking === 1) {
                            setStacking(data.stacking);
                        }
                    }
                } catch (err) {
                    console.error('Error loading player data', err);
                }

                // start autosave
                if (autosaveInterval) clearInterval(autosaveInterval);
                autosaveInterval = setInterval(saveNow, 15000);
            } else {
                // user logged out — reset to defaults
                currentUser = null;
                if (autosaveInterval) { clearInterval(autosaveInterval); autosaveInterval = null }

                // reset money to default (10000)
                try {
                    const defaultMoney = 10000;
                    const delta = defaultMoney - money;
                    if (delta > 0) addMoney(delta);
                    else if (delta < 0) subtractMoney(-delta);
                } catch (e) { console.warn(e) }

                // reset packsowned, inventory, quests
                packsowned.length = 0; packsowned.push(0,0,0);
                inventory.length = 0;
                quests.length = 0; quests.push(null, null, null);
                sortInventory();
            }
        });
})