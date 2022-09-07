import { sequelize } from '../config/CreateConnection'
import { Model, DataTypes } from 'sequelize'

class Empresa extends Model {}

Empresa.init({
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false
  },

  data_fundacao: {
    type: DataTypes.DATE,
    allowNull: false
  },

  valor_hora: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Empresa',
  createdAt: false,
  updatedAt: false
})

export { Empresa }
