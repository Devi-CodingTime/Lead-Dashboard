import React from 'react'

function Input({onChange,type,name, className}) {
  return (
    <input onChange={onChange} type={type} name={name}  className={className} required/>
  )
}

export default Input
