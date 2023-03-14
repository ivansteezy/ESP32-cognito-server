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

app.post('/Login/:email/:password', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);

    const authDetails = new AWSCognito.AuthenticationDetails({
        Username: req.params.email,
        Password: req.params.password
      });

    const cognitoUser = new AWSCognito.CognitoUser({
        Username: req.params.email,
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

app.post('/VerifyUser/:email/:verificationCode', (req, res) => {
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);
    const cognitoUser = new AWSCognito.CognitoUser({
        Username: req.params.email,
        Pool: userPoolData
    });

    cognitoUser.confirmRegistration(req.params.verificationCode, true, (err, result) => {
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

app.post('/CreateUser/:email/:password/:given_name/:family_name/:phone_number', (req, res) => {
    console.log("Creating user...");
    const userPoolData = new AWSCognito.CognitoUserPool(PoolData);
    let userAttributes = [];

    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'email', Value: req.params.email}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'given_name', Value: req.params.given_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'family_name', Value: req.params.family_name}));
    userAttributes.push(new AWSCognito.CognitoUserAttribute({Name: 'phone_number', Value: req.params.phone_number}));
    
    userPoolData.signUp(req.params.email, req.params.password, userAttributes, [], (err, result) => {
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