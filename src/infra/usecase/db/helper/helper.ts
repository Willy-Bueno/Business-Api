import { sequelize } from '../config/CreateConnection'
import { Company } from '../models/Company'

const Helper = {
  async connect (): Promise<void> {
    try {
      await sequelize.authenticate({ logging: false })
      console.log('Connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  },

  async disconnect (): Promise<void> {
    try {
      await sequelize.close()
    } catch (error) {
      console.error('Unable to close the database:', error)
    }
  },

  async clear (): Promise<void> {
    try {
      await Company.destroy({ where: {} })
    } catch (error) {
      console.error('Unable to clear the database:', error)
    }
  }
}

export default Helper
