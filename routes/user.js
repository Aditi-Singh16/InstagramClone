const express =require("express");
const router =express.Router();
const mongoose = require("mongoose");
const Post= mongoose.model("Post")
const requirelogin = require('../middleware/requirelogin')
const User = mongoose.model("User")


router.get('/user/:id',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        // return res.json(user)
       Post.find({postedby:req.params.id})
       .populate("postedby","_id username")
       .exec((err,posts)=>{
           if(err){
               return res.status(422).json({error:err})
           }
           res.json({user,posts})
       })
    })
    .catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.put('/stalk',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.stalkedAcc,{
        $push:{stalkers:req.user.username}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(result)
    })
})

router.put('/follow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    })
})



router.put('/unfollow',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}         
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

router.get('/loggeduser',requirelogin,(req,res)=>{
    User.findOne({_id:req.user._id})
    .then(result=>{
        res.json(result)
    })
    
})

router.put('/updatepic',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{profilePic:req.body.profilePic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json(result)
    })
})

module.exports = router
