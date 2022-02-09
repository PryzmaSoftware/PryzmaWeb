const axios = require("axios");

const handler = async (req, res) => {
  try {
    // get symbol from front end
    const symbol = req.body.symbol;

    // fetch data from iex cloud
    const response = await axios.get(
      `https://cloud.iexapis.com/stable/time-series/PREMIUM_PRECISION_ALPHA_PRICE_DYNAMICS/${symbol}?limit=90&token=${process.env.IEX_CLOUD_API_KEY}`
    );

    // check if there is data in the response
    if (response.data?.length) {
      return res.status(200).json({ message: "success", data: response.data });
    }

    return res.status(200).json("no data available");
  } catch {
    res.status(200).json("something went wrong");
  }
};

export default handler;
