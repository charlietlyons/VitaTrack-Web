const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require("uuid");

server.use(jsonServer.bodyParser);
server.use(middlewares);

const defaultIntakeRecord = {
  _id: "6b99dc4c-2299-4ad2-8299-08cd7e3de025",
  userId: "someUserId1",
  dayId: "someDayId",
  foodId: "b4bc2367-b42e-406a-ad3e-693f2307c49c",
  quantity: 10000,
};
const defaultFoodRecord = [{
      "_id": "b4bc2367-b42e-406a-ad3e-693f2307c49c",
      "userId": "someUserId",
      "name": "Grapes",
      "calories": 1000,
      "protein": 1000,
      "carbs": 3000,
      "fat": 1,
      "servingSize": 3,
      "servingUnit": "g",
      "access": "PUBLIC_ACCESS",
      "description": "",
      "imageUrl": ""
    },
    {
      "_id": "b4bc2767-b42e-406a-ad3e-693f2307c49c",
      "userId": "someUserId",
      "name": "Bananas",
      "calories": 1000,
      "protein": 1000,
      "carbs": 3000,
      "fat": 1,
      "servingSize": 3,
      "servingUnit": "g",
      "access": "PUBLIC_ACCESS",
      "description": "",
      "imageUrl": ""
    }];

router.db.get("intakes").remove().write();
router.db.get("food").remove().write();
router.db.get("intakes").push(defaultIntakeRecord).write();
defaultFoodRecord.forEach(record => router.db.get("food").push(record).write());

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
  const intakeRecords = router.db.get("intakes").value();
  
  intakeRecords.forEach((intakeRecord) => {
    const foodData = router.db.get("food").find({ _id: intakeRecord.foodId }).value();
    intakeRecord.name = foodData.name;
    intakeRecord.calories = foodData.calories;
    intakeRecord.fat = foodData.fat;
    intakeRecord.protein = foodData.protein;
    intakeRecord.carbs = foodData.carbs;
    intakeRecord.servingSize = foodData.servingSize;
    intakeRecord.servingUnit = foodData.servingUnit;
  })

  if (intakeRecords) {
    res.json(intakeRecords);
  } else {
    res.status(401).json({ error: "No intakes, sorry" });
  }
}

function handleGetIntakeById(req, res) {
  const id = req.path.split("/")[2]
  const intakeRecords = router.db.get("intakes").value();
  const intake = intakeRecords.find((intake) => intake._id === id);
  const foodData = router.db.get("food").find({ _id: intake.foodId }).value();
  intake.name = foodData.name;
  intake.calories = foodData.calories;
  intake.fat = foodData.fat;
  intake.protein = foodData.protein;
  intake.carbs = foodData.carbs;
  intake.servingSize = foodData.servingSize;
  intake.servingUnit = foodData.servingUnit;
  res.json(intake);
}

function handle200(req, res) {
  res.status(200).send();
}

function handleInsertIntake(req, res) {
  const foodRecord = router.db
    .get("food")
    .find({ _id: req.body.foodId })
    .value();

  const insertRecord = {
    _id: uuidv4(),
    userId: "someUserId1",
    dayId: "someDayId",
    foodId: req.body.foodId,
    quantity: 10000,
    name: foodRecord.name,
    calories: foodRecord.calories,
    fat: foodRecord.fat,
    protein: foodRecord.protein,
    carbs: foodRecord.carbs,
    servingSize: foodRecord.servingSize,
    servingUnit: foodRecord.servingUnit,
    access: "PUBLIC_ACCESS",
    description: "",
    imageUrl: "",
  };

  const intakeRecord = router.db
    .get("intakes")
    .find({ _id: req.body.id })
    .value();
  if (intakeRecord) {
    res.status(409).send(false);
  } else {
    router.db.get("intakes").push(insertRecord).write();
    res.status(200).send(true);
  }
}

function handleDeleteIntake(req, res) {
  const id = req.url.split("/")[2];
  const intakeRecord = router.db.get("intakes").find({ _id: id }).value();
  if (intakeRecord) {
    router.db.get("intakes").remove({ _id: id }).write();
    res.status(200).send(true);
  } else {
    res.status(404).send(false);
  }
}

function handleGetFoodOptions(req, res) {
  const foodRecords = router.db.get("food");

  if (foodRecords) {
    res.json(foodRecords);
  } else {
    res.status(401).json({ error: "No foods, sorry" });
  }
}

function handleFoodPost(req, res) {
  router.db.get("food").push(req.body).write();
  res.status(200).send();
}

function handleFoodPatch(req, res) {
  router.db.get("food").remove({ _id: req.body._id}).write();
  router.db.get("food").push(req.body).write();
  res.status(200).send();
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
server.post("/intake", handleInsertIntake);
server.delete("/intake/:id", handleDeleteIntake);

// FOOD
server.get("/food", handleGetFoodOptions);
server.post("/food", handleFoodPost);
server.patch("/food", handleFoodPatch);

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
