## MODIFIED Requirements

### Requirement: Empty state shown when no session events exist
When session.json is empty or absent, the UI SHALL show a centered empty state with the message "No conversation yet" and a hint to run `npx inhtml init-hooks` to set up hook integration. No input box is displayed.

#### Scenario: Empty session
- **WHEN** session.json is `[]` or absent
- **THEN** empty state is displayed with CLI-focused setup instructions and no input area
