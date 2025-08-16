# Enhanced Flow Planner - Test Examples

## URL Parameter Examples

The enhanced planner now supports URL parameters for easy sharing and prepopulation of fields. This is perfect for:
- Sharing specific scenarios with your team
- Creating bookmarks for common configurations
- Integration with documentation systems
- Embedding in PowerDocu reports

## Example URLs

### 1. Simple Daily Report Flow
```
enhanced-index.html?items=1000&actionsPerItem=3&executions=1&scenarioName=Daily%20Report
```

### 2. Large Data Migration
```
enhanced-index.html?items=100000&actionsPerItem=5&concurrency=8&errorRate=10&scenarioName=Data%20Migration
```

### 3. Kaplan-Style Governance Assessment
```
enhanced-index.html?items=2490&actionsPerItem=5&executions=10&premiumConnectors=3&scenarioName=Governance%20Assessment
```

### 4. Complete Configuration (Base64 Encoded)
```javascript
// Generate a complete configuration URL
const config = {
  scenarioName: "Enterprise Integration",
  items: 25000,
  actionsPerItem: 4,
  avgMs: 800,
  concurrency: 6,
  connector: "SharePoint",
  executions: 24,
  errorRate: 5,
  premiumConnectors: 2,
  flowPattern: "child_flows",
  dataOperations: "multiple",
  governanceLevel: "standard"
};

const encoded = btoa(JSON.stringify(config));
const url = `enhanced-index.html?config=${encoded}`;
```

## Key Features Added

### 1. **URL Parameters Support**
- All form fields can be prepopulated via URL
- Share exact configurations with team members
- Create bookmarkable scenarios

### 2. **Updated Licensing (2024)**
- Power Automate Process: £81.90/flow (250k PPR/day)
- Power Automate Hosted Process: £118.60/flow (includes hosted machine)
- Process license stacking for additional PPR
- Flow association (up to 25 child flows per Process license)
- April 1, 2025 premium connector enforcement warning

### 3. **Best Practices Integration**
- Performance optimization tips from your vault
- Cost optimization strategies
- Governance recommendations based on Kaplan case
- Error handling patterns

### 4. **PowerDocu Integration Tab**
- Guidance on using PowerDocu for documentation
- How to extract metrics from PowerDocu for cost analysis
- Future integration possibilities

### 5. **Governance Risk Calculator**
- Based on real Kaplan assessment (2,490 flows, ZERO governance)
- Shows potential GDPR/compliance risks
- Calculates potential fines and costs
- Implementation roadmap

### 6. **Enhanced Calculations**
- PPR stacking for multiple Process licenses
- Flow association cost benefits
- Hosted vs on-premises RPA comparison
- M365 license utilization

### 7. **Import/Export**
- Export configurations as JSON
- Import saved configurations
- Copy shareable URLs
- Auto-save to localStorage

## Testing Checklist

- [ ] Test URL parameter loading for individual fields
- [ ] Test base64 encoded full configuration
- [ ] Verify all preset scenarios work
- [ ] Test export/import JSON functionality
- [ ] Verify copy URL to clipboard
- [ ] Test tab switching functionality
- [ ] Verify risk calculations
- [ ] Test license recommendations
- [ ] Check responsive design on mobile
- [ ] Validate input field constraints

## PowerDocu Integration Workflow

1. **Run PowerDocu** on your existing flows
2. **Extract metrics**:
   - Number of actions
   - Connectors used
   - Flow complexity
   - Dependencies
3. **Input into planner** using URL parameters
4. **Get cost analysis** based on actual flow structure
5. **Optimize** using recommendations

## Example PowerDocu to Planner Mapping

PowerDocu Output → Planner Input:
- Total Actions → actionsPerItem
- Connectors List → premiumConnectors count
- Loop Detection → flowPattern
- Error Handlers → errorRate estimate
- Parallel Branches → concurrency

## Next Steps

1. Test all URL parameter combinations
2. Validate calculations against known scenarios
3. Cross-reference with Microsoft pricing documentation
4. Test PowerDocu integration workflow
5. Document any edge cases found