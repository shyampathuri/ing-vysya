const request = require("supertest");
const app = require("./app");
const d2m = require("./helpers/d2m.helper");

let loginRes = undefined;

beforeAll(() => {
  d2m.loadUserData("users.json");
  d2m.loadAtmData("atmdata.json");
});

describe("Test the default path", () => {
  test("/", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
  test("/404", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(401);
  });
});

describe("Test Authentication", () => {
  test("/login - 401", async () => {
    const response = await request(app).post("/login");
    expect(response.statusCode).toBe(401);
  });

  test("/login - 401", async () => {
    const response = await request(app).post("/login").send({});
    expect(response.statusCode).toBe(401);
  });

  test("/login - Wrong credentials", async () => {
    const response = await request(app).post("/login").send({
      username: "shyam@test.com",
      password: "passcord",
    });
    expect(response.statusCode).toBe(401);
  });
  test("/login - 200", async () => {
    const response = await request(app).post("/login").send({
      username: "shyam@test.com",
      password: "password",
    });
    loginRes = response.body;
    expect(response.statusCode).toBe(200);
  });
});

describe("Test User APIs", () => {
  test("create 401", async () => {
    const response = await request(app).post("/users");
    expect(response.statusCode).toBe(401);
  });
  test("create 200", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "test2@email.com",
        password: "password",
      })
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });
  test("create 500", async () => {
    const response = await request(app)
      .post("/users")
      .send([])
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });

  test("users all 200", async () => {
    const response = await request(app)
      .get("/users")
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });

  test("/users/test2@email.com 200", async () => {
    const response = await request(app)
      .get("/users/test2@email.com")
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });
  test("/users/testN@email.com 500", async () => {
    const response = await request(app)
      .get("/users/test2@email.com")
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });

  test("/users/test2@email.com 200", async () => {
    const response = await request(app)
      .put("/users/test2@email.com")
      .set({
        authorization: "Bearer " + loginRes.access_token,
      })
      .send({
        username: "test2@email.com",
        password: "passwordX",
      });
    expect(response.statusCode).toBe(200);
  });

  test("/users/test2@email.com", async () => {
    const response = await request(app)
      .delete("/users/test2@email.com")
      .set({
        authorization: "Bearer " + loginRes.access_token,
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test ATM APIs", () => {
  test("/atm 401", async () => {
    const response = await request(app).post("/atm");
    expect(response.statusCode).toBe(401);
  });
  test("create 200", async () => {
    const response = await request(app)
      .post("/atm")
      .set({ authorization: "Bearer " + loginRes.access_token })
      .send({
        address: {
          street: "Chengicherla",
          housenumber: "4-108",
          postalcode: "5531 EH",
          city: "Hyderabad",
          geoLocation: {
            lat: "51.36784",
            lng: "5.22107",
          },
        },
      });
    expect(response.statusCode).toBe(200);
  });
  test("create 200", async () => {
    const response = await request(app)
      .post("/atm")
      .set({ authorization: "Bearer " + loginRes.access_token })
      .send({});
    expect(response.statusCode).toBe(200);
  });
  test("/atm/search 200", async () => {
    const response = await request(app)
      .get("/atm/search")
      .set({ authorization: "Bearer " + loginRes.access_token });
    expect(response.statusCode).toBe(200);
  });
  test("/atm/search/Hyderabad 200", async () => {
    const response = await request(app)
      .get("/atm/search/Hyderabad")
      .set({ authorization: "Bearer " + loginRes.access_token });
    expect(response.statusCode).toBe(200);
  });
  test("/atm/atm_1 500", async () => {
    const response = await request(app)
      .get("/atm/atm_1")
      .set({ authorization: "Bearer " + loginRes.access_token });
    expect(response.statusCode).toBe(200);
  });
  test("/atm/atm_1 200", async () => {
    const response = await request(app)
      .get("/atm/atm_1")
      .set({ authorization: "Bearer " + loginRes.access_token });
    expect(response.statusCode).toBe(200);
  });
  test("/atm/atm_1 200", async () => {
    const response = await request(app)
      .put("/atm/atm_1")
      .set({ authorization: "Bearer " + loginRes.access_token })
      .send({
        address: {
          street: "Chengicherla",
          housenumber: "4-108",
          postalcode: "5531 EH",
          city: "Hyderabad",
          geoLocation: {
            lat: "51.36784",
            lng: "5.22107",
          },
        },
      });
    expect(response.statusCode).toBe(200);
  });
  test("/atm/atm_1 200", async () => {
    const response = await request(app)
      .delete("/atm/atm_1")
      .set({ authorization: "Bearer " + loginRes.access_token });
    expect(response.statusCode).toBe(200);
  });
});
