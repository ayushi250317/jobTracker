import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData={
    UserPoolId:process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId:process.env.REACT_APP_COGNITO_CLIENT_ID

    // UserPoolId:"us-east-1_rGgGV1tdj",
    // ClientId:"2p0thaa03n6f0hghqkvvm4tp52"

}

export default new CognitoUserPool(poolData);