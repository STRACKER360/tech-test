/*
Feature: Data Source Join and Mapping

Scenario: Joining and mapping data from third-party API and local DB query in execute()

GIVEN two different data sources, one from a third-party API (call3partyAPI) and one from a local DB query (dbQuery)
AND the call3partyAPI() returns static "curriculum" data
AND the dbQuery() returns client learning progress data from our DB
WHEN the execute() function is called
THEN it should return an array of { ref, eventName, readableStatus }
AND the readableStatus for each event is defined as follows:
    1: pending
    2: in_progress
    3: delayed
    4: completed
*/

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

type APIResponse = {
  status: number;
  data: {
    info: Info;
  }[];
};

type Info = {
  id: number;
  events: Event[];
};

type Event = {
  transportRef: string;
  name: string;
};

enum Status {
  PENDING = 1,
  IN_PROGRESS = 2,
  DELAYED = 3,
  COMPLETED = 4,
}

type Client = {
  client: {
    id: number;
    name: string;
  };
  transports: Transport[];
};

type Transport = {
  id: number;
  extRef: string;
  status: Status;
};

type ResponseItem = {
  ref: string;
  eventName: string;
  readableStatus: string;
};

const getReadableStatus = (status: Status): string => {
  switch (status) {
    case Status.PENDING:
      return "pending";
    case Status.IN_PROGRESS:
      return "in_progress";
    case Status.DELAYED:
      return "delayed";
    case Status.COMPLETED:
      return "completed";
    default:
      return "unknown";
  }
};

const mapEventToResponse = (
  event: Event,
  transport: Transport
): ResponseItem => {
  const readableStatus = getReadableStatus(transport.status);
  return {
    ref: event.transportRef,
    eventName: event.name,
    readableStatus,
  };
};

export async function execute(): Promise<ResponseItem[]> {
  const apiResponse: APIResponse = await call3partyAPI();
  const clientsData: Client[] = await dbQuery();

  if (!apiResponse || !clientsData) {
    return [];
  }

  const allEvents = apiResponse.data.flatMap((client) => client.info.events);
  const allTransports = clientsData.flatMap((client) => client.transports);

  return allEvents
    .map((event) => {
      const matchingTransport = allTransports.find(
        (transport) => transport.extRef === event.transportRef
      );
      return matchingTransport
        ? mapEventToResponse(event, matchingTransport)
        : null;
    })
    .filter((item): item is ResponseItem => item !== null);
}

execute().then(console.log);
