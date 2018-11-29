exports.handler = function(event, context, callback) {
    console.log(event)
    console.log(context)

    callback(null, {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "X-Gareth-Header": "Garethheadervalue" },
        "body": 'hello there'
    })
}
