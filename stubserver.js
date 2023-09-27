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

  const userRecord = router.db.get("users").find({ email, password }).value();

  if (userRecord) {
    res.status(401).json({ error: "User already exists" });
  } else {
    res.status(200);
  }
}

function handleAccountDetails(req, res) {
  const userRecord = router.db
    .get("users")
    .find({
      email: "test",
      password: "password",
    })
    .value();

  if (userRecord) {
    res.status(200).json(userRecord);
  } else {
    res.status(404).json({ error: "Not found" });
  }
}

function handleGetIntakes(req, res) {
  const intakeRecords = router.db.get("intakes");

  if (intakeRecords) {
    res.json(intakeRecords);
  } else {
    res.status(401).json({ error: "No intakes, sorry" });
  }
}

function handleAddIntake(req, res) {
  res.status(200).send();
}

function handleAddFood(req, res) {
  res.status(200).send();
}

function handleGetFoodOptions(req, res) {
  const foodRecords = router.db.get("food");

  if (foodRecords) {
    res.json(foodRecords);
  } else {
    res.status(401).json({ error: "No foods, sorry" });
  }
}

server.get("/account-details", handleAccountDetails);
server.post("/register-user", handleRegistration);
server.post("/verify-user", handleLogin);
server.post("/verify-token", handleTokenVerification);
server.get("/intake", handleGetIntakes);
server.post("/add-intake", handleAddIntake);
server.get("/food", handleGetFoodOptions);
server.post("/food", handleAddFood);

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
