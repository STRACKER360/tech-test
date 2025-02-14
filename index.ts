async function call3partyAPI() {
  return {
    status: 200, // could be 400 or 500 sometimes
    data: [
      // data property may or may not exist
      {
        info: {
          id: 1,
          events: [
            {
              transportRef: "ABC123",
              name: "Parcel picked up",
            },
            {
              transportRef: "GHI789",
              name: "Carrier in route",
            },
          ],
        },
      },
      {
        info: {
          id: 2,
          events: [
            {
              transportRef: "XYZ000",
              name: "Parcel picked up",
            },
            {
              transportRef: "DEF456",
              name: "Available for collection",
            },
          ],
        },
      },
      {
        info: {
          id: 3,
          events: [
            {
              transportRef: "JKL567",
              name: "Customs unavailable",
            },
          ],
        },
      },
    ],
  };
}

// Always returns only 1 item
async function dbQuery() {
  return [
    {
      client: { id: 1, name: "JPG" },
      transports: [
        {
          id: 28,
          extRef: "ABC123",
          status: 2,
        },
        {
          id: 42,
          extRef: "DEF456",
          status: 1,
        },
      ],
    },
  ];
}

const getReadableStatusByTransportStatus = (transportStatus:number) => {
  switch (transportStatus) {
    case 1:
    return  "pending"
      
    case 2:
      return  "in_progress"
        
    case 3:
      return  "delayed"
        
    case 4:
      return  "completed"
        
    default:
      return ""
  }
}

async function getTransportsStatus() {
  const clientResponse = await call3partyAPI();
  const dbResult = await dbQuery();
  const response: any[] = [];

  const flattenEvents =  clientResponse.data
  .flatMap(entry => entry.info?.events || [])

  if (clientResponse) {
      for (const transport of dbResult[0].transports) {
        const id = transport.extRef;
        
        
          let name = flattenEvents.find(event => event.transportRef === id)?.name

          if (name) {
            response.push({
              ref: id,
              eventName: name,
              readableStatus : getReadableStatusByTransportStatus(transport.status),
            });
          }
      }
  }

  return response;
}

getTransportsStatus().then(console.log);
