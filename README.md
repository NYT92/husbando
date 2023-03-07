# Husbando.pics
waifu.pics but for men/boy

![image](https://user-images.githubusercontent.com/53612429/217580677-39f50b4c-2bd3-448d-aeef-69f0ac6fc5db.png)

You can visit the website right now : https://husbando.pics  
__*PROJECT STILL IN DEVELOPMENT__

## About

husbando.pics is the place where people can upload fictional man/boy anime characters. Instead of waifu.pics for waifu why not husbando.pics for husbando (terrible sentence).

## Features

- Admin dashboard
- Upload panel
- strict ass guideline
- and more soon...

## Prerequisite

 - Cloudflare's R2 or AWS S3
 - Deta ([Using Deta Base](https://deta.space) to store image metadata)
 - (Optional) Cloudflare's Turnstile (to protect against the spam)
 - (Optional) Formate (use to track the report [Get Here](https://deta.space/discovery/r/dyr7ppdsxb35e3kr))

## Deploying

- **Deploying frontend**  
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNYT92%2Fhusbando%2Ffrontend&env=SECRET,USER,PASS,NUXT_TURNSTILE_SECRET_KEY,NUXT_TURNSTILE_SITE_KEY,API_URL,WEBSITE,FORMATE_URL,FORMATE_API_KEY&envDescription=These%20env%20data%20are%20required%20in%20order%20to%20make%20it%20work%20with%20the%20API%20and%20app.&envLink=https%3A%2F%2Fgithub.com%2FNYT92%2Fhusbando%2Fblob%2Fmain%2Ffrontend%2F.env.example)

- **Deploying backend**  
 
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNYT92%2Fhusbando%2Fbackend&env=JWT_TOKEN,DETA_KEY,BUCKETNAME,ENDPOINT,ACCESSKEYID,SECRETACCESSKEY,SIGNATURE_VERSION&envDescription=This%20API%20required%20S3%20key%20and%20Deta%20in%20order%20to%20run.&envLink=https%3A%2F%2Fgithub.com%2FNYT92%2Fhusbando%2Fblob%2Fmain%2Fbackend%2F.env.example)

- **Deploying both with Railway**
 
  [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/cUDXYB?referralCode=SpsRaMStrmAffl)

## Credit

 - waifu.pics : inspiration
 - deta : providing free db service
 - r2 : cheap s3 storage bucket with zero degree
 - turnstile : the best way to protect against spammer

# API Docs

Soon
