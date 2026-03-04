

## Fix manager sub-choice heading

The manager-choice sub-step heading should reflect that the user has already identified as a Manager/Owner. Change:

- **Heading**: "What are you up to today?" → "Where are you today?"
- **Subtitle**: "On the tools or in the office — you can switch anytime." → "Office or on the tools — you can switch anytime."

### File: `src/components/ModePicker.tsx`
Lines ~73-74 in the manager-choice sub-step:
- `"What are you up to today?"` → `"Where are you today?"`
- `"On the tools or in the office — you can switch anytime."` → `"Office or on the tools — you can switch anytime."`

