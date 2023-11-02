let mockIntakes = [
  {
    _id: "6b99dc4c-2299-4ad2-8299-08cd7e3de025",
    userId: "someUserId",
    dayId: "someDayId",
    foodId: "b4bc2367-b42e-406a-ad3e-693f2307c49c",
    quantity: 10000,
    name: "Grapes",
    calories: 1000,
    fat: 1,
    protein: 1000,
    carbs: 3000,
    servingSize: 3,
    servingUnit: "g",
    access: "PUBLIC_ACCESS",
    description: "",
    imageUrl: "",
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
    first: "Tim",
    last: "Johnson",
    phone: "555-555-5555",
    email: "someEmail@gmail.com",
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
  cy.intercept("POST", "/intake", {
    status: 200,
    body: {
      _id: "someId",
    },
  });
}

export function mockGetIntakes() {
  cy.intercept(
    "GET",
    `http://localhost:3000/intake?date=${new Date().toJSON().slice(0, 10)}`,
    {
      statusCode: 200,
      body: mockIntakes,
    }
  );
}

export function mockGetIntakeById() {
  cy.intercept(
    "GET",
    "http://localhost:3000/intake/6b99dc4c-2299-4ad2-8299-08cd7e3de025",
    {
      statusCode: 200,
      body: mockIntakes[0],
    }
  );
}

export function mockGetFoodOptions() {
  cy.intercept("GET", "http://localhost:3000/food", {
    statusCode: 200,
    body: [
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
        description: "",
        imageUrl: "",
      },
    ],
  });
}
