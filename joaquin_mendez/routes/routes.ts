import { Context, Router } from "@oak/oak"
import { Usuario } from "../models/usuario.ts"
// deno-types="npm:@types/speakeasy
import * as speakeasy from "speakeasy"
import { encodeQR } from "@paulmillr/qr"

//import { UserDTO } from "../models/usuarioDTO.ts"

const router = new Router()
router.prefix("/api/v1")

router.get("/hora", (ctx: Context) => {

    const hora = new Date().toLocaleTimeString()
    ctx.response.body = hora
})

//TODO metodo por eliminar
router.get("/test", (ctx: Context) => {

    const secret = speakeasy.generateSecret({ length: 20 })
    const qr = encodeQR(secret.otpauth_url, "svg")

    console.log(secret.base32)
    ctx.response.body = qr
})

router.post("/test/valida", async (ctx: Context) => {

    const text = await Deno.readTextFile('./public/asistencia.html');
    ctx.response.headers.set("Content-Type", "text/html")
    ctx.response.body = text;
})

router.post("/registro", async (ctx: Context) => {

    const payload = ctx.request.body

    if (payload.type() === "form") {

        await Usuario.create({
            rut: (await payload.form()).get("rut"),
            nombre_completo: (await payload.form()).get("nombre_completo"),
            email: (await payload.form()).get("email"),
        })
    }

    ctx.response.body = "Usuario creado con exito"
    ctx.response.status = 201
})

router.post("/login", async (ctx: Context) => {

    const body = ctx.request.body

    const secret = speakeasy.generateSecret({ length: 20, name: "Reloj-Control" })
    const qr = encodeQR(secret.otpauth_url, "svg")

    const rut = (await body.form()).get("rut_login")
    const user = await Usuario.findOne({
        where: {
            rut: rut
        }
    })
    if (user === null) {
        ctx.response.body = "Usuario no encontrado"
        return
    }

    const totp = user.get("totp_secret")
    if (totp === null) {
        await Usuario.update({
            totp_secret: secret.base32
        }, {
            where: {
                rut: rut
            }
        })
        ctx.response.body = qr + `
             <div class="p-4 md:p-5 space-y-4 text-gray-200">
                </br>1.- Abra su aplicación de Autenticación </br>2.- Escaneé el codigo QR </br>3.- Presione el botón continuar </br>4.- Ingrese el codigo generado en el siguiente campo </br></br>
                <div>
                    <label for="token" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo de verificación</label>
                    <input type="text" id="token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" maxlength="6" />
                </div>
            </div>
            `
    } else {
        ctx.response.body = `
            <div class="p-4 md:p-5 space-y-4 text-gray-200">
                <div>
                    <label for="token" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo de verificación</label>
                    <input type="text" id="token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" maxlength="6" />
                </div>
            </div>  
            `
    }
})

router.post("/valida", async (ctx: Context) => {

    try {
        const body = ctx.request.body
        const _token_otp = (await body.form()).get("token")
        ctx.response.headers.set("HX-Redirect", "./asistencia.html")
        //const text = await Deno.readTextFile('./public/asistencia.html');
        //ctx.response.headers.set("Content-Type", "text/html")
        //ctx.response.body = text;
        //await send(ctx, "/public/asistencia.html")
        //ctx.response.redirect("/asistencia.html")
    } catch (e) {
        console.log(e)
    }

})

export default router