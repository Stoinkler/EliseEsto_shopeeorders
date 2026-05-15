console.log("====================================");
console.log(" Shopee Order Processing");
console.log("====================================");
const shopeeOrders = require("./EliseEsto_shopeeorders.js");





//1
//list all orders for user u01
console.log("\n--- List orders for user u01 ---");
console.log(shopeeOrders.listOrdersByUser("u01"));




//2
//see a specific order
console.log("\n--- Get order SPO-1003 ---");
console.log(shopeeOrders.getOrderById("SPO-1003"));






//3
//calculate total for order with voucher
console.log("\n--- Calculate total for SPO-1002 (has SAVE10 voucher) ---");
console.log(shopeeOrders.calculateOrderTotal("SPO-1002"));




//4
//update order status
console.log("\n--- Update SPO-1003 from Pending to Processing ---");
console.log(shopeeOrders.updateOrderStatus("SPO-1003", "Processing"));
//if you try this it wont work cuz the order is still in pending
console.log("\n--- Try invalid transition: Processing to Delivered ---");
console.log(shopeeOrders.updateOrderStatus("SPO-1003", "Delivered"));






//5
//cancel an order
console.log("\n--- Cancel SPO-1003 ---");
console.log(shopeeOrders.cancelOrder("SPO-1003"));
// try cancelling a delivered order (should fail)
console.log("\n--- Try cancelling SPO-1001 (already Delivered) ---");
console.log(shopeeOrders.cancelOrder("SPO-1001"));








//6
// place a new order
console.log("\n--- Place a new order for u03 ---");
const newItems = [{ name: "Gaming Mouse", qty: 1, price: 55.00 }];
console.log(shopeeOrders.placeOrder("u03", newItems, "NEWUSER"));

console.log("\n====================================");