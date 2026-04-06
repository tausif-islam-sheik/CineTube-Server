import app from "./app";
// import { env } from "./app/config/env";

const bootstrap = async () => {
  try {
    app.listen(5000, () => {
      console.log(`Server running on port http://localhost:5000`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
