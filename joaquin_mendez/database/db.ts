import { Sequelize } from "sequelize"

const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    password: Deno.env.get("DB_PASS"),
    database: Deno.env.get("DB_NAME"),
    username: Deno.env.get("DB_USER")
});

(async () => {
    try {
        await sequelize.authenticate()
        console.log("conectado")
        await sequelize.sync({ force: false })
    } catch (err) {
        console.log(err)
    }

})()

export default sequelize