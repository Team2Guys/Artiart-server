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



const sendEmailHandler = async (name, email, phone, Address, orderId, productDetails, subject) => {
    console.log("name",name, phone)

    const mailOptions = {
        from: 'info@artiart.ae',
        to: `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2}`,
        // to: `faadsardar123@gmail.com`,
        subject: subject ? subject : `Abandoned Checkouts.`,
        text: `Customer Name: ${name}\nCustomer Email: ${email}\nMessage: You have recieved a Order\n Customer Phone Number:  ${phone}\n Customer Address: ${Address}\norderId: ${orderId}\n${productDetails}`,
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
