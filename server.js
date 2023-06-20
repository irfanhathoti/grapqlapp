import { ApolloServer } from 'apollo-server-express'

import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import resolvers from './resolvers.js'
import typeDefs from './typeDefs.js'
import jwt from 'jsonwebtoken'
import path from 'path'
import express from 'express'
import http from 'http'

const port = process.env.PORT || 4000

const app = express()
const httpServer = http.createServer(app)


if (process.env.NODE_ENV !== "production") {
    dotenv.config()
}



const context = ({ req }) => {
    const { authorization } = req.headers
    if (authorization) {
        const { userId } = jwt.verify(authorization, process.env.SECRET_KEY)
        return { userId }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        process.env.NODE_ENV !== "production" ?
            ApolloServerPluginLandingPageGraphQLPlayground() :
            ApolloServerPluginLandingPageDisabled(),

    ]
})

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Database connected successful....")
})
mongoose.connection.on("error", (error) => {
    console.log(error)
})


if(process.env.NODE_ENV=="production"){
app.use(express.static('client/build'))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})
}

await server.start();
server.applyMiddleware({
    app,
    path: "/api/graphql"
})

httpServer.listen({ port }, () => {
    console.log(`server started at ${server.graphqlPath}`)
})

// server.listen().then(({ url }) => {
//     console.log(`server started at ${url}`)
// })