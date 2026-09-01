# Add Deactivated Date Column to Commission List Table

## Goal
Add a new "Deactivated Date" column to the CommissionListTable component that displays the `deactivated_date` field from the API response.

## Tasks

1. **Update Commission Type** (`src/@types/commission.ts`)
   - Add `deactivated_date?: string` field to the `Commission` interface

2. **Add Column to CommissionListTable** (`src/views/commission/CommissionList/components/CommissionListTable.tsx`)
   - Add new column definition for "Deactivated Date" in the columns array
   - Format date using dayjs similar to Created/Updated columns
   - Display '—' when date is not available

## Column Details
- **Header**: "Deactivated Date"
- **ID**: "deactivatedAt" (or similar)
- **Data source**: `props.row.original.deactivated_date` (or `deactivatedAt`)
- **Format**: DD/MM/YYYY (consistent with Created/Updated columns)
- **Fallback**: '—' when empty

## Implementation Notes
- Follow existing pattern for date columns (Created, Updated)
- Use dayjs for formatting
- Handle both camelCase and snake_case property names