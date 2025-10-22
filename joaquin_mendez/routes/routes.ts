import { Context, Router } from "@oak/oak";
import { RegistroAsistencia, Usuario } from "../models/usuario.ts";
// deno-types="npm:@types/speakeasy
import * as speakeasy from "speakeasy";
import { encodeQR } from "@paulmillr/qr";
import sequelize from "../database/db.ts";

//import { UserDTO } from "../models/usuarioDTO.ts"

const router = new Router();
router.prefix("/api/v1");

router.get("/hora", (ctx: Context) => {
  const hora = new Date().toLocaleTimeString();
  ctx.response.body = hora;
});

//TODO metodo por eliminar
router.post("/test", async (ctx: Context) => {

  try {
    //ctx.request.headers.set("content-type", "text/plain")
    const rut = (await ctx.request.body.form()).get("rut_h");
    //ctx.request.headers.set("Content-Type", "text/plain")
    //const body = ctx.request.body
    //const rut = await body.formData()



    console.log(rut)
    ctx.response.body = rut
  } catch (error) {
    console.log("error=" + error)
  }
});


router.post("/registro", async (ctx: Context) => {
  try {
    const payload = ctx.request.body;

    if (payload.type() === "form") {
      await Usuario.create({
        rut: (await payload.form()).get("rut"),
        nombre_completo: (await payload.form()).get("nombre_completo"),
        email: (await payload.form()).get("email"),
      });
    }

    ctx.response.body = "Usuario creado con exito";
    ctx.response.status = 201;
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (ctx: Context) => {
  try {
    const body = ctx.request.body;

    const secret = speakeasy.generateSecret({
      length: 20,
      name: "Reloj-Control",
    });

    const qr = encodeQR(secret.otpauth_url, "svg");

    const rut = (await body.form()).get("rut_login");
    const user = await Usuario.findOne({
      where: {
        rut: rut,
      },
    });
    if (user === null) {
      ctx.response.body = "Usuario no encontrado";
      return;
    }

    const totp = user.get("totp_secret");
    if (totp === null) {
      await Usuario.update({
        totp_secret: secret.base32,
      }, {
        where: {
          rut: rut,
        },
      });
      ctx.response.body = qr + `
             <div class="p-4 md:p-5 space-y-4 text-gray-200">
                </br>1.- Abra su aplicación de Autenticación </br>2.- Escaneé el codigo QR </br>3.- Presione el botón continuar </br>4.- Ingrese el codigo generado en el siguiente campo </br></br>
                <div>
                    <label for="token" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo de verificación</label>
                    <input type="text" id="token" name="token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" maxlength="6" />
                </div>
            </div>
            `;
    } else {
      ctx.response.body = `
            <div class="p-4 md:p-5 space-y-4 text-gray-200">
                <div>
                    <label for="token" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo de verificación</label>
                    <input type="text" inputmode="numeric" id="token" name="token" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" maxlength="6" />
                </div>
            </div>  
            `;
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/valida", async (ctx: Context) => {
  try {
    const body = ctx.request.body;

    const rut = (await body.form()).get("rut_login");
    const secretUser = await Usuario.findOne({
      attributes: ["id", "totp_secret"],
      where: {
        rut: rut,
      },
    });

    const token_otp = (await body.form()).get("token");
    const valido = speakeasy.totp.verify({
      secret: secretUser?.get("totp_secret"),
      encoding: "base32",
      token: token_otp,
      window: 2,
    });

    if (valido) {
      //[x]TODO crear entrada en base de datos para registrar horas de salida y entrada
      //[x]TODO set headers para pasar rut o en sessionstorage
      await RegistroAsistencia.create({
        usuarioId: secretUser?.get("id"),
      });
      ctx.response.headers.set("HX-Redirect", "./asistencia.html");
    } else {
      //ctx.response.headers.set("HX-Redirect", "https://www.google.cl");
      //ctx.response.body = "Token no valido";
      ctx.response.status = 400
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/ingreso", async (ctx: Context) => {

  try {

    const rut = (await ctx.request.body.form()).get("rut_h");
    const id_user = await Usuario.findOne({
      where: {
        rut: rut
      }
    })

    //console.log(Date.now())
    //console.log(rut)
    //console.log(id_user)


    await RegistroAsistencia.update({
      hora_entrada: Date.now()
    },
      {
        where: {
          usuarioId: id_user?.get("id"),
          createdAt: [
            sequelize.literal(`(
                select MAX("createdAt") from registros_asistencia where "usuarioId" = `+ id_user?.get("id") + `
              )`)
          ]
        }
      })

    ctx.response.status = 200
  } catch (error) {
    console.log(error)
    ctx.response.status = 500
  }

});

router.post("/salida", async (ctx: Context) => {

  try {

    const rut = (await ctx.request.body.form()).get("rut_h");
    const id_user = await Usuario.findOne({
      where: {
        rut: rut
      }
    })
    await RegistroAsistencia.update({
      hora_salida: Date.now()
    }, {
      where: {
        usuarioId: id_user?.get("id"),
        createdAt: [
          sequelize.literal(`(
                select MAX("createdAt") from registros_asistencia where "usuarioId" = `+ id_user?.get("id") + `
              )`)
        ]
      }
    })
    ctx.response.status = 200
  } catch (error) {
    console.log(error)
    ctx.response.status = 500
  }

});

export default router;
