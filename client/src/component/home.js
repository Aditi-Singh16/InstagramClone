import React,{useState,useRef,useEffect,useContext} from 'react';
import {UserContext} from '../App'
import { Link } from 'react-router-dom'
import './styles.css'

function Home(){

    const [data,setdata] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [comment,setcomment] = useState("")
    const {state,dispatch} = useContext(UserContext)
    // const [enable,setenable]=useState(false)
    useEffect(()=>{
        fetch('http://localhost:5000/allposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setdata(result.posts)
        })
    },[])

    const likepost = (id) => {
        fetch('http://localhost:5000/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
                const newData = data.map(item=>{
                    if(item._id==result._id){//this means that if id of the post on the page is equal to id of the post we liked then we will update it
                        return result
                    }else{
                        return item
                    }
                })
                setdata(newData)
                // setlikecount("true")
        }).catch(err=>{
            console.log(err)
        })

    }
//sebding in id to know who has unliked
    const unlikepost = (id) => {
        fetch('http://localhost:5000/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
             if(item._id==result._id){//this means that if id of the post on the page is equal to id of the post we liked then we will update it
                 return result
             }else{
                 return item
             }
         })
         setdata(newData)
        }).catch(err=>console.log(err))

    }


    const makecomment=(text,id)=>{
        // if(text.length==0){
        //     setenable(true)
        // }
        fetch('http://localhost:5000/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){//this means that if id of the post on the page is equal to id of the post we liked then we will update it
                    return result
                }else{
                    return item
                }
            })
            setdata(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const showcomment = () =>{
        console.log("btn clicked")
        setIsOpen(!isOpen);
    //    comm.map(comms=>{
    //        console.log("hello")
    //         return(
    //             <div style={{position:"absolute"}}>
    //                 <div>
    //                     <h6 key={comms._id}><span>{comms.postedby.username}</span>{comms.text}</h6>
    //                 </div>
    //             </div>
    //         )
    //      })
    }


    const deletepost=(postId)=>{
        console.log("hi")
        console.log(postId)
        fetch(`http://localhost:5000/deletepost/${postId}`,{
            method:"delete",
            headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setdata(newData)
        })
    }

    return(
        <div>
            <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" style={{
                            maxWidth:"500px",height:"max-content",margin:"auto auto",
                            marginTop:"70px",marginBottom:"50px"
                        }}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                                <div style={{display:"flex"}}>
                                    <div style={{margin:"10px"}}>
                                    <img style={{width:"35px",height:"35px",borderRadius:"50%"}} src= {item.postedby.profilePic}></img>
                                    </div>
                                    <h5 style={{paddingBottom:"20px",paddingLeft:"5px"}}><Link style={{color:"black"}}  to = {item.postedby._id != state._id ? "/profile/"+item.postedby._id:"/profile"} >{item.postedby.username}</Link></h5>
                                </div>
                                {
                                    item.postedby._id === state._id && <button style={{outline:"none",background:"none",border:"0"}} onClick={()=>{deletepost(item._id)}}><i className="material-icons" >delete</i></button>
                                }
                            </div>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <h6>{item.title}</h6>
                                <div style={{display:"flex"}}>
                                    <div className="col">
                                        {item.likes.includes(state._id)
                                        ?
                                        <i onClick={()=>{unlikepost(item._id)}} style={{color:"red"}}  className="material-icons">favorite</i>
                                        :<i onClick={()=>{likepost(item._id)}} className="material-icons">favorite_border</i>
                                        }
                                        <p>{item.likes.length} likes</p>
                                    </div>
                                    <button style={{outline:"none",background:"none",border:"0",paddingBottom:"25px"}} onClick={()=>{showcomment(item.comments)}}><i className="material-icons">chat_bubble_outline</i></button>
                                    <p>{item.comments.length} comments</p>
                                </div>
                                <p>{item.body}</p>
                                {isOpen?
                                    item.comments.map(rec=>{
                                        return(
                                            <h6 key={rec._id}><span style={{fontWeight: 'bold'}}>{rec.postedby.username}</span>    {rec.text}</h6>
                                        )
                                    })
                                    :<div></div>
                                }
                                <form >
                                    <input type="text" onChange={(e)=>{setcomment(e.target.value)}} placeholder="comment something"></input>
                                    {comment.length==0?<input disabled onClick={(e)=>{
                                        e.preventDefault();
                                        makecomment(comment,item._id)}} type="submit" value="Post"></input>
                                        :<input onClick={(e)=>{
                                            e.preventDefault();
                                            makecomment(comment,item._id)}} type="submit" value="Post"></input>
                                    }
                                    
                                </form>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}
export default Home