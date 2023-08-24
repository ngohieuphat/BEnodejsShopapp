const Order = require("../models/Order");


const createOrder = async (customer, data) => {
    const Items = JSON.parse(customer.metadata.cart);
  
    const products = Items.map((item) => {
      return {
        productId: item.id,
        quantity: item.cartQuantity,
      };
    });
  
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      // paymentIntentId: data.payment_intent,
      products,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      // shipping: data.customer_details,
      payment_status: data.payment_status,
    });
  
    try {
      const savedOrder = await newOrder.save();
      console.log("Processed Order:", savedOrder);
    } catch (err) {
      console.log(err);
    }
  };
  
  const endpointSecret = "whsec_OWZKpNfI9BKprwiYYcO4RikSe3aiAZTo";
  
  
  
  app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
   
  
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
         paymentIntentSucceeded = event.data.object;
        // console.log(paymentIntentSucceeded);
        break;
  
      case 'checkout.session.completed':
        const checkoutData = event.data.object;
        console.log("Session Completed");
        stripe.customers
          .retrieve(checkoutData.customer)
          .then(async (customer) => {
            try {
              const data = JSON.parse(customer.metadata.cart);
               
              const products = data.map((item) => {
                return {
                  productId: item.id,
                  quantity: item.cartQuantity,
                };
              });
  
              console.log(products[0].supplier);
              
              const newOrder = new Order({
                userId: customer.metadata.userId,
                customerId: checkoutData.customer,
                productId: products[0].productId,
                quantity: products[0].quantity,
                subtotal: checkoutData.amount_subtotal/100,
                total: checkoutData.amount_total/100,
                payment_status: checkoutData.payment_status,
              });
  
              try {
                await newOrder.save();
                console.log("Order processed");
              } catch (err) {
                console.log(err);
              }
            } catch (err) {
              console.log(err);
            }
          })
          .catch((err) => console.log(err.message));
        break;
  
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
  