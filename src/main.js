import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";
import packsScene from "./scenes/packsScene";

// set up layers
k.layers(["5", "4", "3", "2", "1", "0"], "4"); 

// load the sprites
k.loadSprite("boxes", "images/allboxes.png", { 
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");

k.loadSprite("pagearrowright", "images/pagearrow/right.png");
k.loadSprite("pagearrowleft", "images/pagearrow/left.png");

// create the scenes
k.scene("spinningScene", () => spinningScene()); 
k.scene("inventoryScene", () => inventoryScene());
k.scene("packsScene", () => packsScene());

// load fonts
k.loadFont("pkmn", "fonts/pkmn_rbygsc.ttf");

// v start on this scene v
k.go("packsScene");