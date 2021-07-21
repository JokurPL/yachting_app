import sendMessage from 'services/users/sendMessage';

export default async (req, res) => {
  const payload = req.body;

  switch (req.method) {
    case 'POST': {
      try {
        console.log(payload);
        await sendMessage(payload);

        res.status(200).json({ status: 'ok' });
      } catch (err) {
        res.status(422).json({ status: 'not_sended', error: err.message });
      }
      break;
    }

    default: {
      res.status(400);
      break;
    }
  }
};
