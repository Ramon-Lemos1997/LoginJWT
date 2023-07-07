const User= require('../models/User')
const bcrypt= require('bcryptjs') //module criptografia
const jwt= require('jsonwebtoken')  //module para criação de token único servidor
const {loginValidate, registerValidate}= require('./validate')


const userController={    
    register:async function(req,res){
      const { error } = registerValidate(req.body);   //estou passando {err} pois é como eu pegar direto o objeto pelo formato que passei
      if (error) {
        return res.status(400).send(error.message);
      }
      
        const selectUser= await User.findOne({email:req.body.email})
        if(selectUser) return res.status(400).send('Email já em uso')
        const user= new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })
        try{
            const saveUser= await user.save()
            res.send(saveUser)
        }catch(error){
            res.status(400).send(error)
        }
    },  
                                                                                                              
    login: async function(req, res) {
      const { error } = loginValidate(req.body);
      if (error) {
        return res.status(400).send(error.message);
      }
        const selectUser = await User.findOne({ email: req.body.email });
        if (!selectUser) return res.status(400).send('Email ou senha incorretos');
      
        const passwordAndUserMatch = bcrypt.compareSync(
          req.body.password,
          selectUser.password
        );
        if (!passwordAndUserMatch)
          return res.status(400).send('Email ou senha incorretos');
      
        const token = jwt.sign({_id: selectUser._id, admin: selectUser.admin}, process.env.TOKEN_SECRET);
        res.header('authorization-token', token);
        res.send(token);
      },
      
      logout: async function(req, res) {
        const selectUser = await User.findOne({ token: req.body._id });
        if (!selectUser) {
          return res.status(400).send('Usuário não encontrado');
        }
        selectUser.token = null; 
        await selectUser.save();
      
        return res.send('Logout successful');
      }
      

}


module.exports = userController;
