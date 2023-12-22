import logger from "../config/logger.config.js";

export const loggerTestController = async (req, res) => {
  logger.fatal(`prueba de logger para level fatal`);
  logger.error(`prueba de logger para level error`);
  logger.warning(`prueba de logger para level warning`);
  logger.info(`prueba de logger para level info`);
  logger.http(`prueba de logger para level http`);
  logger.debug(`prueba de logger para level debug`);
  res
    .status(200)
    .json({ status: "succes", message: "Prueba de logger finalizada" });
};
