import { Application, send } from "@oak/oak";

import router from "./routes/routes.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port: number = Number(Deno.env.get("PORT")) || 3000;

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: "./public",
    index: "index.html",
  });
});

app.listen({ port: port });
console.log(`Server corriendo en http://localhost:${port}`);
