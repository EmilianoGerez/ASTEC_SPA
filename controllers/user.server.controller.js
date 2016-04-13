var mongoose = require('mongoose');
var RefreshToken = mongoose.model('RefreshToken');
var User = mongoose.model('User');
var tokenConfig = require('../configs/token.server.config');
var jwt = require('jsonwebtoken');
var useragent = require('useragent');
var _ = require('lodash');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'username@gmail.com',
    pass: 'pass'
  }
});

//////////////////////////////////////////////////////////
/// User SignUp
exports.signup = function (req, res) {

  // check form data
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: true,
      message: "Email or Password can't be blank"
    });
  }

  // get user agent
  var agent = getAgent(req);

  // create new user
  var newUser = new User();
  newUser.email = req.body.email;
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.password = newUser.generateHash(req.body.password);
  newUser.role = req.body.role || 'Tech';

  newUser.save(function (err, user) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Error: ' + err
      });
    }

    // create token
    var token = createToken(user, agent, tokenConfig.EXP_TIME);
    // create refresh token
    createRefreshToken(user, agent);
    res.status(201).send({
      error: false,
      token: token
    });
  });
};

//////////////////////////////////////////////////////////
/// Verify is available
exports.isAvailable = function (req, res) {
  User.findOne({
    email: req.params.email
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Error ' + err
      });
    }

    res.status(200).json({
      error: false,
      data: user
    });
  });
};


//////////////////////////////////////////////////////////
/// User SignIn
exports.signin = function (req, res) {

  // check form data
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: true,
      message: "Email or Password can't be blank"
    });
  }

  // get user agent
  var agent = getAgent(req);

  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'Error: ' + err
      });
    }

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User doesn't exist"
      });
    } else {
      if (!user.validPassword(req.body.password)) {
        return res.status(401).json({
          error: true,
          message: 'Incorrect email or password'
        });
      } else {
        var token = createToken(user, agent, tokenConfig.EXP_TIME);
        // clean refresh token list
        cleanRefreshToken(user);
        // create refresh token
        createRefreshToken(user, agent);
        res.status(200).json({
          error: false,
          token: token
        });
      }
    }
  });
};

//////////////////////////////////////////////////////////
/// User logout
exports.logout = function (req, res) {
  var agent = getAgent(req);

  RefreshToken.find({
    user: req.params.id
  }, function (err, token) {
    if (err) {
      res.status(500).json({
        error: true,
        message: 'Error ' + err
      });
    }

    var fetchToken = token.filter(function (e) {
      if (verifyAgent(e.token, agent)) {
        return e;
      }
    });

    console.log(fetchToken);

    if (!fetchToken) {
      return res.status(403).json({
        error: true,
        message: 'Icorrect credentials (agent)'
      });
    }

    RefreshToken.remove({
      _id: fetchToken[0]._id
    }, function (err) {
      if (err) {
        res.status(500).json({
          error: true,
          message: 'Error ' + err
        });
      }

      res.status(200).json({
        error: false,
        message: 'Remove successful'
      });
    });
  });
};

//////////////////////////////////////////////////////////
/// User forgot password
exports.forgot = function (req, res) {

  var agent = getAgent(req);

  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      res.status(500).json({
        error: true,
        message: 'Error ' + err
      });
    }

    if (user) {
      var token = createResetToken(user, tokenConfig.RESET_TIME);
      var email = setupEmail(req, token);

      // send mail with defined transport object
      transporter.sendMail(email, function (err, info) {
        if (err) {
          res.status(500).json({
            error: true,
            message: 'Email ' + err
          });
        }
        res.status(200).json({
          error: false,
          message: 'Successful! Check your email'
        });

      });
    } else {
      res.status(404).json({
        error: true,
        message: 'Incorrect email'
      });
    }
  });
};

//////////////////////////////////////////////////////////
/// Reset password
exports.reset = function (req, res) {
  var token = req.body.token;
  if (token) {
    jwt.verify(token, tokenConfig.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: true,
          message: 'Incorrect token or expired'
        });
      } else {
        User.findById(decoded._id, function (err, user) {
          if (err) {
            return res.status(500).json({
              error: true,
              message: "Error" + err
            });
          }

          user.password = user.generateHash(req.body.password);

          user.save(function (err, user) {
            if (err) {
              return res.status(500).json({
                error: true,
                message: "Error" + err
              });
            }
            res.status(200).json({
              error: false,
              message: 'Success! Password updated'
            });
          });
        });
      }
    });
  } else {
    return res.status(403).json({
      error: true,
      message: 'Incorrect token'
    });
  }
};

