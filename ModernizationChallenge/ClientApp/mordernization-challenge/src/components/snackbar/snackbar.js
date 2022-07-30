/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react'
import useHover from '../../utils/useHover'
import './snackbar.css'

export const SnackbarContext = createContext(null)

const Snackbar = ({ children }) => {
  const [ref, isHover] = useHover()
  const [listTimeOut, setListTimeOut] = useState([])
  const defaultTimeOut = 5000
  useEffect(() => {
    if (isHover) {
      listTimeOut.forEach((t) => {
        clearTimeout(t)
      })
      setListTimeOut([])
    } else {
      ref.current.childNodes.forEach((n) => {
        setListTimeOut([
          ...listTimeOut,
          setTimeout(() => {
            onSnackbarClick(n)
          }, defaultTimeOut),
        ])
      })
    }
  }, [isHover])

  const onSnackbarClick = (el) => {
    el.style.opacity = 0
    setTimeout(() => {
      el.removeEventListener('click', (e) => onSnackbarClick(e.target))
      ref.current.removeChild(el)
    }, 150)
  }

  const openSnackbar = (text, className = 'error') => {
    let div = document.createElement('div')
    div.classList.add('snackbar')
    div.classList.add(className)
    div.innerText = text
    div.addEventListener('click', (e) => onSnackbarClick(e.target))

    while (ref.current.childNodes.length > 4) {
      ref.current.removeChild(ref.current.firstChild)
    }

    if (ref.current.childNodes.length === 0) ref.current.appendChild(div)
    else ref.current.insertBefore(div, ref.current.firstChild)

    setTimeout(() => {
      div.style.opacity = 1
    }, 1)

    setListTimeOut([
      ...listTimeOut,
      setTimeout(() => {
        onSnackbarClick(div)
      }, defaultTimeOut),
    ])
  }

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <div className="snackbar-container" ref={ref}></div>
    </SnackbarContext.Provider>
  )
}

export default Snackbar
