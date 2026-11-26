Garnish Farms Dashboard - Version 49

Change from V48:
- Clicking a production/container ID now opens the main dashboard production pipeline, not the batch Manage page.
- The dashboard resolves the selected batch's current strain and stage, expands that stage/strain card, scrolls to the matching production row, and briefly highlights it.
- Updated ID links in the individual container list, grouped All Batches list, strain pages, and 90-day forecast to use this focused production-card navigation.
- Manage buttons remain available separately for editing batch records.

Implementation notes:
- Focus navigation uses the parent batch database ID so grouped container IDs lead to their shared live production card.
- The selected record is located in the stage it is currently assigned to in the dashboard's batch data.
