#Jair


##Work in progress


Enjoy the code but by far not ready for use.

##Usage

Before you follow the installation steps, you should [install Couchdb](http://wiki.apache.org/couchdb/Installation)

After installation it may be desired to tell Couchdb it is allowed to except connections from everywhere
```sh
curl -X PUT http://localhost:5984/_config/httpd/enable_cors -d '"true"'
curl -X PUT http://localhost:5984/_config/cors/origins -d '"*"'
```
(Please take in account that this should not be done in a production enviroment).

###installation steps


1. get the code
2. npm install
3. bower install
4. grunt serve
