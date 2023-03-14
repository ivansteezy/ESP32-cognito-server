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
    body: {},
    message: ""
}

const ResponseBad = {
    statusCode: 400,
    body: {},
    message: "" 
}

app.get('/', (req, res) => {
    ResponseOK.message = "Hola Syro!";
    res.send(ResponseOK);
})

app.post('/Login', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);

    const authDetails = new AWSCognito.AuthenticationDetails({
        Username: req.body.email,
        Password: req.body.password
      });

    const cognitoUser = new AWSCognito.CognitoUser({
        Username: req.body.email,
        Pool: userPoolData
    });

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          ResponseOK.body = result;
          ResponseOK.message = "Bienvenido al sistema!";
          res.send(ResponseOK);
        },
        onFailure: err => {
          ResponseBad.body = err;
          ResponseBad.message = "Error tratando de ingresar con el usuario"
          res.send(ResponseBad);
        }
    });
});

app.post('/VerifyUser', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);
    const cognitoUser = new AWSCognito.CognitoUser({
        Username: req.body.email,
        Pool: userPoolData
    });

    cognitoUser.confirmRegistration(req.body.verificationCode, true, (err, result) => {
        if(err)
        {
            ResponseBad.body = err;
            ResponseBad.message = "Error tratando de verificar el usuario"
            res.send(ResponseBad);
        }
        else
        {
            ResponseOK.body = result;
            ResponseOK.message = "Usuario verificado con exito!";
            res.send(ResponseOK);
        }
    });
});

app.post('/CreateUser', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);
    let userAttributes = [];

    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'email', Value: req.body.email}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'given_name', Value: req.body.given_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'family_name', Value: req.body.family_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'phone_number', Value: req.body.phone_number}));
    
    userPoolData.signUp(req.body.email, req.body.password, userAttributes, [], (err, result) => {
        if (err) 
        {
          ResponseBad.body = err;
          ResponseBad.message = "Error tratando de registrar el usuario"
          res.send(ResponseBad);
        }
        else 
        {
          ResponseOK.body = result;
          ResponseOK.message = "Usuario registado con exito!";
          res.send(ResponseOK);
        }
      });
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})