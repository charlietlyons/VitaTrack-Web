const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

function handleLogin(req, res) {
  const { email, password } = req.body;

  const userRecord = router.db.get("users").find({ email, password }).value();

  if (userRecord) {
    res.json({ token: "someToken" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}

function handleTokenVerification(req, res) {
  const { token } = req.body;

  if (token === "someToken") {
    res.status(200);
  } else {
    res.status(401);
  }
}

function handleRegistration(req, res) {
  const { email, password } = req.body;

  const userRecord = router.db
    .get("users")
    .find({ user: email, password })
    .value();

  if (userRecord) {
    res.status(401).json({ error: "User already exists" });
  } else {
    res.status(200);
  }
}

server.post("/register-user", handleRegistration);
server.post("/verify-user", handleLogin);
server.post("/verify-token", handleTokenVerification);

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
