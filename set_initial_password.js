var bank = require('./index'),
  _ = require('lodash');
require('dotenv').config();

bank.authenticate()
.then(() => {
  return bank.get('/token');
})
.then((blueprint) => {
  var object = _.extend(blueprint, {newPassword: process.env.NEW_PASSWORD});
  return bank.post('/passwordchange', object);
})
.then(() => {
  console.log("Password set");
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
