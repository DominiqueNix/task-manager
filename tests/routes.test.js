const { connect, connection } = require("mongoose");
require("dotenv").config(".env");
const app = require("../app");
const request = require("supertest");
const { User, Project, Task } = require("../models");

jest.mock("express-openid-connect", () => ({
  auth: jest.fn(() => {
    return (req, res, next) => {
      const email = req.headers.authorization.split(" ")[1];
      req.oidc = { user: { email } };
      next();
    };
  }),
}));

const testEmail1 = "test@testing.com";
const testEmail2 = "test2@teting.com";
const testEmail3 = "test3@teting.com";
const project = {
  title: "Operation Mars Melody",
  description:
    "Compose and transmit a musical message to potential life on Mars, using radio waves as a universal language bridge.",
  endDate: "2028-01-01",
  onlyOwnerEdit: false,
};

let project2;
let user3;
let user2;
const taskData = {
  title: "Investigate new productivity tools",
  description:
    "Research and evaluate potential software solutions to streamline workflows and enhance team productivity.",
  dueDate: "2024-03-06",
  priority: "minor",
  status: "not started",
};

beforeEach(async () => {
  await connect(process.env.MONGODB_URI);

  await User.findOneAndDelete({ email: testEmail2 });
  user2 = await User.create({ email: testEmail2 });

  await User.findOneAndDelete({ email: testEmail3 });
  user3 = await User.create({ email: testEmail3 });

  await Project.findOneAndDelete({ title: project.title });
  project2 = await Project.create({
    title: "Project Second Chance",
    description:
      "Develop advanced bioprinting technology to create functional replacement organs, offering hope and extended life to individuals with organ failure.",
    endDate: "2027-07-04",
    onlyOwnerEdit: false,
    collaborators: [user2._id],
    owner: user2._id,
  });
});

describe("home Routes", () => {
  test("/dashboard returns 200 when the user doesn't already exist", async () => {
    const res = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${testEmail1}`)
      .expect(200);
  });
  test("/dashboard returns 200 when the user exsists", async () => {
    const res = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${testEmail2}`)
      .expect(200);
  });
});

