import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from "./configs/cloudinary.js";

// import clerkWebhooks from './controllers/webhooks.js'
// import educatorRouter from './route/educatorRoute.js'
// import { clerkMiddleware } from '@clerk/express'
// import connectCloudinary from './configs/cloudinary.js'
// import courseRouter from './route/courseRoute.js'
// import userRouter from './route/userRoutes.js'
// import stripeWebhooks from './controllers/stripeWebhooks.js'







const app=express()

await connectDB()
await connectCloudinary()

app.use(cors())

// app.use(clerkMiddleware())
// app.use('/api/educator',express.json(),educatorRouter)

// // route

app.get('/',(req,res)=>res.send("API IS WORKING"))

// app.post('/clerk',express.json(),clerkWebhooks)

// app.use('/api/educator',express.json(),educatorRouter)

// app.use('/api/course',express.json(),courseRouter)

// app.use('/api/user',express.json(),userRouter)

// app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

// port

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

