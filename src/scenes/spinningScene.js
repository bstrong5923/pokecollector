import k from "../kaplayCtx";
import { inventory, whichPack, packs, menu, menuHeight, screenWidth, screenHeight, turnMenuOn, turnMenuOff, packsowned, money, subtractMoney } from "../constants";

export default function spinningScene() { // scene of wheel spinnin'
    menu("spinning");

    const wheelX = screenWidth / 2 - 403; // starting point for the boxes and wheel
    const wheelY = screenHeight / 2 - 175 + menuHeight; // starting point for the boxes and wheel
    let speed = 0;

    let wheel = [];
    for (let x = 0; x <= 4; x++) { // wheel is a list of box objects
        wheel.push(pickRandomItem());
        wheel[x].add(wheelX + 202 * x, wheelY); // each one is 200 px wide, with 2 px in between
    }


    const bgcolor = [ // cover up the boxes that go outside the wheel
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 - 614, screenHeight / 2 - 180 + menuHeight), k.layer("1")]),
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 + 404, screenHeight / 2 - 180 + menuHeight), k.layer("1")]),
    ];
    const wheelborder = k.add([k.sprite("wheelborder"), k.pos(screenWidth / 2 - 408, screenHeight / 2 - 180 + menuHeight), k.layer("1")]); // the wheel
    
    let buymult = 1;

    const buymultbutton = k.add([k.sprite("buymults", { frame: 0 }), k.pos(screenWidth / 2 - 243, screenHeight / 2 + 40 + menuHeight), k.area(), k.layer("1")]);
    const buybutton = k.add([k.sprite("buybutton"), k.pos(screenWidth / 2 - 77, screenHeight / 2 + 40 + menuHeight), k.area(), k.layer("1"), k.opacity(1)]);
    const spinbutton = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2 + 89, screenHeight / 2 + 40 + menuHeight), k.area(), k.layer("1")]); // spin button
    let pricedisplay = k.add([k.text("Price: *" + packs[whichPack].price, { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 70 - Math.floor(Math.log10(packs[whichPack].price)) * 14, screenHeight / 2 + menuHeight + 140)]);
    let owneddisplay = k.add([k.text("Owned: " + packsowned[whichPack], { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 75 - Math.floor(Math.log10(packsowned[whichPack] + 1)) * 12, screenHeight / 2 + menuHeight + 180)]);

    buymultbutton.onClick(() => {
        if (speed == 0) {
            buymultbutton.frame++;
            buymult = 10 ** buymultbutton.frame;
            if (buymultbutton.frame == 5) {
                buymult = Math.floor(money / packs[whichPack].price);
            }
            else if (buymultbutton.frame == 6) {
                buymultbutton.frame = 0;
                buymult = 1;
            }
        }
    });
    buybutton.onClick(() => {
        if (speed == 0 && money >= buymult * packs[whichPack].price) {
            packsowned[whichPack] += buymult;
            subtractMoney(buymult * packs[whichPack].price);
        }
    });
    spinbutton.onClick(() => { // when spinbutton clicked, speed it set between 180 and 200
        if (speed == 0 && packsowned[whichPack] > 0) {
            turnMenuOff();
            packsowned[whichPack]--;
            speed = Math.floor(Math.random() * 21 + 180);
            for (let i = 0; i < wheel.length; i++) {
                const box = wheel[i];
                if (box.y != wheelY) {
                    box.move(-(5 + ((i - 2) % 2) * 2.5), -3.75); 
                }
            }
        }
    });


    k.onUpdate(() => {
        // update text displays
        pricedisplay.text = "Price: *" + (packs[whichPack].price * buymult);
        pricedisplay.pos.x = screenWidth / 2 - 70 - Math.floor(Math.log10(packs[whichPack].price * buymult)) * 14;
        owneddisplay.text = "Owned: " + packsowned[whichPack];
        owneddisplay.pos.x = screenWidth / 2 - 75 - Math.floor(Math.log10(packsowned[whichPack] + 1)) * 12;
        if (buymult * packs[whichPack].price > money) {
            buybutton.opacity = 0.5;
        }
        else {
            buybutton.opacity = 1;
        }

        if (speed < 0.15 && speed != 0) { // If speed is close enough to 0, set it to 0
            speed = 0;  

            for (let i = 0; i < wheel.length; i++) {
                const box = wheel[i];
                if (i == 2) { // which box did it land on?
                    inventory.push(box);
                    
                }
                else {
                    box.setOpacity(0.4);
                    boxsetScale(0.95);
                    box.move(5 + ((i - 2) % 2) * 2.5, 3.75);
                }
            }   
            
            turnMenuOn(); 
        }
        for (const box of wheel) { // move the boxes
            box.move(-speed, 0);
        }
        if (wheel[0].x < wheelX - 200) { // if its outside the wheel:
            const x = wheel[0].x + 1010;
            wheel[0].destroySprite(); // get rid of it
            wheel.shift();
            wheel.push(pickRandomItem()); // and add a new one to the right
            wheel[4].add(x, wheelY);
        }
        if (speed > 0) { 
            speed *= 0.975 + .0001 * speed; // slow down a lil
        }
    });
}

function pickRandomItem() {
    return packs[whichPack].getRandom();
}