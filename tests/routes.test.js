const {connect, connection} = require('mongoose');
require('dotenv').config('.env');
const app = require('../app');
const request = require('supertest')
const {User, Project, Task} = require('../models');

jest.mock("express-openid-connect", () => ({
    auth: jest.fn(() => {
        return (req, res, next) => {
            const email = req.headers.authorization.split(" ")[1];
            req.oidc = {user: {email}};
            next()
        }
    }), 
}))

const testEmail1 = "test@testing.com"
const testEmail2 = "test2@teting.com"
const testEmail3 = "test3@teting.com"
const project = {
    "title": "Operation Mars Melody",
    "description": "Compose and transmit a musical message to potential life on Mars, using radio waves as a universal language bridge.",
    "endDate": "2028-01-01", 
    "onlyOwnerEdit": false, 
}
let project2;
let user3;

beforeEach(async () => {
    await connect(process.env.MONGODB_URI);
    
    // let user1 = await User.create({email: testEmail1})
    await User.findOneAndDelete({email: testEmail1})
    await User.findOneAndDelete({email: testEmail2})
    let user2 = await User.create({email: testEmail2})

    await User.findOneAndDelete({email: testEmail3})
    user3 = await User.create({email: testEmail3})

    await Project.findOneAndDelete({title: project.title})

    project2 = await Project.create({
        title: "Project Second Chance",
        description: "Develop advanced bioprinting technology to create functional replacement organs, offering hope and extended life to individuals with organ failure.",
        endDate: "2027-07-04", 
        onlyOwnerEdit: false,
        collaborators: [user2._id], 
        owner: user2._id
    })
    
})


describe("home Routes", () => {
    test("/dashboard returns 200 when the user doesn't already exist", async() => {
        const res = await request(app).get("/dashboard").set("Authorization", `Bearer ${testEmail1}`).expect(200);
    })
    test("/dashboard returns 200 when the user exsists", async() => {
        let user1 = await User.create({email: testEmail1})
        const res = await request(app).get("/dashboard").set("Authorization", `Bearer ${testEmail1}`).expect(200);
    })
})

describe("project routes", () => {
    test("POST /projects creates a project", async() => { 
        const res = await request(app).post("/projects").type("json").set("Authorization", `Bearer ${testEmail2}`).send(project).expect(201);

    })
    test("GET /projects/projectId returns projects when user is a collaborator", async() => {
        const res = await request(app).get(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail2}`).expect(200);
    })
    test("GET /projects/projectId returns error when user is not a collaborator", async() => {
        let user1 = await User.create({email: testEmail1})
        const res = await request(app).get(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail1}`).expect(401);
    })
    test("PUT /projects/projectId returns success status if user is a collaborator", async() => {
        const res = await request(app).put(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail2}`).send({title: "new title", collaborators: [user3._id]}).expect(200);
        const updatedProject = await Project.findById(project2._id)
        expect(updatedProject.collaborators.length).toEqual(2);
        expect(updatedProject.title).toBe("new title")
    })

    test("PUT /projects/projectId returns error is user in not a collaborator", async() => {
        let user1 = await User.create({email: testEmail1})
        const res = await request(app).put(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail1}`).send({title: "new title"}).expect(401);
    })

    test("DELETE /projects/projectsId deletes a project if the user has access", async() => {
        const res = await request(app).delete(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail2}`).expect(200);
        const project = await Project.findById(project2._id)
        expect(project).toBeNull()
    })
    test("DELETE /projects/projectsId sends error is user is not a collaborator", async() => {
        let user1 = await User.create({email: testEmail1})
        const res = await request(app).delete(`/projects/${project2._id}`).set("Authorization", `Bearer ${testEmail1}`).expect(401); 
    })
})


afterEach(async() => {
    await connection.close()
})