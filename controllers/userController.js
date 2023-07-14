const User= require('../models/User')
const bcrypt= require('bcryptjs') //module criptografia
const jwt= require('jsonwebtoken')  //module para criação de token único servidor
const {loginValidate, registerValidate}= require('./validate')


const userController={    
  register:async function(req,res){
    const selectUser= await User.findOne({email:req.body?.email})
    if(selectUser) return res.status(400).send('Email já em uso')

    const { error } = registerValidate(req.body);  
    if (error) {
      const errorMessage = error.message;
      if (errorMessage.includes('"name" is not allowed to be empty')) {
        return res.status(400).send('O nome é obrigatório.');

      } else if (errorMessage.includes('"name" length must be at least 3 characters long')) {
          return res.status(400).send('O nome deve ter no mínimo três caracteres.');

      } else if (errorMessage.includes('"email" is not allowed to be empty')) {
        return res.status(400).send('O email é obrigatório.');

      } else if (errorMessage.includes('"password" length must be at least 6 characters long')) {
        return res.status(400).send('A senha deve conter no mínimo 6 caracteres.');

       } else if (errorMessage.includes('"password" is not allowed to be empty')) {
        return res.status(400).send('A senha é obrigatória.');
      }
      return res.status(400).send(error.message);
    }
      const user= new User({
          name: req.body?.name,
          email: req.body?.email,
          password: bcrypt.hashSync(req.body?.password)
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
    
      const token = jwt.sign({ _id: selectUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
      res.send(token)
      
    },
    
      
    logout: async function(req, res) { 
      res.send('Logout successful');
    },
    

   auth: async function(req, res, next) {
    const token = req.headers.authorization; 
    
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

      req.user = selectUser; 
      next(); // Chama o próximo middleware ou rota

    } catch (error) {
      return res.status(401).send('Token inválido');
    }
},


      

}


module.exports = userController;
