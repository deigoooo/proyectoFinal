import EErros from "../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(`control ${error}`);

  switch (error.code) {
    case EErros.ROUTING_ERROR:
      console.log(error.cause);
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErros.INVALID_TYPES_ERROR:
      console.log(error.cause);
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErros.DATABASES_ERROR:
      console.log(error.cause);
      res.status(400).send({ status: "error", error: error.name });
      break;
    case EErros.BODY_EMPTY:
      console.log(error.cause);
      res.status(400).send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
