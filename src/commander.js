import { Command } from "commander";
import config from "./config/config.js";

const program = new Command()

// program.option('-p <port>', 'Server Port', 8080)

// program.parse()

// console.log(`Server Up on port ${program.opts().p}`)

program.option('-d <persistence>', 'Persistence', config.environment.development)

program.parse()

export default program


