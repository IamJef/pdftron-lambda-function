# at-pdfenc

## Prerequisites

* Node 12.x
* NPM 7.4.x
* Serverless CLI [Serverless Framework](http://serverless.com.br)

## Config
Edit **serverless.yml** and set your configs. Pdftron License Key, Bucket,
encrypt key and trigger to call function.

## How it works

* User upload **PDF** file in LMS bucket (defined in the serverless.yml file)
* Function get this file and encrypt with Key defined
* Save new file in **encrypted** folder inside the bucket

## Working Flow
![Working Flow](https://i.imgur.com/l64WfCQ.png)

