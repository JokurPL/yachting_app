import getAllProducts from 'services/products/getAll';

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const products = await getAllProducts();

        res.status(200).json({ products });
      } catch (err) {
        res.status(422).json({ products: [] });
      }
      break;
    }

    default: {
      res.status(400);
      break;
    }
  }
};
