# Instructions
```
Feature: Data Source Join and Mapping

Scenario: Joining and mapping data from third-party API and local DB query in execute()

GIVEN two different data sources, one from a third-party API (call3partyAPI) and one from a local DB query (dbQuery)
AND the call3partyAPI() returns static events data
AND the dbQuery() returns client transport status data from our DB
WHEN the execute() function is called
THEN it should return an array of { ref, eventName, readableStatus }
AND the readableStatus for each event is defined as follows:
    1: pending
    2: in_progress
    3: delayed
    4: completed
```