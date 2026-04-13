type Client = {
  readonly id: string;
  name: string;
};

enum TransportStatus {
  Pending = 1,
  InProgress = 2,
  Delayed = 3,
  Completed = 4,
}

type Transport = {
  readonly id: string;
  extRef: string;
  status: TransportStatus;
};

type ClientTransports = {
  client: Client;
  transports: Transport[];
};

export async function getTransports(): Promise<ClientTransports[]> {
  return [
    {
      client: { id: "1", name: "JPG" },
      transports: [
        {
          id: "28",
          extRef: "ABC123",
          status: TransportStatus.InProgress,
        },
        {
          id: "42",
          extRef: "DEF456",
          status: TransportStatus.Pending,
        },
      ],
    },
  ];
}
