async function routes(fastify, options) {
    const client = fastify.db.client
    
    
    fastify.get('/', async (request, reply) => { 
        reply.send({ hello: 'world' }) 
    }) 

    fastify.get('/cities', async(request, reply) => {
        try{
            const {rows} = await client.query('SELECT * FROM cities')
            return rows
        }catch(err){
            throw new Error(err)
        }
    })

    fastify.get('/api/population/state/:state/city/:city', async(request, reply) => {
        const {city, state} = request.params
        const query = {
            text: `SELECT population FROM cities WHERE state=$1 AND city=$2`,
            values: [state.toLowerCase(), city.toLowerCase()],
            }
        try{
            const {rows} = await client.query(query)
            if(rows.length){
                return rows[0]
            }else{
                reply.code(400).send("City not found")
            }
        }catch(err){
            throw new Error(err)
        }
    })

    fastify.post('/api/population/state/:state/city/:city', async (request, reply) => {
        const {city, state} = request.params
        const population = request.body

        console.log(population)

        console.log(city, state, population)

        const checkQuery = {
            text: `SELECT population FROM cities WHERE state=$1 AND city=$2`,
            values: [state, city],
            }

        const insertQuery = {
            text: `INSERT INTO cities (city, state, population)
                    VALUES($1, $2, $3 ) RETURNING *`,
            values: [city.toLowerCase(), state.toLowerCase(), population],
            }

        const updateQuery = {
            text: `UPDATE cities SET city=$1, state=$2, population=$3 WHERE state=$2 and city=$1`,
            values: [city.toLowerCase(), state.toLowerCase(), population],
        }


        try {
            const {rows} = await client.query(checkQuery)
            if(rows.length){
                await client.query(updateQuery)
                reply.code(200)
                return {updated: true}
            }else{
                await client.query(insertQuery)
                reply.code(201)
                return {created: true}
            }
        } catch (err) {
            throw new Error(err)
        }
    })

    fastify.delete('/api/population/state/:state/city/:city',  async function(request, reply) {
        const {city, state} = request.params
        console.log(request.params)
        try {
            const {rows} = await client.query('DELETE FROM cities WHERE state = $1 and city = $2 RETURNING *', [state, city])
            console.log(rows[0])
            reply.code(204)
        } catch(err) {
            throw new Error(err)
        }
    })

} 
module.exports= routes