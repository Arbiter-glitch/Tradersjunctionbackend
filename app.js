const express = require('express');
const UserData = require('./src/model/Userdata');
const ProductsData = require('./src/model/Productdata');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var app = new express();
app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1] //word index 0 is the Bearer word word index 1 is the token
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}


app.post('/login', (req, res) => {
  setTimeout(() => {
    let username = req.body.user.username;
    let password = req.body.user.password;
    if (username == "admin" && password == "12345") {

      let payload = { subject: username + password };
      let token = jwt.sign(payload, 'secretKey');
      res.status(200).send({ token });
    }
    else {
      UserData.findOne({ $or: [{ email: username }, { phonenumber: username }] }, function (err, user) {
        if (!user) {
          message1 = { m1: "Invalid Username" };
          res.send(message1);

        }
        else if (password == user.password) {
          UserData.findOneAndUpdate({ $or: [{ email: username }, { phonenumber: username }] }, { $set: { currentstatus: "Active" } }, { new: true, useFindAndModify: true },
            function (err, doc) {
              if (err) {
                console.log("Something wrong when updating data!");
              }

            });
          let payload = { subject: username + password };
          let token = jwt.sign(payload, 'secretKey');
          res.status(200).send({ token });

        }
        else if (password != user.password) {
          message1 = { m1: "Invalid Password" };
          res.send(message1);
        }

      }
      )
    }
  }, 800);

}
)

app.post('/adduser', (req, res) => {
  setTimeout(() => {
    var username1 = req.body.user.email;
    var username2 = req.body.user.phonenumber;
    UserData.findOne({ $or: [{ email: username1 }, { phonenumber: username2 }] }, function (err, user) {
      if (!user) {
        var user = {
          username: req.body.user.username,
          phonenumber: req.body.user.phonenumber,
          dob: req.body.user.dob,
          email: req.body.user.email,
          password: req.body.user.password,

        }
        var user = new UserData(user);
        user.save();
        message1 = { m1: "Successfully Registered new User!" };
        res.status(200).send(message1);
      }
      else {
        message1 = { m1: "User already exists" };
        res.send(message1);
      }
    })

  }, 900);

});
app.put('/loggedout', function (req, res) {
  setTimeout(() => {
    username1 = req.body.user.email;

    UserData.findOneAndUpdate({ $or: [{ email: username1 }, { phonenumber: username1 }] }, { $set: { currentstatus: "Away" } }, { new: true, useFindAndModify: true },
      function (err, doc) {
        if (err) {
          console.log("Something wrong when updating data!");
        }
      });
  }, 1000);


})
app.post('/insert', verifyToken, function (req, res) {
  setTimeout(() => {
    var user = req.body.product.username;
    UserData.findOne({ $or: [{ email: user }, { phonenumber: user }] }, function (err, userdata) {
      var email = userdata.email;
      var phoneno = userdata.phonenumber;

      var product = {
        username1: email,
        username2: phoneno,
        productName: req.body.product.productName,
        Category: req.body.product.Category,
        Quantity: req.body.product.Quantity,
        Price: req.body.product.Price,
        dob: req.body.product.dob,
        Address: req.body.product.Address,
        Phoneno: req.body.product.Phoneno

      }

      var product = new ProductsData(product);
      product.save();
    }, 800);

  }
  )




});
app.get('/products/:currentuser', verifyToken, function (req, res) {
  setTimeout(() => {
    currentuser = req.params.currentuser;
    ProductsData.find({ $or: [{ username1: currentuser }, { username2: currentuser }] })
      .then(function (products) {
        res.send(products);
      });
  }, 700);

});
app.get('/productsall', verifyToken, function (req, res) {

  setTimeout(() => {
    ProductsData.find()
      .then(function (products) {
        res.send(products);
      });
  }, 600);

});

app.get('/users', verifyToken, function (req, res) {
  setTimeout(() => {
    UserData.find()
      .then(function (users) {
        res.send(users);
      });
  }, 600);

});
app.get('/currentuser/:currentuser', verifyToken, function (req, res) {

  currentuser = req.params.currentuser;
  UserData.findOne({ $or: [{ email: currentuser }, { phonenumber: currentuser }] })
    .then(function (user) {
      res.send(user);
    });
});

app.delete('/delete/:id', verifyToken, (req, res) => {
  setTimeout(() => {
    id = req.params.id;
    UserData.findByIdAndDelete({ "_id": id }, { useFindAndModify: true })
      .then(() => {
        console.log('success')
        res.send();
      })
  }, 400);

});
app.delete('/remove/:id', verifyToken, (req, res) => {

  setTimeout(() => {
    id = req.params.id;
    ProductsData.findByIdAndDelete({ "_id": id }, { useFindAndModify: true })
      .then(() => {
        console.log('success')
        res.send();
      })
  }, 400);

});


app.listen(3300, () => {
  console.log("listening at port 3300");
})