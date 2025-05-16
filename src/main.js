import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";

// set up layers
k.layers(["boxes", "wheel"], "boxes"); 

// load the sprites
k.loadSprite("boxes", "images/allboxes.png", { 
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");
k.loadSprite("shine", "images/shine.png");

// create the scenes
k.scene("spinningScene", () => spinningScene()); 
k.scene("inventoryScene", () => inventoryScene());

// load fonts
k.loadFont("pkmn", "fonts/pkmn_rbygsc.ttf");

// v start on this scene v
k.go("spinningScene");