describe("project routes", () => {
  test("POST /projects creates a project", async () => {
    const res = await request(app)
      .post("/projects")
      .type("json")
      .set("Authorization", `Bearer ${testEmail2}`)
      .send(project)
      .expect(201);
  });
  test("GET /projects/projectId returns projects when user is a collaborator", async () => {
    const res = await request(app)
      .get(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .expect(200);
  });
  test("GET /projects/projectId returns error when user is not a collaborator", async () => {
    const res = await request(app)
      .get(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .expect(401);
  });
  test("PUT /projects/projectId returns success status if user is a collaborator", async () => {
    const res = await request(app)
      .put(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .send({ title: "new title", collaborators: [user3._id] })
      .expect(200);
    const updatedProject = await Project.findById(project2._id);
    expect(updatedProject.collaborators.length).toEqual(2);
    expect(updatedProject.title).toBe("new title");
  });

  test("PUT /projects/projectId returns error is user in not a collaborator", async () => {
    const res = await request(app)
      .put(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .send({ title: "new title" })
      .expect(401);
  });

  test("DELETE /projects/projectsId deletes a project if the user has access", async () => {
    const res = await request(app)
      .delete(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .expect(200);
    const project = await Project.findById(project2._id);
    expect(project).toBeNull();
  });
  test("DELETE /projects/projectsId sends error is user is not a collaborator", async () => {
    const res = await request(app)
      .delete(`/projects/${project2._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .expect(401);
  });

  test("PUT /projects/projectId will delete a user from thier tasks if a user is removed as a collaborator on a project", async () => {
    let task = await Task.create({ ...taskData, assignees: [user3._id] });
    let newProject = await Project.create({
      ...project,
      collaborators: [user2._id, user3._id],
      tasks: [task._id],
    });
    const res = await request(app)
      .put(`/projects/${newProject._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .send({ title: "new title", collaborators: [] })
      .expect(200);
    let updatedProject = await Project.findById(newProject._id);
    let updatedTask = await Task.findById(task._id);
    expect(updatedProject.collaborators.length).toBe(1);
    expect(updatedTask.assignees.length).toBe(0);
  });

  test("PUT /projects/projectId will NOT update if onlyOwnerEdit is true and a user who is not the owner (but still a collaborator) tries to update project", async () => {
    let newProject = await Project.create({
      ...project,
      collaborators: [user2._id, user3._id],
      onlyOwnerEdit: true,
    });
    const res = await request(app)
      .put(`/projects/${newProject._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .send({ title: "new title" })
      .expect(401);
  });
});

describe("task routes", () => {
  test("POST /project/projectId/tasks creates a new task for a project", async () => {
    const res = await request(app)
      .post(`/projects/${project2._id}/tasks`)
      .type("json")
      .set("Authorization", `Bearer ${testEmail2}`)
      .send(taskData)
      .expect(201);
    let updatedProject = await Project.findById(project2._id);
    expect(updatedProject.tasks.length).toEqual(1);
  });

  test("POST /project/projectId/tasks will not create a task if a user is NOT a collaborator on the project", async () => {
    const res = await request(app)
      .post(`/projects/${project2._id}/tasks`)
      .type("json")
      .set("Authorization", `Bearer ${testEmail3}`)
      .send(taskData)
      .expect(401);
  });

  test("GET /projects/projectId/tasks/taskId will get a task if a user is a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    const res = await request(app)
      .get(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .expect(200);
  });

  test("GET /projects/projectId/tasks/taskId will NOT get a task if a user is a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    const res = await request(app)
      .get(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .expect(401);
  });

  test("PUT /projects/projectId/tasks/taskId will update a task if a user and assignees are collaborators on the project", async () => {
    let task = await Task.create(taskData);
    let newProject = await Project.create({
      ...project,
      collaborators: [user2._id, user3._id],
    });
    const res = await request(app)
      .put(`/projects/${newProject._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .send({ title: "new title", assignees: [user3._id] })
      .expect(200);
    const updatedTask = await Task.findById(task._id);
    const updatedUser = await User.findById(user3._id);
    expect(updatedTask.assignees.length).toEqual(1);
    expect(updatedTask.title).toBe("new title");
    expect(updatedUser.tasks.length).toEqual(1);
  });

  test("PUT /projects/projectId/tasks/taskId will NOT update a task if user tries to add an assignee who is not a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    const res = await request(app)
      .put(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .send({ title: "new title", assignees: [user3._id] })
      .expect(401);
  });

  test("PUT /projects/projectId/tasks/taskId will NOT update a task if a user is not a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    const res = await request(app)
      .put(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .send({ title: "new title" })
      .expect(401);
  });

  test("DELETE /projects/projectId/tasks/taskId will delete a task if a user is a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    await Project.findByIdAndUpdate(project2._id, {
      $set: { tasks: task._id },
    });
    const res = await request(app)
      .delete(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail2}`)
      .expect(200);
    let deleteTask = await Task.findById(task._id);
    let updatedProject = await Project.findById(project2._id);
    expect(deleteTask).toBeNull();
    expect(updatedProject.tasks.length).toEqual(0);
  });

  test("DELETE /projects/projectId/tasks/taskId will NOT delete a task if a user id a collaborator on the project", async () => {
    let task = await Task.create(taskData);
    const res = await request(app)
      .delete(`/projects/${project2._id}/tasks/${task._id}`)
      .set("Authorization", `Bearer ${testEmail3}`)
      .expect(401);
  });
});

afterEach(async () => {
  await Project.deleteMany({ description: project2.description });
  await Task.deleteMany({ description: taskData.description });
  await User.findOneAndDelete({ email: testEmail1 });
  await User.findOneAndDelete({ email: testEmail2 });
  await User.findOneAndDelete({ email: testEmail3 });
  await connection.close();
});
