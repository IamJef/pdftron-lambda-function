# Pdftron encrypt - lambda function

## Prerequisites

* Node 12.x
* NPM 7.4.x
* Serverless CLI [Serverless Framework](http://serverless.com)

## Config file
Edit **serverless.yml** and set your configs. Pdftron License Key, Bucket,
encrypt key and trigger to call function.

### Configs

**Config Details**
```
provider:
  name: aws
  runtime: nodejs12.x
  region: sa-east-1
  memorySize: 256
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:* #Permission for your user (* is allow all actions)
      Resource:
        - "arn:aws:s3:::your-bucket-name/*" #Your bucket ARAN (check in aws website)
  lambdaHashingVersion: 20201221
  
functions:
  encrypt:
    handler: encrypt.handle
    environment:
      bucket: your-bucket-name
      hash: "%252s%¨3-" #Your Password to add in files
      pdftronkey: "demo:1630507513016:78fce14403000000007b2248cb7b18a79ea8aea117e5f1c5e5b33d2214" #Your PDFTron Key
   events:
      - s3:
          bucket: your-bucket-name
          event: s3:ObjectCreated:* #Trigger is a ObjectCreated action
          rules:
            - prefix: uploads/ #Required prefix/folder
            - suffix: .pdf #Required sufix/format
          existing: true #If your bucket already exist
```

## How it works

* User upload **PDF** file in LMS bucket (defined in the serverless.yml file)
* Function get this file and encrypt with Key defined
* Save new file in **encrypted** folder inside the bucket

## Working Flow
![Working Flow](https://i.imgur.com/l64WfCQ.png)

