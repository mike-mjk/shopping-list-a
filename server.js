var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  
  edit: function(id, name) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        //console.log(this.items[i]);
        this.items[i].name = name;
        //console.log("items " + this.items);
      }
    }
  },
  
  delete: function(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id == id) {
        this.items.splice(i, 1);
      }
    }
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
  if (!('name' in request.body)) {
    return response.sendStatus(400);
  }
  
  var item = storage.add(request.body.name);
  response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
  // still need to add fail condition and servers response success
  // var ids = [];
  var num = parseInt(request.params.id, 10);
  // for (var i = 0; i < storage.items.length; i++) {
  //  ids[i] = storage.items[i].id;
  // }
  var ids = storage.items.map(function (v, i) {
    return storage.items[i].id;
  });
  if (ids.indexOf(num) == -1) {
    return response.sendStatus(404);
  }
  storage.delete(num);
  response.status(200).json(storage.items);
});

app.put('/items/:id', jsonParser, function(request, response) {
  //console.log(request.body.name.length);
  // Do the same thing what you did for delete.
  // Todo: Convert this into storage.isExist() function that returns boolean.
  var ids = storage.items.map(function (v, i) {
    return storage.items[i].id;
  });
  console.log(ids);
  // Check if the ID is present. If not...
  if (ids.indexOf(+request.params.id) === -1) {
    // In delete, we send 404. But instead, we need to add.
    // So take the contents from the POST and add it here.
    // Contents of the POST:
    console.log("not found");
    if (!('name' in request.body)) {
      return response.sendStatus(400);
    }
    
    var item = storage.add(request.body.name);
    return response.status(201).json(item);
  }
  
  if (request.params.id == null || request.body.name.length == 0) {
    return response.sendStatus(400);
  }
  storage.edit(request.params.id, request.body.name);
  response.status(200).json({
    id: request.params.id,
    name: request.params.name
  });
});


//storage.edit(2);
//console.log(storage.items);

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;