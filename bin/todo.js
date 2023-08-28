#!/usr/bin/env node

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import rl from 'readline';

import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv;
const commands = ['new', 'get', 'complete', 'help'];

// Databases
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter);

await db.read()

// Set some defaults (required if your JSON file is empty)

db.data ||= { todos: [] }

await db.write()
// db.defaults({ todos: [] }).write()

const usage = function () {
	const usageText = `
  todo helps you manage you todo tasks.

  Usage:
	todo [options]

  Options:
	-h, help            used to print the usage guide
	-n, new             used to create a new todo
	-l, list            used to retrieve your todos
	complete <number>  used to mark a todo as complete
  `
	console.log(usageText)
}

if (args.length > 3 && args[2] != 'complete') {
	errorLog('only one argument can be accepted')
	usage();
}

// used to log errors to the console in red color
function errorLog(error) {
	const eLog = chalk.red(error)
	console.log(eLog)
}

function prompt(question) {
	const r = rl.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	return new Promise((resolve, error) => {
		r.question(question, answer => {
			r.close() // Mata o prompt
			resolve(answer)
		});
	})
}

function saveTask(msg) {
	const { todos } = db.data;
	todos.push({ title: msg, complete: false });
	db.write();
}

function newTodo() {
	const q = chalk.blue('Type in your todo\n> ')
	prompt(q).then(todo => {
		// console.log('todo >>>>', todo);
		saveTask(todo);
		getTodos();
	})
};

function getTodos() {
	const { todos } = db.data;
	let index = 1;
	todos.forEach(todo => {
		let todoText = `${index++}. ${todo.title}`
		if (todo.complete) {
			todoText += ' ✔' // add a check mark
		}
		console.log(todoText);
	})
};

function completeTodo() {
	// check that length
	if (args.length != 4) {
		errorLog("invalid number of arguments passed for complete command")
		return
	}

	let n = Number(args[3])
	// check if the value is a number
	if (isNaN(n)) {
		errorLog("please provide a valid number for complete command")
		return
	}

	const { todos } = db.data;

	// check if correct length of values has been passed
	let todosLength = todos.length
	if (n > todosLength) {
		errorLog("invalid number passed for complete command.")
		return
	}

	// update the todo item marked as complete
	todos[n-1].complete = true;
	db.write();
}

switch (args[2]) {
	case 'help':
	case '-h':
		usage();
		break
	case 'new':
	case '-n':
		newTodo();
		break
	case 'list':
	case '-l':
		getTodos();
		break
	case 'complete':
		completeTodo();
		break
	default:
		errorLog('invalid command passed')
		usage()
}