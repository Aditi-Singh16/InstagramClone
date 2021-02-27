import React,{useContext,useState,useEffect,useRef} from 'react';
import './styles.css'
import { Link,useHistory } from 'react-router-dom';
import {UserContext} from '../App'

function Navbar(){
    const history = useHistory();
    const searchdiv = useRef();
    const {state,dispatch} = useContext(UserContext)
    const [searchTerm,setsearchTerm]=useState("")
    const [userslist,setuserslist] = useState([])
    // var userarr =[]
    useEffect(()=>{
        fetch('http://localhost:5000/allusers',{
            method:"get",
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            
            var userarr = Object.values(data)
            console.log(userarr)
            setuserslist(userarr)

            
        })
    },[])
    
    // useEffect(()=>{
    //    searchdiv.current.style.opacity = "1"
    // },[searchTerm])
    
    
    const handlechange = (val)=>{
        setsearchTerm(val)
        if(val.length==0){
            searchdiv.current.style.opacity = "0"
        }else{
            searchdiv.current.style.opacity = "1"
        }
        
    }
    var arr=[]

     const renderList = ()=>{
         if(state){
            return [
                <li style={{fontFamily:"Grand Hotel, cursive",color:"black",fontSize:"30px",position:"absolute",left:"10%"}}>Instagram</li>,
                <li>
                    <div style={{display:"flex",paddingRight:"200px"}}>
                        <input type="text" placeholder="Search username..."  onChange={(e)=>handlechange(e.target.value)}/>
                        <i className="material-icons right" style={{color:"black"}}>search</i>
                    </div>
                    
                    <div style={{zIndex:"2",backgroundColor:"white",width:"174px",height:"150px",opacity:"0",border:"1px solid rgb(92, 174, 250)",overflow:"scroll"}} ref={searchdiv}>
                        {
                            // console.log(userslist),
                            // userslist,
                        //   userarr.filter(item=>{
                        //       console.log(item)
                        //       if(searchTerm==""){
                        //         console.log("hello1")
                        //         return ""
                        //       }else if(item.username.toLowerCase().includes(searchTerm.toLowerCase())){
                        //         console.log("hello")
                        //         console.log(item.username)
                        //         return item.username
                        //       }
                        //   })
                        console.log(userslist),
                        arr = userslist.filter(item=>{
                            if(searchTerm==""){
                                return ""
                            }
                            else if(item.username.toLowerCase().includes(searchTerm.toLowerCase())){
                                return item.username
                            }
                        }).map(users=>{
                            return(
                                <p style={{color:"black",display:"flex",lineHeight:"5px"}}>
                                    <img style={{width:"35px",height:"35px",borderRadius:"50%"}} src= {users.profilePic}></img>
                                    <span style={{paddingTop:"15px",paddingLeft:"5px"}}>{users.username}</span>
                                </p>
                            )
                        })  
                            
                        }
                    </div>
                </li>,
                <li><Link to = "/createPosts" className="list_item"><i className="material-icons">add</i></Link></li>,
                <li><Link style={{paddingTop:"15px"}} to="/profile" className="list_item" ><img style={{width:"35px",height:"35px",borderRadius:"50%"}} src= {state.profilePic}></img></Link></li>,
                <li><Link to="/home" className="list_item"><i className="material-icons right">home</i></Link></li>,
                <li><Link to="/myfollowingposts" className="list_item"><i className="material-icons right">group</i></Link></li>,
                <li><button onClick={()=>{
                    localStorage.clear();
                    dispatch({type:"CLEAR"});
                    history.push('/login')
                }} className="waves-effect waves-light btn #2196f3 blue">logout</button></li>
            ]
         }else{
               return[
                <li><Link to="/login" className="list_item">login</Link></li>,
                <li><Link to = "/register" className="list_item">Signup</Link></li>
               ]
         }
     }
    return(
        <div>
            <nav>
                <div className="nav-wrapper">
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;