'use strict'
const { cpf } = require("cpf-cnpj-validator");

class ValidateCPF {

  async handle ({ request, response }, next) {

    let _cpf = request.body.cpf;
    _cpf = _cpf.replace(/\D/g,'');

    request.body.cpf = _cpf;

    if(!cpf.isValid(_cpf)){
      response.status(406).send("CPF invalido")
      return
    }


    await next()
  }
}

module.exports = ValidateCPF
