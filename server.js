require("dotenv").config();

const express = require("express");
const cors = require("cors");
const paymongo = require("paymongo")(process.env.PAYMONGO_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to PUP Souvenir Shop Website")
});

// Add create payment-intent

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));

// import Paymongo from 'paymongo';

// const paymongo = new Paymongo(process.env.SECRET_KEY);

const sdk = require('api')('@paymongo/v2#5u9922cl2759teo');

// (Username, password)
sdk.auth(process.env.REACT_APP_PAYMONGO_PK, process.env.PAYMONGO_SECRET_KEY);
sdk.retrieveListOfPossibleMerchantPaymentMethods()
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));