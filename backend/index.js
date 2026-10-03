import express from "express"
import cors from "cors"
import { collectionName, connection } from "./dbconfig.js"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(cookieParser())
app.post("/login", async (req, resp) => {
    const userData = req.body
    if (userData.email && userData.password) {
        const db = await connection()
        const collection = await db.collection("users")
        const result = await collection.findOne({email : userData.email , password : userData.password})
        if (result) {
            jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
                console.log(token);
                resp.send({
                    success: true,
                    message: "login done",
                    token
                })
            })
        }else{
            resp.send({
            success: false,
            message: "user not found",
        })
        }

    } else {
        resp.send({
            success: false,
            message: "login not done",
        })
    }
})

app.post("/signup", async (req, resp) => {
    const userData = req.body
    if (userData.email && userData.password) {
        const db = await connection()
        const collection = await db.collection("users")
        const result = await collection.insertOne(userData)
        if (result) {
            jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
                console.log(token);
                resp.send({
                    success: true,
                    message: "Signup done",
                    token
                })
            })
        }

    } else {
        resp.send({
            success: false,
            message: "Signup not done",
        })
    }
})
app.post("/add-task", verifyJWTToken, async (req, resp) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const result = await collection.insertOne(req.body)
    if (result) {
        resp.send({
            message: "new task is added",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "new task is not added",
            success: false,
        })
    }
})
app.get("/tasks",verifyJWTToken, async (req, resp) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const result = await collection.find().toArray()
    if (result) {
        resp.send({
            message: "task list is fetched",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "error try after sometimes later",
            success: false,
        })
    }
})


app.delete("/delete/:id", verifyJWTToken, async (req, resp) => {
    const db = await connection()
    const id = req.params.id
    const collection = await db.collection(collectionName)
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    if (result) {
        resp.send({
            message: "task is deleted",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "error try after sometimes later",
            success: false,
        })
    }
})
app.delete("/delete-multiple", verifyJWTToken, async (req, resp) => {
    const db = await connection()
    const ids = req.body
    console.log(ids);
    const deleteTasksIds = ids.map((item) => new ObjectId(item))
    const collection = await db.collection(collectionName)
    const result = await collection.deleteMany({ _id: { $in: deleteTasksIds } })
    if (true) {
        resp.send({
            message: "task is deleted",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "error try after sometimes later",
            success: false,
        })
    }
})
app.get("/task/:id", verifyJWTToken , async (req, resp) => {
    const db = await connection()
    const id = req.params.id
    const collection = await db.collection(collectionName)
    const result = await collection.findOne({ _id: new ObjectId(id) })
    if (result) {
        resp.send({
            message: "task is fetched",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "error try after sometimes later",
            success: false,
        })
    }
})
app.put("/update-task", verifyJWTToken, async (req, resp) => {
    const db = await connection()
    const collection = await db.collection(collectionName)
    const { _id, ...fields } = req.body
    const update = { $set: fields }
    console.log(fields);
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, update)
    if (result) {
        resp.send({
            message: "task data is updated",
            success: true,
            result
        })
    } else {
        resp.send({
            message: "error try after sometimes later",
            success: false,
        })
    }
})

function verifyJWTToken(req , resp , next){
    // console.log("cookie test" , req.cookies["token"]);
    const token = req.cookies['token']
    jwt.verify(token , "Google" , (error ,decoded)=>{
        if(error){
            return resp.send({
                message : "invalid token",
                success : false
            })
        }
        console.log(decoded);
        next()
    })
}

app.listen(3200)