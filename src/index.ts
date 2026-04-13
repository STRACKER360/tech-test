import { fetchEvents } from "./api/event";
import { getTransports } from "./api/database";

type TransportClientDetails = {
  ref: string;
  eventName: string;
  readableStatus: TransportStatus;
};

enum TransportStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Delayed = "delayed",
  Completed = "completed",
}

// Map API numeric status → enum
const statusMap: Record<number, TransportStatus> = {
  1: TransportStatus.Pending,
  2: TransportStatus.InProgress,
  3: TransportStatus.Delayed,
  4: TransportStatus.Completed,
};

async function getTransportClientDetails(): Promise<TransportClientDetails[]> {
  const transportEvents = await fetchEvents();
  const transportsResponse = await getTransports();

  if (
    !transportEvents ||
    !transportsResponse?.[0]?.transports ||
    !transportEvents.data
  ) {
    return [];
  }

  // Create lookup map for fast access
  const transportMap = new Map(
    transportsResponse[0].transports.map((t) => [t.extRef, t]),
  );

  return transportEvents.data?.flatMap(
    (eventGroup) =>
      eventGroup.info.events
        .map((event) => {
          const transport = transportMap.get(event.transportRef);
          if (!transport) return null;

          return {
            ref: transport.extRef,
            eventName: event.name,
            readableStatus:
              statusMap[transport.status] ?? TransportStatus.Pending,
          };
        })
        .filter(Boolean) as TransportClientDetails[],
  );
}

getTransportClientDetails().then(console.log);
