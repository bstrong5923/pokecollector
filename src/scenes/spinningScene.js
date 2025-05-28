import k from "../kaplayCtx";
import { inventory, whichPack, packs, menu, menuHeight, screenWidth, screenHeight, turnMenuOn, turnMenuOff } from "../constants";

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
    const spinbutton = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2 - 75, screenHeight / 2 + 100 + menuHeight), k.area(), k.layer("1")]); // spin button


    spinbutton.onClick(() => { // when spinbutton clicked, speed it set between 180 and 200
        if (speed == 0) {
            turnMenuOff();
            speed = Math.floor(Math.random() * 21 + 180);
            for (let i = 0; i < wheel.length; i++) {
                const box = wheel[i];
                if (box.sprite.pos.y != wheelY) {
                    box.sprite.pos.x -= 5 + ((i - 2) % 2) * 2.5;
                    box.sprite.pos.y -= 3.75;
                }
            }
        }
    });


    k.onUpdate(() => {
        if (speed < 0.15 && speed != 0) { // If speed is close enough to 0, set it to 0
            speed = 0;  

            for (let i = 0; i < wheel.length; i++) {
                const box = wheel[i];
                if (i == 2) { // which box did it land on?
                    inventory.push(box);
                    
                }
                else {
                    box.sprite.opacity = 0.4;
                    box.sprite.scale = 0.95;
                    box.sprite.pos.x += 5 + ((i - 2) % 2) * 2.5;
                    box.sprite.pos.y += 3.75;
                }
            }   
            
            turnMenuOn(); 
        }
        for (const box of wheel) { // move the boxes
            box.sprite.pos.x -= speed;
        }
        if (wheel[0].sprite.pos.x < wheelX - 200) { // if its outside the wheel:
            const x = wheel[0].sprite.pos.x + 1010;
            wheel[0].sprite.destroy(); // get rid of it
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