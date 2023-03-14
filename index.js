const express = require('express');
const AWSCognito = require('amazon-cognito-identity-js');

const PoolData = {
    UserPoolId: "us-west-1_ejNAMAv5c",
    ClientId: "3ptbmci36d98ehuqu9ntpf3qti"
}

const app = express();
const port = 3000;
app.use(express.json());

const ResponseOK = {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'}, 
    body: {
    } 
}

const ResponseBad = {
    statusCode: 400,
    headers: {'Content-Type': 'application/json'}, 
    body: {
    } 
}

app.get('/', (req, res) => {
  console.log(req);
  res.send('Hello Syro TEEEST!');
})

app.post('/CreateUser', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);
    let userAttributes = [];

    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'email', Value: req.body.email}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'given_name', Value: req.body.given_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'family_name', Value: req.body.family_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'phone_number', Value: req.body.phone_number}));

    console.log(userAttributes);
    
    userPoolData.signUp(req.body.email, req.body.password, userAttributes, [], (err, result) => {
        if (err) 
        {
          console.error('Error Signing up user: ', req.body.email);
          console.error('With password: ', req.body.password);
          
          console.log("Error!!");
          console.log(err);


          ResponseBad.body = err;
          res.send(ResponseBad);
        }
        else 
        {
          console.info('User: ', req.body.email, 'Signed up!');
          ResponseOK.body = result;
          res.send(ResponseOK);
        }
      });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})