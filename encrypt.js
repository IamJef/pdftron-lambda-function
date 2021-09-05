'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { PDFNet } = require('@pdftron/pdfnet-node');
const { basename, extname } = require('path');

module.exports.handle = async (event, context) => {
  let response = null;
  const main = async () => {
      const key  = event.Records[0].s3.object.key;

      const file = await s3.getObject({
        Bucket: process.env.bucket,
        Key: key,
      }).promise();
      
      const arr = new Uint8Array(file.Body);
      const doc = await PDFNet.PDFDoc.createFromBuffer(arr);
      const newHandler = await PDFNet.SecurityHandler.createDefault(); 
    

      newHandler.changeUserPasswordUString(process.env.hash);
      newHandler.setPermission(PDFNet.SecurityHandler.Permission.e_print, false);
      newHandler.setPermission(PDFNet.SecurityHandler.Permission.e_extract_content, false);

      doc.setSecurityHandler(newHandler);
      const encrypted = await doc.saveMemoryBuffer(arr.length);
      var base64data = new Buffer.from(encrypted, 'binary');

      await s3.putObject({
        Body: base64data,
        Bucket: process.env.bucket,
        ContentType: 'application/pdf',
        Key: `encrypted/${basename(key, extname(key))}.pdf`
      }).promise()
    
    response = {
      statusCode: 301,
      body: JSON.stringify("File encrypted")
    }
  }
  
  await PDFNet.runWithCleanup(main, process.env.pdftronkey).catch(function (error) {
      response = {
        statusCode: 500,
        body: JSON.stringify(error),
      }
    }).then(function () { PDFNet.shutdown(); });

  
    return response;

};
