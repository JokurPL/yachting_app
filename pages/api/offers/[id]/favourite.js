import { changeFavouriteOffer } from 'services/offers/favouriteUserOffers';

export default async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const favStatus = await changeFavouriteOffer(req.query.id, req.body.userId);

        res.status(200).json({ status: 'ok', favStatus });
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
