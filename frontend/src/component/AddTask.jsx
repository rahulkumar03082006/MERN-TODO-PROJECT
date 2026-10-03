import { useState } from "react"
import "../style/addtask.css"
import { useNavigate } from "react-router-dom"
export default function AddTask() {
    const navigate = useNavigate()
    const [taskData, setTaskData] = useState()
    const handleAddTask = async () => {
        console.log(taskData)
        let result = await fetch("http://localhost:3200/add-task", {
            method: "Post",
            body: JSON.stringify(taskData),
            credentials : "include",
            headers: {
                "Content-Type": "Application/Json"
            }
        })
        result = await result.json()
        if (result.success) {
            navigate("/")
            console.log("New Task Added");
        }else{
            alert("try after sometimes")
        }
    }
    return (
        <div className="container">
            <h1>Add New Task</h1>
            <label htmlFor="">Title</label>
            <input onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} type="text" name="title" placeholder="Enter task title" />
            <label htmlFor="">Description</label>
            <textarea onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} rows={4} name="description" id="" placeholder="Enter task description"></textarea>
            <button onClick={handleAddTask} className="submit">Submit</button>
        </div>
    )
}
