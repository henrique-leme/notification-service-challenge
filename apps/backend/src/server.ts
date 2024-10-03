import { mongo } from "./config/db";
import { config } from "./config/index";
import { setupApp } from "./app";

async function startApp() {
  await mongo();

  setupApp().then((app) => {
    const PORT = config.PORT;

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  });
}

startApp();
