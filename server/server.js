const net = require("net");
const logger = require("../log");
const unique = require("../utils/unique");
const secureServer = require("gg-secure-server");

var store = new (require("open-ums").adapters.lowdb)("server_store.json");

module.exports = class Server {

	constructor(port) {
		net.createServer(socket => {
			socket.secure = new secureServer(socket, "server");

			socket.secure.ondata = data => {
				if (data == "large data check, please reply. This is a large data check, please reply")
					socket.secure.write("receivedLargeData");
				else if (data == "register") {
					var d = this.createDevice();
					socket.secure.write("registered:" + d);
					socket.user = d.split(":")[0];
				} else if (data == "deregister") {
					if (socket.user == undefined) {
						logger.error("User tried to deregister without any username");
						return;
					}
					store.db.get("users").remove({username: socket.user}).write();
					socket.secure.write("deregistered");
				}
			};
		}).listen(port);
	}

	createDevice() {
		var u = {
			username: unique(),
			password: unique() + unique()
		};

		var user = store.createUser(u.username, u.password);
		return u.username + ":" + u.password;
	}

	getDevice(id) {
	
	}

}