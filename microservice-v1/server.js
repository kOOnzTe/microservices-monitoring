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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/", (req, res) => {
  const end = httpRequestDuration.startTimer();
  res.send("Hello from microservice-v1!");
  end({ method: "GET", route: "/", status_code: 200 });
});

const port = 8081;
app.listen(port, "0.0.0.0", () =>
  console.log(`microservice-v1 running on port ${port}`)
);
