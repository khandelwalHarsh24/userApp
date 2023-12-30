
const jwt=require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if(req.headers.authorization===undefined){
      return res.status(401).json({"message":"Unauthorized Access"});
    }
    const token =req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Permission denied. User does not have the required permission' });
    }
  
    jwt.verify(token,process.env.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Permission denied. User does not have the required permission' });
      }
      // console.log(decoded);
      req.user = decoded; // Store the user ID for later use
      next();
    });
};

module.exports=verifyToken;