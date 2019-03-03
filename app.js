
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes'),
    bodyParser = require('body-parser')
    methodOverride = require('method-override')
    logger = require('morgan'),
    mongoose = require('mongoose');
    db = require('./db');
    _ = require('underscore');
    const fileUpload = require('express-fileupload');


//File include

var app = module.exports = express();
//var server   = require('http').Server(app);
app.config = require('./config');
// Configuration
// default options 
app.use(fileUpload());
//app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  ///app.engine('html', require('ejs').renderFile);
  //app.engine('html', require('ejs').renderFile);
  //app.set('view engine', 'html');
  app.set('view engine', 'jade');
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());
  app.use(methodOverride());
  //app.use(app.router);
  app.use(bodyParser({ keepExtensions: true, uploadDir: "uploads" })); 
  app.use(express.static(__dirname + '/public'));
  app.use(logger('dev'));
  var connection = mongoose.connect(app.config.MONGO_URI);
  mongoose.connection.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?', err);
});
//});

/*app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});*/


// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  }
});



// Routes
var router = express.Router();
require('./route.js')(router, app);
require('./models')(app, mongoose);



var server = app.listen(app.get("port"), function(){
  console.log("Express server listening on port %d in %s mode", app.get("port"), app.settings.env);
});


/*Active User list variable structure*/
/*app.activeUsers = {
                      username(dynamice):{
                                            socketid: socketid
                                         }
                    };*/

app.activeUsers = {};
// Hook Socket.io into Express
app.io = require('socket.io').listen(server);

app.user = require('./freeMarriage/user');
app.message = require('./freeMarriage/message');

app.io.on('connection', function(socket) {
  console.log('socket connection established');
  
  socket.on('userconnected', function(userId){
    socket.broadcast.emit('onlineFriend', userId);
    _.each(app.activeUsers, function (value, prop) {  
        console.log('userid: ', prop);
        if(app.io.sockets.sockets[socket.id] && app.io.sockets.sockets[app.activeUsers[prop].socketid]){
           app.io.sockets.sockets[socket.id].emit('onlineFriend', prop);
        }
    })
    //app.io.sockets.emit ('onlineFriend', userId);
    console.log('socket use id: ', userId);
    app.activeUsers[userId] = {'socketid': socket.id};
    console.log('active user: ', app.activeUsers);
  });
  
  socket.on('sendMessage', function(msgData){
     console.log('new message received: ', msgData);
     app.message.insertMessage(msgData);
     if (typeof app.activeUsers[msgData.sendTo] !== "undefined") {
        var receiverSocketId = app.activeUsers[msgData.sendTo].socketid;
        if(app.io.sockets.sockets[receiverSocketId]){
           app.io.sockets.sockets[receiverSocketId].
                emit('newMessage', msgData);
        }else{
          console.log("not socket connected");
        }
     }else{
       console.log("not active user");
     }
  });
  
  socket.on('disconnect', function(data){
    console.log('disconnect: ', socket.id);
    _.each(app.activeUsers, function (value, prop) {  
        console.log('userid: ', prop);
        if(app.activeUsers[prop].socketid == socket.id){
          socket.broadcast.emit('offlineFriend', prop);
          
        }
    })
    
  });
  
});



