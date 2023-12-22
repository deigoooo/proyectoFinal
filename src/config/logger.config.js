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
  if (env === "production") {
    return winston.createLogger({
      levels: customWinstonLevels.levels,
      transports: [
        new winston.transports.File({
          filename: "errors.log",
          level: "info",
          format: winston.format.json(),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: customWinstonLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};

const logger = createLogger(config.MODE);

export default logger;
