require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Импорты роутов
const auth = require("./routes/auth");
const house = require("./routes/house");
const reservations = require("./routes/reservations");

const app = express();

// ✅ Универсальный CORS (чтобы работал и на localhost, и на Vercel)
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://motel-frontend-seven.vercel.app"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Парсинг данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роуты
app.use("/auth", auth);
app.use("/house", house);
app.use("/reservations", reservations);

// Проверка работы сервера
app.get("/", (req, res) => {
  res.status(200).json({
    message: "✅ Server is running.",
  });
});

// Обработка 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

// Запуск сервера
const port = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nyywshe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

main();
