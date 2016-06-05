#!/bin/bash

set -e

rm .env
touch .env

cp HACK_*.key client.key
openssl x509 -inform der -in ou* -out client.pem

echo "SSL_KEY=$(cat client.key | base64 --wrap=0)" >> .env
echo "SSL_CERT=$(cat client.pem | base64 --wrap=0)" >> .env
rm client.key
rm client.pem

echo "USERNAME=$USERNAME" >> .env
echo "PASSWORD=$PASSWORD" >> .env

node set_initial_password.js "$NEW_PASSWORD"
sed -i '$ d' .env
echo "PASSWORD=$NEW_PASSWORD" >> .env
echo "Your environment has been set up in .env. You can now remove your key files"
