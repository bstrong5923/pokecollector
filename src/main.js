import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";
import packsScene from "./scenes/packsScene";
import displayScene from "./scenes/displayScene";
import testScene from "./scenes/testScene";

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
k.loadSprite("closebutton", "images/buttons/closebutton.png");
k.loadSprite("sellbutton", "images/buttons/sellbutton.png");
k.loadSprite("checkbox", "images/buttons/checkbox.png", {
    sliceX: 1,
    sliceY: 2,
});
k.loadSprite("pagearrowright", "images/pagearrow/right.png");
k.loadSprite("pagearrowleft", "images/pagearrow/left.png");
k.loadSprite("pack", "images/pack.png");
// loading the pokemon
const atlas = {}; // empty dictionary
fetch("images/pokemon/pokemon_icons_1.json") // chatgpt's work
    .then((response) => response.json())  // chatgpt's work
    .then((data) => { // chatgpt's work
        const frames = data.textures[0].frames; // frames is the list of pokemon with x, y, w, h, and other stuff in the json

        for (const sprite of frames) { // for each pokemon sprite
            // define it in the atlas, where keyword is the pokemon filename and the data is all the sprite data
            atlas[sprite.filename] = { x: sprite.frame.x, y: sprite.frame.y, width: sprite.frame.w, height: sprite.frame.h };
        }
    });

k.loadSpriteAtlas("images/pokemon/pokemon_icons_1.png", atlas);

// create the scenes
k.scene("spinningScene", () => spinningScene()); 
k.scene("inventoryScene", () => inventoryScene());
k.scene("packsScene", () => packsScene());
k.scene("displayScene", () => displayScene());
k.scene("testScene", () => testScene());

// load fonts
k.loadFont("pkmn", "fonts/pkmnbydrizzee.ttf");

// v start on this scene v
k.onLoad(() => { // once everything is loaded
    k.go("packsScene");
})