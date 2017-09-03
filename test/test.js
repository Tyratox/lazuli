import test from "ava";

process.on("uncaughtException", console.log);

const Lazuli = require("../src/lazuli-core");

test("load lazuli", t => {
	t.pass();
});
