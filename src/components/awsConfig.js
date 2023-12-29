import AWS from "aws-sdk";
require("dotenv").config();

AWS.config.update({
	accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
	secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
	region: process.env.REACT_APP_REGION,
});

export const dynamoDB = new AWS.DynamoDB.DocumentClient();
