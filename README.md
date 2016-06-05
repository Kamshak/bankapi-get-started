# GET /started


1) Klont das repository, dann installiert die Abhängigkeiten: ```npm install```

2) Kopiert die Key Dateien von http://pbs-certificates.hack.institute/ in den Ordner (HACK*.key, ou=...)

3) Das Password muss zu Anfang einmal geändert werden (username und password sind zu ersetzen mit den Passwörtern, die man von den Organisatoren bekommt, neues_pw ist das neue Passwort):
```
chmod a+x set-password.sh
USERNAME=username PASSWORD=password NEW_PASSWORD=neues_pw ./set-password.sh 
```

Das neue Pass

4) Die API ist bereit zur Nutzung:
```
node demo.js
```

# HOWTO Use (demo.js):

```js
var bank = require('./index'),
  _ = require('lodash');

if (!process.env.SSL_KEY) {
  require('dotenv').config();
}

bank.authenticate()
.then(() => {
  return bank.get("/accounts");
})
.then(function(accounts) {
  console.log(accounts);
});
```
Analog gibt es noch
```js
bank.post('/path', { param1: 123 });
```
