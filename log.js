const fs = require("fs");
const chalk = require("chalk").default;
const stripAnsi = require("strip-ansi");

function out(text) {
	var date = new Date();
	var t = "[" + date.toDateString() + " " + date.toTimeString() + "] " + text;
	
	console.log(t);
	if (!fs.existsSync(".log"))
		fs.writeFileSync(".log", stripAnsi(t));
	else
		fs.writeFileSync(".log", fs.readFileSync(".log").toString().trim() + "\n" + stripAnsi(t));
}

function info(text) {
	out(chalk.gray("INFO ") + text);
}

function success(text) {
	out(chalk.green("SUCCESS ") + text);
}

function error(text) {
	out(chalk.red("ERROR ") + text);
}

module.exports = {
	info: info,
	success: success,
	error: error
}