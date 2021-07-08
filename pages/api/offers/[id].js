import { getSession } from 'next-auth/client';
import deleteOffer from 'services/offers/delete';
import getOfferById from 'services/offers/get';
import isAuthorized from 'services/offers/isAuthorized';
import updateOffer from 'services/offers/update';

export default async (req, res) => {
  const session = await getSession({ req });

  let offer = await getOfferById(req.query.id);

  if (!isAuthorized(offer, session)) {
    return res.status(401).json({ error: 'not_authorized' });
  }

  switch (req.method) {
    case 'DELETE': {
      try {
        offer = await deleteOffer(offer.airtableId);
        res.status(200).json({ status: 'deleted', offer });
      } catch (err) {
        res.status(422).json({ status: 'not_deleted', err });
      }
      break;
    }

    case 'PUT': {
      try {
        const payload = req.body;
        offer = await updateOffer(offer.airtableId, payload);
        res.status(200).json({ status: 'updated', offer });
      } catch (err) {
        res.status(422).json({ status: 'not_updated', err });
      }

      break;
    }

    default:
      res.status(400);
      break;
  }
};
