import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
// import { AppRoutes } from "./routes";

import { getManager } from "typeorm";
import { User } from "./entity/User";


const ormOptions: any = {
	type: 'mysql',
	host: 'localhost',
	port: '3306',
	username: 'root',
	password: 'kakakaimg800',
	database: 'test',
	timezone: 'Z',
	logging: ["query", "error"],
	entities: ['entity/**/*.ts'],
	migrations: ['migration/**/*.ts'],
	migrationsRun: true
};

createConnection(ormOptions)
	.then(value => {
		console.log('3306: [SUCCESS] Database connected!');
		// create express app
		const app = express();
		app.use(bodyParser.json());

		// Routes Definitions
		app.get('/:id', async function (req, res) {
            // First read existing users.
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            // load a user by a given user id
            const user = await userRepository.findOne(+req.params.id);
        
            // if user was not found return 404 to the client
            if (!user) {
                res.status(404);
                res.end();
                return;
            }
        
            // return loaded user
            res.send(user);
        })
        

        app.post('/addUser', async function (req, res) {
            // Prepare output in JSON format
            const user = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                profession: req.body.profession
            };
        
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            const users = await userRepository.create(user);
        
            // return loaded users
            res.send(users);
        })
        
        app.delete('/:id', async function (req, res) {
            // First read existing users.
            // get a user repository to perform operations with user
            const userRepository = getManager().getRepository(User);
        
            userRepository.delete(req.params.id);
            res.end();
            return;
        })        

		// run app
		app.listen(3000);

		console.log("Express application is up and running on port 3000");
	})
	.catch(error => {
		console.log('3306: [ERROR] Database error');
		console.log(`ERROR: ${error}`);
	});