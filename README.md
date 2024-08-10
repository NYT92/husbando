# Husbando.pics

waifu.pics but for men/boy

## About

husbando.pics is the place where people can upload fictional man/boy anime characters. Instead of waifu.pics for waifu why not husbando.pics for husbando (terrible joke).

## Features

- Admin dashboard
- Upload panel
- NSFW protection
- Visiblity upload

## Prerequisite

- Cloudflare's R2 or AWS S3
- TursoDB
- DrizzleORM
- Cloudflare's Turnstile (to protect against the spam)
- Any Image optimization service (like Imgix, Cloudinary, etc)

## Deploying

- **Deploying to Vercel (With limitation [here](https://vercel.com/docs/limits/overview))**

  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNYT92%2Fhusbando&env=BUCKETNAME,ENDPOINT,ACCESSKEYID,SECRETACCESSKEY,SIGNATURE_VERSION,AUTH_ORIGIN,SECRET,CDN_URL,AUTH_USERNAME,AUTH_PASSWORD,AUTH_ACCESS_CODE,TURNSTILE_SITE_KEY,TURNSTILE_SECRET_KEY,TURSO_DB_URL,TURSO_DB_TOKEN)

- **Deploying both with Railway**

  [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/PmcM7U?referralCode=SpsRaMStrmAffl)

## Credit

- __ALL THE ARTIST THAT I UPLOADED INCLUDING SFW & NSFW WITH CREDIT AND SAUCENAO FOR MORE INFO__
- waifu.pics : inspiration
- tursodb : providing easy and free db service
- r2 : cheap s3 storage bucket with zero degree
- turnstile : the best way to protect against spammer
