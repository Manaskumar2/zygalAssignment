const User = require("../model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const validation = require("../validations/validation")

 const signUp = async (req, res) => {
     try {
         let data = req.body;

         let { name, email, password } = data

         if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "provide all required fields" })

         if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "please enter a valid name" })
         data.name = name

         if (!validation.isValid(email)) return res.status(400).send({ status: false, message: `E-mail is Required` })
         let uniqueEmail = await User.findOne({ email: email })
         if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: `This E-mail is Invalid` })
         if (uniqueEmail) return res.status(400).send({ status: false, message: `This E-mail has already registered Please Sign In`, })
         data.email = email.toLowerCase()

         if (!validation.isValidPwd(password)) return res.status(400).send({ status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters", })

    

         const hashedPassword = await bcrypt.hash(password, 10)
         data.password = hashedPassword


         const createUser = await User.create(data)
    
            res.status(201).json({ status: true, message: "user create sucessfully",data:createUser })
        } catch (error) {
            res.status(500).send({ status: false, message: error.message })
        }
    }

    const signIn = async (req, res) => {
    try {
      
        let data = req.body
        let { email, password } = data
    
        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all  details to login" })
    
        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        email = email.toLowerCase()
    
        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })
    
        let findUser = await User.findOne({ email: email })
        if (!findUser) return res.status(400).send({ status: false, message: "The email-id is wrong" })
        if (!findUser.password) return res.status(403).send({ status: false, message: "Please logIn through google auth or set your password to logIn" })
    
        let bcryptPass = await bcrypt.compare(password, findUser.password)
        if (!bcryptPass) return res.status(400).send({ status: false, message: "Password incorrect" })
    
    
        let token = jwt.sign({ email: findUser.email, userId: findUser._id }, process.env.JWT_TOKEN, { expiresIn: '365d' });
    
        const response = {
            name: findUser.name,
            email: findUser.email,
            _id: findUser._id,
            authToken:token
        }
        res.status(200).send({ status: true, message: "User login successfully", data: response })
        
    }catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: error.message })
    }
}



    module.exports = {
        signIn,
        signUp,
}