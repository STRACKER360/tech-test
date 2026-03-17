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

enum ReadableStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DELAYED = "delayed",
  COMPLETED = "completed",
}

type Client_Event = { transportRef: string; name: string };

type Response = {
  ref: string;
  eventName: string;
  readableStatus: ReadableStatus;
};

// Je n'y ai pas pensé hier mais il vaut mieux que le status par défaut soit "pending"
function getReadableStatus(status: number): ReadableStatus {
  if (status === 2) return ReadableStatus.IN_PROGRESS;
  else if (status === 3) return ReadableStatus.DELAYED;
  else if (status === 4) return ReadableStatus.COMPLETED;
  else return ReadableStatus.PENDING;
}

async function execute(): Promise<Response[]> {
  const client_response = await call3partyAPI();

  // Je ne me suis pas attardé sur la gestion d'erreur, je pars du principe que la promesse n'échouera pas.
  if (
    client_response.status < 200 ||
    client_response.status >= 400
  ) {
    throw new Error("Unable to fetch data from 3partyAPI");
  }

  const dbResult = await dbQuery();

  const transports = dbResult[0].transports;

  // Mon parti pris pour simplifier les itérations est de créer un tableau à 1 dimension.
  const client_events: Client_Event[] = client_response.data.flatMap((item) =>
    item.info.events
  );

  const responses: Response[] = client_events.reduce(
    (acc: Response[], event: Client_Event) => {
      const transport = transports.find((transport) =>
        transport.extRef === event.transportRef
      );
      if (!transport) {
        return acc;
      }
      const response = {
        ref: event.transportRef,
        eventName: event.name,
        readableStatus: getReadableStatus(transport.status),
      };
      return [...acc, response];
    },
    [],
  );

  return responses;
}

// console.table pour l'affichage que j'aime bien
execute().then(console.table).catch(console.error);
