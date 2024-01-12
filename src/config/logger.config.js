import winston from "winston";
import config from "./config.js";

const customWinstonLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: "white",
    http: "green",
    info: "blue",
    warning: "yellow",
    error: "magenta",
    fatal: "red",
  },
};

winston.addColors(customWinstonLevels.colors);

const createLogger = (env) => {
  const consoleTransport = new winston.transports.Console({
    level: env === "production" ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  });

  const fileTransport = new winston.transports.File({
    filename: "errors.log",
    level: "error",
    format: winston.format.json(),
  });

  const loggerOptions = {
    levels: customWinstonLevels.levels,
    transports: [consoleTransport],
  };

  if (env === "production") {
    loggerOptions.transports.push(fileTransport);
  }

  return winston.createLogger(loggerOptions);
};

const logger = createLogger(config.MODE);

export default logger;
