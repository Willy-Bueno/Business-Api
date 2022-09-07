import { Sequelize } from 'sequelize'

const host = process.env.DB_HOST
const port = process.env.DB_PORT as unknown as number
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_DATABASE

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  define: {
    timestamps: true
  }
})
