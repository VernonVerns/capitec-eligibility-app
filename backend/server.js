const express = require("express");
const cors = require("cors");

const loanRoutes = require("./routes/loanRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/loans", loanRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Loan API is running",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Loan API running on ${PORT}`);
});