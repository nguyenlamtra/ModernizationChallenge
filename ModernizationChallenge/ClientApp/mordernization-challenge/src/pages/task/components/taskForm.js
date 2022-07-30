import React, { useState } from 'react'
import TaskService from '../services/task.service'
import { useSnackbar } from '../../../components'

const TaskForm = ({ onRequestClose, task, onReloadList }) => {
  const [details, setDetails] = useState(task?.details)
  const [openSnackbar] = useSnackbar()

  const detailsOnChange = (e) => {
    setDetails(e.target.value)
  }

  const saveForm = async () => {
    try {
      let data
      if (task && task.id) {
        const model = { ...task, details }
        data = await TaskService.updateTask(model)
      } else {
        const model = { details }
        data = await TaskService.createTask(model)
      }
      if (data) {
        onReloadList()
        onRequestClose()
      }
    } catch (err) {
      console.log(err)
      openSnackbar(`One or more required fields haven't been filled in.`)
    }
  }
  return (
    <div className="dialogue">
      <div className="w-750">
        <div className="header">
          <span className="close" onClick={onRequestClose} />
          <h2>{task ? 'Update' : 'Create'} task</h2>
        </div>

        <div className="body">
          <fieldset className="required">
            <label>Details</label>
            <textarea className="text" height="100" rows="2" cols="20" value={details} onChange={(e) => detailsOnChange(e)}/>
          </fieldset>
        </div>

        <div className="footer">
          <p className="commands">
            <span className="grow"></span>
            <span className="button hollow" onClick={onRequestClose}>Cancel</span>
            <span className="button" onClick={saveForm}>Save</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TaskForm
