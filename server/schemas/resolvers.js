const { User } = require('../models');

const { signToken } = require('../utils/auth');
const {AuthenticationError} = require('appolo-server-express')


const resolvers = {
    Query: {
        getSingleUser: async function(parent, args, context) {
            const foundUser = await User.findOne({
             _id: context.user._id
            });
        
            if (!foundUser) {
            //   return res.status(400).json({ message: 'Cannot find a user with this id!' });
            return new AuthenticationError('Cannot find a user with this id!')
            }
        
            return (foundUser);
          },
    },
    Mutation: {
       createUser:  async function(parent, args, context) {
            const user = await User.create(args); 
        
            if (!user) {
              return new AuthenticationError('Cannot find a user with this id!');
            }
            const token = signToken(user);
            return ({ token, user });
          },
          login: async function(parent, args, context) {
            const user = await User.findOne({ email:args.email });
            if (!user) {
              return new AuthenticationError('Cannot find a user with this id!');
            }
        
            const correctPw = await user.isCorrectPassword(args.password);
        
            if (!correctPw) {
              return new AuthenticationError('Cannot find a user with this id!');
            }
            const token = signToken(user);
            return ({ token, user });
          },
    }

}

module.exports = resolvers