//////////////////////////////////////////////////////////
/// User Autorization
exports.isAuth = function (req, res, next) {

  var token = req.headers['x-access-token'] || req.headers.authorization;
  // angular js headers
  if (req.headers.authorization) {
    token = token.split(" ")[1];
  }

  if (token) {
    // get user agent
    var agent = getAgent(req);
    // verify agent
    if (!verifyAgent(token, agent)) {
      return res.status(403).json({
        error: true,
        message: 'Icorrect credentials (agent)'
      });
    }
    jwt.verify(token, tokenConfig.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          error: true,
          message: 'Incorrect credentials'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      error: true,
      message: 'Incorrect Headers'
    });
  }
};

//////////////////////////////////////////////////////////
/// Admin Autorization
exports.isAdmin = function (req, res, next) {
  console.log("EN ADMIN AUTH");
  if (req.decoded.role === 'Admin') {
    next();
  } else {
    return res.status(401).json({
      error: true,
      message: 'You do not have permission'
    });
  }
};

//////////////////////////////////////////////////////////
/// Refresh token
exports.refresh = function (req, res, next) {
  var token = req.body.token;

  if (token) {
    // get user agent
    var agent = getAgent(req);
    // verify agent
    if (!verifyAgent(token, agent)) {
      return res.status(403).json({
        error: true,
        message: 'Icorrect credentials (agent)'
      });
    }

    jwt.verify(token, tokenConfig.SECRET_KEY, function (err, decoded) {
      if (err) {
        // check expiration
        if (err.name === 'TokenExpiredError') {
          // decode token
          var payload = jwt.decode(token);
          // find refresh token
          RefreshToken.findOne({
            user: payload._id
          }).exec(function (err, data) {
            if (err) {
              return res.status(500).json({
                error: true,
                message: "Error" + err
              });
            }
            // check data
            if (data) {
              // verify refresh token
              jwt.verify(data.token, tokenConfig.SECRET_KEY, function (err, decoded) {
                if (err) {
                  return res.status(401).json({
                    error: true,
                    message: 'Authentication failure 1'
                  });
                }

                // create a new token
                var newToken = createToken(payload, agent, tokenConfig.EXP_TIME);
                // set the new token
                res.status(200).json({
                  error: false,
                  token: newToken
                });
              });
            } else {
              return res.status(401).json({
                error: true,
                message: 'Authentication failure 2'
              });
            }
          });
        } else {
          return res.status(401).json({
            error: true,
            message: 'Authentication failure 3'
          });
        }
      } else {
        // create new token
        var newToken = createToken(user, decoded.agent, tokenConfig.EXP_TIME);
        // set the new token
        res.status(200).json({
          error: false,
          token: newToken
        });
      }
    });
  } else {
    return res.status(403).json({
      error: true,
      message: 'Incorrect credentials'
    });
  }
};


//////////////////////////////////////////////////////////
///                 Functions
//////////////////////////////////////////////////////////
var createToken = function (user, agent, exp) {
  var payload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    agent: {
      device: agent.device,
      os: agent.os,
      browser: agent.browser
    }
  };
  var token = jwt.sign(payload, tokenConfig.SECRET_KEY, {
    expiresIn: exp
  });

  return token;
};

var createRefreshToken = function (user, agent) {
  // create refresh token Obj
  var refreshToken = new RefreshToken({
    token: createToken(user, agent, tokenConfig.SESSION_TIME),
    user: user._id,
    agent: agent
  });
  // save refresh token
  refreshToken.save(function (err) {
    if (err) {
      res.status(500).json({
        error: true,
        message: 'Failed to create token'
      });
    }
  });
};

var createResetToken = function (user, exp) {
  var payload = {
    _id: user._id,
  };
  var token = jwt.sign(payload, tokenConfig.SECRET_KEY, {
    expiresIn: exp
  });

  return token;
};

var cleanRefreshToken = function (user) {
  RefreshToken.find({
    user: user._id
  }, function (err, users) {
    users.forEach(function (e) {
      jwt.verify(e.token, tokenConfig.SECRET_KEY, function (err, decoded) {
        if (err) {
          RefreshToken.remove({
            _id: e._id
          }, function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
  });
};

var getAgent = function (req) {
  // fetch user agent    
  var agent = useragent.parse(req.headers['user-agent']);
  var device = {
    device: agent.device.toString(),
    os: agent.os.toString(),
    browser: agent.toAgent()
  };

  return device;
};

var verifyAgent = function (token, agent) {
  var decoded = jwt.decode(token, tokenConfig.SECRET_KEY);
  if (decoded.agent.device === agent.device || decoded.agent.os === agent.os || decoded.agent.browser === agent.browser) {
    return true;
  } else {
    return false;
  }
};

var setupEmail = function (req, token) {
  var mailOptions = {
    from: 'emiliano.gerez@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: 'Reset your password', // Subject line
    text: 'You are receiving this because you (or someone else) have        requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };

  return mailOptions;
};


exports.findOne = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    res.status(200).jsonp(user);
  });
};
