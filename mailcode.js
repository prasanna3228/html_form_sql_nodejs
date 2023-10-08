var nm = require("nodemailer");

var tranporter = nm.createTransport({
  service: "gmail",
  auth: {
    user: "kumar950204@gmail.com",
    pass: "wtezhecsnxiconrb",
  },
});

var options = {
  from: "kumar950204@gmail.com",
  to: "prasannakumar3228@gmail.com",
  subject: "testing node emails",
  text: "HI THIS IS PRASANNA KUMAR.  ",

  // html: `<h1>Hello wellcome to html tag</h1>
  // <img alt"img" src="cid:food" width='500px'>
  // <button>click</button> `,
  // attachement: [
  //   {
  //     filename: "food.jpg",
  //     path: __dirname + "C:UsersprasaDesktop\food.jpg",
  //     cid: "food",
  //   },
  // ],
};

tranporter.sendMail(options, function (error, info) {
  if (error) {
    console.log("Error Occured", error);
  } else {
    console.log(`Email sent ${info}`);
  }
});
