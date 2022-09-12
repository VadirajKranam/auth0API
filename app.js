if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config()
}
const express=require('express')
const app=express()
const ejsMate=require('ejs-mate')
const path=require('path')
const {default: axios}=require('axios')
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded())
app.get('/',(req,res)=>{
   res.render('home')
})
let code,access_token;
app.get('/callback',async(req,res)=>{
  var options = {
    method: 'POST',
    url: 'https://dev-plg3ryv3.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id:process.env.client_id,
      client_secret: process.env.client_secret,
      audience:'https://dev-plg3ryv3.us.auth0.com/api/v2/'
    })
  };
console.log(options)
const response=await axios.request('https://dev-plg3ryv3.us.auth0.com/oauth/token',options)
access_token=response.data.access_token
 console.log(access_token)
    res.render('options')
})
app.get('/users',async(req,res)=>{
   let options={
    method:'GET',
   headers: {
        authorization:'Bearer '+access_token,
        'Content-type':'application/json'
              }
   }
   console.log(options)
   const response=await axios.request('https://dev-plg3ryv3.us.auth0.com/api/v2/users',options)
   console.log(response.data) 
   res.render('options')
})
app.get('/apps',async(req,res)=>{
    let options={
        method:'GET',
        headers: {
            'Authorization':'Bearer '+access_token
            },
       }
       const response=await axios.request('https://dev-plg3ryv3.us.auth0.com/api/v2/clients',options)
       console.log(response.data)
       res.render('options')
})
app.listen(8080,()=>{
    console.log('Listening to port 8080')
})
