export async function POST(req){

try{

const { email } = await req.json()

const res = await fetch("https://api.brevo.com/v3/smtp/email",{

method:"POST",

headers:{
"accept":"application/json",
"api-key":process.env.BREVO_API_KEY,
"content-type":"application/json"
},

body:JSON.stringify({

sender:{
name:"Guruji Shrawan",
email:"yourgmail@gmail.com"
},

to:[
{ email }
],

subject:"Welcome to Guruji Shrawan",

htmlContent:`
<h2>Welcome 🙏</h2>

<p>Thank you for subscribing to Guruji Shrawan.</p>

<p>You will now receive weekly wisdom and insights.</p>
`

})

})

const data = await res.json()

return Response.json(data)

}catch(error){

console.error(error)

return Response.json({error:error.message})

}

}