import { Controller, HttpRequest } from '../../../presentation/protocols/http'
import { Request, RequestHandler, Response } from 'express'

export const adaptRouter = (controller: Controller<Request, Response>): RequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest<Request> = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
