// Comprehensive Power Platform Connector Library with UK English
// Complete information, top tips, and best practices for every connector

const PowerPlatformConnectors = {
    // TRIGGERS - Complete List
    triggers: {
        // Schedule Triggers
        recurrence: {
            name: "Recurrence",
            icon: "⏰",
            category: "Schedule",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Triggers flow on a schedule",
            topTips: [
                "Use the longest interval possible to minimise PPR consumption",
                "Always specify timezone to avoid daylight saving issues",
                "Consider business hours - add conditions to skip weekends/holidays",
                "Offset schedules by a few minutes (e.g., 5 past) to avoid peak loads",
                "Use trigger conditions to prevent unnecessary runs"
            ],
            configuration: {
                frequency: ["Minute", "Hour", "Day", "Week", "Month"],
                interval: "1-500",
                timezone: "Required for consistency",
                startTime: "Optional - defaults to immediate"
            },
            bestPractice: "For reports, run daily at 6:05 AM rather than exactly 6:00 AM to avoid system peaks",
            performanceImpact: "Low - single trigger execution",
            commonMistakes: [
                "Running every minute when hourly would suffice",
                "Not setting timezone causing DST issues",
                "Missing trigger conditions for holidays"
            ]
        },
        
        // SharePoint Triggers
        "sharepoint-item-created": {
            name: "When an item is created",
            icon: "📄",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute total, 300/minute per user",
            description: "Triggers when new SharePoint list item is created",
            topTips: [
                "ALWAYS use trigger conditions to filter at source",
                "Monitor specific folders to reduce trigger frequency",
                "Use 'Get changes' for high-volume lists instead",
                "Consider column indexing for better performance",
                "Avoid triggering on lists with >5000 items without filtering"
            ],
            configuration: {
                siteAddress: "SharePoint site URL",
                listName: "Target list or library",
                folder: "Optional - specific folder path",
                splitOn: "Enable for array handling"
            },
            bestPractice: "Add trigger condition: @equals(triggerBody()?['Status']?['Value'], 'New')",
            performanceImpact: "Medium - depends on list activity",
            commonMistakes: [
                "Not using folder filtering on large libraries",
                "Missing trigger conditions causing excessive runs",
                "Not handling attachments properly"
            ]
        },
        
        "sharepoint-item-modified": {
            name: "When an item is modified",
            icon: "✏️",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute total, 300/minute per user",
            description: "Triggers when SharePoint item is updated",
            topTips: [
                "Use trigger conditions to detect specific field changes",
                "Implement versioning checks to avoid loops",
                "Consider 'Get changes' for better performance",
                "Check if modified by flow to prevent infinite loops",
                "Use column filtering to monitor specific fields only"
            ],
            configuration: {
                siteAddress: "SharePoint site URL",
                listName: "Target list or library",
                includeAttachments: "Increases processing time"
            },
            bestPractice: "Check Modified By to exclude flow's service account: @not(equals(triggerBody()?['Editor']?['Email'], 'flow@company.com'))",
            performanceImpact: "High - triggers on every change",
            commonMistakes: [
                "Creating infinite loops by modifying the same item",
                "Not filtering out system updates",
                "Triggering on all columns instead of specific ones"
            ]
        },
        
        "sharepoint-file-created": {
            name: "When a file is created",
            icon: "📁",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute total",
            description: "Triggers when new file is uploaded",
            topTips: [
                "Monitor specific folders for better performance",
                "Use file properties to filter file types",
                "Consider file size limits for processing",
                "Implement virus scan waiting period",
                "Handle locked files gracefully"
            ],
            configuration: {
                siteAddress: "SharePoint site URL",
                library: "Document library",
                folder: "Specific folder (recommended)",
                inferContentType: "Detect file type automatically"
            },
            bestPractice: "Wait 30 seconds after trigger to ensure virus scan completes",
            performanceImpact: "Medium",
            commonMistakes: [
                "Processing files before virus scan completes",
                "Not handling large files properly",
                "Missing error handling for locked files"
            ]
        },

        // Email Triggers
        "outlook-email-arrives": {
            name: "When a new email arrives",
            icon: "📧",
            category: "Outlook",
            licence: "Standard",
            cost: 0,
            apiLimit: "300 calls/minute",
            description: "Triggers on new email receipt",
            topTips: [
                "Create dedicated folders for automation",
                "Use subject line prefixes for filtering",
                "Consider shared mailbox for team processes",
                "Implement importance level filtering",
                "Mark as read to prevent reprocessing"
            ],
            configuration: {
                mailbox: "My inbox or shared mailbox",
                folder: "Specific folder (recommended)",
                importance: "High/Normal/Low/Any",
                includeAttachments: "Process attachments",
                subjectFilter: "Filter by subject keywords",
                from: "Filter by sender"
            },
            bestPractice: "Use rules to move emails to automation folder, then trigger on that folder",
            performanceImpact: "Low per email",
            commonMistakes: [
                "Monitoring entire inbox instead of specific folder",
                "Not marking emails as processed",
                "Missing attachment size limits"
            ]
        },

        // Teams Triggers
        "teams-message-posted": {
            name: "When a message is posted",
            icon: "💬",
            category: "Teams",
            licence: "Standard",
            cost: 0,
            apiLimit: "1800 calls/minute",
            description: "Triggers on Teams message",
            topTips: [
                "Use dedicated automation channels",
                "Implement keyword filtering",
                "Consider adaptive cards for structured input",
                "Monitor mentions for important messages",
                "Use bot framework for complex scenarios"
            ],
            configuration: {
                team: "Team name",
                channel: "Channel name",
                messageType: "All/Mentions/Keywords"
            },
            bestPractice: "Create automation-specific channels to reduce noise",
            performanceImpact: "High in busy channels",
            commonMistakes: [
                "Monitoring general channel causing overload",
                "Not filtering by keywords or mentions",
                "Missing rate limiting for busy channels"
            ]
        },

        // Forms Triggers
        "forms-response-submitted": {
            name: "When a response is submitted",
            icon: "📝",
            category: "Forms",
            licence: "Standard",
            cost: 0,
            apiLimit: "100 calls/minute",
            description: "Triggers on form submission",
            topTips: [
                "Use branching logic to simplify flow",
                "Validate at form level not flow level",
                "Consider batching for high-volume forms",
                "Handle file uploads carefully",
                "Implement response acknowledgements"
            ],
            configuration: {
                formId: "Select form",
                responseDetails: "Include all responses"
            },
            bestPractice: "Use forms for structured data collection with validation",
            performanceImpact: "Low",
            commonMistakes: [
                "Not handling optional fields",
                "Missing file upload processing",
                "No confirmation to submitter"
            ]
        },

        // Premium Triggers
        "http-request": {
            name: "When HTTP request received",
            icon: "🌐",
            category: "HTTP",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "100 calls/minute",
            description: "Webhook endpoint trigger",
            topTips: [
                "ALWAYS implement authentication",
                "Validate JSON schema",
                "Implement rate limiting",
                "Use HTTPS only",
                "Return proper status codes",
                "Store secrets in Key Vault"
            ],
            configuration: {
                method: "POST/GET/PUT/PATCH/DELETE",
                authentication: "API Key/OAuth/Basic",
                schema: "JSON schema validation",
                relativePath: "Custom URL path"
            },
            bestPractice: "Implement request signing for security",
            performanceImpact: "Very Low",
            commonMistakes: [
                "No authentication on endpoints",
                "Missing schema validation",
                "Not handling malformed requests"
            ]
        },

        "sql-row-inserted": {
            name: "When an item is created (SQL)",
            icon: "🗄️",
            category: "SQL Server",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "300 calls/minute",
            description: "Triggers on SQL row insert",
            topTips: [
                "Use views to filter data at source",
                "Implement proper indexing",
                "Consider polling interval impact",
                "Use stored procedures for complex logic",
                "Monitor connection pool usage"
            ],
            configuration: {
                server: "SQL server name",
                database: "Database name",
                table: "Table or view",
                frequency: "Check interval"
            },
            bestPractice: "Create filtered views rather than triggering on entire tables",
            performanceImpact: "Medium - polling based",
            commonMistakes: [
                "Polling too frequently",
                "Not using views for filtering",
                "Missing connection error handling"
            ]
        },

        "dataverse-row-added": {
            name: "When a row is added",
            icon: "🔷",
            category: "Dataverse",
            licence: "Standard",
            cost: 0,
            apiLimit: "6000 calls/minute",
            description: "Triggers on Dataverse record creation",
            topTips: [
                "Use filtered views for performance",
                "Leverage FetchXML for complex queries",
                "Consider change tracking",
                "Use solution-aware flows",
                "Implement proper security roles"
            ],
            configuration: {
                environment: "Dataverse environment",
                table: "Table name",
                scope: "Organization/User/BusinessUnit",
                filterExpression: "OData filter"
            },
            bestPractice: "Use scope to limit trigger to relevant records",
            performanceImpact: "Low - event based",
            commonMistakes: [
                "Organization scope when user scope sufficient",
                "Not using filter expressions",
                "Missing security role configuration"
            ]
        }
    },

    // ACTIONS - Complete List
    actions: {
        // SharePoint Actions
        "sharepoint-get-items": {
            name: "Get items",
            icon: "📋",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute",
            description: "Retrieve SharePoint list items",
            topTips: [
                "ALWAYS use Filter Query (OData) - 90% performance improvement",
                "Use Select to get only required columns",
                "Implement Top Count to limit results",
                "Use Order By at source, not in flow",
                "Consider pagination for large datasets",
                "Use Get changes for incremental updates"
            ],
            configuration: {
                filterQuery: "Status eq 'Active'",
                top: "Default 100, max 5000",
                select: "Title,Modified,Status",
                orderBy: "Modified desc",
                expand: "Lookup fields"
            },
            bestPractice: "Filter Query + Select columns = massive performance gain",
            performanceImpact: "High if unfiltered",
            commonMistakes: [
                "Not using Filter Query",
                "Retrieving all columns",
                "Apply to each on large datasets"
            ]
        },

        "sharepoint-create-item": {
            name: "Create item",
            icon: "➕",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute",
            description: "Create new SharePoint list item",
            topTips: [
                "Batch create for multiple items",
                "Use content types properly",
                "Handle lookup fields carefully",
                "Consider permissions inheritance",
                "Validate required fields first"
            ],
            configuration: {
                siteAddress: "SharePoint site",
                listName: "Target list",
                itemProperties: "Field mappings"
            },
            bestPractice: "Validate data before creation to avoid partial failures",
            performanceImpact: "Low per item",
            commonMistakes: [
                "Not handling lookup fields",
                "Missing required fields",
                "Creating items in loop instead of batch"
            ]
        },

        "sharepoint-update-item": {
            name: "Update item",
            icon: "✏️",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute",
            description: "Update existing SharePoint item",
            topTips: [
                "Use etag for conflict detection",
                "Update only changed fields",
                "Handle concurrent updates",
                "Consider versioning impact",
                "Batch updates when possible"
            ],
            configuration: {
                id: "Item ID",
                itemProperties: "Fields to update",
                etagMatch: "Conflict detection"
            },
            bestPractice: "Check etag to prevent overwriting concurrent changes",
            performanceImpact: "Low per item",
            commonMistakes: [
                "Overwriting all fields unnecessarily",
                "Not handling update conflicts",
                "Creating loops with modified trigger"
            ]
        },

        "sharepoint-delete-item": {
            name: "Delete item",
            icon: "🗑️",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute",
            description: "Delete SharePoint list item",
            topTips: [
                "Consider soft delete instead",
                "Check dependencies first",
                "Handle recycle bin settings",
                "Log deletions for audit",
                "Batch delete for multiple items"
            ],
            configuration: {
                id: "Item ID",
                etagMatch: "Optional verification"
            },
            bestPractice: "Archive items instead of deleting for audit trail",
            performanceImpact: "Low",
            commonMistakes: [
                "Not checking dependencies",
                "No audit trail",
                "Deleting in loops"
            ]
        },

        "sharepoint-send-http": {
            name: "Send HTTP request to SharePoint",
            icon: "🔗",
            category: "SharePoint",
            licence: "Standard",
            cost: 0,
            apiLimit: "600 calls/minute",
            description: "Custom SharePoint REST API call",
            topTips: [
                "Use for operations not in standard actions",
                "Leverage REST API batching",
                "Handle response pagination",
                "Use $select and $filter",
                "Consider Graph API alternative"
            ],
            configuration: {
                siteAddress: "SharePoint site",
                method: "GET/POST/PATCH/DELETE",
                uri: "_api/web/lists/...",
                headers: "Accept: application/json",
                body: "JSON payload"
            },
            bestPractice: "Use $batch endpoint for multiple operations",
            performanceImpact: "Varies",
            commonMistakes: [
                "Not handling pagination",
                "Missing proper headers",
                "Incorrect URI formatting"
            ]
        },

        // SQL Actions (Premium)
        "sql-get-rows": {
            name: "Get rows",
            icon: "🗄️",
            category: "SQL Server",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "300 calls/minute",
            description: "Query SQL database",
            topTips: [
                "Use views for complex queries",
                "Implement proper indexing",
                "Limit rows with TOP",
                "Use stored procedures for logic",
                "Handle NULL values properly",
                "Consider connection pooling"
            ],
            configuration: {
                server: "SQL server",
                database: "Database name",
                table: "Table or view",
                filter: "WHERE clause",
                orderBy: "ORDER BY clause",
                top: "Row limit"
            },
            bestPractice: "Create indexed views for frequently accessed data",
            performanceImpact: "High if unoptimised",
            commonMistakes: [
                "SELECT * instead of specific columns",
                "Missing WHERE clause",
                "Not using indexes"
            ]
        },

        "sql-insert-row": {
            name: "Insert row",
            icon: "➕",
            category: "SQL Server",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "300 calls/minute",
            description: "Insert into SQL table",
            topTips: [
                "Use bulk insert for multiple rows",
                "Handle identity columns",
                "Validate constraints first",
                "Consider transaction scope",
                "Handle duplicate key errors"
            ],
            configuration: {
                table: "Target table",
                values: "Column values"
            },
            bestPractice: "Use stored procedures for complex inserts",
            performanceImpact: "Low per row",
            commonMistakes: [
                "Not handling duplicates",
                "Missing required fields",
                "Inserting in loops"
            ]
        },

        "sql-execute-procedure": {
            name: "Execute stored procedure",
            icon: "⚙️",
            category: "SQL Server",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "300 calls/minute",
            description: "Run SQL stored procedure",
            topTips: [
                "Use for complex business logic",
                "Handle output parameters",
                "Consider timeout settings",
                "Implement error handling",
                "Return structured results"
            ],
            configuration: {
                procedure: "Procedure name",
                parameters: "Input parameters"
            },
            bestPractice: "Move complex logic to procedures for better performance",
            performanceImpact: "Depends on procedure",
            commonMistakes: [
                "Not handling timeouts",
                "Missing error handling",
                "Ignoring return values"
            ]
        },

        // Teams Actions
        "teams-post-message": {
            name: "Post message",
            icon: "💬",
            category: "Teams",
            licence: "Standard",
            cost: 0,
            apiLimit: "1800 calls/minute",
            description: "Send Teams message",
            topTips: [
                "Use adaptive cards for rich content",
                "Mention users with @mentions",
                "Post as Flow bot or user",
                "Include actionable buttons",
                "Format with markdown"
            ],
            configuration: {
                team: "Team name",
                channel: "Channel name",
                message: "Message content",
                asUser: "Post as user or bot"
            },
            bestPractice: "Use adaptive cards for structured information",
            performanceImpact: "Low",
            commonMistakes: [
                "Not handling special characters",
                "Missing team permissions",
                "Posting to wrong channel"
            ]
        },

        "teams-post-adaptive-card": {
            name: "Post adaptive card",
            icon: "🎴",
            category: "Teams",
            licence: "Standard",
            cost: 0,
            apiLimit: "1800 calls/minute",
            description: "Send rich adaptive card",
            topTips: [
                "Use Card Designer to build",
                "Include action buttons",
                "Handle card responses",
                "Keep cards responsive",
                "Test on mobile devices"
            ],
            configuration: {
                team: "Team name",
                channel: "Channel name",
                card: "Adaptive card JSON"
            },
            bestPractice: "Design cards that work on all devices",
            performanceImpact: "Low",
            commonMistakes: [
                "Complex cards that don't render",
                "Missing action handlers",
                "Not testing on mobile"
            ]
        },

        // Email Actions
        "outlook-send-email": {
            name: "Send an email",
            icon: "✉️",
            category: "Outlook",
            licence: "Standard",
            cost: 0,
            apiLimit: "300 calls/minute",
            description: "Send email via Outlook",
            topTips: [
                "Use HTML for formatting",
                "Handle attachments properly",
                "Set importance levels",
                "Use shared mailbox for automation",
                "Include unsubscribe options",
                "Track delivery status"
            ],
            configuration: {
                to: "Recipients",
                subject: "Email subject",
                body: "HTML or plain text",
                from: "Sender (shared mailbox)",
                cc: "CC recipients",
                bcc: "BCC recipients",
                importance: "High/Normal/Low",
                attachments: "File attachments"
            },
            bestPractice: "Use shared mailbox to avoid personal email limits",
            performanceImpact: "Low",
            commonMistakes: [
                "Sending from personal account",
                "Not handling bounces",
                "Missing unsubscribe option"
            ]
        },

        // HTTP Actions (Premium)
        "http-request": {
            name: "HTTP",
            icon: "🌐",
            category: "HTTP",
            licence: "Premium",
            cost: 12.20,
            apiLimit: "100 calls/minute",
            description: "Make HTTP request",
            topTips: [
                "Handle timeouts properly",
                "Implement retry logic",
                "Use authentication headers",
                "Parse response correctly",
                "Handle status codes",
                "Log for debugging"
            ],
            configuration: {
                method: "GET/POST/PUT/PATCH/DELETE",
                uri: "Endpoint URL",
                headers: "Request headers",
                body: "Request body",
                authentication: "Type of auth"
            },
            bestPractice: "Implement exponential backoff for retries",
            performanceImpact: "Depends on endpoint",
            commonMistakes: [
                "No timeout handling",
                "Missing error handling",
                "Not checking status codes"
            ]
        },

        // Dataverse Actions
        "dataverse-list-rows": {
            name: "List rows",
            icon: "🔷",
            category: "Dataverse",
            licence: "Standard",
            cost: 0,
            apiLimit: "6000 calls/minute",
            description: "Query Dataverse table",
            topTips: [
                "Use FetchXML for complex queries",
                "Implement pagination",
                "Select specific columns",
                "Use filtered views",
                "Consider security trimming",
                "Leverage relationships"
            ],
            configuration: {
                tableName: "Table name",
                select: "Column names",
                filter: "OData filter",
                orderBy: "Sort order",
                expand: "Related records",
                fetchXml: "Complex queries"
            },
            bestPractice: "Use FetchXML for queries with multiple joins",
            performanceImpact: "Low with proper filtering",
            commonMistakes: [
                "Not using column selection",
                "Missing pagination",
                "Ignoring security model"
            ]
        },

        "dataverse-add-row": {
            name: "Add a new row",
            icon: "➕",
            category: "Dataverse",
            licence: "Standard",
            cost: 0,
            apiLimit: "6000 calls/minute",
            description: "Create Dataverse record",
            topTips: [
                "Handle duplicate detection",
                "Set owner properly",
                "Use alternate keys",
                "Consider business rules",
                "Handle plugins/workflows"
            ],
            configuration: {
                tableName: "Table name",
                item: "Record data"
            },
            bestPractice: "Use upsert for create or update scenarios",
            performanceImpact: "Low",
            commonMistakes: [
                "Not handling duplicates",
                "Missing required fields",
                "Ignoring business rules"
            ]
        },

        // OneDrive Actions
        "onedrive-create-file": {
            name: "Create file",
            icon: "☁️",
            category: "OneDrive",
            licence: "Standard",
            cost: 0,
            apiLimit: "2000 calls/minute",
            description: "Create file in OneDrive",
            topTips: [
                "Handle file conflicts",
                "Set proper permissions",
                "Consider file size limits",
                "Use folders for organisation",
                "Implement naming conventions"
            ],
            configuration: {
                folderPath: "Destination folder",
                fileName: "File name",
                fileContent: "File data"
            },
            bestPractice: "Check if file exists before creating",
            performanceImpact: "Low for small files",
            commonMistakes: [
                "Not handling duplicates",
                "Large file timeouts",
                "Invalid characters in names"
            ]
        },

        // Excel Actions
        "excel-add-row": {
            name: "Add a row into a table",
            icon: "📊",
            category: "Excel",
            licence: "Standard",
            cost: 0,
            apiLimit: "500 calls/minute",
            description: "Add row to Excel table",
            topTips: [
                "Ensure table is formatted",
                "Handle data types properly",
                "Consider file locking",
                "Batch operations when possible",
                "Close file connections"
            ],
            configuration: {
                location: "OneDrive/SharePoint",
                document: "Excel file",
                table: "Table name",
                row: "Row data"
            },
            bestPractice: "Format as table in Excel before automation",
            performanceImpact: "Medium",
            commonMistakes: [
                "File not formatted as table",
                "File locked by user",
                "Data type mismatches"
            ]
        },

        // Approval Actions
        "approval-start": {
            name: "Start and wait for approval",
            icon: "✅",
            category: "Approvals",
            licence: "Standard",
            cost: 0,
            apiLimit: "500 calls/minute",
            description: "Create approval request",
            topTips: [
                "Set appropriate timeout",
                "Include all context in request",
                "Handle multiple approvers",
                "Configure delegation",
                "Send reminders"
            ],
            configuration: {
                approvalType: "Approve/Reject or Custom",
                title: "Approval title",
                assignedTo: "Approvers",
                details: "Request details",
                itemLink: "Link to item"
            },
            bestPractice: "Include all necessary information to avoid back-and-forth",
            performanceImpact: "N/A - waits for human",
            commonMistakes: [
                "No timeout handling",
                "Missing context",
                "Not handling delegation"
            ]
        },

        // Control Actions
        "control-condition": {
            name: "Condition",
            icon: "❓",
            category: "Control",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "If/then/else logic",
            topTips: [
                "Use AND/OR groups properly",
                "Handle null values",
                "Consider switch for multiple conditions",
                "Nest conditions carefully",
                "Use expressions for complex logic"
            ],
            configuration: {
                condition: "Logic expression",
                yes: "True branch",
                no: "False branch"
            },
            bestPractice: "Use Switch action for more than 3 conditions",
            performanceImpact: "None",
            commonMistakes: [
                "Not handling null values",
                "Complex nested conditions",
                "Using condition instead of switch"
            ]
        },

        "control-apply-each": {
            name: "Apply to each",
            icon: "🔁",
            category: "Control",
            licence: "Standard",
            cost: 0,
            apiLimit: "MULTIPLIES ALL INNER API CALLS!",
            description: "Loop through array - MASSIVE API IMPACT",
            criticalWarning: "⚠️ EACH ITERATION = SEPARATE API CALLS FOR EVERY ACTION INSIDE!",
            topTips: [
                "🚨 CRITICAL: 100 items × 3 actions = 300 API calls!",
                "🚨 NESTED LOOPS = EXPONENTIAL: 100 × 50 = 5,000 calls!",
                "ALWAYS filter at source - reduce items BEFORE loop",
                "Use Select to simplify data before looping",
                "Enable concurrency (20-50) but watch throttling",
                "Consider batch operations instead of loops",
                "NEVER nest Apply to each inside Apply to each!"
            ],
            configuration: {
                select: "Array to process",
                concurrency: "1-50 parallel (affects API rate!)",
                threshold: "Max 100,000 iterations"
            },
            bestPractice: "FILTER AT SOURCE! 100 filtered items vs 5000 unfiltered = 98% reduction",
            performanceImpact: "EXTREME - multiplies every action inside",
            commonMistakes: [
                "Not filtering before loop (90% impact)",
                "Nested Apply to each (exponential disaster)",
                "No concurrency (10x slower)",
                "Individual updates instead of batch"
            ],
            impactCalculation: {
                formula: "Items × Actions Inside × Daily Runs × 30 = Monthly API Calls",
                example: "1000 items × 5 actions × 10 runs × 30 = 1,500,000 API calls/month!",
                warning: "This WILL hit throttling limits and cause failures!"
            },
            alternatives: [
                "Filter array - no API calls, just memory",
                "Select action - transform without looping",
                "Batch operations - single API call",
                "Stored procedures - process on server",
                "Power BI dataflows - for large datasets"
            ]
        },

        "control-scope": {
            name: "Scope",
            icon: "📦",
            category: "Control",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Group actions together",
            topTips: [
                "Use for error handling",
                "Configure run after settings",
                "Group related actions",
                "Handle failures gracefully",
                "Create try-catch patterns"
            ],
            configuration: {
                actions: "Grouped actions",
                runAfter: "Success/Failure/Skipped/TimedOut"
            },
            bestPractice: "Create try-catch-finally pattern with scopes",
            performanceImpact: "None",
            commonMistakes: [
                "Not configuring run after",
                "Missing error handling",
                "Scope too large"
            ]
        },

        // Variable Actions
        "variable-initialize": {
            name: "Initialize variable",
            icon: "📌",
            category: "Variable",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Create new variable",
            topTips: [
                "Initialize at flow start",
                "Use meaningful names",
                "Set appropriate type",
                "Consider compose for constants",
                "Avoid too many variables"
            ],
            configuration: {
                name: "Variable name",
                type: "String/Integer/Float/Boolean/Array/Object",
                value: "Initial value"
            },
            bestPractice: "Use compose for values that don't change",
            performanceImpact: "None",
            commonMistakes: [
                "Initializing inside loops",
                "Wrong data type",
                "Too many variables"
            ]
        },

        // Data Operations
        "data-compose": {
            name: "Compose",
            icon: "🔧",
            category: "Data Operations",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Transform data",
            topTips: [
                "Use for data transformation",
                "Create reusable outputs",
                "Build complex objects",
                "Avoid variables when possible",
                "Name outputs clearly"
            ],
            configuration: {
                inputs: "Any data or expression"
            },
            bestPractice: "Use instead of variables for values that don't change",
            performanceImpact: "None",
            commonMistakes: [
                "Not naming outputs",
                "Using variables instead",
                "Complex nested expressions"
            ]
        },

        "data-select": {
            name: "Select",
            icon: "🎯",
            category: "Data Operations",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Map array properties",
            topTips: [
                "Use before Apply to each",
                "Map to simpler structure",
                "Rename properties",
                "Calculate new values",
                "Filter columns"
            ],
            configuration: {
                from: "Source array",
                map: "Property mappings"
            },
            bestPractice: "Always use Select before Apply to each for performance",
            performanceImpact: "None - improves performance",
            commonMistakes: [
                "Not using before loops",
                "Complex expressions",
                "Not simplifying structure"
            ]
        },

        "data-filter": {
            name: "Filter array",
            icon: "🔍",
            category: "Data Operations",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Filter array items",
            topTips: [
                "Filter at source when possible",
                "Use advanced mode for complex filters",
                "Combine multiple conditions",
                "Handle empty results",
                "Consider performance impact"
            ],
            configuration: {
                from: "Source array",
                where: "Filter condition"
            },
            bestPractice: "Filter at data source (OData) rather than in flow",
            performanceImpact: "Low",
            commonMistakes: [
                "Filtering after retrieval",
                "Not handling empty arrays",
                "Complex nested conditions"
            ]
        },

        "data-parse-json": {
            name: "Parse JSON",
            icon: "{ }",
            category: "Data Operations",
            licence: "Standard",
            cost: 0,
            apiLimit: "N/A",
            description: "Parse JSON string",
            topTips: [
                "Generate schema from sample",
                "Handle optional properties",
                "Validate JSON first",
                "Use for API responses",
                "Type checking"
            ],
            configuration: {
                content: "JSON string",
                schema: "JSON schema"
            },
            bestPractice: "Always use sample payload to generate schema",
            performanceImpact: "None",
            commonMistakes: [
                "Wrong schema",
                "Not handling nulls",
                "Missing optional properties"
            ]
        },

        // AI Actions (Premium)
        "ai-builder-extract": {
            name: "Extract information from documents",
            icon: "🤖",
            category: "AI Builder",
            licence: "Premium",
            cost: "AI Builder credits",
            apiLimit: "Depends on credits",
            description: "Extract data using AI",
            topTips: [
                "Train model with samples",
                "Handle confidence scores",
                "Validate extracted data",
                "Consider accuracy vs speed",
                "Monitor credit usage"
            ],
            configuration: {
                document: "Input document",
                model: "AI model"
            },
            bestPractice: "Always validate AI output before using",
            performanceImpact: "High - AI processing",
            commonMistakes: [
                "Not checking confidence",
                "No validation logic",
                "Ignoring credit costs"
            ]
        },

        "gpt-text": {
            name: "Create text with GPT",
            icon: "🧠",
            category: "AI",
            licence: "Premium",
            cost: "1 credit per 1K tokens",
            apiLimit: "Depends on credits",
            description: "Generate text using GPT",
            topTips: [
                "Optimise prompts for tokens",
                "Set temperature appropriately",
                "Handle rate limits",
                "Validate outputs",
                "Monitor token usage"
            ],
            configuration: {
                prompt: "Text prompt",
                temperature: "0-1 creativity",
                maxTokens: "Response limit"
            },
            bestPractice: "Use specific prompts to minimise token usage",
            performanceImpact: "High - API call",
            commonMistakes: [
                "Vague prompts wasting tokens",
                "No output validation",
                "Not handling API errors"
            ]
        }
    },

    // Licensing Information
    licensing: {
        standard: {
            name: "Standard (CD)",
            cost: 0,
            includedIn: "Office 365 E3/E5",
            connectors: ["SharePoint", "Outlook", "Teams", "OneDrive", "Forms", "Planner"],
            limits: {
                flowRuns: "Unlimited with Office 365",
                apiCalls: "Per connector limits apply"
            }
        },
        premium: {
            name: "Premium Per User",
            cost: 12.20,
            currency: "GBP",
            billing: "Per user/month",
            connectors: ["SQL", "HTTP", "Custom Connectors", "On-premises"],
            limits: {
                flowRuns: "Unlimited",
                apiCalls: "Higher limits"
            },
            breakeven: "7 users vs per-flow"
        },
        process: {
            name: "Process (Per Flow)",
            cost: 81.90,
            currency: "GBP",
            billing: "Per flow/month",
            bestFor: "Service accounts, >7 users, critical flows",
            limits: {
                flowRuns: "250,000/month",
                users: "Unlimited users can trigger"
            }
        },
        hosted: {
            name: "Hosted RPA",
            cost: 118.60,
            currency: "GBP",
            billing: "Per bot/month",
            includes: "Attended/Unattended RPA",
            limits: {
                flowRuns: "Unlimited",
                concurrent: "1 bot instance"
            }
        }
    },

    // API Limits by Connector
    apiLimits: {
        sharepoint: {
            total: 600,
            perUser: 300,
            window: "per minute",
            throttling: "429 Too Many Requests",
            retry: "Retry-After header"
        },
        sql: {
            total: 300,
            perUser: 100,
            window: "per minute",
            throttling: "Connection pool limits"
        },
        dataverse: {
            total: 6000,
            perUser: 500,
            window: "per minute",
            throttling: "Service protection"
        },
        teams: {
            total: 1800,
            perUser: 300,
            window: "per minute",
            throttling: "Per app per tenant"
        },
        outlook: {
            total: 300,
            perUser: 150,
            window: "per minute",
            throttling: "Mailbox throttling"
        }
    },

    // Best Practices Summary
    bestPractices: {
        performance: [
            "Always filter at source using OData/SQL WHERE",
            "Use Select before Apply to each",
            "Enable concurrency control (max 50)",
            "Cache frequently accessed data",
            "Use indexed columns for filtering"
        ],
        reliability: [
            "Implement proper error handling with Scope",
            "Add retry logic for transient failures",
            "Use timeout settings appropriately",
            "Handle null values explicitly",
            "Log failures for debugging"
        ],
        cost: [
            "Use Standard connectors when possible",
            "Consider per-flow for >7 users",
            "Monitor AI token usage",
            "Batch operations to reduce API calls",
            "Archive old flow runs"
        ],
        security: [
            "Use service accounts for automation",
            "Store secrets in Azure Key Vault",
            "Implement proper authentication",
            "Follow least privilege principle",
            "Audit flow permissions regularly"
        ],
        maintenance: [
            "Use meaningful names for actions",
            "Add comments for complex logic",
            "Version control flow definitions",
            "Document dependencies",
            "Test thoroughly before production"
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerPlatformConnectors;
}