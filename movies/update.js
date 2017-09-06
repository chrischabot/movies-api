'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t update the movie item.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#movie_name': 'name',
    },
    ExpressionAttributeValues: {    	
    	':name': data.text,
    	':days': data.text,
    	':image_small': data.text,
    	':image_large': data.text,
    	':imdb_url': data.text,
    	':synopsis': data.text
    },
    UpdateExpression: 'SET #movie_name = :name, days= :days, image_small= :image_small, image_large= :image_large, imdb_url= :imdb_url, synopsis= :synopsis',
    ReturnValues: 'ALL_NEW',
  };

  // update the movie in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the movie item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
