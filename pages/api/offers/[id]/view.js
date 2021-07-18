import countView from 'services/offers/countView';

export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const views = await countView(req.query.id);

        res.status(200).json({ status: 'ok', views });
      } catch (err) {
        res.status(422).json({ status: 'failed', error: err });
      }
      break;
    }

    default: {
      res.status(400);
      break;
    }
  }
};
