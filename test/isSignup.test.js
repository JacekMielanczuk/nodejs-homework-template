const request = require("supertest");
const { auth } = require("../controlers");
const app = require("../app");

// app.post('/api/users/signup', auth.register);

describe("test register controller", () => {
  // beforeAll(() => {
  //   app.listen(3000);
  //   console.log('Wykonaj na początku');
  // });

  // afterAll(() => {
  //   app.close();
  //   console.log('Wykonaj po testach');
  // });

  test("register return ", async () => {
    const response = await request(app).post("/api/users/signup");
    expect(response.status).toBe(200);
    // console.log(response.status);
  });
});
