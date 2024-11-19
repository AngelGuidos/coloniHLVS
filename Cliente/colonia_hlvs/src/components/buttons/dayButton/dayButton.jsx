import './dayButton.css'

function DayButton({text, onClick}){
    return(
        <div className='daysContainer'>
            <button className='dayButton' onClick={onClick}> </button>
            <p>{text}</p>
        </div>
    )
}

export default DayButton;