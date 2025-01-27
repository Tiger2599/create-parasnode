const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
	process.env.MAILCHIMP_KEY
);
const { errSend } = require('../Middleware/sendErrMsg')

// const run = async () => {
// 	// const response = await mailchimpClient.allowlists.add({
// 	// 	email: "emmanuel@omnestechnology.com",
// 	// });
// 	// const response = await mailchimpClient.allowlists.list();
// 	const response = await mailchimpClient.messages.send({
// 		message: {
// 			from_email: "emmanuel@omnestechnology.com",
// 			to: [{ email: "babytiger2599@gmail.com", type: "to"}],
// 			subject: "Test Email",
// 			text: "Hello, this is a test email sent via Mailchimp Transactional!", 
// 			html: "<p>Hello, this is a <strong>test email</strong> sent via Mailchimp Transactional!</p>", 
// 		},
// 	});
// 	// const response = await mailchimpClient.senders.list();
// 	// const response = await mailchimpClient.rejects.list();
// 	// const response = await mailchimpClient.rejects.delete({
// 	// 	email: "babytiger2599@example.com",
// 	// });
// 	// const response = await mailchimpClient.whitelists.list();
// 	// const response = await mailchimpClient.exports.whitelist();
// 	// const response = await mailchimpClient.users.ping();
// 	// const response = await mailchimpClient.messages.send({message:{
// 	// 	from_email: "hello@example.com",
// 	// 	subject: "Hello world",
// 	// 	text: "Welcome to Mailchimp Transactional!",
// 	// 	to: [
// 	// 	  {
// 	// 		email: "freddie@example.com",
// 	// 		type: "to"
// 	// 	  }
// 	// 	]
// 	//   }});
// 	console.log(response);
// };

// run();

// var nodemailer = require("nodemailer");

// var transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     ignoreTLS: false,
//     auth: {
// 		user: process.env.SMTP_SENDERMAIL,
// 		pass: process.env.SMTP_APPPASSWORD,
// 	},
// });

// exports.sendemail = (email, subject, html) => {
//     var mailOptions = {
//         from: process.env.SMTP_SENDERMAIL,
//         to: email,
//         subject: subject,
//         html: html,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log("Email sent: " + info.response);
//         }
//     });
// };

exports.sendEmail = async (email, subject, html) => {
    try{
        const response = await mailchimpClient.messages.send({
            message: {
                from_email:  process.env.MAILCHIMP_SENDERMAIL,
                to: [{ email: email, type: "to"}],
                subject: subject,
                html,
                text: "This is a short preview text for the email."
            },
        });
        console.log("🚀 ~ exports.sendemail= ~ response:", response)
    
        if(response?.[0].status != 'sent'){
            await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- sendMail \nmethod :- sendemail \nuser :- '${email}' \nmsg :- ${respons}`)
            return {status: "Fail",msg: "An error occurred while sending the email. Please try again later."}
        }
        return {
            status: "Success",
            msg: ""
        }
    }catch(error){
        await errSend(`project :- ${process.env.ADMIN_SITEURL} \npage :- sendMail \nmethod :- sendemail \nuser :- '${email}' \nmsg :- ${error.message}`)
        return {status: "Fail",msg: "An error occurred while sending the email. Please try again later."}
    }
};