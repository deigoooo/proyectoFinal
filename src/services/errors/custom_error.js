export default class CustomError {
  static createError({ name = "Error", cause, message, code }) {
     const err = new Error(message, { cause });
     err.name = name;
     err.code = code;
     return err;
  }
}

