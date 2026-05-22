# podinfo-js
Cloud-native sample nodejs project

## About
This is a bit of a refresher/learning project that shows a tiny nodejs app integrated with Docker/Kubernetes. Intentionally similar to the excellent [podinfo](https://github.com/stefanprodan/podinfo) project/template, just written in NodeJS. In my mind the [podinfo](https://github.com/stefanprodan/podinfo) serves as the prototypical example of building a cloud-native application, so I figured it would act as a solid starting point. Any code used will be attributed appropriately.

## Testing (local)

**npm**
Run `npm test`

**Github Actions**
Use [act](https://nektosact.com/usage): `act -W ./github/workflows/ci.yml`

## Run (local)
1. From this directory, `docker build . -t podinfo-js:latest`
2. `docker run --rm -p 3000:3000 -it podinfo-js:latest`



## Acknowledgments

This project is inspired by [podinfo](https://github.com/stefanprodan/podinfo)
by Stefan Prodan, reimagined in Node.js/TypeScript as a learning exercise.
