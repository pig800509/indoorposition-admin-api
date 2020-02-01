'use strict';
import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const table = "LBS_Zone";

module.exports = {

    create: async(event, context, callback) => {
        const data = JSON.parse(event.body);
        const params = {
            TableName: table,
            Item: {
                tagId: uuid.v1(),
                tagName: data.tagName,
                accesses: data.accesses,
                color: data.color,
                size: data.size,
                tagStatus: data.tagStatus,
                mainArea: data.mainArea,
                display: data.display,
                createdAt: new Date().getTime(),
                update_at: new Date().getTime()
            }
        };

        try {
            await dynamoDbLib.call("put", params);
            callback(null, success(params.Item));
        } catch (e) {
            callback(null, failure({ status: false }));
        }
    },

    delete: async(event, context, callback) => {
        const params = {
            TableName: table,
            Key: {
                //userId: event.requestContext.identity.cognitoIdentityId,
                tagId: event.pathParameters.id
            }
        };

        try {
            const result = await dynamoDbLib.call("delete", params);
            callback(null, success({ status: true }));
        } catch (e) {
            callback(null, failure({ status: false }));
        }
    },

    update: async(event, context, callback) => {
        const data = JSON.parse(event.body);
        const params = {
            TableName: table,
            Key: {
                //userId: event.requestContext.identity.cognitoIdentityId,
                tagId: event.pathParameters.id
            },
            UpdateExpression: "SET tagName = :tagName, "+
            "accesses = :accesses, "+
            "color = :color, "+
            "size = :size, "+
            "tagStatus = :tagStatus, "+
            "mainArea = :mainArea, "+
            "display = :display, "+
            "update_at = :update_at",
            ExpressionAttributeValues: {
                ":tagName": data.tagName ? data.tagName : null,
                ":accesses": data.accesses ? data.accesses : null,
                ":color": data.color ? data.color : null,
                ":size": data.size ? data.size : null,
                ":tagStatus": data.tagStatus ? data.tagStatus : null,
                ":mainArea": data.mainArea ? data.mainArea : null,
                ":display": data.display ? data.display : null,
                ":update_at": new Date().getTime()
            },
            ReturnValues: "ALL_NEW"
        };

        try {
            const result = await dynamoDbLib.call("update", params);
            callback(null, success({ status: true }));
        } catch (e) {
            callback(null, failure(e));
        }
    },
    
    list: async (event, context, callback) => {
        const params = {
            TableName: table
        };

        try {
            const result = await dynamoDbLib.call("scan", params);
            // Return the matching list of items in response body
            callback(null, success(result.Items));
        } catch (e) {
            callback(null, failure({ status: false }));
        }
    }
    
    /*
    list: async (event, context, callback)  => {
        var params = {
            RequestItems: {
                [table]: {
                    Keys: [{
                        'zoneId':'sdfsdf'
                    }]
                }
            }
        };

        try {
          const result = await dynamoDbLib.call("batchGet", params);
          if (result.Responses[table][0]) {
            // Return the retrieved item
            callback(null, result.Responses[table]);
          } else {
            callback(null, failure({ status: false, error: "Item not found." }));
          }
        } catch (e) {
          callback(null, failure(e));
        }

    }
    */
};