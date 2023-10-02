const fastify = require('fastify')({logger: true});
const route  = require('./routes');
const dbconnector = require('./db');
fastify.register(dbconnector)
fastify.register(route)



async function start()  { 
    try{ 
        await fastify.listen({port: 5555}) 
    } catch(err) { 
        fastify.log.error(err) 
        process.exit(1) 
    } 
} 
start()

// fastify.get('/cities', async (req, res) =>{
//     result = db.getCities()
//     console.log(result)
//     res.code(200).header('Content-Type', 'application/json; charset=utf-8').send(result).rows[0];
// });

// fastify.listen({port: 5555}, (err, reply) => {
//     if(err){
//         console.log(err)
//         process.exit(1)
//     }
//     console.log('Server running on port 5555')
// });