import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";

k.loadSprite("boxes", "images/allboxes.png", {
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");

k.loadFont("pkmn", "fonts/pkmn_rbygsc.ttf")

k.scene("spinningScene", () => spinningScene());
k.scene("inventoryScene", () => inventoryScene());

k.go("spinningScene");