import k from "./kaplayCtx";
import spinningScene from "./scenes/spinningScene";
import inventoryScene from "./scenes/inventoryScene";

k.loadBean();

k.scene("test", () => {k.add([k.sprite("bean")])});

k.go("test");

k.loadSprite("boxes", "images/allboxes.png", {
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");

k.scene("spinningScene", spinningScene());
k.scene("inventoryScene", inventoryScene());

k.go("inventoryScene");