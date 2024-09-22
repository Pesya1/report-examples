## Table of Contents

* [ name ](#name)
* [ Technologies ](#Technologies)
* [ Standalone run ](#Standalone-run)
* [ Contributors ](#Contributors)
* [ Controller role ](#Controller-role)
* [ start ](#start)
    * [ params ](#params)
    * [ publishLocalRoutes ](#publishLocalRoutes)
    * [ publishextendedRoutes ](#publishextendedRoutes)
    * [ send extended routes ](#sendExtendedRoutes)
        * [ Parameters for sending/getting(private controller) ](#Parameters)

    

<a name="name"></a>

# name

erp-api-controller microservice using the octopusMB 

<a name="Technologies"></a>

## Technologies

Project is created with:
* Node.js

<a name="Standalone-run"></a>

## Standalone run

To run this project without pm2:
```
cd ../erp-api-controller
npm start
```

<a name="Contributors"></a>

## Contributors

- [@avigailc-one1](https://github.com/avigailc-one1)
- [@drorv-one1](https://github.com/drorv-one1)

&copy; One1ERP

<a name="Controller-role"></a>

## Controller-role
This service is a template for all controllers that related to GATEWAY \
Control receives requests for treatment from GATEWAY, handles what is needed, and returns an answer to GATEWAY

<a name="start"></a>

## start
Each controller must have initialized A list of all the routes that the controller handles\
in =\erp-api-controller\config\routesList.js

The list include array will contain objects.\
Each object will contain a number of parameters.\

## If there is an error must return status
examle
```
error = {message: error.message, data:{status:400}}
```

<a name="params"></a>

### params:

name | description | require|
--- | --- | --- | 
url | routing of the specific request | true
--- | --- | --- | 
method | options=get/post/delete/put | true
--- | --- | --- | 
permissions | list of permissions for that routing | true
--- | --- | --- | 
controller | function name when requet come | true
--- | --- | --- | 
first | if there is a specific request that needs to be first in line | false
--- | --- | --- | 

<a name="publishLocalRoutes"></a>

### publishLocalRoutes

The controller will send all routings to GATEWAY every minute
And when the GATEWAY request arrives, it will be sent to the controller\
by the name of the controller we sent when operating the controller server.

```
example
{
    url:'/v' + config.controller.version + '/one',
    method: "get",
    permissions: ["products.create","products.create","products.get"],
    controller: "a1"// function name when requet come
}
```

<a name="publishextendedRoutes"></a>

### publishextendedRoutes

The controller will send all the extension names of the treatments,\
and the function that handles them

example
```
client.publish("controllerName", {
    controllerName: client.name(),
    uniqueTreatments:[
        {
            'createQuotaForCustomer.endValidation':'ggg'
        },
        {
            'createQuotaForCustomer.ttt':'ttt'
        }
    ],
})
```

<a name="sendExtendedRoutes"></a>

### sendExtendedRoutes

The controller will send to a private controller, data for special care

<a name="Parameters"></a>

#### Parameters for sending/getting(private controller):

* extendedFunc: The name of the function that needs to be reached in the private controller
* params: All parameters that need to be sent to the function

example
```
var extendedTreatment = await client.request(keys[i],{
    extendedFunc: Object.values(values[i][j])[0],
    params: params
})
```
