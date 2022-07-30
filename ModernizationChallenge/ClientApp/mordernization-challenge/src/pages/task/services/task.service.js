import { AppConst } from '../../../utils/const'
import axios from 'axios'

const getTasks = async () => {
  const res = await axios.get(AppConst.baseAddress)
  return res?.data
}

const getTaskById = async (id) => {
  const res = await axios.get(`${AppConst.baseAddress}/${id}`)
  return res?.data
}

const deleteTask = async (id) => {
  const res = await axios.delete(`${AppConst.baseAddress}/${id}`)
  return res?.data
}

const createTask = async (task) => {
  const res = await axios.post(AppConst.baseAddress, task)
  return res?.data
}

const updateTask = async (task) => {
  const res = await axios.put(AppConst.baseAddress, task)
  return res?.data
}

const TaskService = {
  getTasks,
  getTaskById,
  deleteTask,
  createTask,
  updateTask,
}

export default TaskService
