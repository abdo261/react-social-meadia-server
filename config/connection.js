const { connect } = require("mongoose");
require('dotenv').config()


const connectToMongo = async () => {
  await connect(`${process.env.MONGO_URI}`)
    .then(() => console.log("connection good with mongodb"))
    .catch((err) => console.log(err));
};
connectToMongo();
