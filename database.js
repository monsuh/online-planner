const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
db = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, function(err) {
     if (err) {
          throw err;
     }
     else {
          console.log("connection successful");
     }
});