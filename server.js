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
  var ids = [];
  var num = Number(request.params.id);
  for (var i = 0; i < storage.items.length; i++) {
    ids[i] = storage.items[i].id;
  }
  if (ids.indexOf(num) == -1) {
    return response.sendStatus(404);
  }
  storage.delete(num);
  response.status(200).json(storage.items);
});

app.put('/items/:id', jsonParser, function(request, response) {
  storage.edit(request.params.id, request.body.name);
});


//storage.edit(2);
//console.log(storage.items);

app.listen(process.env.PORT || 8080, process.env.IP);