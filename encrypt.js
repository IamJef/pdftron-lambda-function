'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const { PDFNet } = require('@pdftron/pdfnet-node');
const { basename, extname } = require('path');

module.exports.handle = async ({Records: records}, context) => {
  const main = async () => {
      let response = null;
      await Promisse.all(records.map(async record => {
        const { key } = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  
        const file = await S3.getObject({
          Bucket: process.env.bucket,
          Key: key,
        }).promise();
  
        const arr = new Uint8Array(file.body);
        const doc = await PDFNet.PDFDoc.createFromLayoutEls(arr);
        const newHandler = await PDFNet.SecurityHandler.createDefault(); 
        
        newHandler.changeUserPasswordUString(process.env.hash);
        newHandler.setPermission(PDFNet.SecurityHandler.Permission.e_print, false);
        await newHandler.setPermission(PDFNet.SecurityHandler.Permission.e_extract_content, false);
  
        doc.setSecurityHandler(newHandler);
        const encrypted = doc.saveMemoryBuffer();
  
        await S3.putObject({
          Body: encrypted,
          Bucket: process.env.bucket,
          ContentType: 'application/pdf',
          Key: `encrypted/${basename(key, extname(key))}.pdf`
        }).promise()
        response = {
          statusCode: 301,
          body: JSON.stringify("Encrypt with success")
        }
      }));
  }
  
  await PDFNet.runWithCleanup(main, process.env.pdftronkey).catch(function (error) {
    console.log('Error: ' + JSON.stringify(error));

      response = {
        statusCode: 500,
        body: JSON.stringify(error),
      }
    }).then(function () { PDFNet.shutdown(); });

  
    return response;

};
