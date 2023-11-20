import { PERSISTANCE } from "../app.js";

export default class PersistenceFactory {
  static getPersistence = async () => {
    switch (PERSISTANCE) {
      case "ARRAY":
        let { default: UsersDaoArray } = await import("./usersDaoArray.js");
        return new UsersDaoArray();
      case "FILE":
        let { default: UsersDaoFile } = await import("./usersDaoFile.js");
        return new UsersDaoFile();
      case "MONGO":
        let { default: UserDAOMongo } = await import("./usersDaoMongo.js");
        return new UserDAOMongo();
      default:
        break;
    }
  };
}
