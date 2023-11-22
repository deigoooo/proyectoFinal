import productModel from "./models/product.model.js";

export default class ProductMongoDao {
  constructor() {}
  getAllPaginate = async (req, PORT) => {
    try {
      const { limit = 10, page = 1 } = req.query;

      const filterOption = {};
      if (req.query.stock) filterOption.stock = req.query.stock;
      if (req.query.category) filterOption.category = req.query.category;

      const paginateOptions = { lean: true, limit, page };
      if (req.query.sort === "asc") paginateOptions.sort = { price: 1 };
      if (req.query.sort === "desc") paginateOptions.sort = { price: -1 };

      const result = await productModel.paginate(filterOption, paginateOptions);

      let prevLink;
      if (!req.query.page) {
        prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${result.prevPage}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${result.prevPage}`
        );
        prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }

      let nextLink;
      if (!req.query.page) {
        nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${result.nextPage}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${result.nextPage}`
        );
        nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      return {
        statusCode: 200,
        response: {
          status: "success",
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevpage,
          nextPage: result.nextpage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage ? prevLink : null,
          nextLink: result.hasNextPage ? nextLink : null,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        response: { status: "error", error: err.message },
      };
    }
  };
  getAll = async () => await productModel.find().lean().exec();
  getById = async (id) => await productModel.findById(id).lean().exec();
  create = async (data) => {
    try {
      const response = await productModel.create(data);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  delete = async (id) => {
    try {
      const response = await productModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  update = async (id, data) => {
    try {
      const result = await productModel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
      if (result === null) {
        return `[ERROR]: ${id} does not exist`;
      }
      return result;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
}
