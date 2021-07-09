import airDB from 'services/airtableClient';

const get = async () => {
  const products = await airDB('products').select().firstPage();

  if (products) {
    console.log(products.map((product) => ({ airtableId: product.id, ...product.fields })));
    return products.map((product) => ({ airtableId: product.id, ...product.fields }));
  }
};

export default get;
