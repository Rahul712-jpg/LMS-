import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'

import { clerkMiddleware } from '@clerk/express'

import educatorRouter from './route/educatorRoute.js'
import courseRouter from './route/courseRoute.js'
import userRouter from './route/userRoutes.js'

import {clerkWebhooks,stripeWebhooks} from './controllers/webhooks.js'
const app = express()

await connectDB()
await connectCloudinary()

app.use(cors())
app.use(clerkMiddleware())

// test route
app.get('/', (req, res) => res.send("API IS WORKING"))

// routes
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/courses', express.json(), courseRouter)   // ✅ FIXED
app.use('/api/user', express.json(), userRouter)


app.post('/clerk', express.json(), clerkWebhooks)
app.post('/stripe', express.json(), stripeWebhooks)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})

