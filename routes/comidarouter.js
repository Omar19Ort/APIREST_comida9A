const express = require('express')
const router = express.Router()

router.get('/comida', (req,res)=>{
    return res.json({ message: 'Ruta comida protegida', user: req.user })
})

module.exports=router