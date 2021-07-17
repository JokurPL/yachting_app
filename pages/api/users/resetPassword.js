import changePassword from 'services/users/changePassword';
import sendResetToken from 'services/users/sendResetToken';

export default async (req, res) => {
  const payload = req.body;

  switch (req.method) {
    case 'POST': {
      try {
        await sendResetToken(payload);

        res.status(200).json({ status: 'ok' });
      } catch (err) {
        res.status(422).json({ status: 'error', error: err.message });
      }
      break;
    }

    case 'PUT': {
      try {
        const user = await changePassword(payload);

        res.status(200).json({ status: 'ok', user });
      } catch (err) {
        res.status(422).json({ status: 'error', error: err.message });
      }
      break;
    }

    default: {
      res.status(400);
      break;
    }
  }
};
