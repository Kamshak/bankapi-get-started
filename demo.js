var bank = require('./index'),
  _ = require('lodash');

if (!process.env.SSL_KEY) {
  require('dotenv').config();
}

bank.authenticate()
.then(() => {
  return bank.get("/accounts");
})
.then(console.log.bind(console), console.error.bind(console))
.then(process.exit, process.exit);
