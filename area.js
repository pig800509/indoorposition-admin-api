'use strict';
import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const table = "LBS_Area";

module.exports = {

    create: async(event, context, callback) => {
        const data = JSON.parse(event.body);
        const params = {
            TableName: table,
            Item: {
                areaId: uuid.v1(),
                building: data.building,
                cameras: data.cameras,
                floor: data.floor,
                height: data.height,
                image: data.image,
                areaName: data.areaName,
                room: data.room,
                width: data.width,
                zones: data.zones,
                areaStatus: data.areaStatus,
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
                areaId: event.pathParameters.id
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
                areaId: event.pathParameters.id
            },
            UpdateExpression: "SET areaName = :areaName, "+
            "building = :building, "+
            "cameras = :cameras, "+
            "floor = :floor, "+
            "height = :height, "+
            "image = :image, "+
            "room = :room, "+
            "width = :width, "+
            "zones = :zones, "+
            "areaStatus = :areaStatus, "+
            "update_at = :update_at",
            ExpressionAttributeValues: {
                ":areaName": data.areaName ? data.areaName : null,
                ":building": data.building ? data.building : null,
                ":cameras": data.cameras ? data.cameras : null,
                ":floor": data.floor ? data.floor : null,
                ":height": data.height ? data.height : null,
                ":image": data.image ? data.image : null,
                ":room": data.room ? data.room : null,
                ":width": data.width ? data.width : null,
                ":zones": data.zones ? data.zones : null,
                ":areaStatus": data.areaStatus ? data.areaStatus : null,
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
            TableName: "LBS_Area"
        };
        
        try {
            const result = await dynamoDbLib.call("scan", params);
            // Return the matching list of items in response body
            callback(null, success(result.Items));
        } catch (e) {
            callback(null, failure(e));
        }
    }
};