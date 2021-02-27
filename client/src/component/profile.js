import React, { useEffect,useState,useContext } from 'react';
import { Modal,Button } from 'react-bootstrap'
import {UserContext} from '../App'
import './styles.css'


export default function Profile(){
    
    const [mypics,setpics] = useState([]);
    const {state,dispatch} = useContext(UserContext)
    const [image,setimage] = useState("")
    const [show, setShow] = useState(false);
    console.log(state)
    // console.log(state?state.profilePic:"loading")
    useEffect(()=>{
        fetch('http://localhost:5000/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setpics(result.myposts)
        })
    },[])
   
    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset","insta-clone");
            data.append("cloud_name","dvpg6kmsv");
            fetch("https://api.cloudinary.com/v1_1/dvpg6kmsv/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                fetch('http://localhost:5000/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        profilePic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,profilePic:result.profilePic}))
                    dispatch({type:"UPDATEPIC",payload:result.profilePic})
                })
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[image])

    const updatepic=(file) =>{
        setimage(file)
    }

    const handleClose = () => {
        console.log("handle close clicked")
        setShow(false);

    }
    const handleShow = () => {
        console.log("handle show clicked")
        setShow(true);
    }
    const bg = {
        overlay: {
          background: "#FFFF00"
        }
    }
    return(
        <div >
           <div style={{
               display:"flex",
               marginLeft:"30%",marginRight:"30%",marginTop:"10px",maxWidth:"500px"
            }}>
                <div>
                    <img name="profilePic" src={state?state.profilePic: "https://res.cloudinary.com/dvpg6kmsv/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1614179242/hrjnmyztouwfyruk9bcu.png"} style={{
                            width:"160px",
                            height:"160px",
                            borderRadius:"50%"
                    }} />
                    <div className="file-field input-field">
                        <div className="btn blue darken-1 updatepicbtn">
                            <span>Edit profile</span>
                            <input type="file" onChange={(e)=>updatepic(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
                <div style={{padding:"30px"}}>
                    <h4>{state?state.username:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%",fontSize:"15px"}}>
                        <p><span style={{fontWeight:"bold",marginRight:"5px"}}>{state?mypics.length:"0"}</span>posts</p>
                        <p><span style={{fontWeight:"bold",marginRight:"5px"}}>{state?state.followers.length:"0"}</span>followers</p>
                        <p><span style={{fontWeight:"bold",marginRight:"5px"}}>{state?state.following.length:"0"}</span>following</p>
                    </div>
                </div>
            </div>
            
            <>
            {console.log(show)}
            
        </>
      
            <hr style={{color:"black"}}></hr>
            <div className="row gallery" >
                {
                      
                      
                    mypics.map(item=>{
                        return(
                            <>
                            <div className="divimg col s4 profileimg">
                                <img key={item._id} src={item.photo} onClick={()=>handleShow()} className="pics" alt={item.title}/>
                                <div className="profileCommentLike">
                                    <div className="profilepostsicon">
                                        <i className="material-icons">favorite</i>
                                        <span style={{color:"black",zIndex:"1"}}>{item.likes.length}</span>
                                        <i className="material-icons">chat_bubble_outline</i>
                                        <span style={{color:"black",zIndex:"1"}}>{item.comments.length}</span>
                                    </div>
                                </div>
                            </div>
                            
                            </>
                        )
                    })
                }
            </div>
            
                {
                    mypics.map(item=>{
                        return(
                            <div>
                                 <Modal style={{position:"absolute",top:"5%",height:"1000px",overflow:"hidden"}}  show={show} animation={false}>
                                 <button className="modalclosebtn" onClick={()=>handleClose()}>x</button>
                                    <Modal.Body style={{display:"flex",position:"absolute",bottom:"0px",top:"0px",left:"0px"}}>
                                        
                                        <img style={{width:"790px"}} src ={item.photo}></img>
                                        <div className="container">
                                            <div style={{display:"flex"}}>
                                                <img src={state.profilePic} style={{margin:"10px",width:"35px",height:"35px",borderRadius:"50%"}}></img>
                                                <h5>{state.username}</h5>
                                            </div>
                                            <div style={{lineHeight:"0px",paddingLeft:"10px"}}>
                                                <h6>{item.title}</h6>
                                                <p>{item.body}</p>
                                            </div>
                                            <hr></hr>
                                            {
                                                item.comments.map(comm=>{
                                                    return(
                                                        <div style={{padding:"5px",lineHeight:"2px"}}>
                                                        <p><span style={{fontWeight:"bold"}}>{comm.postedby.username}</span>    {comm.text}</p>
                                                        
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div style={{position:"absolute",bottom:"0%",width:"40%",paddingLeft:"5px"}}>
                                                <hr ></hr>
                                                <div style={{display:"flex"}}>
                                                    <div className="col" style={{lineHeight:"0px"}}>
                                                        <i  style={{color:"red"}}  className="material-icons">favorite</i>
                                                        <p>{item.likes.length} likes</p>
                                                    </div>
                                                    <i className="material-icons">chat_bubble_outline</i>  
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    
                                </Modal>
                            </div>
                        )
                    })
                }
                
        </div>
        
    )
}
