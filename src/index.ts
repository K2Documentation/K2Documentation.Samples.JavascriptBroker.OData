import '@k2oss/k2-broker-core';

metadata = {
    systemName: "sampleOdata",
    displayName: "Sample OData Broker",
    description: "An sample broker that accesses OData."
};

ondescribe = async function (): Promise<void> {
    postSchema({
        // https://www.odata.org/getting-started/understand-odata-in-6-steps/
        // http://olingo.apache.org/doc/javascript/index.html
        objects: {
            "people": {
                displayName: "People",
                description: "People",
                properties: {
                    "userName": {
                        displayName: "User Name",
                        type: "string"
                    },
                    "city": {
                        displayName: "City",
                        type: "string"
                    }
                },
                methods: {
                    "get": {
                        displayName: "Get People",
                        type: "read",
                        outputs: ["userName", "city"]
                    }
                }
            }
        }
    });
}

onexecute = async function ({objectName, methodName, parameters, properties}): Promise<void> {
    switch (objectName) {
        case "people": await onexecuteGet(methodName, parameters, properties); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteGet(methodName: string, parameters: SingleRecord, properties: SingleRecord): Promise<void> {
    switch (methodName) {
        case "get": await onexecuteGetPeople(parameters, properties); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteGetPeople(parameters: SingleRecord, properties: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                console.log(xhr.responseText);
                var obj = JSON.parse(xhr.responseText);
                console.log(obj.AddressInfo[0].City.Name);

                postResult({
                    "userName": obj.UserName,
                    "city": obj.AddressInfo[0].City.Name
                });
                resolve();
            } catch (error) {
                reject(error);
            }

        };

        var url = "https://services.odata.org/V4/(S(a2k31bgwiyejn2j2iiybvq4p))/TripPinServiceRW/People('russellwhyte')";
        xhr.open("GET", url);

        xhr.send();
    });
}