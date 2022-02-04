const axios = require("axios");

const handler = async (req, res) => {
  const symbol = req.body.symbol;
  const response = await axios.get(
    `https://api.twelvedata.com/profile?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
  );

  res.status(200).json(response.data);
};

export default handler;
