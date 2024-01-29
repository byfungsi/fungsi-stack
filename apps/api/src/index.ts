import "./utils/configureDotEnv";
import { API_PORT } from "./constants/apiEnvs";
import { app } from "./core/app";

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});
