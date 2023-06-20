import { User } from './modules/User.js'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import { Quotes } from './modules/Quotes.js'

const resolvers = {
    Query: {
        users: async() => await User.find() ,
        qoutes:async () =>await Quotes.find().populate("by","_id firstName"),
        user: async (_, { _id }) => await User.findById(_id),
        iqoute: async(_, { by }) => await Quotes.find({by})
    }
    ,
    Users: {
        qoutes: async(url) =>await Quotes.find({by:url._id})
    },

    Mutation: {
        signUpUser: async (_, { newUser }) => {
            const user = await User.findOne({ email: newUser.email })
            if (user) {
                throw new Error("user exist with this email. ")
            }
            const passwordHash = await bcrypt.hash(newUser.password, 10)

            const newUserData = new User({
                ...newUser,
                password: passwordHash
            })

            return await newUserData.save()
        },

        signInUser: async (_, { userSignIn }) => {
            try {
                //    TODO
                const userExist = await User.findOne({ email: userSignIn.email })
                if (!userExist) {
                    throw new Error("user does'nt exist please register")
                }
                const encryptPassword = await bcrypt.compare(userSignIn.password, userExist.password)
                if (!encryptPassword) {
                    throw new Error("email and password is invalid.")
                }
                const token = Jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY)
                return { token }
            }
            catch (err) {
                console.log(err)
            }

        },
        createQoute: async (_, { name }, { userId }) => {
            if (!userId) throw new Error("You must be logged in")
            const newQuotes = new Quotes({
                name,
                by: userId
            })

            await newQuotes.save()

            return "Quote saved Successfullu"

            //Todo
        }


    }
}
export default resolvers