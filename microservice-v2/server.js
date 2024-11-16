const express = require("express");
const client = require("prom-client");

const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestDuration);

const heavyWork = () => {
  let arr = [];
  for (let i = 0; i < 10000000; i++) {
    arr.push(Math.random());
  }
  arr.sort();
  return arr.slice(0, 10);
};

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/", (req, res) => {
  const end = httpRequestDuration.startTimer();
  heavyWork();
  res.send("Hello from Microservice V2 (High Resource Usage)");
  end({ method: "GET", route: "/", status_code: 200 });
});

const port = 8082;
app.listen(port, "0.0.0.0", () => {
  console.log(`Microservice V2 running on port ${port}`);
});
