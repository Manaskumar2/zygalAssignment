const textModel = require("../model/textModel")
const inputModel = require("../model/textModel")
const userModel = require("../model/userModel")
const validation = require("../validations/validation")


const createInput = async (req, res) => {
    const {text}= req.body
    const userId = req.decodedToken.userId
  try {
      if (!validation.isValidreqBody(req.body)) return res.status(400).send({ status: false, message: "Invalid request" })
      if (!userId) return res.status(403).send({ status: false, message: "please login first" })
      
      const createData = await inputModel.create({ text:text, userId:userId })
      res.status(200).send({ status: true, message:"successfull created" ,data:createData})
  } catch (error) {
    res.status(400).send({ status: false, error: error.message });
    }
    
}

const getText = async (req, res) => {
   const data =req.query
    
    const query = { isDeleted: false };

    try {
        userId = req.decodedToken.userId
        if(!userId) return res.status(403).send({status:false,message:"please log in first"})
     if (req.query.text) {
      query.text = { $regex: req.query.text.trim(), $options: "i" };
        }
        
        const findData = await textModel.findById(query)
        if (!findData) return res.status(400).send({ status: false, message: "data not found" })
        
        return   res.status(200).send({ status:true ,message: "success", data: findData })

    
} catch (error) {
 res.status(400).send({ status: false, error: error.message });
}

}

const deleteText = async (req, res) => { 

   const data =req.query
    
    const query = { isDeleted: false };

    try {
        userId = req.decodedToken.userId
        if(!userId) return res.status(403).send({status:false,message:"please log in first"})
     if (req.query.text) {
      query.text = { $regex: req.query.text.trim(), $options: "i" };
        }
        
        const findData = await textModel.findById(query)
        if (!findData) return res.status(400).send({ status: false, message: "data not found" })
        
        const deleteData = await textModel.findOneAndUpdate(findData._id, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, message: "deleted successfully" })
 } catch (error) {
 res.status(400).send({ status: false, error: error.message });
}

}


    module.exports = {
        createInput,
        getText,
        deleteText
}