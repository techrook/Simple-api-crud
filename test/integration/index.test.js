const supertest = require("supertest");
const httpServer = require("../../app")

describe('player srever', () =>{
    it('get players', async () =>{
        const response = await
        supertest(httpServer).get("/winners")
        expect(response.status).toBe(200)
        expect(response.length).toBe(10)
    } )
    
}) 