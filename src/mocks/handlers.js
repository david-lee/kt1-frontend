// src/mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  // rest.post('/login', (req, res, ctx) => {
  //   // const { loginId, password } = req.body;
  //   // console.log('#### ', req.body);

  //   return res(
  //     // Respond with a 200 status code
  //     ctx.delay(1500),
  //     ctx.status(200),
  //     ctx.json({
  //       authToken: '1234567890DADCADWKYBD',
  //       name: 'David Lee',
  //       depart: 'IT',
  //       userId: 123
  //     })
  //   )
  // }),

  // TODO: what do we want to do if a user logs out on the server side?
  rest.post('/logout', (req, res, ctx) => {
    // const { loginId } = req.body;
    // console.log('#### ', req.body);

    return res(
      // Respond with a 200 status code
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({ status: 'success' })
    )
  }),

  rest.post('/reset-password', (req, res, ctx) => {
    // const { loginId, password } = req.body;
    // console.log('#### ', req.body);

    return res(
      // Respond with a 200 status code
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({ status: 'success' })
    )
  }),  

  // rest.post('/company/search', (req, res, ctx) => {
  //   console.log('rest api for company: ', req.body);
    
  //   return res(
  //     ctx.delay(1500),
  //     ctx.status(200),
  //     ctx.json([
  //       { name: '맛나분식', companyId: '123456789', oldCompanyId: '5555555', owner: 'Paul Kim' },
  //       { name: 'Sebang', companyId: '999999999', oldCompanyId: '1111111', owner: 'David Lee' },
  //     ])
  //   );
  // })
]