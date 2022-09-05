import { Sequelize } from 'sequelize'

const host = 'localhost'
const port = 3306
const username = 'root'
const password = '#Willybrasil0'
const database = 'empresa_willy'

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  define: {
    timestamps: true
  }
})
