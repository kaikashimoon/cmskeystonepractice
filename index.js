const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'intento';
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const adapterConfig = { mongoUri: 'mongodb://localhost:27017' };
const UserSchema = require('./schemas/User')
const BookSchema = require('./schemas/Book')


const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
});

const isAdmin = ({authentication: { item: user }}) => !!user && !!user.isAdmin
const isLoggedIn = ({authentication: { item: user }}) => !!user 

const isOwner = ({authentication: { item: user }}) => {
  if(!user) {
    return false
  }
  return { id: user.id}
}

const isAdminOrOwner = auth => {
  const isAdmin = acces.isAdmin(auth)
  const isOwner = acces.isOwner(auth)
  
  return isAdmin ? isAdmin : isOwner
}

const acces = { isAdmin, isLoggedIn, isOwner, isAdminOrOwner}

keystone.createList('User', {
  fields: UserSchema.fields,
  access: {
    read: acces.isLoggedIn,
    create: acces.isAdmin,
    update: acces.isAdminOrOwner,
    delete: acces.isAdmin,
    auth: true
  },
  labelField: 'userName'
})

keystone.createList('Book', {
  fields: BookSchema.fields,
  access: {
    read: true,
    create: acces.isLoggedIn,
    update: acces.isAdminOrOwner,
    delete: acces.isAdmin,
  }
})

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'username',
    secretField: 'password'
  }
})

module.exports = {
  keystone,
  apps: [new GraphQLApp(), new AdminUIApp({ 
    name: PROJECT_NAME, 
    enableDefaultRoute: true,
    authStrategy,
   })],
};
