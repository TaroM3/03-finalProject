import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing E-Commerce', () => {

    describe('Test Cart Router', () => {

        it('Debe agregar un producto al carrito', async () => {
            const result = await requester.post('/api/carts/6493843103267ab314dba69b').send({
                productId: '646c1f3f5fa7f28e61b74849',
                cantidad: 1
            });
            expect(result.status).to.equal(200)
        })

        it('Debe mostrar todos los carritos', async () => {
            const result = (await requester.get('/api/carts'))
            expect(result.status).to.equal(200)
        })

        it('Debe eliminar el carrito', async () => {
            const result = await requester.delete('/api/carts/6493843103267ab314dba69b')
            expect(result.status).to.equal(200)
        })
    })


    describe('Test Product Router', () => {

        it('Debe agregar un producto al carrito', async () => {
            const result = await requester.post('/api/products').send({
                title: 'Title',
                description: 'testing description',
                price: 32,
                status: true,
                stock: 12,
                category: 'categoria',
                thumbnails: [],
            });
            expect(result.status).to.equal(200)
        })

        it('Debe mostrar todos los productos', async () => {
            const result = (await requester.get('/api/products'))
            expect(result.status).to.equal(200)
        })

        it('Debe eliminar el producto', async () => {
            const result = await requester.delete('/api/products')
            expect(result.status).to.equal(200)
        })
    })

    describe('Test Session Router', () => {

        let cookie
        it('Debe registrar un usuario', async () => {
            const result = await requester.post('/session/register').send({
                first_name: 'Ricardo',
                last_name: 'Chavez',
                email: 'hola@gmail.com',
                age: 20,
                password: '123',
            });
            expect(result.status).to.equal(302)
        })

        
        it('Debe loguear con el email y la password', async () => {
            const result = await requester.post('/session/login').send({
                usernameField: 'hola@gmail.com',
                password: '123'
            })
            expect(result.status).to.equal(302)
        })

        it('Debe loguear con el email y la password', async () => {
            const result = await requester.post('/session/login').send({
                usernameField: 'hola@gmail.com',
                password: '123'
            })
            cookie = result.header['set-cookie'][0]
            expect(result.status).to.equal(302)
        })
        after('Debe corroborar que la cookie se haya creado', async () => {
            const result = await requester.get('/session/current')
            cookie = result.header['set-cookie'][0]
            expect(cookie).to.be.ok
        })
    })

})