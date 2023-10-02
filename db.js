const fastifyPlugin = require('fastify-plugin') 
const { Client } = require('pg') 
require('dotenv').config() 
const client = new Client({ 
    user: 'admin', 
    password:'password', 
    host: 'localhost', 
    port: 5432, 
    database: 'api'
}) 
async function dbconnector(fastify, options) { 
    try { 
        await client.connect() 
        console.log("db connected succesfully") 
        fastify.decorate('db', {client}) 
    } catch(err) { 
        console.error(err) 
    } 
} 
module.exports= fastifyPlugin(dbconnector)

