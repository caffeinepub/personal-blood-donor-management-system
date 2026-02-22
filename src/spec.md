# Specification

## Summary
**Goal:** Fix donor sorting logic in the Appointed Donors section and add Call Count tracking to the Total Donor List.

**Planned changes:**
- Reverse sorting in Appointed Donors list so donors NOT called recently appear at the TOP (nulls first, then descending lastCalledDate)
- Add secondary sorting by Call Count (ascending) when lastCalledDate values match in Appointed Donors
- Ensure Appointed Donors list refreshes automatically after Call button is clicked
- Add "Calls" column to Total Donor List displaying callCount for each donor
- Sort Total Donor List alphabetically by name (primary) and by blood group (secondary)
- Keep call-based sorting logic exclusive to Appointed Donors section only

**User-visible outcome:** Users will see donors who haven't been called recently at the top of the Appointed Donors list, with automatic refresh after clicking Call. The Total Donor List will display call counts and be sorted alphabetically by name.
