import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";
import packsScene from "./scenes/packsScene";
import displayScene from "./scenes/displayScene";

// set up layers
k.setLayers(["5", "4", "3", "2", "1", "0"], "4"); 

// load the sprites
k.loadSprite("boxes", "images/allboxes.png", { 
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");
k.loadSprite("buybutton", "images/buybutton.png");
k.loadSprite("buymults", "images/buymults.png", {
    sliceX: 2,
    sliceY: 3,
});
k.loadSprite("closebutton", "images/closebutton.png");
k.loadSprite("sellbutton", "images/sellbutton.png");

k.loadSprite("pagearrowright", "images/pagearrow/right.png");
k.loadSprite("pagearrowleft", "images/pagearrow/left.png");

k.loadSprite("pack", "images/pack.png");

// create the scenes
k.scene("spinningScene", () => spinningScene()); 
k.scene("inventoryScene", () => inventoryScene());
k.scene("packsScene", () => packsScene());
k.scene("displayScene", () => displayScene());

// load fonts
k.loadFont("pkmn", "fonts/pkmnbydrizzee.ttf");

// v start on this scene v
k.go("packsScene");