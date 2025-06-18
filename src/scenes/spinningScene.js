import k from "../kaplayCtx";
import { inventory, whichPack, packs, menu, menuHeight, screenWidth, screenHeight, turnMenuOn, turnMenuOff, packsowned, money, subtractMoney, canvas, shortenNumber } from "../constants";

export default function spinningScene() { // scene of wheel spinnin'
    menu("spinning");

    // Fill inventory for testing 
    for (let i = 0; i < 250; i++) {
        inventory.push(packs[Math.floor(Math.random() * packs.length)].getRandom()); // Math.floor(Math.random() * packs.length)
    }

    const wheelX = screenWidth / 2 - 403; // starting point for the boxes and wheel
    const wheelY = screenHeight / 2 - 175 + menuHeight; // starting point for the boxes and wheel
    let speed = 0;

    k.add([k.text(packs[whichPack].name, { size: 60, font: "pkmn" }), k.pos(screenWidth / 2 - packs[whichPack].name.length * 27, wheelY - 108)]);

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
    const buybutton = k.add([k.sprite("buybutton"), k.pos(screenWidth / 2 - 77, screenHeight / 2 + 40 + menuHeight), k.area(), k.layer("1"), k.opacity(1)]); // buy button
    const spinbutton = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2 + 89, screenHeight / 2 + 40 + menuHeight), k.area(), k.layer("1"), k.opacity(1)]); // spin button
    let pricedisplay = k.add([k.text("Price: *" + shortenNumber(packs[whichPack].price), { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 70 - Math.floor(Math.log10(packs[whichPack].price + 1)) * 14, spinbutton.pos.y + 100)]);
    let owneddisplay = k.add([k.text("Owned: " + packsowned[whichPack], { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 75 - Math.floor(Math.log10(packsowned[whichPack] + 1)) * 12, pricedisplay.pos.y + 40)]);
    const autospinbutton = [
        k.add([k.text("Autospin", { size: 24, font: "pkmn" }), k.pos(screenWidth / 2 - 55, owneddisplay.pos.y + 40), k.area()]),
        k.add([k.sprite("checkbox", { frame: 0 }), k.pos(screenWidth / 2 - 87, owneddisplay.pos.y + 36), k.area(), k.scale(4)]),
    ];
    for (const comp of autospinbutton) {
        comp.onClick(() => {
            if (autospinbutton[1].frame == 0) {
                autospinbutton[1].frame = 1;
            }
            else {
                autospinbutton[1].frame = 0;
            }
        });
    }

    buymultbutton.onClick(() => {
        buymultbutton.frame++;
        buymult = 10 ** buymultbutton.frame;
        if (buymultbutton.frame == 5) {
            buymult = Math.floor(money / packs[whichPack].price);
        }
        else if (buymultbutton.frame == 6) {
            buymultbutton.frame = 0;
            buymult = 1;
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
        pricedisplay.text = "Price: *" + shortenNumber(packs[whichPack].price * buymult);
        pricedisplay.pos.x = screenWidth / 2 - 70 - Math.floor(Math.log10(packs[whichPack].price * buymult + 1)) * 14;
        owneddisplay.text = "Owned: " + packsowned[whichPack];
        owneddisplay.pos.x = screenWidth / 2 - 75 - Math.floor(Math.log10(packsowned[whichPack] + 1)) * 12;
        if (buymult * packs[whichPack].price > money || buymult == 0) {
            buybutton.opacity = 0.3;
        }
        else {
            buybutton.opacity = 1;
        }
        if (packsowned[whichPack] == 0) {
            spinbutton.opacity = 0.3;
        }
        else {
            spinbutton.opacity = 1;
        }

        if (buybutton.isHovering() || buymultbutton.isHovering() || spinbutton.isHovering()) {
            canvas.style.cursor = "pointer";
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
                    box.setScale(0.95);
                    box.move(5 + ((i - 2) % 2) * 2.5, 3.75);
                }
            }   
            if (autospinbutton[1].frame == 1 && packsowned[whichPack] > 0) {
                packsowned[whichPack]--;
                speed = Math.floor(Math.random() * 21 + 180);
                for (let i = 0; i < wheel.length; i++) {
                    const box = wheel[i];
                    if (box.y != wheelY) {
                        box.move(-(5 + ((i - 2) % 2) * 2.5), -3.75); 
                    }
                }
            } 
            else {
                turnMenuOn();
            }
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