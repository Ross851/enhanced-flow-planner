# ⚙️ Power Automate Ultimate Cost & License Planner v2.0

The industry-leading web-based calculator for Power Automate cost estimation, performance analysis, and license optimization. Now with URL parameters, 2024 licensing updates, and PowerDocu integration!

![Power Automate Planner](https://img.shields.io/badge/Power%20Automate-Ultimate%20Planner%20v2.0-blue?style=for-the-badge&logo=microsoft)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![New](https://img.shields.io/badge/NEW-URL%20Parameters-red?style=for-the-badge)

## 🎯 What This Tool Does

This calculator analyzes your Power Automate flow configuration and provides:

- 💰 **Cost estimates** for different licensing options
- ⚠️ **Performance risk assessment** (throttling, timeouts, errors)
- 🎯 **License recommendations** based on your usage patterns
- 📋 **Best practices guidance** for Power Automate development
- 📊 **PPR (Power Platform Request) consumption analysis**
- 🔄 **Retry and error handling impact calculations**

## 🆕 What's New in v2.0

### 🔗 URL Parameters Support
- Prepopulate fields via URL for easy sharing
- Base64 encoded full configuration support
- Create bookmarkable scenarios
- Perfect for integration with documentation

### 📊 2024 Licensing Updates
- Power Automate Process: £81.90/flow (250k PPR/day)
- Power Automate Hosted Process: £118.60/flow
- Process license stacking for additional PPR
- Flow association (up to 25 child flows per Process)
- **⚠️ April 1, 2025 Premium Connector Enforcement Warning**

### 📄 PowerDocu Integration
- Dedicated tab for PowerDocu workflow
- Extract metrics from documented flows
- Map PowerDocu output to cost calculations
- Future automated import capabilities

### 🛡️ Governance Risk Calculator
- Based on real Kaplan case study (2,490 flows, ZERO governance)
- GDPR/compliance risk assessment
- Potential fine calculations
- Implementation roadmap

## 🚀 Features

### 📈 Advanced Analytics
- Real-time performance risk assessment
- Throttling detection and mitigation suggestions
- Runtime estimation with timeout warnings
- Retry overhead calculations
- PPR stacking calculations

### 💡 Smart Recommendations
- Automatic license option comparison
- Cost optimization with 2024 pricing
- Flow pattern best practices from real implementations
- Connector-specific guidance
- Enforcement deadline alerts

### 🛠️ Configuration Options
- Multiple flow patterns (Apply to Each, Parallel Branches, Child Flows)
- Retry and error handling settings
- Data operation overhead calculations
- Network latency considerations
- Governance level assessment

### 💾 Enhanced Management
- Import/Export JSON configurations
- Copy shareable URLs with parameters
- Quick start templates including Kaplan scenario
- Auto-save to localStorage
- Multiple comparison tabs

## 📋 How to Use

### 1. Your Current Setup
```
👤 User Type: Internal IT | External Consultant | Microsoft Partner
👥 Users: Number of people who will use this flow
🏢 Current Licenses: Existing Premium User and Process licenses
```

### 2. Quick Start Templates
Choose from pre-configured scenarios:

| Template | Items | Use Case |
|----------|-------|----------|
| **Small Automation** | 500 items | Simple daily tasks |
| **Daily Processing** | 5K items | Regular data processing |
| **Enterprise Sync** | 25K items | Large-scale integrations |
| **Data Migration** | 100K items | Bulk data operations |

### 3. Flow Configuration

#### Basic Settings
- **📊 Items to Process**: Total records per run
- **⚡ Actions per Item**: Average actions needed per record  
- **⏱️ Avg Time per Action**: Execution time in milliseconds
- **🔄 Concurrency Level**: Parallel processing (1-50)
- **🔌 Primary Connector**: Main service connection
- **🗓️ Runs per Day**: Execution frequency

#### Advanced Settings
- **🔁 Retry Configuration**: Attempts and intervals
- **⏰ Timeout Settings**: Maximum runtime limits
- **🚦 Throttling Handling**: Rate limit management
- **📈 Error Rate**: Expected failure percentage
- **🔧 Flow Pattern**: Architecture type
- **📊 Data Operations**: Processing complexity

## 📊 Understanding Results

### Risk Assessment Levels

| Risk Level | Indicator | Description |
|------------|-----------|-------------|
| 🟢 **Low** | ✅ | Configuration optimized |
| 🟡 **Medium** | ⚠️ | Monitor for issues |
| 🔴 **High** | 🚨 | Critical fixes needed |

### Key Metrics Explained

- **📈 Total Actions per Run**: Complete action count including retries
- **📅 Actions per Month**: Monthly PPR consumption
- **⏱️ Runtime per Run**: Estimated execution time
- **🌐 RPM (Requests per Minute)**: API call rate vs limits

## 💰 License Options (2024 UK Pricing)

| License Type | Cost | PPR Limit | Best For |
|--------------|------|-----------|----------|
| **Power Automate Free** | £0/month | 2K PPR/day | Basic automations |
| **Power Automate Premium** | £12.20/user/month | 40K PPR/day | Individual users |
| **Power Automate Process** | £81.90/flow/month | 250K PPR/day | High-volume flows |
| **Pay-per-use** | £0.0004/PPR | Unlimited | Variable usage |

## 🛡️ Risk Detection

The tool automatically identifies:

### 🚨 Critical Issues
- **Severe Throttling**: RPM exceeds connector limits
- **Timeout Risk**: Runtime exceeds flow timeout
- **High Error Rates**: Excessive failure expectations

### ⚠️ Performance Warnings
- **Nested Apply to Each**: Performance overhead
- **Memory Issues**: Large data operations
- **Connector Limits**: Approaching rate limits

### 💡 Optimization Suggestions
- Concurrency adjustments
- Delay action recommendations
- Flow pattern improvements
- Error handling enhancements

## 🔧 Technical Implementation

### Connector Rate Limits
```javascript
const CONNECTORS = {
  SharePoint: { rpm: 600, premium: false },
  GraphAPI: { rpm: 150, premium: false },
  CustomHTTP: { rpm: 60, premium: true },
  Teams: { rpm: 120, premium: false },
  SQL: { rpm: 300, premium: true }
};
```

### Flow Pattern Multipliers
```javascript
const patternMultipliers = {
  simple: 1.0,           // No overhead
  apply_to_each: 1.1,    // 10% overhead
  nested_apply: 1.4,     // 40% overhead
  parallel_branches: 0.9, // 10% efficiency gain
  child_flows: 1.1       // 10% communication overhead
};
```

## 📈 Best Practices

### Flow Design
1. **Avoid nested Apply to Each loops** for large datasets
2. **Use appropriate concurrency settings** (typically 4-8)
3. **Implement proper error handling** with try-catch scopes
4. **Add delays** when approaching connector limits

### Cost Optimization
1. **Leverage existing licenses** before purchasing new ones
2. **Consider Process licenses** for high-volume scenarios
3. **Monitor PPR consumption** regularly
4. **Optimize data operations** to reduce overhead

### Performance
1. **Batch large datasets** to avoid timeouts
2. **Use server-side filtering** when possible
3. **Implement exponential backoff** for retries
4. **Monitor connector throttling** proactively

## 🚀 Getting Started

### Quick Start
1. **Open** `enhanced-index.html` in any modern browser
2. **Choose** a preset template or enter your flow details
3. **Review** cost analysis and recommendations
4. **Share** via URL or export configuration

### Using URL Parameters
Share specific configurations by adding parameters to the URL:

```
enhanced-index.html?items=5000&actionsPerItem=3&executions=24&scenarioName=Daily%20Sync
```

Or use base64 encoding for complete configurations:
```javascript
const config = { items: 5000, actionsPerItem: 3, /* ... */ };
const url = `enhanced-index.html?config=${btoa(JSON.stringify(config))}`;
```

### PowerDocu Integration
1. Run PowerDocu on your existing flows
2. Note the action counts and connectors
3. Input metrics into the planner
4. Get accurate cost estimates based on actual flow structure

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool provides estimates based on publicly available Microsoft documentation and community best practices. Actual costs and performance may vary. Always validate with official Microsoft pricing and conduct thorough testing before production deployment.

## 📞 Support

- 📧 Create an issue for bug reports
- 💡 Submit feature requests via GitHub issues
- 📚 Check Microsoft's official Power Automate documentation for the latest updates

---

**Made with ❤️ for the Power Platform community**

*Last updated: August 2025 - Version 2.0 with URL Parameters and PowerDocu Integration*
