import http from 'http'
import app from './app'
import { connectToDb, logger } from './utils'
const start = async () => {
  try {
    const server = http.createServer(app)
    await connectToDb()
    server.listen(process.env.PORT, () => {
      logger.info(`server running on http://localhost:${process.env.PORT}`)
    })
  } catch (error) {
    console.log('unable  to connect  to database')
  }
}
start()
// uncomment to use cluster
// if (cluster.isPrimary) {
//   for (let i = 0; i < os.cpus().length; i++) {
//     /* making child process */
//     cluster.fork()
//   }
//   /* make new instance if server is crashed */
//   cluster.on("exit", () => {
//     cluster.fork()
//   })
// } else {
// start()
//   )
// }
