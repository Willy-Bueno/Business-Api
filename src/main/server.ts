import Helper from '../infra/usecase/db/helper/helper'

import('../infra/usecase/db/config/CreateConnection')

Helper.connect().then(async () => {
  const app = (await import('./config/app')).default
  app.listen(3000, () => {
    console.log(`Server is running on port http://localhost:${3000}`)
  })
})
  .catch(console.error)
