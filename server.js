const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PWD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        text: text,
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
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Email is invalid'),
];

app.post('/referrals', referralValidationRules, async (req, res) => { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, referredBy } = req.body;

    try {
        // Check if a referral with the given email already exists
        const existingReferral = await prisma.referral.findUnique({
            where: {
                email: email,
            },
        });

        if (existingReferral) {
            return res.status(400).json({ error: "A referral with this email already exists." });
        }

        const newReferral = await prisma.referral.create({
            data: {
                name,
                email,
                referredBy: referredBy || null, 
            },
        });

        await sendEmail(email, "Referral Submission Successful", "Thank you for submitting your referral.");

        res.json(newReferral);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

