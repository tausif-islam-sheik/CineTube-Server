import app from "./app";
import { env } from "./app/config/env";
import { seedAdmin } from "./app/utils/adminSeed";
import { seedDemoUser } from "./app/utils/demoSeed";

const bootstrap = async () => {
  try {
    // Seed admin and demo users on startup
    await seedAdmin();
    await seedDemoUser();
    
    app.listen(env.PORT, () => {
      console.log(`Server running on port http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
