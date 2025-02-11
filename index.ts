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

interface dbQueryResult {
  client: dbQueryClient,
  transports: dbQueryTransport[],
}

interface dbQueryClient {
  id: number,
  name: string,
}

interface dbQueryTransport {
  id: number,
  extRef: string,
  status: number,
}

async function execute() {
  const client_response = await call3partyAPI();
  const dbResult: dbQueryResult[] = await dbQuery();

  enum Status {
    'pending' = 1,
    'in_progress' = 2,
    'delayed' = 3,
    'completed' = 4,
  }

  const Response: any[] = [];
  if (!client_response)
    return Response;

  for (let j = 0; j < client_response.data.length; j++) {
    for (let i = 0; i < client_response.data[j].info.events.length; i++) {
      dbResult[0].transports.forEach((element: dbQueryTransport, index) => {
        const clientResponseTransport = client_response.data[j].info.events[i];
      if (
         clientResponseTransport.transportRef ===
          element.extRef
          ) {
            Response.push({
              ref: element.extRef,
              eventName: clientResponseTransport.name,
              readableStatus: Status[element.status],
            });
          }
        })
      }
    }
  
  return Response;
}

execute().then(console.log);
