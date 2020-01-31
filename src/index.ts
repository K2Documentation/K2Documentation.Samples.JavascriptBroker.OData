import '@k2oss/k2-broker-core';

metadata = {
    systemName: "com.sample.odata",
    displayName: "Sample OData Broker",
    description: "An sample broker that accesses OData."
};

ondescribe = function() {
    postSchema({
        // https://www.odata.org/getting-started/understand-odata-in-6-steps/
        // http://olingo.apache.org/doc/javascript/index.html
        objects: {
            "com.sample.odata.people": {
                displayName: "People",
                description: "People",
                properties: {
                    "com.sample.odata.people.userName": {
                        displayName: "User Name",
                        type: "string" 
                    },
                    "com.sample.odata.people.city": {
                        displayName: "City",
                        type: "string" 
                    }
                },
                methods: {
                    "com.sample.odata.people.get": {
                        displayName: "Get People",
                        type: "read",
                        outputs: [ "com.sample.odata.people.userName", "com.sample.odata.people.city" ]
                    }
                }
            }
        }
    });
}

onexecute = function(objectName, methodName, parameters, properties) {
    switch (objectName)
    {
        case "com.sample.odata.people": onexecuteGet(methodName, parameters, properties); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

function onexecuteGet(methodName: string, parameters: SingleRecord, properties: SingleRecord) {
    switch (methodName)
    {
        case "com.sample.odata.people.get": onexecuteGetPeople(parameters, properties); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetPeople(parameters: SingleRecord, properties: SingleRecord) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

        console.log(xhr.responseText);
        var obj = JSON.parse(xhr.responseText);
        console.log(obj.AddressInfo[0].City.Name); 

        postResult({
            "com.sample.odata.people.userName": obj.UserName,
            "com.sample.odata.people.city": obj.AddressInfo[0].City.Name
        });
    };

    var url = "https://services.odata.org/V4/(S(a2k31bgwiyejn2j2iiybvq4p))/TripPinServiceRW/People('russellwhyte')";
    xhr.open("GET", url);
   
    xhr.send();
}