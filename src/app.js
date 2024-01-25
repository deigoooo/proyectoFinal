import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import run from "./utils/run.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import cors from "cors";
import compression from "express-compression";
import logger from "./config/logger.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config/config.js";

//importo passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//inicializo el server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//inicializo swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion del proyecto final de CoderHouse",
      description:
        "Este es un Ecommerce que forma parte de la entrega final de mi proyecto",
    },
  },
  apis: ["./docs/**/*.yaml"],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//configuramos los cors
app.use(cors());

//configuramos compression
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

//configuro la carpeta publica
app.use(express.static("./src/public"));

//configuramos las sessions
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `${config.mongo.url}`,
      dbName: `${config.mongo.db_name}`,
    }),
    secret: `${config.mongo.secret}`,
    resave: true,
    saveUninitialized: true,
  })
);

//configuro passport
initializePassport();
app.use(passport.initialize());

//inicializa las sessions
app.use(passport.session());

//inicializo flash
app.use(flash());

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

try {
  //conecto la base de datos
  await mongoose.connect(config.mongo.url, {
    dbName: `${config.mongo.db_name}`,
    useUnifiedTopology: true,
  });
  logger.info(`DB connected`);

  //desde aca
  const httpServer = app.listen(config.PORT, () =>
    logger.info(`Server Running in port ${config.PORT} on ${config.MODE} mode`)
  );
  const socket = new Server(httpServer);

  run(socket, app);

  //hasta aca
} catch (error) {
  logger.error(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
