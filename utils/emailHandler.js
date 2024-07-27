

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.blindsandcurtains.ae',
    port: 587,
    secure: false,
    auth: {
        user: `${process.env.ADMIN_MAIL}`,
        pass: `${process.env.ADMIN_PASSWORD}`,
    },
});

const sendEmailHandler = async (name, email, phone, address, State, TotalProductsPrice, productDetails, shippment_Fee, subject, CustomerEmail) => {
    console.log("name", name, phone);

    const mailOptions = {
        from: 'info@artiart.ae',
        // to: CustomerEmail ? CustomerEmail : `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2}`,
        to:'faadsardar123@gmail.com',
        subject: subject ? subject : 'Order Confirmation',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Received</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        max-width: 100px;
                    }
                    .content {
                        text-align: left;
                    }
                    .content h2 {
                        color: #333;
                        text-align: center;
                    }
                    .order-summary {
                        width: 100%;
                        margin-top: 20px;
                        border-collapse: collapse;
                    }
                    .customer-info {
                        width: 35%;
                        margin-top: 20px;
                        border-collapse: collapse;
                        margin-left: auto;
                        margin-right:auto
                    }
                    .order-summary th, .order-summary td, .customer-info th, .customer-info td {
                        padding: 10px;
                        text-align: left;
                    }
                    .order-summary th {
                        background-color: #f4f4f4;
                    }
                    .order-summary {
                        border-spacing: 1px;
                    }
                    .customer-info {
                       display:flex !important;
  align-items:center !important;
  justify-content:center !important;
                    }
                    .customer-info th, .customer-info td {
                        border: none;
                        display: table-cell;
                    }
                    .total_Amount {
                        padding: 10px 0 !important;
                        border-top: 1px solid #E4E4E4;
                        border-bottom: 1px solid #E4E4E4;
                    }
                    .social-icons {
                     display: flex;
    margin: 20px auto;
    width: 18%;

                        margin-top: 20px;
                        text-align:center
                    }
                    .social-icons a {
                        width: 40px;
                        height: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #fff;
                     
                        text-decoration: none;
                    }
             
                    .social-icons a i {
                        font-size: 18px;
                        color: #333;
                    }
 .msg-434132501558709343 .m_-434132501558709343social-icons {
   display:flex !important;
  align-items:center !important;
  justify-content:center !important;
}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1722077160/logo_espleq_Thumbnail_m0oaap.jpg" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">
                    </div>
                    <div class="content">
                        <h2>Order has been confirmed Successfully</h2>
                        <p>Dear ${name},</p>
                        <p>Thank you for your order!  Your new Artiart bottle is en route to keep you hydrated and happy. 🌸</p>
                        
                        <h2>Order Summary</h2>
                        <table class="order-summary">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th >Product</th>
                                    <th>Color</th>
                                    <th>Qty</th>
                                    <th>Product Price</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productDetails.map((product, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td><div style="display:flex; gap:10px;align-items:center; justify-content:center; width: 200px"><p> <img src="${product.posterImageUrl.imageUrl}" alt="${product.name}" style="height:40px; width:40px;"></p>  <p>${product.name}</p></div></td>
                                        <td><span style="background-color: #${product.color}; display: inline-block; width: 20px; height: 20px; border-radius: 50%;"></span></td>
                                        <td>${product.Count}</td>
                                        <td>${product.Product_price}</td>
                                        <td>${product.totalPrice}</td>
                                    </tr>
                                `).join('')}

                                ${shippment_Fee ? ` <tr class="total_Amount">
                                       <td colspan="5" style="text-align:left;">Shipment Fee</td>
                                       <td>${shippment_Fee}</td>
                                   </tr>
                                   ` : null
            }
                                <tr class="total_Amount">
                                    <td colspan="5" style="text-align:left;">TOTAL</td>
                                    <td>${TotalProductsPrice}</td>
                                </tr>

                                <tr class="total_Amount">
                                    <td colspan="5" style="text-align:left;">Grand TOTAL</td>
                                    <td>${shippment_Fee == "Free" || !shippment_Fee ? TotalProductsPrice : Number(shippment_Fee) + TotalProductsPrice}</td>
                                </tr>



                            </tbody>
                        </table>
            
                        <h3 style="text-align:center;">Customer Information</h3>
                        <div style="display:flex; justify-content: center; border: 1px solid #D9D9D9; border-radius:6px">
                            <table class="customer-info" style="display:flex;align-items:center;justify-content:center; ">
                                <tr>
                                    <th>Name:</th>
                                    <td>${name}</td>
                                </tr>
                                <tr>
                                    <th>Email:</th>
                                    <td>${email}</td>
                                </tr>
                                <tr>
                                    <th>Phone:</th>
                                    <td>${phone}</td>
                                </tr>
                                <tr>
                                    <th>Address:</th>
                                    <td>${address}, ${State} </td>
                                </tr>
                            </table>
                        </div>
                    </div>
            
                    <div class="social-icons" style="display: flex; align-items: center; justify-content: center;">
                        <a href="https://www.facebook.com/artiartuae" target="_blank">
                        <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1721311526/icons8-facebook-48_fffcxm.png" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">

                        </a>
                        <a href="https://www.instagram.com/artiartuae/" target="_blank">
                  
                        <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1721311399/icons8-instagram-48_o3tmpt.png" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">


                    </div>

                  
        
                    <div style="text-align: center; margin-top: 20px;">
                        <p>We Will Notify You Once Your Order Is Shipped. If You Have Any Questions, Feel Free To Contact Us At <a href="mailto:cs@artiart.ae. style="text-decoration:none;">cs@artiart.ae.</a> </p>
                    </div>




                      <div>
                
                    <p>Cheers to happy sips,</p>
                    <p>The Artiart Team</p>
                    </div>

                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1722077160/logo_espleq_Thumbnail_m0oaap.jpg" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">
                    </div>
                </div>


            </body>
            </html>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
        }
    });
};

module.exports = {
    sendEmailHandler
};
