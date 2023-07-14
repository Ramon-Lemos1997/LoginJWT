const Joi = require('@hapi/joi');

const registerValidate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(100),
  });

 
  return schema.validate(data);
};


const loginValidate= (data)=>{
    const schema= Joi.object({
        email:Joi.string().required().min(3).max(50),
        password:Joi.string().required().min(6).max(100)
    })
    const { error, value } = schema.validate(data);
  
    if (error && error.details && error.details.length > 0) {
      const errorField = error.details[0].path[0];
  
      if (errorField === "password") {
        return {
          error: {
            message: "A senha deve conter no mínimo seis caracters",
            field: errorField,
          },
        };
      }
    }
  
    return { value };
};


module.exports.loginValidate= loginValidate
module.exports.registerValidate= registerValidate