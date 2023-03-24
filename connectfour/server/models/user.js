const { v4: uuidv4 } = require('uuid');

const BY_USERNAME = {};
const BY_ID = {};
let bcrypt = require('bcrypt');


class User {
   constructor(email, password, defaults ) {

      this.email = email;
      this.password = bcrypt.hashSync(password, 10);
      this._id = uuidv4();
      this.defaults = defaults
      BY_ID[ this.id ] = this;
      BY_USERNAME[ this.email ] = this;
   }
}

function getUsers() {
   let result = Object.values( BY_USERNAME );
   result.sort();
   return result.map( user => Object.assign({}, user ) ).map( u => delete u.password );
}

function getUserById( id ) {
   let user = BY_ID[ id ];
   return user && Object.assign( {}, user );
}

function getUserByUsername( username ) {
   let user = BY_USERNAME[ username ];
   return user && Object.assign( {}, user );
}

function deleteUser( id ) {
   let user = getUserById( id );
   if( user ) {
      delete BY_ID[ user.id ];
      delete BY_USERNAME[ user.email ];
   }
   return user;
}

function isUser( obj ) {
   return ["email", "password"]
      .reduce( (acc,val) => obj.hasOwnProperty( val ) && acc, true  );
}

module.exports = { User:User, 
   getUserByUsername:getUserByUsername, 
   getUserById:getUserById,
   getUsers:getUsers,
   isUser:isUser,
   deleteUser:deleteUser
};