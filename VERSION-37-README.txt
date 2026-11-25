Garnish Farms V37 - Unified Header & Contextual Strain Navigation

- Replaced page-specific headers with one identical shared header across dashboard, lists, strain, harvest, yield, activities, settings, new batch/culture, upcoming and batch detail pages.
- Added Batches as a persistent header card alongside Jars, Bags and Fruiting.
- Header cards highlight the current page/list.
- Strain chips remain in the shared header. On list.html they preserve the current list type and apply a strain query filter; on strain dashboard they switch the selected strain.
- Removed the duplicate in-page strain filter UI from the list page; URL strain parameter initializes its existing data filter.
- Retained V36 production logic, schema migration and assets.

Note: Supabase live behavior and mobile Safari rendering still require testing against the user's project.
