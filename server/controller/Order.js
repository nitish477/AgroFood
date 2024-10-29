import Order from "./../modals/Order.js";
import { asyncHandler } from "./../util/asyncHandler.js";
import { ApiResponse } from "./../util/Apiresponce.js";
import { ApiError } from "./../util/apiErr.js";
import Cart from "./../modals/Cart.modal.js";


const CreateOrder = asyncHandler(async (req, res, next) => {
    const { userid } = req.params;
    const { address ,product} = req.body;

    const cart = await Cart.findOne({ user: userid });
    if (!cart) {
        return next(new ApiError(404, "User not found"));
    }
    const products = cart.items;
  let total =0
  products.forEach((product) =>{
      product.totalPrice
      total += product.totalPrice
  })
 const neworder = new Order({
    userId: cart.user,
    address,
    products:product,   
    totalAmount:total,
    status: "pending",
 })

  neworder.save()
    

    res.status(200).json(new ApiResponse(200, neworder, "Fetch Successfully"));
});

const getOrderByid= asyncHandler(async(req,res)=>{
  const {userid}=req.params
  const order = await Order.find({userId:userid}).populate("userId products" ,"-password -roles")
  if(order.length===0){
    return new ApiResponse(200,"Order not found")
  }
  res.status(200).json(new ApiResponse(200,order,"Fetch Successfully"))
})

export { CreateOrder,getOrderByid };
