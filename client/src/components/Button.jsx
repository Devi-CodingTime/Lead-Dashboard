function Button(props){

    const {onClick, text} = props

    return(
        <button onClick={onClick} className="btn btn-primary w-100" type="submit">{text}</button>
    )
}

export default Button;