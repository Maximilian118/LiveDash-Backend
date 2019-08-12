const User = require('../../models/user-schema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  auth: async args => {
    try {
      const userFound = await User.findOne({ email: args.email })
      if (userFound) {
        const isPass = await bcrypt.compare(args.password, userFound.password)
        if (!isPass) {
          throw new Error("Wrong Password!")
        }
        const token = jwt.sign({ userId: userFound._id, email: userFound.email }, process.env.JWT_KEY, { expiresIn: '1h' })
        console.log(`[auth-resolver] User Logged In...`)
        return {
          ...userFound._doc,
          token: token,
          tokenExpiry: 1,
        }
      }
      const hashedPass = await bcrypt.hash(args.password, 12)
      const user = new User({
        email: args.email,
        password: hashedPass,
        img: null
      })
      const result = await user.save()
      console.log(`[auth-resolver] User Created...`)
      const newUser = await User.findOne({ email: args.email })
      const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_KEY, { expiresIn: '1h' })
      return {
        ...newUser._doc,
        password: null,
        token: token,
        tokenExpiry: 1
      }
    } catch (err) {
      throw err
    }
  },
}