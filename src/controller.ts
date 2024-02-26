import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";

/**
 * TODO: Copy the route handling logic from the previous exercise
 * into these functions. You will need to use the party array from
 * the model.ts file to handle the requests.
 */

// GET /
export const getHome = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Hello from the Pokemon Server!' }, null, 2));
    }
};

// GET /pokemon
export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url === '/pokemon') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'All Pokemon', payload: database }, null, 2));
    }
};

// GET /pokemon/:id
export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url?.startsWith('/pokemon/')) {
        // Find Pokemon by ID
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);
        const foundPokemon = database.find(pokemon => pokemon.id === pokemonId);
        if (foundPokemon) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Pokemon found', payload: foundPokemon }, null, 2));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Pokemon not found' }, null, 2));
        }
    }
};

// POST /pokemon
export const createPokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'POST' && req.url === '/pokemon') {
        let body = ''; // To store incoming data
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newPokemon = JSON.parse(body);
            // Add basic data logic (you'd likely use a database in a real application)
            newPokemon.id = database.length + 1; // Simple ID assignment
            database.push(newPokemon);
            res.statusCode = 201; // 'Created'
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Pokemon created!', payload: newPokemon }, null, 2));
        });
    }
};

// PUT /pokemon/:id
export const updatePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'PUT' && req.url?.startsWith('/pokemon/')){
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);
        let body = ''; // To store incoming data
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
        const newPokemon = JSON.parse(body);

        database.forEach(element => {
            if(pokemonId == element.id){
                if(newPokemon.name != undefined){
                    element.name = newPokemon.name
                }
                if(newPokemon.type != undefined){
                    element.type = newPokemon.type
                }
            }
        });

        res.statusCode = 201; // 'Created'
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Pokemon updated!', payload: database }, null, 2));
        })
    }
};

// DELETE /pokemon/:id
export const deletePokemon = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'DELETE' && req.url?.startsWith('/pokemon/')){
        const urlParts = req.url.split('/');
        const pokemonId = parseInt(urlParts[2]);

        req.on('end', () => {

            const temp = database.slice(pokemonId)

            res.statusCode = 201; // 'Created'
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Pokemon updated!', payload: temp }, null, 2));
        })
    }
};
