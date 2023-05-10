const { knex } = require("../../app");

const createProfissional = ({
  uid,
  cpf,
  name,
  phone,
  email,
  cns,
  data_nascimento,
}) => {
  return new Promise((resolve, reject) => {
    knex.transaction((trx) => {
      knex("user")
        .insert(
          {
            auth_id: uid,
            date_created: new Date(),
            role: "profissional",
            active: true,
          },
          "idUser"
        )
        .then((user_id) => {
          console.log("userId", user_id);
          knex("profissional")
            .insert({
              user_id: user_id,
              nome: name,
              cns: cns,
              cpf: cpf,
              email: email,
              data_nascimento: Date(data_nascimento),
              celular: phone,
            })
            .catch((e) => {
              console.log("error", e);
              // descobrir como mandar o sqlMessage para o front
              trx.rollback();
              resolve({ error: e });
            });
        });
    });
    return resolve({ error: null });
  });
};

const createPaciente = ({
  uid,
  cns,
  cpf,
  name,
  phone,
  email,
  data_nascimento,
}) => {
  return new Promise((resolve, reject) => {
    knex.transaction((trx) => {
      knex("user")
        .insert(
          {
            auth_id: uid,
            date_created: new Date(),
            role: "paciente",
            active: true,
          },
          "idUser"
        )
        .then((user_id) => {
          console.log("USER_ID >>>>>>> ", user_id);
          knex("paciente")
            .insert({
              user_id: user_id,
              cns: cns,
              cpf: cpf,
              nome: name,
              email: email,
              data_nascimento: data_nascimento,
              celular: phone,
            })
            .catch((e) => {
              trx.rollback();
              resolve({ error: e });
            });
        });
    });
    return resolve({ error: null });
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    knex("user")
      .where("userId", id)
      .select("*")
      .first()
      .then((data) => {
        if (!data) {
          resolve({ error: "User não encontrado." });
        }
        resolve({ error: false, data: data });
      })
      .catch((error) => {
        resolve({ error });
      });
  });
};

module.exports = {
  createPaciente,
  createProfissional,
  getUser,
};
