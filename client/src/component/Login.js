import React,{ useState,useContext } from 'react';
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../App'
import logo from './instalogo.PNG';
// import axios from 'axios';
// import { Link, Route } from 'react-router-dom';
import M from 'materialize-css';


function Login(){

    const {state,dispatch}= useContext(UserContext);
    const history = useHistory();
    const [username,setusername]=useState("");
    const [password,setPassword]=useState("");

    const signin=(event)=>{
        event.preventDefault();
        fetch("http://localhost:5000/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password,
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data);
            if(data.error) {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }else {
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                M.toast({html: "Signin Successfully",classes:"#43a047 green darken-1"})
                history.push('/home')
            }
        })
        // .catch(err=>{
        //     console.log(err);
        // })

    }

    const mystyle={
        padding:"20px",
        width: "350px",
        height: "400px",
        border: "1px solid #acacac",
        textAlign:"center",
        margin:"20px auto"
    }
    const btn={
        width:"300px"
    }
    const container2={
        width: "350px",
        height: "80px",
        border: "1px solid #acacac",
        textAlign:"center",
        padding:"25px",
        margin:"20px auto"
    }
    return(
        <div>
            <div className="container">
                <form style={mystyle}>
                    <img src={logo} alt="instagram" ></img>
                    <div className="form-group">
                        <input placeholder="enter username"value={username} onChange={(e)=>{setusername(e.target.value);}}  className="form-control "></input>
                    </div>
                    <div className="form-group">
                        <input placeholder="enter password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value);}}   className="form-control "></input>
                    </div>
                    <button style={btn} onClick={signin}  className="btn #2196f3 blue">Login</button>
                </form>
                <div style={container2}>
                    <p>Dont have an accout <Link to='/Signup'>Sign up</Link></p>
                </div>
             </div>
        </div> 
        
        
    )
}

export default Login;