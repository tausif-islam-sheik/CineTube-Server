import app from "./app";
import { env } from "./app/config/env";
import { seedAdmin } from "./app/utils/adminSeed";

const bootstrap = async () => {
  try {
    // Seed admin user on startup
    await seedAdmin();
    
    app.listen(env.PORT, () => {
      console.log(`Server running on port http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
