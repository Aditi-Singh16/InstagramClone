const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User= mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys.js');
const requirelogin = require('../middleware/requirelogin.js');


router.post('/signup',(req,res)=>{
    const {fullname,username,password,email}=req.body
    if(!fullname || !username || !password || !email){
        return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser) {
            return res.status(422).json({error:"User already exists with this email."});
        }
        bcrypt.hash(password,10)
        .then(hashedpass=>{
            const user = new User({
                fullname,
                username,
                password:hashedpass,
                email
            })
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err);
        })
        
    })
    .catch((err)=>{
        console.log(err);
    }) 
    
    
})


router.route("/login").post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(422).json({error:"please add username and paswsword"})
    }
    User.findOne({username:username})
    .then(doc=>{
        if(!doc){
           return res.status(422).json({error:"Invalid username or password"});
        }
        bcrypt.compare(password,doc.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully Signed in"})
                const token = jwt.sign({_id:doc._id},JWT_SECRET)
                const {_id,username,email,followers,following,profilePic}=doc;
                res.json({token ,user:{_id,username,email,followers,following,profilePic}})
            }
            else{
                return res.status(422).json({error:"Invalid username or password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })

    })
})

router.route('/allusers').get((req,res)=>{
    User.find()
    .then(result=>{
        if(!result){
            return res.status(422).json({error:"Some error occurred!!"})
        }else{
            res.json(result)
        }
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router