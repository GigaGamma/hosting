const fs = require("fs");
const should = require("chai").should();

const Server = require("../server/server");
const Client = require("../client/client");
const unique = require("../utils/unique");

var s, c;

describe("Hosting", () => {
	describe("Utilities", () => {
		it("can generate a unique device id", done => {
			unique();

			done();
		});
	});
	describe("Client and Server", () => {
		s = new Server(2512);
		c = new Client("localhost", 2512);

		it("can connect", d => {
			c.secure.shook = () => {
				d();
			}
		});

		it("can send large data", done => {
			c.testLargeData(done);
		});

		it("can register an account", done => {
			c.register((username, password) => {
				fs.existsSync(".client").should.equal(true);
				done();
			});
		});

		it("can deregister an account", done => {
			c.deregister(() => {
				fs.existsSync(".client").should.equal(false);
				done();
			});
		});
	});
});