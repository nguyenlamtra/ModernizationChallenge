import React, { useState, useEffect } from 'react'
import TaskService from '../services/task.service'
import TaskForm from './taskForm'

import { PopupHelper } from '../../../utils/popupHelper'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setModalIsOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState({})

  useEffect(() => {
    reloadList()
  }, [])

  const toggleModal = (task) => {
    setCurrentTask(task)
    setModalIsOpen(!isModalOpen)
  }

  const completedTask = async (id, isCompleted) => {
    let task = tasks.find((t) => t.id === id)
    task.completed = isCompleted

    const data = await TaskService.updateTask(task)
    if (data) reloadList()
  }

  const reloadList = async () => {
    const data = await TaskService.getTasks()
    setTasks(data || [])
  }

  const confirmDeleteTask = async (id) => {
    if (window.confirm('Are you sure that you want to delete this task?')) {
      const data = await TaskService.deleteTask(id)
      if (data) reloadList()
    }
  }

  const popupMenuOnClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.target.parentNode.closest('.popup-menu').popupHelper.hide()
  }

  return (
    <div className="App">
      <main>
        <h1>Tasks</h1>
        <div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th className="w-1">Completed</th>
                  <th>Details</th>
                  <th className="w-1"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  return (
                    <tr key={t.id}>
                      <td className="text-center w-1">
                        <span className="checkbox">
                          <input onChange={() => completedTask(t.id, !t.completed)} type="checkbox" checked={t.completed} />
                        </span>
                      </td>
                      <td>{t.details}</td>
                      <td className="w1">
                        <div className="popup-menu" onClick={(e) => { PopupHelper.init( e.target, e.target.querySelector('span'), { mode: 'click' })}}>
                          <span onClick={popupMenuOnClick}>
                            <span className="menu-item" onClick={() => { toggleModal(t) }}>Edit</span>
                            <span className="menu-item" onClick={(e) => { confirmDeleteTask(t.id) }}>Delete</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                <tr className="info">
                  <td colSpan="99">
                    <span onClick={() => toggleModal()} className="create-new-task">+ Create a new task</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (<TaskForm onRequestClose={toggleModal} task={currentTask} onReloadList={reloadList}/>)}
        <div className={'overlay' + (isModalOpen ? ' visible' : '')}></div>
      </main>
    </div>
  )
}

export default TaskList
