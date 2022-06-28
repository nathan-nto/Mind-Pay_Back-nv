const admin = require("firebase-admin");
const keys = require("./mind-pay-firebase-adminsdk-8k2ah-c6e47386bb.json");

admin.initializeApp({
  credential: admin.credential.cert(keys),
  databaseURL: "https://mind-pay.firebaseio.com",
});

module.exports = function (title, body, sender, topic = "teste") {
  const message = {
    data: {
      title,
      body,
      sender,
    },
    topic,
  };

  admin
    .messaging()
    .send(message)
    .then((res) => {
      console.log("notification sent");
    })
    .catch((res) => {
      console.log("notification not sent, error: ", res);
      throw new Error("não funcionou");
    });
};
