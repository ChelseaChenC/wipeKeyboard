// Open and connect input socket
let socket = io();

let keychar;
let fullText = [];

let word = null;
let current_orgKey = null;
let current_mappedkey = null;
let current_pos = 0;
let current_user = null;



function setup() {
    createCanvas(800, 800);
    socket.on('init', function(message){
        word = message.word;
        current_user = message.current_user;
        current_pos = message.current_pos;
        current_mappedkey = message.current_mappedkey;
        current_orgKey = message.current_orgKey;
    });

    socket.on('sync', function(message){
        current_user = message.current_user;
        current_pos = message.current_pos;
        current_mappedkey = message.current_mappedkey;
        current_orgKey = message.current_orgKey;
    });
}




function keyPressed() {
    let data = {
        "keyCode":keyCode
    };

    socket.emit('keyPressed', data);
}



let index = 0
let combinedtext = "";


function draw() {
    background(100);
    if(word === null){
        return;
    }

    text("Spell the word one letter at a time. Type one letter and wait for opponent: " + word, 200,100);


    if(current_user === socket.id){
        text("your turn", 20, 10);
    } else {
        text("wait for others", 20, 10);
    }

    let updatedText = "";

     for (let i = 0; i < current_pos; i++) {
         updatedText += word.charAt(i)
     }

    text(updatedText, 250, 100);
    text("you pressed " + current_mappedkey, 300, 200);


    // if (keyIsPressed && keychar == word[index]) {
    //     append(fullText, word[index]);
    //     index++
    //     console.log("SWITCHPLAYER");
    // } else {
    //     console.log("TRY AGAIN");
    // }



    // combinedtext = join(fullText, "");
    // textAlign(CENTER);
    // textSize(10);
    // text("Spell the word one letter at a time. Type one letter and wait for opponent: " + word, 200,100);
    // textSize(30);
    // text("You typed: " + keychar, 200, height - 50);
    // text(combinedtext, width / 2, height / 2);
}