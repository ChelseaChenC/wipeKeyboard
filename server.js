// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});


// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);


function generateMapping(){

   let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
   let shuffledAlphabet = alphabet.slice();
   shuffle(shuffledAlphabet);

   function shuffle(a) {
    let j, x, i;
    for ( i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
  }


   let dictionary = {};
   for (let i = 0; i < shuffledAlphabet.length; i++) {
   	dictionary[alphabet[i]] = shuffledAlphabet[i];
   }

   return dictionary;
}


//
let current_orgKey = null;
let current_mappedkey = null;
let current_pos = 0;
let current_user = null;
let user_list = [];
let key_mapping = generateMapping();
let listOfWords = ["ELEPHANT", "BASEBALL", "HOUSEPARTY"];
    //choose a random word
let word = listOfWords[Math.floor(Math.random() * listOfWords.length)];



// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {

    console.log("We have a new client: " + socket.id);
    //randomly pick a word send back to clients

    // Add socket to queue
    user_list.push(socket.id);
    if(current_user === null){
    	current_user = socket.id;
    } 
    
    let data = {
    	"word": word,
    	"current_user": current_user,
    	"current_pos": current_pos,
    	"current_mappedkey": current_mappedkey,
    	"current_orgKey": current_orgKey 
        };

    socket.emit('init', data);


    socket.on('keyPressed', function(message){
    	let keyCode = message["keyCode"];
    	current_orgKey = String.fromCharCode(keyCode);
      sync();

    	if (current_user !== socket.id){
    		return;
    	} 

      current_mappedkey = key_mapping[current_orgKey];
      sync();
    	if (word[current_pos] === current_mappedkey){
    		current_pos++;
    		next();
    	} 

    });

    socket.on('disconnected', function(message){
    	 for(let s = 0; s < user_list.length; s++) {
           if(user_list[s].id == socket.id) {
           user_list.splice(s, 1);
          }
        }
       // If current client disconnected, move onto next client
      if (socket.id === current_user) {
        next();
      }
    });    	
});



function next(){
	let currentUserIndex = user_list.indexOf(current_user);
	current_user = user_list[(currentUserIndex + 1)/user_list.length];
  sync();

}


function sync(){
  let message = {
       "current_user": current_user,
        "current_pos": current_pos,
        "current_mappedkey": current_mappedkey,
        "current_orgKey": current_orgKey
  };
  io.sockets.emit('sync', message);
}
    
   

 








