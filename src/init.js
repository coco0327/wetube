import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import { app } from "./server";

app.listen(process.env.PORT, () =>
  console.log(
    `✅ Server Listening on Port http://localhost:${process.env.PORT} 🤡`
  )
);
