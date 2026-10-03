import { MongoClient } from "mongodb"
const url = "mongodb+srv://rahulverma03082006_db_user:6Q7ICzshW43bDfvQ@cluster0.rormtpc.mongodb.net/?appName=Cluster0"
const dbName = "node-project"
export const collectionName = "todo"
const client = new MongoClient(url)
export const connection =async()=>{
    const connect = await client.connect()
    return await connect.db(dbName)
}
