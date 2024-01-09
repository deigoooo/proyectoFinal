import EErros from "../services/errors/enums.js";
import logger from "../config/logger.config.js";

export default (error, req, res, next) => {
  logger.error(`Control - ${error}`);

  switch (error.code) {
    case EErros.ROUTING_ERROR:
      logger.error(error.cause);
      res.status(500).send({ status: "error", error: error.message });
      break;
    case EErros.INVALID_TYPES_ERROR:
      logger.error(error.cause);
      res.status(401).send({ status: "error", error: error.message });
      break;
    case EErros.DATABASES_ERROR:
      logger.error(error.cause);
      res.status(403).send({ status: "error", error: error.message });
      break;
    case EErros.BODY_EMPTY:
      logger.error(error.cause);
      res.status(402).send({ status: "error", error: error.message });
      break;
    default:
      logger.error(error.cause);
      res.send({ status: "error", error: `Unhandled error ${error}` });
      break;
  }
};
