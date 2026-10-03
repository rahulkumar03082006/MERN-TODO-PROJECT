import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../style/list.css"
function List() {
    const [taskData, setTaskData] = useState()
    const [selectTask, setSelectTask] = useState([])
    useEffect(() => {
        getTaskList()
    }, [])
    const getTaskList = async () => {
        let list = await fetch("http://localhost:3200/tasks", {
            credentials: "include"
        })
        list = await list.json()
        if (list.success) {
            setTaskData(list.result)
        } else {
            alert("try after sometimes")
        }
    }
    const deletetask = async (id) => {
        let item = await fetch("http://localhost:3200/delete/" + id, { method: "Delete" , credentials : "include"})
        item = await item.json()
        if (item.success) {
            getTaskList()
        } else {
            alert("try after sometimes")
        }
    }
    const selectAll = (event) => {
        if (event.target.checked) {
            let items = taskData.map((item) => item._id)
            setSelectTask(items)
            console.log(items);
        } else {
            setSelectTask([])
        }
    }
    const selectSingleItem = (id) => {
        if (selectTask.includes(id)) {
            let items = selectTask.filter((item) => item != id)
            setSelectTask([items])
        } else {
            setSelectTask([id, ...selectTask])
        }
    }
    const deleteMultiple = async () => {
        let item = await fetch("http://localhost:3200/delete-multiple",
            {
                method: "Delete",
                body: JSON.stringify(selectTask),
                credentials : "include",
                headers: {
                    "Content-Type": "Application/Json"
                }
            })
        item = await item.json()
        if (item.success) {
            getTaskList()
        } else {
            alert("try after sometimes")
        }
    }
    return (
        <div className="list-container">
            <h1>To Do List</h1>
            <button onClick={deleteMultiple} className="delete-item delete-multiple">Delete</button>
            <ul className="task-list">
                <li className="list-header"><input onChange={selectAll} type="checkbox" /></li>
                <li className="list-header">S.no</li>
                <li className="list-header">Title</li>
                <li className="list-header">Description</li>
                <li className="list-header">Action</li>

                {
                    taskData && taskData.map((item, index) => (
                        <Fragment key={item._id}>
                            <li className="list-item"><input onChange={() => selectSingleItem(item._id)} checked={selectTask.includes(item._id)} type="checkbox" /></li>
                            <li className="list-item">{index + 1}</li>
                            <li className="list-item">{item.title}</li>
                            <li className="list-item">{item.description}</li>
                            <li className="list-item"><button onClick={() => deletetask(item._id)} className="delete-item">Delete</button>
                                <Link to={"update/" + item._id} className="update-item">Update</Link></li>
                        </Fragment>
                    ))
                }
            </ul>
        </div>
    )
}
export default List