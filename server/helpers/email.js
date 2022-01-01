'use strict';

const config = require('../environments/index');
const nodemailer = require('nodemailer');
const logger = require("./logger").logger;
const helpers = require("./validations");

let transporter = nodemailer.createTransport({
    // host: config.EMAIL_CONFIG.host,
    // port: config.EMAIL_CONFIG.port,
    // secure: config.EMAIL_CONFIG.secure,
    // auth: {
    //     user: config.EMAIL_CONFIG.username,
    //     pass: config.EMAIL_CONFIG.password
    // }
    service: "gmail",
    auth: {
        user: "unixtest1432@gmail.com",
        pass: 'Unix1432'
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
        logger.error(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const sendEmail = async (mailOptions) => {

    try {

        mailOptions.from = config.EMAIL_CONFIG.email;

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error(error);
            } else {
                logger.info('Email sent: ' + info.response);
                return true;
            }
        });
    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    signupEmail: async (data) => {
        let linkData = {
            "email": data.email,
            "token": data.signup_token
        }
        let encryptedData = await helpers.encryptLinkData(linkData);
        let requestURL = `${config.END_POINT}/user/confirm_email?data=${encryptedData}&&name=${data.first_name} ${data.last_name}`;
        // const htmlBodyDB = await getHTMLContent(Const.templatename.TWO_FACTOR_VERIFICATION.KEY, data);
        // var htmlBodyDB = await getHTMLContentFromFile(Const.templatename.ACCOUNT_ACTIVATION.KEY, data.language)

        // data = await getDynamicVaribleFromDB(data);
        // data.action_url = requestURL;
        // htmlBodyDB = await replaceVariables(htmlBodyDB, data)

        var mailOptions = {
            to: data.email,
            subject: "Account Activation - Petrolpump",
            html: `<a href=${requestURL}>Click here to confirm email.</a>`
        };

        try {
            await sendEmail(mailOptions);
            return true;

        } catch (e) {
            throw e
        }

    },

    forgorPasswordEmail: async (data) => {
        let linkData = {
            "email": data.email,
            "token": data.signup_token
        }
        let encryptedData = await helpers.encryptLinkData(linkData);

        let requestURL = `${config.END_POINT}/forgotpassword/${encryptedData}`;

        var mailOptions = {
            to: data.email,
            subject: "Rest Password - Ecommerce",
            html: `<a href=${requestURL}>Click here to generate new password.</a>`
        };

        try {
            await sendEmail(mailOptions);
            return true;

        } catch (e) {
            throw e
        }

    },

    otpTokenEmail: async (data) => {

        // var template = await getHTMLContentFromFile(Const.templatename.TWO_FACTOR_VERIFICATION.KEY, data.language);
        // data = await getDynamicVaribleFromDB(data);
        // template.body = await replaceVariables(template.body, data)
        let link = `http://localhost:3000/verifyemail/${data.session_token}`
        var mailOptions = {
            to: data.email,
            subject: "OTP Verification",
            html: `<a href=${link}>Click here to generate new password.</a>
            <p> OTP is: ${data.otp}</p>`
        };

        try {
            await sendEmail(mailOptions);
            return true;

        } catch (e) {
            throw e
        }
    },

    registrationSuccess: async (data) => {

        // var template = await getHTMLContentFromFile(Const.templatename.TWO_FACTOR_VERIFICATION.KEY, data.language);
        // data = await getDynamicVaribleFromDB(data);
        // template.body = await replaceVariables(template.body, data)

        var mailOptions = {
            to: data.email,
            subject: "Registration Succefull",
            html: `<p> Thank You For registration</p>`
        };

        try {
            await sendEmail(mailOptions);
            return true;

        } catch (e) {
            throw e
        }
    }

};
