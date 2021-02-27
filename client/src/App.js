import React,{useEffect,createContext,useReducer, useContext} from 'react'
import Signup from './component/Signup'
import Login from './component/Login'
import Home from './component/home'
import Profile from './component/profile'
import Userspost from './component/Userpost'
import Userprofile from './component/Userprofile'
import Myfollowing  from './component/myfollowing'
import Navbar from './component/Navbar';
import {Switch,Route,BrowserRouter as Router,useHistory} from "react-router-dom";
import './App.css';
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext();


  const Routing = ()=> {
    
    const history=useHistory();
    const {state,dispatch} =useContext(UserContext);     
    
    
    useEffect(()=>{   
      const user = JSON.parse(localStorage.getItem("user")); 
      if(user){
        dispatch({type:"USER",payload:user});   //As when user closes the application the state is also destroyed so to give acess to protected data we update the state.
        // history.push('/home');
      }else{
        history.push('/login');
      }
    },[]);

  return(
    <Switch>
        <Route exact path="/register" component={Signup}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/home" component={Home}></Route>
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/createPosts" component={Userspost}></Route>
        <Route exact path="/profile/:userid" component={Userprofile}></Route>
        <Route exact path="/myfollowingposts" component={Myfollowing}></Route>
    </Switch>
  )
}

function App() {

  const [state,dispatch] = useReducer(reducer,initialState)

  return (
    <UserContext.Provider value ={{state,dispatch}}>
      <Router>
      <Navbar/>
      <Routing/>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
