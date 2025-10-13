import { Context, Router } from "@oak/oak"
import { Usuario } from "../models/usuario.ts"
//import { UserDTO } from "../models/usuarioDTO.ts"

const router = new Router()
router.prefix("/api/v1")

router.get("/", (ctx: Context) => {
    ctx.response.body = "test"
})

router.post("/registro", async (ctx: Context) => {

    const payload = ctx.request.body

    if (payload.type() === "form") {

        Usuario.create({
            rut: (await payload.form()).get("rut"),
            nombre_completo: (await payload.form()).get("nombre_completo"),
            email: (await payload.form()).get("email"),
        })
    }

    ctx.response.body = "Usuario creado con exito"
    ctx.response.status = 201
})

router.get("/hora", (ctx: Context) => {

    const hora = new Date().toLocaleTimeString()
    ctx.response.body = hora
})

export default router