import { useEffect, useState } from "react"
import "../style/addtask.css"
import { Navigate, useNavigate, useParams } from "react-router-dom"
export default function UpdateTask() {
    const [taskData, setTaskData] = useState()
    const navigate = useNavigate()
    const {id} = useParams()
    useEffect(()=>{
        getTask(id)
    },[])
    const getTask =async(id) =>{
        let task = await fetch("http://localhost:3200/task/"+id , {
            credentials : "include",
        })
        task = await task.json()
        if(task.result){
            setTaskData(task.result)
        }
    }
    const updateTask =async()=>{
        console.log("function called" , taskData);
        let task = await fetch("http://localhost:3200/update-task" ,{
            method : "put",
            body : JSON.stringify(taskData),
            credentials : "include",
            headers : {
                "Content-Type" : "application/Json"
            }
        })
        task = await task.json()
        if(task){
            navigate("/")
        }
    }
    return (
        <div className="container">
            <h1>Update Task</h1>
            <label htmlFor="">Title</label>
            <input value={taskData?.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} type="text" name="title" placeholder="Enter task title" />
            <label htmlFor="">Description</label>
            <textarea value={taskData?.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} rows={4} name="description" id="" placeholder="Enter task description"></textarea>
            <button onClick={updateTask} className="submit">Update Task</button>
        </div>
    )
}
