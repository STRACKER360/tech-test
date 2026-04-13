enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  ServerError = 500,
}

type Event = {
  transportRef: string;
  name: string;
};

type EventInfo = {
  id: number;
  events: Event[];
};

type EventGroup = {
  info: EventInfo;
};

// Success vs Error response modeling
type FetchEventsSuccess = {
  status: HttpStatus.OK;
  data: EventGroup[];
};

type FetchEventsError = {
  status: HttpStatus.BadRequest | HttpStatus.ServerError;
  data?: undefined;
};

type FetchEventsResponse = FetchEventsSuccess | FetchEventsError;

export async function fetchEvents(): Promise<FetchEventsResponse> {
  return {
    status: HttpStatus.OK,
    data: [
      {
        info: {
          id: 1,
          events: [
            { transportRef: "ABC123", name: "Parcel picked up" },
            { transportRef: "GHI789", name: "Carrier in route" },
          ],
        },
      },
      {
        info: {
          id: 2,
          events: [
            { transportRef: "XYZ000", name: "Parcel picked up" },
            { transportRef: "DEF456", name: "Available for collection" },
          ],
        },
      },
      {
        info: {
          id: 3,
          events: [{ transportRef: "JKL567", name: "Customs unavailable" }],
        },
      },
    ],
  };
}
