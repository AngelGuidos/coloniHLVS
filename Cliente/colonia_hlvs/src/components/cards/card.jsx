import "./card.css";



const Card = () => {
    const Data = [
        { id: 1, title: '34', date: '04/20/24', time: '14:30'},
        { id: 2, title: '48', date: '05/20/24', time: '14:30' },
        { id: 3, title: '83', date: '02/20/24', time: '14:30' },
    ];

  return (
    <div className="card-container">
        { Data.map((item) => {
            return (
             <>
                <h1>Casa #{item.title}</h1>
                <div className="down-container">
                    <div>
                        <h2>Dia:</h2>
                        <div>{item.date}</div> 
                    </div>
                    <div>
                        <h2>Hora:</h2>
                        <div>{item.time}</div>
                    </div>
                </div>
             </>
            );
        })}
    </div>
  )
}

export default Card