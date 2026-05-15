
//im doing https://shopee.sg order processing.


// 1) you can list orders by users
//2) get order by id
//3) calculate the total order 
//4) update order status
//5) cancel order
//6) place order

module.exports = {

    orders: [
        {
            orderId: "SPO-1001",
            userId: "u01",
            items: [{ name: "wireless headphones", qty: 1, price: 45.90 },
                    { name: "phoneCase", qty: 2, price: 8.50 }],
            status: "Delivered",
            shippingFee: 1.99,
            voucher: null
        },
        {
            orderId: "SPO-1002",
            userId: "u02",
            items: [{ name: "mechanical keyboard", qty: 1, price: 129.00 }],
            status: "Shipped",
            shippingFee: 0,
            voucher: "SAVE10"
        },
        {
            orderId: "SPO-1003",
            userId: "u01",
            items: [{ name: "USB-C hub", qty: 1, price: 35.00 },
                    { name: "laptop stand", qty: 1, price: 22.00 }],
            status: "Pending",
            shippingFee: 1.50,
            voucher: null
        }
    ],

    vouchers: { "SAVE10": 10.00, "NEWUSER": 5.00 },

    validTransitions: {
        "Pending":    ["Processing", "Cancelled"],
        "Processing": ["Shipped", "Cancelled"],
        "Shipped":    ["Delivered"],
        "Delivered":  [],
        "Cancelled":  []
    },



    //places a new order and saves it to the orders array
    placeOrder(userId, items, voucher = null, shippingFee = 1.99) {
        if (!userId || !items || items.length === 0) {
            return { error: "userId and at least one item are required." };
        }
        const newOrder = {
            orderId: "SPO-" + (1000 + this.orders.length + 1),
            userId, items,
            status: "Pending",
            shippingFee,
            voucher
        };
        this.orders.push(newOrder);
        return newOrder;
    },

    // retrieves a single order by its orderID
    getOrderById(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        return order || { error: `Order ${orderId} not found.` };
    },

    //updates order status, only allows valid transitions
    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return { error: `Order ${orderId} not found.` };
        const allowed = this.validTransitions[order.status];
        if (!allowed.includes(newStatus)) {
            return { error: `Cannot move from "${order.status}" to "${newStatus}".`, allowedTransitions: allowed };
        }
        order.status = newStatus;
        return order;
    },

    //cancels an order if it is still Pending or Processing
    cancelOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return { error: `Order ${orderId} not found.` };
        const allowed = this.validTransitions[order.status];
        if (!allowed.includes("Cancelled")) {
            return { error: `Order ${orderId} cannot be cancelled at status "${order.status}".` };
        }
        order.status = "Cancelled";
        return order;
    },

    //calculates subtotal, shipping fee, voucher discount, and final total
    calculateOrderTotal(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return { error: `Order ${orderId} not found.` };
        const subtotal = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
        const discount = order.voucher ? (this.vouchers[order.voucher] || 0) : 0;
        const total = Math.max(0, subtotal + order.shippingFee - discount);
        return {
            orderId: order.orderId,
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingFee: order.shippingFee,
            voucher: order.voucher,
            discount: parseFloat(discount.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    },

    //returns all orders belonging to a specific user
    listOrdersByUser(userId) {
        const userOrders = this.orders.filter(o => o.userId === userId);
        return userOrders.length > 0 ? userOrders : { message: `No orders found for user ${userId}.` };
    }

}