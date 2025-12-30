
import mongoose from "mongoose";
import course from '../models/course.js'
import { clerkWebhooks} from '../controllers/webhooks.js'

const purchaseSchema=new mongoose.Schema({
    courseId:{type:mongoose.Schema.Types.ObjectId,ref:'Course',required:true},

       userId:{
        type:String,
        ref:'User',
        required:true
       },
       amount :{type:Number,required:true},
       status:{type:String,enum:['pending','completed','failed'],default:'pending'},

},{timestamps:true});

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;

