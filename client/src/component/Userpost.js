import React,{ useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'


function Userspost(){

    const history = useHistory()

    const [title,settitle] = useState("");
    const [body,setbody] = useState("");
    const [image,setimage] = useState("");
    const [url,seturl]=useState("")
    //this useeffect kicks in when setstate updates the url
    //btw useeffect kicks in every time we update a state so we will put an if condition too
    useEffect(()=>{
        if(url){
        fetch("http://localhost:5000/createPosts",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            
            if(data.error) {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }else {
                M.toast({html: "Posted successfully",classes:"#43a047 green darken-1"})
                history.push('/home')
            }
        })
        .catch(err=>{
            console.log(err);
        })
      }
    },[url])

     const postimg=() =>{
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
            seturl(data.url)
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    return(
        <div>
            {url}
            <div className="card" style={{position:"absolute",left:"35%",top:"10%",padding:"30px"}}>
                <input type="text" placeholder="title" value={title} onChange={(e)=>settitle(e.target.value)}></input>
                <input type="text" placeholder="body" value={body} onChange={(e)=>setbody(e.target.value)}></input>
                <div className="file-field input-field">
                    <div className="btn blue darken-1">
                        <span>Post something</span>
                        <input type="file" onChange={(e)=>setimage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                    <div>
                    <button className="btn waves-effect waves-light blue darken-1" type="submit" name="action" onClick={()=>postimg()}>Post
                        <i className="material-icons right">send</i>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Userspost