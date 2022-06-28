'use strict'

const Helpers = use('Helpers');

class GetFile {

  async handle ({ request }, next) {

    // console.log(`New request at ${new Date()}`);

    if (request.file('file')){

      const upload = request.file('file', { size: '8mb' });
      const fileName = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath('uploads'), {
          name: fileName
      });
      if (!upload.moved()) {
          throw upload.error();
      }


      request.body.file = fileName;
    }

    await next()
  }
}

module.exports = GetFile;
