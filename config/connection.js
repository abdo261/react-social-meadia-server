const { connect } = require("mongoose");
const { MONGO_URI } = require("dotenv").config().parsed;

const connectToMongo = async () => {
  await connect(`${MONGO_URI}`)
    .then(() => console.log("connection good with mongodb"))
    .catch((err) => console.log(err));
};
connectToMongo();
