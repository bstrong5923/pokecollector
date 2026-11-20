import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";
import packsScene from "./scenes/packsScene";
import displayScene from "./scenes/displayScene";
import testScene from "./scenes/testScene";
import autospinsettingsScene from "./scenes/autospinsettingsScene";
import questsScene from "./scenes/questsScene";
import questSelectionScene from "./scenes/questSelectionScene";
import { go, inventory, addToInventory, sortInventory, addMoney, subtractMoney, money, packsowned, quests, Box, Quest, autospinsettings, sortStyle, setSortStyle, stacking, setStacking, prefixes, resetAutospinSettings, getPokedexEntry } from "./constants";
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
for (const prefixKey in prefixes) {
    if (!Object.prototype.hasOwnProperty.call(prefixes, prefixKey)) continue;
    const prefix = prefixes[prefixKey];
    const assetName = "prefix-" + prefix.sprite;
    const frameCount = prefix.frameCount || 1;
    if (frameCount > 1) {
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
            frames.push(`images/prefixes/${prefix.sprite}/${i}.png`);
        }
        k.loadSprite(assetName, frames, { singular: false });
    } else {
        k.loadSprite(assetName, "images/prefixes/" + prefix.sprite + ".png");
    }
}
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

// loading the pokemon (all 20 sprite sheets at the same time, which is much faster than one by one)
let atlasesLoaded = 0;
const atlasLoads = [];
for (let x = 0; x <= 19; x++) {
    let num = Math.floor(x / 2);
    if (x % 2 == 1) {
        num += "v";
    }

    atlasLoads.push(
        fetch("images/pokemon/pokemon_icons_" + num + ".json")
            .then((response) => response.json())
            .then((data) => {
                const frames = data.textures[0].frames; // frames is the list of pokemon with x, y, w, h, and other stuff in the json
                const atlas = {}; // pokemon filename -> sprite data
                for (const sprite of frames) { // for each pokemon sprite
                    atlas[sprite.filename] = { x: sprite.frame.x, y: sprite.frame.y, width: sprite.frame.w, height: sprite.frame.h };
                }
                return k.loadSpriteAtlas("images/pokemon/pokemon_icons_" + num + ".png", atlas);
            })
            .then(() => { atlasesLoaded++; console.log("atlas loading " + atlasesLoaded + "/20"); })
    );
}
await Promise.all(atlasLoads);


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
        // The save as it was when this session loaded. Every save of the session carries it in a
        // "backup" field, so a bad save can be undone from the Firebase console.
        let sessionBackup = null;
        let stateLoaded = false; // true once the cloud save has been loaded; saving before then could overwrite it with defaults

        // A saved box only stores which pokemon it is (codename), its prefixes and its date.
        // Name and value are worked out again from the current pokedex/prefix data when loading,
        // so rebalancing values applies to boxes that players already own.
        function serializeBox(box) {
            return { codename: box.pokemon.codename, prefixes: box.prefixes, dateCreated: box.dateCreated };
        }

        function rebuildBox(saved) {
            // old saves stored the whole pokemon object instead of just the codename
            const codename = saved.codename || (saved.pokemon && saved.pokemon.codename);
            const box = new Box(getPokedexEntry(codename) || saved.pokemon);
            if (Array.isArray(saved.prefixes)) {
                box.setPrefixes(saved.prefixes.filter((p) => prefixes[p])); // ignore prefixes that no longer exist
            }
            if (saved.dateCreated) box.dateCreated = saved.dateCreated;
            return box;
        }

        function serializeState() {
            return {
                backup: sessionBackup,
                username: currentUser ? currentUser.displayName || null : null,
                money: money,
                packsowned: packsowned,
                inventory: inventory.map(serializeBox),
                quests: quests.map(q => q ? { box: serializeBox(q.box), startTime: q.startTime } : null),
                autospinsettings: autospinsettings,
                sortStyle: sortStyle,
                stacking: stacking,
            };
        }

        // red banner shown while the save could not be loaded safely (saving stays paused meanwhile)
        function showLoadError(message) {
            let banner = document.getElementById("load-error");
            if (!banner) {
                banner = document.createElement("div");
                banner.id = "load-error";
                Object.assign(banner.style, {
                    position: "fixed", left: "0", top: "0", width: "100%", padding: "10px",
                    background: "#b91c1c", color: "#fff", textAlign: "center",
                    fontFamily: "pkmn, sans-serif", zIndex: "9998", boxSizing: "border-box",
                });
                document.body.appendChild(banner);
            }
            banner.textContent = message;
        }
        function hideLoadError() {
            const banner = document.getElementById("load-error");
            if (banner) banner.remove();
        }

        // back to the default autospin settings and inventory sorting (used on login and logout)
        function resetPreferences() {
            resetAutospinSettings();
            setSortStyle("Time ^");
            setStacking(1);
        }

        // Saving is limited to protect the Firestore write quota:
        // - nothing is written if the data is identical to the last successful save
        // - at most one write every SAVE_MIN_GAP ms (bursts, like autospin, collapse into one)
        const SAVE_MIN_GAP = 3000;
        let lastSavedJSON = null;
        let lastSaveTime = 0;
        let saveTimer = null;

        async function writeSave() {
            if (!currentUser || !stateLoaded) return;
            const state = serializeState();
            const json = JSON.stringify(state);
            if (json === lastSavedJSON) return; // nothing changed
            lastSaveTime = Date.now();
            try {
                await savePlayerData(currentUser.uid, state);
                lastSavedJSON = json;
            } catch (err) {
                console.error('Error saving player data', err);
            }
        }

        // scenes call this after changes; it schedules a save
        function saveNow() {
            if (saveTimer) return; // a save is already scheduled
            const wait = Math.max(0, SAVE_MIN_GAP - (Date.now() - lastSaveTime));
            saveTimer = setTimeout(() => { saveTimer = null; writeSave(); }, wait);
        }
        // expose saveNow globally so scenes and constants can trigger a save
        try { window.saveNow = saveNow } catch (e) { /* non-browser or restricted env */ }

        // save right away when the tab is hidden or closed, so a pending change isn't lost
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") writeSave();
        });

        async function handleAuth(user) {
            if (user && !user.emailVerified) user = null; // must verify email before playing (treated like logged out)
            if (user) {
                currentUser = user;
                stateLoaded = false;
                sessionBackup = null;
                lastSavedJSON = null;
                resetPreferences();
                try {
                    let rebuildFailures = 0; // saved boxes that could not be rebuilt
                    const data = await loadPlayerData(user.uid);
                    if (currentUser !== user) return; // logged out or switched accounts while loading
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
                                    addToInventory(rebuildBox(it), true);
                                } catch (e) {
                                    console.error('Failed to reconstruct inventory item', it, e);
                                    rebuildFailures++;
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
                                        const quest = new Quest(rebuildBox(q.box));
                                        if (q.startTime) quest.startTime = q.startTime;
                                        quests[i] = quest;
                                    } catch (e) {
                                        console.error('Failed to reconstruct quest', q, e);
                                        quests[i] = null;
                                        rebuildFailures++;
                                    }
                                }
                            }
                        }

                        // restore autospinsettings
                        if (data.autospinsettings && typeof data.autospinsettings === 'object') {
                            const savedSellUnder = Number(data.autospinsettings.sellUnder);
                            if (Number.isFinite(savedSellUnder)) autospinsettings.sellUnder = savedSellUnder;
                            autospinsettings.alwaysKeepShinies = Boolean(data.autospinsettings.alwaysKeepShinies);
                            autospinsettings.alwaysKeepPrefixes = Boolean(data.autospinsettings.alwaysKeepPrefixes);
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
                    // back up what was loaded. If it has no items but an older backup does, keep the older one,
                    // so a session that started from an already-emptied save can't overwrite the good backup.
                    if (data) {
                        const { backup: olderBackup, ...loaded } = data;
                        const hasItems = Array.isArray(loaded.inventory) && loaded.inventory.length > 0;
                        sessionBackup = (hasItems || !olderBackup) ? { ...loaded, backedUpAt: Date.now() } : olderBackup;
                    }
                    else {
                        sessionBackup = null;
                    }

                    if (rebuildFailures > 0) {
                        // never save a shortened inventory over the real one
                        throw new Error(rebuildFailures + " saved item(s) could not be rebuilt");
                    }
                    hideLoadError();
                    stateLoaded = true; // safe to save now (new accounts with no save count too)
                } catch (err) {
                    console.error('Error loading player data, retrying in 5s', err);
                    showLoadError("Could not load your save safely. Saving is paused so nothing gets overwritten. Retrying...");
                    setTimeout(() => { if (currentUser === user) handleAuth(user); }, 5000);
                    return; // no autosave: saving now would overwrite the cloud save with defaults
                }

                // start autosave
                if (autosaveInterval) clearInterval(autosaveInterval);
                autosaveInterval = setInterval(saveNow, 15000);
            } else {
                // user logged out — reset to defaults
                currentUser = null;
                stateLoaded = false;
                hideLoadError();
                sessionBackup = null;
                lastSavedJSON = null;
                resetPreferences();
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
        }
        onAuthChange(handleAuth);
})