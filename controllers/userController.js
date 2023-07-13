const User= require('../models/User')
const bcrypt= require('bcryptjs') //module criptografia
const jwt= require('jsonwebtoken')  //module para criação de token único servidor
const {loginValidate, registerValidate}= require('./validate')

let storage= []
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
      if (!selectUser) {
        return res.status(400).send('Email ou senha incorretos');
      }
    
      const passwordAndUserMatch = bcrypt.compareSync(
        req.body.password,
        selectUser.password
      );
      if (!passwordAndUserMatch) {
        return res.status(400).send('Email ou senha incorretos');
      }
    
      const token = jwt.sign({ _id: selectUser._id, email: selectUser.email }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
      console.log(token)
      res.send(token)
      
    },
    
      
    logout: async function(req, res) {
      const cookieValue = req.body.cookieValue;
      console.log(cookieValue);
      if(cookieValue){

      }
      // Resto do código para processar o logout
    
      res.send('Logout successful');
    },
    

   auth: async function(req, res, next) {
    const token = req.headers.authorization; 
    console.log(token)
    if (!token) {
      return res.status(401).send('Token não fornecido');
    }

    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decodedToken._id;

      const selectUser = await User.findById(userId);
      if (!selectUser || selectUser.admin !== true) {
        return res.status(403).send('Usuário não encontrado ou sem permissão de administrador');
      }

      // O usuário é autenticado e tem permissão de administrador
      req.user = selectUser; // Adiciona o usuário ao objeto req para uso posterior
      next(); // Chama o próximo middleware ou rota

    } catch (error) {
      return res.status(401).send('Token inválido');
    }
},


      

}


module.exports = userController;
