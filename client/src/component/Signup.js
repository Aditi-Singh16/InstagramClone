import React,{ useState} from 'react';
import {useHistory,Link} from 'react-router-dom'
import logo from './instalogo.PNG';
import M from 'materialize-css';


function Signup(){
    const history= useHistory();
     
    const [fullname,setfullname]=useState("");
    const [username,setusername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    // const [confirm,setconfirmpassword]=useState("");

    // const [input,setInput]=useState({
    //     fullname:'',
    //     username:'',
    //     password:'',
    //     email:'',
    // });
    // const handleChange = (event)=>{
    //     const {name,value}=event.target;
    //     setInput(prevInput=>{
    //         return{
    //             ...prevInput,
    //             [name]:value
    //         }
    //     })
    // }
    const register=(event)=>{
        event.preventDefault();
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                fullname,
                username,
                password,
                email,
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error) {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }else {
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
        .catch(err=>{
            console.log(err);
        })

    }
    
    const mystyle={
        padding:"20px",
        width: "350px",
        height: "450px",
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
            <div>
            <div  className="container">
                <form style={mystyle}>
                    <img src={logo} alt="instagram"></img>
                    <div className="form-group">
                        <input placeholder="enter Fullname"  value={fullname} onChange={(e)=>{setfullname(e.target.value);}} ></input>
                    </div>
                    <div className="form-group">
                        <input placeholder="enter username" value={username} onChange={(e)=>{setusername(e.target.value);}}  ></input>
                    </div>
                    <div className="form-group">
                        <input placeholder="enter password" type="password" value={password} onChange={(e)=>{setPassword(e.target.value);}} ></input>
                    </div>
                    <div className="form-group">
                        <input placeholder="enter email" value={email} onChange={(e)=>{setEmail(e.target.value);}} ></input>
                    </div>
                    <button style={btn} onClick={register} className="btn #2196f3 blue">Sign up</button>
                </form>
                <div style={container2}>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Signup