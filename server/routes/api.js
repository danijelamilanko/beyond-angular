const express 	 = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const bluebird   = require('bluebird');

const bcrypt = require('bcrypt');
const cors   = require('cors');
const jwt    = require('jsonwebtoken');
const config = require('../config');
const User   = require('../models/user');

// configuration
const port = process.env.PORT || 8080;
mongoose.Promise = bluebird;
mongoose.connect(config.database, {useMongoClient: true});
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.get('/setup', function(req, res) {

    // create a sample user
    var user = new User({
        username: 'admin',
        hash_password: jwt.hashSync('admin', 10)
    });
    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
    res.send('The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (bcrypt.compareSync(req.body.password, user.hash_password)) {
                // if user is found and password is right
                // create a token
                var payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            } else {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }

        }

    });
});

// route middleware to authenticate and check token
apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

app.use('/api', apiRoutes);

// start the server
app.listen(port);
console.log('API running on http://localhost:' + port + '/api');