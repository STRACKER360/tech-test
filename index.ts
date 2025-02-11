async function gomoto() {
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

interface ClientTransport {
  client: {
    id: number;
    name: string;
  };
  transports: {
    id: number;
    extRef: string;
    status: number;
  }[];
}

interface GomotoResponse {
  status: number;
  data: {
    info: {
      id: number;
      events: {
        transportRef: string;
        name: string;
      }[];
    };
  }[];
}

interface response {
  ref: string;
  eventName: string;
  readableStatus: string;
}

enum TransportStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DELAYED = "delayed",
  COMPLETED = "completed",
  UNKNOWN = "unknown",
}

function getReadableStatus(status: number): string {
  switch (status) {
    case 1:
      return TransportStatus.PENDING;
    case 2:
      return TransportStatus.IN_PROGRESS;
    case 3:
      return TransportStatus.DELAYED;
    case 4:
      return TransportStatus.COMPLETED;
    default:
      return TransportStatus.UNKNOWN;
  }
}

function processEvents(
  gomotoResponse: GomotoResponse,
  dbResult: ClientTransport[]
): response[] {
  const response: response[] = [];

  gomotoResponse.data.forEach((dataItem) => {
    dataItem.info.events.forEach((event) => {
      dbResult[0].transports.forEach((transport) => {
        if (event.transportRef === transport.extRef) {
          response.push({
            ref: transport.extRef,
            eventName: event.name,
            readableStatus: getReadableStatus(transport.status),
          });
        }
      });
    });
  });

  return response;
}

async function execute() {
  const gomotoResponse: GomotoResponse = await gomoto();
  const dbResult = await dbQuery();

  if (!gomotoResponse || gomotoResponse.status !== 200) {
    return [];
  }

  const response = processEvents(gomotoResponse, dbResult);
  return response;
}

execute().then(console.log);
