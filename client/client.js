const fs = require("fs");
const net = require("net");
const logger = require("../log");
const secureServer = require("gg-secure-server");

module.exports = class Client {

	constructor(ip, port) {
		this.socket = net.createConnection(port, ip);
		this.secure = new secureServer(this.socket, "client");

		this.cbs = {largeData: () => {}, register: (username, password) => {}, deregister: () => {}};

		this.secure.ondata = data => {
			if (data == "receivedLargeData") {
				this.cbs.largeData();
			} else if (data.startsWith("registered:")) {
				fs.writeFileSync(".client", data.split(":")[1] + ":" + data.split(":")[2]);
				this.cbs.register(data.split(":")[1], data.split(":")[2]);
			} else if (data.startsWith("deregistered")) {
				fs.unlinkSync(".client");
				this.cbs.deregister();
			}
		};
	}

	register(cb) {
		this.cbs.register = cb;

		this.secure.write("register");
	}

	deregister(cb) {
		this.cbs.deregister = cb;

		this.secure.write("deregister");
	}

	login(username, password) {
		this.secure.write("auth:" + username + ":" + password);
	}

	testLargeData(cb) {
		this.cbs.largeData = cb;

		this.secure.write("large data check, please reply. This is a large data check, please reply");
	}

}