let mockIntakes = [
  {
    _id: "6b99dc4c-2299-4ad2-8299-08cd7e3de025",
    userId: "someUserId",
    dayId: "someDayId",
    foodId: "b4bc2367-b42e-406a-ad3e-693f2307c49c",
    quantity: 10000,
  },
];

let mockFoodOptions = [
  {
        _id: "b4bc2367-b42e-406a-ad3e-693f2307c49c",
        name: "Grapes",
        calories: 1000,
        fat: 1,
        protein: 1000,
        carbs: 3000,
        servingSize: 3,
        servingUnit: "g",
        access: "PUBLIC_ACCESS",
        description: "something",
        imageUrl: "something.com",
      },
      {
        _id: "4bc2367-b42e2-406a-ad3e-2112311wqe",
        name: "Bananas",
        calories: 1000,
        fat: 1,
        protein: 1000,
        carbs: 3000,
        servingSize: 3,
        servingUnit: "g",
        access: "PUBLIC_ACCESS",
        description: "something",
        imageUrl: "something.com",
      },
];
let mockVerifyTokenThenMockAgainInterceptorCount = 0

export function mockVerifyToken() {
  cy.intercept("POST", "/verify-token", {
    status: 200,
  });
}

export function mockVerifyTokenThenMockAgain(firstMock, secondMock) {
  cy.intercept("POST", "/verify-token", (req) => {
    if (mockVerifyTokenThenMockAgainInterceptorCount === 0 ) {
      mockVerifyTokenThenMockAgainInterceptorCount += 1;
      req.reply(firstMock)
    } else {
      req.reply(secondMock)
    }
  })
}

export function mockAccountDetails() {
  cy.intercept("GET", "/account-details", {
    status: 200,
    body: {
      first: "Tim",
      last: "Johnson",
      phone: "555-555-5555",
      email: "someemail",
    }
  });
}

export function mockLogin() {
  cy.intercept("POST", "/verify-user", {
    status: 200,
    body: {
      token: "someToken",
    },
  });
}

export function mockForgetPasswordEmail() {
  cy.intercept("POST", "/forgot-password", {
    status: 200,
    body: {
      
    },
  });
}

export function mockRegister() {
  cy.intercept("POST", "/register", {
    status: 204,
  });
}

export function mockAddIntake() {
  cy.intercept("POST", "/intake", (req) => {
    const foodOption = mockFoodOptions.find((option) => option._id === req.body.foodId)
    mockIntakes.push({
      _id: "someId",
      userId: "someUserId",
      dayId: "someDayId",
      foodId: foodOption._id,
      quantity: 10000,
      name: foodOption.name,
      calories: 1000,
      fat: 1,
      protein: 1000,
      carbs: 3000,
      servingSize: 3,
      servingUnit: "g",
      access: "PUBLIC_ACCESS",
      description: "",
      imageUrl: "",
    })
    req.reply(200);
  });
}

export function mockGetIntakes() {
  mockIntakes.forEach((intake) => {
    const foodData = mockFoodOptions.find((option) => option._id === intake.foodId)
    if (foodData) {
      intake.name = foodData.name;
      intake.calories = foodData.calories;
      intake.fat = foodData.fat;
      intake.protein = foodData.protein;
      intake.carbs = foodData.carbs;
      intake.servingSize = foodData.servingSize;
      intake.servingUnit = foodData.servingUnit;
    }
  });
  cy.intercept(
    "GET",
    `/intake?date=${new Date().toJSON().slice(0, 10)}`,
    (req) => {
      req.reply(200, mockIntakes);
    }
  );
}

export function mockGetFirstIntakeById() {
  cy.intercept(
    "GET",
    "/intake/6b99dc4c-2299-4ad2-8299-08cd7e3de025",
    {
      statusCode: 200,
      body: mockIntakes[0],
    }
  );
}

export function mockGetSecondIntakeById() {
  cy.intercept(
    "GET",
    "/intake/someId",
    {
      statusCode: 200,
      body: mockIntakes[1],
    }
  );
}

export function mockAddFood() {
  cy.intercept("POST", "/food", (req) => { 
    mockFoodOptions.push({
      _id: "someOtherId",
      name: req.body.name,
      calories: req.body.calories,
      fat: req.body.fat,
      protein: req.body.protein,
      carbs: req.body.carbs,
      servingSize: req.body.servingSize,
      servingUnit: req.body.servingUnit,
      access: req.body.access,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    });
    req.reply(200)
  });
}

export function mockUpdateFood() {
  cy.intercept("PATCH", "/food?", (req) => { 
    mockFoodOptions.forEach((option) => {
      if (option._id === req.body._id) {
        option.name = req.body.name
        option.calories = req.body.calories
        option.fat = req.body.fat
        option.protein = req.body.protein
        option.carbs = req.body.carbs
        option.servingSize = req.body.servingSize
        option.servingUnit = req.body.servingUnit
        option.access = req.body.access
        option.description = req.body.description
        option.imageUrl = req.body.imageUrl
      }
    })
    req.reply(200)
  });
}

export function mockDeleteFood() {
  cy.intercept("DELETE", "/food/*", (req) => {
    const id = req.url.split("/").pop() 
    mockFoodOptions = mockFoodOptions.filter((option) => option._id !== id)
    req.reply(200)
  });
}

export function mockDeleteIntake() {
  cy.intercept("DELETE", "/intake/*", (req) => {
    const id = req.url.split("/").pop() 
    mockIntakes = mockIntakes.filter((option) => option._id !== id)
    req.reply(200)
  });
}

export function mockGetFoodOptions() {
  cy.intercept("GET", "/food", (req) => { 
    req.reply(200, mockFoodOptions)
  });
}

export function visitDailyStatsPage() {
  cy.visit("http://localhost:8080/vitatrack/daily", {
    onBeforeLoad: (win) => {
      win.localStorage.setItem("token", "someToken");
    },
  });
}
