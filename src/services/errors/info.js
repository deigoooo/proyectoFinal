export const generateErrorInfo = (products) => {
  return `
  Uno o mas properties están incompletos o son inválidos.
  Lista de propiedades obligatorias:
      - title: Must be a string. (${products.title}),
      - description: Must be a string. (${products.description}),
      - price: Must be a number. (${products.price},
      - thumbnail: Must be a [string]. (${products.thumbnail}),
      - stock: Must be a number. (${products.stock}),
      - code: Must be a string. (${products.code}),
      - status: Must be a boolean. (${products.status}),
      - category: Must be a string. (${products.category}),
  `;
};
