const request = require('supertest');
const app = require('../../src/app');

const truncate = require('../utils/truncate');
const factory = require("../factories");


describe('Authentication' , () =>{
    beforeEach( async ()=> {
        await truncate();
    });
    it('should authenticate with valid credentials' , async() => {
        const user = await factory.create('User' , {
            password : '12345678'
        });
        const response = await request(app)
                        .post("/sessions")
                        .send({
                            email: user.email,
                            password : '12345678'
                        });
        expect(response.status).toBe(200);                
    });
   it("shouldn't authenticate with invalid credentials", async () => {
        const user = await factory.create('User');

        const response = await request(app)
                        .post("/sessions")
                        .send({
                            email: user.email,
                            password : '123456'
                        });
        expect(response.status).toBe(401);   
    });

    it('should return a jwt token authentication' , async () =>{
        const user = await factory.create('User',{
            password : '12345678'
        });

        const response = await request(app)
                .post("/sessions")
                .send({
                    email: user.email,
                    password : '12345678'
                });
        expect(response.body).toHaveProperty("token");
    });

    it('should be able to access private routes when authenticated' , async () =>{
        const user = await factory.create('User',{
            password : '12345678'
        });

        const token = user.generateToken();

        console.log(token);

        const response = await request(app)
                .get("/dashboard")
                .set("Authorization" ,`Bearer ${token}`);

        expect(response.status).toBe(200);
    });
    it('should NOT be able to access private routes without token' , async () =>{
        const response = await request(app)
                .get("/dashboard")
        expect(response.status).toBe(401);
    });

    it('should NOT be able to access private routes with invalid token' , async () =>{
        const response = await request(app)
                .get("/dashboard")
                .set("Authorization" , "Bearer 12346789");
        expect(response.status).toBe(401);
    });
});
