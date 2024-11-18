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
