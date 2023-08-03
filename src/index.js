const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const app = express()
const{allowFlights} = require('./middlewares')

const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');

const amqplib = require('amqplib');




// mandatory
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//rate limiter
const limiter = rateLimit({
	windowMs: 15* 60 * 1000, // 15 minutes
	max: 100 // Limit max of 100 requests in every 15 mins
})
app.use(limiter) // before  url/api we have to apply the limiter

// proxy
app.use('/flightService', allowFlights.checkAuth ,allowFlights.allowupdate , createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true, }))

app.use('/BookingService', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true ,
pathRewrite: {
    '/BookingService': '/', // rewrite path means no need to mention in boooking service routes
 }}))


app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);

});