import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const app = express();
const port = 3333;

app.use(express.json());

app.use(routes);

app.use(errorHandling);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
