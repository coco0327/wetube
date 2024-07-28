import "dotenv/config";
import "./db";
import { Video } from "./models/Video";
import { User } from "./models/User";
import { app } from "./server";

app.listen(process.env.PORT, () =>
  console.log(
    `✅ Server Listening on Port http://localhost:${process.env.PORT} 🤡`
  )
);
