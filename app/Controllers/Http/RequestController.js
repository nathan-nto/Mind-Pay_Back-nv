"use strict";

const Request = use("App/Models/Request");
const Helpers = use("Helpers");
const Encryption = use("Encryption");
const dayjs = use("dayjs");
const User = use("App/Models/User");
const { Expo } = require("expo-server-sdk");
const admin = use("firebase-admin");
const CronJob = require('cron').CronJob
const database = use("Database")
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

// async function notificar(pushToken, valor) {
//   let expo = new Expo();
//   if (!Expo.isExpoPushToken(pushToken)) {
//     console.error(`Push token ${pushToken} is not a valid Expo push token`);
//     continue;
//   }
//   messages.push({
//     to: pushToken,
//     sound: "default",
//     body: "This is a test notification",
//     data: { withSome: "data" },
//   });

//   let chunks = expo.chunkPushNotifications(messages);
//   let tickets = [];

//   console.log(chunks);
// }

class RequestController {
  async index({ request, response, auth }) {
    const req = await Request.query()
      .with("users")
      .orderBy("created_at", "desc")
      .fetch();

    return req;
  }

  async findOneAll({ request, response, auth }) {
    const Requests = await Request.query()
      .where("user_id", auth.jwtPayload.uid)
      .fetch();

    return Requests;
  }

  async store({ request, response, auth }) {
    try {
      const data = request.all();
      data.user_id = auth.jwtPayload.uid;

      const current_month = dayjs().format("MM");

      const result = await Request.query()
        .whereRaw(
          `Month(created_at) = ${current_month} and user_id = ${data.user_id}`
        )
        .first();

      if (result) {
        if (result.$attributes.request_finished) {
          throw new Error("Seu pagamento mensal ja foi efetuado!");
        } else {
          await Request.query().where("id", result.$attributes.id).update(data);

          return response.json({ message: `Pedido atualizado com sucesso!` });
        }
      }

      await Request.create(data);

      return response.json({ message: `Pedido cadastrado com sucesso!` });
    } catch (ex) {
      response.status(500).send("Erro:" + ex.message);
    }
  }

  async findUserRequests({ params, request, response }) {
    try {
      const Requests = await Request.query().where("id", params.id).fetch();

      return Requests;
    } catch (ex) {
      return response.status(500).send(ex.message);
    }
  }

  async respondRequest({ params, request, response }) {
    try {
      const _request = await Request.find(params.id);

      _request.receipt_location = request.body.file;
      const user = await User.find(_request.user_id);
      const pushToken = user.token_user;
      _request.request_finished = true;
      console.log(pushToken);
      _request.save();

      if (pushToken) {
        // const message = {
        //   notification: {
        //     title: "gg",
        //     body: "aaa",
        //   },
        //   token: pushToken,
        // };
        // admin.messaging().send(message);
        let expo = new Expo();
        let messages = [];
        messages.push({
          to: pushToken,
          sound: "default",
          body: `Você recebeu R$${_request.amount}`,
          data: { withSome: "data" },
        });
        let chunks = expo.chunkPushNotifications(messages);
        let ticketChunk = await expo.sendPushNotificationsAsync(chunks[0]);
      }
    } catch (ex) {
      return response.status(500).send(ex.message);
    }
  }

  async destroy({ params, request, response }) {
    console.log('asdadasd')
  }

  async schedule({ req, response }) {
    try {

      const users = await database.select('*').from('users')
      // const job = new CronJob("* * 22 * * *",() => {
      // },null,true,'America/Sao_Paulo')
      // job.start()

      for (const i of users) {
        if (i.token_user) {
          let expo = new Expo();
          let messages = [];
          messages.push({
            to: i.token_user,
            sound: "default",
            body: `Hoje é dia de Pagamento Minder!`,
          });

          let chunks = []

          chunks = expo.chunkPushNotifications(messages);

          try {
            await expo.sendPushNotificationsAsync(chunks[0])
          } catch (error) {
            console.log('caiu ')
            console.log(JSON.stringify(error));
            // console.log(chunks[0])
            // let ticketChunk = await expo.sendPushNotificationsAsync(chunks[0]);
          }
        }

      }
    } catch (err) {
      console.log(err)
    }

  }

  async birthday({ response }) {
    try {
      // .whereRaw(
      //   `data_de_nascimento LIKE ${today}`)
      // .select('*').from('users').where('data_de_nascimento',today)

      const today = dayjs().format('MM-DD')
      // const users = await database.select('*').from('users')
      // console.log(users)

      const userHappy = await database.raw(`select name,nickname, token_user from users where data_de_nascimento like '%${today}%'`)
      const user = []

      const random = (min,max) => Math.floor(Math.random() * (max - min) + min)
      const msg = [
        'VOCÊ ESTÁ DE PARABÉNS 😍 Estamos aqui digitando com os pés para poder bater palmas pelo seu dia. Parabéns!',
        'AH, PARA... PARA... PARABÉNS! 😅 Achou que era cupom do Ifood né? É melhor ainda: A equipe Mind te dando parabéns!',
        'VOCÊ RECEBEU UM RECADO IMPORTANTE 😨',
        'Não é uma job, relaxa. É os parabéns de toda equipe Mind.',
        'O ANIVERSÁRIO É SEU MAS A COMEMORAÇÃO.... 😋 É de todos nós. Que seu dia seja muito top! ',
        'CLIENTE MANDOU FEEDBACK 😨 Mentira! É a equipe Mind lembrando do seu aniversário. Parabéns!',
        'P - B - S 👏 Essa data é importante para todos nós! Parabéns!'
      ]
        console.log(msg[random(0,msg.length)])

      for (const i of userHappy[0]) {
        if (i.nickname) {
          user.push(i.nickname)
        } else {
          user.push(i.name)
        }

        if (i.token_user) {
          let expo = new Expo();
          let messages = [];
          messages.push({
            to: i.token_user,
            sound: "default",
            body: `Bom diaaa!! ${i.nickname ? i.nickname : i.name} ${msg[random(0,msg.length)]}`,
          });

          let chunks = []

          chunks = expo.chunkPushNotifications(messages);


          try {
            await expo.sendPushNotificationsAsync(chunks[0])
          } catch (error) {
            console.log(JSON.stringify(error));
            // console.log(chunks[0])
            // let ticketChunk = await expo.sendPushNotificationsAsync(chunks[0]);
          }

        }

      }

      if (userHappy.length > 0) {

        const name = `${user}`
        
        // let newName = ''

        const users = await database.raw(`select name, token_user from users where data_de_nascimento not like '%${today}%'`)
        console.log(users[0])

        for (const i of users[0]) {
          if (i.token_user) {
            let expo = new Expo();
            let messages = [];
            messages.push({
              to: i.token_user,
              sound: "default",
              body: `VOCÊ TEM UMA JOB IMPORTANTE 👌 Hoje é aniversario do(a) ${name.replace(',', ' e ')} de os parabens para o nosso querido minder!`,

            });

            let chunks = []

            chunks = expo.chunkPushNotifications(messages);

            try {
              await expo.sendPushNotificationsAsync(chunks[0])
            } catch (error) {
              console.log('caiu ')
              console.log(JSON.stringify(error));
              // console.log(chunks[0])
              // let ticketChunk = await expo.sendPushNotificationsAsync(chunks[0]);
            }
          }

        }

      }

    } catch (err) {
      console.log(err)
    }
  }


}


module.exports = RequestController;
