import { dynamoDB } from "./awsConfig";

export const fetchDataFromDynamoDB = async () => {
  const params = {
    TableName: "DHT",
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    return [];
  }
};
