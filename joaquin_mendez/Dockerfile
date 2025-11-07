FROM denoland/deno:alpine-2.4.5 AS build

WORKDIR /app

COPY . /app/

RUN deno cache main.ts

FROM denoland/deno:alpine-2.4.5

WORKDIR /app

COPY --from=build /app /app/


CMD [ "deno", "run", "--allow-net", "--allow-env", "--allow-read", "--env-file", "main.ts" ]

