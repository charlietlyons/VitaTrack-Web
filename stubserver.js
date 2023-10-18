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
  const token = req.headers.authorization.split(" ")[1];

  if (token === "someToken") {
    res.status(200).send();
  } else {
    res.status(401).send();
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

async function handleGetIntakeById(req, res) {
  const intakeRecords = router.db.get("intakes").value();
  const firstIntake = intakeRecords[0];
  res.json(firstIntake);
}

function handle200(req, res) {
  res.status(200).send();
}

function handleDeleteIntake(req, res) {
  res.status(200).send(true);
}

function handleGetFoodOptions(req, res) {
  const foodRecords = router.db.get("food");

  if (foodRecords) {
    res.json(foodRecords);
  } else {
    res.status(401).json({ error: "No foods, sorry" });
  }
}

// USER
server.get("/account-details", handleAccountDetails);
server.post("/register-user", handleRegistration);
server.post("/verify-user", handleLogin);
server.post("/verify-token", handleTokenVerification);
server.post("/forgot-password", handle200);
server.post("/update-password", handle200);

// INTAKE
server.get("/intake", handleGetIntakes);
server.get("/intake/:id", handleGetIntakeById);
server.patch("/intake/:id", handle200);
server.post("/intake", handle200);
server.delete("/intake/:id", handleDeleteIntake);

// FOOD
server.get("/food", handleGetFoodOptions);
server.post("/food", handle200);
server.patch("/food", handle200);

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
