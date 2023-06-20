
import { gql } from "apollo-server-express"

const typeDefs = gql`
type Query{
    users:[Users]
    qoutes:[QouteWithName]
    user(_id:ID!):Users
    iqoute(by:ID!):[Qoutes]
}

type QouteWithName{
    name:String
    by:IdName
}

type IdName{
    _id:String
    firstName:String
}

type Users{
    _id:ID,
    firstName:String
    lastName:String
    email:String
    password:String
    qoutes:[Qoutes]
}
type Qoutes{
    name:String
    by:ID
}

type Token{
    token:String!
}

type Mutation {
    signUpUser(
        newUser:userInput!
    ):Users
    signInUser(userSignIn:userSignInInput!):Token
    createQoute(name:String!):String
}

input userInput{
    firstName:String!
    lastName:String!
    email:String!
    password:String!
}

input userSignInInput{
    email:String!
    password:String!
}




`

export default typeDefs