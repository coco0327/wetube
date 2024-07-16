import "./db";
import { Video } from "./models/Video";
import { User } from "./models/User";
import { app } from "./server";

const PORT = 8062;

app.listen(PORT, () =>
  console.log(`✅ Server Listening on Port http://localhost:${PORT} 🤡`)
);
