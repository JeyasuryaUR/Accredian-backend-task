const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const cors = require('cors'); // Require CORS


const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function sendEmail(to, subject, referrerName, referrerEmail, refereeName, refereeEmail, referralDate) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PWD,
        },
    });

    let emailHtml = `
        <h1>Referral Submission Successful</h1>
        <p>Thank you for submitting your referral.</p>
        <p><strong>Referrer Details:</strong></p>
        <p>Name: ${referrerName}</p>
        <p>Email: ${referrerEmail}</p>
        <p><strong>Referee Details:</strong></p>
        <p>Name: ${refereeName}</p>
        <p>Email: ${refereeEmail}</p>
        <p>Referral Date: ${referralDate}</p>
    `;

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: emailHtml,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const referralValidationRules = [
    check('referrerName').not().isEmpty().withMessage('Referrer name is required'),
    check('referrerEmail').isEmail().withMessage('Referrer email is invalid'),
    check('refereeName').not().isEmpty().withMessage('Referee name is required'),
    check('refereeEmail').isEmail().withMessage('Referee email is invalid'),
];

app.post('/referrals', referralValidationRules, async (req, res) => { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { referrerName, referrerEmail, message, refereeName, refereeEmail } = req.body;

    try {
        const newReferral = await prisma.referral.create({
            data: {
                referrerName,
                referrerEmail,
                message: message || null,
                refereeName,
                refereeEmail,
            },
        });

        await sendEmail(refereeEmail, "Referral Submission Successful", referrerName, referrerEmail, refereeName, refereeEmail, new Date().toISOString());

        res.json(newReferral);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});