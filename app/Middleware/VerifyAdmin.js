'use strict'

class VerifyPermission {

  async handle ({ request, response, auth }, next, properties) {

    try{

      const isAdmin = auth.jwtPayload.data.isAdmin | false;

      if(isAdmin == false)
        throw new Error("Você não tem permissão!");

      await next()

    }catch(ex){

      response.status(401).send(ex.message)

    }
  }
}

module.exports = VerifyPermission
