import { sequelize } from '../config/CreateConnection'
import { Model, DataTypes } from 'sequelize'

class Feriado extends Model {}

Feriado.init({
  data: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Feriado',
  createdAt: false,
  updatedAt: false
})

export { Feriado }
