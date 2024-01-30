import { useEffect, useRef, useState } from "react";
import { Layout } from "../../components/layout/Layout"
import { useRecoilState } from "recoil";
import { wsConnState } from "../../store/atoms/wsatom";
import { Loading } from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const GamePage = () =>{

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [drawingMode, setDrawingMode] = useState(false);
    const [color, setColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(1);
    const [isGameStarted, setGameStarted] = useState(false);
    const socket = useRecoilState(wsConnState)[0];
    const canvasRef = useRef(null);
    const [theme, setTheme] = useState('');
    const [author, setAuthor] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [library, setLibrary] = useState([]);
    const [isRatingSend, setRatingSend] = useState(false);
    const [isWinnerGet, setWinnerGet] = useState(false);
    const [winner, setWinner] = useState({});
    const [mode, setMode] = useState(false);

    useEffect(()=>{
        socket.emit('readyToStart');
        socket.on('startGame', (data)=>{
            setTheme(data.theme);
            setGameStarted(true);
            
        })
        socket.on('setImg', (data)=>{
            setLibrary(data.imgs)
            // setAuthor(data.nickname);
            // setAuthorId(data.userid);
            // console.log('set new img');
            // const image = new Image();
            // image.onload = () => {
            //     clearCanvas();
            //     canvasRef.current.getContext('2d').drawImage(image, 0, 0);
            // };
            // image.src = data.img;
            // setTimeout(()=>{
            //     socket.emit('imgChecked', {
            //         authorId: data.userid
            //     });
            //     socket.emit('getImg');
            // }, 10000);
        })

        socket.on('setWinner', (data)=> {
            setWinnerGet(true);
            setWinner(data.winner);
        })
    }, []);

    useEffect(()=>{
        if(isGameStarted){
            setCanvasConfig();
            setTimeout(()=>{
                setGameStarted(false);
                socket.on('readyToSendImg',()=>{
                    socket.emit('getImg');
                });
                socket.emit('saveImg', {
                   img: canvasRef.current.toDataURL('image/png')
                })
                setTimeout(()=>{
                    socket.emit('getWinner');
                }, 10000)
                // setShowImageTime(true);
            }, 60000);
        }
    }, [isGameStarted]);

    const setCanvasConfig = () => {
        const container = canvasRef.current.parentNode;
        canvasRef.current.width = container.offsetWidth;
        canvasRef.current.height = container.offsetHeight;
    }




    // useEffect(()=>{
    //     socket.emit('getTheme');
    //     //изменение размеров canvas
    //     const container = canvasRef.current.parentNode;
    //     console.log(container.offsetWidth, container.offsetHeight)
    //     canvasRef.current.width = container.offsetWidth;
    //     canvasRef.current.height = container.offsetHeight;
        
    //     if(socket.connected){
    //         socket?.on('setTheme', (data)=>{
    //             setTheme(data.theme);
    //             console.log(data.theme);
    //             console.log(theme);
    //         });



    //         socket?.on('updCanvas', (data)=>{
    //             const image = new Image();
    //             image.onload = () => {
    //                 canvasRef.current.getContext('2d').drawImage(image, 0, 0);
    //             };
    //             image.src = data.newContext;
    //         })
    //     } else {
    //         socket.on('connect', ()=>{
    //             socket?.on('updCanvas', (data)=>{
                    
    //             })
    //             socket?.on('setTheme', (data)=>{
    //                 setTheme(data.theme);
    //                 console.log(data.theme);
    //                 console.log(theme);
    //             });
    //         })
    //     }       
    //     return ()=>{
    //         socket.removeAllListeners('updCanvas');
    //     }
    // }, []);

    // useEffect(()=>{
    //     let intervalSend = null;
    //     if(isGameStarted){
    //         intervalSend = setInterval(()=>{
    //             console.log('game');
    //         }, 1000);
    //     }
    //     return ()=>{
    //         clearInterval(intervalSend);
    //     }
    // }, [isGameStarted]);

    const startDrawing = ({ nativeEvent }) => {
        setGameStarted(true);
        const context = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = nativeEvent;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setDrawingMode(true);
    };

    const draw = ({ nativeEvent }) => {
        const context = canvasRef.current.getContext('2d');
        if (!drawingMode) return;
        const { offsetX, offsetY } = nativeEvent;
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setDrawingMode(false);
    };

    const genPalleteBlock = () =>{
        const colors = [
            'red', 'darkred', 'yellow', 'lightyellow', 'green', 'lightgreen', 'darkgreen', 'blue', 'lightblue', 'darkblue', 'gray', 'lightgray', 'darkgray', 'purple', 'magenta', 'orange', 'black', 'white'
        ];
        return (
            <div className="pallete-color-container">
                {colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: color,
                    width: '20px',
                    height: '20px',
                    marginRight: '2px',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                  onClick={() => setColor(color)}
                ></div>
              ))}
            </div>
        );
    }

    const getLineSizeBlock = () => {
        const linesize = [1, 3, 5, 7, 9, 12, 15];
        return (
            <div className="pallete-linesize-container">
                {/* <button style={{height: '20px', width: '20px'}} onClick={()=>clearCanvas()}> */}
                    <img style={{width: '20px', height: '20px', marginRight:'15px', cursor: 'pointer'}} 
                    src="../../../public/trashcan.png"
                    onClick={()=>clearCanvas()}/>
                {/* </button> */}
                {linesize.map((size, index) => (
                    <div
                        key={index}
                        style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '2px',
                        // display: 'inline-block',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        borderRadius: '2px',
                        marginBottom: '2px'
                        }}
                        onClick={() => setLineWidth(size)}
                    >
                        <div style={{
                            width: size +'px',
                            height: size +'px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                        }}
                        ></div>
                    </div>
                ))}
            </div>
        );
    }

    const clearCanvas = () => {
        console.log('clear');
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const showRatingButtons = () => {
        const ratings = ['1', '2', '3', '4', '5'];
        return (
            <div style={{marginTop:'5px', width: "100%", display: 'flex', justifyContent: 'center'}}>
                {
                    ratings.map((item)=>{
                        return (
                            <button key={item} style={{
                                width: "30px",
                                height: "30px",
                                marginRight: '10px',
                                padding: '0px'
                            }}
                                onClick={()=> {
                                    updRating(item);
                                }}>{item}</button>
                        )
                    })
                }
            </div>
        )
    }

    const updRating = (item) => {
        socket.emit('setRating', {
            rating: +item, authorId
        })
    }

    const showCanvas = () => {
        if(library.length == 0)
            return (
                <div className="game-container">
                    <div className="game-container-head">
                        <h3>Game</h3>
                        <hr/>
                        <h4>Theme: {theme} {author ? 'Athor: ' + author : ''}</h4>
                    </div>
                    <div className="game-image">
                        <canvas ref={canvasRef} id="myCanvas"
                            onMouseDown={(e) => startDrawing(e)}
                            onMouseMove={(e) => draw(e)}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                        ></canvas>
                    </div> 
                    <div className='game-container-pallete'>
                        {
                            author ? showRatingButtons() : genPalleteBlock()
                        }
                        {author ? '' : getLineSizeBlock()}
                    </div>
                </div>
            );
        else if(!isRatingSend) return (
            <div className="game-container">
                    <div className="game-container-head">
                        <h3>Game</h3>
                        <hr/>
                        <h4>Theme: {theme} {author ? 'Athor: ' + author : ''}</h4>
                    </div>
                    <div className="game-images-container">
                        {
                            library.map((item) => {
                                return (
                                    <div key={item.socketID} onClick={()=>{sendRating(item.socketID)}}>
                                        <h4>{item.nickname}</h4>
                                        <hr style={{marginBottom: '2px'}}/>
                                        <img src={item.img} className="players-image"/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        else if(isWinnerGet) {
           
            if(!mode){
                setMode(true);
                if(winner.id == user.id){
                    console.log("winner and me: " + winner.id + ' ' + user.id);
                    socket.emit('setHistory');
                }
                setTimeout(()=>{
                    socket.emit('endGame');
                    navigate('/group');
                    console.log('set timeout by end game')
                }, 5000)
            }
            return (
            <div className="game-container">
                    <div className="game-container-head">
                        <h3>Game</h3>
                        <hr/>
                        <h4>We have a winner: {winner.nickname}!!!!</h4>
                    </div>
                    <div className="game-image">
                        {/* <canvas ref={canvasRef} id="myCanvas"
                            onMouseDown={(e) => startDrawing(e)}
                            onMouseMove={(e) => draw(e)}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                        ></canvas> */}
                        <img src={winner.img} className="winner-image"/>
                    </div> 
                    {/* <div className="game-images-container">
                        <div style={{width: canvasRef.current.width, height:  canvasRef.current.height}}>
                            <h4>{winner.nickname}</h4>
                            <hr style={{marginBottom: '2px'}}/>
                            <img src={winner.img} className="winner-image"/>
                        </div>
                    </div> */}
                </div>
        )
        } else return (
            <div className="game-container">
                <Loading/>
            </div>
        )
    }

    const sendRating = (socketID) => {
        setRatingSend(true);
        socket.emit('setRating', {
            socketID
        })
    }

    return(
        <Layout>
                {
                    theme && theme.length <= 0 ? <Loading/> : showCanvas()
                }
        </Layout>
    )
}