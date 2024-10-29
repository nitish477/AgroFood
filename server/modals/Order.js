import { Schema, model } from "mongoose";

const OrderSchema= new Schema({
    userId:{type:Schema.Types.ObjectId,ref:"User"},
    products:[{type:Schema.Types.ObjectId,ref:"Product"}],
    totalAmount:{type:Number},
    status:{type:String,default:"pending"},
    address:{type:String},
    paymentMethod:{type:String},
    paymentStatus:{type:String},
    createdAt:{type:Date,default:Date.now}, 
    updatedAt:{type:Date,default:Date.now}
})

const Order = model("Order",OrderSchema)

export default  Order 
