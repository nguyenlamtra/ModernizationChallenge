import { useContext } from 'react'
import { SnackbarContext } from './snackbar'

export const useSnackbar = () => {
  const { openSnackbar } = useContext(SnackbarContext)

  function open(text = '') {
    openSnackbar(text)
  }

  return [open]
}
