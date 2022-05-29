NODEMON=./node_modules/.bin/nodemon

run-same-origin-policy-demo:
	serve same-origin-policy

run-server-for-demo-simple-request:
	$(NODEMON) cors/simple-request.js

run-server-for-demo-preflighted-request:
	$(NODEMON) cors/preflighted-request.js

run-cookie-secure-httponly-example:
	$(NODEMON) cookie.Secure.HttpOnly/main.js
