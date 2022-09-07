import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'
dotenv.config()

const host = process.env.HOST
const port = process.env.PORT as unknown as number
const username = process.env.USERNAME
const password = process.env.PASSWORD
const database = process.env.DB

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  define: {
    timestamps: true
  }
})
