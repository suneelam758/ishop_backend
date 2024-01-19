const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
//send email 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'betushyam01@gmail.com', // Replace with company sendin email
      pass: 'ozdmptbpqsexornk', // Replace with password
    },
  });
router.post("/ishop/support", (req, res) => {

    const mailOptions = {
        from: req.body.from,
        to:'suneelam369@gmail.com', //company support email
        subject:req.body.subject,
        text:`Email from ${req.body.from} - ${req.body.text}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});


module.exports = router;