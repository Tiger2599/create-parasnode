const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
	process.env.MAILCHIMP_KEY
);
const { errSend } = require('../Middleware/sendErrMsg')

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