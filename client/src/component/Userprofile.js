import React, { useEffect,useState,useContext } from 'react';
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'
import './styles.css'


export default function Userprofile(){
    
    const [Userprofile,setprofile] = useState(null);
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setshowfollow] = useState(state?!state.following.includes(userid):true);
    // console.log(userid)
    console.log("state:")
    console.log(state)
    useEffect(()=>{
        fetch(`http://localhost:5000/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log("userprofile")
            console.log(result);
            setprofile(result)
        })
    },[])
    
    const followUser = () =>{
        fetch('http://localhost:5000/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log("result")
            console.log(result)//this result is logged in users result
            dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result))
            setprofile((prevstate)=>{
                return{
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,result._id]//adding the users followers and logged in users id
                    }
                }
            })
            // setshowfollow(false)
        })
    }

    const unfollowUser = () =>{
        fetch('http://localhost:5000/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log("result unfollow user")
            console.log(result)//this result is logged in users result
            dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result))
            setprofile((prevstate)=>{
                const newfollower = prevstate.user.followers.filter(item=>item!=result._id)
                console.log(newfollower)
                return{
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newfollower//adding the users followers and logged in users id
                    }
                }
            })
            
            // setshowfollow(true)
        })
    }

    return(
        <>
        {Userprofile?
        <div>
        <div style={{
            display:"flex",
            margin:"0px auto",maxWidth:"500px"
         }}>
             <div>
                 {/* {console.log(Userprofile)} */}
                 <img name="profilePic" src={Userprofile.user?Userprofile.user.profilePic:"https://res.cloudinary.com/dvpg6kmsv/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1614179242/hrjnmyztouwfyruk9bcu.png"} style={{
                         width:"160px",
                         height:"160px",
                         borderRadius:"50%",
                         padding: "15px"
                     }} />
             </div>
             <div style={{padding:"30px"}}>
                 <h4>{Userprofile.user.username}</h4>
                 <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                     <h5>{Userprofile.posts.length} posts</h5>
                     <h5>{Userprofile.user.followers.length} followers</h5>
                     <h5>{Userprofile.user.following.length} following</h5>
                 </div>
                 {
                     state.following.includes(userid)?
                     <button className="btn waves-effect waves-light #ffffff white" onClick={()=>unfollowUser()} style={{color:"black",width:"350px"}}>Following</button>
                     :
                     <button className="btn waves-effect waves-light #2196f3 blue" onClick={()=>followUser()} style={{width:"350px"}}>Follow</button>
                 }
             </div>
         </div>
         <hr style={{color:"black"}}></hr>ss
         <div className="row gallery" >
             {
                 Userprofile.posts.map(item=>{
                     return(
                         
                         <div className="divimg col s4"><img key={item._id} src={item.photo} className="pics" alt={item.title}/></div>
                     )
                 })
             }
         </div>
     </div>
        :<h2>loading....</h2>}
        
        </>
    )
}
